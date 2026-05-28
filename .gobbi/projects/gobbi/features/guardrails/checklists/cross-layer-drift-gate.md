---
name: cross-layer-drift-gate
description: Implementation checklist — add a cross-layer consistency gate verifying hook script, settings.json, skill docs, and session schema stay synchronized.
type: checklists
scope: feature
feature: guardrails
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, settings-json, drift-gate, cross-layer, checklist]
---

# Cross-layer drift gate — hooks / settings / skills / session metadata need a single explicit gate

## What

Add a single explicit cross-layer consistency gate to the Planning / Execution checklist that verifies the hook script, `settings.json`, the skill docs, and the session schema stay synchronized:

- [ ] Planning: add a cross-layer gate row to the Execution checklist — after T1 + T3 land, run a 4-file consistency check:
  1. `grep -n 'post-tool-use-agents.sh' .claude/settings.json` — verifies both PostToolUse + PostToolUseFailure registrations point to the script
  2. `grep -n 'worktreePath' .claude/skills/orchestration/SKILL.md` — verifies row 5.5 description is present
  3. `grep -n 'Your phase:' .claude/skills/delegation/SKILL.md` — verifies structured-header section exists
  4. `jq '.hooks | keys' .claude/settings.json` — lists all registered hook events
- [ ] Execution evaluator: include a cross-layer drift check in the Consistency perspective evaluation.

## Why

A Risk-perspective evaluator finding from the guardrails Ideation raised this: the guardrails design requires whole-file scans of touched skill files after edits (per `mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md`). However, there is no single explicit cross-layer gate that checks alignment across: `.claude/hooks/post-tool-use-agents.sh`, `.claude/settings.json` (hook registration), `.claude/skills/orchestration/SKILL.md` (worktreePath row description), `.claude/skills/delegation/SKILL.md` (structured-header convention), and `session.template.json` (agents[] schema). These surfaces must stay synchronized; currently each is verified independently.

## Verification

The four `grep`/`jq` checks listed under What all pass after T1 + T3 land, and the Execution Consistency-perspective evaluation includes a cross-layer drift check. Concretely: `grep -n 'post-tool-use-agents.sh' .claude/settings.json` returns both registrations, `grep -n 'worktreePath' .claude/skills/orchestration/SKILL.md` returns row 5.5, `grep -n 'Your phase:' .claude/skills/delegation/SKILL.md` returns the structured-header section, and `jq '.hooks | keys' .claude/settings.json` enumerates the registered hook events.

## Status notes

Pending. A persistent automated drift detector (e.g., a `gobbi doctor` rule that checks hook registration alignment) is a follow-up beyond this gate. See `.gobbi/projects/gobbi/backlogs/codex-ci-integration-for-dual-system-eval.md` for related automation context.

## Related

- This gate was prompted by a Risk-perspective evaluator finding during the guardrails Ideation evaluation (provenance in that session's evaluation artifacts).
- `mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md` (the mistake this gate enforces)
