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

## What

After the `delegation/SKILL.md` structured-header convention ships, the hook design's migration paragraph must be added exactly as specified, and the migration behavior must be verified in the first post-merge session: `agents[]` entries from updated prompts show non-null `step`/`phase`, while entries from legacy prompts show `null` — confirm this split is expected and documented. Track the prompt-template refresh as a follow-up task in the Execution checklist.

## Why

Delegation prompts that do not yet include the canonical structured headers (`Your phase: <X>`, `Your iteration: <n>`, `Your sub-step: <Y>`) produce `null` values for `step`/`phase`/`iter` in `session.json.agents[]` until each prompt template is refreshed. Those nulls are acceptable, not a bug: the hook still populates the other `agents[]` fields from the result side (`agentId`, `usage.*`, `totalDurationMs`), and `step`/`phase`/`iter` fill in once the prompt templates carry the headers. Documenting the migration paragraph prevents a future reader from mistaking the expected transitional nulls for a hook failure.

## Verification

In the first post-merge session, inspect `session.json.agents[]`: entries spawned from refreshed prompts must show non-null `step` and `phase`; entries from legacy prompts must show `null`. The presence of both, as documented, confirms the migration is behaving as designed.

## Status notes

Pending — the migration paragraph is added once the `delegation/SKILL.md` structured-header convention ships, and the verification runs in the first post-merge session. The prompt-template refresh is the follow-up that eventually eliminates the legacy-null entries.

## Related

- [`../design/metadata-extraction-input-vs-result.md`](../design/metadata-extraction-input-vs-result.md) — the design topic for which `agents[]` fields come from the prompt (input) side versus the transcript (result) side
