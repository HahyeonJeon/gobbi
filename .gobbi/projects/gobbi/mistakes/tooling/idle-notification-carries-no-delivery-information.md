---
name: idle-notification-carries-no-delivery-information
description: An idle notification says an agent is available; it does not prove what work or report was delivered.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-25
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [tooling, process]
keywords: [idle-notification, delivery, stale-summary, artifact]
author: codex
priority: high
domain: tooling
supersedes: agent-teams-idle-notification-is-not-completion
superseded_by: null
---

# Idle says nothing about delivery

## What happened

Six agents became idle without delivering their current report. Several idle summaries described
an earlier turn. Acting on those summaries caused repeated requests and one stale-state dispute.

## Why it happens

Idle is an availability event. Its timing and summary are not coupled to a message delivery or to
the final bytes of a file-producing assignment.

## Correct approach

For file-producing work, reread the exact artifact or commit from disk. For a report-only
assignment, require the explicit report message. Never accept, reject, or redispatch work from an
idle summary.

## How to detect

The next action depends on an idle notification, but no exact disk artifact, commit, or report
message has been received and verified.

## Related

- [[agent-teams-idle-notification-is-not-completion]] — the narrower completion-signal predecessor preserved in archive.
