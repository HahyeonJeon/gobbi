---
name: codex-side-prompts-need-skill-load-directives
description: "Opposite-system draft, cross-review, and evaluation prompts must carry complete Gobbi load directives so both systems apply the same canonical procedure."
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-01
session: 0dc5cf75-54c5-4b52-82fa-b18750bdaade
tags: [codex, evaluation, process]
keywords: [dual-system, delegation, skill-load-directives, codex-prompts]
author: claude
priority: high
project-scope: true
shipped_in: null
---
# Peer-operation prompts need complete load directives

## Context

Every opposite-system draft, reciprocal cross-review, and evaluation operation starts as a stateless command-line process. It receives no inherited Gobbi skill context, so the operation contract must name the authoritative skills, project rules, mistakes, and complete artifact inputs it must read.

## Gap

A schema-valid response can still follow the wrong procedure when its prompt carries only output fields. Draft contributors can miss scope or domain rules, cross-reviewers can critique against an invented standard, and evaluators can omit the canonical evaluation method.

Independence means a draft does not see the peer draft before freeze and an evaluator does not see the other evaluator's report. It does not mean withholding the shared project contract.

## Required change

Give every peer operation an ordered load-directives section:

- common: project instructions, principles, and relevant active mistakes;
- draft: the productive-step skill, locked scope, required research, and neutral creation contract;
- cross-review: the review contract plus the complete frozen peer draft;
- evaluation: the evaluation owner, step-specific evidence, complete creation package, and verification artifacts.

Each invocation remains ephemeral and read-only, receives complete inputs, and returns artifact-specific schema-valid JSON. The active-runtime assistant validates and stores the Markdown through the record-owned command.

## Verification

Fixtures for both runtime directions prove that every operation receives the ordered reads, correct system/step/iteration identity, complete required inputs, and no forbidden early peer or evaluator output. Malformed or incomplete responses halt without a stored artifact.

## Related

- [[dual-system-work-is-mandatory]] — peer rigor is part of the mandatory workflow.
