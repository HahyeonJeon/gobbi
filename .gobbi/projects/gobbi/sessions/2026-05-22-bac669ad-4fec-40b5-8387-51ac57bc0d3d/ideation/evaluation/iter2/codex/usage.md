# Usage Perspective

Verdict: PASS

## Artifact Summary + Memory reads

Stage 0 W/W/H: present and evaluable. This perspective checks whether a manager, planner, executor, or later maintainer can use the artifact without reviving the iter1 misunderstandings.

Memory reads:
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/ideation/evaluation.md`
- `.agents/skills/gobbi/SKILL.md`
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter1/codex/usage.md`
- `.gobbi/projects/gobbi/mistakes/README.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`

## Locked Frame (Stage 1)

Scenario: The manager can diagnose runtime-vs-hook failures from the rewritten bootstrap contract.
- Check: CCSI absence is not treated as hook failure.
- Check: Missing transcript env/path has its own warning path.

Scenario: Planning can decompose P4/P5 without reopening line-56 or source/event decisions.
- Check: `CLAUDE_TRANSCRIPT_PATH` row preservation is visible.
- Check: `CLAUDE_HOOK_SOURCE` is clearly a hook env export, not a session field.

Scenario (adversarial): A reader gets false health confidence from a present runtime variable.
- Check: The artifact says CCSI can be present while the hook failed.

Coverage declarations:
- Accessibility: the document is structured with explicit headings and tables.
- I18n: not applicable.
- Observability: applicable via the two-gate health warning.

## Per-scenario per-check results

Manager diagnosis:
- Yes: Gate 1 checks only `$CLAUDE_CODE_SESSION_ID` runtime presence (`idea.md:239-241`).
- Yes: The artifact explicitly states Gate 1 is insufficient because CCSI is set independently of the hook (`idea.md:242`).
- Yes: Gate 2 checks `$CLAUDE_TRANSCRIPT_PATH` is non-empty and points to an existing file, with a user-visible SessionStart-hook warning if either condition fails (`idea.md:244-249`).

Planning usability:
- Yes: `gobbi/SKILL.md:56` is hard-constrained as not renamed in P4 (`idea.md:83`, `idea.md:276`, `idea.md:347`).
- Yes: `CLAUDE_HOOK_SOURCE` is exported from stdin `source` and explicitly not added to `session.json` (`idea.md:263`, `idea.md:313`).

False health confidence:
- Yes: The artifact directly names the failure mode where CCSI remains present while the hook silently fails (`idea.md:242`) and pairs it with Gate 2 (`idea.md:244-247`).

## Typed findings

None above threshold.

## Low-confidence appendix

None.
