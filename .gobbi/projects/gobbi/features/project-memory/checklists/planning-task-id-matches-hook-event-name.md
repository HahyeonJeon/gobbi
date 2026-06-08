---
name: planning-task-id-matches-hook-event-name
description: Checklist gap — task IDs must name the hook event they target, not misname a different hook event
type: checklists
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [docs-sync, aesthetics, naming]
scenario: plan-task-id-naming
item_status: implemented
anchor: novel
implemented_in: sessions/2026-06-08-c7673705-2d69-4be8-9bd4-436c3eb91be2/planning/rawdata/draft-iter1.md
---

# Planning checklist — task ID names the correct hook event

## What

A task that modifies a PostToolUse hook must not carry a `postcompact` prefix in its ID. Task IDs must name the target hook event accurately so status updates, briefings, and dependency table references are unambiguous.

Claude AESTH-1 / Codex AESTH-001 (Aesthetics, general/docs-sync, Low, Confidence 75) flagged task 02's ID `02-postcompact-hook-token-fix` mislabels the PostToolUse hook as PostCompact.

## Verification

When a task touches a hook file, confirm the task ID slug names the event the hook responds to. For PostToolUse work: slug must not contain `postcompact`.

## Status notes

Addressed in iter2: task 02 id remains `02-postcompact-hook-token-fix` — this was an aesthetic finding acknowledged but the id is stable (no rename after PASS per rules.md §1.1 rule 5). The concern is noted here for future planning: new tasks should not carry this pattern.
