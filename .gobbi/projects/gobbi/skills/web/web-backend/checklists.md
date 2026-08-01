# Web Backend Evaluation Checklist

This reusable unchecked source evaluates one authoritative backend outcome produced under this operation,
against the current-study, complete-contract, privileged-boundary, truthful-failure, real-seam, and
separated-claim obligations this skill owns. It is governed by the [`web`](../SKILL.md) domain and
[`web-backend`](SKILL.md) operation, with [`web-feature`](../web-feature/SKILL.md) as the caller that binds
the outcome, [`web-security`](../web-security/SKILL.md) as the owner of security requirements and threat
analysis, [`web-testing`](../web-testing/SKILL.md) as the owner of test-system mechanics, and
[`web-topology`](../web-topology/SKILL.md) as the owner of repository placement. The source commit that
contains this file identifies the checklist version. Its stable owner prefix is `WEBBACK`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBBACK-SC-PROJECT-01 — Normal case: the backend boundary is bound and its owners routed

One bounded backend outcome is taken from a caller and worked. The expected outcome starts from that bound
boundary and sends every question outside backend design to its owner; a backend that absorbs topology, test,
or security policy because it was nearby is the failure.

#### Checklist

- [ ] WEBBACK-CK-PROJECT-01-01 — Work starts from one bounded outcome, the project records, the current server surface, and the accepted constraints.
- [ ] WEBBACK-CK-PROJECT-01-02 — Every question outside backend design and implementation is routed to its owner: repository placement to `web-topology`, test-system mechanics to `web-testing`, security requirements and threat analysis to `web-security`, and cross-layer integration to `web-feature`.
- [ ] WEBBACK-CK-PROJECT-01-03 — Missing authority, an incompatible requirement, or a scope change is returned to `web-feature` or the requesting caller rather than decided here.
- [ ] WEBBACK-CK-PROJECT-01-04 — Every unowned policy, lifecycle, effect, or recovery path is returned rather than absorbed.

### WEBBACK-SC-PROJECT-02 — Rule violation: construction begins before the current backend is studied

Code is written against the requested change while the existing contracts, incidents, and release evidence
remain unread. The expected outcome inspects the current backend first and records what stays compatible; a
change that breaks behavior nobody looked at is the failure.

#### Checklist

- [ ] WEBBACK-CK-PROJECT-02-01 — Current contracts, schemas, configuration, migrations, code patterns, tests, incidents, telemetry, runbooks, support, and release evidence are inspected before construction.
- [ ] WEBBACK-CK-PROJECT-02-02 — Compatible behavior is preserved, or every authorized change records its evidence.
- [ ] WEBBACK-CK-PROJECT-02-03 — The request is traced from ingress through middleware, policy, domain logic, persistence, caches, queues, providers, outbound messages, diagnostics, and user-visible completion.

## Structure

### WEBBACK-SC-STRUCTURE-01 — Normal case: the authoritative contract and data lifecycle are complete

A contract is being specified for the bound boundary. The expected outcome names every actor, operation,
error, effect, and data-lifecycle rule the outcome touches; a contract that specifies request and response
while leaving retention, export, and reconciliation unowned is the failure.

#### Checklist

- [ ] WEBBACK-CK-STRUCTURE-01-01 — The contract names actors and principals, resources, operations, domain invariants, inputs, outputs, schemas, versions, authentication, authorization, validation, errors, effects, audit needs, and completion.
- [ ] WEBBACK-CK-STRUCTURE-01-02 — Every applicable data class defines creation, read, update, deletion, retention, export, observation, ownership, privacy, integrity, and reconciliation behavior.
- [ ] WEBBACK-CK-STRUCTURE-01-03 — Caching, invalidation, consistency, transaction, idempotency, ordering, conflict, and concurrency behavior is defined at the seam that owns it.

### WEBBACK-SC-STRUCTURE-02 — Rule violation: transports are built before the authoritative foundations

Endpoints and client-convenience layers are built while policy, data, and recovery remain unsettled. The
expected outcome settles the authoritative foundations first and renders the full scaffold before production
behavior; a transport shaped around an undecided domain is the failure.

#### Checklist

- [ ] WEBBACK-CK-STRUCTURE-02-01 — Policy, data, effects, failure, and recovery are specified before transport and client-convenience layers.
- [ ] WEBBACK-CK-STRUCTURE-02-02 — Policy, data, effects, failure, and recovery are built before transport and client-convenience layers.
- [ ] WEBBACK-CK-STRUCTURE-02-03 — The complete types, schemas, domain, policy, repository, provider, transport, error, migration, diagnostic, fixture, and test-seam scaffold is rendered before production behavior.
- [ ] WEBBACK-CK-STRUCTURE-02-04 — Types, schema, invariants, policy, authoritative effects, transaction or idempotency, and recovery are implemented in dependency order for the first path.

