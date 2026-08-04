---
name: go-modules
description: "MUST load when creating, changing, or validating a Go module, including its path, layout, go.mod, go.work, dependencies, tools, external-consumer validation, and compatibility analysis."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Go Modules

Go Modules creates, changes, or validates one Go module. It returns a coherent module path, layout, graph,
workspace, dependencies, tools, exact public package paths and project commands, external-consumer result, and
module consumer compatibility analysis.

The operation has author and validation modes. It owns the exact module facts release needs, but it owns no
version or tag proposal or decision, tag or ref creation, publication, external mutation, or release recovery.
`go-toolchain` owns project command syntax, exact package pattern semantics, the selected Go toolchain version,
and project command effects. `go-testing` owns evidence selection and interpretation. `go-security` owns protected-data
judgment. Binary and archive production belongs to `go-packaging`; release decisions and results belong to
`go-release`.

## Principles

### Treat the module as a consumer contract

The module path, `go` directive, exact public package paths, dependencies, and project commands determine how
consumers build and use the module. Review them as one contract.

### Prefer the smallest layout with real ownership

Most modules need a small package tree rather than a universal scaffold. Add `internal`, `cmd`, nested modules,
workspaces, or vendoring only when each boundary has a current purpose.

### Keep the graph deliberate and reproducible

Every dependency, tool, replacement, workspace entry, and cache or download effect adds maintenance and trust
obligations. Accept only graph state that remains explainable outside one workstation.

### Prove the module from a consumer position

Workspace-only success and internal project checks cannot establish the external contract. Validate an external
consumer and return a module consumer compatibility analysis without making a release decision.

## Rules

- **MUST select exactly one author or validation mode before action and bind its complete effect contract.**
  Project writes, disposable outputs, caches and downloads, project execution, network access, credential use,
  external mutation, pause points, terminal result, and recovery must match that mode.
- **MUST bind the module path, `go` directive, module's Go language version, minimum supported Go version,
  consumers, exact public package paths, project commands, and compatibility promise.** Obtain the selected Go
  toolchain version and command semantics from `go-toolchain` rather than inferring them from the module.
- **MUST keep every dependency, replacement, retraction, exclusion, workspace entry, vendor choice, and tool
  declaration intentional and reviewable.** Explain every unexpected change to `go.mod`, `go.sum`, `go.work`,
  or other accepted graph state.
- **MUST bind every authenticated private-module read to exact current manager authority.** Name the private
  module or import-path scope, proxy or version-control-system destination, credential/destination owner,
  ephemeral credential delivery, redacted evidence, and declared cache/download effects without persistence or
  external mutation.
- **MUST validate the module outside development-only state and return the external-consumer result and module
  consumer compatibility analysis.** Classify affected consumers as `compatible`, `migration supplied`,
  `authorized break`, or `unsupported` without choosing a version or tag.
- **NEVER turn module readiness into release authority or a release result.** Hand exact module facts to
  `go-release`; do not propose or decide a version or tag, create a tag or ref, publish, mutate external state,
  or own release recovery.

## Procedure

### Phase 1 — Bind the Module Contract and Mode

#### 1.1 Inspect and define the module contract

- Read repository instructions, `go.mod`, `go.sum`, `go.work`, package directories, imports, build constraints,
  continuous-integration versions, generated inputs, license files, consumer documentation, and relevant module
  history. Preserve the baseline files and evidence needed to explain graph changes.
- State the requested module result: new module, dependency edit, workspace edit, layout change, tool declaration,
  compatibility change, or validation. Bind the module path, consumers, exact public package paths, project
  commands, supported `GOOS/GOARCH` targets, cgo boundary, private dependencies, and compatibility promise.
- Record the `go` directive and module's Go language version separately from the minimum supported Go version.
  Confirm that source syntax, used standard-library APIs, dependencies, and tools support the project-supplied
  minimum. Use `go-toolchain` to bind the selected Go toolchain version, active module or workspace, working
  directory, environment inputs, `GOOS/GOARCH` target, exact package pattern only as project-command selection
  or evidence, and project command effects.
- Stop if an active workspace, local replacement, ambient proxy setting, or unavailable generated input hides
  the graph an external consumer would receive.

#### 1.2 Select author or validation mode and bind effects

