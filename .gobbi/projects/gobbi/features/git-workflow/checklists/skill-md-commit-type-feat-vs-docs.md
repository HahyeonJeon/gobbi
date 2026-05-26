---
scope: feature
feature: git-workflow
finding-id: C-001
finding-type: general
domain: docs-sync
severity: Low
confidence: 50
disposition: open
source_iter: 1
source_system: claude
source_file: execution/task-01/evaluation/iter1/claude/consistency.md
---

# Checklist: SKILL.md Commits — `feat:` vs `docs:` Type

## When to apply

When committing a change to a `SKILL.md` file (or any `.md` workflow specification file) that introduces net-new workflow behavior rather than correcting existing prose.

## Checklist items

- [ ] Does the SKILL.md change introduce net-new workflow behavior (a new procedure step, a new decision branch, a new state machine element)?
  - If yes: `feat:` is defensible (workflow-as-spec; the spec IS the behavior change)
  - If no (prose correction, clarification, rewording): use `docs:`
- [ ] Has the project ratified a rule for this disambiguation? Check `.gobbi/projects/gobbi/rules/` for a commit-type rule for SKILL.md edits.
- [ ] If no rule exists: surface to user before committing so the decision can be captured as a project rule.

## Context

`feat(orchestration): add Configuration Step 1 row 5.5 worktree creation` (commit 14da700) is a `.md`-only diff that introduces workflow behavior (worktree creation procedure). `git/conventions.md` says `feat:` is for source features and `docs:` for documentation-only changes, but there is no tie-breaker for SKILL.md edits. The commit was evaluated and not changed retroactively — the question needs ratification as a standing rule.

## Related

- `execution/task-01/evaluation/iter1/claude/consistency.md` — finding C-001
- `git/conventions.md` § Commit Type registry
