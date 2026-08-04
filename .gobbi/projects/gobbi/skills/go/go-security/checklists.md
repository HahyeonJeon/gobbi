# Go Security Evaluation Checklist

Unchecked evaluation source for Go security work governed by [Go Security](SKILL.md).

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
in this source that the scenario reuses.

## Project

### GOSEC-SC-PROJECT-01 — Normal case: The selected mode has a complete effect contract

The work selects review or change mode for one accepted result. Every write, output, cache, download, command,
network request, credential use, external mutation, publication fact, pause, terminal result, and recovery
should match that mode; inherited or merged authority fails.

#### Checklist

- [ ] GOSEC-CK-PROJECT-01-01 — One named contract records exactly one selected review or change mode, accepted result, and scope.
- [ ] GOSEC-CK-PROJECT-01-02 — Every project-path write, disposable output, scanner, cache, download, project-command execution, and network effect matches the selected mode contract.
- [ ] GOSEC-CK-PROJECT-01-03 — Credential use is recorded as a separate fact with its exact authority or as none.
- [ ] GOSEC-CK-PROJECT-01-04 — External mutation is recorded as a separate forbidden fact.
- [ ] GOSEC-CK-PROJECT-01-05 — Publication is recorded as a separate forbidden fact.
- [ ] GOSEC-CK-PROJECT-01-06 — Every pause point, terminal result, retained path, recovery owner, and first recovery action matches the selected mode.

### GOSEC-SC-PROJECT-02 — Expected failure: Required context or authority is missing

The trust boundary, threat context, protected-data authority, scanner evidence, network authority, or required
verification is absent. The operation should stop before the affected effect and return an exact recoverable
block; a substituted input or weaker claim fails.

#### Checklist

- [ ] GOSEC-CK-PROJECT-02-01 — The operation pauses before every effect whose trust context, scope, authority, destination, handling rule, or evidence is missing or changed.
- [ ] GOSEC-CK-PROJECT-02-02 — The block names its prerequisite or first useful diagnostic, affected obligation, redacted evidence, evidence limit, risk, owner, retained paths and cache state, first recovery action, and handoff.

### GOSEC-SC-PROJECT-03 — Rule violation: Security work performs an external action

A requested change needs secret rotation or provider, identity policy, access policy, or destination mutation.
The security operation must preserve the boundary and use returned evidence from the named owner; direct action
fails even when the requested result otherwise passes.

#### Checklist

- [ ] GOSEC-CK-PROJECT-03-01 — Every required external action routes to a named external-action owner with exact input identity, destination, requested effect, required authority, expected evidence, and recovery boundary.
- Also applies: GOSEC-CK-PROJECT-01-04 (external mutation remains forbidden).
- Also applies: GOSEC-CK-PROJECT-01-05 (publication remains forbidden).

## Structure

### GOSEC-SC-STRUCTURE-01 — Normal case: The security model names its owned objects

The work can span packages, processes, listeners, dependencies, and protected data. The model should identify
the concrete objects and boundaries needed to explain risk; an unnamed system diagram fails.

#### Checklist

- [ ] GOSEC-CK-STRUCTURE-01-01 — The model names every actor, entry point, trust boundary, asset, privilege, process, listener, data store, outbound destination, and network exposure that affects the accepted result.
- [ ] GOSEC-CK-STRUCTURE-01-02 — Every untrusted input names its source, representation, parser or decoder, canonical form, resource bound, validation point, authorization context, and first side effect.
- [ ] GOSEC-CK-STRUCTURE-01-03 — Identity assertion, authentication, and authorization remain distinct decisions with named owners.
- [ ] GOSEC-CK-STRUCTURE-01-04 — Every cryptographic decision, protected-data type, dependency position, vulnerability position, and residual-risk decision has one named owner.

### GOSEC-SC-STRUCTURE-02 — Normal case: Sibling-owned work reaches its owner

Security work can need code construction, module changes, tests, command mechanics, or causal diagnosis. Each
result should remain with its Go owner; restated sibling policy or widened authority fails.

#### Checklist

- [ ] GOSEC-CK-STRUCTURE-02-01 — Code construction routes to `go-development`, module graph work and private-module reads to `go-modules`, evidence design to `go-testing`, scanner and project-command behavior to `go-toolchain`, and causal diagnosis to `go-debugging`.

