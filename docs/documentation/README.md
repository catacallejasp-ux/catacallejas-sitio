# How this template works

Written for whoever just clicked **Use this template**. No knowledge of Astro assumed. Five short
pages.

|     |                                                                  |                                                          |
| --- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | [What this is](./01-what-this-is.md)                             | What ships, and what deliberately does not               |
| 2   | [Where things live](./02-where-things-live.md)                   | The whole file map, and the one path styles travel       |
| 3   | [The base layer](./03-the-base-layer.md)                         | What the reset does to your page, and how to build on it |
| 4   | [Adding to it](./04-adding-to-it.md)                             | React, Tailwind, and why there is no Vite to configure   |
| 5   | [How decisions get recorded](./05-how-decisions-get-recorded.md) | The ADR system, and when you actually need it            |

## The whole thing in a paragraph

> This is an Astro site with one page, one layout, and a CSS reset — and nothing else. The reset is
> a file you own rather than a package you install, so the first thing you do to a new site is edit
> it. The layout is the only route by which styles reach a page, so anything that skips it is
> unstyled. Everything else — React, Tailwind, a sitemap — is a `pnpm astro add` away and is
> deliberately absent until you ask for it. The decisions behind those choices are written down in
> `docs/ADR/`, and they came with the template.

## These pages explain. They don't decide.

Everywhere else in this repo each fact lives in exactly one place, and everything points at it
rather than restating it — that's what stops docs drifting. These pages break that rule on purpose,
because an explanation that refuses to restate anything is useless.

So: **if one of these disagrees with what it links to, the thing it links to is right and this page
is stale.** Say so and we'll fix it.

| Topic                                           | The real spec                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------------- |
| Why the reset is a file, not a package          | [`docs/ADR/0001`](../ADR/0001-the-base-layer-is-a-vendored-css-reset.md)           |
| Why TypeScript is on 6.x                        | [`docs/ADR/0002`](../ADR/0002-typescript-is-pinned-to-the-6-x-line.md)             |
| Why there are no canonical or `og:url` tags yet | [`docs/ADR/0003`](../ADR/0003-absolute-url-metadata-requires-a-configured-site.md) |
| How to record a new decision                    | [`docs/ADR/README.md`](../ADR/README.md)                                           |
| How to write up what you measured               | [`docs/research/README.md`](../research/README.md)                                 |
| Everything Astro does                           | https://docs.astro.build                                                           |
