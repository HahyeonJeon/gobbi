# UI Design — Evaluation Entry

Evaluator entrypoint for grading one complete UI design run. It extends the general Evaluation method with the
UI scenario and checklist sources. It does not replace the eight-step method, perspectives, causal finding
content, completed checks, or declared verdict derivation. When Gobbi calls it, the active workflow adapter
continues to own its stages, finding metadata, scoring, output paths, and report contract.

Load and read the complete UI bundle before building the evaluation frame. In Gobbi, this happens at Stage 0:

1. [`SKILL.md`](SKILL.md) — sole UI policy owner.
2. [`ideation.md`](ideation.md) — user-decision procedure and gate trace.
3. [`scenarios.md`](scenarios.md) — coverage frame and fail-able cases.
4. [`checklists.md`](checklists.md) — unchecked operational evidence source.
5. This `evaluation.md` entry — selection, UI perspective lenses, verification, and Overall anchors.

When used inside Gobbi, also load the active phase's own `scenario.md`, `checklist.md`, and `evaluation.md`
bundle. At Stage 1, reconcile
its seed frame with the applicable UI cases and copy selected `UI-CHECK-*` items into the active evaluator's
filled checklist under `## Stage 1 Additions`. Never edit or tick the shipped UI source. Record findings only
through the active Gobbi adapter's schema and destinations.

## Parent-clause crosswalk

| Parent clause | Scenario evidence | Checklist evidence |
|---|---|---|
| UI-R1 — one complete observable outcome | `UI-SCENARIO-01`–`03`, `07`, `08`, `16`–`18` | `UI-CHECK-01`, `06`, `07`, `17` |
| UI-R2 — shared skeleton plus separate surface proof | `UI-SCENARIO-02`, `14`, `15` | `UI-CHECK-02`, `12` |
| UI-R3 — direct representative-user prototype testing | `UI-SCENARIO-04`–`06`, `13`, `14`, `22`, `24`, `29` | `UI-CHECK-03`, `13` |
| UI-R4 — ethical evidence conditions / `NEEDS_CONTEXT` | `UI-SCENARIO-04`, `06`, `21` | `UI-CHECK-03`, `13` |
| UI-R5 — identity authority chain and bounded fallback | `UI-SCENARIO-19`, `20`, `28` | `UI-CHECK-04`, `09` |
| UI-R6 — exact construction and revision order | `UI-SCENARIO-03`, `07`–`12`, `17`, `30` | `UI-CHECK-05`–`07`, `11`, `14` |
| UI-R7 — explicit user gates | `UI-SCENARIO-10`–`12`, `30`, `32` | `UI-CHECK-05`–`07`, `11`, `14`, `18`, `19` |
| UI-R8 — adaptively complete evidence-led discussion | `UI-SCENARIO-19`, `27`, `28`, `30`, `32` | `UI-CHECK-04`, `08`, `16`, `18`, `19` |
| UI-R9 — material concepts or proved exception | `UI-SCENARIO-31` | `UI-CHECK-08` |
| UI-R10 — complete feature design document before prototype | `UI-SCENARIO-10`, `11`, `28`, `30` | `UI-CHECK-07`, `11`, `18` |
| UI-R11 — detailed aesthetics last and substantive | `UI-SCENARIO-18`–`20`, `23`, `24` | `UI-CHECK-09`, `10`, `17` |
| UI-R12 — accessible modality equivalence and protected floor | `UI-SCENARIO-16`, `18`–`24`, `26` | `UI-CHECK-10`, `17` |
| UI-R13 — post-approval disposable per-surface prototype | `UI-SCENARIO-10`, `11`, `13`–`15` | `UI-CHECK-11`, `12` |
| UI-R14 — specification-first revision and retest | `UI-SCENARIO-12`, `30` | `UI-CHECK-14`, `18` |
| UI-R15 — parent-preserving handoff and child boundary | `UI-SCENARIO-25`, `26` | `UI-CHECK-15`, `18` |
| UI-R16 — evidence-led UI/UX conflict resolution | `UI-SCENARIO-27` | `UI-CHECK-16`, `18` |
| P9 — bounded acceptance, protected floors, and coverage separation | `UI-SCENARIO-05`–`07`, `09`–`11`, `19`–`21`, `24`, `29` | `UI-CHECK-03`, `05`, `10`, `11`, `13` |

