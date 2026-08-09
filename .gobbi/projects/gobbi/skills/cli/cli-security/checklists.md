# CLI Security Checklist

This reusable unchecked source evaluates one assurance contract for an exact line-oriented CLI change governed
by [`cli-security`](SKILL.md). It is bound to that operation's subject, trust and authority map, threat and
control record, owner and evidence routes, stop states, recovery duties, and residual risk. Its stable owner
prefix is `CLISEC`.

The source evaluates CLI-specific assurance only. TypeScript implementation and narrowing, test mechanics or
execution, package and direct-unit production, credential use, external action, release acceptance, generic
organizational policy, and release acceptance remain outside its subject. Every condition stays unchecked and
records only the observable requirement for its leaf scenario.

## Lifecycle Categories

### Design lifecycle

- **Subject and authority:** bind the exact command, contracts, execution and delivery identities, target,
  scope, actors, assets, effects, evidence, decision owner, and separate action authority.
- **Trust and threat model:** follow each untrusted input across parser, filesystem, process, shell, terminal,
  network, credential, update, telemetry, package, privilege, and consumer-entry boundaries.
- **Control and evidence contract:** map every material attack path to required prevention, containment,
  disclosure, detection, safe failure, cleanup, recovery, implementation ownership, and proof ownership.
- **Stop and recovery design:** preserve safe state, retained effects, residual risk, recovery ownership, and
  reopen conditions when assurance cannot close.

### Development lifecycle

- **Threat analysis:** model ordinary, invalid, malicious, spoofed, hostile-environment, denied, interrupted,
  partial, and recovery paths for the frozen assurance subject.
- **Owner routing:** keep requirements with CLI Security while routing semantics, expression, facts,
  implementation, proof, supply, direct delivery, readiness, and coordination to their exact owners.
- **Evidence reconciliation:** bind evidence to the exact control, implementation or unit, consumer entry,
  tuple, environment, date, signal, and limitation without executing another owner's mechanism.
- **Revision:** reopen the earliest affected assurance step when the command, contract, entry, artifact,
  target, environment, evidence, authority, effect, or recovery path changes.

### Product lifecycle

- **Use and denial:** preserve user and automation authority, secret safety, readable safe expression, and
  non-interactive behavior across accepted command paths.
- **Effects and recovery:** keep destructive scope, cancellation, containment, cleanup, partial state, retry,
  resume, and recovery explicit through the consumer lifecycle.
- **External relationships:** constrain networks, credentials, updates, telemetry, dependency scripts,
  delivered units, retained diagnostics, and support material to accepted identities and boundaries.
- **Handoff and change:** transfer exact obligations and residual risk without transferring implementation,
  action, or acceptance authority, then invalidate stale assurance after a material change.

## Scenario Hierarchy

### Design lifecycle

- Subject and authority
  - Exact assurance identity
    - `CLISEC-SC-DESIGN-SUBJECT-01` — The assurance contract identifies one exact CLI change and evidence slice.
  - Separate effect authority
    - `CLISEC-SC-DESIGN-AUTHORITY-01` — Analysis neither infers nor performs separately authorized effects.
- Trust and threat model
  - Complete trust inventory
    - `CLISEC-SC-DESIGN-TRUST-01` — Every applicable actor, asset, input, effect, and trust crossing is represented.
  - Material attack path
    - `CLISEC-SC-DESIGN-THREAT-01` — Every material threat reaches an asset through explicit preconditions and crossings.
- Control and evidence contract
  - Closed control route
    - `CLISEC-SC-DESIGN-CONTROL-01` — Every required control has observable behavior, an owner, and an evidence route.
  - Cosmetic compliance
    - `CLISEC-SC-DESIGN-CONTROL-02` — Surface warnings or bounded escaping do not impersonate enforcement.
- Stop and recovery design
  - Missing assurance prerequisite
    - `CLISEC-SC-DESIGN-STOP-01` — A missing owner, authority, fact, control, evidence path, or recovery path yields an exact stop.
  - Residual uncertainty
    - `CLISEC-SC-DESIGN-RISK-01` — Remaining attack paths stay visible to their decision and recovery owners.

### Development lifecycle

