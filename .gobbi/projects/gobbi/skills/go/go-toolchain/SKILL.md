---
name: go-toolchain
description: "MUST load when using or diagnosing the Go distribution, go command, compiler, formatter, vet, generators, build constraints, GOOS/GOARCH targets, or project-pinned Go tools."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# Go Toolchain

Use this tool skill to inspect, use, or diagnose the Go distribution, the `go` command, and project-selected
Go tools. It is a lookup manual for environment selection, project command mechanics, exact package patterns,
`GOOS/GOARCH` targets, diagnostics, formatting, generation, build constraints, caches, downloads, and cgo.

This skill teaches command behavior and records observed effects. The owning operation decides why and whether
a project command runs, supplies its authority, and owns the terminal result.

Package and API design belongs to `go-design`; source form and generated provenance belong to `go-source`;
naming and error text belong to `go-conventions`; comments belong to `go-documentation`; and credential or
protected-data decisions belong to `go-security`.

## Principles

### Establish the actual environment first

Go behavior depends on the selected Go version, selected toolchain, module or workspace, working directory,
environment inputs, `GOOS/GOARCH` target, and build constraints. Bind those facts before interpreting a result.

### Classify side effects before execution

A project command can write source, create generated outputs, populate caches, download a toolchain or module,
execute code, or contact the network. Classify those effects before the owning operation decides to run it.

### Use the narrowest authoritative command

The Go distribution provides focused commands, but a project command remains authoritative when it binds
required flags, an exact package pattern, a named target, or a pinned tool.

### Treat diagnostics as evidence with limits

Standard output, standard error, exit status, and the first useful diagnostic describe only the invocation that
produced them. No single clean project command proves formatting, behavior, portability, or security.

## Rules

- **MUST bind the selected Go version, selected toolchain, active module or workspace, working directory,
  environment inputs, `GOOS/GOARCH` target, and any applicable exact package pattern.** Read project-owned
  inputs and use focused lookups without changing configuration.
- **MUST use the Go version and toolchain declared or constrained by the project, dependencies, continuous
  integration, and release target.** Do not impose a family-wide Go release from this skill.
- **MUST classify source writes, generated outputs, module or workspace writes, executed code, cache effects,
  network effects, downloads, installed outputs, and persistent configuration before a project command runs.**
  Classification grants no authority to perform any effect.
- **MUST record the actual project command, inputs, standard output, standard error, exit status, and first
  useful diagnostic needed to explain the observed result.** Keep unexecuted exact package patterns,
  `GOOS/GOARCH` targets, and paths outside the claim.
- **MUST treat `go generate`, tests, analyzers, and project-pinned tools as executable code.** Inspect their
  source, version, inputs, expected source writes, generated outputs, and other declared effects before use.
- **NEVER use a lookup or tool result as implicit authority for network access, credentials, configuration
  changes, cache cleaning, generation, source writes, or generated outputs.** In particular, `go env -w` and
  `go env -u` require explicit authority for the named per-user setting.

## Manual

### Discover the selected environment

