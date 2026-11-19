/**
 * «Voluntariado»: one scrapbook canvas («lienzo») per community, stacked, switched with
 * paper tabs on top. Real material from Cata (nov 2026); originals in
 * ~/Desktop/Sitio-insumos/Comunidades (backgrounds removed with macOS Vision, videos
 * trimmed and re-encoded without audio).
 *
 * A canvas has two halves (`izq`, `der`), side by side on wide screens and one above
 * the other on phones. Each half is a 4:5 area; every item is placed with `x`, `y`
 * (top-left corner) and `w` (width) as a percentage of its half, and `rot` in degrees.
 * Sizes scale with the half, so one layout serves both views. Items are drawn in
 * order: later items sit on top.
 */
import type { ImageMetadata } from 'astro';
// 9punto5 (Valdivia, 2025 and 2026)
import n25Grupo from '../assets/voluntariado/9punto5/2025-grupo.jpg';
import n25Credencial from '../assets/voluntariado/9punto5/2025-credencial.png';
import n25Look from '../assets/voluntariado/9punto5/2025-look.png';
import n25Microfono from '../assets/voluntariado/9punto5/2025-microfono.png';
import n25Reencuentro from '../assets/voluntariado/9punto5/2025-reencuentro.png';
import n25PosterFacilitando from '../assets/voluntariado/9punto5/poster-9punto5-facilitando.jpg';
import n26Pizarra from '../assets/voluntariado/9punto5/2026-pizarra.png';
import n26Afiche from '../assets/voluntariado/9punto5/2026-afiche.jpg';
import n26Escenario from '../assets/voluntariado/9punto5/2026-escenario.jpg';
import n26Soberania from '../assets/voluntariado/9punto5/2026-mesa-soberania.png';
import n26Reencuentro from '../assets/voluntariado/9punto5/2026-reencuentro.png';
import n26Credencial from '../assets/voluntariado/9punto5/2026-credencial.png';
import n26Llama from '../assets/voluntariado/9punto5/2026-llama.png';
import logo95 from '../assets/voluntariado/9punto5/logo.png';
// Círculo de Mujeres BBK+2BRAINS
import cmGrupoCirculo from '../assets/voluntariado/circulo-de-mujeres/grupo-circulo.png';
import cmSticker from '../assets/voluntariado/circulo-de-mujeres/sticker-sororidad.png';
import cmValoracion from '../assets/voluntariado/circulo-de-mujeres/sesion-valoracion.jpg';
import cmParticipantes from '../assets/voluntariado/circulo-de-mujeres/sesion-participantes.jpg';
import cmCharla from '../assets/voluntariado/circulo-de-mujeres/charla.jpg';
import cmTarjeta from '../assets/voluntariado/circulo-de-mujeres/tarjeta-sororidad.png';
import logoCirculo from '../assets/voluntariado/circulo-de-mujeres/logo.png';
// +Mujeres en UX Chile, track regiones (also the photos of the article in «Palabras»)
import mmLogo from '../assets/voluntariado/mas-mujeres-en-ux/logo.png';
import mmEquipoRegiones from '../assets/voluntariado/mas-mujeres-en-ux/equipo-regiones.png';
import mmPin from '../assets/voluntariado/mas-mujeres-en-ux/pin.png';
import mmActividad from '../assets/voluntariado/mas-mujeres-en-ux/actividad.jpg';
import mmPosterEncuentro from '../assets/voluntariado/mas-mujeres-en-ux/poster-mujeres-encuentro.jpg';
import mmEncuentro1 from '../assets/palabras/mm-encuentro-1.jpg';
import mmEncuentro2 from '../assets/palabras/mm-encuentro-2.jpg';
import mmEncuentro3 from '../assets/palabras/mm-encuentro-3.jpg';
import mmEquipo2025 from '../assets/palabras/mm-equipo-2025.jpg';
// +Voces en Diseño Chile
import mvLogo from '../assets/voluntariado/mas-voces/logo.png';
import mvAfiche from '../assets/voluntariado/mas-voces/afiche-29-10.jpg';
import mvPosterCasa from '../assets/voluntariado/mas-voces/poster-voces-nuestra-casa.jpg';
import mvPosterCasaMovil from '../assets/voluntariado/mas-voces/poster-voces-nuestra-casa-movil.jpg';