- Threat analysis
  - Option-shaped and passthrough input
    - `CLISEC-SC-DEVELOP-ARGUMENT-01` — Argument-array and option-terminator controls cover target-program interpretation.
  - Hostile stdin, environment, configuration, or current directory
    - `CLISEC-SC-DEVELOP-AMBIENT-01` — Ambient and discovered inputs cannot silently change identity, authority, or effect.
  - Executable, subprocess, or shell confusion
    - `CLISEC-SC-DEVELOP-PROCESS-01` — Process identity, inheritance, shell nesting, and child outcomes remain explicit.
  - Path traversal, link race, or overwrite
    - `CLISEC-SC-DEVELOP-FILESYSTEM-01` — Filesystem effects bind root, object identity, collision, transition, and recovery.
  - Terminal and Unicode spoofing
    - `CLISEC-SC-DEVELOP-TERMINAL-01` — Untrusted display data cannot forge trusted terminal state or user meaning.
  - Network, credential, update, or telemetry boundary
    - `CLISEC-SC-DEVELOP-EXTERNAL-01` — Each external data path has an exact destination, authority, lifecycle, and failure boundary.
  - Dependency script or delivered-unit boundary
    - `CLISEC-SC-DEVELOP-SUPPLY-01` — Supply threats stay bound to exact identities and specialist mechanism owners.
  - Destructive authority
    - `CLISEC-SC-DEVELOP-DESTRUCTIVE-01` — Confirmation or non-interactive authority binds the canonical scope and effect.
  - Interruption and partial state
    - `CLISEC-SC-DEVELOP-PARTIAL-01` — Cancellation, failure, cleanup, retained effects, and recovery form one coherent state path.
- Owner routing
  - Security requirement crosses into a specialist mechanism
    - `CLISEC-SC-DEVELOP-OWNER-01` — Security retains the requirement while the exact specialist owns realization or proof.
- Evidence reconciliation
  - Exact current evidence
    - `CLISEC-SC-DEVELOP-EVIDENCE-01` — Evidence establishes only its named control, subject, tuple, method, date, and limits.
  - Failed, stale, absent, or conflicting evidence
    - `CLISEC-SC-DEVELOP-EVIDENCE-02` — An evidence gap stays open and returns to its owner without weakening the requirement.
- Revision
  - Material subject change
    - `CLISEC-SC-DEVELOP-CHANGE-01` — A changed answer-bearing identity or effect invalidates dependent assurance.

### Product lifecycle

- Use and denial
  - Safe user-facing denial
    - `CLISEC-SC-PRODUCT-DENIAL-01` — Denial preserves current state, redacts sensitive data, and exposes a safe next action.
  - Non-interactive automation
    - `CLISEC-SC-PRODUCT-AUTOMATION-01` — Automation never hangs for authority or secret input and never infers consent.
- Effects and recovery
  - Destructive or partial consumer outcome
    - `CLISEC-SC-PRODUCT-RECOVERY-01` — The consumer can distinguish complete, denied, interrupted, partial, and recovered states.
- External relationships
  - Secret and diagnostic lifecycle
    - `CLISEC-SC-PRODUCT-SECRET-01` — Secrets and sensitive data remain outside unsafe sinks and retained evidence.
  - Network, update, telemetry, and dependency lifecycle
    - `CLISEC-SC-PRODUCT-LIFECYCLE-01` — External relationships preserve disclosure, authority, cancellation, retention, and retirement boundaries.
- Handoff and change
  - Assurance handoff
    - `CLISEC-SC-PRODUCT-HANDOFF-01` — Every downstream owner receives exact obligations, evidence state, limits, and residual risk.
  - Residual-risk decision
    - `CLISEC-SC-PRODUCT-RISK-01` — Risk acceptance remains with the recorded authority and does not become release acceptance here.

## Checklist Conditions

### Design lifecycle > Subject and authority > Exact assurance identity > CLISEC-SC-DESIGN-SUBJECT-01

- [ ] CLISEC-CK-DESIGN-SUBJECT-01-01 — The contract names the exact canonical command path and every accepted alias in scope.
- [ ] CLISEC-CK-DESIGN-SUBJECT-01-02 — The contract identifies the exact Architecture semantic contract.
- [ ] CLISEC-CK-DESIGN-SUBJECT-01-03 — The contract identifies the exact Interface expression contract.
- [ ] CLISEC-CK-DESIGN-SUBJECT-01-04 — The contract identifies the exact source, artifact, runtime, target tuple, delivery form, and consumer entry in scope.
- [ ] CLISEC-CK-DESIGN-SUBJECT-01-05 — The contract records the reviewed paths and evidence identities with their dates.
- [ ] CLISEC-CK-DESIGN-SUBJECT-01-06 — The contract states the affected users, automation, reviewer, decision owner, and observable assurance outcome.
- [ ] CLISEC-CK-DESIGN-SUBJECT-01-07 — A nearby runtime, target, shell, environment, artifact, or entry is not included without its own evidence subject.

