# Vision Operational Checklist

Unchecked source for running the operation in [`SKILL.md`](SKILL.md). Each analysis works a fresh filled copy;
never tick or write resolutions into this source. **Mode:** operational. **Use style at pause points A–E:**
`read-do`. **Source version:** `vision-checklist-v1`. **Owner:** the vision operation. **Consumers:** the active
analyst and the evaluator reviewing its evidence.

A filled copy records the source version, run ID, artifact IDs, selected children, planned/actual coverage,
named evidence beside each resolution, coverage-closure result, and acceptance result. The checklist applies
to one artifact or a parent-planned set; conditional rows require inspected evidence before `n/a` is legal.

## Resolution State Machine

- `PASS` — the pass condition was verified true from named, inspected evidence.
- `FAIL:<finding/action-id>` — the pass condition was verified false; cite the finding or action.
- `n/a:<property>` — inspected evidence proves the applicability predicate false; name the property and evidence.
- `recorded-open:<owner+resolution-method>` — the item remains open with its owner and resolution method; this
  closes operational coverage but never grants acceptance.
- `waived/exception-authorized:<authority+rationale>` — operational-only gate exception whose named authority
  covers the gate's stated consequence and stop action; cite authorization evidence. It substitutes for pass
  only on that gate and is never counted as `PASS`.

`CONSIDERED` is advisory-only and this checklist has no advisory items. `deferred` is design-mode-only. Neither
token is valid here. An unchecked box is unresolved, not terminal.

## Checklist

## Pause point A — Before inspection

- [ ] **VISION-CHECK-A01 [GATE, read-do] — The assignment frame is complete or explicitly provisional.**
  - Claim: artifact, purpose, audience, intent, constraints, source hierarchy, and success condition are usable.
  - Applicability: unconditional.
  - Pass: every field is supplied or carries an explicit bounded assumption, confidence effect, and reversal
    evidence; artifact identifiers are stable.
  - Evidence: assignment/frame record and artifact inventory.
  - On fail: consequence — analysis could answer the wrong question; stop inspection and repair parent step 1.
  - Source: `SKILL.md` step 1; O-001, O-002, O-023.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-A02 [GATE, read-do] — Authority and evidence boundaries are locked.**
  - Claim: analysis-only authority and claim-specific source limits are explicit.
  - Applicability: unconditional.
  - Pass: the source list states what each item can verify, unavailable evidence is named, and no artifact edit
    or generation is planned.
  - Evidence: authority statement, source ledger, and planned inspection actions.
  - On fail: consequence — source mutation or unsupported claims could occur; stop all artifact actions and
    return to parent steps 1–2.
  - Source: `SKILL.md` Rules and steps 1–2; O-003, O-004, O-028, O-033.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-A03 [GATE, read-do] — Type routing covers every material evidence type.**
  - Claim: one primary and every applicable secondary child are selected with reasons.
  - Applicability: unconditional.
  - Pass: the artifact inventory is compared with all five routing predicates; presentation video and dashboard
    chart compositions are handled; unlisted types use the core/closest child without an invented branch.
  - Evidence: artifact-component inventory and routing record.
  - On fail: consequence — a material analysis dimension will be skipped; stop mapping and rerun parent step 2.
  - Source: `SKILL.md` step 2; O-037, O-038.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-A04 [REQUIRED, read-do] — Coverage is planned at the promised depth.**
  - Claim: population, selection, exclusions, boundaries, outliers, and depth are reproducible.
  - Applicability: unconditional; a singular artifact records singular coverage.
  - Pass: one artifact is identified, or a set/sequence has an enumerated population and a risk-proportional,
    deterministic selection rule with actual-coverage fields ready to fill.
  - Evidence: population inventory and coverage plan.
  - On fail: return to parent step 3 before using exhaustive or population-wide language.
  - Source: `SKILL.md` step 3; O-013–O-016, O-029, O-031.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-A05 [REQUIRED, read-do] — Unknown context is visible before interpretation.**
  - Claim: missing purpose, identity, locale, culture, audience, state, or chronology is not silently inferred.
  - Applicability: unconditional.
  - Pass: every missing load-bearing fact is listed with alternatives and its likely effect on later judgment.
  - Evidence: assumptions/unknowns ledger.
  - On fail: return to parent step 1 and lower or remove affected claims.
  - Source: `SKILL.md` step 1; O-002, O-023.
  - Resolution: `[ ]`

## Pause point B — After observation, before judgment

