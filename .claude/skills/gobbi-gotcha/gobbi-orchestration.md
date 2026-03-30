# Gotcha: gobbi-orchestration

Mistakes in following the orchestration workflow (phases, steps, transitions).

---

### Dropping into implementation mode during REVIEW after long FEEDBACK
---
priority: critical
---

**Priority:** Critical

**What happened:** After a long FEEDBACK phase with many iterative fixes, the user transitioned to REVIEW. The orchestrator treated REVIEW as "more feedback" — it skipped planning, started implementing fixes directly, and did the work itself instead of delegating to specialists. The long feedback phase eroded the workflow discipline.

**User feedback:** REVIEW is a full workflow phase. Follow it regardless of how long the preceding FEEDBACK was.

**Correct approach:** REVIEW runs the full workflow (Step 1 → Step 2 → Step 3 → Step 4). No exceptions. No shortcuts. The longer the feedback phase was, the MORE important it is to follow the full REVIEW workflow — because context fatigue makes ad-hoc work sloppy.

---

### Skipping structured phase transitions

**Priority:** High

**What happened:** Asked "Ready for FEEDBACK?" in prose instead of using AskUserQuestion.

**User feedback:** Use structured selections between phases.

**Correct approach:** Call AskUserQuestion with explicit options at every phase boundary. Never prose.

---

### Not writing notes during collection

**Priority:** High

**What happened:** Summarized results in conversation messages but never wrote note files to `.claude/project/{project-name}/note/`.

**User feedback:** Write notes in every workflow cycle.

**Correct approach:** Load gobbi-note during Step 4 (Collection). Write ideation.md, plan.md, execution.md, and subtasks/ to the task note directory. Context disappears after the session — notes are the permanent record.

---

### Skipping subtask docs or writing summaries instead of actual content

**Priority:** High

**What happened:** Skipped subtasks/ directory, or wrote orchestrator summaries instead of preserving subagent output.

**User feedback:** Subtask docs must contain the actual subagent deliverable, not summaries.

**Correct approach:** Write `subtasks/{NN}-{slug}.md` for every subagent. Copy their actual output — full reports, findings, results. Never summarize. The subagent's words, not yours.

---

### Writing summaries instead of actual content in notes

**Priority:** High

**What happened:** Wrote one-sentence summary in ideation.md and brief outline in plan.md.

**User feedback:** Note files must contain actual content, not summaries.

**Correct approach:** `ideation.md` = full ideas explored, trade-offs, evaluation feedback, chosen approach. `plan.md` = full plan with tasks, dependencies, verification criteria. These are the historical record — preserve everything.

---

### Skipping collection after delegation
---
priority: high
---

**Priority:** High

**What happened:** Jumped from delegation results directly to AskUserQuestion without writing notes.

**User feedback:** Write notes immediately after delegation, before any transition.

**Correct approach:** Step 3 completes → Step 4 (Collection: write everything) → Phase transition (AskUserQuestion). Collection is not optional and not deferrable. Write first, ask next.

---

### Self-evaluating instead of spawning separate evaluator agents

**Priority:** High

**What happened:** The orchestrator evaluated its own ideation or plan output instead of spawning separate evaluator agents.

**User feedback:** The agent that creates must never evaluate its own output.

**Correct approach:** Spawn 3 evaluator agents (positive, moderate, critical) that independently assess the output. Positive finds strengths to preserve, moderate checks completeness, critical stress-tests assumptions. This separation and multi-stance coverage prevents blind spots.

---

### Write subtask files to disk BEFORE launching synthesis
---
priority: high
---

**Priority:** High

**What happened:** During a 10-subtask review workflow, the orchestrator launched Wave 1 and Wave 2 agents, then launched the synthesis agent to combine their outputs. But subtask output files had not been written to disk between waves. The synthesis agent found empty directories, so it performed a fresh independent audit instead of combining the 10 prior agent outputs. This caused the synthesis to miss findings that the individual audits had caught (specifically, step-by-step recipe violations in 5 skill files).