### Design lifecycle > Subject and authority > Separate effect authority > CLISEC-SC-DESIGN-AUTHORITY-01

- [ ] CLISEC-CK-DESIGN-AUTHORITY-01-01 — Every requested write or process execution is classified separately from analysis.
- [ ] CLISEC-CK-DESIGN-AUTHORITY-01-02 — Every requested network access or external read is classified separately from analysis.
- [ ] CLISEC-CK-DESIGN-AUTHORITY-01-03 — Every credential use is classified separately from analysis.
- [ ] CLISEC-CK-DESIGN-AUTHORITY-01-04 — Every package, delivery, publication, installation, update, telemetry, or destructive action names its separate owner and authority.
- [ ] CLISEC-CK-DESIGN-AUTHORITY-01-05 — Readiness, a prompt, a TTY, prior access, or existing credentials do not supply authority.
- [ ] CLISEC-CK-DESIGN-AUTHORITY-01-06 — The assurance operation performs no implementation, test, credential, artifact, delivery, publication, or release action.

### Design lifecycle > Trust and threat model > Complete trust inventory > CLISEC-SC-DESIGN-TRUST-01

- [ ] CLISEC-CK-DESIGN-TRUST-01-01 — The trust inventory names every actor that can supply input, exercise authority, run code, or receive data.
- [ ] CLISEC-CK-DESIGN-TRUST-01-02 — The trust inventory names every command, filesystem, process, terminal, credential, network, update, telemetry, package, and retained-state asset that applies.
- [ ] CLISEC-CK-DESIGN-TRUST-01-03 — Each untrusted input records its source, representation, parsing, canonicalization, validation, authorization, and first side effect.
- [ ] CLISEC-CK-DESIGN-TRUST-01-04 — Each effect records its target, authority, persistence, failure, cleanup, and recovery state.
- [ ] CLISEC-CK-DESIGN-TRUST-01-05 — Parser, filesystem, process, shell, terminal, network, credential, package, update, telemetry, privilege, and consumer-entry crossings are explicit when applicable.
- [ ] CLISEC-CK-DESIGN-TRUST-01-06 — Every absent threat class has an exact not-applicable reason.

### Design lifecycle > Trust and threat model > Material attack path > CLISEC-SC-DESIGN-THREAT-01

- [ ] CLISEC-CK-DESIGN-THREAT-01-01 — Each material threat names the actor and attacker capability.
- [ ] CLISEC-CK-DESIGN-THREAT-01-02 — Each material threat names its entry point and required preconditions.
- [ ] CLISEC-CK-DESIGN-THREAT-01-03 — Each material threat names every trust crossing that reaches the affected asset.
- [ ] CLISEC-CK-DESIGN-THREAT-01-04 — Each material threat names its consequence and current control.
- [ ] CLISEC-CK-DESIGN-THREAT-01-05 — Each material threat names the current control's bypass conditions and evidence gap.

### Design lifecycle > Control and evidence contract > Closed control route > CLISEC-SC-DESIGN-CONTROL-01

- [ ] CLISEC-CK-DESIGN-CONTROL-01-01 — Every material attack path maps to a distinct security requirement.
- [ ] CLISEC-CK-DESIGN-CONTROL-01-02 — Every control states the exact attack-path step it changes.
- [ ] CLISEC-CK-DESIGN-CONTROL-01-03 — Every control states its expected observable behavior.
- [ ] CLISEC-CK-DESIGN-CONTROL-01-04 — Every control states its deny or failure behavior.
- [ ] CLISEC-CK-DESIGN-CONTROL-01-05 — Every control names one implementation owner.
- [ ] CLISEC-CK-DESIGN-CONTROL-01-06 — Every control names one evidence owner and exact evidence subject.
- [ ] CLISEC-CK-DESIGN-CONTROL-01-07 — Every control records its evidence limits and reopen trigger.
- [ ] CLISEC-CK-DESIGN-CONTROL-01-08 — Prevention, containment, disclosure, detection, redaction, cancellation, cleanup, and recovery obligations are present when the threat requires them.

### Design lifecycle > Control and evidence contract > Cosmetic compliance > CLISEC-SC-DESIGN-CONTROL-02

- [ ] CLISEC-CK-DESIGN-CONTROL-02-01 — A warning banner is not treated as authority for a destructive effect.
- [ ] CLISEC-CK-DESIGN-CONTROL-02-02 — Hidden or disabled presentation is not treated as enforcement.
- [ ] CLISEC-CK-DESIGN-CONTROL-02-03 — Bun Shell escaping is not treated as assurance for nested shells or target-program options.
- [ ] CLISEC-CK-DESIGN-CONTROL-02-04 — A direct argument array is not treated as proof of executable identity or filesystem safety.
- [ ] CLISEC-CK-DESIGN-CONTROL-02-05 — A scanner label or control name is not treated as attack-path evidence.
- [ ] CLISEC-CK-DESIGN-CONTROL-02-06 — Color, symbols, layout, or dry-run wording is not the sole protection against an unsafe effect.

