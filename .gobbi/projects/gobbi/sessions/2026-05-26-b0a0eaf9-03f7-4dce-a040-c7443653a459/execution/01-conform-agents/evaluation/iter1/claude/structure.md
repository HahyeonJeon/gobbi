# Structure Perspective — T1 conform features/agents to §4 (commit 68c9cfd)

Lens: frontmatter schema, type/dir alignment, section-contract shape, placement.

## Verification
- 14/14 files carry the 9 base keys (own loop over name/description/type/scope/feature/status/created/session/tags). PASS.
- `type` value matches directory for every file:
  - `backlogs/` → `type: backlogs`; `changelogs/` → `changelogs`; `checklists/` → `checklists`; `design/` → `design` (x2); `discussions/` → `discussions` (x2); `references/` → `references` (x4); `scenarios/` → `scenarios`; `README.md` → `features`. PASS.
- Feature-subdir-only types (`changelogs`/`discussions`/`scenarios`/`checklists`) correctly set `type` to their own name + `scope: feature` (§2.1 documented exception). PASS.
- Type-extension fields correct: backlog keeps `disposition`+`domain`+`privacy`; references carry `ref_type`+`title`+`source`+`accessed`; README carries `value_proposition`+`subsystems`. PASS.
- Type-corrections applied: `checklist_gap`→`backlogs` (privacy file), `checklist_gap`→`checklists` (d-ref file), `scenario_gap`→`scenarios` (hook file), `blog`/`docs`→`ref_type` + `type: references` (4 refs). These move the staging eval-finding `type` (a finding-type vocab value, NOT a memory `type` enum value) to the correct memory type. PASS.

## Section-contract (§4.2) spot-check
- Backlog body retains `## Context` / `## Decision` / `## Consequences` shape. OK.
- Design `memorization-delegation-hard-gate` keeps Chosen direction / Rationale / Alternative rejected / Validation / Cross-links. OK.
- Scenario/discussion `## Related` → `## Source` rename aligns to §4.3 (Source footer is the sanctioned provenance home). OK.

## Findings
None at ≥ Medium.

- **F-STRUCT-1 — general / docs-sync — Low — Confidence 50.** Several files retain non-base, non-§2.2-enumerated extension keys: `loop`, `topic`, `scenario`, `category`, `phase`, `loop-iter`, `task`, `shipped_in`, `project`, `last_updated`. §2.2 enumerates per-type extensions but does not list these for feature-subdir types; they are neither in S (illegitimate staging set) nor clearly allowed. They are NOT staging-routing leaks (the gate correctly ignores them) and are descriptive/harmless, but their legitimacy is under-specified by the standard. Evidence: e.g. `scenarios/hook-silence...md` carries `scenario:`+`category:`+`domain:`. Disposition: open (informational; standard-coverage gap, not a T1 mechanical defect — §2.2 does not enumerate feature-subdir extensions exhaustively).

VERDICT: PASS
