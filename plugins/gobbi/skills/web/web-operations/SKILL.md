---
name: web-operations
description: "MUST load when operating or reviewing a live web service, including health and support, incident response, routine maintenance, dependency and compatibility updates, deprecation, or retirement."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebFetch
skill-type: operation
---

# Web Operations

Use this operation after deployment has verified a live web service to keep that service supported through
health and support work, incidents, routine maintenance, dependency and compatibility updates, deprecation,
or retirement. It ends in supported continuation, an owned product change, or verified retirement.

This operation owns the supported live-service lifetime and the operational actions taken within it. It
consumes telemetry, test, security, and design evidence from their owners; `web-development` coordinates any
product change, and `web-release` and `web-deployment` produce and ship changed bytes.

An operating route records authority gates but grants no authority itself. Destructive, external,
irreversible, and user-impacting actions stop unless current authority covers that exact action and its stated
impact.

## Principles

### Live operation begins from verified service state

Operations inherits a deployed service rather than inferring one from an artifact, upload, or dashboard. Its
first record binds the verified live version and configuration to owners, support, runbooks, and authority.

### Preserve support while changing service state

Routine work and recovery protect the current supported state until a replacement state is verified. Every
forward action has stop conditions and a preservation or reversal path proportionate to its risk.

### Evidence and operational acceptance are different claims

Telemetry emission, verified arrival, test results, security analysis, design judgment, release identity,
deployment state, live verification, observed health, and supported operation keep their semantic owners.

### Authority narrows each operational action

Authority is current, actor-specific, target-specific, and action-specific. A broad operating role or runbook
does not authorize an external message, provider change, destructive step, irreversible removal, or user
impact outside its exact grant.

## Rules

- **MUST start only from a deployment-verified live service.** Bind its live version, configuration identity,
  current state, support commitment, runbooks, owners, authority state, and production-URL verification before
  accepting operational work.

- **MUST keep the operating record and support path current.** Every live state and operational action names
  its owner, exact authority, impact, start, next decision, failure return, and support guidance.

- **MUST classify work as routine service work or a product change before action begins.** Return every
  product change through `web-development` at the earliest invalidated stage, and route changed shipped bytes
  through `web-release` and `web-deployment`.

- **MUST give maintenance, recovery, deprecation, and retirement explicit stop conditions and a preservation
  or reversal path before action.** Resource use, user impact, service thresholds, rollback limits, and any
  irreversible boundary must be named and observable.

- **NEVER perform a destructive, external-message, provider, irreversible, or user-impacting action without
  current authority for that exact action.** Stop, preserve the current supported service state, and name the
  required authority when the grant is absent, expired, ambiguous, or narrower than the action.

- **MUST close operation only as supported continuation, an owned product change, or verified retirement.**
  Keep every remaining risk, evidence limit, disposition, owner, and reopen condition in the terminal handoff.

## Procedure

### Phase 1 — Bind the Live-Service Contract

#### 1.1 Accept the deployment-verified service

- Start from `web-deployment`'s production-URL verification or equivalent evidence naming the exact live
  service, environment, served build identity, configuration identity, deployment state, reverse path, and
  retained predecessor state.
- Confirm that the production URL serves the named release and that deployment, live verification, and
  observed health are separate claims; return an artifact mismatch to `web-release` and an environment or
  verification failure to `web-deployment`.
- Record the live version, configuration identity, current service state, support commitment, runbooks,
  owners, compatibility record, known risks, and open deployment limits as the operating baseline.
- Continue only from that deployment-verified baseline; a service whose live identity or configuration is
  unknown remains with deployment or its owning repair path rather than entering supported operation.

#### 1.2 Bind support, ownership, authority, and evidence

- Take the operating baseline plus the support route and hours, escalation path, service thresholds,
  dependency support matrix, incident and maintenance runbooks, deprecation and retirement criteria, and the
  current authority grants for the planned operational scope.
- Name one person or team for every next operational decision, then record for each possible action its actor,
  target, exact authorized action, time or approval limit, resource-use and user-impact stop conditions,
  preservation or reversal path, and first action outside the grant.
- Attribute telemetry emission and destination evidence to `web-observability`, test design and measurement to
  `web-testing`, protected-data and security evidence to `web-security`, and product-design and retirement
  judgment to `web-design`; treat each as an input rather than an operations claim.
- Continue with an owned support and authority map. When authority is missing or ambiguous, preserve the
  supported service, record the blocked action and impact, and name the person or body whose exact authority
  is required.

### Phase 2 — Maintain Health and Support

#### 2.1 Reconcile health and support state

- Take the operating baseline, accepted capacity, saturation, cost, dependency-health, service, and user-harm
  thresholds, and the arrived signals `web-observability` has reconciled with their destinations.
- Compare the observed service state with those thresholds and with support reports, runbooks, configuration,
  compatibility, and live version; ask `web-testing` to design or run any capacity or dependency-health
  measurement rather than claiming measurement mechanics here.
- Update one cold-reader operating record with version, configuration, impact, owner, start time, next
  decision, support route, evidence limits, and whether the service is supported, degraded, or in incident.
- Continue ordinary operation while the supported contract holds; enter Step 3.1 on a breached incident
  condition, route a product-design learning judgment to `web-design`, and escalate any threshold observation
  that lacks an owned response.

#### 2.2 Perform routine maintenance and compatibility updates

- Take one maintenance need, its owner and exact authority, the current supported service, dependency and
  compatibility records, test evidence, thresholds, stop conditions, and preservation or reversal path.
