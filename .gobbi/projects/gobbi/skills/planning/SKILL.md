---
name: planning
description: MUST load for Planning. Proves Ideation readiness and decomposes the locked design into ordered, agent-ready Who, When, and Where tasks.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Planning

Use this skill when Planning starts or repeats. The leader proves that locked Ideation evidence is ready, then turns it into one complete ordered task plan. A fresh executor must be able to run each task from its bounded brief.

This skill owns readiness and the Who, When, and Where decomposition. It does not repair Ideation or implement the plan. Workflow owns the shared loop, dual-system WORK, review routing, record routing, and state transitions.

## Principles

### Plan only against locked intent

Planning decomposes the approved What, Why, and How. If the design is missing, contradictory, or materially wrong, the correct action is to return to Ideation, not to invent a repair inside the plan.

### Every task is a closed contract

A task names what it changes, what it reads, what it produces, what must already exist, and how a fresh executor proves success. Hidden context is a planning defect.

### Dependencies describe causality

Order follows predecessor-to-consumer needs, user decisions, and shared write surfaces. A numbered list without explicit dependency edges is not an executable plan.

### Verification must be able to fail

Each task has fresh, runnable, task-local evidence. A plausible command, a generic “run tests,” or a check that the task can weaken does not prove the obligation.

## Rules

### Must follow

- **P-1 — Run the readiness gate first.** Inventory all required Ideation outputs, decisions, evaluation dispositions, staging obligations, authority, skills, repository state, and external-write needs before decomposition.
- **P-2 — Route upstream gaps upstream.** A material Ideation omission returns to Ideation or aborts. Planning does not reframe the problem or choose a new design.
- **P-3 — Trace both directions.** Every task points to one or more Ideation obligations, and every in-scope obligation maps to at least one task or an explicit user-approved deferral.
- **P-4 — Use one task contract.** Each task has stable ID, imperative title, objective, traces-to, requires, files, inputs, outputs, verifies, required skills, role, authority, in/out scope, failure routes, and commit boundary.
- **P-5 — Keep tasks narrow.** Split independent concerns, high-blast changes, public interfaces, migrations, dependencies, shared infrastructure, and user decision points at reviewable boundaries.
- **P-6 — Make the graph explicit.** Requires edges form an acyclic graph whose topological order matches the listed order. Every handoff uses literal matching output and input names.
- **P-7 — Protect one writer chain.** Read-only analysis may be parallel. Tasks that overlap files, shared state, external services, decision order, manifests, or locks must be ordered.
- **P-8 — Match role and skills to the work.** Resolve every required skill at its canonical path. A missing project skill becomes an earlier foundation task; a missing shared capability returns NEEDS_CONTEXT.
- **P-9 — Make every intermediate state coherent.** After any completed task, the tree is valid, verified, and locally committed. Rollback or reversal is concrete for risky tasks.
- **P-10 — Preserve source-before-delete.** A move, split, merge, or deletion task reads the full source set, maps its semantic union, inventories inbound consumers, and proves the destination before removing the source.
- **P-11 — Recheck the complete plan.** Names, types, paths, dependencies, outputs, verification, role assignments, and scope traces agree across every task.

### Must not follow

- Do not skip Planning, even when implementation seems small.
- Do not repair a material Ideation gap in the readiness report.
- Do not add “while we are here” cleanup.
- Do not hide a dependency in prose or task order.
- Do not assign implementation discovery that changes scope to an executor.
- Do not use a test, link check, or file-existence proxy for a semantic obligation it cannot prove.

## Procedure

### 1. Load the planning inputs

Read the canonical Ideation artifact, complete creation and evaluation evidence, approved finding dispositions, project rules and mistakes, repository state, candidate skills, and external-write authority. On a repeated iteration, identify the changed inputs and invalidated plan claims.

Evidence: an exact input register and current Ideation artifact digest.

### 2. Run the readiness gate

Inventory every required Ideation output and its usability, not only file existence. Confirm the scope contract, design decisions, assumptions, scenario obligations, checks, success criteria, deferred items, and dispositions are complete and consistent. Confirm required memory, skills, worktree access, and actual-writer authority are available.

Return one of three results:

- READY: every required input is usable;
- NEEDS_CONTEXT: a bounded Planning input or authority is missing; or
- RETURN_TO_IDEATION: a material upstream decision or artifact is missing, vague, or contradictory.

Preserve each attempt as evidence. Do not overwrite the reason for an upstream return.

### 3. Build the obligation ledger

Give each accepted Ideation obligation a stable trace key. Include success criteria, compatibility promises, failure and recovery behavior, performance budgets, security and data boundaries, accessibility, locale, operational signals, cost limits, and documentation obligations when applicable.

Mark explicit user-approved deferrals with their durable destination. No obligation may silently disappear.

