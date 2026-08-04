---
name: typescript-toolchain
description: "MUST load when a TypeScript task involves compiler configuration, module resolution, imports, emit, type stripping, linting, building, or differences among named runtimes."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# TypeScript Toolchain

TypeScript Toolchain is the inspection and configuration tool for the language pipeline. It separates checking, JavaScript production, type stripping, module resolution, linting, building, and runtime loading so a result from one layer is never mistaken for another.

The correct settings depend on the generated output: an application, library, script, test, declaration-only package, browser bundle, server process, or desktop process may need a different `tsconfig.json`. Read the supplied requirements and named runtime behavior before selecting flags or import forms.

## Principles

### Separate pipeline layers

Type checking, JavaScript emit, type stripping, module resolution, package export resolution, linting, and runtime execution are different operations with different command results.

### Configure the generated output

Choose settings from the named runtime, package metadata, and deployment requirements rather than from a universal preset.

### Test resolution from the consumer's position

An import is correct only when the compiler, builder, package metadata, and actual runtime agree from the generated file or installed package that imports it.

## Rules

- **MUST** identify which executable checks types, produces JavaScript, strips types, resolves modules, builds distributable files, lints source, and executes the result.
- **NEVER** use a successful type-check as proof that emitted or stripped JavaScript runs in a named runtime.
- **MUST** align module kind, resolution mode, import specifiers, package metadata, and runtime support with the generated output.
- **MUST** use separate compiler configurations when outputs require different `lib`, `types`, module kind or
  resolution, emit or output, or inclusion settings. A shared configuration must not expose ambient
  declarations, module capabilities, or inputs that any included environment does not own.
- **NEVER** assume a compiler option, syntax feature, library declaration, or import form is supported until the pinned toolchain and each named runtime prove it.
- **MUST** inspect the effective configuration and built output when diagnosing a configuration or resolution failure.

## Manual

### Establish the pipeline

Record the source files, generated JavaScript or declarations, named runtimes, and tools responsible for checking, transformation, bundling, declaration generation, linting, and execution. Record the package and version that supplies each `tsc` executable, and distinguish that command from any package used through the TypeScript compiler API. Name absent layers explicitly; for example, a runtime may strip types without performing a type-check.

### Choose exact compiler configurations

Start with the closest existing `tsconfig.json`. Split `tsconfig.json` files when application globals, library
declarations, tests, build scripts, browser code, server code, preload code, or package emit require different
`lib`, `types`, module kind or resolution, emit or output, or inclusion settings. A shared configuration must
not expose ambient declarations, module capabilities, or inputs that any included environment does not own.

Keep shared options in a base `tsconfig.json` only when every extending compiler file truly shares them. A stricter flag may be a useful project choice, but no single maximal set is correct for every output or migration state.

### Trace modules and imports

For an import failure, inspect the importing file's effective configuration, the specifier as written, package `exports` and `imports`, declaration locations, file extensions, and the runtime or builder resolver. Use the compiler's resolution trace when necessary, then confirm the built file preserves a form the named runtime can load.

Use type-only imports when the binding is only a type and the configured module transform requires that distinction. Do not infer runtime interoperability from an editor suggestion or from a declaration that resolved only during checking.

### Distinguish checking, emit, and stripping

Run the project's type-check command to prove the declared type relationships. Separately inspect whether `tsc`, a transpiler, a bundler, or the runtime produces JavaScript, and whether that producer supports the TypeScript syntax used.

When a runtime performs type stripping, verify that runtime's supported syntax and module rules directly. Type stripping removes types; it does not make every TypeScript feature executable or validate the program.

### Emit declarations, source maps, and build state

JavaScript is not the only emit. `declaration` writes `.d.ts` files. `declarationMap` writes maps from a
declaration to its original source location. Claim consumer source navigation only when every mapped
TypeScript source is available at the path the delivered map names; for a package consumer, that normally
requires shipping those source files with the declaration maps, as described by the
[TypeScript library compiler guidance](https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options).

`composite` enables project-reference build information and turns on declaration emit by default.
It also requires every implementation file to match `include` or be listed in `files`.
Before TypeScript 6, `composite` changes an omitted `rootDir` from the inferred common input directory to the
directory containing that `tsconfig.json`. In TypeScript 6 and TypeScript 7, every configured project already
uses the `tsconfig.json` directory as the default `rootDir`, whether or not `composite` is enabled. A configured
project that emits files from a common source directory nested below the `tsconfig.json` directory must set
`rootDir` explicitly to its intended emission root. Use `./src` when emitted paths should omit the `src`
segment, or `.` when they should retain it; omitting the option can produce TS5011.

