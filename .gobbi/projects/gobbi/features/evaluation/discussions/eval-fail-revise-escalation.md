---
name: eval-fail-revise-escalation
description: An Ideation evaluation round FAILed (dual-system) over an unregistered session branch prefix — user authorized the final iteration as a surgical 3-fix revision.
type: discussions
scope: feature
feature: evaluation
status: active
created: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [evaluation, ideation, fail-verdict, branch-naming]
---

# Ideation evaluation FAIL — final iteration authorized as a 3-fix surgical revision

## Context

A round of Ideation evaluation concluded FAIL (Claude returned FAIL; Codex returned REVISE; the pessimistic union is FAIL). The FAIL root cause was that the proposed branch name `session/{date}-{ssid-short}` used an unregistered type prefix `session/` — not present in the `git/conventions.md` branch-type registry. With one evaluation iteration left in the 3-iteration budget, the question was how to spend it.

## Question

Given the FAIL, how should the final allowed evaluation iteration proceed — a broad re-work, or a narrow targeted fix?

## Options considered

- **Surgical 3-fix revision** — change only the three items tied to the FAIL findings, no other content changes, and re-evaluate.
- **Broader re-work of the Ideation design** — reopen more of the design, risking new findings late in the budget with no iterations left to absorb them.

## User decision

The user authorized a surgical 3-fix revision, with no other content changes:
1. **Fix A**: replace `session/{date}-{ssid-short}` with `chore/session-{date}-{ssid-short}` everywhere — a user-locked branch prefix reusing the already-registered `chore` type.
2. **Fix B**: verify the `PostToolUseFailure` hook event officially via WebFetch of `https://code.claude.com/docs/en/hooks` and preserve the verbatim quote.
3. **Fix C**: flag the `.gobbi/project.json` initialization step in the project-json resolver design as a dormant precondition and stage a feature-level backlog item for it.

This was the final iteration allowed under the 3-iteration evaluation budget.

## Implication

All active design statements were updated to the `chore/session-` prefix; the verbatim `PostToolUseFailure` quote was preserved; and the dormant `.gobbi/project.json` precondition was documented in the project-json resolver design. The `chore/session-` branch prefix is now the user-locked convention (this worktree's branch follows it).

## Related

- [`discussions/eval-pass-loop-closed.md`](eval-pass-loop-closed.md) — the next (final) iteration's PASS that closed the Ideation loop.