interface Lugar {
	x: number;
	y: number;
	w: number;
	rot?: number;
	/** Placement on phones (and narrow tablets), where texts can't shrink below their
	 *  minimum size; any field left out keeps the desktop value. */
	movil?: { x?: number; y?: number; w?: number; rot?: number };
}

/** Photo: polaroid (caption below) or thin white border; held by tape or a paperclip. */
export interface Foto extends Lugar {
	tipo: 'foto';
	src: ImageMetadata;
	alt: string;
	pie?: string;
	/** Typed date stamp under the photo, e.g. «07/03/2025». */
	fecha?: string;
	/** polaroid · borde (thin white) · ninguno (shadow only, e.g. a poster or a round
	 *  PNG) · pantalla (laptop/browser window) · telefono (phone screenshot). */
	marco?: 'polaroid' | 'borde' | 'ninguno' | 'pantalla' | 'telefono';
	cinta?: 'arriba' | 'esquinas';
	clip?: boolean;
	/** Width / height of the picture; 4/3 by default. */
	formato?: number;
}
/** Video in a white frame; plays only on click, muted. */
export interface Video extends Lugar {
	tipo: 'video';
	src: string;
	poster: ImageMetadata;
	titulo: string;
	/** Width / height of the clip; 16/10 by default. */
	formato?: number;
	/** Larger version for the «Ver en grande» dialog (loaded only when opened). */
	grande?: string;
	/** Phone version (e.g. a vertical recording), used on narrow screens instead. */
	movilVideo?: { src: string; poster: ImageMetadata; formato: number };
}
/** Handwritten note on a piece of paper. */
export interface Nota extends Lugar {
	tipo: 'nota';
	texto: string;
	/** suelto = ink straight on the page; escrito = blue handwriting (moodboard style). */
	papel: 'postit' | 'rayado' | 'rasgado' | 'tarjeta' | 'suelto' | 'escrito';
	/** Text size, in % of the half's width. */
	tam?: number;
}
/** Big title in blue script. */
export interface Titulo extends Lugar {
	tipo: 'titulo';
	texto: string;
}
/** Paper-tape label with typed text, like «SUMMER 2025». */
export interface Etiqueta extends Lugar {
	tipo: 'etiqueta';
	texto: string;
}
/** Vertical postcard with typed lines. */
export interface Postal extends Lugar {
	tipo: 'postal';
	texto: string;
}
/** Film strip with small frames. */
export interface Pelicula extends Lugar {
	tipo: 'pelicula';
	fotos: ImageMetadata[];
	alt: string;
}
/** Faint handwriting in the background. */
export interface Manuscrito extends Lugar {
	tipo: 'manuscrito';
	texto: string;
}
/** Round or pill sticker in the community colour. */
export interface Sticker extends Lugar {
	tipo: 'sticker';
	texto: string;
}
/** Cut-out (background removed, transparent PNG); `contorno` adds a white sticker edge. */
export interface Recorte extends Lugar {
	tipo: 'recorte';
	src: ImageMetadata;
	alt: string;
	contorno?: boolean;
}
/** Big handwritten figure with a label, e.g. «10» «sesiones». */
export interface Cifra extends Lugar {
	tipo: 'cifra';
	numero: string;
	texto: string;
}
/** Ticket-like card with one typed line: «rol · fechas». */
export interface Ficha extends Lugar {
	tipo: 'ficha';
	texto: string;
}
/** A link written on a paper tag. */
export interface Enlace extends Lugar {
	tipo: 'enlace';
	texto: string;
	href: string;
	externo?: boolean;
}
/** Purely decorative pieces (hidden from screen readers). `color` tints the dot and
 *  the torn paper; `alto` is the torn paper's height in % of the half's width. */
export interface Adorno extends Lugar {
	tipo: 'sobre' | 'flor' | 'margarita' | 'puntos' | 'estrella' | 'flecha' | 'circulo' | 'papel';
	color?: string;
	alto?: number;
	/** Mirror the arrow horizontally. */
	voltear?: boolean;
	/** Arrow shape: 1 curved · 2 loop · 3 straight. */
	variante?: 1 | 2 | 3;
}

export type Item =
	| Foto
	| Video
	| Nota
	| Titulo
	| Etiqueta
	| Postal
	| Pelicula
	| Manuscrito
	| Sticker
	| Recorte
	| Cifra
	| Ficha
	| Enlace
	| Adorno;

