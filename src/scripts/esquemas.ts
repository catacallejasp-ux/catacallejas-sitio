/**
 * Animated diagrams for «Palabras» articles, in the visual language of the deck
 * «Hablando nuestro trabajo»: dots and thin lines, one neutral grey for
 * structure, teal for links and violet for what matters right now.
 *
 * In Markdown, an article drops in a figure and this script draws into it:
 *
 *   <figure class="esquema" data-esquema="fuego" data-alt="What it shows">
 *     <figcaption>Caption</figcaption>
 *   </figure>
 *
 * Kinds: fuego, sisifo, planta, red. Each one is a pure function of time, so
 * reduced motion simply draws one chosen frame. Colors come from the site's
 * tokens (read through a probe, since they are `light-dark()` values) and are
 * read again whenever the theme changes. A diagram only animates while it is
 * on screen, and its clock starts the first time it is seen.
 */

type Tones = {
	bg: string;
	off: string;
	dim: string;
	text: string;
	ink: string;
	structure: string;
	signal: string;
	font: string;
};

type Frame = {
	c: CanvasRenderingContext2D;
	w: number;
	h: number;
	/** seconds since the diagram was first seen */
	t: number;
	/** one unit = 1% of the drawing's reference width */
	u: number;
	k: Tones;
	still: boolean;
};

type Scene = { draw: (f: Frame) => void; stillAt: number };

const TAU = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const smooth = (k: number) => {
	const x = clamp(k);
	return x * x * (3 - 2 * x);
};
const easeOut = (k: number) => 1 - (1 - clamp(k)) ** 3;