- Select exactly one mode. Authority in one mode or sibling does not transfer to another effect.
- **Author mode:** project-path writes are limited to authorized module, layout, workspace, dependency, and
  tool-declaration paths; disposable writes are approved validation outputs with no secret material; caches,
  module downloads, and tool downloads are named and authorized, and private downloads use a declared cache and
  retention boundary; execution is limited to authorized project commands for module, workspace,
  external-consumer, named private module or import-path scope, and project test evidence. Network access is none
  by default; an authenticated read or download is allowed only for the named private module or import-path scope
  and proxy or version-control-system destination under exact current manager authority. Credential use is only
  that authenticated read under exact current manager authority and named ephemeral delivery; external mutation
  is forbidden. Never persist, expose, copy into evidence, or log credentials or private-module settings. Pause
  before the first network or credential use, every scope or destination change, a compatibility break, or a
  release decision. The terminal result is coherent module facts and module consumer compatibility analysis
  with redacted authenticated-read and cache/download evidence for release, or an exact block. Recovery retains
  module and consumer evidence, redacted failure evidence, and safe cache state, and names the
  credential/destination owner and first recovery action.
- **Validation mode:** project source is read-only; disposable writes are specified temporary outputs with no
  secret material; caches are contained as declared, and private downloads use a declared cache and retention
  boundary; execution is limited to authorized project commands for module, external-consumer, and named private
  module or import-path validation. Network access is none by default; an authenticated read or download is
  allowed only for the named private module or import-path scope and proxy or version-control-system destination
  under exact current manager authority. Credential use is only that authenticated read under exact current
  manager authority and named ephemeral delivery; external mutation is forbidden. Never persist, expose, copy
  into evidence, or log credentials or private-module settings. Pause before the first network or credential
  use, every scope or destination change, an undeclared download, or a project write. The terminal result is a
  validation result with exact release facts and redacted authenticated-read and cache/download evidence, or a
  bounded evidence gap. Recovery retains consumer and graph evidence, redacted failure evidence, and safe cache
  state, and names the credential/destination owner and first recovery action.

### Phase 2 — Shape the Module and Graph

#### 2.1 Establish the module path and package layout

