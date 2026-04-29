# Inline-mode (discuss: 'auto') still requires session notes

When `workflow.{step}.discuss.mode` is `'auto'`, the orchestrator does the step's work inline without spawning a subagent. The _gobbi-rule "Every subagent prompt must include specific requirements" becomes vacuously true — there's no subagent, no prompt. But session notes are not vacuous. They're still required.

---

### The orchestrator must write notes even when no subagent is spawned

**Priority:** Medium (rework needed)

**What happened:**
Session with `workflow.execution.discuss.mode = 'auto'` set. The orchestrator handled a small execution task inline (e.g., a one-line config tweak). No `__executor` was spawned, no `gobbi note collect` call happened, and the session's `execution/subtasks/` directory stayed empty. When the next session resumed and tried to Memorize, the execution history was blank — the work had happened but left no trace in the note system.

**User feedback:**
"Why is the Memorization step reporting zero execution activity when we clearly shipped code this session?"

**Correct approach:**

When `discuss.mode === 'auto'` for any step, the orchestrator is still responsible for writing a structured record of the step's work to the session's step directory (`ideation/`, `plan/`, `execution/`, `evaluation/`, `memorization/` under `.gobbi/sessions/{session-id}/`).

Options:
1. **Manual Write** — orchestrator writes a structured `.md` or `.json` note directly to the step dir summarizing what happened (decision made, files touched, rationale, result). Mirrors the shape a subagent transcript would produce.
2. **Use `gobbi workflow capture-*`** hooks if applicable — these normally fire from subagent-spawn events, but inline work can synthesize equivalent event records via the event store.

Whichever path, the session's step dir MUST contain a record after the step completes. Directory existence is not collection — an empty `execution/subtasks/` directory fails the "notes written at every workflow step" invariant.

The shape of the record (summary.md vs. subtasks/*.json vs. inline-mode-note.md) is at the orchestrator's discretion, but downstream readers (the memorization step, the next session's resume) expect SOMETHING.

**Related:**
- `_gobbi-rule §Documentation Discipline` says "Write notes at every workflow step — never defer, never skip"
- The `_collection` skill documents directory-completeness expectations
- `_note` skill covers per-step note-writing
- Pass 3 finalization landed the `workflow.{step}.discuss` config; future Passes may add tooling (e.g., `gobbi workflow note-inline`) to make inline-mode note-keeping frictionless
