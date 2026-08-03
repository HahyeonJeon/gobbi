---
name: typescript-packaging
description: "MUST load when creating, changing, validating, or publishing a TypeScript package, its exports, declarations, executable commands, or supported consumer environments."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# TypeScript Packaging

TypeScript Packaging turns TypeScript sources into an installable library, SDK, or command-line package. It covers export maps, generated JavaScript, public declarations, executable-command metadata, supported consumers, package-archive validation, and publication readiness without prescribing one module format for every package.

Package changes also load `typescript-toolchain`, `typescript-typing`, and `typescript-testing` when their
triggers apply. Classify work as authorized author mode or review-only validation. Author mode may change
approved package files and produce approved artifacts. Review-only validation follows the non-mutating
inspection boundary in Phase 1.1, and publication remains separately authorized.

## Principles

### Treat package metadata as an installed-behavior definition

Entry points, runtime files, declarations, executable commands, dependency fields, and supported environments must agree from outside the source checkout.

### Validate what will be published

The package archive, not the working tree, is what consumers install.

### Make compatibility deliberate

Module formats, runtime versions, compiler versions, and public API evolution are product decisions rather than incidental build output.

## Rules

- **MUST** define whether each public entry point provides runtime code, declarations, or both. Map every leaf
  export-map value to an existing file of the selected kind or an intentional `null` block, verify each block
  rejects its intended package path, and define every executable command's `bin` name and built entry file.
- **NEVER** expose an internal path accidentally through a broad file set, wildcard export, declaration leak, or source-only path.
- **MUST** generate or author public declarations deliberately and inspect them for private types, unstable inferred names, and dependencies on globals unavailable in supported consumer runtimes.
- **MUST** validate imports, declarations, executable commands, and runtime behavior from the installed package archive in representative consumers.
- **NEVER** claim compatibility with a module format, runtime, TypeScript version, or resolver that the installed package archive has not exercised.
- **MUST** classify public API changes and obtain release authority before publishing or changing compatibility statements.

## Procedure

### Phase 1 — Define the package requirements

#### 1.1 Inventory consumers

- Classify the task as authorized author mode or review-only validation before planning later steps.
- In review-only validation, inspect only existing generated package output and a package archive that existed
  before the review. With command authority, create disposable command state only outside reviewed files and
  install that pre-existing archive only into an isolated disposable consumer. Disposable command state is
  confined to a named temporary directory or isolated disposable consumer created for the review and removed
  after the review; it excludes a shared or persistent cache unless the command redirects that cache into the
  same disposable boundary.
- In review-only validation, do not edit reviewed files, build or rebuild generated package output, create or recreate an archive, install into a persistent environment, update documentation or release notes, or publish.
- When review-only evidence needs a new build or archive, report that evidence as unavailable or request author mode. Finish with command results, findings, and limitations.
- Select every applicable package kind: library, SDK, command-line package, or a literal fallback.
- Record supported runtimes, module loaders, resolution modes, TypeScript versions, import forms, command names, operating systems, and CPU architectures that apply.
- Record the package-manager name and version plus its engine, peer-dependency, optional-dependency, and installation policies.
- List every public entry point and whether it provides runtime code, types only, or both.
- Identify compatibility statements, publication authority, and out-of-scope consumers.

#### 1.2 Design exports and declarations

- Map every leaf file target selected by `types` or versioned `types@<selector>` to an existing declaration
  file. Map every leaf file target selected by a runtime condition or fallback, such as `import`, `require`,
  or `default`, to an existing runtime file.
- Treat every intentional `null` export target as a blocked package path rather than a missing file. Record
  the conditions under which it matches and the package-path rejection consumers must observe.
- When one public entry provides both ESM and CommonJS runtime branches, give each runtime branch its own
  nested condition object. Within each object, map the matching type conditions to a declaration file whose
  detected module format matches that runtime branch.
- A single-format runtime entry may use one matching declaration route and one runtime route without
  dual-format nesting. A types-only entry has type conditions and no runtime branch.
- Place versioned `types@<selector>` branches before the ordinary `types` fallback, and place applicable type
  conditions before the runtime condition or fallback in the same condition object. Give every supported
  compiler that misses the versioned selectors an ordinary `types` fallback.
