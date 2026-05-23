# Consistency Perspective

Verdict: REVISE

## Artifact Summary + Memory reads

Stage 0 W/W/H: present and evaluable. This perspective checks whether the artifact, current repo contracts, and official references agree with each other.

Memory reads:
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md`
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`
- `.gobbi/projects/gobbi/skills/orchestration/SKILL.md`
- `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json`
- `.claude/settings.json`
- `.gobbi/projects/gobbi/mistakes/README.md`
- Official Claude Code changelog, `https://code.claude.com/docs/en/changelog`, lines 772-775.
- Official Claude Code hooks reference, `https://code.claude.com/docs/en/hooks`, lines 846-914.
- Official Claude Code env-vars reference, `https://code.claude.com/docs/en/env-vars`, lines 171 and 307-311.

## Locked Frame (Stage 1)

Scenario: The file inventory agrees with current grep results.
- Check: P1 count and P7 count match the commands used.
- Check: `gobbi/SKILL.md:56` is correctly treated as co-located P4 scope, not a P7 rename target.

Scenario: The session metadata schema remains internally synchronized.
- Check: Template fields, orchestration Step 1, and the session metadata contract table all name the same top-level fields.
- Check: Top-level `transcriptPath` is distinguishable from per-agent `agents[].transcriptPath`.

Scenario: External doc claims agree with current official docs.
- Check: Version/date claims match the official changelog.
- Check: Runtime-set env vars listed in the artifact exist in the official env-var reference, or the artifact clearly labels them as empirical-only.

Scenario (adversarial): A doc-only schema change leaves a still-current skill statement stale.
- Check: Every still-current schema list in the target skill docs is updated, not just the row where stamping occurs.

Coverage declarations:
- Privacy and license/IP are jointly checked with Risk.
- Supply chain: `jq` exists locally; no new package manager dependency is introduced.

## Per-scenario per-check results

Scenario: Grep inventory.
- Partial: Broad P1 grep confirms 13 `CLAUDE_SESSION_ID` hits; literal `$CLAUDE_SESSION_ID` fixed-string grep confirms 12.
- Yes: Literal P7 grep confirms 9 `$CLAUDE_TRANSCRIPT_PATH` hits across 6 files.
- Yes: Broad transcript grep confirms `gobbi/SKILL.md:56` as the extra co-located row, matching `idea.md:342-346`.

Scenario: Session metadata schema sync.
- No: `idea.md:73-76`, `idea.md:250-252`, and `idea.md:305` name the template and `orchestration/SKILL.md` Step 1 row 6, but current `orchestration/SKILL.md:371` is the session metadata top-level field list and omits `transcriptPath`. Current `session.template.json` has only `agents[0].transcriptPath` (`session.template.json:37`); `jq 'has("transcriptPath"), .transcriptPath, .agents[0].transcriptPath'` returned `false`, `null`, `null`.

Scenario: External doc claims.
- No: `idea.md:25`, `idea.md:122`, and `idea.md:242` say `CLAUDE_CODE_SESSION_ID` was added in v2.1.128+. Official changelog lines 772-775 say it was added in 2.1.132 on May 6, 2026.
- Partial: `idea.md:67`, `idea.md:125`, and `idea.md:246` say docs claim `CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, and `CLAUDE_PLUGIN_DATA` are runtime-set; current official env-vars search returned no matches for those names, while it does list `CLAUDECODE`, `CLAUDE_EFFORT`, and `CLAUDE_ENV_FILE` at env-vars lines 171 and 307-311.

Scenario (adversarial): Still-current skill stale.
- No: The artifact's P6 edit list does not name `orchestration/SKILL.md:371`, so a top-level `transcriptPath` can be added while the metadata contract continues to state the old top-level set.

## Typed findings

### COD-CONS-001

Type: design_flaw
Domain: docs-sync
Disposition: open
Confidence: 100
Severity: High
Evidence: `idea.md:73-76`, `idea.md:250-252`, and `idea.md:305` propose adding top-level `transcriptPath` to `session.json`/template and updating only Step 1 row 6 in `orchestration/SKILL.md`; current `orchestration/SKILL.md:371` is the top-level field contract and omits `transcriptPath`. This violates Principle 8 (`principles/SKILL.md:205-223`) because the schema documentation would remain internally inconsistent.
FP-check: Not pre-existing as a problem until the new field is introduced; not out-of-scope because P6 names the session schema; not style; not linter-catchable.

### COD-CONS-002

Type: general
Domain: docs-sync
Disposition: open
Confidence: 100
Severity: Medium
Evidence: `idea.md:25`, `idea.md:122`, and `idea.md:242` date `CLAUDE_CODE_SESSION_ID` to v2.1.128+, but official Claude Code changelog lines 772-775 state 2.1.132 on May 6, 2026. The design direction is still valid, but the artifact embeds a wrong prior-art citation.
FP-check: Not speculative; not out-of-scope because the artifact uses this claim as part of its witness chain.

### COD-CONS-003

Type: assumption_risk
Domain: docs-sync
Disposition: open
Confidence: 75
Severity: Medium
Evidence: `idea.md:67`, `idea.md:125`, and `idea.md:246` claim official docs list `CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, and `CLAUDE_PLUGIN_DATA` as runtime-set; current official env-vars reference search returned no matches for those names, while listing related runtime vars such as `CLAUDECODE`, `CLAUDE_EFFORT`, and `CLAUDE_ENV_FILE` (`https://code.claude.com/docs/en/env-vars`, lines 171 and 307-311). This makes the proposed "docs-vs-empirical discrepancy" note itself stale or unverified.
FP-check: Not style; confidence 75 because current official page search found no matches, but the artifact may have relied on older docs not preserved in-repo.

## Low-confidence appendix

None.
