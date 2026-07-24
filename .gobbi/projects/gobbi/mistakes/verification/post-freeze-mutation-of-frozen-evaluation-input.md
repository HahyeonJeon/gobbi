---
name: post-freeze-mutation-of-frozen-evaluation-input
description: A producer teammate edited an integration-log file after the manager stamped the freeze checksums and launched evaluators, because the freeze boundary was never communicated to the producer as an explicit write-lock.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [verification]
keywords: [production-freeze, checksum, write-lock, teammate-race, agent-teams]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
related: []
---

# Post-freeze mutation of a frozen evaluation input

## What happened

After the manager stamped the post-integration freeze checksums and launched both evaluators, the
producer teammate (leader) applied a one-line cosmetic refinement to `reconciliation-iter1.md`
(counts-line framing), failing the freeze checksum for that file. Root cause was crossed teammate
messages: the manager's re-apply instruction was based on a stale read, and the leader executed its "one
refinement" AFTER the freeze was already in effect — the leader was never explicitly told the freeze had
started.

## Why it happens

The freeze boundary was declared manager-side only (a checksum file was written) but never COMMUNICATED
to the producer teammate as an explicit write-lock message. Agent-Teams teammate messages are
asynchronous, so an edit instruction already in flight when the freeze is stamped creates a stale-read
window in which the producer keeps writing to a file the manager now treats as immutable evidence.

## Correct approach

The freeze declaration must include an explicit write-lock message to the producer ("no further edits
under `working/` until the loop verdict") sent BEFORE spawning evaluators — not merely a checksum file the
producer never sees. On a detected checksum drift: verify the primary evaluation target (the canonical
draft) is intact; if the delta is genuinely cosmetic and confined to a non-primary file, re-stamp the
checksum and log the drift explicitly; otherwise re-freeze and re-spawn the evaluators against the
corrected, truly-frozen state.

## How to detect

Any teammate edit instruction still in flight (sent but not yet acknowledged/applied) at the moment the
manager stamps a freeze checksum is the trigger condition. The symptom: a checksum mismatch on a file the
manager believed was frozen, discovered after evaluators have already started reading it.

## Related

- `skills/evaluation/mistakes.md#freeze-producer-artifact-before-evaluating` — a related skill-owned trap
  covering a producer's in-flight delta landing after dispatch (a moving-target artifact); this trap
  covers the missing write-lock COMMUNICATION step specifically.
- [[evaluator-spawned-with-team-addressable-name]] — a sibling evaluator-isolation trap from the same
  session