- Classify the work before action: routine service work stays here, while any changed product behavior,
  contract, data meaning, or implementation returns through `web-development`; any changed shipped bytes also
  require `web-release` and `web-deployment` before they can reach the live service.
- For routine work, check browser, API, data, product, provider, and dependency versions against the supported
  matrix before the action; operate only within the approved resource and user-impact limits, then check the
  same matrix and live service contract afterwards.
- Record the action, evidence, resulting service state, runbook and support updates, owner, and next decision.
  Stop or reverse immediately when a stop condition is met; an unsafe or unsupported update leaves the current
  supported service in place and returns to its owner with a required migration path.

### Phase 3 — Respond to Incidents

#### 3.1 Enter, contain, and recover an incident

- Take an alert or report, the live evidence and operating baseline, the incident runbook, impact threshold,
  incident owner, communication and provider-action authority, and the predeclared recovery stop conditions.
- Open an incident record with entry time, affected service and users, current state, evidence, owner, next
  action, support route, and the exact authority for every containment, recovery, external message, or provider
  action under consideration.
- Apply only authorized, reversible containment and recovery steps, observe resource use and user impact after
  each step, and stop or reverse immediately when a stop condition is met; preserve evidence needed to
  diagnose from the safe state.
- Continue to Step 3.2 when the service is contained or restored. Escalate a failed recovery with the accurate
  service state and retained evidence, and route a durable product repair through `web-development` at the
  earliest invalidated stage.

#### 3.2 Preserve or restore the supported state

- Take the incident timeline, recovery evidence, prior supported state, reverse path, support obligations,
  user-impact state, and every remaining authority limit.
- Verify the recovered service against the named live version, configuration, service thresholds,
  compatibility record, support commitment, and production URL; present the accurate current state and
  recovery route to affected users and support staff under the required communication authority.
- On recoverable failure, restore the prior supported state before reporting completion. Do not close the
  incident while a recovery or impact condition remains unmet, and keep unsupported versions explicitly
  unsupported with an owner and approved migration path.
- Record containment or restoration, impact, evidence limits, follow-up owner, disposition, and reopen
  condition; return to Step 2.1 for continued operation or to Step 5.1 for an owned product change.

### Phase 4 — Deprecate or Retire the Service

#### 4.1 Operate an approved deprecation window

- Start only from `web-design`'s accepted deprecation or retirement judgment or equivalent approval, including
  affected users and consumers, service and compatibility evidence, migration path, support obligations,
  approved window, stop conditions, and the authority required for notices and later retirement.
- Confirm that the window, migration and support paths, success measures, user-harm limits, rollback limits,
  successor, and owners are complete before any external notice or user-impacting change.
- Under exact communication authority, publish or update a notice that names affected users, required action,
  deadline, migration path, support route, and current service state; maintain the supported service and
  measure the approved window without silently shortening it.
- Continue through the window while obligations hold. Return missing affected-user or product judgment to
  `web-design`, route a required product change through `web-development`, and stop for user authority when an
  unresolved decision exceeds the accepted contract.

#### 4.2 Execute and verify retirement

- Take the approved retirement contract, completed deprecation evidence, exact authority for each action,
  affected-user and consumer disposition, traffic, data, asset, provider, identity, support, and successor
  dispositions, retained-record requirements, stop conditions, and the last recoverable point.
- Order reversible migration and support steps before irreversible removal. Before each destructive,
  provider, external, user-impacting, or irreversible action, revalidate that current authority names that
  exact action and target and that every prerequisite disposition remains satisfied.
- Stop before an unauthorized or ambiguous action, preserve the current supported state, and name the required
  authority. On a recoverable failure, restore the prior supported state before reporting completion; never
  bypass the retirement gate while a user, data, traffic, asset, or support disposition remains open.
- After authorized actions finish, verify traffic withdrawal, consumer migration or explicit disposition,
  owned data and asset handling, support and successor routes, provider state, and any retained records from
  their actual destinations. Continue only when the retirement contract is satisfied within its evidence and
  irreversible limits.

### Phase 5 — Reconcile and Hand Off the Outcome

#### 5.1 Close supported continuation or route a product change

- Reconcile the operating record across health, support, incidents, maintenance, compatibility, deprecation,
  live version, configuration, runbooks, telemetry interpretation, test evidence, authority, and remaining
  risk.
- When this operations outcome is evaluated, use the [evaluation checklist](checklists.md) and every checklist
  owned by an active `web` sibling; the general Evaluation operation resolves applicable conditions and
  issues the verdict.
- For supported continuation, record the supported service state, next health and support decision, owners,
  evidence limits, risks, dispositions, and reopen conditions. Route representative-user and product outcome
  learning to `web-design` without making the design judgment here.
- For a product change, hand `web-development` the earliest invalidated stage, service impact, evidence,
  current preservation state, support obligations, exact authority state, and reopen reason; require
  `web-release` and `web-deployment` before changed shipped bytes return to live operation.

#### 5.2 Record verified retirement

- Take the verified retirement outcome, completed disposition evidence, authority record, irreversible limits,
  successor and support state, retained records, and every remaining risk.
- Produce a cold-reader terminal record identifying the retired service and version, final disposition,
  successor, affected-user and consumer outcome, traffic, data, asset, provider, and support results, retained
  owner, evidence limits, and reopen condition.
- Hand retirement evidence to `web-development` for terminal coordination and to `web-design` for the retired
  design record, without claiming their acceptance or judgment.
- Report `Retired` only when verification satisfies the approved contract and no required disposition or
  authority remains open. Otherwise restore the supported state when recovery remains possible, or stop with
  the exact irreversible state, unresolved condition, evidence, and named decision authority preserved.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
