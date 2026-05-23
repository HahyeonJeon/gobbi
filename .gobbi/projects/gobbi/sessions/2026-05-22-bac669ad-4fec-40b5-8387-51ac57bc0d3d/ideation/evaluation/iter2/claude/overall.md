---
perspective: overall
iter: 2
system: claude
artifact: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
phase: ideation
verdict: REVISE
---

## Artifact Summary

Repair the gobbi env-var contract: rename $CLAUDE_SESSION_ID (13 occurrences, 12 files), create `.claude/hooks/session-start.sh` (bash+jq), add `CLAUDE_HOOK_SOURCE` export, register hook in `.claude/settings.json`, add two-gate health check, add tilde-form `transcriptPath` to session.json schema, and rewrite `gobbi/SKILL.md § Session env vars arrive automatically`. Iter2 is a surgical remediation of 8 iter1 findings.

---

## Per-perspective verdict tally (iter2)

| Perspective | Verdict |
|---|---|
| Project | PASS |
| Structure | PASS |
| Performance | PASS |
| Aesthetics | PASS |
| Usage | PASS |
| Consistency | REVISE |
| Risk | PASS |

Aggregate: PASS 6, REVISE 1, FAIL 0.

---

## 8-Finding Regression-Check Table

| Finding | Source | Description | Status |
|---|---|---|---|
| **FIX 1 (F-CONS-01)** | Claude High/100, docs-sync | Hook writes ONLY CLAUDE_CODE_SESSION_ID; CLAUDE_SESSION_ID NOT exported | **Confirmed** — hook contract table line 214, P2 decisions line 263, "in-hook consumer compatibility" note absent |
| **FIX 2 (F-USAGE-01)** | Claude High/75, docs-sync | gobbi/SKILL.md:56 constraint moved from § Open questions to P4 main constraint block | **Confirmed** — artifact lines 83 + 276 both contain bolded constraint; Open questions section confirms promotion |
| **FIX 3 (F-CONS-02)** | Claude Medium/75, docs-sync | Exit criterion 7 reworded; "deferred" wording removed | **Partial — introduces new contradiction.** The surface symptom (word "deferred") is removed. However, FIX 3 asserts "happens THIS session / NOT deferred" while Out-of-Scope (line 109), Pre-resolved decisions (line 316), and Deferred section (line 381) all say "CLI implementation — future session; docs-only contract this session." The FIX amplified the contradiction rather than resolving it. See F-CONS-02 (open) and F-CONS-03 (new). |
| **FIX 4 (COD-OVERALL-001)** | Codex High/100, observability | Gate 2: $CLAUDE_TRANSCRIPT_PATH presence + file-exists check added | **Confirmed** — § Health Gate (lines 235-249) documents Gate 1 (CCSI absence) and Gate 2 (TRANSCRIPT_PATH absent or file missing). Gate 2 failure message points to specific remediation checklist. |
| **FIX 5 (COD-OVERALL-002a)** | Codex High/100, process | CLAUDE_HOOK_SOURCE=$source export added | **Confirmed** — hook contract table (line 218), P2 decisions (line 263), P3 (line 268), P4 (line 277), Scope Contract In-Scope (line 345), Decisions Locked (line 367) all include CLAUDE_HOOK_SOURCE consistently. |
| **FIX 6 (COD-OVERALL-002b)** | Codex High/100, process | v2.1.128+ corrected to v2.1.132 | **Confirmed** — grep shows no remaining v2.1.128 mentions; all 7 version references use v2.1.132. |
| **FIX 7 (COD-OVERALL-003)** | Codex High/100, docs-sync | orchestration/SKILL.md line-371 area added to P6 edit set + file inventory | **Confirmed** — artifact lines 96, 101, 121, 182, 295, 349, 371 all include orchestration/SKILL.md line-371 area. Exit criterion 4 (line 121) explicitly requires the "Top-level fields" list to contain transcriptPath. |
| **FIX 8 (COD-OVERALL-004)** | Codex High/100, privacy | transcriptPath stored as tilde-form path | **Confirmed** — P6 decisions (lines 293-294) specify tilde-substitution procedure; P7 decisions (line 299) specify consumer tilde-expand requirement; exit criterion 7 requires tilde form; absolute-path example used only as "before" illustration. |

---

## Cross-perspective tensions

**Consistency × Project/Usage — FIX 3 introduces amplified contradiction**

The FIX 3 edit resolved the surface wording ("deferred" removed) but left behind a deeper inconsistency: exit criterion 7 and P6 now assert "stamping happens this session / NOT deferred" while the Out-of-Scope + Deferred sections correctly maintain that CLI implementation is a future-session item. The tension between "manager agent follows skill-docs procedure" vs "CLI code implements the procedure" is the root ambiguity, and FIX 3 does not resolve it — it obscures it by asserting a strong claim ("NOT deferred") without the clarifying distinction.

A Planner working from this artifact faces two incompatible framings and cannot correctly specify Task E without independently resolving the ambiguity.

**Risk × Consistency — Stamping contract without CLI**

