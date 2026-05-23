---
perspective: overall
iter: 3
system: claude
artifact: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
phase: ideation
verdict: PASS
---

## Artifact Summary

What: Repair the gobbi env-var contract. Rename `$CLAUDE_SESSION_ID` (13 occurrences, 12 files) to `$CLAUDE_CODE_SESSION_ID`, create `.claude/hooks/session-start.sh` (bash+jq, `jq -r @sh` shell-safe serialization), register hook in `.claude/settings.json`, add tilde-form `transcriptPath` to `session.json` schema + template + `orchestration/SKILL.md` (2 locations), and rewrite `gobbi/SKILL.md § Session env vars arrive automatically` paragraph + table + warning + sub-table.

Iter3 applies 3 surgical fixes: FIX A (stamping mechanism disambiguation — separate `§ Stamping mechanism disambiguation` section, updated Out-of-Scope/Pre-resolved/Deferred, exit criterion 7 clarified), FIX B (literal `/home/jeonhh0061/...` removed from P6 instruction example; now `$HOME`-prefixed generic illustration), FIX C (`jq -r @sh` specified as mandatory shell-safe serialization mechanism; canonical example added; success criterion 4 added for round-trip verification).

---

## Per-perspective verdict tally (iter3)

| Perspective | Verdict |
|---|---|
| Project | PASS |
| Structure | PASS |
| Performance | PASS |
| Aesthetics | PASS |
| Usage | PASS |
| Consistency | PASS |
| Risk | PASS |

Aggregate: 7 PASS, 0 REVISE, 0 FAIL.

---

## 3-Fix Iter3 Regression-Check Table

| Fix | Status | Evidence |
|---|---|---|
| **FIX A (F-CONS-03 / COD-OVERALL-ITER2-001)** | Confirmed | `grep -nE 'manager.{0,40}stamping.{0,40}deferred' idea.md` returns only line 27 (Iter3 Changelog describing the fix, not instruction text). § Stamping mechanism disambiguation (lines 276-283) clearly names two mechanisms. Out-of-Scope (line 123), Pre-resolved (line 352), Deferred (line 419) all specify "CLI automation deferred; manager-side stamping in-scope." Exit criterion 7 (line 138) says "NOT by automated CLI tooling." |
| **FIX B (COD-OVERALL-ITER2-002)** | Confirmed | `grep -nE '/home/\|/Users/' idea.md` returns only line 28 (Iter3 Changelog describing the fix). P6 tilde-form storage paragraph (line 329) uses `$HOME/.claude/projects/...` illustration (not a literal home prefix). No `/home/jeonhh0061/` or similar absolute path in instruction text. |
| **FIX C (COD-OVERALL-ITER2-003)** | Confirmed | `grep -nE '@sh' idea.md` returns 10+ matches including: line 101 (P2 file inventory), line 116 (In-scope list), line 133 (exit criterion 2), line 192 (Task A), lines 243-252 (hook contract shell-safe section), line 249 (canonical code example), line 298 (P2 decisions), line 305 (P3), line 348 (Pre-resolved), lines 360/382/405 (success criteria + Scope Contract). Success criterion 4 (line 360) adds round-trip test specification. |

---

## 8-Fix Iter1+Iter2 Baseline Regression Check

