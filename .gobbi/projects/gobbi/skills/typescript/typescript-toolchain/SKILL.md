---
name: typescript-toolchain
description: "MUST load when TypeScript work involves compiler configuration, module resolution, imports, emit, type stripping, linting, building, or runtime host differences."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# TypeScript Toolchain

TypeScript Toolchain is the inspection and configuration tool for the language pipeline. It separates checking, JavaScript production, type stripping, module resolution, linting, building, and runtime loading so evidence from one layer is never mistaken for another.

The correct settings are conditional on the artifact: an application, library, script, test, declaration-only package, browser bundle, server process, or desktop process may need different profiles. Read the project and runtime contracts before selecting flags or import forms.

## Principles

### Separate pipeline layers

Type checking, JavaScript emit, type stripping, module resolution, package export resolution, linting, and runtime execution are different operations with different evidence.

### Configure the delivered artifact

Choose settings from the host, package, and deployment contract rather than from a universal preset.

### Test resolution from the consumer's position

An import is correct only when the compiler, builder, package metadata, and actual runtime agree from the importing artifact.

## Rules

- **MUST** identify which tool checks types, produces JavaScript, strips types, resolves modules, builds artifacts, lints source, and executes the result.
- **NEVER** use a successful type-check as evidence that emitted or stripped JavaScript runs in the target host.
- **MUST** align module kind, resolution mode, import specifiers, package metadata, and runtime support with the delivered artifact.
- **MUST** use separate configurations when runtime, library, application, test, or package artifacts have materially different environments.
- **NEVER** assume a compiler option, syntax feature, library declaration, or import form is supported until the pinned toolchain and target host prove it.
- **MUST** inspect the effective configuration and built output when diagnosing a configuration or resolution failure.

## Manual

### Establish the pipeline

Record the source files, the delivered artifacts, the target hosts, and the tools responsible for checking, transformation, bundling, declaration generation, linting, and execution. Name absent layers explicitly; for example, a host may strip types without performing a type-check.

### Choose configuration profiles

Start with the closest existing project profile. Split profiles when application globals, library declarations, tests, build scripts, browser code, server code, preload code, or package emit need different `lib`, `types`, module, resolution, output, or inclusion settings.

Keep shared options in a base only when every extending profile truly shares them. A stricter flag may be a useful project choice, but no single maximal set is correct for every artifact or migration state.

### Trace modules and imports

For an import failure, inspect the importing file's effective configuration, the specifier as written, package `exports` and `imports`, declaration locations, file extensions, and the runtime or builder resolver. Use the compiler's resolution trace when necessary, then confirm the built artifact preserves a form the target host can load.

Use type-only imports when the binding is only a type and the configured module transform requires that distinction. Do not infer runtime interoperability from an editor suggestion or from a declaration that resolved only during checking.

### Distinguish checking, emit, and stripping

Run the project's type-check entry point to prove the type contract. Separately inspect whether `tsc`, a transpiler, a bundler, or the runtime produces JavaScript, and whether that producer supports the TypeScript syntax used.

When a host performs type stripping, verify the host's supported syntax and module rules directly. Type stripping removes types; it does not make every TypeScript feature executable or validate the program.

### Emit declarations, source maps, and build state

JavaScript is not the only emit. `declaration` writes `.d.ts` files, `declarationMap` writes maps that let a consumer navigate from a declaration to the original source, and `composite` implies both incremental builds and declaration output while requiring `rootDir`. Confirm which of these the delivered artifact actually needs; a declaration-only package, an application bundle, and a script have different answers.

`incremental` and `composite` write build state to a `.tsbuildinfo` file whose location follows `outDir` or the configuration file unless `tsBuildInfoFile` overrides it. Stale or shared build state makes a rebuild skip work it should have redone, so treat unexplained missing or outdated output as a build-state question and clear that file before concluding the source is at fault.

When a bundler, transpiler, or type-stripping host processes one file at a time, it cannot see cross-file type information. `isolatedModules` reports the constructs that fail under that model, including a `const enum` and a type re-exported without `export type`. Enable it whenever anything other than a whole-program compiler produces the shipped JavaScript.

A stack trace is only as readable as the last map in the chain. When `tsc` emits JavaScript and a bundler then transforms it, that bundler must consume the upstream map or the final map points at intermediate output instead of the original TypeScript; `inlineSources` embeds the original text when sources cannot be served beside the map. Whether a production map is published is decided by [`web-deployment`](../../web/web-deployment/SKILL.md), not here.

### Diagnose runtime differences

Confirm the actual versions and capabilities of every target host. Browser, server, test, worker, Electron main, preload, and renderer environments may expose different globals, module loaders, and library declarations even inside one repository.

Reproduce with the built or shipped entry point when build rewriting, package exports, asset paths, or runtime loaders are involved. Development-server success is not evidence for a different production loader.

### Verify the toolchain

Run the effective-configuration inspection, type-check, lint, build, and target-host smoke tests that apply. For a package, continue with `typescript-packaging` and `typescript-testing` so the packed consumer surface is verified rather than only the source checkout.

This tool's boundary ends at the emitted JavaScript, declarations, maps, and build state. Bundler configuration, chunking and code splitting, asset hashing and cache lifetimes, source-map publication, and rollout are deployment strategy and belong to [`web-deployment`](../../web/web-deployment/SKILL.md).

## References