## Selecting scenarios and checks

Run this selection after Stage 0 target understanding and before each Stage 1 perspective frame is frozen.

1. **Confirm target and status.** Extract the one observable outcome, actor/context map, selected surfaces,
   current UI phase, feature design document, decision/evidence records, prototype status, and acceptance claim.
   If What, Why, or How is missing, use the active evaluation's Stage 0 gate.
2. **Activate the invariant core.** Always select `UI-SCENARIO-01`, `03`–`13`, `16`–`24`, and `28`–`32`, plus
   every `UI-CHECK-*` item except conditional `UI-CHECK-16`. These cases distinguish a substantive run from
   big-bang polish, missing evidence, premature prototyping, local-unit breakage, aesthetics-first work,
   cosmetic concepts/access, mockup-only fixes, and hidden trace gaps.
3. **Activate protected-waiver probes.** Copy the parent-P9 protected-waiver truth table below into the filled
   evaluation checklist. Attempt an authorized waiver separately on accessibility, safety, current direct
   representative-user prototype testing, and whole-specification-before-prototype document closure/chronology
   while every other applicable item is `PASS`. Each protected waiver must remain invalid and leave coverage
   open and the run not accepted. Also replay the coverage-without-acceptance control and the valid bounded
   non-protected `UI-CHECK-05` waiver control.
4. **Activate surface cases.** Select `UI-SCENARIO-02`, `14`, and `15` when multiple surfaces are included, an
   alternative surface is proposed, or a surface boundary is disputed. Keep `UI-CHECK-02` active even for a
   single-surface run so inspected scope proves other surfaces are out. Apply `UI-CHECK-12` to each included
   surface.
5. **Activate child and co-load cases.** Select `UI-SCENARIO-25`, `26`, and `UI-CHECK-15` when an existing or
   future child/surface handoff is in the target; otherwise inspect the parent-preserving generic handoff. Select
   `UI-SCENARIO-27` and `UI-CHECK-16` when UI and UX or another parent materially conflict.
6. **Disposition non-selected cases with evidence.** Use `n/a:<property>` only when inspected target evidence
   proves the trigger false. Never omit an inconvenient surface, child, actor, failure, access mode, or conflict.
7. **Copy exact checks.** Copy activated `UI-CHECK-*` records into the active filled checklist without changing
   ID, claim, pass condition, evidence, or on-fail route. Resolve them through the active checklist/evaluation
   state machine.
8. **Extend only the run copy.** A newly discovered UI scenario or check becomes a `scenario_gap` or
   `checklist_gap` finding plus a Stage 1 addition in the active run. Evaluators never edit the shipped UI
   bundle. A missing policy obligation is a parent-policy finding; do not repair it in a companion.

## Protected-waiver adversarial truth table

This is an evaluation replay of the six-row acceptance probe that [`checklists.md`](checklists.md)
operationalizes from parent [`SKILL.md`](SKILL.md) P9. Hold every other applicable gate and required item at
`PASS`; do not infer acceptance from coverage closure.

| Protected class or control | Attempted resolution | Coverage result | Acceptance result | Required scenario/check evidence |
|---|---|---|---|---|
| Accessibility in any applicable item | authorized waiver | invalid / not closed | not accepted | `UI-SCENARIO-20`, `24`; `UI-CHECK-10` |
| Safety in any applicable item | authorized waiver | invalid / not closed | not accepted | `UI-SCENARIO-19`, `20`; `UI-CHECK-10` |
| Current direct representative-user prototype testing (`UI-CHECK-13`) | authorized waiver | invalid / not closed | not accepted | `UI-SCENARIO-05`, `06`, `29`; `UI-CHECK-13` |
| Whole-specification-before-prototype document closure or chronology (`UI-CHECK-11`) | authorized waiver | invalid / not closed | not accepted | `UI-SCENARIO-10`, `11`; `UI-CHECK-11` |
| Coverage/acceptance control | one applicable protected or non-protected item is `FAIL` or `recorded-open` | closed | not accepted | `UI-SCENARIO-06`, `21`; applicable check |
| Bounded-waiver control | protected items `PASS`; one valid waiver on non-protected `UI-CHECK-05`, with authority covering its halt-and-return-to-P3 consequence and stop action | closed | accepted only under the bounded exception | `UI-SCENARIO-07`, `09`; `UI-CHECK-05` |

