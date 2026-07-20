---
name: producer-must-write-blind-draft-before-reading-codex-proposal
description: One contributor saw the peer draft before freezing its own, destroying the independence required by dual-system WORK.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-14
session: 6a9e0963-2ca1-4d07-83d3-1889aa16bcf4
tags: [codex, process]
keywords: [dual-system-work, independent-draft, freeze-order, cross-review, package-validation]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
related: [codex-proposer-must-be-source-read-only, dual-system-production-is-not-optional]
---

# Freeze each independent draft before any cross-system read

## What happened

During a historical dual-system creation loop, the Claude contributor opened the Codex draft before finishing its own. The later artifact still contained useful differences, but the ordering made Claude's work vulnerable to anchoring and removed proof that the drafts were independently generated.

## Why it happens

The peer artifact was visible before both drafts reached the freeze barrier. A brief that asks for later synthesis without an explicit independence boundary invites a contributor to treat the peer's structure and conclusions as ordinary study inputs.

## Correct approach

Give Claude and Codex the same neutral contract and isolate their operations. Each returns a system-labeled draft. The active-runtime assistant validates and stores each response through the record command. Do not give either contributor the other draft until both files under `working/iteration-{n}/drafts/` are complete, frozen, and validated.

Only after that barrier may Claude review the frozen Codex draft and Codex review the frozen Claude draft. The dual-WORK validator must reject missing, mislabeled, stale-iteration, same-author, extra, or incorrectly ordered artifacts before synthesis.

## How to detect

The package cannot prove both drafts froze before either cross-review, or one independent draft imports peer-specific structure, wording, or conclusions that were absent from the neutral contract. Treat an unverifiable freeze order as a blocked WORK package; do not rely on a captured transcript to repair provenance later.

## Related

- [[codex-proposer-must-be-source-read-only]] — the peer process must also be read-only and unable to alter the shared inputs.
- [[dual-system-production-is-not-optional]] — the mandatory dual-system WORK contract this independence protects.
