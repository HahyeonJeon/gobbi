---
name: script-hook-layer-verify-no-change
description: The session-memory redesign requires no edits to any script or hook; all 7 script/hook files reference only unchanged surfaces.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: [hooks]
keywords: [scripts, session-tree, scope]
author: claude
supersedes: null
superseded_by: null
---

# Script/hook layer needs no edits for the session-memory redesign

## Context

The session-memory redesign renames the per-loop interior (`rawdata/`→`working/`, `artifacts/`→`outputs/`, adds numbered prefixes, renames `task-{NN}` to `task-{NN}-{slug}`). Before confirming the edit set, a widened grep was run against the script/hook layer in addition to the markdown skill/agent layer. The grep surfaces were: `.gobbi/projects/gobbi/hooks/*.sh`, `.claude/scripts/reconstruct-agents.sh`, `orchestration/scripts/*.sh`, and `skills/gobbi-hook-authoring/SKILL.md`.

The redesign's CHANGING paths: `{loop}/rawdata/`, per-loop `transcript-iter{n}.jsonl`, `{loop}/artifacts/`, the `{loop}` dir name, `task-{NN}`.

The redesign's UNCHANGED surfaces: root `session.json`, `session.json.transcriptPath`, the harness-source `${transcript_path%.jsonl}/subagents/agent-<agentId>.jsonl` (lives in `~/.claude/projects/`, not in the session tree), and the `sessions/*-<sid>/session.json` glob (matches the session root, unaffected by interior renames).

## Decision

All 7 script/hook files are VERIFY-NO-CHANGE. No script or hook needs to be edited as part of the session-memory redesign.

## Rationale

Every file in the script/hook layer references only unchanged surfaces:

- `hooks/post-tool-use-agents.sh` — root `session.json`, harness `transcript_path` + `subagents/agent-<agentId>.jsonl`, `sessions/*-<sid>/session.json` glob. No changing-path refs.
- `hooks/session-end.sh` — root `session.json`, main `transcript_path`, `sessions/*-<sid>/session.json` glob, calls `reconcile-session-metadata.sh`. Line `:25` is a historical provenance comment — not an operational path, not changed.
- `hooks/session-start.sh` — `transcript_path`→`CLAUDE_TRANSCRIPT_PATH` env export only.
- `.claude/scripts/reconstruct-agents.sh` — `session.json` arg, `session.json.transcriptPath`, harness `transcript` walk. Root JSON field, not a per-loop path.
- `orchestration/scripts/agent-token-usage.sh` — takes a harness transcript PATH as `$1`; no session-tree path literal.
- `orchestration/scripts/reconcile-session-metadata.sh` — `session.json` arg, main-transcript arg, harness `subagents/agent-<agentId>.jsonl`.
- `skills/gobbi-hook-authoring/SKILL.md` — documents harness surfaces; all root/harness, no per-loop interior.

## Alternatives considered

No alternative was applicable — this is an empirical finding from the grep, not a design choice. The alternative (treating `hooks/session-end.sh:25` as an operational path ref) was examined and adjudicated a false positive.

## Consequences

- The 46-file edit set covers markdown skills and agents only. No shell script edits are needed.
- If a future session re-investigates script/hook scope for this feature, this record confirms the widened grep was run and no scope expansion was warranted.
- Any future hook or script that writes to the per-loop interior (e.g., `{loop}/working/`, `{loop}/outputs/`) would require a new Preparation sweep.

## Related

- design/session-memory-tree.md