/** Seeded random, so every layout is the same on every visit. */
function rng(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/* ---- drawing helpers --------------------------------------------------- */

function seg(
	c: CanvasRenderingContext2D,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	color: string,
	a = 1,
	lw = 1,
) {
	if (a <= 0.005) return;
	c.globalAlpha = clamp(a);
	c.strokeStyle = color;
	c.lineWidth = lw;
	c.beginPath();
	c.moveTo(x1, y1);
	c.lineTo(x2, y2);
	c.stroke();
}

/* ---- 1. fuego: people around a fire ------------------------------------ */

/* The fire mixes the site's violet with warm tones, in layers: the outer
   tongue is brand violet and it warms toward a light core. Fixed colors (not
   tokens) because they read on both themes. */
const FIRE = {
	outer: '#7b66ff',
	mid: '#f47fae',
	inner: '#ffaf73',
	core: '#ffd98f',
	ground: '#9888ff',
	glow: 'rgb(123 102 255',
	warm: '#ff9a6b',
	light: 'rgb(255 150 160',
	coreRgb: 'rgb(255 217 143',
	innerRgb: 'rgb(255 175 115',
	log: '#a07a6a',
	logDark: '#7d5c52',
};
/* People blend the two brand hues, soft light blue into soft violet. */
const PEOPLE = ['#6fd0dc', '#9888ff'];

/** A flat flame: a drop with a pointed, swaying tip. */
function flame(
	c: CanvasRenderingContext2D,
	x: number,
	base: number,
	wd: number,
	ht: number,
	sway: number,
	color: string | CanvasGradient,
) {
	c.fillStyle = color;
	c.beginPath();
	c.moveTo(x, base);
	c.bezierCurveTo(
		x - wd * 1.05,
		base,
		x - wd * 1.1,
		base - ht * 0.42,
		x - wd * 0.45 + sway * 0.3,
		base - ht * 0.68,
	);
	c.bezierCurveTo(
		x - wd * 0.15 + sway * 0.55,
		base - ht * 0.82,
		x + sway * 0.75,
		base - ht * 0.9,
		x + sway,
		base - ht,
	);
	c.bezierCurveTo(
		x + wd * 0.5 + sway * 0.5,
		base - ht * 0.74,
		x + wd * 1.1,
		base - ht * 0.5,
		x + wd * 1.0,
		base - ht * 0.24,
	);
	c.bezierCurveTo(x + wd * 0.95, base - ht * 0.04, x + wd * 0.55, base, x, base);
	c.fill();
}

/**
 * A person as an abstract shape: a round blob with an irregular, slowly
 * breathing outline (a few low waves around a circle).
 */
function blob(
	c: CanvasRenderingContext2D,
	x: number,
	y: number,
	r: number,
	seed: number,
	t: number,
	fill: string | CanvasGradient,
	tall = 1,
	mode: 'fill' | 'stroke' = 'fill',
) {
	const R = rng(seed);
	// mostly an oval tilt (2) and a soft dent (3); barely any smaller ripple
	const waves = [
		[2, 0.06, 0.05],
		[3, 0.03, 0.04],
		[4, 0.01, 0.015],
	].map(([n, base, extra]) => ({
		n,
		amp: base + R() * extra,
		ph: R() * TAU,
		sp: 0.3 + R() * 0.4,
	}));
	c.fillStyle = fill;
	c.beginPath();
	const steps = 48;
	for (let i = 0; i <= steps; i++) {
		const a = (i / steps) * TAU;
		let k = 1;
		for (const wv of waves) k += wv.amp * Math.sin(wv.n * a + wv.ph + t * wv.sp);
		const px = x + Math.cos(a) * r * k;
		const py = y + Math.sin(a) * r * k * tall;
		if (i === 0) c.moveTo(px, py);
		else c.lineTo(px, py);
	}
	c.closePath();
	if (mode === 'stroke') {
		c.strokeStyle = fill;
		c.stroke();
	} else c.fill();
}

const fuego: Scene = {
	stillAt: 2.6,
	draw(f) {
		const { c, w, h, t, u } = f;
		const cx = w / 2;
		const cy = h * 0.6;
		const rx = Math.min(w * 0.36, h * 0.75);
		const ry = rx * 0.42;
		const N = 6;
		const flick = 0.85 + 0.15 * Math.sin(t * 5.3) * Math.sin(t * 2.1 + 1);

		// Light from the fire: a soft violet halo.
		const halo = Math.min(rx * 0.9, cy - 7 * u - 2);
		const glow = c.createRadialGradient(cx, cy - 7 * u, 0, cx, cy - 7 * u, halo);
		glow.addColorStop(0, `${FIRE.glow} / ${0.16 * flick})`);
		glow.addColorStop(1, `${FIRE.glow} / 0)`);
		c.globalAlpha = 1;
		c.fillStyle = glow;
		c.fillRect(0, 0, w, h);

		// People: round, irregular shapes in a circle around the fire, bigger in front.
		const people = Array.from({ length: N }, (_, i) => {
			// offset by half a step, so nobody sits right behind the fire
			const a = -Math.PI / 2 + ((i + 0.5) / N) * TAU;
			const depth = (Math.sin(a) + 1) / 2; // 0 back, 1 front
			const r = (4.4 + 1.6 * depth) * u;
			const x = cx + Math.cos(a) * rx;
			const y = cy + Math.sin(a) * ry;
			// threads from the fire stop at the person's outline
			const fx = cx - x;
			const fy = cy - 4 * u - y;
			const fl = Math.hypot(fx, fy) || 1;
			const edge = r * 0.86 * (1 + 0.3 * Math.abs(fy / fl)) + 0.8 * u;
			return { i, x, y, r, mid: { x: x + (fx / fl) * edge, y: y + (fy / fl) * edge } };
		});

		// Warmth travelling from the fire to each person: a few spheres of light
		// on their way at once, growing as they leave the flame and fading as they arrive.
		const src = { x: cx, y: cy - 4 * u };
		for (const p of people) {
			for (let n = 0; n < 3; n++) {
				const ph = (t * 0.3 + p.i / N + n / 3) % 1;
				const x = lerp(src.x, p.mid.x, ph);
				const y = lerp(src.y, p.mid.y, ph);
				const r = (0.5 + 0.5 * Math.sin(ph * Math.PI)) * 0.85 * u;
				c.globalAlpha = Math.sin(ph * Math.PI) ** 0.7;
				c.fillStyle = FIRE.warm;
				c.beginPath();
				c.arc(x, y, r, 0, TAU);
				c.fill();
			}
		}
		c.globalAlpha = 1;

		// Each person is a flat blob whose gradient slowly turns around it.
		const row = (front: boolean) => {
			for (const p of people) {
				if (p.y > cy !== front) continue;
				const ang = t * 0.5 + p.i * 1.3;
				const dx = Math.cos(ang) * p.r;
				const dy = Math.sin(ang) * p.r;
				const g = c.createLinearGradient(p.x - dx, p.y - dy, p.x + dx, p.y + dy);
				const [a, b] = p.i % 2 ? PEOPLE : [PEOPLE[1], PEOPLE[0]];
				g.addColorStop(0, a);
				g.addColorStop(1, b);
				c.globalAlpha = 1;
				// a bit taller than wide, like someone sitting, seen from far
				blob(c, p.x, p.y, p.r * 0.86, 40 + p.i, t, g, 1.3);
				// the side facing the fire is lit, and flickers with it
				const fx = cx - p.x;
				const fy = cy - 6 * u - p.y;
				const fl = Math.hypot(fx, fy) || 1;
				const lx = p.x + (fx / fl) * p.r * 0.85;
				const ly = p.y + (fy / fl) * p.r * 0.85;
				const lit = c.createRadialGradient(lx, ly, 0, lx, ly, p.r * 1.5);
				lit.addColorStop(0, `${FIRE.light} / ${0.5 * flick})`);
				lit.addColorStop(1, `${FIRE.light} / 0)`);
				blob(c, p.x, p.y, p.r * 0.86, 40 + p.i, t, lit, 1.3);
			}
			c.globalAlpha = 1;
		};
		row(false);

		// The fire, flat: a pool of light, layered flames and drops rising.
		c.globalAlpha = 0.6;
		c.fillStyle = FIRE.ground;
		c.beginPath();
		c.ellipse(cx, cy, 6.5 * u, 1.1 * u, 0, 0, TAU);
		c.fill();
		c.globalAlpha = 1;

		// Logs: two crossed sticks, the plainest sign of a campfire.
		c.lineCap = 'round';
		c.lineWidth = 2 * u;
		for (const [tilt, color] of [
			[0.32, FIRE.log],
			[-0.32, FIRE.logDark],
		] as const) {
			const lx = Math.cos(tilt) * 7 * u;
			const ly = Math.sin(tilt) * 7 * u;
			c.strokeStyle = color;
			c.beginPath();
			c.moveTo(cx - lx, cy - 0.4 * u - ly);
			c.lineTo(cx + lx, cy - 0.4 * u + ly);
			c.stroke();
		}
		c.lineCap = 'butt';

		const W = 5.8 * u;
		const H = 17 * u;
		const sw = (speed: number, ph: number) =>
			Math.sin(t * speed + ph) * 0.6 + Math.sin(t * speed * 1.7 + ph * 2) * 0.4;
		const tall = (ph: number) => 1 + 0.07 * Math.sin(t * 7 + ph) + 0.04 * Math.sin(t * 11.3 + ph);
		// One continuous gradient across the whole flame: a light core low in the
		// middle that blends through peach and pink into violet at the tips.
		const hot = { x: cx + W * 0.08 * sw(2.2, 7), y: cy - H * 0.14 };
		const body = c.createRadialGradient(hot.x, hot.y, 0, hot.x, hot.y - H * 0.12, H * 0.95);
		body.addColorStop(0, FIRE.core);
		body.addColorStop(0.18, FIRE.inner);
		body.addColorStop(0.42, FIRE.mid);
		body.addColorStop(0.75, FIRE.outer);
		body.addColorStop(1, FIRE.outer);
		flame(c, cx - W * 0.62, cy, W * 0.5, H * 0.55 * tall(2), W * 0.45 * sw(3.1, 1), body);
		flame(c, cx + W * 0.58, cy, W * 0.45, H * 0.48 * tall(4), W * 0.45 * sw(3.4, 3), body);
		flame(c, cx, cy, W, H * tall(0), W * 0.35 * sw(2.6, 0), body);
		// An inner tongue that fades out upward, so the layers melt into each other.
		const tongue = c.createLinearGradient(cx, cy, cx, cy - H * 0.62);
		tongue.addColorStop(0, `${FIRE.coreRgb} / 0.95)`);
		tongue.addColorStop(0.55, `${FIRE.innerRgb} / 0.55)`);
		tongue.addColorStop(1, `${FIRE.innerRgb} / 0)`);
		flame(c, cx, cy, W * 0.55, H * 0.62 * tall(3), W * 0.28 * sw(3.6, 4), tongue);

		for (let j = 0; j < 6; j++) {
			const ph = (t * 0.45 + j / 6) % 1;
			const x = cx + Math.sin(j * 7.3) * W * 0.9 + Math.sin(t * 2 + j) * 0.6 * u;
			const y = cy - H * 0.55 - ph * H * 0.9;
			c.globalAlpha = (1 - ph) ** 1.2;
			c.fillStyle = j % 2 ? FIRE.outer : FIRE.inner;
			c.beginPath();
			c.ellipse(x, y, 0.42 * u, 0.62 * u, 0, 0, TAU);
			c.fill();
		}

		row(true);
	},
};

/* ---- 2. sisifo: the ball climbs to the top and rolls back, again -------- */

/* The mountain, flat and faceted, in the site's violets: pale on a light page,
   deep on a dark one, so it never glares. */
const MOUNT_LIGHT = {
	top: '#c4baff',
	base: '#9888ff',
	far: '#dad4ff',
	shade: '#5444c3',
	light: '#ffffff',
};
const MOUNT_DARK = {
	top: '#6a5bd6',
	base: '#3a3185',
	far: '#2c2766',
	shade: '#110f25',
	light: '#b5aaff',
};

/** True when the page behind the drawing is dark. */
function onDark(bg: string) {
	const [r, g, b] = (bg.match(/[\d.]+/g) ?? ['255', '255', '255']).map(Number);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
}

type Pt = { x: number; y: number };

function poly(c: CanvasRenderingContext2D, pts: Pt[], fill: string | CanvasGradient, a = 1) {
	c.globalAlpha = a;
	c.fillStyle = fill;
	c.beginPath();
	pts.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
	c.closePath();
	c.fill();
	c.globalAlpha = 1;
}

/** A point on a polyline by arc length (0–1), with the segment's upward normal. */
function along(path: Pt[], s: number) {
	const lens = path.slice(1).map((p, i) => Math.hypot(p.x - path[i].x, p.y - path[i].y));
	const total = lens.reduce((a, b) => a + b, 0);
	let d = clamp(s) * total;
	let i = 0;
	while (i < lens.length - 1 && d > lens[i]) d -= lens[i++];
	const a = path[i];
	const b = path[i + 1];
	const k = lens[i] ? d / lens[i] : 0;
	const dx = (b.x - a.x) / (lens[i] || 1);
	const dy = (b.y - a.y) / (lens[i] || 1);
	return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), nx: dy, ny: -dx, total };
}

