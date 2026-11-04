# Cata Callejas · sitio personal

Landing page personal de Catalina Callejas, UX & Product Designer. Hecha con
[Astro](https://astro.build) a partir de
[astro-template](https://github.com/cris-achiardi/astro-template).

## Empezar

```sh
pnpm install
pnpm dev        # http://localhost:4321
```

## Mapa del sitio

| Dirección                              | Página                                             | Archivo                                        |
| -------------------------------------- | -------------------------------------------------- | ---------------------------------------------- |
| `/`                                    | Inicio                                             | `src/pages/index.astro`                        |
| `/hablando-nuestro-trabajo`            | Hablando (la charla, su presentación y artefacto)  | `src/pages/hablando-nuestro-trabajo.astro`     |
| `/artefactos`                          | Artefactos                                         | `src/pages/artefactos.astro`                   |
| `/sobre-mi`                            | Sobre mí                                           | `src/pages/sobre-mi/index.astro`               |
| `/sobre-mi/proyectos/<proyecto>`       | Cada proyecto                                      | `src/pages/sobre-mi/proyectos/[id].astro`      |
| `/sobre-mi/voluntariados/<iniciativa>` | Cada voluntariado o iniciativa                     | `src/pages/sobre-mi/voluntariados/[id].astro`  |

`/hablando` es el subsitio de la charla: sus archivos están tal cual en `public/hablando/` y no
los genera Astro. Las direcciones
antiguas (`/aprender`, `/herramientas`, `/proyectos/…`, `/comunidad/…`, `/casos/…`) redirigen a
las nuevas; están en `redirects`, en `astro.config.mjs`.

## Publicación

Cada `push` a `main` compila y publica el sitio en https://catacallejas.cl con GitHub Pages
(`.github/workflows/deploy.yml`). El dominio está en `public/CNAME`.

## Dónde se edita el contenido

Todo el contenido vive en archivos; agregar un proyecto es crear un archivo.

| Quiero cambiar…                                                   | Archivo o carpeta                  |
| ----------------------------------------------------------------- | ---------------------------------- |
| Perfil, contacto, educación, certificaciones, voluntariados       | `src/data/cv.ts`                   |
| Herramientas y especialidades, artefactos, «Revisa tu pitch»      | `src/data/cv.ts`                   |
| Roles de la trayectoria                                           | `src/content/trayectoria/`         |
| Proyectos (tarjeta, página, desafíos, proceso, carrusel)          | `src/content/proyectos/`           |
| Voluntariados e iniciativas                                       | `src/content/iniciativas/`         |
| Logos de clientes                                                 | `src/assets/logos/`                |
| Ilustración de perfil                                             | `src/assets/cata-ilustracion.png`  |
| Colores y tipografía                                              | `src/styles/global.css`            |

Las secciones que ya no se muestran (casos de estudio, eventos, charlas…) están guardadas en
`contenido-archivado/`, fuera del sitio. Lo pendiente está marcado en el código:
`grep -rn "TODO(content)" src`.

## Commands

| Command             | Action                                   |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Start the dev server at `localhost:4321` |
| `pnpm build`        | Build the production site to `./dist/`   |
| `pnpm preview`      | Preview the build locally                |
| `pnpm check`        | Type-check `.astro` and `.ts` files      |
| `pnpm format`       | Format everything with Prettier          |
| `pnpm format:check` | Check formatting without writing         |

## What's in here

```
.claude/skills/adr/        skill for writing decision records
.github/workflows/ci.yml   type check + build, on push and PR
docs/ADR/                  decisions, and what they cost
docs/documentation/        how this template works, in plain language
docs/research/             measurements that feed a decision (ships empty)
public/favicon.png         favicon (lápiz turquesa); también apple-touch-icon.png
src/layouts/BaseLayout.astro   html shell: title, description, canonical, OG, Twitter card
src/pages/index.astro      the only page
src/pages/404.astro        built to 404.html, served automatically by static hosts
src/styles/reset.css       Josh Comeau's reset, vendored — edit it freely
src/styles/global.css      imports the reset; put design tokens here
FIRST-RUN.md               the checklist for a newly generated site
```

Runs on Node 22.12 or newer — `.nvmrc` names the recommended version, not a floor. Nothing refuses
to install; CI only fails when the site is actually broken
([ADR 0004](./docs/ADR/0004-nothing-blocks-a-first-run-except-a-broken-build.md)).

## After generating a site

Work through **[`FIRST-RUN.md`](./FIRST-RUN.md)** — nine items, starting with `site` in
`astro.config.mjs`, which unblocks canonical links, `og:url` and `astro add sitemap`.

## Start here

**[`docs/documentation/`](./docs/documentation/)** — five short pages on what ships, where things
live, what the reset does to your page, how to add React or Tailwind, and how decisions get
recorded.

Two things in this repo look like mistakes and are not:

- **`typescript` is pinned to `^6`.** TypeScript 7 breaks `astro check` outright —
  [ADR 0002](./docs/ADR/0002-typescript-is-pinned-to-the-6-x-line.md).
- **The CSS reset is a file, not a dependency.** That is what makes it editable —
  [ADR 0001](./docs/ADR/0001-the-base-layer-is-a-vendored-css-reset.md).
- **`site` ships commented out, so there is no canonical or `og:url` tag yet.** Guessing an origin
  would ship tags that are wrong rather than absent —
  [ADR 0003](./docs/ADR/0003-absolute-url-metadata-requires-a-configured-site.md).

## Adding things later

Astro ships Vite as its dev server and bundler, so there is no separate Vite install or config to
manage. Integrations are one command:

```sh
pnpm astro add react
pnpm astro add tailwind
pnpm astro add sitemap
```

Each installs its dependencies and wires itself into `astro.config.mjs`.

## License

MIT — see [LICENSE](./LICENSE).
