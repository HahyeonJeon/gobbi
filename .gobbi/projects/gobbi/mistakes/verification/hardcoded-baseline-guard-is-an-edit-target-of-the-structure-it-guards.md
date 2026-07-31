---
name: hardcoded-baseline-guard-is-an-edit-target-of-the-structure-it-guards
description: A guard that hardcodes its expected baseline is a third copy of the spec — any change to the guarded structure must also edit the guard.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-25
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [verification, process]
keywords: [drift-gate, hardcoded-baseline, scaffold, record-map, expected-subtree, task-map]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
---

# A guard with a hardcoded expected baseline is an edit target of any change to the structure it guards

## What happened

Planning modeled the session-record-shape change (adding the `working/proposals/codex/` slot) as a drift-gated **pair** — `scaffold-session-dir.sh` (creates the dir) + `record-map.md` (documents it) — with `verify-record-map.sh --check` as the *gate* that verifies the pair. The premise was that the gate derives its expectation from `record-map.md`. It does not: `verify-record-map.sh` has a **hardcoded** `expected_subtree()` baseline (an in-script `dirs=(...)` array) that lists `working/research` but nothing else. So the moment the scaffold created the new dir, the gate diffed the scaffold output against its stale hardcoded baseline and went red — and would stay red for every subsequent session and CI run. The executor (correctly) hit BLOCKED: it could not commit with a red mandatory gate, and the fix lived in a file outside its contracted scope.

## Why it happens

A drift gate that hardcodes its expectation is not a neutral verifier of the structure — it is a **third copy of the spec**. Any change to the guarded structure must update all copies: the producer (scaffold), the human-readable doc (record-map), AND the guard's own hardcoded baseline. The plan, the former Preparation readiness audit, and both Planning evaluators treated the guard as a pure verifier and under-counted the file set by one. The assumption "the gate reads the doc" was never verified against the gate's source.

## Correct approach

Enumerate the guard's own baseline as a member of the change's file set whenever the change alters the guarded structure. For this feature: the drift-gated unit is THREE files (scaffold + record-map + `verify-record-map.sh` baseline), not two. Planning task construction must read the guard's source to classify it (derives-from-artifact vs hardcoded-baseline) before declaring it "the gate, not a target." Where feasible, prefer guards that derive expectation from the artifact (no third copy to drift); where a hardcoded baseline is unavoidable, treat it as part of the structure's spec.

## How to detect

When a change touches a structure that a guard/linter/test checks, OPEN THE GUARD and ask: does it derive its expectation from the artifact, or does it hardcode it? If hardcoded (an in-script `expected=(...)` array, a golden file, a snapshot), the guard is itself an edit target of the change. A guard that "passes today" against the OLD structure will fail on the NEW one. Symptom: a "verify pair" where the verifier is a script with a literal list of what it expects.

## Related

- [[plan-verification-as-contract-not-must-pass-now-shell]] — the sibling verification-altitude trap from the same session
