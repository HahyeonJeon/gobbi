---
name: go-security
description: "MUST load when Go work crosses a trust boundary; handles untrusted input, identity, authorization, cryptography, secrets, sensitive data, dependencies, vulnerability findings, network exposure, or security review."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Go Security

Go Security reviews or coordinates changes to Go work that crosses a trust boundary. It returns a verified
security review or a complete verified security change with exact evidence and residual risk.

This operation owns trust boundaries, threat and attack-path analysis, protected-data handling, dependency and
vulnerability decisions, network-exposure judgment, and the Go-domain security result. General construction,
module changes, evidence design, project-command mechanics, and causal diagnosis remain with their named Go
siblings. External mutation and publication remain with a named external-action owner.

## Principles

### Bind the exact trust and data flow

A security claim begins with the actors, entry points, trust boundaries, assets, protected-data types, and
network paths that exist in the accepted subject. A generic claim about a package or service cannot replace
that map.

### Prove attack paths and controls

A finding connects an actor and entry point to an affected asset through explicit prerequisites. A control
changes one step in that path and has observable evidence; a scanner label or control name alone proves neither
reachability nor exploitability.

### Minimize protected-value authority and lifetime

Each credential, key, token, secret, personal record, regulated record, or private-module setting has one exact
purpose, scope, destination, delivery path, receiving process, retention boundary, and non-persistence proof.
No operation convenience broadens those fields.

### Preserve residual risk and external ownership

Verification narrows risk only within its executed inputs and environment. Remaining attack paths keep their
owner and decision authority, and every external action stays with its named owner through returned evidence or
an exact block.

## Rules

- **MUST select exactly one review or change mode and bind its complete effect contract before any project
  command, scanner, read, download, network request, credential use, or write.**
- **MUST map actors, entry points, trust boundaries, assets, untrusted inputs, protected-data flows, network
  exposures, threats, attack paths, controls, evidence, and residual risk for the accepted subject.**
- **MUST keep identity assertion, authentication, authorization, cryptography, key custody, protected-data
  handling, dependency presence, vulnerability reachability, exploitability, and residual risk as distinct
  claims with named owners.**
- **MUST bind every protected-value read or verification to exact current authority, type, scope, source,
  destination, ephemeral delivery, injection point, receiving process, inheritance boundary, redaction, cache,
  retention, cleanup, and non-persistence evidence.**
- **MUST route code construction, module graph work, evidence design, project-command mechanics, causal
  diagnosis, and external actions to their named owners and consume exact returned evidence without inheriting
  their authority.**
- **NEVER expose or persist a protected value, infer credential or network authority, perform external mutation
  or publication, equate scanner severity with exploitability, or claim completion across a required evidence
  gap.**

## Procedure

### Phase 1 — Bind the Security Result

#### 1.1 Bind the accepted result and security subject

- Read the accepted result, scope, decisions, project instructions, security requirements, prior findings,
  incident evidence, affected consumers, and deployment context. Name whether the requested result is a
  verified security review or a complete verified security change.
- Record the minimum supported Go version, selected Go toolchain version, module's Go language version,
  module path, dependency graph, workspace, supported `GOOS/GOARCH` targets, cgo boundary, project commands,
  and exact package patterns only as project-command selectors or evidence.
- Name every owned object that enters the result: package name, import path, package directory or placement,
  package boundary, public API or CLI, process, listener, network destination, data store, dependency,
  vulnerability finding, credential type, key material type, or protected-data type. Map affected callers,
  generated inputs and outputs, configuration inputs, tests, and documents without recording a protected value.
- Preserve the baseline source, dependency, configuration, scanner, and runtime evidence needed to compare the
  final result. Stop when the accepted scope, trust context, required owner, or protected-data type is unknown.

#### 1.2 Select review or change mode and bind effects

