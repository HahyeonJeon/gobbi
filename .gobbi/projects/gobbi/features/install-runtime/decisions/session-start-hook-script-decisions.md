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
verdict: pass
---

# SessionStart hook script decisions and evaluation outcome

## Context

The SessionStart hook script authoring task implemented the hook contract locked during Ideation (see `env-file-load-semantics-decisions.md`). This record captures the decision that the script shipped at PASS, the commits that delivered it, and the below-threshold findings filed for awareness.

## Decision

**The SessionStart hook script ships at PASS.** The hook script, its executable bit, the canonical `jq -r @sh` quoting pattern, the round-trip safety check, and an empty-stdin hardening guard are all confirmed. The task closes and the work advances to the settings.json registration task.

The work shipped in two commits:

- `fd216fe feat: add SessionStart hook with shell-safe jq @sh quoting` — the main commit. Implements the Ideation hook contract plus FIX 1 (drop `CLAUDE_SESSION_ID`), FIX 5 (`CLAUDE_HOOK_SOURCE`), and FIX C (`jq -r @sh` shell-safe quoting). 78 insertions, 1 file (`.claude/hooks/session-start.sh`).
- `51199d6 fix: fail-fast on empty stdin in SessionStart hook` — a hardening follow-up. Adds a 2-line guard after `payload="$(cat)"` to fail-fast with a stderr message on empty stdin (addresses the empty-stdin Medium finding below; user-authorized inline polish).

## Rationale

The dual-system evaluation passed on the first round:

- Codex: PASS. 7/7 criteria + 5 stress fixtures (optional fields absent / invalid JSON / missing `$CLAUDE_ENV_FILE` / passthroughs unset / malicious stdin injection) all pass. No findings.
- Claude: PASS. 8/8 criteria + 6 stress fixtures pass. One Medium finding (empty-stdin silent success) below the REVISE threshold, plus 2 Low.

Aggregated: PASS. The empty-stdin hardening was accepted via the user-authorized inline follow-up commit `51199d6` — preserving the PASS while addressing the Medium finding.

## Alternatives considered

No design alternatives were re-opened at this task: the hook contract was already locked during Ideation. The only judgment call was whether to address the below-threshold empty-stdin Medium finding now or defer it; it was addressed inline (commit `51199d6`) rather than deferred, on user authorization, because the fix was a 2-line guard.

## Consequences

- The hook ships as `.claude/hooks/session-start.sh` with the executable bit set and the canonical `jq -r @sh` quoting pattern.
- Work advances to the settings.json registration task.
- Two below-threshold findings are filed for awareness, no further action: (1) the hook header comment does not mention the dual quoting strategy (`@sh` for JSON-derived fields; `printf %q` for env-passthrough fields) — a future-maintainer concern only; (2) a `null` in a required JSON field would emit the literal string `"null"` via jq rather than empty — out-of-spec per the hook contract, where required fields are always non-null at the source.

## Related

- `decisions/env-file-load-semantics-decisions.md` — the Ideation decisions (FIX 1 / FIX 5 / FIX C) this script implements.
- `notes/2026-05-22-env-var-audit-sessionstart-hook.md` — the project session journal for this work.
