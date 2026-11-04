# ADR 0001 — The base layer is a vendored CSS reset, not browser defaults

- **Status:** Accepted
- **Date:** 2026-08-23
- **Deciders:** Cris Morales
- **Tags:** styling, foundations, dependencies

## Context

Astro's `minimal` starter ships **zero CSS**. Whatever a site built from it looks like on the first
day is whatever the browser's user-agent stylesheet says, and those defaults are actively
inconvenient rather than merely plain:

- `body` carries `margin: 8px`, so a full-bleed layout is wrong until someone notices.
- Headings and paragraphs carry `em`-relative block margins, which collapse against each other in
  ways that are hard to reason about once nesting starts.
- `img` is `display: inline`, so it sits on the text baseline and leaves a few pixels of descender
  gap under every image — the single most-reported "why is there a gap" bug in CSS.
- `input`, `button`, `textarea` and `select` do **not** inherit `font-family` or `font-size`.
  Styling the page never reaches the form controls.
- `line-height: normal` is derived from font metrics, so it changes when the font changes.

Every one of these is discovered the same way: someone builds a page, something looks wrong, and
they fix that one symptom. This template exists so that work is not repeated per site, which makes
"what is the base layer" a decision the template has to make rather than defer.

The constraint that makes it hard is what a template _is_. A template's output is meant to be edited
— a site generated from it diverges immediately and never merges back. A dependency assumes the
opposite: it is shared, versioned, and updated in place, and the moment you need to change one line
of it you have to eject it entirely. So the usual reason to prefer a package (you get fixes for
free) is in direct tension with the usual reason to have a template (you get a starting point you
own).

Size is not part of the tension. The reset is 1,132 bytes of source and 422 bytes minified — small
enough that Astro inlines it into `dist/index.html` rather than emitting a stylesheet request. The
whole built home page is 785 bytes. Neither option costs anything measurable at runtime.

## Decision

**Every site starts from an explicit reset, and that reset is a file in the repository rather than a
package in `node_modules`.**

1. `src/styles/reset.css` holds
   [Josh Comeau's Custom CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/), copied
   verbatim under an attribution comment naming its source.
2. `src/styles/global.css` imports the reset first, and is the entry point for everything else. No
   page or component imports `reset.css` directly.
3. `src/layouts/BaseLayout.astro` imports `global.css`. A page renders through the layout, so it
   gets the base layer; that is the only route by which styles reach a page.
4. **The vendored file is site-owned.** Editing `reset.css` in a generated site is expected use, not
   a fork of anything. It is kept verbatim _here_ so it can be diffed against upstream, and that
   obligation ends the moment a site is generated.
5. **The template ships a reset and nothing else.** No fonts, no colour palette, no spacing scale,
   no typographic defaults. `global.css` carries a commented-out `:root` block marking where those
   go; it deliberately defines nothing.

## Contract

| Concern                 | Where                                                            |
| ----------------------- | ---------------------------------------------------------------- |
| The reset itself        | `src/styles/reset.css`                                           |
| Load order, entry point | `src/styles/global.css`                                          |
| How it reaches a page   | `src/layouts/BaseLayout.astro`                                   |
| Upstream                | https://www.joshwcomeau.com/css/custom-css-reset/                |
| Enforcement             | **None.** Nothing checks that a page renders through the layout. |

## Consequences

**Positive**

- The five problems listed in Context are gone on day one, in every site, without anyone
  rediscovering them.
- Nothing to install, audit, or update for the base layer. The styling foundation has a supply chain
  of zero packages.
- It can be edited. Deleting the rule you disagree with is a one-line diff, not an ejection.
- Because it inlines at 422 bytes, first paint needs no additional round trip.

**Negative / trade-offs**

- **Upstream fixes never arrive.** Vendoring converts a maintained file into a snapshot. Josh
  Comeau's reset has gained rules over time — `text-wrap: pretty`,
  `interpolate-size: allow-keywords` — and the next one will not reach any site generated from this
  template. Nobody will be notified; the file will simply be quietly older every year. This record
  is the only thing that will remind anyone to re-check it.
- **It is opinionated, not a normalizer.** `* { margin: 0 }` means every margin in the site is
  authored deliberately. That is the point, but it surprises anyone expecting `normalize.css`
  behaviour, and it means an unstyled page looks _wrong_ rather than plain — headings run into
  paragraphs until spacing is written.
- **Two rules ship dead.** `#root` / `#__next` create a stacking context for a framework mount node
  that an Astro-only site does not have. They stay so the file matches upstream byte for byte; that
  is a deliberate trade of a little noise for diffability, and if the file is edited anyway the
  noise loses its justification.
- **The quiet failure is a page that skips the layout.** `src/pages/whatever.astro` that writes its
  own `<html>` gets no reset, builds green, and looks subtly different from every other page. There
  is no gate for this, and there is no obvious symptom either — just a page that is 8 pixels off.
- **`text-wrap: pretty` and `interpolate-size` are progressive.** Where unsupported they do nothing,
  so line breaking and keyword animation differ across browsers with no warning.

## Alternatives considered

**`modern-normalize` as a dependency.** The honest competitor: maintained, updated through pnpm, and
a smaller intervention — it evens out browser differences rather than flattening defaults. Rejected
because of the ejection problem. The first time a site needs to change one declaration, it has to
stop using the package and copy it in, which is this decision arrived at later and messier. The
update stream it offers is also worth less than it looks: sites generated from a template diverge
immediately, so a fix landing upstream in 2027 reaches none of them regardless.

**No reset; let each site choose.** Rejected. The template exists precisely to stop each site
re-deciding foundational questions, and "no decision" in practice means "browser defaults", which is
a decision made by omission and never revisited.

**Tailwind's Preflight.** Would solve the same problem, but only as a side effect of adopting an
entire styling system. That is a much larger decision to make on behalf of every future site, and it
is one that a site can still make for itself later — superseding this record when it does.