### Design lifecycle > Stop and recovery design > Missing assurance prerequisite > CLISEC-SC-DESIGN-STOP-01

- [ ] CLISEC-CK-DESIGN-STOP-01-01 — A missing answer-changing trust fact yields an exact stop.
- [ ] CLISEC-CK-DESIGN-STOP-01-02 — A missing control, implementation owner, or evidence owner yields an exact stop.
- [ ] CLISEC-CK-DESIGN-STOP-01-03 — Missing current authority for a required effect yields an exact stop.
- [ ] CLISEC-CK-DESIGN-STOP-01-04 — An uncontained partial effect or unsafe recovery path yields an exact stop.
- [ ] CLISEC-CK-DESIGN-STOP-01-05 — The stop records the affected threat, asset, safe state, retained effects, risk, owner, first non-mutating recovery action, and resume condition.

### Design lifecycle > Stop and recovery design > Residual uncertainty > CLISEC-SC-DESIGN-RISK-01

- [ ] CLISEC-CK-DESIGN-RISK-01-01 — Every untested, unavailable, stale, or conflicting path remains visible.
- [ ] CLISEC-CK-DESIGN-RISK-01-02 — Every residual risk records its remaining attack path and affected asset.
- [ ] CLISEC-CK-DESIGN-RISK-01-03 — Every residual risk records its consequence and evidence limit.
- [ ] CLISEC-CK-DESIGN-RISK-01-04 — Every residual risk records its control owner, decision owner, acceptance authority, recovery owner, and review trigger.
- [ ] CLISEC-CK-DESIGN-RISK-01-05 — The assurance author does not accept residual risk for another owner.

### Development lifecycle > Threat analysis > Option-shaped and passthrough input > CLISEC-SC-DEVELOP-ARGUMENT-01

- [ ] CLISEC-CK-DEVELOP-ARGUMENT-01-01 — The threat record covers ambiguous commands, options, operands, repetition, conflicts, and passthrough boundaries.
- [ ] CLISEC-CK-DEVELOP-ARGUMENT-01-02 — Option-shaped operands have an explicit `--` or equivalent accepted interpretation boundary.
- [ ] CLISEC-CK-DEVELOP-ARGUMENT-01-03 — Target-program option injection remains modeled after shell tokenization is removed.
- [ ] CLISEC-CK-DEVELOP-ARGUMENT-01-04 — Control characters, oversized work, malformed values, and duplicate values have bounded failure behavior.

### Development lifecycle > Threat analysis > Hostile stdin, environment, configuration, or current directory > CLISEC-SC-DEVELOP-AMBIENT-01

- [ ] CLISEC-CK-DEVELOP-AMBIENT-01-01 — Stdin trust, size, EOF, cancellation, interaction, and secret-input states are explicit.
- [ ] CLISEC-CK-DEVELOP-AMBIENT-01-02 — Environment and runtime-control variables are rejected, sanitized, or intentionally supported by the contract.
- [ ] CLISEC-CK-DEVELOP-AMBIENT-01-03 — Configuration discovery, trust, precedence, duplicates, and invalid data fail before an unauthorized effect.
- [ ] CLISEC-CK-DEVELOP-AMBIENT-01-04 — Current-directory and path-search changes cannot silently select another executable, config, or state object.
- [ ] CLISEC-CK-DEVELOP-AMBIENT-01-05 — Every ambient source is disabled or intentionally disclosed, ordered, reviewed, and proved for the exact consumer entry.
- [ ] CLISEC-CK-DEVELOP-AMBIENT-01-06 — A non-interactive path never waits for a hidden prompt.

### Development lifecycle > Threat analysis > Executable, subprocess, or shell confusion > CLISEC-SC-DEVELOP-PROCESS-01

- [ ] CLISEC-CK-DEVELOP-PROCESS-01-01 — The resolved executable identity matches the accepted consumer entry.
- [ ] CLISEC-CK-DEVELOP-PROCESS-01-02 — Direct process arguments remain separate from shell command text.
- [ ] CLISEC-CK-DEVELOP-PROCESS-01-03 — Explicit shell use records its accepted reason, exact shell and grammar, interpolation boundary, and stronger evidence need.
- [ ] CLISEC-CK-DEVELOP-PROCESS-01-04 — Process environment, current directory, privileges, descriptors or handles, and child inheritance are bounded.
- [ ] CLISEC-CK-DEVELOP-PROCESS-01-05 — Signals, cancellation, downstream closure, and child cleanup have explicit retained-state outcomes.
- [ ] CLISEC-CK-DEVELOP-PROCESS-01-06 — Spawn success or zero child status is not treated as proof that the requested effect completed safely.

