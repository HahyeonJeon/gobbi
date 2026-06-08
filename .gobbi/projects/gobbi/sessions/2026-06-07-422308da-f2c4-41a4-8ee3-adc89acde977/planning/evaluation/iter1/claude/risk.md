# Planning Eval — Risk perspective (claude, iter1)

## Artifact Summary + Memory reads
- Lens: what breaks if the plan itself is wrong? Order/dependency/integration risk, rollback granularity, scope explosion.

## Locked Frame (Stage 1)
- S1 Mid-plan task failure → clear rollback boundary.
- S2 Shared-infra tasks isolated / sequenced first.
- S3 Plan ordering robust to interruption.
- S4 Plan total file-touch matches Idea Scope Contract.
- S5 (adversarial) a task silently widens a prior task's scope.
- S6 Drift-guard: locked specifics encoded so the executor cannot drift.

## Per-scenario per-check results
- S1 PASS. One file per edit task → atomic per-file commit; reverting any of T1-T3 is independent. T4 is read-only (no rollback needed).
- S2 PASS. No CI/build/dep/public-interface change (docs-only). The one "shared" reference (orchestration/SKILL.md:247/266 pointer) is read-only and verify-only; trailing-append §7 keeps §3/§6 numbers stable so the pointer survives by design.
- S3 PASS. Stop-after-T1, -T2, or -T3 leaves coherent intermediate docs (T1 alone sharpens evaluation.md with no dangling forward-pointer because T1 adds none; T2 then cites T1's stable section names). Interruption-safe.
- S4 PASS. Cumulative file-touch = exactly 3 in-scope files, matching the Idea Scope Contract verbatim. No scope explosion.
- S5 PASS (adversarial). Outputs are monotonic, distinct per task (section-names / section-7 / blockquote); no task re-promises a prior task's output.
- S6 DRIFT GUARDS — mostly strong, one failure:
  - PASS §7.2 cites evaluation/SKILL.md + CLAUDE.md eval block with NO principle number (T2 verifies(c)) — matches Idea D7, avoids the stale "Principle 11"/wrong "Principle 3" trap.
  - PASS mode-split-not-delete encoded (T1, T3, edit-mechanics, "retire nothing").
  - PASS C1 split-anchor correctly encoded (Stuck/Regression → evaluation.md behavior; only Iteration-Caps → chat-mode.md) — verified against live chat-mode.md. The adversarial mis-encoding the brief warned about is absent.
  - PASS line-27-only / line-31-untouched (T3 verifies(c), T4 verifies(d)) — verified live: line 27 is the Evaluation blockquote, line 31 is the #295 principles-intro paragraph.
  - PASS canonical .gobbi paths, imperative-first, section-order-preserved, retire-nothing all encoded.
  - FAIL the orchestration/SKILL.md pointer anchor: encoded as line 247, but the live pointer is line 266 (line 247 = table separator). The drift guard meant to protect the out-of-scope pointer is itself mis-anchored. See R-2 (= Structure S-1).
  - GAP no semantic-survivor sweep for un-enumerated mode-agnostic escalations (line 109/137/197). See R-1 (= Consistency C-1).

## Typed findings

### R-1 (cross-listed with Consistency C-1)
- Type: checklist_gap
- Domain: process
- Disposition: open
- Confidence: 75
- Severity: Medium
- Evidence: T4 verifies only named sections; live grep shows mid-loop mode-agnostic AskUserQuestion at evaluation.md lines 109/137/197 not covered by the Idea's 3+3 D8 classification. cotouch-enumeration mistake class.
- Why it matters: in Auto mode a surviving mode-agnostic escalation reproduces the idle-on-user-question failure the Idea targets; T4 cannot see it.
- Suggested direction: add a T4 grep-all-escalations sub-check; surface line 109/137/197 for user classification. User decides whether they are in-scope for this Idea.

### R-2 (cross-listed with Structure S-1)
- Type: checklist_gap
- Domain: docs-sync
- Disposition: open
- Confidence: 100
- Severity: High
- Evidence: Plan cites "orchestration/SKILL.md:247" in 5 places (scope ref, T4 verifies(b), Cross-file #2, NOT-in-scope, edit-mechanics) as the §3/§6 pointer. Live: line 247 = `|---|---|` Verdict-aggregation table separator; actual pointer at line 266. Readiness report (lines 105, 164-171) explicitly told Planning to use 266.
- Why it matters: T4's out-of-scope drift guard is un-runnable as written; an executor verifying line 247 finds a separator. The plan ignored a correction the upstream readiness artifact handed it (Principle 6/9 miss; planning-anchor-without-verifying pattern).
- Suggested direction: replace 247 with 266, or anchor by content not line number.

## Low-confidence appendix
- None for R-2 (conf 100). For R-1, design-classification of the survivors is out of evaluator scope (conf 25 on "should be split"); conf 75 that they exist mid-loop unclassified and that T4 has no sweep.
