# Gotcha: _orchestration

Mistakes in following the orchestration workflow (steps, transitions, FEEDBACK/FINISH cycle).



---

### Dropping into implementation mode during Review after long FEEDBACK
---
priority: critical
---

**Priority:** Critical

**What happened:** After a long FEEDBACK cycle with many iterative fixes, the workflow returned to Review (Step 7). The orchestrator treated Review as "more feedback" — it skipped spawning PI agents and started implementing fixes directly instead of delegating to specialists. The long FEEDBACK cycle eroded the workflow discipline.

**User feedback:** Review (Step 7) is a full independent assessment. Follow it regardless of how long the preceding FEEDBACK was.

**Correct approach:** Review (Step 7) spawns PI agents with innovative + best stances. No exceptions. No shortcuts. The longer the FEEDBACK cycle was, the MORE important it is to follow the full Review step — because context fatigue makes ad-hoc assessment unreliable.

---

### Skipping structured transitions
---
priority: high
---

**Priority:** High

**What happened:** Asked "Ready for FEEDBACK?" in prose instead of using AskUserQuestion.

**User feedback:** Use structured selections at every transition point.

**Correct approach:** Call AskUserQuestion with explicit options at every transition — after Review (FEEDBACK or FINISH?), after step completions, and at every decision point. Never prose.

---

### Not writing notes during collection
---
priority: high
---

**Priority:** High

**What happened:** Summarized results in conversation messages but never wrote note files to `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/note/`.

**User feedback:** Write notes in every workflow cycle.

**Correct approach:** Load _note during Step 5 (Collection). Write notes to the appropriate subdirectories: `ideation/`, `plan/`, `research/`, `execution/`, `review/`. Context disappears after the session — notes are the permanent record.

---

### Skipping `gobbi note collect` call after subagent completes
---
priority: high
---

**Priority:** High

**What happened:** After subagents completed their work, the orchestrator moved on to synthesis or evaluation without running `subtask-collect.sh` to extract results from the JSONL transcripts. The `subtasks/` directory remained empty. Downstream agents (synthesis, evaluation) found nothing on disk and either failed or performed redundant fresh work — losing all findings from the prior agents.

**User feedback:** Subtask collection must happen after each subagent returns, before any downstream agent runs.

**Correct approach:** After each subagent completes, run `gobbi note collect` to extract the delegation prompt and final result from the JSONL transcript into `subtasks/{NN}-{slug}.json`. Verify the JSON file exists before launching any downstream agent (synthesis, evaluation) that depends on it. The command extracts directly from the transcript, so content quality is guaranteed — the risk is not summary vs actual content, but forgetting to call the command at all.

---

### Writing summaries instead of actual content in notes
---
priority: high
---

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

**Correct approach:** Step 4 (Execution) completes → Step 5 (Collection: write everything) → Step 6 (Memorization) → Step 7 (Review). Collection is not optional and not deferrable. Write first, proceed next.

---

### Self-evaluating instead of spawning separate evaluator agents
---
priority: high
---

**Priority:** High

**What happened:** The orchestrator evaluated its own ideation or plan output instead of spawning separate evaluator agents.

**User feedback:** The agent that creates must never evaluate its own output.

**Correct approach:** Spawn perspective evaluator agents (Project + Overall minimum, plus Architecture/Performance/Aesthetics based on task type). Each perspective examines the output through its specific lens. The Overall perspective also generates a "must preserve" list. This separation and multi-perspective coverage prevents blind spots.

---

### Run `gobbi note collect` BEFORE launching synthesis
---
priority: high
---

**Priority:** High

**What happened:** During a 10-subtask review workflow, the orchestrator launched Wave 1 and Wave 2 agents, then launched the synthesis agent to combine their outputs. But `subtask-collect.sh` had not been run between waves to extract results from the JSONL transcripts. The synthesis agent found an empty `subtasks/` directory, so it performed a fresh independent audit instead of combining the 10 prior agent outputs. This caused the synthesis to miss findings that the individual audits had caught (specifically, step-by-step recipe violations in 5 skill files).

**User feedback:** Subtask files must be written to disk immediately after each agent completes, before any downstream agent that depends on them.

