# Go Toolchain Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Toolchain](SKILL.md). Apply it to the exact work and
returned outcomes under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

## Project

### GOTCH-SC-PROJECT-01 — Normal case: The active toolchain contract is established

The work depends on the Go distribution or a project-selected helper. The selected version, module or
workspace, target, and relevant environment should match the project contract; a diagnosis based on an
unrelated local default fails.

#### Checklist

- [ ] GOTCH-CK-PROJECT-01-01 — The selected Go version matches the project contract.
- [ ] GOTCH-CK-PROJECT-01-02 — The active module or workspace matches the evaluated project.
- [ ] GOTCH-CK-PROJECT-01-03 — The selected target matches the behavior under evaluation.
- [ ] GOTCH-CK-PROJECT-01-04 — The selected Go version satisfies dependency constraints.

### GOTCH-SC-PROJECT-02 — Rule violation: A newer local toolchain rewrites the project contract

A local Go release differs from the version or toolchain declared by the project. The work should use the
declared contract or expose a deliberate version change; rewriting directives because the local release is
newer fails.

#### Checklist

- [ ] GOTCH-CK-PROJECT-02-01 — No directive change is justified only by the local Go version.
- [ ] GOTCH-CK-PROJECT-02-02 — Every toolchain-contract change has project authority.

### GOTCH-SC-PROJECT-03 — Expected failure: A required tool or environment prerequisite is unavailable

The selected toolchain, helper binary, network path, target compiler, or project input cannot be used. The
work should preserve the exact limitation and stop unsupported claims; invented or silently weakened
verification fails.

#### Checklist

- [ ] GOTCH-CK-PROJECT-03-01 — Every unavailable prerequisite remains visible.
- [ ] GOTCH-CK-PROJECT-03-02 — No unavailable command is represented as successful.
- [ ] GOTCH-CK-PROJECT-03-03 — The unsupported surface remains outside the claimed coverage.

## Structure

### GOTCH-SC-STRUCTURE-01 — Normal case: The command matches the narrow owned task

A Go command or project wrapper is selected for a defined package, module, workspace, or generated surface.
The command should target the smallest complete owned scope; an unrelated or incomplete target fails.

#### Checklist

- [ ] GOTCH-CK-STRUCTURE-01-01 — The command role matches the required toolchain operation.
- [ ] GOTCH-CK-STRUCTURE-01-02 — The command target contains every affected package or module.
- [ ] GOTCH-CK-STRUCTURE-01-03 — The command target excludes unrelated project surfaces.

### GOTCH-SC-STRUCTURE-02 — Edge case: Build constraints select a different file set

The relevant behavior changes with build tags, release tags, file-name suffixes, `GOOS`, `GOARCH`, or cgo.
The selected inputs should match the supported target; checking only the host file set fails.

#### Checklist

- [ ] GOTCH-CK-STRUCTURE-02-01 — The evaluated build constraints select the intended source files.
- [ ] GOTCH-CK-STRUCTURE-02-02 — The target platform matches the supported target contract.
- [ ] GOTCH-CK-STRUCTURE-02-03 — The cgo state matches the intended file-selection boundary.

### GOTCH-SC-STRUCTURE-03 — Rule violation: A read-only check mutates project files

Review mode permits inspection and authorized non-writing checks. A formatter, fixer, generator, module
editor, workspace editor, or output-producing build that changes the project violates that boundary.

#### Checklist

- [ ] GOTCH-CK-STRUCTURE-03-01 — Every review-mode command leaves tracked project files unchanged.
- [ ] GOTCH-CK-STRUCTURE-03-02 — Every review-mode command leaves untracked project output unchanged.

## Performance

### GOTCH-SC-PERFORMANCE-01 — Edge case: Toolchain selection or package loading triggers downloads

Automatic selection or module resolution needs a toolchain or dependency absent from local caches. Network,
download, and cache effects should be known before execution; unexpected remote work or non-repeatable
selection fails.

