# Web Security Evaluation Checklist

This reusable unchecked source evaluates one scoped web security outcome produced under this operation
against its scoped requirements, enforcement at each named owner's boundary, control lifecycles,
proportional threat analysis, control binding, and assurance obligations. It is governed by the
[`web`](../SKILL.md) domain and
[`web-security`](SKILL.md) operation, with [`web-backend`](../web-backend/SKILL.md) owning domain policy and
its server-side implementation, [`web-platform`](../web-platform/SKILL.md) owning browser facts,
[`web-testing`](../web-testing/SKILL.md) owning harness and suite mechanics,
[`web-observability`](../web-observability/SKILL.md) owning what a diagnostic emits, and
[`web-development`](../web-development/SKILL.md) as the caller that binds the outcome. The source commit that contains
this file identifies the checklist version. Its stable owner prefix is `WEBSEC`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBSEC-SC-PROJECT-01 — Normal case: requirements derive from this system's assets and threats

A change crosses a trust boundary, so requirements have to come from what this system holds and who can reach
it. The expected outcome inventories the assets and exposure first and selects versioned requirements against
them; a requirement set chosen before the system was inventoried is the failure.

#### Checklist

- [ ] WEBSEC-CK-PROJECT-01-01 — Actors, identities, assets, sensitive data, trust zones, entry points, dependencies, privilege, providers, and public exposure are inventoried before requirements are selected.
- [ ] WEBSEC-CK-PROJECT-01-02 — Applicable requirements are selected from OWASP ASVS 5.0.0 with the exact version and identifiers recorded.
- [ ] WEBSEC-CK-PROJECT-01-03 — OWASP WSTG 4.2 supplies applicable test ideas through versioned links.
- [ ] WEBSEC-CK-PROJECT-01-04 — NIST SSDF supplies lifecycle practices.
- [ ] WEBSEC-CK-PROJECT-01-05 — The work continues with one scoped security outcome.
- [ ] WEBSEC-CK-PROJECT-01-06 — Missing asset ownership, unknown authority, contradictory policy, or a scope change is returned rather than resolved here.

### WEBSEC-SC-PROJECT-02 — Rule violation: an awareness list stands in for scoped analysis

A published top-ten list or a generic hardening checklist is worked through and reported as the requirement
set. The expected outcome derives requirements from this system's assets, threats, and exposure; a generic
list presented as scoped analysis is the failure.

#### Checklist

- [ ] WEBSEC-CK-PROJECT-02-01 — No generic checklist or awareness list replaces the scoped analysis of this system's assets, threats, and exposure.
- [ ] WEBSEC-CK-PROJECT-02-02 — OWASP Top 10 2025 is used for awareness only, never as a complete requirement or verification set.

## Structure

### WEBSEC-SC-STRUCTURE-01 — Normal case: every control has one owner and one proving evidence path

Controls span the backend, the frontend, the browser, providers, dependencies, and operations, so a control
with no owner is a control no one implements. The expected outcome binds each one and routes implementation
outward; a control listed in the contract with no owner or no way to prove it is the failure.

#### Checklist

- [ ] WEBSEC-CK-STRUCTURE-01-01 — Authentication, authorization, sessions, validation, encoding, privacy, secrets, browser policy, dependencies, logging, alerts, abuse controls, and operations are each bound to one implementation owner.
- [ ] WEBSEC-CK-STRUCTURE-01-02 — Each control names one proving evidence path.
- [ ] WEBSEC-CK-STRUCTURE-01-03 — One versioned security contract is produced.
- [ ] WEBSEC-CK-STRUCTURE-01-04 — Implementation is routed to the backend, frontend, platform, provider, dependency, infrastructure, and operations owners.

### WEBSEC-SC-STRUCTURE-02 — Normal case: controls are built at their owning boundaries before the layers around them

Convenience layers are easy to add and easy to mistake for enforcement. The expected outcome builds the
boundaries that own protected decisions first, verifies each locally, and connects the surrounding layers afterwards; a
convenience layer attached to an unverified boundary is the failure.

#### Checklist

- [ ] WEBSEC-CK-STRUCTURE-02-01 — Types, schema, canonicalization, validation, encoding, resource policy, and explicit authorization boundaries are built before convenience layers are connected.
- [ ] WEBSEC-CK-STRUCTURE-02-02 — Each control is verified locally.
- [ ] WEBSEC-CK-STRUCTURE-02-03 — Missing authority or unsafe failure is repaired before a convenience layer is connected to the control.
- [ ] WEBSEC-CK-STRUCTURE-02-04 — Requirements, implementation, configuration, tests, documentation, logging, runbooks, and incident recovery are updated together.

### WEBSEC-SC-STRUCTURE-03 — Normal case: every security lifecycle is defined end to end

Identities, sessions, secrets, data, providers, dependencies, and exceptions all outlive the change that
created them. The expected outcome defines each lifecycle through to removal; a control created with no
rotation, revocation, or deletion story is the failure.