**Correct approach:** After each wave completes, run `gobbi note collect` to extract all subtask outputs to `subtasks/{NN}-{slug}.json` BEFORE launching the next wave or the synthesis agent. The synthesis agent should read JSON files from disk, not receive findings through the prompt. This ensures the synthesis captures all findings from all prior agents and prevents the "fresh audit" fallback that loses coverage.

---

### Evaluation should be optional at Steps 1-4 — ask user first
---
priority: high
---

**Priority:** High

**What happened:** During the Ideation step, the orchestrator automatically spawned evaluator agents after generating the idea without asking the user whether evaluation was needed. For straightforward tasks, this added unnecessary overhead and delay.

**User feedback:** Evaluation at Steps 1-4 should be optional. Ask the user with AskUserQuestion before launching evaluators.

**Correct approach:** At Steps 1 (Ideation), 2 (Planning), 3 (Research), and 4 (Execution), use AskUserQuestion to ask the user whether they want to **skip** evaluation — evaluation is the default. Only skip if the user explicitly opts out. This preserves the quality gate for complex tasks while allowing streamlined flow for simpler ones.

---

### Discuss evaluation results before improving
---
priority: high
---

**Priority:** High

**What happened:** After evaluator agents returned their verdicts, the orchestrator immediately started improving the idea/plan based on the evaluation feedback — without discussing the evaluation results with the user first.

**User feedback:** Before improving based on evaluation, discuss the evaluation findings with the user to decide what to improve.

**Correct approach:** After evaluator agents complete, present the evaluation results to the user via AskUserQuestion. Discuss which findings to address, which to defer, and which to disagree with. THEN improve based on the agreed-upon direction. The user should be in the loop between evaluation and improvement — evaluation findings are input to a conversation, not automatic marching orders.

---

### Must start workflow when user requests a non-trivial task
---
priority: high
---

**Priority:** High

**What happened:** The user said "let's move on next step" and selected "all remaining fixes." The orchestrator skipped the workflow — it jumped straight to reading files and was about to implement directly instead of starting the gobbi 7-step workflow.

**User feedback:** "No, we should start new workflow. Why you didn't start with the workflow?"

**Correct approach:** When the user requests a non-trivial task (multi-file edits, fixes across many docs), always start the full gobbi workflow. Load /gobbi, ask trivial scope, create task checklist, and begin Step 1 (Ideation). Never jump to implementation regardless of how well-defined the fixes seem.

---

### Agent cannot run /compact — must tell user to run it
---
priority: high
---

**Priority:** High

**What happened:** During FINISH, the user selected "compact only." The orchestrator attempted to compact but could not — `/compact` is a CLI command that only the user can execute. The context was never compacted.

**User feedback:** The agent cannot run compact directly. Suggest the compact command with details so the user can run it themselves.

**Correct approach:** When the user selects compact during FINISH, tell the user to run the command themselves. The compact message should start with "abort gobbi" so the compacted context drops gobbi workflow state (it auto-reloads after compact via the reload hook), followed by a summary of work done. Example: `/compact abort gobbi — completed doc-review, findings in note/20260328-0706-doc-review/` Note: `/gobbi` reload works after compact because the SessionStart hook is not affected by compact — the hook triggers on the next message after compact completes, which re-initializes the gobbi workflow state.

---

### Concurrent sessions corrupt each other's working tree
---
priority: critical
---

**Priority:** Critical

**What happened:** Two gobbi sessions ran simultaneously in the same working tree — one doing a v0.2.0 redesign, the other doing README/presentation improvements. The presentation session's subagents made changes that appeared to be scope violations but were actually from the concurrent session. The orchestrator reverted the concurrent session's legitimate work (src/cli.ts, src/commands/, src/lib/ files) thinking they were scope creep. The concurrent session then committed a README rewrite that overwrote the presentation session's visual improvements. Both sessions' work had to be manually reconciled.

**User feedback:** "We experienced this concurrent mistakes several times." Requested a worktree skill to isolate sessions via git worktrees.

**Correct approach:** Never run multiple gobbi sessions in the same working tree. Each session's subagents and the concurrent session's changes are indistinguishable in `git diff`. The orchestrator cannot tell which changes are from its own agents vs another session. Use git worktrees to give each session its own isolated copy of the repo, then merge results explicitly.

---

### Core skills not loaded after project setup on first session
---
priority: high
---