#### Checklist

- [ ] GOTCH-CK-PERFORMANCE-01-01 — Automatic toolchain download is classified before use.
- [ ] GOTCH-CK-PERFORMANCE-01-02 — Module download is classified before package loading.
- [ ] GOTCH-CK-PERFORMANCE-01-03 — The selected version remains reproducible after download.

### GOTCH-SC-PERFORMANCE-02 — Poor quality: Broad commands repeat avoidable work

The work eventually completes but repeatedly scans unrelated packages, downloads the same tools, or bypasses
useful caches without a diagnostic reason. Tool cost should remain proportionate to the required surface;
needless recurring cost fails.

#### Checklist

- [ ] GOTCH-CK-PERFORMANCE-02-01 — Package scope avoids unrelated repeated work.
- [ ] GOTCH-CK-PERFORMANCE-02-02 — Tool installation is not repeated without a version change.
- [ ] GOTCH-CK-PERFORMANCE-02-03 — Cache bypass has a named diagnostic need.

### GOTCH-SC-PERFORMANCE-03 — Normal case: Tool scope matches the changed dependency surface

A change crosses several dependent packages or targets. The tool invocation should be broad enough to cover
that dependency surface but no broader than the project contract requires; arbitrary `./...` or one-package
selection fails.

#### Checklist

- [ ] GOTCH-CK-PERFORMANCE-03-01 — The selected scope includes every changed dependency edge.
- [ ] GOTCH-CK-PERFORMANCE-03-02 — The selected scope follows project exclusions for expensive or special targets.

## Aesthetics

### GOTCH-SC-AESTHETICS-01 — Normal case: The first useful diagnostic remains clear

A compiler, loader, formatter, vet, or generator emits several messages. The returned account should preserve
the earliest diagnostic that explains later failures; a wall of cascading output without the cause fails.

#### Checklist

- [ ] GOTCH-CK-AESTHETICS-01-01 — The first causally useful diagnostic is identifiable.
- [ ] GOTCH-CK-AESTHETICS-01-02 — Cascading diagnostics are not presented as independent root causes.

### GOTCH-SC-AESTHETICS-02 — Poor quality: Tool output obscures the affected source

The command runs, but noisy flags, unrelated package output, or stripped locations prevent a reviewer from
connecting diagnostics to the affected source. The presentation should remain precise and reviewable.

#### Checklist

- [ ] GOTCH-CK-AESTHETICS-02-01 — Every material diagnostic retains its package or file location.
- [ ] GOTCH-CK-AESTHETICS-02-02 — Unrelated command noise does not obscure the material diagnostic.

## Usage

### GOTCH-SC-USAGE-01 — Normal case: Read-only lookups establish the relevant environment

The work needs to explain Go selection, module context, target, or cgo behavior. Focused `go version`,
`go env`, and `go list` information should establish only the needed facts without changing persistent
configuration.

#### Checklist

- [ ] GOTCH-CK-USAGE-01-01 — The executing Go binary is identified.
- [ ] GOTCH-CK-USAGE-01-02 — Every requested environment field is relevant to the diagnosis.
- [ ] GOTCH-CK-USAGE-01-03 — Environment discovery does not change user configuration.

### GOTCH-SC-USAGE-02 — Edge case: Cross-build or cgo prerequisites differ from the host

A supported target is not the host target or requires cgo. File selection may compile while linking or runtime
support still fails; the work should distinguish those boundaries.

#### Checklist

- [ ] GOTCH-CK-USAGE-02-01 — Cross-compilation claims stop at the behavior the command exercised.
- [ ] GOTCH-CK-USAGE-02-02 — Every required cgo compiler is identified.
- [ ] GOTCH-CK-USAGE-02-03 — Every required cgo system input is identified.
- [ ] GOTCH-CK-USAGE-02-04 — A successful cross-build is not represented as target-runtime proof.

