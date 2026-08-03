# TypeScript Toolchain Evaluation Checklist

This reusable unchecked source evaluates one pipeline inspection, configuration, or diagnosis produced under
this tool. It is governed by the [`typescript`](../SKILL.md) domain and [`typescript-toolchain`](SKILL.md)
manual, with [`typescript-packaging`](../typescript-packaging/SKILL.md) defining installed package behavior,
[`typescript-testing`](../typescript-testing/SKILL.md) defining the verification layers it receives, and
[`web-deployment`](../../web/web-deployment/SKILL.md) defining bundler strategy, source-map publication, and
rollout. The source commit that contains this file identifies the checklist version. Its stable checklist prefix
is `TSTOOL`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its defining scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### TSTOOL-SC-PROJECT-01 — Normal case: every pipeline responsibility is named

Checking, JavaScript production, type stripping, module resolution, building, linting, and execution may be
performed by different tools, and some of them by none. The expected outcome names each responsible tool and
routes deployment strategy outward. An answer given without knowing who does what is the failure.

#### Checklist

- [ ] TSTOOL-CK-PROJECT-01-01 — The executable that checks types, produces JavaScript, strips types, resolves modules, builds distributable files, lints source, and executes the result is identified for each responsibility.
- [ ] TSTOOL-CK-PROJECT-01-02 — The source files, generated JavaScript or declarations, and named runtimes are recorded.
- [ ] TSTOOL-CK-PROJECT-01-03 — Bundler configuration, chunking and code splitting, asset hashing and cache lifetimes, source-map publication, and rollout are routed to `web-deployment`.
- [ ] TSTOOL-CK-PROJECT-01-04 — The package and version supplying each `tsc` executable are recorded separately from any package used through the TypeScript compiler API.

### TSTOOL-SC-PROJECT-02 — Poor quality: a universal preset applied to every generated output

The configuration is valid and the build passes, but the flags come from a maximal preset rather than from
what each output needs, so a script, a test, and a published library all inherit the same answers. The
expected outcome starts from the closest `tsconfig.json` and chooses settings from the output's runtime and consumer requirements.

#### Checklist

- [ ] TSTOOL-CK-PROJECT-02-01 — Settings are chosen from the named runtime, package metadata, and deployment requirements of the generated output rather than from a universal preset.
- [ ] TSTOOL-CK-PROJECT-02-02 — The closest existing `tsconfig.json` is the starting point for the configuration.
- [ ] TSTOOL-CK-PROJECT-02-03 — Shared options are kept in a base `tsconfig.json` only where every extending compiler file truly shares them.

## Structure

### TSTOOL-SC-STRUCTURE-01 — Normal case: `tsconfig.json` files are split where environments differ

One repository can hold application code, library code, tests, build scripts, browser code, server code, and
preload code with different globals and declarations. The expected outcome gives materially different
environments their own `tsconfig.json` files. A single configuration stretched across them is the failure.

#### Checklist

- [ ] TSTOOL-CK-STRUCTURE-01-01 — Separate `tsconfig.json` files are used wherever application globals, library declarations, tests, build scripts, browser code, server code, preload code, or package emit need materially different `lib`, `types`, module, resolution, output, or inclusion settings.

### TSTOOL-SC-STRUCTURE-02 — Normal case: emit outputs are chosen for their consumers

JavaScript is not the only emit: declarations, declaration maps, and build state are separate outputs with
separate consumers. A TypeScript 6 or 7 configured project that emits from a nested common source directory
also needs an explicit `rootDir` for its intended output layout. The expected outcome configures each output
and source root for its consumer and enables the single-file safety check only where the actual JavaScript
producer has that limitation.

#### Checklist

- [ ] TSTOOL-CK-STRUCTURE-02-01 — `declaration`, `declarationMap`, and `composite` are enabled only where a named consumer needs their outputs.
- [ ] TSTOOL-CK-STRUCTURE-02-02 — A TypeScript 6 or 7 configured project that emits files from a common source directory nested below its `tsconfig.json` directory explicitly sets `rootDir` to the intended emission root, such as `./src` to omit or `.` to retain the source-directory segment.
- [ ] TSTOOL-CK-STRUCTURE-02-03 — `isolatedModules` is enabled when the configured JavaScript producer processes files independently and has the single-file limitation the option diagnoses.
- [ ] TSTOOL-CK-STRUCTURE-02-04 — Every implementation file in a `composite` project matches `include` or is listed in `files`.

## Performance

### TSTOOL-SC-PERFORMANCE-01 — Edge case: an incremental rebuild skips files it should have reprocessed

`incremental` and `composite` make a rebuild fast by trusting recorded build state, and stale or shared state
turns that speed into missing or outdated output. The expected outcome resolves an explicit
`tsBuildInfoFile` first. When that option is absent, it applies the ordered defaults for `outFile`, then the
combined `rootDir` and `outDir` relative-configuration path, then `outDir`, then the configuration directory.
Skipping the applicable location or debugging source while build state is wrong is the failure.

#### Checklist

- [ ] TSTOOL-CK-PERFORMANCE-01-01 — Unexplained missing or outdated output is treated as a build-state question before the source is treated as the cause.
- [ ] TSTOOL-CK-PERFORMANCE-01-02 — The `.tsbuildinfo` location uses explicit `tsBuildInfoFile` first; otherwise it uses `<outFile>.tsbuildinfo`, then `<outDir>/<relative path from rootDir to the configuration directory>/<configuration name>.tsbuildinfo` when both `rootDir` and `outDir` are set, then `<outDir>/<configuration name>.tsbuildinfo`, otherwise `<configuration name>.tsbuildinfo` beside the configuration file.
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

