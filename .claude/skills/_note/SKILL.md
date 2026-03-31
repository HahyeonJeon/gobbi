---
name: _note
description: Write notes at every workflow step. Use to record decisions, outcomes, and context at each stage — ideation, plan, execution, feedback, and review.
allowed-tools: Write, Read, Glob, Bash
---

# Note

Write notes at every workflow step to persist decisions, outcomes, and context. Notes are the permanent record of what was discussed, decided, and delivered.

---

## Where to Write

Notes go in `.claude/project/{project-name}/note/`:

```
.claude/project/{project-name}/note/
  README.md                                               — index of all task note directories
  {YYYYMMDD-HHMM}-{slug}-{session_id}/
    README.md                                             — session context metadata (YAML frontmatter)
    ideation.md                                           — ideas explored, trade-offs, chosen approach
    plan.md                                               — plan details, task decomposition, dependencies
    execution.md                                          — execution outcomes, issues encountered
    feedback.md                                           — user feedback rounds, corrections made
    review.md                                             — review findings, verification results
    memorize.md                                           — what was memorized for session continuity
    subtasks/
      {NN}-{subtask-slug}.md                              — copy of each subagent's task result
```

### Naming

**Task directory**: `{YYYYMMDD-HHMM}-{slug}-{session_id}` — datetime prefix for chronological ordering with minute precision, slug for readability, full session UUID at the end for machine cross-referencing. The `session_id` is the full session UUID, available via `$CLAUDE_SESSION_ID`. Example: `20260328-0706-doc-review-ed5b2db3-7d89-4208-a25b-8ad0889a0c80`.

### Initialization

> **Always use note-init.sh to create note directories. Never mkdir manually, never reference `$CLAUDE_SESSION_ID` directly.**

Initialize note directories using the `note-init.sh` script in `_note/scripts/`. It takes the project name and task slug as arguments and outputs the created directory path. It handles the full chain: session metadata extraction, directory creation, README.md generation with session context, and subtasks/ directory setup.

If `note-init.sh` fails because `CLAUDE_SESSION_ID` is not set, the SessionStart hook did not run — investigate the hook configuration, don't work around it.

---

## What to Write at Each Step

### README.md (per task directory)

Session context for the task, created automatically by the note-init script. Contains YAML frontmatter with: session_id, datetime, git_branch, cwd, claude_model, transcript path, and task name. This anchors every note file in the directory to a specific session, making it possible to trace back to the original conversation.

### ideation.md

Record during Step 1 (Ideation Loop). Must be detailed enough that a reader can reconstruct the full ideation without reading the conversation:
- The initial user prompt — verbatim or near-verbatim capture of what the user asked for
- Discussion points — each question asked, options presented, and user's responses
- Options explored with full trade-off analysis — not just names, but the reasoning
- Evaluation feedback from evaluator agents (if evaluation was performed)
- Discussion about evaluation — what was agreed to address vs defer
- The final refined idea with full detail — concrete enough to plan from

### plan.md

Record during Step 2 (Plan Loop). Must contain the complete plan, not a summary:
- The complete decomposed tasks with agent assignments, skills, scope boundaries, and dependencies
- Execution order with parallelism and wave structure
- Evaluation feedback from evaluator agents (if evaluation was performed)
- Discussion about evaluation — what was revised and why
- What the user adjusted during discussion
- The final approved plan in full

### execution.md

Record during Step 3 (Execution — Delegation). Must document each subtask in enough detail to understand what happened:
- Which subtasks were delegated to which agents, with the key context provided
- Per-subtask outcomes — what the agent produced, key findings or changes
- Execution evaluation results per subtask
- Issues encountered and how they were resolved
- Any deviations from the plan and why

When documenting evaluation results in execution.md, organize findings by severity tier — Critical findings first, then Important, then Suggestions, then Strengths — rather than by evaluator perspective. Severity-tiered presentation surfaces actionable items first and makes blocking issues visible across all subtasks at a glance.

Record pre-action verification outcomes when they catch a precondition failure (wrong branch, duplicate PR, stale state). Verification that passes silently needs no note — only record when verification catches a real problem, as these are valuable learning inputs for gotchas.

### subtasks/{NN}-{subtask-slug}.md

Copy of each subagent's task result during Step 3. Subagent outputs exist only in conversation context — if not copied here, the work is lost after the session.

- One file per subtask, zero-padded sequence number for ordering
- Must contain the full result, not a summary
- Written immediately after each subagent completes

### feedback.md

Record during Phase 2 (FEEDBACK):
- Each feedback round: what the user said, what changed
- Gotchas recorded from corrections
- Append each round — do not overwrite previous rounds

Number each feedback round explicitly (Round 1, Round 2, ...). Numbered rounds enable stagnation detection — if the same finding reappears across 3 rounds without convergence, the pattern becomes visible and actionable. Include what remains unresolved after each round, not just what changed.

### review.md

Record during Phase 3 (REVIEW):
- Review scope and focus areas
- Verification findings
- Issues found and resolution status

### memorize.md

Record during Step 5 (Memorization). Must document what was persisted for session continuity:
- Task details memorized — what was done, what remains, broader plan context
- Gotchas written to `.claude/project/{project-name}/gotchas/` — list each with a one-line summary
- Rules written to `.claude/project/{project-name}/rules/` — list each with a one-line summary
- Project docs updated — which files in `.claude/project/{project-name}/` were created or modified and why

---

## README.md

The index file is a markdown table listing each task directory with its date, session, slug, and a one-line summary of what the task delivered.

Must update README.md after creating each new task note directory.

---

## When to Write

- **Always write** at the end of each workflow step — ideation, plan, execution, feedback, review, memorization.
- **Write immediately** — do not defer note-writing to the end. Each step's note must be written before proceeding to the next step.
- **Skip only** when the task was trivial and handled directly without delegation.
