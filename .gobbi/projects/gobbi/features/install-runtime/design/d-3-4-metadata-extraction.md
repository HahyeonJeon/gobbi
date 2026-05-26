---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
feature: install-runtime
design-id: D-3-4
slug: d-3-4-metadata-extraction
status: locked
iter: 2
---

# D-3-4 — Hybrid metadata extraction: input side vs result side

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

T3-I-3 + T3-DQ-4: `tool_input.model` is reliable; prompt-text parse works on every existing prompt (headers visible in empirical inspection of prior session transcript). Codification ensures future prompts stay extractable. There is no inconsistency between T3-I-3 ("step/phase/iter NOT in toolUseResult") and D-3-4 ("prompt-header parsing is sufficient") — T3-I-3 describes the RESULT side; D-3-4 extracts from the INPUT side.

## Anchored insights

T3-I-3, T3-DQ-4, T3-E-2, iter1 COD-CONS.

## Trade-offs considered

- JSON header comment block — rejected: more invasive
- Parse-only without codification — rejected: convention currently implicit; would break silently

## Validation

Evaluator Project perspective on `delegation/SKILL.md` codification; single-script verifier on header parsing; manual `grep -rn '^Your phase:' .claude/skills/orchestration/workflow/` returns expected hits after T3-I-T3.e ships.

## Implementation checklist anchor

T3-I-T3.e

## Source

`rawdata/draft-iter3.md:388-399` (D-3-4 narrative)
