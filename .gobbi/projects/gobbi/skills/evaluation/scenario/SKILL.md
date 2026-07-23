---
name: scenario
description: "Use when designing or writing a scenario set — for design obligations or for evaluation coverage — the category-and-case taxonomy, the coverage frame, the failability teeth, and the design-to-obligation procedure."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Scenario

Skill for designing and writing a scenario set — the coverage-framed collection of concrete situations
a target must handle, each with an observable outcome and a trace to the obligation it proves. Load it
to design a new scenario set, or to rewrite one, for either design obligations or evaluation coverage.

A scenario set names its coverage axes up front, derives families and concrete cases from them, turns
each case into a design obligation, and states what it does not cover. It stops at design obligations;
constructing or reading verification checks is out of scope.

---

## Principles

> **Category, family, and case are three different layers.**

A coverage axis, a situation on that axis, and one concrete variant of that situation are not the same
thing. Collapsing them — calling both the concern-axis and the good/bad face a "category" — hides which
coverage is present and which is missing. Keeping the three separate is what lets a set declare its
coverage instead of accreting cases by feel.

> **The coverage frame precedes the prose.**

A set grown case-by-case covers whatever the author happened to think of and silently omits the rest.
Naming the coverage axes and the applicable case types first turns omission into a visible,
dispositioned decision rather than an accident. The frame is the contract the cases fill.

> **A scenario earns its place only if it can fail the target.**

A scenario with no observable outcome that a wrong target would violate proves nothing — it decorates
coverage without testing it. Every case must name the concrete result a broken target would produce
differently, so that passing the set is evidence, not theater.

> **The primary label is a declared judgment; coverage is not.**

Which single category or type best defines a family is a judgment the author declares and justifies —
no mechanical rule is correct for every family. What a set covers, though, is not a judgment: every
axis is dispositioned and every triggered situation is exercised. Letting a convenient primary label
stand in for real coverage confuses the two.

> **Traceability closes both ends of the set.**

Sources keep coverage from being invented; obligations make each scenario actionable. A trace that runs
both ways — source→scenario and scenario→obligation — exposes both the source clause no case covers and
the scenario that leads to no design consequence. A set traced in only one direction hides one of them.

---

## Rules

### Must-Follow

- **SR-1 — MUST disposition all ten categories up front.** The coverage register gives every one of the
  ten coverage categories exactly one disposition: `selected`, `covered-elsewhere` (a pointer PLUS the
  SR-7 ledger), or `n/a: <property>` (naming the property). A category matched only as a non-primary
  (secondary) is `selected` — its families are the tag-carriers — never a false `n/a`. An
  undispositioned axis is a silent coverage gap.
- **SR-2 — MUST cover the positive floor and every triggered minimum.** Every `selected` category has ≥1
  case whose coverage-role exercises the positive discrimination, plus, for each triggered minimum, ≥1
  case whose coverage-role includes that type. Default: one case discharges at most one minimum. The
  n-ary inseparability record (see § Procedure) is the only multi-discharge. For a category whose point is
  the bad path (Failure/recovery, Trust/harm), the positive discrimination is its defining handled/safe
  behavior succeeding — containment, recovery, or rejection works — not a happy path.
- **SR-3 — MUST give every family an adversarial face.** Every family carries an adversarial case OR an
  explicit `n/a: <property>`. "We have some adversarial somewhere" ships substance-hollow families.
- **SR-4 — MUST declare one justified primary per family and per case.** Every family declares ONE
  primary category and every case ONE primary type, each a legal member of its matched set, each with a
  one-line justification; the global order is the default, not a rule. Other matched categories and types
  become secondary tags. The primary is for stable IDs, grouping, and perspective routing only — it never
  discharges coverage.
- **SR-5 — MUST make every case observable.** Every case names a failure oracle, a Given/When/Then (or
  equivalent), and its declared coverage-role set. Without an oracle and an observable trigger a case
  cannot fail the target.
- **SR-6 — MUST trace every scenario to an obligation.** Every scenario traces to ≥1 design obligation;
  source→scenario and scenario→obligation links are orphan-swept both ways. The ONE exemption is an
  **exploratory scenario** — a design-mode-only scenario explicitly marked `exploratory: <reason>` that is
  not yet an approved constraint; the exemption holds only while it is so marked and TERMINATES when the
  scenario becomes an approved constraint, at which point it MUST trace to an obligation. Scenario→check
  links are optional; this skill never reads or constructs checks.
