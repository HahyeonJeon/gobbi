# Structure Perspective

Verdict: PASS

## Artifact Summary + Memory reads

Stage 0 W/W/H: present and evaluable. This perspective checks the hook contract shape, data-flow separation, and whether the iter2 contract avoids the original event/source and export-name confusion.

Memory reads:
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/ideation/evaluation.md`
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter1/codex/structure.md`
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter1/codex/risk.md`
- `.gobbi/projects/gobbi/mistakes/README.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`

## Locked Frame (Stage 1)

Scenario: The hook producer contract and persisted env contract agree.
- Check: `session_id` maps only to `CLAUDE_CODE_SESSION_ID`.
- Check: `hook_event_name` and `source` are separate fields with separate exported vars.
- Check: Optional or absent fields do not create a contradictory table.

Scenario: The data flow is minimal and acyclic.
- Check: Hook writes env file; manager reads env; session data stores only downstream-needed state.
- Check: Runtime-set CCSI is not used as hook-health evidence.

Scenario (adversarial): The hook works structurally but writes shell-invalid env rows.
- Check: The artifact identifies value serialization or round-trip verification for `export VAR=value` writes.

Coverage declarations:
- Dependency supply chain: `jq` is the only named command dependency and is declared for Preparation verification at `idea.md:192`.
- Observability is jointly covered by Structure and Usage through the health-gate checks.

## Per-scenario per-check results

Hook producer contract:
- Yes: The stdin JSON now shows `hook_event_name: "SessionStart"` and a separate `source` field (`idea.md:195-204`).
- Yes: The export table maps `session_id` to `CLAUDE_CODE_SESSION_ID`, not `CLAUDE_SESSION_ID` (`idea.md:212-218`).
- Yes: P2 repeats that `CLAUDE_SESSION_ID` is not exported and `CLAUDE_HOOK_SOURCE` comes from stdin `source` (`idea.md:263`).
- Partial: The behavior says "for each stdin field present" (`idea.md:210`), so a missing `source` field would silently omit `CLAUDE_HOOK_SOURCE`; success criterion 5 would later observe absence (`idea.md:325`). This is implicit but not above threshold because the artifact treats `source` as part of the SessionStart input sample (`idea.md:203`).

Data flow:
- Yes: Runtime CCSI and hook health are separated in Gate 1 and Gate 2 (`idea.md:239-247`).
- Yes: The `CLAUDE_HOOK_SOURCE` export is explicitly not a new `session.json` field (`idea.md:313`).

Adversarial shell serialization:
- No: The artifact still specifies appending `export VAR=value` lines for JSON-derived values (`idea.md:210-218`) without an escaping or round-trip criterion.

## Typed findings

### COD-STRUCT-ITER2-001

Type: checklist_gap
Domain: test
Disposition: open
Confidence: 75
Severity: Medium
Evidence: The hook behavior writes `export VAR=value` lines directly from stdin fields (`idea.md:210-218`), while success criteria check script existence, executability, exported names, and env presence (`idea.md:323-325`). No structural check verifies shell-safe serialization or value round-trip for paths or values containing whitespace/metacharacters. This carries forward the iter1 `COD-STRUCT-002`/`COD-RISK-001` concern; it was not part of the eight-item changelog.
FP-check: Not out-of-scope because the hook script is in scope (`idea.md:178`, `idea.md:190`); not style; not linter-catchable without a targeted fixture.

## Low-confidence appendix

None.
