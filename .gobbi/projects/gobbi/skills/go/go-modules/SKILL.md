---
name: go-modules
description: "MUST load when creating, changing, validating, or releasing a Go module, including layout, go.mod, go.work, dependencies, tools, compatibility, and versions."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Go Modules

Use this operation to create, change, validate, or release one Go module. It produces a coherent module
contract, package layout, dependency graph, tool declaration, workspace boundary, compatibility position, and
release result.

The operation owns why and when module state changes. `go-toolchain` owns command syntax and side effects,
while deployment, container construction, operating-system packaging, service rollout, and repository
publication outside a module release are out of scope.

## Principles

### A module is a consumer contract

The module path, public packages, Go version, dependency graph, and release versions determine how consumers
build and upgrade. Treat them as one published surface rather than unrelated files.

### Prefer the simplest layout that preserves ownership

Most modules need a small package tree, not a universal application scaffold. Add `internal`, `cmd`, nested
modules, workspaces, or vendoring only when their ownership boundary has a current purpose.

### Keep dependencies deliberate and reproducible

Every direct dependency and tool adds compatibility, supply-chain, license, and maintenance obligations.
Standard-library code or an existing reviewed dependency is preferable when it meets the requirement clearly.

### Compatibility is a release decision

An apparently small API, package, module-path, or Go-version change can break consumers. Classify compatibility
before choosing a version or tag.

## Rules

- **MUST establish author or read-only review mode and define the module path, consumers, public packages,
  supported Go floor, toolchain policy, and release outcome before changing module state.** Derive author-mode
  values from the repository contract; in review mode, inspect proposed commands and diffs without mutation.
- **MUST keep every direct dependency, replacement, retraction, exclusion, workspace entry, vendor choice, and
  tool dependency intentional and reviewable.** Remove temporary graph controls before release unless they are
  part of the published contract.
- **MUST review changes to `go.mod`, `go.sum`, and `go.work` as source-controlled behavior.** Explain an
  unexpected version, checksum, indirect dependency, Go directive, or toolchain directive before accepting it.
- **MUST preserve credentials and private-module boundaries.** Never write tokens, credential-bearing proxy
  URLs, workstation paths, or unintended private module names into published module files or logs.
- **MUST classify every published API or module-path change against existing consumers before release.** Follow
  semantic import versioning for version 2 or later and keep the path, imports, and tag consistent.
- **NEVER publish a module that depends on a temporary local `replace`, an unpublished workspace module, or
  generated state absent from the release contents.** Validate the module outside the development workspace
  before tagging it.

## Procedure

### Phase 1 — Define the Module Contract

#### 1.1 Inspect the existing contract

- Read repository instructions, `go.mod`, `go.sum`, `go.work`, package directories, imports, build constraints,
  release automation, tags, continuous-integration versions, generated inputs, license files, and consumer
  documentation.
- Establish whether the target is a new module, dependency edit, workspace edit, layout change, compatibility
  change, tool declaration, or release. Identify author mode or read-only review mode.
- Run or plan focused environment lookups through `go-toolchain` to confirm the selected module, workspace, Go
  version, target platforms, cgo requirements, proxy/private settings, and graph.
- Preserve the baseline files and command output needed to explain every resulting graph change. Stop if the
  active workspace or local replacement hides the actual module that would be released.

#### 1.2 Lock consumers, versions, and outcome

- Choose the module path from its durable repository or publishing location. For a version 2 or later module,
  include the required `/vN` path suffix except where the official module rules define another form.
- Name intended consumers, public packages, command packages, supported Go floor, optional `toolchain`
  suggestion, platforms, cgo boundary, private dependencies, and compatibility promise.
- Use the lowest Go version that the project intends to support and that its syntax, standard-library APIs,
  dependencies, and tools actually permit. Do not lower or raise it without evidence from all four.
- Define completion: validated local module, reviewed dependency change, workspace state, compatibility plan,
  or an exact release tag and contents. A remote tag or publication remains a separately authorized side effect.

### Phase 2 — Shape Source and Packages

#### 2.1 Choose the package layout