- **SR-7 — MUST back a `covered-elsewhere` category with a full ledger.** It records a
  condition→target-clause ledger — its applicable families, risk-triggered case types, failure oracles,
  and applicable actors, each with the exact covering clause. A resolving pointer alone fails.
- **SR-8 — MUST split an oversized set under a parent index.** A set exceeding the recorded family or
  cell thresholds is split into bounded target-specific sets under a parent index; the author records the
  threshold values in this rule. Defaults: ~12 families / ~40 cells, where a cell is one distinct
  `(selected-category, triggered-case-type)` pair counted once. Only the author tunes them.
- **SR-9 — MUST reference sensitive evidence, never inline it.** Sensitive evidence is referenced by
  pointer or redaction, never verbatim, and names the governing retention policy. A scenario set must not
  itself become a data-retention hazard.
- **SR-10 — MUST give every case an observable discrimination.** Every case states the concrete result a
  correct target produces and a broken one does not. A case with no observable difference cannot fail
  anything.
- **SR-11 — MUST give every case an evidence tuple.** Every case carries how the outcome is observed, by
  what method, and what confirms it. An unfalsifiable claim is not a scenario.
- **SR-12 — MUST make cosmetic compliance fail.** Every case must still fail a cosmetically-conformant
  artifact that does not actually satisfy the outcome. This includes the n-ary inseparability
  gaming-probe gate: an inseparability record is accepted only after a dedicated single-type case is
  shown non-constructible for EACH enumerated type. A gate you can pass by relabeling is not a gate.
- **SR-13 — MUST state every boundary exactly.** Every boundary case sits at the EXACT limit or
  transition (below/at/above, empty/one/many, first/last, timeout, interleave), not merely near it. The
  off-by-one lives at the edge.
- **SR-14 — MUST close a source→set omission sweep.** A sweep confirms every load-bearing source
  obligation maps to ≥1 case; an uncovered obligation is given a case or recorded as a stated gap. The
  omission you never listed is the one that ships.

### Must-Not-Follow

- **NEVER declare a primary outside the matched set** — the match predicates bound the legal primaries.
  Fix: declare only a matched member, or correct the match analysis.
- **NEVER write a bare `n/a`** — an unexplained skip hides a gap. Fix: write `n/a: <property>` naming the
  specific property that makes the axis inapplicable.
- **NEVER read or construct verification checks in a scenario set** — it couples the two skills and
  creates a cycle. Fix: stop at design obligations; checks are checklist-owned.
- **NEVER let the happy path stand for all valid classes** — one positive case does not cover materially
  different valid inputs, actors, or modes. Fix: add an alternative-valid case per distinct valid class.
- **NEVER discharge a minimum with a coverage-role the case does not genuinely exercise** — a tag the
  case has not earned is a false coverage claim. Fix: give the minimum a case that actually exercises
  that discrimination.
- **NEVER satisfy a minimum by cloning a case under relabeled roles** — a cosmetic duplicate inflates
  coverage without adding discrimination. Fix: write one genuinely-discriminating case, or record a
  bounded n-ary inseparability set (SR-12).

---

## Procedure

Design a scenario set in nine steps, grouped **FRAME** (P1–P4) → **DERIVE** (P5–P7) → **HARDEN**
(P8–P9). Each step is a bare action that points at the invariant it must satisfy (`apply SR-x`); the
invariant text lives once in § Rules and is never restated here. The catalogs below are reference DATA
the steps consult — the category and case-type predicates, the primary-declaration mechanism, the
perspective map, and the field lists. This document keeps its current shape as a legacy untyped skill;
`skill-writing` now assigns section contracts by semantic type when a skill is created or substantively
revised.

### Reference data — coverage categories (10)

Each category has an objective match predicate: the concrete property that makes a family "match" it.

| # | Category | Match predicate: the family turns on … |
|---|---|---|
| 1 | Purpose / outcomes / scope | whether the RIGHT outcome / problem / in-out-of-scope boundary is served |
| 2 | Actors / stakeholders / use-context | WHO acts / receives / approves / is affected, or their goal / environment / constraint |
| 3 | Behavior / state / data | a pre/post STATE, input class, transition, invariant, or data-lifecycle step (no version-change event, no harm surface) |
| 4 | Interfaces / dependencies / structure | a component / producer / consumer / external-service CONTRACT, ordering, or coupling |
| 5 | Quality attributes / resource economics | a latency / throughput / capacity / reliability / availability / COST / resource bound |
| 6 | Failure / recovery / operations | a partial/full FAILURE and its detection / containment / retry / rollback-as-recovery / diagnosis / ownership |
| 7 | Trust / harm / governance | an ABUSE or HARM surface: security / privacy / safety / compliance / licensing / authority / retention of persisted or sensitive data |
| 8 | Inclusion / locale | an ACCESS need / input method / language / format / culture / locale |
| 9 | Change / compatibility / reversibility | a version/lifecycle CHANGE event: upgrade / migration / rollback-as-planned-reversal / deprecation / mixed-version |
| 10 | Evidence / traceability / clarity | whether the case's SOURCE / PROOF / trace is followable by a cold reader |

