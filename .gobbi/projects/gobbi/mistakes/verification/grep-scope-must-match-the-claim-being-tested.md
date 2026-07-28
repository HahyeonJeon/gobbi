---
name: grep-scope-must-match-the-claim-being-tested
description: A search produces a wrong conclusion when its subject set or pattern differs from the claim it is used to prove.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-25
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [verification, process]
keywords: [grep-scope, exact-pattern, count, absence]
author: codex
priority: high
domain: verification
supersedes: grep-absence-claim-needs-exact-pattern
superseded_by: null
---

# Match the search scope to the claim

## What happened

Four manager searches produced wrong conclusions: a vocabulary count omitted nested bundles,
discrepancy counts included ledger sections, and a routing check used wording narrower than the
claim. The producer's counts were right each time.

## Why it happens

A search result looks objective even when its pattern or traversed set differs from the set the
claim ranges over. Exact wording can also false-miss a valid presence.

## Correct approach

State the subject set and counting unit before running the search. Confirm the command traverses
that set. For presence, prefer a structural or broader search followed by inspection. For
absence, run and cite the exact discriminating pattern. Treat a disagreement as a scope mismatch
until reproduced.

## How to detect

A count disagrees with an owner's result, a nested or ledger surface is omitted or included
without explanation, or the quoted claim and executed search use different patterns.

## Related

- [[grep-absence-claim-needs-exact-pattern]] — the narrower absence-only predecessor preserved in archive.
- [[scan-form-needs-independent-or-planted-witness]] — adds independent proof for actionable scans.
