# UX Design — Evaluation Entry

Evaluator entrypoint for grading one UX design run. It extends the general Evaluation method with the UX
scenario and checklist sources. It does not replace the three-phase method, perspectives, causal problem
content, optional-improvement boundary, completed checks and tests, or declared verdict derivation. When Gobbi
calls it, the active workflow adapter continues to own finding metadata, scoring, output tree, and report
contract.

Load and read the complete UX bundle during Phase 1, before assembling the prepared baseline:

1. [`SKILL.md`](SKILL.md) — sole policy owner.
2. [`ideation.md`](ideation.md) — user-decision procedure and gate trace.
3. [`scenarios.md`](scenarios.md) — coverage frame and fail-able cases.
4. [`checklists.md`](checklists.md) — unchecked operational evidence source.
5. This `evaluation.md` entry — selection, perspective lenses, verification, and Overall anchors.

When used inside Gobbi, also load the active phase's own `scenario.md`, `checklist.md`, and `evaluation.md`
bundle. UX additions are
copied into the active evaluator's filled checklist under `## Prepared Baseline Additions`; the shipped UX
source remains unchecked. Problems and supported improvements use only the active Gobbi adapter's metadata and
destinations.

## Parent-clause crosswalk

| Parent clause | Scenario evidence | Checklist evidence |
|---|---|---|
| UX-R1 — one complete observable outcome | `UX-SCENARIO-01`–`04`, `19`–`21` | `UX-CHECK-01`, `02`, `07`, `09` |
| UX-R2 — new direct generative research | `UX-SCENARIO-05`, `06`, `08` | `UX-CHECK-03`, `20` |
| UX-R3 — direct representative-user prototype evaluation | `UX-SCENARIO-07`, `22`, `23` | `UX-CHECK-04`, `14` |
| UX-R4 — ethical evidence conditions / `NEEDS_CONTEXT` | `UX-SCENARIO-05`, `07`, `23` | `UX-CHECK-04` |
| UX-R5 — identity authority chain and bounded brief | `UX-SCENARIO-09`, `10` | `UX-CHECK-05` |
| UX-R6 — exact construction order | `UX-SCENARIO-11`–`14`, `18` | `UX-CHECK-06`–`09`, `11`, `12` |
| UX-R7 — explicit user gates | `UX-SCENARIO-11`, `12`, `18`, `24` | `UX-CHECK-06`, `08`, `11`, `15` |
| UX-R8 — material concepts or evidenced exception | `UX-SCENARIO-15`–`17` | `UX-CHECK-10` |
| UX-R9 — whole feature design document before prototype | `UX-SCENARIO-13`, `18` | `UX-CHECK-11`, `12` |
| UX-R10 — inclusion, trust, safety, harm, agency | `UX-SCENARIO-10`, `19`, `20`, `23`, `27` | `UX-CHECK-05`, `09`, `13`, `18` |
| UX-R11 — disposable proportionate prototype | `UX-SCENARIO-13`, `22`, `23` | `UX-CHECK-12`, `13` |
| UX-R12 — specification-first revision and retest | `UX-SCENARIO-24` | `UX-CHECK-15` |
| UX-R13 — measures resist gaming | `UX-SCENARIO-25`, `26` | `UX-CHECK-16` |
| UX-R14 — no-silent-change handoff and specialization | `UX-SCENARIO-02`, `21`, `27`, `28` | `UX-CHECK-17`, `18` |

## Selecting scenarios and checks

Run this selection after Phase 1 target understanding and before the active evaluation freezes the Phase 2
prepared baseline.

1. **Confirm target and status.** Extract the one outcome, current UX phase, feature design document, evidence
   set, prototype status, and acceptance claim. If the target has no clear What, Why, or How, use the active
   evaluation's Phase 1 gate.
2. **Activate the invariant core.** Always select `UX-SCENARIO-01`, `03`, `05`–`18`, and `22`–`26`, plus every
   `UX-CHECK-*` item except conditional `UX-CHECK-18`. These cases distinguish a substantive completed run from
   big-bang polish, evidence theater, premature prototype work, cosmetic concepts, inaccessible evidence,
   mockup-only revision, and metric gaming.
3. **Activate protected-waiver probes.** Copy the protected-waiver truth table below into the filled evaluation
   checklist. Attempt an authorized waiver separately on direct generative research, whole-specification-before-
   prototype closure/chronology, direct representative-user prototype evaluation, accessibility, and safety
   while every other applicable item is `PASS`. Each protected waiver must remain an invalid resolution and the
   run must remain not accepted.
