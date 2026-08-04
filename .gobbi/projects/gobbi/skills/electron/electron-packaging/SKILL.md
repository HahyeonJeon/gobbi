---
name: electron-packaging
description: "MUST load when building or reviewing packaged Electron applications, including process entries, resources, ASAR placement, compiled Node modules, fuses, signing, notarization, installers, and artifact verification."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Electron Packaging

Electron Packaging takes accepted behavior, design, source, diagnostic-emission, and runtime records. It
builds final artifact bytes and returns one accepted immutable candidate record per target operating system
and architecture, or an explicit rejection.

This operation owns packaged application construction, package-time security settings, signatures,
notarization, installers, final-byte inspection, candidate artifact checksums, and candidate acceptance. It
requests packaged and installed evidence from Testing without designing, executing, or interpreting that
work.

A review inspects the same records and artifact path without edits unless the user requests a change.

## Principles

### Candidate identity starts from recorded inputs

Record immutable build inputs before construction. The recorded build-input identity must distinguish every
source, dependency, Electron, configuration, tool, operating-system, and architecture choice that can change
the result.

### Final artifact bytes define the candidate

The candidate artifact checksum identifies the exact bytes supplied for evidence and later use. A different
checksum is a different candidate, even when its source version or visible behavior appears unchanged.

### Existing packaging systems deserve compatibility

Preserve an existing packaging system when it remains valid for the accepted outcome. Recommend a new tool
only from current official evidence and a stated project need; never make an automatic migration part of
ordinary packaging work.

### Packaging accepts evidence without owning evidence work

Packaging states the artifact claims and requested cases. Testing owns the evidence method, execution,
environment classification, results, and failures; Packaging checks the returned record against its request
and accepts or rejects the candidate.

## Rules

- **MUST begin with accepted lower-tier records.** Require the installed behavior, technical design, bounded
  source outcome, diagnostic-emission outcome, and pinned runtime mechanism facts needed by the package, and
  return a contradiction or missing decision to its earliest owner before construction.

- **MUST record immutable build inputs before producing artifacts.** Include source commit or digest,
  lockfile and dependency identities, Electron version, configuration identity, tool identities, target
  operating system and architecture, and the reproduction command.

- **MUST preserve a valid existing packaging system.** Inspect its scripts, configuration, dependency
  integration, credential boundaries, and artifact layout, and adopt a new tool only through an explicit,
  evidence-backed project decision.

- **MUST set artifact contents and security settings before signing.** Complete process entry placement,
  resources, ASAR and unpacked files, compiled Node modules, fuses, and metadata before signing each affected
  artifact.

- **MUST treat credentials and notarization submission as explicit authority boundaries.** Use signing
  credentials or submit to Apple only when the recorded credential owner or external-action authority has
  authorized that exact action, and keep secrets out of artifacts and logs.

- **NEVER claim ownership outside packaged-candidate construction and acceptance.** Do not own test design,
  test execution, evidence interpretation, environment classification, support, version policy, channels,
  release readiness, publication, rollout, withdrawal, post-release recovery, or complete delivery.

## Procedure

### Phase 1 — Accept the Packaging Subject

#### 1.1 Classify the request and accept lower-tier records

- Classify the trigger as implementation or review. For review, inspect the requested subject and report
  findings without changing files unless a change is also authorized.
- Identify the packaged application outcome and each target operating system and architecture. Name the
  expected artifact form, installer form, installed behavior claims, and recorded credential owner or
  external-action authority.
- Accept current records from [`electron-contract`](../electron-contract/SKILL.md),
  [`electron-design`](../electron-design/SKILL.md),
  [`electron-development`](../electron-development/SKILL.md),
  [`electron-observability`](../electron-observability/SKILL.md), and
  [`electron-runtime`](../electron-runtime/SKILL.md). Confirm that their application identity, Electron
  version, process entry expectations, resources, diagnostics, and operating-system facts agree.
- Stop when a required record is missing or contradictory. Preserve the last accepted state and return the
  issue to the owner that can decide it.

#### 1.2 Record immutable build inputs and inspect the current packaging system

- Create the recorded build-input identity from the source commit or digest; lockfile, dependencies, and
  Electron version; packaging configuration and tool versions; target operating system and architecture;
  relevant build settings; and reproduction command.
