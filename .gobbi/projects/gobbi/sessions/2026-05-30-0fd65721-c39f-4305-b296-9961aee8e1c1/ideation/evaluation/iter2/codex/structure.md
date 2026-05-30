# Structure Perspective - Codex Evaluation

## Artifact Summary + Memory reads

The structural shape is now a bounded plugin package with real copied component files, a manifest that enumerates five Claude agent `.md` files, and hook registration via `hooks/hooks.json`. I checked the current mixed agent directory (`manager|leader|executor|evaluator|assistant` each as `.md` plus `.toml`) and the current official Claude docs for path behavior, plugin layout, and marketplace source resolution.

## Locked Frame (Stage 1)

- Scenario: the manifest component fields map cleanly to Claude's current plugin schema.
- Scenario: the bounded package has an unambiguous root and marketplace source path.
- Scenario (adversarial): the design fixes repo-root cache bloat in prose but leaves a path ambiguity that lets Planning reintroduce it.

## Per-scenario per-check results

- `agents` is now specified as an array of the five role `.md` files, and `.toml` Codex wrappers are explicitly excluded.
- Official docs confirm `agents` is a replacing path field, accepts path arrays, and examples enumerate agent files.
- The artifact repeatedly says "dedicated package dir" but never names the actual package root or the `marketplace.json` plugin `source` value.

## Iter-1 Finding Status

### S1 - Agent manifest path is underspecified and may be structurally wrong: RESOLVED

- Evidence: `draft-iter2.md:32-33` says `agents` is an array of the five role `.md` file paths, not a directory, and excludes `.toml`; `draft-iter2.md:175-180` records the mixed `.md`/`.toml` ground truth. Local verification: `.gobbi/projects/gobbi/agents/` contains exactly five `.md` role prompts plus five `.toml` Codex wrappers.
- Assessment: The manifest-shape and wrapper-exclusion requirements are now explicit enough for Planning.

## Typed findings

### STRUCT-1 - Package root and marketplace source path are still not fixed

- Type: checklist_gap
- Severity: Medium
- Confidence: 75
- Evidence: `draft-iter2.md:28-39` defines a "dedicated, self-contained package directory" and separately says `.claude-plugin/marketplace.json` is in scope, but no parent path such as `plugins/gobbi/` or exact marketplace `source` value is named. `draft-iter2.md:58-59`, `draft-iter2.md:273-274`, and `draft-iter2.md:288-289` repeat the package shape and marketplace fields without the concrete source path. Official Claude docs state marketplace entries need `name` and `source`, and relative plugin sources resolve from the marketplace root (`https://code.claude.com/docs/en/plugin-marketplaces`, "Create the marketplace file" and "Relative paths").
- Why-it-matters: The whole R1 fix depends on the marketplace source pointing at the bounded package, not at the repo root. If Planning has to infer the package root, it can accidentally choose `./` or another stale/main-checkout path and recreate the cache-payload problem the revision is meant to eliminate.
- Suggested-direction: Before Planning starts implementation tasks, name the exact package root and the exact `marketplace.json` plugin `source` value. If the path is intentionally deferred, make it a Planning-blocking choice with the bounded-cache invariant attached.

## Low-confidence appendix

None.
