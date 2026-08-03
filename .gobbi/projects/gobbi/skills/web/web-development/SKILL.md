---
name: web-development
description: "MUST load when coordinating or reviewing one web change across design, implementation, testing, release, deployment, live learning, iteration, and retirement handoffs."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Web Development

Use this operation to coordinate one observable web change across the lifecycle stages it needs. It binds the
outcome, routes each stage, preserves handoff evidence, and keeps returns and reopen reasons owned.

This operation performs no design, implementation, test, release, deployment, operations, or retirement
action by virtue of coordination. [`web-design`](../web-design/SKILL.md), frontend, backend, architecture,
security, testing, release, deployment, observability, operations, and other specialists retain their action,
authority, evidence, and acceptance.

## Principles

### One change is one observable outcome through owned stages

A page, component, endpoint, deployment, or green happy path is not the unit of completion. The coordinated
change stays traceable from its bound outcome through every applicable stage and return.

### The current application is the first constraint

Existing behavior, contracts, conventions, tests, telemetry, release controls, and live evidence are facts to
preserve or change deliberately.

### A thin vertical skeleton precedes breadth

Implementation begins with the smallest truthful end-to-end path, then grows one verified behavior slice at a
time under its implementation owners.

### Every claim and handoff keeps its semantic owner

Design acceptance, implementation correctness, test evidence, release readiness, deployment authority,
deployment state, live verification, observed health, supported operation, and retirement are separate claims.

## Rules

- **MUST bind one bounded change outcome before coordination.** Name its actors, trigger, entry, completion
  and false-completion signals, paths, states, side effects, scope, non-goals, and terminal conditions; return
  any scope change to user authority.
- **MUST inspect the current application and governing records before routing the change.** Record the design,
  routes, contracts, data, controls, topology, tests, diagnostics, release practices, live evidence, and
  retirement constraints that stay compatible, plus every authorized break.
- **MUST route every applicable lifecycle stage and specialist.** A material omission needs inspected evidence
  that its trigger is absent, and every stage records its entry condition, exit condition, material input,
  success output, failure return, next owner, evidence claim, and reopen reason.
- **MUST keep one coordinated path through applicable design, architecture, implementation, testing, release,
  deployment, live operation, learning, iteration, maintenance, incident recovery, deprecation, and
  retirement handoffs.** Return a failed condition to the earliest owner whose accepted input or outcome it
  invalidates.
- **MUST report ordinary accepted completion and retirement as different terminal states.** Accepted
  completion closes the current coordinated change while live operation and later learning continue;
  retirement closes the supported product path after its owner accepts the retirement evidence.
- **NEVER use coordination as authority for a specialist, external, destructive, or irreversible action.**
  Pause until the exact owner accepts the handoff and the action has its required authority.

## Procedure

### Phase 1 — Bind and Route the Change

#### 1.1 Study the current product and lock the outcome

- Read project rules and relevant product, design, technical, operational, and support records.
- Trace the current entry-to-effect journey through browser state, APIs, domain rules, stored data, providers,
  access controls, tests, telemetry, configuration, release controls, live operation, and retirement policy.
- Record the actors, trigger, entry, observable completion, false completion, side effects, paths, states,
  failures, recovery, boundary, non-goals, compatibility constraints, decision authority, and terminal states.
- Continue with a locked outcome; return contradictions, missing authority, or scope changes to the user.

#### 1.2 Build the lifecycle route

- Test every web-child, implementation-domain, release, deployment, operations, learning, and retirement
  trigger against the locked outcome.
- Route the applicable stages in order: intake and outcome lock; discovery and definition; alternative and
  accepted design; architecture and contracts; implementation; testing and acceptance; production release;
  environment deployment; live operation; live learning; ordinary accepted completion for the current change;
  iteration or product change; routine maintenance or compatibility update; incident recovery; deprecation;
  and retirement.
- For each included stage, name its semantic owner, entry and exit conditions, input, output, failure return,
  next handoff, evidence claim, and reopen reason. Record inspected evidence for each omission.
- Continue only when every in-scope stage has one owner and every handoff is connected; return an ownership
  conflict, uncovered capability, or ownerless transition.

### Phase 2 — Accept Design and Delivery Contracts

#### 2.1 Coordinate discovery, alternatives, and accepted design

- Hand the observed problem, affected people, current behavior, constraints, and evidence to
  [`web-design`](../web-design/SKILL.md).
- Preserve the design owner's identity source, evidence classes, alternative concepts, accepted decision,
  validation threshold, reopen condition, replacement criteria, and retirement criteria.
