# Go Toolchain Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Toolchain](SKILL.md). Apply it to the exact work and
returned outcomes under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### GOTCH-SC-PROJECT-01 — Normal case: The selected environment contract is established

The work depends on the Go distribution or a project-selected helper. The selected Go version, selected
toolchain, active module or workspace, working directory, environment inputs, and `GOOS/GOARCH` target should
match the project contract; a diagnosis based on an unrelated local default fails.

#### Checklist

- [ ] GOTCH-CK-PROJECT-01-01 — The selected Go version, selected toolchain, active module or workspace, working directory, relevant environment inputs, and `GOOS/GOARCH` target each match the project command binding under evaluation.
- [ ] GOTCH-CK-PROJECT-01-02 — The selected Go version and selected toolchain satisfy the applicable project, dependency, continuous-integration, and release-target constraints.

### GOTCH-SC-PROJECT-02 — Rule violation: A newer local toolchain rewrites the project contract

A local Go release differs from the version or toolchain declared by the project. The work should use the
declared contract or expose a deliberate version change; rewriting directives because the local release is
newer fails.

#### Checklist

- [ ] GOTCH-CK-PROJECT-02-01 — Every toolchain-contract change has project authority rather than justification from the local Go version.

### GOTCH-SC-PROJECT-03 — Expected failure: A required tool or environment prerequisite is unavailable

The selected toolchain, helper binary, network path, target compiler, or project input cannot be used. The
work should preserve the exact limitation and stop unsupported claims; invented or silently weakened
verification fails.

#### Checklist

- [ ] GOTCH-CK-PROJECT-03-01 — Every unavailable prerequisite remains visible.
- [ ] GOTCH-CK-PROJECT-03-02 — No unavailable project command or unsupported named tool capability enters the claimed coverage.

## Structure

### GOTCH-SC-STRUCTURE-01 — Normal case: The project command matches the narrow owned task

A project command is selected for an operation-owned need and, when applicable, an exact package pattern,
module, workspace, or generated output. Its inputs should select the smallest complete owned set; an unrelated
or incomplete selection fails.

#### Checklist

- [ ] GOTCH-CK-STRUCTURE-01-01 — The project command role matches the operation-owned need.
- [ ] GOTCH-CK-STRUCTURE-01-02 — The exact package pattern or other command selector includes every required package or module input.
- [ ] GOTCH-CK-STRUCTURE-01-03 — The project command inputs exclude every unrelated owned object.

### GOTCH-SC-STRUCTURE-02 — Edge case: Build constraints select a different file set

The relevant behavior changes with build tags, release tags, file-name suffixes, `GOOS`, `GOARCH`, or cgo.
The selected inputs should match the supported target; checking only the host file set fails.

#### Checklist

- [ ] GOTCH-CK-STRUCTURE-02-01 — The evaluated build constraints, selected file set, `GOOS/GOARCH` target, and cgo state each match the supported target contract.

### GOTCH-SC-STRUCTURE-03 — Rule violation: A read-only check mutates project files

Review mode permits inspection and authorized non-writing checks. A formatter, fixer, generator, module
editor, workspace editor, or output-producing build that changes the project violates that boundary.

#### Checklist

- [ ] GOTCH-CK-STRUCTURE-03-01 — Every review-mode project command leaves source writes, generated outputs, and module or workspace writes absent from the project tree.

### GOTCH-SC-STRUCTURE-04 — Rule violation: Selector, target, or owner identity drifts

Tool guidance uses an exact package pattern as package identity, treats a project target name as a
`GOOS/GOARCH` target, or claims operation and sibling judgment. The exact package pattern and `GOOS/GOARCH`
target should retain their command meanings, and every decision and terminal result should stay with its owner.

#### Checklist

- [ ] GOTCH-CK-STRUCTURE-04-01 — Every exact package pattern appears only as a project command selector or command evidence.
- [ ] GOTCH-CK-STRUCTURE-04-02 — Every package design identity uses its package name, import path, package directory or placement, package boundary, public API, or CLI rather than an exact package pattern.
- [ ] GOTCH-CK-STRUCTURE-04-03 — Every `GOOS/GOARCH` target names the exact `GOOS` and `GOARCH` environment-value pair bound to the project command.
- [ ] GOTCH-CK-STRUCTURE-04-04 — The owning operation retains authority over the project command's purpose, execution decision, and terminal result.
- [ ] GOTCH-CK-STRUCTURE-04-05 — Source form and generated provenance, naming and error text, comments, package and API design, and protected-data decisions remain with their respective sibling owners.

