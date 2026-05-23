# Project Perspective

Verdict: REVISE

## Artifact Summary + Memory reads

Stage 0 W/W/H: present and evaluable. The artifact proposes an env-var audit, SessionStart hook registration, skill-doc rewrites, and a top-level `session.json.transcriptPath` contract. Frontmatter shows `iter: 2` and `verdict: pending` at `idea.md:5-6`; the Iter2 Changelog is near the top at `idea.md:20-31`.

Memory reads:
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md`
- `.agents/skills/principles/SKILL.md`
- `.agents/skills/mistake/SKILL.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/ideation/evaluation.md`
- `.agents/skills/gobbi/SKILL.md`
- `.gobbi/projects/gobbi/mistakes/README.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter1/codex/project.md`
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter1/codex/overall.md`

## Locked Frame (Stage 1)

Scenario: The iter2 artifact stays inside the accepted remediation contract.
- Check: The eight accepted changelog items are present in the body, not only asserted in `## Iter2 Changelog`.
- Check: Accepted fixes do not add unrelated scope.

Scenario: Exit criteria are achievable by the contracted implementation scope.
- Check: Each required post-condition has an in-scope write target or verification surface.
- Check: Current-session requirements are not assigned to future runtime work.

Scenario (adversarial): A wording-only remediation appears to close a process defect while leaving the required state impossible to produce.
- Check: "This session" state changes have an explicit execution path in the artifact.

Coverage declarations:
- Privacy is owned primarily by Risk and Consistency.
- Accessibility and i18n are not applicable to this non-UI ideation artifact.

## Per-scenario per-check results

Accepted remediation contract:
- Yes: The old hook export is collapsed to `CLAUDE_CODE_SESSION_ID` in the hook table and decisions (`idea.md:214`, `idea.md:263`, `idea.md:311`).
- Yes: The health gate now has separate Gate 1 and Gate 2 checks (`idea.md:239-247`).
- Yes: `CLAUDE_HOOK_SOURCE` is added from stdin `source` and kept distinct from `hook_event_name` (`idea.md:195-218`, `idea.md:263`).
- Yes: `orchestration/SKILL.md` line-371-area work is in the P6 inventory and later scope (`idea.md:92-97`, `idea.md:349`, `idea.md:371`).

Exit criteria achievability:
- No: Exit criterion 7 requires this session's own `session.json` to carry a populated tilde-form `transcriptPath` (`idea.md:124`), and success criterion 7 repeats the same requirement (`idea.md:327`).
- No: The artifact excludes runtime code and says manager-side `transcriptPath` stamping is a docs-only contract this session (`idea.md:109`, `idea.md:316`, `idea.md:357`, `idea.md:381`).
- No: The in-scope file list names skill docs, the template, the hook, and settings, but not the current session's concrete `session.json` file (`idea.md:100-104`).

## Typed findings

### COD-PROJ-ITER2-001

Type: design_flaw
Domain: process
Disposition: open
Confidence: 75
Severity: High
Evidence: The artifact requires "New `session.json` files (including this session's own)" to carry a populated tilde-form `transcriptPath` (`idea.md:124`, `idea.md:327`), but it excludes `packages/cli/src/` runtime code and labels manager-side stamping as docs-only/future CLI work (`idea.md:109`, `idea.md:316`, `idea.md:357`, `idea.md:381`). The in-scope write targets are skill docs, `session.template.json`, `.claude/hooks/session-start.sh`, and `.claude/settings.json` (`idea.md:100-104`), not the current concrete `session.json`.
FP-check: Not pre-existing because it is introduced by the iter2 "this session" stamping requirement; not out-of-scope because it is an exit criterion; not style; not linter-catchable.

## Low-confidence appendix

None.
