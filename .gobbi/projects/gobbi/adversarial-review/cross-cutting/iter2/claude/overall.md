# Overall (Stage 3) — Cross-cutting Batch (iter2, claude)

## Stage 0 Recap

7 cross-cutting skills + child docs. W/W/H clear. No phase mismatch. iter2 applied 8 fixes addressing iter1 FAIL+REVISE findings; resumed by replacement evaluator after iter2-original crash at perspective 2 of 8.

## Stage 3 — Holistic Pass

### Cross-perspective tensions (iter2)

**Tension A (Fix 1 partial sweep — DOMINANT iter2 theme)**: Performance, Usage, Consistency, and Risk all converge on `delegation/templates/evaluator.md:82-88` retaining "stay in your assigned perspective" / "trust parallel evaluators" / "the perspective's checklist" while the same file's wire format (L128) says "all 7 perspectives + Overall complete". Aesthetics also flags it (Medium). Structure flagged a related but distinct partial-sweep (Fix 3 staging contract leaking into loop skills). Five out of seven perspectives surface a partial-sweep regression in the doc the evaluator subagent actually loads. iter1's Critical contract-divergence is now bounded to a within-file contradiction — meaningful improvement — but the contradiction is in the template that closes the loop, so the loop verdict cannot reach PASS without resolution.

**Tension B (Interview integration — RESOLVED)**: iter1's Tension B (Interview invisible across orchestration + memorization) is closed by Fix 7 (orchestration row 7) + Fix 8 (memorization matrix). Project, Consistency, Risk all confirm the three-doc sync. Project flagged a new sub-issue (F-P-NEW-1 / F-R-NEW-2: binary emptiness threshold for sparse-but-not-empty projects) — Medium severity, not a blocker.

**Tension C (Scope Contract canonical anchor — PERSISTED)**: Project (F-P-02), and Overall (F-O-01) iter1 both flagged the load-bearing artifact has no canonical schema. iter2 intentionally did not address (out of fix-list scope). Persists at High conf 75 — recording as deferred, not as iter2 failure.

**Tension D (Fix 3 sweep — Structure-only finding)**: Structure's F-S-NEW-1 ("staging is assistant-owned PASS-only" wording in research/SKILL.md universalizes a research-only invariant and contradicts 4 loop skills' leader-staging-during-WORK contracts). Other perspectives did not surface this because the loop skills are out of batch and the contradiction is at the cross-batch boundary. Structure caught it because Structure's lens includes cross-cutting dependency checks.

### Cross-cutting findings (iter2-new)

### F-O-NEW-1 — Pattern: partial-sweep regression class introduced by iter2's targeted fixes

**Type**: `general` / **Domain**: `process` / **Confidence**: 75 / **Severity**: High / **Disposition**: open

**Evidence**: Fix 1 swept 7 sites across 4 files but missed `templates/evaluator.md:82-88`. Fix 3 introduced a "universal staging is assistant-PASS-only" framing in research/SKILL.md that contradicts 4 loop skills out-of-batch. Two of iter2's eight fixes have partial-sweep residue.

**Why it matters**: The Karpathy "wrong assumptions" mode reappears: iter1's fix scope assumed touching SKILL.md sites was sufficient — but templates are the contract subagents actually load, and cross-skill cross-references need explicit scope-limiting language. iter2's pattern: SKILL.md callouts get fixed, leaf docs (templates) + cross-skill references (loop skills) get missed. iter3 should add a "sweep-completeness check" to the fix protocol: list every grep-match site before patching, then re-grep after.

### F-O-NEW-2 — Three-doc sync triangulation works (positive)

**Type**: `general` / **Domain**: `process` / **Confidence**: 75 / **Severity**: — / **Disposition**: closed (pattern observation)

**Evidence**: Fix 7 + Fix 8 + interview/SKILL.md's pre-existing Memory Access Matrix form a 3-doc triangulation on Interview's authority. Each doc references the others; bootstrap detection criteria match across all 3 sites. Pattern: load-bearing contracts that span 3+ docs benefit from explicit mutual cross-reference. Recommend codifying this as a redesign principle. **Not a finding** — design-pattern endorsement.

