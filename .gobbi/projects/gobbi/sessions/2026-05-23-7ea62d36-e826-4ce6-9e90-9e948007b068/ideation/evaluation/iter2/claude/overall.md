---
artifact_type: evaluation
phase: ideation
iter: 2
perspective: overall
system: claude
verdict: FAIL
session-id: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: ideation
target: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/rawdata/draft-iter2.md
---

# Iter2 Re-evaluation — Overall (Claude)

## Cross-perspective synthesis

| Perspective | Verdict | Critical | High | Medium | Low |
|---|---|---|---|---|---|
| Project | FAIL | 0 | 1 | 1 | 1 |
| Structure | FAIL | 1 | 1 | 1 | 1 |
| Performance | PASS | 0 | 0 | 0 | 3 |
| Aesthetics | PASS | 0 | 0 | 0 | 4 |
| Usage | REVISE | 0 | 0 | 2 | 1 |
| Consistency | FAIL | 1 | 1 | 2 | 1 |
| Risk | FAIL | 1 | 1 | 0 | 2 |

**Critical findings (Confidence ≥ 75 → FAIL)**:
- F-CLAUDE-S2-01 / F-CLAUDE-CONS2-01 / F-CLAUDE-RISK2-01 — all three are the **same root cause**: iter2 claims the actual 5 Types are `improvement`, `bug`, `scenario_gap`, `checklist_gap`, `design_flaw`, but the actual 5 Types per `evaluation/SKILL.md:348-352` are `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`. The leader's "fix" for COD-STRUCT-001 substituted two invented terms (correction, decision-record) with two different invented terms (improvement, bug), then locked the wrong vocabulary across 8 sites in the draft. This is a regression — iter1 was at least obviously wrong; iter2 is plausibly-but-actually wrong.

**High findings (Confidence ≥ 50 → REVISE/FAIL)**:
- F-CLAUDE-S2-02 / F-CLAUDE-CONS2-02 — `evaluation/SKILL.md § Staging routing` does not exist (4 reference sites). The actual section is "Complete Domain → staging destination routing (`general` Type)" — which itself only applies to Type=`general`. Cross-link manifest #6 (added in iter2 specifically to resolve F-CLAUDE-S-02) points at a phantom anchor.
- F-CLAUDE-P2-01 — project-fidelity discipline partially broken (T-counts repaired but Type-vocabulary newly broken).

## Karpathy failure-mode scan

- **"Looks good to me" risk**: leader's iter2 changelog (lines 24-43) is well-formatted, finding-ID tagged, and gives the impression of thoroughness. An evaluator scanning the changelog and accepting "Finding-Type vocabulary fixed: re-spec'd against the actual 5 Types from `evaluation/SKILL.md:344-385`" without cross-reading the cited skill would PASS iter2. This is exactly the failure mode the evaluation skill warns against — the leader's claim cannot be trusted; verify against source.
- **Over-claim of empirical grounding**: iter2 frequently cites line ranges (e.g., "lines 344-385", "lines 385-393") that suggest empirical lookup. The T-counts citations are accurate; the Type-table citation is misleading (lines 344-352 contain only 5 Type rows, none of which are `improvement` or `bug`).

## Iter1-finding resolution summary

