---
name: codex-skill-assistant-wrapper-pattern-for-dual-system-eval
description: Codex skill must document the assistant-wrapper pattern as the recommended dual-system evaluator spawn topology.
type: decisions
scope: feature
feature: evaluation
status: active
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [codex, dual-system, evaluation, topology]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Codex skill — assistant-wrapper pattern for dual-system evaluation

## Context

Dual-system evaluation runs a Claude evaluator and a Codex evaluator in parallel over the same artifact. Three failure modes were observed when the manager tried to drive the Codex side directly:

1. **`codex:codex-rescue` plugin agent fire-and-forget**: the plugin agent forwarded the task to the companion runtime, returned immediately with placeholder text, and the output files were never written.
2. **`codex exec` sandbox project-root detection**: codex auto-detected the wrong project root for absolute session paths and rejected writes with "writing outside of the project"; it required `--cd /playinganalytics/git/gobbi --add-dir <session-path>` flags to write where intended.
3. **`codex exec` background Bash + notification timing**: codex completed successfully (exit 0, all output files written), but the Claude Code harness delivered the completion notification only embedded in the manager's next tool-call result, so the manager could not reliably await it.

## Decision

The codex skill documents the **assistant-wrapper pattern** as the recommended topology for dual-system parallel evaluation:

1. The manager spawns 2 `assistant` subagents in parallel via `Agent(subagent_type="assistant", run_in_background: true, ...)`, one Claude-side and one Codex-side.
2. The Codex-side assistant's prompt instructs it to run `codex exec --sandbox workspace-write --cd <main-tree> --add-dir <session-path>` via its own internal Bash tool, **foreground** (no `run_in_background` inside the subagent).
3. The Codex-side assistant's Bash blocks synchronously until codex exits; the assistant reads codex stdout, verifies output files were written at the contracted paths, re-greps for required content, and only then reports DONE.
4. The Claude-side assistant runs its evaluation via its own Bash/Read tools normally.
5. Each assistant returns via Agent completion notification (background topology).

## Rationale

The wrapper closes every failure surface that the direct paths leave open: the assistant body explicitly awaits codex via a foreground Bash and validates the written files before reporting, so fire-and-forget, notification delay, and silent sandbox rejections all surface as a failed validation rather than a false DONE.

## Alternatives considered

| Rejected pattern | Failure surface | Why the wrapper wins |
|---|---|---|
| `Agent(codex:codex-rescue, ...)` | Fire-and-forget, no await | Assistant body explicitly awaits via Bash + validates |
| Manager-direct `Bash(codex exec, run_in_background: true)` | Notification delay; raw stdout; no validation | Assistant validates files-written, re-greps, reports verified DONE |
| Manager-direct `Bash(codex exec, run_in_background: false)` | Blocks the manager; no parallelism | Assistant background gives parallelism + validation |

## Consequences

The codex skill carries the assistant-wrapper pattern as the canonical dual-system evaluator spawn topology; manager-direct codex invocation for evaluation is documented as an anti-pattern.

## Related

- Shipped in commit `b9970dc` — `codex/SKILL.md § Use cases § Dual-system evaluator spawn`.
- [`decisions/codex-exec-universal-invocation-pattern.md`](codex-exec-universal-invocation-pattern.md) — why `codex exec` via Bash is the universal invocation pattern the wrapper relies on.
