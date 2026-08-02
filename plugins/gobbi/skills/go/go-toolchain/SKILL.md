---
name: go-toolchain
description: "MUST load when using or diagnosing the Go distribution, go command, compiler, formatter, vet, generators, build constraints, platform builds, or project-pinned Go tools."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# Go Toolchain

Use this tool skill to inspect, run, or diagnose the Go distribution and the `go` command. It covers
environment discovery, command roles, source and module mutations, compilation, analysis, generation, build
constraints, platform targets, caches, and project-selected Go tools.

The supported version comes from the project contract, not this skill. `go-development`, `go-testing`, and
`go-modules` own end-to-end outcomes; this manual supplies tool behavior and side-effect boundaries.

## Principles

### Establish the actual environment first

Go behavior depends on the selected toolchain, module or workspace, environment, target, and build constraints.
Inspect those inputs before explaining a diagnostic or choosing a command.

### Classify side effects before execution

A command that looks like a check may download a toolchain, populate caches, execute project code, or contact
the network. Separate source and module mutations from external and persistent effects.

### Use the narrowest authoritative command

The Go distribution provides focused commands for formatting, building, testing, vetting, documentation,
modules, and workspaces. Project wrappers remain authoritative when they add required flags, targets, or tools.

### Treat diagnostics as evidence with limits

Compiler, vet, race, fuzz, and vulnerability results cover different defect classes and executed surfaces.
No single clean command proves style, correctness, portability, or security.

## Rules

- **MUST establish the selected Go version, module or workspace, target platform, and relevant environment
  before diagnosing tool behavior.** Read the project files and use read-only environment commands without
  changing user configuration.
- **MUST use the version and toolchain declared or constrained by the project, continuous integration, release
  target, and dependencies.** Do not impose a family-wide Go release from this skill.
- **MUST classify a command's project writes, executed code, network access, downloads, cache effects, and
  persistent configuration before running it.** Obtain the user's authority before an external or durable
  effect that the task does not already authorize.
- **MUST review every source, `go.mod`, `go.sum`, or `go.work` change produced by a Go command.** Generated or
  mechanical output is still part of the task diff.
- **MUST treat `go generate` and project-pinned helper tools as arbitrary executable code.** Inspect their
  directives, versions, inputs, and expected outputs before running them.
- **NEVER run `go env -w` or `go env -u` as an implicit project fix.** These commands mutate per-user Go
  configuration and require explicit user authority for the named setting.

## Manual

### Establish the active environment

