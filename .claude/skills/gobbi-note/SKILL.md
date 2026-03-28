---
name: gobbi-note
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
  README.md                                — index of all task note directories
  {YYYYMMDD-HHMM}-{task-slug}/
    ideation.md                            — ideas explored, trade-offs, chosen approach
    plan.md                                — plan details, task decomposition, dependencies
    execution.md                           — execution outcomes, issues encountered
    feedback.md                            — user feedback rounds, corrections made
    review.md                              — review findings, verification results
    subtasks/
      {NN}-{subtask-slug}.md               — copy of each subagent's task result
```

### Naming

**Task directory**: `{YYYYMMDD-HHMM}-{slug}` — datetime prefix for ordering, slug for readability. Get the timestamp from `date +"%Y%m%d-%H%M"` when the task starts.

---

## What to Write at Each Step

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

### review.md

Record during Phase 3 (REVIEW):
- Review scope and focus areas
- Verification findings
- Issues found and resolution status

---

## README.md

The index file lists all task note directories with one-line summaries:

```
# Notes

| Date | Task | Summary |
|------|------|---------|
| 2026-03-28 14:30 | auth-redesign | Redesigned auth middleware for compliance |
| 2026-03-29 09:00 | fix-login | Fixed login redirect loop on mobile |
```

Must update README.md after creating each new task note directory.

---

## When to Write

- **Always write** at the end of each workflow step — ideation, plan, execution, feedback, review.
- **Write immediately** — do not defer note-writing to the end. Each step's note must be written before proceeding to the next step.
- **Skip only** when the task was trivial and handled directly without delegation.
