# Gotcha: gobbi-collection

Mistakes in work trail persistence, README indexing, and subtask file management.

---

### Original subtask notes not copied to subtasks directory

**Priority:** High

**What happened:** During the doc-review workflow, 10 subtask agents produced output, but their actual results were never copied to the `subtasks/` directory as individual files. Only the synthesis report (subtask 11) was written because the synthesis agent wrote its own output. The 10 original subtask outputs existed only in conversation context and were lost.

**User feedback:** The original subtask notes must be copied to the subtasks directory.

**Correct approach:** After each wave of subagents completes, immediately write each agent's full output to `subtasks/{NN}-{slug}.md`. This must happen:
1. After every wave completes — not deferred to the end
2. Before any downstream agent (synthesis, evaluation) that needs those files
3. With the agent's actual output — not a summary or the orchestrator's interpretation

The subtask files are the permanent record of what each specialist agent found or produced. If they're not written to disk, the work is lost when the conversation ends or compacts.
