# CSS scenarios

This design-mode set derives from [CSS-1 through CSS-4](SKILL.md#rules) and
adds no policy. Its target is a browser or Electron-renderer CSS operation.
Its consumers are CSS authors, reviewers, the sibling checklist, and the CSS
evaluation extension. It covers static and exact-byte-bound CSS evidence, not
product acceptance or runtime skill-use proof. The set has six families and
thirty-eight cases. Its thirty-eight selected-category/triggered-type cells
remain below the default split thresholds of about twelve families and forty
distinct cells.

## Coverage frame

All ten Scenario-owner categories are dispositioned before the cases:

| # | Category | Disposition and carrier families | Positive floor | Triggered minimums |
|---|---|---|---|---|
| 1 | Purpose / outcomes / scope | `selected`; F1, F6 | C-S01 | alternative-valid, adversarial, counterfactual |
| 2 | Actors / stakeholders / use-context | `selected`; F1, F3, F6 | C-S07 | alternative-valid, adversarial |
| 3 | Behavior / state / data | `selected`; F2, F3 | C-S04 | boundary, failure/recovery, adversarial, change |
| 4 | Interfaces / dependencies / structure | `selected`; F1, F2, F4, F6 | C-S10 | failure/recovery, adversarial, change |
| 5 | Quality attributes / resource economics | `selected`; F3, F5 | C-S13 | boundary, adversarial, change |
| 6 | Failure / recovery / operations | `selected`; F3, F4 | C-S34 | failure/recovery, adversarial |
| 7 | Trust / harm / governance | `selected`; F4, F6 | C-S35 | failure/recovery, adversarial |
| 8 | Inclusion / locale | `selected`; F3 | C-S26 | alternative-valid, boundary, failure/recovery, adversarial |
| 9 | Change / compatibility / reversibility | `selected`; F1, F2, F5 | C-S19 | boundary, adversarial, change |
| 10 | Evidence / traceability / clarity | `selected`; all families | C-S38 | adversarial, counterfactual |

No category is `covered-elsewhere`, so no SR-7 condition-to-clause ledger is
needed. No category is `n/a`; secondary category matches remain `selected`.
The source register is CSS-1 for F1, CSS-2 for F2/F3, CSS-3 for F4/F6, and
CSS-4 for F5/F6. Evidence containing sensitive data is referenced or redacted
under the project retention policy; it is never copied into this set.

Cases use the exact Scenario-owner type enum: `Positive / Good`,
`Alternative-valid`, `Negative / Bad`, `Boundary / edge`,
`Failure / recovery`, `Adversarial / abuse / gaming`,
`Change / regression / compat`, and `Counterfactual / assumption`. Each case
below declares its matched subset, one justified primary member, and the
coverage-role discrimination it actually exercises.

### Category × case-type matrix

`P` is the positive floor. Other entries are case IDs that discharge a
triggered minimum. `n/a:<property>` proves that the category does not trigger
that minimum in this bounded set.

| Category | Positive | Alternative-valid | Boundary | Failure/recovery | Adversarial | Change | Counterfactual |
|---|---|---|---|---|---|---|---|
| 1 | C-S01 | C-S02 | `n/a:no-purpose-owned-quantitative-edge` | `n/a:no-purpose-owned-recovery` | C-S18 | `n/a:change-owned-by-category-9` | C-S17 |
| 2 | C-S07 | C-S27 | `n/a:no-actor-owned-quantitative-edge` | `n/a:no-actor-owned-recovery` | C-S20 | `n/a:actor-contract-unchanged` | `n/a:no-load-bearing-actor-premise` |
| 3 | C-S04 | `n/a:no-distinct-valid-state-class` | C-S05 | C-S09 | C-S24 | C-S06 | `n/a:no-load-bearing-state-premise` |
| 4 | C-S10 | `n/a:no-second-valid-interface-route` | `n/a:no-interface-owned-quantitative-edge` | C-S11 | C-S12 | C-S23 | `n/a:no-load-bearing-interface-premise` |
| 5 | C-S13 | `n/a:no-second-valid-budget-class` | C-S29 | `n/a:failure-owned-by-category-6` | C-S15 | C-S16 | `n/a:no-load-bearing-quality-premise` |
| 6 | C-S34 | `n/a:recovery-has-one-valid-owner-route` | `n/a:no-numeric-recovery-edge` | C-S30 | C-S32 | `n/a:recovery-owner-unchanged` | `n/a:no-load-bearing-recovery-premise` |
| 7 | C-S35 | `n/a:authority-route-is-singular` | `n/a:no-numeric-governance-edge` | C-S36 | C-S37 | `n/a:governance-owner-unchanged` | `n/a:no-load-bearing-governance-premise` |
| 8 | C-S26 | C-S28 | C-S08 | C-S31 | C-S33 | `n/a:locale-matrix-not-versioned` | `n/a:no-load-bearing-inclusion-premise` |
| 9 | C-S19 | `n/a:no-second-valid-compatibility-route` | C-S03 | `n/a:recovery-owned-by-category-6` | C-S21 | C-S22 | `n/a:no-load-bearing-compatibility-premise` |
| 10 | C-S38 | `n/a:no-second-valid-trace-route` | `n/a:trace-is-exact-not-quantitative` | `n/a:recovery-owned-by-category-6` | C-S25 | `n/a:change-owned-by-category-9` | C-S14 |

## Families

Every primary category is an author-declared member of the matched set. The
justification names the defining discrimination; secondary matches do not
discharge coverage.

| Family | Declared primary and justification | Secondary matched categories | Source; actor/outcome; situation; applicability/priority | Cases; obligations |
|---|---|---|---|---|
| F1 Target adoption and fallback | **9 Change / compatibility / reversibility** — target-set change defines the adoption decision. | 1, 2, 4, 10 | CSS-1; author/reviewer safely adopts a feature; exact pinned target or browser matrix; every material feature/high | C-S01, C-S02, C-S03, C-S19–C-S22; O1 |
| F2 Cascade ownership and regression | **3 Behavior / state / data** — the winning declaration and computed state define success. | 4, 9, 10 | CSS-2; author preserves intentional winners; competing declarations and a CSS change; whenever declarations compete/high | C-S04–C-S06, C-S23–C-S25; O2 |
| F3 Resilient inclusive rendering | **8 Inclusion / locale** — content, input, locale, and preference variation define success. | 2, 3, 5, 6, 10 | CSS-2; affected user retains content and cues; content/mode extremes and resource failure; user-facing CSS/high | C-S07–C-S09, C-S26–C-S33; O3/O4 |
| F4 Source, transform, trust, and recovery | **7 Trust / harm / governance** — authority and exact-source integrity define the boundary. | 4, 6, 10 | CSS-3; operator repairs the owner without corrupting emitted output; direct or transformed CSS; every output/critical | C-S10–C-S12, C-S34–C-S38; O5 |
| F5 Measured performance | **5 Quality attributes / resource economics** — the representative metric and budget define success. | 9, 10 | CSS-4; author accepts only measured safe improvement; performance claim on existing behavior; when claimed/high | C-S13–C-S16; O6 |
| F6 Independent use and claim ceiling | **1 Purpose / outcomes / scope** — whether CSS alone can produce its bounded outcome defines success. | 2, 4, 7, 10 | CSS-3/CSS-4; operator completes CSS work and routes other owners; CSS bundle used without UI/UX/web/HTML; every run/high | C-S17–C-S18; O7 |

Every family has one declared adversarial face. A face is valid only when its
case belongs to the family and its earned matrix role is
`Adversarial / abuse / gaming`.

| Family | Adversarial face | Earned matrix role |
|---|---|---|
| F1 | C-S20 | category 2 / `Adversarial / abuse / gaming` |
| F2 | C-S24 | category 3 / `Adversarial / abuse / gaming` |
| F3 | C-S32 | category 6 / `Adversarial / abuse / gaming` |
| F4 | C-S12 | category 4 / `Adversarial / abuse / gaming` |
| F5 | C-S15 | category 5 / `Adversarial / abuse / gaming` |
| F6 | C-S18 | category 1 / `Adversarial / abuse / gaming` |

## Cases

Each coverage-role entry states the discrimination it actually exercises. One
case discharges at most one matrix minimum. None uses an n-ary
inseparability record.

### Earned coverage-role register

This register is the canonical declaration used by the matrix. A case's
matched types or primary label never discharge a cell. Every case appears
exactly once here and exactly once in the matrix.

| Case | Family | Category | Earned coverage role |
|---|---|---:|---|
| C-S01 | F1 | 1 | `Positive / Good` |
| C-S02 | F1 | 1 | `Alternative-valid` |
| C-S03 | F1 | 9 | `Boundary / edge` |
| C-S04 | F2 | 3 | `Positive / Good` |
| C-S05 | F2 | 3 | `Boundary / edge` |
| C-S06 | F2 | 3 | `Change / regression / compat` |
| C-S07 | F3 | 2 | `Positive / Good` |
| C-S08 | F3 | 8 | `Boundary / edge` |
| C-S09 | F3 | 3 | `Failure / recovery` |
| C-S10 | F4 | 4 | `Positive / Good` |
| C-S11 | F4 | 4 | `Failure / recovery` |
| C-S12 | F4 | 4 | `Adversarial / abuse / gaming` |
| C-S13 | F5 | 5 | `Positive / Good` |
| C-S14 | F5 | 10 | `Counterfactual / assumption` |
| C-S15 | F5 | 5 | `Adversarial / abuse / gaming` |
| C-S16 | F5 | 5 | `Change / regression / compat` |
| C-S17 | F6 | 1 | `Counterfactual / assumption` |
| C-S18 | F6 | 1 | `Adversarial / abuse / gaming` |
| C-S19 | F1 | 9 | `Positive / Good` |
| C-S20 | F1 | 2 | `Adversarial / abuse / gaming` |
| C-S21 | F1 | 9 | `Adversarial / abuse / gaming` |
| C-S22 | F1 | 9 | `Change / regression / compat` |
| C-S23 | F2 | 4 | `Change / regression / compat` |
| C-S24 | F2 | 3 | `Adversarial / abuse / gaming` |
| C-S25 | F2 | 10 | `Adversarial / abuse / gaming` |
| C-S26 | F3 | 8 | `Positive / Good` |
| C-S27 | F3 | 2 | `Alternative-valid` |
| C-S28 | F3 | 8 | `Alternative-valid` |
| C-S29 | F3 | 5 | `Boundary / edge` |
| C-S30 | F3 | 6 | `Failure / recovery` |
| C-S31 | F3 | 8 | `Failure / recovery` |
| C-S32 | F3 | 6 | `Adversarial / abuse / gaming` |
| C-S33 | F3 | 8 | `Adversarial / abuse / gaming` |
| C-S34 | F4 | 6 | `Positive / Good` |
| C-S35 | F4 | 7 | `Positive / Good` |
| C-S36 | F4 | 7 | `Failure / recovery` |
| C-S37 | F4 | 7 | `Adversarial / abuse / gaming` |
| C-S38 | F4 | 10 | `Positive / Good` |

### F1 — Target adoption and fallback

#### C-S01 — Sole pinned Electron target

- **Types:** matched `{positive}`; declared primary `Positive` because ordinary
  exact-target adoption is the defining discrimination; coverage-role
  `{positive: D4 is earned only by one fully supported pinned target}`.
- **Actor/Given/When/Then:** reviewer; given one pinned Electron runtime and
  current dated evidence, when S/D is classified, then D4 is recorded with
  exact-target tests and a reopen condition.
- **Failure oracle/evidence:** D4 without sole-target proof; feature ledger,
  versions, observed support, fallback record.
- **Obligation:** O1. Checks C-K01, C-K09.

#### C-S02 — Multi-engine progressive enhancement

- **Types:** matched `{alternative-valid}`; primary `Alternative-valid` because
  a browser matrix with a fallback is the distinct valid route; coverage-role
  `{alternative-valid: supported targets receive enhancement while all others retain the essential outcome}`.
- **Actor/Given/When/Then:** author; given differing declared targets, when the
  feature is selected, then D3, a fallback, target tests, and a reopen rule are
  recorded.
- **Failure oracle/evidence:** one engine silently loses essential content;
  target matrix, fallback result, exact tests.
- **Obligation:** O1. Checks C-K01, C-K09.

#### C-S03 — Umbrella support at the exact boundary

- **Types:** matched `{boundary, adversarial}`; primary `Boundary` because the
  one-target/multi-target transition defines the case; coverage-role
  `{boundary: compare one declared target with the first added target}`.
- **Actor/Given/When/Then:** reviewer; given a D4 claim, when a second target is
  added, then the first-match deployment decision is recomputed and cannot
  remain D4 on an umbrella claim.
- **Failure oracle/evidence:** label-only “supported” preserves D4; before/after
  target set, per-target observation, ledger transition.
- **Obligation:** O1. Checks C-K01, C-K09.

### F2 — Cascade ownership and regression

#### C-S04 — Intentional cascade winner

- **Types:** matched `{positive}`; primary `Positive`; coverage-role
  `{positive: matched rules resolve to the declared layer/owner}`.
- **Actor/Given/When/Then:** author; given layered competing declarations, when
  the element is inspected, then the intended rule wins and its computed value
  agrees with the contract.
- **Failure oracle/evidence:** appearance passes but winner is unexplained;
  exact CSS, matched rules, cascade trace, computed value.
- **Obligation:** O2. Checks C-K02, C-K10.

#### C-S05 — Scope/order transition

- **Types:** matched `{boundary}`; primary `Boundary` because equal specificity
  immediately before/at/after the scope/order transition defines the case;
  coverage-role `{boundary: observe both sides and the exact transition}`.
- **Actor/Given/When/Then:** reviewer; given equal-specificity candidates, when
  scope proximity and order cross, then the winner changes only at the defined
  transition.
- **Failure oracle/evidence:** off-by-one order or hidden proximity changes the
  winner; three-position fixture and cascade trace.
- **Obligation:** O2. Checks C-K02, C-K10.

#### C-S06 — Specificity escalation during change

- **Types:** matched `{change/regression, adversarial}`; primary
  `Change/regression` because an existing winner is modified; coverage-role
  `{change/regression: compare accepted before/after computed behavior}`.
- **Actor/Given/When/Then:** maintainer; given accepted layered CSS, when a
  deeper selector or `!important` is proposed, then ownership is repaired
  without override debt and intended computed behavior remains.
- **Failure oracle/evidence:** cosmetic output passes while specificity debt
  grows; before/after cascade and computed records.
- **Obligation:** O2. Checks C-K02, C-K10.

### F3 — Resilient inclusive rendering

#### C-S07 — Ordinary localized responsive component

- **Types:** matched `{positive}`; primary `Positive`; coverage-role
  `{positive: representative locale, direction, input, and preference modes preserve the outcome}`.
- **Actor/Given/When/Then:** user; given normal content across declared modes,
  when rendered, then content and interaction cues remain visible and usable.
- **Failure oracle/evidence:** a required cue or content disappears; exact
  bytes, mode matrix, geometry, rendered observation.
- **Obligation:** O3/O4. Checks C-K03, C-K11, C-K12.

#### C-S08 — Exact intrinsic extremes

- **Types:** matched `{alternative-valid, boundary}`; primary `Boundary`
  because empty/one/many and narrow/at/wide limits define the case;
  coverage-role `{boundary: inspect below, at, and above every declared limit}`.
- **Actor/Given/When/Then:** user; given empty, one, and many items plus shortest
  and longest supported locale text, when container size crosses the limit,
  then essential content remains visible without unintended overflow.
- **Failure oracle/evidence:** clipping, overlap, or screenshot-bound geometry;
  content fixtures and geometry/overflow assertions.
- **Obligation:** O3. Checks C-K03, C-K11.

#### C-S09 — Font/mode failure recovery

- **Types:** matched `{failure/recovery, adversarial}`; primary
  `Failure/recovery` because resource loss and preserved function define the
  case; coverage-role
  `{failure/recovery: inject font failure and recover with readable fallback}`.
- **Actor/Given/When/Then:** user; given failed font loading plus forced colors
  or reduced motion, when CSS falls back, then text, focus, non-color state, and
  function remain.
- **Failure oracle/evidence:** any required signal vanishes; failure injection,
  fallback font geometry, state/mode captures.
- **Obligation:** O3/O4. Checks C-K04, C-K12.

### F4 — Source, transform, trust, and recovery

#### C-S10 — Direct-source identity

- **Types:** matched `{positive}`; primary `Positive`; coverage-role
  `{positive: a no-transform record binds source bytes directly to observable output}`.
- **Actor/Given/When/Then:** operator; given direct CSS, when accepted, then the
  exact source digest and CSSOM/computed/layout/rendered observation agree.
- **Failure oracle/evidence:** observation binds to different bytes; digest and
  observation identity comparison.
- **Obligation:** O5. Checks C-K05, C-K13.

#### C-S11 — Generated CSS recovery

- **Types:** matched `{failure/recovery}`; primary `Failure/recovery`;
  coverage-role
  `{failure/recovery: wrong computed output is repaired at its owner, regenerated, rebound, and retested}`.
- **Actor/Given/When/Then:** operator; given a transform emitting a wrong value,
  when repair runs, then source/config/security owner changes, output
  regenerates, and all four links are rebound.
- **Failure oracle/evidence:** emitted bytes are patched or a link remains
  stale; source, exact transform identity, emitted digest, observation.
- **Obligation:** O5. Checks C-K05, C-K13, C-K15.

#### C-S12 — Output-patch gaming attempt

- **Types:** matched `{negative, adversarial}`; primary `Adversarial` because
  intentional cosmetic repair bypasses ownership; `Negative / Bad` also
  matches because the proposed repair violates the source precondition;
  coverage-role
  `{adversarial: patch emitted bytes while preserving labels and detect the identity break}`.
- **Actor/Given/When/Then:** adversarial maintainer; given a failed generated
  output, when emitted bytes alone are patched, then the run halts and routes
  to the generator/security owner.
- **Failure oracle/evidence:** patched output is accepted; source/output digest
  mismatch and missing regeneration record.
- **Obligation:** O5. Checks C-K05, C-K07, C-K15.

### F5 — Measured performance

#### C-S13 — Representative measured improvement

- **Types:** matched `{positive}`; primary `Positive`; coverage-role
  `{positive: representative before/after metric improves while behavior guard passes}`.
- **Actor/Given/When/Then:** reviewer; given a measured bottleneck and budget,
  when the candidate runs on the representative fixture, then metric,
  hypothesis, guard, and removal rule all hold.
- **Failure oracle/evidence:** only a synthetic score or slogan exists;
  fixture, raw metric, behavior guard, criterion.
- **Obligation:** O6. Checks C-K06, C-K14.

#### C-S14 — Counterfactual metric premise

- **Types:** matched `{counterfactual}`; primary `Counterfactual` because the
  premise that the metric represents user work is inverted; coverage-role
  `{counterfactual: substitute a non-representative fixture and require rejection}`.
- **Actor/Given/When/Then:** reviewer; given an improvement on an unrepresentative
  fixture, when representativeness is challenged, then the claim is rejected
  or narrowed.
- **Failure oracle/evidence:** the isolated score passes; fixture comparison
  and workload trace.
- **Obligation:** O6. Checks C-K06.

#### C-S15 — Performance-hint gaming

- **Types:** matched `{adversarial}`; primary `Adversarial`; coverage-role
  `{adversarial: add fashionable containment/visibility/will-change syntax without evidence}`.
- **Actor/Given/When/Then:** adversarial author; given no measured bottleneck,
  when a hint is added, then acceptance fails even if lint and labels pass.
- **Failure oracle/evidence:** syntax presence earns a pass; absence of the
  measurement tuple and behavior evidence.
- **Obligation:** O6. Checks C-K06, C-K14.

#### C-S16 — Existing-behavior performance regression

- **Types:** matched `{change/regression}`; primary `Change/regression`;
  coverage-role
  `{change/regression: compare accepted before/after behavior and metric on the same fixture}`.
- **Actor/Given/When/Then:** maintainer; given existing accepted CSS, when an
  optimization changes it, then the metric improves without behavior,
  accessibility, or target regression and the removal rule remains.
- **Failure oracle/evidence:** improvement hides a rendering regression;
  before/after digest, metric, and behavior result.
- **Obligation:** O6. Checks C-K06, C-K14.

### F6 — Independent use and claim ceiling

#### C-S17 — Static evidence cannot prove runtime use

- **Types:** matched `{counterfactual}`; primary `Counterfactual`; coverage-role
  `{counterfactual: invert the premise that static topology proves discovery, use, or product acceptance}`.
- **Actor/Given/When/Then:** reviewer; given green links and static checks, when
  a runtime/product claim is proposed, then the claim is rejected or limited to
  inspected static evidence.
- **Failure oracle/evidence:** a static pass is relabeled runtime proof; check
  output and final claim text.
- **Obligation:** O7. Checks C-K08.

#### C-S18 — Hidden sibling prerequisite

- **Types:** matched `{adversarial}`; primary `Adversarial`; coverage-role
  `{adversarial: remove HTML/UI/UX/web context and detect any hidden dependency}`.
- **Actor/Given/When/Then:** CSS operator; given only coding, this bundle,
  emitted CSS, and targets, when the eight-step procedure runs, then CSS-owned
  work completes and other owners are explicitly routed outward.
- **Failure oracle/evidence:** the run cannot proceed without a sibling skill or
  claims Electron-process authority; load contract, owner map, selected route,
  claim text.
- **Obligation:** O7. Checks C-K07, C-K08.

### Additional independently discriminating case records

These records add the one-role cases needed for matrix closure. Each row keeps
the complete Scenario case fields: matched types and justified primary;
Actor/Given/When/Then; failure oracle; evidence method; obligation; and
checklist route.

| ID / family | Matched types; declared primary and justification | Actor / Given / When / Then | Failure oracle; evidence method | Obligation; checks |
|---|---|---|---|---|
| C-S19 / F1 | `{positive}`; `Positive / Good` because an accepted target baseline defines the ordinary compatibility state. | reviewer / a dated target set and fallback exist / the accepted ledger is read / class, fallback, tests, and reopen record agree. | baseline cannot be reproduced; exact target ledger plus results. | O1; C-K09, C-K16–C-K19 |
| C-S20 / F1 | `{adversarial}`; `Adversarial / abuse / gaming` because a target user-context is deliberately omitted. | adversarial author / two input and engine contexts are declared / one context is removed from evidence / adoption halts. | remaining context is presented as complete; declared-target versus evidence-set diff. | O1; C-K16, C-K18 |
| C-S21 / F1 | `{adversarial}`; `Adversarial / abuse / gaming` because a stale support label tries to preserve compatibility. | adversarial maintainer / target versions changed / old class text is retained / direct observations reject the label. | stale D value passes; before/after target observations. | O1; C-K09, C-K16 |
| C-S22 / F1 | `{change/regression}`; `Change / regression / compat` because target-version change is the sole variable. | maintainer / an accepted ledger exists / one declared target upgrades / classification, fallback, tests, and reopen state are recomputed. | old result is copied forward; versioned ledger diff and repeated tests. | O1; C-K09, C-K16–C-K19 |
| C-S23 / F2 | `{change/regression}`; `Change / regression / compat` because a public layer interface changes. | maintainer / accepted layer order exists / one layer or custom-property contract changes / dependants retain the intended winner. | unrelated selectors change winners; before/after cascade traces. | O2; C-K02, C-K10 |
| C-S24 / F2 | `{adversarial}`; `Adversarial / abuse / gaming` because cosmetic equality hides a wrong cascade owner. | adversarial author / two declarations render the same value / ownership is swapped / matched-rule evidence fails. | screenshot-only equality earns acceptance; owner/layer trace and computed value. | O2; C-K02 |
| C-S25 / F2 | `{adversarial}`; `Adversarial / abuse / gaming` because evidence text is rebound without rerunning the assertion. | adversarial reviewer / emitted bytes changed / the old computed result is relabelled / digest comparison rejects it. | stale assertion passes by filename; assertion output and emitted digest. | O2; C-K10, C-K13 |
| C-S26 / F3 | `{positive}`; `Positive / Good` because the declared locale/mode matrix is the ordinary inclusion baseline. | user / supported locales, directions, writing modes, and preferences are listed / all cells render / essential content and cues remain. | a declared cell lacks evidence; exact fixture and result matrix. | O3/O4; C-K03, C-K04, C-K11, C-K12, C-K20–C-K22, C-K30 |
| C-S27 / F3 | `{alternative-valid}`; `Alternative-valid` because keyboard, pointer, and touch are distinct valid use contexts. | user / all declared input modes reach the same state / each path is exercised / equivalent state cues remain available. | one actor context is silently excluded; input-mode inventory and captures. | O4; C-K04, C-K30 |
| C-S28 / F3 | `{alternative-valid}`; `Alternative-valid` because horizontal and vertical writing modes are distinct valid renderings. | reader / both modes are declared / logical layout rules run / content order and visibility remain correct. | one mode is treated as exceptional failure; writing-mode matrix and geometry. | O3; C-K11 |
| C-S29 / F3 | `{boundary}`; `Boundary / edge` because the performance/resource limit is tested below, at, and above the exact threshold. | user / zoom, text growth, and container thresholds are declared / each transition is crossed / essential content remains visible. | a single midpoint screenshot passes; boundary geometry and overflow assertions. | O3; C-K03 |
| C-S30 / F3 | `{failure/recovery}`; `Failure / recovery` because the font resource is deliberately unavailable. | reader / custom font loading fails / fallback metrics apply / text stays readable without clipping. | font error leaves stale geometry; failed-font fixture and before/after boxes. | O3/O4; C-K22, C-K25, C-K28, C-K29 |
| C-S31 / F3 | `{failure/recovery}`; `Failure / recovery` because a declared inclusion mode loses its first rendering path. | user / forced colors or reduced motion replaces the default path / fallback rules run / function and essential cues remain. | fallback removes the only cue; exact mode capture and state assertion. | O4; C-K12, C-K20, C-K30 |
| C-S32 / F3 | `{adversarial}`; `Adversarial / abuse / gaming` because failure evidence is deleted while the success label remains. | adversarial author / an injected resource failure exists / its fixture is omitted / coverage comparison blocks acceptance. | label-only recovery passes; fixture register versus filled-run evidence. | O3/O4; C-K15, C-K28, C-K29 |
| C-S33 / F3 | `{adversarial}`; `Adversarial / abuse / gaming` because one locale screenshot is presented as the full inclusion matrix. | adversarial reviewer / multiple locales and modes are declared / only the default cell is supplied / missing cells fail closure. | representative-looking image earns a universal pass; declared versus observed matrix. | O3/O4; C-K11, C-K20–C-K22 |
| C-S34 / F4 | `{positive}`; `Positive / Good` because a complete recovery run is the ordinary operational path. | operator / a prior CSS-owned failure is preserved / repair runs / affected layers pass with a new bound digest. | recovery exists only as intention; failure, repair, digest, observation, and rerun records. | O5; C-K15, C-K25–C-K29 |
| C-S35 / F4 | `{positive}`; `Positive / Good` because a complete authority record defines ordinary trust routing. | operator / a foreign concern is detected / the owner map is consulted / CSS pauses until the required decision is present. | CSS assumes privilege; owner and decision pointer. | O5; C-K07 |
| C-S36 / F4 | `{failure/recovery}`; `Failure / recovery` because a missing security/generator decision is repaired by its owner. | operator / a style URL or transform lacks authority / the run stops / the owner supplies a decision before CSS resumes. | CSS proceeds on owner name alone; before/after decision record. | O5; C-K07, C-K25 |
| C-S37 / F4 | `{adversarial}`; `Adversarial / abuse / gaming` because a CSS note impersonates a security/runtime authorization. | adversarial operator / a foreign concern has no decision / a local label claims approval / authority comparison rejects it. | self-authored approval passes; mandate identity and owner decision pointer. | O5; C-K07 |
| C-S38 / F4 | `{positive}`; `Positive / Good` because exact four-link evidence defines a clear accepted output. | reviewer / source, transform-or-none, emitted digest, and observation are available / identities are compared / all links name the same bytes. | filenames match while digests differ; four-link identity record. | O5; C-K05, C-K13 |

## Obligations and closure

| Obligation | Parent source | Cases | Checklist routes |
|---|---|---|---|
| O1 Classify specification and deployment independently with fallback, tests, and reopen conditions. | CSS-1 | C-S01–C-S03, C-S19–C-S22 | C-K01, C-K09, C-K16–C-K19 |
| O2 Make cascade ownership and accepted computed behavior observable across change. | CSS-2 | C-S04–C-S06, C-S23–C-S25 | C-K02, C-K10, C-K13 |
| O3 Preserve intrinsic content across exact size, locale, direction, and writing-mode boundaries. | CSS-2 | C-S07–C-S09, C-S26, C-S28–C-S30, C-S33 | C-K03, C-K11, C-K22 |
| O4 Preserve focus, non-color state, forced-color, font-failure, and reduced-motion behavior. | CSS-2 | C-S07–C-S09, C-S26–C-S33 | C-K04, C-K12, C-K20–C-K22, C-K30 |
| O5 Bind direct or transformed source to exact emitted bytes and a fourth-link observation; repair at the owner. | CSS-3 | C-S10–C-S12, C-S34–C-S38 | C-K05, C-K07, C-K13, C-K15, C-K25–C-K29, C-K31–C-K33 |
| O6 Accept performance work only from representative measurement plus behavior guard and removal criterion. | CSS-4 | C-S13–C-S16 | C-K06, C-K14, C-K23, C-K24 |
| O7 Complete CSS independently, route foreign ownership outward, and keep claims within the evidence ceiling. | CSS-3/CSS-4 | C-S17–C-S18, C-S35–C-S37 | C-K07, C-K08, C-K33 |

The source→scenario sweep covers CSS-1–CSS-4. Every case produces at least one
live obligation and every obligation has cases and checklist slots. Every
family has an earned adversarial-role case. Every claimed boundary sits at the
exact transition. Cosmetic label, file-presence, and syntax-only counterfeits
fail C-S20, C-S24, C-S32, C-S12, C-S15, or C-S18.