### WEBBACK-SC-STRUCTURE-03 — Poor quality: a fake seam is treated as proof

The feature passes end to end while its database, provider, or queue is simulated. The expected outcome labels
every substitute and proves one real authoritative effect before breadth; a green path resting on a fake seam
is the failure.

#### Checklist

- [ ] WEBBACK-CK-STRUCTURE-03-01 — Every stub, fake, simulated dependency, and unavailable dependency is labeled.
- [ ] WEBBACK-CK-STRUCTURE-03-02 — No fake database, provider, queue, migration, or external effect is used as evidence for its real seam.
- [ ] WEBBACK-CK-STRUCTURE-03-03 — One real authoritative effect, response, failure, and recovery path is proven before breadth.
- [ ] WEBBACK-CK-STRUCTURE-03-04 — A failed slice is repaired before another slice is added.

## Performance

### WEBBACK-SC-PERFORMANCE-01 — Normal case: bounds and signals are defined at their seams

The backend calls dependencies, queues work, and is operated by someone. The expected outcome defines bounds
for every outbound call and the signals an operator needs; work that waits without a bound and fails without a
signal is the failure.

#### Checklist

- [ ] WEBBACK-CK-PERFORMANCE-01-01 — Timeout, cancellation, retry bounds, compensation, and dead-letter or operator reconciliation are defined for every outbound dependency and queued work.
- [ ] WEBBACK-CK-PERFORMANCE-01-02 — Metrics, traces, alerts, health, capacity, and escalation behavior are defined for the operated surface.

### WEBBACK-SC-PERFORMANCE-02 — Expected failure: a dependency is slow or unavailable

An external dependency stops answering or answers after the caller gave up. The expected outcome applies the
defined fail-closed or degraded behavior and refuses the late result's authority; an unbounded wait, or a late
answer overwriting current truth, is the failure.

#### Checklist

- [ ] WEBBACK-CK-PERFORMANCE-02-01 — An unavailable or slow dependency produces the defined fail-closed or degraded behavior rather than an unbounded wait.
- [ ] WEBBACK-CK-PERFORMANCE-02-02 — A late result arriving after a timeout does not overwrite an authoritative state established in the meantime.
- [ ] WEBBACK-CK-PERFORMANCE-02-03 — Poison work is contained rather than retried without bound.

## Aesthetics

### WEBBACK-SC-AESTHETICS-01 — Normal case: each accepted reference sits beside the clause it shapes

The contract cites HTTP semantics, a specification, or another external owner. The expected outcome verifies
each source and places its conclusion beside the clause it shapes; a bibliography detached from the clauses it
justifies is the failure.

#### Checklist

- [ ] WEBBACK-CK-AESTHETICS-01-01 — Each accepted external conclusion and its citation sit beside the contract clause they shape.
- [ ] WEBBACK-CK-AESTHETICS-01-02 — Each source's owner, version, relevance, applicability, context, conflict, and limits are verified before it is used.

## Usage

### WEBBACK-SC-USAGE-01 — Normal case: a consumer can act on every response

A client or operator receives the backend's outputs. The expected outcome tells each of them what happened and
what to do next; a response that is correct but leaves the consumer with no next action is the failure.

#### Checklist

- [ ] WEBBACK-CK-USAGE-01-01 — Every error response names what failed, whether it is retryable, and the consumer's next action.
- [ ] WEBBACK-CK-USAGE-01-02 — The contract states each operation's preconditions, required authority, and observable completion signal.
- [ ] WEBBACK-CK-USAGE-01-03 — Privacy-safe diagnostics let an operator locate a failure without exposing protected data.

### WEBBACK-SC-USAGE-02 — Expected failure: a request is rejected or denied

Input fails validation, or an authenticated caller lacks the authority for the operation. The expected outcome
rejects at the privileged boundary with a correctable error and follows the owned disclosure decision; an
opaque rejection, or an ad hoc disclosure choice made here, is the failure.

#### Checklist

- [ ] WEBBACK-CK-USAGE-02-01 — An invalid input is rejected at the privileged boundary with an error the consumer can correct from.
- [ ] WEBBACK-CK-USAGE-02-02 — A denied action's response follows the disclosure decision `web-security` owns rather than a choice made here.

## Consistency

