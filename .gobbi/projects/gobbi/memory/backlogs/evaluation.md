# Evaluation backlog

## Review report persistence when Claude Code refuses the report write

**Backlogged at:** 2026-09-29T08:19:28Z

**What:** Decide how a Claude Code review completes when the harness refuses a reviewer subagent's `report.md`
write. The [Review](../design/process/evaluation.md#paths) design has each reviewer write its report at the brief's
path and only a read-only Partner return it as its final message, so a refused write has no recorded fallback.

**Why backlogged:** In the 2026-09-26 Cowork session the refusal hit almost every review. The user authorized
the manager, for that session only, to save each reviewer's Handoff report verbatim and mark it manager-saved.
The design rule was not changed.

**Context:** The refusal reads "Subagents should return findings as text, not write report files". It is not
uniform. `checklist.md` writes were usually allowed, and in the last review one reviewer's writes succeeded
while the other's were refused. Those reviewers ran as general-purpose agents that carried the reviewer
contracts, because the new reviewer types register only after a restart. See
[Claude Code refuses a subagent's report-file write](../learnings/claude/tips.md#claude-code-refuses-a-subagents-report-file-write).