- Select exactly one mode. Authority in one mode or sibling does not transfer to another effect.
- **Review mode:** project paths are read-only; disposable writes are approved scanner reports and diagnostic
  outputs with named retention or cleanup boundaries; every scanner, cache, and download effect is separately
  authorized; project execution is limited to authorized named scanners and other named project commands;
  every network effect is separately authorized; credential use is separately authorized for one exact named
  read or verification scope and destination; external mutation and publication are forbidden. Pause before
  credential use, scanner download, network access, protected-value exposure, or mutation. The terminal result
  is a verified review with residual risk or an exact trust or evidence block. Recovery retains only redacted
  evidence at approved paths and names the recovery owner and first action.
- **Change mode:** project writes occur only through authorized `go-development` or `go-modules` work;
  disposable writes are approved diagnostics with named retention or cleanup boundaries; every scanner,
  cache, and download effect is separately authorized; project execution is limited to authorized verification
  commands and named scanners; network access is separately authorized. Credential use is separately
  authorized only for one exact named read or verification need, protected scope and destination, ephemeral
  delivery, redacted evidence, declared cache state, and no credential or private-setting persistence.
  External mutation and publication are forbidden. Pause before a material trust choice, credential use,
  download, network access, external mutation, or publication request. The terminal result is a verified Go
  security change with residual risk and exact evidence returned by the named external-action owner, or an
  exact block. Recovery retains redacted evidence, declared cache state, and authorized changed paths, and
  names the external-action owner, prerequisite, first recovery action, and handoff.

#### 1.3 Bind sibling owners and material decisions

- Route general code construction and review to `go-development`; module graph edits and private-module reads
  to `go-modules`; evidence selection and interpretation to `go-testing`; scanner and project-command behavior
  to `go-toolchain`; and causal diagnosis of a failure to `go-debugging`. Consume each returned result without
  copying its owner's procedure or widening its authority.
- Identify material choices about trust boundaries, identity, authorization, cryptography, key custody,
  protected-data flow, dependency acceptance, network exposure, verification strength, residual risk, or an
  external effect. Cite the accepted decision whose context still matches, or pause with compared alternatives,
  a recommendation, the decision owner, and the exact question before design-dependent work.
- Name every external action the result may require, including secret rotation and provider, identity policy,
  access policy, or destination mutation. Record its named external-action owner, exact input identity,
  destination, requested effect, prerequisites, still-required authority, expected returned evidence, and
  recovery boundary. Neither security mode performs the action.

### Phase 2 — Model Threats and Risk

#### 2.1 Map trust boundaries, assets, data, and exposure

- Draw the request and data path across callers, public APIs or CLIs, processes, goroutines, packages, modules,
  listeners, outbound destinations, stores, queues, files, and operating-system resources. Mark each trust
  boundary, actor, entry point, asset, privilege, identity source, and network exposure.
- For every untrusted input, name its source, representation, parser or decoder, canonical form, size or work
  bound, validation point, authorization context, and first side effect. Include path, archive, template,
  structured-data, command, environment, header, query, and message inputs only when they exist in the subject.
- Distinguish identity assertion, authentication, and authorization. Bind each authorization check to the actor,
  action, resource, ownership or tenant boundary, decision point, deny behavior, and evidence that exercises it.
- Before any credential, authentication token, private key, signing key, plaintext secret, personal record,
  regulated record, private-module setting, or other protected value is read, name its type, owner, exact scope,
  source, destination, read or verification purpose, current authority, ephemeral delivery mechanism, injection
  point, receiving process, child-process inheritance, redaction fields, cache location, retention boundary,
  cleanup owner, and proof of non-persistence. Keep protected values out of command arguments, project files,
  generated output, diagnostic output, logs, returned evidence, command history, environment files, and retained
  caches.

#### 2.2 Model threats, attack paths, and controls

- For each supported threat, write the attack path from actor and entry point through required conditions and
  trust-boundary crossings to the affected asset and impact. Separate an observed weakness, exploit
  precondition, contributing condition, and demonstrated impact.
