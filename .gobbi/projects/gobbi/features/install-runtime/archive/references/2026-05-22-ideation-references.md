---
title: External references — Env-Var Audit + SessionStart Hook Ideation
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
loop: ideation
scope: feature
feature: install-runtime
created: 2026-05-22
promoted_from: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/staging/references/ideation-references.md
promoted_at: 2026-05-22
status: superseded
superseded_by: [references/claude-code-hooks-stdin-contract.md, references/claude-code-changelog-ccsi-version.md]
archive_reason: "Bundle file (2 references) split to one-concept-per-file per blocklist #11; memory-redesign W2-T3b."
archived_at: 2026-05-26
---

# External References — Env-Var Audit + SessionStart Hook Ideation

Two external references were consulted during this Ideation loop. Both informed locked design decisions in the Idea artifact.

---

## Reference 1 — Claude Code hooks documentation (via assistant subagent lookup)

```yaml
title: Claude Code hooks documentation — SessionStart hook stdin contract
source: https://docs.anthropic.com/en/docs/claude-code/hooks
type: docs
accessed: 2026-05-22
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
tags: [hooks, env-vars, session-start, stdin-json]
related: [f-risk-01-subagent-ccsi-semantics, f-struct-01-jq-sh-env-passthrough]
```

### Insight

The SessionStart hook receives a stdin JSON payload with 8 fields: `session_id`, `transcript_path`, `cwd`, `hook_event_name` (always `"SessionStart"`), `source` (one of `startup`/`resume`/`clear`/`compact`), `agent_id` (optional), `agent_type` (optional), `permission_mode` (optional). The `source` field is separate from `hook_event_name` — this distinction was the basis for adding `CLAUDE_HOOK_SOURCE` as a new export (FIX 5 / P3).

Additionally confirmed: `$CLAUDE_CODE_SESSION_ID` is a **runtime-auto-set** env var (not hook-only); hook-only vars (only available inside a hook handler via stdin JSON) include `CLAUDE_SESSION_ID`, `CLAUDE_TRANSCRIPT_PATH`, `CLAUDE_CWD`, `CLAUDE_HOOK_EVENT_NAME`, and the optional fields. Runtime-set in Bash subprocesses: `CLAUDE_CODE_SESSION_ID`, `CLAUDE_EFFORT`, `CLAUDECODE=1`, `CLAUDE_CODE_REMOTE`.

### Why it applies

The assistant subagent lookup result was the empirical grounding for the entire P1 rename decision (which var is runtime-set vs hook-only) and the P3 hook contract (which fields to export from stdin JSON). Without this cross-reference, the rename from `$CLAUDE_SESSION_ID` to `$CLAUDE_CODE_SESSION_ID` would have been an untested claim. The lookup confirmed the official docs-side distinction.

### Source

- Primary: https://docs.anthropic.com/en/docs/claude-code/hooks (Claude Code hooks reference page)
- Accessed: 2026-05-22 via assistant subagent dispatched during Ideation DISCUSSION

### Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-22 | 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d | Grounded P1 rename decision; informed P3 hook contract (which fields to export); basis for `CLAUDE_HOOK_SOURCE` addition (FIX 5) |

---

## Reference 2 — Claude Code changelog — `CLAUDE_CODE_SESSION_ID` introduction version

```yaml
title: Claude Code changelog — CLAUDE_CODE_SESSION_ID introduced in v2.1.132
source: https://docs.anthropic.com/en/docs/claude-code/changelog
type: docs
accessed: 2026-05-22
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
tags: [env-vars, changelog, version, ccsi]
related: [f-risk-01-subagent-ccsi-semantics]
```

### Insight

`$CLAUDE_CODE_SESSION_ID` was introduced in Claude Code **v2.1.132** (not v2.1.128+ as the Idea artifact iter1 had incorrectly stated). The official changelog was the authoritative source for the exact version number, which the Codex evaluator flagged in iter1 finding COD-OVERALL-002b (High/100). The correction (FIX 6) updated all 7 version references in the artifact from "v2.1.128" to "v2.1.132".

### Why it applies

Any skill doc that says "as of Claude Code v2.1.132" is making a version claim that should be accurate. An incorrect version number causes false confidence in users on older releases and introduces version-test confusion in Execution. The changelog cross-reference settled this definitively.

### Source

- Primary: https://docs.anthropic.com/en/docs/claude-code/changelog (Claude Code release changelog)
- Accessed: 2026-05-22 via Codex evaluator's iter1 evaluation (COD-OVERALL-002b)

### Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-22 | 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d | Corrected version number in all 7 version references in the artifact (FIX 6); now cited in P5 sub-section as the `CLAUDE_CODE_SESSION_ID` introduction version |
