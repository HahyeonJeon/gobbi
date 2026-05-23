---
name: codex
description: Best-practices anchor for invoking Codex CLI from within Claude Code. Covers `codex exec` (universal), `codex:codex-rescue` (manager-only), `/codex:adversarial-review` (user-only), sandbox + CWD discipline, hang/timeout patterns, and dual-system evaluation use cases. STUB — content to be written by Execution; Preparation only locks the source-of-truth path and the 8-section H2 skeleton.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Codex (STUB — Execution fills content)

> **Preparation stub.** Source-of-truth path locked at `.gobbi/projects/gobbi/skills/codex/SKILL.md`. Triple-symlink discipline:
> - `.claude/skills/codex/SKILL.md` → file symlink to the path above (Claude-facing).
> - `.agents/skills/codex` → directory symlink to `.gobbi/projects/gobbi/skills/codex/` (Codex-facing; `.agents/skills/` count goes 16 → 17 post-ship).
>
> The 8 H2 sections below are **locked from Ideation Design A** (see `sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/design/item-a-codex-skill-structure.md` lines 15-23). Execution writes the content; Preparation only fixes the section skeleton + frontmatter so Planning can decompose against a stable target file.
>
> **Validation contract**: `grep -c "^## " .gobbi/projects/gobbi/skills/codex/SKILL.md` MUST return exactly `8` after Execution ships (Idea checklist item 1). The 8 section names below are the locked set — do NOT rename or reorder.

---

## When to load

<!-- Execution: fill (1-2 paragraphs). Concrete triggers:
  - Manager loads this skill before spawning a Codex evaluator via `Agent(subagent_type="codex:codex-rescue", ...)`, or before directing the user to type `/codex:adversarial-review`.
  - Subagents (leader/executor/evaluator/assistant) load this skill before any inline `codex exec` Bash call.
  - Delegation prompts for tasks that involve Codex MUST include this skill in the Load Directives block per `delegation/SKILL.md`.
  Anchor: Idea Design A § When to load. -->

---

## Invocation patterns