## Performance

### GOTCH-SC-PERFORMANCE-01 — Edge case: Toolchain selection or package loading triggers downloads

Automatic selection or module resolution needs a toolchain or dependency absent from local caches. Network,
download, and cache effects should be known before execution; unexpected remote work or non-repeatable
selection fails.

#### Checklist

- [ ] GOTCH-CK-PERFORMANCE-01-01 — Every possible automatic toolchain or module network effect, download, and cache effect is classified before the project command runs.
- [ ] GOTCH-CK-PERFORMANCE-01-02 — The selected Go version and selected toolchain used after any download are recorded.

### GOTCH-SC-PERFORMANCE-02 — Poor quality: Broad commands repeat avoidable work

The work eventually completes but repeatedly scans unrelated packages, downloads the same tools, or bypasses
useful caches without a diagnostic reason. Tool cost should remain proportionate to the required work;
needless recurring cost fails.

#### Checklist

- [ ] GOTCH-CK-PERFORMANCE-02-01 — Neither an exact package pattern nor a project-pinned tool repeats work without a task-specific need.
- [ ] GOTCH-CK-PERFORMANCE-02-02 — Every cache bypass has a named diagnostic need.

### GOTCH-SC-PERFORMANCE-03 — Normal case: The exact package pattern matches the required dependency set

A change crosses several dependent packages or `GOOS/GOARCH` targets. The exact package pattern should cover
that package set but no more than the project contract requires; arbitrary `./...` or one-package selection
fails.

#### Checklist

- [ ] GOTCH-CK-PERFORMANCE-03-01 — The project command binding follows project exclusions for expensive exact package patterns or special `GOOS/GOARCH` targets.
- Also applies: GOTCH-CK-STRUCTURE-01-02 (the command selector includes every required package or module input).

## Aesthetics

### GOTCH-SC-AESTHETICS-01 — Normal case: The first useful diagnostic remains clear

A compiler, loader, formatter, vet, or generator emits several messages. The returned account should preserve
the earliest diagnostic that explains later failures; a wall of cascading output without the cause fails.

#### Checklist

- [ ] GOTCH-CK-AESTHETICS-01-01 — The first useful diagnostic is identifiable.
- [ ] GOTCH-CK-AESTHETICS-01-02 — Cascading diagnostics are not presented as independent root causes.

### GOTCH-SC-AESTHETICS-02 — Poor quality: Tool output obscures the affected source

The project command runs, but noisy flags, unrelated package output, or stripped locations prevent a reviewer
from connecting diagnostics to the affected source. The presentation should remain precise and reviewable.

#### Checklist

- [ ] GOTCH-CK-AESTHETICS-02-01 — Every material diagnostic remains connectable to its affected package or file through standard output or standard error.

## Usage

### GOTCH-SC-USAGE-01 — Normal case: Read-only lookups establish the relevant environment

The work needs to explain Go selection, module context, a `GOOS/GOARCH` target, or cgo behavior. Focused
`go version`, `go env`, and `go list` information should establish only the needed facts without changing
persistent configuration.

#### Checklist

- [ ] GOTCH-CK-USAGE-01-01 — The selected Go version and selected toolchain are identified.
- [ ] GOTCH-CK-USAGE-01-02 — Every requested environment field is relevant to the diagnosis.
- Also applies: GOTCH-CK-RISK-01-01 (discovery changes no persistent configuration).

### GOTCH-SC-USAGE-02 — Edge case: Cross-build or cgo prerequisites differ from the host

A supported `GOOS/GOARCH` target is not the host target or requires cgo. File selection may compile while
linking or runtime support still fails; the work should distinguish those boundaries.

#### Checklist

- [ ] GOTCH-CK-USAGE-02-01 — Every cross-build claim stops at the behavior the project command exercised for the named `GOOS/GOARCH` target.
- [ ] GOTCH-CK-USAGE-02-02 — No cross-build claim is represented as target-runtime proof.
- [ ] GOTCH-CK-USAGE-02-03 — Every required cgo compiler and system input is identified.

### GOTCH-SC-USAGE-03 — Expected failure: Module or checksum resolution cannot complete

