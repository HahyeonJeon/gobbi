# Overall (Stage 3) — 5-Role Agent Taxonomy (iter4, claude)

## Cross-perspective verdict summary (iter3 → iter4)

| Perspective | iter1 | iter2 | iter3 | iter4 | Δ iter3→iter4 | Headline iter4 finding |
|---|---|---|---|---|---|---|
| Project | FAIL | REVISE | REVISE | **REVISE** | = | F-P-iter4-NEW-01 (prep) + F-P-iter4-NEW-02 (mistake-skill), both High/100 |
| Structure | FAIL | FAIL | PASS | **REVISE** | ↓ | F-S-iter4-NEW-01 + F-S-iter4-NEW-02 cross-file structural drift, both High/100 |
| Performance | REVISE | REVISE | PASS | **PASS** | = | (no NEW) |
| Aesthetics | REVISE | PASS | PASS | **PASS** | = | F-A-iter4-NEW-01 Medium/75 (preparation prose) |
| Usage | FAIL | REVISE | REVISE | **REVISE** | = | F-U-iter4-NEW-01 + F-U-iter4-NEW-02, both High/100; F-U-03 ADDRESSED |
| Consistency | FAIL | FAIL/REVISE | REVISE | **REVISE** | = | F-C-iter4-NEW-01 + F-C-iter4-NEW-02, both High/100 |
| Risk | FAIL | REVISE | REVISE | **REVISE** | = | F-R-iter4-NEW-01 + F-R-iter4-NEW-02 + stuck F-R-06 |

**Net iter3 → iter4**: 3 PASS + 4 REVISE + 0 FAIL → 2 PASS + 5 REVISE + 0 FAIL. **Structure regressed from PASS to REVISE** because iter4 introduced cross-file structural drift (preparation + mistake skill). Net trajectory: -1 PASS.

## iter3 disposition aggregate (iter4 fresh judgment)

Total iter3 findings inherited: 7 perspectives × ~3-5 findings each = ~28 findings.

| Disposition | Count | Notes |
|---|---|---|
| `addressed` (in iter4) | 7 | F-P-iter3-NEW-01/02 (Sweep 1), F-C-iter3-NEW-02/03 (Sweep 1), F-U-iter3-NEW-01 (Sweep 1), F-R-iter3-NEW-01 (Sweep 1), F-U-03 (Sweep 3 — stuck-3-iter closed!), F-A-iter3-NEW-01 + -02 (Sweep 5) |
| `disputed` | 1 | F-S-04 (per manager-supplied contract) |
| `open` (carry-forward unchanged) | ~13 | F-P-01, F-P-02, F-P-03, F-P-07, F-P-08, F-S-02, F-S-03, F-S-05, F-S-NEW-02, F-U-04, F-Pf-01, F-Pf-02, F-Pf-03, F-R-01, F-R-02, F-R-03, F-R-06, F-R-07 |
| `partially addressed` | 2 | F-R-04 (mixed: iter3 closed, iter4 introduced new), F-Pf-NEW-01 (carry mitigation) |
| `deferred` (user-locked carry) | 3 | F-P-06/F-C-03 CLAUDE.md, F-C-05 runtime symlink, F-C-DEF-01/02 |

**iter4 closed more iter3 findings than any prior iter**: 7 closures + 1 disputed = 8. Including the stuck-3-iter F-U-03 (evaluator.md path templates), which Sweep 3 fixed via a negative ratchet.

## Regression findings new in iter4

