/**
 * Site-wide data that is not a collection: profile, contact, CV blocks and the
 * fixed copy of each page. Content from the handoff document (sections 6–8).
 * Anything still missing is `undefined` and marked TODO(content).
 */

export const perfil = {
	nombre: 'Catalina Callejas',
	nombreCorto: 'Cata Callejas',
	cargo: 'UX & Product Designer',
	ciudad: 'Valparaíso',
	email: 'cata.callejasp@gmail.com',
	linkedin: 'https://www.linkedin.com/in/catalina-callejas/',
	// The phone is in the printed CV only; it is not published on the site.
};

/** The CV served from public/cv/. Update `size` if the file changes. */
export const cvPdf: { href: string; size?: string } | undefined = {
	href: '/cv/CV-Catalina-Callejas-2026.pdf',
	size: 'PDF, 103 KB',
};

export const sobreMi = {
	texto:
		'Product Designer y Profesora de Castellano de formación. Me apasiona el diseño de productos en todas sus aristas. Mi objetivo es mejorar las experiencias haciéndolas usables, accesibles y eficientes y, principalmente, contribuir a los objetivos de las organizaciones mejorando la calidad de vida de las personas.',
	tags: [
		'Product Designer',
		'Experta en research y contenidos',
		'Consultora UX',
		'Especialista en e-learning',
	],
};

export const educacion = [
	{
		titulo: 'Diploma en Diseño de Experiencia de Usuario para Productos Digitales (DUX)',
		lugar: 'PUCV',
		periodo: '2024',
	},
	{
		titulo: 'Pedagogía en Castellano y Licenciatura en Educación',
		lugar: 'UCSH',
		periodo: '2017 – 2021',
	},
];

export const certificaciones: { titulo: string; emisor: string; anio?: string; url?: string }[] = [
	{ titulo: 'UX Strategy & Business', emisor: 'U. Finis Terrae' },
	{
		titulo: 'Design System',
		emisor: 'Espacio UX',
		anio: '2025',
		url: 'https://credsverse.com/credentials/67d32a09-491c-4245-937b-1825d62cbd96',
	},
	{ titulo: 'Start writing Prompts', emisor: 'Google', anio: '2025' },
	{ titulo: 'Product Design', emisor: 'Sol Mesz', anio: '2025' },
	{ titulo: 'Forward Program', emisor: 'McKinsey', anio: '2025' },
	{ titulo: 'Customer Experience', emisor: 'Coder House', anio: '2023' },
	{ titulo: 'UX-UI y UX Writing', emisor: 'Coder House', anio: '2022' },
];

export const voluntariados: {
	titulo: string;
	organizacion: string;
	periodo: string;
	texto: string;
	/** Detail page under /sobre-mi/voluntariados/, when there is one. */
	href?: string;
}[] = [
	{
		titulo: 'Coordinadora Track regiones',
		organizacion: '+Mujeres en UX Chile',
		periodo: '2023 – 2025',
		texto:
			'Coordinó un equipo de voluntarias en un programa piloto regional en la región de Valparaíso.',
		href: '/sobre-mi/voluntariados/mujeres-en-ux-regiones',
	},
	{
		titulo: 'Coordinadora',
		organizacion: 'Círculo de Mujeres 2Brains',
		periodo: '2022 – 2025',
		texto: 'Ciclo de conversatorios, espacios de diálogo, mentoría y apoyo profesional.',
		href: '/sobre-mi/voluntariados/circulo-de-mujeres',
	},
	{
		titulo: 'Líder de equipo',
		organizacion: 'Hackatón AI 2023 · 2Brains',
		periodo: '2023',
		texto:
			'Lideró el equipo que creó SOFIA, una plataforma de planificación de clases con ChatGPT, y ganó el premio a la «Mejor idea».',
		href: '/sobre-mi/voluntariados/hackaton-ai-2023',
	},
];

