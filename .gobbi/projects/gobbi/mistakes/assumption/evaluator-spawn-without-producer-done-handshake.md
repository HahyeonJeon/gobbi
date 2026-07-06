---
name: evaluator-spawn-without-producer-done-handshake
description: The manager froze the artifact and spawned dual evaluators before an explicit producer STATUS DONE, racing edits with the ideation leader
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [process]
keywords: [freeze-before-evaluate, done-handshake, idle-notification, two-writers-race, ideation-leader]
author: claude
priority: high
domain: process
---

# Manager froze the artifact and spawned evaluators without an explicit producer DONE handshake (moment-of-capture, iter1)

## What happened

The manager spawned the dual EVALUATION evaluators before the producer (the `ideation-leader` teammate) had
returned an explicit `STATUS: DONE` for the finalize pass. The leader had sent a premature `idle_notification`
(available), then RESUMED editing `working/draft-iter1.md` to clean up L-vs-S fork remnants. Meanwhile the
manager, reading the idle notification as "finalize not done" (the draft still showed `PROPOSED` markers),
applied the lock-marker edits itself. Two writers raced on one file. The manager then "froze" the draft and
spawned evaluators based on its own edits — violating the freeze-before-EVALUATION invariant, since the draft
had changed at 14:04 while the evaluators had been reading it since ~14:00.

## Why it happens

Two coupled root causes: (1) **no DONE handshake gate** — the freeze was gated on the manager's own judgment
("the file looks locked to me") plus a teammate `idle_notification`, NOT on an explicit producer
`STATUS: DONE` for the finalize task; an `idle_notification` is NOT a DONE signal — a teammate can go idle
mid-task and resume. (2) **two writers on one artifact** — seeing stale `PROPOSED` markers, the manager took
over editing the producer-owned draft instead of re-dispatching the producer or confirming ownership first.

## Correct approach

Gate the freeze on an explicit producer `STATUS: DONE` for the finalize task before spawning evaluators.
Treat `idle_notification` as "available for instruction," never as task completion. Enforce one writer per
artifact at a time: if the manager must record locked user-decisions into a producer-owned draft, either
(a) do it, then tell the producer the draft is now manager-owned/frozen (no further producer edits), or
(b) delegate the marker update to the producer and wait for its DONE — never both concurrently. Impact this
time was low: the racing edits were cosmetic (stale fork-prose cleanup); the locked design content never
changed, so the evaluation remained valid — but the invariant violation is the mistake worth recording
regardless of outcome.

## How to detect

About to spawn evaluators, but the only "done" signal available is a teammate idle notification or the
manager's own read of the artifact — with no explicit producer `STATUS: DONE` for the exact finalize task.
Or: the manager is itself editing a producer-owned canonical artifact (`draft-iter{n}.md`) — a smell that
ownership is ambiguous.

## Related

Sibling trap (skill-surface, not a memory-tier `[[slug]]` link): `skills/evaluation/mistakes.md#freeze-producer-artifact-before-evaluating` — that trap covers a producer's in-flight DELTA landing after dispatch (a moving-target artifact); this trap covers the DONE-handshake gate itself (idle_notification misread as done) plus the two-writers-on-one-file antipattern — related but distinct failure modes in the same freeze-before-evaluate discipline.
