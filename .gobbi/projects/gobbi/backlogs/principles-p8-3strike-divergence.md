---
name: principles-p8-3strike-divergence
description: Deliberate divergence — the 3-strike rule was removed from operational skills this session, but ratified Principle 8 still mandates 'stop after repeated failures' — decide whether to also revise P8 or accept the gap.
type: backlogs
scope: project
status: active
created: 2026-06-05
session: ca2231b3-9567-4cf9-b0d6-f9bd3e2e78ee
tags: [principles, guardrails, 3-strike, divergence]
priority: medium
disposition: open
---

# Deliberate divergence: 3-strike rule removed from skills but P8 still mandates it

## Context

This session (ca2231b3) removed the 3-strike rule entirely from 10 sites across 5 live docs (user decision — see `features/guardrails/decisions/2026-06-05-3strike-rule-removed-from-skills.md`). Principle 8 ("Fix the Root Cause, Not the Symptom") still contains:

> "Stop patching after repeated failures: if two or three fixes don't hold... rethink, or surface it to the user."

The user was shown this divergence and accepted it. The divergence is deliberate and documented, not silent.

## Open question

A future session must choose one of:

(a) **Revise P8** to drop the repeated-failures bullet entirely, keeping skills and principle consistent by removal. Risk: weakens P8's scope.

(b) **Re-add a lightweight pointer** in the skills grounded in P8 — e.g., a single sentence "Per P8, stop patching and rethink after two or three failed fixes." This keeps the discipline accessible without the old mechanistic 3-strike phrasing. Risk: reintroduces the discipline the user just removed.

(c) **Accept the gap permanently.** The operational skills no longer carry the mechanic; P8 still mandates the discipline at the principle level. Users who load principles have the guidance; skill-only readers do not.

## Status

Not urgent. The divergence is documented and intentional. Flagged so it is not rediscovered silently in a future session.
