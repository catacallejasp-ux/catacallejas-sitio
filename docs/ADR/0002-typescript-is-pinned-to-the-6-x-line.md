# ADR 0002 — TypeScript is pinned to the 6.x line until `astro check` supports 7

- **Status:** Accepted
- **Date:** 2026-08-23
- **Deciders:** Cris Morales
- **Tags:** tooling, dependencies, build

## Context

`tsconfig.json` extends `astro/tsconfigs/strict`, and CI runs `pnpm check` (`astro check`) on every
push and pull request. Type checking is therefore the only automated correctness signal this
template has — there are no tests, and `astro build` does not type-check.

Installing TypeScript with no version constraint breaks that signal outright.
`pnpm add -D typescript` resolves **7.0.2** today, and `astro check` then fails before it inspects a
single file:

```
The TypeScript module loaded (found 7.0.2) does not expose the programmatic API that
`astro check` relies on. TypeScript's native compiler (7.0 and later) does not ship this API
yet.
```

Exit code 1. This is not a misconfiguration on our side: TypeScript 7 is the native (Go) port of the
compiler, and it does not yet expose the programmatic API that `@astrojs/language-server` (2.16.14,
via `@astrojs/check` 0.9.10) drives to produce diagnostics for `.astro` files. Astro tracks the work
at [withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321).

So the tension is not "which version is better". It is that the newest TypeScript and a working
`astro check` are mutually exclusive right now, and one of them has to give.

## Decision

**`typescript` is constrained to the 6.x line, and the constraint is documented as temporary rather
than left to be rediscovered.**

1. `devDependencies.typescript` is `^6`. It is not `latest`, and it is not unpinned.
2. `pnpm check` stays a required CI step. Pinning exists to keep the gate working; removing the gate
   to allow the upgrade would invert the reason for the pin.
3. **This pin has an expiry, and this record is it.** When `@astrojs/check` supports the native
   compiler, lift the constraint, run `pnpm check`, and supersede this ADR. Nothing else in the
   repository knows the pin is temporary.
4. A dependency bump that moves `typescript` to 7 is not accepted on a green `astro build` alone —
   `pnpm check` must pass, and today it will not.

## Contract

| Concern                 | Where                                                                  |
| ----------------------- | ---------------------------------------------------------------------- |
| The constraint          | `package.json` → `devDependencies.typescript`                          |
| What the pin protects   | `package.json` → `scripts.check`, `tsconfig.json`                      |
| Enforcement             | `.github/workflows/ci.yml` — the `pnpm check` step, run on push and PR |
| Upstream support status | https://github.com/withastro/roadmap/discussions/1321                  |

## Consequences

**Positive**

- `pnpm check` runs and reports `0 errors` instead of exiting 1, so strict mode is worth having.
- CI fails on a type error rather than on the checker itself, which is the difference between a gate
  and a broken step people learn to ignore.
- A site generated from this template inherits a toolchain that works on first `pnpm install`, with
  no debugging of an error that reads like the site's own fault.

**Negative / trade-offs**

- **The site is a major version behind on its type system**, and stays there for as long as the
  upstream gap lasts — including any language features 7.x adds.
- **pnpm advertises the upgrade on every install** (`typescript 6.0.3 (7.0.2 is available)`).
  Training yourself to ignore that line is a bad habit that generalises to other packages.
- **Nothing lifts the pin automatically.** There is no watch, no scheduled check, no failing test
  that starts passing. If nobody re-reads this record, the pin outlives its reason and looks like
  superstition — a version constraint whose justification nobody remembers is the hardest kind to
  remove safely.
- **The quiet failure is a re-install.** `pnpm add -D typescript` without `@^6` silently replaces
  the constraint and breaks `astro check` again. Locally that shows as an error people may skip; CI
  does catch it, which is the main reason the check step must stay.
- **Every site generated from the template inherits the pin**, including sites created after
  upstream support lands, until the template itself is updated.

## Alternatives considered

**Drop `astro check` and let `astro build` be the only gate.** Cheapest fix, and it lets TypeScript
float. Rejected: `astro build` does not type-check, so the result is `strict` in `tsconfig.json`
with nothing acting on it — worse than not claiming strictness, because the claim reads as a
guarantee.

**Run `tsc` directly instead of `astro check`.** `tsc` does not understand `.astro` single-file
components; it would check `.ts` files only, which in this template is nearly nothing. It checks the
part that has no bugs and skips the part that does.

**Pin exactly (`6.0.3`) rather than `^6`.** Rejected as too tight. The failure is a major-version
boundary, so `^6` is exactly as narrow as the evidence supports, and patch fixes within 6.x are
still wanted.