### WEBBACK-SC-CONSISTENCY-01 — Normal case: artifacts agree at handoff

The backend is handed to its caller with specification, code, tests, and runbooks attached. The expected
outcome brings them into agreement and reports each claim from its own evidence; a handoff whose runbook
describes the previous contract is the failure.

#### Checklist

- [ ] WEBBACK-CK-CONSISTENCY-01-01 — The specification, implementation, tests, schemas, configuration, migrations, diagnostics, and runbooks agree at handoff.
- [ ] WEBBACK-CK-CONSISTENCY-01-02 — Implementation, verified environment, release readiness, external authority, deployment, reconciliation, and observed health are reported as separate claims.
- [ ] WEBBACK-CK-CONSISTENCY-01-03 — Contract, code, data, configuration, tests, documentation, diagnostics, and runbooks are updated together within each slice.

### WEBBACK-SC-CONSISTENCY-02 — Edge case: two contract versions serve at once

A deploy leaves the previous and the new backend version running together against one data store. The expected
outcome defines mixed-version operation and keeps every still-supported client working; a change correct only
once every old instance is gone is the failure.

#### Checklist

- [ ] WEBBACK-CK-CONSISTENCY-02-01 — Mixed-version operation, migration, backfill, cutover, rollback, and repair behavior is defined for the change.
- [ ] WEBBACK-CK-CONSISTENCY-02-02 — No schema or contract change breaks a client version the compatibility record still supports.

## Risk

### WEBBACK-SC-RISK-01 — Rule violation: client behavior is treated as enforcement

A check exists in the client, and the server accepts what arrives. The expected outcome enforces validation
and authorization at the privileged boundary for the exact operation on the exact resource; a hidden control
counted as a control is the failure.

#### Checklist

- [ ] WEBBACK-CK-RISK-01-01 — Validation and authorization are enforced at the privileged boundary for every operation.
- [ ] WEBBACK-CK-RISK-01-02 — No client-side check, hidden field, or omitted interface control is treated as enforcement.
- [ ] WEBBACK-CK-RISK-01-03 — Authorization decides whether the exact identity may perform the exact operation on the exact resource rather than only that the identity is authenticated.

### WEBBACK-SC-RISK-02 — Expected failure: an external effect is applied and the response is lost

A provider call succeeds while the connection drops, and the caller retries. The expected outcome establishes
the authoritative effect before claiming success and keeps a duplicate from applying twice; a success reported
ahead of its effect, or a silent double charge, is the failure.

#### Checklist

- [ ] WEBBACK-CK-RISK-02-01 — No path reports success before its authoritative effect is established.
- [ ] WEBBACK-CK-RISK-02-02 — A duplicate, out-of-order, or retried request produces one authoritative effect rather than several.
- [ ] WEBBACK-CK-RISK-02-03 — A partial external effect leaves a recorded, reconcilable state rather than an unrecoverable ambiguity.

### WEBBACK-SC-RISK-03 — Adversarial: a caller games the contract to reach an effect it is not entitled to

Someone supplies another principal's identifier, races two requests, or replays a cancelled one. The expected
outcome authorizes against the exact resource and holds the effect to once; a policy satisfied by the shape of
the request rather than by its authority is the failure.

#### Checklist

- [ ] WEBBACK-CK-RISK-03-01 — No caller-supplied identifier, sequence, or state selects the resource an operation acts on without an authorization check against that exact resource.
- [ ] WEBBACK-CK-RISK-03-02 — No retry, cancellation, or concurrent request path applies an effect twice.
- [ ] WEBBACK-CK-RISK-03-03 — No retry, cancellation, or concurrent request path bypasses a policy check.
- [ ] WEBBACK-CK-RISK-03-04 — Audit and diagnostic records for a protected effect cannot be suppressed by the caller.

## Overall

### WEBBACK-SC-OVERALL-01 — Normal case: the backend outcome is complete and truthfully bounded

A finished backend outcome covers contract, data, authority, failure, migration, recovery, diagnostics, and
operations for its boundary and stops there. The scenario fails when one of those is missing, or when a
limitation is carried silently instead of disposed.

#### Checklist

- [ ] WEBBACK-CK-OVERALL-01-01 — The delivered outcome covers contract, data lifecycle, authority, failure, migration, recovery, diagnostics, and operations for the bound boundary.
- [ ] WEBBACK-CK-OVERALL-01-02 — Every remaining backend limitation carries an authorized disposition rather than silence.
- Also applies: WEBBACK-CK-CONSISTENCY-01-02 (claims reported separately).