export interface Comunidad {
	id: string;
	/** Full name; also the tab label. */
	nombre: string;
	/** Accent: tape, dots, stickers. Dark text must read on it. */
	color: string;
	/** Paper tint of this canvas, so the stacked sheets read as different papers. */
	papel: string;
	/** Paper pattern: blue grid, dots or ruled lines. */
	fondo?: 'cuadricula' | 'puntos' | 'rayas';
	logo: ImageMetadata;
	/** Background behind the logo in its round button. */
	logoFondo?: string;
	/** Phone height / width of [left, right] halves (default 1.6), for busy halves. */
	altoMovil?: [number, number];
	/** Summary card on the home page («Haciendo comunidad»). */
	resumen: {
		anios: string;
		portada: ImageMetadata;
		alt: string;
		/** true: a cut-out (shown bare); false: a photo (shown with a white border). */
		recorte: boolean;
	};
	izq: Item[];
	der: Item[];
}

const VIDEOS = '/videos/voluntariado';

export const comunidades: Comunidad[] = [
	{
		id: 'mas-voces-en-diseno',
		nombre: 'Más voces en Diseño',
		color: '#d6ea5a',
		papel: '#faf7f0',
		fondo: 'puntos',
		logo: mvLogo,
		resumen: {
			anios: '2026',
			portada: mvAfiche,
			alt: 'Afiche de +Voces conversando del 29 de octubre.',
			recorte: false,
		},
		izq: [
			{
				tipo: 'recorte',
				src: mvLogo,
				alt: 'Más Voces en Diseño Chile',
				x: 6,
				y: 3,
				w: 38,
				rot: -5,
			},
			{
				tipo: 'ficha',
				texto: 'Voluntaria · 2026',
				x: 50,
				y: 8,
				w: 46,
				rot: 3,
				movil: { x: 48, w: 50 },
			},
			{ tipo: 'titulo', texto: '+Voces conversando', x: 6, y: 37, w: 74, rot: -3 },
			{
				tipo: 'foto',
				src: mvAfiche,
				alt: 'Afiche de +Voces conversando: «Y a ti, ¿cómo te está yendo?», con Catalina Callejas como facilitadora y Bárbara Letelier, Product Lead en Creditú. 29 de octubre, 19 h, en vivo por Instagram.',
				marco: 'borde',
				fecha: '29/10 · INSTAGRAM LIVE',
				formato: 4 / 5,
				cinta: 'arriba',
				x: 6,
				y: 57,
				w: 34,
				rot: -4,
			},
			{
				tipo: 'nota',
				papel: 'escrito',
				texto:
					'Soy facilitadora: conversaciones sinceras sobre la industria de la tecnología y el diseño en Chile.',
				x: 46,
				y: 59,
				w: 50,
				rot: 2,
				movil: { x: 44, y: 53, w: 54 },
			},
			{
				tipo: 'flecha',
				variante: 3,
				voltear: true,
				x: 40,
				y: 80,
				w: 14,
				rot: -10,
				movil: { x: 36, y: 90, w: 10 },
			},
			{
				tipo: 'enlace',
				texto: 'Míralo en Instagram ↗',
				href: 'https://www.instagram.com/reel/DfGJbuJkZM6/',
				externo: true,
				x: 58,
				y: 80,
				w: 38,
				rot: -3,
				movil: { x: 48, y: 88, w: 46 },
			},
		],
		der: [
			{ tipo: 'titulo', texto: 'Nuestra casa', x: 8, y: 3, w: 70, rot: -3 },
			{
				tipo: 'nota',
				papel: 'escrito',
				texto: 'El espacio digital de las voluntarias de +Voces',
				x: 10,
				y: 16,
				w: 72,
				rot: -1,
			},
			{ tipo: 'estrella', x: 84, y: 4, w: 12, rot: 12 },
			{
				tipo: 'video',
				src: `${VIDEOS}/voces-nuestra-casa.mp4`,
				grande: `${VIDEOS}/voces-nuestra-casa-grande.mp4`,
				movilVideo: {
					src: `${VIDEOS}/voces-nuestra-casa-movil.mp4`,
					poster: mvPosterCasaMovil,
					formato: 9 / 16,
				},
				poster: mvPosterCasa,
				titulo:
					'Recorrido por Nuestra casa: una casa ilustrada con calendario, pizarra de coordinación semanal, ideas en post-its y más.',
				formato: 16 / 9,
				x: 2,
				y: 26,
				w: 96,
				rot: 1.5,
				movil: { x: 3, y: 29, w: 46, rot: 1.5 },
			},
			{
				tipo: 'nota',
				papel: 'postit',
				tam: 4.2,
				texto: 'Calendario conectado a Google',
				x: 3,
				y: 76,
				w: 29,
				rot: -5,
				movil: { x: 54, y: 30, w: 43, rot: -4 },
			},
			{
				tipo: 'nota',
				papel: 'postit',
				tam: 4.2,
				texto: 'Pizarra de coordinación semanal',
				x: 36,
				y: 76,
				w: 29,
				rot: 3,
				movil: { x: 55, y: 50, w: 43, rot: 3 },
			},
			{
				tipo: 'nota',
				papel: 'postit',
				tam: 4.2,
				texto: 'Ideas en post-its',
				x: 69,
				y: 76,
				w: 29,
				rot: -3,
				movil: { x: 54, y: 75, w: 42 },
			},
		],
	},
	{
		id: '9punto5',
		nombre: '9punto5',
		color: '#b3bcff',
		papel: '#f5f6fb',
		fondo: 'cuadricula',
		logo: logo95,
		// Left: 2025 · right: 2026 (10 years)
		resumen: {
			anios: '2025 · 2026',
			portada: n25Microfono,
			alt: 'Cata con micrófono, moderando una conversación en 9punto5.',
			recorte: true,
		},
		izq: [
			{ tipo: 'titulo', texto: '9punto5', x: 6, y: 3, w: 56, rot: -4 },
			{ tipo: 'etiqueta', texto: 'VALDIVIA · 2025', x: 8, y: 15, w: 44, rot: -2 },
			{
				tipo: 'recorte',
				src: n25Look,
				alt: 'Cata en una selfie frente al espejo, con vestido y credencial, lista para la conferencia.',
				contorno: true,
				x: 70,
				y: 2,
				w: 24,
				rot: 3,
				movil: { x: 76, y: 2, w: 22 },
			},
			{
				tipo: 'foto',
				src: n25Grupo,
				alt: 'Foto grupal de las personas asistentes a la conferencia 9punto5 2025 con el letrero de la conferencia.',
				marco: 'polaroid',
				pie: 'La comunidad 9punto5 ♡',
				formato: 3 / 2,
				cinta: 'arriba',
				x: 5,
				y: 24,
				w: 62,
				rot: -3,
			},
			{
				tipo: 'recorte',
				src: n25Credencial,
				alt: 'Credencial de 9punto5 2025 con el nombre Catalina Callejas.',
				x: 52,
				y: 38,
				w: 17,
				rot: -2,
				movil: { x: 78, y: 42, w: 14 },
			},
			{
				tipo: 'nota',
				papel: 'escrito',
				texto: 'Facilitando mesas de conversación',
				x: 71,
				y: 48,
				w: 28,
				rot: 4,
				movil: { x: 36, y: 63, w: 62 },
			},
			{
				tipo: 'flecha',
				variante: 1,
				voltear: true,
				x: 50,
				y: 58,
				w: 18,
				rot: 20,
				movil: { x: 22, y: 58, w: 12 },
			},
			{
				tipo: 'video',
				src: `${VIDEOS}/9punto5-facilitando.mp4`,
				poster: n25PosterFacilitando,
				titulo: 'Cata facilitando una mesa de conversación en 9punto5 2025.',
				formato: 420 / 640,
				x: 4,
				y: 65,
				w: 25,
				rot: -3,
				movil: { x: 4, y: 63, w: 25 },
			},
			{
				tipo: 'recorte',
				src: n25Microfono,
				alt: 'Cata con micrófono y tablet, moderando una conversación.',
				x: 31,
				y: 64,
				w: 26,
				movil: { x: 53, y: 75, w: 18 },
			},
			{
				tipo: 'recorte',
				src: n25Reencuentro,
				alt: 'Selfie de Cata con una amiga en la conferencia, ambas sonriendo.',
				contorno: true,
				x: 58,
				y: 61,
				w: 34,
				rot: 4,
				movil: { x: 72, y: 76, w: 26 },
			},
			{
				tipo: 'nota',
				papel: 'escrito',
				texto: '¡Reencuentros!',
				x: 62,
				y: 93,
				w: 34,
				rot: -3,
				movil: { x: 2, y: 90, w: 50 },
			},
		],
		der: [
			{ tipo: 'titulo', texto: '10 años', x: 8, y: 3, w: 50, rot: -4 },
			{ tipo: 'etiqueta', texto: '12–14 NOV 2026', x: 8, y: 15, w: 50, rot: -2 },
			{
				tipo: 'recorte',
				src: n26Pizarra,
				alt: 'Pizarra de tiza que dice «Evento privado, 9.5, diez años, te damos la bienvenida».',
				x: 62,
				y: 1,
				w: 32,
				rot: 5,
				movil: { x: 72, y: 1, w: 26 },
			},
			{
				tipo: 'foto',
				src: n26Afiche,
				alt: 'Gráfica «Voy a facilitar en 9punto5, 9punto5 · 10 años, Catalina Callejas, 12, 13 y 14 de noviembre de 2026, Valdivia, Chile».',
				marco: 'borde',
				clip: true,
				formato: 4 / 5,
				x: 6,
				y: 25,
				w: 34,
				rot: -4,
			},
			{
				tipo: 'foto',
				src: n26Escenario,
				alt: 'Cata en el escenario de 9punto5 2026, frente a la pantalla.',
				marco: 'borde',
				cinta: 'arriba',
				formato: 9 / 16,
				x: 42,
				y: 32,
				w: 25,
				rot: 3,
			},
			{
				tipo: 'foto',
				src: n26Soberania,
				alt: 'Captura del programa: mesa de conversación «Soberanía: autonomía digital y el valor de la tecnología local».',
				marco: 'telefono',
				x: 72,
				y: 36,
				w: 23,
				rot: 5,
			},
			{
				tipo: 'cifra',
				numero: '4',
				texto: 'mesas moderadas',
				x: 4,
				y: 68,
				w: 28,
				rot: -3,
				movil: { w: 32 },
			},
			{ tipo: 'flecha', variante: 2, x: 6, y: 50, w: 26, rot: -10 },
			{
				tipo: 'recorte',
				src: n26Reencuentro,
				alt: 'Selfie de Cata con una amiga en los pasillos de la conferencia.',
				contorno: true,
				x: 35,
				y: 70,
				w: 20,
				rot: -3,
				movil: { x: 37, y: 70, w: 17 },
			},
			{
				tipo: 'recorte',
				src: n26Credencial,
				alt: 'Credencial de 9punto5 diez años, 12 al 14 de noviembre de 2026, Valdivia.',
				x: 54,
				y: 72,
				w: 20,
				rot: -4,
			},
			{
				tipo: 'recorte',
				src: n26Llama,
				alt: 'Llamita tejida de recuerdo.',
				x: 86,
				y: 76,
				w: 11,
				rot: 6,
			},
		],
	},
	{
		id: 'mas-mujeres-en-ux',
		nombre: 'Más mujeres en UX',
		color: '#f4b4cf',
		papel: '#fbf3f1',
		fondo: 'rayas',
		logo: mmLogo,
		resumen: {
			anios: '2023 – 2025',
			portada: mmEquipoRegiones,
			alt: 'Seis mujeres de +Mujeres en UX posan juntas y sonríen.',
			recorte: true,
		},
		izq: [
			{
				tipo: 'recorte',
				src: mmLogo,
				alt: '+Mujeres en UX Chile',
				x: 6,
				y: 3,
				w: 42,
				rot: -4,
			},
			{ tipo: 'titulo', texto: 'Track regiones', x: 52, y: 1, w: 46, rot: -6 },
			{
				tipo: 'ficha',
				texto: 'Coordinadora track regiones · 2023 – 2025',
				x: 52,
				y: 25,
				w: 42,
				rot: 3,
				movil: { x: 50, y: 22, w: 48 },
			},
			{
				tipo: 'foto',
				src: mmEncuentro1,
				alt: 'Participantes del primer encuentro de +Mujeres en UX en la V región, reunidas en Valparaíso.',
				marco: 'polaroid',
				pie: '1er encuentro, Valparaíso',
				formato: 16 / 9,
				cinta: 'esquinas',
				x: 4,
				y: 28,
				w: 46,
				rot: -3,
				movil: { w: 44 },
			},
			{
				tipo: 'cifra',
				numero: '20',
				texto: 'mujeres en el 1er encuentro',
				x: 63,
				y: 46,
				w: 34,
				rot: 3,
				movil: { x: 64, y: 49, w: 34 },
			},
			{
				tipo: 'recorte',
				src: mmEquipoRegiones,
				alt: 'Seis mujeres de +Mujeres en UX posan juntas y sonríen.',
				contorno: true,
				x: 4,
				y: 60,
				w: 54,
				rot: 2,
				movil: { y: 61, w: 58 },
			},
			{
				tipo: 'recorte',
				src: mmPin,
				alt: 'Pin de +Mujeres en UX Chile.',
				x: 74,
				y: 69,
				w: 16,
				rot: 10,
				movil: { x: 80, y: 72, w: 14 },
			},
			{
				tipo: 'enlace',
				texto: 'Lee la historia completa →',
				href: '/palabras/mujeres-en-ux-chile-regiones',
				x: 54,
				y: 88,
				w: 44,
				rot: -3,
				movil: { x: 40, y: 84, w: 50 },
			},
		],
		der: [
			{
				tipo: 'etiqueta',
				texto: '2024 · VALPARAÍSO Y VIÑA',
				x: 6,
				y: 3,
				w: 58,
				rot: -2,
				movil: { x: 2, y: 2 },
			},
			{
				tipo: 'foto',
				src: mmEncuentro2,
				alt: 'Participantes del segundo encuentro, una completada en Viña del Mar.',
				marco: 'borde',
				clip: true,
				fecha: 'COMPLETADA · VIÑA',
				formato: 16 / 9,
				x: 6,
				y: 12,
				w: 50,
				rot: 2,
			},
			{
				tipo: 'video',
				src: `${VIDEOS}/mujeres-encuentro.mp4`,
				poster: mmPosterEncuentro,
				titulo:
					'Una expositora conversa con las asistentes en un encuentro de +Mujeres en UX, noviembre de 2024.',
				formato: 9 / 16,
				x: 62,
				y: 12,
				w: 32,
				rot: 3,
				movil: { x: 62, y: 11 },
			},
			{
				tipo: 'foto',
				src: mmEncuentro3,
				alt: 'Participantes del tercer encuentro, sobre experiencias y negociación, en Viña del Mar.',
				marco: 'polaroid',
				pie: '3er encuentro: experiencias y negociación',
				formato: 16 / 9,
				cinta: 'arriba',
				x: 4,
				y: 43,
				w: 54,
				rot: -2,
			},
			{
				tipo: 'foto',
				src: mmActividad,
				alt: 'Asistentes sentadas en el suelo trabajando en una actividad grupal.',
				marco: 'borde',
				formato: 9 / 16,
				x: 64,
				y: 56,
				w: 22,
				rot: 5,
			},
			{
				tipo: 'foto',
				src: mmEquipo2025,
				alt: 'El equipo del track regiones de +Mujeres en UX Chile en 2025.',
				marco: 'borde',
				fecha: 'EQUIPO 2025',
				formato: 1400 / 534,
				x: 4,
				y: 79,
				w: 50,
				rot: -3,
			},
			{
				tipo: 'nota',
				papel: 'escrito',
				texto: 'No estamos solas ♡',
				x: 62,
				y: 91,
				w: 36,
				rot: -4,
				movil: { x: 60, y: 86, w: 38 },
			},
		],
	},
	{
		id: 'circulo-de-mujeres',
		nombre: 'Círculo de mujeres',
		color: '#c3b5f7',
		papel: '#f8f4fc',
		fondo: 'puntos',
		logo: logoCirculo,
		altoMovil: [1.9, 1.9],
		logoFondo: '#3f3a44',
		// Figures from Cata's own presentation about the Círculo de Mujeres.
		resumen: {
			anios: '2022 – 2025',
			portada: cmGrupoCirculo,
			alt: 'Foto grupal del Círculo de Mujeres con los brazos en alto.',
			recorte: true,
		},
		izq: [
			{ tipo: 'titulo', texto: 'Círculo de Mujeres', x: 6, y: 3, w: 80, rot: -4 },
			{
				tipo: 'etiqueta',
				texto: 'BBK + 2BRAINS',
				x: 8,
				y: 25,
				w: 40,
				rot: -2,
				movil: { x: 4, y: 17 },
			},
			{
				tipo: 'ficha',
				texto: 'Coordinadora · 2022 – 2025',
				x: 56,
				y: 25,
				w: 40,
				rot: 3,
				movil: { x: 40, y: 24, w: 58 },
			},
			{
				tipo: 'recorte',
				src: cmGrupoCirculo,
				alt: 'Foto grupal del Círculo de Mujeres: unas treinta mujeres con poleras del círculo celebran con los brazos en alto.',
				x: 3,
				y: 34,
				w: 46,
				rot: -3,
				movil: { x: 3, y: 37, w: 48 },
			},
			{
				tipo: 'nota',
				papel: 'escrito',
				tam: 4.6,
				texto:
					'Nació como una idea propia en noviembre de 2022 y se volvió de todas: una mesa de trabajo con 32 compañeras voluntarias le dio forma.',
				x: 56,
				y: 46,
				w: 41,
				rot: 2,
				movil: { x: 54, y: 38, w: 44 },
			},
			{
				tipo: 'nota',
				papel: 'postit',
				tam: 4.4,
				texto: '«Un espacio de apoyo mutuo y de ideas»',
				x: 3,
				y: 74,
				w: 29,
				rot: -5,
				movil: { x: 2, y: 64, w: 44 },
			},
			{
				tipo: 'recorte',
				src: cmSticker,
				alt: 'Sticker «Sororidad es revolución», Círculo de Mujeres BBK+2BRAINS.',
				x: 40,
				y: 77,
				w: 48,
				rot: -6,
				movil: { x: 30, y: 84, w: 46 },
			},
		],
		der: [
			{
				tipo: 'cifra',
				numero: '10',
				texto: 'sesiones',
				x: 1,
				y: 2,
				w: 22,
				rot: -4,
				movil: { x: 2, y: 1, w: 46 },
			},
			{
				tipo: 'cifra',
				numero: '~30',
				texto: 'mujeres por sesión',
				x: 24,
				y: 4,
				w: 26,
				rot: 2,
				movil: { x: 50, y: 1, w: 48 },
			},
			{
				tipo: 'cifra',
				numero: '18',
				texto: 'temáticas',
				x: 51,
				y: 2,
				w: 22,
				rot: -3,
				movil: { x: 2, y: 18, w: 46 },
			},
			{
				tipo: 'cifra',
				numero: '6,5',
				texto: 'evaluación final (1 a 7)',
				x: 75,
				y: 4,
				w: 24,
				rot: 1,
				movil: { x: 50, y: 18, w: 48 },
			},
			{
				tipo: 'etiqueta',
				texto: '8/03/2023 → 8/03/2024',
				x: 20,
				y: 31,
				w: 60,
				rot: -1,
				movil: { x: 4, y: 36 },
			},
			{
				tipo: 'foto',
				src: cmValoracion,
				alt: 'Sesión en línea del Círculo de Mujeres con la lámina «Valoración de lo diferente» y la expositora en cámara.',
				marco: 'pantalla',
				x: 3,
				y: 39,
				w: 52,
				rot: -2,
				movil: { x: 3, y: 44, w: 50 },
			},
			{
				tipo: 'nota',
				papel: 'tarjeta',
				tam: 4.1,
				texto:
					'Hablamos de liderazgo, carga mental, techo de cristal, maternidad, sororidad, neurodivergencia… ¡y más!',
				x: 58,
				y: 39,
				w: 39,
				rot: 3,
				movil: { x: 4, y: 63, w: 92 },
			},
			{
				tipo: 'foto',
				src: cmCharla,
				alt: 'Cata presenta frente a un grupo de mujeres en una sala de 2Brains.',
				marco: 'borde',
				cinta: 'esquinas',
				formato: 3 / 2,
				x: 3,
				y: 64,
				w: 38,
				rot: -4,
				movil: { x: 58, y: 45, w: 37 },
			},
			{
				tipo: 'foto',
				src: cmParticipantes,
				alt: 'Sesión en línea del Círculo de Mujeres con la grilla de participantes en cámara.',
				marco: 'pantalla',
				x: 52,
				y: 78,
				w: 42,
				rot: 3,
				movil: { x: 3, y: 88, w: 33 },
			},
			{
				tipo: 'recorte',
				src: cmTarjeta,
				alt: 'Tarjeta «En este 8 de marzo, te regalamos sororidad» con un dulce, del Círculo de Mujeres.',
				x: 28,
				y: 76,
				w: 24,
				rot: 8,
				movil: { x: 50, y: 89, w: 22 },
			},
		],
	},
];
