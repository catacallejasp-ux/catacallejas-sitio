# Research

The **pre-decision** space. [`docs/ADR/`](../ADR/) is the post-decision space.

A document here reports what is _true_ about a dependency, a browser behaviour, a build tool, or a
constraint. It ends in open questions. It never ends in "we will" — that sentence belongs in an ADR,
and moving it there is the `adr` skill's job.

**This directory ships empty.** Not every decision needs a report behind it; write one when the
evidence is large enough, or contested enough, that an ADR's Context section would drown in it.

## The rule that makes a report worth trusting

> **Measured and inferred are separate sections. Never merged.**

- _Measured_: "`pnpm add -D typescript` resolves 7.0.2. `astro check` then exits 1 with
  `The TypeScript module loaded (found 7.0.2) does not expose the programmatic API`."
- _Inferred_: "The native compiler rewrite appears to have dropped the API rather than deferred it,
  since the error is an explicit version assertion rather than a missing export."

The first is checkable and stays true. The second is a reading, and a reader who cannot tell which
is which will cite the second as if it were the first. Label every inference.

If something could not be measured, **say so** rather than filling the gap with a plausible value.
Recording "not measured yet" is more useful than a confident guess, because a guess never gets
revisited.

## Naming

`NNNN-<topic>.md`, numbered in the order written — `0001-css-reset-options.md`,
`0002-image-service-benchmarks.md`. The number is chronological, not a priority, and it is a
separate sequence from the ADR numbers.

## Shape

```markdown
# <Topic>

- **Date:** YYYY-MM-DD
- **Source:** <package + version, URL, repo path, or browser + version — specific enough to re-run>
- **Method:** <how it was measured: which command, which environment, what was NOT covered>

## What is there (measured)

## What it appears to mean (inferred)

## Problems found

## Open questions
```

**"What was NOT covered" is part of the method, not an apology.** A report that silently skipped
half the question reads as a complete audit, and the next person builds on it.

## Problems are findings, not complaints

A problem is worth recording when it would change a decision. Give it evidence:

> The reset sets `#root, #__next { isolation: isolate }`, which names mount nodes from React and
> Next.js. An Astro site has neither unless an island is mounted manually, so the rule is inert here
> — the question is whether verbatim-upstream is worth two dead selectors.

not

> The reset has some stuff we don't need.