| ID | Type | Domain | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|
| **F-P-iter4-NEW-01 / F-S-iter4-NEW-01 / F-U-iter4-NEW-02 / F-C-iter4-NEW-01 / F-R-iter4-NEW-01** (same finding, 5 perspectives) | `design_flaw` | `process`+`docs-sync` | High/100 | orchestration/workflow/preparation.md:64+72 instructs leader to "stamp missing skills" + "apply missed memory promotions" + "New skills are actually stamped in this phase"; preparation/SKILL.md:30 says project memory tier is READ-ONLY for leader; wrap-up/SKILL.md:33 claims sole-writer; preparation.md:124 says leader stages and Wrap-up promotes | Sweep 4 added the staging-path language at line 124 but did NOT delete the violating prose at lines 64+72. The role skill is correct; the orchestration doc contradicts the role skill |
| **F-P-iter4-NEW-02 / F-S-iter4-NEW-02 / F-U-iter4-NEW-01 / F-C-iter4-NEW-02 / F-R-iter4-NEW-02** (same finding, 5 perspectives) | `design_flaw` | `docs-sync` | High/100 (Project/Structure/Usage/Consistency) or High/75 (Risk) | gobbi/SKILL.md:154 says "There is no separate `mistake` skill" but `ls .gobbi/projects/gobbi/skills/mistake/` returns `SKILL.md`. Five+ other surfaces (CLAUDE.md, 4 delegation templates, 4 agent files, executor.md:29) treat the skill as existing | Single stale claim in the entry-point skill contradicts the file system and 5+ load-bearing surfaces |
| **F-A-iter4-NEW-01** | `general` | `docs-sync` | Medium/75 | preparation.md aesthetic-level internal contradiction (same root cause as F-P-iter4-NEW-01 viewed from a polish lens) | Polish gap from the same partial sweep |

**Regression count NEW iter4**: 2 distinct root-cause findings (preparation prep-write + gobbi-mistake-claim), each surfacing across 5 perspectives = 10 perspective-level open findings (5+5 from the two root causes). Plus 1 Aesthetics-Medium.

## Stuck-finding re-check per iter4 contract

| ID | iter1 | iter2 | iter3 | iter4 | Status |
|---|---|---|---|---|---|
| **F-P-01** (v0.4→v0.5 retirement map) | open | open | open | open | stuck across 4 iters — not in iter4 sweep scope |
| **F-P-03** (dual-stance cross-pollination alt) | open | open | open | open | stuck across 4 iters — not in iter4 sweep scope |
| **F-R-06** (manager misroute recovery / phase-was-wrong status) | open | open | open | open | stuck across 4 iters — not in iter4 sweep scope |
| **F-U-03** (evaluator.md path templates) | open | open | open | **ADDRESSED** | Sweep 3 closed via negative ratchet — first stuck-3-iter finding to close |

**Stuck count went from 4 → 3** (F-U-03 closed). The 3 remaining stuck findings have NEVER been in any REVISE scope — all 4 iters have addressed only the immediately-prior-iter regression.

## F-S-04 disposition: must remain `disputed`

