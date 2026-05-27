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
---

# Hybrid metadata extraction: input side vs result side

## Context

To populate `session.json.agents[]`, the hook needs both the manager's delegation metadata (model, step/phase/iteration) and the subagent's output telemetry (id, type, token usage, timing). An early evaluation finding flagged an apparent inconsistency: step/phase/iteration are not present in `toolUseResult`. Resolving it required separating where each piece of metadata actually lives in the hook payload.

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

Supporting evidence anchored at decision time: transcript inspection confirming step/phase/iteration are not in `toolUseResult`; the input-side parse rationale; empirical verification of the stdin payload; and a first-iteration Codex consistency finding that prompted codifying the input-vs-result split.

## Alternatives considered

- JSON header comment block — rejected: more invasive.
- Parse-only without codification — rejected: the convention would stay implicit and break silently.

## Consequences

- `delegation/SKILL.md` codifies that the structured headers (`Your phase:`, `Your iteration:`, `Your sub-step:`) MUST appear in the first 10 lines of every delegation prompt.
- Migration cost: existing prompts that lack the headers produce `null` for `step/phase/iter` until the next prompt-template refresh.
- Validation obligations: an evaluator Project-perspective review of the `delegation/SKILL.md` codification; a single-script verifier on the header parsing; and a `grep -rn '^Your phase:' .claude/skills/orchestration/workflow/` confirming the expected hits after the codification ships.

## Related

- `dual-hook-registration-resolver.md` — the hook that consumes both sides of the payload.
- `tool-use-id-correlation-key.md` — how the result side is correlated back to the input side.

## Source

The full design narrative is preserved in the project session journal `notes/2026-05-24-session-foundations-bundle-b.md` (the session that designed and shipped the PostToolUse hook architecture).