- [ ] **VISION-CHECK-B01 [REQUIRED, read-do] — The whole-artifact gist remains provisional and revisable.**
  - Claim: first impression is recorded before details but not treated as conclusion.
  - Applicability: unconditional.
  - Pass: gist includes focal order, apparent message/task, regions, impression, and uncertainty; later revisions
    are traceable.
  - Evidence: initial gist and revision note.
  - On fail: return to parent step 4 and separate hypothesis from conclusion.
  - Source: `SKILL.md` steps 4 and 7; O-007, O-009.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-B02 [GATE, read-do] — All four maps exist with stable locators.**
  - Claim: structure, components/objects, attention, and text/symbols cover every material selected region.
  - Applicability: unconditional.
  - Pass: stable IDs, location, visible attributes, role hypothesis, evidence class, and confidence exist for all
    material items; unreadable or ambiguous items remain marked.
  - Evidence: four map artifacts and selected-region coverage trace.
  - On fail: consequence — later findings cannot be located or reconciled; stop judgment and return to parent
    step 5.
  - Source: `SKILL.md` step 5; O-009, O-024, O-025.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-B03 [REQUIRED, read-do] — Material relationships are inspected.**
  - Claim: meaning-bearing relations are tested, not replaced by isolated object inventory.
  - Applicability: unconditional.
  - Pass: applicable containment, grouping, alignment, overlap/z-order, label-target, assertion-evidence,
    legend-mark, state-action, reading, temporal, or causal relations are recorded with endpoints.
  - Evidence: relationship graph and relation-to-map-ID trace.
  - On fail: return to parent step 6 before making hierarchy or meaning claims.
  - Source: `SKILL.md` step 6; O-009, O-012.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-B04 [GATE, read-do] — Observation and interpretation are evidence-classed separately.**
  - Claim: wording, evidence class, and confidence do not outrun available pixels or sources.
  - Applicability: unconditional.
  - Pass: readable observations, measurements, inferences, intent-dependent readings, and unknowns use the
    parent enum correctly; alternate hypotheses remain where evidence cannot decide.
  - Evidence: map/finding evidence-class audit and source links.
  - On fail: consequence — hallucination can enter the report; stop judgment and reclassify or remove claims.
  - Source: `SKILL.md` Rules and steps 5–7; O-002, O-005–O-008, O-010, O-023, O-025.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-B05 [GATE, read-do] — Whole and local evidence have been cross-checked.**
  - Claim: strong whole quality cannot hide a local defect, and one local defect cannot erase whole strengths.
  - Applicability: unconditional.
  - Pass: each selected region is checked bottom-up, each major local finding returns to full context, and every
    strong whole conclusion is challenged at edges, text, repeated details, or temporal neighborhoods.
  - Evidence: crop/full-view pairs or frame neighborhoods plus strength/finding trace.
  - On fail: consequence — material defects or strengths may be omitted; stop synthesis and complete the
    bottom-up/return-to-whole pass.
  - Source: `SKILL.md` steps 8–9; O-011, O-030, O-032.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-B06 [REQUIRED, read-do] — Text and symbols stop at legibility.**
  - Claim: only readable text is transcribed and OCR remains a verified lead.
  - Applicability: artifact contains or may contain text/symbols; otherwise `n/a:<no text/symbol evidence>`.
  - Pass: readable runs match pixels or supplied copy; unresolved runs and symbols are marked unknown rather
    than completed from convention.
  - Evidence: original-resolution crops, text map, optional OCR comparison, and supplied copy.
  - On fail: remove invented transcription and return to parent steps 5 and 9.
  - Source: `SKILL.md` steps 5 and 9; O-006, O-008.
  - Resolution: `[ ]`

## Pause point C — Before type-specific evaluation

