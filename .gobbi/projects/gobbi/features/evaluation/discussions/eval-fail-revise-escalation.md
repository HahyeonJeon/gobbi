---
name: eval-fail-revise-escalation
description: Ideation iter2 dual-system FAIL due to unregistered session branch prefix — user authorized iter3 as a surgical 3-fix revision.
type: discussions
scope: feature
feature: evaluation
status: active
created: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [evaluation, ideation, fail-verdict, branch-naming]
---

# Ideation evaluation FAIL — iter3 authorized as 3-fix surgical revision

## Question

Ideation evaluation concluded FAIL (Claude: FAIL; Codex: REVISE → pessimistic-union = FAIL). The FAIL root cause was the proposed `session/{date}-{ssid-short}` branch name using an unregistered type prefix `session/` (not in the `git/conventions.md` registry). How should the next iteration proceed?

## User answer

User authorized a surgical 3-fix revision:
1. **Fix A**: replace `session/{date}-{ssid-short}` with `chore/session-{date}-{ssid-short}` everywhere (user-locked branch prefix using existing `chore` type)
2. **Fix B**: verify `PostToolUseFailure` officially via WebFetch of `https://code.claude.com/docs/en/hooks` and preserve verbatim quote
3. **Fix C**: flag `.gobbi/project.json` initialization step in the project-json resolver design as a dormant precondition and stage a feature-level backlog

No other content changes. The next iteration was the final iteration allowed under the 3-iteration evaluation budget.

## Impact on design

All active design statements updated to use `chore/session-` prefix. Verbatim `PostToolUseFailure` quotes preserved. Dormant precondition documented in the project-json resolver design.