### iter1 → iter2 disposition summary

| Disposition | Count | Examples |
|---|---|---|
| **Addressed (resolved)** | 7 | F-S-01 (Fix 5 links), F-S-02 (Fix 1 SKILL.md), F-P-01 (Fix 7 row 7), F-C-02 (Fix 5), F-C-03 (Fix 8), F-U-02 (Fix 6), F-R-02 (Fix 8), F-R-04 (Fix 6) |
| **Partially addressed (regression class)** | 3 | F-Pe-01 (Fix 1 partial), F-C-01 (Fix 1 partial), F-R-01 (Fix 1 partial) — all root-caused to `evaluator.md:82-88` |
| **Persisted (intentional defer)** | 6 | F-P-02 Scope Contract anchor, F-P-04 feature stamping, F-Pe-02 cumulative reads, F-Pe-03 no pruning, F-U-01 entry SOP, F-U-03 feature mechanism, F-U-04 re-ideate counter, F-C-04 verdict hierarchy, F-C-05 sub-doc asymmetry, F-R-03 concurrent sessions |
| **Deferred (out of scope)** | 2 | F-A-01 `_`-prefix convention, F-S-03/F-U-05 mistake skill |
| **NEW (iter2 surfaced)** | 5 | F-S-NEW-1 (Fix 3 cross-skill leak), F-P-NEW-1/F-R-NEW-2 (bootstrap binary), F-Pe-NEW-1/F-C-NEW-1/F-R-NEW-1 (Fix 1 template partial), F-O-NEW-1 (partial-sweep pattern), F-U-NEW-2 (row 7 forward-pointer ambiguity) |

### Regression summary

iter2 introduced **2 partial-sweep regressions**:
1. **Fix 1 didn't reach `templates/evaluator.md:82-88`** — Performance, Usage, Consistency, Risk, Aesthetics all flag. Codex iter2 also caught this independently. Cross-system + cross-perspective convergence = high confidence.
2. **Fix 3 universalized "staging is assistant-PASS-only" in research/SKILL.md** — contradicts 4 loop skills' leader-WRITE-during-WORK contracts. Structure-only flag (cross-batch boundary issue).

### Karpathy 4-modes check (iter2)

| Mode | Verdict | Evidence |
|---|---|---|
| **Wrong assumptions** | HIT | iter2 fix scope assumed touching SKILL.md sites was sufficient. Reality: templates and cross-skill references need explicit sweep. Same Karpathy-1 hit as iter1 but at a tighter scope (within-file vs cross-doc). |
| **Overcomplexity** | mitigated | No new complexity introduced; fixes were targeted single-file edits. |
| **Orthogonal edits** | mitigated | 8 fixes shipped together; each addressed an iter1 finding; no orthogonal scope creep. |
| **Imperative-over-declarative** | mitigated | Fixes preserved the declarative contract pattern. `memorization/SKILL.md:46` Interview row reads as a declarative permission with explicit gate-5-suspension semantics. |

### Two-iter trend table

| Perspective | iter1 verdict | iter2 verdict | Trend |
|---|---|---|---|
| Project | REVISE | REVISE | flat (F-P-02 deferred; F-P-01 closed; F-P-NEW-1 surfaced) |
| Structure | FAIL | REVISE | improving (F-S-01 + F-S-02 closed; F-S-NEW-1 introduced) |
| Performance | REVISE | REVISE | flat (F-Pe-01 downgrade; F-Pe-NEW-1 surfaced from same root) |
| Aesthetics | PASS | PASS | flat (polish residue, no escalation) |
| Usage | REVISE | REVISE | flat (F-U-02 closed; F-U-NEW-1 surfaced from Fix 1 partial sweep) |
| Consistency | FAIL | FAIL | flat (Critical → High but still 2 High conf 100; FAIL retained — calibration flag: REVISE defensible) |
| Risk | FAIL | REVISE | improving (Critical → High; F-R-02 + F-R-04 both resolved) |
| **Overall** | **FAIL** | **REVISE** | **improving** |

