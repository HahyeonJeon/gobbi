# Startup Checklists

This source checklist operationalizes [`SKILL.md`](SKILL.md) and
[`scenarios.md`](scenarios.md). Copy only applicable items into an ordinary workflow checklist; do not
write completion marks into this source file. `N/A` requires a reason and evidence.

## Classifier gate

- [ ] **ST-CHK-CLS-01** `[gate/killer, read-do]` The classifier cites substantive project-reference and
  repository evidence rather than treating directory presence as validity.
  - **Scenarios:** ST-SCN-01-A, ST-SCN-01-B.
  - **Evidence:** classifier report, inspected-path inventory, and zero-change diff.
- [ ] **ST-CHK-CLS-02** `[required, read-do]` The result is exactly `sufficient`, `sparse`, `absent`, or
  `contradictory`, with every failed baseline-quality test named.
  - **Scenarios:** ST-SCN-01-A through ST-SCN-01-C.
  - **Evidence:** classifier result and test-by-test rationale.
- [ ] **ST-CHK-CLS-03** `[gate/killer, read-do]` Classification performs no scaffold, repair,
  supersession, archive, staging, session, or memory write.
  - **Scenarios:** ST-SCN-01-C.
  - **Evidence:** pre/post path and digest comparison.

## Trigger and authority gate

- [ ] **ST-CHK-AUTH-01** `[gate/killer, read-do]` Startup ran only for a fresh/sparse baseline or an
  explicit reset, never merely because a runtime context resumed.
  - **Scenarios:** ST-SCN-02-C.
  - **Evidence:** trigger, current cursor, and invocation trace.
- [ ] **ST-CHK-AUTH-02** `[gate/killer, read-do]` An insufficient classifier went through Discussion and
  the user's accept or decline disposition is explicit.
  - **Scenarios:** ST-SCN-02-A, ST-SCN-02-B.
  - **Evidence:** classifier and user decision.
- [ ] **ST-CHK-AUTH-03** `[gate/killer, read-do]` Accepted guided questioning ran inside ordinary
  Ideation DISCUSSION with no Startup cursor, mode, session, or completion predicate.
  - **Scenarios:** ST-SCN-02-A, ST-SCN-07-C.
  - **Evidence:** before/after v3 state and path inventory.

## Evidence and interview gate

- [ ] **ST-CHK-EVD-01** `[gate/killer, read-do]` Every load-bearing problem claim traces to a concrete
  event, behavior, commitment, or verified fact, or remains explicitly open.
  - **Scenarios:** ST-SCN-03-A, ST-SCN-06-B.
  - **Evidence:** packet evidence entries and source references.
- [ ] **ST-CHK-EVD-02** `[required, read-do]` Questions use one neutral decision axis, show verified facts
  first, and stop after two failed clarification probes.
  - **Scenarios:** ST-SCN-03-B.
  - **Evidence:** question/answer trace retained only in current runtime context.
- [ ] **ST-CHK-EVD-03** `[required, read-do]` Smart-skipped branches have sufficient cited evidence and
  user confirmation; no branch was skipped for cost or convenience.
  - **Scenarios:** ST-SCN-03-C.
  - **Evidence:** coverage frame and cited fact.
- [ ] **ST-CHK-EVD-04** `[required, read-do]` Facts, user reports, assumptions, contradictions, decisions,
  and open questions remain distinguishable.
  - **Scenarios:** ST-SCN-03-A, ST-SCN-07-A.
  - **Evidence:** returned packet fields.

## Problem and direction gate

- [ ] **ST-CHK-DIR-01** `[gate/killer, read-do]` The full problem-before-solution premise set was shown
  for agreement or correction before Topic 5.
  - **Scenarios:** ST-SCN-04-A, ST-SCN-04-B.
  - **Evidence:** premise summary and user disposition.
- [ ] **ST-CHK-DIR-02** `[required, read-do]` Every design-bearing branch uses applicable internal and
  external research across the three evidence layers.
  - **Scenarios:** ST-SCN-05-A.
  - **Evidence:** Study reports and source/applicability ledger.
- [ ] **ST-CHK-DIR-03** `[required, read-do]` Distinct minimal and ideal directions receive equal detail,
  with effort, risk, reuse, feasibility, recommendation, and evidence-to-change.
  - **Scenarios:** ST-SCN-05-A.
  - **Evidence:** option card and user decision.
- [ ] **ST-CHK-DIR-04** `[gate/killer, read-do]` The packet stays at macro direction and contains no
  signatures, schemas, algorithms, module internals, migrations, or task breakdown.
  - **Scenarios:** ST-SCN-05-B.
  - **Evidence:** packet content sweep.

## Coverage and handoff gate

- [ ] **ST-CHK-HO-01** `[gate/killer, read-do]` All eleven topic groups and every required branch have a
  confirmed, proven-irrelevant-with-reason, or open-with-owner disposition.
  - **Scenarios:** ST-SCN-06-A, ST-SCN-06-B.
  - **Evidence:** coverage frame in the returned packet.
- [ ] **ST-CHK-HO-02** `[gate/killer, read-do]` Mechanical coverage never converts an open load-bearing
  assumption into a readiness or acceptance claim.
  - **Scenarios:** ST-SCN-06-B.
  - **Evidence:** readiness statement and risk/open-question fields.
- [ ] **ST-CHK-HO-03** `[required, read-do]` The packet includes verified facts, evidence, first user/job,
  scope/non-goals, directions and alternatives, viability, authority, contradictions, risks, and owners.
  - **Scenarios:** ST-SCN-07-A.
  - **Evidence:** returned packet.
- [ ] **ST-CHK-HO-04** `[gate/killer, read-do]` Startup returns the packet to the manager and writes no
  session artifact, staging candidate, durable record, or private resume state.
  - **Scenarios:** ST-SCN-07-A, ST-SCN-07-C.
  - **Evidence:** assignment report, exact changed-path inventory, and ordinary cursor.
- [ ] **ST-CHK-HO-05** `[gate/killer, read-do]` Credentials and user-marked sensitive values are absent.
  - **Scenarios:** ST-SCN-07-B.
  - **Evidence:** manual sensitive-data review and scoped secret scan.

## Evaluation seam gate

- [ ] **ST-CHK-EVAL-01** `[gate/killer, read-do]` Startup-specific lenses extend both ordinary fresh
  evaluator reports; no separate Startup verdict, report set, or iteration exists.
  - **Scenarios:** ST-SCN-08-A.
  - **Evidence:** both ordinary evaluation reports and artifact-path inventory.
- [ ] **ST-CHK-EVAL-02** `[gate/killer, read-do]` Findings wait for user-approved batch dispositions, and
  material revision follows the ordinary full-iteration rule.
  - **Scenarios:** ST-SCN-08-B.
  - **Evidence:** disposition decision and v3 transition history.

## Two-gate acceptance

Gate 1 is **coverage**: every applicable item has `PASS`, `FAIL`, or evidence-backed `N/A`, and no
required branch is unaccounted for. Gate 2 is **acceptance**: every applicable gate/killer item passes
and no open load-bearing evidence gap is disguised as closure. Passing this checklist never replaces the
ordinary dual-system evaluation verdict.
