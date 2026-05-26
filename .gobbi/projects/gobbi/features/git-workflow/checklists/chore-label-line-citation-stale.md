---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: open
scope: feature
feature: git-workflow
finding-id: COD-CONS-ITER3-002
type: general
domain: docs-sync
disposition: open
confidence: 100
severity: Low
---

# `chore` label line citation in `git/conventions.md` is off by 2 lines

## Context

`draft-iter3.md` lines 310 and 524 cite "`chore | #e4e669` at line 261" in `git/conventions.md`. Codex evaluator ran `grep -n` and found `fix` at line 261; `chore` is at line 263.

The branch name `chore/session-{date}-{ssid-short}` is correctly registry-compliant — the label exists at line 263 and the type regex at line 22 includes `chore`. This is a citation-accuracy issue only.

## Checklist item for docs sweep

- [ ] In `draft-iter3.md:310`: update the citation from `git/conventions.md:261` to `git/conventions.md:263`
- [ ] In `draft-iter3.md:524`: update the same citation from line 261 to line 263
- [ ] After update: `grep -n "conventions.md:261" draft-iter3.md` returns 0 matches

## Related

- `evaluation/iter3/codex/consistency.md` COD-CONS-ITER3-002
- `evaluation/iter3/codex/aesthetics.md` COD-AESTH-ITER3-001
- `evaluation/iter3/codex/overall.md` COD-OVERALL-ITER3-002
- Note: a duplicate of this finding is also at `staging/decisions/chore-label-line-citation-stale.md` (misrouted in prior pass)
