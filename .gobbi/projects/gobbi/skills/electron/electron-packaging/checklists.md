# Electron Packaging Evaluation Checklist

This reusable unchecked source evaluates one packaged Electron candidate produced under the Electron
Packaging operation. The source commit that contains this file identifies the checklist version. Its stable
owner prefix is `ELECPKG`.

This file defines reusable evaluation-checklist coverage only. It defines no test specification, evidence
metadata, row result, severity, score, verdict, or remediation instruction. Preserve every row as an
unchecked binary condition.

A row is defined once beneath its owning scenario. An `Also applies` line reuses a row defined elsewhere,
carries no checkbox, and creates no second condition.

## Project

### ELECPKG-SC-PROJECT-01 — Normal case: accepted packaging start

An implementation or read-only review starts from accepted lower-tier records for one packaged candidate. It
succeeds when the subject, operating system, architecture, claims, and ownership are bounded; an ambiguous
subject or later-lifecycle ownership claim is the failure.

#### Checklist

- [ ] ELECPKG-CK-PROJECT-01-01 — The trigger is an implementation or review of one packaged Electron candidate.
- [ ] ELECPKG-CK-PROJECT-01-02 — Accepted Contract, Design, Development, Observability, and Runtime records identify the packaged application subject.
- [ ] ELECPKG-CK-PROJECT-01-03 — Every artifact claim names its target operating system and architecture.
- [ ] ELECPKG-CK-PROJECT-01-04 — Packaging ownership stops at construction and candidate acceptance or rejection.

### ELECPKG-SC-PROJECT-02 — Rule violation: ownership expansion

A read-only review or packaging implementation stays within its granted authority. It succeeds when review
changes nothing and Packaging claims no later-owner result; an unauthorized edit or expanded ownership claim
is the Rule violation.

#### Checklist

- [ ] ELECPKG-CK-PROJECT-02-01 — A review makes no file change unless the user also requested a change.
- [ ] ELECPKG-CK-PROJECT-02-02 — The operation claims no test, support, version, channel, release-readiness, publication, rollout, withdrawal, post-release recovery, or complete-delivery ownership.

### ELECPKG-SC-PROJECT-03 — Expected failure: missing accepted input

A required lower-tier record is absent or contradicts another accepted record. It succeeds by stopping at
the last accepted state and naming the responsible owner; continuing from an invented or unresolved input is
the failure.

#### Checklist

- [ ] ELECPKG-CK-PROJECT-03-01 — A missing or contradictory lower-tier record stops construction at the last accepted state.
- [ ] ELECPKG-CK-PROJECT-03-02 — The stop record identifies the owner that can decide the missing or contradictory input.

## Structure

### ELECPKG-SC-STRUCTURE-01 — Normal case: immutable inputs and an existing packaging system

One candidate starts from recorded build inputs and a current packaging system. It succeeds when the complete
identity is recorded and a valid system is preserved; incomplete identity or preference-driven replacement
is the failure.

#### Checklist

- [ ] ELECPKG-CK-STRUCTURE-01-01 — The recorded build-input identity contains the source, lockfile, dependencies, Electron, configuration, tools, operating system, architecture, and reproduction command.
- [ ] ELECPKG-CK-STRUCTURE-01-02 — Packaging inspects the current scripts, configuration, dependency rebuild path, credential boundary, and artifact layout.
- [ ] ELECPKG-CK-STRUCTURE-01-03 — A valid existing packaging system is preserved for the accepted outcome.
- [ ] ELECPKG-CK-STRUCTURE-01-04 — A new-tool recommendation cites current official evidence and a stated project need.

### ELECPKG-SC-STRUCTURE-02 — Normal case: entries, resources, ASAR, and compiled modules

The packaged application needs complete process entries, resources, ASAR placement, and compiled Node
modules. It succeeds when manifests and real-file locations match the final tree; a source-tree dependency,
missing output, or secrecy claim based on ASAR is the failure.

#### Checklist

- [ ] ELECPKG-CK-STRUCTURE-02-01 — The manifest identifies every applicable process entry and runtime resource in the packaged application.
- [ ] ELECPKG-CK-STRUCTURE-02-02 — The ASAR record identifies every unpacked file that needs a real filesystem path.
- [ ] ELECPKG-CK-STRUCTURE-02-03 — ASAR placement is not accepted as a security boundary or secrecy mechanism.
- [ ] ELECPKG-CK-STRUCTURE-02-04 — Each compiled Node module rebuild record names its Electron version, target operating system and architecture, output path, and output checksum algorithm and value.
- [ ] ELECPKG-CK-STRUCTURE-02-05 — The packaged application includes each compiled Node module at the path its process entry loads.

