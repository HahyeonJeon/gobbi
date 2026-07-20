# Planning Scenarios

This source exercises [SKILL.md](SKILL.md). It adds no Planning policy. Use target-specific cases when the locked Ideation artifact or repository introduces a material property not covered here.

## Coverage register

| Category | Disposition | Seed |
|---|---|---|
| 1 Purpose / outcomes / scope | selected | PLAN-SC-01 |
| 2 Actors / stakeholders / use-context | selected | PLAN-SC-02 |
| 3 Behavior / state / data | selected | PLAN-SC-03 |
| 4 Interfaces / dependencies / structure | selected | PLAN-SC-04 |
| 5 Quality attributes / resource economics | selected | PLAN-SC-05 |
| 6 Failure / recovery / operations | selected | PLAN-SC-06 |
| 7 Trust / harm / governance | selected | PLAN-SC-07 |
| 8 Inclusion / locale | selected | PLAN-SC-08 |
| 9 Change / compatibility / reversibility | selected | PLAN-SC-09 |
| 10 Evidence / traceability / clarity | selected | PLAN-SC-10 |

Scale threshold: split above 12 families or 40 selected category-by-type cells.

## PLAN-SC-01 — The plan covers the whole locked idea and only that idea

- Primary category: 1. Primary type: Positive. Secondary: Adversarial, counterfactual.
- Coverage role: positive obligation closure; adversarial scope insertion; counterfactual return upstream.
- Source: P-1, P-2, P-3, Procedure 2–3.
- Given: a canonical Ideation artifact and candidate tasks.
- When: every task trace and every Ideation obligation are compared both ways.
- Then: all in-scope obligations map to tasks, deferrals have user authority, and no task adds an outcome.
- Failure oracle: a dropped obligation, paraphrased scope, or “while here” task remains.
- Evidence: bidirectional coverage ledger and scope diff.
- Adversarial face: insert an attractive adjacent cleanup with no Ideation trace; it must be rejected.
- Obligation: the plan must implement the accepted design completely and exclusively.
- Checklist: PLAN-CK-01.

## PLAN-SC-02 — Every task names the actor and authority needed to execute it

- Primary category: 2. Primary type: Alternative-valid. Secondary: Negative.
- Coverage role: positive role fit; alternate actual writer; invalid-authority rejection.
- Source: P-4, P-8, Procedure 5 and 7.
- Given: leader, executor, assistant, manager, user, and any external actual writer.
- When: role, tool, context, user decisions, and external authority are checked per task.
- Then: the assigned role can perform the work and every reserved decision has the correct owner.
- Failure oracle: a task needs tools, context, or authority its assignee lacks.
- Evidence: task role/authority fields and actual-writer proof.
- Adversarial face: use a proxy sandbox's failed access as proof the actual writer lacks authority.
- Obligation: each task must identify a capable actor and exact authority boundary.
- Checklist: PLAN-CK-02.

## PLAN-SC-03 — Task state transitions and handoffs are explicit

- Primary category: 3. Primary type: Boundary. Secondary: Negative.
- Coverage role: positive task state; exact first/last boundary; invalid missing-input state.
- Source: P-4, P-6, P-9, Procedure 5–6.
- Given: ordered tasks that create, change, and consume files or data.
- When: the state before and after every task and the literal inputs/outputs are compared.
- Then: each task begins from a named valid state and ends in a coherent committed state.
- Failure oracle: a task consumes an unnamed output, assumes a later state, or leaves a broken intermediate tree.
- Evidence: handoff ledger and stop-after-each-task check.
- Adversarial face: rename an output between predecessor and consumer without changing prose meaning.
- Obligation: every task transition and handoff must be explicit and coherent.
- Checklist: PLAN-CK-03.

## PLAN-SC-04 — The dependency graph and writer order match real coupling

- Primary category: 4. Primary type: Positive. Secondary: Adversarial.
- Coverage role: positive acyclic order; adversarial hidden resource conflict.
- Source: P-5–P-7, Procedure 4 and 6.
- Given: task file sets, interfaces, decisions, locks, external services, and shared state.
- When: requires edges and candidate parallel pairs are checked against every dependency.
- Then: the graph is acyclic, its topological order matches the plan, and only read-only independent work is parallel.
- Failure oracle: implicit ordering, overlapping writers, or a shared non-file resource lacks sequencing.
- Evidence: dependency graph, topological sort, and resource-overlap matrix.
- Adversarial face: two file-disjoint tasks contend on one dependency manifest or service quota.
- Obligation: the plan must expose causal order and one writer chain.
- Checklist: PLAN-CK-04.

## PLAN-SC-05 — Performance and cost commitments become measured tasks

