import { perfil } from '../data/cv';

/** schema.org Person, used on / and /sobre-mi. */
export function personJsonLd(site: URL | undefined) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: perfil.nombre,
		alternateName: perfil.nombreCorto,
		jobTitle: perfil.cargo,
		email: `mailto:${perfil.email}`,
		address: { '@type': 'PostalAddress', addressLocality: perfil.ciudad, addressCountry: 'CL' },
		sameAs: [perfil.linkedin],
		...(site ? { url: site.href } : {}),
	};
}
