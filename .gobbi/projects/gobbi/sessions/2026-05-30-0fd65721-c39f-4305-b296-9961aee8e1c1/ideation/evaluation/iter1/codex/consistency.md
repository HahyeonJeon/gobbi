# Consistency Perspective - Codex Evaluation

## Artifact Summary + Memory reads

I checked the artifact's internal trace from Scope Contract to scenarios/checklist/design, and cross-checked claims against staged references and local repo files. The major consistency issue is not the ratified decision list itself; it is conflicting status language and incomplete synchronization between the exact component inventory and the proposed manifest shape.

## Locked Frame (Stage 1)

- Scenario: research insights and design decisions cite claims that actually match the staged references.
- Scenario: the component inventory in the draft matches the repository files that the manifest will include.
- Scenario (adversarial): the artifact uses one count/name set in problem framing but a broader hidden set in the manifest path.

## Per-scenario per-check results

- The external schema citations for `name`, `skills`, hooks, symlink skipping, marketplace source shape, and `${CLAUDE_PLUGIN_ROOT}` mostly match the official docs I spot-checked.
- The component inventory is not crisp enough for Planning: current canonical skill tree and current project settings do not name the same set.

## Typed findings

### C1 - Skill inventory is not synchronized with the canonical source path

- Type: checklist_gap
- Severity: Low
- Confidence: 75
- Evidence: `ideation/rawdata/draft-iter1.md:72-79` frames gobbi's value as "16 workflow skills" plus agents/hooks. `.claude/settings.json:3-19` allows 16 `Skill(...)` entries. But `.gobbi/projects/gobbi/features/install-runtime/README.md:30` states `gobbi-hook-authoring` is canonical-only with no `.claude/skills/` symlink, and the canonical `.gobbi/projects/gobbi/skills/` tree currently contains that skill in addition to the mirrored skill set.
- Why-it-matters: DD-2 points `skills` at the canonical tree, not the `.claude` mirror. That is probably the right root/source choice, but it means the plugin's installed skill set will not be exactly the current project-local allowed/mirrored set. Planning needs an explicit inventory so it does not accidentally omit or silently add skills.
- Suggested-direction: Add a component inventory table for Planning: exact skills shipped from the canonical tree, which are mirrored today, which are plugin-only/canonical-only, and which permission or docs updates each requires.

## Low-confidence appendix

None.
