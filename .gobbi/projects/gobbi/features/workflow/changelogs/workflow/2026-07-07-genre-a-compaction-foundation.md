---
name: genre-a-compaction-foundation
description: Genre-A foundation of the workflow-doc compaction shipped — B-fixes + doc-kind markers + hoist-then-point + ideation.md rewrite + drift guard + first rules/ entry.
type: changelogs
scope: feature
feature: workflow
status: active
created: 2026-07-07
session: 5a0709c2-4f59-448c-8aab-88619c33fb90
tags: [docs-sync, refactor]
keywords: [genre-a, compaction, hoist-then-point, pointer-drift-guard, ideation-rewrite]
author: claude
shipped_in: 6 commits cc2bff25..7250ef4b (branch claude-2026-07-07-5a0709c2)
---

# Genre-A workflow-doc compaction — foundation shipped

**Task:** P2 two-doc-kind compaction implementation (Option A — Genre-A foundation)

## Summary
Shipped the bottom-up foundation slice of the two-doc-kind workflow-doc compaction (design `workflow-compaction-two-doc-kind`). The slice fixes latent bugs first, marks every workflow doc with its doc-kind, hoists the no-commit git-mechanics SSOT into `record.md` and points the loop docs at it, fully rewrites `ideation.md` to the Genre-A skeleton, and ships a fail-closed drift guard plus the project's first `rules/` entry.

## What changed
- **T01 (cc2bff25):** pass-1 B-fixes (B1–B6, B8–B11; B7 dropped — shipped by #341) + `**Doc kind:**` marker on all 8 `orchestration/workflow/*.md` docs (9 files).
- **T02 (3e7f44f8):** hoisted the no-commit git-mechanics rule into `workflow/record.md` (hoist-then-point ordering — SSOT established before any loop doc points at it).
- **T03 (86ae5289):** rewrote `ideation.md` to the Genre-A skeleton — 184→113 lines; **58% words / 59% chars** reduction (honest metric, not line-count).
- **T04 (5ace6b54):** pointed the point-4 loop docs at the `record.md` owner.
- **T05 (4bcc8dc4):** built `check-workflow-pointer-drift.sh` + `pointer-drift-manifest.txt` and deployed the `.claude` mirror (DUAL production: 17 integration deltas, 11 changing).
- **iter2 (7250ef4b):** eval remediation — B11 mode-doc alignment + guard broaden (heading-only / paraphrase no-commit re-add) + dead-anchor fix + anaphora polish.
- **First `rules/` entry:** `rules/docs/point-dont-restate-workflow-docs.md` — the project's first `rules/` file.

## Verification
- `check-workflow-pointer-drift.sh --self-test` → 13/13 exit 0; clean live run exit 0 (NO POINTER DRIFT).
- `check-markdown-links.sh workflow/` → 181 links resolve; `check-workflow-mirror-consistency.sh` clean; `sync-plugin-package.sh --check` exit 0.
- Mandatory dual-system Execution evaluation: iter1 Codex FAIL ↔ Claude REVISE → reconciled REVISE (2 real change-set defects caught); iter2 remediation → PASS.

## Deferred
- Genre-B skeleton rewrite of `evaluation.md` / `record.md` / `production.md` (marker + B-fixes + hoist pointer only this pass).
- Gate-ID / `gate-manifest.txt` / `gate-snapshots/` content-presence machinery + the guard's gate-protection checks.
- Full Genre-A rewrite of the other 4 loop docs (`preparation.md` / `planning.md` / `execution.md` / `wrap-up.md`) — marker + no-commit→pointer swap + B-fixes only so far.
- B12 dead mistake-xref cleanup (combine with Point-1's dangling xref; separate backlog).
- Open merge action: rebase onto develop `f5f315cb` (overlaps `evaluation.md` / `production.md`), resolve conflicts, re-run guards before PR — manager's git finalization.

## Related
- [[workflow-compaction-two-doc-kind]] — the locked design this slice implements
- [[two-doc-kind-compaction-model]] — the loop-orchestration / gate-orchestration decision
- [[point-dont-restate-workflow-docs]] — the first rules/ entry shipped this session