### GOSEC-SC-STRUCTURE-03 — Poor quality: Controls appear without an attack path

The review lists validation, encryption, authorization, or scanner categories but does not show how an actor
could reach an asset or which path step a control changes. A control inventory without causal structure fails.

#### Checklist

- [ ] GOSEC-CK-STRUCTURE-03-01 — Every threat connects an actor and entry point through explicit exploit prerequisites and trust-boundary crossings to one affected asset and impact.
- [ ] GOSEC-CK-STRUCTURE-03-02 — Every accepted control names the attack-path step it changes, owner, observable behavior, failure behavior, bypass condition, and verification evidence.

## Performance

### GOSEC-SC-PERFORMANCE-01 — Normal case: Security evidence stays bounded and proportionate

A scanner or adversarial input can consume time, memory, disk, processes, or network requests. The evidence
should cover the named risk within approved bounds; broad or unbounded collection fails.

#### Checklist

- [ ] GOSEC-CK-PERFORMANCE-01-01 — Every scanner and project command binds its exact package pattern when applicable, `GOOS/GOARCH` target, inputs, duration, output bound, cache, download, execution, and network effects.
- [ ] GOSEC-CK-PERFORMANCE-01-02 — Every adversarial input and evidence collection stays within the accepted time, memory, disk, process, request, destination, and output bounds.

### GOSEC-SC-PERFORMANCE-02 — Edge case: A vulnerability finding needs reachability analysis

A scanner identifies an affected module version, but the vulnerable behavior may not be built, called, or
reachable in the deployed process. The result should separate those facts before deciding risk; severity-only
triage fails.

#### Checklist

- [ ] GOSEC-CK-PERFORMANCE-02-01 — Every vulnerability finding records its advisory identity, affected module and version range, selected version, source timestamp, vulnerable symbol or behavior, build selection, and evidence limit.
- [ ] GOSEC-CK-PERFORMANCE-02-02 — Finding presence, call reachability, deployed reachability, reported severity, and exploitability remain separate evidence-backed facts.
- [ ] GOSEC-CK-PERFORMANCE-02-03 — The residual-risk decision names exploit prerequisites, affected asset, existing controls, available correction, owner, acceptance authority, and review trigger.

## Aesthetics

### GOSEC-SC-AESTHETICS-01 — Normal case: A finding uses exact security terms

A cold reader should be able to identify what can happen, to which object, by which path, and within which
evidence boundary. A category label without concrete facts fails.

#### Checklist

- [ ] GOSEC-CK-AESTHETICS-01-01 — Every finding names its owned object, trust boundary, actor, entry point, attack path, affected asset, observed evidence, reachability, exploit prerequisites, control, correction options, residual risk, and evidence limits.

### GOSEC-SC-AESTHETICS-02 — Poor quality: Generic labels hide the claim

The account uses a generic protection or correction label without naming the exact behavior. Familiar labels
should not substitute for protected-data types, validation, authorization, cryptographic properties, owners,
or evidence.

#### Checklist

- [ ] GOSEC-CK-AESTHETICS-02-01 — Every protected-data claim names the exact credential, key, token, secret, personal record, regulated record, or private-module setting type instead of relying on a generic label.
- [ ] GOSEC-CK-AESTHETICS-02-02 — Every control and correction claim names the exact validation, canonicalization, encoding, authorization, cryptographic property, resource bound, owner, and evidence that applies instead of a vague action word.

## Usage

### GOSEC-SC-USAGE-01 — Normal case: Review mode returns verified findings without mutation

Review mode examines an unchanged subject through its authorized evidence paths. It should return findings and
residual risk without formatting, tidying, generating, changing dependencies, mutating external state, or
publishing.

#### Checklist

- [ ] GOSEC-CK-USAGE-01-01 — Review mode leaves every project source, module, workspace, generated, configuration, test, and documentation path byte-unchanged.
- [ ] GOSEC-CK-USAGE-01-02 — Review mode returns each finding's severity source, reachability, exploit prerequisites, controls, evidence, evidence limits, and residual risk.
- Also applies: GOSEC-CK-PROJECT-01-02 (review effects match the selected contract).

### GOSEC-SC-USAGE-02 — Normal case: Change mode returns a complete verified security change

