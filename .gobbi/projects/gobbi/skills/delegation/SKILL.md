---
name: delegation
description: "Use when delegating bounded work to another agent — define the objective, preparation, boundaries, autonomy, evidence, and independent-judgment conditions."
allowed-tools: Read, Grep, Glob, Bash
---

# Delegation

Delegation turns a bounded outcome into a brief that another agent can execute and report against. Use it when transferring responsibility while retaining clear scope and evidence.

Apply it before dispatch and again when deciding whether to accept or redirect the result.

## Principles

> **A delegation brief is self-contained for its receiver.**

**WHY:** A receiver cannot act reliably when the objective, context, or limits exist only in the sender's private context.

> **Preparation is explicit and checkable before work begins.**

**WHY:** Named inputs and readiness checks prevent work from starting on missing, stale, or assumed context.

> **Delegation defines a contract, not a vague request.**

**WHY:** An objective, boundary, evidence bar, and escape path make completion and non-completion observable.

> **Good direction steers without smothering.**

**WHY:** Necessary constraints protect the outcome, while unnecessary method control blocks the receiver from using better judgment.

> **Independent judgment is protected when independence matters.**

**WHY:** A receiver cannot provide an independent assessment after being primed with the sender's preferred conclusion or another agent's answer.

## Rules

### Must-Follow

- **MUST make the brief self-contained** by stating the objective, relevant context, inputs, boundaries, and expected result; this lets the receiver act without reconstructing the sender's private context.
- **MUST make preparation checkable** by naming what must be read or inspected and how readiness is confirmed; this exposes missing or stale inputs before work begins.
- **MUST define a complete delegation contract** with completion evidence and explicit escape paths; this makes success, missing context, and blocking conditions distinguishable.
- **MUST constrain only what protects the outcome** and leave method choices open unless a method is itself part of the contract; this preserves useful receiver autonomy.
- **MUST isolate independent work from conclusions that would bias it** and state the independence condition in the brief; this keeps the resulting judgment genuinely separate.

### Must-Not-Follow

- **NEVER rely on private or implied context** that the receiver cannot inspect, because hidden dependencies make the brief non-executable. **Fix:** state the missing fact or provide an inspectable input.
- **NEVER describe preparation as a vague instruction** such as “review what is relevant,” because readiness cannot be checked. **Fix:** name the required material and the observable completion check.
- **NEVER omit boundaries, evidence, or escape paths** from the contract, because the receiver cannot distinguish completion from partial progress. **Fix:** add each missing contract field before dispatch.
- **NEVER prescribe incidental implementation choices** merely because the sender has a preference, because this suppresses better receiver judgment. **Fix:** retain only outcome-protecting constraints and mark true invariants explicitly.
- **NEVER expose an independent receiver to a preferred conclusion or prior answer** before its work, because priming defeats independence. **Fix:** provide only the target, criteria, and neutral evidence needed for the independent task.

## Procedure

### 1. Decide the receiver and available context

Identify who will receive the work, what that receiver already retains, and what context must be supplied. Treat unknown retained context as absent.

### 2. Define the objective

State one observable end state. Add the reason the work matters and exclude adjacent outcomes that are not part of the delegation.

### 3. Make preparation explicit and checkable

List each required input or inspection in the order needed. Attach a concrete readiness check to every prerequisite so the receiver can prove preparation before acting.

### 4. Set boundaries and autonomy

State allowed and forbidden write surfaces, decision boundaries, fixed invariants, and the choices the receiver may make without returning to the sender. Remove method constraints that do not protect the outcome.

### 5. Define completion evidence and escape paths

Specify the artifacts, checks, and report fields that prove completion. Define distinct escape paths for missing context, a genuine blocker, and completed work that carries concerns; each path must state the evidence to return.

### 6. Inspect the rendered brief

Read the final brief as the receiver will see it. Confirm that all placeholders are resolved, required inputs are reachable, constraints do not conflict, independence conditions are preserved, and the requested evidence can be produced.

### 7. Accept or redirect from evidence

Compare the returned evidence with the objective and contract. Accept only when the evidence proves the end state; otherwise redirect with the exact failed condition, missing evidence, or authorized decision needed next.

## References

This capability owns its guidance and borrows no external facts.
