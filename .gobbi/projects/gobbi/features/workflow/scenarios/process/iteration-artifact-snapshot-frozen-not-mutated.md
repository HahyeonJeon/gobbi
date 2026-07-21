---
name: iteration-artifact-snapshot-frozen-not-mutated
description: A prior iteration directory is immutable; every material revision receives a complete new WORK and EVALUATION directory.
type: scenarios
scope: feature
feature: workflow
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [process, verification]
keywords: [iteration-snapshot, freeze-discipline, dual-system-work, material-revision]
author: claude
---

# Each iteration is a frozen snapshot, never mutated

**Category:** failure-mode
**Coverage:** covered

## Situation

A user approves a material revision after iteration 1 EVALUATION. The author edits a file in `working/iteration-1/` or `evaluation/iteration-1/` instead of starting iteration 2. The original subject disappears, evaluator evidence points at changed bytes, and the session can no longer prove what each report reviewed.

## Inputs

- A complete prior `working/iteration-{n-1}/` and `evaluation/iteration-{n-1}/` package.
- A user-approved finding-disposition batch requiring material change.
- The intent to create iteration `{n}`.

## Expected behavior

The state machine advances to iteration `{n}` only after the approved disposition gate. The new directory receives two independent drafts, two reciprocal cross-reviews, a synthesis, resolved open decisions, and two fresh complete evaluation reports. Every file in each earlier `working/iteration-*` and `evaluation/iteration-*` directory remains byte-for-byte unchanged. There is no frontmatter exception.

## Verification

Hash the complete prior iteration directories before revision and compare them afterward; every digest is unchanged. Verify the new `working/iteration-{n}/` and `evaluation/iteration-{n}/` package with the dual-WORK and evaluation validators and confirm it uses fresh system identities and a new subject digest.

## Related

- [[iteration-artifact-edited-in-place-destroys-snapshot]] — the mistake this scenario covers