| Fix | Status |
|---|---|
| FIX 1: hook exports ONLY `CLAUDE_CODE_SESSION_ID`, never `CLAUDE_SESSION_ID` | Holds — `CLAUDE_SESSION_ID` appears only in negation/historical/rename-target contexts |
| FIX 2: `gobbi/SKILL.md:56` DO NOT RENAME in P4 constraint block | Holds — lines 83 + 311 both contain bolded constraint |
| FIX 3: exit criterion 7 no "deferred" wording | Holds — exit criterion 7 says "NOT by automated CLI tooling" |
| FIX 4: two-gate health model (CCSI + TRANSCRIPT_PATH + file-exists) | Holds — § Health Gate lines 264-274 unchanged |
| FIX 5: `CLAUDE_HOOK_SOURCE=$source` export in hook contract | Holds — hook contract table and P2/P3/P4/P5 decisions all include it |
| FIX 6: `v2.1.132` everywhere (v2.1.128 only in changelog narrating correction) | Holds — `grep -nE 'v2\.1\.128' idea.md` returns only line 42 (changelog) |
| FIX 7: `orchestration/SKILL.md:371` in P6 edit set + file inventory | Holds — lines 96, 109, 135, 331, 386, 409 all reference orchestration/SKILL.md line-371 area |
| FIX 8: `transcriptPath` stored as tilde-form | Holds — P6 (lines 327-329), exit criterion 7 (line 138), success criterion 8 (line 364) all specify tilde form |

---

## Cross-perspective tensions

**Structure × Security (F-STRUCT-01)**: The `jq -r @sh` canonical pattern (FIX C) correctly applies to stdin-JSON-derived fields using jq's `.field` syntax. The 3 passthrough env-var re-exports (`CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA`) are sourced from env, not from jq input. The "equivalent POSIX-shell-safe quoting" clause permits alternatives but provides no example for the env-sourced case. An Executor following the canonical pattern literally cannot apply it to env-sourced values without adaptation. The risk is bounded (passthrough envs are typically path-like and less commonly contain shell metacharacters than transcript paths), but the gap exists.

**Consistency × Usage (F-CONS-04)**: § Stamping mechanism disambiguation (line 280) cites "success criterion 7" as the criterion satisfied by the manager-agent stamp, but success criterion 7 is about `session.template.json` + `orchestration/SKILL.md`, not about manager stamping. Success criterion 8 is the correct reference. The Scope Contract (line 414) correctly says "criterion 8 covers manager-agent stamping." Two contradictory cross-references coexist.

---

## Karpathy's 4 Failure Modes (iter3)

### 1. Wrong assumptions

F-RISK-01 (open, Medium/75): `$CLAUDE_CODE_SESSION_ID` in a subagent is the subagent's own UUID, not the parent session's UUID. Path conventions built on CCSI in skill docs emit subagent-scoped paths in subagent contexts. This was not addressed by any of the 11 total fixes across iter1-iter3. Ongoing known assumption risk — deferred to a future session per the project's "sessions escalate vs. scope-creep" policy.

No new wrong assumptions introduced by iter3 fixes.

### 2. Overcomplexity

Not present. FIX A's disambiguation section is additive documentation, not complexity. FIX C's `jq -r @sh` example is the simplest correct implementation for stdin-JSON-derived values. The hook design (append-to-env-file, last-writer-wins, no dedup) is appropriately simple.

### 3. Orthogonal edits

Not present. All 3 iter3 fixes are directly related to the stamping contract and hook security surface. No unrelated changes bundled.

### 4. Imperative-over-declarative

Not present. The exit criteria and success criteria continue to state verifiable outcomes (rg returns empty, files exist, session.json has non-null value) rather than prescribing mechanism exclusively. The `jq -r @sh` requirement in FIX C is a mechanism specification, but it is bounded to the hook contract (not to the evaluation criteria), and the "equivalent POSIX-shell-safe quoting" escape clause permits alternatives.

---

## Overall findings

### F-STRUCT-01 (surfaced in Structure, cross-perspective relevance)

```yaml
finding-id: struct-01-atsh-passthrough-env-gap
type: checklist_gap
domain: security
disposition: open
confidence: 75
severity: Medium
```

The `jq -r @sh` canonical pattern applies to jq-input fields (stdin JSON) but not directly to env-sourced passthrough re-exports. "The same @sh pattern applies to every exported field above" (line 252) may be misread as applying to env-sourced passthrough values via the same jq mechanism, but the jq `.field` syntax requires the value to be in the jq input stream — env-sourced values require a different approach (e.g., `printf '%q'` or `echo "$VAR" | jq -R @sh`). The "equivalent POSIX-shell-safe quoting" clause mitigates to Medium (requirement for shell-safety is clear; mechanism for env-sourced case is not illustrated).

