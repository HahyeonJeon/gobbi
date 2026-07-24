---
name: verbatim-token-invariant-exceptions
description: The plan's every-required-token-verbatim-in-traces-to claim is now stated with its three real exceptions instead of asserted as universally true
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, docs-sync]
keywords: [f3-aesth-01, verbatim-token-invariant, phase-results, pass-condition, self-descriptive-claim]
author: claude
scenario: plan-aesth-self-description-accuracy
item_status: implemented
anchor: novel
implemented_in: null
---

# The verbatim-token invariant now names its three real exceptions

## What

The plan's claim "every required gate token is named verbatim in its own task's `traces-to` quotation" must be
literally true, or scoped to state where it is not.

## Why

At iter2 the claim was false in three places — the gate greps a literal spelling the destination file actually
uses (`phase-results` in T5/T8; `pass condition` in T7) while the Idea names the concept differently ("phase
docs" / "phase-close hooks"; MIG-5 spells it `pass-condition` while `checklist/SKILL.md` uses the spaced form in
all 6 occurrences) — an overstated self-description (`F2-AESTH-01`, Medium/100).

## Verification

The invariant is now stated with its three named exceptions, and for each exception the owning task's `verifies:`
names the exact literal the gate greps, so a fresh executor derives the requirement from its own brief rather
than meeting it first as an unexplained grep failure. Verified `checklist/SKILL.md` uses the spaced "pass
condition" form in all 6 live occurrences (0 hyphenated) — the gate spelling is correct, the invariant's
overstatement was the defect, not the gate.

## Status notes

Resolved. This is a self-description-accuracy fix, not a behavior change to any verification gate.

## Related

- [[iter-heading-vs-stable-filename]] — the sibling self-description-accuracy fix in the same finding family
