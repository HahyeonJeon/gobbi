---
name: evaluator-independence-invariant
description: Adversarial scenario ensuring evaluator continuation and teammate-as-evaluator remain FORBIDDEN
type: scenarios
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [agents, evaluation, independence, adversarial, agent-teams]
---

# Evaluator Independence Invariant

**Category:** adversarial
**Coverage:** covered

## Situation

Any attempt to continue, share, or make a teammate of an evaluator. This is the single most important invariant in the continuation design — evaluator independence underlies dual-system anti-groupthink and producer/evaluator separation.

## Inputs

**A1:** An agent or manager attempts to create a teammate-evaluator (evaluator in the Agent Teams roster) or to `SendMessage`-continue an evaluator between iterations.
**A2 (teammate cross-talk):** A leader teammate and an executor teammate attempt to message each other directly via the Agent Teams mailbox, bypassing the manager.

## Expected behavior

**A1:** FORBIDDEN. The evaluator stays a fresh, independent plain-Task/Agent subagent. It is explicitly kept OUT of the team mailbox. Because teammates can message each other directly, a teammate-evaluator would be reachable by other teammates and potentially contaminable (which would corrupt the cross-system divergence signal). The rule must state this as a hard wall, not a discouraged default.

**A2:** FORBIDDEN by policy. All coordination flows through the manager. Non-evaluator teammates do NOT message each other. A shared task list may exist but is manager-owned. This preserves gobbi's manager-centralized judgment.

## Verification

- A1: grep `delegation/SKILL.md` for the evaluator FORBIDDEN row including the teammate prohibition ("evaluator may not be a teammate" or equivalent); confirm `evaluation/SKILL.md` independence text is unchanged (diff check).
- A2: grep the orchestration docs for the no-teammate-cross-talk policy (all coordination via the manager); confirm the team roster explicitly lists evaluator as a plain subagent (not a teammate).

## Related

- `features/agents/design/subagent-continuation-mechanism.md` — D8 (evaluator hard wall), D9 (roster/mailbox policy)