export const especialidades = [
	{
		titulo: 'Diseño y prototipado',
		texto: 'Figma avanzado, wireframing, diseño responsive, prototipado interactivo',
	},
	{
		titulo: 'Investigación',
		texto: 'Entrevistas, encuestas, evaluaciones heurísticas, testing, card sorting',
	},
	{ titulo: 'Análisis y medición', texto: 'Maze, Google Analytics, A/B testing, CSAT, NPS' },
	{
		titulo: 'IA y automatización',
		texto: 'ChatGPT, Perplexity, Figma Make, Claude, prompt engineering',
	},
	{
		titulo: 'Metodologías',
		texto: 'Design Systems, User-Centered Design, Agile/Scrum, Design Thinking',
	},
	{
		titulo: 'Gestión y colaboración',
		texto: 'Stakeholders, facilitación, Jira, Monday, Trello, Miró',
	},
];

/**
 * «Flujo de trabajo» on /sobre-mi: six steps in three groups, with a loop from step 5
 * back to step 3 (the process iterates).
 */
export const flujoTrabajo = {
	grupos: [
		{
			nombre: 'Entender',
			tono: 'teal' as const,
			pasos: [
				{
					titulo: 'Definir el problema y el rol de la IA',
					texto:
						'Parto por la necesidad de las personas y del negocio, y decido qué hace la IA y qué decide siempre la persona.',
				},
				{
					titulo: 'Investigar con apoyo de IA',
					texto:
						'Entrevistas, encuestas y evaluaciones heurísticas, y uso IA para explorar el contexto y sintetizar hallazgos (Perplexity, ChatGPT, Claude).',
				},
			],
		},
		{
			nombre: 'Diseñar con IA',
			tono: 'violet' as const,
			pasos: [
				{
					titulo: 'Prototipar con IA',
					texto:
						'Diseño en Figma y pruebo prompts y respuestas reales desde el inicio. Uso Figma Make para explorar ideas rápido y cuido el contenido que la IA entrega.',
				},
				{
					titulo: 'Integrar la IA en el flujo de la persona',
					texto:
						'Diseño cómo se genera, revisa, edita y corrige el contenido de la IA dentro del producto, como en la plataforma generativa Content Velocity Manager.',
				},
			],
		},
		{
			nombre: 'Validar y entregar',
			tono: 'sky' as const,
			pasos: [
				{
					titulo: 'Probar y medir',
					texto:
						'Testing de usabilidad, A/B testing y métricas como task success, CSAT y conversión, para ver si la IA realmente ayuda.',
				},
				{
					titulo: 'Handoff listo para construir',
					texto:
						'Documento todo lo necesario para pasar del diseño al código: estructura, componentes, contenido real, comportamientos y criterios de aceptación para agentes de IA y equipos humanos.',
				},
			],
		},
	],
	ciclo: { desde: 5, hasta: 3, etiqueta: 'Iterar' },
};

/**
 * «Lo que estoy haciendo» on the home page, newest first: a graphic and a short text
 * ending in a link. Graphics live in src/assets/novedades/ (`imagen` is the file
 * name); without one the card shows a pending placeholder.
 */
export const novedades: {
	imagen?: string;
	/** What the graphic says, for people who can't see it. */
	alt?: string;
	texto: string;
	enlace: { href: string; texto: string };
	/** Text after the link. */
	cierre?: string;
}[] = [
	{
		imagen: '9punto5-2026.png',
		alt: 'Gráfica: Voy a facilitar en 9punto5. 9punto5, 10 años. Catalina Callejas. 12, 13 y 14 de noviembre de 2026, Valdivia, Chile.',
		texto: 'Este año, al igual que en 2025, estaré facilitando espacios en 9punto5, Valdivia. Más información en',
		enlace: { href: 'https://9punto5.cl/', texto: '9punto5.cl' },
		cierre: '. ¡Nos vemos allá! 💚',
	},
	{
		imagen: 'voces-conversando-2026.png',
		alt: 'Gráfica de +Voces conversando Chile: «Y a ti, ¿cómo te está yendo?». Una conversación sincera sobre la industria de la tecnología y el diseño en Chile con Catalina Callejas, facilitadora, y Bárbara Letelier, Product Lead en Creditú. 29 de octubre, 19 h, transmisión en vivo por Instagram.',
		texto: 'En mi voluntariado con +Voces en Diseño, soy facilitadora del nuevo espacio «+Voces conversando», que ya tuvo su primera versión el pasado 29/10 en Instagram Live. Míralo completo en',
		enlace: { href: 'https://www.instagram.com/reel/DfGJbuJkZM6/', texto: 'Instagram' },
		cierre: '.',
	},
];

