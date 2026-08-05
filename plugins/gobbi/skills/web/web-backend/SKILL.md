---
name: web-backend
description: "MUST load when designing, building, or reviewing a web change's server, API, domain rules, data lifecycle, provider integration, authorization, or server-side recovery."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Web Backend

Use this operation for one complete server-owned backend outcome: interfaces, domain policy, data lifecycle,
provider actions, failure recovery, migrations, diagnostics, and operations.

It owns backend design and implementation. Route repository placement to `web-project-structure`, test-system
mechanics to `web-testing`, and security requirements and threat analysis to `web-security` when their
triggers apply.

## Principles

### Authority is explicit at every boundary

Authentication establishes identity; authorization decides whether that identity may perform the exact
operation on the exact resource.

### The data lifecycle is part of the feature

Creation, reading, update, deletion, retention, export, observation, and reconciliation need deliberate
owners and rules.

### Failure must preserve truth

Timeouts, retries, concurrency, and partial provider changes must not create false success, silent loss, or
unrecoverable ambiguity.

### Server-side foundations precede transports

Specify and build policy, server state, stored data, provider actions, failure, and recovery before transport and client
convenience layers.

## Rules

- **MUST study current contracts, data, provider interactions, operations, and applicable owner guidance before
  construction.** Preserve compatible behavior or record every authorized change and its evidence.
- **MUST define the complete server-owned contract and affected data lifecycle.** Cover actors, resources,
  operations, inputs, outputs, policy, errors, server-state changes, stored-data changes, provider actions,
  creation, reads, updates, deletion, retention, export, observation, ownership, privacy, integrity, and
  reconciliation as applicable.
- **MUST enforce validation and authorization at the privileged boundary.** Apply `web-security`
  requirements without treating client behavior as enforcement.
- **MUST make timeout, cancellation, retry, duplication, ordering, concurrency, partial changes, migration,
  rollback, and recovery accurate.** No path may claim success before the requested result is confirmed at its
  named source of truth.
- **MUST build from a complete scaffold through one real result from the named source of truth or provider
  before breadth.** Label every fake and unavailable dependency, and never use it as proof of a real
  integration point.
- **MUST reconcile every backend claim with evidence from its owner.** Separate implementation, verified
  environment, release readiness, external authority, deployment, reconciliation, and observed health.

## Procedure

### Phase 1 — Study the Current Backend

#### 1.1 Trace the outcome and current operation

- Start from the scoped outcome, project records, current server and API behavior, and accepted constraints.
- Trace the request from ingress through middleware, policy, domain logic, persistence, caches, queues,
  providers, outbound messages, diagnostics, and user-visible completion.
- Inspect current contracts, schemas, configuration, migrations, code patterns, tests, incidents, telemetry,
  runbooks, support, and release evidence; record behavior, compatibility, failure history, and non-goals.
- Continue with one evidenced backend boundary; return missing authority, incompatible requirements, or scope
  change to `web-development` or the requesting caller.

#### 1.2 Apply material references and route owners

- Identify affected data, trust crossings, dependencies, irreversible changes, and synchronous or asynchronous
  boundaries.
