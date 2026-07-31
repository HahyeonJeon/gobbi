---
name: web-feature
description: "MUST load when delivering or reviewing one bounded web application feature across its required layers through a release-ready handoff."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Web Feature

Use this operation to integrate one observable web outcome across only the browser, server, data, provider,
operational, and release layers it needs.

It owns the cross-layer contract and release-ready handoff. Architecture, topology, frontend, backend,
platform, security, testing, language, and framework owners keep their own work.

## Principles

### One feature is one complete observable outcome

A page, component, endpoint, migration, or green happy path is not the unit of completion.

### The current application is the first constraint

Existing behavior, contracts, conventions, tests, telemetry, and release controls are evidence to preserve or
change deliberately.

### A thin vertical skeleton precedes breadth

Make the smallest truthful end-to-end path real, then grow one verified behavior slice at a time.

### Each claim needs evidence from its owner

Source, tests, browser behavior, semantics, pixels, people, authoritative effects, and operations prove
different things.

## Rules

- **MUST bind one bounded feature outcome before implementation.** Name its actors, trigger, entry,
  completion and false-completion signals, paths, states, side effects, scope, and non-goals; return any scope
  change to user authority.
- **MUST inspect the current application and governing records before choosing the change.** Record the
  routes, contracts, data, controls, topology, tests, diagnostics, and release practices that stay compatible,
  plus every authorized break.
- **MUST route every applicable web child and implementation owner.** A material omission needs inspected
  evidence that its trigger is absent.
- **MUST lock one cross-layer contract and its proof before building.** Cover applicable URLs, states,
  messages, domain and provider effects, authority, data lifecycle, failures, instrumentation, configuration,
  migration, rollout, and rollback; support each omission with evidence.
- **MUST grow from a thin end-to-end skeleton through normal, alternative, boundary, failure, recovery, and
  adversarial behavior.** No path may report false success, hide repair, or leave code, contracts, tests,
  documentation, and telemetry disagreeing.
- **MUST reconcile every claim directly with owning evidence and stop at release-ready.** Deployment
  authorization, deployment, reconciliation, and live health remain separate downstream claims.

## Procedure

### Phase 1 — Bind the Feature Outcome

#### 1.1 Study the current application and lock scope

- Read project rules and relevant design, product, and operational records before selecting a change.
- Trace the current entry-to-effect journey through routes, browser state, APIs, domain rules, stored data,
  providers, access controls, tests, telemetry, configuration, migrations, support, and release controls.
- Record the actors, trigger, entry, observable completion, false completion, side effects, paths, states,
  failures, recovery, boundary, non-goals, compatibility constraints, and decision authority.
- Proceed with a locked feature frame; return contradictions, missing authority, or scope changes to the user
  before contract work.

#### 1.2 Route the applicable owners

- Test every sibling trigger and each implementation domain against the locked frame.
- Load frontend, backend, architecture, platform, topology, security, and testing when their triggers apply.
- Load coding, language, runtime, framework, database, provider, deployment, and other implementation owners
  as needed.
- Record the owner set and evidence for every omission without copying owner policy; continue only when every
  in-scope layer has one owner, or return an ownership conflict or uncovered capability.

### Phase 2 — Lock the Contract and Proof

#### 2.1 Define the cross-layer contract

- Define each entry and URL, browser and server state, message and error, domain and provider effect, authority,
  privacy boundary, completion, failure, and resumption path.
- Map who can create, read, update, delete, retain, export, and observe each data class, then define applicable
  configuration, migration, compatibility, instrumentation, support, rollout, stop, and rollback behavior.
- Reconcile the contract with the locked outcome, current behavior, and every applicable owner.
- Produce one internally consistent cross-layer contract; return incompatible constraints, unsupported
  omissions, or irreversible decisions without authority to Phase 1 or the user.

#### 2.2 Define proof and release controls

- List normal, alternative, boundary, failure, recovery, adversarial, compatibility, and counterfactual
  claims from the contract.
- Route test-system design to `web-testing`, threat and control analysis to `web-security`, and layer-specific
  proof to its owner.
- Set quality targets from project evidence or an explicit feature decision instead of inventing universal
  performance, availability, security, or accessibility budgets.
- Define each claim's required evidence, environment, owner, release condition, monitoring signal, stop
  condition, and rollback proof; pause before any unauthorized external or irreversible action.

### Phase 3 — Build Vertical Slices

#### 3.1 Build the thin end-to-end skeleton

- Create the smallest safe path from a real entry through required browser, server, data or provider seams to
  truthful observable completion, including contract shapes, authorization, validation, errors, test seams,
  and instrumentation.
- Mark every fake or unavailable dependency and capture one end-to-end skeleton trace as evidence.
- Reconcile the connected path with the contract, owner responsibilities, recovery, and proof obligations.
- Continue only when the real required layers connect; otherwise repair the earliest missing seam instead of
  treating a client-only demo, mock response, or isolated endpoint as the feature.

#### 3.2 Grow verified behavior

- Select one unimplemented contract case from the passing vertical path.
- Add ordinary behavior, alternative-valid paths, exact boundaries, failures and recovery, adversarial cases,
  compatibility, then counterfactual assumptions one slice at a time.
- Update implementation, contracts, data, configuration, documentation, tests, security evidence, and
  telemetry together.
- Advance only while success stays truthful under applicable duplicates, concurrency, stale clients, partial
  mutation, dependency failure, interruption, retries, and late results; repair a failed slice before adding
  another.

### Phase 4 — Verify and Hand Off

#### 4.1 Verify and evaluate the whole feature

- Start from the completed contract, implementation, owner reports, and slice evidence.
- Ask `web-testing` to run and diagnose applicable evidence while implementation owners inspect browser
  behavior, authoritative effects, and operational readiness.
- Reconcile each claim directly with its strongest evidence, environment, limits, skips, doubles, and
  unresolved risk; a screenshot cannot prove semantics, focus, hidden behavior, or conformance.
- Run the active evaluation method and return failed claims to their earliest owner, preserving each evidence
  gap instead of widening a weaker signal.

#### 4.2 Prepare the release-ready handoff

- Require a passing evaluation or the user's explicit disposition of every limitation, then reconcile
  contracts, implementation, configuration, migrations, tests, security records, telemetry, support, and
  documentation.
- Assemble compatibility notes, rollout, stop, rollback, diagnostics, support, deployment-authority state,
  and post-deployment validation for a cold operator.
- Report implementation correctness, frontend acceptance, backend effects, release readiness, deployment
  authorization, deployment state, and live outcome validation as separate claims.
- End at the release-ready handoff; deployment and live validation proceed only under their own authority.

## References
