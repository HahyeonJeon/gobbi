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
feature: gobbi-orchestration-workflow-improvements
related:
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/rawdata/draft-iter2.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md
---

# Codex skill — assistant-wrapper pattern for dual-system evaluation

## Witness (empirical, this session)

Three observed failure modes when running codex from the manager session:

1. **`codex:codex-rescue` plugin agent fire-and-forget** (Ideation iter3, Planning iter1 attempt 1): plugin agent forwards task to companion runtime, returns immediately with placeholder text. Files never written. Companion broker.json shows status=`running` with dead pid; agent has no await.
2. **`codex exec` sandbox project-root detection** (Planning iter1 attempt 2): codex auto-detected wrong project root for absolute session paths, rejected writes with "writing outside of the project". Required `--cd /playinganalytics/git/gobbi --add-dir <session-path>` flags to grant write access.
3. **`codex exec` background Bash + notification timing** (Planning iter2): codex completed successfully (exit 0, all 8 files written), but the Claude Code harness delivered the completion notification only embedded in the manager's next tool call result. Until the manager made another tool call, no awareness of completion.

## Decision

The codex skill (Task 06 content) MUST document the **assistant-wrapper pattern** as the recommended topology for dual-system parallel evaluation:

1. Manager spawns 2 `assistant` (or `executor`) subagents in parallel via `Agent(subagent_type="assistant", run_in_background: true, ...)`, one Claude-side and one Codex-side.
2. The Codex-side assistant's prompt instructs it to run `codex exec --sandbox workspace-write --cd <main-tree> --add-dir <session-path>` via its own internal Bash tool, **foreground** (no `run_in_background` inside the subagent).
3. The Codex-side assistant's Bash blocks synchronously until codex exits; assistant reads codex stdout, verifies output files were written at the contracted paths, re-greps for required content (e.g., per-perspective verdict lines, 5-Type vocabulary), and only then reports DONE.
4. The Claude-side assistant runs its evaluation via its own Bash/Read tools normally.
5. Each assistant returns via Agent completion notification (background topology) — but because the assistant did its own validation, the notification is "verified DONE" rather than "raw codex finished, hope it worked".

## Why this beats current patterns

| Current pattern | Failure surface | Assistant-wrapper fix |
|---|---|---|
| `Agent(codex:codex-rescue, ...)` | Fire-and-forget, no await | Assistant body explicitly awaits via Bash + validates |
| Manager-direct `Bash(codex exec, run_in_background: true)` | Notification delay; raw stdout; no validation in subagent context | Assistant validates files-written, re-greps, reports verified DONE |
| Manager-direct `Bash(codex exec, run_in_background: false)` | Blocks manager; no parallelism | Assistant background gives parallelism + validation |

## Codex skill content requirements (Task 06 brief MUST inline)

The codex skill's **Section 6 (Use cases) — Dual-system evaluator spawn** subsection MUST include:

1. **Topology diagram** (text-based ASCII or bullet flow): manager spawns 2 assistants in parallel; each assistant spawns 1 codex/claude eval; aggregation at manager after both return.
2. **Worked example** (delegation prompt sketch for the Codex-side assistant) showing:
   - Assistant Load Directives include `codex` skill (mandatory per delegation hard gate)
   - Assistant runs `codex exec --sandbox workspace-write --cd /playinganalytics/git/gobbi --add-dir <session-path> "<inline-prompt>"` foreground via Bash
   - Assistant verifies all expected output files exist at contracted paths before reporting DONE
   - Assistant grep-validates output content (verdict line, perspective files, 5-Type vocab)
   - Assistant escalates BLOCKED if codex output is missing/malformed (not silent DONE)
3. **Anti-pattern callout**: do NOT use `codex:codex-rescue` plugin agent for evaluator-perspective work (fire-and-forget); do NOT use manager-direct background Bash without files-as-truth verification.
4. **Cross-reference**: link to this decision record's witness section so the empirical reasoning is preserved.

The codex skill's **Section 5 (Hang + timeout discipline)** subsection MUST include:

5. **`timeout 600 codex exec ...` wrapping** — codex CLI has no built-in timeout; wrap with shell `timeout(1)` for any non-interactive invocation.
6. **Files-as-truth completion signal** — manager/assistant verifies completion by file existence + content grep, NOT by parsing stdout or polling broker.json (companion broker may be stale or unused for direct exec).
7. **Notification timing note** — Claude Code harness delivers background-task notifications lazily (batched on next tool call). If the manager goes fully idle after spawning background codex, completion notification is delayed. Mitigation: the assistant-wrapper pattern shifts validation INTO the subagent, so the manager doesn't need to inspect codex output directly.

## Cross-link Manifest update

Cross-Link Manifest entry for codex skill should also wire to:
- `mistakes/codex-eval-session-write-path-nested-in-worktree.md` (existing — sandbox/CWD)
- Stage-up of this decision-record at Wrap-up promotion (Wrap-up creates `mistakes/codex-rescue-agent-fire-and-forget-without-result-capture.md` from the Ideation staging; this decision-record may also be promoted as a project rule).

## Action

- Manager dispatches Task 06 with the codex skill content brief that inlines requirements 1-7 above.
- No new task added to the Plan; this is content-level enrichment of Task 06.
- Decision-record stays at `planning/staging/decisions/`; Wrap-up routes per Type+Domain (this is `design_flaw` / `docs-sync` — but `disposition: addressed` means it does NOT trigger REVISE; instead stages as deferred risk/decision-record per `evaluation/SKILL.md § Type` table).

## Source citations

- This session's transcript empirical witnesses (3 failure modes, lines visible in `ideation/rawdata/transcript-iter3.jsonl`, `planning/rawdata/transcript-iter1.jsonl`, planning iter2 bash background output)
- `evaluation/SKILL.md:344-352` (5-Type vocabulary that codex skill must use)
- `.claude/agents/{assistant,executor,evaluator,leader}.md` (tool surfaces — subagents lack Agent tool, MUST use Bash for codex)
- `~/.claude/plugins/cache/openai-codex/codex/1.0.2/agents/codex-rescue.md:12` (plugin agent is `tools: Bash` — itself a thin wrapper, but with fire-and-forget body)
