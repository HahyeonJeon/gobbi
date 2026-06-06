---
name: 2026-06-05-3strike-rule-removed-from-skills
description: The 3-strike rule was removed entirely from the operational skills/agents (not repointed to P8), accepting a deliberate divergence from ratified Principle 8.
type: decisions
scope: feature
feature: guardrails
status: active
created: 2026-06-05
session: ca2231b3-9567-4cf9-b0d6-f9bd3e2e78ee
tags: [principles, 3-strike, guardrails]
decision_status: accepted
supersedes: null
superseded_by: null
---

# 3-strike rule removed from operational skills (session ca2231b3)

## Decision

The 3-strike rule is removed entirely from the operational skills and agent specs. It is NOT repointed to Principle 8. This creates a deliberate, accepted divergence: P8 ("Fix the Root Cause, Not the Symptom") still contains a "stop patching after repeated failures" mandate, but the live operational docs no longer carry the 3-strike mechanic.

## Sites removed (10 occurrences across 5 docs)

The executor performed a full repo grep before removal and confirmed the following live occurrences were eliminated:

- `skills/orchestration/SKILL.md` — 3-strike rule block under the Execution section
- `skills/delegation/SKILL.md` — 3-strike rule guidance in the delegation executor discipline
- `skills/execution/SKILL.md` — 3-strike rule as a hard stop gate
- `agents/executor.md` — 3-strike rule in the executor contract
- `agents/manager.md` — 3-strike rule in the manager operational discipline

Historical records (project memory: mistakes, decisions, plans) were NOT touched — point-in-time references to the 3-strike rule remain as history.

## Options considered

**Option A — Repoint to P8.** Replace each 3-strike occurrence with a pointer such as "Per P8, stop patching and rethink after repeated failures." Keeps the discipline present in skills at a lighter level.

**Option B — Leave at old P1.** Repoint the remaining refs to P1 (the principle that previously owned the 3-strike mechanic before redesign). Inconsistent with the redesign — P1 no longer owns it.

**Option C — Remove entirely.** Remove all live occurrences. The discipline survives only in P8 for agents that load principles. Skills are silent on the mechanic.

The user chose Option C after being shown the full blast radius (10 sites, 5 docs) and the P8 overlap.

## Consequences

- Skills and agent specs no longer carry the 3-strike mechanic as an operational rule.
- The BLOCKED status and its other triggers (genuine blocker, missing decision, contradictory requirement, out-of-scope dispatch) are retained unchanged.
- P8 still mandates "stop patching after repeated failures" at the principle level. Agents that load principles have the guidance; skill-only readers do not.
- The divergence is tracked in backlog [[principles-p8-3strike-divergence]] for future resolution.

## Related

- Backlog: `backlogs/principles-p8-3strike-divergence.md`
- Master redesign decision: `features/guardrails/decisions/2026-06-05-principles-redesign-14-to-8.md`
