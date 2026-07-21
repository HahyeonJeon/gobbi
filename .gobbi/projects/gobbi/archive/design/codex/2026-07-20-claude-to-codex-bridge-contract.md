---
name: claude-to-codex-bridge-contract
description: "Defines the explicit model and effort overrides for Claude-hosted Codex runs."
type: design
scope: feature
feature: workflow
status: retired
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, design]
keywords: [codex-exec, model-override, effort-override]
author: codex
related: [deterministic-codex-policy-authorities, validator-and-residual-guard-design]
archived_at: 2026-07-20
archive_reason: retired
---

# Claude-to-Codex bridge contract

## Problem
Bridge runs currently inherit host settings, so proposer and evaluator behavior can differ by machine.

## Scope
Cover every current proposer and evaluator invocation while preserving timeout, cwd, sandbox, writable-dir, stdin, output, PID, and files-as-truth controls.

## Approach
Every live bridge command includes `-m gpt-5.6-sol -c 'model_reasoning_effort="xhigh"'`. `codex/SKILL.md` owns high-level policy; `codex/delegation.md` owns exact invocations and gates; workflow evaluation points to them.

## Scenarios
Foreground and background launches, proposal and evaluation calls, timeouts, unsupported model access, and workflow pointer drift.

## Validation
Count five command blocks in `codex/SKILL.md` and four in `codex/delegation.md`; require the exact pair on each and no copied option block in workflow evaluation.

## Trade-offs
Explicit overrides reduce operator flexibility but remove hidden inheritance.

## Open issues
Fresh CLI help remains an Execution gate.

## Related
- [[explicit-bridge-overrides]] — the user decision rejecting host inheritance.
