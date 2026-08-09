---
name: python-packaging
description: "MUST load when Python package build metadata, distribution identity, artifacts, installed behavior, or installed-consumer tests are created, changed, or validated."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Python Packaging

Python Packaging creates, changes, or validates Python package build metadata, distribution identity, artifacts,
installed behavior, and installed-consumer evidence. It returns a bounded record of what the built distribution
contains and how an isolated consumer observes it.

This operation owns `pyproject.toml` packaging semantics and distribution behavior. General workspace placement
belongs to `python-project-structure`; concrete tool commands belong to `python-toolchain`; and immutable
artifact release readiness belongs to `python-release`. Project configuration decides the backend and tools.

## Principles

### Treat the installed consumer as the package boundary

A source checkout can accidentally make imports appear valid. Distribution behavior is established by the
configured build metadata, produced artifact, and an isolated installed consumer.

### Separate placement from distribution semantics

Workspace organization is not automatically package policy. A source-versus-flat layout choice belongs here only
when it changes what an installed consumer imports, receives, or validates.

### Preserve artifact identity

An artifact is evidence only when its path, bytes, metadata, and producing configuration remain identifiable.
Release coordination consumes that immutable record; it does not ask this operation to recreate it.

## Rules

- **MUST bind the distribution contract before changing packaging inputs.** Record the configured build metadata,
  public distribution and import identities, supported consumers, artifact types, and installed behavior to prove.
- **MUST use project-selected packaging tools and configuration.** No backend, installer, build command, or layout
  is universal; inspect the project before naming a concrete command or tool behavior.
- **MUST validate distribution behavior from built artifacts in an isolated consumer context.** Keep the source
  checkout from satisfying imports or metadata checks intended to prove the installed distribution.
- **MUST keep source and artifact identities explicit.** Record the source revision or input identity, metadata,
  artifact path and checksum or equivalent byte identity, installed test scope, and evidence limits.
- **NEVER publish, use publication credentials, or claim release readiness.** Hand immutable artifact evidence to
  `python-release`; general workspace placement remains with `python-project-structure`.

## Procedure

### Phase 1 — Bind the Distribution Contract

#### 1.1 Inspect packaging ownership and inputs

- Read the project configuration, including `pyproject.toml` when it owns packaging metadata, and identify the
  configured build backend, package-discovery rules, distribution name, version source, public import paths,
  declared dependencies, supported interpreter range, scripts, data files, and artifact expectations.
- Bind the declared project support policy to `Requires-Python`, declared dependencies, each metadata field's
  static or dynamic status, each dynamic field's project-provided source, and the selected build-isolation
  environment's declared requirements. Treat an absent or ambiguous source or requirement as a limit of this
  operation; do not infer a backend, resolver, support range, metadata source, or build environment.
- Record the consumer behavior to validate: installation, import, metadata lookup, command entry point, package
  data, or another published contract. Keep a source-tree observation distinct from installed-consumer evidence.
- Route ordinary workspace or documentation placement to `python-project-structure`. Route a layout decision here
  when it changes package discovery, included files, import resolution after installation, or installed tests.

#### 1.2 Define a bounded build and consumer check

- Select only project-configured build and installer actions. Bind their inputs, output directories, environment,
  authority, and stop conditions; do not add a tool or network access merely because it is common elsewhere.
- Name the artifact kind and required identity record. Define an isolated consumer environment that installs the
  built artifact and avoids importing the checkout through its current directory or path configuration.
- Stop with an exact block if the metadata, configured packaging mechanism, consumer contract, or required build
  authority is absent. Do not guess a backend, version policy, or package inclusion rule.

### Phase 2 — Create or Validate the Distribution

#### 2.1 Change metadata or distribution behavior when authorized

- Make the smallest coherent update to the owned packaging inputs. Keep distribution metadata, discovered package
  set, import names, dependencies, package data, entry points, and artifacts consistent with the intended consumer
  contract.
- Verify that the produced artifact metadata agrees with the bound support policy, `Requires-Python`, declared
  dependencies, and static or dynamic metadata sources. Record its selected build-isolation environment and
  declared requirements with the artifact evidence; treat an absent, ambiguous, or mismatched input as incomplete
  evidence rather than inferring a replacement.
- For a `src` versus flat decision, state the installed behavior that changes and validate that behavior. Do not
  present either layout as universally correct or use this decision to reorganize unrelated workspace paths.
- Inspect the resulting metadata and artifact inventory for unexpected inclusions, omissions, or source-tree
  dependencies. Return to the earliest metadata or discovery rule that produced a mismatch.

#### 2.2 Build and identify the artifact

- Run the configured local build within the bound output and authority limits. Record the exact configuration and
  source input identity used to create each artifact.
- Record each artifact's path, kind, size, checksum or equivalent byte identity, distribution metadata, and
  included-package or file inventory where that inventory affects the consumer contract.
- Treat a failed, ambiguous, or mutable artifact as incomplete evidence. Preserve the diagnostic and hand the
  configuration issue to its owner instead of producing a substitute artifact.

### Phase 3 — Validate the Installed Consumer and Hand Off

#### 3.1 Exercise installed behavior

- Create or use the project-approved isolated consumer context. Install the exact identified artifact through the
  configured mechanism without relying on a source checkout import.
- Exercise the bound consumer behaviors and record the installed environment, artifact identity, commands or
  observations, results, and limits. Use `python-testing` when designing or interpreting broader correctness
  evidence beyond this distribution boundary.
- When the isolated consumer differs from source-tree behavior, retain both observations and trace the difference
  to metadata, package discovery, artifact contents, or environment configuration.

#### 3.2 Return immutable packaging evidence

- Return the configuration and source input identity, exact artifact identities, distribution and import names,
  installed-consumer observations, included content, compatibility assumptions, evidence limits, and first
  recovery action when blocked.
- Hand the unchanged artifact record to `python-release` for readiness or authorized publication verification; general workspace placement remains with `python-project-structure`.

## References

- [Evaluation checklist](checklists.md) supplies local unchecked evaluation conditions.
- [PEP 517](https://peps.python.org/pep-0517/) defines the build-system interface.
- [PEP 621](https://peps.python.org/pep-0621/) defines project metadata in `pyproject.toml`.
- [PyPA: src layout versus flat layout](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/) explains their distribution-relevant trade-offs.
