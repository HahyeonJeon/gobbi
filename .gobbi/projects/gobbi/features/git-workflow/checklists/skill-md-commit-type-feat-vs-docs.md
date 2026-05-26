---
name: skill-md-commit-type-feat-vs-docs
description: Checklist for determining whether a SKILL.md commit that introduces net-new workflow behavior should use feat: or docs: commit type.
type: checklists
scope: feature
feature: git-workflow
status: open
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [commit-type, feat, docs, skill-md, git-conventions]
domain: docs-sync
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

The commit that shipped the worktree-create row 5.5 (`feat(orchestration): add Configuration Step 1 row 5.5 worktree creation`) was a `.md`-only diff that introduced workflow behavior (worktree creation procedure). `git/conventions.md` says `feat:` is for source features and `docs:` for documentation-only changes, but there is no tie-breaker for SKILL.md edits. The commit was not changed retroactively — the question needs ratification as a standing rule.

## Related

- `git/conventions.md` § Commit Type registry
- A Claude consistency evaluation finding from the worktree-create session surfaced this gap (finding C-001)
