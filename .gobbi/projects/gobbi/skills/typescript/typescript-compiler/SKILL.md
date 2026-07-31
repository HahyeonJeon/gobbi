---
name: typescript-compiler
description: "MUST load when TypeScript work involves compiler configuration, module resolution, imports, emit, type stripping, linting, building, or runtime host differences."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# TypeScript Compiler

TypeScript Compiler is the inspection and configuration tool for the language pipeline. It separates checking, JavaScript production, type stripping, module resolution, linting, building, and runtime loading so evidence from one layer is never mistaken for another.

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

### Diagnose runtime differences

Confirm the actual versions and capabilities of every target host. Browser, server, test, worker, Electron main, preload, and renderer environments may expose different globals, module loaders, and library declarations even inside one repository.

Reproduce with the built or shipped entry point when build rewriting, package exports, asset paths, or runtime loaders are involved. Development-server success is not evidence for a different production loader.

### Verify the toolchain

Run the effective-configuration inspection, type-check, lint, build, and target-host smoke tests that apply. For a package, continue with TypeScript Packaging and TypeScript Testing so the packed consumer surface is verified rather than only the source checkout.

## References