- Primary category: 5. Primary type: Boundary. Secondary: Failure/recovery.
- Coverage role: positive budget preservation; exact limit; slow external call.
- Source: P-3, P-4, P-11, Procedure 3, 5, 8.
- Given: Ideation performance, capacity, call-count, or cost obligations.
- When: tasks and verifies fields are inspected at normal and limit load.
- Then: sensitive work is isolated and the exact measurement or budget check is runnable.
- Failure oracle: a budget has no task, a paid check multiplies across tasks, or “measure later” remains.
- Evidence: obligation-to-task trace and verification command.
- Adversarial face: every task runs a paid full evaluation without a plan-total ceiling.
- Obligation: resource commitments must survive decomposition as bounded measured work.
- Checklist: PLAN-CK-05.

## PLAN-SC-06 — Failures stop safely and preserve a recoverable intermediate state

- Primary category: 6. Primary type: Failure/recovery. Secondary: Boundary.
- Coverage role: positive recovery; injected task failure; interruption boundary.
- Source: P-4, P-9, Procedure 5 and 8.
- Given: a task fails verification, is interrupted, or encounters a missing prerequisite.
- When: failure and pause are injected before and after each commit boundary.
- Then: the task stops with exact evidence, unrelated completed work remains valid, and rollback is runnable.
- Failure oracle: recovery requires unwinding unrelated work or an interrupted state is incoherent.
- Evidence: failure route, rollback command, and stop-after-task snapshots.
- Adversarial face: shared-infrastructure failure poisons later tasks that were allowed to begin.
- Obligation: every task must have safe failure, rollback, and interruption behavior.
- Checklist: PLAN-CK-06.

## PLAN-SC-07 — Harmful and external actions have real authority gates

- Primary category: 7. Primary type: Adversarial. Secondary: Negative.
- Coverage role: positive authorized action; abuse rejection; missing-authority rejection.
- Source: P-4, P-5, P-8, Procedure 5 and 7.
- Given: destructive work, external writes, sensitive data, privileged paths, dependencies, or publication.
- When: actual writer, access, reversal, licensing, data handling, and user authority are checked.
- Then: each harmful or external action is isolated, authorized, bounded, and reversible where possible.
- Failure oracle: a task can write outside scope, expose data, or publish without a named gate.
- Evidence: authority record, data/trust trace, dependency source, rollback.
- Adversarial face: an executor brief includes a broad destructive command hidden under routine verification.
- Obligation: high-harm actions must be isolated behind explicit evidence and authority.
- Checklist: PLAN-CK-07.

## PLAN-SC-08 — Inclusion and locale obligations reach executable tasks

- Primary category: 8. Primary type: Alternative-valid. Secondary: Boundary.
- Coverage role: alternate input/locale; exact formatting boundary.
- Source: P-3, P-4, Procedure 3, 5, 8.
- Given: accepted accessibility, locale, format, or user-facing obligations.
- When: tasks, files, outputs, and checks are traced from those obligations.
- Then: each applicable obligation has a concrete implementation and verification task.
- Failure oracle: the plan treats the need as polish or relies on executor discovery.
- Evidence: obligation/task/check trace.
- Adversarial face: a user-facing string task omits locale behavior because code changes are otherwise complete.
- Obligation: inclusion and locale requirements must be planned as acceptance-bearing work.
- Checklist: PLAN-CK-08.

## PLAN-SC-09 — Compatibility changes are isolated, ordered, and reversible

- Primary category: 9. Primary type: Change/regression/compat. Secondary: Failure/recovery.
- Coverage role: compatible path; migration; failed rollback.
- Source: P-5, P-9, P-10, Procedure 4–6.
- Given: existing APIs, data, files, behavior, dependencies, or mixed versions.
- When: migration, consumer updates, rollback, and intermediate compatibility are mapped.
- Then: high-blast change and consumer work are explicit tasks with go/no-go and recovery.
- Failure oracle: a public change is bundled, consumers are absent, or rollback depends on a later task.
- Evidence: compatibility graph and task order.
- Adversarial face: a source is deleted before its semantic union and inbound references are proven at the destination.
- Obligation: compatibility work must be source-preserving, consumer-complete, and reversible.
- Checklist: PLAN-CK-09.

## PLAN-SC-10 — A fresh executor can run every task and prove it

- Primary category: 10. Primary type: Positive. Secondary: Counterfactual, adversarial.
- Coverage role: positive clarity; unsupported-premise inversion; cosmetic-check gaming.
- Source: P-4, P-8, P-10, P-11, Procedure 5, 8–11.
- Given: one task with no parent-session context.
- When: a cold executor resolves all reads, paths, outputs, commands, failures, and authority.
- Then: execution can begin and completion can be decided from the task alone.
- Failure oracle: placeholder command, dangling trace, missing skill, vague output, or proxy-only check.
- Evidence: cold-task run, link/path resolution, and cosmetic-compliance probe.
- Adversarial face: a present file passes verification although its semantic content is wrong.
- Obligation: every task must be self-contained, traceable, and self-failing.
- Checklist: PLAN-CK-10.

## Omission sweep

Every P-rule maps to a seed and check. Every seed produces one Planning obligation. Add filled-frame cases for target-specific requirements; do not mutate this source during evaluation.