| Iter1 finding | Severity | Resolved in iter2? | Evidence |
|---|---|---|---|
| COD-PROJ-001 | High | partially — T-counts correct; project-fidelity broken elsewhere | iter2 lines 30, 126-127, 204, 228 OK; but vocabulary error at line 32 contradicts the "empirically grounded" claim |
| COD-PROJ-002 | High | YES | lines 61, 236-238, 357, 382-386, 578, 343-346 |
| COD-STRUCT-001 | High | **NO — regression to a new wrong vocabulary** | line 32 + 8 propagation sites; ground-truth at evaluation/SKILL.md:348-352 |
| COD-USAGE-001 | High | YES | lines 33, 67, 100, 219, 367, 542, 573 |
| COD-RISK-001 | High | partially — collision policy added, but auto-backfill classifier vocab is wrong | line 494-498 OK for policy mechanics; line 489 broken for vocabulary |
| COD-CONS-001 | High | partially — witness numbers consistent; vocabulary inconsistent | lines 30, 126-127, 576 OK; line 32, 489, 570, 580 broken |
| COD-OVERALL-001 | High | partially — same pattern as COD-PROJ-001 | (cross-perspective) |
| COD-PERF-001 | Medium | YES | lines 431-436 (Design A section 7) |
| COD-AESTH-001 | Medium | YES | line 36 + 12 plugin-path sites |
| COD-AESTH-002 | Low | YES | line 37, 143 |
| F-CLAUDE-C-01 | Medium | YES | lines 98, 363, 485 (directory-absent added) |
| F-CLAUDE-O-01 / R-02 | Medium | YES | lines 38, 95, 196, 278, 302, 369, 415, 425 |
| F-CLAUDE-S-01 / A-02 | Medium | YES | lines 39, 356, 380, 388 (section count = 8) |
| F-CLAUDE-R-03 | Medium | YES | lines 40, 220, 368, 546 (jq verified) |
| F-CLAUDE-C-03 | Medium | YES | line 41 (no-op re-verification) |
| F-CLAUDE-S-02 | Medium | partially — manifest added, but item #6 cites phantom anchor | lines 583-598 manifest present; #6 at line 594 broken |
| F-CLAUDE-U-02 | Medium | partially — citation now points at line 50 but cites a semantically different rule | line 102 |

**Score**: 10 of 17 iter1 findings cleanly resolved; 6 partially resolved; 1 regressed to worse-state (COD-STRUCT-001).

## Must-preserve list

The following iter2 changes are correct and must NOT be unwound during remediation:

1. T1-T7 eval count witness precision (lines 30, 126-127, 204, 228) — empirically verified.
2. Memorization-gap (T1/T2/T5) vs eval-also-skipped (T3/T4/T6/T7) distinction.
3. Triple-symlink discipline: `.gobbi/.../codex/SKILL.md` source + `.claude/skills/codex/SKILL.md` file symlink + `.agents/skills/codex` directory symlink. New adversarial scenario (lines 341-346).
4. Mode default = "auto" matching settings.default.json:3.
5. Auto-backfill collision-policy mechanics (lines 493-498) — read existing → compare finding-id → overwrite same / suffix different.
6. Cost + sandbox budget subsection (lines 431-436) — bring token-budget awareness to a previously invisible dimension.
7. Plugin path `~/.claude/plugins/...` home-rooted form.
8. CLAUDE.md:50 citation correction.
9. Post-eval `find` sanity check (3rd corrective from the mistake file) added at multiple sites.
10. `directory-absent` 4th gap category.
11. Section count locked at 8 (Design A).
12. Settings defaults verified via `jq`.
13. Cross-link manifest in Decisions Log (its structure — but item #6 needs re-anchoring).
14. The iter2-changelog table format (lines 28-43) is a good audit-trail pattern; preserve the discipline even while fixing the content.

## Verdict

**FAIL**

Threshold rule: any Critical finding with Confidence ≥ 75 → FAIL. Three Critical findings (F-CLAUDE-S2-01 / CONS2-01 / RISK2-01) are independent perspectives' views of the same root cause — the iter2 5-Type vocabulary is wrong — each at Confidence 100. COD-STRUCT-001 from iter1 (High) is not resolved; it regressed.

## Recommended next iter direction (NOT a fix — findings only)

The leader's iter3 will need to:
- Read `evaluation/SKILL.md:344-368` (Type table + Domain routing table) directly, not summarize from memory.
- Replace `improvement`/`bug` with `assumption_risk`/`general` in the 5-Type set.
- Re-derive the mechanical classifier: under the real vocabulary, `general` + a deterministic Domain (per the Domain→destination routing at evaluation/SKILL.md:354-368) is the volumetrically dominant mechanical case. `scenario_gap` and `checklist_gap` route mechanically. `design_flaw` and `assumption_risk` route to `staging/decisions/` and are typically judgment-required (or mechanical if the finding-id is unambiguous and disposition is `addressed`).
- Re-target the 4 cross-references to "Staging routing" at the correctly-titled section in evaluation/SKILL.md or remove the references.
- Re-state Success Criterion 8 either with the correct rule or remove it.
