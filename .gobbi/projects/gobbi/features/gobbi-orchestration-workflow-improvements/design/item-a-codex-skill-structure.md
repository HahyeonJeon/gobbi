---
date: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
feature: gobbi-orchestration-workflow-improvements
loop: ideation
iter: 3
topic: item-a-codex-skill-structure
status: final
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/design/item-a-codex-skill-structure.md
promoted-at: 2026-05-23T14:00:00Z
---

# Design A — `codex` Skill Structure

**Chosen direction**: Single `SKILL.md` at `.gobbi/projects/gobbi/skills/codex/SKILL.md` (source-of-truth) with two symlinks: (a) `.claude/skills/codex/SKILL.md` (Claude-side file symlink), (b) `.agents/skills/codex` (Codex-side directory symlink matching 16-entry baseline pattern; addition brings count to 17 post-ship). 8 locked H2 sections.

**8 H2 sections (locked)**:
1. When to load
2. Invocation patterns — `codex exec` first (universal) / plugin agent second (manager-only) / slash command third (user-only)
3. Why subagents must use `codex exec` (empirical tool-surface witness)
4. Sandbox + CWD discipline (absolute-path mandate + post-eval `find` sanity check)
5. Hang + timeout discipline (no built-in timeout; `timeout(1)` wrapping)
6. Use cases (dual-system eval spawn + rescue + adversarial review)
7. Cost + sandbox budget awareness
8. Anti-patterns

**Rationale**: `codex exec` via Bash is the universal lowest-common-denominator because subagents (leader/executor/evaluator/assistant) lack the Agent tool and cannot spawn the `codex:codex-rescue` plugin agent (empirically verified via `.claude/agents/{role}.md` tool lists). The plugin agent itself reduces to `codex exec` via Bash (per `agents/codex-rescue.md:12`). Two symlinks (not one) ensure codex itself can load the skill (`.agents/skills/codex`) — a codex skill codex cannot load is a contradiction.

**Anchored insights**: I1, I2, I3, I4, I5, I13, I14, E1, E2, E3, E4, E5 + iter1 user redirect § Decision 2.

**Validation**: `grep -c "^## " .gobbi/projects/gobbi/skills/codex/SKILL.md` returns 8; `ls -la .claude/skills/codex/SKILL.md` shows file symlink; `ls -la .agents/skills/codex` shows directory symlink; `ls /playinganalytics/git/gobbi/.agents/skills/ | wc -l` returns 17 post-ship.

**Cross-links Bundle A creates (item A)**: codex/SKILL.md § Sandbox + CWD discipline → `mistakes/codex-eval-session-write-path-nested-in-worktree.md`; codex/SKILL.md § Hang + timeout → `git/SKILL.md` background-mode guidance; `gobbi/SKILL.md § Skill Map § Cross-cutting` → `codex/SKILL.md`.
