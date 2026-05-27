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

# Decide `feat:` vs `docs:` commit type for behavior-introducing SKILL.md edits

## What

When committing a change to a `SKILL.md` file (or any `.md` workflow-specification file) that introduces net-new workflow behavior rather than correcting existing prose, decide the commit type by these steps:

- [ ] Does the change introduce net-new workflow behavior (a new procedure step, a new decision branch, a new state-machine element)?
  - If yes: `feat:` is defensible (workflow-as-spec — the spec IS the behavior change).
  - If no (prose correction, clarification, rewording): use `docs:`.
- [ ] Has the project ratified a rule for this disambiguation? Check `.gobbi/projects/gobbi/rules/` for a commit-type rule for SKILL.md edits.
- [ ] If no rule exists: surface the question to the user before committing, so the decision can be captured as a project rule.

## Why

The commit that shipped the worktree-create row (`feat(orchestration): add Configuration Step 1 worktree creation`) was a `.md`-only diff that nonetheless introduced workflow behavior (the worktree-creation procedure). `git/conventions.md` says `feat:` is for source features and `docs:` for documentation-only changes, but it gives no tie-breaker for SKILL.md edits that are documentation in form yet behavior in effect. Without a ratified rule, each such commit re-litigates the type choice.

## Verification

The chosen commit type matches the decision tree above, and — once a project rule is ratified — a corresponding commit-type rule exists under `.gobbi/projects/gobbi/rules/`.

## Status notes

Pending user ratification as a standing project rule. The originating commit was not changed retroactively. Reference: `git/conventions.md` § Commit Type registry. Surfaced by a Claude consistency-evaluation finding during the worktree-create session-architecture work (session `1b26cf20`).
