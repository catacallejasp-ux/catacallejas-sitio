// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Astro bundles Vite as its dev server and build engine — no separate install.
// Add integrations with `pnpm astro add react` / `pnpm astro add tailwind`.
export default defineConfig({
	// Set this to the deployed origin, with no trailing path. It is the first thing
	// to do in a new site: canonical links, og:url, og:image and `astro add sitemap`
	// all need it, and BaseLayout omits them entirely until it is set.
	// See docs/ADR/0003-absolute-url-metadata-requires-a-configured-site.md
	site: 'https://catacallejas.cl',
	integrations: [sitemap()],

	// Old addresses (before the November 2026 reorganisation) keep working.
	// /hablando is not used: catacallejas.cl/hablando is the talk's own subsite.
	redirects: {
		'/aprender': '/hablando-nuestro-trabajo',
		'/herramientas': '/artefactos',
		'/comunidad': '/sobre-mi',
		'/comunidad/circulo-de-mujeres': '/sobre-mi/voluntariados/circulo-de-mujeres',
		'/comunidad/hackaton-ai-2023': '/sobre-mi/voluntariados/hackaton-ai-2023',
		'/comunidad/mujeres-en-ux-regiones': '/sobre-mi/voluntariados/mujeres-en-ux-regiones',
		'/proyectos/petrobras': '/sobre-mi/proyectos/aramco',
		'/proyectos/achs': '/sobre-mi/proyectos/achs',
		'/proyectos/cchc': '/sobre-mi/proyectos/cchc',
		'/proyectos/cencosud': '/sobre-mi/proyectos/cencosud',
		'/proyectos/mach': '/sobre-mi/proyectos/mach',
		'/proyectos/red-salud': '/sobre-mi/proyectos/red-salud',
		'/proyectos/trabajos-en-obra': '/sobre-mi/proyectos/trabajos-en-obra',
		'/casos/aera': '/sobre-mi',
		'/casos/libres-app': '/sobre-mi',
		'/casos/pawer': '/sobre-mi',
	},

	// Poppins is the primary typeface (headings, buttons, navigation; it is the one in
	// the portfolio cover) and Plus Jakarta Sans the secondary one (body text). Astro
	// downloads both at build time and serves them from this site — no request to
	// Google happens in the visitor's browser.
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Poppins',
			cssVariable: '--font-poppins',
			weights: [400, 500, 600, 700],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
		{
			// Secondary typeface: body text.
			provider: fontProviders.google(),
			name: 'Plus Jakarta Sans',
			cssVariable: '--font-jakarta',
			weights: [400, 500, 600, 700],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
	],
});
