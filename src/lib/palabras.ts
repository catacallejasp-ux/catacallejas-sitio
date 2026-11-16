import { getCollection } from 'astro:content';

/** Published articles, newest first. */
export async function getPalabras() {
	return (await getCollection('palabras', ({ data }) => !data.draft)).sort(
		(a, b) => b.data.date.getTime() - a.data.date.getTime(),
	);
}

export const urlPalabra = (id: string) => `/palabras/${id}`;

/** 16/05/2024 — short date for lists. UTC so the day never shifts with the build's timezone. */
export const fechaCorta = (d: Date) => d.toISOString().slice(0, 10).split('-').reverse().join('/');

/** 16 de mayo de 2024 — long date for the article header. */
export const fechaLarga = (d: Date) =>
	d.toLocaleDateString('es-CL', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	});

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
