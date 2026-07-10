---
name: api-weekly-limit-degraded-mode-integration
description: A Claude producer hitting the Anthropic weekly limit mid-run does not break dual-system independence, because both drafts were already frozen blind.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-08
session: 33de02b8-4dff-4768-bafa-c1f53ae81890
tags: [codex, process]
keywords: [weekly-limit, degraded-mode, dual-system, api-failure, manager-integration]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Manager-integrated recovery preserves dual-system independence under an API weekly-limit hit

## Insight

When a Claude producer hits the Anthropic weekly usage limit mid-run, the manager can integrate
the two already-frozen drafts (the Claude producer's draft and the independently-generated Codex
proposal) rather than treating the run as a failed dual-system pass. Dual-system independence
survives because both drafts were generated blind, before the failure — the manager's later
integration step does not compromise that independence, it just moves who performs the final
selection.

## Context

During this session, the Claude producer hit the Anthropic weekly usage limit mid-run on one
loop. The Codex proposer had already produced its independent proposal on a separate usage budget
and was unaffected. Rather than discarding the loop or falling back to a fully manual single-system
pass, the manager took over the selective-integration step normally performed by the Claude
producer — reading both frozen drafts and selecting the stronger element from each, the same
selection discipline the producer itself would apply.

## Reason

Without this pattern, an API-limit hit mid-loop looks like it forces a choice between abandoning
dual-system production for that loop (losing the anti-groupthink value already captured in the
Codex proposal) or waiting out the limit (losing session time). Recognizing that the two drafts
were already generated independently and frozen means the limit hit is a manager-integration
problem, not an independence problem — the value already captured is not lost.

## How

When a producer's usage limit is hit mid-run: (1) confirm both the producer's draft and the
proposer's proposal are frozen (no further writes expected from either); (2) have the manager
perform the selective-integration step directly — read both, select the stronger element per
finding/section, log the integration decisions the same way the producer's Integration Log would;
(3) do not silently re-run the producer from scratch once the limit clears mid-session unless the
frozen draft is actually incomplete.

## Counter-cases

This does NOT apply if the producer's draft was incomplete or not yet frozen when the limit hit —
an unfinished draft is not a valid input to integration, and the loop must wait or restart instead
of integrating a partial artifact. It also does not apply to the Codex proposer's own creation-time
failures (an absent/empty/timed-out Codex proposal) — that is the existing degraded-mode path
(`production_mode: claude-only`), a different failure with a different label.
