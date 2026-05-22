---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
loop: planning
feature: repo-reset
topic: Planning iter3 REVISE — Convergent tag-form drift + iter3 4 surgical fixes (D-PLAN-08 through D-PLAN-11)
outcome: iter3 REVISE entry with 4 manager-authorized surgical textual edits; D-PLAN-08-11 locked
---

# Planning iter3 REVISE — Tag-Form Drift Remediation

## Context

iter2 evaluation (Claude REVISE + Codex REVISE) converged on a tag-form drift introduced by the Fix-1 rewrite: Task 01's Special-discipline cell now read `git tag -a pre-reset-2026-05-21 487fc35` (annotated form) instead of `git tag pre-reset-2026-05-21 487fc35` (lightweight form). The annotated form without `-m` opens `$EDITOR`, hanging a headless executor.

## Question / Options / Manager Authorizations (no scope expansion)

**D-PLAN-08 — Tag form correction** (iter3 Fix 1):
- `git tag pre-reset-2026-05-21 487fc35` everywhere; NO `-a`, NO `-m`.
- line 54 prose: "annotated" → "lightweight"; line 448 imperative: `git tag -a ...` → `git tag ...`.
- Manager-authorized (no user AskUserQuestion required — pure textual correction within scope).

**D-PLAN-09 — Manager §5a precheck** (iter3 Fix 2):
- Add `git status --porcelain` precheck before each `git worktree remove` in Stage F.
- Non-empty output → NEEDS_CONTEXT; never auto-`--force`.
- Manager-authorized.

**D-PLAN-10 — main.md mistake-load wording** (iter3 Fix 3):
- Rewrite the F-CX-PREP-O-01 paragraph to say "before Stage A and before Stage C wipes mistakes/".
- Manager-authorized.

**D-PLAN-11 — Self-review grep** (iter3 Fix 4):
- Add Self-review § 9 with `rg -n "annotated|tag -a|lightweight|git tag pre-reset"` verification.
- Manager-authorized.

## Implication

iter3 closed 4 convergent iter2 findings (tag-form drift) and 2 additional Claude findings (worktree precheck + main.md wording). The self-review grep was added to mechanically prove zero residual annotated-tag commands. Codex caught a further docs-sync drift in main.md (F-CX-PLAN-O3-O-01) that triggered iter4.

## Related

- `planning/artifacts/decisions-log.md` § D-PLAN-08 through D-PLAN-11
- `planning/evaluation/iter3/claude/overall.md`
- `planning/evaluation/iter3/codex/overall.md`
