# React scenarios — Operation and evidence

This bounded set covers skeleton-first construction, affected-set completion, multi-axis review, and
evidence fidelity. Enter through the [`scenarios.md`](scenarios.md) parent.

## Set frame

- **Purpose:** fail implementation or review processes that look complete while hiding structure, scope, or evidence gaps.
- **Target and consumers:** one React change-set; executors and evaluators selected by the parent.
- **Lifecycle:** evaluation mode and read-only review mode.
- **Scope:** bottom-up operation and evidence; React behavior and host boundaries live in sibling sets.
- **Threshold:** at most 12 families and 50 cells. This set has 2 families and 27 cells.
- **Stable IDs:** families 11 and 12 retain their published identities.

## Scenario Rule 1 coverage register

| # | Category | Disposition | Carrier or ledger |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | `selected` | `REACT-SCENARIO-11`, `REACT-SCENARIO-12` |
| 2 | Actors / stakeholders / use-context | `selected` | `REACT-SCENARIO-11`, `REACT-SCENARIO-12` |
| 3 | Behavior / state / data | `selected` | `REACT-SCENARIO-11` |
| 4 | Interfaces / dependencies / structure | `selected` | `REACT-SCENARIO-11`, `REACT-SCENARIO-12` |
| 5 | Quality attributes / resource economics | `covered-elsewhere`: [compiler performance evidence](scenarios-components.md#react-scenario-07--the-compiler-baseline-the-named-escape-hatch-and-legacy-memoization) | `SR7-5` |
| 6 | Failure / recovery / operations | `covered-elsewhere`: [async containment](scenarios-components.md#react-scenario-05--effect-cleanup-and-the-stale-result-race) | `SR7-6` |
| 7 | Trust / harm / governance | `covered-elsewhere`: [renderer trust boundary](scenarios-boundaries.md#react-scenario-10--producer-assumptions-across-browser-and-renderer-presentation) | `SR7-7` |
| 8 | Inclusion / locale | `covered-elsewhere`: [rendered access mechanics](scenarios-components.md#react-scenario-09--the-rendered-markup-as-a-contract-semantics-aria-and-focus) | `SR7-8` |
| 9 | Change / compatibility / reversibility | `selected` | `REACT-SCENARIO-12` |
| 10 | Evidence / traceability / clarity | `selected` | `REACT-SCENARIO-12` |

### Category by case type

A cell is one distinct `(selected category, triggered case type)` pair, counted once. Family lists make
the carrier set auditable without a second editable carrier table.

| Category | Positive | Negative | Adversarial | Boundary | Failure/recovery | Alt-valid | Change | Counterfactual |
|---|---|---|---|---|---|---|---|---|
| 1 Purpose | `REACT-SCENARIO-11`, `REACT-SCENARIO-12` | `REACT-SCENARIO-11`, `REACT-SCENARIO-12` | `REACT-SCENARIO-11`, `REACT-SCENARIO-12` | `REACT-SCENARIO-11` | — | `REACT-SCENARIO-11` | — | — |
| 2 Actors | `REACT-SCENARIO-11`, `REACT-SCENARIO-12` | `REACT-SCENARIO-11`, `REACT-SCENARIO-12` | `REACT-SCENARIO-11`, `REACT-SCENARIO-12` | — | — | `REACT-SCENARIO-11`, `REACT-SCENARIO-12` | — | — |
| 3 Behavior | `REACT-SCENARIO-11` | `REACT-SCENARIO-11` | `REACT-SCENARIO-11` | `REACT-SCENARIO-11` | — | — | — | — |
| 4 Interfaces | `REACT-SCENARIO-11`, `REACT-SCENARIO-12` | `REACT-SCENARIO-11`, `REACT-SCENARIO-12` | `REACT-SCENARIO-11`, `REACT-SCENARIO-12` | `REACT-SCENARIO-11` | — | — | `REACT-SCENARIO-12` | — |
| 5 Quality | — | — | — | — | — | — | — | — |
| 6 Failure | — | — | — | — | — | — | — | — |
| 7 Trust | — | — | — | — | — | — | — | — |
| 8 Inclusion | — | — | — | — | — | — | — | — |
| 9 Change | `REACT-SCENARIO-12` | `REACT-SCENARIO-12` | `REACT-SCENARIO-12` | — | — | — | `REACT-SCENARIO-12` | — |
| 10 Evidence | `REACT-SCENARIO-12` | `REACT-SCENARIO-12` | `REACT-SCENARIO-12` | — | — | `REACT-SCENARIO-12` | `REACT-SCENARIO-12` | — |

Cells: 27 across 2 families. An em dash means the category's in-child families do not turn on that
case-type property; each family's `Minimums:` line states why, and categories 5 through 8 resolve through
their Scenario Rule 7 ledgers.

### Scenario Rule 7 covered-elsewhere ledger

| Ledger | Applicable families | Risk-triggered case types | Failure oracles | Actors | Exact target clause |
|---|---|---|---|---|---|
| SR7-5 | operation changes intended to improve render work | change/regression, counterfactual | render or Effect counts regress across compiler adoption | maintainer and downstream user | [`REACT-SCENARIO-07`](scenarios-components.md#react-scenario-07--the-compiler-baseline-the-named-escape-hatch-and-legacy-memoization), especially its change, counterfactual, oracle, and obligation |
| SR7-6 | an operation slice that opens async work or a subscription | boundary, failure/recovery, adversarial | stale output wins or a live listener remains after unmount | component user and maintainer | [`REACT-SCENARIO-05`](scenarios-components.md#react-scenario-05--effect-cleanup-and-the-stale-result-race), especially its boundary, failure/recovery, adversarial probe, oracle, and obligation |
| SR7-7 | review or implementation that exposes server or Electron privilege | adversarial, failure/recovery, counterfactual | unauthorized capability is reachable or a rejected channel hangs | page code, renderer user, server-function caller | [`REACT-SCENARIO-10`](scenarios-boundaries.md#react-scenario-10--producer-assumptions-across-browser-and-renderer-presentation), especially its adversarial probe, failure/recovery, counterfactual, oracle, and obligation |
| SR7-8 | a rendered slice with keyboard or assistive-technology interaction | boundary, adversarial | focus is lost or a control cannot be operated without a mouse | keyboard and assistive-technology user | [`REACT-SCENARIO-09`](scenarios-components.md#react-scenario-09--the-rendered-markup-as-a-contract-semantics-aria-and-focus), especially its boundary, adversarial probe, oracle, and obligation |

## Source register and trace closure

Sources are `SKILL.md` H10, P1, P7, and Procedure P2/P4–P8. Every family below names those sources and
ends in an obligation. Sibling pointers above carry every applicable non-operation risk with a complete ledger.

## Families

### REACT-SCENARIO-11 — Skeleton first, then verified slices
- **Axis:** Bottom-up operation.
- **Primary category:** 1 Purpose / outcomes / scope — the defining discrimination is whether the build
  order produced a design that could be checked before it was filled in. **Secondary:** 2, 3.
- **Situation:** Given a feature spanning several components, a custom hook, and their prop types. When it
  is built.
- **Good handling:** the components, hooks, and prop types are created with stub bodies that render and
  type-check before any behavior exists; then one verified slice at a time, with every affected caller,
  test, story, and type moving in the same slice.
- **Bad handling:** the whole feature appears in one pass, so a structural mistake surfaces only after
  every body is written; callers and tests are updated in a follow-up change.
- **Alternative-valid:** review mode — the same steps run read-only to reconstruct and grade an existing
  design; the skeleton and growth steps are skipped and nothing is edited.
- **Boundary:** exactly at the skeleton gate — the tree renders and type-checks with zero behavior
  implemented.
- **Adversarial probe:** the "skeleton" already carries behavior in three components, so the gate passes
  and proves nothing about the structure. **Cosmetic form:** every stub returns nothing at all, so the
  tree renders trivially and the composition was never exercised.
- **Minimums:** boundary see above · alternative-valid see above · adversarial see above ·
  failure/recovery `n/a: no external dependency in the build sequence` · change `n/a: no version or
  lifecycle event` · counterfactual `n/a: no load-bearing premise to invert`.
- **Oracle:** check out the skeleton state alone, render it, and run the type-check; every unit exists,
  the composition is visible, and nothing behaves.
- **Obligation:** the approved design must be materializable as a rendering, type-checking skeleton before
  any behavior is written.
- **Exercises:** Procedure P4, Procedure P5, Procedure P6.
- **Checklist IDs:** `REACT-CHECK-21`, `REACT-CHECK-22`.

### REACT-SCENARIO-12 — Three-axis review, traceability, and taught-example fidelity
- **Axis:** Bottom-up operation.
- **Primary category:** 10 Evidence / traceability / clarity — the defining discrimination is whether a
  cold reader can follow each claim to its source. **Secondary:** 1, 2, 9.
- **Situation:** Given a completed change-set handed off for review, which also adds a documented React
  example to a project document. When one reviewer reads it end to end.
- **Good handling:** the property axis, the language-idiom axis, and the React-idiom axis are graded
  separately and produce three verdicts; the activated binary items are answered with outcomes; every
  approved design item maps to an implemented unit and every affected-set file is updated or recorded as a
  justified no-op; the design packet itself carries every element the procedure names, so what was decided
  is as traceable as what was built; every taught example names the primary source that states what it
  shows.
- **Bad handling:** one pass conflates the three axes, so a change that is fluent React but shallow as
  software passes; the packet is silent on where an error boundary catches, so nothing records that the
  decision was ever made; an example reads plausibly and no source states it.
- **Alternative-valid:** a plain-JavaScript codebase — the language-idiom axis is omitted and exactly two
  axes remain, which is a complete review rather than a reduced one.
- **Change:** the affected set includes existing callers and tests, which move with the change rather than
  after it.
- **Adversarial probe:** a change-set satisfies every rule textually while the component does the wrong
  thing; the review must still fail it on the property axis. **Cosmetic form:** a checklist item is
  answered "reviewed" instead of with its outcome, and an example is labelled as coming from the
  documentation with no locatable statement behind it.
- **Minimums:** alternative-valid see above · change see above · adversarial see above · boundary `n/a: no
  exact limit or transition` · failure/recovery `n/a: no injected dependency failure` · counterfactual
  `n/a: covered by families 04, 07, and 10`.
- **Oracle:** run the three axes independently and compare what each finds; for every taught example,
  locate the sentence in the named source that states what the example shows.
- **Obligation:** review must produce one verdict per applicable axis, and every taught example must
  resolve to a statement in a named primary source.
- **Exercises:** H10, P7, Procedure P2, Procedure P8.
- **Checklist IDs:** `REACT-CHECK-23`, `REACT-CHECK-24`.

---