<!-- Execution: fill. THREE subsections in this exact priority order (Decisions Log #14 LOCKED in Ideation):

  (a) `codex exec` via Bash — UNIVERSAL primary.
      Works from any role, including subagents that lack the Agent tool. Empirical witness I1, I2: every role's `tools:` config includes Bash.
      Show canonical form including --cd, --sandbox, optional --add-dir, optional timeout(1) wrapping.

  (b) `Agent(subagent_type="codex:codex-rescue", ...)` — manager-only secondary.
      Thin wrapper around `codex exec` (see `.claude/agents/codex-rescue.md:12`). Manager-only because subagents lack the Agent tool.

  (c) `/codex:adversarial-review` — user-only tertiary.
      Slash command with `disable-model-invocation: true` (cite `.claude/commands/codex/adversarial-review.md` frontmatter). Manager MUST ASK the user to type it; never invoke programmatically.

  Cite empirical witnesses: I1, I2, I13. -->

---

## Why subagents must use `codex exec`

<!-- Execution: fill. Empirical tool-surface witness — `.claude/agents/{leader,executor,evaluator,assistant}.md` lack the Agent tool; only `.claude/agents/manager.md` has `tools: "*"`. The codex plugin agent itself is `tools: Bash` (per `.claude/agents/codex-rescue.md`).
  Therefore: a subagent that tries to spawn `Agent(subagent_type="codex:codex-rescue", ...)` fails immediately. The universal lowest-common-denominator is `codex exec` via the Bash tool (which every role has).
  Anchor: I13. -->

---

## Sandbox + CWD discipline

<!-- Execution: fill. Witness anchor: `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`.

  Sandbox modes table:
  | Mode | Use |
  |---|---|
  | `read-only` (default) | Evaluation, read-only review |
  | `workspace-write` | Required for any write (session writes, file edits) |
  | `danger-full-access` | Never default; user-explicit only |

  CWD inheritance:
  - `codex exec` inherits CWD from the calling shell. Subagent CWD resets per Bash call.
  - ABSOLUTE-PATH MANDATE per project mistake `codex-eval-session-write-path-nested-in-worktree.md`: every delegation prompt that asks Codex to write to a session path MUST inline the main-tree absolute path `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/...` AND pass `--cd /playinganalytics/git/gobbi`.
  - Cross-tree writes (worktree workspace + main-tree session path): pass `--add-dir <DIR>` to extend the writable set.
  - Manager-proxy write fallback: if Codex cannot write to the session path directly, return content to manager who writes on Codex's behalf.
  - Post-eval sanity check: `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id} -newer <marker> -type f` to confirm writes landed at the main-tree absolute path.

  Cite I3, I4, E2. -->

---

## Hang + timeout discipline

<!-- Execution: fill.
  - `codex exec` has NO built-in execution timeout. `DEFAULT_STATUS_WAIT_TIMEOUT_MS = 240000` is a STATUS poll timeout, not an execution cap.
  - Foreground: wrap in `timeout(1)` — e.g., `timeout 600 codex exec ...`.
  - Background: use background-job pattern per `git/SKILL.md`; poll via `/codex:status`; cancel via `/codex:cancel` (user-only).
  - On hang: surface to user with three-option AskUserQuestion — "wait / abort / restart".

  Cite I5. Cross-link: `git/SKILL.md` background-mode guidance. -->

---

## Use cases

<!-- Execution: fill. Cover these three use cases with worked examples:

  (1) Dual-system evaluator spawn.
      - Manager pattern: `Agent(subagent_type="codex:codex-rescue", ...)` with explicit session write path inlined.
      - Subagent pattern: `codex exec --cd /playinganalytics/git/gobbi --sandbox workspace-write ...` via Bash.
      - `--resume-last` vs fresh-context choice (E1).

  (2) Codex-rescue for stuck Claude work.
      - When Claude is looping, mis-applying a pattern, or stalling: spawn `codex:codex-rescue` for a fresh perspective. Manager-only.

  (3) User-initiated `/codex:adversarial-review`.
      - User types the slash command directly. Manager ASKS the user; never invokes programmatically. -->

---

## Cost + sandbox budget awareness

<!-- Execution: fill.
  - Effort levels `none|minimal|low|medium|high|xhigh` (E3) multiply token cost — leave unset unless user requests.
  - Default model from `~/.codex/config.toml` (E4); do NOT override `--model` unless user specified.
  - `/codex:setup` (E5) is the first-use precondition; gobbi does NOT install codex itself.
  - When-to-use codex vs claude: prefer codex for adversarial review / fresh perspective when claude is looping or self-confirming; prefer claude for primary work where session memory continuity matters.
  - Sandbox cost: `workspace-write` widens blast radius vs `read-only` — use least-privilege default. -->

---

## Anti-patterns

<!-- Execution: fill. At least 8 anti-patterns with corrected approach per item:
  - Trying to spawn the codex plugin agent from subagent context — fails (no Agent tool in leader/executor/evaluator/assistant). USE `codex exec` via Bash instead.
  - Codex evaluator writes to a worktree-nested session path instead of the main-tree absolute path. ALWAYS inline `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{id}/...` + `--cd /playinganalytics/git/gobbi`.
  - Manager invokes `/codex:adversarial-review` programmatically — forbidden (`disable-model-invocation: true`). ALWAYS ask the user to type it.
  - Codex skill ships only `.claude/skills/codex/SKILL.md` and forgets `.agents/skills/codex` symlink — codex itself cannot load its own skill. Both symlinks MUST exist.
  - Effort level set to `high`/`xhigh` by default (cost balloon). Leave unset unless user-explicit.
  - `--model` overridden without user direction.
  - No timeout wrapper around `codex exec` in automation contexts (silent hang).
  - Sandbox left at `workspace-write` when `read-only` is sufficient (least-privilege violation).
  Cross-link each anti-pattern to the corrected approach in earlier sections. -->

---

**Constraints** (body block per `_claude/SKILL.md` standard — NOT an H2 section; keeps the H2 count at exactly 8):

<!-- Execution: fill with MUST/NEVER/ALWAYS bullets per `_claude/SKILL.md` standard. Examples:
- MUST inline the main-tree absolute session-write path in every Codex delegation prompt that writes.
- MUST run post-eval `find` sanity check after every Codex evaluator completes.
- MUST wrap `codex exec` in `timeout(1)` for automation contexts (no built-in timeout).
- NEVER attempt to spawn the codex plugin agent from a non-manager role (leader/executor/evaluator/assistant lack the Agent tool).
- NEVER invoke `/codex:adversarial-review` programmatically — ask the user to type it.
- ALWAYS leave `--effort` and `--model` unset unless the user requested a specific value.
- ALWAYS ensure both symlinks (`.claude/skills/codex/SKILL.md` file symlink + `.agents/skills/codex` directory symlink) exist after ship.
-->