### TSTOOL-SC-USAGE-01 — Normal case: an import resolves from the generated file's position

An import is correct only when the compiler, the builder, the package metadata, and the actual runtime agree
from the file that imports it. The expected outcome aligns those four with the generated output and keeps a
form the named runtime can load. Agreement in the editor alone is the failure.

#### Checklist

- [ ] TSTOOL-CK-USAGE-01-01 — Module kind, resolution mode, import specifiers, package metadata, and runtime support are aligned with the generated output.
- [ ] TSTOOL-CK-USAGE-01-02 — The built file preserves an import form the named runtime can load.
- [ ] TSTOOL-CK-USAGE-01-03 — A type-only import form is used wherever the binding is only a type and the configured module transform requires the distinction.

### TSTOOL-SC-USAGE-02 — Expected failure: an import does not resolve

A specifier fails to resolve in the compiler, the builder, or the runtime, and each of them resolves by
different rules. The expected outcome inspects the inputs that decide resolution for the importing file and
uses the compiler's trace when inspection does not settle it. Guessing at the specifier is the failure.

#### Checklist

- [ ] TSTOOL-CK-USAGE-02-01 — The importing file's effective configuration, the specifier as written, package `exports` and `imports`, declaration locations, file extensions, and the runtime or builder resolver are inspected.
- [ ] TSTOOL-CK-USAGE-02-02 — The compiler's resolution trace is used wherever inspection does not settle the failure.

## Consistency

### TSTOOL-SC-CONSISTENCY-01 — Rule violation: a type-check result offered as runtime proof

A green type-check says the program's types agree; it says nothing about whether the emitted or stripped
JavaScript runs. The expected outcome runs the type-check for declared type relationships and inspects the producer of
the shipped JavaScript separately. Carrying one result into the other's claim breaks the Rule.

#### Checklist

- [ ] TSTOOL-CK-CONSISTENCY-01-01 — No successful type-check is treated as proof that emitted or stripped JavaScript runs in a named runtime.
- [ ] TSTOOL-CK-CONSISTENCY-01-02 — The project's type-check command is run to prove the declared type relationships.
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
still be unsupported by this pinned toolchain or this named runtime. The expected outcome proves support on both before
use. An assumption that survives because nothing exercised it breaks the Rule.

#### Checklist

- [ ] TSTOOL-CK-RISK-01-01 — No compiler option, syntax feature, library declaration, or import form is used before the pinned toolchain and each named runtime prove it is supported.
- [ ] TSTOOL-CK-RISK-01-02 — The actual version and capabilities of every named runtime are confirmed.

### TSTOOL-SC-RISK-02 — Edge case: the runtime strips types instead of checking them

A runtime that executes TypeScript by removing types performs no check and supports only part of the syntax
and module rules. The expected outcome verifies that runtime's rules directly and keeps stripping separate from
validation. Treating a type-stripping runtime as a compiler is the failure.

#### Checklist

- [ ] TSTOOL-CK-RISK-02-01 — The supported syntax and module rules of a type-stripping runtime are verified directly against that runtime.
- [ ] TSTOOL-CK-RISK-02-02 — Type stripping is not treated as validation of the program or as support for every TypeScript feature.

### TSTOOL-SC-RISK-03 — Normal case: environments inside one repository are treated separately

Browser, server, test, worker, Electron main, preload, and renderer code can share a repository while exposing
different globals, module loaders, and library declarations. The expected outcome confirms each environment
and reproduces from the shipped entry point where the build rewrites what runs.

#### Checklist

- [ ] TSTOOL-CK-RISK-03-01 — Globals, module loaders, and library declarations are confirmed per named environment wherever several runtime environments share the repository.
- [ ] TSTOOL-CK-RISK-03-02 — Reproduction uses the built or shipped entry point wherever build rewriting, package exports, asset paths, or runtime loaders are involved.

## Overall

### TSTOOL-SC-OVERALL-01 — Adversarial: a nearby layer's result stands in for the missing one

An editor suggestion, a clean type-check, a passing development server, or a successful build can each be
offered as the result a claim needs, and the answer looks fully supported. The expected outcome keeps every
observation inside what it establishes; accepting a substitute result is the failure.

#### Checklist

- [ ] TSTOOL-CK-OVERALL-01-01 — No observation is treated as proof of a property it does not establish: a type-check of emitted or stripped runtime behavior, an editor suggestion or a checking-time declaration of runtime interoperability, a development-server success of a different production loader, and a completed build of named-runtime execution.
- [ ] TSTOOL-CK-OVERALL-01-02 — Every unavailable observation remains an open question rather than an inferred result.

### TSTOOL-SC-OVERALL-02 — Normal case: the diagnosis rests on effective configuration and real output

Configuration and resolution failures are decided by what the tools actually computed, not by what the files
appear to say. The expected outcome inspects the effective configuration and built output, runs the applicable
verification, and hands package questions to the skills that can prove installed consumer behavior.

#### Checklist

- [ ] TSTOOL-CK-OVERALL-02-01 — The effective configuration and the built output are inspected when a configuration or resolution failure is diagnosed.
- [ ] TSTOOL-CK-OVERALL-02-02 — The applicable effective-configuration inspection, type-check, lint, build, and named-runtime smoke tests are run.
- [ ] TSTOOL-CK-OVERALL-02-03 — Package changes continue into `typescript-packaging` and `typescript-testing` so installed public imports and declarations are verified rather than only the source checkout.