### GOTCH-SC-USAGE-03 — Expected failure: Module or checksum resolution cannot complete

Package loading fails because of an invalid graph, unavailable proxy, private credentials, checksum policy, or
cache state. The diagnosis should distinguish the project defect from environmental access; weakening
integrity or privacy controls to obtain a pass fails.

#### Checklist

- [ ] GOTCH-CK-USAGE-03-01 — The failure is classified as graph, network, credential, checksum-policy, or cache related.
- [ ] GOTCH-CK-USAGE-03-02 — Checksum verification remains enabled unless the project contract changes it.
- [ ] GOTCH-CK-USAGE-03-03 — Private-module boundaries remain unchanged unless the project contract changes them.

## Consistency

### GOTCH-SC-CONSISTENCY-01 — Rule violation: Tool-written changes are accepted without review

A formatter, fixer, generator, module command, or workspace command changes source-controlled files. Every
addition, modification, and deletion should match the intended task; treating mechanical output as
self-authorizing fails.

#### Checklist

- [ ] GOTCH-CK-CONSISTENCY-01-01 — Every tool-written source change belongs to the task.
- [ ] GOTCH-CK-CONSISTENCY-01-02 — Every tool-written `go.mod` change belongs to the task.
- [ ] GOTCH-CK-CONSISTENCY-01-03 — Every tool-written `go.sum` change belongs to the task.
- [ ] GOTCH-CK-CONSISTENCY-01-04 — Every tool-written workspace change belongs to the task.
- [ ] GOTCH-CK-CONSISTENCY-01-05 — Every tool-written deletion belongs to the task.

### GOTCH-SC-CONSISTENCY-02 — Rule violation: Local, continuous-integration, and release targets disagree

The work passes under one local toolchain or target while the project declares another for continuous
integration or release. All claimed supported surfaces should use compatible selection inputs; a local-only
success fails.

#### Checklist

- [ ] GOTCH-CK-CONSISTENCY-02-01 — Local toolchain selection agrees with the supported project contract.
- [ ] GOTCH-CK-CONSISTENCY-02-02 — Local target selection agrees with the evaluated release target.

### GOTCH-SC-CONSISTENCY-03 — Normal case: Project-selected helper tools are reproducible

A linter, analyzer, generator, vulnerability scanner, or other helper supplements the distribution. Its
version, configuration, and invocation should come from the project contract; an ambient global binary fails.

#### Checklist

- [ ] GOTCH-CK-CONSISTENCY-03-01 — Every helper tool has a project-selected version.
- [ ] GOTCH-CK-CONSISTENCY-03-02 — Every helper tool uses the project-selected configuration.
- [ ] GOTCH-CK-CONSISTENCY-03-03 — Every helper invocation follows the project-owned entrypoint.

### GOTCH-SC-CONSISTENCY-04 — Edge case: Generated state is checked under a different environment

Generated output depends on a tool version, input, environment value, or build selection. The checked output
should correspond to the declared generator contract; locally reproducible but project-inconsistent output
fails.

#### Checklist

- [ ] GOTCH-CK-CONSISTENCY-04-01 — Generated output uses the declared generator version.
- [ ] GOTCH-CK-CONSISTENCY-04-02 — Generated output corresponds to the current owned inputs.
- [ ] GOTCH-CK-CONSISTENCY-04-03 — Generated output uses the declared environment contract.

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

- [ ] GOTCH-CK-RISK-02-01 — Every executed generator directive is attributable to reviewed project source.
- [ ] GOTCH-CK-RISK-02-02 — Every executed project tool is attributable to a reviewed version.
- [ ] GOTCH-CK-RISK-02-03 — Every command side effect remains within its authorized boundary.

### GOTCH-SC-RISK-03 — Adversarial: Environment output exposes private configuration

Diagnostic collection includes private paths, proxy URLs, module names, credentials, or workstation details.
The returned material should contain only the fields needed to explain the issue; disclosure through a broad
environment dump fails.

#### Checklist