## Perspectives

Apply these UI lenses inside Gobbi's canonical order: Project → Structure → Performance → Aesthetics → Usage →
Consistency → Risk, then Overall. Each perspective independently inspects the target, selected cases, checks,
prototype, direct-user evidence, and current repository evidence. A perspective records no UI finding only
after its lens and all applicable dispositions are evidenced.

### Project

**Lens:** Does the run realize one right, observable interface outcome for the intended users without
substituting a screen, command, component, prototype, or related product area for the outcome?

**Activate:** `UI-SCENARIO-01`–`06`, `10`, `11`, `13`–`15`, `28`, `29`, `31`, `32`; `UI-CHECK-01`–`04`, `08`, `11`–`13`, `19`.

**Verify:** compare the user-locked outcome, surface contract, scope, non-goals, evidence conditions, feature
document, prototype questions, and acceptance claim. Check that login recovery remains in while registration,
password reset, account administration, and onboarding stay out. Confirm multi-surface scope rests on one
outcome and skeleton rather than a shared product label. Replay the four protected-waiver attempts plus both
controls with every other applicable item at `PASS`; only the one valid non-protected bounded-waiver control may
accept by exception.

**Anti-patterns:** a page or command called the outcome; breadth called completeness; a project owner called
representative by title; prior evidence called the current direct test; cosmetic options called concepts.

### Structure

**Lens:** Do foundation, skeleton, bottom-up units, complete interactions/states, concepts, aesthetics, whole
approval, prototype, revision, and handoff form one dependency-correct and traceable interface contract?

**Activate:** `UI-SCENARIO-02`, `07`–`12`, `14`–`18`, `25`, `26`, `30`; `UI-CHECK-02`, `05`–`07`, `11`, `12`,
`14`, `15`, `17`, `18`.

**Verify:** reconstruct artifact chronology and both trace directions. Inject one local-unit mismatch, exact
state transition, failure/recovery break, and cross-surface mismatch. Prove no prototype artifact predates the
complete aesthetics-inclusive G5 approval. Trace one test finding through specification first, prototype
second, and direct retest third.

**Anti-patterns:** component works alone but breaks the skeleton; headings stand in for a specification;
milestone prototypes; mockup repaired while the handoff stays stale; a child supplies policy the parent lacks.

### Performance

**Lens:** Are surface count, specification depth, prototype fidelity, direct-test method/sample, and evidence
claims proportionate to the question, diversity, uncertainty, impact, and risk?

**Activate:** `UI-SCENARIO-04`–`06`, `13`–`15`, `21`, `22`, `29`; `UI-CHECK-02`, `03`, `08`, `12`, `13`.

**Verify:** compare each included surface and prototype element with a named uncertainty and claim. Look for
production-like fidelity that does not reduce uncertainty, fixed participant counts, underpowered evidence,
and multi-surface bundling that avoids separate prototypes or tests. Confirm a smaller artifact would not
answer equally well and a broader claim is not made than the evidence supports.

**Anti-patterns:** “five users” as universal proof; high fidelity by default; every platform in one run; one
surface test generalized to another; collecting more data without a decision it can change.

### Aesthetics

**Lens:** Does final expression fit project identity and strengthen hierarchy, state recognition, affordance,
trust, and clarity only after the complete behavioral/access contract exists?

**Activate:** `UI-SCENARIO-03`, `18`–`20`, `23`, `24`, `28`, `31`; `UI-CHECK-04`, `08`–`10`, `17`–`19`.

**Verify:** inspect identity authority and fallback, detailed-aesthetics chronology, typography or character
rendering, color where present, density, spacing, rhythm, shape, imagery/iconography/symbols, motion/transitions,
tone, and expressive detail on each surface. Remove visual resemblance and confirm hierarchy, meaning, action,
status, access, recovery, and identity still hold. Check that aesthetics exposed a defect by reopening its
owner rather than hiding it.

