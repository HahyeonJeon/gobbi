---
name: session-start-hook-script-decisions
description: Decisions and verification outcomes for the SessionStart hook script authoring task — commits, dual-system evaluation pass, and below-threshold findings.
type: decisions
scope: feature
feature: install-runtime
status: active
created: 2026-05-22
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
tags: [session-start-hook, execution, decisions-log]
loop: execution
task: T1
session-id: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
verdict: pass
---

# SessionStart hook script decisions and evaluation outcome

## Commits

- `fd216fe feat: add SessionStart hook with shell-safe jq @sh quoting` — T1 main commit. Implements Idea § Hook contract + FIX 1 (drop CLAUDE_SESSION_ID) + FIX 5 (CLAUDE_HOOK_SOURCE) + FIX C (jq -r @sh shell-safe quoting). 78 insertions, 1 file (.claude/hooks/session-start.sh).
- `51199d6 fix: fail-fast on empty stdin in SessionStart hook` — T1 hardening follow-up. Adds 2-line guard after `payload="$(cat)"` to fail-fast with stderr message on empty stdin (addresses F-OVERALL-01 Medium below threshold; user-authorized inline polish).

## Dual-system evaluation (iteration 1)

- Codex: PASS. 7/7 criteria + 5 stress fixtures (optional fields absent / invalid JSON / missing $CLAUDE_ENV_FILE / passthroughs unset / malicious stdin injection) all pass. No findings.
- Claude: PASS. 8/8 criteria + 6 stress fixtures pass. 1 Medium/100 finding (F-OVERALL-01 empty-stdin silent success) below REVISE threshold + 2 Low.

Aggregated: PASS. Empty-stdin hardening accepted via user-authorized inline follow-up commit 51199d6 — preserves PASS while addressing the Medium finding.

## Below-threshold findings (filed for awareness, no further action)

- **Docs finding** (Low/below threshold) — Hook header comment doesn't mention the dual quoting strategy (@sh for JSON-derived fields; printf %q for env-passthrough fields). Future maintainer concern only.
- **Edge finding** (Low/below threshold) — `null` in a required JSON field would emit literal string "null" via jq rather than empty; out-of-spec per hook contract (required fields are always non-null at the source).

## Outcome

T1 closes at PASS. Hook script + executable bit + canonical pattern + FIX C round-trip + hardening guard all confirmed. Ready to advance to T2 (settings.json registration).
