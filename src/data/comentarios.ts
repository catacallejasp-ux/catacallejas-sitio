/**
 * Comments on «Palabras» articles, stored in Supabase (table and permissions:
 * supabase/comentarios.sql). Both values are public by design: the key only lets
 * readers see approved comments and send new ones, which stay pending until
 * approved in the Supabase dashboard.
 *
 * Supabase → Project Settings → API: «Project URL» and the publishable/anon key.
 * While either is empty, articles show no comments section at all.
 */
export const comentarios = {
	url: 'https://gqkshaghzjgpgfwztcvh.supabase.co',
	clave: 'sb_publishable_iwnj_7y6W2HgYdDCeljemA_hJsvNGmQ',
};

export const comentariosActivos = Boolean(comentarios.url && comentarios.clave);
