---
slug: codex-skill-assistant-wrapper-pattern-for-dual-system-eval
title: "Codex skill MUST document the assistant-wrapper pattern as the recommended dual-system evaluator spawn topology"
domain: docs-sync
type: design_flaw
disposition: addressed
mistake-candidate: false
project: gobbi
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: planning
created: 2026-05-23
status: active
supersedes: null
superseded_by: null
date: 2026-05-23
feature: evaluation
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md
promoted-at: 2026-05-23T14:00:00Z
related:
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/rawdata/draft-iter2.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md
---

# Codex skill — assistant-wrapper pattern for dual-system evaluation

## Witness (empirical, this session)

Three observed failure modes when running codex from the manager session:

1. **`codex:codex-rescue` plugin agent fire-and-forget** (Ideation iter3, Planning iter1 attempt 1): plugin agent forwards task to companion runtime, returns immediately with placeholder text. Files never written.
2. **`codex exec` sandbox project-root detection** (Planning iter1 attempt 2): codex auto-detected wrong project root for absolute session paths, rejected writes with "writing outside of the project". Required `--cd /playinganalytics/git/gobbi --add-dir <session-path>` flags.
3. **`codex exec` background Bash + notification timing** (Planning iter2): codex completed successfully (exit 0, all 8 files written), but the Claude Code harness delivered the completion notification only embedded in the manager's next tool call result.

## Decision

The codex skill (Task 06 content) MUST document the **assistant-wrapper pattern** as the recommended topology for dual-system parallel evaluation:

1. Manager spawns 2 `assistant` subagents in parallel via `Agent(subagent_type="assistant", run_in_background: true, ...)`, one Claude-side and one Codex-side.
2. The Codex-side assistant's prompt instructs it to run `codex exec --sandbox workspace-write --cd <main-tree> --add-dir <session-path>` via its own internal Bash tool, **foreground** (no `run_in_background` inside the subagent).
3. The Codex-side assistant's Bash blocks synchronously until codex exits; assistant reads codex stdout, verifies output files were written at the contracted paths, re-greps for required content, and only then reports DONE.
4. The Claude-side assistant runs its evaluation via its own Bash/Read tools normally.
5. Each assistant returns via Agent completion notification (background topology).

## Why this beats current patterns

| Current pattern | Failure surface | Assistant-wrapper fix |
|---|---|---|
| `Agent(codex:codex-rescue, ...)` | Fire-and-forget, no await | Assistant body explicitly awaits via Bash + validates |
| Manager-direct `Bash(codex exec, run_in_background: true)` | Notification delay; raw stdout; no validation | Assistant validates files-written, re-greps, reports verified DONE |
| Manager-direct `Bash(codex exec, run_in_background: false)` | Blocks manager; no parallelism | Assistant background gives parallelism + validation |

## Shipped in

Task 06 (T06) Execution, commit `b9970dc` — codex/SKILL.md § Use cases § Dual-system evaluator spawn.
