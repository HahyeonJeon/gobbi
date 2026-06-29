---
name: wrapup-guard-gate-unsatisfiable-with-preexisting-failures
description: Wrap-up's "all post-promotion guards must exit 0" gate is unsatisfiable when the memory tree carries pre-existing unrelated guard failures; it has no "no-new-failures-vs-baseline" escape and no review-only carve-out.
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [verification, docs-sync]
keywords: [wrap-up, stage-3, green-check, all-guards-exit-0, baseline, check-markdown-links, check-residual-vocab, dual-system-divergence]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Wrap-up guard gate is unsatisfiable when the tree has pre-existing unrelated failures

## Context

`wrap-up/SKILL.md` § EVALUATION post-promotion green-check requires EVERY standing guard to exit 0 before a wrap-up can reach `PASS` and unblock Stage-5 git. Surfaced this session by the dual-system Stage-3 gate: the Codex evaluator returned `REVISE` strictly because `check-markdown-links.sh` (19 broken) and `check-residual-vocab.sh` (88 hits) exit 1, while the Claude side and the manager verified the session introduced **zero** new genuine violations.

The two guard failures were:
- **19 broken markdown links** — entirely pre-existing (in `skills/orchestration/workflow/*`, `delegation`, `memory/rules`, a prior feature plan, and a backlog file literally named `preexisting-broken-markdown-links.md`). A review-only session cannot fix them in scope.
- **+4 residual-vocab hits** — a substring false-positive (see [[residual-vocab-substring-false-positive-cross-session]]).

So the rule "all guards exit 0" was unsatisfiable for a clean, review-only session through no fault of its own: the tree's baseline state, not the session's promotions, held the gate red.

## Why this is a defect

The green-check rule has no escape valve for two real situations:
1. **Pre-existing unrelated failures** — a guard red because of tree state that predates the session. There is no "no-NEW-failures-vs-baseline" comparison; the rule is absolute exit-0.
2. **Review-only sessions** — which are forbidden from editing the skill/tooling/source that would fix a pre-existing failure, so they cannot reach green even if they wanted to.

The result: a literal reading (Codex's) blocks Stage-5 git on a sound deliverable; a substantive reading (Claude's) overrides the clause on a documented-rationale basis. The contract should make the correct reading explicit, not leave it to a per-session manager override.

## Suggested approach (NOT a committed design — a suggestion)

Add a "no-new-failures-vs-baseline" escape to the green-check: capture each guard's baseline count in the Stage-1 pre-wrap-up snapshot, and let the gate pass when `post_count <= baseline_count` for a guard whose remaining failures are all pre-existing AND the session introduced no new ones. Pair it with an explicit review-only carve-out (a review-only session records pre-existing guard failures as backlog items rather than being blocked by them). Keep absolute exit-0 for guards the session's own promotions can affect (frontmatter, skill-mistakes, workflow-mirror).

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-29-40b9a93e-5ec4-43d7-bd16-075b0c7fa303/` — first dogfooding run of the dual-system Stage-3 gate; the divergence (Codex REVISE vs Claude PASS) is the witness.

## Related

- [[residual-vocab-substring-false-positive-cross-session]] — one of the two guard failures that triggered this; a false positive
- [[preexisting-broken-markdown-links]] — the pre-existing broken-links backlog this gate tripped on