### Development lifecycle > Threat analysis > Path traversal, link race, or overwrite > CLISEC-SC-DEVELOP-FILESYSTEM-01

- [ ] CLISEC-CK-DEVELOP-FILESYSTEM-01-01 — Every filesystem effect binds the accepted root and exact object identity.
- [ ] CLISEC-CK-DEVELOP-FILESYSTEM-01-02 — Path normalization and traversal policy are explicit before the first filesystem effect.
- [ ] CLISEC-CK-DEVELOP-FILESYSTEM-01-03 — Symlink, hard-link, junction, alias, and race behavior is explicit where the target exposes it.
- [ ] CLISEC-CK-DEVELOP-FILESYSTEM-01-04 — Create, replace, overwrite, collision, and permission behavior is explicit.
- [ ] CLISEC-CK-DEVELOP-FILESYSTEM-01-05 — Temporary state and atomic or recoverable transition requirements are explicit.
- [ ] CLISEC-CK-DEVELOP-FILESYSTEM-01-06 — Failure records cleanup, retained state, uncertain state, and the exact recovery owner.

### Development lifecycle > Threat analysis > Terminal and Unicode spoofing > CLISEC-SC-DEVELOP-TERMINAL-01

- [ ] CLISEC-CK-DEVELOP-TERMINAL-01-01 — Untrusted text cannot emit active terminal control or escape sequences through trusted presentation.
- [ ] CLISEC-CK-DEVELOP-TERMINAL-01-02 — OSC links, carriage returns, newlines, and cursor effects cannot forge trusted lines or destinations.
- [ ] CLISEC-CK-DEVELOP-TERMINAL-01-03 — Bidirectional controls, invisible characters, and confusable Unicode remain visible or safely represented.
- [ ] CLISEC-CK-DEVELOP-TERMINAL-01-04 — Truncation or quoting cannot hide the identity or scope needed for authority and recovery.
- [ ] CLISEC-CK-DEVELOP-TERMINAL-01-05 — Safe readable representation routes to `cli-interface` without transferring security enforcement.

### Development lifecycle > Threat analysis > Network, credential, update, or telemetry boundary > CLISEC-SC-DEVELOP-EXTERNAL-01

- [ ] CLISEC-CK-DEVELOP-EXTERNAL-01-01 — Each external path binds its exact destination identity and transported data.
- [ ] CLISEC-CK-DEVELOP-EXTERNAL-01-02 — Each external path records disclosure, necessity, default state, and current authority.
- [ ] CLISEC-CK-DEVELOP-EXTERNAL-01-03 — Each external path records timeout, cancellation, retry, replay, duplicate, and partial-effect behavior when applicable.
- [ ] CLISEC-CK-DEVELOP-EXTERNAL-01-04 — Each external path records redaction, retention, deletion, failure, and recovery.
- [ ] CLISEC-CK-DEVELOP-EXTERNAL-01-05 — Credential scope, source, destination, receiving process, inheritance, and non-persistence evidence are explicit without retaining the value.
- [ ] CLISEC-CK-DEVELOP-EXTERNAL-01-06 — Update identity, integrity, compatibility, interruption, and recovery obligations are explicit.
- [ ] CLISEC-CK-DEVELOP-EXTERNAL-01-07 — Non-interactive telemetry never prompts for or infers consent.

### Development lifecycle > Threat analysis > Dependency script or delivered-unit boundary > CLISEC-SC-DEVELOP-SUPPLY-01

- [ ] CLISEC-CK-DEVELOP-SUPPLY-01-01 — Each dependency or delivered unit has an exact identity and source.
- [ ] CLISEC-CK-DEVELOP-SUPPLY-01-02 — Integrity, provenance, lifecycle-script, network, credential, produced-state, failure, and recovery requirements are explicit when applicable.
- [ ] CLISEC-CK-DEVELOP-SUPPLY-01-03 — Package-backed supply mechanics route to `typescript-packaging`.
- [ ] CLISEC-CK-DEVELOP-SUPPLY-01-04 — Direct non-archive controls route to `typescript-cli-delivery` with a separate unit identity and consumer entry.
- [ ] CLISEC-CK-DEVELOP-SUPPLY-01-05 — Supply evidence for one package or direct unit is not widened to another form.

