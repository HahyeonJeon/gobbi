# Risk Perspective - Codex Evaluation

## Artifact Summary + Memory reads

The main risk surfaces are cache payload/privacy, hook double-registration, symlink-skip behavior, worktree source resolution, and rollback/uninstall behavior. I verified the current `.claude/settings.json` hook blocks, hook scripts, current docs for plugin cache behavior, and the git prior art.

## Locked Frame (Stage 1)

- Scenario: installed plugin cache excludes session memory and project memory.
- Scenario: project-local and plugin-provided hooks cannot both fire unintentionally.
- Scenario (adversarial): a fix for one install failure introduces duplicate runtime hooks or stale cache payload.

## Per-scenario per-check results

- R1 is resolved by the bounded package plus explicit cache allow-set gate.
- R2 is now an explicit Planning blocker with options and a fire-exactly-once validation across all three hook registrations.
- Hook count is corrected to two scripts across three registrations, matching current `.claude/settings.json`.

## Iter-1 Finding Status

### R1 - Repo-root install may copy session memory into the global plugin cache: RESOLVED

- Evidence: `draft-iter2.md:58-61` replaces repo-root with a bounded package; `draft-iter2.md:81-83` requires post-install cache enumeration with no `.gobbi/.../sessions`, project memory, or repo content; `draft-iter2.md:309-317` explicitly cites the 77M sessions tree as the rejected risk.
- Assessment: The privacy/payload risk is no longer a hidden assumption. The remaining package source-path ambiguity is captured as STRUCT-1.

### R2 - Double-registration is surfaced, but still a real design hole: RESOLVED

- Evidence: `draft-iter2.md:370-381` elevates hook double-registration to DD-8, marks it as a Planning blocker, lists options A/B/C, recommends Option A, and requires exactly-once validation. Current `.claude/settings.json` confirms three project-local registrations, and `draft-iter2.md:330-338` requires the plugin `hooks/hooks.json` to reproduce those three.
- Assessment: The decision is not made yet, but it is now explicitly blocking Planning with concrete options and validation. That satisfies the iter-1 requested resolution for an Ideation artifact.

## Typed findings

None.

## Low-confidence appendix

None.