/** Rounds the corners of a polyline (Chaikin), keeping both ends. */
function chaikin(pts: Pt[], times: number): Pt[] {
	let out = pts;
	for (let n = 0; n < times; n++) {
		const next: Pt[] = [out[0]];
		for (let i = 0; i < out.length - 1; i++) {
			const a = out[i];
			const b = out[i + 1];
			next.push({ x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 });
			next.push({ x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 });
		}
		next.push(out[out.length - 1]);
		out = next;
	}
	return out;
}

/** The ball: a gradient that turns as it rolls, with a soft light and shade. */
function ball(c: CanvasRenderingContext2D, x: number, y: number, R: number, roll: number, a = 1) {
	const gx = Math.cos(roll) * R;
	const gy = Math.sin(roll) * R;
	const g = c.createLinearGradient(x - gx, y - gy, x + gx, y + gy);
	g.addColorStop(0, '#30bacc');
	g.addColorStop(1, '#7b66ff');
	c.globalAlpha = a;
	c.fillStyle = g;
	c.beginPath();
	c.arc(x, y, R, 0, TAU);
	c.fill();
	const shade = c.createRadialGradient(x - R * 0.35, y - R * 0.4, R * 0.2, x, y, R);
	shade.addColorStop(0, 'rgb(255 255 255 / 0.25)');
	shade.addColorStop(0.7, 'rgb(255 255 255 / 0)');
	shade.addColorStop(1, 'rgb(49 36 141 / 0.22)');
	c.fillStyle = shade;
	c.beginPath();
	c.arc(x, y, R, 0, TAU);
	c.fill();
	c.globalAlpha = 1;
}