### Development lifecycle > Threat analysis > Destructive authority > CLISEC-SC-DEVELOP-DESTRUCTIVE-01

- [ ] CLISEC-CK-DEVELOP-DESTRUCTIVE-01-01 — Each destructive effect binds the canonical command, scope, object identity, and current authority.
- [ ] CLISEC-CK-DEVELOP-DESTRUCTIVE-01-02 — Interactive confirmation restates the exact scope and effect.
- [ ] CLISEC-CK-DEVELOP-DESTRUCTIVE-01-03 — A changed subject invalidates prior confirmation.
- [ ] CLISEC-CK-DEVELOP-DESTRUCTIVE-01-04 — Non-interactive execution uses an explicit accepted authority source.
- [ ] CLISEC-CK-DEVELOP-DESTRUCTIVE-01-05 — Missing prompt, TTY, environment, default, or readiness never implies destructive consent.
- [ ] CLISEC-CK-DEVELOP-DESTRUCTIVE-01-06 — Dry-run expression is not treated as proof that the mutating path has no unauthorized effect.

### Development lifecycle > Threat analysis > Interruption and partial state > CLISEC-SC-DEVELOP-PARTIAL-01

- [ ] CLISEC-CK-DEVELOP-PARTIAL-01-01 — The contract distinguishes effects that never began, completed, remain, are uncertain, or require another owner.
- [ ] CLISEC-CK-DEVELOP-PARTIAL-01-02 — Validation failure, denial, dependency failure, timeout, signal, cancellation, crash, and partial write have explicit state transitions when applicable.
- [ ] CLISEC-CK-DEVELOP-PARTIAL-01-03 — Cleanup failure remains distinct from operation failure.
- [ ] CLISEC-CK-DEVELOP-PARTIAL-01-04 — Retry, idempotency, resume, rollback when defined, and forward recovery boundaries are explicit.
- [ ] CLISEC-CK-DEVELOP-PARTIAL-01-05 — Failure preserves the first useful diagnostic, current authoritative state, and retained effects.
- [ ] CLISEC-CK-DEVELOP-PARTIAL-01-06 — Every partial path ends in a safe recoverable state or an exact stop.

### Development lifecycle > Owner routing > Security requirement crosses into a specialist mechanism > CLISEC-SC-DEVELOP-OWNER-01

- [ ] CLISEC-CK-DEVELOP-OWNER-01-01 — Semantic commands, states, streams, and compatibility route to `cli-architecture`.
- [ ] CLISEC-CK-DEVELOP-OWNER-01-02 — Safe wording and terminal rendering route to `cli-interface`.
- [ ] CLISEC-CK-DEVELOP-OWNER-01-03 — Current execution-platform facts route to `cli-platform`.
- [ ] CLISEC-CK-DEVELOP-OWNER-01-04 — TypeScript realization and external-input modeling route to `typescript-development` and `typescript-typing`.
- [ ] CLISEC-CK-DEVELOP-OWNER-01-05 — Runtime and adversarial proof routes to `typescript-testing`.
- [ ] CLISEC-CK-DEVELOP-OWNER-01-06 — Package and direct-delivery mechanisms route to `typescript-packaging` and `typescript-cli-delivery`.
- [ ] CLISEC-CK-DEVELOP-OWNER-01-07 — Compiler and Bun mechanism facts route to `typescript-toolchain`.
- [ ] CLISEC-CK-DEVELOP-OWNER-01-08 — Residual-risk and readiness inputs route to `cli-release` without transferring acceptance authority.
- [ ] CLISEC-CK-DEVELOP-OWNER-01-09 — Multi-owner state, blockers, and handoff route to `cli-development`.

### Development lifecycle > Evidence reconciliation > Exact current evidence > CLISEC-SC-DEVELOP-EVIDENCE-01

- [ ] CLISEC-CK-DEVELOP-EVIDENCE-01-01 — Each evidence record names the exact requirement and control.
- [ ] CLISEC-CK-DEVELOP-EVIDENCE-01-02 — Each evidence record names the final implementation or unit identity and consumer entry.
- [ ] CLISEC-CK-DEVELOP-EVIDENCE-01-03 — Each evidence record names the runtime, target tuple, shell, environment, and delivery form that apply.
- [ ] CLISEC-CK-DEVELOP-EVIDENCE-01-04 — Each evidence record names its method, date, result, and first failure signal.
- [ ] CLISEC-CK-DEVELOP-EVIDENCE-01-05 — Each evidence record states its limits and unproved cases.
- [ ] CLISEC-CK-DEVELOP-EVIDENCE-01-06 — Ordinary, adversarial, denied, interrupted, partial, containment, cleanup, and recovery evidence are present when their modeled paths require them.
- [ ] CLISEC-CK-DEVELOP-EVIDENCE-01-07 — Security reconciliation does not execute the specialist evidence mechanism.