**User feedback:** Subtask files must be written to disk immediately after each agent completes, before any downstream agent that depends on them.

**Correct approach:** After each wave completes, write all subtask output files to the `subtasks/` directory BEFORE launching the next wave or the synthesis agent. The synthesis agent should read files from disk, not receive findings through the prompt. This ensures the synthesis captures all findings from all prior agents and prevents the "fresh audit" fallback that loses coverage.

---

### Evaluation should be optional in ideation — ask user first

**Priority:** High

**What happened:** During the ideation step, the orchestrator automatically spawned 3 evaluator agents after generating the idea without asking the user whether evaluation was needed. For straightforward tasks, this added unnecessary overhead and delay.

**User feedback:** Evaluation in ideation should be optional. Ask the user with AskUserQuestion before launching evaluators.

**Correct approach:** After generating the idea in Step 1, use AskUserQuestion to ask the user whether they want to evaluate the idea or move directly to planning. Only spawn evaluator agents if the user opts for evaluation. This preserves the quality gate for complex tasks while allowing streamlined flow for simpler ones.

---

### Discuss evaluation results before improving

**Priority:** High

**What happened:** After evaluation agents returned their verdicts, the orchestrator immediately started improving the idea/plan based on the evaluation feedback — without discussing the evaluation results with the user first.

**User feedback:** Before improving based on evaluation, discuss the evaluation findings with the user to decide what to improve.

**Correct approach:** After evaluator agents complete, present the evaluation results to the user via AskUserQuestion. Discuss which findings to address, which to defer, and which to disagree with. THEN improve based on the agreed-upon direction. The user should be in the loop between evaluation and improvement — evaluation findings are input to a conversation, not automatic marching orders.

---

### Must start workflow when user requests a non-trivial task

**Priority:** High

**What happened:** The user said "let's move on next step" and selected "all remaining fixes." The orchestrator skipped the workflow — it jumped straight to reading files and was about to implement directly instead of starting the gobbi workflow (ideation → plan → execution → collection).

**User feedback:** "No, we should start new workflow. Why you didn't start with the workflow?"

**Correct approach:** When the user requests a non-trivial task (multi-file edits, fixes across many docs), always start the full gobbi workflow. Load /gobbi, ask trivial scope, create task checklist, and begin Step 1 (Ideation). Never jump to implementation regardless of how well-defined the fixes seem.

---

### Agent cannot run /compact — must tell user to run it

**Priority:** High

**What happened:** During FINISH, the user selected "compact only." The orchestrator attempted to compact but could not — `/compact` is a CLI command that only the user can execute. The context was never compacted.

**User feedback:** The agent cannot run compact directly. Suggest the compact command with details so the user can run it themselves.

**Correct approach:** When the user selects compact during FINISH, tell the user to run the command themselves. The compact message should start with "abort gobbi" so the compacted context drops gobbi workflow state (it auto-reloads after compact via the reload hook), followed by a summary of work done. Example: `/compact abort gobbi — completed doc-review, findings in note/20260328-0706-doc-review/`

---

### Concurrent sessions corrupt each other's working tree

**Priority:** Critical

**What happened:** Two gobbi sessions ran simultaneously in the same working tree — one doing a v0.2.0 redesign, the other doing README/presentation improvements. The presentation session's subagents made changes that appeared to be scope violations but were actually from the concurrent session. The orchestrator reverted the concurrent session's legitimate work (src/cli.ts, src/commands/, src/lib/ files) thinking they were scope creep. The concurrent session then committed a README rewrite that overwrote the presentation session's visual improvements. Both sessions' work had to be manually reconciled.

**User feedback:** "We experienced this concurrent mistakes several times." Requested a gobbi-worktree skill to isolate sessions via git worktrees.

**Correct approach:** Never run multiple gobbi sessions in the same working tree. Each session's subagents and the concurrent session's changes are indistinguishable in `git diff`. The orchestrator cannot tell which changes are from its own agents vs another session. Use git worktrees to give each session its own isolated copy of the repo, then merge results explicitly.
