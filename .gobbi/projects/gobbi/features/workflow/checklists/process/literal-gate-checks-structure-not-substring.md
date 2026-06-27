---
name: literal-gate-checks-structure-not-substring
description: Verification gates that check a structural property must target the relevant column or semantic context, not a body-wide literal substring
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [verification, process]
keywords: [literal-grep, false-fail, column-scoped, semantic-check, D2.2, D6.2, COD-STRUCT-1, COD-RISK-2]
author: claude
scenario: iter-artifact-snapshot-frozen-not-mutated
item_status: pending
anchor: literal-grep-gate-false-fails-legitimate-usage
implemented_in: null
---

# Verification gate must check structure or semantics, not body-wide literal substring

## What

When writing a pass/fail verification gate for a property that is expressed in a specific column or semantic context (e.g., "the decision column must not contain synthesis verbs"; "the eval prompt must not contain proposal content"), the gate must target that column or context — not perform a body-wide literal string search.

## Why

A body-wide literal grep false-fails when the checked term appears legitimately in a different context in the same file. This session produced two concrete instances:
- **D2.2 (COD-STRUCT-1 iter1):** a body-wide synthesis-verb grep (`grep -nEi 'blend|averag'`) over the Integration Log false-failed on "SELECT, never blend" — correct anti-synthesis prose in the `why` column, not a synthesis decision in the `decision` column.
- **D6.2 (COD-RISK-2 iter2):** a literal path-grep (`grep -rl 'working/proposals'`) over the eval prompt false-failed on `"do NOT read working/proposals/"` — a correct off-limits warning in the prompt, not leaked proposal content.

In both cases the grep cannot distinguish the property's target context from look-alike usage of the same string.

## Verification

New verification gates must pass this test before being added to a checklist or the verification frame: "Can the checked term appear legitimately in the same file for a different reason?" If YES → the gate must be column-scoped (e.g., `awk -F'|' '{print $4}'`) or classified semantically (manual read), not a body-wide grep.

## Status notes

The two known instances (D2.2 and D6.2) were fixed in iter2/iter3 of this session. Future checklist items that gate on string absence/presence must be reviewed against this criterion before being finalized.

## Related

- [[literal-grep-gate-false-fails-legitimate-usage]] — the mistake this checklist item implements