- [ ] **VISION-CHECK-C01 [GATE, read-do] — Every selected child procedure was actually run.**
  - Claim: routing decisions produce child-specific evidence, not labels alone.
  - Applicability: unconditional.
  - Pass: each selected child has completed steps and locatable evidence returned to the parent; mixed artifacts
    include every independent child contribution.
  - Evidence: routing-to-child completion ledger and child evidence locators.
  - On fail: consequence — evaluation is materially incomplete; stop synthesis and run the missing child.
  - Source: `SKILL.md` steps 2 and 8; O-024, O-029, O-031, O-037, O-038.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-C02 [GATE, read-do] — Type-specific claims respect their evidence boundary.**
  - Claim: UI behavior, deck sequence, video time, image detail, and chart truth use the evidence each requires.
  - Applicability: unconditional for selected children.
  - Pass: UI hidden behavior needs live/source evidence; deck narrative needs order; temporal claims need ordered
    frames; fine image claims need resolution; chart correctness needs data plus transformations.
  - Evidence: child evidence-boundary ledger and claim audit.
  - On fail: consequence — the report asserts facts the artifact cannot prove; stop and narrow, verify, or mark
    the affected claim unknown.
  - Source: `SKILL.md` Rules and step 9; O-024–O-036.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-C03 [GATE, read-do] — Accessibility is evaluated at supported depth.**
  - Claim: every artifact has an applicability disposition and no screenshot-only formal conformance claim.
  - Applicability: unconditional.
  - Pass: visible risks, equivalent-information needs, and unavailable implementation/behavior evidence are
    separate; exact/current formal claims have measurement and authoritative-version evidence.
  - Evidence: accessibility applicability ledger, measurements, implementation evidence, and standards owner
    record where a formal claim is used.
  - On fail: consequence — excluded viewers or false compliance assurance may result; stop handoff and correct
    or qualify the accessibility findings.
  - Source: `SKILL.md` Rules and steps 8–9; O-021, O-022.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-C04 [REQUIRED, read-do] — Supplied truth and conformance are compared without becoming quality.**
  - Claim: copy, data, code, DOM, reference, design system, and `DESIGN.md` verify only their owned claims.
  - Applicability: any supplied truth/reference; otherwise `n/a:<no supplied truth/reference>`.
  - Pass: mismatches and matches are recorded, claim owners are explicit, and task/content/aesthetic evaluation
    remains independent.
  - Evidence: claim-to-source comparison ledger and separated finding classes.
  - On fail: return to parent steps 1, 7, and 8; separate conformance from effectiveness.
  - Source: `SKILL.md` Rules and steps 7–8; O-027, O-034, O-035.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-C05 [REQUIRED, read-do] — Aesthetics are contextual and multi-level.**
  - Claim: observable craft, contextual effectiveness, and subjective tradeoff are distinguished in parent
    priority order.
  - Applicability: unconditional.
  - Pass: findings use declared intent/reference/context before conventional polish and taste, cover applicable
    craft dimensions, and do not invoke a universal formula or beauty score.
  - Evidence: criterion/finding-class audit and context-to-aesthetic trace.
  - On fail: return to parent step 8 and reclassify formulaic or taste-based claims.
  - Source: `SKILL.md` Principles, Rules, and step 8; O-017–O-020, O-024, O-027.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-C06 [REQUIRED, read-do] — Audience, brand, genre, medium, culture, and emotion are handled as evidence.**
  - Claim: contextual fit is evaluated without inventing identity or penalizing valid expression.
  - Applicability: unconditional; missing context remains intent-dependent rather than `n/a`.
  - Pass: supplied context is traceable, missing context has alternatives, expressive tradeoffs are explicit,
    and recommendations preserve effective distinctiveness.
  - Evidence: context ledger, aesthetic finding classes, and preserve constraints.
  - On fail: return to parent steps 1 and 8.
  - Source: `SKILL.md` steps 1 and 8; O-002, O-017–O-019, O-023.
  - Resolution: `[ ]`

## Pause point D — Before prioritization