- Map every preventive, detective, and recovery control to the attack-path step it changes. Name its owner,
  configuration or code boundary, expected observable behavior, failure behavior, bypass conditions, and
  verification evidence. A control name or scanner category alone is not evidence.
- For identity and access work, challenge missing, stale, forged, replayed, cross-tenant, cross-resource, and
  confused-deputy cases. For parsers and resource use, challenge malformed, oversized, recursive, duplicate,
  ambiguous, and cancellation-resistant inputs within approved execution bounds.
- For cryptography, name the project-selected algorithm or protocol, security property, key or nonce source,
  key custody owner, storage boundary, rotation owner, revocation path, randomness source, failure behavior,
  interoperability constraint, and verification. Do not invent a primitive or let this operation perform key
  or secret rotation.

#### 2.3 Analyze dependencies, vulnerabilities, and residual risk

- Use the `go-modules` result to identify each affected direct or transitive module, selected version,
  replacement, `GOOS/GOARCH` or cgo constraint, provenance, and consumer. Use `go-toolchain` for the project-selected
  vulnerability scanner, database or advisory snapshot, invocation, and observed effects. Use the official
  [Go vulnerability management guidance](https://go.dev/doc/security/vuln/) as context for findings and
  reachability without selecting a scanner for the project.
- For every vulnerability finding, record the advisory identity, affected module and version range, observed
  selected version, scanner or source timestamp, severity as reported by its owner, vulnerable symbol or
  behavior, build selection, call reachability, deployed reachability, exploit prerequisites, affected asset,
  existing controls, available correction, and evidence limits. Presence, call reachability, deployed
  reachability, severity, and exploitability are separate facts.
- Decide each dependency or vulnerability position as accept, correct, replace, remove, or block through the
  current decision owner. Route graph changes to `go-modules` and code changes to `go-development`.
- Record residual risk after accepted controls: threat, remaining attack path, affected asset, likelihood basis,
  impact, evidence limit, compensating control, owner, acceptance authority, review date or trigger, and first
  recovery action. A clean scanner result excludes only the selected tool, database snapshot, module graph,
  build selection, and paths it actually analyzed.

### Phase 3 — Review or Coordinate the Change

#### 3.1 Perform the security review

- In review mode, inspect the bound source, dependency graph, build constraints, configuration inputs, generated
  provenance, tests, and runtime evidence without changing project paths. Run only the authorized project
  commands, scanners, reads, downloads, and network requests from the bound effect contract.
- Test the threat model against ordinary, boundary, failure, and adversarial paths. Record each finding with its
  owned object, trust boundary, attack path, affected asset, observed evidence, severity source, reachability,
  exploit prerequisites, existing control, correction options, residual risk, and evidence limits.
- Challenge a claimed pass with at least one control-bypass or contradictory case. Return verified findings and
  explicit residual risk; do not convert absence of a scanner finding into proof that no threat exists.

#### 3.2 Coordinate the accepted security change

- In change mode, hand the accepted code design and exact authorized paths to `go-development`, or the accepted
  dependency and module design to `go-modules`. Consume their changed-path, caller, compatibility, and project-
  command evidence without taking over construction or graph ownership.
- Confirm the returned change addresses the earliest responsible attack-path step. Validate untrusted input
  before its first side effect, enforce authorization at the actor-action-resource boundary, preserve deny and
  error behavior, bound resource use, and keep cryptographic and protected-value lifetimes within the accepted
  design.
- Apply the protected-value contract from Step 2.1 to every authorized read or verification. Stop when authority,
  scope, destination, delivery, injection, process boundary, redaction, cache, retention, or non-persistence
  evidence changes or is missing.
- Hand every secret rotation or provider, identity policy, access policy, destination, or other external
  mutation to its named external-action owner. Verify only returned evidence that names the owner, exact action,
  input identity, destination, before and after state with protected values redacted, result, time or action
  identity, and evidence limits. Missing, stale, or mismatched evidence is an exact block.

#### 3.3 Verify the complete security result

- Use `go-testing` to select evidence for the modeled threats and accepted controls. The official
  [Go security best practices](https://go.dev/doc/security/best-practices) supply context for source,
  dependency, fuzzing, race, and analysis evidence without replacing the project contract. Applicable evidence
  may include focused tests, fuzzing, race detection, integration checks, authorization matrices,
  malformed-input cases, dependency analysis, or scanner results; select only what answers the named risk.
- Use `go-toolchain` to bind every project command, exact package pattern, selected Go toolchain version, flags,
  `GOOS/GOARCH` target, inputs, duration, standard output, standard error, exit status, first useful diagnostic,
  caches, downloads, network effects, and evidence limits. Verify the exact unchanged review subject or exact
  final changed tree.
- Recheck trust boundaries, attack paths, identity, authentication, authorization, cryptography, protected-data
  handling, dependency reachability, network exposure, any evidence returned by the named external-action
  owner, and residual risk. Keep every unexecuted path, unsupported `GOOS/GOARCH` target, unavailable scanner
  database, and blocked external action outside the completion claim.
- When this result enters Evaluation, apply the [evaluation checklist](checklists.md) and every active Go sibling
  checklist. General Evaluation owns evidence resolution and verdicts.

### Phase 4 — Stop or Return

#### 4.1 Preserve an exact block and recovery boundary

- Stop before a missing trust or deployment context, unresolved material choice, unapproved project write or
  diagnostic output, unavailable scanner or advisory evidence, unauthorized cache or download, network request,
  credential use, protected-value exposure, external mutation, publication, stale evidence returned by the
  named external-action owner, or required verification gap. Do not substitute another scope, destination,
  credential, tool, target, or weaker claim.
- Return the missing prerequisite or first useful diagnostic, affected obligation, current redacted evidence,
  evidence limits, risk, owner, approved retained paths, declared cache state, authorized changed paths,
  protected-value non-persistence evidence, first recovery action, and handoff. Retain no actual credential,
  key material, plaintext secret, personal record, regulated record, or private-module setting.
- An execution error, cancellation, or timeout that prevents the requested result remains a block and uses its
  matching universal terminal state. Preserve partial findings and changed paths without calling the review or
  change verified.

#### 4.2 Return the terminal record

- Return the universal fields, naming why any field is not applicable: operation and mode; accepted result;
  decision basis; actual owned object; terminal state selected from `success`, `error`, `cancellation`,
  `timeout`, `blocked`, or `user-decision pause`; changed or reviewed paths; project-command evidence; evidence
  limits; external reads or effects; compatibility decision selected from `compatible`, `migration supplied`,
  `authorized break`, or `unsupported` when applicable; block; recovery; and handoff.
- Add the security fields: trust boundaries; actors; entry points; assets; untrusted inputs; identity,
  authentication, and authorization decisions; threats and attack paths; controls and bypass conditions;
  cryptographic decisions and key-lifecycle owner; protected-data types and flows; dependency and vulnerability
  positions; network exposures; verification; and residual risk.
- Record credential use separately from external mutation. For every credentialed read or verification, return
  only the credential type, exact authority, scope, destination, ephemeral delivery, injection point, receiving
  process and inheritance boundary, redaction, cache and retention boundary, and non-persistence evidence. Return
  no protected value. Record external mutation and publication as not performed by this operation.
- For an external-action handoff, return the owner, action, exact input identity, destination, authority still
  required, returned evidence or its absence, retained project paths and redacted evidence, first recovery
  action, and handoff. Complete only with a verified review and residual risk in review mode, or a complete
  verified security change, exact evidence returned by the named external-action owner when required, and
  residual risk in change mode. Otherwise return the exact block without calling it success.

## References

- [Evaluation checklist](checklists.md) is the local unchecked evaluation source for this skill.
