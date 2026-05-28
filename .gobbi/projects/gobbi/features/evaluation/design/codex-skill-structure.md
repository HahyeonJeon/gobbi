---
name: codex-skill-structure
description: Design for the codex skill structure — single SKILL.md with two symlinks and 8 locked H2 sections.
type: design
scope: feature
feature: evaluation
status: active
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [codex, skill-structure, symlinks, h2-count]
---

# `codex` Skill Structure

## Context

Gobbi needs a `codex` skill that documents how every role invokes Codex. The skill has to be loadable by both Claude (the Claude Code harness) and Codex itself (the companion runtime), and it has to encode the invocation-priority decision (`codex exec` universal, plugin agent manager-only, slash command user-only) in a stable, machine-checkable shape.

## Approach

A single source-of-truth `SKILL.md` at `.gobbi/projects/gobbi/skills/codex/SKILL.md`, with two symlinks:

- `.claude/skills/codex/SKILL.md` — Claude-side file symlink.
- `.agents/skills/codex` — Codex-side directory symlink matching the existing baseline-skills pattern (the addition brings the `.agents/skills/` entry count from 16 to 17).

The body locks exactly 8 H2 sections:

1. When to load
2. Invocation patterns — `codex exec` first (universal) / plugin agent second (manager-only) / slash command third (user-only)
3. Why subagents must use `codex exec` (empirical tool-surface witness)
4. Sandbox + CWD discipline (absolute-path mandate + post-eval `find` sanity check)
5. Hang + timeout discipline (no built-in timeout; `timeout(1)` wrapping)
6. Use cases (dual-system eval spawn + rescue + adversarial review)
7. Cost + sandbox budget awareness
8. Anti-patterns

## Rationale

`codex exec` via Bash is the universal lowest-common-denominator: subagents (leader / executor / evaluator / assistant) lack the Agent tool and cannot spawn the `codex:codex-rescue` plugin agent (empirically verified via the `.claude/agents/{role}.md` tool lists), and the plugin agent itself reduces to `codex exec` via Bash (per `agents/codex-rescue.md`). Two symlinks rather than one ensure Codex itself can load the skill via `.agents/skills/codex` — a codex skill that Codex cannot load would be a contradiction. Locking the H2 count makes the structure machine-checkable so future edits cannot silently drift the section set.

## Alternatives considered

- **Single symlink (Claude-side only)** — rejected: Codex could not load its own skill, defeating the skill's purpose.
- **Make the plugin agent the documented primary invocation** — rejected: subagents cannot spawn it (no Agent tool), so a plugin-first structure would leave subagents without a path. See [`decisions/codex-exec-universal-invocation-pattern.md`](../decisions/codex-exec-universal-invocation-pattern.md).
- **Unbounded H2 set** — rejected: an explicit 8-H2 lock with a grep contract prevents structural drift.

## Consequences

The skill ships with a verifiable structure:
- `grep -c "^## " .gobbi/projects/gobbi/skills/codex/SKILL.md` returns 8;
- `ls -la .claude/skills/codex/SKILL.md` shows a file symlink;
- `ls -la .agents/skills/codex` shows a directory symlink;
- `ls /playinganalytics/git/gobbi/.agents/skills/ | wc -l` returns 17 post-ship.

The skill also wires three cross-links: codex/SKILL.md § Sandbox + CWD discipline → `mistakes/codex-eval-session-write-path-nested-in-worktree.md`; codex/SKILL.md § Hang + timeout → `git/SKILL.md` background-mode guidance; and `gobbi/SKILL.md § Skill Map § Cross-cutting` → `codex/SKILL.md`.

## Related

- [`decisions/codex-exec-universal-invocation-pattern.md`](../decisions/codex-exec-universal-invocation-pattern.md) — the invocation-priority decision this structure encodes.
- [`decisions/constraints-body-block-kept-per-h2-lock.md`](../decisions/constraints-body-block-kept-per-h2-lock.md) — why the 8-H2 lock keeps `Constraints` as a body block.
