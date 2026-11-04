---
name: adr
description:
  Write an Architecture Decision Record into docs/ADR/ and update the index. Use when asked to
  "record this decision", "write an ADR", "document why we chose X", "add a decision record", or
  after a change that will be baffling in six months. Writes records and updates the index; never
  writes implementation code.
---

# adr

Convert a choice somebody made into a decision somebody can comply with or violate.

## Before you start

| When                                         | Read                                                                       |
| -------------------------------------------- | -------------------------------------------------------------------------- |
| **Always, first**                            | `docs/ADR/README.md` — the status ladder and the decision-vs-contract rule |
| Writing the file                             | `docs/ADR/0000-template.md`, and `docs/ADR/0001-*.md` as a worked example  |
| Deciding what goes in the record vs the code | `references/decision-vs-contract.md`                                       |
| Choosing a status                            | `references/status-ladder.md`                                              |

**Refuse to invent the evidence.** Every factual claim in a Context section traces to something you
can point at: a command you ran and its output, a line in a config file, a linked upstream issue, or
a research document. If it traces to none of those, label it an assumption in the text. An ADR whose
context is confident and unsourced is the most expensive kind of document to be wrong.

Measure before you write. If the record wants to say a file is small, run `wc -c` and say the
number.

## First, decide whether it needs a record at all

The bar: **would reversing this be expensive, or would the next person wonder why?**

Worth a record — a version pin with a non-obvious cause, a styling foundation, a build tool that
changes how every page is authored, a deliberate omission someone will otherwise "fix".

Not worth a record — adding a page, a colour change, a library that could be removed in an hour, or
anything the code already states plainly.

A folder of records about nothing is worse than an empty one: it teaches people not to read the
folder. Say so and decline rather than padding the directory.

## One decision per record

If the draft contains two "we will" sentences that could be argued separately, it is two ADRs.

The test is not length, it is **independence**: could a reasonable person accept one and reject the
other? "We use a CSS reset" and "the reset is vendored rather than installed" are two decisions by
that test. "We use Astro" and "we build with Vite" are one, because the second follows from the
first.

Where the repo has already merged two by deliberate choice, note it in the record rather than
silently splitting it.

## The four things that make an ADR worth keeping

**1. Context is evidence, not narrative.** Prefer a measured number to an adjective, and say where
it came from.

> `pnpm add -D typescript` resolves 7.0.2, and `astro check` then exits 1 before inspecting a single
> file.

not

> There are some compatibility problems with the latest TypeScript.

**2. The Decision is a numbered list of things you could violate.** Present tense. Each item is a
rule, not an aspiration. If a rule has a corollary that binds future work — "this pin is temporary
and this record is its expiry" — write it down. An implied corollary is one nobody follows.

**3. The `## Contract` table, not inlined specifics.** The record says _what was decided_; the file,
pin or workflow step that realizes it lives with the code and is **linked**. See
`references/decision-vs-contract.md`. Always name how it is enforced — **or state plainly that
nothing enforces it.** A rule with no gate is a convention, and which of the two it is belongs in
the record.

**4. Consequences must include real negatives.** An ADR with only positives was not a decision, it
was an announcement. Name three things specifically:

- what this **costs**, in work or in flexibility
- what it **forecloses**
- how it will fail **quietly** — because that is the failure nobody catches

If you cannot find a negative, you have not understood the decision well enough to record it.

## Status

Start at **Draft**. Promote to **Accepted** only when the decision is _already realized in code_ —
open the Contract table and check that each path exists. A decision nobody has implemented is a
Draft, however sure you are.

## Finish the job

An ADR is not done until:

1. It is numbered sequentially and named `NNNN-kebab-title.md`.
2. **A row is added to the index table in `docs/ADR/README.md`.** An ADR not in the index does not
   exist — nobody browses a directory listing.
3. `Related:` links point both ways where a relationship exists. If this supersedes another, the old
   record's status changes to `Superseded by NNNN` in the same change — and its text is left alone.
4. `pnpm format` has been run, so the tables align and CI's `format:check` stays green.

## Title rule

The reader learns the _decision_ from the title, not the topic.

- good — "The base layer is a vendored CSS reset, not browser defaults"
- bad — "Styling approach"
