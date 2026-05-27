---
name: skill-must-not-invent-json-field-paths-not-in-witnesses
description: Skills must verify all documented JSON payload field paths against the real hook script
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [hook, json-fields, witness, checklist, docs-sync, consistency]
---

# Skills must not invent JSON field paths that don't exist in the witness payload

## What

When a project skill documents hook payload fields, every field-path reference must be verified against the real hook script. No nested path may be documented unless the witness payload actually uses it.

## Why

`gobbi-hook-authoring/SKILL.md` originally described the SessionStart matcher as matched against `hook_event_name.source` — a nested path that does not exist. The real witnesses carry top-level `hook_event_name` and top-level `source` as separate fields (exported separately in `session-start.sh`). An invented nested path teaches readers a payload shape the runtime never produces, so a skill that documents fields must ground every path in the witness script rather than in an assumed schema.

## Verification

For any hook-documentation skill, before shipping ask: "does every documented payload field path correspond to a real field (top-level or genuinely nested) in the witness script?" After the fix here, a regression grep for the invented path confirms it is gone: `grep 'hook_event_name\.source'` → NONE.

## Status notes

Addressed — commit `5d2a7c6` replaced the invented nested path with the real top-level `source` field and clarified the distinction from `hook_event_name`. The regression grep returns no matches.