**Choosing each category's disposition (SR-1):** Can this concern AFFECT the target? No → `n/a: <property>`
(name the property that makes it inapplicable). Yes, and its coverage lives in a NAMED other artifact or
owner → `covered-elsewhere` (plus the SR-7 ledger). Yes, and this set's own families cover it → `selected`.

### Reference data — declaring a family's primary category

The primary is a **declared, justified choice, not a derived fact**; it exists only for stable IDs,
grouping, and primary-perspective routing. The match predicates and the global order are default
guidance plus a consistency check, not a mechanical rule:

1. **Consistency check** — the match predicates bound the LEGAL primaries; the author may declare only a
   category in the family's matched set.
2. **Default** — the global order gives the default primary (the highest matched):
   `7 > 6 > 9 > 3 > 4 > 5 > 8 > 2 > 1 > 10` (harm/severity-first).
3. **Declaration** — the author declares the primary = the family's **defining discrimination** plus a
   one-line justification. When it differs from the order-default, the justification names why the
   declared category is the defining concern and the higher-order matches are supporting context.
4. Non-primary matched categories become secondary tags (their categories stay `selected` per SR-1).
5. Completeness does not depend on the primary label — SR-1 plus the coverage-role minimums are the
   no-silent-drop net.

**Walk (the declared primary is correct-by-construction — no set→primary rule can be "wrong"):**

| Family | Matched set | Order-default | Author-declared primary + justification |
|---|---|---|---|
| **batch-capacity** ("at 10k complete within the 200 ms / memory budget; at 10 001 refuse before allocating") | {3,4,5} | 3 | **5 Performance** — the defining discrimination IS the latency/capacity/memory budget; input-class (3) and API contract (4) are the vehicle, not the concern |
| harmful failed migration | {3,6,7,9} | 7 | declare **7** if the family tests "does it corrupt retained data", **6** if "does the failed migration roll back safely" — with the justification |
| failed API-upgrade rollback | {4,6,9} | 6 | **6 Failure/recovery** — the defining concern is the upgrade failing and recovering |
| external-dependency outage | {4,6} | 6 | **6 Failure/recovery** |
| API-compatibility change | {4,9} | 9 | **9 Change/compatibility** |

### Reference data — case types (8)

Each case type has an objective match predicate.

| Case type | Match predicate: the case … |
|---|---|
| Positive / `Good` | exercises the ordinary valid path producing the intended outcome |
| Alternative-valid | exercises a materially different valid input-class / actor / mode / route |
| Negative / `Bad` | supplies invalid input / state / authz / precondition; expects safe rejection and no prohibited side effect |
| Boundary / edge | sits at an exact limit or transition (empty/one/many, below/at/above, first/last, timeout, interleave) |
| Failure / recovery | injects a dependency / partial / timeout / interruption / internal failure; expects detection plus recovery/containment |
| Adversarial / abuse / gaming | an intentional actor OR a cosmetically-compliant artifact attempts to exploit an asset / authority / invariant / acceptance-gate |
| Change / regression / compat | compares before/after across a version/lifecycle change |
| Counterfactual / assumption | inverts a load-bearing premise; expects a named disconfirmation response |

**Primary type — for stable ID and precedence/grouping only.** The matched-type set is every type whose
predicate the case satisfies; the default primary is the highest in the order among matched
(`adversarial > failure/recovery > boundary > negative > alternative-valid > change/regression >
counterfactual > positive`); the author may declare the primary as the case's defining discrimination
within the matched set. The primary label does not discharge coverage.

### Reference data — coverage-role and the n-ary inseparability record

**Coverage-role — what discharges a triggered minimum, decoupled from the primary label.** Every case
declares a **coverage-role set** = the discrimination types it genuinely EXERCISES (a subset of its
matched set, each with a one-line "how it exercises X"). A triggered minimum for type X is discharged by
any case whose coverage-role set includes X. Default: one case discharges at most one minimum.

