---
name: web-security
description: "MUST load when a web change crosses a trust boundary; handles identity, sessions, protected or sensitive data; accepts untrusted content; changes authorization, providers, dependencies, security configuration, or public exposure; or requires security review."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Web Security

Use this operation to derive versioned security requirements from assets and threats, bind controls to their
owners, verify them adversarially, and report residual risk.

Security owns requirements, threat analysis, assurance, and residual-risk handoff. Backend owns authoritative
domain policy and implementation, platform owns browser facts, and testing owns harness and suite mechanics.

## Principles

### Requirements come from assets and threats

Actors, data, trust boundaries, exposure, and consequences determine which versioned requirements apply.

### Enforcement belongs at authoritative boundaries

Client behavior can add defense or guidance, but it cannot make a protected decision authoritative.

### Security controls have lifecycles

Identity, authorization, sessions, secrets, data, providers, dependencies, detection, and recovery need owners
from creation through removal.

### Evidence is proportional and residual risk remains visible

Use several evidence classes when the risk requires them, and never turn an untested area into assurance.

## Rules

- **MUST derive versioned requirements and tests from assets, threats, exposure, and authoritative sources.**
  A generic checklist or awareness list cannot replace scoped analysis.
- **MUST enforce protected decisions at the authoritative boundary.** Use deny-by-default least privilege and
  authorize every operation on every resource.
- **MUST define identity, session, secret, sensitive-data, privacy, provider, dependency, and exception
  lifecycles.** Include issuance, rotation, revocation, expiry, retention, deletion, failure, and ownership as
  applicable.
- **MUST address misuse, replay, concurrency, abuse, resource exhaustion, supply-chain behavior, exceptions,
  recovery, logging, alerts, and operations in proportion to risk.**
- **MUST bind each control to one implementation owner and one proving evidence path.** Hidden or disabled UI,
  client validation, and browser policy never substitute for authoritative enforcement.
- **NEVER accept a scanner, OWASP Top 10 list, happy path, or one penetration pass as sufficient assurance.**
  Report untested areas, accepted exceptions, residual risk, remediation owner, and reopen condition.

## Procedure

### Phase 1 — Establish the Security Context

#### 1.1 Study assets, actors, exposure, and current controls

- Inventory actors, identities, assets, sensitive data, trust zones, entry points, dependencies, privilege,
  providers, and public exposure.
- Trace authentication, authorization, sessions, validation, encoding, privacy, secrets, browser policy,
  dependencies, logging, alerts, abuse controls, recovery, and incident evidence.
- Inspect prior incidents, known weaknesses, configuration, deployments, operations, and accepted exceptions.
- Continue with one bounded security outcome; return missing asset ownership, unknown authority,
  contradictory policy, or scope change.

#### 1.2 Select versioned requirements and evidence

- Select applicable requirements from stable
  [OWASP ASVS 5.0.0](https://github.com/OWASP/ASVS/releases), recording the exact version and identifiers.
- Use stable [OWASP WSTG 4.2](https://owasp.org/www-project-web-security-testing-guide/) with versioned links
  for applicable test ideas and [NIST SSDF](https://csrc.nist.gov/projects/ssdf) for lifecycle practices.
- Use [OWASP Top 10 2025](https://owasp.org/Top10/) for awareness only, never as a complete requirement or
  verification set.
- Define proportional source, static, dependency, configuration, unit, integration, dynamic, adversarial,
  recovery, and alert evidence; return unsupported requirements or unavailable proof.

### Phase 2 — Model Threats and Bind Controls

#### 2.1 Model misuse, failure, and recovery

- Model spoofing, tampering, disclosure, privilege escalation, denial, replay, concurrency, abuse, resource
  exhaustion, and supply-chain behavior.
- Model invalid, malicious, stale, duplicated, partially completed, provider-failed, dependency-compromised,
  exceptional, and operationally degraded paths.
- Record each asset, precondition, attacker capability, consequence, current control, proposed control,
  detection, recovery, and residual risk.
- Continue when every material threat reaches a control, explicit acceptance, or stop condition; return
  ownerless risk to project authority.

#### 2.2 Assign controls to authoritative owners

- Bind authentication, authorization, sessions, validation, encoding, privacy, secrets, browser policy,
  dependencies, logging, alerts, abuse controls, and operations to one owner each.
- Use current targeted OWASP guidance beside the control it supports, such as
  [Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html),
  [Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html),
  [Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), and
  [Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).
- Define deny behavior, least privilege, operation and resource checks, expiry, rotation, revocation, safe
  errors, alerts, incidents, and recovery.
- Produce one versioned security contract and route implementation to backend, frontend, platform, provider,
  dependency, infrastructure, and operations owners.

### Phase 3 — Implement Protections Bottom-Up

#### 3.1 Build authoritative controls first

- Start with types, schema, canonicalization, validation, encoding, resource policy, and explicit
  authorization seams.
- Implement deny-by-default operation and resource decisions, protected data handling, secrets, sessions,
  integrity, and safe failure at authoritative owners.
- Implement replay, abuse, resource controls, concurrency, dependency integrity, exception paths, and
  recovery in risk order.
- Verify each control locally and repair missing authority or unsafe failure before connecting convenience
  layers.

#### 3.2 Connect surrounding layers without weakening authority

- Connect frontend requests, transport, browser policies, provider settings, dependencies, telemetry, alerts,
  support, and operations to the authoritative controls.
- Keep client validation, hidden UI, CORS, CSP, cookies, and permission prompts as defense or experience
  layers, never sole enforcement.
- Update requirements, implementation, configuration, tests, documentation, logging, runbooks, and incident
  recovery together.
- Grow one threat-and-control slice at a time; stop on privilege bypass, sensitive-data exposure, false
  safety, or unrecoverable ambiguity.

### Phase 4 — Verify and Report Risk

#### 4.1 Gather proportional adversarial evidence

- Ask `web-testing` to implement and run the required suite while security retains the threat-to-evidence
  contract.
- Combine applicable source, static, dependency, configuration, unit, integration, dynamic, adversarial,
  recovery, and alert evidence.
- Inspect authoritative decisions, data effects, provider settings, browser facts, diagnostics, and
  operations in named versions and environments.
- Return a failed control, shallow scan result, untested real seam, unsupported version, or missing recovery
  evidence to its owner.
- When this security outcome is evaluated, the [evaluation checklist](checklists.md) and every checklist owned
  by an active `web` sibling supply the applicable conditions; the general Evaluation operation resolves them
  and issues any verdict.

#### 4.2 Reconcile controls and residual risk

- Reconcile every versioned requirement and material threat with its implemented control, evidence,
  limitation, exception, and owner.
- Record verified controls, source versions, environment, untested areas, accepted exceptions, residual risk,
  remediation owner, and reopen condition.
- Separate implementation, technical verification, independent review, release readiness, deployment, and
  observed operational effectiveness.
- Hand the result to `web-feature` or the requesting caller without inventing acceptance for residual risk.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
