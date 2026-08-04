---
name: go-packaging
description: "MUST load when producing or validating Go binaries or archives, including the project default build command, named GOOS/GOARCH targets, metadata, checksums, reproducibility, and artifact smoke checks."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Go Packaging

Use this operation to produce or validate one caller-designated local Go binary or archive. It turns an exact
project build contract into final artifact bytes, an identity for those bytes, and bounded readiness evidence,
or it returns an explicit block without widening authority.

This operation owns local binary and archive construction, archive assembly, embedded or adjacent metadata,
inventory, checksums, reproducibility evidence, and isolated binary or archive smoke checks. It does not choose
release classification, version, tag, destination, publication, credentials, authority, or a later action.

Exactly two modes exist: **Produce** and **Validation**. Select one before any Packaging project command runs;
never blend their write boundaries or infer a missing mode from the artifact path.

## Principles

### Final bytes define artifact identity

The checksum algorithm/value and inventory describe the final bytes, not the source intention. Any changed
binary or archive byte invalidates every dependent identity and readiness claim until the affected evidence is
recomputed.

### Effects are part of the build contract

Source reads, artifact-path writes, temporary-path writes, cache effects, downloads, network access, executed
project code, and external actions are distinct. Classify each before execution and stop when authority does
not cover the exact effect.

### Binary or archive behavior is checked in isolation

Inspect binaries and archive members directly. Run only the named isolated smoke-check project command in an
isolated environment whose files, processes, network, and cleanup boundary are explicit.

### Local readiness is not release authority

Packaging returns exact local binary or archive identity and its limits only to `go-release`. It never converts
local build or smoke evidence into permission for publication or any external action.

## Rules

- **MUST select Produce or Validation and bind the caller, consumer, binary or archive kind, artifact path,
  project default build command plus named target, exact package pattern only as the selector passed to that
  project command and as command evidence, selected Go toolchain version, module's Go language version when
  language or module behavior selected by the `go` directive matters, `GOOS/GOARCH` target, inputs, effect
  authority, write boundaries, non-goals, and terminal contract before execution.** `go-toolchain` alone owns
  exact package pattern semantics.
- **MUST keep project source read-only in both modes and existing binaries or archives read-only in
  Validation.** Produce may write only the caller-designated artifact path and approved bounded temporary
  locations; Validation may write rebuilt comparison or validation bytes only in a named isolated temporary
  location.
- **MUST limit project-command execution to the authorized project default build command plus named target and
  the named isolated smoke-check project command.** Classify caches and downloads separately, and use network
  only for a separately authorized classified download.
- **MUST compute identity and readiness evidence from final bytes.** Record binary or archive kind, artifact
  path, byte size, permission mode, checksum algorithm and value, source/build/input identities, project default
  build command plus named target, exact package pattern as command evidence, selected Go toolchain version,
  `GOOS/GOARCH` target, cgo and C compiler or system library inputs, flags, build tags, embedded or adjacent
  metadata by kind/value/location/source, archive format and compression, archive member and embedded or
  adjacent asset inventories, and only a contract-required creation time.
- **MUST state the reproducibility position literally.** Claim it only from selected exact repeat builds under
  a recorded comparison contract; otherwise return `not claimed` and the limiting reason.
- **NEVER use credentials, mutate an external system, or create a release effect.** Report `credential use:
  none`, `external mutation: none`, and `release effect: none`; pause before a credential need, source mutation,
  undeclared artifact or temporary path, cache, download, network, `GOOS/GOARCH` target, publication,
  destination, or external action.

## Procedure

### Phase 1 — Bind the Packaging Contract

#### 1.1 Select the mode and subject

- Select exactly one mode: **Produce** creates final bytes at the caller-designated local artifact path;
  **Validation** reads an existing binary or archive and, when comparison is required, places rebuilt bytes
  only in a named isolated temporary location.
- Record the acting agent, caller, user or named project decision authority, consumer, binary or archive kind,
  artifact path, project default build command plus named target, exact package pattern only as that project
  command's selector and evidence, selected Go toolchain version, minimum supported Go version and module's Go
  language version when language or module behavior selected by the `go` directive matters, `GOOS/GOARCH`
  target, working directory, relevant environment inputs, source identity, build identity, input identity,
  effect authority, write boundaries, non-goals, compatibility obligation, and requested terminal result.
- Make the mode's read and write boundaries literal. Source is read-only in both modes; the existing
  binary or archive is also read-only in Validation.

#### 1.2 Classify effects and authority

- For Produce, classify source reads, the caller-designated artifact path, bounded temporary writes, build and
  module caches, downloads, network, and executed project code. Permit only the caller-designated artifact
  path, approved temporary locations, separately authorized classified cache and download effects, and network
  access used only for a separately authorized classified download. Its terminal result is exact local binary
  or archive identity and evidence, or an exact binary or archive block; recovery retains partial bytes only at
  a caller-named boundary or cleans only at a caller-named boundary and records the first recovery action.
