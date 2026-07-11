---
name: teammate-finalize-read-crosses-in-progress-write
description: A manager "not on disk / unchanged" read can cross with a teammate's in-progress write — re-verify after the teammate reports, don't conclude a no-op from a single read
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [verification, process]
keywords: [agent-teams, teammate-read, race-condition, in-progress-write, idle-notification]
author: claude
priority: medium
domain: process
supersedes: null
superseded_by: null
related: [teammate-finalize-brief-crosses-with-in-progress-turn]
---

# A manager read against an in-progress teammate write can conclude a false no-op

## What happened

During this session, the manager read a session-record path to check whether a teammate's prior turn had produced or changed a file, found it not-on-disk (or unchanged from a prior snapshot), and treated that as confirmation the teammate had not yet acted — while the teammate was still mid-turn, actively writing that same path. The read landed in the window between the teammate starting its write and completing it, so the manager's conclusion ("nothing there yet") was stale the moment it was drawn. This recurred this session, and the leader independently cited the same already-recorded pattern when the analogous crossing happened to it.

## Why it happens

Agent-Teams teammate work is asynchronous: a teammate can be actively writing a file while the manager's own read of that same path returns the pre-write state. A single point-in-time read cannot distinguish "the teammate will never write this" from "the teammate is writing this right now, and I read half a step too early." The manager's instinct is to treat a `DONE` or a stable-looking `ls`/`Read` result as ground truth, but ground truth requires the WRITE to have actually landed — the read and the write are two independent events, not a request/response pair with a lock between them. This is the general form of the already-recorded pattern [[teammate-finalize-brief-crosses-with-in-progress-turn]] (sending a finalize brief right after a `DONE` crosses with the teammate's queued next action); this session shows the SAME underlying race manifesting on the manager's READ side, not only on the manager's WRITE (brief-sending) side — both are instances of trusting a single point-in-time observation of teammate state instead of confirming completion.

## Correct approach

Never conclude "no-op" or "unchanged" from a single read taken while a teammate's turn might still be in progress. Wait for the teammate's own status report (`DONE`, or an explicit idle notification) before treating its output as final, then re-verify the artifact on disk AFTER that report — files-as-truth, checked at the right time, not the first time. If a read must happen mid-turn for some other reason, treat its result as provisional and re-check once the teammate reports, rather than acting on the provisional read as if it were final.

## How to detect

Any point where the manager (or a lead agent coordinating another agent's work) draws a conclusion — "it hasn't written this yet," "this is still the old value," "no change happened" — from a read that was not preceded by a confirmed completion signal (a `DONE`, an idle notification) from the agent whose work is being checked. The tell in hindsight: the conclusion turns out wrong once the teammate's turn actually completes and the same path is re-read.

## Related

- [[teammate-finalize-brief-crosses-with-in-progress-turn]] — the sibling pattern on the manager's WRITE side (sending a brief too early); this file is the READ-side instance of the same underlying race
