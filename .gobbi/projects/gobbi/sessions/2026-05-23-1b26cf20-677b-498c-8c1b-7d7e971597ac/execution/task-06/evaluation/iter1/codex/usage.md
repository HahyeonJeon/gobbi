# Usage Perspective - Task 06 iter1 Codex

## Artifact Summary (Stage 0)

Commit `32b9adc6ad4b227aca642394d4202cb33dda57ae` documents how a future manager/operator should opt out of row 5.5 worktree creation and how to smoke-test the generated branch name after merge. The user-facing success condition is operational: a tired future manager should know what setting to use and what command proves the branch shape.

## Memory reads

Same Stage 0 register as `project.md`, plus `settings.default.json` git block and command checks demonstrating `jq '.git.branch'` outputs a quoted JSON string while `jq -r '.git.branch' | grep -E ...` matches the intended regex.

## Locked Frame (Stage 1)

Scenario U1 - Direct-mode opt-out must be actionable by the operator.
- Check U1.a: the setting path named by the docs exists or is otherwise clearly defined.
- Check U1.b: the two legitimate direct-mode cases are stated.
- Check U1.c: the behavior of branch and worktreePath is clear.

Scenario U2 - The smoke test must be runnable as a gate.
- Check U2.a: the command exits non-zero on mismatch or gives an exact pipe that can do so.
- Check U2.b: the command output shape matches the documented regex.
- Check U2.c: the worktreePath check is similarly concrete.

Scenario U3 (adversarial) - A user following the docs literally should not get false confidence or false failure.
- Check U3.a: literal copy/paste detects bad branches.
- Check U3.b: literal copy/paste does not fail a valid branch due JSON quoting.

Coverage: accessibility is satisfied by direct headings; i18n is not applicable to this operator doc.

## Results (Stage 2)

- U1.a: no. The new prose says `settings.git.workflow.mode == "direct"` (lines 109 and 116), but the worktree `settings.default.json` git block contains only `repo`, `baseBranch`, `pr`, `issue`, `worktree`, and `branch`; `rg` finds no `direct`, `worktree-pr`, or git workflow mode in the settings template.
- U1.b: yes. Emergency hotfix and pure-read session are stated.
- U1.c: yes. The docs say row 5.5 is skipped, P2 is not invoked, `worktreePath` remains null, and `git.branch` is stamped from HEAD.
- U2.a: no. The documented command is only `jq '.git.branch' <session.json>`; it has no regex assertion and exits zero for any existing branch value.
- U2.b: no. `jq '.git.branch'` prints `"chore/session-2026-05-24-1b26cf20"` including quotes; a literal grep against `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$` fails. `jq -r` is needed if the docs intend grep-based matching.
- U2.c: partial. It says verify non-null, but gives no command form such as `jq -e '.git.worktreePath != null'`.
- U3.a: no. There is no copy/paste gate for mismatch.
- U3.b: no. A valid branch fails if the operator pipes the documented `jq` output directly to the documented regex.

## Findings

### COD-USAGE-T06-001 - Direct-mode setting is not actionable from the settings template

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: orchestration/SKILL.md line 109 says `settings.git.workflow.mode == "direct"` and line 116 says the opt-out is a user-level setting. Worktree `orchestration/templates/settings.default.json` lines 47-54 define `git.repo`, `git.baseBranch`, `git.pr`, `git.issue`, `git.worktree`, and `git.branch`, with no workflow mode key. `rg` over that template finds no `direct` or `worktree-pr`.
- Why it matters: the Task 06 deliverable is the direct-mode opt-out documentation. Naming a setting that is not present in the settings template makes the documented opt-out non-actionable for the next user.
- FP check: not pre-existing as a T06 finding because this commit adds the new user-facing opt-out prose at lines 109 and 116. Even if row 5.5 already had related vocabulary, Task 06 is the moment this becomes the documented escape hatch.

### COD-USAGE-T06-002 - Smoke-test gate prints a value but does not test it

- Type: `design_flaw`
- Domain: `test`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: orchestration/SKILL.md lines 120-126 say "Run this check" but the code block is only `jq '.git.branch' .gobbi/projects/gobbi/sessions/<latest>/session.json`. Tool check: `printf '{"git":{"branch":"chore/session-2026-05-24-1b26cf20"}}' | jq '.git.branch'` returns `"chore/session-2026-05-24-1b26cf20"`, and piping that to the documented anchored regex fails; `jq -r '.git.branch' | grep -E '^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$'` succeeds.
- Why it matters: a "gate" should fail closed. As written, it neither exits non-zero on mismatch nor emits raw output that matches the provided regex.
- FP check: not a style preference; it changes the operational verification outcome.

## Verdict

REVISE

## Low-confidence appendix

None.
