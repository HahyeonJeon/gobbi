---
name: electron-development
description: "MUST load when implementing or reviewing one bounded Electron source change across main, preload, renderer, utility process, window, application lifecycle, or operating-system integration boundaries."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Electron Development

Use this operation to implement or review one bounded Electron source change. Start from accepted installed
contract, interface, and technical design records plus current runtime facts for the affected targets.

Model the whole affected process chain before source details. Choose implementation with an exact edit set
or read-only review, then work from shared contracts toward dependent integrations.

The operation ends with one construction-verified source result and explicit dynamic records for later work.
It does not establish behavior, construct a package candidate, accept a candidate, or make a release ready.

## Principles

### Accepted records define the source boundary

Development applies accepted behavior, interface, and technical decisions. It returns a contradiction or
missing authority to the earliest owner instead of revising that owner's decision.

### Model the whole process chain before details

Establish every affected process, entry, crossing, lifecycle point, and cleanup path before implementing or
reviewing individual files. Dependent source follows that complete skeleton.

### Implementation and review have different authority

Implementation may edit only its accepted affected set. Review remains read-only and returns a source
classification with exact findings and handoffs.

### Construction evidence has a fixed limit

Formatting, lint, type, build, emitted-entry, and static consistency results establish source construction
only. Later owners establish behavior and artifact claims.

## Rules

- **MUST start from accepted records owned by
  [`electron-contract`](../electron-contract/SKILL.md),
  [`electron-interface`](../electron-interface/SKILL.md), and
  [`electron-design`](../electron-design/SKILL.md), with current mechanism facts from
  [`electron-runtime`](../electron-runtime/SKILL.md).** Return a contradiction or missing authority to the
  earliest affected owner before source work continues.

- **MUST choose implementation or read-only review and record the exact affected set.** A review request
  authorizes no source, type, configuration, build, documentation, caller, or cleanup edit.

- **MUST map Create, Read, Update, Delete, and 5W1H before edits across affected code, types or schemas,
  configuration, build entries, documentation, callers, and cleanup.** Include each affected process, trust
  boundary, sender and payload, bridge, state and resource owner, lifecycle point, and end condition.

- **MUST implement or inspect in dependency order and keep the accepted affected set consistent.** Use shared
  application contracts and types, privileged main or utility ownership, preload adapters, renderer
  consumers, window or view and application-lifecycle integration, operating-system integration, then
  configuration, build entries, documentation, callers, and cleanup where each applies.

- **MUST run construction-only checks and diagnose failure at the earliest source, process, loader,
  lifecycle, configuration, or build boundary.** Repair the bounded source cause and repeat every affected
  construction check without designing, running, or interpreting tests.

- **NEVER claim behavior-verified, packaged, candidate-accepted, release-ready, or complete-delivery state.**
  Development owns no test evidence, diagnostic-emission outcome, package construction, candidate acceptance,
  release, independent evaluation, publication, or rollout; dynamic handoffs transfer records, not policy.

## Procedure

### Phase 1 — Accept One Bounded Source Outcome

#### 1.1 Confirm accepted inputs and authority

- Read the accepted installed contract, observable interface decision, and technical design for the source
  outcome. Record their identities, limitations, affected targets, and changed facts that reopen them.
- Resolve Electron version, process capability, loader, lifecycle, and operating-system mechanism facts
  through Electron Runtime. Do not copy its mechanism manual into this operation.
- Compare the accepted records with one another and the current repository. Stop on a contradiction, missing
  decision, or missing authority and return it to the earliest owner that can resolve it.

#### 1.2 Select implementation or read-only review

- For implementation, record the authorized outcome, unchanged behavior, exact affected paths, allowed
  edits, prohibited paths, dependencies, targets, and required construction checks.
- For read-only review, record the exact source subject, accepted records, targets, and review questions. Keep
  every source and project file read-only.
- For either work type, name the starting source commit or digest and the boundary that makes the outcome one
  bounded change. Route a complete or multi-owner outcome to its coordinator instead of expanding this
  operation.

### Phase 2 — Model the Affected Source and Process Chain

#### 2.1 Map CRUD and 5W1H

- Map every created, read, updated, deleted, replaced, or cleanup path across code, types or schemas,
  configuration, build entries, documentation, callers, and generated outputs inspected for consistency.
- Record who owns each affected process and resource, what changes, when in the lifecycle it applies, where
  each crossing occurs, why the accepted design requires it, and how source and cleanup remain consistent.
- Identify every consistency read and dependent caller before an implementation edit. During read-only
  review, use the same map to define the complete inspection set.

#### 2.2 Establish the process-chain skeleton and dependency order