4. **Activate actor and surface variants.** Select `UX-SCENARIO-02` for a command-line or other alternative
   realization. Select `UX-SCENARIO-04` whenever a recovery/dependency boundary can be mistaken for an adjacent
   outcome. Select `UX-SCENARIO-19`–`21` when the outcome crosses a channel, actor, organization, or system.
5. **Activate conflict and change cases.** Select `UX-SCENARIO-27` and `UX-CHECK-18` when UX and UI guidance or
   another loaded parent conflict. Select `UX-SCENARIO-28` for a downstream surface/child handoff or change.
6. **Disposition non-selected cases with evidence.** Use `n/a:<property>` only when inspected target evidence
   proves the trigger false. Do not omit an inconvenient path or relabel an applicable gate.
7. **Copy exact checks.** Copy activated `UX-CHECK-*` records into the active phase's filled checklist without
   changing their ID, claim, pass condition, evidence, or on-fail route. Resolve them through the active
   checklist/evaluation state machine.
8. **Extend only the run copy.** A newly discovered UX scenario or check becomes a `scenario_gap` or
   `checklist_gap` finding and an active-run perspective-derived addition. Evaluators never edit the shipped UX
   bundle.

## Protected-waiver adversarial truth table

This is an evaluation copy of the acceptance probe owned by [`checklists.md`](checklists.md). Hold every other
applicable gate and required item at `PASS`; do not infer acceptance from coverage closure.

| Protected class | Attempted resolution | Coverage result | Acceptance result | Required scenario evidence |
|---|---|---|---|---|
| Direct generative research (`UX-CHECK-03`) | authorized waiver | invalid / not closed | not accepted | `UX-SCENARIO-06`, `08` |
| Whole-specification-before-prototype (`UX-CHECK-11` or `UX-CHECK-12`) | authorized waiver | invalid / not closed | not accepted | `UX-SCENARIO-13`, `18` |
| Direct representative-user prototype evaluation (`UX-CHECK-14`) | authorized waiver | invalid / not closed | not accepted | `UX-SCENARIO-22` |
| Accessibility in any applicable item | authorized waiver | invalid / not closed | not accepted | `UX-SCENARIO-10`, `23` |
| Safety in any applicable item | authorized waiver | invalid / not closed | not accepted | `UX-SCENARIO-10`, `23` |
| Coverage/acceptance control | protected item is `FAIL` or `recorded-open` | closed | not accepted | `UX-SCENARIO-07` |
| Bounded-waiver control | protected items `PASS`; one valid non-protected gate waiver | closed | accepted only under the bounded exception | named non-protected scenario/check |

## Perspectives

Apply these UX lenses inside Gobbi's canonical order: Project → Structure → Performance → Aesthetics → Usage →
Consistency → Risk, then Overall. Each perspective walks its activated cases and checks with independent
evidence. A perspective may record no UX finding only after it has run its lens and stated applicable
dispositions.

### Project

**Lens:** Does the run solve one right, observable outcome for the intended people without substituting an
artifact for the outcome or absorbing adjacent work?

**Activate:** `UX-SCENARIO-01`–`06`, `12`, `15`–`18`, `25`; `UX-CHECK-01`–`03`, `10`, `11`, `16`, `20`.

**Verify:** compare the user-locked outcome/scope with the skeleton, complete document, prototype questions,
measures, and actual acceptance claim. Check that necessary supporting actors and recovery remain in while
registration, reset, administration, or other independent outcomes remain out. Replay the five protected-waiver
rows with every other applicable check at `PASS`; none may yield acceptance.

**Anti-patterns:** a screen or command called a feature outcome; stakeholder preference called user evidence;
scope expansion hidden as “whole experience”; a proxy measure replacing user completion.

### Structure

**Lens:** Do the foundation, skeleton, bottom-up units, paths, states, concepts, specification, prototype, and
handoff form one ordered and traceable contract?

**Activate:** `UX-SCENARIO-09`, `11`, `13`, `14`, `18`–`21`, `24`, `28`; `UX-CHECK-05`–`09`, `11`–`13`, `15`,
`17`.

