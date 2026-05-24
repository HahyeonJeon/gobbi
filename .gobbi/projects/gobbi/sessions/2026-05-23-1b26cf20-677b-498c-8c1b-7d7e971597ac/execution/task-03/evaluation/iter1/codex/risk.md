## Artifact Summary

Task 03 evaluates commit `6f1df8c34369f9fed7e2f4e5ab309ef23ac2a759` in worktree `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/268-session-foundations-bundle-b`. What: extend `.gobbi/projects/gobbi/skills/preparation/SKILL.md` so the Preparation `generate-now` narrow exception includes a `git -C "$worktreePath"` add/commit path, the AI provenance trailer form, and rollback via `git -C "$worktreePath" rm` plus AskUserQuestion. Why: Planning Task 03 and LOCK #4 require the promote-now path to survive worktree sessions and to remove copied files on failed commit instead of using checkout. How: one prose insertion after the generated-skills exception, visible through the `.claude/skills/preparation/SKILL.md` symlink.

Memory reads: evaluation prompt at `execution/task-03/evaluation/iter1/codex/eval-prompt.md`; project rule `rules/stub-redirect-format.md`; mistakes `codex-rescue-agent-fire-and-forget-without-result-capture.md`, `codex-eval-session-write-path-nested-in-worktree.md`, and `evaluator-returned-verdict-inline-no-per-perspective-files.md`; execution evaluation child doc `.agents/skills/execution/evaluation.md`; planning task in `planning/artifacts/plan.md:78-94`; locked design `ideation/staging/design/d-3-promote-now-commit-on-branch.md`; planning decision `planning/staging/decisions/rollback-semantics-drift-from-ideation.md`; git trailer convention `.agents/skills/git/conventions.md:118`.

## Locked Frame (Stage 1)

Scenario: Rollback removes copied files safely.
- Check: failed post-copy commit uses `git -C "$worktreePath" rm <copied-paths>`.
- Check: rollback does not use `git checkout`.
- Check: user decision is requested before retry or abort.

Scenario: Audit trail survives generated-skill promotion.
- Check: command sequence stages the skill body and symlinks.
- Check: commit subject names the promoted skill and preparation iteration.
- Check: AI-Provenance-Record is actually written as a commit trailer/body line.

Scenario: Session writes land in the main-tree evaluation path (adversarial).
- Check: evaluator output is written under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/...`.
- Check: output is not written under any `worktrees/.../.gobbi/projects/.../sessions` path.

Scenario: Privacy, license, and security surfaces.
- not-applicable: no user data, third-party code, dependency, auth, input parsing, or executable runtime surface is changed. The risk surface is workflow/audit correctness.

## Stage 2 Evaluation

Rollback:
- yes: line 71 uses `git -C "$worktreePath" rm <copied-paths>`.
- yes: line 71 explicitly rejects `git checkout`.
- yes: line 71 says the manager surfaces failure via AskUserQuestion before retrying.

Audit trail:
- yes: line 66 stages the skill body and both symlinks.
- yes: line 67 names the subject form.
- no: line 67 does not show the second body `-m` or `--trailer` mechanism needed to ensure `AI-Provenance-Record` becomes part of the commit object. It only displays the trailer after prose.

Session-write path:
- yes: this Codex evaluation marker and artifacts are being written under the absolute main-tree path named in the prompt.
- yes: no output has been written to the task worktree's nested `.gobbi/projects/gobbi/sessions` path.

Risk surfaces:
- yes: no executable code, dependency, or data-flow surface is modified.

## Findings

Finding R1: promoted-skill commits can lose the required audit trailer if the displayed command is followed literally.
- Type: `assumption_risk`
- Domain: `process`
- Confidence: 75
- Severity: High
- Evidence: the implemented command at `preparation/SKILL.md:67` has one subject `-m`; the locked D-3 command at `d-3-promote-now-commit-on-branch.md:18-21` uses a second `-m "AI-Provenance-Record: ..."` to write the commit body. `git/conventions.md:118` requires `AI-Provenance-Record:` on every agent-authored commit.
- Disposition: open

## Verdict: REVISE

Rollback risk is addressed, but provenance/audit risk remains because the command shape can omit the required trailer.

## Low-confidence appendix

None.
