# TypeScript Toolchain Evaluation Checklist

This reusable unchecked source evaluates one pipeline inspection, configuration, or diagnosis produced under
this tool. It is governed by the [`typescript`](../SKILL.md) domain and [`typescript-toolchain`](SKILL.md)
manual, with [`typescript-packaging`](../typescript-packaging/SKILL.md) owning the packed consumer surface,
[`typescript-testing`](../typescript-testing/SKILL.md) owning the verification layers it hands work to, and
[`web-deployment`](../../web/web-deployment/SKILL.md) owning bundler strategy, source-map publication, and
rollout. The source commit that contains this file identifies the checklist version. Its stable owner prefix
is `TSTOOL`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### TSTOOL-SC-PROJECT-01 — Normal case: the pipeline and its boundary are named

Checking, JavaScript production, type stripping, module resolution, building, linting, and execution may be
performed by different tools, and some of them by none. The expected outcome names each responsible tool and
routes deployment strategy outward. An answer given without knowing who does what is the failure.

#### Checklist

- [ ] TSTOOL-CK-PROJECT-01-01 — The tool that checks types, produces JavaScript, strips types, resolves modules, builds artifacts, lints source, and executes the result is identified for each of those responsibilities.
- [ ] TSTOOL-CK-PROJECT-01-02 — The source files, delivered artifacts, and target hosts are recorded.
- [ ] TSTOOL-CK-PROJECT-01-03 — Bundler configuration, chunking and code splitting, asset hashing and cache lifetimes, source-map publication, and rollout are routed to `web-deployment`.

### TSTOOL-SC-PROJECT-02 — Poor quality: a universal preset applied to every artifact

The configuration is valid and the build passes, but the flags come from a maximal preset rather than from
what this artifact delivers, so a script, a test, and a published library all inherit the same answers. The
expected outcome starts from the closest project profile and chooses settings from the artifact's contract.

#### Checklist

- [ ] TSTOOL-CK-PROJECT-02-01 — Settings are chosen from the host, package, and deployment contract of the delivered artifact rather than from a universal preset.
- [ ] TSTOOL-CK-PROJECT-02-02 — The closest existing project profile is the starting point for the configuration.
- [ ] TSTOOL-CK-PROJECT-02-03 — Shared options are kept in a base profile only where every extending profile truly shares them.

## Structure

### TSTOOL-SC-STRUCTURE-01 — Normal case: profiles are split where environments differ

One repository can hold application code, library code, tests, build scripts, browser code, server code, and
preload code with different globals and declarations. The expected outcome gives materially different
environments their own configurations. A single profile stretched across them is the failure.

#### Checklist

- [ ] TSTOOL-CK-STRUCTURE-01-01 — Separate configurations are used wherever runtime, library, application, test, or package artifacts have materially different environments.
- [ ] TSTOOL-CK-STRUCTURE-01-02 — A profile is split wherever application globals, library declarations, tests, build scripts, browser code, server code, preload code, or package emit need different `lib`, `types`, module, resolution, output, or inclusion settings.

### TSTOOL-SC-STRUCTURE-02 — Normal case: emit outputs are chosen for what the artifact needs

JavaScript is not the only emit: declarations, declaration maps, and build state are separate outputs with
separate consumers. The expected outcome enables each only where the delivered artifact needs it and enables
the single-file safety check where a non-whole-program tool ships the JavaScript.

#### Checklist

- [ ] TSTOOL-CK-STRUCTURE-02-01 — `declaration`, `declarationMap`, and `composite` are enabled only where the delivered artifact needs them.
- [ ] TSTOOL-CK-STRUCTURE-02-02 — `composite` carries the `rootDir` it requires.
- [ ] TSTOOL-CK-STRUCTURE-02-03 — `isolatedModules` is enabled wherever anything other than a whole-program compiler produces the shipped JavaScript, so single-file-hostile constructs such as a `const enum` or a type re-exported without `export type` are reported.

## Performance

