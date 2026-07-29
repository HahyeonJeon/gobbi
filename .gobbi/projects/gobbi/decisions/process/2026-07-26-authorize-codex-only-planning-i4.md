---
name: authorize-codex-only-planning-i4
description: Record the user's narrowly scoped Claude-absence waiver for Planning iteration 4.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [planning, process]
keywords: [react-pr-369, planning-iteration-4, claude-absence, waiver]
author: user
supersedes: null
superseded_by: null
---

# Authorize Codex-only Planning iteration 4

## Context

At `Planning / DISCUSSION / iteration 4 / task null`, the user selected the fast compliant path. Its stated effect was to approve exact Codex-only waivers for Ideation iteration 3 and Planning iteration 4, make only the cold-use acceptance amendment, then implement, evaluate, merge, and clean up.

## Decision

The exact waiver is:

> Claude absent Planning iteration 4.

It applies only to Claude's absence during Planning iteration 4. It permits Codex-only continuation for that named step and iteration after the revised Ideation contract passes.

## Rationale

Planning iteration 4 is the authorized pass that must resolve `CODEX-USAGE-001`, `CODEX-CONSISTENCY-001`, and the narrow amended acceptance contract before Execution.

## Alternatives considered

- Reusing the Planning iteration 3 waiver was rejected because waivers are step-and-iteration specific.
- Moving directly to Execution was rejected because Planning iteration 3 ended `REVISE`.
- Fabricating missing Claude evidence was rejected because absence is not evidence.

## Consequences

No Claude draft, cross-review, evaluator report, cross-system agreement, technical result, or PASS is created by this waiver. It grants no merge, publication, branch deletion, or worktree cleanup authority.

