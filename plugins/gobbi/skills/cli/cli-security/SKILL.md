---
name: cli-security
description: "MUST load when a line-oriented CLI change accepts untrusted input, crosses a filesystem, process, shell, network, credential, update, telemetry, or terminal-control trust boundary, can cause destructive or partial effects, or requires CLI security analysis."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# CLI Security

CLI Security guides the reviewer who derives one assurance contract for an exact line-oriented CLI change.
It maps actors, assets, inputs, effects, threats, authority, controls, evidence, failure, recovery, and residual
risk before returning the contract to implementation, release, or lifecycle coordination owners.

This operation owns CLI-specific threat and control judgment. It does not implement TypeScript controls, run
tests, produce supply artifacts, use credentials, perform delivery or release actions, or define generic
organizational security policy.

## Principles

### Bind assurance to the exact CLI path

A security claim is valid only for the named command, inputs, execution and delivery identities, target tuple,
effects, and evidence. A nearby runtime, entry, shell, artifact, or clean environment proves a different subject.

### Follow untrusted data to its first effect

Arguments, stdin, environment, configuration, paths, process output, network data, and terminal text remain
untrusted until the responsible boundary establishes their accepted form and authority.

### Make controls and recovery observable

Every material threat needs a prevention or containment requirement, one implementation owner, one evidence
owner, safe failure, and recovery. A warning, scanner label, escaping claim, or test name alone is not assurance.

### Preserve user authority and residual risk

Readiness never grants authority for a destructive, credentialed, network, update, telemetry, or external
effect. Missing proof, unsafe recovery, and accepted exceptions remain visible to their decision owner.

## Rules

- **MUST bind the exact assurance subject and authority before analysis.** Record the command path, semantic
  contract, expression contract, execution and delivery identities, target tuple, inputs, effects, evidence,
  write boundary, decision owner, and every separately authorized action.
- **MUST trace every material threat from actor and entry point through trust crossings to an affected asset
  and consequence.** Record prevention, containment, detection, safe failure, cleanup, recovery, residual risk,
  and reopen conditions for each path.
- **MUST bind every required control to one implementation owner and one proving evidence owner.** A control
  without exact expected behavior, failure behavior, evidence identity, and evidence limit is incomplete.
- **MUST treat destructive scope, secrets, networks, updates, telemetry, dependency scripts, ambient runtime
  controls, and external effects as explicit authority boundaries.** Readiness, a prompt, a TTY, or prior access
  never supplies current authority.
- **MUST stop when an answer-changing trust fact, owner, authority, evidence path, containment duty, or safe
  recovery path is missing or contradictory.** Preserve the safe state, retained effects, risk, first missing
  obligation, recovery owner, and resume condition.
- **NEVER implement or test controls, read or use credentials, build or publish artifacts, perform delivery or
  release actions, or accept residual risk from this operation.** Route each result to its named owner.

## Procedure

### Phase 1 — Bind the assurance subject

#### 1.1 Fix the result, scope, and authority

- Start from one accepted CLI change or one requested CLI security review. Name the reviewer, decision owner,
  affected users and automation, observable assurance outcome, and exact completion evidence.
- Record the canonical command and aliases, `cli-architecture`-owned semantic contract, `cli-interface`-owned expression
  contract, exact source or artifact, runtime and target tuple, delivery form and consumer entry, current
  `cli-platform` facts, changed and reviewed paths, existing evidence identities, evidence dates, and any shipped
  Bash, Zsh, Fish, or PowerShell completion path.
- Classify every requested write, process execution, network access, credential use, package action, delivery,
  publication, installation, update, telemetry action, or destructive probe. This operation performs none of
  those effects merely because it reviews them; name the separate owner and current authority when required.
- Continue only when the subject and analysis boundary are exact. Otherwise return the first missing identity,
  scope choice, authority, or owner as a stop with the current safe state and resume condition.

#### 1.2 Inventory actors, assets, inputs, effects, and trust crossings

- Inventory users, automation, administrators, child processes, shells, package and delivery actors, network
  services, update sources, telemetry recipients, and attackers that can affect the command path.
- Inventory executable identity, command authority, files and directories, configuration and state, process
  and terminal state, credentials and sensitive data, network data, update units, telemetry data, logs,
  diagnostics, support material, and retained partial effects.
