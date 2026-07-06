---
name: markdown-link-guard-anchor-fragment-coverage-unconfirmed
description: iter1 Claude finding F-RISK-02 — check-markdown-links.sh may validate only file targets, not #anchor fragments; anchor correctness is verified by hand, not mechanically
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [ideation, docs-sync]
keywords: [f-risk-02, check-markdown-links, anchor-fragment, d1-002]
author: claude
related: [d1-002-canonical-pointer-replaces-drifted-routing-table]
---

# `check-markdown-links.sh` anchor-fragment resolution is assumed, not confirmed (F-RISK-02)

## Context

D1-002's validation plan states that `check-markdown-links.sh` will confirm "the canonical-table link and
the preserved inbound anchor resolve." This assumes the guard validates the `#anchor` FRAGMENT of a link
target, not only that the target FILE exists. If the guard only checks file-level resolution, the
anchor-preservation guarantee (that `#routing-findings-to-record` still points at a real heading after the
D1-002/D3-002 edits) is a manual verification, not a mechanical one.

## Decision

Record this as a low-severity, accepted assumption. Execution should confirm whether
`check-markdown-links.sh` resolves fragments before relying on it as the sole gate for anchor preservation;
if it does not, add an explicit manual anchor check to the D1-002/D3-002 validation step.

## Rationale

The underlying correctness is not at risk in this session — both the D1-002 heading-unchanged constraint and
the D3-002 co-location note were verified BY HAND during Ideation (the anchor was confirmed live-resolving
against the current worktree). The gap is only in how much of that assurance carries forward automatically
versus how much depends on a human re-checking after every future edit to these docs.

## Alternatives considered

- **Assume the guard checks fragments and proceed without further verification.** Rejected — silently
  assuming automated coverage that may not exist would understate the actual verification burden Execution
  and future editors carry.
- **Read the guard script now to settle the question definitively.** Deferred to Execution — reading and
  potentially patching the guard script is adjacent tooling work, and the manual verification already
  performed during Ideation is sufficient for THIS session's correctness; settling the guard's exact
  behavior is appropriately an Execution-time task alongside the actual doc edits.

## Consequences

Execution's validation step for D1-002 and D3-002 should explicitly re-verify
`#routing-findings-to-record` resolves after the edits land, regardless of what `check-markdown-links.sh`
reports — treating the guard's fragment coverage as unconfirmed until checked.

## Related

- [[d1-002-canonical-pointer-replaces-drifted-routing-table]] — the design this risk applies to
