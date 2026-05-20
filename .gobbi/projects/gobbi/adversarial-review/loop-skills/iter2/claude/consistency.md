# Consistency Perspective — Loop Skills Batch 2 iter2 (Claude)

## Artifact Summary + Memory reads

(See `project.md` for the shared Stage 0 summary.)

This is the **highest-yield perspective** for verifying iter2 fixes — most of the 8 fixes target cross-loop consistency contracts.

## Locked Frame (Stage 1)

Inherited from iter1, plus iter2 fix-specific probes.

**S-C1: Verdict enum uniform across all 5 loops** (inherited; Fix A target)
**S-C2: Sole-writer contract enforceable** (inherited; Fix G target)
**S-C3: Evaluation output paths agree between SKILL.md and evaluation.md** (inherited; Fix D target)
**S-C4: 4 phases × 5 loops phase contract uniformity** (inherited)
**S-C5: NEEDS_CONTEXT uniformly defined** (inherited)
**S-C6: Planning task schema matches evaluator + downstream Execution** (inherited; Fix C target)
**S-C7 (adversarial): Same thing — two names** (inherited)
**S-C8: iterations[] entry schema uniform across loops** (inherited)
**S-C9 (NEW iter2, adversarial): Fix B wrap-up/evaluation.md routing-table reference correctly defers to parent SKILL.md**
**S-C10 (NEW iter2, adversarial): Fix A FAIL escalation options match those in Planning + Execution + Preparation**

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| S-C1 | Verdict enum uniform | YES | All 5 loops now name `PASS / REVISE / FAIL`. Ideation L344,364,366,381 (Fix A); Preparation L279,299; Planning L366,385; Execution L160,179; Wrap-up L227,248 |
| S-C2 | Sole-writer contract enforceable | YES | Fix G replaces the ad-hoc carveout with routing-table-authoritative constraint at L288. Fix E adds the narrow Preparation exception, documented identically across orchestration/SKILL.md L118, preparation/SKILL.md L62, wrap-up/SKILL.md L51 |
| S-C3 | Eval path agreement | YES | Fix D — execution/evaluation.md L425 now includes `{task-id}/` segment; matches parent SKILL |
| S-C4 | 20 phase blocks uniform | YES | Unchanged (iter1 PASS) |
| S-C5 | NEEDS_CONTEXT uniform | NO | F-S-02 persists — ideation/preparation/planning still have 0 `NEEDS_CONTEXT` references. Cross-loop primitive contract still broken |
| S-C6 | Task schema agreement | YES | Fix C — planning/SKILL.md L51 + L184 + L319-324 now defines canonical YAML `{id, what, traces-to, requires, files, inputs, outputs, verifies}`. Evaluator + Execution consumers match |
| S-C7 | Same-thing-two-names | YES (partial) | Discussion-log lifecycle now canonical via ideation/SKILL.md L411 (F-U-02 addressed) |
| S-C8 | iterations[] shape uniform | YES | All 5 loops use `{iter, verdict, finishedAt, evaluation_dir}` shape — verified at ideation L397, preparation L341, planning L428, execution L215, wrap-up L295. Execution adds `task-id` key (per-task, documented). F-C-03 addressed |
| S-C9 | wrap-up/evaluation.md routing reference | YES | wrap-up/evaluation.md L107 explicitly references parent SKILL.md as authoritative routing-table source; no separate copy maintained. Medium fix verified |
| S-C10 | Cross-loop FAIL escalation options aligned | YES | Ideation L366 explicitly states "The three options above mirror the same FAIL escalation pattern used by Planning and Execution." Preparation/Planning/Execution/Wrap-up all converge on the AskUserQuestion-driven user-decision pattern |

## Typed findings (iter2)

### F-C-01 (iter1: Ideation verdict enum missing FAIL) — Disposition update

- **Disposition**: `addressed`
- **Evidence**: Fix A — see project.md F-P-02. Cross-loop alignment verified S-C1.

### F-C-02 (iter1: staging dir uniformity, Ideation missing subdir list) — Disposition update

- **Disposition**: `addressed`
- **Evidence**: ideation/SKILL.md L27 now lists full staging subdir set: `{scenarios,checklists,decisions,references,design,discussions,backlogs/{feature,project}}/`. Matches Wrap-up's superset routing assumption.

### F-C-03 (iter1: iterations[] schema drift) — Disposition update

- **Disposition**: `addressed`
- **Evidence**: see S-C8. All 5 loops now use uniform `{iter, verdict, finishedAt, evaluation_dir}` shape.

### F-C-04 (NEW iter2, persisting from iter1 F-S-02): NEEDS_CONTEXT asymmetry across leader-led vs spawned loops

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: `open`
- **Confidence**: 75
- **Severity**: High
- **Evidence**: ideation=0, preparation=0, planning=0 `NEEDS_CONTEXT` references; execution=4, wrap-up=10. Cross-loop subagent-escalation primitive remains non-uniform.
- **Note**: Not addressed by iter2 fix batch; surfaced as persistent High finding.

## Low-confidence appendix

(none new)

## Verdict

**REVISE** — F-C-04 (High/75, persisting from iter1 F-S-02) keeps Consistency below PASS threshold. All other iter1 Consistency findings are `addressed`.
