---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-A-02
Type: general
Domain: docs-sync
Disposition: open
Confidence: 50
Severity: Low
supersedes: null
superseded_by: null
---

# `final-iter:` Frontmatter Field Is Non-Standard in Scope Contract

## Context

iter1 Claude evaluator (Aesthetics perspective) found that the draft added a `final-iter:` frontmatter field (value "iter1-rev2") to the Scope Contract. This field is not in the canonical Scope Contract schema (`evaluation/SKILL.md` lists required fields: artifact_type, feature, goal, created-by, created-at). The schema doesn't forbid extra fields, but adding an iteration-tracking field inside the Scope Contract conflates workflow state with the contract itself. Iter number is already encoded in the rawdata file path (`rawdata/draft-iter1.md`) and `session.json`.

## Decision

Deferred. The field was carried through iters 2-4 (updating its value each iter). It is low severity and below the operational impact threshold. Planning can drop the field if it creates tooling noise; otherwise it's informational.

## Related

- `ideation/rawdata/draft-iter4.md` (carries `final-iter: iter4` in frontmatter)
- iter1 `evaluation/iter1/claude/aesthetics.md` § F-A-02
