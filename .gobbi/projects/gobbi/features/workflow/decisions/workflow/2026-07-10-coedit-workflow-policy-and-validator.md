---
name: coedit-workflow-policy-and-validator
description: "Edit workflow evaluation prose and its exact compatibility assertions in one task."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, docs-sync]
keywords: [same-task, pointer-guard, assertion-family]
author: codex
---

# Co-edit workflow policy and validator

## Context
The workflow evaluator wording and compatibility assertions are string-coupled.

## Decision
Planning assigns both edits to one task and runs the pointer guard and compatibility script together.

## Rationale
Editing either side alone creates a known intermediate failure and increases missed-co-touch risk.

## Alternatives considered
Separate tasks were rejected because their only stable boundary is the joint guard result.

## Consequences
This remains one of two Medium Planning inputs after Ideation PASS.

## Related
- [[pair-validator-assertions-with-policy-edits]] — the broader addressed root finding.
