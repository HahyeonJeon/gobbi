---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-C-04
Type: assumption_risk
Domain: docs-sync
Disposition: addressed
Confidence: 50
Severity: Low
supersedes: null
superseded_by: null
---

# `.gitignore` Line Cited by Line Number Rather Than Content

## Context

iter1 Claude evaluator (Consistency perspective) found that the artifact cited `.gitignore` line numbers (I6: "lines 9–18") that could be stale if the file were edited. The actual deletion operation is unambiguous via text content, not line number, so an executor using `grep` by content rather than line anchor would not be affected.

## Decision

iter2 rewrites the I6 reference to cite the line content, not the line number. The gitignore edit step references the exact line text (e.g., `.gobbi/projects/*/sessions/`) rather than a line-number anchor.

## Rationale

Line numbers in documentation become stale when files are edited. Citing content is stable across edits. The functional operation (delete a specific line from `.gitignore`) is clearer when identified by its text.

## Consequences

No functional change. Executor instructions reference gitignore content by text, not line number. Line-number citations in the artifact were removed in iter2.

## Related

- `ideation/artifacts/implementation-checklist.md` § Stage B (gitignore edit)
- iter1 `evaluation/iter1/claude/consistency.md` § F-C-04
