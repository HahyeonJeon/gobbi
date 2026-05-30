# Risk - Planning iter2 Evaluation (Codex)

## Artifact Summary
The artifact is `draft-iter2.md`, a Planning iter2 execution contract for spec, settings, template, backlog, and archive work. What: it should reduce execution risk by making task order, file scope, verification, and no-bleed constraints explicit. Why: Planning iter1 had open High findings that could block or misdirect executors. How: iter2 removes the absent `claude` skill, removes stale plugin mirror work, converts comments into assertions, captures pre-edit revisions, adds pre-flight symlink checks, and changes diff baselines to `develop..HEAD`.

## Memory reads
- `/playinganalytics/git/gobbi/.agents/skills/principles/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/mistake/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/planning/evaluation.md`
- `/playinganalytics/git/gobbi/.agents/skills/orchestration/workflow/planning.md`
- `/playinganalytics/git/gobbi/.agents/skills/gobbi/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/git/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/design-literal-retire-instruction-without-replacement.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter2.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`
- All eight files under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json`

## Locked Frame (Stage 1)
Scenario 1: Verification commands enforce the intended safety properties.
- Check: count/value assertions fail on wrong values and pass on correct values.
- Check: selectors target the exact invariant, not unrelated sibling fields.
- Check: no-bleed checks catch protected-file edits.

Scenario 2: Special Focus A - PRE_T4_REV / PRE_T5_REV baseline capture.
- Check: each baseline is captured before edit.
- Check: the downstream command re-reads the same captured SHA.
- Check: `awk '{print $NF}'` extracts the SHA from the written line.
- Check: the storage path survives shell session boundaries without creating unsafe collision risk.

Scenario 3: Rollback and interruption boundaries remain coherent.
- Check: each task has bounded file scope.
- Check: T6 archive waits for the closing tasks.
- Check: stale plugin mirror paths do not create false NEEDS_CONTEXT.

Scenario 4 (adversarial): The acceptance gate can pass while a protected block changed.
- Check: T4's `models.*` guard actually compares the whole `models` block, not just lines containing the literal string `"models"`.
- Check: a wrong baseline cannot make a diff-based guard compare against the wrong tree state.

Coverage declarations:
- Privacy/data handling: task-record content stays session-local; T1 carries D-A/D-B.
- Cost/paid-API: no paid calls.
- Supply chain: no dependencies.
- Error budget: false verification is the main risk.

## Evaluation (Stage 2)
Scenario 1 result:
- No. T4's mode assertion false-fails valid output because it recursively includes nested `discuss.mode` and `evaluate.mode` values.

Scenario 2 result:
- Partial. The baseline capture occurs before the edit in T4 line 262 and T5 line 309. `awk '{print $NF}'` correctly extracts the SHA from `Pre-T4 rev = <sha>` and `Pre-T5 rev = <sha>`. `/tmp` also survives different shell invocations. The risk is that `/tmp/t4-pre.txt` and `/tmp/t5-pre.txt` are global, non-session-scoped filenames; a parallel session, retry, or unrelated executor can overwrite them before the downstream diff runs.

Scenario 3 result:
- Yes. File scopes are bounded; T6 is sequenced after the close-producing tasks; plugin mirror work is removed.

Scenario 4 result:
- No. The T4 models guard at line 269 only greps changed diff lines containing the literal `"models"`. A nested model assignment change such as `"executor": "sonnet"` would not contain the string `"models"` on the changed line, so the guard can pass while the protected `models.*` block changed.

Inherited finding disposition table:

| Finding ID | Current disposition | Evidence |
|---|---|---|
| codex-risk-001 | superseded | Binary assertions replaced the non-failing comments, but the T4 mode assertion is now semantically wrong. Superseded by `codex-risk-004`. |
| codex-risk-002 | superseded | `<pre-T4-rev>` and `<pre-T5-rev>` are captured, but the `/tmp` storage is collision-prone. Superseded by `codex-risk-005`. |
| codex-risk-003 | addressed | The plugin mirror NEEDS_CONTEXT trap is removed; iter2 line 560 explicitly says no plugin-side mirroring is required. |

Typed findings:

### codex-risk-004
- Type: design_flaw
- Domain: verification
- Confidence: 100
- Severity: High
- Evidence: `draft-iter2.md:265` asserts recursive `.mode` values equal `auto,chat,`. The current settings template already returns nested values (`agent,always,auto,user,`) with the same selector, and a correct two-default-set output must retain nested discuss/evaluate modes. This can block a valid implementation.
- Disposition: open

### codex-risk-005
- Type: assumption_risk
- Domain: verification
- Confidence: 75
- Severity: Medium
- Evidence: `draft-iter2.md:262` and `309` write pre-edit SHAs to `/tmp/t4-pre.txt` and `/tmp/t5-pre.txt`; lines 269, 316, and 318 read them back. The filenames are not session-, worktree-, or process-scoped. `/tmp` is shared across shell invocations and commonly shared across concurrent sessions on the same machine, so a collision can make the diff compare against the wrong baseline.
- Disposition: open

### codex-risk-006
- Type: checklist_gap
- Domain: verification
- Confidence: 100
- Severity: High
- Evidence: T4 success criteria require the `models.*` block to be byte-for-byte unchanged, but `draft-iter2.md:269` only counts changed diff lines containing `"models"`. Changes inside the block to `"manager"`, `"executor"`, `"evaluator"`, or role values do not necessarily include the string `"models"` and can evade the guard.
- Disposition: open

## Low-confidence appendix
None.

VERDICT: REVISE
