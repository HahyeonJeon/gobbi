# Overall - Codex Evaluation

## Synthesis

The artifact gets the central symlink/security direction mostly right: official docs support the install-copy behavior, escaping-symlink skip rule, plugin-root component placement, `skills` directory pointer, `hooks/hooks.json`, marketplace schema shape, and `${CLAUDE_PLUGIN_ROOT}`. DD-2's rejection of the `.claude/` symlink mirror is internally coherent.

The draft still needs revision before Planning. It contains a false prior-art claim: there was a prior `.claude-plugin` marketplace and `plugins/gobbi-core` plugin package in git history. It also generalizes the skills directory-pointer model to agents without proving that a directory is valid for the `agents` manifest key, omits worktree-local install behavior that can test the wrong checkout, and does not bound what repo-root marketplace install copies into cache. Permissions and hook double-registration are flagged, but not converted into planning-ready scenarios.

## Findings Rollup

- P1: High / 100 - prior `.claude-plugin` package history missed.
- S1: High / 75 - `agents` path as directory may violate or under-specify the Claude plugin schema.
- PERF1: Medium / 75 - repo-root cache-copy payload has no budget.
- A1: Medium / 100 - ratified/proposed state labels conflict.
- U1: High / 75 - worktree-local install scenario missing.
- U2: Medium / 75 - permissions disposition is not user-operable.
- C1: Low / 75 - skill inventory is not synchronized with the canonical source path.
- R1: High / 75 - repo-root install may copy session memory into plugin cache.
- R2: Medium / 75 - double-registration is surfaced but remains a real design hole.

## Verdict Rationale

Threshold rule: any High finding with confidence >= 50 yields REVISE. This evaluation has multiple High-confidence revision drivers, but no Critical finding at confidence >= 75. The design direction should not be discarded; it should be revised to account for missed prior art, exact agent path shape, worktree install validation, payload/cache boundaries, permissions, and hook replacement/coexistence.

VERDICT: REVISE
