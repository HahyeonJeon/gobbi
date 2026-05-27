# Consistency Perspective — T9b conformance (commit 2e24dfe)

Focus: uniform treatment across the 35 docs; alignment with the T9a sibling and the §4 standard.

## Results
- **Uniform base-key block**: all 35 docs present the same 9 base keys in the same order. Consistent.
- **Uniform backlog disposition**: all 15 content backlogs carry `disposition`; the index README does not. Consistent rule application.
- **Tag arrays**: every conformed doc gained a `tags:` array; values are descriptive content tags. Consistent.

## Findings

### CONS-1 — §4.1 title-decrypt applied in T9a but not in T9b (campaign inconsistency)
- **Type:** general · **Domain:** consistency · **Severity:** High · **Confidence:** 100 · **Disposition:** open
- **Evidence:** T9a (fc17c34, Part B) de-crypted 8 cryptic-led headings ("LOCK #2 Tasks 07+08…" → "Shared-executor context-budget risk (LOCK #2)"; "Task 01 traces-to overclaim…" → "Conformance task traces-to overclaim…"). T9b left 5 structurally identical cryptic-led H1/`title` ("Item 1-3 alternative —…", "Item 1-2 —…", "Item 2-1 —…") untouched while claiming "0 cryptic-led titles." Same campaign, same §4.1 rule, inconsistent application.
- **Why it matters:** A reader landing on `decisions/`→`backlogs/` across the project now meets two title conventions — subject-first (T9a-touched workflow docs) vs coordinate-first (T9b backlogs). The §4.1 bar ("names its subject in the first line") is met in one tier and not the other. Consistency is the perspective that catches divergence the per-file view misses.
- **Suggested direction:** apply the T9a Part-B treatment to the 5 Item-N backlogs (subject-first H1 + `title`, coordinate demoted to parenthetical), or have the user explicitly scope them out — but then fix the false "0 cryptic-led titles" claim.

### CONS-2 — `feature` key treated two ways in one commit
- **Type:** assumption_risk · **Domain:** consistency · **Severity:** Low · **Confidence:** 75 · **Disposition:** open
- **Evidence:** normalize-path backlog `feature` nulled; notes journals' `feature` retained (see RISK-1). Both defensible per §2.1/§3, but the divergent handling within one commit is a minor consistency smell worth user confirmation.

## Must-preserve
- Uniform base-key block; uniform backlog-disposition rule.

VERDICT: REVISE
