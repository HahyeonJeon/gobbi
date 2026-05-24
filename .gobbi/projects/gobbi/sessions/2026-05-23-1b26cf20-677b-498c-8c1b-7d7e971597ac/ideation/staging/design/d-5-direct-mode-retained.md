---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
feature: session-foundations-bundle-b
design-id: D-5
slug: d-5-direct-mode-retained
status: locked
iter: 2
---

# D-5 — Direct mode preserved as documented opt-out

## Decision

Row 5.5's worktree creation includes a guard: `skip if session.json.git.workflow.mode == "direct"`. Direct mode is preserved as a documented escape hatch.

The Scope Contract locks worktree-first as the **default**, not a **mandate**. The user can configure `settings.git.workflow.mode = "direct"` to bypass worktree creation.

## Rationale

Sub-step A counterfactual surfaced "emergency hotfix / pure read-only" sessions as legitimate use cases for direct mode. Removing direct mode would be a scope expansion beyond the user-locked decision.

## Anchored insights

Sub-step A counterfactual / steel-man (CP-1.3-γ Option A user lock).

## Validation

Evaluator Consistency check: `orchestration/SKILL.md` and `git/SKILL.md` reference `settings.git.workflow.mode` identically. `grep -n 'workflow.mode' .claude/skills/orchestration/SKILL.md` and `grep -n 'workflow.mode' .claude/skills/git/SKILL.md` both show matching references.

## Implementation checklist anchor

T1-I-T1.g (no code change — confirm guard is present)

## Source

`rawdata/draft-iter3.md:336-340` (D-5 narrative)
