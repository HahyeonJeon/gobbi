# Project Perspective - Codex Evaluation

## Artifact Summary + Memory reads
Commit `0632ad8` implements T03 / CL-3, a documentation change to `mistake/SKILL.md` plus the hooks-domain backlog. What: add `hooks` domain examples, replace the `{session-id}` row with locked M2 wording, remove the non-existent `gobbi mistake promote` command from the mistake skill, qualify project-memory write rules with the Wrap-up assistant exception, and update the hooks watchlist. Why: the plan addendum records the user correction that the CLI command does not exist and folds the fix into T03. How: edit the two in-scope markdown files and verify with commit diff, grep, and full-file close reading.

Memory reads: evaluator prompt at `execution/task-03/rawdata/codex-eval-prompt-iter1.md`; executor draft at `execution/task-03/rawdata/draft-iter1.md`; planning `plan.md` and `plan-addendum-2026-05-25.md`; `.claude/skills/mistake/SKILL.md`; `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md`; relevant project mistakes `evaluator-returned-verdict-inline-no-per-perspective-files.md`, `codex-eval-session-write-path-nested-in-worktree.md`, `codex-wrapper-relative-path-wrong-session-write.md`, `codex-subprocess-writes-to-main-tree.md`, `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`; project rule `stub-redirect-format.md` (not applicable: no stub redirect created).

## Locked Frame (Stage 1)
Scenario: Contract A-E is fulfilled.
- Check A: `hooks` appears in both domain-tag example locations.
- Check B: the `{session-id}` row includes the three locked M2 clauses.
- Check C: no literal `gobbi mistake promote` remains in `mistake/SKILL.md`, and staging-to-promotion is preserved.
- Check D: direct-project-memory write prohibitions are qualified by the Wrap-up assistant exception.
- Check E: the backlog status and clarifiers match the requested update.

Scenario: Scope stays inside the T03 contract.
- Check: `git diff --name-only 0632ad8~1 0632ad8` lists exactly the two in-scope files.
- Check: no session state, `CLAUDE.md`, gobbi skill, wrap-up skill, orchestration skill, sweep skill, or unrelated backlog is changed by the commit.

Scenario: Required verification commands were run freshly.
- Check: each command in the evaluator prompt has current output.
- Check: full edited files were read, not only grepped.

Scenario: A grep-passing rewrite is semantically wrong (adversarial).
- Check: the text attributes promotion to Wrap-up-phase agents, not a CLI.
- Check: the staging-to-promotion model remains internally coherent.
- Check: the Wrap-up assistant exception is not contradicted elsewhere in the file.

## Per-scenario per-check results
Contract A: PASS. `grep -nE '\bhooks\b' .claude/skills/mistake/SKILL.md` returned lines 63 and 90, covering P1 step 3 and P3 step 5.

Contract B: PASS. The `{session-id}` row at `.claude/skills/mistake/SKILL.md:129` says the ID is supplied by the delegation prompt's `session-id:` header field, says not to read `$CLAUDE_CODE_SESSION_ID`, and explains that spawned subagents see their own UUID rather than the parent session's.

Contract C: PASS. `grep -c 'gobbi mistake promote' .claude/skills/mistake/SKILL.md` printed `0`. Promotion is now described at lines 11, 27, 45-47, and 94-96 as Wrap-up assistant promotion with no CLI command. The output path table at lines 117-124 still preserves session staging and project/feature mistake destinations.

Contract D: PASS. The direct-write hits at lines 3, 11, and 105 are all qualified with working-loop language and the Wrap-up assistant exception. The memory matrix rows at lines 21-23 also qualify read-only status for working-loop agents while preserving Wrap-up promotion.

Contract E: PASS. The backlog has `status: in-progress` at line 3, the perpetual capture reminder at line 34, and the N>=2 extraction trigger at line 38.

Scope: PASS. `git diff --name-only 0632ad8~1 0632ad8` returned exactly `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` and `.gobbi/projects/gobbi/skills/mistake/SKILL.md`.

Required commands: PASS. All evaluator-prompt commands were run. Full-file reads with line numbers were also run for both edited files.

Adversarial semantic check: PASS. The rewrite does not merely remove the literal; it consistently replaces the command model with Wrap-up-phase promotion and preserves the staged source plus project/feature-memory destinations.

## Typed findings
No findings.

Reason: the change fully satisfies the stated A-E contract and stays inside the two-file T03 scope.

## Low-confidence appendix
None.