- For every used `imports` entry, start its key with `#` and map each condition or target to the intended local
  file or external package. Require each local file target, but not an external package target, to exist in
  the package archive.
- When used, map top-level `types` to an existing declaration file and top-level `main` and `module` to
  existing runtime files of the intended module formats. Keep those fields aligned with `exports` when both
  define the same entry.
- When used, define `files` so its selected archive content matches the intended package inventory.
- Map each `bin` entry to an existing built command file.
- Keep internal modules unreachable unless they are an intentional public subpath.
- Decide whether declarations are emitted, bundled, or maintained, and name the exact `tsconfig.json` file that produces or validates them.

#### 1.3 Plan compatibility checks

- Select representative consumer fixtures for each claimed module and resolution path.
- Define API-diff or declaration checks for the public exports and declarations.
- Define archive-content, installation, import, intentional blocked-path, command invocation, runtime, and
  rollback checks before building.
- Before inspecting the candidate archive, record either the prior accepted archive or a size budget approved
  by the person or document that supplied the package requirements, the total and per-file sizes to compare,
  and the delta threshold whose breach requires explanation.

### Phase 2 — Build the package output

#### 2.1 Produce runtime outputs

- In author mode, run the package's clean build without relying on stale output. In review-only validation, inspect only existing generated package output without building or rebuilding it.
- Inspect extensions, directories, source maps, assets, and rewritten import specifiers.
- Confirm every local file target named by package metadata resolves inside the package archive.
- For every command, preserve the required shebang through the build and ensure the archived command file is executable on supported systems.

#### 2.2 Produce public declarations

- In author mode, generate or validate declarations with the package's exact `tsconfig.json`. In review-only validation, inspect or validate only existing declarations without generating them.
- Inspect entry declarations and transitive public types for private paths, globals unavailable in supported consumer runtimes, and accidental widening.
- Type-check declarations from a consumer project rather than only from their source project.

#### 2.3 Assemble metadata and content

- Verify `exports`, `imports`, `types`, `main`, `module`, `files`, `sideEffects`, and `bin` metadata that the package actually uses.
- Verify every used `imports` key and target under the intended package condition. Require local file targets
  to resolve inside the archive, while allowing external package targets under Node's `imports` rules.
- Verify each used top-level `types`, `main`, and `module` field selects an existing file of the intended kind
  and agrees with `exports` where both define the same entry.
- Verify that `files` selects the intended archive inventory.
- Verify the install behavior of `engines`, `os`, and `cpu` against the support policy.
- Treat `engines` as advisory unless the selected package-manager policy enables enforcement. Exercise the intended warning or rejection behavior.
- Place required runtime packages in `dependencies`, runtime packages whose absence or installation failure is supported in `optionalDependencies`, packages supplied by and compatible with the consuming application in `peerDependencies`, and authoring-only tools in `devDependencies`.
- Mark an optional peer in `peerDependenciesMeta` as well as declaring it in `peerDependencies`.
- List a runtime package in `bundleDependencies` in addition to its dependency declaration when the archive must contain that package.
- Under each supported package-manager version and policy, exercise required peers when compatible, missing, and incompatible or conflicting. Verify whether the manager installs, warns, or rejects in each case.
- Exercise optional dependencies when installed, omitted, and unavailable or failed during installation. Exercise optional peers when present and absent, including whether the selected package manager installs them automatically.
- Use `typesVersions` only for an explicit TypeScript-version routing requirement.
- In resolution modes that read `exports`, use the ordered versioned and fallback type conditions defined in Phase 1.2 because `typesVersions` is not read. Verify each claimed declaration route from an installed consumer under the compiler version and resolution mode that selects it.
- In author mode, create the package archive with the normal packaging command. In review-only validation, inspect only a package archive that existed before the review.
- Inspect the archive inventory for missing generated files and unwanted source or secrets. Compare its
  recorded total and per-file sizes with the prior accepted archive or approved budget. Trace every delta
  that crosses the Phase 1 threshold to named added, removed, or changed archive entries; continue only when
  the person or document that supplied the package requirements accepts the resulting size.