const sisifo: Scene = {
	stillAt: 4.6,
	draw(f) {
		const { c, w, h, t, u, k } = f;
		const P = (x: number, y: number) => ({ x: x * w, y: y * h });
		const peak = P(0.78, 0.3);
		const MOUNT = onDark(k.bg) ? MOUNT_DARK : MOUNT_LIGHT;

		// Light behind the summit, like the fire's halo, with a faint ring.
		const halo = Math.min(h * 0.62, w * 0.3, peak.y + h * 0.08 - 2);
		const glow = c.createRadialGradient(
			peak.x,
			peak.y + h * 0.08,
			0,
			peak.x,
			peak.y + h * 0.08,
			halo,
		);
		glow.addColorStop(0, `${FIRE.glow} / 0.16)`);
		glow.addColorStop(1, `${FIRE.glow} / 0)`);
		c.fillStyle = glow;
		c.fillRect(0, 0, w, h);
		c.globalAlpha = 0.25;
		c.strokeStyle = k.structure;
		c.lineWidth = Math.max(1, 0.18 * u);
		c.beginPath();
		c.arc(peak.x, peak.y + h * 0.08, Math.min(halo * 0.78, peak.y + h * 0.08 - 3), 0, TAU);
		c.stroke();
		c.globalAlpha = 1;

		// A paler range behind, from edge to edge.
		poly(
			c,
			[P(0, 0.6), P(0.1, 0.48), P(0.2, 0.57), P(0.32, 0.44), P(0.46, 0.64), P(0.46, 1), P(0, 1)],
			MOUNT.far,
			0.55,
		);
		poly(c, [P(0.84, 0.58), P(0.92, 0.42), P(1, 0.5), P(1, 1), P(0.84, 1)], MOUNT.far, 0.55);

		// The mountain: a long, even climb from the very edge and a short way down.
		const ridge = [P(0, 0.94), P(0.16, 0.82), P(0.32, 0.7), P(0.46, 0.62), P(0.62, 0.46), peak];
		const right = [P(0.84, 0.44), P(0.88, 0.5), P(0.93, 0.48), P(1, 0.62), P(1, 1), P(0, 1)];
		const body = c.createLinearGradient(0, peak.y, 0, h);
		body.addColorStop(0, MOUNT.top);
		body.addColorStop(1, MOUNT.base);
		poly(c, [...ridge, ...right], body);
		// facets: shade on the far side, a little light on the near one
		poly(
			c,
			[peak, P(0.84, 0.44), P(0.88, 0.5), P(0.86, 0.76), P(0.83, 1), P(0.74, 1), P(0.76, 0.6)],
			MOUNT.shade,
			0.22,
		);
		poly(c, [P(0.93, 0.48), P(1, 0.62), P(1, 1), P(0.95, 1), P(0.94, 0.7)], MOUNT.shade, 0.16);
		poly(c, [P(0.46, 0.62), P(0.62, 0.46), P(0.58, 0.66), P(0.5, 0.76)], MOUNT.light, 0.3);
		poly(c, [P(0.16, 0.82), P(0.32, 0.7), P(0.26, 0.86)], MOUNT.light, 0.25);

		// The mountain fades into the page instead of ending at the frame.
		const fade = c.createLinearGradient(0, h * 0.45, 0, h * 0.97);
		const [r0, g0, b0] = k.bg.match(/[\d.]+/g) ?? ['0', '0', '0'];
		fade.addColorStop(0, `rgb(${r0} ${g0} ${b0} / 0)`);
		fade.addColorStop(1, k.bg);
		c.fillStyle = fade;
		c.fillRect(0, h * 0.45, w, h * 0.55);

		// The path, as a smooth line along the ridge.
		c.globalAlpha = 0.7;
		c.strokeStyle = k.structure;
		c.lineWidth = Math.max(1.2, 0.22 * u);
		c.lineJoin = 'round';
		c.beginPath();
		ridge.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
		c.stroke();
		c.globalAlpha = 1;

		// One loop: a slow, even climb to the very top, a pause there, then it
		// rolls back down, gathering speed and settling at the foot. Every phase
		// starts and ends at rest, so the motion never jerks.
		const L = 10;
		const tau = t % L;
		const ease = (k: number) => (1 - Math.cos(Math.PI * clamp(k))) / 2;
		let s: number;
		if (tau < 6.2) s = ease(tau / 6.2);
		else if (tau < 7.1) s = 1;
		else if (tau < 9.3) s = 1 - ease(((tau - 7.1) / 2.2) ** 0.75);
		else s = 0;
		// start a little in from the edge, so the ball is whole when it rests
		s = 0.04 + 0.96 * s;

		// The ball runs on a smoothed copy of the ridge, so it glides over the bends.
		const track = chaikin(ridge, 4);
		const R = 2.8 * u;
		const p0 = along(track, s);
		const near = R / p0.total;
		let nx = 0;
		let ny = 0;
		for (let i = -4; i <= 4; i++) {
			const q = along(track, s + (i / 4) * near);
			nx += q.nx;
			ny += q.ny;
		}
		const nl = Math.hypot(nx, ny) || 1;
		const bx = p0.x + (nx / nl) * R;
		const by = p0.y + (ny / nl) * R;

		// soft shadow where it touches
		c.globalAlpha = 0.12;
		c.fillStyle = MOUNT.shade;
		c.beginPath();
		c.ellipse(p0.x, p0.y + 0.4 * u, R * 0.8, R * 0.22, Math.atan2(-p0.nx, p0.ny), 0, TAU);
		c.fill();

		ball(c, bx, by, R, (s * p0.total) / R);
	},
};

/* ---- 3. planta: plants that grow together in one pot, while watered ---- */

