# Usage Evaluation - Planning iter2

## Artifact Summary + Memory Reads

Evaluated `draft-iter2.md` from the executor/operator point of view. The usage question is whether a fresh executor can follow the plan without broken symlink recovery instructions, missing mistake files, or non-runnable shell verification.

Memory reads: `draft-iter2.md`; iter1 Codex `usage.md`; iter1 Claude `usage.md`; empirical `ls -la .claude/skills/orchestration/SKILL.md`; empirical shellcheck check; empirical rule/mistake existence checks for `stub-redirect-format.md`; project rule and listed mistakes.

## Locked Frame (Stage 1)

Scenario U1: The symlink restore recipe is usable by an executor.
- Check: `draft-iter2.md` references `../../../` for direct `SKILL.md` symlinks.
- Check: the actual adjacent symlink confirms the same depth.
- Check: the draft tells executors to verify depth against adjacent symlinks.

Scenario U2: Shell-script task verification is runnable by a fresh executor in this workspace.
- Check: `bash -n` is always run.
- Check: shellcheck absence is handled with a conditional fallback and commit note.

Scenario U3: Task 09 no longer asks an executor to load a nonexistent mistake.
- Check: `stub-redirect-format.md` exists under rules, not mistakes.
- Check: Task 09's Tier 4 mistake cell excludes that file.

Scenario U4 (adversarial): Explanatory text about removed guidance could still be mistaken for a directive.
- Check: Task 09's actual load directive remains unambiguous.

## Per-scenario Per-check Results

U1: yes. `draft-iter2.md:520` uses `ln -sfn ../../../.gobbi/projects/gobbi/skills/<path>` and includes the depth disclaimer. Empirical `ls -la /playinganalytics/git/gobbi/.claude/skills/orchestration/SKILL.md` returned `-> ../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md`.

U2: yes. `draft-iter2.md:285` and `:309` make `bash -n` always-run. `draft-iter2.md:286` and `:310` run shellcheck only if `command -v shellcheck` succeeds. Empirical shellcheck check returned `shellcheck-exit: 1`.

U3: yes. `ls /playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md` succeeded and `ls /playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/stub-redirect-format.md` failed with "No such file or directory". Task 09's Tier 4 cell at `draft-iter2.md:460` excludes it.

U4: yes with note. The Brief notes cell at `draft-iter2.md:460` still names `stub-redirect-format.md`, but only inside a parenthetical beginning "Fix 3: prior iter1 brief cited..." and ending "Task 09's executor brief does not need stub-redirect-format guidance." The Tier 4 column remains unambiguous.

## Typed Findings

### shellcheck-verifier-not-runnable

- finding-id: shellcheck-verifier-not-runnable
- type: design_flaw
- domain: test
- disposition: addressed
- confidence: 98
- severity: High
- evidence: shellcheck is absent (`shellcheck-exit: 1`), but `draft-iter2.md:285-286` and `draft-iter2.md:309-310` now give executors a runnable always-on `bash -n` gate and conditional shellcheck fallback.
- surfaced-by: codex
- inherited-from: iter1/usage-shellcheck-verifier-not-runnable

### task09-stub-rule-in-mistake-tier

- finding-id: task09-stub-rule-in-mistake-tier
- type: checklist_gap
- domain: process
- disposition: addressed
- confidence: 95
- severity: Low
- evidence: `stub-redirect-format.md` exists under rules and not mistakes; Task 09's Tier 4 cell at `draft-iter2.md:460` now names only `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`.
- surfaced-by: codex
- inherited-from: iter1/usage-task09-stub-rule-in-mistake-tier

### symlink-restore-depth-wrong

- finding-id: symlink-restore-depth-wrong
- type: design_flaw
- domain: process
- disposition: addressed
- confidence: 98
- severity: High
- evidence: Claude iter1 F-USAGE-2 was verified fixed: `draft-iter2.md:520` uses `../../../`, and the actual orchestration symlink points to `../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md`.
- surfaced-by: codex
- inherited-from: iter1/usage-F-USAGE-2

## Low-confidence Appendix

No new usage blocker found. The retained explanatory `stub-redirect-format.md` mention is acceptable because it is explicitly framed as removed guidance, not a directive.

VERDICT: PASS