Read `go.mod`, `go.work`, project scripts, continuous-integration configuration, container images, and release
targets before forming a diagnosis. The module's `go` and `toolchain` directives, `GOTOOLCHAIN`, dependency
constraints, and project matrices can all affect the selected Go version and selected toolchain; the
[official Go toolchain documentation](https://go.dev/doc/toolchain) owns their selection rules.

Use the smallest focused lookup that establishes the needed fact:

| Lookup | Establishes | Limit to record |
|---|---|---|
| `go version` | Executing `go` binary and selected Go version | Selection can depend on the working directory and toolchain policy |
| `go env GOMOD GOWORK GOTOOLCHAIN GOOS GOARCH CGO_ENABLED` | Active module or workspace, selection policy, `GOOS/GOARCH` target, and cgo state | Omit `-w` and `-u`; environment inputs and project files can override defaults |
| `go list -m` | Main module or requested module facts | Module loading can use caches or the network |
| `go list` with an exact package pattern | Packages selected under the current working directory, tags, and `GOOS/GOARCH` target | Unselected or constraint-hidden packages remain outside the result |

Environment output can contain private paths, module names, proxy details, or credentials. Record the smallest
relevant subset, and route protected-data handling decisions to `go-security`.

### Bind a project command and its evidence

A project command is the project-selected wrapper or exact Go invocation used for one operation-owned need.
The operation owns why and whether it runs and owns the terminal result; this manual owns its syntax,
selection facts, mechanics, and observed effects.

An exact package pattern is the literal package-selector argument passed to a `go` or project command. It can
select a set of packages, but it is never a package name, import path, package directory or placement, package
boundary, public API, CLI, or other package design identity.

A `GOOS/GOARCH` target is the exact `GOOS` and `GOARCH` environment-value pair bound to the project command.
It is distinct from a project target name, artifact identity, or proof of behavior on the target runtime.

Record applicable fields together so another reader can interpret the same invocation:

| Evidence field | Record |
|---|---|
| Selection | Project command, exact package pattern, flags, named project target, and selected tool or analyzer |
| Environment | Selected Go version, selected toolchain, working directory, relevant environment inputs, and `GOOS/GOARCH` target |
| Observation | Standard output, standard error, exit status, duration when relevant, and first useful diagnostic |
| Effects | Source writes, generated outputs, module or workspace writes, executed code, cache effects, downloads, network effects, installed outputs, and persistent configuration effects |
| Limit | Unexecuted exact package patterns, `GOOS/GOARCH` targets, inputs, environments, exit paths, and consumers excluded from the claim |

### Classify project command effects

The [`go` command reference](https://pkg.go.dev/cmd/go) owns syntax and command semantics. Classify the exact
invocation rather than assigning one effect class to a command name:

| Command kind | Possible effects to bind |
|---|---|
| Focused lookup | `go version` and `go env` without `-w` or `-u` read selection facts; toolchain selection can still use a downloaded toolchain |
| Loading or analysis | `go list`, `go doc`, `go vet`, and similar tools can load packages, populate caches, download inputs, and execute analyzers |
| Build or execution | `go build`, `go run`, and `go test` can compile and cache packages; `go run` and tests execute code; a build of one main package can write an executable to the working directory, and `-o` names an output |
| Source writing | `gofmt -w`, `go fmt`, `go fix`, and `go generate` can create source writes or generated outputs |
| Module or workspace writing | `go get`, `go mod tidy`, `go mod edit`, `go work init`, `go work use`, `go work edit`, and `go work sync` can change module or workspace files |
| External or persistent | Automatic toolchain or module downloads, `go install`, project tools, credentialed reads, and `go env -w` or `go env -u` can affect networks, caches, installed outputs, protected inputs, or per-user configuration |

Commands that normally leave tracked source unchanged can still execute project or analyzer code, contact a
network, and populate caches. A source-read-only classification therefore does not imply an authorized or
side-effect-free invocation.

### Select a distribution command

| Need | Command role |
|---|---|
| Canonical formatter mechanics | `gofmt` for explicit files or `go fmt` for packages; written-form judgment belongs to `go-source` |
| Compile packages or binaries | `go build`; inspect its exact output behavior before treating it as a check |
| Run a main package | `go run`; it compiles and executes program code |
| Install a command | `go install`; a `package@version` invocation is separate from editing the main module graph |
| Execute tests or benchmarks | `go test`; test choice and evidence interpretation belong to `go-testing` |
| Run standard analyzers | `go vet`; findings are diagnostics, not style or correctness proof |
| Inspect package, module, file, dependency, or metadata facts | `go list` |
| Read rendered package or symbol documentation | `go doc`; documentation judgment belongs to `go-documentation` |
| Execute declared generators | `go generate`; `go build` and `go test` do not run it automatically |
| Apply source rewrites for old application programming interface use | `go fix`; inspect every source write |
| Invoke a bundled low-level tool | `go tool`; prefer the higher-level command when it owns the mechanism |
| Manage module facts or caches | `go mod`; module-graph decisions belong to `go-modules` |
| Manage a multi-module workspace | `go work`; do not treat temporary workspace state as a module result |

Use the exact package pattern and flags selected by the project command. A broad pattern such as `./...` can
include unrelated or expensive packages, while a narrow pattern can omit affected dependents; scope judgment
and the terminal result remain with the owning operation.

### Format, analyze, and diagnose

In read-only work, use the project's formatter check or inspect formatter output without accepting source
writes. In authorized author work, record the formatter project command and review every write; `go-source`
owns canonical form and import grouping, while this skill owns the formatter mechanics and evidence.

`go vet` runs selected analyzers for likely defects. It is neither a general linter nor correctness proof;
use the [`go vet` command documentation](https://pkg.go.dev/cmd/vet) for its current analyzers and flags.

Start with the first useful diagnostic that can explain or invalidate later messages. Bind its package or
file, location, exact package pattern, build constraints, generated state, selected Go version, selected
toolchain, standard error or standard output, and exit status before proposing a tool diagnosis; the
[Go diagnostics guide](https://go.dev/doc/diagnostics) distinguishes the distribution's diagnostic tools.

### Generate source

`go generate` scans directives and runs their named commands in package context. It is not run automatically
by `go build` or `go test`, and it does not determine dependency, output, idempotence, or trust contracts; the
[Go generate design](https://go.dev/blog/generate) leaves those facts with the project.

Before authorized generation, inspect each directive, executable version, working directory, inputs,
environment inputs, network effects, expected source writes, and generated outputs. Afterward, record every
addition, change, and deletion. `go-source` owns generated provenance and source form; the owning operation
owns whether generation runs and whether its result is accepted.

### Interpret build constraints and targets

Build constraints include file-name suffixes, `//go:build` expressions, release tags, tool tags, cgo, and the
`GOOS/GOARCH` target. The [build-constraint reference](https://pkg.go.dev/cmd/go#hdr-Build_constraints) owns
the current file-selection rules; `go-source` owns the source organization and canonical written form.

Record the exact constraint inputs and selected file set for each claimed `GOOS/GOARCH` target.
Cross-compilation can expose file-selection, compilation, and linking problems without proving runtime
behavior. Cgo can additionally need a target compiler, system headers, linker inputs, and runtime libraries.

### Diagnose caches, downloads, and recovery

The build cache, module cache, checksum database, proxy settings, private-module settings, and downloaded
toolchains affect repeatability. Inspect only relevant fields such as `GOCACHE`, `GOMODCACHE`, `GOPROXY`,
`GOSUMDB`, and `GOPRIVATE`; a lookup does not authorize a download, credential use, or cache change.

For a missing package, checksum, or toolchain, distinguish a project-graph defect from a network, proxy,
credential, checksum-policy, or cache failure. Preserve the first useful diagnostic and cache effects. Do not
clean caches or weaken integrity or privacy settings as trial-and-error; route dependency changes to
`go-modules` and protected-data decisions to `go-security`.

### Use project-pinned tools

Use distribution tools as the baseline. Use `goimports`, `gopls`, `govulncheck`, linters, generators, or custom
analyzers only when the project or task selects them, then bind the project-pinned version, configuration,
entrypoint, working directory, inputs, outputs, exit status, cache effects, and network effects.

Installing or changing a tool is a dependency or environment decision, not an invisible setup step. The
[official Go vulnerability guidance](https://go.dev/security/vuln/) owns vulnerability-tool context; its
result still needs reachability, the selected tool version, and deployment interpretation from the owning
operation.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