#### Checklist

- [ ] WEBSEC-CK-STRUCTURE-03-01 — Identity, session, secret, sensitive-data, privacy, provider, dependency, and exception lifecycles are defined.
- [ ] WEBSEC-CK-STRUCTURE-03-02 — Each defined lifecycle covers issuance, rotation, revocation, expiry, retention, deletion, failure, and ownership as applicable.

## Performance

### WEBSEC-SC-PERFORMANCE-01 — Normal case: exhaustion and abuse are treated as threats with controls

Capacity is a security property when an attacker can consume it, and a race is a security property when two
requests can both win. The expected outcome models and controls those in proportion to risk; resource and
concurrency behavior left to whatever the platform happens to do is the failure.

#### Checklist

- [ ] WEBSEC-CK-PERFORMANCE-01-01 — Denial, resource exhaustion, abuse, replay, and concurrency are modelled as threats with named controls.
- [ ] WEBSEC-CK-PERFORMANCE-01-02 — Replay, abuse, resource, and concurrency controls are implemented in risk order rather than deferred behind lower-risk work.

## Aesthetics

### WEBSEC-SC-AESTHETICS-01 — Poor quality: the record cannot be reviewed against its sources

Requirements and threats are all present, but a reviewer cannot tell which version of which source a
requirement came from or what a threat record leaves unresolved. The expected outcome carries the source
identity and the full threat record; a defensible outcome nobody can re-derive is the failure.

#### Checklist

- [ ] WEBSEC-CK-AESTHETICS-01-01 — Each selected requirement records its exact source version and identifier.
- [ ] WEBSEC-CK-AESTHETICS-01-02 — Each threat record names its asset, precondition, attacker capability, consequence, current control, proposed control, detection, recovery, and residual risk.
- [ ] WEBSEC-CK-AESTHETICS-01-03 — Targeted OWASP guidance is placed beside the control it supports rather than cited in bulk.

## Usage

### WEBSEC-SC-USAGE-01 — Expected failure: an operation is denied

A request arrives that the actor is not allowed to make. The expected outcome denies it at the boundary that
owns the protected decision, tells the person something safe, and leaves a route forward; a denial that leaks the decision's
inputs, or that dead-ends the person, is the failure.

#### Checklist

- [ ] WEBSEC-CK-USAGE-01-01 — The deny behavior is defined.
- [ ] WEBSEC-CK-USAGE-01-02 — The deny behavior is the default.
- [ ] WEBSEC-CK-USAGE-01-03 — Every operation on every resource is authorized rather than only the entry point.
- [ ] WEBSEC-CK-USAGE-01-04 — The error returned on denial is safe.
- [ ] WEBSEC-CK-USAGE-01-05 — The error returned on denial does not disclose the protected decision's inputs.
- [ ] WEBSEC-CK-USAGE-01-06 — A denied or failed path has a defined recovery route and an alert or incident path where the risk requires one.

### WEBSEC-SC-USAGE-02 — Normal case: exceptional and degraded paths are covered

The system runs while a provider is down, a dependency is compromised, an operation half-completed, or data
went stale. The expected outcome models each of those paths and defines what happens on them; coverage that
stops at the valid path is the failure.

#### Checklist

- [ ] WEBSEC-CK-USAGE-02-01 — Invalid, malicious, stale, duplicated, partially completed, provider-failed, dependency-compromised, exceptional, and operationally degraded paths are modelled.
- [ ] WEBSEC-CK-USAGE-02-02 — Alerts, incidents, and recovery are defined for the paths whose risk requires them.
- Also applies: WEBSEC-CK-STRUCTURE-02-04 (runbooks and incident recovery updated with the control).

## Consistency

### WEBSEC-SC-CONSISTENCY-01 — Normal case: assurance claims stay separate

The security work is reported as done. The expected outcome states implementation, verification, review,
readiness, deployment, and observed effectiveness as separate claims and leaves acceptance to the caller; one
claim covering all of them, or an acceptance invented here, is the failure.

#### Checklist

- [ ] WEBSEC-CK-CONSISTENCY-01-01 — Implementation, technical verification, independent review, release readiness, deployment, and observed operational effectiveness are reported separately.
- [ ] WEBSEC-CK-CONSISTENCY-01-02 — No acceptance of residual risk is invented inside this operation on the caller's behalf.

### WEBSEC-SC-CONSISTENCY-02 — Normal case: every requirement and threat reconciles to a control

The contract, the implementation, and the evidence were produced at different times by different owners. The
expected outcome reconciles all three so nothing is left unmatched; a requirement or a threat with no
disposition is the failure.

#### Checklist

