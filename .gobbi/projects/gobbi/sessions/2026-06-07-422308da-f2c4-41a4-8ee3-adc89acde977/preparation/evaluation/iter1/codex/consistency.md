## Artifact Summary + Memory reads

Artifact under evaluation: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/preparation/rawdata/draft-iter1.md`.

What: cross-file readiness verification. Why: stale or missing anchors would cause Planning/Execution to edit the wrong section or miss a live citation. How: compare the report's claims against live target files, the locked Idea, and consistency files.

Memory reads: readiness report; locked Idea; `auto-mode.md`; `workflow/evaluation.md`; `.claude/CLAUDE.md`; `chat-mode.md`; `orchestration/SKILL.md`; project mistakes.

## Locked Frame (Stage 1)

Scenario 1: Every report anchor is accurate.
- Check: `auto-mode.md:78`, `auto-mode.md:208`, `auto-mode.md:251`, and `auto-mode.md:271` match.
- Check: `workflow/evaluation.md:5`, `:119`, `:188-199`, `:239`, `:242-249`, and `:253-258` match.
- Check: `.claude/CLAUDE.md:27` matches.
- Check: `orchestration/SKILL.md:247` still points to Auto §3 and §6.

Scenario 2: C1 split-anchor characterization is accurate.
- Check: `chat-mode.md` is silent on Stuck detection and Regression marking.
- Check: `chat-mode.md` has parallels for cap exhaustion and after-EVALUATION discussion.
- Check: Stuck and Regression can cite `workflow/evaluation.md` existing behavior.

Scenario 3 (adversarial): The report claims full Idea coverage but misses a cited support reference.
- Check: Every support mistake and cited existing behavior the Idea uses is included or the omission is harmless and flagged.

## Per-scenario per-check results

Scenario 1: pass. All report anchor rows checked out. The G2 correction is right: the manager-job sentence is at `workflow/evaluation.md:5`, while line 4 is blank. Auto §6 is at `auto-mode.md:251` and Cross-references begin at `auto-mode.md:271`, so a trailing §7 before Cross-references renumbers no existing section. `orchestration/SKILL.md:247` still references Auto §3 and §6.

Scenario 2: pass. `chat-mode.md` only hits `regression` at line 563 in unrelated settings prose and has no `stuck` rule. It has cap-exhaustion escalation at `chat-mode.md:154` and `chat-mode.md:237`, plus after-EVALUATION discussion at `chat-mode.md:298`. The report's C1 correction at `draft-iter1.md:86` is accurate.

Scenario 3: partial. The report omits two non-blocking support checks from the locked Idea: `workflow/evaluation.md:42` and `mistakes/manager-skipped-dual-system-eval.md`. Both live references exist, so this does not change readiness. It does mean the report's "all five mistakes the Idea relies on" framing is incomplete.

## Typed findings

Finding CONS-001

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`checklist_gap` / `docs-sync` / `100` / `Medium` / `idea.md:47-48`, `idea.md:123`, `idea.md:157`, `draft-iter1.md:53-58`, `workflow/evaluation.md:42`, `.gobbi/projects/gobbi/mistakes/manager-skipped-dual-system-eval.md:1` / The readiness report verifies five mistakes but the locked Idea also relies on `manager-skipped-dual-system-eval.md` and the existing `workflow/evaluation.md:42` "spawns exactly two evaluator agents" sentence. A Planner using only the readiness report could miss that support citation. The live file and mistake exist, so this is not a blocker. / Add `manager-skipped-dual-system-eval.md` to mistake coverage and add `workflow/evaluation.md:42` to the corrected anchors table or support-anchor notes.

## Low-confidence appendix

None.