**Priority:** High

**What happened:** On the first session with a new project, `/gobbi` triggered project setup (creating `$CLAUDE_PROJECT_DIR/.claude/project/{name}/` directories and README.md). After completing the setup, the orchestrator did not load the core skills (`_orchestration`, `_gotcha`, `_claude`, `_git`) that the gobbi skill requires to be loaded "immediately after this skill." The agent proceeded to wait for a task without the workflow machinery loaded.

**User feedback:** Core skills were not loaded after first setup.

**Correct approach:** The gobbi SKILL.md instruction to load `_orchestration`, `_gotcha`, `_claude`, and `_git` must be followed regardless of whether project setup ran. Project setup is an intermediate step — it does not replace or defer core skill loading. After setup questions and project detection complete, load all four core skills before declaring the session ready. The loading instruction is unconditional.

---

### Concurrent agents in same worktree can bundle each other's commits
---
priority: critical
---

**Priority:** Critical

**What happened:** Multiple parallel executor agents were delegated to the same worktree simultaneously. When each agent committed their work, some commits included changes from other agents that happened to be staged or unstaged in the shared working directory. The resulting commit history was a tangled mess — agent A's commit contained agent B's half-finished changes, and agent B's commit was missing files it had written because agent A already committed them.

**User feedback:** Parallel agents in the same worktree corrupt each other's commits.

**Correct approach:** When delegating parallel agents that commit to the same worktree, batch them into sequential waves and run `subtask-collect.sh` between waves. Alternatively, give each parallel agent its own worktree. The key insight: git staging area is shared across all processes in a worktree. Two agents running `git add` and `git commit` concurrently will interleave their changes unpredictably.

---

### Review (Step 7) is a PI assessment, not a full workflow re-run
---
priority: high
---

**Priority:** High

**What happened:** The old workflow ran a full REVIEW phase (Ideation through Collection). The new Review step only spawns PI agents for assessment and verdict.

**User feedback:** Review assesses through reading and analysis, not re-execution.

**Correct approach:** Review (Step 7) spawns PI agents with innovative + best stances to assess the completed work and produce verdicts. It does not re-run Ideation, Planning, Research, or Execution. For re-execution of fixes, use FEEDBACK to delegate targeted fixes to executors, then return to Review again.

---

### Writing notes or note fragments to wrong paths
---
priority: high
---

**Priority:** High

**What happened:** The orchestrator wrote note files (ideation.md, plan.md, subtask JSON, evaluation files) to incorrect paths — sometimes to the project root instead of the note directory, sometimes to a sibling step's subdirectory, sometimes to a path missing the session-specific note directory prefix. This caused _collection verification to fail (missing expected files) and downstream agents to read stale or empty directories.

**User feedback:** Notes are ending up in the wrong path.

**Correct approach:** All note files must be written under the task's note directory initialized by `gobbi note init`. The path format is `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/note/{YYYYMMDD-HHMM}-{slug}-{session_id}/`. Each step writes to its own subdirectory within this path: `ideation/`, `plan/`, `research/`, `execution/`, `review/`. Always use the note directory path returned by `gobbi note init` as the base — never construct note paths manually or use relative paths. When _git is active, notes must go to the main tree's absolute path, not the worktree.

---

### Checking directory existence is NOT collecting — must actually run gobbi note collect
---
priority: critical
---

**Priority:** Critical

**What happened:** The orchestrator initialized the note directory and spawned subagents, but after subagents completed, it only checked whether the step subdirectories existed (ls, glob) instead of running `gobbi note collect` to extract subagent outputs from transcripts. The `subtasks/` directories were empty. The orchestrator treated directory existence as proof of collection, but directories are created at init — they are always empty until `gobbi note collect` populates them.

**User feedback:** The orchestrator just checks directory existence without real collecting.

**Correct approach:** After EVERY subagent returns, run `gobbi note collect <agent-id> <subtask-number> <subtask-slug> <note-dir> --phase <step>`. Then VERIFY the subtask JSON file was created by reading it. Directory existence proves nothing — `gobbi note init` creates empty directories at workflow start. Only `gobbi note collect` populates them with extracted transcript content. The sequence is: subagent completes → run gobbi note collect → verify JSON file exists → proceed to next agent or synthesis.