- Trace each input from source and representation to parsing, canonicalization, validation, authorization,
  first side effect, output, persistence, cleanup, and recovery. Include arguments and option-shaped operands,
  stdin, environment, configuration, current directory, paths and links, process output, network data, update
  metadata, dependency scripts, partial shell-completion input, local completion-lookup data, and terminal-bound
  text when they exist. Treat both completion inputs as untrusted even when they originate on the local system.
- Mark trust changes across parser, filesystem, process, shell, terminal, network, credential, package,
  update, telemetry, privilege, and consumer-entry boundaries. Record an absent class as not applicable with
  an exact reason; an unexplained omission returns to this step.

### Phase 2 — Model threats, failure, and recovery

#### 2.1 Analyze input, identity, and interpretation threats

- For arguments and operands, analyze ambiguous grammar, option injection before and after `--`, repeated or
  conflicting inputs, passthrough arguments, control characters, oversized work, and target-program option
  interpretation. Direct argument arrays reduce shell interpretation but do not prevent a target program from
  treating attacker-controlled values as options.
- For stdin, environment, configuration, and current directory, analyze hidden prompts, unbounded input,
  malformed or duplicate data, secret input, hostile variables, discovered files, precedence changes, search
  traversal, and ambient runtime controls. Require every ambient source to be disabled or intentionally placed,
  disclosed, ordered, reviewed, and proved for the exact consumer entry.
- For executable and process identity, analyze path search, same-name shadowing, links, aliases, shebangs,
  child-process inheritance, descriptors or handles, environment, working directory, privilege, cancellation,
  and confused parent or child identity. Shell entry is exceptional and needs an accepted reason, exact shell
  and grammar, bounded interpolation, command identity, inherited-state policy, and stronger evidence.
