---
name: metadata-extraction-input-vs-result
description: Hook extracts agent metadata from two sides — input side (tool_input.model + prompt headers for step/phase/iter) and result side (toolUseResult for id/type/usage telemetry).
type: design
scope: feature
feature: install-runtime
status: locked
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, metadata, extraction, agents]
design-id: D-3-4
slug: metadata-extraction-input-vs-result
iter: 2
---

# Hybrid metadata extraction: input side vs result side (D-3-4)

## Decision

The hook stdin payload has TWO sides:

**Input side** (`tool_input.*`): the manager's delegation prompt + parameters.
- `tool_input.model` → `agents[].model`
- `tool_input.prompt` structured headers (`Your phase: <X>`, `Your iteration: <n>`, `Your sub-step: <Y>`) → `agents[].step`, `.phase`, `.iter`
- Regex: `^Your (phase|iteration|sub-step|step): (.+)$`

**Result side** (`tool_result.*` and transcript `toolUseResult.*`): subagent response + telemetry.
- `toolUseResult.agentId` → `agents[].id`
- `toolUseResult.agentType` → `agents[].type`
- `toolUseResult.usage.*` → `agents[].tokensUsed`
- `toolUseResult.totalDurationMs` → derived timing
- Consulted ONLY for output telemetry; never for input-side metadata.

**Convention codified in `delegation/SKILL.md`**: structured headers MUST appear in the first 10 lines of every delegation prompt. Migration note: existing prompts lacking headers produce `null` for `step/phase/iter` until the next prompt-template refresh.

## Rationale

`tool_input.model` is reliable; prompt-text parse works on every existing prompt (headers visible in empirical inspection of prior session transcript). Codification ensures future prompts stay extractable. There is no inconsistency between "step/phase/iter NOT in toolUseResult" (result side) and this design ("prompt-header parsing is sufficient on the input side") — these describe different sides of the payload.

## Anchored insights

Transcript inspection confirming step/phase/iter not in toolUseResult; input-side parse rationale; stdin payload empirical verification; first-iteration Codex consistency finding (prompted the input-vs-result split codification).

## Trade-offs considered

- JSON header comment block — rejected: more invasive
- Parse-only without codification — rejected: convention currently implicit; would break silently

## Validation

Evaluator Project perspective on `delegation/SKILL.md` codification; single-script verifier on header parsing; manual `grep -rn '^Your phase:' .claude/skills/orchestration/workflow/` returns expected hits after the delegation prompt codification ships.

## Implementation checklist anchor

Delegation prompt header codification in delegation/SKILL.md

## Source

`rawdata/draft-iter3.md:388-399` (D-3-4 narrative)
