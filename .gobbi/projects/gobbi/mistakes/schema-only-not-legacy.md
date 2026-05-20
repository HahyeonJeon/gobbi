# Gotcha — Schema-only fields are not legacy by default

## Title

Schema-only fields are not legacy by default

## Priority

Medium

## What happened

During Item 3 (legacy code cleanup) ideation for gobbi-config finalization, the orchestrator surfaced `workflow.{step}.{discuss,evaluate}.{model,effort}` and `maxIterations` as deletion candidates because they are stored in `.gobbi/settings.json`, validated by AJV, returned by `resolveSettings`, but never read in production code. The orchestrator framed them as "schema-only / NOTE-3 dead fields" alongside genuinely deletable items like SKILL.md stale notes and T1/T3 historical lore.

## User feedback

> "I think you are misunderstanding something. The model/effort/maxIterations are very important fields for configuration of workflow. It's not legacy."

## Correct approach

Schema-only ≠ legacy. A field that exists in the schema but lacks a consumer means **the wiring is incomplete**, not that the field is dead. Before proposing deletion of any schema field, check the field's *intent* (README, design docs, NOTE entries, ideation history) — not just current call-site count. If the intent is "this field controls behavior X" but X is not wired yet, the fix is to wire X, not to delete the field.

For gobbi-config specifically: `model` / `effort` / `maxIterations` are user-facing knobs for workflow configuration that the user may rely on. Their absence of consumers reflects deferred Pass scope, not abandonment. The deletion question rephrased correctly: "should we wire these now, or leave the deferred Pass marker?" — never "should we delete them?"