### Development lifecycle > Evidence reconciliation > Failed, stale, absent, or conflicting evidence > CLISEC-SC-DEVELOP-EVIDENCE-02

- [ ] CLISEC-CK-DEVELOP-EVIDENCE-02-01 — Failed evidence returns to its exact owner with the affected requirement intact.
- [ ] CLISEC-CK-DEVELOP-EVIDENCE-02-02 — Stale evidence remains tied to its original date, subject, tuple, and limits.
- [ ] CLISEC-CK-DEVELOP-EVIDENCE-02-03 — Absent evidence remains an explicit unproved path.
- [ ] CLISEC-CK-DEVELOP-EVIDENCE-02-04 — Answer-changing conflicts remain visible and block closure.
- [ ] CLISEC-CK-DEVELOP-EVIDENCE-02-05 — Evidence from another runtime, target, shell, environment, package, or delivery form is not substituted.
- [ ] CLISEC-CK-DEVELOP-EVIDENCE-02-06 — A requirement is not weakened to make available evidence appear sufficient.

### Development lifecycle > Revision > Material subject change > CLISEC-SC-DEVELOP-CHANGE-01

- [ ] CLISEC-CK-DEVELOP-CHANGE-01-01 — A command or semantic-contract change reopens affected trust, threat, control, and evidence records.
- [ ] CLISEC-CK-DEVELOP-CHANGE-01-02 — An expression, terminal, or safe-rendering change reopens affected spoofing and disclosure records.
- [ ] CLISEC-CK-DEVELOP-CHANGE-01-03 — An executable, artifact, runtime, target, shell, environment, package, or delivery change invalidates dependent evidence.
- [ ] CLISEC-CK-DEVELOP-CHANGE-01-04 — An authority, effect, retention, cleanup, or recovery change reopens the earliest affected assurance step.

### Product lifecycle > Use and denial > Safe user-facing denial > CLISEC-SC-PRODUCT-DENIAL-01

- [ ] CLISEC-CK-PRODUCT-DENIAL-01-01 — A denied operation performs no prohibited effect.
- [ ] CLISEC-CK-PRODUCT-DENIAL-01-02 — Denial preserves the current authoritative state and retained-effect state.
- [ ] CLISEC-CK-PRODUCT-DENIAL-01-03 — Denial exposes no secret or sensitive value through ordinary, machine, debug, completion, log, or support output.
- [ ] CLISEC-CK-PRODUCT-DENIAL-01-04 — Denial identifies the failed subject without allowing untrusted text to forge trusted presentation.
- [ ] CLISEC-CK-PRODUCT-DENIAL-01-05 — Denial provides the exact safe recovery route or names the recovery owner.

### Product lifecycle > Use and denial > Non-interactive automation > CLISEC-SC-PRODUCT-AUTOMATION-01

- [ ] CLISEC-CK-PRODUCT-AUTOMATION-01-01 — A non-interactive path never waits for missing input, consent, or authority.
- [ ] CLISEC-CK-PRODUCT-AUTOMATION-01-02 — A missing prompt cannot authorize a destructive, network, update, telemetry, or credentialed effect.
- [ ] CLISEC-CK-PRODUCT-AUTOMATION-01-03 — Option-shaped data remains data across the accepted automation path.
- [ ] CLISEC-CK-PRODUCT-AUTOMATION-01-04 — Structured output contains no active terminal control or secret value.
- [ ] CLISEC-CK-PRODUCT-AUTOMATION-01-05 — Exit state and structured completion do not disguise a denied, failed, interrupted, or partial effect as success.

### Product lifecycle > Effects and recovery > Destructive or partial consumer outcome > CLISEC-SC-PRODUCT-RECOVERY-01

- [ ] CLISEC-CK-PRODUCT-RECOVERY-01-01 — The consumer can distinguish read-only, dry-run, mutating, and destructive paths.
- [ ] CLISEC-CK-PRODUCT-RECOVERY-01-02 — The consumer can distinguish complete, denied, failed, cancelled, partial, and recovered states.
- [ ] CLISEC-CK-PRODUCT-RECOVERY-01-03 — The current authoritative state remains identifiable after interruption or partial failure.
- [ ] CLISEC-CK-PRODUCT-RECOVERY-01-04 — Retained and uncertain effects remain explicit after interruption or partial failure.
- [ ] CLISEC-CK-PRODUCT-RECOVERY-01-05 — Retry, resume, cleanup, rollback when defined, or forward recovery names its exact scope and authority.
- [ ] CLISEC-CK-PRODUCT-RECOVERY-01-06 — A zero status, success message, or last progress frame never hides an incomplete required effect.

