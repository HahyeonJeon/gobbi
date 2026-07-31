---
name: typescript-packaging
description: "MUST load when creating, changing, validating, or publishing a TypeScript package, its exports, declarations, or compatibility surface."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# TypeScript Packaging

TypeScript Packaging owns the operation that turns TypeScript sources into a consumable package contract. It covers export maps, JavaScript artifacts, public declarations, compatibility, packed-artifact validation, and publication readiness without prescribing one module format for every package.

Package work also loads TypeScript Toolchain, Typing, and Testing when their triggers apply. Classify the task as authorized author mode or review-only validation. Author mode may change target files and create target artifacts within its approved scope. Review-only validation inspects existing artifacts or collects non-target disposable evidence only; it does not edit target files, build or create target artifacts, install into a persistent environment, update documentation or release notes, or publish. It skips mutation steps and reports evidence, findings, and limitations. Publication itself still requires the repository's release authority and credential controls.

## Principles

### Treat the package as a consumer contract

Entry points, runtime files, declarations, metadata, and compatibility promises must agree from outside the source checkout.

### Validate what will be published

The packed artifact, not the working tree, is the object consumers install.

### Make compatibility deliberate

Module formats, runtime versions, compiler versions, and public API evolution are product decisions rather than incidental build output.

## Rules

- **MUST** define each public entry point's runtime file, declaration file, module condition, and supported consumer environment.
- **NEVER** expose an internal path accidentally through a broad file set, wildcard export, declaration leak, or source-only path.
- **MUST** generate or author public declarations deliberately and inspect them for private types, unstable inferred names, and consumer-host dependencies.
- **MUST** validate imports, declarations, and runtime behavior from the packed or built artifact in representative consumers.
- **NEVER** claim compatibility with a module format, runtime, TypeScript version, or resolver that the artifact has not exercised.
- **MUST** classify public API changes and obtain release authority before publishing or changing compatibility promises.

## Procedure

### Phase 1 — Define the package contract

#### 1.1 Inventory consumers

- Classify the task as authorized author mode or review-only validation before planning later steps. In review-only validation, skip every mutation step below and finish with evidence, findings, and limitations.
- Record supported runtimes, module loaders, resolution modes, TypeScript versions, and import forms.
- List every public entry point and whether it provides runtime code, types only, or both.
- Identify compatibility promises, publication authority, and out-of-scope consumers.

#### 1.2 Design exports and declarations

- Map each export condition to an existing built runtime file and declaration file.
- Keep internal modules unreachable unless they are an intentional public subpath.
- Decide whether declarations are emitted, bundled, or maintained, and which configuration owns them.

#### 1.3 Plan compatibility evidence

- Select representative consumer fixtures for each claimed module and resolution path.
- Define API-diff or declaration checks for the public surface.
- Define packed-content, installation, runtime, and rollback evidence before building.

### Phase 2 — Build the artifact

#### 2.1 Produce runtime outputs

- Run the package's clean build without relying on stale output.
- Inspect extensions, directories, source maps, assets, and rewritten import specifiers.
- Confirm every metadata path resolves inside the package.

#### 2.2 Produce public declarations

- Generate or validate declarations with the package profile.
- Inspect entry declarations and transitive public types for private paths, host globals, and accidental widening.
- Type-check declarations from a consumer project rather than only from their source project.

#### 2.3 Assemble metadata and content

- Verify `exports`, `imports`, `types`, `main`, `module`, `files`, and side-effect metadata that the package actually uses.
- Create the package archive with the normal packaging command.
- Inspect the archive inventory for missing artifacts, unwanted source or secrets, and unexpected size changes.

### Phase 3 — Validate consumers

#### 3.1 Exercise resolution

- Install the archive into isolated representative consumers.
- Resolve every public entry through each claimed import form and compiler resolution mode.
- Reject source-relative success that bypasses the package metadata.

#### 3.2 Exercise declarations and runtime

- Type-check positive and negative consumer examples against the installed archive.
- Run the imported runtime entry in every claimed host or module format.
- Test singleton identity and shared state across multiple entry points when dual formats or duplicated bundles are possible.

#### 3.3 Classify the API change

- Compare the public export and declaration surface with the prior released contract.
- Classify additions, deprecations, removals, behavioral changes, and minimum-toolchain changes.
- Update consumer documentation and release notes for the classified change.

### Phase 4 — Prepare publication

#### 4.1 Run final package gates

- Rebuild and recreate the archive from the accepted tree.
- Re-run package metadata, declaration, consumer, license, provenance, and vulnerability gates required by the repository.
- Bind all evidence to the exact archive digest or contents being proposed.

#### 4.2 Confirm release authority

- Present the version, compatibility classification, archive contents, evidence, and rollback plan to the release owner.
- Publish only through the authorized release workflow.
- Verify registry metadata and installation after publication; if publication is not authorized, stop at a publication-ready artifact.

## References