- [ ] **VISION-CHECK-D01 [GATE, read-do] — High-impact and precision claims passed adversarial verification.**
  - Claim: exact, temporal, exhaustive, negative, ambiguous, and comparison claims have proportional proof.
  - Applicability: unconditional.
  - Pass: crops return to whole; exact claims are measured; temporal claims use ordered evidence; counts use an
    enumerated population; negatives match coverage; capture noise is separated; alternatives are tested.
  - Evidence: verification ledger with original/crop, measurement, frame run, count, comparison classification,
    or alternate-hypothesis evidence per applicable claim.
  - On fail: consequence — wrong priorities may drive harmful revision; stop ranking and verify, narrow, or mark
    the claim unknown.
  - Source: `SKILL.md` step 9; O-006, O-008, O-014–O-015, O-019, O-022, O-025–O-026, O-032, O-034.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-D02 [GATE, read-do] — Every finding satisfies the parent schema substantively.**
  - Claim: a finding is locatable, evidenced, classified, interpreted, impact-aware, calibrated, and verifiable.
  - Applicability: every finding; if none, the negative conclusion still requires coverage evidence.
  - Pass: all 15 parent fields contain artifact-specific values and finding/evidence enums are valid; headings
    or design vocabulary alone cannot pass.
  - Evidence: field-by-field finding audit and artifact-specificity probe.
  - On fail: consequence — the consumer cannot assess or act; stop prioritization and repair the finding.
  - Source: `SKILL.md` step 10; O-005, O-012, O-018, O-035, O-039.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-D03 [REQUIRED, read-do] — Priority follows impact, evidence, dependency, and effort awareness.**
  - Claim: salience or polish alone does not determine rank.
  - Applicability: two or more findings; a single finding records rank 1.
  - Pass: correctness, integrity, task, and accessibility consequences are considered before cosmetic salience;
    confidence and dependencies are visible; ties are explained.
  - Evidence: ranked finding table and priority rationale.
  - On fail: rerank under parent step 10.
  - Source: `SKILL.md` Rules and step 10; O-027, O-035, O-039.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-D04 [REQUIRED, read-do] — Strengths and preserve constraints shape every material change.**
  - Claim: recommendations do not erase effective hierarchy, task flow, density, expression, identity, or craft.
  - Applicability: every change recommendation.
  - Pass: relevant strengths are named, each recommendation has preserve constraints, and at least one
    preserve-good counterfactual is tested for a major change.
  - Evidence: strengths section, recommendation fields, and counterfactual note.
  - On fail: return to parent steps 8 and 10 before ranking the change.
  - Source: `SKILL.md` Principles and step 10; O-011, O-017, O-020, O-030, O-040.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-D05 [GATE, read-do] — Uncertainty and missing evidence are not hidden by priority.**
  - Claim: unsupported source, behavior, intent, temporal, cultural, and data claims remain unknown or bounded.
  - Applicability: unconditional.
  - Pass: every low-confidence/unknown item names missing evidence and reversal conditions; unresolved critical
    proof is not ranked as a known defect.
  - Evidence: uncertainty ledger cross-checked against findings and priorities.
  - On fail: consequence — the report can cause confident but unjustified action; stop ranking and repair
    evidence class/confidence or record the open evidence.
  - Source: `SKILL.md` steps 1, 7, 9–10; O-003, O-010, O-016, O-021, O-036, O-041.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-D06 [REQUIRED, read-do] — Recommendations are implementation-ready without implementing.**
  - Claim: each recommendation names target, change, preserve constraints, expected effect, and verification.
  - Applicability: every recommendation.
  - Pass: a downstream implementer can identify what to change and how to test it without receiving an artifact
    mutation from this operation.
  - Evidence: recommendation-field audit.
  - On fail: rewrite under parent step 10; do not perform the change.
  - Source: `SKILL.md` step 10; O-012, O-020, O-039, O-040.
  - Resolution: `[ ]`

## Pause point E — Before handoff

- [ ] **VISION-CHECK-E01 [REQUIRED, read-do] — The report contains all nine parent sections in order.**
  - Claim: context through verification plan forms one coherent parent report.
  - Applicability: unconditional.
  - Pass: all nine sections exist with substantive, artifact-specific content; child evidence is integrated
    rather than emitted as separate verdicts.
  - Evidence: final report section/content audit.
  - On fail: return to parent step 10 and complete or explicitly qualify the missing section.
  - Source: `SKILL.md` step 10; O-001, O-037, O-039.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-E02 [GATE, read-do] — Coverage closure and acceptance are computed separately.**
  - Claim: terminal resolution coverage does not silently become acceptance.
  - Applicability: unconditional.
  - Pass: every applicable gate/required row has a valid terminal for coverage closure, and acceptance is true
    only when each is `PASS` or a narrowly valid operational gate waiver substitutes on that item.
  - Evidence: completed filled copy, named evidence per terminal, and separate closure/acceptance results.
  - On fail: consequence — an incomplete or failed analysis could be handed off as complete; stop handoff and
    resolve the invalid/unresolved row or report non-acceptance.
  - Source: `SKILL.md` final Procedure paragraph; O-004, O-013, O-016, O-041.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-E03 [GATE, read-do] — Final claims stay within evidence and actual coverage.**
  - Claim: the executive summary does not reintroduce discarded precision, exhaustive negatives, formal
    conformance, hidden behavior, temporal facts, or chart correctness.
  - Applicability: unconditional.
  - Pass: summary and body agree on assumptions, evidence classes, confidence, unknowns, actual coverage, and
    source limitations.
  - Evidence: final claim-to-evidence and summary-to-body reconciliation.
  - On fail: consequence — the most-read section becomes misleading; stop handoff and correct the summary or
    supporting evidence.
  - Source: `SKILL.md` Rules and steps 3, 9–10; O-002–O-003, O-008, O-015, O-022, O-028, O-033, O-036, O-041.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-E04 [REQUIRED, read-do] — The top three priorities are explicit and justified.**
  - Claim: the consumer can identify the three highest-value next improvements or the reason fewer exist.
  - Applicability: one or more findings; otherwise `n/a:<no supported findings after complete coverage>`.
  - Pass: ranks 1–3 are named with impact, evidence, preserve constraints, and verification; if fewer than three
    supported findings exist, the report says so without manufacturing issues.
  - Evidence: ranked priorities and corresponding finding records.
  - On fail: return to parent step 10 and complete priority synthesis.
  - Source: `SKILL.md` step 10; O-039.
  - Resolution: `[ ]`
