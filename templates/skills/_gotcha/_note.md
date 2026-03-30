# Gotcha: _note

Mistakes in note writing, directory structure, and timing.

---

### Notes too short — must include full detail

**Priority:** High

**What happened:** Note files (ideation.md, plan.md, execution.md) were written as brief summaries — a few bullet points and one-line descriptions. They lacked the actual content that would let a future reader reconstruct what happened without reading the conversation.

**User feedback:** Note docs should be detailed. ideation.md specifically should include the initial user prompt, discussion points, and final idea.

**Correct approach:** Each note file must be self-contained and detailed enough that someone reading it later can fully understand what happened:
- **ideation.md** — initial user prompt (verbatim or near-verbatim), discussion questions asked and answers received, options explored with trade-offs, evaluation feedback if performed, the final refined idea with full detail
- **plan.md** — the complete plan with all tasks, agent assignments, dependencies, evaluation feedback, user adjustments
- **execution.md** — per-subtask delegation details, agent outputs, evaluation results, issues and resolutions, deviations from plan
- **feedback.md / review.md** — each round with full context

Notes are the permanent record. A reader should never need to ask "what was the original request?" or "what did they discuss?" — it should all be in the notes.

---

### Must use note-init.sh — never create note directories manually

**Priority:** Critical

**What happened:** The orchestrator tried to create a note directory with `mkdir -p` and manually checked `$CLAUDE_SESSION_ID` (which wasn't set). It bypassed the `note-init.sh` script that handles session metadata extraction, directory creation, README generation, and subtasks/ setup in a single call.

**User feedback:** "Did you use session-metadata.sh? Must run session-metadata.sh first."

**Correct approach:** Always use `bash .claude/skills/_note/scripts/note-init.sh <project-name> <task-slug>` to create note directories. Never `mkdir` manually, never reference `$CLAUDE_SESSION_ID` directly. The script chains through `note-metadata.sh` which reads from `$CLAUDE_SESSION_ID` (set by the SessionStart hook). If the script fails because `CLAUDE_SESSION_ID` is not set, investigate the hook — don't work around it.