**Anti-patterns:** identity as unsupported adjectives; color/type variants called concepts; token compliance as
behavior proof; aesthetics begun before access/recovery; “minimal” used to remove status or labels.

### Usage

**Lens:** Can representative people in their real contexts perceive, understand, operate, complete, recover,
adapt, and recognize truthful state through every claimed surface and applicable modality?

**Activate:** `UI-SCENARIO-01`, `02`, `04`–`09`, `14`, `16`–`24`; `UI-CHECK-01`–`03`, `06`, `07`, `10`, `12`,
`13`, `17`.

**Verify:** inspect direct observations rather than summary claims. Perform the normal, alternative, exact
transition, error, timeout, recovery, access, locale, terminal, and completion tasks. Compare visible/spoken/
announced/output state with system state. Confirm participants had representative context, consent, and needed
accommodations and that each included surface has direct evidence.

**Anti-patterns:** coached participants; project owner assumed representative; screenshot-only access review;
color-only or visually present status; GUI assumptions copied into CLI; false success output.

### Consistency

**Lens:** Do identity, governing systems, skeleton, units, surfaces, states, content, feedback, aesthetics,
decisions, whole specification, prototype, findings, UI/UX clauses, child specializations, and handoff agree?

**Activate:** `UI-SCENARIO-02`, `07`–`12`, `14`, `15`, `19`, `23`, `25`–`32`; `UI-CHECK-02`, `04`–`09`,
`11`, `12`, `14`–`19`.

**Verify:** compare all approved/revised versions. Check shared skeleton against each surface and the prototype
against the exact current specification. Inspect identity conflict propagation, concept/aesthetic coherence,
UI/UX conflict decisions, child diffs, and reopen conditions. Confirm load order never decides a clause and a
revision never updates only one artifact.

**Anti-patterns:** web and CLI claim different completion; prototype and specification disagree; identity
decision appears on one surface only; last-loaded parent wins; child convention silently deletes an obligation.

### Risk

**Lens:** Does the run fail closed on missing outcome evidence, representative users, consent, accommodations,
accessibility, safety, trust, truthful status, recovery, artifact chronology, conflicts, and unsupported
acceptance claims?

**Activate:** `UI-SCENARIO-03`, `05`, `06`, `09`, `11`, `12`, `15`, `17`–`21`, `24`, `26`, `27`, `29`–`32`;
`UI-CHECK-01`–`03`, `05`–`19`.

**Verify:** run every required adversarial probe. Inject timeout, partial/late result, false completion,
inaccessible operation, misleading output, identity pressure, child waiver, co-load conflict, prior-evidence
replacement, premature prototype, cosmetic concept, and mockup-only revision. Inspect final status when any
direct-evidence condition is missing. Replay the complete protected-waiver truth table: four protected waiver
tokens stay invalid and close neither result; protected or non-protected `FAIL`/`recorded-open` closes coverage
without acceptance; and one valid non-protected `UI-CHECK-05` waiver accepts only under the bounded exception
with every protected item `PASS`.

**Anti-patterns:** evidence theater; consent assumed; `NEEDS_CONTEXT` relabeled accepted; familiar component or
standard treated as proof; brand/platform authority waives access; polished big-bang artifact passes.

## Recommended verification

Use the strongest evidence the artifact admits. Run safe tools for file, chronology, ID, trace, and wiring
claims. Use close reading, cross-reference, direct task observation, and evidence-record inspection for design
claims.

1. Parse `SKILL.md` frontmatter and confirm exact key order: `name`, `description`, `allowed-tools`,
   `skill-type`; confirm `name: ui`, the declared tool list, and `skill-type: operation`.
2. Confirm exactly `SKILL.md`, `ideation.md`, `scenarios.md`, `checklists.md`, and `evaluation.md` form the
   canonical bundle, with no singular `scenario.md` substitute.
3. Extract `UI-R*`, `UI-SCENARIO-*`, and `UI-CHECK-*` IDs. Prove every load-bearing parent rule has scenarios
   and checks; every scenario points to a live parent clause and check; every check points to live scenarios and
   parent clauses; and this entry selects every applicable check.