**Verify:** reconstruct the artifact chronology; walk both trace directions from parent rules and evidence to
document clauses and from each clause back to evidence/decision; inject one local-unit and one cross-channel
failure; inspect specification-first revision order.

**Anti-patterns:** local unit works but breaks the skeleton; headings without content; prototype used to fill
spec gaps; per-channel documents with no handoff contract; mockup repaired while the specification stays stale.

### Performance

**Lens:** Is research, concept exploration, prototype fidelity, evidence scope, and continued measurement
proportionate to the question, uncertainty, diversity, impact, and risk without a fixed-count shortcut?

**Activate:** `UX-SCENARIO-05`–`08`, `17`, `22`, `25`, `26`; `UX-CHECK-03`, `04`, `10`, `13`, `16`.

**Verify:** compare each research/prototype choice with its question and claim; look for excess fidelity that
does not reduce uncertainty, underpowered evidence that makes broad claims, and metrics whose cost or incentive
distorts the outcome.

**Anti-patterns:** universal participant count; production-like prototype by default; every available data
point collected; measurement optimized for the headline number rather than learning and guardrails.

### Aesthetics

**Lens:** Is the experience specification clear, literal, identity-aware, and readable enough for users,
stakeholders, researchers, surface designers, and implementers to understand without hidden context?

**Activate:** `UX-SCENARIO-09`, `10`, `12`, `16`, `18`, `25`; `UX-CHECK-05`, `06`, `10`, `11`, `16`, `17`.

**Verify:** inspect names, actor language, content intent, identity references, concept distinctions, state labels,
decision/evidence separation, and feature-document schema content. Confirm polish is treated as expression, not
proof.

**Anti-patterns:** ornamental concepts; identity described only with adjectives; vague “user-friendly” claims;
ambiguous state names; a beautiful artifact with missing evidence, recovery, or decision trace.

### Usage

**Lens:** Can representative people in their real contexts understand, complete, recover, switch channels, and
exercise agency through the outcome, and can the next team use the handoff correctly?

**Activate:** `UX-SCENARIO-01`, `02`, `04`–`08`, `10`, `14`, `19`–`24`; `UX-CHECK-01`–`04`, `07`–`09`, `13`–`15`,
`17`, `20`.

**Verify:** inspect direct observations rather than summary claims; test the happy, alternative, error,
recovery, accessibility, support, and cross-channel paths; verify participant access/accommodations; give the
handoff to a cold reader and observe whether hidden context is required.

**Anti-patterns:** project owner assumed representative; inaccessible prototype; participant coached toward the
solution; recovery deferred to support with no handoff; evaluator tests only the normal path.

### Consistency

**Lens:** Do identity, research findings, user decisions, skeleton, units, paths, states, concepts,
specification, prototype, measures, co-loaded guidance, and handoff agree without silent override?

**Activate:** `UX-SCENARIO-02`, `09`–`11`, `14`, `18`–`21`, `24`, `27`, `28`; `UX-CHECK-05`–`09`, `11`, `13`,
`15`, `17`, `18`.

**Verify:** compare all approved versions and traces; inspect cross-channel state and completion; compare
prototype with the exact approved/revised specification; inspect UX/UI conflicts and child deviations; ensure
identity conflicts carry one user decision everywhere affected.

**Anti-patterns:** prototype and document disagree; one channel claims a different completion state; load order
resolves parent conflict; child mechanics silently delete a parent obligation; a revision updates only one
artifact.

### Risk

**Lens:** Does the run fail closed on missing evidence, consent, access, safety, privacy, trust, harm, recovery,
metric integrity, conflicts, and unsupported acceptance claims?

**Activate:** `UX-SCENARIO-03`, `06`–`10`, `12`–`14`, `16`, `17`, `20`, `21`, `23`, `24`, `26`–`28`;
`UX-CHECK-01`, `03`–`06`, `09`–`18`, `20`.

**Verify:** attempt each required adversarial behavior probe; inspect consent/data limits; inject timeout and
partial-state failure; test the accessibility/safety floor against identity pressure; invert the success metric;
check final status when user evidence is missing. Separately attempt an authorized waiver on each of the five
protected classes; verify the token is invalid, coverage remains unclosed until a permitted terminal replaces
it, and acceptance remains unavailable even though every other applicable item is `PASS`.

**Anti-patterns:** research theater; consent assumed; safety waiver; prior evidence replacing current direct
contact; early prototype normalized after the fact; cosmetic compliance passing; acceptance declared with
`NEEDS_CONTEXT` conditions unresolved.

