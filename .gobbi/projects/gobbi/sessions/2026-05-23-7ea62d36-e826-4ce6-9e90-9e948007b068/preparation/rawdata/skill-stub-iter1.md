---
name: codex
description: "STUB — Best-practices anchor for invoking Codex CLI from within Claude Code. Covers `codex exec` (universal), `codex:codex-rescue` (manager-only), `/codex:adversarial-review` (user-only), sandbox + CWD discipline, and hang/timeout patterns. Load before any Codex invocation from any role. CONTENT TO BE WRITTEN BY EXECUTION — Preparation stages this stub only to lock the source-of-truth path and the 8-section outline."
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
---

# Codex (STUB — Execution fills content)

> **Preparation stub.** Source-of-truth path locked at `.gobbi/projects/gobbi/skills/codex/SKILL.md`. Triple-symlink discipline:
> - `.claude/skills/codex/SKILL.md` → file symlink to the path above (Claude-facing).
> - `.agents/skills/codex` → directory symlink to `.gobbi/projects/gobbi/skills/codex/` (Codex-facing; `.agents/skills/` count must go 16 → 17 post-ship).
>
> The 8 H2 sections below are **locked from Ideation Design A** (see `sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/design/item-a-codex-skill-structure.md`). Execution writes the content; Preparation only fixes the section skeleton + frontmatter so Planning can decompose against a stable target file.

---

## When to load

<!-- Execution: fill. Concrete triggers — e.g., when the manager dispatches a Codex evaluator; when a subagent needs an inline second-opinion via `codex exec`; when the user requests `/codex:adversarial-review`. -->

---

## Invocation patterns

<!-- Execution: fill. Priority order LOCKED in Ideation (Decisions Log #14):
  1. `codex exec` via Bash — UNIVERSAL primary (works from any role, including subagents that lack the Agent tool).
  2. `Agent(subagent_type="codex:codex-rescue", ...)` — manager-only secondary; thin wrapper that reduces to `codex exec` internally (agents/codex-rescue.md:12).
  3. `/codex:adversarial-review` — user-only tertiary (has `disable-model-invocation: true`; manager must ASK the user to type it).
Cite empirical witnesses: I1, I2, I13. -->

---

## Why subagents must use `codex exec`

<!-- Execution: fill. Empirical tool-surface witness — .claude/agents/{leader,executor,evaluator,assistant}.md lack the Agent tool; only manager.md has `tools: "*"`. Subagent attempts to spawn `codex:codex-rescue` therefore fail. Reach for `codex exec` via Bash tool instead. Anchor: I13. -->

---

## Sandbox + CWD discipline

<!-- Execution: fill. Witness anchor: mistakes/codex-eval-session-write-path-nested-in-worktree.md.
  Mandate: delegation prompts that involve session writes must inline the main-tree absolute path
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/...` AND set `--cd /playinganalytics/git/gobbi`.
  Default sandbox: `read-only`. Write requires `--sandbox workspace-write` (raw `codex exec`) or `--write` (plugin agent).
  Cross-tree writes (worktree + main-tree session path) need `--add-dir <DIR>` to extend the writable set.
  Post-eval sanity check: `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id} -newer <marker> -type f`.
  Cite I3, I4, E2. -->

---

## Hang + timeout discipline

<!-- Execution: fill. `codex exec` has no built-in execution timeout; `DEFAULT_STATUS_WAIT_TIMEOUT_MS = 240000` is a status poll, not an execution cap.
  Mechanism: `timeout 600 codex exec ...` for foreground; background-job pattern per git/SKILL.md.
  On hang: surface to user — "wait / abort / restart"; `/codex:cancel` is user-only.
  Cite I5. Cross-link: git/SKILL.md background-mode guidance. -->

---

## Use cases

<!-- Execution: fill. Show both evaluator-spawn patterns:
  (a) manager-spawn via `Agent(subagent_type="codex:codex-rescue", ...)` for dual-system evaluation;
  (b) subagent inline second-opinion via `codex exec` (executor or leader at Study/Plan).
  Include the post-eval `find` sanity check and the `--resume-last` vs fresh-context choice (E1).
  Cite mistakes/codex-eval-session-write-path-nested-in-worktree.md. -->

---

## Cost + sandbox budget awareness

<!-- Execution: fill. Effort levels `none|minimal|low|medium|high|xhigh` (E3) multiply token cost — leave unset unless user requests.
  Default model from `~/.codex/config.toml` (E4); do NOT override `--model` unless user specified.
  `/codex:setup` (E5) is the first-use precondition; gobbi does NOT install codex itself. -->

---

## Anti-patterns

<!-- Execution: fill. At least 8 anti-patterns:
  - Subagent attempts `Agent(subagent_type="codex:codex-rescue", ...)` — fails (lacks Agent tool).
  - Codex evaluator writes to worktree-nested session path instead of main-tree absolute.
  - Manager invokes `/codex:adversarial-review` programmatically (forbidden; `disable-model-invocation: true`).
  - Codex skill ships only `.claude/skills/codex/SKILL.md` and forgets `.agents/skills/codex` symlink (codex itself cannot load its own skill).
  - Effort level set to `high`/`xhigh` by default (cost balloon).
  - `--model` overridden without user direction.
  - No timeout wrapper around `codex exec` (silent hang).
  - Sandbox left at `workspace-write` when read-only is sufficient.
  Cross-link: each anti-pattern cites the corrected approach. -->

---

## Constraints

<!-- Execution: fill with MUST/NEVER/ALWAYS rules. Examples:
  - MUST inline the main-tree absolute session-write path in every Codex delegation prompt.
  - MUST run post-eval `find` sanity check after every Codex evaluator completes.
  - MUST wrap `codex exec` in `timeout 600` for automation contexts.
  - NEVER attempt `Agent(subagent_type="codex:codex-rescue", ...)` from a non-manager role.
  - NEVER invoke `/codex:adversarial-review` programmatically — ask the user to type it.
  - ALWAYS leave `--effort` unset unless the user requested a specific level.
  - ALWAYS ensure both symlinks (`.claude/skills/codex/SKILL.md` + `.agents/skills/codex`) exist after ship.
-->

---

## STUB metadata (Execution should remove this section before shipping)

- **Locked sections (do not rename)**: When to load / Invocation patterns / Why subagents must use `codex exec` / Sandbox + CWD discipline / Hang + timeout discipline / Use cases / Cost + sandbox budget awareness / Anti-patterns. (8 H2 sections — Idea checklist item 1.)
- **Validation**: `grep -c "^## " .gobbi/projects/gobbi/skills/codex/SKILL.md` must return 8 after Execution removes this STUB metadata section.
- **Symlinks**: file `.claude/skills/codex/SKILL.md → ../../../.gobbi/projects/gobbi/skills/codex/SKILL.md`; directory `.agents/skills/codex → ../../.gobbi/projects/gobbi/skills/codex`.
- **Length target**: 350-450 lines per Ideation Design A.
- **Witness cross-links to wire**:
  - `codex/SKILL.md § Sandbox + CWD discipline` → `mistakes/codex-eval-session-write-path-nested-in-worktree.md`
  - `codex/SKILL.md § Hang + timeout discipline` → `git/SKILL.md` background-mode guidance
  - `gobbi/SKILL.md § Skill Map § Cross-cutting` → this skill (added in Bundle A item 3)
