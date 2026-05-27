---
name: structured-header-migration-behavior
description: Checklist — migration behavior when delegation prompts lack structured-header fields
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [structured-headers, migration, agents, session-json, observability, checklist]
---

# Structured-header migration behavior — existing prompts produce null fields until refreshed

## Context

Prompts that do not yet include the canonical structured headers (`Your phase: <X>`, `Your iteration: <n>`, `Your sub-step: <Y>`) will produce `null` values for `step / phase / iter` in `session.json.agents[]` until the next prompt-template refresh.

## Addressed by

The hook design specifies a migration paragraph: existing prompts that lack the headers will produce `null` for `step/phase/iter` in `agents[]` until the next prompt-template refresh. The null values are acceptable — the hook populates other fields from the result side (`agentId`, `usage.*`, `totalDurationMs`); `step/phase/iter` become populated once each delegation prompt template is updated.

## Checklist item for Execution

- [ ] After `delegation/SKILL.md` structured-header convention ships, add the migration paragraph exactly as specified.
- [ ] In the first post-merge session, verify `agents[]` entries that came from updated prompts show non-null `step` and `phase`; entries from legacy prompts show `null` — confirm this is expected and documented.
- [ ] Track prompt-template refresh as a follow-up task in the Execution checklist.

## Related

- `features/install-runtime/design/metadata-extraction-input-vs-result.md`
