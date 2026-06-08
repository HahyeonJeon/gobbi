# Structure - Wrap-up promotion + handoff - Codex iter1

## Artifact Summary + Memory reads
The artifact is the Wrap-up promotion set plus handoff. The structural question is whether promoted files landed in documented memory locations and follow the expected shape. Reads: promotion manifest, staging inventory, memorization rules, wrap-up routing table, promoted decisions, mistakes, backlogs, note, README, and layer2 files.

## Locked Frame (Stage 1)
Scenario 1: routing destinations follow the requested promotion policy.
- Check: mistakes land in `mistakes/`.
- Check: feature decisions land in `features/workflow/decisions/`.
- Check: deferred Low findings land in `features/workflow/backlogs/`.
- Check: layer2 generalization lands in `skills/mistake/`.

Scenario 2: promoted memory has valid frontmatter for its type.
- Check: the two mistake files have base fields plus mistake extensions and no staging routing keys.
- Check: the two decision files retain `decision_status`, which is a legitimate decisions extension.
- Check: backlogs retain `disposition: open`, which is legitimate on `backlogs/`.

Scenario 3 (adversarial): a drop-as-addressed item hides unfinished work.
- Check: each dropped checklist has a concrete shipped-artifact witness.

## Per-scenario per-check results
Scenario 1: PASS. The routing set matches the prompt's expected destinations: two mistakes, two workflow decisions, three workflow backlogs, one layer2 file, and three explicit drops.

Scenario 2: PASS. Targeted grep over live promoted memory found no `mistake-candidate`, `item_status`, `promoted-from`, `promoted-at`, or `decision_status` on non-decision targets. The promoted decision files correctly keep `decision_status: accepted`.

Scenario 3: PASS. The shipped docs and execution result back the three drops. No silent unfinished checklist was found.

## Typed findings
None.

## Low-confidence appendix
The three new backlog files omit `project-scope` and `shipped_in`, fields named in the current backlog template. Existing backlog memory is mixed on these fields, and the prompt did not ask for a frontmatter-normalization sweep, so I am not scoring this as a finding.
