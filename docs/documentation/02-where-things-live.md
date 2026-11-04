# 2. Where things live

```
.claude/skills/adr/     the skill that writes decision records
.github/workflows/      CI: type check and build — nothing else can redden it
docs/ADR/               decisions, and why they were made
docs/documentation/     these pages
docs/research/          measurements that feed a decision (ships empty)
public/                 files served as-is, at the URL of their filename
src/layouts/            the HTML shell, and every meta tag in it
src/pages/              one file per route, including 404.astro
src/styles/             the reset, and the entry point that imports it
astro.config.mjs        `site` and integrations go here
FIRST-RUN.md            what to change after generating a site — then delete it
```

## `src/pages/` is the router

There is no route configuration anywhere. A file at `src/pages/about.astro` is served at `/about`;
`src/pages/blog/first.astro` is served at `/blog/first`. Adding a page means adding a file, and
deleting one removes the route.

## `public/` is copied, not processed

Anything in `public/` lands in the build untouched, at the same path. `public/favicon.svg` is served
at `/favicon.svg`. Files referenced from `src/` are optimised and fingerprinted; files in `public/`
are not. If you are unsure, `src/` is the better default — use `public/` for things that need a
fixed URL, like `robots.txt`.

## The one path styles travel

This is the part worth memorising, because everything about the base layer follows from it:

```
reset.css  ──imported by──▶  global.css  ──imported by──▶  BaseLayout.astro  ──wraps──▶  your page
```

Nothing imports `reset.css` except `global.css`, and nothing imports `global.css` except the layout.
So a page that renders through `BaseLayout` is styled, and **a page that writes its own `<html>`
instead is not** — it will build green and look subtly wrong. Nothing checks this; it is the known
soft spot in the design, named as such in
[ADR 0001](../ADR/0001-the-base-layer-is-a-vendored-css-reset.md).

## `src/pages/404.astro` is special

Astro builds it to `404.html`, which Netlify, Vercel and Cloudflare Pages serve automatically for
unmatched paths. There is no configuration; the filename is the whole mechanism.

## Where your own CSS goes

- **Site-wide** — variables, typography, base element styles: `src/styles/global.css`, below the
  reset import. It ships with a commented-out `:root` block marking the spot.
- **One component or page only**: a `<style>` block inside the `.astro` file. Astro scopes it to
  that component automatically, so the class names cannot collide with anything else.

Leave `reset.css` for the reset. Keeping the two apart is what lets you diff yours against
[upstream](https://www.joshwcomeau.com/css/custom-css-reset/) later.
