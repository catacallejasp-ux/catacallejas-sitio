# Decision vs contract — where the line falls

The one rule that decides what goes in an ADR and what does not:

> **An ADR records the decision and stays agnostic. The specifics that realize it are its contracts,
> they live with the code they govern, and the record _links_ them.**

## Why, concretely

Contracts change on the implementation's schedule. A stylesheet gains a rule; a version constraint
moves within its range; a CI step gets another flag. If those specifics live inside the record,
every one of those changes is an edit to an Accepted decision — and a record that is edited
constantly is one nobody trusts to still mean what it said.

Keeping them out is what lets the decision hold still while the implementation moves.

## The test

Ask: **if this changed, would the decision have changed?**

- No → it is a contract. Link it.
- Yes → it is part of the decision. Write it.

Bumping `typescript` from `6.0.3` to `6.1.0` does not change the decision "TypeScript is pinned to
the 6.x line". So the resolved version is a contract detail. Deciding that the constraint is a
_range_ rather than an exact pin does change the decision, so it is a Decision item.

## Worked example

From `docs/ADR/0001`:

| Belongs in the **record**                                   | Belongs in the **contract table**               |
| ----------------------------------------------------------- | ----------------------------------------------- |
| "Every site starts from an explicit reset"                  | `src/styles/reset.css`                          |
| "The reset is a file in the repo, not a package"            | the absence of a dependency in `package.json`   |
| "Nothing imports the reset except the global entry point"   | `src/styles/global.css`                         |
| "The vendored file is site-owned and expected to be edited" | —                                               |
| "The template ships a reset and no design opinions"         | the commented-out `:root` block in `global.css` |

Notice the shape: the left column is **rules**, the right column is **files**. If your left column
has a file path in it, or your right column has a sentence in it, the line is in the wrong place.

Notice also the row with no contract. "The file is site-owned" is a rule that no artifact expresses
and no tool can check — which is exactly why it has to be written in the record. A dash is an honest
entry.

## What a Contract table looks like

```markdown
## Contract

| Concern     | Where                                                                  |
| ----------- | ---------------------------------------------------------------------- |
| The pin     | `package.json` → `devDependencies.typescript`                          |
| Enforcement | `.github/workflows/ci.yml` — the `pnpm check` step, run on push and PR |
| Upstream    | https://github.com/withastro/roadmap/discussions/1321                  |
```

Always name **how it is enforced**. Where nothing enforces it, say so in the table —
`**None.** Nothing checks that a page renders through the layout` is a more useful row than an
omitted one, because it tells the next reader the rule is a convention and will be broken silently.

## The failure mode to watch for

Erosion is gradual and comfortable: one convenient detail at a time, each individually reasonable. A
record that started as a decision becomes a specification, then becomes stale, then becomes
misleading. The moment you want to paste the reset's rules into the ADR "just so it is all in one
place", that is the erosion starting — and the copy will be wrong within a month of the first edit
to the real file.