Read `go.mod`, `go.work`, project scripts, continuous-integration configuration, container images, and release
targets first. The `go` directive records the module's required language or toolchain floor, while the
`toolchain` directive can suggest a toolchain; selection rules belong to the
[official Go toolchain documentation](https://go.dev/doc/toolchain).

Use these read-only lookups before forming a tool diagnosis:

| Lookup | What it establishes | Important limit |
|---|---|---|
| `go version` | Executing `go` binary and selected release | A later command can select another toolchain under `GOTOOLCHAIN` rules |
| `go env GOMOD GOWORK GOTOOLCHAIN GOOS GOARCH CGO_ENABLED` | Module, workspace, selection mode, target, and cgo state | Omit `-w`; environment and project files can override defaults |
| `go list -m` | Main module or active module query | May need module resolution and network or cache access |
| `go list ./...` | Packages included by current module, tags, and target | Excludes packages hidden by the current constraints |

Add focused `go env` fields only when the diagnosis needs them. Environment output can contain private paths
or proxy settings, so report the smallest relevant subset.

### Understand version and toolchain selection

Treat the project's `go` and `toolchain` directives, its `GOTOOLCHAIN` policy, and its continuous-integration
matrix as one contract. A dependency may also raise the usable floor. Do not rewrite either directive merely
because a newer local toolchain exists.

An `auto` toolchain policy can download and run another Go toolchain. Confirm that network access, cache writes,
and the selected version are acceptable before relying on automatic selection; use an already provisioned
project toolchain when reproducibility or offline work requires it.

### Classify command effects

The [`go` command reference](https://pkg.go.dev/cmd/go) is the syntax owner. Classify a contemplated command
before use:

| Effect class | Typical commands | Review before execution |
|---|---|---|
| Project-read or check | `go version`, `go env` without `-w`, `go list`, `go doc`, `go vet`, `go test`, `go build` without `-o` | Package loading may download modules or a toolchain and populate caches; tests and analyzers can execute project or analyzer code |
| Source-writing | `gofmt -w`, `go fmt`, `go fix`, `go generate` | Exact source paths, generator commands, generated output, and whether review mode permits writes |
| Module or workspace-writing | `go get`, `go mod tidy`, `go mod edit`, `go work init`, `go work use`, `go work edit`, `go work sync` | Intended module graph, `go.mod`/`go.sum`/`go.work` diff, replacement scope, and workspace-to-module propagation |
| External or persistent | automatic toolchain or module download, `go install`, `go env -w`, project tools, tests with side effects | Network, install destination, caches, credentials, executed code, user configuration, and cleanup |

`go test`, `go vet`, and `go list` usually leave tracked source untouched, but package initialization, tests,
custom analyzers, and downloads can have broader effects. Use a sandbox or task-specific environment when
project code is not trusted to stay local.

### Select the distribution command

| Need | Command role |
|---|---|
| Canonical formatting | `gofmt` for explicit files or `go fmt` for selected packages |
| Compile packages or binaries | `go build` |
| Run one main package without retaining a binary | `go run` |
| Install a command in the configured binary location | `go install`; use `package@version` outside a module dependency edit |
| Execute package tests or benchmarks | `go test`; detailed selection belongs to `go-testing` |
| Run standard analyzers | `go vet`; treat findings as diagnostics, not style or correctness proof |
| Inspect packages, modules, files, dependencies, or metadata | `go list` |
| Read rendered package or symbol documentation | `go doc` |
| Execute declared generators | `go generate`; it is never run automatically by `go build` or `go test` |
| Apply release-specific source rewrites | `go fix`; inspect every edit |
| Invoke a bundled low-level tool | `go tool`; prefer the higher-level `go` command when it owns the task |
| Manage a module graph or cache | `go mod`; outcome decisions belong to `go-modules` |
| Manage a multi-module workspace | `go work`; do not publish temporary workspace assumptions |

Pass package patterns and flags that match the intended scope. Avoid `./...` when the project wrapper excludes
integration, generated, platform, or expensive packages for a documented reason; avoid a narrow package when
the change crosses its dependent graph.

### Format, vet, and diagnose

Use a format check or inspect the `gofmt` diff when review mode must remain read-only. In author mode, apply the
project formatter and review the resulting source rather than manually recreating its output.

`go vet` runs a curated set of analyzers selected for likely defects. It is neither a general linter nor a
proof that code is correct; interpret each finding in context and follow the
[`go vet` command documentation](https://pkg.go.dev/cmd/vet) for flags and analyzer details.

Read the first compiler or loader error that can invalidate later diagnostics. Confirm package, file, line,
build tags, generated state, and selected toolchain before changing code; the
[Go diagnostics guide](https://go.dev/doc/diagnostics) lists the distribution's separate diagnostic surfaces.

### Generate source safely

`go generate` scans source directives and executes the named commands in package context. It does not understand
their dependencies, outputs, idempotence, or trustworthiness; the
[Go generate design](https://go.dev/blog/generate) leaves those contracts with the project.

Before generation, inspect the directive, command availability and version, input files, environment, network
needs, and tracked outputs. Run the narrowest package scope, review added, changed, and deleted output, then run
the checks required by its consumers. In review mode, inspect directives and stale-output evidence without
executing or rewriting them.

### Build constraints and platform targets

Build constraints include file-name suffixes, `//go:build` expressions, release tags, tool tags, `cgo`, and
the selected `GOOS` and `GOARCH`. Keep `//go:build` near the file header in the form required by the
[command reference](https://pkg.go.dev/cmd/go#hdr-Build_constraints), and let the Go tools maintain equivalent
legacy lines where the supported version still needs them.

Verify each applicable target explicitly. Cross-compilation can expose file-selection and architecture
errors without proving runtime behavior; cgo may require a target compiler, system headers, linker inputs, and
runtime libraries that a simple `GOOS`/`GOARCH` assignment does not provide.

### Caches, downloads, and recovery

The Go build cache, module cache, checksum database, proxy settings, private-module settings, and installed
toolchains affect repeatability. Inspect with focused `go env` and `go env GOCACHE GOMODCACHE GOPROXY GOSUMDB
GOPRIVATE` only when relevant; do not clear caches as a first-line fix.

On a missing package, checksum, or toolchain error, distinguish an invalid project graph from an unavailable
network, proxy, private credential, checksum policy, or cache entry. Preserve the diagnostic, avoid weakening
verification or privacy settings, and route dependency changes through `go-modules`.

### Project-pinned tools

Use `gofmt`, the compiler, `go vet`, and other distribution tools as the baseline. Activate `goimports`,
`gopls`, `govulncheck`, linters, generators, and analyzers only when the project or task selects them, then use
its pinned version and configuration.

Treat a tool installation or version change as a dependency decision, not an invisible setup step. For
vulnerability analysis, follow the project workflow and the
[official Go vulnerability guidance](https://go.dev/security/vuln/); scan results still require reachability,
version, and deployment interpretation.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
