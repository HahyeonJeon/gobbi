# Risk Perspective

Verdict: PASS

## Artifact Summary + Memory reads

Stage 0 summary: Risk checks whether advancing from Preparation would promote a wrong skeleton, bypass Wrap-up sole-writer discipline, hide a RE-IDEATE trigger, or lose the manager process correction. What: staged codex skill stub + readiness draft + mistake candidate. Why: iter2 proved that a manager-side brief error can look like a leader artifact defect. How: verify main-tree absolute paths, staging-only writes, slug collision, mistake-candidate presence, and prior High-risk dispositions.

Memory reads:
- `/playinganalytics/git/gobbi/.agents/skills/principles/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/mistake/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/preparation/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/manager-rm-rf-without-investigating-tracked-files.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/rawdata/draft-iter3.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/skills/codex/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- Prior iter: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/evaluation/iter2/codex/risk.md`

## Locked Frame (Stage 1)

Scenario 1: No direct project-memory write during Preparation.
- Check: generated skill is in session staging.
- Check: project skill path does not already contain `codex/SKILL.md`.
- Check: all output paths are main-tree absolute paths, not worktree-nested session paths.

Scenario 2: No RE-IDEATE trigger is hidden.
- Check: the root problem is a manager brief verification failure, not an unworkable Ideation design.
- Check: the fix is surgical and matches the locked spec.

Scenario 3: Slug collision and promotion risk are understood.
- Check: existing project skills do not include `codex`.
- Check: the staged skill path is Wrap-up-routable.

Scenario 4 (adversarial): The manager process failure repeats because it is not memorialized.
- Check: a mistake-candidate exists with what/why/how/corrected approach.
- Check: draft references the mistake-candidate.

Privacy/data retention: not applicable; no PII or external data is introduced. License/IP: not applicable for this structural stub because no external source text is incorporated.

## Per-scenario per-check results

Scenario 1:
- Yes. `find .../preparation/staging` shows the skill under `staging/skills/codex/SKILL.md`.
- Yes. `test -e .gobbi/projects/gobbi/skills/codex/SKILL.md` returned nonzero, confirming no project-memory skill exists yet.
- Yes. All evaluator writes are being produced under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/.../preparation/evaluation/iter3/codex/`.

Scenario 2:
- Yes. `draft-iter3.md:12` identifies a manager brief error and says iter3 re-derived from the locked source.
- Yes. The stub H2 and frontmatter checks now pass against the locked spec and empirical convention.

Scenario 3:
- Yes. Existing project skill names are the 16 baseline entries and do not include `codex`.
- Yes. The staged skill path matches the Preparation/Wrap-up expected shape.

Scenario 4:
- Yes. The staged decision file has frontmatter `mistake-candidate: true` and body sections `What went wrong`, `Why`, `How to recognize`, and `Corrected approach`.
- Yes. `draft-iter3.md` references the mistake-candidate in the changelog, generated-files table, and mistake-candidate cross-reference.

## Typed findings

Finding: ITER2-COD-RISK-PROMOTE-WRONG-STUB
- Type: `assumption_risk`
- Domain: `process`
- Disposition: `addressed`
- Confidence: 100
- Severity: High
- Evidence: iter2 Risk found the manager might advance a stub that failed locked H2/frontmatter gates. Iter3 gates pass and the process failure is explicitly recorded as a mistake-candidate.
- FP-check: tool-verified; no longer open.

Finding: ITER2-COD-RISK-COST-GUARDRAIL
- Type: `assumption_risk`
- Domain: `cost`
- Disposition: `addressed`
- Confidence: 100
- Severity: High
- Evidence: iter2 Risk found the cost guardrail weakened by missing H2. Iter3 restores `Cost + sandbox budget awareness` as H2 #7.
- FP-check: tool-verified.

Risk verdict: PASS. No open High or Critical advancement risk remains.

## Low-confidence appendix

None.