- For Validation, classify source and existing-binary or existing-archive reads, isolated rebuilt comparison
  or validation bytes, temporary cleanup or retention, caches, downloads, network, and executed project code.
  Permit no write to the source, existing binary or archive, or any nonisolated path; use network only for a
  separately authorized classified download. Its terminal result is bound to the exact existing binary or
  archive bytes, or contains the exact failure or block; recovery retains or cleans rebuilt and validation
  bytes only at the named boundary and records the first recovery action.
- In both modes record `credential use: none`, `external mutation: none`, and `release effect: none`. Pause
  before any missing or expanded authority; these facts are not success defaults inferred after execution.

### Phase 2 — Resolve Inputs and Sibling Operations

#### 2.1 Establish the complete build input

- Read the module or workspace, applicable package name and import path, project scripts, supported
  `GOOS/GOARCH` targets, and selected Go toolchain version contract. Record the exact package pattern only as
  the literal selector passed to a `go` or project command and as that command's evidence.
- Record cgo state, C compiler and tool identities, system headers and libraries, build tags, flags,
  environment inputs, generated files, `//go:embed` assets, adjacent assets, and every other runtime file
  expected in the binary, archive, or adjacent asset path.
- Record embedded or adjacent metadata by kind, value, location, and source. For an archive, also bind member
  paths, format, compression, permission policy, and ordering policy. Bind the checksum algorithm and whether a
  reproducibility comparison is required; this operation supplies no universal choice or promise.

#### 2.2 Route prerequisites to their named operations

- Route project-command syntax and effects, exact package pattern semantics, cache or download behavior,
  selected Go toolchain version, and `GOOS/GOARCH` target feasibility to `go-toolchain`.
- Route module, workspace, dependency, checksum-resolution, replacement, vendor, and private-module read needs
  to the applicable `go-modules` mode. If private-module access needs authentication, Packaging receives only
  the returned cache, module, and resolution evidence; it never receives a credential.
- Route smoke-case selection and behavioral evidence to `go-testing`. Route sensitive embedded or adjacent
  metadata, cgo or system dependency risk, archive risk, and binary or archive disclosure risk to
  `go-security`. Stop until every required returned fact agrees with the bound Packaging contract.

### Phase 3 — Produce or Validate

#### 3.1 Produce final artifact bytes

- Confirm the caller-designated artifact path and every bounded temporary path are absent, empty, or exactly
  resolved for the caller-authorized write. Do not clean an unrelated or unresolved path.
- Run the exact authorized project default build command plus named target with the bound environment inputs,
  exact package pattern passed as its selector, selected Go toolchain version, `GOOS/GOARCH` target, cgo state,
  tags, flags, and embedded or adjacent metadata inputs. Do not substitute another project command merely
  because it produces a binary.
- Record the project-command evidence: exact invocation, working directory, relevant environment inputs, exact
  package pattern as command evidence, selected Go toolchain version, `GOOS/GOARCH` target, standard output,
  standard error, exit status, duration when relevant, first useful diagnostic, observed effects, and evidence
  limits.
- Assemble an archive only when the bound binary or archive kind requires it. Reject absolute paths, parent
  traversal, links or special entries outside policy, duplicate paths, missing declared members, and
  unexpected members.
- Stop on a missing selected Go toolchain version, unsupported `GOOS/GOARCH` target, cgo or system dependency
  gap, missing generated or `//go:embed` input, missing adjacent asset, undeclared cache or download, network
  need, source write, or binary, archive, or temporary write outside the named boundary.

#### 3.2 Validate existing binary or archive bytes

- Read the existing binary or archive without modification. Inspect its kind, size, permission mode,
  `GOOS/GOARCH` target, embedded or adjacent metadata, archive structure, members, embedded inputs, and adjacent
  asset inventory against the bound contract.
- If comparison requires a rebuild, run only the authorized project default build command plus named target;
  place every rebuilt or derived byte in the named isolated temporary location and record its cleanup or
  retention boundary. Record the same project-command evidence fields required in Produce.
- Compare expected and observed files, members, paths, permissions, `GOOS/GOARCH` target, embedded or adjacent
  metadata by kind/value/location/source, inventories, and checksum algorithm/value. An embedded or adjacent
  metadata mismatch is a contained failure. A checksum algorithm/value mismatch is a contained failure. Neither
  is a cosmetic exception.
- Return a result bound to the exact existing binary or archive bytes, or return the mismatch, last matching
  identity, retained evidence, and first recovery action.