Package loading fails because of an invalid graph, unavailable proxy, private credentials, checksum policy, or
cache state. The diagnosis should distinguish the project defect from environmental access; weakening
integrity or privacy controls to obtain a pass fails.

#### Checklist

- [ ] GOTCH-CK-USAGE-03-01 — The failure is classified as graph, network, credential, checksum-policy, or cache related.
- Also applies: GOTCH-CK-RISK-05-02 (no integrity or privacy control is weakened to obtain a pass).

### GOTCH-SC-USAGE-04 — Adversarial: The reported project command is not the invocation that ran

The account presents a clean canonical invocation while the actual run used extra flags, a different exact
package pattern or `GOOS/GOARCH` target, another working directory, modified environment inputs, or a cached
result. A reader should be able to interpret the observed result from the reported binding.

#### Checklist

- [ ] GOTCH-CK-USAGE-04-01 — Every reported project command, exact package pattern, flag, `GOOS/GOARCH` target, working directory, and environment input matches the invocation that produced the result.
- [ ] GOTCH-CK-USAGE-04-02 — Every reproducibility claim follows from the complete reported project command binding and named prerequisites.
- [ ] GOTCH-CK-USAGE-04-03 — The reported standard output, standard error, and exit status each match the actual invocation.

## Consistency

### GOTCH-SC-CONSISTENCY-01 — Rule violation: Tool-written changes are accepted without review

A formatter, fixer, generator, module command, or workspace command changes source-controlled files. Every
addition, modification, and deletion should match the intended task; treating mechanical output as
self-authorizing fails.

#### Checklist

- [ ] GOTCH-CK-CONSISTENCY-01-01 — Every source write, generated output, `go.mod`, `go.sum`, workspace-file change, and deletion belongs to the operation-owned task.

### GOTCH-SC-CONSISTENCY-02 — Rule violation: Local, continuous-integration, and release targets disagree

The work passes under one local selected toolchain or `GOOS/GOARCH` target while the project declares another
for continuous integration or release. Every claimed project environment should use compatible selection
inputs; a local-only success fails.

#### Checklist

- [ ] GOTCH-CK-CONSISTENCY-02-01 — The local selected Go version, selected toolchain, and `GOOS/GOARCH` target agree with the supported project and release contracts.

### GOTCH-SC-CONSISTENCY-03 — Normal case: Project-selected helper tools are reproducible

A linter, analyzer, generator, vulnerability scanner, or other helper supplements the distribution. Its
version, configuration, and invocation should come from the project contract; an ambient global binary fails.

#### Checklist

- [ ] GOTCH-CK-CONSISTENCY-03-01 — Every helper tool uses its project-selected tool version, configuration, and project command entrypoint.

### GOTCH-SC-CONSISTENCY-04 — Edge case: Generated state is checked under a different environment

Generated output depends on a tool version, input, environment value, or build selection. The checked output
should correspond to the declared generator contract; locally reproducible but project-inconsistent output
fails.

#### Checklist

- [ ] GOTCH-CK-CONSISTENCY-04-01 — Every observed generated output corresponds to the declared generator project command, selected tool version, current inputs, working directory, and environment inputs.

## Risk

### GOTCH-SC-RISK-01 — Rule violation: A project task changes persistent Go environment

The work uses `go env -w` or `go env -u` to make a project command pass. Per-user configuration is outside an
ordinary project edit and should remain unchanged without explicit authority.

#### Checklist

- [ ] GOTCH-CK-RISK-01-01 — No persistent Go environment setting changes without explicit authority.
- [ ] GOTCH-CK-RISK-01-02 — Project correctness does not depend on an undisclosed per-user Go setting.

### GOTCH-SC-RISK-02 — Adversarial: Generation or a project tool executes untrusted code

A `go generate` directive, custom analyzer, test helper, or project-pinned command contains an unexpected
executable path or side effect. The command should be treated as arbitrary code; assuming its tool-like name
makes it safe fails.

#### Checklist

- [ ] GOTCH-CK-RISK-02-01 — Every executed generator directive and project tool is attributable to reviewed project source and a reviewed version.
- [ ] GOTCH-CK-RISK-02-02 — Every project command side effect remains within its authorized boundary.

### GOTCH-SC-RISK-03 — Rule violation: Environment output exposes private configuration