- For a material choice that is novel, uncertain, exclusionary, consequential, security- or
  compatibility-sensitive, or hard to reverse, use the closest current owner, such as
  [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) for HTTP semantics or the
  [OpenAPI Specification](https://spec.openapis.org/oas/) when OpenAPI is used.
- Verify each source's owner, version, relevance, applicability, context, conflict, and limits, then put each
  accepted conclusion and citation beside the contract clause it shapes.
- Load project structure, testing, security, language, runtime, database, provider, and framework owners when
  triggered; return every unowned policy, lifecycle, server-state change, stored-data change, provider action,
  or recovery path.

### Phase 2 — Specify the Complete Backend

#### 2.1 Define authority, interfaces, data, and changes

- Specify actors and principals, resources, operations, domain invariants, inputs and outputs, schemas,
  versions, authentication, authorization, validation, errors, server-state changes, stored-data changes,
  provider actions, audit needs, and completion.
- Define creation, read, update, deletion, retention, export, observation, ownership, privacy, integrity,
  caching, invalidation, consistency, transaction, idempotency, concurrency, and reconciliation behavior for
  each applicable data class, server-state change, stored-data change, and provider action.
- Define transaction, ordering, idempotency, conflict, provider, and source-of-truth response behavior at their owning
  boundaries.
- Continue with one coherent contract; return contradictory authority, data, provider, compatibility, or
  completion decisions to Phase 1.

#### 2.2 Define failure, migration, operations, and the scaffold

- Enumerate applicable invalid input, denied action, unavailable or slow dependency, timeout, cancellation,
  retry, duplicate, out-of-order work, stale read, partial mutation, concurrency, late result, poison work,
  and external ambiguity.
- Define fail-closed or degraded behavior, retry bounds, compensation, dead-letter or operator reconciliation,
  mixed-version operation, migration, backfill, cutover, rollback, repair, diagnostics, privacy-safe logs,
  metrics, traces, alerts, support, health, capacity, and escalation.
- Render the complete types, schemas, domain, policy, repository, provider, transport, error, migration,
  diagnostic, fixture, and test-boundary scaffold.
- Return a missing failure owner, rollback path, irreversible-change authority, or incoherent boundary before
  production behavior.

### Phase 3 — Build Bottom-Up

#### 3.1 Materialize the scaffold and foundations

- Load applicable coding, language, runtime, database, provider, framework, project structure, security, and
  testing owners.
- Materialize every planned type, interface, schema, policy and dependency integration point, migration, diagnostic,
  fixture, and test boundary; label stubs, fakes, and simulated dependencies.
- Implement types, schema, invariants, policy, server-state changes, stored-data changes, provider actions, transaction or
  idempotency, and recovery in dependency order for the first path.
- Verify local invariants and repair the contract or scaffold before forcing behavior through a missing integration point.

#### 3.2 Prove one real result from the named source of truth or provider and grow slices

- Connect the real foundations outward through application orchestration, authentication, authorization,
  privileged-boundary validation, transport mapping, accurate response, diagnostics, and support visibility.
- Prove one real result from the named source of truth or provider, plus its response, failure, and recovery
  path; do not use a simulated database, provider, queue, migration, or external service as evidence that the
  corresponding real integration works.
- Grow ordinary, boundary, adversarial, compatibility, migration, retry, duplicate, concurrency,
  partial-change, and recovery behavior one complete slice at a time.
- Update contract, code, data, configuration, tests, documentation, diagnostics, and runbooks together; repair
  a failed slice before breadth.

### Phase 4 — Verify and Hand Off

#### 4.1 Verify server-side and operational claims

- Start from the contract, implementation, security requirements, migrations, runbooks, and slice evidence.
- Ask `web-testing` to run the applicable focused, integration, full, environment, migration, recovery, and
  adversarial evidence.
- Inspect server-owned data, provider changes, and privacy-safe diagnostics across healthy, degraded, failed,
  delayed, and unreconciled states.
- Return contract drift, a fake-integration-point claim, failed policy, migration ambiguity, or an unsupported environment
  claim to its earliest owner.
- When this backend outcome is evaluated, the [evaluation checklist](checklists.md) and every checklist owned
  by an active `web` sibling supply the applicable conditions; the general Evaluation operation resolves them
  and issues any verdict.

#### 4.2 Prepare the scoped handoff

- Resolve verification findings or record the authorized disposition of every backend limitation.
- Reconcile the specification, implementation, tests, schemas, configuration, migrations, diagnostics, and
  runbooks.
- Report implementation, verified environment, release readiness, external authority, deployment,
  reconciliation, and observed health separately.
- Hand the result to `web-development` or the requesting caller, preserving every pending provider, migration,
  deployment, reconciliation, and live-health claim.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
