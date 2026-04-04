---
name: _collection
description: Verify note completeness and write the task README after execution. Use during Step 5 (Collection) to verify all per-step subdirectories contain their expected files, write the task README.md, and record gotchas.
allowed-tools: Write, Read, Glob, Bash
---

# Collection

Verify that all per-step subdirectories contain their expected note files and write the task-level `README.md`. Collection is Step 5 in the 7-step workflow (Ideation, Plan, Research, Execution, Collection, Memorization, Review). Notes are written during their respective steps — Collection verifies completeness, it does not create the notes themselves.

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gotchas.md](gotchas.md) | Known mistakes and corrections for _collection |

---

## What to Do

Collection has three responsibilities: **note verification**, **README.md writing**, and **gotcha recording**.

**Note verification** — Verify that all expected files exist in their per-step subdirectories. Notes are written during their respective workflow steps (Ideation writes `ideation/`, Plan writes `plan/`, Research writes `research/`, Execution writes `execution/`). Collection does not create these files — it confirms they are present and complete. Required files by subdirectory:

- `ideation/ideation.md` (orchestrator synthesis) — must exist
- `ideation/innovative.md` and `ideation/best.md` (PI agent notes) — must exist
- `plan/plan.md` — must exist
- `research/research.md` (orchestrator synthesis) — must exist for non-trivial tasks
- `research/innovative.md` and `research/best.md` — must exist for non-trivial tasks
- `research/subtasks/` — verify subtask JSON files exist for non-trivial tasks
- `execution/execution.md` — must exist
- `execution/subtasks/` — verify subtask JSON files exist
- `ideation/evaluation/`, `plan/evaluation/`, `research/evaluation/`, `execution/evaluation/` — verify evaluation files exist where evaluation was performed

If any required file is missing, report the gap and investigate — do not silently proceed.

**README.md writing** — After verification passes, write the top-level `README.md` for the task directory. See the README.md section below for format.

**Gotcha recording** — Any corrections, surprises, or mistakes discovered during the workflow must be recorded via _gotcha before the cycle closes.

---

## Where to Write

Task note directories follow the structure defined in _note. Each task directory contains per-step subdirectories:

```
{YYYYMMDD-HHMM}-{slug}-{session_id}/
  README.md                         — task-level index (written by Collection)
  ideation/
    ideation.md                     — orchestrator synthesis
    innovative.md                   — Innovative PI stance
    best.md                         — Best-practice PI stance
    evaluation/                     — evaluation files (if evaluation performed)
  plan/
    plan.md                         — plan details
    evaluation/                     — evaluation files (if evaluation performed)
  research/
    research.md                     — orchestrator synthesis
    innovative.md                   — Innovative researcher
    best.md                         — Best-practice researcher
    subtasks/
      01-{slug}.json                — research subtask records
    evaluation/                     — evaluation files (if evaluation performed)
  execution/
    execution.md                    — execution outcomes
    subtasks/
      01-{slug}.json                — execution subtask records
    evaluation/                     — evaluation files (if evaluation performed)
  feedback.md                       — feedback rounds (if FEEDBACK)
  review/
    innovative.md                   — Innovative PI review + verdict
    best.md                         — Best-practice PI review + verdict
    review.md                       — orchestrator synthesis
```

The task directory and its subdirectories are initialized by `gobbi note init` and populated during their respective workflow steps. Collection only writes `README.md` at the task root level.

---

## README.md

Collection writes the task-level `README.md` after verifying all per-step subdirectories. This is the primary artifact Collection creates — everything else was written during earlier steps.

The task `README.md` must include:

- **Subdirectory listing** — each subdirectory (`ideation/`, `plan/`, `research/`, `execution/`) with its key files
- **Step summaries** — a one-line summary of what each step produced (the chosen approach from ideation, the task count from planning, the key findings from research, the deliverables from execution)
- **Evaluation status** — which steps had evaluation performed and the verdict (pass/revise)
- **Links to related docs** — gotchas recorded, project docs updated, or other artifacts created during the workflow

Also update the parent `README.md` (the index file that lists all task note directories) to include this task's entry.

---

## Phase-Specific Collection

Collection runs at different points depending on the workflow phase. The verification checklist adapts to what the phase produced.

### After standard workflow (Steps 1-4)

Verify all four subdirectories: `ideation/`, `plan/`, `research/`, `execution/`. Check that subtask JSON files exist in `research/subtasks/` and `execution/subtasks/`. Check that `evaluation/` subdirectories exist for any step where evaluation was performed.

Subtask JSON files are written during their respective steps (Step 3 and Step 4) via `subtask-collect.sh` with a `<phase>` argument. Collection verifies they exist, it does not create them.

### After FEEDBACK

Write `feedback.md` to the task root directory. Append each feedback round — do not overwrite previous rounds. Re-verify any subdirectories whose contents were modified during the feedback cycle.

### After FEEDBACK then Review

The `review/` subdirectory is updated with new PI review files. Verify that `review/` contains the expected review artifacts. Update the task `README.md` to reflect the review results.

---

## When to Collect

**Always collect** when the workflow involved delegation or produced results worth preserving.

**Skip collecting** when the task was trivial — a single small edit, a quick question, or a direct handle without delegation.

---

## Session Learning Capture

After writing notes and recording gotchas, use AskUserQuestion to ask: **"What non-obvious knowledge was discovered this session?"**

This complements per-agent Memorize steps by capturing orchestrator-level insights that no single agent saw. The user may say "nothing" — the question ensures knowledge doesn't get lost silently.

**Capture categories:**

- **Gotchas** — mistakes or wrong assumptions corrected during the session. Record via _gotcha.
- **CLAUDE.md additions** — conventions or patterns discovered that should persist across sessions. Add as one-line entries to CLAUDE.md.
- **Skill updates** — behavioral patterns identified that a skill should teach. When a learning is categorized as a skill update, the orchestrator MUST propose a concrete change to the skill rather than merely flagging it for later. This is opt-in: only prompt if skill-update-type learnings were identified during the session. To propose a change:

  - Load _claude and _skills for authoring standards
  - Run lint/validation on modified skills (`gobbi validate lint`) to catch anti-patterns before presenting
  - Present proposed changes to user via AskUserQuestion: "Would you like to review proposed skill updates before finishing?"
  - If the user approves, apply the change to the skill file. If the user defers, persist the proposed change as a note in the task directory so future sessions can act on it.

Format: one-line entries, concise, actionable. "Discovery X because Y" — not narrative.
