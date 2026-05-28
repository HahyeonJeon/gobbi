---
name: section-order-is-part-of-the-contract-not-just-the-set
description: Normalizing heading SET without enforcing arrow-ordered SEQUENCE leaves docs non-conformant; the §4.2 arrow notation is an ordered contract, not a menu.
type: decisions
scope: project
feature: null
status: active
created: 2026-05-28
session: 5786090e-f65a-4493-94cc-e610ce337813
tags: [process, docs-conformance, prose-wave, evaluation]
domain: process
supersedes: null
superseded_by: null
decision_status: accepted
---

# Section order is part of the contract, not just the set

## What happened

P7b iter1 normalized 31 mistake records' heading SET and wording to §4.2:178 contract (adding the
required four H2s where absent, renaming variants to the canonical wording). However, the section
ORDER was left mixed: approximately 26 of 31 mistakes had `## How to detect` appearing BEFORE
`## Correct approach`, which is the inverse of §4.2's declared sequence:

> What happened → Why it happens → Correct approach → How to detect

The executor read the brief's instruction as "normalize heading set/wording" and applied it
narrowly. Codex flagged this as a HIGH finding in iter1 evaluation. Claude's evaluator issued a
PASS on the same output, missing the order inversion entirely.

## Why it happens

§4.2 uses arrow (`→`) notation to declare the section sequence. An executor (or evaluator) reading
"normalize headings" can interpret it as "ensure the four required H2s exist with correct wording"
without also checking that they appear in the arrow-specified order. The arrow notation looks like a
flowchart separator, not an ordering constraint, unless the agent has been told explicitly that
arrow → sequence = physical document order.

A brief that says "normalize heading set/wording" without explicitly stating "preserve the
§4.2 arrow-order" is under-specified. The gap is invisible until an evaluator diffs the actual
section positions.

## Correct approach

Every prose brief reshaping ADR-shaped or contract-shaped documents MUST:

1. Explicitly state the §4.2 arrow-order requirement: "normalize to the §4.2 sequence:
   `## What happened` → `## Why it happens` → `## Correct approach` → `## How to detect`"
2. Include a verification command that checks ORDER, not just presence:
   ```
   # For a single file:
   grep -n "^## " <file> | awk '{print NR, $0}'
   # Confirm line-number of "## Correct approach" < line-number of "## How to detect"
   ```
3. Evaluators reviewing prose-wave normalization MUST ground-truth section order by checking
   line numbers, not by inspecting the heading text alone. Presence of all four H2s is necessary
   but not sufficient — order compliance requires a position check.

The arrow notation in §4.2 is the ordered contract. Treating it as a set is under-specification
and will leave approximately 80% of migrated files with the wrong sequence when the prior state
had been written without the contract.

## How to detect

- A prose brief that instructs "normalize heading set/wording" but does not explicitly name the
  §4.2 arrow-order — the order requirement is missing from scope.
- A doc set with the four required H2s present but in varying orders (grep line numbers show
  `## How to detect` above `## Correct approach` in any file).
- An evaluator that reports PASS after a normalization wave without providing a per-file order
  verification check — means the evaluator checked heading text, not position.
- Hint: run `grep -n "^## Correct approach\|^## How to detect" <file>` on each file; the
  "Correct approach" line number MUST be smaller than the "How to detect" line number.

## Related

- [[evaluator-false-pass-without-diffing]] — companion mistake: arrow order is one of the things
  evaluators must ground-truth by diffing positions, not by reading headings. Claude's PASS in
  P7b iter1 is a direct instance of that mistake pattern.
- §4.2:178 of `.gobbi/projects/gobbi/rules.md` — the authoritative ordered contract for mistake
  records.
