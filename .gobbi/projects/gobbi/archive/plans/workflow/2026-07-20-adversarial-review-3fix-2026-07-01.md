---
name: adversarial-review-3fix-2026-07-01
description: Decomposes the locked 3-finding doc-consistency fix (D3-001 / D3-002 / D1-002) into 3 executor tasks
type: plans
scope: feature
feature: workflow
status: completed
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [planning]
keywords: [adversarial-review, doc-consistency, orchestration, gen-d3-001, gen-d3-002, gen-d1-002, execution]
author: claude
task: fix DIRECTION for 3 validated High findings from the 2026-07-01 adversarial review
supersedes: null
superseded_by: null
task_count: 3
archived_at: 2026-07-20
archive_reason: completed
---

# Plan — 2026-07-01 adversarial-review 3-finding fix

## Idea anchor

Locked Ideation design: `sessions/2026-07-05-1fecddb4-255e-4829-9912-42deb9c36fc8/1-ideation/outputs/ideation-output.md` § Design — DES-D3-001 = A, DES-D3-002 = S (two-column structural split), DES-D1-002 = A (all user-LOCKED 2026-07-05).

## Scope Contract reference

Ideation canonical § Scope Contract — Project gobbi · Feature `workflow` · Task = fix DIRECTION for exactly the 3 findings. NOT in scope: D5-012, FLAG-2 (`claude` skill), D4-003.

## Sub-tasks

| # | Sub-task | Depends on | Verification | Owner type |
|---|---|---|---|---|
| 01 | `gobbi/SKILL.md` Step 6 — route BOTH fresh + resume bullets through `orchestration/SKILL.md § Workflow` / the selected mode doc; drop the direct loop-skill loads; preserve resume CONTINUE semantics | — | delta-clean `check-markdown-links.sh gobbi/SKILL.md` (zero-new) + no-stale-direct-load grep + manual S1/S5 reader-journey + mirror-guard clean | executor |
| 02 | `auto-mode.md §2` + `chat-mode.md §3` — two-column split `Manager refs` / `Specialist phase loads` (cell names phase skill(s) INCLUDING `../research/SKILL.md` at Sub-C + `../memory/memory-map.md` at RECORD, NOT the full `delegation` block); preserve the `auto-mode.md:81` Action-cell routing link verbatim | — | delta-clean (zero-new) + specialist-row-sole-workflow-ref grep == 0 + manual S2/S2b delegation trace + anchor-still-resolves + mirror-guard clean | executor |
| 03 | `workflow/evaluation.md § Routing Findings to RECORD` — delete narrowed table → canonical pointer + 2 inline constraints; heading UNCHANGED (anchor target); `workflow/evaluation.md` ONLY | 02 (anchor coupling; same executor) | delta-clean (zero-new) + heading-count==1 + scoped narrowed-gone / canonical-named greps + manual S3/S4 + SHARED post-condition: `#routing-findings-to-record` resolves after both + mirror-guard clean | executor |

## Dependency graph

```
01 (gobbi/SKILL.md)                    [independent lane]
02 (auto-mode.md + chat-mode.md) ──► 03 (workflow/evaluation.md)
     └─ anchor coupling at auto-mode.md:81 ↔ evaluation.md `## Routing Findings to RECORD` heading
```

Global order 01 → 02 → 03. `03 requires 02` is a sequencing/coupling edge (same executor, adjacent, shared anchor post-condition), not a produced-artifact dependency. No shared file between any two tasks → no merge conflict.

## Verification strategy summary

Gate per task = **DELTA-clean (zero NEW guard violations vs the Preparation-captured baseline; ~12 pre-existing `check-markdown-links.sh` + 3 `check-skill-mistakes.sh` at `git/mistakes.md:33` are OUTSIDE the edit set)** + the design's per-finding manual traces + `check-workflow-mirror-consistency.sh` clean (regression). The cross-task gate: after tasks 02+03, `check-markdown-links.sh` confirms `auto-mode.md:81`'s `#routing-findings-to-record` inbound link still resolves (F-CONSIST-01). All 3 tasks are `executor`, default opus; one executor continued across all 3 (≤3 cap); 02+03 same-executor mandatory.

## Open issues

None blocking. Deferred (out of scope, backlog): GEN-D5-012 (`ideation/SKILL.md:496` sibling routing copy) and FLAG-2 (`claude` doc-authoring skill; user-confirmed defer).

## Related

- [[adversarial-review-3fix-2026-07-01]] — this plan implements the locked Ideation design for the 3-finding fix