### TSTOOL-SC-PERFORMANCE-01 — Edge case: an incremental rebuild skips work it should have redone

`incremental` and `composite` make a rebuild fast by trusting recorded build state, and stale or shared state
turns that speed into missing or outdated output. The expected outcome treats unexplained output as a
build-state question first. Debugging the source while the build state is wrong is the failure.

#### Checklist

- [ ] TSTOOL-CK-PERFORMANCE-01-01 — Unexplained missing or outdated output is treated as a build-state question before the source is treated as the cause.
- [ ] TSTOOL-CK-PERFORMANCE-01-02 — The `.tsbuildinfo` location is resolved from `outDir`, the configuration file, or a `tsBuildInfoFile` override before build state is judged.
- [ ] TSTOOL-CK-PERFORMANCE-01-03 — Stale or shared build state is cleared before a conclusion about the source is drawn.

## Aesthetics

### TSTOOL-SC-AESTHETICS-01 — Poor quality: the record does not separate the layers

The answer is correct, but observations from checking, emit, resolution, and execution are reported together,
so a reader cannot tell which tool produced which fact or which layer was never run. The expected outcome
attributes each observation and names the layers that are absent.

#### Checklist

- [ ] TSTOOL-CK-AESTHETICS-01-01 — Every recorded observation names the tool and pipeline layer that produced it.
- [ ] TSTOOL-CK-AESTHETICS-01-02 — Absent pipeline layers are named explicitly rather than left implied.

## Usage

### TSTOOL-SC-USAGE-01 — Normal case: an import resolves from the importing artifact's position

An import is correct only when the compiler, the builder, the package metadata, and the actual runtime agree
from the file that imports it. The expected outcome aligns those four with the delivered artifact and keeps a
form the target host can load. Agreement in the editor alone is the failure.

#### Checklist

- [ ] TSTOOL-CK-USAGE-01-01 — Module kind, resolution mode, import specifiers, package metadata, and runtime support are aligned with the delivered artifact.
- [ ] TSTOOL-CK-USAGE-01-02 — The built artifact preserves an import form the target host can load.
- [ ] TSTOOL-CK-USAGE-01-03 — A type-only import form is used wherever the binding is only a type and the configured module transform requires the distinction.

### TSTOOL-SC-USAGE-02 — Expected failure: an import does not resolve

A specifier fails to resolve in the compiler, the builder, or the runtime, and each of them resolves by
different rules. The expected outcome inspects the inputs that decide resolution for the importing file and
uses the compiler's trace when inspection does not settle it. Guessing at the specifier is the failure.

#### Checklist

- [ ] TSTOOL-CK-USAGE-02-01 — The importing file's effective configuration, the specifier as written, package `exports` and `imports`, declaration locations, file extensions, and the runtime or builder resolver are inspected.
- [ ] TSTOOL-CK-USAGE-02-02 — The compiler's resolution trace is used wherever inspection does not settle the failure.

## Consistency

### TSTOOL-SC-CONSISTENCY-01 — Rule violation: a type-check result offered as runtime evidence

A green type-check says the program's types agree; it says nothing about whether the emitted or stripped
JavaScript runs. The expected outcome runs the type-check for the type contract and inspects the producer of
the shipped JavaScript separately. Carrying one result into the other's claim breaks the Rule.

#### Checklist

- [ ] TSTOOL-CK-CONSISTENCY-01-01 — No successful type-check is treated as evidence that emitted or stripped JavaScript runs in the target host.
- [ ] TSTOOL-CK-CONSISTENCY-01-02 — The project's type-check entry point is run to prove the type contract.
- [ ] TSTOOL-CK-CONSISTENCY-01-03 — The producer of the shipped JavaScript is inspected separately.
- [ ] TSTOOL-CK-CONSISTENCY-01-04 — That producer is confirmed to support the TypeScript syntax the source uses.

### TSTOOL-SC-CONSISTENCY-02 — Normal case: the source-map chain reaches the original TypeScript