- Inspect the existing scripts, configuration, artifact paths, dependency rebuild path, signing integration,
  and credential access. Preserve that system when it can produce the accepted outcome with verifiable
  final bytes.
- When no valid system exists, compare current official
  [packaging options](https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging) against the required
  artifacts and operating systems. Record the evidence and obtain the project decision before adopting a new
  tool.
- Treat every changed input as a new recorded build-input identity. Mark dependent package claims from the
  earlier identity invalid.

### Phase 2 — Construct the Packaged Application

#### 2.1 Place process entries, resources, and dependencies

- Build and record every applicable main, preload, renderer, and utility process entry. Keep their emitted
  paths distinct and ensure no process entry depends on a source-tree path.
- Build an entry and resource manifest. Include runtime assets, icons, locale data, licenses, bundled
  dependencies, diagnostic metadata, and every file required after installation.
- Exclude development-only material unless an accepted packaged behavior requires it. Record every accepted
  exception with its purpose and consumer.
- Inspect the packaged application tree rather than inferring its contents from source configuration.

#### 2.2 Decide ASAR and real-filesystem placement

- Apply Electron's [ASAR archive and real-filesystem
  guidance](https://www.electronjs.org/docs/latest/tutorial/asar-archives) when recording which files enter
  the archive and which remain unpacked. Name every need for a real filesystem path, including executable
  files, writable data, working directories, operating-system tools, and dynamic library loading.
- Treat ASAR as a packaging format, not a security boundary or secrecy mechanism. Use accepted design
  controls and package-time security settings for security claims.
- Inspect the ASAR as an archive and inspect its adjacent unpacked directory. Confirm that both contain the
  files named by the entry and resource manifest.
- Keep writable application data outside the packaged application. A read-only ASAR path cannot stand in for
  an installed data location.

#### 2.3 Rebuild and place compiled Node modules

- Identify every compiled Node module and the process entry that loads it. Record its exact Electron version,
  target operating system and architecture, rebuild tool identity, output path, and output checksum algorithm
  and value.
- Follow Electron's [compiled Node module rebuild
  guidance](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules) for the recorded
  Electron version and target operating system and architecture. Do not reuse a host or plain Node.js build
  as package evidence.
- Place the rebuilt output where the packaged application loads it. Keep it unpacked when its loader requires
  a real filesystem path.
- Reject the artifact when a compiled Node module is missing, built for a different identity, or resolved
  only from the source tree.

#### 2.4 Apply package-time security settings and construct installers