- Choose the module path from its durable repository or publishing location. For major version 2 or later, use
  the `/vN` path form where the [official module rules](https://go.dev/doc/modules/major-version) require it;
  align the module path, exact public package paths, imports, and consumer documentation without proposing a tag.
- Start with packages at the module root and clear subdirectories, following the
  [official module layout guidance](https://go.dev/doc/modules/layout). Let package responsibilities and exact
  public package paths determine directories.
- Use `internal` only when its enforced import boundary matches the intended privacy boundary. Use `cmd/name`
  for distinct commands when several executables share the module; a single command may remain in a simpler
  main package. Keep reusable libraries importable and command orchestration thin.
- Do not create `pkg`, `src`, `util`, a layer directory, or a nested module by convention alone. Create a nested
  module only when it is independently consumed and versioned; otherwise preserve one visible graph.

#### 2.2 Establish the dependency, tool, and workspace contract

- Prefer the standard library or an accepted dependency when it meets the need. Before adding or changing a
  dependency, inspect API fit, maintenance, license, provenance, version history, transitive graph, known
  vulnerabilities, supported `GOOS/GOARCH` targets, cgo requirements, and download cost.
- Add, upgrade, downgrade, or remove only the intended dependency. Run `go mod tidy` only after imports and build
  constraints represent the intended source, then review every addition and removal in `go.mod` and `go.sum`.
  Validate each retained replacement, exclusion, retraction, and vendor choice against the consumer contract;
  the [dependency-management guide](https://go.dev/doc/modules/managing-dependencies) owns the graph workflow.
- Pin project tools through the mechanism supported by the module's Go language version and project convention,
  including a `tool` directive when applicable. Keep the tool version, project command, and update path
  reviewable under the [module-file reference](https://go.dev/ref/mod). Do not use an ambient unversioned global
  command as the hidden source of generated or checked output.
- Use `go.work` only for intentional multi-module development. Review every `use` and `replace` entry and any
  `go work sync` propagation. Validate each affected module outside the workspace or with `GOWORK=off` when
  appropriate; repair a workspace-only result instead of accepting it.

### Phase 3 — Apply and Validate the Module State

#### 3.1 Apply only the selected mode

- In author mode, initialize only the intended directory with the bound module path or make the authorized
  module, layout, workspace, dependency, and tool-declaration edits. Add the smallest package or command
  skeleton that proves the layout and exact public package paths. Keep generated files tied to their inputs.
- Add package documentation, license notices, generated files, embedded assets, and cgo inputs that consumers
  need. Confirm that ignored or development-only files are not required by the module contract.
- In validation mode, inspect the same module, layout, graph, workspace, dependency, tool, and consumer facts
  without writing project source. Stop before any proposed project write.
- Review the complete diff or reviewed state. Explain every unexpected directive, checksum, indirect dependency,
  replacement, workspace entry, tool declaration, and local-path dependency before proceeding.

#### 3.2 Perform authorized private reads and project validation

- Before the first private read, bind the named private module or import-path scope, proxy or
  version-control-system destination, separate network and credential-read authority, credential/destination
  owner, named ephemeral delivery, redaction boundary, declared cache/download effects, retention boundary, and
  project command. Do not use a credential until all fields have exact current manager authority.
- Run only the authorized authenticated read or download. Stop before a changed scope or destination and obtain
  new current manager authority. Never persist or report the credential or private-module settings, and never
  let an authenticated read authorize external mutation.
- Run the project-selected formatting, analysis, test, build, generated-state, `GOOS/GOARCH` target,
  vulnerability, and module-graph project commands that the result requires. Use the minimum supported Go
  version and each applicable newer selected Go toolchain version when the compatibility promise spans them.
- On failure, stop further network and credential use. Retain the module and consumer graph, redacted first
  useful diagnostic, declared safe cache state, and evidence limits. Name the credential/destination owner and
  first recovery action; do not weaken checksum, proxy, privacy, or credential handling.

### Phase 4 — Analyze Consumers and Return the Module Result

#### 4.1 Validate external consumers and compatibility

- Build or test a representative external consumer for every promised exact public package path. Verify each
  installable command from outside its source directory and without development workspace assumptions. Record
  the external-consumer result and every untested consumer or environment.
- Inspect consumer-required contents for licenses, documentation, generated files, embedded assets, cgo inputs,
  and accidental protected data. Confirm that no temporary replacement, unpublished workspace module, local
  path, or unavailable input is required.
- Compare public APIs or CLIs, exact public package paths, behavior, errors, wire formats, initialization, module
  path, and minimum supported Go version with the accepted consumer contract. Return the module consumer
  compatibility analysis as `compatible`, `migration supplied`, `authorized break`, or `unsupported`, naming
  affected consumers and evidence limits. Use the
  [Go module compatibility guidance](https://go.dev/blog/module-compatibility) to identify consumer changes
  that source compilation alone misses.
- If an external consumer fails, a hidden dependency appears, the minimum supported Go version conflicts with
  the project contract, or compatibility evidence is incomplete, return to the earliest responsible contract,
  layout, graph, or validation step. Do not convert another environment's success into a module result.

#### 4.2 Return completion, block, recovery, and handoff records

- Return the universal fields, naming why any is not applicable: operation and mode; accepted result; decision
  basis; actual owned object; terminal state selected from exactly `success`, `error`, `cancellation`,
  `timeout`, `blocked`, or `user-decision pause`; changed or reviewed paths; project-command evidence; evidence
  limits; external reads or effects; compatibility decision selected from `compatible`, `migration supplied`,
  `authorized break`, or `unsupported` when applicable; block; recovery; and handoff. A Go panic is program
  behavior, not an operation terminal state.
- Project-command evidence names the project command, exact package pattern, selected Go toolchain version,
  flags, `GOOS/GOARCH` target, inputs, duration, and result. External reads or effects name the network
  destination, cache or download scope, credential-use fact, external-mutation fact, current authority,
  redaction, and retained state.
- Add the module path; layout; graph; workspace; `go` directive; module's Go language version; minimum supported
  Go version; dependencies; tools; exact public package paths and project commands; external-consumer result;
  module consumer compatibility analysis; and exact facts release needs.
- For a private read, also return the named private module or import-path scope, proxy or
  version-control-system destination, authorized network and credential reads, redacted evidence and limits,
  declared cache/download effects, credential/destination owner, retained safe state, and first recovery
  action. State that external mutation did not occur. Return no credential or private-module setting.
- Complete author mode only with coherent module facts and module consumer compatibility analysis. Complete
  validation mode only with the validation result and exact release facts. In either mode, retain the exact
  bounded evidence gap rather than claiming a module result across workspace-only success, a conflict with the
  minimum supported Go version, hidden replacement, consumer failure, unavailable private-module authority or
  credential, unsafe credential handling, or incomplete module consumer compatibility evidence.
- For a block, name the missing prerequisite or first useful diagnostic, affected obligation, current evidence,
  risk, credential/destination or other recovery owner, retained safe state, first recovery action, and handoff.
  Hand exact module facts to `go-release` without a version or tag proposal or decision, tag or ref effect,
  publication, external mutation, or release recovery. When this result enters Evaluation, apply the
  [evaluation checklist](checklists.md) and every active `go` sibling checklist; Evaluation owns evidence
  resolution and verdicts.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