The accepted result needs code or module changes and may depend on one named external action. The security
operation should consume owner-produced changes and exact returned evidence, then verify the final Go-domain
result; a partial control or focused-only pass fails.

#### Checklist

- [ ] GOSEC-CK-USAGE-02-01 — The final changed-path set is the authorized `go-development` or `go-modules` result for the accepted security design.
- [ ] GOSEC-CK-USAGE-02-02 — Verification covers every accepted attack path and control on the exact final tree.
- Also applies: GOSEC-CK-PROJECT-01-04 (change mode performs no external mutation).
- Also applies: GOSEC-CK-PROJECT-01-05 (change mode performs no publication).
- Also applies: GOSEC-CK-USAGE-04-01 (required external-owner evidence matches the exact action).

### GOSEC-SC-USAGE-03 — Expected failure: Protected-value handling is incomplete

A scanner, private dependency, cryptographic check, or external-state verification needs a credential or other
protected value. The operation should stop unless every authority, delivery, process, evidence, cache, retention,
and non-persistence field is exact; a generic secret-handling statement fails.

#### Checklist

- [ ] GOSEC-CK-USAGE-03-01 — Every protected-value read or verification has exact current authority for its named type, purpose, scope, source, and destination.
- [ ] GOSEC-CK-USAGE-03-02 — Every protected value enters through one named ephemeral delivery mechanism and injection point.
- [ ] GOSEC-CK-USAGE-03-03 — Every protected-value use names the receiving process and its child-process inheritance boundary.
- [ ] GOSEC-CK-USAGE-03-04 — Every diagnostic, log, scanner report, command result, and returned evidence applies the declared field-level redaction.
- [ ] GOSEC-CK-USAGE-03-05 — Every cache, retention, and cleanup boundary excludes credential values and private settings from retained data.
- [ ] GOSEC-CK-USAGE-03-06 — Non-persistence evidence covers project files, generated output, diagnostic output, logs, command arguments, command history, environment files, process inheritance, and retained caches.

### GOSEC-SC-USAGE-04 — Expected failure: Required external-owner evidence is absent

The accepted Go change depends on secret rotation or another provider, policy, or destination action. The
security operation should verify current returned evidence or preserve an exact block; an assertion that the
action happened fails.

#### Checklist

- [ ] GOSEC-CK-USAGE-04-01 — Returned evidence names the external-action owner, exact action, input identity, destination, redacted before and after state, result, time or action identity, and evidence limits.
- [ ] GOSEC-CK-USAGE-04-02 — Missing, stale, changed, or mismatched external-owner evidence produces a block naming the owner, prerequisite, affected obligation, risk, retained paths and redacted evidence, first recovery action, and handoff.

## Consistency

### GOSEC-SC-CONSISTENCY-01 — Rule violation: Authentication and authorization are merged

The work proves an identity but assumes that identity may perform every requested action or access every
resource. Authentication should not replace a decision about actor, action, resource, ownership, or tenant;
one generic access check fails.

#### Checklist

- [ ] GOSEC-CK-CONSISTENCY-01-01 — Every identity assertion names its authentication mechanism, freshness or replay boundary, failure behavior, and evidence independently of authorization.
- [ ] GOSEC-CK-CONSISTENCY-01-02 — Every authorization decision binds the authenticated actor, action, resource, ownership or tenant boundary, decision point, deny behavior, and evidence.

### GOSEC-SC-CONSISTENCY-02 — Edge case: Cryptography lacks a key-lifecycle owner

The code uses a project-selected algorithm or protocol, but key generation, storage, rotation, revocation, or
failure behavior is implicit. The result should preserve the security property and name every key-lifecycle
owner without performing external rotation.

#### Checklist

- [ ] GOSEC-CK-CONSISTENCY-02-01 — Every cryptographic decision names its algorithm or protocol, required property, key or nonce source, custody owner, storage boundary, randomness source, failure behavior, interoperability constraint, and verification.
- [ ] GOSEC-CK-CONSISTENCY-02-02 — Every key generation, rotation, and revocation action has a named external-action owner with returned evidence or an exact block.

### GOSEC-SC-CONSISTENCY-03 — Normal case: The terminal record preserves the security result

The next owner needs the exact result without private conversation context. Every terminal branch should carry
the universal operation core and the security-specific facts; fluent prose with missing fields fails.