- [ ] GOTCH-CK-RISK-03-01 — Environment output contains no credential value.
- [ ] GOTCH-CK-RISK-03-02 — Environment output contains no irrelevant private path.
- [ ] GOTCH-CK-RISK-03-03 — Environment output contains no irrelevant private module detail.
- [ ] GOTCH-CK-RISK-03-04 — Environment output contains no irrelevant proxy detail.

### GOTCH-SC-RISK-04 — Adversarial: Tests or analyzers exploit their execution authority

A nominal check initializes project packages, launches subprocesses, contacts services, or runs custom
analyzer code. The evaluation should account for the executable trust boundary; classifying the command as
read-only solely because it leaves tracked files unchanged fails.

#### Checklist

- [ ] GOTCH-CK-RISK-04-01 — Executed test code is within the accepted trust boundary.
- [ ] GOTCH-CK-RISK-04-02 — Executed analyzer code is within the accepted trust boundary.
- [ ] GOTCH-CK-RISK-04-03 — External effects of executable checks are within task authority.

### GOTCH-SC-RISK-05 — Poor quality: Cache clearing or policy weakening masks the cause

A cache is cleared or a security, proxy, checksum, or private-module setting is weakened before the actual
failure is understood. The remedy should address the classified cause; environmental reset as trial-and-error
fails.

#### Checklist

- [ ] GOTCH-CK-RISK-05-01 — Cache invalidation follows a cache-specific diagnosis.
- [ ] GOTCH-CK-RISK-05-02 — No integrity setting is weakened to suppress a diagnostic.
- [ ] GOTCH-CK-RISK-05-03 — No privacy setting is weakened to suppress a diagnostic.

## Overall

### GOTCH-SC-OVERALL-01 — Normal case: The tool account matches actual selection and effects

The complete work should connect project contract, selected environment, narrow command, diagnostics, project
writes, executed code, network, downloads, caches, and persistent state. An unexplained selection or side
effect fails the whole.

#### Checklist

- [ ] GOTCH-CK-OVERALL-01-01 — Every tool selection follows the project contract.
- [ ] GOTCH-CK-OVERALL-01-02 — Every project write is accounted for.
- [ ] GOTCH-CK-OVERALL-01-03 — Every executed-code effect is accounted for.
- [ ] GOTCH-CK-OVERALL-01-04 — Every network effect is accounted for.
- [ ] GOTCH-CK-OVERALL-01-05 — Every download effect is accounted for.
- [ ] GOTCH-CK-OVERALL-01-06 — Every cache effect is accounted for.
- [ ] GOTCH-CK-OVERALL-01-07 — Every persistent-configuration effect is accounted for.
- [ ] GOTCH-CK-OVERALL-01-08 — Every claim stays within the command's actual coverage.

### GOTCH-SC-OVERALL-02 — Adversarial: Clean vet or build output masks missing assurance

`go vet` or `go build` reports no issue, but the work treats that result as proof of formatting, behavior,
portability, race safety, or security. Distribution commands cover distinct concerns; cosmetic tool success
must not replace the missing judgment.

#### Checklist

- [ ] GOTCH-CK-OVERALL-02-01 — A clean build is not the sole basis for behavioral acceptance.
- [ ] GOTCH-CK-OVERALL-02-02 — A clean vet run is not the sole basis for correctness acceptance.
- [ ] GOTCH-CK-OVERALL-02-03 — Unexecuted toolchain surfaces remain outside the acceptance claim.

### GOTCH-SC-OVERALL-03 — Expected failure: A required toolchain surface remains blocked

One required target, generator, helper, or environment path cannot be verified. The final account should
retain that gap and its affected obligation; declaring the complete work verified fails.

#### Checklist

- [ ] GOTCH-CK-OVERALL-03-01 — Every blocked required surface remains explicit.
- [ ] GOTCH-CK-OVERALL-03-02 — Completion is not claimed across a blocked required surface.
