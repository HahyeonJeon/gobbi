# Project Perspective

Verdict: REVISE

## Artifact Summary + Memory reads

Stage 0 W/W/H: present and specific enough to evaluate. The artifact defines a scoped env-var and SessionStart-hook repair for the Gobbi skill surface, motivated by current-session runtime/env discrepancies, with a proposed implementation across skill docs, `.claude/settings.json`, a new hook script, and the session template.

Memory reads:
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md`
- `.gobbi/projects/gobbi/skills/principles/SKILL.md`
- `.gobbi/projects/gobbi/skills/evaluation/SKILL.md`
- `.gobbi/projects/gobbi/skills/ideation/evaluation.md`
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`
- `.gobbi/projects/gobbi/skills/orchestration/SKILL.md`
- `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json`
- `.claude/settings.json`
- `.gobbi/projects/gobbi/mistakes/README.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`

Verification register:
- `rg -n 'CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills` returned 13 hits across 12 files, including the bare table row at `gobbi/SKILL.md:55`.
- `rg -n --fixed-strings '$CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills` returned 12 hits; `gobbi/SKILL.md:55` is not a literal `$CLAUDE_SESSION_ID` hit.
- `rg -n --fixed-strings '$CLAUDE_TRANSCRIPT_PATH' .gobbi/projects/gobbi/skills` returned 9 hits across 6 files.
- `rg -n 'CLAUDE_TRANSCRIPT_PATH' .gobbi/projects/gobbi/skills` returned 10 hits including `gobbi/SKILL.md:56`, confirming the leader's co-location note.
- `rg -n 'CLAUDE_' .claude/agents` exited 1 with no output; `find -L .claude/agents -maxdepth 1 -name '*.md'` returned the five role files.
- `jq 'has("hooks"), .hooks' .claude/settings.json` returned `false` and `null`.
- `find "$HOME/.claude/projects" -maxdepth 2 -type f -name 'bac669ad-4fec-40b5-8387-51ac57bc0d3d.jsonl'` returned `/home/jeonhh0061/.claude/projects/-playinganalytics-git-gobbi/bac669ad-4fec-40b5-8387-51ac57bc0d3d.jsonl`; `stat` reported 942639 bytes.

## Locked Frame (Stage 1)

Scenario: The artifact solves the witnessed env-var problem without expanding beyond the locked scope.
- Check: Each proposed edit maps to a witnessed current-session failure or a directly required doc/schema follow-through.
- Check: Out-of-scope surfaces remain explicit and not silently edited.
- Check: No pre-resolved decision is reopened.

Scenario: The success criteria are executable by the later Planning/Execution loops.
- Check: Each success criterion can be verified after execution without requiring a future external session.
- Check: Criteria that require a next session are explicitly distinguished from current-PR verification.

Scenario (adversarial): A mechanically correct grep inventory still leads Planning to perform the wrong operation.
- Check: Inventory wording matches the exact grep command in the success criteria.
- Check: Bare env-var table rows are not counted as literal `$VAR` occurrences.

Coverage declarations:
- Privacy/licensing/supply-chain not owned by Project; Risk and Consistency cover them.
- Accessibility/i18n not applicable to this project-scope text artifact.

## Per-scenario per-check results

Scenario: Witnessed scope.
- Yes: Scope exclusions are explicit in `idea.md:86-92` and `idea.md:309-317`.
- Yes: Current grep confirms the `.claude/agents` boundary: `rg -n 'CLAUDE_' .claude/agents` produced no output.
- Partial: The artifact cites witnesses for the core defects in `idea.md:112-119`, but some external-version and payload-shape claims disagree with current official docs; those are detailed in Consistency and Structure.

Scenario: Executable success criteria.
- No: `idea.md:99` and `idea.md:281` require next-session proof that the hook fires and `$CLAUDE_TRANSCRIPT_PATH` appears in env. That is not directly verifiable in the same execution pass after creating the PR.
- No: `idea.md:283` requires future `session.json` files to carry a populated top-level `transcriptPath`, while `idea.md:273` and `idea.md:336` defer CLI/runtime stamping.

Scenario (adversarial): Grep inventory.
- Partial: Broad `rg -n 'CLAUDE_SESSION_ID'` confirms 13 hits, but literal fixed-string `$CLAUDE_SESSION_ID` confirms 12 hits plus one bare table row.
- Yes: The transcript inventory is correctly split: 9 literal `$CLAUDE_TRANSCRIPT_PATH` references, plus the co-located bare table row at `gobbi/SKILL.md:56`.

## Typed findings

### COD-PROJ-001

Type: checklist_gap
Domain: test
Disposition: open
Confidence: 75
Severity: High
Evidence: `idea.md:99` requires verifying that `.claude/hooks/session-start.sh` "fires on next session start"; `idea.md:281` requires a next-session bootstrap to observe `$CLAUDE_TRANSCRIPT_PATH`; `idea.md:283` requires subsequent new `session.json` files to carry a populated top-level `transcriptPath`, while `idea.md:273` and `idea.md:336` defer CLI/runtime stamping. This violates Principle 7's fresh-verification gate (`principles/SKILL.md:180-194`) because the current execution cannot close these criteria without a future session or an explicit current-session surrogate.
FP-check: Not pre-existing; not out-of-scope because these are the artifact's own exit criteria; not style; not linter-catchable; not speculative.

### COD-PROJ-002

Type: general
Domain: docs-sync
Disposition: open
Confidence: 100
Severity: Medium
Evidence: `idea.md:33` and `idea.md:215` call the P1 inventory "13 occurrences" of `$CLAUDE_SESSION_ID`; `rg -n --fixed-strings '$CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills` returned 12 hits, while broad `rg -n 'CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills` returned 13 because `gobbi/SKILL.md:55` is a bare table row. The inventory table itself is accurate at `idea.md:37`, but the `$` wording is not.
FP-check: Not out-of-scope; not style because the success criteria later use grep strings; not speculative.

## Low-confidence appendix

None.
