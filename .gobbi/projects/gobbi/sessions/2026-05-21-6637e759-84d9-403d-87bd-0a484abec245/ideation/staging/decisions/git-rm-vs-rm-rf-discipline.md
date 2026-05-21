---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-R-01
Type: assumption_risk
Domain: process
Disposition: addressed
Confidence: 75
Severity: Low
supersedes: null
superseded_by: null
---

# Blast Radius Enumeration Omits `.codex/` Symlink-Target Dependency

## Context

iter1 Claude evaluator (Risk perspective) found that the blast-radius enumeration implied `.codex/` was a normal tracked tree, but verified that `.codex/{agents,hooks,project,rules,skills}` are actually tracked symlinks pointing into `.claude/{agents,hooks,project,rules,skills}`. The Q-D deletion of `.claude/project/gobbi/` leaves the `.claude/project/` parent intact (only the `gobbi/` subdir is deleted), so no broken symlinks result. However, the artifact did not note the symlink farm relationship.

## Decision

iter2 adds a one-line note in the Scope Contract item 5 (and the corresponding design section): "`.codex/{agents,hooks,project,rules,skills}` are tracked symlinks into `.claude/`; `git rm -r .codex/` removes the symlinks (targets in `.claude/` survive)."

## Rationale

Risk discipline requires understanding the surface being touched, not just that the outcome is safe. Naming the symlink relationship explicitly prevents future confusion about why `.codex/` deletion does not affect `.claude/` content.

## Consequences

Stage C's `git rm -r .codex/` step is annotated with the symlink-farm note. The blast radius is correctly scoped: `.claude/` content survives `.codex/` deletion.

## Related

- `ideation/artifacts/scope-contract.md` § In-Scope item 5 (`.codex/` wipe)
- iter1 `evaluation/iter1/claude/risk.md` § F-R-01