Per the iter4 contract: F-S-04 disputed per user lock (issue #258 tracks the drift validator). Git/SKILL.md:123 disclosure intact (verified). ✓

## Cross-perspective tensions

- **Performance + Aesthetics say PASS; Project/Structure/Usage/Consistency/Risk say REVISE** — the 2 root-cause NEW findings (preparation + mistake-skill) surface across 5 perspectives but not in Performance or Aesthetics. The cross-cutting nature surfaces the issue: when a contradiction lives in a load-bearing role contract, it surfaces in every perspective that touches that contract.
- **Structure regressed PASS→REVISE** while other perspectives held — Structure regression came from the cross-file structural drift (preparation orchestration vs role skill vs wrap-up). The iter3 Structure PASS was contingent on the bundle's coherence; iter4 introduced a clean cross-file contradiction.
- **iter4 closed F-U-03 (stuck-3-iter)** but introduced 2 new High findings on 5 perspectives — net perspective-level finding count went UP, not DOWN. The "comprehensive sweep" closed 7 + 1 stuck + 1 disputed but spawned 10 + 1 (Aesthetics).

## Regression summary — were any iter3 findings re-opened by iter4 sweeps?

| iter3 finding | iter4 status | Sweep responsible |
|---|---|---|
| F-P-iter3-NEW-01 (leader/executor frontmatter) | addressed | Sweep 1 |
| F-P-iter3-NEW-02 / F-C-iter3-NEW-03 / F-U-iter3-NEW-01 (wrap-up/SKILL.md) | addressed | Sweep 1 |
| F-C-iter3-NEW-02 (parallel surface) | addressed | Sweep 1 |
| F-R-iter3-NEW-01 (Principle 2 enforcement) | addressed | Sweep 1 |
| F-A-iter3-NEW-01 (git/SKILL.md dedupe) | addressed | Sweep 5a |
| F-A-iter3-NEW-02 (assistant.md citation) | addressed | Sweep 5b |
| F-U-03 (evaluator path templates — stuck-3-iter) | **addressed (negative ratchet)** | Sweep 3 |
| F-S-04 (drift detector) | disputed | per contract |
| F-P-01, F-P-03, F-R-06 (other stuck) | unchanged | not in scope |

**Zero re-opened iter3 findings.** All iter3 sweep targets correctly closed. The new findings are NEW (not regressions of iter3 closures), but they are of the **same partial-sweep shape** as the iter3 META-finding.

## Karpathy 4-modes — re-check after iter4

| Mode | iter1 | iter2 | iter3 | iter4 | Note |
|---|---|---|---|---|---|
| **Wrong assumptions** | HIT | mitigated | mitigated | **mitigated** | No premise drift |
| **Overcomplexity** | PARTIAL HIT | PARTIAL HIT | PARTIAL HIT (worse — 5 sync places) | **PARTIAL HIT (mixed)** | iter4 simplified some (Sweep 1 collapsed 4-place inconsistency to 1 contract) AND complicated others (preparation.md adds line 124 staging path WITHOUT deleting lines 64+72 — net more text saying contradictory things) |
| **Orthogonal edits** | HIT | same shape | same shape | **same shape** | iter4 was a single methodology (comprehensive sweep) but landed across 12+ files; nothing in iter4 review window is unrelated to the 5-role spec |
| **Imperative-over-declarative** | PARTIAL HIT | mitigated for evaluator | mitigated; displaced to wrap-up | **mitigated for wrap-up; new shape in preparation.md** | Sweep 1 rewrote wrap-up imperative MUST→NEEDS_CONTEXT (good); but preparation.md retained imperative "leader stamps skills" (bad — same imperative-vs-declarative shape relocated again) |

**Net Karpathy iter4**: Overcomplexity is the load-bearing failure — it has been HIT or PARTIAL HIT for **all 4 iters**, and iter4 specifically made it WORSE in one location (preparation.md gained 60 lines worth of contradictory prose) while making it BETTER in another (wrap-up/SKILL.md prose unified). The mode does not converge across iters.

> **Per the prompt's note: "Overcomplexity was unchanged across iter1-3; check if iter4 sweep simplified anything or made it worse"**
>
> **Verdict: BOTH.** Sweep 1 simplified the AskUserQuestion contract across 9+ files into a clean NEEDS_CONTEXT routing — this is a true simplification (one contract, one mechanism, audit-friendly). Sweep 4 made preparation.md MORE complex by leaving the violating prose AND adding the corrective prose. The net is a wash; the failure shape persists at a new location.

## Updated Preserve list (from iter4 perspective)

iter4 preserves from prior iters + adds new wins:

1. **Status enum 4-state contract** — preserved across all 4 iters
2. **Out-of-scope-before-lifecycle structure** — preserved
3. **Model selection rationale + per-role defaults** — preserved
4. **Read-only tool surfaces for evaluator** — preserved
5. **Anti-pattern callouts** — preserved
6. **Principle 2 enforcement** — now backed by frontmatter (iter4 Sweep 1 closed the soft-norm vs hard-contract gap)
7. **Canonical phase list cross-reference** (iter2 add) — preserved
8. **Evaluator schema delegated to evaluation/SKILL.md** (iter2 add) — preserved
9. **Mistake skill peer-conformant shape** (iter2 add) — preserved at file-system level; gobbi/SKILL.md needs reconciliation (F-iter4-NEW-02)
10. **assistant Memorization+Wrap-up explicit ownership + Write+Edit frontmatter** (iter3 add) — preserved
11. **NEEDS_CONTEXT escalation comprehensive** (iter4 Sweep 1 across all surfaces) — preserved and **complete** for the first time
12. **issue #258 deferred-skill pattern** (iter3 add) — preserved; precedent extended in Sweep 3 negative ratchet
13. **Sweep 3 negative ratchet pattern** (iter4 add) — preserve and reuse for future deferred-doc references
14. **wrap-up/SKILL.md internal consistency** (iter4 Sweep 1) — manager-context AskUserQuestion + assistant-context NEEDS_CONTEXT cleanly split

## Cross-cutting findings (Stage 3)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-O-iter4-NEW-01** | `process` | `process` | open | 100 | **High** | The partial-sweep regression shape recurs in iter4 despite the explicit "comprehensive sweep" methodology change. iter4 closed 7 iter3 findings (including stuck-3-iter F-U-03) but introduced 2 new High-severity findings of the same partial-sweep shape at fresh surfaces (preparation.md, gobbi/SKILL.md). The promised "comprehensive" sweep was bounded by the prompt's enumeration of violations — when a violation has two parts (preparation.md:64 AND :72), fixing one and adding a third (preparation.md:124) does not close the contradiction. Sweeps 2 and 4 had this pattern | The META-finding is unchanged from iter3: the REVISE process is not closing the regression shape. iter4 SHOULD have been the comprehensive fix; instead, it was comprehensive WITHIN the enumerated violations but did not extend coverage to the violation's actual extent on each surface. The mechanical drift detector (issue #258) is the long-term answer; until it lands, the methodology needs grep-driven discovery per fix, not per finding |
| **F-O-iter4-NEW-02** | `process` | `process` | open | 75 | Medium | Three of four iter3 stuck findings (F-P-01, F-P-03, F-R-06) survived a fourth iter because none of them have appeared in any REVISE scope. iter4 closed one (F-U-03 via Sweep 3) by including it in the scope. The pattern: stuck findings close when explicitly named; they survive when scope is "close the iter (n-1) regressions" | A targeted stuck-sweep iter — addressing F-P-01 + F-P-03 + F-R-06 + F-S-02 + F-S-03 + F-S-05 + F-S-NEW-02 + F-U-04 + F-P-07 — would be more productive than another REVISE iter focused on iter4's two NEW regressions. The two iter4 regressions are mechanical 1-line fixes; the stuck findings need actual design work |

## Overall verdict

**REVISE**

Strict rule application:
- 0 Critical findings (F-S-04 disputed per contract)
- **High findings (open + newly-surfaced):**
  - F-P-iter4-NEW-01 + F-S-iter4-NEW-01 + F-U-iter4-NEW-02 + F-C-iter4-NEW-01 + F-R-iter4-NEW-01 (5 perspectives, 1 root cause: preparation contradiction) — all High/100
  - F-P-iter4-NEW-02 + F-S-iter4-NEW-02 + F-U-iter4-NEW-01 + F-C-iter4-NEW-02 + F-R-iter4-NEW-02 (5 perspectives, 1 root cause: mistake-skill contradiction) — High/100 (Project/Structure/Usage/Consistency) or High/75 (Risk)
  - F-O-iter4-NEW-01 (META: partial-sweep regression recurrence) — High/100
  - Stuck: F-P-03 (High/75), F-R-06 (High/75)
- Per the threshold rule: any High ≥ 50 → **REVISE**

This is **not** a downgrade from iter3 (iter3 was REVISE; iter4 is REVISE). But it is a **methodology failure** — the iter4 comprehensive sweep was promised as the closure of the iter3 partial-sweep regression class. Instead, iter4 closed 7 + 1 stuck findings (the best closure rate of any iter) but spawned 2 new findings of the same partial-sweep shape.

Quantitatively: **iter4 is the best iter so far** by absolute progress (more closures, including the first stuck-3-iter close, and Sweep 1 backed by frontmatter is structurally durable). Qualitatively: the regression-class shape **persists for the 4th consecutive iter**, including iter4 itself which was the methodological intervention designed to close it.

## Loop verdict recommendation to the manager

**REVISE iter5** with VERY narrow scope — two 1-line fixes plus the F-O Overall META acknowledgment:

1. **F-iter4-NEW-01 (preparation contradiction)**: in `skills/orchestration/workflow/preparation.md`, delete or rewrite lines 64 + 72 to align with lines 123-125 + `preparation/SKILL.md:30` + `wrap-up/SKILL.md:33`. Specifically:
   - Line 64: change "executes the approved gap fixes (stamp missing skills, apply missed memory promotions)" → "stages the approved gap fixes (Wrap-up promotes per the routing table)" or similar
   - Line 72: change "New skills are actually stamped in this phase" → "Skill stamping is staged at `sessions/.../preparation/staging/skills/{slug}/SKILL.md`; Wrap-up promotes to project memory at session close"

2. **F-iter4-NEW-02 (mistake skill claim)**: in `skills/gobbi/SKILL.md:154`, change "There is no separate `mistake` skill" → "The `mistake` skill is loaded by every agent and lives at `skills/mistake/SKILL.md`; the underlying mistake recordings live at `.gobbi/projects/{project-name}/mistakes/`."

3. **F-O-iter4-NEW-01 (META process finding)**: record in project memory (mistakes/) that partial-sweep failures recur — sweep methodology MUST grep for every instance of the contract claim, not only the violations enumerated in the prior iter's findings.

These are mechanical 2-line edits; iter5 should run as a single executor delegation with verification via grep + adversarial review.

**Stretch:** Address the stuck set (F-P-01 + F-P-03 + F-R-06 + 5 others) in a separate "stuck-sweep" iter as F-O-iter4-NEW-02 suggests. That iter would do actual design work (retirement map, dual-stance alternative, phase-was-wrong status enum).

## Final per-perspective verdict (strict rule)

| Perspective | iter3 | iter4 |
|---|---|---|
| Project | REVISE | **REVISE** |
| Structure | PASS | **REVISE** (regression) |
| Performance | PASS | **PASS** |
| Aesthetics | PASS | **PASS** |
| Usage | REVISE | **REVISE** |
| Consistency | REVISE | **REVISE** |
| Risk | REVISE | **REVISE** |
| **Overall** | **REVISE** | **REVISE** |

**Loop recommendation**: **REVISE iter5** (narrow scope: 2 one-line fixes + META acknowledgment). If the user accepts the contradictions as known-defects-with-pointers, the bundle can become PASS via a `disputed` disposition on F-iter4-NEW-01 + -02 — but that pattern is exactly what F-S-04 set; using it twice more would be a process anti-pattern (disputing rather than fixing 1-line edits).

## Karpathy 4-modes status (final)

- **Wrong assumptions**: mitigated (carry from iter2)
- **Overcomplexity**: PARTIAL HIT (mixed — Sweep 1 simplified across surfaces; Sweep 4 added contradictory prose without deletion)
- **Orthogonal edits**: same shape (carry)
- **Imperative-over-declarative**: mitigated for wrap-up (Sweep 1); displaced to preparation.md (Sweep 4 left imperative "leader stamps")

The shape of the failure migrates rather than closes — characteristic of partial-sweep REVISE iterations. iter4 was the methodological intervention; the next iter must close it OR accept that the mechanical drift detector (issue #258) is the only durable answer.

## Notes specific to iter4 prompt's anti-patterns

- **"Don't be lenient because the sweep was extensive"** — verified: iter4 closed 7 + 1 stuck findings (most of any iter), but the partial-sweep shape recurred, producing 2 new High root-cause findings. The verdict is REVISE, not PASS-with-credit.
- **"Don't downgrade iter3 Critical to 'addressed' without grep evidence"** — every iter3 closure cited grep / file / read evidence: frontmatter tools-list grep, wrap-up/SKILL.md AskUserQuestion line-by-line audit, evaluator.md negative-ratchet read, git/SKILL.md grep -c.
- **"Looks fine verdicts forbidden"** — verdict is REVISE with specific 2 NEW High root causes and the F-O META.
- **"Comfort is a warning sign — if iter4 reads as PASS-ready, you have not pushed hard enough"** — iter4 INITIALLY reads as PASS-ready (7 closures, stuck-3-iter close, frontmatter contract). The grep on `gobbi/SKILL.md` for mistake-skill claim and the close-read of `preparation.md` are what surfaced the 2 new High root causes. Both required active adversarial work to find.
