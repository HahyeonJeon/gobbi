---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-S-03
Type: design_flaw
Domain: process
Disposition: addressed
Confidence: 75
Severity: Low
supersedes: null
superseded_by: null
---

# Inline Commit-vs-FS Labels Missing From Stage Descriptions

## Context

iter1 Claude evaluator (Structure perspective) found that the per-stage descriptions lacked explicit inline labels distinguishing "enters the commit" vs. "FS-only hygiene" operations.

## Decision

iter2 adds inline commit-vs-FS labeling to each stage. Operations are now explicitly marked as "sweep-branch commit N" or "FS-only hygiene, does NOT enter the commit" or "untracked — FS-only." Every stage has the commit-vs-FS distinction documented inline.

## Rationale

The mixed `git rm` vs `rm -rf` distinction is critical for correctness. An executor who conflates them may try to `git rm` untracked files or omit untracked files from cleanup.

## Consequences

Implementation Checklist now has unambiguous per-operation labels.

## Related

- `ideation/artifacts/implementation-checklist.md`
- iter1 `evaluation/iter1/claude/structure.md` § F-S-03
