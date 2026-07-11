---
name: execution-codex-only-evaluation-policy
description: User removed Claude-side evaluation for this session.
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: []
keywords: [evaluation, codex-only]
author: user
outcome: Run Codex-only evaluation for this session; do not run Claude-side evaluation.
---

# Execution Codex-Only Evaluation Policy

## Context

During this session the user stated: "In this session, we don't need to do claude evaluation."

## Question

Whether Execution evaluation should continue trying to produce Claude-side evaluation artifacts for this session.

## Options considered

- Continue with dual-system evaluation. This would preserve the default Gobbi evaluation contract but contradict the user's session policy.
- Use Codex-only evaluation for this session. This records the deviation explicitly and avoids fabricating unavailable Claude-side evidence.

## User decision

Use Codex-only evaluation for this session.

## Implication

Task 01 evaluation records `systems: [codex]`, `skippedSystems: [claude]`, and the skip reason. No Claude-side evaluation files are created or inferred.

## Related

- [[task-01-codex-only-evaluation]]
