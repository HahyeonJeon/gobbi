---
name: disposition-preservation-missing-t1-t5
description: "Checklist gap: T1 and T5 conformance tasks must verify that FIX-1 strip preserves legitimate disposition keys in feature backlog files."
tags: [checklist, disposition, backlog, conformance]
date: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
type: checklist_gap
domain: docs-sync
addressed-in-iter: 2
addressed-how: "T1 `verifies` now explicitly asserts `disposition` preserved on `features/agents/backlogs/privacy-retention-agents-metadata-deferred.md` (1 backlog file). T5 `verifies` now explicitly asserts `disposition` preserved on all 3 guardrails backlog files (`goodhart-factor-when-demanded-deferred.md`, `posttooluse-failure-webfetch-verification-gap.md`, `hook-event-count-31-vs-29-docs-sync.md`). Self-review coverage row updated to include T1/T5."
status: accepted
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
---

# Missing checklist item: `disposition` preservation verification on T1 and T5

## Scenario

Conformance tasks that handle feature groups containing `backlogs/` subdirs must verify that the FIX-1 strip does NOT remove legitimate `disposition` keys from backlog files (which are NOT subject to the staging-key strip per D6/FIX-1 scope contract).

## Missing check

T1 and T5 `verifies` gates in iter1 checked only: (a) leak count = 0, (b) 9 base keys present, (c) git diff scope. They did NOT include a `disposition` preservation assertion.

- T1 covers `features/agents/**` which includes `features/agents/backlogs/privacy-retention-agents-metadata-deferred.md` (carries `disposition: deferred`).
- T5 covers `features/guardrails/**` which includes 3 backlog files with legitimate `disposition` values.

A blanket strip could pass the "0 leaks + 9 base keys" checks after deleting legitimate `disposition` — the gap was real.

## How to verify (corrected)

For any conformance task covering a feature dir that contains `backlogs/` files:
- Enumerate the backlog files in the feature dir before edits.
- After edits, confirm each backlog file still carries its original `disposition:` value.
- The `verifies` gate must name this check explicitly (not infer preservation from the leak gate).

## Related

- `planning/evaluation/iter1/codex/overall.md` (F2)
- `planning/rawdata/draft-iter2.md` §DL-J (Codex F2 closure)
- `ideation/artifacts/design-options.md` (FIX-1 — `disposition` preserved on backlogs)
- `ideation/artifacts/scope-contract.md` (Out-of-scope: stripping `disposition` from backlogs)
