---
name: agent-teams-idle-notification-is-not-completion
description: "An Agent-Teams teammate's idle_notification was treated as a failure-to-complete and the task was re-dispatched to a fresh executor — but the teammate had actually completed it (just lagged the DONE ack), causing a duplicate/racing executor that had to be killed."
type: mistakes
scope: project
feature: null
status: superseded
priority: medium
domain: process
created: 2026-07-16
session: e5c0af1d-005d-4455-a58f-efe601ed342f
tags: [tooling, process]
keywords: [agent-teams, teammate, idle-notification, completion-signal, double-dispatch, fresh-background-executor, taskstop]
author: claude
supersedes: null
superseded_by: idle-notification-carries-no-delivery-information
archived_at: 2026-07-26
archive_reason: superseded
---

# An Agent-Teams idle_notification is not a completion signal

**What happened** — During Execution, a teammate executor (`exec-t1`) emitted an `idle_notification` ("available") for task T2. The manager read that as "did not complete" (the real file wasn't written yet + no DONE message) and re-dispatched T2 to a fresh background executor. Minutes later the teammate sent its actual DONE report — it HAD completed T2 (compaction.md committed). The fresh executor was now a racing duplicate and had to be `TaskStop`-killed before it wrote a conflicting file.

**Why it happens** — Agent-Teams teammates lag their DONE acknowledgement; an `idle_notification` fires when the teammate's turn ends and can arrive BEFORE (or independently of) the substantive DONE report. It is an availability ping, not a task-completion signal. Treating it as "failed → re-dispatch" double-dispatches.

**Correct approach** — Wait for the teammate's explicit `STATUS: DONE` SendMessage (or verify the actual on-disk artifact + commit) before concluding a teammate task failed; never re-dispatch off an idle ping alone. Better for reliability: prefer FRESH background subagents (Agent tool, unnamed) for executor tasks — they give a clean single completion notification and no lag. Reserve teammates for cases where their retained context clearly outweighs the ack-lag risk.

**How to detect** — You're about to re-dispatch a teammate task after only an `idle_notification` (no DONE report). Stop: check `git status` / the target file first; if it's done, don't re-dispatch. If you already double-dispatched, `TaskStop` the redundant one immediately.