- If a build, declaration, metadata, or archive check fails in author mode, stay in Phase 2 and correct the step that owns the cause. Return to Phase 1 when the package requirements conflict.
- In review-only validation, stop with failed command evidence. Report evidence that needs new output or a new archive as unavailable or request author mode.
- In author mode, rebuild the affected output and repeat its Phase 2 checks before entering Phase 3.

### Phase 3 — Validate consumers

#### 3.1 Exercise resolution

- Install the package archive into isolated representative consumers. In review-only validation, install only the pre-existing archive into isolated disposable consumers and never into a persistent environment.
- Resolve every public entry through each claimed import form and compiler resolution mode.
- Resolve every intentional `null` export target under each matching condition and confirm the recorded
  package-path rejection. Resolve an adjacent supported export from the same installed consumer so a broken
  installation or resolver cannot masquerade as an intentional block.
- Resolve every used package `imports` key from the installed archive under each claimed condition and resolver.
- Reject source-relative success that bypasses the package metadata.

#### 3.2 Exercise declarations and runtime

- Type-check positive and negative consumer examples against the installed archive.
- Run each imported runtime entry in every claimed named runtime or module format.
- Capture how every package-defined command name resolves in the isolated consumer. Prove that it selects the executable link or file created by that archive installation.
- Invoke that installed command and verify the required arguments, standard streams, exit status, signals, and failure text.
- Test singleton identity and shared state across multiple entry points when dual formats or duplicated bundles are possible.

#### 3.3 Classify the API change

- Compare the public exports and declarations with the prior released API.
- Classify additions, deprecations, removals, behavioral changes, and minimum-toolchain changes.
- In author mode, update consumer documentation and release notes for the classified change. In review-only validation, leave them unchanged and report any gap as a finding.
- If a consumer check fails in author mode, return to Phase 1 when the compatibility claim is wrong or Phase 2 when output or metadata is wrong. In review-only validation, stop with the failed command evidence.
- After an author-mode repair, recreate the archive and repeat the failed and downstream consumer checks before entering Phase 4. Review-only validation reports required new archive evidence as unavailable or requests author mode.

### Phase 4 — Prepare publication

#### 4.1 Run final package checks

- In author mode, rebuild and recreate the archive from the accepted tree. In review-only validation, inspect only existing generated package output and the pre-existing archive.
- Re-run package metadata, declaration, consumer, license, provenance, and vulnerability checks required by the repository.
- Bind all results to the exact archive digest or contents being proposed.
- If a required pre-publication check fails, do not publish.
- In author mode, return to Phase 1 for an incorrect compatibility requirement, Phase 2 for output or metadata, or Phase 3 for a consumer failure. In review-only validation, stop with the failed command evidence.
- After an author-mode repair, recreate the archive and re-run every affected and final check against that archive. Review-only validation does not repair or recreate it.
- When this package change is evaluated, the [package checklist](checklists.md),
  [installed-command checklist](command-checklists.md), [release checklist](release-checklists.md), and every
  checklist provided by an active `typescript` sibling supply the applicable conditions in both author and
  review-only modes; the general Evaluation operation resolves them and issues any verdict.

#### 4.2 Confirm release authority

- Continue through this step only in author mode. Review-only validation returns its command results, findings, and limitations after Step 4.1 without updating or publishing anything.
- Present the version, compatibility classification, archive contents, verification results, and rollback plan to the person or automation authorized to release it.
- Publish only through the authorized release workflow.
- Verify registry metadata and installation after publication; if publication is not authorized, stop at a publication-ready archive.
- If post-publication verification fails, preserve the published version and failure evidence, then notify the release authority.
- Follow only the authorized rollback, deprecation, or corrective-release path. Never silently republish or overwrite the published version.

## References

- [Package checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for package definition, consumers, and publication.
- [Installed-command checklist](command-checklists.md) supplies reusable unchecked scenarios and atomic conditions for commands installed from a package archive.
- [Release checklist](release-checklists.md) supplies reusable unchecked scenarios and atomic conditions for
  release readiness, authority, failure handling, and final archive traceability.
