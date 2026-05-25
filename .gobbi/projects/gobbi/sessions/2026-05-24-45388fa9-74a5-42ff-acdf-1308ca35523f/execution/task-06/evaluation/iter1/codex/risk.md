## Artifact Summary + Memory reads

Evaluated commit `a8968f8` under the Risk lens. Memory reads included `plan.md:641-651`, `plan.md:734-739`, the full diff name list, the excluded-file diff checks, and the current `gobbi/SKILL.md` CCSI hits.

## Locked Frame (Stage 1)

Scenario: blast radius is exactly 11 files.
- Check: changed-file count is 11.
- Check: changed files are the 10 target skills plus the f-risk backlog.

Scenario: excluded files remain untouched.
- Check: no diff for `mistake/SKILL.md`, `gobbi/SKILL.md`, or parent `orchestration/SKILL.md`.

Scenario (adversarial): anti-game invariant is broken by removing legitimate CCSI mentions from `gobbi/SKILL.md`.
- Check: `gobbi/SKILL.md` still has at least three CCSI mentions.

## Per-scenario per-check results

Pass. `git diff --name-only a8968f8~1 a8968f8 | wc -l` returned `11`. The excluded-path grep returned no results, and direct diffs for `gobbi/SKILL.md`, `mistake/SKILL.md`, and parent `orchestration/SKILL.md` were empty. `gobbi/SKILL.md` has three CCSI mentions at lines 38, 52, and 63.

## Typed findings

No findings. The blast radius is bounded and the anti-game invariant holds.

## Low-confidence appendix

None.
