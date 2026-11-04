import { getCollection } from 'astro:content';

export async function getProyectos() {
	return (await getCollection('proyectos', (p) => !p.data.draft)).sort(
		(a, b) => b.data.start.getTime() - a.data.start.getTime(),
	);
}
