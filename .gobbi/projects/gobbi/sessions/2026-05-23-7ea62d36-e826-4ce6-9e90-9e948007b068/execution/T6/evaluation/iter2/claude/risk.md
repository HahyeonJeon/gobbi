# Risk Perspective — iter2 re-eval (Claude)

**Target:** codex/SKILL.md @ b9970dc.

## Frame

Scope: what could go wrong from the iter2 additions? Net new risk vs. risk closed.

## Scenario Checklist

- S1: Symlink anti-pattern adds operational guardrail? **YES** — closes the "codex can't load its own skill" failure mode (recorded mistake); verification command provided.
- S2: Worked-example expansion reduces silent-DONE risk? **YES** — explicit 8-file count + 5-Type grep + verdict-line grep makes it harder for a wrapper-assistant to claim DONE when files missing.
- S3: Witness IDs introduce new risk (e.g., stale references)? **LOW** — IDs trace to a specific session-id, so if Ideation research is moved/archived the citations become brittle. Acceptable for now; mitigated by the IDs being descriptive (I3 cites `--sandbox` semantics — independently verifiable).
- S4: git cross-link risk of dangling pointer? **LOW** — `git/SKILL.md § Worktree CWD discipline` exists per the Cross-Link Manifest. No dangling reference.
- S5: New content increases context cost meaningfully? **NO** — 34 lines vs. 415-line skill; ~8% growth for substantial validation hardening.
- S6: 5-Type vocab inline risks drift if evaluation skill updates? **LOW** — inline duplication is intentional (avoids second skill load); evaluation/SKILL.md is the SoT; drift detector (#258) covers cross-doc consistency.

## Findings

None at Critical/High. Two `LOW` notes (S3 brittle session-id citation, S6 vocab duplication drift) are acceptable engineering tradeoffs.

## Must-Preserve

- Verification `ls -la` command in symlink anti-pattern (makes the guardrail mechanical).
- Three-step worked-example validation.

VERDICT: PASS
