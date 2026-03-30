# State Management

## Design Goal

Gobbi needs state for cross-session continuity without GSD's state sprawl. GSD's `.planning/` directory grows into a complex tree of STATE.md, HANDOFF.json, config.json, phases/, research/, codebase/, quick/, todos/, threads/, seeds/. Gobbi takes a different approach.

## State Location

All project state lives in `.claude/project/`, managed by gobbi. The user will design the consistent internal structure, but the following categories of state must be supported:

### 1. Context

**What:** Current work state — what we're doing, where we are, what decisions have been made.

**Purpose:** Any new session can pick up where the last one left off. The context should be enough for an orchestrator to understand the project's current situation without reading the entire history.

**Lifecycle:** Updated at significant milestones (after discussion, after planning, after task completion). Overwritten, not appended — context reflects the current state, not history.

### 2. Gotchas (Project-Specific)

**What:** Mistakes, corrections, and non-obvious constraints specific to this project.

**Purpose:** Prevent agents from repeating project-specific mistakes. Separate from cross-project gotchas in `gobbi-gotcha/`.

**Lifecycle:** Written immediately when a correction happens. Never deleted unless proven wrong. Accumulated over the project's lifetime.

**Structure:** Categorized by domain (e.g., `gotchas/auth.md`, `gotchas/deployment.md`). Each gotcha has: title, priority, what happened, user feedback, correct approach.

### 3. Work Trail

**What:** Record of past work sessions — what was prompted, what was planned, what was done, how it was evaluated.

**Purpose:** Future sessions can learn from past work patterns. Also provides an audit trail for the user to review.

**Lifecycle:** Written at the end of each significant work session. Append-only — the trail grows over time. Old entries are never modified.

**What to record:**
- The original user prompt (refined)
- The plan (if one was created)
- Tasks executed and their outcomes
- Evaluation results
- Gotchas recorded during the session
- Feedback rounds (if any)

## What Gobbi Does NOT Persist

- **Ephemeral task state:** In-progress work uses Claude Code's TaskCreate and TaskList. No custom task tracking files.
- **Session continuity mechanics:** No HANDOFF.json equivalent. The work trail (notes in `.claude/project/{project-name}/note/`) provides session continuity — the orchestrator's resume protocol reads them to recover state. No separate context file or handoff file needed.
- **Configuration:** No config.json. Gobbi's behavior is defined by its skills and hack patches.
- **Research artifacts:** Research results are consumed during the session, not persisted separately.

## Cross-Session Continuity

The work trail (notes in `.claude/project/{project-name}/note/`) serves as the state machine. Each note directory represents a workflow step — its existence indicates that step was reached. On session resume, the orchestrator reads the latest note directory to recover the workflow position, then loads gotchas to restore learned constraints.

This design means continuity requires no dedicated handoff files or state reconstruction logic. The notes themselves are the state — readable by both agents and humans, version-controlled with the project, and naturally ordered by timestamp in their directory names.

## Relationship to Claude Code Memory

Gobbi uses Claude Code's built-in memory system (`~/.claude/projects/`) for user preferences and behavioral feedback. Project state uses `.claude/project/` because:
- Memory is per-user, project state is per-project
- Memory persists across projects, project state is project-scoped
- Memory is for "how to work with this user," project state is for "what's happening in this project"