- Route browser expression and behavior to frontend, interaction, HTML, CSS, and framework owners as their
  triggers require.
- Accept the design handoff only after its required validation or approved limitation disposition; return a
  failed design claim to the earliest design stage it invalidates.

#### 2.2 Coordinate architecture, contracts, and proof

- Route architecture and layer contracts to their owners. Reconcile applicable entries, URLs, states,
  messages, effects, authority, data lifecycle, failures, instrumentation, configuration, migration, rollout,
  rollback, support, and retirement behavior without copying owner policy.
- Map who can create, read, update, delete, retain, export, and observe each data class.
- Route test-system design to `web-testing`, security analysis to `web-security`, and each layer-specific proof
  to its owner. Record the claim, environment, owner, required evidence, acceptance condition, and failure
  return.
- Continue only with an internally consistent cross-layer contract and accepted proof plan; return an
  unsupported omission or irreversible decision without authority.

### Phase 3 — Coordinate Implementation and Acceptance

#### 3.1 Establish the thin vertical skeleton

- Ask the implementation owners for the smallest safe path from a real entry through required browser,
  server, data, or provider seams to truthful observable completion.
- Require contract shapes, authorization, validation, errors, test seams, instrumentation, and every fake or
  unavailable dependency to remain explicit.
- Preserve one end-to-end skeleton trace and reconcile it with the accepted design, contract, recovery, and
  proof obligations.
- Return the path to the earliest missing seam when real required layers do not connect.

#### 3.2 Grow and test verified behavior

- Coordinate one unimplemented contract case at a time: ordinary behavior, alternative-valid paths, exact
  boundaries, failures and recovery, adversarial cases, compatibility, then counterfactual assumptions.
- Keep implementation, contracts, data, configuration, documentation, tests, security evidence, and telemetry
  aligned through their owners.
- Ask the testing and implementation owners to reconcile every claim with its strongest owning evidence,
  environment, limits, skips, and doubles.
- Return a failed claim to its earliest owner and preserve the evidence gap instead of widening a weaker
  signal.

### Phase 4 — Coordinate Release, Deployment, and Live Operation

#### 4.1 Accept release readiness and deployment handoffs

- Require the evaluation or approved limitation disposition the release owner needs. Keep implementation
  correctness, test evidence, frontend acceptance, backend effects, release readiness, and release state as
  separate claims.
- Route production release preparation and execution to `web-release` when that owner exists. Preserve its
  artifact, compatibility, migration, rollout, stop, rollback, support, and authority evidence.
- Hand an accepted release to [`web-deployment`](../web-deployment/SKILL.md). Keep deployment authorization,
  deployment state, reconciliation, rollback, and live verification as separate deployment-owned claims.
- Pause an external, destructive, irreversible, release, or deployment action until its owner holds the exact
  required authority.

#### 4.2 Accept live operation and learning handoffs

- Route observed health, incident response, support, maintenance, and compatibility work to `web-operations`
  when that owner exists, with diagnostics from [`web-observability`](../web-observability/SKILL.md).
- Route post-release evidence to the design and product owners. Compare it with accepted success signals and
  harm guardrails, then record retain, refine, replace, retire, or reopen.
- Reopen the earliest stage whose accepted input or outcome the evidence invalidates, and rebuild the route
  from that stage through every applicable owner.
- Record ordinary accepted completion only when the current change has no ownerless handoff, unresolved
  return, or unowned reopen reason; keep live operation and later learning open under their owners.

### Phase 5 — Coordinate Change, Deprecation, and Retirement

#### 5.1 Route iteration, maintenance, and incident recovery

- Send product or design change through the earliest reopened design stage and every later applicable stage.
- Send routine maintenance or compatibility work through the earliest technical contract it changes, then
  through testing, release, deployment, and operations owners as applicable.
- Send incident recovery to its response owner, preserve the immediate safety action, and route durable repair
  through the earliest invalidated stage after stabilization.
- Close only the current coordinated change at accepted completion; do not report the product path retired.

#### 5.2 Route replacement, deprecation, and retirement

- Require the design owner's affected-user, migration, support, successor, replacement, and retirement
  evidence before coordinating deprecation.
- Route deprecation notices, compatibility periods, migration, release, deployment, support, and removal to
  their semantic owners with explicit success, rollback, and failure-return conditions.
- Accept the retirement terminal only after the retirement owner proves the supported path is withdrawn, the
  required migration and support obligations are met, and no ownerless handoff remains.
- Report the terminal state, evidence limits, successor, and remaining records without claiming an action that
  coordination did not perform.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
