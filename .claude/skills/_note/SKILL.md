---
name: _note
description: Write notes at every workflow step using per-step subdirectories. Notes are the permanent record of what was discussed, decided, and delivered.
allowed-tools: Write, Read, Glob, Bash
---

# Note

Write notes at every workflow step using per-step subdirectories. Notes are the permanent record of what was discussed, decided, and delivered.

> **Notes must contain full content, never summaries.**

Every note file must be detailed enough that a reader who has no access to the conversation can fully reconstruct what happened. Write the actual content — the complete plan, the full evaluation findings, the detailed execution outcomes. A one-paragraph summary is not a note. If it takes 100 lines to capture what happened, write 100 lines.

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gotchas.md](gotchas.md) | Known mistakes and corrections for _note |

---

## Where to Write

Notes go in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/note/`. Each task gets a top-level directory containing subdirectories for each workflow step:

```
{YYYYMMDD-HHMM}-{slug}-{session_id}/
  metadata.json
  README.md
  ideation/
    innovative.md
    best.md
    ideation.md
    subtasks/
      01-{slug}.json
    evaluation/
      {perspective}.md
  plan/
    plan.md
    subtasks/
      01-{slug}.json
    evaluation/
      {perspective}.md
  research/
    innovative.md
    best.md
    research.md
    results/
    subtasks/
      01-{slug}.json
    evaluation/
      {perspective}.md
  execution/
    execution.md
    subtasks/
      01-{slug}.json
    evaluation/
      {perspective}.md
  review/
    innovative.md
    best.md
    review.md
    subtasks/
      01-{slug}.json
