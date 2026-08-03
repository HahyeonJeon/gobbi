---
name: typescript-packaging
description: "MUST load when creating, changing, validating, or publishing a TypeScript package, its exports, declarations, executable commands, or supported consumer environments."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# TypeScript Packaging

TypeScript Packaging turns TypeScript sources into an installable library, SDK, or command-line package. It covers export maps, generated JavaScript, public declarations, executable-command metadata, supported consumers, package-archive validation, and publication readiness without prescribing one module format for every package.

Package changes also load `typescript-toolchain`, `typescript-typing`, and `typescript-testing` when their triggers apply. Classify the task as authorized author mode or review-only validation. Author mode may change the approved package files and create approved build output. Review-only validation inspects existing output or collects disposable results outside the reviewed files only; it does not edit the reviewed files, build package output, install into a persistent environment, update documentation or release notes, or publish. It skips mutation steps and reports command results, findings, and limitations. Publication itself still requires the repository's release authority and credential controls.

## Principles

### Treat package metadata as an installed-behavior definition

Entry points, runtime files, declarations, executable commands, dependency fields, and supported environments must agree from outside the source checkout.

### Validate what will be published

The package archive, not the working tree, is what consumers install.

### Make compatibility deliberate

Module formats, runtime versions, compiler versions, and public API evolution are product decisions rather than incidental build output.

## Rules

- **MUST** define each public entry point's runtime file, declaration file, module condition, and supported consumer environment, and define each executable command's `bin` name and built entry file.
- **NEVER** expose an internal path accidentally through a broad file set, wildcard export, declaration leak, or source-only path.
- **MUST** generate or author public declarations deliberately and inspect them for private types, unstable inferred names, and dependencies on globals unavailable in supported consumer runtimes.
- **MUST** validate imports, declarations, executable commands, and runtime behavior from the installed package archive in representative consumers.
- **NEVER** claim compatibility with a module format, runtime, TypeScript version, or resolver that the installed package archive has not exercised.
- **MUST** classify public API changes and obtain release authority before publishing or changing compatibility statements.

## Procedure

### Phase 1 — Define the package requirements

#### 1.1 Inventory consumers

- Classify the task as authorized author mode or review-only validation before planning later steps. In review-only validation, skip every mutation step below and finish with command results, findings, and limitations.
- Select every applicable package kind: library, SDK, command-line package, or a literal fallback.
- Record supported runtimes, module loaders, resolution modes, TypeScript versions, import forms, command names, operating systems, and CPU architectures that apply.
- List every public entry point and whether it provides runtime code, types only, or both.
- Identify compatibility statements, publication authority, and out-of-scope consumers.

#### 1.2 Design exports and declarations

- Map each export condition to an existing built runtime file and declaration file, and each `bin` entry to an existing built command file.
- Keep internal modules unreachable unless they are an intentional public subpath.
- Decide whether declarations are emitted, bundled, or maintained, and name the exact compiler file that produces or validates them.

#### 1.3 Plan compatibility checks

- Select representative consumer fixtures for each claimed module and resolution path.
- Define API-diff or declaration checks for the public exports and declarations.
- Define archive-content, installation, import, command invocation, runtime, and rollback checks before building.

### Phase 2 — Build the package output

#### 2.1 Produce runtime outputs

- Run the package's clean build without relying on stale output.
- Inspect extensions, directories, source maps, assets, and rewritten import specifiers.
- Confirm every metadata path resolves inside the package.
- For every command, preserve the required shebang through the build and ensure the archived command file is executable on supported systems.

#### 2.2 Produce public declarations

- Generate or validate declarations with the package's exact `tsconfig.json`.
- Inspect entry declarations and transitive public types for private paths, globals unavailable in supported consumer runtimes, and accidental widening.
- Type-check declarations from a consumer project rather than only from their source project.

#### 2.3 Assemble metadata and content

- Verify `exports`, `imports`, `types`, `main`, `module`, `files`, `sideEffects`, and `bin` metadata that the package actually uses.
- Verify `engines`, `os`, and `cpu` against the stated support policy, and place runtime packages in `dependencies`, peer-supplied packages in `peerDependencies`, and authoring-only tools in `devDependencies`.
- Use `typesVersions` only for an explicit TypeScript-version routing requirement, and verify every mapped declaration path from an installed consumer.
- Create the package archive with the normal packaging command.
- Inspect the archive inventory for missing generated files, unwanted source or secrets, and unexpected size changes.

### Phase 3 — Validate consumers

#### 3.1 Exercise resolution

- Install the package archive into isolated representative consumers.
- Resolve every public entry through each claimed import form and compiler resolution mode.
- Reject source-relative success that bypasses the package metadata.

#### 3.2 Exercise declarations and runtime

- Type-check positive and negative consumer examples against the installed archive.
- Run each imported runtime entry in every claimed named runtime or module format.
- Invoke every installed command by its package-defined name and verify the required arguments, standard streams, exit status, signals, and failure text.
- Test singleton identity and shared state across multiple entry points when dual formats or duplicated bundles are possible.

#### 3.3 Classify the API change

- Compare the public exports and declarations with the prior released API.
- Classify additions, deprecations, removals, behavioral changes, and minimum-toolchain changes.
- Update consumer documentation and release notes for the classified change.

### Phase 4 — Prepare publication

#### 4.1 Run final package checks

- Rebuild and recreate the archive from the accepted tree.
- Re-run package metadata, declaration, consumer, license, provenance, and vulnerability checks required by the repository.
- Bind all results to the exact archive digest or contents being proposed.
- When this package change is evaluated, the [evaluation checklist](checklists.md) and every checklist provided
  by an active `typescript` sibling supply the applicable conditions in both author and review-only modes;
  the general Evaluation operation resolves them and issues any verdict.

#### 4.2 Confirm release authority

- Present the version, compatibility classification, archive contents, verification results, and rollback plan to the person or automation authorized to release it.
- Publish only through the authorized release workflow.
- Verify registry metadata and installation after publication; if publication is not authorized, stop at a publication-ready archive.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for package changes
  governed by this skill.