Diagnostic collection includes private paths, proxy URLs, module names, credentials, or workstation details.
The returned material should contain only the fields needed to explain the issue; disclosure through a broad
environment dump fails.

#### Checklist

- [ ] GOTCH-CK-RISK-03-01 — Returned environment output carries no credential value and no irrelevant protected path, private-module detail, or proxy detail.

### GOTCH-SC-RISK-04 — Adversarial: Tests or analyzers exploit their execution authority

A nominal check initializes project packages, launches subprocesses, contacts services, or runs custom
analyzer code. The evaluation should account for the executable trust boundary; classifying the command as
read-only solely because it leaves tracked files unchanged fails.

#### Checklist

- [ ] GOTCH-CK-RISK-04-01 — Executed test code and analyzer code are within the operation owner's accepted trust boundary.
- Also applies: GOTCH-CK-RISK-02-02 (project command side effects stay within authority).

### GOTCH-SC-RISK-05 — Adversarial: Cache clearing or policy weakening masks the cause

A cache is cleared or a security, proxy, checksum, or private-module setting is weakened before the actual
failure is understood. The remedy should address the classified cause; environmental reset as trial-and-error
fails.

#### Checklist

- [ ] GOTCH-CK-RISK-05-01 — Every cache cleaning or invalidation follows a cache-specific diagnosis.
- [ ] GOTCH-CK-RISK-05-02 — No integrity or privacy setting is weakened to suppress a diagnostic or bypass its named decision owner.

### GOTCH-SC-RISK-06 — Normal case: An ordinary project command keeps its effects inside the expected set

An accepted project command builds, tests, analyzes, or lists on the ordinary success path. Its effects should
stay inside the expected build and module caches and the task's own outputs, with no persistent configuration
change and no unplanned network use; an ordinary run that reaches beyond that set fails.

#### Checklist

- [ ] GOTCH-CK-RISK-06-01 — The ordinary run's effect set contains only expected caches and task-owned outputs.
- [ ] GOTCH-CK-RISK-06-02 — The ordinary run needs neither elevated privilege nor unplanned network access.
- [ ] GOTCH-CK-RISK-06-03 — No lookup or observed result grants implicit authority for network access, credentials, configuration changes, cache cleaning, generation, source writes, generated outputs, module or workspace writes, or installed outputs.

## Overall

### GOTCH-SC-OVERALL-01 — Normal case: The tool account matches actual selection and effects

The complete work should connect the project contract and selection binding to the project command, first
useful diagnostic, standard output, standard error, exit status, source writes, generated outputs, executed
code, cache effects, network effects, downloads, installed outputs, and persistent configuration. An
unexplained selection, observation, or effect fails the whole.

#### Checklist

- [ ] GOTCH-CK-OVERALL-01-01 — Every selected Go version, selected toolchain, project command, exact package pattern, and `GOOS/GOARCH` target follows the project contract.
- [ ] GOTCH-CK-OVERALL-01-02 — Every source write, generated output, module or workspace write, executed-code effect, cache effect, network effect, download, installed output, and persistent-configuration effect is accounted for.
- [ ] GOTCH-CK-OVERALL-01-03 — Every claim stays within the project command's actual coverage.

### GOTCH-SC-OVERALL-02 — Adversarial: Clean vet or build output masks missing assurance

`go vet` or `go build` reports no issue, but the work treats that result as proof of formatting, behavior,
portability, race safety, or security. Distribution commands cover distinct concerns; cosmetic tool success
must not replace the missing judgment.

#### Checklist

- [ ] GOTCH-CK-OVERALL-02-01 — A clean build or vet run is not the sole basis for an operation terminal result or sibling-owned judgment.
- [ ] GOTCH-CK-OVERALL-02-02 — Unexecuted named tool capabilities remain outside the acceptance claim.

### GOTCH-SC-OVERALL-03 — Expected failure: A required project command or named tool capability remains blocked

One required `GOOS/GOARCH` target, generator, helper, or environment path cannot be verified. The final account should
retain that gap and its affected obligation; declaring the complete work verified fails.

#### Checklist

- [ ] GOTCH-CK-OVERALL-03-01 — Every blocked required project command or named tool capability remains explicit with its affected obligation.
- [ ] GOTCH-CK-OVERALL-03-02 — Completion is not claimed across a blocked required project command or named tool capability.
