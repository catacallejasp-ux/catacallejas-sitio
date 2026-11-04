import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * One collection per content type, one Markdown file per entry. Adding a project,
 * an event or a talk means adding a file to the matching folder in `src/content/`.
 * Files whose name starts with `_` are ignored (use them as templates).
 *
 * Collections with no files yet (recursos, capitulos) make Astro log
 * "No files found" during the build. That is expected and goes away with the
 * first entry.
 */
const md = (folder: string) => glob({ pattern: '**/[^_]*.md', base: `./src/content/${folder}` });

const proyectos = defineCollection({
	loader: md('proyectos'),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			/** Main challenge, verbatim from the portfolio. Used as the meta description. */
			description: z.string(),
			cover: image().optional(),
			coverAlt: z.string().optional(),
			/** Focus of the cover in the carousel card, as CSS object-position («75% 50%»). */
			coverFocus: z.string().optional(),
			/** Name of the work itself («Portal MiRedSalud»), highlighted in the facts band. */
			nombre: z.string().optional(),
			/** Client logo shown instead of the title: file name in src/assets/logos/ (no .svg). */
			logo: z.string().optional(),
			/** «¿Qué es?»: what the product or project is, in two or three lines. */
			queEs: z.string().optional(),
			/*
			 * Structured sections, rendered with their own layout after the body. A project
			 * that sets them leaves the same headings out of its Markdown.
			 */
			/** «Desafíos» and «Hitos»: two boxes side by side. */
			desafios: z.array(z.string()).default([]),
			/** Optional sentence above the «Desafíos» list. */
			desafiosIntro: z.string().optional(),
			hitos: z.array(z.string()).default([]),
			/** «El proceso» as a step-by-step roadmap. */
			proceso: z.array(z.object({ titulo: z.string(), texto: z.string().optional() })).default([]),
			/** Before / after comparison with a slider; both images must share a ratio. */
			antesDespues: z
				.object({
					titulo: z.string(),
					antes: image(),
					antesAlt: z.string(),
					despues: image(),
					despuesAlt: z.string(),
					mejoras: z.array(z.string()).default([]),
				})
				.optional(),
			/** Swipeable image carousel (e.g. documentation). */
			galeria: z
				.object({
					titulo: z.string().optional(),
					imagenes: z.array(
						z.object({ src: image(), alt: z.string(), caption: z.string().optional() }),
					),
				})
				.optional(),
			start: z.coerce.date(),
			end: z.coerce.date().optional(),
			dateLabel: z.string(),
			methodology: z.string().optional(),
			roles: z.array(z.string()),
			tasks: z.array(z.string()).default([]),
			tools: z.array(z.string()).default([]),
			employer: z.enum(['2brains', 'bc-tecnologia', 'sii-transbank', 'bonsai', 'otro']).optional(),
			results: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
			draft: z.boolean().default(false),
		}),
});

/** Roles in the CV. Higher `order` = more recent. */
const trayectoria = defineCollection({
	loader: md('trayectoria'),
	schema: z.object({
		company: z.string(),
		role: z.string(),
		periodLabel: z.string(),
		order: z.number(),
		bullets: z.array(z.string()),
		/** Slugs of files in src/content/proyectos. */
		projects: z.array(z.string()).default([]),
		keyProjects: z.string().optional(),
		clients: z.array(z.string()).default([]),
		/** Optional label next to the company, e.g. «Actualidad» for the current role. */
		tag: z.string().optional(),
	}),
});

// Hidden for now — uncomment and register below to restore «Notas breves».
// const notas = defineCollection({
// 	loader: md('notas'),
// 	schema: z.object({ title: z.string(), date: z.coerce.date() }),
// });

// Hidden for now — uncomment and register below to restore «Ahora».
// /** A single entry: what Cata is doing right now. */
// const ahora = defineCollection({
// 	loader: md('ahora'),
// 	schema: z.object({ text: z.string(), updated: z.coerce.date() }),
// });

/** Community and internal initiatives with their own detail page under /sobre-mi/voluntariados/. */
const iniciativas = defineCollection({
	loader: md('iniciativas'),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			/** Main challenge, verbatim from the portfolio. */
			description: z.string(),
			start: z.coerce.date(),
			dateLabel: z.string(),
			roles: z.array(z.string()),
			organization: z.string().optional(),
			cover: image().optional(),
			coverAlt: z.string().optional(),
			/** Same structured sections as a project (see `proyectos`). */
			coverFocus: z.string().optional(),
			queEs: z.string().optional(),
			desafios: z.array(z.string()).default([]),
			desafiosIntro: z.string().optional(),
			hitos: z.array(z.string()).default([]),
			proceso: z.array(z.object({ titulo: z.string(), texto: z.string().optional() })).default([]),
			galeria: z
				.object({
					titulo: z.string().optional(),
					imagenes: z.array(
						z.object({ src: image(), alt: z.string(), caption: z.string().optional() }),
					),
				})
				.optional(),
			results: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
		}),
});

export const collections = {
	proyectos,
	trayectoria,
	// Sections no longer on the site (casos, eventos, charlas…) are kept in
	// /contenido-archivado, outside src/; see its LEEME.md to restore one.
	iniciativas,
};
