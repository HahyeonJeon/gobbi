# Usage Perspective

Verdict: REVISE

## Artifact Summary + Memory reads

Stage 0 W/W/H: present and evaluable. This perspective reviews whether the manager, planner, executor, and future maintainer can use the artifact without forming the wrong operational model.

Memory reads:
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md`
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`
- `.gobbi/projects/gobbi/skills/orchestration/SKILL.md`
- `.claude/settings.json`
- Official Claude Code changelog, `https://code.claude.com/docs/en/changelog`, lines 772-775.

## Locked Frame (Stage 1)

Scenario: A manager can diagnose missing hook behavior from the rewritten bootstrap text.
- Check: The bootstrap warning checks a signal produced by the hook, not only a runtime signal independent of the hook.
- Check: Hook registration failure, hook disabled, and hook execution failure have visible operator symptoms.

Scenario: A planner can decompose the work without reopening locked decisions.
- Check: The artifact gives enough value-level criteria for the hook contract.
- Check: Deferred runtime implementation is clearly separated from this session's deliverable.

Scenario (adversarial): The artifact gives a false sense that the env contract is healthy.
- Check: A present `CLAUDE_CODE_SESSION_ID` is not treated as proof that transcript env persistence works.
- Check: The stated fallback path still leaves a user-understandable failure.

Coverage declarations:
- Accessibility: text structure is usable; no UI is introduced.
- I18n: not applicable.
- Observability: applicable through operator diagnosis of hook/env failures.

## Per-scenario per-check results

Scenario: Manager diagnosis.
- No: `idea.md:66` and `idea.md:237` move the fatal bootstrap warning to `$CLAUDE_CODE_SESSION_ID` absence. Official changelog says `CLAUDE_CODE_SESSION_ID` is added to Bash subprocesses independent of the hook (`https://code.claude.com/docs/en/changelog`, lines 772-775). Therefore a missing/disabled hook can still leave the warning satisfied while `$CLAUDE_TRANSCRIPT_PATH` is absent.
- No: `idea.md:207` says the next bootstrap will surface missing env-var defects via the rewritten line-66 warning, but the rewritten condition is not tied to `$CLAUDE_TRANSCRIPT_PATH` or `CLAUDE_ENV_FILE`.

Scenario: Planner decomposition.
- Partial: Task decomposition at `idea.md:156-162` is concrete, but value-level checks for hook fields and shell serialization are absent.
- Yes: Runtime CLI implementation is explicitly deferred at `idea.md:273` and `idea.md:336`.

Scenario (adversarial): False sense of health.
- No: `idea.md:251` says the manager stamps top-level `transcriptPath` by reading `$CLAUDE_TRANSCRIPT_PATH` from env, but the fatal warning checks `$CLAUDE_CODE_SESSION_ID`. That makes the user-facing health signal weaker than the field the workflow actually needs.

## Typed findings

### COD-USAGE-001

Type: design_flaw
Domain: observability
Disposition: open
Confidence: 100
Severity: High
Evidence: `idea.md:66` and `idea.md:237` rewrite the bootstrap failure condition to `$CLAUDE_CODE_SESSION_ID` absence; `idea.md:207` claims the rewritten warning surfaces hook/env defects; `idea.md:251` depends on `$CLAUDE_TRANSCRIPT_PATH` for the new top-level field. Official Claude Code changelog confirms `CLAUDE_CODE_SESSION_ID` is a Bash subprocess env var independent of the SessionStart hook (`https://code.claude.com/docs/en/changelog`, lines 772-775). A missing, disabled, or failed hook can therefore fail open from the user's point of view.
FP-check: Not pre-existing; not out-of-scope because bootstrap wording and hook registration are in scope; not style; not linter-catchable; not speculative.

### COD-USAGE-002

Type: checklist_gap
Domain: observability
Disposition: open
Confidence: 75
Severity: Medium
Evidence: `idea.md:279-281` verifies hook registration and eventual transcript env presence, but no criterion verifies the negative path the operator will see when the hook does not run or cannot write `$CLAUDE_ENV_FILE`. The artifact's own failure-mode paragraph at `idea.md:207` relies on the incorrect warning path captured in COD-USAGE-001.
FP-check: Not speculative because the artifact defines the failure mode; severity Medium because COD-USAGE-001 carries the blocking impact.

## Low-confidence appendix

None.
