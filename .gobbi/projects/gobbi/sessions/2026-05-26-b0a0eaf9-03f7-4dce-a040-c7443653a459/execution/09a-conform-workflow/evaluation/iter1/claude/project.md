# Project perspective — T9a conform features/workflow §4 (commit 1287e88)

Brief contract: conform 26 non-archive features/workflow docs to dev-doc standard §4; exclude archive.

## Gate results (own commands, diff-read)
- GATE 1 (§4.5 full leak gate, archive-safe, all S keys incl session-routing residue both spellings): **0 leaks** (was 19). Conditional non-backlog `disposition`: **0 leaks**. PASS.
- GATE 2 (9 base keys on all 26 non-archive docs): all 26 carry name/description/type/scope/feature/status/created/session/tags. PASS.
- GATE 3 (disposition on the 1 backlog): `lock2-shared-executor-mega-task-risk.md` retains `disposition: open` (+ `status: deferred`, `priority: medium`). PASS.
- GATE 5 (scope): all 24 changed paths under features/workflow/; NO archive doc; NO other feature. PASS.
- Type normalization: all type values canonical per dir (checklist_gap→checklists, design_flaw→decisions, assumption_risk→backlogs all resolved). PASS.
- 26-doc accounting: 24 changed + 2 already-conformant-at-re-home (`changelogs/2026-05-26-bundle-b-rehome.md`, `decisions/wrap-up-step-2-5-escalation-default.md`) = 26 conformant. No scope gap.

## Findings

### F1 — KEEP key `project: gobbi` stripped from workflow README (repeats just-fixed T8 mistake)
- Type: design_flaw | Domain: process | Disposition: open | Confidence: 100 | Severity: High
- Evidence: `git show 1287e88 -- features/workflow/README.md` removes `-project: gobbi` with no re-add. Current README (lines 1-14) has no `project:` key. The immediately-preceding commit `dbe61c3 "fix(conform): restore KEEP keys project/last_updated over-stripped by T8"` restored `project: gobbi` to the project-memory README, explicitly citing the §4.4 KEEP list and "consistent with 07c/07d which preserved them." T9a then re-stripped `project` on the workflow README.
- Why it matters: Brief Gate 7 enumerates `project` as a KEEP key that must NOT be removed. The same-session prior commit established `project` as KEEP and remediated this exact over-strip. T9a repeats the corrected mistake on a sibling README, and is internally inconsistent: `decisions/wrap-up-step-2-5-anchor-placement.md` RETAINED `project: gobbi` (net 0) while README dropped it. Reference project-memory README carries `project: gobbi` (line 13); workflow README does not.
- Note (standard tension): canonical §4.4 KEEP list (rules.md line 231) does NOT itself name `project`. The operative KEEP convention comes from the T8 remediation + brief Gate 7. The strip violates the operative convention, not the literal §4.4 line. Manager+user to confirm whether `project` is KEEP (per dbe61c3) — if yes, this is a clear violation requiring restore.
- Suggested direction: restore `project: gobbi` to workflow README to match dbe61c3 convention and sibling docs.

## Verdict reasoning
Gates 1/2/3/5/type all PASS. One High-confidence KEEP-strip (F1) that mirrors the just-remediated T8 defect and trips the brief's CRITICAL Gate 7 ("no KEEP key stripped"). Per threshold rules a High@100 → REVISE.

VERDICT: REVISE
