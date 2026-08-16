# Delegation, discussion, commit gate, and stop reminder completed

**Completed at:** 2026-08-16T02:02:00Z

## Changes

- Reworked Delegation briefs so Context sits above Task, Materials replaces Resources, and Materials names
  the skills the specialist must load. Partner uses the same section names. See
  [collaborative design and delegated results](../design/process/collaborative-design-and-delegated-results.md).
- Required Discussion to render the Decision Question card first, then call the asking tool, and removed
  Workflow coupling. See [discussion question flow](../design/process/discussion.md).
- Gated Cowork implementation commits on an explicit user `commit` call. PASS no longer requires a commit.
  See [Cowork implementation commits](../design/process/cowork.md).
- Added a Stop reminder hook for Claude, Codex, and Grok: bash plus `jq`, hashed per-turn lock, and
  runtime-specific payloads. See [stop reminder](../design/feature/stop-reminder.md).
