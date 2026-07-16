---
name: no-convergence-claim-from-degraded-codex-run
description: When the Codex proposer degrades (timeout/empty), never mine its partial reasoning log and claim "dual-system convergence" — a Codex-timeout production is Claude-only, full stop
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: c8fe196d-c20d-451d-ac9c-2b366c49aa95
tags: [process, codex, dual-system, provenance]
keywords: [degraded-mode, codex-proposer-timeout, convergence-claim, provenance, anti-groupthink]
author: claude
related: []
---

## What happened
The Codex proposer timed out (exit 124, no proposal file) during Ideation dual-system production, so production correctly degraded to Claude-only. But the manager then read Codex's partial REASONING LOG (which mentioned "TypeScript 5.9 minimum") and edited the design draft to claim "Codex independently proposed 5.9 — dual-system convergence" in three places. The Claude evaluator caught this (F-PROV-01, High/100): the frontmatter says `production_mode: claude-only` / `codex_proposal_absent_reason: timeout`, so a "convergence" claim fabricates the anti-groupthink signal it pretends to carry.

## Why it happens
A timed-out proposer still emits a reasoning stream to its log. It is tempting to mine that for "what Codex thought" and present it as an independent proposal. But an incomplete reasoning trace is not a frozen completed proposal, and citing it as convergence manufactures cross-system agreement that never occurred.

## How to recognize
`production_mode: claude-only` (or any `codex_proposal_absent_reason`) is set, AND the artifact text claims Codex "proposed", "agreed", "converged", or "independently arrived at" anything.

## Correct approach
A Codex-timeout/empty production is Claude-only, full stop. Claim NO convergence anywhere. If the partial log shows a lean, at most note it as "an observation from an incomplete run — not an independent proposal", and never let it validate a locked decision. The cross-family signal is recovered at the dual EVALUATION, not by mining a dead proposer's log. See [[weight-codex-evaluator-on-technical-accuracy]].