#### Checklist

- [ ] GOSEC-CK-CONSISTENCY-03-01 — The terminal record names the operation and mode, accepted result, decision basis, actual owned object, one universal terminal state, and changed or reviewed paths.
- [ ] GOSEC-CK-CONSISTENCY-03-02 — The terminal record names project-command evidence, evidence limits, external reads or effects, and the compatibility decision when applicable.
- [ ] GOSEC-CK-CONSISTENCY-03-03 — The terminal record names block, recovery, and handoff fields or gives an evidence-based not-applicable reason for each one.
- [ ] GOSEC-CK-CONSISTENCY-03-04 — The terminal record names trust boundaries, actors, entry points, assets, untrusted inputs, identity, authentication, authorization, threats, attack paths, controls, cryptographic decisions, key-lifecycle owner, protected-data flows, dependency and vulnerability positions, network exposures, verification, and residual risk.

## Risk

### GOSEC-SC-RISK-01 — Adversarial: Scanner severity is presented as exploitability

A scanner reports a high-severity advisory for a selected module. The vulnerable symbol may be absent,
unreachable, or protected by an unmet prerequisite, so severity and a clean exit status cannot decide the
Go-domain risk alone.

#### Checklist

- [ ] GOSEC-CK-RISK-01-01 — No reported severity is represented as exploitability without build selection, call reachability, deployed reachability, exploit prerequisites, affected asset, and control evidence.
- [ ] GOSEC-CK-RISK-01-02 — No clean scanner result is represented beyond its tool version, advisory snapshot, module graph, build selection, analyzed paths, inputs, and execution limits.

### GOSEC-SC-RISK-02 — Adversarial: Protected values leak through execution or evidence

A credential or key works when injected through a command argument, broad process environment, retained cache,
or verbose scanner output. Functional success should not authorize exposure or persistence.

#### Checklist

- [ ] GOSEC-CK-RISK-02-01 — No actual credential, key material, plaintext secret, personal record, regulated record, or private-module setting appears in a project path, generated output, diagnostic output, log, command argument, command history, environment file, returned evidence, or retained cache.
- [ ] GOSEC-CK-RISK-02-02 — Every authority, purpose, scope, source, destination, delivery, injection, process, inheritance, redaction, cache, or retention change pauses before protected-value use.
- [ ] GOSEC-CK-RISK-02-03 — Every changed protected-value field has a new exact current-authority decision before use resumes.

### GOSEC-SC-RISK-03 — Edge case: Returned external-owner evidence is stale or mismatched

The external action was verified for another credential version, input checksum, provider account, policy,
destination, or earlier time. Evidence for a different action identity cannot complete the current result.

#### Checklist

- [ ] GOSEC-CK-RISK-03-01 — Every returned external-owner result matches the current owner, action, input identity, destination, required before and after state, and evidence boundary.
- [ ] GOSEC-CK-RISK-03-02 — Changed or stale external-owner evidence remains outside the completion claim until its named owner returns evidence for the current exact action.

## Overall

### GOSEC-SC-OVERALL-01 — Normal case: The complete security result is verified

The requested result is either a review or a change. Completion should cover the accepted trust boundaries,
threats, controls, evidence, ownership, effect boundary, and residual risk for that mode.

#### Checklist

- [ ] GOSEC-CK-OVERALL-01-01 — Review completion includes verified findings, control evidence, evidence limits, residual risk, protected-value handling when used, and explicit absence of external mutation and publication.
- [ ] GOSEC-CK-OVERALL-01-02 — Change completion includes the authorized final tree, verified controls, project-command evidence, protected-value handling when used, exact current external-owner evidence when required, residual risk, and explicit absence of external mutation and publication by this operation.

### GOSEC-SC-OVERALL-02 — Adversarial: Cosmetic security language masks an incomplete result

The work has threat-model headings, scanner output, encryption or authorization words, and a polished terminal
record, but it lacks an attack path, control evidence, effect boundary, or residual-risk decision. Form without
the owned result should fail.

#### Checklist

- [ ] GOSEC-CK-OVERALL-02-01 — No heading set, scanner result, control label, or polished terminal record substitutes for the exact attack paths, control evidence, mode effects, protected-value handling, external-owner boundary, and residual risk required by the accepted result.
