---
name: delegation
description: "MUST load when shaping or assessing bounded work for another agent. Delegation is a preference skill for balancing context, authority, autonomy, independence, and evidence."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# Delegation

Use this skill when deciding how to hand bounded work to another agent or how to judge the result it returns.
It improves the sender's judgment about what the receiver needs, which decisions remain outside the
delegation, how much autonomy to allow, when independence matters, and what evidence makes the result
acceptable.

A strong delegation gives the receiver enough durable context to act without reconstructing the sender's
private reasoning. It also keeps scope, authority, and acceptance visible to the sender. The receiver can then
make useful in-scope choices, return exact evidence, and stop cleanly when the contract cannot be satisfied.

This skill owns generic delegation judgment. It does not own runtime dispatch syntax, role selection,
workflow state, or a fixed assignment template. An active orchestration owner may impose a specific brief
shape or status contract in addition to these principles, rules, and preferences.

## Principles

### Build the handoff for the receiver

A delegation succeeds from the receiver's available context, not the sender's private understanding. The
receiver needs a clear outcome, inspectable inputs, visible constraints, and enough preparation to begin
without guessing what the sender meant.

### Transfer a bounded outcome within explicit authority

Delegation transfers responsibility for an outcome, not control over every adjacent decision. A clear
boundary lets the receiver act confidently inside the assignment while preserving user decisions, broader
scope, destructive authority, and acceptance for their owners.

### Preserve useful judgment inside the contract

The brief should protect the outcome without dictating incidental methods. Capable receivers produce better
work when they can choose how to satisfy the objective, evidence bar, and true invariants.

### Protect independence before conclusions are formed

Independent work is valuable only when the receiver can reach a conclusion without being steered toward the
sender's answer or another agent's result. Neutral criteria and evidence preserve the separation that makes
the judgment useful.

### Judge the return by evidence

A confident report is not proof that the delegated outcome exists. Acceptance depends on the returned
artifact, checks, and other direct evidence matching the objective, boundaries, and completion conditions.

## Rules

### Must-Follow

- **MUST make every brief self-contained for its receiver.** Name the receiver, one observable objective,
  relevant context, inspectable inputs, in-scope and out-of-scope work, authority boundaries, expected result,
  completion evidence, and escape paths. Treat context the receiver cannot inspect as absent.
- **MUST make every prerequisite checkable.** When preparation is required, name each source or inspection and
  the evidence that proves it is ready, current, and reachable before work begins.
- **MUST state mutation authority when the assignment can change state.** Name the allowed write or action
  surface, protected targets, permitted external effects, and any destructive or user-owned decision that
  still requires separate authority.
- **MUST state and preserve every independence condition.** Give an independent receiver a neutral target,
  criteria, and evidence. Withhold the sender's preferred conclusion and prior answers until the independent
  result is complete.
- **MUST inspect the rendered brief before dispatch.** Confirm that placeholders are resolved, required inputs
  are reachable, constraints do not conflict, independence is intact, and the requested evidence can be
  produced.
- **MUST accept or redirect from inspected evidence.** Read the promised result or artifact, compare it with
  the objective, scope, and completion conditions, and name the exact failed condition when redirecting.

### Must-Not-Follow

- **NEVER prescribe an incidental method merely because the sender prefers it.** Constrain a method only when
  it is required by safety, compatibility, an accepted design, or the completion evidence.
- **NEVER transfer scope, user authority, destructive authority, publication, or acceptance by implication.**
  The receiver stops and returns the missing decision when satisfying the assignment would cross one of
  those boundaries.

## Preferences

### Prefer one observable outcome

Prefer one end state that the receiver and sender can both recognize. Include why it matters and exclude
adjacent outcomes. A brief may group several results when they share one boundary and acceptance condition;
split them when they need different authority, evidence, or receivers.

### Assume less retained context

Prefer treating unknown receiver context as absent and restating the current contract. A shorter continuation
brief is appropriate when the same receiver remains addressable, the objective and subsystem are coherent,
and the brief still states every changed input, boundary, and completion condition.

### Order preparation by dependency

Prefer listing required sources and inspections in the order the receiver needs them. Omit a separate
preparation block when the brief itself contains every required input and no readiness dependency exists.

### Match evidence to the consequence

Prefer direct artifacts, checks, and observed state over a summary when the work changes something or informs
a consequential decision. For an advisory task with no durable artifact, a reasoned answer with inspectable
sources, assumptions, and limits can be sufficient evidence.

### Keep return paths distinct

Prefer separate returns for missing context, a genuine blocker, successful completion, and completion with a
non-blocking concern. Combine states only when the delegated task cannot produce a meaningful distinction
between them.

## References
