# 5. How decisions get recorded

`docs/ADR/` holds **Architecture Decision Records** — one file per decision, saying what was
decided, what was true at the time, and what it cost. Four came with the template. The rest are
yours.

## Why bother

Six months from now, `typescript: "^6"` in `package.json` looks like an oversight. Nothing next to
it explains that TypeScript 7 breaks `astro check` outright. Someone bumps it, CI goes red in a way
that reads like their own fault, and an afternoon disappears.

[ADR 0002](../ADR/0002-typescript-is-pinned-to-the-6-x-line.md) is that afternoon, spent once. It is
not documentation of _what_ the code does — the code says that. It is the reasoning that the code
cannot contain.

## The two spaces, and the difference

|                  | Holds                                           | Ends in        |
| ---------------- | ----------------------------------------------- | -------------- |
| `docs/research/` | What is measurably true. Numbers, errors, tests | open questions |
| `docs/ADR/`      | What was decided, and what it costs             | consequences   |

Research is **pre-decision**, ADRs are **post-decision**. A research document that ends in "so we
will…" has become an ADR and should move. Most small decisions skip research entirely — write one
only when the evidence would drown the ADR's Context section.

## Writing one

Ask Claude Code to record the decision; the `adr` skill in `.claude/skills/adr/` handles the format,
the numbering, and the index row. Or copy [`0000-template.md`](../ADR/0000-template.md) yourself.

Either way, four things separate a record worth keeping from a paragraph nobody reads:

1. **One decision per record.** If you could accept half of it and reject the other half, it is two
   records.
2. **The title states the decision, not the topic.** "The base layer is a vendored CSS reset" — not
   "Styling approach". The index is read as a list of titles.
3. **Context is evidence.** A measured number, and where it came from. Not "the reset is small" but
   "422 bytes minified, so Astro inlines it".
4. **Consequences include real negatives.** What it costs, what it rules out, and how it will fail
   _quietly_. A record with only upsides was an announcement, not a decision — and the quiet failure
   is the one worth writing down, because it is the one nobody catches.

## When you don't need one

Adding a page. Changing a colour. Fixing a bug. Installing a library you could remove in an hour.

The bar is roughly: **would reversing this be expensive, or would the next person wonder why?** If
neither, skip it. A folder of records about nothing is worse than an empty one, because it teaches
people not to read the folder.

## Superseding the ones you inherited

The four records that came with the template describe decisions your site now owns. If you adopt
Tailwind and use its Preflight instead of the vendored reset, that supersedes ADR 0001: write a
record with the next free number, set 0001's status to `Superseded by` it, and leave 0001's text
alone. The old reasoning is the whole reason to keep the file.

Full rules — the status ladder, what belongs in a record versus next to the code — are in
[`docs/ADR/README.md`](../ADR/README.md).