/* Flowers borrow the fire's warm tones; leaves and stems the people's blues. */
const BLOOM = {
	violet: '#9888ff',
	deep: '#7b66ff',
	pink: '#f47fae',
	peach: '#ffaf73',
	yellow: '#ffd98f',
	stem: '#30bacc',
	water: '#6fd0dc',
};

/** A point and tangent on a cubic Bézier. */
function bez(p: Pt[], k: number) {
	const m = 1 - k;
	const x =
		m * m * m * p[0].x + 3 * m * m * k * p[1].x + 3 * m * k * k * p[2].x + k * k * k * p[3].x;
	const y =
		m * m * m * p[0].y + 3 * m * m * k * p[1].y + 3 * m * k * k * p[2].y + k * k * k * p[3].y;
	const dx =
		3 * m * m * (p[1].x - p[0].x) + 6 * m * k * (p[2].x - p[1].x) + 3 * k * k * (p[3].x - p[2].x);
	const dy =
		3 * m * m * (p[1].y - p[0].y) + 6 * m * k * (p[2].y - p[1].y) + 3 * k * k * (p[3].y - p[2].y);
	return { x, y, a: Math.atan2(dy, dx) };
}

/** A flat leaf: a lens from its base along angle `a`. */
function leaf(c: CanvasRenderingContext2D, x: number, y: number, a: number, len: number) {
	if (len <= 0.5) return;
	const tx = x + Math.cos(a) * len;
	const ty = y + Math.sin(a) * len;
	const nx = -Math.sin(a) * len * 0.3;
	const ny = Math.cos(a) * len * 0.3;
	const g = c.createLinearGradient(x, y, tx, ty);
	g.addColorStop(0, PEOPLE[0]);
	g.addColorStop(1, PEOPLE[1]);
	c.fillStyle = g;
	c.beginPath();
	c.moveTo(x, y);
	c.quadraticCurveTo((x + tx) / 2 + nx, (y + ty) / 2 + ny, tx, ty);
	c.quadraticCurveTo((x + tx) / 2 - nx, (y + ty) / 2 - ny, x, y);
	c.fill();
}

/** A falling drop of water, flat, pointed at the top. */
function drop(c: CanvasRenderingContext2D, x: number, y: number, r: number, a = 1) {
	c.globalAlpha = a;
	const g = c.createLinearGradient(x, y - r * 2.4, x, y + r);
	g.addColorStop(0, BLOOM.water);
	g.addColorStop(1, BLOOM.stem);
	c.fillStyle = g;
	c.beginPath();
	c.moveTo(x, y - r * 2.4);
	c.bezierCurveTo(x + r * 0.9, y - r * 0.9, x + r, y - r * 0.1, x + r, y);
	c.arc(x, y, r, 0, Math.PI);
	c.bezierCurveTo(x - r, y - r * 0.1, x - r * 0.9, y - r * 0.9, x, y - r * 2.4);
	c.fill();
	c.globalAlpha = 1;
}

/** The flower at the tip of a stem, opening with `b` (0–1). */
function flower(
	c: CanvasRenderingContext2D,
	x: number,
	y: number,
	s: number,
	b: number,
	kind: number,
	t: number,
) {
	if (b <= 0) return;
	const r = s * b;
	if (kind === 0) {
		// a puff of small round florets
		for (let i = 0; i < 9; i++) {
			const a = (i / 9) * TAU + t * 0.2;
			const d = i === 0 ? 0 : r * 0.62;
			const g = c.createLinearGradient(x - r, y - r, x + r, y + r);
			g.addColorStop(0, BLOOM.violet);
			g.addColorStop(1, BLOOM.deep);
			c.fillStyle = g;
			c.beginPath();
			c.arc(x + Math.cos(a) * d * (i ? 1 : 0), y + Math.sin(a) * d * (i ? 1 : 0), r * 0.38, 0, TAU);
			c.fill();
		}
	} else if (kind === 1) {
		// a star of petals around a warm centre
		const g = c.createRadialGradient(x, y, r * 0.2, x, y, r);
		g.addColorStop(0, BLOOM.peach);
		g.addColorStop(1, BLOOM.pink);
		c.fillStyle = g;
		for (let i = 0; i < 8; i++) {
			const a = (i / 8) * TAU + t * 0.15;
			c.beginPath();
			c.ellipse(
				x + Math.cos(a) * r * 0.55,
				y + Math.sin(a) * r * 0.55,
				r * 0.48,
				r * 0.2,
				a,
				0,
				TAU,
			);
			c.fill();
		}
		c.fillStyle = BLOOM.yellow;
		c.beginPath();
		c.arc(x, y, r * 0.3, 0, TAU);
		c.fill();
	} else {
		// a closed bud, like a small flame
		const g = c.createLinearGradient(x, y + r, x, y - r * 1.4);
		g.addColorStop(0, BLOOM.peach);
		g.addColorStop(0.5, BLOOM.pink);
		g.addColorStop(1, BLOOM.deep);
		c.fillStyle = g;
		c.beginPath();
		c.moveTo(x, y + r * 0.6);
		c.bezierCurveTo(x - r * 0.95, y + r * 0.4, x - r * 0.7, y - r * 0.9, x, y - r * 1.4);
		c.bezierCurveTo(x + r * 0.7, y - r * 0.9, x + r * 0.95, y + r * 0.4, x, y + r * 0.6);
		c.fill();
	}
}

