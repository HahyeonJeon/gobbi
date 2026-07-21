---
name: wrapup-guard-gate-unsatisfiable-with-preexisting-failures
description: Wrap-up's "all post-promotion guards must exit 0" gate is unsatisfiable when the memory tree carries pre-existing unrelated guard failures; it has no "no-new-failures-vs-baseline" escape and no review-only carve-out.
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [verification, docs-sync]
keywords: [wrap-up, stage-3, green-check, all-guards-exit-0, baseline, check-markdown-links, check-residual-vocab, dual-system-divergence]
author: claude
priority: medium
project-scope: true
shipped_in: null
---
# Scope Wrap-up verification to the frozen promotion manifest

## Context

Wrap-up evaluates an actual post-promotion worktree. Its proof already contains a complete mutation manifest, whole-file destination preimages, changed-path receipts, prior-staging hashes, and the resolved handoff.

## Gap

A repository-wide requirement that every unrelated standing check be green can make a correct, isolated promotion impossible to close. It also fails to prove the property Wrap-up actually owns: that every manifest row produced its expected result and no unmanifested path changed.

## Required change

Build the Wrap-up verification gate from owner-declared scopes and the frozen manifest:

- recheck every source, destination, and exact carrier preimage immediately before apply;
- reconcile every actual changed path to exactly one manifest row;
- run the Memory validator over the live tree and explicitly over every new archive record;
- run the scoped Markdown-link validator over every changed Markdown file and authorized carrier;
- run any other current owner-provided validator whose declared scope includes a changed path;
- give both fresh evaluators the actual post-promotion tree, receipts, validator evidence, and handoff.

An unrelated pre-existing failure remains visible as repository evidence, but it neither substitutes for changed-path verification nor expands this promotion's mutation authority. A newly relevant owner check is added to the next frozen manifest iteration, not patched outside it.

## Verification

Fixtures cover clean PASS with empty staging, a changed preimage, an unmanifested path, a scoped validator failure, a pre-existing unrelated failure, and evaluator inspection of the actual resulting tree.

## Related

- [[preexisting-broken-markdown-links]] — prior evidence that a global red gate can be unrelated to one promotion.