- [ ] **VISION-CHECK-E05 [REQUIRED, read-do] — Verification can test effect, preservation, and regressions.**
  - Claim: the next review can determine whether each material recommendation worked without relying on taste.
  - Applicability: every material recommendation.
  - Pass: verification names comparable context, required evidence, target signal, preserve checks, and
    regression scan; temporal or responsive changes request the states they need.
  - Evidence: final verification plan mapped to recommendations.
  - On fail: return to parent step 10 and add falsifiable verification.
  - Source: `SKILL.md` step 10; O-040.
  - Resolution: `[ ]`

## Coverage Closure and Acceptance

### Guaranteed scenario coverage

| Check | Scenario obligations |
|---|---|
| `VISION-CHECK-A01` | O-001, O-002, O-023 |
| `VISION-CHECK-A02` | O-003, O-004, O-028, O-033 |
| `VISION-CHECK-A03` | O-037, O-038 |
| `VISION-CHECK-A04` | O-013–O-016, O-029, O-031 |
| `VISION-CHECK-A05` | O-002, O-023 |
| `VISION-CHECK-B01` | O-007, O-009 |
| `VISION-CHECK-B02` | O-009, O-024, O-025 |
| `VISION-CHECK-B03` | O-009, O-012 |
| `VISION-CHECK-B04` | O-002, O-005–O-008, O-010, O-023, O-025 |
| `VISION-CHECK-B05` | O-011, O-030, O-032 |
| `VISION-CHECK-B06` | O-006, O-008 |
| `VISION-CHECK-C01` | O-024, O-029, O-031, O-037, O-038 |
| `VISION-CHECK-C02` | O-024–O-036 |
| `VISION-CHECK-C03` | O-021, O-022 |
| `VISION-CHECK-C04` | O-027, O-034, O-035 |
| `VISION-CHECK-C05` | O-017–O-020, O-024, O-027 |
| `VISION-CHECK-C06` | O-002, O-017–O-019, O-023 |
| `VISION-CHECK-D01` | O-006, O-008, O-014–O-015, O-019, O-022, O-025–O-026, O-032, O-034 |
| `VISION-CHECK-D02` | O-005, O-012, O-018, O-035, O-039 |
| `VISION-CHECK-D03` | O-027, O-035, O-039 |
| `VISION-CHECK-D04` | O-011, O-017, O-020, O-030, O-040 |
| `VISION-CHECK-D05` | O-003, O-010, O-016, O-021, O-036, O-041 |
| `VISION-CHECK-D06` | O-012, O-020, O-039, O-040 |
| `VISION-CHECK-E01` | O-001, O-037, O-039 |
| `VISION-CHECK-E02` | O-004, O-013, O-016, O-041 |
| `VISION-CHECK-E03` | O-002–O-003, O-008, O-015, O-022, O-028, O-033, O-036, O-041 |
| `VISION-CHECK-E04` | O-039 |
| `VISION-CHECK-E05` | O-040 |

Every O-001 through O-041 appears in at least one check above; every check points back to at least one parent
clause and scenario obligation. Verify this two-way closure on the filled copy rather than assuming it from the
table.

### Two-gate completion rule

1. **Coverage-closure gate:** every applicable gate and required item has one valid terminal resolution with
   its named evidence. `recorded-open` and valid waivers close coverage; unresolved boxes and invalid tokens do
   not. A conditional `n/a` closes coverage only when inspected evidence proves its predicate false.
2. **Acceptance gate:** every applicable gate and required item is `PASS`, except that a valid operational
   `waived/exception-authorized` may substitute for pass on that gate alone under the resolution rules above.
   `FAIL`, `recorded-open`, or an unresolved item means not accepted.

On failed acceptance, preserve the filled copy and report the failing IDs, evidence, consequence, owner, and
next action. Do not relabel an applicable item `n/a`, convert a mandatory obligation to advisory, or summarize
coverage closure as acceptance.
