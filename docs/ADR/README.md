# Architecture Decision Records (ADRs)

Each ADR captures one architecturally significant decision: its context, the decision, and its
consequences. ADRs are immutable once **Accepted** — to change a decision, supersede it with a new
ADR rather than editing the old one.

**An ADR records the decision and stays agnostic; it does not restate the specifics that realize
it.** Those specifics — a stylesheet, a version pin, a workflow step — are the decision's
**contracts**, and they live with the code they govern. An ADR _links_ its contracts in a
`## Contract` table; it does not inline them. This is deliberate: contracts evolve with the
implementation, so keeping them out of the record is what lets an Accepted ADR stay stable instead
of being rewritten every time the details move.

**Statuses:** `Draft` → `Proposed` → `Accepted` → (`Superseded by NNNN` | `Deprecated`)

| #                                                                  | Title                                                                     | Status   |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------- | -------- |
| [0001](./0001-the-base-layer-is-a-vendored-css-reset.md)           | The base layer is a vendored CSS reset, not browser defaults              | Accepted |
| [0002](./0002-typescript-is-pinned-to-the-6-x-line.md)             | TypeScript is pinned to the 6.x line until `astro check` supports 7       | Accepted |
| [0003](./0003-absolute-url-metadata-requires-a-configured-site.md) | Metadata that needs an absolute URL is omitted until `site` is configured | Accepted |
| [0004](./0004-nothing-blocks-a-first-run-except-a-broken-build.md) | Nothing blocks a first run except a broken build                          | Accepted |

## These records travel with the site you generate

This is a template, so `docs/ADR/` is copied into every site made from it. That has two consequences
worth stating, because neither is obvious:

- **The inherited records describe decisions your site now owns.** They are not a changelog of
  someone else's repo — 0001 is why your site has no browser default margins, and it is true of your
  site until you change it.
- **Superseding an inherited record is normal.** A site that wants Tailwind's Preflight instead of
  the vendored reset writes the next free number, superseding 0001. That is the system working, not
  a violation of it. Continue the numbering from where the template left off; do not renumber.

The immutability rule above applies from the moment a record is Accepted in a real site. In this
template itself, before anything has been generated from it, there is nothing downstream to protect
— records are edited in place while the decision is still moving.

That bar is worth stating plainly, because it is the one that keeps this folder honest: _a decision
nobody has implemented is a Draft, however confident it sounds._

## Adding an ADR

1. Copy [`0000-template.md`](./0000-template.md); number it sequentially (`NNNN-kebab-title.md`).
2. Start at **Draft**; promote as the decision firms up and lands in code.
3. **Add a row to the table above.** An ADR that is not in the index does not exist — nobody browses
   a directory listing.

The `adr` skill does all three, and will refuse to bundle two separable decisions into one record.

## What belongs here, and what does not

|                                                            | Goes in               | Why                                                                     |
| ---------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------- |
| "The reset is vendored rather than installed"              | `docs/ADR/`           | A decision. Changing it later has consequences worth tracing.           |
| "`astro check` exits 1 under TypeScript 7.0.2"             | `docs/research/`      | A measurement. It has no consequences; it is evidence _for_ a decision. |
| The reset file itself, or the version pin that enforces it | next to the code      | A contract. It moves with the implementation.                           |
| "Here is how the base layer works, in plain language"      | `docs/documentation/` | An explanation. It restates on purpose, and defers to the spec.         |

`docs/research/` is the **pre-decision** space and `docs/ADR/` is the **post-decision** space. A
research document ends in open questions; an ADR answers one of them.

## Writing one that is worth reading

- **One decision per record.** If the draft contains two "we will" sentences that could be argued
  separately, it is two ADRs.
- **Context is evidence, not narrative.** Prefer a measured number to an adjective. "The minified
  reset is 422 bytes, small enough that Astro inlines it into the page rather than emitting a
  stylesheet request" is context; "the reset is quite small" is not.
- **Consequences must include real negatives.** An ADR with only positives was not a decision, it
  was an announcement. Name what this costs, what it forecloses, and what will go wrong quietly.
- **Alternatives considered** are only worth writing where someone would genuinely have chosen
  differently. Do not pad.
