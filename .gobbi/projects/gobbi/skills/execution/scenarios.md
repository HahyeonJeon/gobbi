# Execution Scenarios

This source exercises [SKILL.md](SKILL.md). It adds no executor policy. Evaluators extend the filled frame for language, framework, and task-specific risks.

## Coverage register

| Category | Disposition | Seed |
|---|---|---|
| 1 Purpose / outcomes / scope | selected | EXEC-SC-01 |
| 2 Actors / stakeholders / use-context | selected | EXEC-SC-02 |
| 3 Behavior / state / data | selected | EXEC-SC-03 |
| 4 Interfaces / dependencies / structure | selected | EXEC-SC-04 |
| 5 Quality attributes / resource economics | selected | EXEC-SC-05 |
| 6 Failure / recovery / operations | selected | EXEC-SC-06 |
| 7 Trust / harm / governance | selected | EXEC-SC-07 |
| 8 Inclusion / locale | selected | EXEC-SC-08 |
| 9 Change / compatibility / reversibility | selected | EXEC-SC-09 |
| 10 Evidence / traceability / clarity | selected | EXEC-SC-10 |

Scale threshold: split above 12 families or 40 selected category-by-type cells.

## EXEC-SC-01 — The committed diff implements the whole task and only the task

- Primary category: 1. Primary type: Positive. Secondary: Adversarial.
- Coverage role: positive task outcome; adversarial scope hiding.
- Source: X-1, X-4, X-10, Procedure 1 and 8–10.
- Given: a locked task, final diff, verification, and commit.
- When: outputs, changed paths, traces, commit message, and exclusions are compared.
- Then: every promised output exists, every hunk maps to the task, and no adjacent cleanup rides along.
- Failure oracle: missing output, changed out-of-scope path, or misleading completion claim.
- Evidence: task-to-diff ledger and commit inspection.
- Adversarial face: green tests hide one unrelated edit outside the files allowlist.
- Obligation: the task result must be complete, exact in scope, and honestly reported.
- Checklist: EXEC-CK-01.

## EXEC-SC-02 — Callers, users, operators, and maintainers can use the change

- Primary category: 2. Primary type: Alternative-valid. Secondary: Failure/recovery.
- Coverage role: alternate consumer; operator failure path.
- Source: X-3, X-6, X-10, Procedure 2, 6–8.
- Given: primary and secondary consumers of changed surfaces.
- When: signatures, docs, examples, errors, logs, and operator paths are read cold.
- Then: each consumer can use or diagnose the behavior without reading private implementation context.
- Failure oracle: undocumented precondition, generic error, stale example, or missing operator context.
- Evidence: call-site and consumer documentation review.
- Adversarial face: a sentinel value known only to the implementer is required for success.
- Obligation: consumer-facing behavior and failures must be self-explanatory.
- Checklist: EXEC-CK-02.

## EXEC-SC-03 — State and data invariants hold at exact boundaries

- Primary category: 3. Primary type: Boundary. Secondary: Negative.
- Coverage role: positive transition; exact edge; invalid-state rejection.
- Source: X-5–X-8, Procedure 3, 5–7.
- Given: changed state, input, data, or lifecycle behavior.
- When: empty, one, many, below, at, above, first, last, and invalid transitions are executed.
- Then: invariants hold and invalid input creates no prohibited side effect.
- Failure oracle: off-by-one, partial state, retained deleted data, or order-dependent result.
- Evidence: targeted tests and state/data inspection.
- Adversarial face: a fixture passes while a realistic-scale or second transition violates the invariant.
- Obligation: final behavior must preserve state and data at every applicable edge.
- Checklist: EXEC-CK-03.

## EXEC-SC-04 — Structure and dependencies remain owned, acyclic, and synchronized

- Primary category: 4. Primary type: Positive. Secondary: Adversarial.
- Coverage role: positive interface; adversarial hidden cycle.
- Source: X-3, X-5, X-6, Procedure 2, 5–8.
- Given: changed modules, imports, types, schemas, validators, manifests, or exports.
- When: ownership, dependencies, callers, and synchronized surfaces are traced.
- Then: the project pattern is followed, no cycle or orphan export appears, and coupled artifacts agree.
- Failure oracle: new reverse edge, one-caller abstraction, undeclared dependency, or schema/validator drift.
- Evidence: dependency search, type check, manifests, and caller trace.
- Adversarial face: a “common helper” extraction creates a hidden import cycle.
- Obligation: structure must remain conventional, acyclic, and contract-complete.
- Checklist: EXEC-CK-04.

## EXEC-SC-05 — Performance, resources, and cost remain within verified bounds