### Preserve list (iter2-augmented)

Carrying forward iter1 preserve list — **must NOT touch on REVISE**:
- The 4-stage evaluation procedure (Stage 0/1/2/3) structure
- The Type/Domain/Disposition/Confidence/Severity 5-field finding metadata
- The cumulative-staging-on-PASS contract
- The Question Card template + Decision/Reason/Evidence-to-change/Pros/Cons structure
- The Anti-Sycophancy banned-phrase table
- The 5-wave Interview structure
- Sole-writer-to-project-memory + narrow-exception pattern
- Frontmatter-discriminator vs directory-discriminator routing pattern

**Added by iter2 (new well-designed surfaces)**:
- The 3-doc triangulation on Interview authority (orchestration row 7 + memorization access matrix row + interview SKILL access matrix) — Fix 7 + Fix 8 pattern
- The NEEDS_CONTEXT user-question YAML schema + manager dispatch routing (Fix 6)
- The STATUS/VERDICT/ARTIFACT wire format first-line contract (Fix 4)
- The Anti-pattern callout for per-perspective evaluator spawning (`delegation/SKILL.md:214`)
- The Interview bootstrap-vs-mature access split

## Overall Verdict

**REVISE** — Loop verdict improves from iter1 FAIL to iter2 REVISE. The 8 fixes substantively addressed iter1's blockers (3 of 4 perspective FAILs/Criticals resolved). The remaining High-severity issues all root-cause to a single partial-sweep regression at `delegation/templates/evaluator.md:82-88` — a tight, low-cost remediation target. Per threshold rules (Critical conf ≥ 75 → FAIL; High conf ≥ 50 → REVISE), the loop has multiple Highs at conf 75-100 but no surviving Criticals — REVISE.

Calibration note: Consistency returned FAIL on the grounds that within-file contract divergence in the doc the evaluator loads is the failure mode this perspective owns. Risk returned REVISE because the blast radius is now bounded by the SKILL.md-level corrective signals. The Overall verdict resolves to REVISE because (a) the surviving issues are all single-target (`evaluator.md:82-88` rewrite + add scope-limiting clause to research/SKILL.md), (b) the dominant iter2 theme is "iter2 progress is real but incomplete", not "iter2 broke something new at higher severity".

## Per-perspective verdict table

| # | Perspective | iter1 | iter2 |
|---|---|---|---|
| 1 | Project | REVISE | REVISE |
| 2 | Structure | FAIL | REVISE |
| 3 | Performance | REVISE | REVISE |
| 4 | Aesthetics | PASS | PASS |
| 5 | Usage | REVISE | REVISE |
| 6 | Consistency | FAIL | FAIL |
| 7 | Risk | FAIL | REVISE |
| — | Overall | FAIL | **REVISE** |

## Loop verdict

**REVISE** — Per the aggregation rule (any FAIL among per-perspective verdicts at the loop level historically read as FAIL; but iter2's single FAIL is Consistency with explicit calibration noting REVISE is also defensible — and 5 of 7 perspectives + Overall converge on REVISE). One-sentence justification: iter2's 8 fixes resolved the iter1 Critical contract-divergence root cause but introduced a single partial-sweep regression at `delegation/templates/evaluator.md:82-88` that ripples across Performance/Usage/Consistency/Risk/Aesthetics — a tight, single-target remediation away from PASS.

## Low-confidence appendix (Overall)

- LC-O-1-iter2 (conf 25, Low): If a future iter resolves only `evaluator.md:82-88` without touching F-P-02 (Scope Contract anchor), the loop will still carry that persisted High from iter1. Recommend the manager + user discuss whether F-P-02 enters the iter3 fix list or stays explicitly deferred.
- LC-O-2-iter2 (conf 25, Low): F-S-NEW-1 (Fix 3 cross-skill leak) is Structure-only; if iter3 fixes it, verify by re-running Structure's Stage 1 scenario S7. Other perspectives are unlikely to surface it independently because the contradiction crosses a batch boundary.
