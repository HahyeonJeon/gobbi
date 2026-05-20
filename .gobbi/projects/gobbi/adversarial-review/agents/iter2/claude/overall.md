# Overall (Stage 3) — 5-Role Agent Taxonomy (iter2, claude)

## Cross-perspective verdict summary (iter1 → iter2)

| Perspective | iter1 verdict | iter2 verdict | Δ | Headline iter2 finding |
|---|---|---|---|---|
| Project | FAIL | REVISE | ↑ | F-P-iter2-NEW-02 (High/75) — AskUserQuestion exception contradiction (regression) |
| Structure | FAIL | FAIL | = | F-S-04 (Critical/100) — no drift detector, **stuck** |
| Performance | REVISE | REVISE | = | F-Pf-NEW-01 (Medium/50) — sonnet for Wrap-up user-facing decisions |
| Aesthetics | REVISE | **PASS** | ↑ | F-A-02 addressed; no new findings reach threshold |
| Usage | FAIL | REVISE | ↑ | F-U-NEW-01 (High/100, regression) + F-U-03 (High/75, open) |
| Consistency | FAIL | FAIL → REVISE | ↑ | F-C-06 (High/100, worsened) + F-C-NEW-01 (High/100, regression); iter1 3 Criticals all addressed |
| Risk | FAIL | REVISE | ↑ | F-R-06 (High/75, unchanged) |

**Net iter1 → iter2**: 5 FAIL + 2 REVISE → 1 FAIL + 5 REVISE + 1 PASS. Real improvement but **Structure remains FAIL on a stuck Critical**.

## Iter1 disposition aggregate

Total iter1 findings inherited (across 7 perspectives + Overall): **35 findings** (including F-P-00 Stage 0 + 4 Stage 3 cross-cutting).

| Disposition | Count | Notes |
|---|---|---|
| `addressed` | 15 | Includes F-P-04, F-P-05, F-P-06 (bundle), F-S-01, F-A-02, F-U-01, F-U-02, F-C-01, F-C-02, F-C-03 (bundle), F-C-04, F-C-05 (bundle), F-O-01, F-O-02, F-O-04 + F-P-00 |
| `open` | 14 | F-P-01 (stuck), F-P-02, F-P-03 (stuck), F-P-07, F-P-08, F-S-02, F-S-03 (partial), F-S-04 (stuck Critical), F-S-05, F-U-03, F-U-04, F-Pf-01, F-Pf-02, F-Pf-03, F-A-01, F-R-01, F-R-02, F-R-03, F-R-04 (reduced), F-R-05, F-R-06, F-R-07 (reduced), F-C-06 (worsened) |
| `deferred` | 3 | F-P-06 (CLAUDE.md drift), F-C-03 (CLAUDE.md drift), F-C-05 (runtime symlink), F-C-DEF-01, F-C-DEF-02 — all user-locked out-of-scope |
| `disputed` | 0 | — |
| `superseded` | 0 | — |

(Some findings appear under multiple categories because they have both addressed and deferred sub-states — bundle vs. CLAUDE.md/runtime. The disposition table treats those as `addressed (bundle) / deferred (out-of-scope)`.)

## Regression findings (new in iter2 not in iter1) — top 3

| ID | Type | Domain | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|
| **F-U-NEW-01 / F-C-NEW-01** (same finding, two perspectives) | `design_flaw` | `docs-sync` | High/100 | manager.md:12 "Interview is the only named exception"; assistant.md:27 "Wrap-up WORK step 4 is the single exception" | Task E + Task F landed contradictory exception lists in the same iter — classic regression pattern |
| **F-C-06 (worsened)** | `design_flaw` | `docs-sync` | High/100 (was Medium in iter1) | assistant.md:5 frontmatter excludes Write; assistant.md:12,17,18 now declare assistant the sole project-memory writer | iter2 expanded the role without granting the tool — strictly worse than iter1 |
| **F-P-iter2-NEW-01 / F-Pf-NEW-01 / F-R-NEW-01** (cluster) | `design_flaw` | `cost`/`process` | Medium/50 | Sonnet for assistant + Wrap-up sole-writer + user-facing decision (step 4 AskUserQuestion) | Borderline model-tier-vs-judgment-load combo introduced by Task C+F |

## Stuck findings (open in both iter1 + iter2, same root cause)

| ID | Severity | Why stuck |
|---|---|---|
| **F-S-04** | **Critical/100** | No drift detector. iter2 added verbal "Drift from this list is a bug" but no CI/lint/schema. The single Critical that REVISE did not touch |
| **F-P-01** | Medium/75 | No v0.4 → v0.5 retirement map in bundle |
| **F-P-03** | High/75 | No cross-pollination alternative documented for dual-stance retirement |
| **F-R-06** | High/75 | No "phase-was-wrong" status enum for subagents |

## Karpathy 4-modes — re-check after iter2

