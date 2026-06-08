---
name: implement-session-memory-clusters-s-r-d1
description: Deferred documentation clusters S (staging flatten), R (notes/ record + generator), and D1 (retire D-4 per-iter commit cadence) from the session-memory lifecycle redesign
type: backlogs
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [docs, session-memory, deferred, cluster-s, cluster-r, cluster-d1]
priority: medium
disposition: open
project-scope: false
shipped_in: null
---

# Implement session-memory lifecycle clusters S, R, D1

## Context

The session-memory lifecycle redesign (decisions D1–D8, locked in Ideation) was split into two parts at Planning. The must-do-now scope — Cluster M (tokensUsed fix, 9 tasks) + Cluster G (gitignore migration, 1 task) — ships this session. Three documentation-heavy clusters are deferred:

- **Cluster S (D3 — staging flatten, tasks 10–12):** Flatten the staging path from `staging/backlogs/{feature,project}/{slug}` to `staging/backlogs/{slug}` with scope in frontmatter. Update 9 doc surfaces across loop SKILL.md files, memory-map.md, templates, and the wrap-up router.
- **Cluster R (D2 + D7 — notes/ record + generator, tasks 13–14):** Create `memorization/templates/session-record.md` (loop-symmetric file set), add the wrap-up promotion step routing to `notes/{date}-{slug}-{ssid}/`, document flat-journal + record-dir coexistence, and build the bash+jq template-tree generator called from `session-start.sh`.
- **Cluster D1 (D1 — retire D-4, tasks 15–16):** Supersede the D-4 per-iteration session-memory commit cadence design-of-record and amend its sibling git-workflow feature-memory files (8+ files) plus 5 orchestration workflow/*.md phase docs.

The ready-made decomposition (all 17 tasks with full YAML, verifies, and agent assignments) lives at:
`sessions/2026-06-08-c7673705-2d69-4be8-9bd4-436c3eb91be2/planning/staging/plans/session-memory-lifecycle-redesign.md`

## Why deferred

Bundling S/R/D1 with M+G risks a context-pressured Execution and diluted review. S/R/D1 are doc-heavy refactors (~35 doc surfaces) whose value is structural cleanliness rather than a live bug fix. M+G deliver the user's explicit priorities (zeroed telemetry + gitignore) in one tight, well-reviewable Execution. S/R/D1 slice cleanly into a clean follow-up session per the user-ratified scope split.

## When to pick up

- After Cluster M+G (tasks 01–09 + 08b) ship and the session wraps up.
- No blocker from M+G: Clusters S and D1 are mutually independent of M/G (except shared `orchestration/SKILL.md` edits — sequence those).
- Cluster R depends on Cluster S: task 13 (session-record-template + wrap-up promotion) requires task 12's flattened wrap-up router. Pick up S first, then R.

## Suggested approach

1. Start with Cluster S (tasks 10–12) — the path-flatten is a prerequisite for R and a clean isolated set of 9 doc surfaces. Verify with `grep -rlE 'staging/backlogs/\{feature,project\}'` returning 0 files on completion.
2. Follow with Cluster R (tasks 13–14) — requires S complete. Create session-record.md template first (task 13), then the generator (task 14). Verify with `bash -n hooks/generate-session-skeleton.sh` + idempotent tree test.
3. Cluster D1 (tasks 15–16) can run independently of S/R. Supersede the D-4 design first (task 15 redefines the 5 orchestration/workflow/*.md files), then task 16 amends the full git-workflow feature-memory cluster (8+ files). High blast-radius — assign to executor/opus with a careful CRUD-and-5W1H review. Verify with `grep -lE 'chore\(session\): record .* iter.* memory' skills/orchestration/workflow/{ideation,...}` returning 0 files.

## Originating session

`sessions/2026-06-08-c7673705-2d69-4be8-9bd4-436c3eb91be2/` — Planning PASS iter2.
Full task YAML at `planning/staging/plans/session-memory-lifecycle-redesign.md` (the plan artifact).
