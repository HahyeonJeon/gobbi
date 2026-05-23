# Structure Perspective

Verdict: REVISE

## Artifact Summary + Memory reads

Stage 0 W/W/H: present and evaluable. This perspective reviews whether the proposed hook contract and data flow decomposition are structurally sound enough for Planning/Execution.

Memory reads:
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md`
- `.gobbi/projects/gobbi/skills/ideation/evaluation.md`
- `.gobbi/projects/gobbi/skills/orchestration/SKILL.md`
- `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json`
- `.gobbi/projects/gobbi/mistakes/README.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- Official Claude Code hooks reference, `https://code.claude.com/docs/en/hooks`, lines 846-914.

## Locked Frame (Stage 1)

Scenario: The hook contract matches the producer API.
- Check: Field names and field meanings match the current SessionStart hook input.
- Check: Trigger source and event name are not conflated.
- Check: Optional fields are scoped to events that actually provide them.

Scenario: The artifact's data flow is acyclic and minimal.
- Check: Hook populates environment state before manager reads it.
- Check: Manager persists exactly the data the later skills need.
- Check: Runtime and documentation responsibilities are not blurred.

Scenario (adversarial): The hook appears to work but persists semantically wrong metadata.
- Check: The source of `startup|resume|clear|compact` is identified correctly.
- Check: Verification criteria catch value-level errors, not just field presence.

Coverage declarations:
- Dependency supply-chain covered by the existing `jq` availability check: `command -v jq` returned `/usr/bin/jq`.
- Observability is handled in Usage/Risk for failure diagnosis.

## Per-scenario per-check results

Scenario: Hook contract matches producer API.
- No: `idea.md:180` models `hook_event_name` as `<startup|resume|clear|compact>`. The official SessionStart input has `hook_event_name: "SessionStart"` and a separate `source: "startup"` field at `https://code.claude.com/docs/en/hooks` lines 856-863.
- Partial: `idea.md:181-183` lists `agent_id`, `agent_type`, and `permission_mode` as optional SessionStart fields. Official SessionStart documents `source`, `model`, and optional `agent_type` at lines 856-863; `agent_id` is described as common only when the hook fires inside a subagent call at hooks lines 641-642, and `permission_mode` appears in other hook event examples, not the SessionStart input shown at lines 856-863.

Scenario: Data flow is acyclic and minimal.
- Partial: The hook-before-manager ordering is plausible, but the artifact's Configuration stamping depends on `$CLAUDE_TRANSCRIPT_PATH` in `idea.md:251` while runtime stamping is deferred in `idea.md:273` and `idea.md:336`.

Scenario (adversarial): Semantically wrong metadata.
- No: The success criteria in `idea.md:279-281` check executable/registration/env presence, but not whether `CLAUDE_HOOK_EVENT_NAME` or a trigger-source value is correct.

## Typed findings

### COD-STRUCT-001

Type: design_flaw
Domain: process
Disposition: open
Confidence: 100
Severity: High
Evidence: `idea.md:180` defines SessionStart input as `"hook_event_name": "<startup|resume|clear|compact>"`, but official Claude Code docs show SessionStart receives `hook_event_name: "SessionStart"` and `source: "startup"` in separate fields (`https://code.claude.com/docs/en/hooks`, lines 856-863). This means the proposed contract can persist an event name while callers think they have the trigger source. Principle 7 applies because the artifact's verification criteria do not test the value-level mismatch.
FP-check: Not pre-existing; not out-of-scope because the hook contract is in scope; not style; not linter-catchable; not speculative because it is directly contradicted by the producer schema.

### COD-STRUCT-002

Type: checklist_gap
Domain: test
Disposition: open
Confidence: 75
Severity: Medium
Evidence: `idea.md:187-198` specifies appending `export VAR=value` lines for JSON-derived values, and `idea.md:279-281` verifies existence, registration, and transcript env presence. No criterion verifies shell-safe encoding or value round-tripping for paths/values containing spaces or shell metacharacters. The official hooks docs require writing `export` statements to `CLAUDE_ENV_FILE` and make those variables available later (`https://code.claude.com/docs/en/hooks`, lines 883-914), so broken serialization would directly break the structural data flow.
FP-check: Not a style preference; not speculative because paths and JSON values are external inputs to the shell file format; not linter-catchable without a targeted fixture.

## Low-confidence appendix

None.