## Recommended verification

Use the strongest evidence the artifact admits. Run safe tools for file/path/history claims; use close reading,
cross-reference, and direct evidence inspection for design claims.

1. Parse `SKILL.md` frontmatter and confirm exact key order, `name: ux`, the allowed-tool list, and
   `skill-type: operation`.
2. Confirm exactly `SKILL.md`, `ideation.md`, `scenarios.md`, `checklists.md`, and `evaluation.md` form this
   canonical bundle, with no singular `scenario.md` substitute.
3. Extract `UX-R*`, `UX-SCENARIO-*`, and `UX-CHECK-*` IDs. Prove every load-bearing parent rule has scenarios
   and checks, every scenario points to a live parent rule and check, every check points to live scenarios and
   parent clauses, and every applicable check is selected here.
4. Verify the scenario set declares purpose/target/consumer, lifecycle, scope/non-goals, scale, all ten category
   dispositions, a complete family×case-type matrix with a property reason in every empty cell, source and
   stable-ID registers, gaps/decisions, and a bidirectional orphan sweep. Confirm every family has all required
   fields and every case has a justified primary type, declared coverage-role set, actor, Given/When/Then,
   failure oracle, evidence tuple, obligation, source trace, and checklist trace.
5. Confirm both checklist sources have only unchecked boxes. In each active filled copy, record source
   identity/path, immutable source version/revision, and run identity as separate provenance values; require
   named inspected evidence and separate coverage closure from acceptance.
6. Replay the protected-waiver truth table with all other applicable items `PASS`. Assert mechanically in the
   filled result that each of the five protected waiver attempts is invalid and not accepted; also prove a
   protected `FAIL`/`recorded-open` may close coverage without acceptance.
7. Inspect dated/versioned history to prove foundation → skeleton → core → accumulated specification → whole
   approval → prototype. Fail if any prototype predates the whole-spec gate.
8. Inspect evidence provenance to prove new generative contact and new direct prototype evaluation with
   representative users, ethical conditions, accommodations, and bounded claims. Fail acceptance on absent
   conditions even if the stakeholder approved.
9. Trace one prototype finding through specification revision first, prototype revision second, and affected
   direct retest third.
10. Run the identity fallback and conflict probes, login/web + command-line boundary probe, adjacent-outcome
   probe, cross-channel failure probe, material-concept probe, inaccessible-prototype probe, metric-gaming probe,
   co-load conflict probe, and future-child deviation probe.
11. Run the project markdown-link and retired-vocabulary guards against the canonical directory. Inspect live
    runtime wiring through its owning sync mechanism; do not edit mirrors during evaluation.

Tool evidence is required for chronology, file, path, ID, link, and wiring claims at confidence 75 or 100.
Direct-research claims require the actual bounded evidence record; a document saying “users were consulted” is
not proof. Apply side-effect preflight before any prototype interaction or external call.

## Overall anchors

The Overall pass must answer:

- Is this exactly one complete observable outcome, including supporting actors, failure, recovery, and required
  channels, while adjacent outcomes stay out?
- Did new direct generative research influence design before convergence, and did direct representative-user
  prototype evaluation support acceptance under ethical conditions?
- Did identity come from the evidence chain, and were identity/accessibility/safety conflicts resolved visibly
  without waiving the floor?
- Did every attempted waiver on direct generative research, whole-specification-before-prototype chronology,
  direct representative-user prototype evaluation, accessibility, or safety remain invalid and unable to yield
  acceptance, with coverage closure reported separately?
- Was the top-down skeleton established before bottom-up growth, with every local unit reconciled to the whole?
- Were two material concepts compared or was the single-concept exception genuinely proved?
- Was the whole specification complete and explicitly approved before every prototype artifact?
- Did findings revise the specification first, the prototype second, and affected assumptions/regressions third?
- Can measures expose failure, exclusion, harm, and proxy gaming rather than reward them?
- Does the handoff preserve the outcome contract across UX/UI co-loading and future surface specialization with
  no silent change?
- Would a polished big-bang document that lacks these behaviors fail the selected scenarios and checks?

The preserve list should name the evidence chain, explicit gates, complete outcome boundary, coherent skeleton,
strong recovery/access obligations, and specification-first revision traces that a later change must not weaken.
