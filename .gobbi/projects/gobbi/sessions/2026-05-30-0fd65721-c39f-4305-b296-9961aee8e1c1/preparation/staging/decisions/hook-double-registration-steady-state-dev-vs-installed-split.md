---
name: hook-double-registration-steady-state-dev-vs-installed-split
description: User ratified Option C (dev-vs-installed split) for DD-8 — settings.json keeps dev registration, plugin hooks.json serves installed users; keep coherent + fire-exactly-once validation for installed case.
type: decisions
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, hooks, double-registration, dd-8, r2]
supersedes: null
superseded_by: null
decision_status: ratified
mistake-candidate: false
related:
  - features/install-runtime/design/dual-hook-registration-resolver.md
---

# Hook double-registration steady-state — RATIFIED Option C (dev-vs-installed split)

## Context

DD-8 (Planning blocker, from R2): once the plugin ships `hooks/hooks.json` with the 3 event registrations, does it REPLACE the project-local `.claude/settings.json` hook block (Option A), COEXIST (Option B), or split dev-vs-installed (Option C)? Coexistence means each event fires the script twice → duplicate `session.json.agents[]` upserts + double env-export.

## Decision — RATIFIED by user via AskUserQuestion 2026-05-30: Option C (dev-vs-installed split)

The leader recommended Option A (replace); the user chose **Option C (dev-vs-installed split)**:

- **`.claude/settings.json` KEEPS its 3 hook-event registrations** for in-repo development (so hooks keep firing during dev sessions like this one, without requiring the plugin to be installed).
- **The plugin's `plugins/gobbi/hooks/hooks.json`** reproduces the same 2 scripts / 3 events for INSTALLED users, with `${CLAUDE_PLUGIN_ROOT}`-based command paths.
- The two registration sources are **scoped to different contexts** (dev tree vs installed cache).

## Planning obligations (consequences of Option C)

1. **Keep the two coherent** — `hooks.json` must mirror the live `settings.json` shape exactly: same 2 scripts (`session-start.sh`, `post-tool-use-agents.sh`), same 3 events (SessionStart matcher `startup|resume|clear|compact`; PostToolUse + PostToolUseFailure matcher `Task|Agent`, both → `post-tool-use-agents.sh`). Drift between them is a defect; fold into the same re-materialize trigger as the skills/agents drift gate.
2. **Fire-exactly-once validation (installed case)** — instrument each of the 3 registrations to write a per-fire marker keyed on `hook_event_name` (+ `tool_use_id`), trigger each event once post-install, assert exactly one marker per event. Because `post-tool-use-agents.sh` backs both `PostToolUse` and `PostToolUseFailure`, the marker MUST key on `hook_event_name` to avoid a false double-count.
3. **Document the double-fire caveat** — a machine that BOTH develops in-repo AND installs the plugin will register both sources → double-fire. Accepted per user choice; bounded by `flock` + upsert-by-id to latency/log-noise, NOT data corruption. The `claude-plugin` skill's gobbi section should note this.

## Trade-off the user owned

Single-source-of-truth (Option A) vs uninterrupted in-repo dev-mode hooks (Option C). User chose C — dev-mode hooks keep working without installing the plugin.

## Evidence

- live `.claude/settings.json` — 3 blocks (SessionStart / PostToolUse / PostToolUseFailure).
- `features/install-runtime/design/dual-hook-registration-resolver.md` (D-3-3, locked): single-script dual PostToolUse+PostToolUseFailure registration must be preserved in BOTH sources.
- `#256` lesson: do not over-narrow matchers.
- `preparation/rawdata/discussion-log.md` — ratification record.