When `tsc` emits JavaScript and a bundler transforms it again, only the last map in the chain decides what a
stack trace shows. The expected outcome has the downstream tool consume the upstream map so traces point at
the original TypeScript. A final map pointing at intermediate output is the failure.

#### Checklist

- [ ] TSTOOL-CK-CONSISTENCY-02-01 — Every downstream transform consumes the upstream source map so the final map points at the original TypeScript rather than at intermediate output.
- [ ] TSTOOL-CK-CONSISTENCY-02-02 — `inlineSources` is used wherever the original sources cannot be served beside the map.

## Risk

### TSTOOL-SC-RISK-01 — Rule violation: support assumed instead of proved

A compiler option, a syntax feature, a library declaration, or an import form can be documented somewhere and
still be unsupported by this pinned toolchain or this host. The expected outcome proves support on both before
use. An assumption that survives because nothing exercised it breaks the Rule.

#### Checklist

- [ ] TSTOOL-CK-RISK-01-01 — No compiler option, syntax feature, library declaration, or import form is used before the pinned toolchain and the target host prove it is supported.
- [ ] TSTOOL-CK-RISK-01-02 — The actual version and capabilities of every target host are confirmed.

### TSTOOL-SC-RISK-02 — Edge case: the host strips types instead of checking them

A runtime that executes TypeScript by removing types performs no check and supports only part of the syntax
and module rules. The expected outcome verifies that host's rules directly and keeps stripping separate from
validation. Treating a stripping host as a compiler is the failure.

#### Checklist

- [ ] TSTOOL-CK-RISK-02-01 — The supported syntax and module rules of a type-stripping host are verified directly against that host.
- [ ] TSTOOL-CK-RISK-02-02 — Type stripping is not treated as validation of the program or as support for every TypeScript feature.

### TSTOOL-SC-RISK-03 — Normal case: environments inside one repository are treated separately

Browser, server, test, worker, Electron main, preload, and renderer code can share a repository while exposing
different globals, module loaders, and library declarations. The expected outcome confirms each environment
and reproduces from the shipped entry point where the build rewrites what runs.

#### Checklist

- [ ] TSTOOL-CK-RISK-03-01 — Globals, module loaders, and library declarations are confirmed per environment wherever several target environments share the repository.
- [ ] TSTOOL-CK-RISK-03-02 — Reproduction uses the built or shipped entry point wherever build rewriting, package exports, asset paths, or runtime loaders are involved.

## Overall

### TSTOOL-SC-OVERALL-01 — Adversarial: a nearby layer's evidence stands in for the missing one

An editor suggestion, a clean type-check, a passing development server, or a successful build can each be
offered as the evidence a claim needs, and the answer looks fully supported. The expected outcome keeps every
observation inside what it establishes; a substitute accepted as the evidence is the failure.

#### Checklist

- [ ] TSTOOL-CK-OVERALL-01-01 — No observation is treated as proof of a property it does not establish: a type-check of emitted or stripped runtime behavior, an editor suggestion or a checking-time declaration of runtime interoperability, a development-server success of a different production loader, and a completed build of target-host execution.
- [ ] TSTOOL-CK-OVERALL-01-02 — Every unavailable observation remains an open question rather than an inferred result.

### TSTOOL-SC-OVERALL-02 — Normal case: the diagnosis rests on effective configuration and real output

Configuration and resolution failures are decided by what the tools actually computed, not by what the files
appear to say. The expected outcome inspects the effective configuration and built output, runs the applicable
verification, and hands package questions to the owners that can prove the consumer surface.

#### Checklist

- [ ] TSTOOL-CK-OVERALL-02-01 — The effective configuration and the built output are inspected when a configuration or resolution failure is diagnosed.
- [ ] TSTOOL-CK-OVERALL-02-02 — The applicable effective-configuration inspection, type-check, lint, build, and target-host smoke tests are run.
- [ ] TSTOOL-CK-OVERALL-02-03 — Package work continues into `typescript-packaging` and `typescript-testing` so the packed consumer surface is verified rather than only the source checkout.