- Apply the accepted Electron fuse state to the packaged Electron binary before signing, as required by the
  [Electron fuse guidance](https://www.electronjs.org/docs/latest/tutorial/fuses). Read the resulting fuse
  state from the packaged application and record it.
- Apply accepted ASAR integrity settings and other package-time security settings before signing. Do not
  infer secrecy from ASAR or authenticity from an unsigned checksum.
- Construct the packaged application and each required installer or distributable. Record names, versions,
  identifiers, architecture markers, install scope, and output paths.
- Retain the symbols, mapping files, diagnostic metadata, and construction logs required by the accepted
  Observability record. Keep protected values out of those outputs.

### Phase 3 — Sign, Notarize, and Verify Final Bytes

#### 3.1 Establish signing and notarization authority

- Determine which packaged applications, executables, libraries, and installers require signatures for each
  target operating system. Record the expected signer identity and verification mechanism.
- Confirm the recorded credential owner or external-action authority before accessing a signing credential
  or external notarization service. Limit the action to the authorized artifact identity and service request.
- If authority, credentials, a signing service, or a notarization service is unavailable, stop. Retain the
  unsigned or partially processed artifacts and sanitized logs, and report the exact incomplete state.
- Never disable a required signature or notarization step to obtain a candidate record.

#### 3.2 Sign and notarize in byte-stable order

- Set all contents and security settings before signing each signable artifact. Sign inner executables and
  libraries before their enclosing packaged application, then sign the completed installer where required.
- For a macOS packaged application that requires notarization, follow Electron's [code-signing and macOS
  notarization order](https://www.electronjs.org/docs/latest/tutorial/code-signing): sign it first, submit
  only with explicit authority, and record the request identity and result.
- Verify each required signature and notarization result with the operating-system mechanism appropriate to
  the artifact. A successful build command is not signature evidence.
- Any byte mutation after signing invalidates the candidate evidence. Rebuild from the recorded build
  inputs, reapply settings, repeat signing and notarization, replace the candidate artifact checksum, and
  repeat every affected Testing evidence request.

#### 3.3 Inspect final artifacts and record their identity

- Inspect each final packaged application and installer. Reconcile its process entries, resources, ASAR and
  unpacked files, compiled Node modules, fuses, signature state, notarization result, and metadata with the
  accepted records.
- Compute the candidate artifact checksum only after every final-byte construction and authorized signing
  action is complete. Record the artifact path, byte size, checksum algorithm, and checksum value.
- Run the recorded reproduction command from the declared inputs when the required environment is available.
  Compare the expected identities and explain any permitted byte difference.
- Reject the artifact on a missing file, unexpected executable content, wrong architecture, failed signature,
  failed notarization requirement, or unresolved manifest difference.

### Phase 4 — Request and Accept Packaged Evidence

#### 4.1 Send the Packaging to Testing request record

- Use the dynamic `Packaging ↔ Testing` exchange. Packaging supplies the recorded build-input identity,
  candidate artifact checksum, artifact path, target operating system and architecture, installation
  instructions, artifact claims, and requested packaged and installed cases.
- Request evidence for the packaged application and installed application states required by the accepted
  contract. Keep each claim tied to the exact candidate artifact checksum.
- Do not prescribe the evidence method or execute the cases. Testing selects the method, runs the work,
  classifies the environment, and returns evidence or failures.

#### 4.2 Accept or reject the returned evidence record

- Require the returned record to name the same recorded build-input identity, candidate artifact checksum,
  target operating system and architecture, and request identity.
- Check that it classifies each environment and returns install, launch, and behavior evidence or an explicit
  failure for every requested case.
- Packaging checks completeness and identity only. It does not reinterpret a Testing result or replace a
  failed case with a source-mode, cosmetic, or proxy observation.
- Accept a complete passing record into the immutable candidate record. Otherwise reject the candidate and
  retain the returned limitations and failures.
- If a required environment is unavailable, stop the affected installed claim at the last accepted state.
  Retain constructed artifacts, request records, and logs; never relabel the gap as passing evidence.

#### 4.3 Recover from construction, evidence, and identity failures

- Correct package configuration and rebuild for failures owned by Packaging. Return source failures to
  Development and policy or mechanism contradictions to their lower-tier owner.
- Treat a changed accepted source record, build input, artifact byte, or evidence identity as invalidation.
  Rebuild from the earliest affected state and repeat every dependent check and evidence request.
- Keep the last accepted state on rejection. Do not create a candidate record from partial construction,
  incomplete identity, failed evidence, or unavailable required environments.
- Preserve sanitized logs, symbols, partial artifacts, and request records needed to explain the stop.

### Phase 5 — Return the Candidate Decision

#### 5.1 Assemble one immutable candidate record per operating system and architecture

- For each accepted target operating system and architecture, record: source commit or digest; lockfile,
  dependency, Electron, configuration, and tool identities; operating system and architecture; artifact path
  and checksum; entry and resource manifest; ASAR and unpacked-file record; compiled-module rebuild record;
  fuse state; signature and notarization evidence where applicable; installer metadata;
  installation instructions; install and launch evidence; symbols and logs; known limitations; and
  reproduction command.
- Mark the record accepted only when construction, identity, required signatures, required notarization, and
  requested packaged and installed evidence are complete for the same candidate artifact checksum.
- Treat any field or byte change as a new candidate. Do not revise an accepted immutable record in place.

#### 5.2 Hand an accepted candidate forward or return an explicit rejection

- **Dynamic handoff — accepted immutable candidate → Electron Release:** send the complete record for the
  target operating system and architecture without a static sibling reference. The receiving operation may
  reject missing evidence or changed bytes and return the candidate to Packaging; it does not rebuild the
  artifact.
- For rejection, return the recorded build-input identity, affected artifact identity, last accepted state,
  failed condition, retained artifacts and logs, responsible owner, and required recovery action.
- Return no release-readiness, publication, rollout, support, or post-release recovery decision.

## References

- [`Electron Packaging Checklist`](checklists.md) owns reusable evaluation coverage for this operation.
