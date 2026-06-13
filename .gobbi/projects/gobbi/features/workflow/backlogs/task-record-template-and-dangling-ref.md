---
name: task-record-template-and-dangling-ref
description: Author the task-record template and fix the dangling memorization/templates/task-record.md reference in chat-mode.md
type: backlogs
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [chat-mode, templates, docs-sync]
priority: medium
disposition: open
project-scope: false
shipped_in: null
---

# Author the task-record template + fix its dangling reference

## Context
Chat-mode uses a per-task `task-record.md` artifact (17 references across `orchestration/chat-mode.md`). `chat-mode.md:379` proposes "a new dedicated `task-record` template under `memorization/templates/task-record.md`", but that template file does not exist — the reference is dangling. Under this redesign the templates dir moves to `skills/memory/templates/` (D10), so any new `task-record` template should land there.

## Why deferred
Out of scope for the memorization/wrap-up vocabulary + pipeline redesign (D12 Scope Contract). Authoring a new template is net-new content, not a rename; it is an adjacent improvement surfaced by the leader's investigation, not part of the locked task.

## When to pick up
After this redesign ships (so the template lands at the correct post-split path `skills/memory/templates/task-record.md` and the chat-mode reference can be repointed in one consistent pass). No hard prerequisite beyond that.

## Suggested approach
Author `task-record.md` following the existing template shape (base frontmatter + section contract); decide the `type:` frontmatter value (chat-mode.md:370 notes it was deferred); repoint the 17 chat-mode references to the chosen template path.

## Originating session
`.gobbi/projects/gobbi/sessions/2026-06-12-7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4/`