4. Confirm the scenario coverage register dispositions all ten categories. Verify the positive floor,
   triggered minima, one adversarial face per family, observable failure oracle, evidence tuple, and cosmetic-
   compliance failure.
5. Confirm the checklist source has exactly 19 unchecked items and no checked source box. In the active filled
   copy, require named inspected evidence and record coverage closure separately from acceptance. Replay all
   four protected-waiver attempts, the `FAIL`/`recorded-open` coverage control, and the valid non-protected
   `UI-CHECK-05` bounded-waiver accepting control with every other applicable item at `PASS`.
6. Inspect feature-document content against all ten schema sections. Headings, placeholders, a design-system
   component name, or a present prototype do not satisfy missing content.
7. Reconstruct dated/versioned chronology: foundation/G1 → skeleton/G2 → core/G3 → accumulated complete
   interactions/access/G4 → concepts and detailed aesthetics → whole-spec G5 → first prototype. Fail on any
   prototype-like artifact before G5.
8. Inspect direct-test provenance. Confirm representative context, consent, accommodations, data handling,
   questions, method/sample logic, direct behavior, per-surface tasks, observations, interpretations, claim
   limits, and G6 decision. Fail acceptance on missing conditions even when prior UX/UI evidence or stakeholder
   approval exists.
9. Trace one supported finding through specification revision first, prototype revision second, and affected
   assumption/surface/regression retest third.
10. Run missing-identity fallback and identity/accessibility conflict probes. Confirm the fallback stays in the
    feature document and the access/safety floor is not waived.
11. Run the login GUI/CLI boundary, invalid multi-surface merge, local-unit/skeleton, timeout, visually
    compliant but behaviorally inaccessible/misleading, cosmetic-concept, child-waiver, and co-load-conflict
    probes.
12. Run the project markdown-link and residual-vocabulary guards against the canonical directory. Inspect live
    runtime wiring through its owning sync mechanism; evaluators remain read-only and never repair mirrors.

Tool evidence is required for chronology, file, path, ID, link, trace, and wiring findings at confidence 75 or
100. Human-outcome claims require the actual bounded direct-use record; prose saying “tested with users” is not
proof. Apply the active evaluation's side-effect preflight before any prototype interaction or external call.

## Overall anchors

The Overall pass must answer:

- Is this exactly one complete observable interface outcome, including required actors, states, feedback,
  failure, recovery, handoffs, support, adaptation, and completion, while adjacent outcomes stay out?
- Does every included surface share the outcome and one surface-neutral skeleton while retaining separately
  specifiable and testable mechanics, accessibility/modality equivalence, prototype, and evidence?
- Did project identity follow the authority chain, and did conflicts preserve the accessibility/safety floor?
- Was the top-down skeleton approved before bottom-up growth, with every local unit reconciled to the whole?
- Were two material concepts compared or was the one-concept exception genuinely proved with constraints and
  direct evidence?
- Did detailed aesthetics occur only after structure, behavior, content, feedback, recovery, adaptation, and
  accessibility were complete, and do they improve rather than hide the contract?
- Was the entire ten-section specification, including final aesthetics, complete and explicitly approved at G5
  before every prototype-like artifact?
- Did representative users directly use every claimed surface's prototype under valid consent, accommodation,
  and evidence conditions, with claims bounded to the test?
- Did each supported finding revise the specification first, prototype second, and affected evidence third?
- Do the four protected classes reject waiver tokens without closing coverage, while exactly one valid
  non-protected operational-gate waiver can accept only as the recorded bounded exception?
- Does the handoff preserve parent invariants across UI/UX co-loading and future surface children without
  precedence, load-order override, or platform-convention waiver?
- Would a polished big-bang design, present-but-empty document, familiar component, or visually compliant but
  behaviorally broken interface fail the selected cases and checks?

The preserve list should name the outcome/surface boundary, identity and reference chain, approved skeleton,
coherent bottom-up state model, non-waivable access/safety floor, whole-spec-before-prototype chronology,
representative direct-use evidence, and specification-first revision traces that later work must not weaken.
