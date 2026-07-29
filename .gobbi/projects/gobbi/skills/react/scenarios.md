# React — Implementation Scenario Library

Good, bad, boundary, failure, recovery, and adversarial React implementation cases. This parent is the
stable entrypoint for self-review and evaluation; it indexes three bounded direct child sets.

**Anchor convention.** An `Exercises:` line names `H{n}` for a `SKILL.md` Rule, a bare `P{n}` for a
Principle, and `Procedure P{n}` for a procedure step. `Checklist IDs:` only reserves or cites identifiers;
`checklists.md` owns check text.

## Set frame

- **Purpose:** prove that a React change-set satisfies the `SKILL.md` floor where a wrong change can still
  look right.
- **Target:** one React change-set—components, hooks, and the modules they touch.
- **Consumers:** evaluators entering through `evaluation.md` and executors self-checking at Procedure P8.
- **Lifecycle:** evaluation mode first; design mode before a family-governed decision.
- **Scope:** `SKILL.md` Rules H1–H18, Principles P1–P7, Procedure P1–P8, and the child-owned Error Boundary
  obligations derived from Procedure P3 and `design.md` §5.
- **Non-goals:** verification-check construction, React Native, UI/UX craft, or new React teaching.
- **Scale:** a direct set is bounded to 12 families and 50 cells. Every child is independently below both.

## Child sets

| Child | Purpose | Stable family identities | Families | Cells |
|---|---|---|---:|---:|
| [`scenarios-components.md`](scenarios-components.md) | Component, hook, state, Effect, compiler, accessibility, and Error Boundary behavior | 01–05, 07–09, 13 | 9 | 47 |
| [`scenarios-boundaries.md`](scenarios-boundaries.md) | Directional server/client values and browser/Electron presentation/producer hosts | 06, 10 | 2 | 30 |
| [`scenarios-operation.md`](scenarios-operation.md) | Skeleton-first construction, affected-set completion, review, and evidence | 11, 12 | 2 | 27 |

Each child owns a complete Scenario Rule 1 register with category identities 1 through 10 exactly once.
Each child also owns a category-by-case matrix whose nonempty cells mechanically derive the reported
total. A parent aggregate cannot substitute for any child result.

## Aggregate family identity register

| Stable ID | Literal family title | Child |
|---|---|---|
| `REACT-SCENARIO-01` | A side effect or mutation during render | components |
| `REACT-SCENARIO-02` | Hook call sites and hook naming | components |
| `REACT-SCENARIO-03` | List identity under reorder, insert, and delete | components |
| `REACT-SCENARIO-04` | An Effect standing in for derivation, an event, or a reset | components |
| `REACT-SCENARIO-05` | Effect cleanup and the stale-result race | components |
| `REACT-SCENARIO-06` | What crosses the server and client boundary, in the direction it crosses | boundaries |
| `REACT-SCENARIO-07` | The compiler baseline, the named escape hatch, and legacy memoization | components |
| `REACT-SCENARIO-08` | State placement, and server-owned data held as client state | components |
| `REACT-SCENARIO-09` | The rendered markup as a contract: semantics, ARIA, and focus | components |
| `REACT-SCENARIO-10` | Producer assumptions across browser and renderer presentation | boundaries |
| `REACT-SCENARIO-11` | Skeleton first, then verified slices | operation |
| `REACT-SCENARIO-12` | Three-axis review, traceability, and taught-example fidelity | operation |
| `REACT-SCENARIO-13` | Error Boundary fallback, recovery, and honest reach | components |

Existing identities are preserved. Family 13 is the next stable identity; no old family was renumbered.

## Source → scenario trace

| Source obligation | Families |
|---|---|
| H1–H6 render, hook, identity, Effect, and async invariants | 01–05 |
| H7 and H18 directional server/client value and Server Function boundary | 06 |
| H8/H14 compiler default and named memoization exception | 07 |
| H15 state-owner convention | 08 |
| H9 rendered semantics, ARIA, and focus | 09 |
| H16/H17 presentation/producer independence and finite Electron bridge | 10 |
| H10 and Procedure P2/P4–P8 structure, slices, review, and evidence | 11–12 |
| Procedure P3 act 6 and `design.md` §5 Error Boundary reach and granularity | 13 |
| Principles P1–P7 and Procedure P1–P8 | distributed across 01–13 as each child `Exercises:` line records |
| Accepted deterministic-ref exception and zero-I/O oracle | 01 |
| Accepted six-row runtime matrix and renderer security controls | 10 |
| Accepted ecosystem claim evidence boundary | 12's source/trace fidelity obligation; package facts remain in `ecosystem.md` |

Every source row reaches at least one family. The complete old semantic union is preserved in families
01–12; the Error Boundary source becomes family 13.

## Scenario → obligation trace

Every child family ends in an `Obligation:` field. Families 01–12 retain their published obligation text.
Family 13 yields `EB-1` through `EB-6`: descendant containment/fallback, recovery, useful granularity,
unsupported-class routing, the `startTransition` exception, and cosmetic-compliance rejection.

No family is an index-only label, and no obligation exists only in this parent.

## Coverage decisions

- Locale, language, and format remain outside the React skill. The components child selects category 8
  only for the source-owned access-need mechanics in family 09.
- Family 08's ecosystem-convention classification is preserved and must not be reported as a React-team position.
- Family 06 tests direction and the applicable value set; `server-client.md` remains the value-set owner.
- Family 10 tests architecture classes, not named package implementations.
- Error Boundary coverage is limited to the behavior owned by Procedure P3 and `design.md` §5. It does not
  turn general Suspense or loading behavior into a new React rule.
- Child-local `covered-elsewhere` dispositions carry complete Scenario Rule 7 ledgers. A resolving pointer
  alone is invalid.
