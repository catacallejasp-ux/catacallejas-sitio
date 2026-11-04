# Status ladder

```
Draft -> Proposed -> Accepted -> (Superseded by NNNN | Deprecated)
```

| Status                 | Means                                                                 | Promote when                                                |
| ---------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Draft**              | Being worked out. Edited freely.                                      | —                                                           |
| **Proposed**           | Ready for a decision, awaiting one. Use when a human has to sign off. | someone with the authority agrees                           |
| **Accepted**           | Decided **and realized in code**.                                     | the contract table points at something that exists and runs |
| **Superseded by NNNN** | A later record replaced it. The text stays as written.                | never edit it — write the replacement                       |
| **Deprecated**         | No longer applies and nothing replaces it.                            | rare; usually you supersede instead                         |

## The Accepted bar

**A decision nobody has implemented is a Draft, however confident it sounds.**

This is the rule that keeps the folder honest. Without it, ADRs accumulate as a wish list, and a
reader cannot tell which records describe the system and which describe an intention. With it,
`Accepted` means "this is how the repo actually works" — which is what makes the records worth
consulting before a change.

Concretely: before promoting, open the `## Contract` table and check that each path exists and each
named gate runs.

## In a template, and in the sites made from it

This repository is a template, so `docs/ADR/` is copied into every site generated from it. Two
things follow:

- **Inherited records describe decisions the new site owns.** They are not history from someone
  else's repo. ADR 0001 is why _this_ site has no default margins, and it stays true until the site
  decides otherwise.
- **Superseding an inherited record is expected**, not a violation. Continue the numbering from
  where the template stopped; never renumber, because links and index rows point at the numbers.

Within the template itself, before anything has been generated from it, there is nothing downstream
to protect — records are edited in place while a decision is still moving. In a real site, treat
Accepted as immutable from the moment it is set.

## Superseding

1. Write the new record. Its Context explains **what changed** — not just what the new decision is.
   A supersession whose context does not say why the old reasoning stopped holding is unreadable in
   a year.
2. Set the old record's status to `Superseded by NNNN`, linked.
3. **Leave the old text alone.** It is a record of what was decided and why, and rewriting it
   destroys the only reason to keep it.
4. Add the new row to the index; update the old row's status.

## Records with an expiry

Some decisions are known to be temporary when they are made — a version pin waiting on upstream
support, a workaround for a bug that will be fixed. Say so in the Decision, name the condition that
lifts it, and link the upstream issue in the Contract table.

The record is then the only thing in the repository that knows the constraint is temporary. Nothing
else will raise its hand when the condition is met, so an expiring decision that is not written down
becomes a permanent one by default.
