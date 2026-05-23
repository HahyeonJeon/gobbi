---
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
created_at: 2026-05-23T14:00:00Z
step: 2.5 + 4
---

# Promotion Manifest — Session 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068

Append-only log of all Step 2.5 compliance findings, routing decisions, and promotion results.
One entry per staging file. Format: staging path → destination → action.

---

## SECTION A — Step 2.5 Prior-Loop MEMORIZATION Compliance Scan

### Scan basis

Per wrap-up/SKILL.md § Step 2.5 (T04 — shipped this session). Each loop's `staging/` directory
was verified for: zero-staging gaps, shape-mismatch, template-mismatch, directory-absent.

### Ideation loop

- **Eval iters**: 3 (iter1/iter2/iter3)
- **Staging files**: 15 (decisions × 5, design × 7, discussions × 3)
- **Gap assessment**: NO GAPS. Staging is non-empty, per-finding {slug}.md convention followed,
  `mistake-candidate: true` present on mistake files, design and discussion files have proper
  topic/domain frontmatter. Template shape matches project conventions.
- **Classification**: COMPLIANT

### Preparation loop

- **Eval iters**: 3
- **Staging files**: 3 (decisions × 2 + skills/codex/SKILL.md)
- **Note on skills/**: `preparation/staging/skills/codex/SKILL.md` is a generate-now skill.
  Already promoted to `.gobbi/projects/gobbi/skills/codex/SKILL.md` before Planning started
  (Preparation narrow exception per wrap-up/SKILL.md § Core Principles). Verified present at
  destination. No re-promotion needed; recorded here for audit-trail completeness.
- **Gap assessment**: NO GAPS. 2 decisions properly staged; skills file already promoted.
- **Classification**: COMPLIANT

### Planning loop

- **Eval iters**: 2
- **Staging files**: 8 (decisions × 5 + references × 1 + plans × 1 + backlogs/project × 1)
- **Gap assessment**: NO GAPS. All types expected for a Planning loop are present (plan,
  references, decisions, backlog). Per-finding slug convention followed.
- **Classification**: COMPLIANT

### Execution loop (per-task breakdown)

**T1 (01-gobbi-polish-fg)**: 1 staging file, eval 32 files (2 iters × 2 systems × 8 perspectives).
COMPLIANT — mistake-candidate staged as expected for a REVISE-then-PASS task.

**T2 (02-memorization-moment-of-capture)**: 1 staging file, eval 16 files (1 iter).
COMPLIANT — decision-record staged for plan-spec mismatch clarification.

**T3 (03-delegation-hard-gate)**: 0 staging files, eval 16 files.
ACCEPTABLE — T3 was first-iter PASS (clean) with no corrections or deferred items.
No staging expected for a clean PASS with no findings requiring capture.
Gap category: zero-staging. Type: N/A (intentional — clean task). No NEEDS_CONTEXT.

**T4 (04-wrap-up-step-2-5)**: 0 staging files, eval 16 files.
ACCEPTABLE — T4 was first-iter PASS with no corrections or deferred items.
Same rationale as T3. Gap category: zero-staging (intentional).

**T5 (05-coverage-ownership-naming-row)**: 1 staging file, eval 9 files.
NOTE: T5 Claude evaluator returned only `overall.md` (not all 8 per-perspective files).
The `evaluator-returned-verdict-inline-no-per-perspective-files.md` mistake was staged correctly.
Codex provided all 8 files. Gap in Claude eval structure acknowledged and captured in mistake.
COMPLIANT for staging output.

**T6 (06-codex-skill-content)**: 0 staging files, eval 32 files (2 iters × 2 systems × 8 perspectives).
ACCEPTABLE — T6 was iter2 PASS via surgical fix. No corrections requiring staging beyond what
was already captured in Planning staging (the codex-skill-assistant-wrapper-pattern decision
was staged at planning and is the definitive record). Staging count of 0 reflects that
T6's MEMORIZATION sub-phase did not produce new mistake-candidates beyond what planning captured.

**T7 (07-cross-link-sweep)**: 0 staging files, 0 eval files.
ACCEPTABLE — T7 was a verification-only task (no file changes). No evaluation needed
for a verify-only pass; 0 staging is correct. No NEEDS_CONTEXT.

### Step 2.5 Summary

Total gap findings: 0 NEEDS_CONTEXT escalations required.
Auto-backfill: 0 (no mechanical-class gaps found).
Zero-staging tasks: T3, T4, T6, T7 — all classified ACCEPTABLE (intentional clean-pass or
verify-only; no judgment-required escalation needed).
Preparation skills/ file: already-promoted, verified present.

**Step 3 may proceed.**

---

## SECTION B — Routing Decisions (Step 4)

Feature: `gobbi-orchestration-workflow-improvements`
Scope prefix: `.gobbi/projects/gobbi/`
Feature prefix: `features/gobbi-orchestration-workflow-improvements/`
All promotions add frontmatter: `promoted-from: <session-staging-path>` + `promoted-at: 2026-05-23T14:00:00Z`

### Mistake-candidates → project mistakes (5 files)

Routing decision: process-scoped patterns applicable across all gobbi sessions, not feature-specific.
Scope: PROJECT. Destination: `.gobbi/projects/gobbi/mistakes/{slug}.md`.

| # | Staging path | Destination slug | Action |
|---|---|---|---|
| 1 | `ideation/staging/decisions/codex-rescue-agent-fire-and-forget-without-result-capture.md` | `codex-rescue-agent-fire-and-forget-without-result-capture.md` | PROMOTED → project mistakes |
| 2 | `ideation/staging/decisions/leader-iter2-verification-claim-without-evidence.md` | `leader-iter2-verification-claim-without-evidence.md` | PROMOTED → project mistakes |
| 3 | `ideation/staging/decisions/memorization-delegation-prompts-must-load-memorization-skill.md` | `memorization-delegation-prompts-must-load-memorization-skill.md` | PROMOTED → project mistakes |
| 4 | `preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` | `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` | PROMOTED → project mistakes |
| 5 | `execution/T1/staging/decisions/claude-evaluator-step4-only-vs-codex-whole-file-grep.md` | `claude-evaluator-step4-only-vs-codex-whole-file-grep.md` | PROMOTED → project mistakes |
| 6 | `execution/T5/staging/decisions/evaluator-returned-verdict-inline-no-per-perspective-files.md` | `evaluator-returned-verdict-inline-no-per-perspective-files.md` | PROMOTED → project mistakes |

NOTE: Delegation prompt said "5 mistakes" but the inventory yields 6 mistake-candidate files.
File #3 (memorization-delegation-prompts) is listed separately from the 5 in the delegation prompt.
All 6 are `mistake-candidate: true` and process-scoped. All 6 promoted.

### Design items (A-G) → feature design/

| # | Staging path | Destination | Action |
|---|---|---|---|
| 7 | `ideation/staging/design/item-a-codex-skill-structure.md` | `features/gobbi-orchestration-workflow-improvements/design/item-a-codex-skill-structure.md` | PROMOTED |
| 8 | `ideation/staging/design/item-b-memorization-moment-of-capture.md` | `features/gobbi-orchestration-workflow-improvements/design/item-b-memorization-moment-of-capture.md` | PROMOTED |
| 9 | `ideation/staging/design/item-c-memorization-delegation-hard-gate.md` | `features/gobbi-orchestration-workflow-improvements/design/item-c-memorization-delegation-hard-gate.md` | PROMOTED |
| 10 | `ideation/staging/design/item-d-wrap-up-step-2-5-compliance-check.md` | `features/gobbi-orchestration-workflow-improvements/design/item-d-wrap-up-step-2-5-compliance-check.md` | PROMOTED |
| 11 | `ideation/staging/design/item-e-naming-convention-enforcement.md` | `features/gobbi-orchestration-workflow-improvements/design/item-e-naming-convention-enforcement.md` | PROMOTED |
| 12 | `ideation/staging/design/item-f-glossary-placement.md` | `features/gobbi-orchestration-workflow-improvements/design/item-f-glossary-placement.md` | PROMOTED |
| 13 | `ideation/staging/design/item-g-drop-legacy-setup-questions.md` | `features/gobbi-orchestration-workflow-improvements/design/item-g-drop-legacy-setup-questions.md` | PROMOTED |

### Decisions (non-mistake) → feature decisions/

| # | Staging path | Destination | Action |
|---|---|---|---|
| 14 | `ideation/staging/decisions/iter1-user-redirects.md` | `features/gobbi-orchestration-workflow-improvements/decisions/iter1-user-redirects.md` | PROMOTED |
| 15 | `ideation/staging/decisions/step-2-5-example-non-canonical-domain-value.md` | `features/gobbi-orchestration-workflow-improvements/decisions/step-2-5-example-non-canonical-domain-value.md` | PROMOTED |
| 16 | `preparation/staging/decisions/constraints-body-block-convention-deferred-to-planning.md` | `features/gobbi-orchestration-workflow-improvements/decisions/constraints-body-block-convention-deferred-to-planning.md` | PROMOTED |
| 17 | `planning/staging/decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md` | `features/gobbi-orchestration-workflow-improvements/decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md` | PROMOTED |
| 18 | `planning/staging/decisions/concern-1-wrap-up-step-2-5-anchor.md` | `features/gobbi-orchestration-workflow-improvements/decisions/concern-1-wrap-up-step-2-5-anchor.md` | PROMOTED |
| 19 | `planning/staging/decisions/concern-2-path-conventions-anchor-casing.md` | `features/gobbi-orchestration-workflow-improvements/decisions/concern-2-path-conventions-anchor-casing.md` | PROMOTED |
| 20 | `planning/staging/decisions/concern-3-coverage-ownership-cell-text.md` | `features/gobbi-orchestration-workflow-improvements/decisions/concern-3-coverage-ownership-cell-text.md` | PROMOTED |
| 21 | `planning/staging/decisions/concern-5-constraints-body-block-vs-h2.md` | `features/gobbi-orchestration-workflow-improvements/decisions/concern-5-constraints-body-block-vs-h2.md` | PROMOTED |
| 22 | `execution/T2/staging/decisions/plan-diff-scope-gate-semantics-under-bundled-pr.md` | `features/gobbi-orchestration-workflow-improvements/decisions/plan-diff-scope-gate-semantics-under-bundled-pr.md` | PROMOTED |

### Discussions → feature discussions/

| # | Staging path | Destination | Action |
|---|---|---|---|
| 23 | `ideation/staging/discussions/codex-invocation-priority-redirect.md` | `features/gobbi-orchestration-workflow-improvements/discussions/codex-invocation-priority-redirect.md` | PROMOTED |
| 24 | `ideation/staging/discussions/scope-bundle-selection.md` | `features/gobbi-orchestration-workflow-improvements/discussions/scope-bundle-selection.md` | PROMOTED |
| 25 | `ideation/staging/discussions/wrap-up-step-2-5-escalation-shape.md` | `features/gobbi-orchestration-workflow-improvements/discussions/wrap-up-step-2-5-escalation-shape.md` | PROMOTED |

### References → feature references/

| # | Staging path | Destination | Action |
|---|---|---|---|
| 26 | `planning/staging/references/five-type-vocabulary.md` | `features/gobbi-orchestration-workflow-improvements/references/five-type-vocabulary.md` | PROMOTED |

### Plans → feature plans/

| # | Staging path | Destination | Action |
|---|---|---|---|
| 27 | `planning/staging/plans/main.md` | `features/gobbi-orchestration-workflow-improvements/plans/2026-05-23-main.md` | PROMOTED |

### Backlogs (project scope) → project backlogs/

| # | Staging path | Destination | Action |
|---|---|---|---|
| 28 | `planning/staging/backlogs/project/normalize-path-conventions-h3.md` | `backlogs/normalize-path-conventions-h3.md` | PROMOTED |

### Preparation skills/ — already-promoted (manifest-only)

| # | Staging path | Destination | Action |
|---|---|---|---|
| P1 | `preparation/staging/skills/codex/SKILL.md` | `skills/codex/SKILL.md` | ALREADY PROMOTED (pre-Planning) — verified present |

---

## SECTION C — Per-session journal entry

Written at Step 6: `notes/2026-05-23-orch-workflow-improvements.md`

---

## Summary

Total staging files accounted for: 28 (+ 1 already-promoted = 29 total inventory entries)
Promoted to project mistakes: 6
Promoted to feature design/: 7
Promoted to feature decisions/: 9
Promoted to feature discussions/: 3
Promoted to feature references/: 1
Promoted to feature plans/: 1
Promoted to project backlogs/: 1
Total project memory writes: 28 new files + 1 README + 1 journal entry
