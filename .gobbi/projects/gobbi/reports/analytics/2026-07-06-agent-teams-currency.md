---
name: agent-teams-currency
description: Currency ground-truth check of agent-teams.md against live Claude Code docs and observed session behavior — doc baseline v2.1.32 vs current ~v2.1.199.
type: reports
scope: project
feature: null
status: active
created: 2026-07-06
session: 0d898156-8d5b-4142-9b93-308d3b692995
tags: [process]
keywords: [agent-teams, currency-check, claude-code-guide, versioning, ui-helpers]
author: claude
report_type: analytics
---

# agent-teams.md currency report (3.2 ground-truth)

Source: claude-code-guide agent, 2026-07-06, checked against code.claude.com/docs/en/agent-teams (docs state "as of v2.1.178"; current ~v2.1.199). Several items independently confirmed by THIS session's observed behavior (async idle-notifications; the "another Claude session" trust banner on every teammate message). Version-specific numbers below should be RE-VERIFIED against live docs at implementation time; the direction (doc stale at v2.1.32; missing UI/helper docs) is high-confidence.

## CONFIRMED-CURRENT (doc is right)
Flag `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`; env in settings.json; leader/executor/assistant roster; evaluator-never-teammate; shared task list (lead creates, teammates claim); hooks TeammateIdle/TaskCreated/TaskCompleted; no nested teams; teammates lost on /resume //compact //rewind; SendMessage by name; no cross-talk; first-spawn-full-brief / continuation-delta-brief.

## STALE / WRONG
| Doc claim | Current reality | Impact |
|---|---|---|
| min version **v2.1.32** | current ~v2.1.199; docs baseline v2.1.178. Doc reads as static since v2.1.32 | recommend bumping the referenced baseline; the doc misses ~6 versions of features |
| **"Shift+Down cycles teammates"** | Up/Down arrows select a teammate; Enter opens its transcript; Escape interrupts. No Shift+Down binding | wrong shortcut — verify against the actual doc line, then fix |
| **`"auto"` is default teammateMode** | v2.1.179: default is now **`"in-process"`**; `"auto"` now auto-detects tmux/iTerm2 | explanation stale |
| **three display modes** | four now — `in-process` / `auto` / `tmux` / **`iterm2`** (v2.1.186) | missing a mode |
| (no mention) TeamCreate/TeamDelete | **removed v2.1.178** — team setup/cleanup now automatic | doc implies manual setup may still apply |

## MISSING (should be added — the 3.2 "how to show teammates + useful helpers" ask)
1. **Teammate display in the session UI (the direct 3.2 ask):** an **agent panel** below the prompt shows teammate rows (name + status). Up/Down select; **Enter** opens a teammate's transcript. Idle-row collapse: >3 idle rows fold into one `N idle agents` row (v2.1.199); working + failed teammates always keep their rows; idle rows hide only after the WHOLE panel idles 30s, reappear on next turn. Split-pane mode = one pane per teammate.
2. **SendMessage specifics:** message types `message` / `broadcast` / `shutdown_request`/`_response` / `plan_approval_response`; always available even under a tight `tools` allowlist; **trust model — the receiver is told the message came from "another Claude session", NOT the user; teammates cannot approve permission prompts for each other** (exactly the banner seen this session).
3. **Helpers:** **Ctrl+T** toggles the task-list display; teammate-local vs lead-local commands (plain text + skills → viewed teammate; `/model` `/fast` → lead only; `/effort` → viewed teammate, v2.1.199); effort inheritance lead→teammates (v2.1.186).
4. **Limitations (hard constraints):** session resumption does NOT restore in-process teammates (spawn fresh + re-prime); an in-process teammate CANNOT spawn background subagents; split-pane unsupported in VS Code / Windows Terminal / Ghostty; task-status lag (teammates sometimes miss marking complete → manual nudge).
5. **Subagent-def-as-teammate caveat (critical for gobbi delegation):** a subagent definition's `tools` + `model` ARE honored and its body appends to the system prompt, but its `skills` / `mcpServers` frontmatter is NOT auto-loaded — load them via the first-spawn Load-Directives brief.
6. **Plan approval mode** — a conversation-based gate: a teammate sends a plan-approval request; the lead approves/rejects; reject → revise+resubmit. Useful for gobbi Preparation/Execution gates.
7. **Automatic task-dependency resolution** — completing a task auto-unblocks dependents; Planning can rely on this instead of "wait for X" prose.
8. **Async delivery + error notifications (v2.1.198):** messages arrive automatically (no poll); a teammate auto-notifies the lead on idle; a turn ending on an API error now notifies the lead with the error text (stall detection).

## Recommendation
Bump the doc to the v2.1.178+ baseline; add the agent-panel UI section (answers 3.2); document the SendMessage interface + trust model; add the helpers (Ctrl+T, command locality, effort inheritance); add the limitations + the subagent-def-as-teammate skills/mcpServers caveat. Re-verify exact version numbers against live docs at implementation.