**Risk-based minimums — a minimum is triggered when the family/case turns on one of its properties:**

| Minimum | Trigger properties |
|---|---|
| Boundary | quantity / ordering / state-transition / time-window / capacity / finite-set |
| Failure/recovery | external dependency / persistence / async / interruption / partial-mutation |
| Adversarial | trust boundary / authority / sensitive data / money incentive / irreversible action / gameable gate |
| Change/regression | existing users / data / APIs / files / memory / behavior |
| Counterfactual | any "if wrong, the design fails" premise |

An untriggered minimum is marked `n/a: <property>`. Every family also carries an adversarial face or a
property-`n/a` (SR-3).

**N-ary inseparability record.** When several triggered minima form ONE inseparable conjunction (no case
can exercise one without the others), a single case may discharge the whole set via ONE record:

- **`discharges:`** the EXACT enumerated set of minima (e.g. `[boundary, adversarial, change,
  failure/recovery]`).
- **`per-type-proof:`** for EACH enumerated type, a specific reason no independently-discriminating case
  exists — a bare "they're related" is INVALID (mirrors the `n/a: <property>` floor rigor).
- **`no-cosmetic-duplicate:`** cloning the same Given/When/Then under relabeled roles is forbidden; the
  record is ONE case, not N copies.
- **bounded + auditable:** ONE bounded set, not repeatable pairwise prose (no pairwise chaining to
  blanket-discharge).
- **gaming-probe gate (SR-12, run at P8):** the record is accepted ONLY after P8 tries to construct a
  dedicated single-type case for EACH enumerated type and none is constructible; if one IS
  constructible, that type is removed and gets its own case.

**4-way worked example:** *"a malicious remote peer exploits the legacy max-frame boundary only during a
mixed-version rollout, causing a timeout plus partial persisted-state mutation."* One case;
`discharges: [boundary, adversarial, change, failure/recovery]`; the max-frame boundary IS the exploit
vector, it manifests ONLY under the rollout, and its only observable outcome is the timeout plus partial
mutation — remove any one and that type's discrimination disappears; P8 confirms no dedicated single-type
case is constructible → accepted.

### Reference data — design-category → evaluation-perspective map (this skill owns this map)

A family's primary perspective is the row of its **declared** primary category. This map is owned here.

| Design category | Primary perspective | Secondary perspective(s) |
|---|---|---|
| 1 Purpose / outcomes / scope | Project | — |
| 2 Actors / stakeholders / use-context | Usage | Project |
| 3 Behavior / state / data | Structure | Consistency |
| 4 Interfaces / dependencies / structure | Structure | Consistency |
| 5 Quality attributes / resource economics | Performance | Risk |
| 6 Failure / recovery / operations | Risk | Structure, Usage |
| 7 Trust / harm / governance | Risk | Consistency |
| 8 Inclusion / locale | Usage | — |
| 9 Change / compatibility / reversibility | Consistency | Risk |
| 10 Evidence / traceability / clarity | Consistency | Aesthetics |

The seven perspectives plus Overall are owned by `evaluation/SKILL.md` Rules and Procedure step 5; this map
only assigns design categories to them. Route each cross-cutting concern through the applicable domain owner
and Evaluation's whole-subject perspective investigation. Do not re-list another skill's specialized concerns
here.

### Reference data — a well-formed scenario set (field lists)

- **Set level** — purpose + target + consumer; lifecycle mode; scope + non-goals (no "related cases");
  coverage register (SR-1 plus the SR-7 ledger); a category × case matrix (required case types per
  family; an empty cell needs a stated reason); source register; stable-ID policy; traceability — the
  set-level mandatory trace is source→scenarios AND scenario→obligation, both orphan-swept, with
  scenario→check links optional; coverage gaps + decisions.
- **Family level** — stable ID + literal title; declared primary category + justification + secondary
  tags; source / rationale; actor + outcome; situation / invariant; applicability + priority; case list;
  obligations (checklist IDs optional).
- **Case level** — declared primary case type + declared coverage-role set (plus an inseparability record
  where applicable); actor / role; Given; When; Then (plus prohibited side effects for a negative case);
  failure oracle; evidence / validation method; trace links.

Given-When-Then is a rendering, not the semantic model. Apply SR-9 to all evidence.

### Reference data — the design obligation