Confirm which outputs are needed. A declaration-only package, an application bundle, and a script have different answers.

`incremental` and `composite` write build state to a `.tsbuildinfo` file. An explicit `tsBuildInfoFile` sets its location. When `tsBuildInfoFile` is omitted, TypeScript selects the default in this order: with `outFile`, `<outFile>.tsbuildinfo`; with both `rootDir` and `outDir`, `<outDir>/<relative path from rootDir to the configuration directory>/<configuration name>.tsbuildinfo`; with `outDir`, `<outDir>/<configuration name>.tsbuildinfo`; otherwise `<configuration name>.tsbuildinfo` beside the configuration file. Stale or shared build state can make a rebuild skip files it should have reprocessed, so treat unexplained missing or outdated output as a build-state question. Clear only an author-owned build-state file under explicit mutation authority, or clear a copied file inside an authorized disposable reproduction. Never delete or change build state in a reviewed subject. When no authorized disposable reproduction is possible, report the build-state diagnosis as unavailable rather than infer that the source is at fault.

When the configured transpiler, bundler, or type-stripping runtime processes one file at a time, it cannot rely on cross-file type information. `isolatedModules` reports TypeScript constructs that can be interpreted incorrectly by that model, including a type re-exported without `export type`. Enable it when the actual JavaScript producer has that single-file limitation; do not infer the requirement merely because `tsc` is not the emitter.

A stack trace is only as readable as the last map in the chain. When `tsc` emits JavaScript and a bundler then
transforms it, that bundler must consume the upstream map or the final map points at intermediate output
instead of the original TypeScript. Every final delivered map must either resolve each original source in its
consumer environment or carry that original content in `sourcesContent`, as defined by the current
[ECMA-426 source-map format](https://tc39.es/ecma426/). Every downstream transform must preserve that result.
TypeScript's [`inlineSources`](https://www.typescriptlang.org/tsconfig/inlineSources.html) option is one
producer-specific way to embed source content; a downstream transform may produce the required final
`sourcesContent` instead. Route production-map publication to the selected output's release owner:
[`web-deployment`](../../web/web-deployment/SKILL.md) for a web release,
[`electron-release`](../../electron/electron-release/SKILL.md) for an installed Electron artifact,
[`typescript-packaging`](../typescript-packaging/SKILL.md) for a package archive,
[`typescript-cli-delivery`](../typescript-cli-delivery/SKILL.md) for direct non-archive command delivery,
or the recorded project-specific release owner for another output.

Final-map inspection stays with this tool. Record the exact final map identity, its generated output, whether
each original source resolves for its intended consumer or is carried in `sourcesContent`, and every preserved
downstream mapping. Give that evidence to the selected release owner. The release owner binds the maps to its
unit and target and owns inclusion, upload, withholding, access, retention, and recovery.

### Diagnose runtime differences

Confirm the actual versions and capabilities of every named runtime. Browser, server, test, worker, Electron main, preload, and renderer environments may expose different globals, module loaders, and library declarations even inside one repository.

Reproduce with the built or shipped entry point when build rewriting, package exports, asset paths, or runtime loaders are involved. Development-server success does not prove behavior under a different production loader.

### Verify the toolchain

Run the effective-configuration inspection, type-check, lint, build, and named-runtime smoke tests that apply. For a package, continue with `typescript-packaging` and `typescript-testing` so public imports and declarations are verified from an installed archive rather than only the source checkout.

This tool stops after inspecting emitted JavaScript, declarations, maps, and build state. Route bundler
configuration, chunking and code splitting, asset hashing and cache lifetimes, source-map publication, and
rollout to the selected output's build or release owner: [`web-deployment`](../../web/web-deployment/SKILL.md)
for a web release, [`electron-release`](../../electron/electron-release/SKILL.md) for an installed Electron
artifact, [`typescript-packaging`](../typescript-packaging/SKILL.md) for a package archive,
[`typescript-cli-delivery`](../typescript-cli-delivery/SKILL.md) for direct non-archive command delivery,
or the recorded project-specific owner for another output. Stop and report the missing ownership decision
when no such owner is recorded.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for configuration and diagnosis
  governed by this skill.