## Performance

### ELECPKG-SC-PERFORMANCE-01 — Poor quality: unbounded or unreproducible construction

A candidate is constructed but its size or reproduction basis is unclear. It succeeds when byte size and a
recorded-input reproduction command bound the result; an opaque or irreproducible artifact is the quality
failure.

#### Checklist

- [ ] ELECPKG-CK-PERFORMANCE-01-01 — Artifact byte size is recorded for every target operating system and architecture.
- [ ] ELECPKG-CK-PERFORMANCE-01-02 — The reproduction command starts from the declared recorded build inputs.

### ELECPKG-SC-PERFORMANCE-02 — Edge case: byte mutation after signing

One or more candidate bytes change after a signature was applied. It succeeds only when the prior identity
and dependent evidence are invalidated and the complete replacement sequence runs; retaining the old
checksum, signature, notarization result, or evidence is the failure.

#### Checklist

- [ ] ELECPKG-CK-PERFORMANCE-02-01 — The candidate artifact checksum is computed only after final-byte construction and signing are complete.
- [ ] ELECPKG-CK-PERFORMANCE-02-02 — Any byte mutation after signing invalidates the candidate and its dependent evidence.
- [ ] ELECPKG-CK-PERFORMANCE-02-03 — The replacement artifact is rebuilt from the recorded build inputs.
- [ ] ELECPKG-CK-PERFORMANCE-02-04 — Every required signature and notarization result is repeated for the replacement artifact.
- [ ] ELECPKG-CK-PERFORMANCE-02-05 — The replacement artifact receives a new candidate artifact checksum.
- [ ] ELECPKG-CK-PERFORMANCE-02-06 — Every affected evidence request is repeated for the replacement candidate.

## Aesthetics

### ELECPKG-SC-AESTHETICS-01 — Poor quality: ambiguous candidate record

A candidate record uses labels for construction and installed states. It succeeds when a cold reader can
distinguish the packaged application from the installed application; interchangeable or vague labels are
the quality failure.

#### Checklist

- [ ] ELECPKG-CK-AESTHETICS-01-01 — Record labels distinguish the packaged application from the installed application.

## Usage

### ELECPKG-SC-USAGE-01 — Normal case: packaged and installed evidence request

Packaging requests later evidence for one exact candidate. It succeeds when identity, installation
instructions, claims, and cases are complete while Testing retains method ownership; a missing request field
or Packaging-owned evidence method is the failure.

#### Checklist

- [ ] ELECPKG-CK-USAGE-01-01 — The request names the recorded build-input identity, candidate artifact checksum, and target operating system and architecture.
- [ ] ELECPKG-CK-USAGE-01-02 — The request supplies installation instructions and artifact claims.
- [ ] ELECPKG-CK-USAGE-01-03 — The request identifies the required packaged and installed cases.
- [ ] ELECPKG-CK-USAGE-01-04 — Packaging leaves evidence method selection and execution to Testing.

### ELECPKG-SC-USAGE-02 — Edge case: evidence return acceptance

Testing returns a record for candidate acceptance. It succeeds when the identity and environment-classified
outcomes match the request and Packaging accepts or rejects without reinterpretation; accepting a mismatch,
failed case, or substituted result is the failure.

#### Checklist

- [ ] ELECPKG-CK-USAGE-02-01 — The returned record matches the requested identity, checksum, operating system, and architecture.
- [ ] ELECPKG-CK-USAGE-02-02 — The returned record classifies every required environment.
- [ ] ELECPKG-CK-USAGE-02-03 — The returned record contains install, launch, and behavior evidence or an explicit failure for every requested case.
- [ ] ELECPKG-CK-USAGE-02-04 — Packaging accepts or rejects the record from its completeness and identity without reinterpreting a Testing result.
- [ ] ELECPKG-CK-USAGE-02-05 — An identity mismatch or failed requested case prevents candidate acceptance.

### ELECPKG-SC-USAGE-03 — Expected failure: required environment unavailable

A requested packaged or installed case cannot run in a required environment. It succeeds by stopping the
affected claim and retaining constructed outputs and limitations; relabeling the unavailable environment as
passing evidence is the failure.

#### Checklist

- [ ] ELECPKG-CK-USAGE-03-01 — An unavailable required environment stops the affected installed claim at the last accepted state.
- [ ] ELECPKG-CK-USAGE-03-02 — Constructed artifacts, request records, limitations, and sanitized logs are retained with the stop.

## Consistency

