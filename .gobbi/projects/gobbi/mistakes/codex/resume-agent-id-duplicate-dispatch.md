---
name: resume-agent-id-duplicate-dispatch
description: Resume without a recorded in-flight agent id caused a duplicate executor dispatch
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-06
session: 019f283d-e961-7442-9c22-319f26798141
tags: [process, verification, codex]
keywords: [compaction, resume, subagent, duplicate-dispatch]
author: codex
priority: high
domain: codex
supersedes: null
superseded_by: null
related: [manager-locked-decision-without-audit-trail-sync]
---

# Preserve in-flight agent ids across resume

## What happened

During Execution Task 03, the manager had already dispatched executor Pascal before compaction. After resume, the manager no longer had a reliable in-memory record of that agent id. The task directory still showed only `working/discussion-log.md`, so the manager spawned a second executor for the same task. Pascal's delayed completion then arrived with the contracted artifacts, and the duplicate executor had to be closed to prevent overlapping writes.

## Why it happens

Compaction preserves summarized session context, but it can drop volatile in-flight subagent ids and pending notification state. The manager then treats missing local artifacts as evidence that no agent is still working, even though a slow subagent may still complete.

## Correct approach

Before re-dispatching after compaction, resume, or `/clear`, reconcile active subagents and delayed notifications. Record the active agent id in session state or in the discussion log as soon as a subagent is spawned. If the id is missing on resume, inspect active agent listings and task timestamps, then either wait for the pending agent or explicitly close it before starting a replacement.

## How to detect

A session resumes during a delegated task, the task directory has partial or no output, and the manager cannot name the active subagent id that owns the task. Dispatching another agent to the same role and task at that point risks duplicate writers.

## Related

- [[manager-locked-decision-without-audit-trail-sync]] — manager-only state must be reflected in the session record when it affects later workflow choices.