Evidence: a bidirectional Ideation-to-plan coverage ledger.

### 4. Lay out task boundaries

Group work by one observable outcome and one coherent writer boundary. Start with foundation and shared-interface tasks. Isolate migrations, public surfaces, dependency changes, shared infrastructure, and destructive or irreversible operations. Keep documentation synchronized with the behavior it describes.

Prefer tasks a fresh executor can understand in one read. Size is evidence-driven; a broad file set or multi-part verification is a signal to split, not a rigid numeric rule.

Evidence: a complete task skeleton with no prose-only mega-task.

### 5. Write each task contract

For every task, write:

- stable number, slug, imperative title, objective, and reason;
- exact Ideation traces and prerequisite task IDs;
- exact in-scope and out-of-scope paths and behavior;
- immutable inputs and expected outputs, using literal handoff names;
- required role, skills, rules, mistakes, and authority;
- ordered implementation constraints and user decision points;
- runnable verification commands plus semantic evidence;
- failure, rollback, and escalation routes; and
- a focused local commit boundary.

The task may leave routine in-scope implementation judgment to the executor. It may not leave scope, architecture, user authority, or destructive-action decisions open.

### 6. Build and validate the dependency graph

Create requires edges from real causality: produced files, interfaces, schemas, decisions, shared resources, and writer order. Prove the graph is acyclic. Topologically sort it and compare the result with the listed plan order.

Compare file and non-file resource sets for every candidate parallel pair. Permit parallelism only for read-only work that cannot change the worktree, session record, external state, scope, or user decisions.

Evidence: an acyclic graph and one ordered writer chain.

### 7. Resolve role, skill, and authority readiness

Check every required skill at its canonical path after the concrete tasks exist. If a project-specific skill is missing, add a foundation task that authors, wires, verifies, and commits it before dependent work. If a shared or runtime capability is missing, return NEEDS_CONTEXT rather than inventing a substitute.

For each external write, name the actual writer, exact surface, authority source, reversal, and go/no-go decision. Evidence from a proxy sandbox does not establish the actual writer's authority.

### 8. Make verification self-failing

For every task, identify what a cosmetically compliant but wrong result would look like. Ensure at least one check fails that result. Use direct inspection, targeted tests, schemas, type checks, link or vocabulary guards, runtime probes, and Git evidence only for properties they actually prove.

Verification runs on the final tree and cannot depend on weakening the check in the same task unless that change is explicitly part of the locked design and independently tested.

### 9. Run the plan consistency review

Check the full plan for duplicate IDs, placeholders, mixed field names, dangling traces, mismatched inputs and outputs, forward dependencies, file overlap, hidden shared resources, missing documentation, unbounded cost, privacy or security gaps, and invalid intermediate states.

Run [scenarios.md](scenarios.md) and a fresh copy of [checklists.md](checklists.md). If a check exposes missing parent policy, fix this skill's plan method or the plan, not only the companion.

### 10. Prepare the neutral WORK contract and synthesize

Freeze the readiness evidence, obligation ledger, task skeleton, graph, scope, authority, and acceptance criteria as identical inputs to the workflow-owned dual-system WORK procedure. The specialist output is one complete ordered plan, not implementation.

Synthesize both drafts and both cross-reviews without silently dropping a task, obligation, or disagreement. Route material task boundaries, ordering, authority, or verification disputes to the user and resolve them before EVALUATION.

### 11. Prove Execution readiness

Read each task in isolation as a fresh executor. Confirm it can start from named inputs, produce named outputs, run its checks, stop safely on failure, and commit without needing hidden context. Confirm cumulative task scope matches the Ideation contract.

Run the shared package validator. Hand the canonical plan and complete creation evidence to the manager. After PASS RECORD, the manager uses the record owner to scaffold every task and authorized iteration.

Completion evidence: READY input status, full trace closure, an acyclic ordered graph, isolated task contracts, runnable verification, and a canonical plan a fresh executor can follow.

## References

- [Workflow Planning adapter](../workflow/steps/planning.md) owns manager entry, user gates, task scaffolding, and transitions.
- [Dual-system WORK](../workflow/steps/dual-system-work.md) owns shared creation mechanics and package validation.
- [State machine](../workflow/steps/state-machine.md) owns return-to-Ideation, verdict, and cap transitions.
- [Delegation](../workflow/delegation.md) owns the specialist brief and status contract.
- [Evaluation](../evaluation/SKILL.md) owns fresh reports, findings, checklist completion, and verdict rules.
- [Record](../record/SKILL.md) owns task scaffolding, typed staging, and PASS-only artifacts.
- [Scenario](../scenario/SKILL.md) and [Checklist](../checklist/SKILL.md) own the companion construction standards.
