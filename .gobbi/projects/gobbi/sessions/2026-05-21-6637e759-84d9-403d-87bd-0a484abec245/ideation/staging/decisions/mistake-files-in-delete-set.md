---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-R-02
Type: design_flaw
Domain: process
Disposition: addressed
Confidence: 100
Severity: High
supersedes: null
superseded_by: null
---

# Mistake Files Cited as Load-Bearing Will Be Deleted by Stage C Placeholder Reset

## Context

iter1 Claude evaluator (Risk perspective) found that the three project mistakes promoted by the prior session (`executor-rationalized-failing-verification-gate.md`, `session-dir-naming-convention-uses-date-prefix.md`, `manager-mispec-grep-c-for-occurrence-count.md`) are untracked files living under `.gobbi/projects/gobbi/mistakes/`. Q-A places `mistakes/` in the PLACEHOLDER list. Stage C's `git rm -r <subdir>/*` PLUS `rm -rf <subdir>/*` (to catch untracked stragglers) will delete all three files. Yet the artifact cited these same mistake files as "load-bearing inputs" to the Ideation.

## Decision

This was surfaced to the user as a Q-H decision (H-2 user-accepted trade-off). The user confirmed: accept deletion — the three mistake files served their purpose in informing this Ideation session. Their lessons are encoded in the Ideation artifacts themselves (the Q-Gate-Redesign, the NEEDS_CONTEXT discipline, the grep-c audit in D2). The CLAUDE.md mandate "a correction not recorded is a correction repeated" is satisfied because: (a) this session's Memorization will preserve the lessons in session artifacts, and (b) the rebuild session will re-promote any mistakes needed from session artifacts.

## Rationale

The mistake files are untracked (git status shows `??`). They were promoted by the prior session but never committed to the repo. The sweep does not commit them — they are cleaned by the `rm -rf` step for untracked stragglers. The lessons they encode are preserved in this session's Ideation artifacts, particularly in: the Q-Gate-Redesign decision (E.2 non-circular gate), the F-R-03 finding's evolution, the D2 grep-c audit pattern, and the NEEDS_CONTEXT discipline citations throughout the Implementation Checklist.

## Consequences

All three mistake files will be deleted by Stage C. Their encoded learnings survive via this session's Ideation artifacts and session.json. The rebuild session is responsible for re-promoting any mistake that needs long-term persistence.

## Related

- `ideation/artifacts/scope-contract.md` § Q-A placeholder list + H-2 trade-off acknowledgement
- `ideation/artifacts/design-direction.md` § D2 (grep-c audit, NEEDS_CONTEXT discipline)
- iter1 `evaluation/iter1/claude/risk.md` § F-R-02