### Product lifecycle > External relationships > Secret and diagnostic lifecycle > CLISEC-SC-PRODUCT-SECRET-01

- [ ] CLISEC-CK-PRODUCT-SECRET-01-01 — Secret values remain outside argv and command history.
- [ ] CLISEC-CK-PRODUCT-SECRET-01-02 — Secret values remain outside ordinary, machine, completion, log, diagnostic, support, and retained evidence output.
- [ ] CLISEC-CK-PRODUCT-SECRET-01-03 — Credential type, scope, destination, receiving process, inheritance, redaction, cache, retention, and non-persistence are recorded without the value.
- [ ] CLISEC-CK-PRODUCT-SECRET-01-04 — Source-explanation output retains origin while redacting sensitive values.
- [ ] CLISEC-CK-PRODUCT-SECRET-01-05 — Cleanup leaves no unapproved secret, token, key, private configuration value, or sensitive data behind.

### Product lifecycle > External relationships > Network, update, telemetry, and dependency lifecycle > CLISEC-SC-PRODUCT-LIFECYCLE-01

- [ ] CLISEC-CK-PRODUCT-LIFECYCLE-01-01 — Each network destination and data class remains disclosed and bounded through change and retirement.
- [ ] CLISEC-CK-PRODUCT-LIFECYCLE-01-02 — Update identity, integrity, compatibility, cancellation, partial state, and recovery remain explicit through change and retirement.
- [ ] CLISEC-CK-PRODUCT-LIFECYCLE-01-03 — Telemetry purpose, destination, data, consent or authority, retention, deletion, and non-interactive behavior remain explicit.
- [ ] CLISEC-CK-PRODUCT-LIFECYCLE-01-04 — Dependency lifecycle-script trust and produced state remain tied to the exact dependency and release input.
- [ ] CLISEC-CK-PRODUCT-LIFECYCLE-01-05 — Retired external relationships name retained data, configuration, diagnostics, credentials, and recovery ownership.

### Product lifecycle > Handoff and change > Assurance handoff > CLISEC-SC-PRODUCT-HANDOFF-01

- [ ] CLISEC-CK-PRODUCT-HANDOFF-01-01 — The handoff names the exact assurance subject and version.
- [ ] CLISEC-CK-PRODUCT-HANDOFF-01-02 — The handoff contains the actors, assets, inputs, effects, trust crossings, and authority map.
- [ ] CLISEC-CK-PRODUCT-HANDOFF-01-03 — The handoff contains the threats, attack paths, requirements, controls, and bypass conditions.
- [ ] CLISEC-CK-PRODUCT-HANDOFF-01-04 — The handoff contains every implementation owner and evidence owner.
- [ ] CLISEC-CK-PRODUCT-HANDOFF-01-05 — The handoff contains evidence identities, dates, states, failures, and limits.
- [ ] CLISEC-CK-PRODUCT-HANDOFF-01-06 — The handoff contains containment, cleanup, retained effects, recovery, and stop states.
- [ ] CLISEC-CK-PRODUCT-HANDOFF-01-07 — The handoff contains residual risks, decision owners, acceptance authorities, and reopen triggers.
- [ ] CLISEC-CK-PRODUCT-HANDOFF-01-08 — The handoff states that implementation, tests, credentials, artifact production, delivery, publication, and release action were not performed here.
- [ ] CLISEC-CK-PRODUCT-HANDOFF-01-09 — The handoff routes every open obligation to its exact CLI or TypeScript owner.

### Product lifecycle > Handoff and change > Residual-risk decision > CLISEC-SC-PRODUCT-RISK-01

- [ ] CLISEC-CK-PRODUCT-RISK-01-01 — The recorded acceptance authority is distinct from the assurance author.
- [ ] CLISEC-CK-PRODUCT-RISK-01-02 — A residual-risk position retains the exact subject, remaining path, consequence, evidence limit, owner, and review trigger.
- [ ] CLISEC-CK-PRODUCT-RISK-01-03 — Release consumes the assurance record without rewriting its threats, evidence limits, or residual uncertainty.
- [ ] CLISEC-CK-PRODUCT-RISK-01-04 — The assurance contract does not make a release-acceptance decision.
