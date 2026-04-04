# Gotcha: _collection

Mistakes in work trail persistence, README indexing, and subtask file management.

---

### Original subtask results not collected to subtasks directory

**Priority:** High

**What happened:** During the doc-review workflow, 10 subtask agents produced output, but `subtask-collect.sh` was never run to extract their results from the JSONL transcripts into the `subtasks/` directory. Only the synthesis report (subtask 11) was written because the synthesis agent wrote its own output. The 10 original subtask outputs existed only in the transcripts and were lost from the workflow.

**User feedback:** The original subtask results must be collected to the subtasks directory.

**Correct approach:** After each wave of subagents completes, run `gobbi note collect` to extract delegation prompts and final results from the JSONL transcripts into `subtasks/{NN}-{slug}.json`. This must happen: 1. After every wave completes — not deferred to the end 2. Before any downstream agent (synthesis, evaluation) that needs those files 3. Verify the JSON files exist on disk before proceeding The subtask JSON files are the permanent record of what each specialist agent was asked and what it produced. If `gobbi note collect` is not run, the work is trapped in transcripts and invisible to downstream agents.

---

### New gotcha file created but not registered in gotcha index table

**Priority:** High

**What happened:** During the _git skill creation, a developer agent created `_gotcha/_git.md` as specified. However, the agent did not update the navigation table in `_gotcha/SKILL.md` to include the new file. The critical evaluator caught this — an unlisted gotcha file is invisible to agents scanning the table for relevant gotchas before starting work.

**User feedback:** (Caught by critical evaluator during execution evaluation)

**Correct approach:** When creating a new gotcha file, always update the `_gotcha/SKILL.md` navigation table to include the new entry. The gotcha system's discoverability depends on this central index. Include this as an explicit step in any delegation prompt that involves creating a new gotcha file.
