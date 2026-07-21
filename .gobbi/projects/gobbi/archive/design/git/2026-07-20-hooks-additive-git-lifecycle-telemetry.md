---
name: hooks-additive-git-lifecycle-telemetry
description: DD-6 — Hooks kept in scope only as an additive git-lifecycle-telemetry opportunity; current token-reconciler behavior preserved; concrete shape deferred to Planning
type: design
scope: feature
feature: git-workflow
status: retired
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, hooks]
keywords: [telemetry, additive, deferred]
author: claude
supersedes: null
superseded_by: null
related: []
archived_at: 2026-07-20
archive_reason: retired
---

# DD-6 — Hooks treated as additive git-lifecycle-telemetry opportunity; shape deferred to Planning

## Problem

The initial brief listed "git-metadata hooks" as change-scope. INT-4 showed this was a false
premise: `hooks/session-end.sh` and `hooks/post-tool-use-agents.sh` are token reconcilers with NO
git-lifecycle metadata, and `session-end.sh:49-51` deliberately skips native Codex. There is no
existing "git-metadata hook" to change.

## Scope

In-scope: hooks are KEPT in scope but ONLY as a place to potentially ADD git-lifecycle recording
(branch/PR/merge events) — a new, distinct feature. This is an additive opportunity, not a re-point
of existing token logic. Current token-reconciler behavior and the native-Codex skip are preserved
facts.

Out-of-scope: modifying the existing token-reconciler behavior of the hooks.

## Approach

Whether to add any hook change, what it records, and which hook, is a Planning decision under user
confirmation (PIN-2). Absent that confirmation, hooks stay unchanged.

The user overrode the leader's recommendation to keep hooks out of scope entirely (D1 in
discussion-log). This override is honored: hooks remain in scope as described above.

## Scenarios

Anchors INT-4 (hooks are token reconcilers), C17 (wiring note).

## Validation

Planning produces an explicit yes/no + field list under user confirmation before any hook edit.
Absent that, hooks stay unchanged. The Execution plan does NOT include hook edits without prior
Planning + user confirmation.

## Trade-offs

Keeping hooks in scope adds a Planning discussion item (PIN-2) but respects the user's scope
decision. The risk of changing hooks without understanding the token-reconciler purpose is avoided
by making the shape a Planning prerequisite.
