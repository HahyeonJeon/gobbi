---
name: line-count-cannot-confirm-write-completion
description: A line count can match an intermediate write state and cannot prove that a producer's change is absent or complete.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-25
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [verification, process]
keywords: [read-write-race, line-count, fingerprint, producer]
author: codex
priority: high
domain: verification
supersedes: teammate-finalize-read-crosses-in-progress-write
superseded_by: null
---

# A line count cannot confirm write completion

## What happened

Three manager reads crossed an in-progress write. A plausible line count and absent tokens were
reported as proof that the edit had not landed, and twice the producer was nearly told to reapply
already-complete work.

## Why it happens

A line count is a weak fingerprint. A multi-stage write can pass through an intermediate state
whose count resembles the preimage, so one observation cannot distinguish no write from a write
in progress.

## Correct approach

Use content hashes and modification time, then reread after the producer's handoff. Require a
stable fingerprint across two observations before declaring bytes absent or final. When disk
evidence contradicts a manager observation, reproduce the manager claim before issuing a rewrite.

## How to detect

A producer disputes a manager's count or token observation, the writer may still be active, or a
reapply instruction is based on one point-in-time read.

## Related

- [[teammate-finalize-read-crosses-in-progress-write]] — the narrower read-race predecessor preserved in archive.
