---
name: step1-row4-stale-hook-auto-append-claim
description: orchestration/SKILL.md Step 1 row 4 (Init session.json) still says specialist entries are "appended automatically by the PostToolUse hook" + reconstructor reconciles — contradicts the established always-worktree reality where the hook can't resolve the worktree session.json and the manager records via the reconcile script.
type: backlogs
scope: project
feature: agents
status: open
created: 2026-06-06
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [orchestration, docs-sync, hook, session-json, configuration]
priority: medium
---

# Step 1 row 4 still claims the hook auto-appends specialist `agents[]` entries

## What

`orchestration/SKILL.md` § Step 1 — Workflow Configuration, row 4 (Init session.json), line ~77, still reads:

> "Specialist entries are appended automatically by the PostToolUse hook (`post-tool-use-agents.sh`, matcher `Task|Agent`); the reconstructor (`reconstruct-agents.sh`) reconciles on missed events. The manager seeds only its own entry and never hand-appends specialist entries."

## Why it matters

Tasks 06–09 (session 06668274) established the opposite reality:
- The PostToolUse hook **cannot resolve the worktree `session.json`** under the always-worktree model (its resolver scans the main-tree `cwd`), so its upsert is usually skipped — `agents[]` is NOT auto-populated. (Backlog `post-tool-use-hook-cannot-resolve-worktree-session-json.md`.)
- The **manager records per-agent token usage via the reconcile script** (`skills/orchestration/scripts/reconcile-session-metadata.sh`), as documented in `§ Recording workflow metadata`.
- Task 09 removed the broken-hook caveat from `§ Recording workflow metadata`, which **sharpens** the divergence: one section now says the manager records via scripts while Step 1 row 4 still asserts the hook auto-appends.

The hook's accurate role (routing-field seeding from prompt headers, best-effort) is owned by `delegation/SKILL.md § Hook Integration`.

## Suggested fix

Reword Step 1 row 4's `agents[]` sentence to match reality: the manager seeds `agents[0]` (itself) at Configuration; specialist entries + per-agent `tokensUsed` are recorded by the manager via `reconcile-session-metadata.sh` (per-subagent on return + bulk reconcile at MEMORIZATION/Wrap-up); the PostToolUse hook may best-effort seed routing fields when it can resolve the session.json (see `delegation/SKILL.md § Hook Integration`), but is not relied upon. Drop or qualify the "appended automatically by the hook" claim.

## Related

- [[session-operation-metadata-recording-from-agent-transcripts]] (task 06 decision)
- [[workflow-metadata-fetch-packaged-as-orchestration-scripts]] (task 07 decision)
- `features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md` (the hook bug)
- Surfaced by task 09 evaluation (commit `0deaaab`).
