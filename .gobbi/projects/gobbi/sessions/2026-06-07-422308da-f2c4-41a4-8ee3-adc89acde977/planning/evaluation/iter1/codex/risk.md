## Artifact Summary + Memory reads

The plan has low implementation blast radius because it is docs-only and limits edits to three files. Risk review focuses on what breaks if the plan is wrong: false verification failures, scope leakage pressure, and missed locked doc updates.

Memory reads: plan, locked Idea, readiness report, live target/read-only files, planning evaluation frame, and mistakes about false PASS, stale anchors, section order, and retire-without-replacement.

## Locked Frame (Stage 1)

Scenario R1: mid-plan failure leaves a clear recovery path.
- Check: each edit task touches one file.
- Check: T4 is read-only and cannot mutate scope.

Scenario R2: stale verification anchors do not pressure out-of-scope edits.
- Check: read-only files are verified by content and correct live anchor.
- Check: no task asks an executor to make a false read-only criterion true.

Scenario R3 (adversarial): a missing locked cross-reference ships because behavioral edits passed.
- Check: final T4 covers reciprocal cross-reference drift, not only behavior text.

## Per-scenario per-check results

R1: PASS. The edit tasks are small and sequenced.

R2: FAIL. The stale SKILL.md line anchor can cause a false failure in T4.

R3: FAIL. The evaluation.md reciprocal Cross-references row is not assigned or verified.

## Typed findings

### COD-RISK-001

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`assumption_risk` / `verification-risk` / `100` / `High` / T4 assumes `orchestration/SKILL.md:247` contains the Auto Mode §3/§6 pointer (`planning/rawdata/draft-iter1.md:135`), but the live file places it at line 266 (`.gobbi/projects/gobbi/skills/orchestration/SKILL.md:263`-`266`). / The final verification task can report failure even when Execution made the correct in-scope edits. That creates avoidable risk of out-of-scope churn or a false REVISE. / Correct the anchor before Execution; verify content at line 266 or via section search.

### COD-RISK-002

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`checklist_gap` / `content-loss-risk` / `100` / `High` / The Idea's evaluation.md Cross-references row (`ideation/artifacts/idea.md:177`) has no corresponding T1/T4 acceptance gate (`planning/rawdata/draft-iter1.md:68`-`75`, `planning/rawdata/draft-iter1.md:133`-`139`). / The final state can pass the plan while omitting a locked mutual-link update. That is a docs-sync regression, not a runtime risk. / Add the reciprocal Cross-references update and verify it in T4.

## Low-confidence appendix

No low-confidence risk findings.
