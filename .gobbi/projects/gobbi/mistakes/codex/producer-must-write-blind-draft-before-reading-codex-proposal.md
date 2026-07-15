---
name: producer-must-write-blind-draft-before-reading-codex-proposal
description: The Claude producer opened the frozen Codex proposal during Study before writing its own blind draft, breaking dual-system production independence.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-14
session: 6a9e0963-2ca1-4d07-83d3-1889aa16bcf4
tags: [codex, process]
keywords: [dual-system-production, blind-first, independence, proposer, producer, integration]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
related: [codex-proposer-must-be-source-read-only, dual-system-production-is-not-optional]
---

# The producer must write its blind draft before opening the Codex proposal

## What happened

During a dual-system PRODUCTION loop, the Claude producer (an executor compacting
`convention.md` + `typing.md`) opened the frozen `working/proposals/codex/draft-iter{n}.md`
during its Study phase, BEFORE writing its own STEP-1 blind draft. That is a blind-first
independence violation: the producer is supposed to generate its canonical draft without
seeing the Codex proposal, then selectively integrate the frozen proposal afterward. The
impact was bounded this time (the union self-diff compares against the pre-trim, not against
Codex, and the producer's independent audit still caught two conditions the Codex proposal
had dropped, so the dual EVALUATION independence held), but reading the peer first weakens
production-side independence and risks anchoring the "independent" draft on the peer.

## Why it happens

The proposal file already sits in the worktree when the producer starts, and Study naturally
reads everything available. Nothing physically gates the read: the producer can open the
proposal as easily as any other input, and a brief that says "integrate the Codex proposal"
without ordering the steps invites reading it up front.

## Correct approach

Write the blind draft FIRST, then open the proposal. The executor/producer brief must make
STEP-1 write-then-verify explicit and instruct the producer NOT to open
`working/proposals/codex/` until its own blind draft file exists on disk. Only after the
blind draft is written does the producer read the frozen proposal and selectively integrate.
(Enforced strictly in the later tasks of this session's briefs, and honored there.)

## How to detect

The producer's transcript shows a read of `working/proposals/codex/draft-iter{n}.md` earlier
than the write of its own `working/draft-iter{n}.md`. Tell: the "independent" draft echoes
the proposal's structure or wording. Order-check the two events; the blind-draft write must
precede the proposal read.

## Related

- [[codex-proposer-must-be-source-read-only]] — the mirror-image independence discipline on the Codex proposer side
- [[dual-system-production-is-not-optional]] — the dual-system production model this independence protects