- [ ] WEBSEC-CK-CONSISTENCY-02-01 — Every versioned requirement is reconciled with its implemented control, evidence, limitation, exception, and owner.
- [ ] WEBSEC-CK-CONSISTENCY-02-02 — Every material threat reaches a control, an explicit acceptance, or a stop condition.
- [ ] WEBSEC-CK-CONSISTENCY-02-03 — Ownerless risk is returned to project authority rather than absorbed into this outcome.

## Risk

### WEBSEC-SC-RISK-01 — Rule violation: a protected decision is enforced outside its owning boundary

A control lives in the interface, the request shape, or a browser policy, and the boundary that owns the decision
accepts whatever reaches it. The expected outcome enforces the decision where its named authority resides and keeps
the surrounding layers as defense; a client-side or browser-side check treated as the enforcement is the
failure.

#### Checklist

- [ ] WEBSEC-CK-RISK-01-01 — Every protected decision is enforced at the boundary that owns it under deny-by-default least privilege.
- [ ] WEBSEC-CK-RISK-01-02 — Client validation, hidden or disabled UI, CORS, CSP, cookies, and permission prompts are kept as defense or experience layers and never as sole enforcement.
- [ ] WEBSEC-CK-RISK-01-03 — The work stops on a privilege bypass, sensitive-data exposure, false safety, or unrecoverable ambiguity rather than growing the next slice.

### WEBSEC-SC-RISK-02 — Adversarial: a legitimate request is captured, replayed, or raced

An attacker holds a valid request and sends it again, or sends two at once, or arrives through a compromised
dependency. The expected outcome models those capabilities against this system's assets and resolves them at
the boundary that owns each protected decision; a protected action, including any provider action, that
depends on request ordering or single delivery is the failure.

#### Checklist

- [ ] WEBSEC-CK-RISK-02-01 — Spoofing, tampering, disclosure, privilege escalation, denial, replay, concurrency, abuse, resource exhaustion, and supply-chain behavior are each modelled against this system's assets.
- [ ] WEBSEC-CK-RISK-02-02 — A replayed legitimate request does not apply a protected action, including a provider action, twice.
- [ ] WEBSEC-CK-RISK-02-03 — Two concurrent instances of the same operation are resolved at the boundary that owns the protected decision rather than by arrival order.

### WEBSEC-SC-RISK-03 — Adversarial: cosmetic assurance is offered as proof

A clean scanner run, a completed awareness list, or one penetration pass is presented as evidence that the
system is secure. The expected outcome refuses each as sufficient and reports what remains untested;
assurance shaped to close a review rather than to find a weakness is the failure.

#### Checklist

- [ ] WEBSEC-CK-RISK-03-01 — No scanner result, OWASP Top 10 list, happy path, or single penetration pass is accepted as sufficient assurance.
- [ ] WEBSEC-CK-RISK-03-02 — A failed control, shallow scan result, untested real integration point, unsupported version, or missing recovery evidence is returned to its owner rather than counted as evidence.
- Also applies: WEBSEC-CK-OVERALL-01-01 (untested areas, accepted exceptions, residual risk, the remediation owner, and the reopen condition are reported).

### WEBSEC-SC-RISK-04 — Edge case: a required proof cannot be obtained

A requirement applies but the evidence path for it is unavailable in this environment or at this version. The
expected outcome returns the unsupported requirement or unavailable proof rather than downgrading it; a weaker
evidence class quietly substituted is the failure.

#### Checklist

- [ ] WEBSEC-CK-RISK-04-01 — An unsupported requirement or an unavailable proof is returned rather than satisfied with a weaker evidence class.
- [ ] WEBSEC-CK-RISK-04-02 — The evidence classes combined — source, static, dependency, configuration, unit, integration, dynamic, adversarial, recovery, and alert — are proportional to the risk they support.
- [ ] WEBSEC-CK-RISK-04-03 — The named versions and environments each inspection ran in are recorded with its result.
- [ ] WEBSEC-CK-RISK-04-04 — The required suite is implemented by `web-testing`.
- [ ] WEBSEC-CK-RISK-04-05 — The required suite is run by `web-testing`.
- [ ] WEBSEC-CK-RISK-04-06 — This operation retains the threat-to-evidence contract.

## Overall

### WEBSEC-SC-OVERALL-01 — Normal case: the outcome hands off with its residual risk visible

A complete security outcome ties requirements, threats, controls, and evidence together and hands the caller
what remains unproven along with who owns it. The scenario fails when the handoff reads as a clearance, or
when its claim reaches past the evidence that was gathered.

#### Checklist

- [ ] WEBSEC-CK-OVERALL-01-01 — The handoff carries verified controls, source versions, environment, untested areas, accepted exceptions, residual risk, remediation owner, and reopen condition.
- [ ] WEBSEC-CK-OVERALL-01-02 — The outcome's claim is no broader than the evidence classes actually gathered.
- Also applies: WEBSEC-CK-CONSISTENCY-01-02 (no acceptance of residual risk invented here).