### F-CONS-04 (surfaced in Consistency)

```yaml
finding-id: cons-04-disambiguation-success-criterion-wrong-number
type: design_flaw
domain: docs-sync
disposition: open
confidence: 75
severity: Medium
```

§ Stamping mechanism disambiguation (line 280) claims "success criterion 7" is satisfied by manager-agent stamp. Success criterion 7 (line 363) is about `session.template.json` parsing and `orchestration/SKILL.md` field list. Success criterion 8 (line 364) is the actual manager-stamp criterion. The Scope Contract (line 414) correctly says "criterion 8 covers manager-agent stamping." Two conflicting cross-references coexist in the same artifact.

---

## Preserve list

The following must not be changed on any future REVISE iteration:

1. **Stamping mechanism disambiguation** — § Stamping mechanism disambiguation (lines 276-283) cleanly resolves the iter2 F-CONS-03 finding. The two-mechanism distinction (manager-agent vs CLI automation) is well-stated and should not be collapsed.
2. **FIX C `jq -r @sh` coverage for stdin-JSON fields** — the canonical example (lines 246-249) is correct and clear for the primary 8 exported fields. Do not remove or weaken.
3. **FIX B tilde-form in P6** — `$HOME/.claude/projects/...` illustration (not literal `/home/username/...`) is correct. No absolute path should re-enter P6 instruction text.
4. **FIX 1 hook export contract** — hook exports only `CLAUDE_CODE_SESSION_ID`; `CLAUDE_SESSION_ID` excluded. Three-statement consistency maintained.
5. **FIX 4 two-gate health check** — Gate 1 (CCSI absence) + Gate 2 (TRANSCRIPT_PATH + file-exists). Both gates and their specific failure messages preserved.
6. **FIX 5 CLAUDE_HOOK_SOURCE** — consistently added across 10+ locations in the artifact.
7. **FIX 7 orchestration/SKILL.md line-371** — in scope + inventory + exit/success criteria.
8. **FIX 8 tilde-form storage** — P6, exit criterion 7, success criterion 8 all specify tilde-form; consumer tilde-expand requirement in P7.
9. **Empirical witness evidence** — three bootstrap observations unchanged and correct.
10. **Out-of-scope discipline** — four explicit exclusions remain well-reasoned and unambiguous.

---

## Overall verdict rationale

All seven perspective verdicts are PASS. Two new findings surface in iter3:

- **F-STRUCT-01** (Medium/75): `jq -r @sh` mechanism gap for passthrough env-var re-exports. The security requirement is stated ("shell-safe quoting required for all exports"), but the canonical mechanism shown (jq `.field` syntax) does not directly apply to env-sourced values. An Executor implementing passthrough re-export must adapt the pattern. The "equivalent POSIX-shell-safe quoting" clause provides the permission but not the guidance. Severity Medium: bounds the issue (explicit requirement stated; env-sourced passthrough paths less commonly contain metacharacters than transcript paths; the passthrough vars are from Claude's own runtime, likely well-formed). Confidence 75: verified by close-reading of the hook contract.

- **F-CONS-04** (Medium/75): Success criterion 7 vs 8 numbering inconsistency in the disambiguation section. A Planner using the wrong criterion pointer gets a template/doc check rather than the manager-stamp check. Low practical impact (correct criterion 8 is clearly labeled and adjacent), but a factual internal inconsistency.

Neither finding meets the REVISE threshold (no Critical ≥ 75, no High ≥ 50). Both are Medium/75. Overall verdict: **PASS**.

The 3 iter3 fixes all verified as Confirmed. The 8 iter1+iter2 baseline fixes all Hold. No regressions.
