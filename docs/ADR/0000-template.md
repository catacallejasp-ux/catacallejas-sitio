# ADR NNNN — <Title in one line, stating the decision, not the topic>

<!--
  Title rule: the reader should learn the decision from the title alone.
    good: "The base layer is a vendored CSS reset, not browser defaults"
    bad:  "Styling approach"
-->

- **Status:** Draft
- **Date:** YYYY-MM-DD
- **Deciders:** <who actually decided — a name or a team, not "the project">
- **Tags:** <comma-separated: styling, tooling, dependencies, build, content, a11y, governance>
- **Related:** [ADR NNNN — Title](./NNNN-kebab-title.md) <!-- omit the line if there are none -->

## Context

What is true today, and what forces a decision. **Evidence, not narrative** — prefer a measured
number to an adjective, and say where the number came from. If the evidence lives in a research
document, link it: the ADR should not re-measure.

State the constraint that makes this hard. A decision with no tension in it did not need a record.

## Decision

The decision, in the present tense, as a numbered list. Each item is something a reader could comply
with or violate.

1. …
2. …

If a rule has a corollary that binds future work, say it here rather than leaving it implied.

## Contract

The realizing specifics live with the code they govern, not here. This table is how the record
points at them without absorbing them — which is what lets the decision stay stable while the
implementation moves.

| Concern                    | Where                                       |
| -------------------------- | ------------------------------------------- |
| <what the artifact is for> | `path/to/artifact`                          |
| Enforcement                | `path/to/gate` (`pnpm <script>`, run in CI) |

Always name **how it is enforced** — or say plainly that nothing enforces it. A rule with no gate is
a convention, and the record is the right place to admit which of the two this is.

<!-- Delete this section only if the decision genuinely has no artifacts yet — and if it has
     none, ask whether it is really Accepted, or still a Draft. -->

## Consequences

**Positive**

- …

**Negative / trade-offs**

- …

<!--
  A record with no negatives was an announcement, not a decision. Name at least:
    - what this costs, in work or in flexibility
    - what it forecloses
    - how it will fail QUIETLY, since that is the failure nobody catches
-->

## Alternatives considered

**<Alternative>** — why it was not chosen.

<!-- Only where someone would genuinely have chosen differently. Do not pad. -->
