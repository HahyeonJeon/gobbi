---
name: marker-literal-check-case-sensitive-bounded-evasion
description: LOCAL_PROC_MARKER_RE is case-sensitive and anchored to a specific bullet-less form; a sibling using "**Local Procedure" (capital P) or a bulleted "- **Local procedure**" escapes tooth (c)'s self-authorization check.
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [verification]
keywords: [local-proc-marker-re, case-sensitivity, bounded-evasion, self-test-gap, tooth-c]
author: claude
scenario: marker-regex-case-sensitivity-gap
item_status: pending
anchor: novel
implemented_in: null
---

# Add a self-test fixture for the marker regex's case/bullet-form evasion

## What

`LOCAL_PROC_MARKER_RE` in `check-workflow-pointer-drift.sh` is case-sensitive and requires a line
beginning with `**Local procedure`. A sibling doc using `**Local Procedure` (capital P) or a bulleted
`- **Local procedure**` escapes tooth (c)'s self-authorization detection. Adding a fourth self-test
fixture (a case- or bullet-varied marker) would close this specific detection gap.

## Why

The Risk evaluator (`4-execution/task-02-authorize-narrow-fold/evaluation/iter1/claude/risk.md`, finding
F-RISK-02) found this edge case at Confidence 50 / Severity Low. The original evaluator tagged its
Domain as `verification`, which is not a value in the canonical Domain enum
(`evaluation/SKILL.md` § Finding Metadata — the 16-value list is `security / performance / test /
observability / privacy / compliance / dependency / docs-sync / cost / accessibility / i18n /
unevaluable / phase-mismatch / regression / process / general`). RECORD re-derives the closest canonical
match: `test` — "Test gap, flake risk, test isolation failure" — because the substance of the finding is
exactly a **missing self-test fixture** for the guard's own detection surface, which routes to
`staging/checklists/` (a missing test surface) rather than `staging/decisions/`. This re-derivation is
itself worth the manager's attention as a minor evaluator-metadata-taxonomy gap, separate from the
finding's own (non-blocking) substance.

## Verification

None required for task 02 — the rule itself documents that the marker check is a partial literal check
("NOT a full semantic proof"), and other checks (`#3`/`#4`/`#5`/`#8`-b) still catch actual peer-mechanism
restatement even if a case/bullet-varied marker slips past tooth (c). A future fixture would assert:
build a doc with `- **Local Procedure**` (capitalized, bulleted) and NO manifest flag, confirm the guard
currently does NOT flag it (documents the known gap) or, once fixed, DOES flag it.

## Status notes

Not blocking. Bounded, accepted-design-boundary evasion per the rule's own "partial literal check"
disclaimer.

## Related

None.