- Treat the current [Bun Shell](https://bun.com/docs/runtime/shell) escaping contract as one bounded mechanism
  fact. It does not establish nested-shell safety, executable identity, target-program option handling,
  authorization, filesystem safety, or recovery.
- For shipped completion, analyze command and option injection from partial input and candidates, secret
  dependency and disclosure, unintended mutation, prompts, and default network access. Require candidate
  escaping for the exact requesting Bash, Zsh, Fish, or PowerShell grammar; escaping for one shell is not
  evidence for another, and no candidate is evaluated to prove that it is safe.
- Treat local dynamic completion lookup as a separate trust crossing. Accept it only with declared cost,
  failure, and privacy bounds; model denial, dependency failure, timeout, and cancellation so every path stays
  inert, secret-free, and bounded and has explicit cleanup and recovery behavior.
- For displayed untrusted text, analyze terminal escape and control sequences, OSC links, carriage return and
  line forging, bidirectional controls, invisible characters, confusable Unicode, truncation, and misleading
  quoting. Route readable safe expression to
  [`cli-interface`](../cli-interface/SKILL.md) without allowing color, layout, or warning prose to become the
  control.
- Record each attack path with actor, capability, entry, preconditions, trust crossings, affected asset,
  consequence, existing control, bypass condition, and evidence gap. Continue when every material path is
  represented; otherwise return to Step 1.2.

#### 2.2 Analyze filesystem, network, supply, and data threats

- For every filesystem effect, bind the accepted root and object identity, path normalization boundary,
  traversal policy, link and race policy, create or replace semantics, overwrite and collision behavior,
  permissions, temporary state, atomicity or recoverable transition, cleanup, and retained failure state.
- For subprocesses and explicit shells, bind executable resolution, argument or command boundary, input and
  output trust, inherited environment and handles, privileges, resource bounds, signals, downstream closure,
  exit interpretation, cleanup, and child recovery. A successful spawn or zero exit does not prove the
  requested effect completed safely.
- For each network, credential, update, or telemetry path, bind destination identity, transported data,
  disclosure, necessity, default state, authorization, timeout, cancellation, replay or duplicate behavior,
  redaction, retention, deletion, failure, partial effect, and recovery. Secret values must not enter argv,
  ordinary output, machine output, completion, logs, support bundles, retained diagnostics, or child state
  unless an accepted requirement defines a protected boundary.
- For dependency lifecycle scripts and delivered units, bind the exact dependency or unit identity, source,
  integrity and provenance requirement, script policy, execution boundary, network and credential access,
  produced state, failure, cleanup, and recovery. Route package supply mechanisms to
  [`typescript-packaging`](../../typescript/typescript-packaging/SKILL.md) and direct non-archive controls to
  [`typescript-cli-delivery`](../../typescript/typescript-cli-delivery/SKILL.md).
- Record each threat and current control against the exact input, filesystem, process, shell, network,
  credential, update, telemetry, package, or delivery boundary. A generic scanner category or supply-chain
  label does not close a path.

#### 2.3 Analyze destructive, interrupted, and partial states

- Classify each command path as read-only, dry-run, mutating, destructive, retryable, idempotent, resumable,
  cancelled, partial, recovered, or not applicable. Preserve `cli-architecture`-owned semantic state and
  `cli-interface`-owned expression while adding the trust, authority, containment, and recovery obligations.
- Bind destructive authority to the canonical scope and exact effect. Interactive confirmation must restate
  that scope and cannot authorize a changed subject; non-interactive execution needs an explicit accepted
  authority source and never infers consent from a missing prompt, TTY, environment, or default.
- Model validation failure, denial, dependency failure, downstream close, timeout, signal, cancellation,
  process crash, partial write, cleanup failure, retry, rollback where defined, and forward recovery. Record
  which effects never began, completed, remain, are uncertain, or require a separate owner.
- Require the failure path to preserve the first useful diagnostic, current authoritative state, retained
  effects, safe cleanup, exact recovery action or operator handoff, and idempotency or resume boundary.
  Cosmetic warnings, dry-run labels, and zero status do not close an unsafe effect.
- Continue only when every modeled path ends in complete assurance, a safe recoverable state, or an explicit
  stop. Return an uncontained or unrecoverable path to the owning product decision before control assignment.

### Phase 3 — Bind controls, owners, and evidence

#### 3.1 Create the threat and control record

- For each material threat, write one requirement and map it to the exact attack-path step it changes. State
  preventive, containment, disclosure, detection, redaction, authority, cancellation, cleanup, and recovery
  behavior only where the subject requires them.
- Record the control boundary, expected observable behavior, deny or failure behavior, bypass conditions,
  implementation owner, evidence owner, exact evidence subject, ordinary and adversarial evidence needs,
  evidence limits, retained risk, and reopen trigger. Keep requirement ownership here while mechanisms remain
  with their routed owners.
- Route semantic command, state, stream, and compatibility changes to
  [`cli-architecture`](../cli-architecture/SKILL.md); safe wording and rendering to
  [`cli-interface`](../cli-interface/SKILL.md); and
  current execution-platform facts to [`cli-platform`](../cli-platform/SKILL.md).
- Route TypeScript realization and external-input modeling to
  [`typescript-development`](../../typescript/typescript-development/SKILL.md) and
  [`typescript-typing`](../../typescript/typescript-typing/SKILL.md); runtime and adversarial proof to
  [`typescript-testing`](../../typescript/typescript-testing/SKILL.md); package-backed supply mechanics to
  [`typescript-packaging`](../../typescript/typescript-packaging/SKILL.md); direct non-archive mechanics to
  [`typescript-cli-delivery`](../../typescript/typescript-cli-delivery/SKILL.md); and compiler or Bun
  mechanism facts to [`typescript-toolchain`](../../typescript/typescript-toolchain/SKILL.md).
- For completion, retain threat, control, assurance, stop, recovery, and residual-risk ownership here. Route
  schema and semantic behavior to `cli-architecture`, expression to `cli-interface`, generator implementation and source
  logic to TypeScript Development, compiler, build, runtime, and other tool mechanisms used by the generator
  to TypeScript Toolchain, and exact-shell
  ordinary, adversarial, denial, failure, cancellation, cleanup, and recovery evidence to TypeScript Testing.
  Require separate evidence for every shipped Bash, Zsh, Fish, and PowerShell path.
- Stop when one requirement lacks an owner, one owner lacks an exact evidence route, or a proposed control
  merely hides input, adds a warning, relies on escaping outside its bound, or moves enforcement away from the
  authority boundary.

#### 3.2 Reconcile returned evidence without executing it

- Consume evidence only when it names the exact requirement, control, final implementation or unit identity,
  consumer entry, runtime and target tuple, environment, method, date, result, failure signal, and limitation.
  This operation requests or reviews evidence; `typescript-testing` and the applicable delivery owner execute
  their mechanisms.
- Challenge each claimed control with its option-shaped, malformed, oversized, spoofed, hostile-environment,
  shadowed-executable, link-race, terminal-forging, secret-leak, denied-authority, interrupted, partial, and
  recovery cases when those paths apply. Record a case as unproved when exact evidence is absent.
- Challenge shipped completion with command-shaped and option-shaped partial input, shell metacharacters,
  secret-bearing lookup data, denied and failed lookup, attempted prompting, mutation, network access,
  cancellation, cleanup, and recovery in each shipped shell. A safe Bash result does not prove Zsh, Fish, or
  PowerShell, and a generation-unit result does not replace behavior evidence from the exact consumer path.
- Keep implementation completion, technical evidence, assurance reconciliation, release readiness, external
  authority, external action, and observed operational effectiveness as separate states. One state never
  supplies another state or authority.
- Return failed or stale evidence to its named owner without weakening the requirement or substituting a
  nearby runtime, target, shell, environment, package, delivery form, or cosmetic control. Reopen Step 1.1 if
  the command, contract, entry, artifact, target, environment, evidence, or effect changed materially.

### Phase 4 — Stop, recover, or hand off assurance

#### 4.1 Reconcile threats and residual risk

- Reconcile every actor, asset, trust crossing, attack path, requirement, control, owner, evidence result,
  limitation, retained effect, recovery obligation, and reopen trigger. Preserve every untested or conflicting
  path as residual uncertainty.
- For each residual risk, record the remaining attack path, affected asset, consequence, evidence limit,
  compensating control when present, control owner, decision owner, acceptance authority, safe state, recovery
  owner, and review trigger. This operation never accepts the risk for that owner.
- Mark the assurance record complete only when every material path has a named disposition, owner, evidence
  state, and safe recovery duty. Otherwise continue to Step 4.2.

#### 4.2 Preserve an exact stop and recovery boundary

- Stop before missing or contradictory trust context, ownerless risk, unsafe authority, credential use,
  destructive probe, external effect, stale or mismatched evidence, uncontained partial state, or missing
  recovery. Do not substitute a narrower checklist, weaker control, broad scanner result, or another tuple.
- Return the first missing obligation, affected threat and asset, current safe state, retained and uncertain
  effects, redacted evidence, evidence limits, residual risk, recovery owner, first non-mutating recovery
  action, separate authority still required, and exact resume condition.
- Retain no secret value, credential, token, key, private configuration value, or unredacted sensitive data in
  the assurance record. A cancellation or timeout that prevents required analysis remains an explicit stop,
  not a completed review.

#### 4.3 Return the assurance contract

- Return the exact subject and version; actors; assets; inputs; effects; trust and authority map; execution and
  delivery identities; target tuple; threats and attack paths; requirements and controls; owners; evidence
  identities and states; failures; containment; cleanup; recovery; residual risk; stops; reopen triggers; and
  handoffs.
- Hand implementation to [`typescript-development`](../../typescript/typescript-development/SKILL.md) and
  [`typescript-typing`](../../typescript/typescript-typing/SKILL.md), proof to
  [`typescript-testing`](../../typescript/typescript-testing/SKILL.md), supply obligations to
  [`typescript-packaging`](../../typescript/typescript-packaging/SKILL.md), direct-delivery obligations to
  [`typescript-cli-delivery`](../../typescript/typescript-cli-delivery/SKILL.md), residual-risk and readiness inputs to
  [`cli-release`](../cli-release/SKILL.md), and multi-owner state to
  [`cli-development`](../cli-development/SKILL.md).
- State external mutation, credential use, artifact production, delivery, publication, and release action as
  not performed by this operation. The terminal outcome is either a complete CLI assurance contract or one
  exact stop with a safe recovery handoff; it never makes a release-acceptance decision.

## References

- [CLI Security checklist](checklists.md) supplies reusable unchecked conditions for this operation.