```

### Naming

**Task directory**: `{YYYYMMDD-HHMM}-{slug}-{session_id}` — datetime prefix for chronological ordering with minute precision, slug for readability, full session UUID at the end for machine cross-referencing. The `session_id` is the full session UUID, available via `$CLAUDE_SESSION_ID`. Example: `20260328-0706-doc-review-ed5b2db3-7d89-4208-a25b-8ad0889a0c80`.

### Initialization

> **Always use `gobbi note init` to create note directories. Never mkdir manually, never reference `$CLAUDE_SESSION_ID` directly.**

Initialize note directories using `gobbi note init`. It takes the project name and task slug as arguments and outputs the created directory path. It handles: session metadata extraction, directory creation with all subdirectories (`ideation/{subtasks,evaluation}/`, `plan/{subtasks,evaluation}/`, `research/{results,subtasks,evaluation}/`, `execution/{subtasks,evaluation}/`, `review/subtasks/`), and `metadata.json` generation.

After each subagent returns, run `gobbi note collect` to extract the delegation prompt and final result from the subagent's JSONL transcript. Use the `--phase` flag (`ideation`, `plan`, `research`, `execution`, or `review`) to route to the correct step's `subtasks/` subdirectory. Every step that spawns subagents should collect their outputs. The command handles transcript parsing and JSON formatting — no manual Write calls needed.

If `gobbi note init` fails because `CLAUDE_SESSION_ID` is not set, the SessionStart hook did not run — investigate the hook configuration, don't work around it.

---

## What to Write at Each Step

### metadata.json

Session context for the task, created automatically by `note-init.sh`. Contains: session_id, datetime, git_branch, cwd, claude_model, transcript path, and task name. Anchors every file in the directory to a specific session for traceability.

### ideation/

Step 1 output — what was explored and what was chosen.

- `innovative.md` — Written by innovative PI agent. Ideas explored through creative and novel lens.
- `best.md` — Written by best-practice PI agent. Ideas explored through established patterns lens.
- `ideation.md` — Written by orchestrator. Synthesis combining both stances and discussion with user.
- `subtasks/01-{slug}.json` — Extracted from PI agent transcripts via `gobbi note collect --phase ideation`.
- `evaluation/{perspective}.md` — Written by evaluator agents, one file per perspective. Only present if evaluation was performed.

### plan/

Step 2 output — the complete approved plan.

- `plan.md` — Complete approved plan with tasks, dependencies, agent assignments, scope boundaries.
- `subtasks/01-{slug}.json` — Extracted from exploration or planning agent transcripts via `gobbi note collect --phase plan`. Only present if exploration agents were spawned.
- `evaluation/{perspective}.md` — Written by evaluator agents, one file per perspective. Only present if evaluation was performed.

### research/

Step 3 output — how to implement the approved plan.

- `innovative.md` — Written by innovative researcher. Creative approaches, cross-domain patterns.
- `best.md` — Written by best-practice researcher. Proven patterns, community standards.
- `research.md` — Written by orchestrator. Synthesis organized by plan task.
- `results/` — Detailed research artifacts saved by researchers: code samples, API docs, pattern analysis.
- `subtasks/01-{slug}.json` — Extracted from researcher transcripts via `gobbi note collect --phase research`.
- `evaluation/{perspective}.md` — Written by evaluator agents, one file per perspective. Only present if evaluation was performed.

### execution/

Step 4 output — what was implemented and what happened.

- `execution.md` — Execution outcomes, per-subtask results, issues encountered, deviations from plan.
- `subtasks/01-{slug}.json` — Extracted from executor transcripts via `gobbi note collect` with `execution` phase.
- `evaluation/{perspective}.md` — Written by evaluator agents, one file per perspective. Only present if evaluation was performed.

### review/

Step 7 output — final review and verdict.

- `innovative.md` — Written by innovative PI agent. Review and verdict through creative lens.
- `best.md` — Written by best-practice PI agent. Review and verdict through best-practice lens.
- `review.md` — Written by orchestrator. Synthesizes both PI stance verdicts into a combined verdict and summary for the user.
- `subtasks/01-{slug}.json` — Extracted from PI reviewer transcripts via `gobbi note collect --phase review`.

### README.md

Task summary and index of related docs. Created at initialization by `note-init.sh` with session metadata (YAML frontmatter). During Collection (Step 5), it is overwritten with the full task summary including subdirectory listing and step summaries.

---

## Subtask Collection

`gobbi note collect` takes a `<phase>` argument (`ideation`, `plan`, `research`, `execution`, or `review`) to write to the correct step's `subtasks/` subdirectory. Every step that spawns subagents should collect their outputs. Each JSON file contains delegation metadata, the full prompt, and the subagent's final result — everything needed to reconstruct what was asked, how it was delegated, and what was delivered.

- One file per subtask, zero-padded sequence number for ordering
- Extracted automatically — the orchestrator calls the script after each subagent returns, not batched at collection
- Contains the full delegation prompt and full final result as structured JSON, not summaries

### Subtask JSON Format

Each subtask file at `{phase}/subtasks/{NN}-{slug}.json` has three sections: delegation metadata, prompt, and result.

| Field | Source | Description |
|---|---|---|
| `agentId` | Agent tool result | The subagent's unique ID returned by the Agent tool (e.g., `a74edda5b7f076239`) |
| `agentType` | Agent tool `subagent_type` | Which agent definition was used (e.g., `__executor`, `__researcher`, `__pi`, `gobbi-agent`, `_agent-evaluator`) |
| `description` | Agent tool `description` | Short description passed to the Agent tool (3-5 words) |
| `model` | Agent tool `model` or default | Model used for this delegation (e.g., `claude-opus-4-6`, `claude-sonnet-4-6`) |
| `effort` | Agent effort level | Effort level for this delegation (e.g., `high`, `max`) |
| `timestamp` | Transcript | ISO 8601 timestamp of when the delegation started |
| `delegationPrompt` | Transcript first message | The full delegation prompt sent to the subagent — complete text, not a summary |
| `finalResult` | Transcript last message | The subagent's final response — complete text, not a summary |

The `delegationPrompt` and `finalResult` fields contain the full text as strings. They may include markdown, code blocks, and special characters — all properly JSON-escaped by `gobbi note collect`. These fields are the primary record of what was delegated and what was delivered. Downstream agents (synthesis, evaluation) read these files from disk rather than receiving summaries through prompts.

---

## Feedback and Review Updates

If FEEDBACK happens, `feedback.md` is written to the task root directory — not inside any subdirectory. Number each feedback round explicitly (Round 1, Round 2, ...) to enable stagnation detection.

After FEEDBACK, new review files update the `review/` subdirectory. Previous review files are overwritten with the post-feedback assessment.

---

## When to Write

- **Always write** at the end of each workflow step — each step writes to its own subdirectory as it completes.
- **Write immediately** — do not defer note-writing to the end. Each step's notes must be written before proceeding to the next step.
- **Skip only** when the task was trivial and handled directly without delegation.
