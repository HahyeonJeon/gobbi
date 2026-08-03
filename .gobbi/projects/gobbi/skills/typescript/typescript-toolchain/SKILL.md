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
- **MUST** use separate compiler configurations when runtime, library, application, test, or package outputs have materially different environments.
- **NEVER** assume a compiler option, syntax feature, library declaration, or import form is supported until the pinned toolchain and each named runtime prove it.
- **MUST** inspect the effective configuration and built output when diagnosing a configuration or resolution failure.

## Manual

### Establish the pipeline

Record the source files, generated JavaScript or declarations, named runtimes, and tools responsible for checking, transformation, bundling, declaration generation, linting, and execution. Record the package and version that supplies each `tsc` executable, and distinguish that command from any package used through the TypeScript compiler API. Name absent layers explicitly; for example, a runtime may strip types without performing a type-check.

### Choose exact compiler configurations

Start with the closest existing `tsconfig.json`. Split `tsconfig.json` files when application globals, library declarations, tests, build scripts, browser code, server code, preload code, or package emit need different `lib`, `types`, module, resolution, output, or inclusion settings.

Keep shared options in a base `tsconfig.json` only when every extending compiler file truly shares them. A stricter flag may be a useful project choice, but no single maximal set is correct for every output or migration state.

### Trace modules and imports

For an import failure, inspect the importing file's effective configuration, the specifier as written, package `exports` and `imports`, declaration locations, file extensions, and the runtime or builder resolver. Use the compiler's resolution trace when necessary, then confirm the built file preserves a form the named runtime can load.

Use type-only imports when the binding is only a type and the configured module transform requires that distinction. Do not infer runtime interoperability from an editor suggestion or from a declaration that resolved only during checking.

### Distinguish checking, emit, and stripping

Run the project's type-check command to prove the declared type relationships. Separately inspect whether `tsc`, a transpiler, a bundler, or the runtime produces JavaScript, and whether that producer supports the TypeScript syntax used.

When a runtime performs type stripping, verify that runtime's supported syntax and module rules directly. Type stripping removes types; it does not make every TypeScript feature executable or validate the program.

### Emit declarations, source maps, and build state

JavaScript is not the only emit. `declaration` writes `.d.ts` files. `declarationMap` writes maps that let a consumer navigate from a declaration to the original source.

`composite` enables project-reference build information and turns on declaration emit by default.
It also requires every implementation file to match `include` or be listed in `files`.
Before TypeScript 6, `composite` changes an omitted `rootDir` from the inferred common input directory to the
directory containing that `tsconfig.json`. In TypeScript 6 and TypeScript 7, every configured project already
uses the `tsconfig.json` directory as the default `rootDir`, whether or not `composite` is enabled.

Confirm which outputs are needed. A declaration-only package, an application bundle, and a script have different answers.

`incremental` and `composite` write build state to a `.tsbuildinfo` file. An explicit `tsBuildInfoFile` sets its location. When `tsBuildInfoFile` is omitted, TypeScript selects the default in this order: with `outFile`, `<outFile>.tsbuildinfo`; with both `rootDir` and `outDir`, `<outDir>/<relative path from rootDir to the configuration directory>/<configuration name>.tsbuildinfo`; with `outDir`, `<outDir>/<configuration name>.tsbuildinfo`; otherwise `<configuration name>.tsbuildinfo` beside the configuration file. Stale or shared build state can make a rebuild skip files it should have reprocessed, so treat unexplained missing or outdated output as a build-state question and clear that file before concluding the source is at fault.

When the configured transpiler, bundler, or type-stripping runtime processes one file at a time, it cannot rely on cross-file type information. `isolatedModules` reports TypeScript constructs that can be interpreted incorrectly by that model, including a type re-exported without `export type`. Enable it when the actual JavaScript producer has that single-file limitation; do not infer the requirement merely because `tsc` is not the emitter.

A stack trace is only as readable as the last map in the chain. When `tsc` emits JavaScript and a bundler then transforms it, that bundler must consume the upstream map or the final map points at intermediate output instead of the original TypeScript; `inlineSources` embeds the original text when sources cannot be served beside the map. Whether a production map is published is decided by [`web-deployment`](../../web/web-deployment/SKILL.md), not here.

### Diagnose runtime differences

Confirm the actual versions and capabilities of every named runtime. Browser, server, test, worker, Electron main, preload, and renderer environments may expose different globals, module loaders, and library declarations even inside one repository.

Reproduce with the built or shipped entry point when build rewriting, package exports, asset paths, or runtime loaders are involved. Development-server success does not prove behavior under a different production loader.

### Verify the toolchain

Run the effective-configuration inspection, type-check, lint, build, and named-runtime smoke tests that apply. For a package, continue with `typescript-packaging` and `typescript-testing` so public imports and declarations are verified from an installed archive rather than only the source checkout.

This tool stops after inspecting emitted JavaScript, declarations, maps, and build state. Bundler configuration, chunking and code splitting, asset hashing and cache lifetimes, source-map publication, and rollout are deployment decisions and belong to [`web-deployment`](../../web/web-deployment/SKILL.md).

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for configuration and diagnosis
  governed by this skill.