const planta: Scene = {
	stillAt: 9,
	draw(f) {
		const { c, w, h, t, u, k } = f;
		const MOUNT = onDark(k.bg) ? MOUNT_DARK : MOUNT_LIGHT;
		const cx = w / 2;
		// the pot: its rim is where the soil (and every stem) starts
		const soil = h * 0.74;
		const potTop = 11 * u;
		const potBase = h * 0.97;

		// Soft light behind the pot, like the fire's halo.
		const halo = Math.min(w * 0.4, soil - 2);
		const glow = c.createRadialGradient(cx, soil, 0, cx, soil, halo);
		glow.addColorStop(0, `${FIRE.glow} / 0.14)`);
		glow.addColorStop(1, `${FIRE.glow} / 0)`);
		c.fillStyle = glow;
		c.fillRect(0, 0, w, h);

		// Seven plants growing together from one pot, fanning out like a bunch.
		const N = 7;
		const R = rng(21);
		const plants = Array.from({ length: N }, (_, i) => {
			const off = i - (N - 1) / 2;
			return {
				x: cx + off * 2.1 * u,
				lean: off * 4.6 * u + (R() - 0.5) * 2 * u,
				tall: h * (0.54 - Math.abs(off) * 0.05 + R() * 0.05),
				leaves: Array.from({ length: 2 + Math.floor(R() * 2) }, (_, j) => ({
					at: 0.25 + j * 0.22 + R() * 0.06,
					side: off === 0 ? (j % 2 ? 1 : -1) : j % 2 ? Math.sign(off) : -Math.sign(off),
					len: (4.6 + R() * 2.2) * u,
				})),
				kind: [0, 1, 2, 1, 0, 2, 1][i] as 0 | 1 | 2,
				phase: R(),
			};
		});

		// Back of the pot and the soil.
		const depth = potBase - soil;
		const body = c.createRadialGradient(
			cx - potTop * 0.35,
			soil + depth * 0.3,
			0,
			cx,
			soil + depth * 0.4,
			potTop * 1.3,
		);
		body.addColorStop(0, MOUNT.top);
		body.addColorStop(1, MOUNT.base);
		c.fillStyle = MOUNT.shade;
		c.globalAlpha = 0.45;
		c.beginPath();
		c.ellipse(cx, soil, potTop * 0.96, 1.6 * u, 0, 0, TAU);
		c.fill();
		c.globalAlpha = 1;

		const CYCLE = 13;
		const drops: (() => void)[] = [];
		for (const p of plants) {
			const tau = ((t / CYCLE + p.phase) % 1) * CYCLE;
			// watered and growing (0–7 s), in bloom (7–11 s), then it fades and starts over
			const grow = smooth(tau / 7);
			const bloom = easeOut((tau - 6.2) / 1.4);
			const fade = 1 - smooth((tau - 11.6) / 1.2);

			// Drops fall on it while it grows; each one lands with a small ripple.
			if (tau < 7.4) {
				const every = 0.8;
				const j = Math.floor(tau / every);
				const ph = (tau - j * every) / every;
				const spot = (n: number) => p.x + (rng(200 + n + p.phase * 1000)() - 0.5) * 2.4 * u;
				const top = Math.max(2.4 * u, soil - p.tall - 6 * u);
				drops.push(() => {
					if (tau < 6.8) drop(c, spot(j), lerp(top, soil - 0.8 * u, ph * ph), 0.6 * u, 0.95);
					const rip = ph < 0.5 && j > 0 ? ph / 0.5 : -1;
					if (rip >= 0) {
						c.globalAlpha = (1 - rip) * 0.7;
						c.strokeStyle = BLOOM.water;
						c.lineWidth = Math.max(1, 0.18 * u);
						c.beginPath();
						c.ellipse(spot(j - 1), soil, rip * 2.4 * u, rip * 0.6 * u, 0, 0, TAU);
						c.stroke();
						c.globalAlpha = 1;
					}
				});
			}

			if (grow <= 0.01) continue;
			c.globalAlpha = fade;
			const sway = Math.sin(t * 0.9 + p.phase * 9) * 1.2 * u * grow;
			const H = p.tall * grow;
			const curve: Pt[] = [
				{ x: p.x, y: soil },
				{ x: p.x, y: soil - H * 0.4 },
				{ x: p.x + p.lean * grow * 0.5 + sway * 0.4, y: soil - H * 0.75 },
				{ x: p.x + p.lean * grow + sway, y: soil - H },
			];

			// stem: a smooth line that grows from the soil
			const stem = c.createLinearGradient(p.x, soil, p.x, soil - H);
			stem.addColorStop(0, BLOOM.stem);
			stem.addColorStop(1, BLOOM.water);
			c.strokeStyle = stem;
			c.lineWidth = Math.max(2, 0.5 * u);
			c.lineCap = 'round';
			c.beginPath();
			c.moveTo(curve[0].x, curve[0].y);
			c.bezierCurveTo(curve[1].x, curve[1].y, curve[2].x, curve[2].y, curve[3].x, curve[3].y);
			c.stroke();
			c.lineCap = 'butt';

			// leaves open one after the other as the stem passes them
			for (const lf of p.leaves) {
				const open = easeOut((grow - lf.at) / 0.25);
				if (open <= 0) continue;
				const q = bez(curve, lf.at);
				leaf(
					c,
					q.x,
					q.y,
					q.a + lf.side * 1.05 + Math.sin(t * 1.2 + lf.at * 9) * 0.06,
					lf.len * open,
				);
			}

			const tip = bez(curve, 1);
			flower(c, tip.x, tip.y, 3.6 * u, bloom, p.kind, t);
			c.globalAlpha = 1;
		}

		// Front of the pot, over the stems' feet: a round bowl and a rim.
		c.fillStyle = body;
		c.beginPath();
		c.moveTo(cx - potTop, soil);
		c.bezierCurveTo(
			cx - potTop * 1.05,
			soil + depth * 0.85,
			cx - potTop * 0.55,
			potBase,
			cx,
			potBase,
		);
		c.bezierCurveTo(
			cx + potTop * 0.55,
			potBase,
			cx + potTop * 1.05,
			soil + depth * 0.85,
			cx + potTop,
			soil,
		);
		c.closePath();
		c.fill();
		const rim = c.createLinearGradient(cx - potTop, 0, cx + potTop, 0);
		rim.addColorStop(0, MOUNT.top);
		rim.addColorStop(0.45, MOUNT.light);
		rim.addColorStop(1, MOUNT.top);
		c.fillStyle = rim;
		c.beginPath();
		c.roundRect(cx - potTop - 1.2 * u, soil - 0.6 * u, (potTop + 1.2 * u) * 2, 3.4 * u, 1.4 * u);
		c.fill();

		for (const d of drops) d();
	},
};

