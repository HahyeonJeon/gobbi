## Artifact Summary + Memory reads

Artifact under evaluation: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/preparation/rawdata/draft-iter1.md`.

What: a readable readiness report. Why: Planning must consume it without misreading anchor or gap status. How: concise sections plus an anchors table and decisions log.

Memory reads: preparation draft; locked Idea; live target and consistency files; main-tree and worktree `.claude/CLAUDE.md` for G1.

## Locked Frame (Stage 1)

Scenario 1: The report is readable and scannable.
- Check: The summary names the verdict and the two gap notes.
- Check: The anchors table is concise.
- Check: Section names match the Preparation template.

Scenario 2 (adversarial): The report overstates a gap and causes avoidable downstream concern.
- Check: G1 describes only real drift between main tree and worktree.
- Check: Any factual overstatement is minor and does not change Planning/Execution behavior.

## Per-scenario per-check results

Scenario 1: pass. The summary is at `draft-iter1.md:19-21`; the anchors table is at `draft-iter1.md:92-110`; section names are clear.

Scenario 2: partial. G1 correctly identifies the main-tree Continue-vs-Fresh sentence as merge-time drift. It overstates the nav-row part: the `[claude skill]` row is present in both the worktree `.claude/CLAUDE.md:57` and the main-tree `/playinganalytics/git/gobbi/.claude/CLAUDE.md:57`, so only the Continue-vs-Fresh sentence is actual main-tree-only drift.

## Typed findings

Finding AEST-001

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`general` / `docs-sync` / `100` / `Low` / `draft-iter1.md:47`, `draft-iter1.md:78`, `.claude/CLAUDE.md:57`, `/playinganalytics/git/gobbi/.claude/CLAUDE.md:57` / G1 says the main tree gained both a Continue-vs-Fresh sentence and a nav row, but the nav row is already present in the worktree too. This slightly overstates merge drift. It does not affect the edit target at `.claude/CLAUDE.md:27` and does not block Planning or Execution. / Narrow G1 to the real main-tree-only drift: the Continue-vs-Fresh sentence at `/playinganalytics/git/gobbi/.claude/CLAUDE.md:31`.

## Low-confidence appendix

None.
