---
name: _memorization
description: Save context for session continuity at Step 5 of the workflow. Persists task details, gotchas, and rules to .claude/project/{project-name}/.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
---

# Memorization

Save context that enables the user to continue this work in a new session. This is Step 5 of the workflow — runs after Collection, before phase transition.

---

## Core Principle

> **Every session should leave the project smarter than it found it.**

The value of memorization is cumulative. Each session adds context that makes the next session faster, more accurate, and less likely to repeat mistakes.

> **Gotchas describe what to avoid. Rules describe what to follow.**

These are the two forms of persistent learning. Gotchas capture mistakes — "we tried X and it failed because Y." Rules capture conventions — "in this project, always do Z." Both live under `.claude/project/{project-name}/` and are read at session start.

> **Memorize for the next agent, not for yourself.**

Write as if the reader has no context from this session. Include the why, not just the what. A gotcha without explanation is a rule without rationale — it gets followed blindly or ignored.

---

## What to Memorize

### Task Details

If the task is incomplete or part of a larger plan, record what was done, what remains, and what decisions were made. Update existing project docs or create new ones in the appropriate subdirectory of `.claude/project/{project-name}/`.

Use AskUserQuestion to ask the user:
- Is this task part of a larger plan?
- What context should the next session know?

### Gotchas — "Must Avoid"

Record corrections discovered during the workflow. A gotcha exists because something went wrong and the correct approach was non-obvious.

Write to `.claude/project/{project-name}/gotchas/`. Follow the `project-gotcha.md` child doc of _gotcha for format and categorization.

When to write:
- User corrected an agent's approach
- A debugging session revealed a non-obvious root cause
- A platform or environment quirk caused unexpected behavior

### Rules — "Must Follow"

Record conventions and standards discovered or established during the workflow. A rule exists because a consistent pattern should be followed across the project.

Write to `.claude/project/{project-name}/rules/`. Follow the _rules skill for format and structure.

When to write:
- A decision was made about how something should always be done in this project
- A pattern emerged that should be consistent across future sessions
- The user explicitly stated a preference or standard

### Project Docs

Update `.claude/project/{project-name}/design/` or `README.md` if the workflow revealed new architectural knowledge, conventions, or decisions worth persisting.

When to update:
- The workflow uncovered how a system works that was not previously documented
- An architectural decision was made that affects future work
- The project README is missing or outdated after this session's changes

---

## Constraints

- Always use AskUserQuestion to confirm what to memorize — never assume the user wants everything saved
- Never memorize ephemeral task details (temp file paths, debug output, intermediate state)
- Never duplicate information already in the codebase or git history
- Keep memorized content concise — a future agent should load it quickly at session start
- Gotchas and rules must be actionable — each entry should change an agent's behavior
