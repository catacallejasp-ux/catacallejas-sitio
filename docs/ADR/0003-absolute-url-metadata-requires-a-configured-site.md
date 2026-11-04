# ADR 0003 — Metadata that needs an absolute URL is omitted until `site` is configured

- **Status:** Accepted
- **Date:** 2026-08-23
- **Deciders:** Cris Morales
- **Tags:** seo, build, foundations

## Context

`astro.config.mjs` ships as `defineConfig({})`, so `Astro.site` is `undefined`. Rendering
`Astro.site ? new URL(Astro.url.pathname, Astro.site).href : 'IMPOSSIBLE'` into a page and building
it confirms it: the output reads `undefined | IMPOSSIBLE — no site configured`.

That single missing value blocks three separate things. A canonical link needs an absolute URL.
`og:url` and `og:image` are ignored by every crawler unless absolute. `@astrojs/sitemap` refuses to
run without `site` at all.

The template cannot supply the value, because the correct value is the deployment origin and only
the site owner knows it. So the choice is what to do in its absence, and the two obvious answers are
both wrong in different ways: guessing a placeholder ships canonical tags pointing at a domain the
owner does not control, and emitting relative URLs into `og:url` ships tags that crawlers discard
silently.

The constraint that makes it hard is that a template has to build green on a fresh clone — that is
its acceptance test — so failing the build on a missing `site` is not available either.

## Decision

**Metadata that requires an absolute URL is emitted only when `site` is set; everything else is
emitted always. Nothing is guessed.**

1. `site` ships **commented out** in `astro.config.mjs`, with the comment naming what it unblocks.
   It is not set to a placeholder origin.
2. `BaseLayout.astro` derives `canonical` and the absolute image URL from `Astro.site`, and renders
   `<link rel="canonical">`, `og:url` and `og:image` **only** when it is defined.
3. Metadata that needs no origin — `<title>`, `description`, `og:title`, `og:type`,
   `og:description`, `twitter:card` — is emitted unconditionally, so a site has usable social
   metadata before anyone configures anything.
4. `twitter:card` is `summary_large_image` when an image resolved and `summary` otherwise, because
   the large-image card renders as a broken box with no image.
5. **Setting `site` is the first item in `FIRST-RUN.md`.** A decision that depends on someone doing
   something later has to name where that instruction lives.

## Contract

| Concern                   | Where                                                              |
| ------------------------- | ------------------------------------------------------------------ |
| The commented setting     | `astro.config.mjs`                                                 |
| Conditional metadata      | `src/layouts/BaseLayout.astro`                                     |
| The instruction to set it | `FIRST-RUN.md`, item 1                                             |
| Enforcement               | **None.** Nothing detects a deployed site with `site` still unset. |

## Consequences

**Positive**

- A site can never ship a canonical URL pointing at a domain its owner does not control. That
  failure is worth designing against specifically: it is invisible in the browser and it tells
  search engines to attribute the content elsewhere.
- Link previews work at the title/description level from the first deploy, with no configuration.
- Turning on the rest is uncommenting one line — and the same line unblocks `astro add sitemap`.

**Negative / trade-offs**

- **This is the quiet failure, and it is the whole cost of the decision.** A site deployed with
  `site` still commented out has no canonical link and no `og:url`. Nothing errors, nothing warns,
  CI is green, and the page looks perfect. The symptom appears weeks later as duplicate-content
  handling in search results or a link preview missing its image.
- **The path that runs by default is the degraded one.** In the template as shipped, the branch that
  emits absolute URLs never executes — so the code that matters most in a real site is the code
  least exercised here.
- **Conditional tags are harder to read** than a flat list of `<meta>` elements, and each new tag
  now requires deciding which side of the condition it belongs on.
- **`og:image` has no default.** A site that sets `site` but passes no `image` still gets a
  text-only card. Providing a default would mean shipping an image, which is branding the template
  has no business guessing.

## Alternatives considered

**Ship `site: 'https://example.com'`.** The common template convention, and rejected precisely
because it works. The build is green, the tags are present and well-formed, and every one of them is
a lie until someone edits the line. An absent tag is a gap someone can find; a wrong tag is a gap
that looks filled.

**Fail the build when `site` is unset.** Guarantees correctness and is the strongest option on
paper. Rejected because `pnpm install && pnpm dev` on a fresh clone is the first thing anyone does
with a template, and a template whose acceptance test is a build error is broken on arrival.

**Emit relative URLs for `og:url` and `og:image`.** Rejected: crawlers discard them, so this is the
placeholder problem with extra steps — the tags are present, and they do nothing.