- Draw the applicable source chain from shared application contracts and types through privileged main or
  utility ownership, preload adapter or bridge, renderer consumer, window or view and lifecycle integration,
  operating-system integration, configuration, build entries, documentation, callers, and cleanup.
- Preserve the accepted technical design's exact process, trust, sender and payload, bridge, state and
  resource, lifecycle, failure, and cleanup decisions. Resolve mechanism-sensitive gaps through Electron
  Runtime rather than selecting new policy.
- Mark omitted links as not applicable with the accepted reason. Stop when an omitted or newly required link
  changes an accepted contract, interface judgment, or technical decision.

### Phase 3 — Produce the Bounded Source Result

#### 3.1 Implement from foundation to dependent integrations

- Enter this Step only for implementation. Establish the whole source skeleton before adding detailed
  behavior.
- Implement applicable layers in the Phase 2 dependency order. Keep imports, value shapes, build outputs,
  lifecycle registration, failure paths, and cleanup consistent with their executing process and accepted
  design.
- Update every accepted affected path, including required types or schemas, configuration, build entries,
  documentation, callers, and obsolete-source cleanup. Make no change outside the recorded set.

#### 3.2 Review the source result without editing

- During read-only review, inspect the complete affected set and process chain in the same
  dependency order used for implementation.
- Compare source, types or schemas, configuration, build entries, documentation, callers, and cleanup with
  the accepted records and current runtime facts. Record exact path and boundary findings.
- Return `accept`, `revise`, or `reject` for the bounded source result with exact findings, affected owners,
  and required handoffs. Do not edit the reviewed source or apply a finding.

### Phase 4 — Verify Construction and Repair Source Failures

#### 4.1 Run construction-only checks

- Select only repository checks that establish construction of the affected source: formatting, lint, type
  checking, compilation or build, emitted-entry inspection, and static consistency checks.
- Run the applicable checks on the exact source result for implementation or read-only review. During
  read-only review, use check-only modes and keep project files read-only; record a required check as
  unavailable when its only form would modify them.
- Record each command or inspection, subject, target, exit status or result, and relevant output. Label every
  result `construction-only`; do not infer runtime behavior or artifact validity.

#### 4.2 Repair the earliest bounded construction failure

- Locate the earliest source, process, loader, lifecycle, configuration, or build boundary that explains the
  construction failure. Keep downstream symptoms attached to that cause.
- During implementation, repair the bounded source cause and repeat the failed check plus every affected
  downstream construction check. Never weaken an accepted security decision, skip a required target, silence
  an error, or report a failed or unrun check as complete.
- During read-only review, return the failure as an exact `revise` or `reject` finding. If the failure exposes
  an invalid accepted decision or out-of-scope source, return it to the earliest owner and stop.

### Phase 5 — Complete the Construction Result and Dynamic Records

#### 5.1 Close at one construction-verified source result

- For implementation, confirm the authorized affected set is complete, construction checks pass, and no
  protected path changed. The terminal state is `construction-verified`.
- For read-only review, return `accept` only when the bounded source result follows accepted records and its
  required construction results are complete. Otherwise return `revise` or `reject` with exact findings.
- Record the source commit or digest, the work type as implementation or read-only review, affected paths,
  process and entry map, targets, construction results, limitations, unresolved facts, and later evidence
  needs. Claim no later lifecycle state.

#### 5.2 Create the dynamic Development → testing record

- Label this record `Dynamic handoff — Development → testing`; it is not a static policy reference.
- Include the source commit or digest, accepted behavior claims, process and entry map, targets, invalid and
  failure cases, required environments, and local construction results. Request that testing select the
  lowest-cost test layer that can observe each behavior.
- Testing later returns environment-classified evidence or failures to the earliest affected owner.
  Development neither creates, interprets, classifies, nor accepts that evidence.

#### 5.3 Create the dynamic verified source outcome → packaging record when needed

- Create this record only when the source result may change an artifact claim. Label it `Dynamic handoff —
  verified source outcome → packaging`; it is not a static policy reference.
- Include the source commit or digest, build inputs, targets, process entries, resources, compiled-module
  assumptions, preload assumptions, path assumptions, and requested artifact claims.
- Packaging owns artifact construction and candidate acceptance. Development creates no candidate, and a
  failed later result reopens the earliest invalid source or decision owner instead of transferring another
  owner's outcome into development.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
- [`electron-contract`](../electron-contract/SKILL.md) owns installed application behavior and recovery claims.
- [`electron-interface`](../electron-interface/SKILL.md) owns observable interface decisions.
- [`electron-design`](../electron-design/SKILL.md) owns technical process, trust, bridge, state, resource, and
  lifecycle decisions.
- [`electron-runtime`](../electron-runtime/SKILL.md) owns current mechanism and pinned-major facts.
