## Artifact Summary + Memory reads

Artifact under evaluation: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/preparation/rawdata/draft-iter1.md`.

What: downstream readiness guidance. Why: Planning and Execution must know which anchors to use and which files not to touch. How: corrected anchors, split-anchor instructions, edit mechanics, and non-blocking gap notes.

Memory reads: readiness report; locked Idea; live target files; `chat-mode.md`; `orchestration/SKILL.md`; executor role prompt.

## Locked Frame (Stage 1)

Scenario 1: The Planning leader can start without asking for missing readiness decisions.
- Check: Corrected anchors are explicit.
- Check: C1 split-anchor handling is explicit.
- Check: Scope and edit paths are explicit.

Scenario 2: The Execution executor can apply the report without touching mirrors incorrectly.
- Check: Canonical `.gobbi/...` paths are used for skill docs.
- Check: `.claude/CLAUDE.md` is treated as a real file.
- Check: Edit fallback is documented.

Scenario 3 (adversarial): A consumer uses `chat-mode.md` for Stuck or Regression and stalls.
- Check: The report explicitly says not to use `chat-mode.md` for those two anchors.

## Per-scenario per-check results

Scenario 1: pass. Corrected anchors are listed at `draft-iter1.md:92-110`; C1 handling is at `draft-iter1.md:86`; scope is at `draft-iter1.md:17`.

Scenario 2: pass. The target type check confirms `.claude/skills/orchestration/auto-mode.md` and `.claude/skills/orchestration/workflow/evaluation.md` are symlinks, while `.claude/CLAUDE.md` is a regular file. The report captures the same rule at `draft-iter1.md:68-70`.

Scenario 3: pass. `chat-mode.md` has no real Stuck or Regression branch; the report tells Planning to anchor those to `workflow/evaluation.md` at `draft-iter1.md:86` and `draft-iter1.md:110`.

## Typed findings

No Usage finding.

## Low-confidence appendix

None.