### ELECPKG-SC-CONSISTENCY-01 — Rule violation: automatic packaging-system migration

A valid current packaging system differs from a currently preferred option. It succeeds when adoption waits
for an explicit evidence-backed project decision; replacing the valid system automatically is the Rule
violation.

#### Checklist

- [ ] ELECPKG-CK-CONSISTENCY-01-01 — Tool adoption follows an explicit project decision backed by current official evidence.

### ELECPKG-SC-CONSISTENCY-02 — Normal case: contents, security settings, and signing order

The artifact contains nested binaries, package-time security settings, and a possible macOS notarization
step. It succeeds when final contents precede each signature and notarization follows signing; signing
mutable contents or notarizing an unsigned application is the failure.

#### Checklist

- [ ] ELECPKG-CK-CONSISTENCY-02-01 — Process entries, resources, ASAR placement, unpacked files, compiled Node modules, fuses, and metadata are set before signing.
- [ ] ELECPKG-CK-CONSISTENCY-02-02 — Each signature applies to the final bytes of its signable artifact.
- [ ] ELECPKG-CK-CONSISTENCY-02-03 — A required macOS notarization submission follows successful code signing.
- [ ] ELECPKG-CK-CONSISTENCY-02-04 — Inner executables and libraries are signed before their enclosing packaged application, and the completed installer is signed last where required.

## Risk

### ELECPKG-SC-RISK-01 — Normal case: credentialed signing and notarization

Signing or Apple notarization requires protected credentials and an external action. It succeeds when the
recorded authority approves each action, secrets stay protected, and results are verified; unauthorized use,
secret exposure, bypass, or unverified success is the failure.

#### Checklist

- [ ] ELECPKG-CK-RISK-01-01 — The recorded credential owner or external-action authority approves each signing-credential use before access.
- [ ] ELECPKG-CK-RISK-01-02 — Signing credentials and notarization secrets are absent from artifacts and logs.
- [ ] ELECPKG-CK-RISK-01-03 — The recorded credential owner or external-action authority approves each Apple notarization submission before the external action.
- [ ] ELECPKG-CK-RISK-01-04 — Missing authority, credentials, or service availability stops with retained artifacts and sanitized logs.
- [ ] ELECPKG-CK-RISK-01-05 — Required signature and notarization results are verified with operating-system mechanisms.

### ELECPKG-SC-RISK-02 — Adversarial: ASAR or signing claimed as secrecy

An artifact uses ASAR placement or code signing and presents that mechanism as confidentiality. It succeeds
when neither mechanism receives a secrecy claim; accepting either as protection from disclosure is the
adversarial failure.

#### Checklist

- [ ] ELECPKG-CK-RISK-02-01 — ASAR placement alone supplies no accepted confidentiality claim.
- [ ] ELECPKG-CK-RISK-02-02 — Code signing alone supplies no accepted confidentiality claim.

### ELECPKG-SC-RISK-03 — Adversarial: proxy evidence or changed-byte acceptance

A source-mode check, cosmetic launch, or earlier checksum appears sufficient for candidate acceptance. It
succeeds when each proxy is rejected and changed bytes receive a new identity; inheriting an unobserved or
prior result is the adversarial failure.

#### Checklist

- [ ] ELECPKG-CK-RISK-03-01 — Source-mode behavior is not accepted as packaged application evidence.
- [ ] ELECPKG-CK-RISK-03-02 — Cosmetic install or launch success is not accepted as evidence for an unobserved behavior claim.
- Also applies: ELECPKG-CK-PERFORMANCE-02-02 (changed bytes invalidate prior identity and evidence).

## Overall

### ELECPKG-SC-OVERALL-01 — Normal case: immutable candidate handoff or rejection

Packaging reaches its terminal decision for each target operating system and architecture. It succeeds with
one complete immutable candidate handoff or an explicit rejection record; missing identity, changed bytes,
an incomplete field set, or a later-owner decision is the failure.

#### Checklist

- [ ] ELECPKG-CK-OVERALL-01-01 — Each accepted record contains every required build, artifact, manifest, security, evidence, limitation, diagnostic, and reproduction field.
- [ ] ELECPKG-CK-OVERALL-01-02 — Exactly one accepted immutable candidate record exists per target operating system and architecture.
- [ ] ELECPKG-CK-OVERALL-01-03 — The dynamic handoff sends the complete accepted record to Electron Release without a static sibling reference.
- [ ] ELECPKG-CK-OVERALL-01-04 — A rejected candidate returns its last accepted state, failed condition, retained outputs, responsible owner, and required recovery action.