/** Herramienta «Revisa tu pitch» (página /artefactos, Hablando y destacado del inicio). */
export const revisaTuPitch = {
	titulo: 'Revisa tu pitch',
	// Claude artifact; it cannot be embedded, so it opens in a new tab.
	url: 'https://claude.ai/artifact/Xm6s1u3qReM5qDCw2shPsA' as string | undefined,
	pasos: [
		'Cuéntale tu idea y a quién se la vas a presentar',
		'Recibe una guía para antes, durante y después',
		'Preséntala con calma y confianza',
	],
};

/**
 * Other artifacts on /artefactos, under «Revisa tu pitch». `icono` is inline SVG
 * on a 32 × 32 grid (stroke icons, drawn with currentColor).
 */
export const otrosArtefactos = [
	{
		titulo: 'Mudanza',
		descripcion:
			'Organizador para planear tu mudanza. Define imprescindibles, guarda y compara deptos con checklist de visita, y lleva tareas por etapas con fecha.',
		url: 'https://claude.ai/artifact/ToeaVZXfAR7m9RQvSERBwE#imprescindibles',
		// moving box
		icono:
			'<path d="M4 11 16 5l12 6v12l-12 6-12-6Z"/><path d="m4 11 12 6 12-6M16 17v12"/><path d="m10 8 12 6v4"/>',
	},
	{
		titulo: 'Casillero de notas',
		descripcion:
			'Notas que se ordenan solas por tipo y categoría. Adjunta archivos, busca y filtra por fecha, corrige clasificaciones y protege con PIN opcional.',
		url: 'https://claude.ai/artifact/AXJAfuyxG26cpya1encXUC',
		// note sheets with a lock
		icono:
			'<rect x="5" y="4" width="16" height="22" rx="2"/><path d="M9 10h8M9 14h8M9 18h4"/><rect x="19" y="20" width="9" height="8" rx="1.5"/><path d="M21 20v-2a2.5 2.5 0 0 1 5 0v2"/>',
	},
];

/** Clients listed in the handoff (§6.5). Not shown as a strip; used for the hero figure. */
export const clientes = [
	'Cencosud',
	'MACH BANK',
	'Achs',
	'Red Salud',
	'Petrobras',
	'Metlife',
	'Provida',
	'BCI',
	'Caja Los Andes',
	'CChC',
];

/**
 * Client logos for the home band, in display order. `file` is the name of the SVG in
 * src/assets/logos/ (monochrome, fill="currentColor"; vectorised from the /hablando
 * site, not official brand files).
 */
export const logosClientes = [
	{ file: 'cencosud', nombre: 'Cencosud' },
	{ file: 'mach-bank', nombre: 'MACH BANK' },
	{ file: 'transbank', nombre: 'Transbank' },
	{ file: 'achs', nombre: 'Achs' },
	{ file: 'red-salud', nombre: 'Red Salud' },
	// TODO(content): confirmar el nombre del cliente. El sitio /hablando rotulaba este logo como «Petrobras».
	{ file: 'aramco', nombre: 'Aramco' },
	{ file: 'metlife', nombre: 'MetLife' },
	{ file: 'provida-afp', nombre: 'Provida' },
	{ file: 'bci', nombre: 'BCI' },
	{ file: 'caja-los-andes', nombre: 'Caja Los Andes' },
	{ file: 'cchc', nombre: 'CChC' },
];

/** Step names for the animated mockup of the tool (one per screenshot pair). */
export const pasosDemo = [
	'Cuéntame sobre tu idea',
	'Completa el formulario',
	'Resumen',
	'Antes',
	'Durante',
	'Después',
];

/** Figures and sectors for the «Mi trayectoria» bento on the home page (given by Cata). */
export const trayectoriaResumen = {
	experiencia: { valor: '+5', unidad: 'años', texto: 'diseñando productos digitales complejos' },
	empresas: { valor: '+15', unidad: 'empresas', texto: 'con las que he trabajado' },
	voluntariado: {
		valor: '+10',
		unidad: 'años',
		texto: 'como voluntaria',
		detalle: '+Mujeres en UX Chile y Círculo de Mujeres 2Brains',
	},
	rubros: [
		'Retail',
		'Banca',
		'Medios de pago',
		'Salud',
		'Gremios',
		'Minería',
		'Industria artística',
	],
};
