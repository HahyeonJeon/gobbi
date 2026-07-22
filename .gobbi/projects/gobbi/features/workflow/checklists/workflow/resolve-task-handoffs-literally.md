---
name: resolve-task-handoffs-literally
description: "Give every produced state one literal name reused unchanged by every consuming task."
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, verification]
keywords: [task-handoff, literal-name, inputs, outputs]
author: codex
scenario: enumerate-every-live-policy-site
item_status: implemented
anchor: novel
implemented_in: deterministic-codex-model-policy
---

# Resolve task handoffs literally

## What

Use `native-defaults-and-settings-state`, `current-policy-and-validator-state`, and `compatibility-self-test-interface` unchanged between upstream task outputs and downstream task inputs.

## Why

The first plan iteration used paraphrased state descriptions. A fresh executor could not mechanically match upstream artifacts to downstream inputs.

## Verification

Compare every upstream `outputs` value with downstream `inputs`; each handoff name must match byte-for-byte.

## Status notes

This root combines Claude `F-CONS-1`, Codex `CDEX-PLAN-I1-CONS-001`, and the handoff portion of `CDEX-PLAN-I1-OVERALL-005`. Both systems found it addressed in the accepted third iteration, so the current checklist state is implemented.

## Related

- [[deterministic-codex-model-policy]] - the plan defining the literal handoffs.
