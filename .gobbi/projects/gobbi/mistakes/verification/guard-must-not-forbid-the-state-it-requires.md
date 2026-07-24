---
name: guard-must-not-forbid-the-state-it-requires
description: A self-verification gate that forbids the state its own task must produce is unexecutable — check both ends, at HEAD and on the post-task state, not just at HEAD.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process, verification]
keywords: [self-contradictory-gate, forbid-required-state, two-ended-proof, proximity-sweep]
author: claude
priority: high
domain: verification
---

# A guard must not forbid the state its own task requires it to reach

## What happened

Planning iter 5's proximity-regex sweep (Family-P) forbade any moved-content name appearing within
240 characters of a path reference across a shared corpus. Because "specialist phase load" was one of
the forbidden names and the specialist-load table cells must KEEP their SOP reference after the
migration, the sweep forbade the EXACT state task 09 (the consumer-migration task) was required to
produce. Tasks 09, 01, and 08 could therefore never exit 0 — the plan FAILed the loop at the iteration
cap with two Critical self-contradictions, both later reproduced by execution rather than argued.

## Why it happens

A verification gate is usually authored and tested against the CURRENT (pre-task) state — "does the
gate correctly fire at HEAD, before the task runs?" That question alone cannot catch a gate whose
forbidden pattern also excludes the LEGITIMATE post-task state the task exists to produce. A regex- or
proximity-based sweep is especially prone to this: a single shared pattern applied across a whole
corpus cannot distinguish "this occurrence is the defect I'm hunting" from "this occurrence is the
correct end state a different part of the same corpus must reach." The gate reads as stricter the more
cases it excludes, so tightening it in response to a REVISE finding can silently walk it into
forbidding the very target state.

## How to recognize it

Any self-verification gate authored for a migration, refactor, or state-transition task, where the
gate's PASS condition was checked only against the state at HEAD (before the task) and not
independently checked against the state the task is REQUIRED to reach afterward. The concrete signal:
the plan or task narrative states an intended post-task condition (e.g., "the specialist-load table
still references the SOP") that the SAME gate's forbidden-pattern would also match if you traced it
through by hand. A gate that REVISEs repeatedly on guard-mechanics complexity (tightened windows, new
exception families) without ever being run against the actual post-task state is a strong warning
sign — the tightening may be walking toward exactly this contradiction.

## Corrected approach

Prove a self-verification gate at BOTH ends, not one: (1) it FAILS at HEAD (the pre-task state, before
the fix) — the standard self-failing discipline; AND (2) it PASSES on the state the task is MANDATED
to produce — build the actual post-task state (in a scratch tree if needed) and run the identical gate
against it, confirming exit 0. The iter-6 replacement for Family-P did exactly this: a 13-row
enumerated per-consumer checklist, each row scoped to its own file with its own `required`/`forbidden`
pair, proven to exit 1 at HEAD (20 failures across 9 files) AND exit 0 on the mandated post-state. Do
NOT resolve a forbid/require contradiction by loosening the forbid pattern with a special-cased
exception — instead, make the state the task must reach an explicit REQUIREMENT row (a positive
assertion for what must survive), separate from the forbid rows that catch genuine leftovers. A
per-row, per-consumer structure with two-ended proof cannot self-contradict the way a single
shared-corpus pattern can.

## Related

- [[repeated-revise-on-one-axis-means-wrong-scope-model]] — the companion process trap: four
  consecutive REVISEs on this same guard-mechanics axis were the signal that the sweep MODEL, not just
  its tuning, was wrong
- `mistakes/verification/step-back-after-repeated-fixes-on-one-axis.md` — the pre-existing project
  trap this session's iter-5 FAIL is a fresh, concrete instance of
- `mistakes/verification/guard-revises-twice-means-scope-model-wrong.md` — the pre-existing project
  trap naming the same repeated-REVISE-on-one-axis signature
