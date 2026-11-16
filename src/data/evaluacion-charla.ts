/**
 * Evaluation of the talk «Hablando nuestro trabajo», shown in «Así se vive la charla».
 *
 * Snapshot of the feedback form (Google Forms → Sheets), taken 16 nov 2026:
 * 20 anonymous responses, talk of 4 nov 2026. To update it, count the answers again
 * and replace the numbers below; the chart and averages are computed from them.
 */

/** Overall rating, 1–5: how many people gave each score. */
export const notaGeneral: Record<1 | 2 | 3 | 4 | 5, number> = { 5: 18, 4: 2, 3: 0, 2: 0, 1: 0 };

/** Rating per item, 1–5: how many people gave each score. */
export const porItem: { item: string; votos: Record<1 | 2 | 3 | 4 | 5, number> }[] = [
	{ item: 'Dinámica', votos: { 5: 14, 4: 6, 3: 0, 2: 0, 1: 0 } },
	{ item: 'Ritmo', votos: { 5: 14, 4: 6, 3: 0, 2: 0, 1: 0 } },
	{ item: 'Duración', votos: { 5: 12, 4: 6, 3: 2, 2: 0, 1: 0 } },
];

/** «¿Sientes que lo aprendido te será de utilidad en tu desarrollo profesional?» */
export const utilidad = { si: 20, total: 20 };

/**
 * Keywords from the positive comments, shown as tags at the end of the sentence
 * «…las personas consideran que esta charla es …», so each one must read after «es».
 */
export const palabrasClave = [
	'Clara',
	'Entretenida',
	'Muy útil',
	'Excelente de principio a fin',
	'Para repetir',
	'Para todos los equipos',
];

export const total = (v: Record<number, number>) => Object.values(v).reduce((a, b) => a + b, 0);
export const promedio = (v: Record<number, number>) =>
	Object.entries(v).reduce((s, [nota, n]) => s + Number(nota) * n, 0) / total(v);
/** 4,9 — one decimal, Chilean format. */
export const formatoNota = (x: number) =>
	x.toLocaleString('es-CL', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
