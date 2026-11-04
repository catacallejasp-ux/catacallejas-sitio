# AGENTS.md

Guidance for coding agents working in this repository. `CLAUDE.md` is a symlink to this file, so
there is one copy and it cannot drift.

## First rule: modular context, loaded on demand

Pull the right context at the right time — not everything up front. Every piece of this repo's
documentation is a **module**: each ADR, each page under `docs/documentation/`, each skill. Load a
module only when the task actually needs the decision or detail it holds.

In particular, **do not read all the ADRs at startup** — read the one that governs the surface you
are about to touch, when you are about to touch it. `docs/ADR/README.md` is the index that routes
you there.

This is deliberate **progressive disclosure**: it keeps working context lean and lets the system
scale as a site grows, because the entry map stays small and you descend into a module only when you
are in its territory.

## What this is

A **template for Astro websites**. It ships the machinery — build, strict type checking, formatting,
CI, a CSS reset, and the ADR governance that records why any of it is the way it is — and **no
site**. One layout, one page, one heading.

That emptiness is the design, not an unfinished state. Do not add components, tokens, fonts, a
colour system, or an example blog unless asked.

```
.claude/skills/adr/   the skill that writes decision records
docs/ADR/             post-decision: what was decided and why
docs/documentation/   plain-language explanation, written for a human starting a site
docs/research/        pre-decision: what is measurably true (ships empty)
public/               served as-is at the URL of the filename
src/layouts/          the HTML shell — the only route by which styles reach a page
src/pages/            file-based routing, one file per route (index, 404)
src/styles/           reset.css (vendored, site-owned) + global.css (the entry point)
FIRST-RUN.md          the checklist a generated site works through, then deletes
```

## Commands

```bash
pnpm dev            # dev server on :4321
pnpm build          # static build to dist/
pnpm check          # astro check — the only correctness gate; there are no tests
pnpm format         # prettier --write .
pnpm format:check   # check formatting without writing
```

CI runs `check → build` on every push and pull request (`.github/workflows/ci.yml`). Formatting is
deliberately **not** gated — run `pnpm format` before pushing, but nothing fails if you forget.

When starting the dev server, prefer background mode: `astro dev --background`, managed with
`astro dev stop`, `astro dev status`, and `astro dev logs`.

## Who this is for

Anyone who wants an Astro site scaffolded and running fast — not only this repository's author, and
not only people who write code. That audience decides things:

- **Do not add a gate that fires on anything other than breakage.** No formatting check in CI, no
  `engine-strict`, no required style rules.
  [ADR 0004](./docs/ADR/0004-nothing-blocks-a-first-run-except-a-broken-build.md)
- **Do not raise the Node floor above Astro's own.** If Astro supports a version, so does this.
- Prefer documenting a convention over enforcing it, and say plainly that it is unenforced.

## Two constraints that will look like mistakes

Both are decisions with records. Read the record before changing either.

- **`typescript` is pinned to `^6`.** TypeScript 7 is the native compiler and does not expose the
  API `astro check` drives; bumping it breaks the only gate this repo has.
  [ADR 0002](./docs/ADR/0002-typescript-is-pinned-to-the-6-x-line.md)
- **The CSS reset is a vendored file, not a dependency.** Do not replace it with `modern-normalize`
  or any package. It is meant to be edited in place.
  [ADR 0001](./docs/ADR/0001-the-base-layer-is-a-vendored-css-reset.md)

- **`site` is commented out in `astro.config.mjs`.** `BaseLayout` omits canonical, `og:url` and
  `og:image` while it is unset rather than guessing an origin. Do not set it to a placeholder.
  [ADR 0003](./docs/ADR/0003-absolute-url-metadata-requires-a-configured-site.md)

There is also no `vite` dependency and there should not be — Astro bundles Vite as its dev server
and bundler. Vite options belong in the `vite:` key of `astro.config.mjs`.

## Governance lives in the ADRs

[`docs/ADR/`](./docs/ADR/) is the governance layer. Per the first rule, do not read them all up
front; when a task touches a structural decision, open the governing record then.

Two rules make the records durable rather than a maintenance burden:

- **Decision vs contract.** An ADR records the _decision_ and stays agnostic; the stylesheet,
  version pin or workflow step that realizes it lives with the code it governs, and the ADR _links_
  it in a `## Contract` table. This is what lets an accepted decision stay stable while its
  implementation moves.
- **Accepted means implemented.** A decision nobody has realized in code is a Draft, however
  confident it sounds. Before promoting, check that every path in the Contract table exists.

Working against an accepted ADR without updating it is a defect, not a shortcut. Use the `adr` skill
to write one — it handles numbering, the index row, and refuses to bundle two separable decisions
into one record.

## The other modules, and when to read them

| Read it when                                     | File                                                                             |
| ------------------------------------------------ | -------------------------------------------------------------------------------- |
| Explaining any of this to a human                | `docs/documentation/` — explanation, not spec: where it disagrees, the spec wins |
| Recording a decision                             | `docs/ADR/README.md`, then `.claude/skills/adr/SKILL.md`                         |
| Writing up something you measured                | `docs/research/README.md`                                                        |
| Touching styles                                  | `docs/documentation/03-the-base-layer.md`, then ADR 0001                         |
| Adding an integration, or asked about Vite/React | `docs/documentation/04-adding-to-it.md`                                          |

## Honesty rules

- **A gap is a finding, not a blank to fill.** "Not measured yet" is more useful than a confident
  guess, because a guess never gets revisited.
- **Never invent evidence in an ADR Context.** Every factual claim traces to a command you ran, a
  line in a file, or a linked upstream issue. If it traces to none of those, label it an assumption.
- **Name the negatives.** In a record, in a summary, in a PR description. An account with only
  upsides is an announcement, not an assessment.
- **State plainly where nothing is enforced.** This repo has exactly one gate (`pnpm check`) and one
  formatter. Everything else — including "every page uses `BaseLayout`" — is a convention that will
  be broken silently.

## Astro reference

Full documentation: https://docs.astro.build

- [Routing, dynamic routes, middleware](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [React, Vue, Svelte and other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling and Tailwind](https://docs.astro.build/en/guides/styling/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)
