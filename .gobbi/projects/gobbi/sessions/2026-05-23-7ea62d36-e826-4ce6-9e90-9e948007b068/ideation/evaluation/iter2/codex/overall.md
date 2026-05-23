# Codex Evaluation Iter2 - Overall

## Artifact Summary + Memory reads

Artifact: `ideation/rawdata/draft-iter2.md`, Bundle A Ideation draft. Overall lens aggregates Project, Structure, Performance, Aesthetics, Usage, Consistency, and Risk. Memory reads included all required Gobbi skills/rules/mistake files, iter1 Codex evaluation files, the target draft, and fresh verification commands. The draft's W/W/H is clear enough to evaluate: What is Bundle A's seven-item docs/skill change set; Why is prior-session workflow discipline failure; How is skill/documentation edits plus validation and wrap-up detection.

Fresh verification summary:
- T-counts: T1=8, T2=13, T3=3, T4=2, T5=9, T6=2, T7=2.
- Live `evaluation/SKILL.md` Type set: `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`.
- Live `.agents/skills` symlink count: 16 before codex.
- `jq '.mode' .../settings.default.json`: `"auto"`.
- `.claude/CLAUDE.md:50` contains the quoted mistake-discipline rule.

## Per-perspective verdicts

Project: PASS. COD-PROJ-001 and COD-PROJ-002 are resolved.

Structure: REVISE. COD-STRUCT-001 is unresolved because iter2 still uses non-existent Type values (`improvement`, `bug`) as canonical.

Performance: PASS. COD-PERF-001 is resolved.

Aesthetics: PASS. COD-AESTH-001 and COD-AESTH-002 are resolved.

Usage: PASS. COD-USAGE-001 is resolved.

Consistency: PASS with Medium concern. COD-CONS-001 is resolved; new COD-CONS-002 records the `.agents/skills` count mismatch.

Risk: PASS. COD-RISK-001 collision/idempotency policy is resolved.

## Iter1 High resolution status

- COD-PROJ-001: RESOLVED. T-counts and pathology distinction match fresh command output.
- COD-PROJ-002: RESOLVED. `.agents/skills/codex` is now required in the Design A contract.
- COD-STRUCT-001: UNRESOLVED. Iter2 replaced `correction` / `decision-record` with a different wrong vocabulary: `improvement` / `bug` are not live Type values.
- COD-USAGE-001: RESOLVED. Mode default is `auto`, matching `settings.default.json`.
- COD-CONS-001: RESOLVED. The false full-evaluation claim is corrected across the draft.
- COD-RISK-001: RESOLVED. Step 2.5 now includes the slug/collision pre-write policy.
- COD-OVERALL-001: PARTIAL. Most component Highs are fixed, but the Structure High remains unresolved.

Medium/Low iter1 fixes:
- COD-PERF-001: RESOLVED.
- COD-AESTH-001: RESOLVED.
- COD-AESTH-002: RESOLVED.

## Typed findings

### COD-OVERALL-001 - Draft is not ready for Planning while one High contract remains wrong
- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Structure finding COD-STRUCT-001 remains open. Live `evaluation/SKILL.md` lines 344-352 define `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`; iter2 lines 32, 224, 307, 363, 488-491, 506, 512, and 570 define Step 2.5 around `improvement` and `bug`.
- Verdict impact: Any High finding with confidence >= 50 requires REVISE.

### COD-CONS-002 - `.agents/skills` baseline count is overstated as 17 when the live count is 16
- Type: `general`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: Medium
- Evidence: Fresh `find /playinganalytics/git/gobbi/.agents/skills -maxdepth 1 -type l | wc -l` returned `16`. Iter2 lines 31, 236-238, 385, and 578 say the existing pattern has 17 entries. The target count after adding codex should become 17.
- Verdict impact: Non-blocking alone, but should be corrected in the next draft.

## Karpathy 4 check

Wrong assumptions: Present. Step 2.5 assumes `improvement` and `bug` are live Type values.

Overcomplexity: Not found. The overall bundle remains broad but scoped and motivated.

Orthogonal edits: Not found beyond the user-locked A-G scope.

Imperative-over-declarative: Not blocking. The draft states validation goals and commands; the unresolved issue is wrong taxonomy, not over-prescribed mechanism.

## Must-preserve list

- Preserve the corrected T-by-T witness distinction: T1/T2/T5 as full-evaluation memorization gaps; T3/T4/T6/T7 as eval-also-skipped plus no staging.
- Preserve the `.agents/skills/codex` directory symlink requirement, but fix the baseline count from 17 to 16 existing symlinks.
- Preserve Design G's `auto` default aligned with `settings.default.json`.
- Preserve the Step 2.5 slug/collision pre-write policy.
- Preserve the codex skill's cost/budget section.
- Preserve the corrected `~/.claude/plugins/...` citations and `.claude/CLAUDE.md:50` citation.

Counts: Critical 0 / High 1 / Medium 1 / Low 0 / Nit 0.

Final Verdict: REVISE

## Low-confidence appendix

None.