A **design obligation** is what a scenario proves the design MUST provide: a capability, constraint,
decision, recovery path, or piece of evidence the design has to deliver. Each non-exploratory case yields
one, and P7 converts it. *Example:* the batch-capacity boundary case (refuse at 10 001 before allocating)
yields the obligation *"the design MUST reject an over-capacity request before allocating, and surface a
typed capacity error"* — the constraint that case exists to prove.

### P1 — Frame the set and choose scale

State the purpose, target, consumer, and lifecycle mode, and choose the set's scale. Apply SR-8.

### P2 — Disposition the coverage frame

Disposition the coverage register and declare the applicable case types per selected category, before any
prose. Apply SR-1, SR-7.

### P3 — Gather sources

Collect the obligations, evidence, and constraints the set derives from. Apply SR-9.

### P4 — Lay the skeleton

Write the headings, placeholder IDs, trace slots, and empty case-field slots before any case prose. Apply
SR-5, SR-6.

### P5 — Write the ordinary valid cases

Draft the positive and alternative-valid cases. Apply SR-2.

### P6 — Derive the stress cases and declare the labels

Derive the boundary / failure / adversarial / change / counterfactual cases from the risk triggers, then
declare each family's primary category, each case's primary type, and each case's coverage-role set (plus
any n-ary inseparability record). Apply SR-4, SR-5, SR-2, SR-3.

### P7 — Convert cases into design obligations

Convert each case into the design obligation it proves. Apply SR-6.

### P8 — Run the failability and completeness gates

Challenge the draft in this order and revise on any failed probe:

1. Audit the positive floor and each triggered-minimum discharge; apply SR-2, SR-3, SR-7.
2. Vary or remove each claimed discrimination and compare the observable outcome; apply SR-10.
3. Have a cold reader resolve the evidence source, method, and expected signal; apply SR-11.
4. Build a cosmetically-conformant artifact that misses the intent, and for every n-ary record try a
   dedicated single-type case for each enumerated type, splitting out any constructible one; apply SR-12.
5. Observe below, at, and above each exact limit, and on both sides of each transition; apply SR-13.
6. Sweep the applicable sources, scenarios, and obligations for orphans; apply SR-6, SR-14.

### P9 — Stabilize and hand off

Replace placeholder IDs, preserve existing IDs, publish the coverage gaps and decisions, and resolve the
final traces. In evaluation mode, freeze the source set before recording results. Before handing the set
to evaluation, read the Evaluation [rules](../SKILL.md#rules),
[frame procedure](../SKILL.md#3-build-the-scenario-and-checklist-frame),
[perspective investigation](../SKILL.md#5-investigate-the-subject-across-perspectives),
[coverage procedure](../SKILL.md#6-close-coverage-and-challenge-the-results), and
[verdict procedure](../SKILL.md#7-derive-the-perspective-and-overall-verdicts). Those sections own
the fixed perspectives, causal finding content, completed-checklist use, and evidence-derived verdict. Apply
SR-4, SR-6, SR-8, SR-9, SR-14.

---

## References

One owner per borrowed fact; this skill owns the design-category → perspective map (a new fact, stated in
§ Procedure) and the generic category / family / case model, so those have no external owner.

- [`../SKILL.md` § Rules](../SKILL.md#rules) validates the seven perspectives and
  their fixed order that the design-category map assigns to.
- [`../SKILL.md` § Build the evaluation frame](../SKILL.md#3-build-the-scenario-and-checklist-frame)
  validates how evaluators select the applicable scenario and checklist coverage.
- [`../SKILL.md` § Perspective investigation](../SKILL.md#5-investigate-the-subject-across-perspectives)
  validates the causal finding content an evaluation-mode handoff (P9) names.
- [`../SKILL.md` § Derive verdicts](../SKILL.md#7-derive-the-perspective-and-overall-verdicts)
  validates the verdict rules an evaluation-mode handoff (P9) names.
- [`../SKILL.md` § Close coverage](../SKILL.md#6-close-coverage-and-challenge-the-results)
  validates the evidence-bearing completed checklist an evaluation-mode handoff (P9) supplies.
- [`../checklist/SKILL.md`](../checklist/SKILL.md) validates the `Check` definition and the two-gate /
  acceptance mechanics (coverage ≠ acceptance) that this skill points to but does not own.
- [`../../skill-writing/SKILL.md`](../../skill-writing/SKILL.md) validates the shared authoring gates and the
  type-specific section contract that will apply when this legacy skill is substantively revised.