/* The net uses the people's blues for its ties and the fire's warm light for
   the support that travels through it. */
const NET = { warm: '#ff96a0' };

/* ---- 4. red: someone falls, the net holds them ------------------------- */

const red: Scene = {
	stillAt: 3.4,
	draw(f) {
		const { c, w, h, t, u, k } = f;
		const C = w < 560 ? 9 : w < 900 ? 13 : 19;
		const RW = 6;
		const cx = w / 2;
		const y0 = h * 0.46;
		const y1 = h * 0.9;
		const R = rng(5);
		const base = [] as { x: number; y: number; vis: number }[];
		for (let r = 0; r < RW; r++) {
			const depth = r / (RW - 1);
			const span = w * 1.04 * (0.8 + 0.2 * depth);
			for (let col = 0; col < C; col++) {
				// Fades toward the rim, so the net has no hard edge.
				const q = ((col / (C - 1) - 0.5) * 2) ** 2 + ((depth - 0.5) * 2) ** 2 * 0.6;
				base.push({
					x: cx + (col / (C - 1) - 0.5) * span + (R() - 0.5) * 2.4 * u,
					y: lerp(y0, y1, depth) + (R() - 0.5) * 2.4 * u,
					vis: clamp(1 - q / 1.6) ** 0.7,
				});
			}
		}
		const idx = (r: number, col: number) => r * C + col;

		// The loop: someone falls, is caught, becomes part of the net, again.
		const L = 7.5;
		const cycle = Math.floor(t / L);
		const tau = t - cycle * L;
		const pick = rng(31 + cycle);
		const hitR = 1 + Math.floor(pick() * 2);
		const hitC = 2 + Math.floor(pick() * (C - 4));
		const hit = base[idx(hitR, hitC)];
		const tFall = 1.5;
		const since = tau - tFall;
		const sigma = w * 0.17;
		const amp =
			since > 0
				? 9 * u * Math.exp(-since * 1.3) * Math.cos(since * 5.5) + 1.2 * u * smooth(since)
				: 0;
		const fade = 1 - smooth((tau - 6.6) / 0.9);

		const pts = base.map((p) => {
			const dd = Math.hypot(p.x - hit.x, (p.y - hit.y) * 1.6);
			return { x: p.x, y: p.y + amp * Math.exp(-(dd * dd) / (2 * sigma * sigma)), dd, vis: p.vis };
		});

		// Support spreading out from where they landed.
		const front = since > 0 ? since * w * 0.32 : -1;
		const glow = (dd: number) => {
			if (front < 0) return 0;
			const g = dd - front;
			return (
				(g > 0 ? Math.exp(-((g / (3 * u)) ** 2)) : Math.exp(g / (w * 0.14))) *
				Math.exp(-since * 0.35) *
				fade
			);
		};

		// Soft violet light where they land, like the halo in the other diagrams.
		if (since > 0) {
			const hx = hit.x;
			const hy = pts[idx(hitR, hitC)].y;
			const rad = Math.min(w * 0.22, hy - 2, h - hy - 2);
			const hl = c.createRadialGradient(hx, hy, 0, hx, hy, rad);
			hl.addColorStop(0, `${FIRE.glow} / ${0.18 * smooth(since / 0.6) * fade})`);
			hl.addColorStop(1, `${FIRE.glow} / 0)`);
			c.fillStyle = hl;
			c.fillRect(0, 0, w, h);
		}

		// Ties: smooth lines in the people's blue-to-violet, across the whole net.
		const tieColor = c.createLinearGradient(0, 0, w, 0);
		tieColor.addColorStop(0, PEOPLE[0]);
		tieColor.addColorStop(1, PEOPLE[1]);
		const edge = (a: number, b: number) => {
			const p = pts[a];
			const q = pts[b];
			const vis = Math.min(p.vis, q.vis);
			const g = Math.max(glow(p.dd), glow(q.dd)) * vis;
			c.globalAlpha = 0.55 * vis;
			c.strokeStyle = tieColor;
			c.lineWidth = Math.max(1, 0.16 * u);
			c.beginPath();
			c.moveTo(p.x, p.y);
			c.lineTo(q.x, q.y);
			c.stroke();
			// the support that travels is warm, like the fire's light
			if (g > 0.03) seg(c, p.x, p.y, q.x, q.y, NET.warm, g * 0.9, Math.max(1.4, 0.28 * u));
		};
		for (let r = 0; r < RW; r++)
			for (let col = 0; col < C; col++) {
				if (col < C - 1) edge(idx(r, col), idx(r, col + 1));
				if (r < RW - 1) edge(idx(r, col), idx(r + 1, col));
				if (r < RW - 1 && col < C - 1 && (r + col) % 2 === 0)
					edge(idx(r, col), idx(r + 1, col + 1));
			}

		// Knots are people: small outlines like the ones around the fire.
		const nr = 0.9 * u;
		pts.forEach((p, i) => {
			if (p.vis < 0.03) return;
			const g = glow(p.dd) * p.vis;
			const ang = t * 0.5 + i * 0.7;
			const gr = c.createLinearGradient(
				p.x - Math.cos(ang) * nr,
				p.y - Math.sin(ang) * nr,
				p.x + Math.cos(ang) * nr,
				p.y + Math.sin(ang) * nr,
			);
			gr.addColorStop(0, PEOPLE[0]);
			gr.addColorStop(1, PEOPLE[1]);
			c.globalAlpha = p.vis;
			c.fillStyle = k.bg;
			c.beginPath();
			c.arc(p.x, p.y, nr, 0, TAU);
			c.fill();
			c.strokeStyle = gr;
			c.lineWidth = Math.max(1.4, 0.26 * u);
			c.stroke();
			// the warm support fades in and out over the outline
			if (g > 0.02) {
				c.globalAlpha = Math.min(1, g * 1.2);
				c.strokeStyle = NET.warm;
				c.stroke();
			}
			c.globalAlpha = 1;
		});

		// The person falling, then held.
		const Rb = 2.4 * u;
		const landY = pts[idx(hitR, hitC)].y - Rb;
		let py: number;
		if (since < 0) py = lerp(h * 0.04, landY, (tau / tFall) ** 2);
		else py = landY;
		const px = hit.x;
		if (since > 0) {
			// New ties to the nearest knots: they are part of the net now.
			const tie = smooth((since - 0.4) / 1.2) * fade;
			for (const [dr, dc] of [
				[0, -1],
				[0, 1],
				[-1, 0],
				[1, 0],
			]) {
				const q = pts[idx(hitR + dr, hitC + dc)];
				if (q) seg(c, px, py, q.x, q.y, NET.warm, tie * 0.9, Math.max(1.4, 0.28 * u));
			}
		}
		ball(c, px, py, Rb, Math.min(tau, tFall) * 3, fade);
	},
};

