# Usage - Preparation readiness report eval (iter2, codex)

## Artifact Summary + Memory Reads

Artifact under evaluation: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/preparation/rawdata/draft-iter1.md`.

What: downstream instructions for Planning and Execution. Why: the next agents need to know exact anchors, writable paths, and non-blocking caveats. How: anchor table, support anchors, edit mechanics, and decisions log.

Memory reads: corrected report; locked Idea; target files; symlink checks; executor role prompt and execution/preparation skills; consistency files.

## Locked Frame (Stage 1)

Scenario 1: Planning can start without asking for missing readiness decisions.
- Check: The current base and #295 collision analysis are explicit.
- Check: G2 manager-job line correction is explicit.
- Check: C1 chat-mode split-anchor guidance is explicit.
- Check: Support anchors are explicit.

Scenario 2: Execution can edit the right files.
- Check: The report names canonical `.gobbi/...` paths for skill docs.
- Check: It treats `.claude/CLAUDE.md` as a real file.
- Check: It confirms the executor role has Edit through an appropriate role or skill contract.

Scenario 3 (adversarial): A stale verify-only line number misleads the Planner.
- Check: Any stale line number is not an edit target and is easy to correct by searching the target phrase.

## Per-scenario Results

Scenario 1: pass. The report gives current base at `draft-iter1.md:19`, the corrected G1 at `draft-iter1.md:53-65`, G2 at `draft-iter1.md:38` and `draft-iter1.md:122`, C1 at `draft-iter1.md:105`, and support anchors at `draft-iter1.md:138-139`.

Scenario 2: pass. The symlink guidance at `draft-iter1.md:86-88` matches live files: `.claude/CLAUDE.md` is a regular file, while `.claude/skills/orchestration/auto-mode.md` and `.claude/skills/orchestration/workflow/evaluation.md` are symlinks to `.gobbi/...`. The executor role prompt also lists `tools: Read, Grep, Glob, Bash, Write, Edit`.

Scenario 3: pass with the Consistency finding below. The stale `orchestration/SKILL.md:247` row can waste a lookup, but the pointer content remains present at line 266 and the report does not ask the executor to edit that file.

## Typed Findings

No Usage findings.

## Low-confidence Appendix

None.
