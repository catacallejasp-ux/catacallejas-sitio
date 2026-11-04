# ADR 0004 — Nothing blocks a first run except a broken build

- **Status:** Accepted
- **Date:** 2026-08-23
- **Deciders:** Cris Morales
- **Tags:** governance, tooling, ci, audience

## Context

This template is not only for its author. It is meant for anyone who wants an Astro site scaffolded
and running quickly, including people who do not write code for a living and will not debug their
own toolchain. That audience was not written down anywhere, and two things had already been built
against a different one.

**The Node floor was stricter than Astro's.** `astro@7.2.4` declares `"node": ">=22.12.0"`. This
template declared `">=24"` — not for any measured reason, but because that is what the machine it
was built on happened to run. Paired with `engine-strict=true` in `.npmrc`, `pnpm install` did not
warn on Node 22, it **refused**. Node 22 is an LTS release that Astro fully supports, so the
template rejected a working environment on the first command anyone types.

**CI failed on formatting.** `pnpm format:check` ran as a required step, so a trailing newline could
redden the repository. Someone editing a page through GitHub's web interface — exactly the person
this template is meant to serve — would get a red X telling them nothing about whether their site
works.

Both are the same mistake: a gate that fires on something other than breakage. The constraint that
makes this a real decision rather than a cleanup is that the gates were not pointless. Formatting
consistency is genuinely useful, and an enforced Node floor genuinely prevents confusing downstream
errors. The question is who pays for them and when.

## Decision

**A check earns a place in CI only if it fails when the site is broken. Everything else reports
locally.**

1. `engines` matches Astro's own floor — `>=22.12.0`, no stricter. If Astro supports a Node version,
   so does this template.
2. **No `engine-strict`.** A mismatched Node produces a warning, not a refusal. The failure that
   would follow is Astro's to report, in Astro's words.
3. `.nvmrc` names the **recommended** version, not the minimum. It is what CI runs and what a
   contributor gets from `nvm use`; it is not a floor.
4. CI runs `pnpm check` and `pnpm build`. Both fail only when something is actually wrong.
5. **Formatting is a local convenience.** `pnpm format` exists, `.prettierrc` and `.editorconfig`
   configure it, and nothing fails because of it.
6. Before adding any gate, answer: _does this fail when the site is broken?_ If it fails on style,
   preference, or environment, it belongs in a script or a document instead.
7. Where a rule cannot be both enforced and welcoming, it is **documented rather than enforced**.
   That is already how the layout convention and the `site` setting work — this record generalises
   it into the rule the repository follows.

## Contract

| Concern                 | Where                                                                |
| ----------------------- | -------------------------------------------------------------------- |
| The supported floor     | `package.json` → `engines.node`                                      |
| The recommended version | `.nvmrc`                                                             |
| What actually gates     | `.github/workflows/ci.yml` — `pnpm check`, `pnpm build`              |
| Formatting, unenforced  | `package.json` → `scripts.format`, `.prettierrc`, `.editorconfig`    |
| Enforcement             | **None, deliberately.** This is a rule about not adding enforcement. |

## Consequences

**Positive**

- `pnpm install` works on both maintained LTS lines instead of rejecting one of them.
- A red X now means the site is broken. That is the only meaning it carries, which is what makes it
  worth reacting to.
- Someone can fix a typo through the GitHub web UI without a formatting failure they have no way to
  resolve in a browser.
- The template stops encoding its author's laptop as a requirement.

**Negative / trade-offs**

- **Unformatted code will land**, and `pnpm format` will eventually produce a large diff touching
  files nobody meant to change. The consistency the ported documentation depends on is now a habit
  rather than a guarantee.
- **The floor is supported but untested.** CI runs the single version in `.nvmrc`. Node 22 is now
  declared compatible and never exercised, so a 22-only break ships silently and is discovered by a
  user rather than by CI. A version matrix would close this and was not added, because more CI is
  the thing this record exists to resist.
- **Fewer gates means more depends on someone noticing.** Every convention documented rather than
  enforced — the layout, `site`, formatting — is one more thing that fails quietly and looks fine.
- **The rule can be argued into anything.** "Does it fail when the site is broken?" is a judgement
  call, and a determined reading excuses removing `astro check` too. It should not: a type error
  _is_ breakage, and [ADR 0002](./0002-typescript-is-pinned-to-the-6-x-line.md) depends on that step
  remaining in CI.

## Alternatives considered

**Keep `format:check` with `continue-on-error: true`.** Gives the signal without blocking. Rejected:
a step that cannot fail is decoration, and it still shows a warning annotation that a non-technical
contributor has to learn to ignore. Teaching people to ignore CI output is worse than not producing
it.

**Keep `engine-strict` but lower the floor to `>=22.12.0`.** Tempting, since the floor was the real
error. Rejected because the failure mode stays hostile: someone on Node 20 gets a pnpm refusal
during install rather than a clear message from Astro at the point they run it, and the template
should not be the thing that stops them.

**A Node version matrix in CI.** Would make the supported floor real rather than declared, and is
the honest fix for the negative named above. Deferred, not rejected — it doubles CI time and
complexity for a template whose CI should stay legible to someone reading a workflow file for the
first time.
