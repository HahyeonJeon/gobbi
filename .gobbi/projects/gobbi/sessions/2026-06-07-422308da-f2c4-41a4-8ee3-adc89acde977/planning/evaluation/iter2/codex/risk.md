# Planning Eval Iter 2 - Risk (codex)

## Artifact Summary + Memory Reads

Evaluated blast radius and rollback risk for the revised docs-only plan. Read the locked Idea, readiness report, prior iter findings, project mistakes, and live target files.

## Locked Frame

Scenario R1: final T4 cannot falsely pass while a locked Idea item is missing.
- Check: every locked cross-reference update has both an edit task and a verification task.

Scenario R2: out-of-scope files stay read-only.
- Check: `orchestration/SKILL.md` and `chat-mode.md` are verify-only.
- Check: T4 checks section names rather than brittle line 247.

Scenario R3: safety gates are not silenced.
- Check: classification preserves the six safety gates and mode-splits only the three routine-triage sites.

## Results

R1: FAIL. T4 can pass while `workflow/evaluation.md` lacks the locked Cross-references row to `auto-mode.md section 7`.

R2: PASS. The revised operative instructions keep `orchestration/SKILL.md` and `chat-mode.md` read-only and check the `SKILL.md` pointer by stable section names.

R3: PASS. The revised classification preserves safety gates and mode-splits routine triage only. Live `evaluation.md` grep confirms the plan's 3 routine + 6 safety site inventory covers actual escalation sites; the extra `AskUserQuestion` hit at line 125 is a transcript-preservation sentence for the already-classified major-divergence decision, not a separate escalation.

## Findings

### COD-RISK-ITER2-001

Type / Domain / Confidence(0/25/50/75/100) / Severity / Evidence(file:line) / Why-it-matters / Suggested-direction

`assumption_risk` / `verification-risk` / `100` / `High` / `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/artifacts/idea.md:177`; `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/planning/rawdata/draft-iter1.md:133`; `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/planning/rawdata/draft-iter1.md:141`; `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/planning/rawdata/draft-iter1.md:216` / The final verification task can produce a false PASS for cross-file consistency because it never checks the locked `workflow/evaluation.md -> auto-mode.md section 7` reciprocal reference. This is the same class as the co-touch enumeration mistake: one citation direction is checked, the semantic reciprocal is missed. / Add a T4 check for the reciprocal row and include the row in T1's edit contract.

## Low-confidence Appendix

No low-confidence Risk findings.
