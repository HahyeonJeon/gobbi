# Risk Perspective — Loop Skills Batch 2 iter2 (Claude)

## Artifact Summary + Memory reads

(See `project.md` for the shared Stage 0 summary.)

## Locked Frame (Stage 1)

Inherited from iter1.

**S-R1: Sole-writer contract enforceable** (inherited; Fix G + Fix E both touch this)
**S-R2: REVISE preserves prior iter** (inherited)
**S-R3 (adversarial): Schema-drift leakage** (inherited)
**S-R4: Never-delete discipline** (inherited)
**S-R5: Evaluator path drift risk** (inherited; Fix D target)
**S-R6 (NEW iter2, adversarial): Fix E introduces a pre-Wrap-up project-memory write — does it create a new bypass risk?**
**S-R7 (NEW iter2, adversarial): Fix G removes ad-hoc carveout — does it inadvertently lock out a legitimate MEMORIZATION write surface?**

**Privacy / data retention** / **License / IP**: `not-applicable:` (workflow docs)
**Cost / budget**: bounded by maxIterations (default 3) × 2 systems; acceptable

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| S-R1 | Sole-writer enforceable | YES (with Fix E exception clearly bounded) | Fix G replaces the loose MEMORIZATION carveout (wrap-up/SKILL.md L288). Fix E's narrow Preparation `generate-now` skill exception is explicit, scoped to one src/dst pair, actor=manager only, timing=between Preparation PASS and Planning. The exception is NOT extensible to other staging types — preparation/SKILL.md L62 explicitly says "all other staging types remain Wrap-up-only" |
| S-R2 | REVISE preserves prior iter | YES (unchanged) | |
| S-R3 | Schema-drift leakage | NO (F-P-01 addressed by Fix C) | |
| S-R4 | Never-delete | YES (unchanged) | |
| S-R5 | Evaluator path drift | NO (F-S-03 addressed by Fix D) | |
| S-R6 | Fix E bypass risk | NO new bypass | Bypass risk would arise if the exception language was broad (e.g., "manager MAY promote any staging type early"). The text is narrow: only `generate-now` SKILL files in `staging/skills/{slug}/` — bounded by directory, file type, and Preparation-loop origin. Wrap-up still owns project-memory writes for everything else |
| S-R7 | Fix G locks out legitimate write? | NO | Wrap-up MEMORIZATION's legitimate writes (handoff frontmatter, session.json upsert, transcript preservation — wrap-up/SKILL.md L284) are explicitly enumerated and unaffected. The blocked path was the "evaluator finding triggers an ad-hoc destination" path, which is now routed through NEEDS_CONTEXT → AskUserQuestion if unmappable to the table |

## Typed findings (iter2)

### F-R-01 (iter1: sole-writer carveout) — Disposition update

- **Disposition**: `addressed`
- **Evidence**: Fix G removes the ad-hoc write permission. wrap-up/SKILL.md L288: "If [the finding] is unroutable, return `NEEDS_CONTEXT` with a `user-question:` block so the manager can confirm the routing via AskUserQuestion. There are no ad-hoc write exceptions in MEMORIZATION; the routing table is the sole authority." This converts the implicit license into an explicit user-gated escalation. The principle (L48) and frontmatter description (L3) now align.

### F-R-02 (iter1: cross-task staging read risk) — Disposition update

- **Disposition**: `open` (not in iter2 fix list; Low-Medium persistence)
- **Severity**: Medium / **Confidence**: 50 (unchanged)

### F-R-03 (iter1: evaluate.mode == 'skip') — Disposition update

- **Disposition**: `deferred` (#258 cross-layer)

## Low-confidence appendix

(none new)

## Verdict

**PASS** — both High-severity Risk findings (F-R-01 sole-writer carveout) are `addressed`. Remaining open is F-R-02 (Medium/50) which does not block PASS at this perspective's threshold.
