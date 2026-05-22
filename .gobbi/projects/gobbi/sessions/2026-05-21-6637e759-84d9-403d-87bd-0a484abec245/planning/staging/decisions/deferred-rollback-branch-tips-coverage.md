---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
loop: planning
status: deferred
feature: repo-reset
finding-id: F-CL-R-02
finding-type: assumption_risk
domain: process
severity: Medium
confidence: 50
disposition: deferred
supersedes: null
superseded_by: null
---

# Deferred: Stage E.2 Gate Does Not Verify Bare-UUID Dir Content Equivalence

## Context

The Stage E.2 gate verifies that the kept session dir (`2026-05-21-6637e759-...`) is in the sweep-branch tree via `git ls-tree`. However, the bare-UUID dir (`6637e759-84d9-403d-87bd-0a484abec245/`) is assumed to be a subset of the kept dir's content (CLI-bootstrapped companion per Q-B). The gate does not verify this content equivalence before deleting the bare-UUID dir.

## Why deferred

The assumption is sound per Q-B's narrative: the bare-UUID dir is the CLI's runtime artifact and the kept session dir is the manager's structured session tree. However, if the CLI has written something to the bare-UUID dir that the manager's session dir does not contain, the gate would silently lose it.

Risk confidence is 50 (probable but unverified). The user has accepted this trade-off via Q-B's pre-authorization. Adding a content-equivalence check would require `diff -r` or `rsync -n` which adds complexity and may produce false positives.

## Condition to reconsider

If the CLI begins writing execution artifacts to the bare-UUID dir that are not mirrored to the structured session dir, this assumption fails. Re-open if the CLI's session-dir strategy changes.

## Related

- `planning/rawdata/draft-iter4.md` § Stage E.2
- `ideation/artifacts/scope-contract.md` § Q-B