- Primary category: 5. Primary type: Boundary. Secondary: Failure/recovery.
- Coverage role: positive measured budget; exact limit; slow dependency.
- Source: X-7, X-8, Procedure 6–7.
- Given: a hot path, variable input, external call, cache, retry, or paid resource.
- When: normal and limit load plus slow and failed dependency are measured on the final tree.
- Then: latency, call count, memory, storage, retry, rate, and cost stay within the task contract.
- Failure oracle: N+1 call, unbounded retry, unmeasured claim, or high-cardinality logging.
- Evidence: benchmark, call-count, resource, and cost results.
- Adversarial face: one acceptable benchmark run hides a repeatable slowdown across multiple runs.
- Obligation: resource-sensitive changes must have final-tree measurements and bounds.
- Checklist: EXEC-CK-05.

## EXEC-SC-06 — Failures are detected, contained, recoverable, and actionable

- Primary category: 6. Primary type: Failure/recovery. Secondary: Boundary.
- Coverage role: positive recovery; injected partial failure; timeout edge.
- Source: X-7, X-8, X-10, Procedure 6–7.
- Given: timeout, interruption, dependency error, partial mutation, or verification failure.
- When: failure is injected before, during, and after the mutation boundary.
- Then: state remains coherent, recovery or rollback is explicit, and errors guide the next action.
- Failure oracle: swallowed error, false success, destructive retry, or undiagnosable log.
- Evidence: failure-path tests and rollback evidence.
- Adversarial face: a rare error path emits sensitive debug output and retries forever.
- Obligation: every changed failure path must stop safely and support recovery.
- Checklist: EXEC-CK-06.

## EXEC-SC-07 — Trust boundaries and destructive actions remain safe

- Primary category: 7. Primary type: Adversarial. Secondary: Negative.
- Coverage role: positive authorized path; adversarial input; unauthorized rejection.
- Source: X-2, X-7, X-9, Procedure 1, 6, 9.
- Given: untrusted input, privileged sink, sensitive data, shell construction, dependency, or destructive action.
- When: authorization order, validation, retention, secrets, license, and safety flags are inspected.
- Then: validation precedes sinks, privilege is checked, data is bounded, and no unauthorized side effect occurs.
- Failure oracle: injection path, leaked secret, bypass flag, undeclared one-way action, or incompatible dependency.
- Evidence: trust/data flow, targeted tests, dependency metadata, and command review.
- Adversarial face: a refactor moves parsing or command construction before authorization.
- Obligation: the diff must not widen harm or authority without explicit controlled design.
- Checklist: EXEC-CK-07.

## EXEC-SC-08 — Accessibility and locale behavior work outside the default path

- Primary category: 8. Primary type: Alternative-valid. Secondary: Boundary.
- Coverage role: alternative input method/locale; formatting edge.
- Source: X-6, X-8, Procedure 6–8.
- Given: user interface, text, sorting, dates, numbers, formats, or operator docs.
- When: keyboard, assistive use, contrast, non-default locale, and alternate format are exercised.
- Then: accepted obligations pass or direct evidence proves the surface inapplicable.
- Failure oracle: pointer-only flow, inaccessible state, hard-coded string, or locale-dependent incorrect behavior.
- Evidence: applicable accessibility and locale checks.
- Adversarial face: behavior passes in the developer locale but orders or parses differently elsewhere.
- Obligation: applicable access and locale behavior must be directly verified.
- Checklist: EXEC-CK-08.

## EXEC-SC-09 — Existing consumers survive change or receive a verified migration

- Primary category: 9. Primary type: Change/regression/compat. Secondary: Failure/recovery.
- Coverage role: compatible path; migration; rollback.
- Source: X-3, X-6–X-9, Procedure 2, 6–9.
- Given: changed API, file, schema, data, dependency, behavior, or runtime path.
- When: old callers, mixed states, migration, rollback, and stale references are tested.
- Then: compatible consumers still work or the deliberate break and migration are complete and reversible.
- Failure oracle: stale caller, missing migration, old path in a skill, or one-way change without gate.
- Evidence: repository-wide search, compatibility tests, and migration/revert proof.
- Adversarial face: an overload hides a stale caller still using removed semantics.
- Obligation: compatibility and reversibility must be complete across all consumers.
- Checklist: EXEC-CK-09.

## EXEC-SC-10 — Verification is fresh, self-failing, and bound to the commit

- Primary category: 10. Primary type: Positive. Secondary: Counterfactual, adversarial.
- Coverage role: positive proof; assumption inversion; check gaming.
- Source: X-1, X-8–X-10, Procedure 3, 7–10.
- Given: task verifies commands, final tree, report, and commit.
- When: exact commands rerun and a cosmetic wrong result is introduced conceptually or in a safe fixture.
- Then: checks fail the wrong result, pass the final tree, and evidence matches the committed bytes.
- Failure oracle: substituted command, stale run, weakened threshold, skipped test, or dirty post-check tree.
- Evidence: command output, commit digest, diff, and status.
- Adversarial face: the task edits its own assertion so the suite stays green without the required behavior.
- Obligation: completion must rest on fresh discriminating evidence for the committed tree.
- Checklist: EXEC-CK-10.

## Omission sweep

Every X-rule maps to at least one seed and check. Domain-specific cases extend the filled frame; they do not modify this source.
