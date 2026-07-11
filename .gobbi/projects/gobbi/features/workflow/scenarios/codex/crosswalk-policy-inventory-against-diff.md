---
name: crosswalk-policy-inventory-against-diff
description: "Crosswalk every Task 02 policy-inventory row against the fixed commit diff."
type: scenarios
scope: feature
feature: workflow
status: active
created: 2026-07-11
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, verification]
keywords: [policy-inventory, diff-crosswalk, task-02]
author: codex
---

# Crosswalk the policy inventory against the fixed diff

## Situation

An evaluator must prove Task 02 completeness from the Ideation form-covering per-site inventory,
not only from a residual token sweep or the executor's intended file list.

## Inputs

- Ideation rows 203-209 for the seven policy and workflow documents.
- Ideation validator row and assertion-family inventory for
  `scripts/check-codex-compatibility.sh`.
- Fixed commit `7d043fe41a7edfe8c66ef4c2bdd6854cf3deb379` and its parent.

## Expected behavior

The reviewer maps each of the seven document rows and the validator row to one of exactly eight
`M` paths, then verifies each row's required changes and preserve clauses. Extra, missing, added,
deleted, renamed, or mode-changed paths fail the scenario.

## Category

Adversarial completeness and scope verification.

## Coverage

RECORD performed the crosswalk and fixed-target git check. All eight rows matched and the finding
is addressed.

## Related

- [[policy-docs-and-validator-shipped]] - the task whose per-site inventory was checked.