- Start with packages at the module root and clear subdirectories, following the
  [official module layout guidance](https://go.dev/doc/modules/layout). Let package responsibilities and public
  import paths determine directories.
- Use `internal` when the Go tool's enforced import boundary matches the intended privacy boundary. Use
  `cmd/name` for distinct commands when several executables share the module; a single command may remain in a
  simpler main package.
- Keep libraries importable and command orchestration thin when the same behavior needs tests or reuse. Do not
  create `pkg`, `src`, `util`, or layer directories solely because another ecosystem uses them.
- Create a nested module only when it is an independently versioned, consumed, and released unit. Otherwise
  keep one graph and avoid hiding packages from parent-module patterns such as `./...`.

#### 2.2 Establish new-module source state

- In author mode, initialize only the intended directory with the locked module path and then set directives
  through the supported toolchain or a precise reviewed edit. Do not initialize over an existing module or
  nested path by accident.
- Add the smallest package or command skeleton that proves the chosen layout and import paths. Keep generated
  files tied to their inputs and exclude local workspace assumptions from the module contract.
- Add package documentation, license notices, and release contents required by the repository. Verify that
  ignored files do not contain source or metadata needed by consumers.
- In review mode, compare the proposed path, layout, and package visibility with current consumers without
  mutating files.

### Phase 3 — Manage Dependencies, Tools, and Workspaces

#### 3.1 Change the dependency graph deliberately

- Prefer the standard library or an already accepted dependency when it meets the requirement. For a new
  dependency, inspect maintenance, license, provenance, version history, transitive graph, known
  vulnerabilities, platform needs, and API fit before addition.
- Use the project toolchain to add, upgrade, downgrade, or remove the narrow dependency. Review the selected
  version and transitive changes rather than requesting an unconstrained broad update.
- Run `go mod tidy` only after imports and build constraints represent the intended source. Review both additions
  and removals in `go.mod` and `go.sum`; the
  [dependency-management guide](https://go.dev/doc/modules/managing-dependencies) explains the graph workflow.
- Validate vendoring, replacements, exclusions, and retractions only when the project uses them. A local
  `replace` is development state unless the published contract and consumer environment can resolve it.

#### 3.2 Declare tools and workspace use

- Pin project tools through the mechanism supported by the module's Go version and repository convention,
  including the `tool` directive where that contract supports it. Keep the tool version, invocation, and update
  path reviewable under the [module-file reference](https://go.dev/ref/mod).
- Do not install an unversioned command globally as the hidden source of generated or checked output. Route
  installation effects and command behavior through `go-toolchain`.
- Use `go.work` for local multi-module development when changes genuinely span modules. Keep `use` and
  `replace` entries local to the intended workspace and inspect `go work sync` propagation before accepting
  module edits.
- Verify each affected module outside the workspace or with `GOWORK=off` as appropriate. If that state fails,
  repair the module contracts rather than publishing a workspace-only build.

### Phase 4 — Validate Compatibility and Release

#### 4.1 Validate the consumer position

- Run formatting, analysis, tests, builds, generated-state checks, platform checks, vulnerability checks, and
  module graph checks selected by the project. Use the locked Go floor as well as newer supported toolchains
  when compatibility spans them.
- Build or test a representative external consumer for exported packages, especially after module-path,
  package-path, interface, error, generic, or initialization changes. Verify commands from outside their source
  directory when installation is part of the contract.
- Inspect release contents for licenses, documentation, generated files, cgo assets, embedded files, and
  accidental secrets. Confirm no temporary replacement, workspace dependence, or private path remains.
- If validation exposes an unsupported floor or hidden dependency, return to the earliest contract or graph
  step, update the decision, and repeat all affected checks.

#### 4.2 Classify and prepare the release

- Compare exported APIs, package paths, behavior, errors, wire formats, initialization, and Go requirements with
  the latest released version. Use the [Go module compatibility guidance](https://go.dev/blog/module-compatibility)
  to find changes that source compilation alone misses.
- Preserve compatibility throughout version 1 unless the project explicitly chooses a documented breaking
  strategy. For version 2 or later, keep the module path, imports, `go.mod`, documentation, and `vN.x.y` tag
  aligned under semantic import versioning.
- Choose the semantic version from the classified change, check that the tag does not already exist, and
  prepare release notes for consumer-visible behavior, migration, and support changes. Follow the
  [module release workflow](https://go.dev/doc/modules/release-workflow/).
- Create or publish the tag only when the task grants that external authority. Otherwise hand off the exact
  proposed tag, verified commit or tree, validation evidence, compatibility assessment, and first authorized
  release action.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
