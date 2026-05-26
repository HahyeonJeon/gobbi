---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
scope: feature
feature: evaluation
discussion-id: iter2-revise-escalation
slug: eval-fail-revise-escalation
phase: ideation
sub-step: evaluation
loop-iter: 2
---

# iter2 evaluation result — FAIL (pessimistic-union); iter3 authorized as 3-fix surgical revision

## Question asked (implicit — AskUserQuestion after iter2 evaluation)

iter2 evaluation concluded FAIL (Claude: FAIL; Codex: REVISE → pessimistic-union = FAIL). The FAIL root cause was iter2's `session/{date}-{ssid-short}` branch name using unregistered type prefix `session/` (not in `git/conventions.md:22` registry). How should iter3 proceed?

## User answer

User authorized iter3 as a **surgical 3-fix revision**:
1. **Fix A**: replace `session/{date}-{ssid-short}` with `chore/session-{date}-{ssid-short}` everywhere (user-locked branch prefix using existing `chore` type)
2. **Fix B**: verify `PostToolUseFailure` officially via WebFetch of `https://code.claude.com/docs/en/hooks` and preserve verbatim quote
3. **Fix C**: flag `.gobbi/project.json` step (i) in D-3-3-resolver as dormant precondition + stage a feature-level backlog

No other content changes. iter3 is the final iteration (maxIterations=3 budget).

## Impact on design

All active design statements updated to use `chore/session-` prefix. verbatim PostToolUseFailure quotes preserved. Dormant precondition documented in D-3-3-resolver. See `staging/design/d-1-worktree-row-5-5.md`, `staging/design/d-3-3-resolver.md`.

## Source

`rawdata/draft-iter3.md:519-537` (iter3 fix-decisions F-Fix-A, F-Fix-B, F-Fix-C)
