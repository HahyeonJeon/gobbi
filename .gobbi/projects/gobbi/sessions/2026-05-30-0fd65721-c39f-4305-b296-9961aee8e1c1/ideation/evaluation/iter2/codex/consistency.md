# Consistency Perspective - Codex Evaluation

## Artifact Summary + Memory reads

I checked cross-artifact coherence between the revised draft, staged references, project mistakes, current symlink layout, current hooks/agents, and git history. The central consistency issue is the new materialized package-copy surface: the draft names it, but its validation is weaker than the failure mode.

## Locked Frame (Stage 1)

- Scenario: every design decision cites a matching reference or ground-truth repo fact.
- Scenario: materialized package copies stay synchronized with canonical skills/agents/hooks.
- Scenario (adversarial): a stale copied package passes install/cache checks while silently omitting the latest canonical gobbi behavior.

## Per-scenario per-check results

- The draft correctly rejects escaping symlinks: official docs say symlinks outside the marketplace/plugin boundary are skipped, and `c79d28e` proves this broke prior published installs.
- The draft names the drift/sync trade-off and assigns documentation of it to the `claude-plugin` skill.
- The draft does not require a package-vs-canonical diff/checksum gate; its listed validation only checks real files are present in cache and that a docs section exists.

## Typed findings

### CONS-1 - Materialized-copy drift is documented but not mechanically guarded

- Type: checklist_gap
- Severity: Medium
- Confidence: 75
- Evidence: `draft-iter2.md:320-328` says real copies create a canonical-tree/package-copy drift surface and requires only "drift-doc section-presence in the skill" as validation; `draft-iter2.md:275-276` defers "build script vs manual" to Execution; `draft-iter2.md:88-91` validates section presence, not copy equivalence. Git ground truth `c79d28e` explicitly records the trade-off: "Editing on main now requires editing in two places." Project mistake `skills-mirror-symlinks-not-copies.md` says canonical `.gobbi/.../skills/` is real and `.claude/skills/` is a symlink mirror, so the new package copies become the only second physical copy.
- Why-it-matters: A stale package can still satisfy the cache allow-set and "real files present" checks while shipping old skills, old agent prompts, or non-executable/stale hooks. That is the exact maintenance cost created by the otherwise-correct materialization choice.
- Suggested-direction: Add a Planning/Execution gate owned by the `claude-plugin` skill or a build/sync step: materialize from canonical sources, then verify package `skills/`, five agent `.md` files, and hook scripts match canonical inputs; assert no escaping symlinks; preserve hook executable bits; fail if a canonical change has not been re-synced.

## Low-confidence appendix

None.