F-RISK-01 (subagent CCSI = subagent's own UUID) and F-CONS-02/F-CONS-03 (stamping "this session" vs CLI deferred) are both downstream of the same design gap: the skill-docs procedure contracts behavior that the CLI has not yet implemented. The artifact is correct that the manager agent can follow the procedure; it is incorrect to claim this constitutes "NOT deferred" without distinguishing between the docs-contract and the implementation.

---

## Karpathy's 4 failure modes (iter2)

### 1. Wrong assumptions
**Identified**: The same assumption from iter1 (Karpathy mode 1 — F-RISK-01) persists: CCSI in a subagent is the subagent's own UUID, not the manager's session ID. The rename from $CLAUDE_SESSION_ID to $CLAUDE_CODE_SESSION_ID in path conventions moves from one empty var to a populated var, but the semantics are still wrong for subagent path construction. This assumption is unaddressed by any of the 8 FIX entries.

**New assumption introduced by FIX 3**: The artifact assumes "manager agent follows skill-docs procedure to stamp transcriptPath" = "this session delivers a working transcriptPath in session.json." This is true IF the manager is human-authored (follows the documented Step 1 row 6 procedure), but not guaranteed if the session runs with a CLI-driven bootstrap that has not been updated. The assumption is plausible but not stated, and it contradicts the "docs-only contract" language elsewhere.

### 2. Overcomplexity
Not identified. The CLAUDE_HOOK_SOURCE addition (FIX 5) is additive but not complex. The two-gate health model (FIX 4) is appropriately structured.

### 3. Orthogonal edits
Not identified. All 8 FIX entries are directly related to the env-var contract. No unrelated changes bundled.

### 4. Imperative-over-declarative
Not identified. Exit criteria are still observable outcomes, not prescribed mechanisms.

---

## Overall findings

### F-CONS-03 (NEW — see consistency.md for full evidence)

```yaml
finding-id: cons-03-fix3-amplified-contradiction-stamping-vs-cli-defer
type: design_flaw
domain: docs-sync
disposition: open
confidence: 100
severity: High
```

**Evidence**: FIX 3 asserts transcriptPath stamping "happens THIS session / is NOT deferred" (exit criterion 7 line 124, P6 line 292) while Out-of-Scope (line 109), Pre-resolved decisions (line 316), and Deferred section (line 381) all state "CLI implementation — future session; docs-only contract this session." The FIX 3 edit did not add the disambiguating sentence that "the manager agent following orchestration/SKILL.md Step 1 row 6 procedure is the in-scope mechanism; the CLI code implementing that procedure is the deferred item." Without that sentence, the two claims are contradictory, and FIX 3 made the contradiction more acute (stronger assertion against an unchanged counter-statement) rather than less.

**Why it matters**: A Planner building Task E cannot determine whether this session's PR deliverable is: (a) skill-docs only, with session.json transcriptPath = null post-merge (consistent with "CLI deferred"), or (b) a manager that actively stamps transcriptPath by following the new skill-docs procedure (consistent with "NOT deferred"). These two produce different Planning tasks and different verification criteria.

---

## Preserve list

The following are well-executed and must not change on REVISE:

1. **FIX 1 (hook export contract)** — the three-statement contradiction from iter1 is fully resolved; hook contract table and P2 decisions now agree.
2. **FIX 2 (line-56 constraint placement)** — bolded constraint now appears twice in P4 context; cannot be missed by Planner or Executor.
3. **FIX 4 (two-gate health check)** — Gate 1 + Gate 2 are well-designed; Gate 2 failure message is specific and actionable.
4. **FIX 5 (CLAUDE_HOOK_SOURCE)** — consistently added across all 8 relevant locations.
5. **FIX 6 (v2.1.132)** — all version references consistent.
6. **FIX 7 (orchestration/SKILL.md line-371)** — added correctly to inventory, in-scope list, exit criteria, task E, and P6 decisions.
7. **FIX 8 (tilde-form)** — tilde-form storage specified in P6; consumer responsibility documented in P7; no absolute-path leakage.
8. **Empirical witness evidence** — three bootstrap observations unchanged and correct.
9. **File inventory precision** — all line numbers verified.
10. **Out-of-scope discipline** — four explicit exclusions remain well-reasoned.

---

## Overall verdict rationale

Six of seven perspectives return PASS. One perspective (Consistency) returns REVISE.

The driving finding is F-CONS-03 (High, confidence 100): FIX 3 introduced a new contradiction by asserting "NOT deferred" for transcriptPath stamping without adding the disambiguation that the manager-agent procedure (not CLI code) is the in-scope mechanism. Combined with the inherited F-CONS-02 (which was not fully resolved — only its surface symptom was addressed), the Planner faces genuinely conflicting instructions about what this session's PR delivers.

This meets the REVISE threshold (High finding, confidence ≥ 50). The scope of the needed fix is narrow: a single disambiguating sentence in P6 (e.g., "The manager agent stamps the field by following orchestration/SKILL.md Step 1 row 6 — this is the in-scope docs-contract; the CLI code implementing this procedure automatically is the deferred item").
