---
name: t1-decisions
description: Locked decisions + commits for Execution Loop task T1 (.claude/hooks/session-start.sh authoring) + T1 hardening follow-up.
type: decisions-log
loop: execution
task: T1
session-id: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
verdict: pass
created: 2026-05-22
---

# T1 Decisions Log

## Commits

- `fd216fe feat: add SessionStart hook with shell-safe jq @sh quoting` — T1 main commit. Implements Idea § Hook contract + FIX 1 (drop CLAUDE_SESSION_ID) + FIX 5 (CLAUDE_HOOK_SOURCE) + FIX C (jq -r @sh shell-safe quoting). 78 insertions, 1 file (.claude/hooks/session-start.sh).
- `51199d6 fix: fail-fast on empty stdin in SessionStart hook` — T1 hardening follow-up. Adds 2-line guard after `payload="$(cat)"` to fail-fast with stderr message on empty stdin (addresses F-OVERALL-01 Medium below threshold; user-authorized inline polish).

## Dual-system EVAL iter1

- Codex: PASS. 7/7 criteria + 5 stress fixtures (optional fields absent / invalid JSON / missing $CLAUDE_ENV_FILE / passthroughs unset / malicious stdin injection) all pass. No findings.
- Claude: PASS. 8/8 criteria + 6 stress fixtures pass. 1 Medium/100 finding (F-OVERALL-01 empty-stdin silent success) below REVISE threshold + 2 Low.

Aggregated: PASS. Hardening (F-OVERALL-01) accepted via user-authorized inline follow-up commit 51199d6 — preserves T1 PASS while addressing the Medium.

## Below-threshold findings (filed for awareness, no further action)

- **F-AEST-01** (Low/below threshold, docs) — Hook header comment doesn't mention the dual quoting strategy (@sh for JSON-derived fields; printf %q for env-passthrough fields). Future maintainer concern only.
- **F-USAGE-01** (Low/below threshold, edge) — `null` in a required JSON field would emit literal string "null" via jq rather than empty; out-of-spec per Idea § Hook contract (required fields are always non-null at the source).

## Outcome

T1 closes at PASS. Hook script + executable bit + canonical pattern + FIX C round-trip + hardening guard all confirmed. Ready to advance to T2 (settings.json registration).