### Phase 4 — Identify and Exercise Final Bytes

#### 4.1 Build the final-byte identity

- After all byte-producing work ends, record binary or archive kind, exact artifact path, byte size, permission
  mode, checksum algorithm and value, source and build identities, project default build command plus named
  target, exact package pattern as command evidence, selected Go toolchain version, `GOOS/GOARCH` target, cgo
  state, C compiler and system library inputs, flags, and tags.
- Record embedded or adjacent metadata kind, value, location, and source; archive format, compression, and
  complete member inventory; adjacent and embedded asset inventory; and a creation time only when the binary or
  archive contract requires it.
- Derive every checksum, inventory, and embedded or adjacent metadata observation from the final bytes. Never
  preserve a value from an earlier binary or archive that happens to share a name.

#### 4.2 Validate behavior and reproducibility

- Validate expected files and members, absence of absolute or parent-traversal paths, permission modes,
  `GOOS/GOARCH` target identity, embedded or adjacent metadata, checksum algorithm/value, and the absence of a
  read or write outside the bound input and path sets. Keep each observation tied to the final checksum value.
- Run only the named smoke-check project command for selected startup, help, version, or similarly bounded
  behavior. Isolate its working directory, environment, files, processes, and caches, and disable network
  access because Packaging permits network only for a separately authorized classified download. The smoke
  project command must not install, publish, deploy, contact a production service, start a persistent service,
  or mutate the binary or archive. Record its exact invocation, standard output, standard error, exit status,
  first useful diagnostic, observed effects, smoke result, and evidence limits.
- When reproducibility is selected, repeat the exact build under the recorded environment and record the
  comparison method, tolerated differences and reasons, repetition count, and result. One build never proves
  reproducibility.
- When reproducibility is not selected or cannot be established, record `reproducibility: not claimed` and the
  exact limitation. Do not turn checksum algorithm/value agreement or a successful smoke result into a broader
  promise.

### Phase 5 — Recover and Return

#### 5.1 Invalidate and recover from change or failure

- Any final-byte change invalidates the checksum algorithm/value, inventories, embedded or adjacent metadata
  observations, smoke result, reproducibility position, and local readiness state. Recompute every affected item
  before returning local readiness.
- On failure, stop at the first unauthorized or unmet condition and record the exact diagnostic, affected
  obligation, last matching identity, partial binary or archive state, and first recovery action. Never weaken
  the `GOOS/GOARCH` target, embedded or adjacent metadata contract, archive contract, checksum algorithm/value,
  isolation, or effect constraints to obtain success.
- On error, cancellation, or timeout, preserve the matching terminal state, unfinished obligation, partial
  binary or archive state, and resume point. Never call a partial result successful.
- Retain partial binary or archive bytes only at the caller-named retention boundary. Clean them only at the
  caller-named cleanup boundary after resolving it exactly; otherwise leave them in place and report their state.

#### 5.2 Return the Packaging result

- Return the universal fields, naming why any field is not applicable: operation and mode; accepted result;
  decision basis; actual binary or archive and artifact path; acting agent; caller; user or named project decision
  authority; consumer; terminal state; changed or reviewed paths; project-command evidence; evidence limits;
  external reads or effects; compatibility decision; block; recovery; and handoff. Select the terminal state
  from exactly `success`, `error`, `cancellation`, `timeout`, `blocked`, or `user-decision pause`.
- When an affected-consumer compatibility decision applies, return exactly `compatible`, `migration supplied`,
  `authorized break`, or `unsupported`; otherwise omit it only with an explicit not-applicable reason. Add the
  binary or archive kind, artifact path, byte size, permission mode, checksum algorithm/value, project default
  build command plus named target, exact package pattern as command evidence, selected Go toolchain version,
  `GOOS/GOARCH` target, source/build/input identities, cgo state and C compiler or system library inputs, flags
  and build tags, embedded or adjacent metadata kind/value/location/source, archive format and compression,
  archive member and embedded or adjacent asset inventories, contract-required creation time, smoke result,
  and reproducibility position.
- Repeat `credential use: none`, `external mutation: none`, and `release effect: none`. Completion requires
  every universal and Packaging-specific field, or an explicit block tied to each missing obligation.
- **Handoff — exact local artifact identity and readiness → `go-release`:** send the final-byte identity,
  inputs, embedded or adjacent metadata, checksum algorithm/value, archive member and embedded or adjacent asset
  inventories, reproducibility position, smoke result, consumer, compatibility, limits, block or recovery
  state, and handoff status. The receiver may reject changed bytes or missing evidence; it neither rebuilds nor
  alters the binary or archive and does not ask Packaging to choose or perform a later action.

## References

- [Evaluation checklist](checklists.md) is the local unchecked evaluation source for this skill.
