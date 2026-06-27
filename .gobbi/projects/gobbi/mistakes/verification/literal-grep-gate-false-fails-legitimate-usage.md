---
name: literal-grep-gate-false-fails-legitimate-usage
description: A verification gate built as a body-wide literal grep false-fails when the checked term appears legitimately in a different context — gate on structure or semantics, not a substring
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [verification, process]
keywords: [literal-grep, false-fail, semantic-classification, column-scoped, D2.2, D6.2, gate-brittleness]
author: claude
priority: high
domain: verification
---

# Literal grep gate false-fails legitimate usage of the checked term

## What happened

This session produced two instances of the same pattern, both caught by the dual-system evaluation
and fixed in iter2/iter3:

- **D2.2 (COD-STRUCT-1):** the original D2.2 gate was a body-wide synthesis-verb grep
  (`grep -nEi 'blend|averag|combin'`) over the Integration Log. Run on a CORRECT log that says
  "SELECT, never blend", it returns a match — a false fail. The term appears in anti-synthesis prose,
  not in a decision-column value.
- **D6.2 (COD-RISK-1 + COD-RISK-2):** the D6.2 independence gate was a literal path-grep
  (`grep -rl 'working/proposals'`) over the Codex eval prompt. A correct prompt may say "do NOT read
  `working/proposals/`" — that off-limits warning makes the grep match, false-failing a correct
  prompt; and being literal it ALSO misses proposal content embedded without the path string.

## Why it happens

The assumption is that if a term should NEVER appear in the correct output, grep-for-absence is a
sound gate. It breaks when the term has a dual usage: it can appear legitimately in one context (a
warning, explanatory prose, an anti-pattern example) while its appearance in another context (the
decision column, quoted proposal body) is the violation. A body-wide literal grep cannot distinguish
the two contexts.

## Correct approach

Gate on STRUCTURE or SEMANTICS, not a body-wide literal grep:

- **Column-valued properties** (e.g. the `decision` column in the Integration Log): extract the
  specific column (`awk -F'|' '{print $4}'`) and check the extracted values against the enum. The
  explanatory prose is in a different column and is never reached by the column-scoped extract.
- **Semantic properties** (e.g. proposal-content absence in an eval prompt): use a manual/semantic
  classification — a human/auditor reads the target and classifies it against the property's meaning.
  A literal grep is a non-gating advisory aid at most. The auditor distinguishes "this path is in an
  off-limits warning (PASS)" from "this path appears with proposal body text (FAIL)" by reading.

Both fixes share one root: use the instrument that can distinguish the property you care about from
look-alike instances of the same string.

## How to detect

Before writing a grep-based verification gate, ask: "can the checked term appear legitimately in the
same file for a different reason?" If yes, a body-wide literal grep will false-fail correct usage. The
trigger is any gate that checks for the ABSENCE of a string that might appear in prose/warnings/
examples, or the PRESENCE of a string used both correctly (one column/context) and incorrectly
(another).

## Related

- [[guard-cited-as-runtozero-without-matching-vocab]] — a sibling guard-brittleness trap
- [[literal-gate-checks-structure-not-substring]] — the checklist item that implements this lesson