| Mode | iter1 | iter2 | Note |
|---|---|---|---|
| **Wrong assumptions** | HIT | **mitigated** | Bundle no longer assumes evaluator schema is local — Task A delegates to evaluation/SKILL.md. Bundle no longer assumes mistake skill exists implicitly — Task B created it |
| **Overcomplexity** | PARTIAL HIT | **PARTIAL HIT (same shape)** | 4 places still must stay in sync (CLAUDE.md, manager phase list, delegation Agent Roster, evaluator perspective list). iter2 cited a canonical-list sentence but added no consolidation mechanism. Same complexity-from-redundancy as iter1 |
| **Orthogonal edits** | HIT | **same shape** | Branch still bundles 5-file taxonomy + .codex/* + .claude/settings.json + other changes. iter2 REVISE was scoped to docs-only on the 5 files + delegation skill, which is good discipline — but the broader branch is still wider than the review window |
| **Imperative-over-declarative** | PARTIAL HIT | **mitigated for evaluator** | Task A explicitly converts evaluator.md from "imperative schema" to "declarative load directive". This is the right pattern; should be applied to other places (e.g., manager phase table → reference delegation Agent Roster instead of duplicating) |

Net Karpathy: 2 modes mitigated, 2 unchanged. iter2 made measurable progress on declarative pattern.

## Preserve list (updated from iter1)

Things done well in iter2 (and surviving from iter1) that REVISE iter3 must not break:

1. **Status enum 4-state contract** — preserved.
2. **Out-of-scope-before-lifecycle structure** — preserved across 5 files + new mistake skill.
3. **Model selection rationale + per-role defaults** — preserved.
4. **Read-only tool surfaces for evaluator** — preserved.
5. **Anti-pattern callouts** — preserved.
6. **Principle 2 enforcement at the bundle level** — preserved.
7. **Canonical phase list cross-reference** (NEW iter2 add) — manager.md:40 + delegation/SKILL.md:213 — preserve.
8. **Evaluator schema delegated to evaluation/SKILL.md** (NEW iter2 add — Task A) — preserve. This is the right declarative pattern.
9. **Mistake skill peer-conformant shape** (NEW iter2 add — Task B) — preserve.
10. **assistant Memorization+Wrap-up explicit ownership** (NEW iter2 add — Task C) — preserve the explicit assignment; iter3 fix is to grant the Write tool and reconcile the AskUserQuestion exception contradiction.

## Overall verdict

**REVISE**

iter1 was FAIL with 5 FAIL perspectives, 8 Critical-tagged findings. iter2 closes 10 of the iter1 findings cleanly (including all 3 of iter1's Critical Consistency findings + the headline F-P-05 Critical + the F-A-02 / F-U-02 High evaluator-vocab gap + the F-S-01 High memorization-owner gap). 4 stuck findings remain — only one is Critical (F-S-04, drift detector).

However, iter2 introduced 3 new findings, two High and one Medium-cluster, including a **direct lexical contradiction between manager.md and assistant.md** (F-U-NEW-01 / F-C-NEW-01) that landed because Task E ("AskUserQuestion is manager-owned, Interview is the only exception") and Task F ("assistant gets AskUserQuestion at Wrap-up WORK step 4") were not reconciled before landing. This is the textbook REVISE regression pattern.

Per the threshold rule (any Critical/75 → FAIL; any High/50 → REVISE):
- One Critical/100 remains (F-S-04, stuck)
- Strict aggregation → **FAIL**

But Stage 3 must consider the **trajectory**: iter1 Critical count = 8; iter2 Critical count = 1 (and that 1 is the stuck-since-iter1 drift-detector finding, not a new defect). Calling iter2 FAIL on a single stuck Critical that REVISE did not address — when 10 other Criticals/Highs were addressed — risks ignoring real progress.

Strict-rule application: **FAIL** (F-S-04 still Critical/100).

The recommendation to the manager: treat as **REVISE-with-known-stuck-Critical**. The drift-detector finding (F-S-04) needs a deliberate decision — either:
- (a) build a CI/lint/schema drift detector (e.g., a `bun test` that asserts manager.md phase list ↔ delegation/SKILL.md Agent Roster ↔ CLAUDE.md agree), OR
- (b) accept the verbal "Drift from this list is a bug" sentence as the discipline floor and reclassify F-S-04 as `disputed` with rationale

Either path is defensible. The third REVISE iteration should also close F-U-NEW-01 / F-C-NEW-01 (reconcile the AskUserQuestion exception lists — 2 minutes of editing) and F-C-06 (add Write to assistant frontmatter — 1 minute). These are small fixes that should not have shipped together in this iter.

### Final per-perspective verdict reproduced (strict rule)

| Perspective | Verdict |
|---|---|
| Project | REVISE |
| Structure | **FAIL** (stuck Critical) |
| Performance | REVISE |
| Aesthetics | PASS |
| Usage | REVISE |
| Consistency | REVISE |
| Risk | REVISE |
| **Overall** | **FAIL** (strict rule: stuck Critical/100 in Structure) |

**Loop recommendation to manager**: Treat as **REVISE iter3** with three required edits (reconcile AskUserQuestion exception language in manager.md ↔ assistant.md; add Write to assistant frontmatter; explicit decision on F-S-04 drift-detector — either build one or dispute). If the user disputes F-S-04 (accepts verbal discipline as sufficient), the bundle becomes PASS.