const SCENES: Record<string, Scene> = { fuego, sisifo, planta, red };

/* ---- mounting ------------------------------------------------------------ */

const PROBE: Record<Exclude<keyof Tones, 'font'>, string> = {
	bg: '--bg',
	off: '--neutral-300',
	dim: '--neutral-400',
	text: '--ink-muted',
	ink: '--ink',
	structure: '--teal-500',
	signal: '--violet-accent',
};

function readTones(host: HTMLElement): Tones {
	const probe = document.createElement('span');
	probe.hidden = true;
	host.append(probe);
	const out = { font: getComputedStyle(host).fontFamily } as Tones;
	for (const [name, v] of Object.entries(PROBE)) {
		probe.style.color = `var(${v})`;
		out[name as keyof typeof PROBE] = getComputedStyle(probe).color;
	}
	probe.remove();
	return out;
}

export function montarEsquemas() {
	const figures = document.querySelectorAll<HTMLElement>('figure.esquema[data-esquema]');
	if (!figures.length) return;
	const reduce = matchMedia('(prefers-reduced-motion: reduce)');
	const items: (() => void)[] = [];

	figures.forEach((fig) => {
		const scene = SCENES[fig.dataset.esquema ?? ''];
		if (!scene) return;
		const canvas = document.createElement('canvas');
		canvas.className = 'esquema__lienzo';
		canvas.setAttribute('role', 'img');
		canvas.setAttribute('aria-label', fig.dataset.alt ?? '');
		fig.prepend(canvas);
		const c = canvas.getContext('2d');
		if (!c) return;

		let tones = readTones(fig);
		let w = 0;
		let h = 0;
		let visible = false;
		let started = false;
		let clock = 0;
		let last = 0;
		let raf = 0;

		const paint = () => {
			const dpr = Math.min(devicePixelRatio || 1, 2);
			c.setTransform(dpr, 0, 0, dpr, 0, 0);
			c.globalAlpha = 1;
			c.clearRect(0, 0, w, h);
			const still = reduce.matches;
			scene.draw({
				c,
				w,
				h,
				t: still ? scene.stillAt : clock,
				u: Math.min(w, h * 1.78) / 100,
				k: tones,
				still,
			});
		};
		const tick = (now: number) => {
			raf = 0;
			if (!visible || reduce.matches) return;
			clock += Math.min(0.05, (now - last) / 1000);
			last = now;
			paint();
			raf = requestAnimationFrame(tick);
		};
		const play = () => {
			if (raf || !visible || reduce.matches) return paint();
			last = performance.now();
			raf = requestAnimationFrame(tick);
		};

		new ResizeObserver(() => {
			const dpr = Math.min(devicePixelRatio || 1, 2);
			w = canvas.clientWidth;
			h = canvas.clientHeight;
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			paint();
		}).observe(canvas);

		new IntersectionObserver(
			([e]) => {
				visible = e.isIntersecting;
				if (visible) started = true;
				if (started) play();
			},
			{ rootMargin: '80px' },
		).observe(canvas);

		items.push(() => {
			tones = readTones(fig);
			play();
		});
	});

	// Theme: the header toggle (data-theme), the system setting, and reduced motion.
	const refresh = () => items.forEach((fn) => fn());
	new MutationObserver(() => requestAnimationFrame(refresh)).observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme'],
	});
	matchMedia('(prefers-color-scheme: dark)').addEventListener('change', refresh);
	reduce.addEventListener('change', refresh);
}
