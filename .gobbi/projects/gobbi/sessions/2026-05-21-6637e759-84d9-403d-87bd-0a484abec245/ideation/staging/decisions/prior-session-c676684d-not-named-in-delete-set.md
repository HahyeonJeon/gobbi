---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-P-03
Type: design_flaw
Domain: docs-sync
Disposition: addressed
Confidence: 75
Severity: Medium
supersedes: null
superseded_by: null
---

# Prior Date-Prefixed Session `2026-05-21-c676684d-...` Not Named in Delete Set

## Context

iter1 Claude evaluator (Project perspective, S-PROJ-NEW-3) found that the second date-prefixed session dir `2026-05-21-c676684d-4d54-48c0-bd61-10855c60a42a` was not explicitly named in the delete set — only mentioned implicitly in the find predicate. This dir contains the session that promoted today's three project mistakes.

## Decision

iter2 M-3 adds an explicit naming of `2026-05-21-c676684d-...` in the Stage E.1 delete set. The draft now says explicitly: "`2026-05-21-c676684d-4d54-48c0-bd61-10855c60a42a/` (iter2 M-3: explicit name; this is the prior date-prefixed session that promoted today's 3 mistakes)". This also makes the H-2 trade-off internally consistent: the three mistake files promoted from that session will be deleted by Stage C.

## Rationale

Explicit naming reduces executor ambiguity. A find predicate with exclusions is correct but can be misread; explicit naming alongside the find command provides belt-and-suspenders verification.

## Consequences

Stage E.1's delete set is unambiguous. The prior session dir's deletion is consistent with the H-2 accepted trade-off.

## Related

- `ideation/artifacts/scope-contract.md` (Stage E.1)
- iter1 `evaluation/iter1/claude/project.md` § F-P-03
