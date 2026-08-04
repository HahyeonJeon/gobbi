# Library Product Lifecycle Overlay

Select this overlay only from accepted imported-package or callable-library Product evidence. The language
remains a categorized Implementation entry.

## Project

## Product

- [package-acquisition] Where does a consumer obtain the supported package, and what proves its identity and authenticity?

- [package-entry-resolution] Which installed package entry points and import or resolution modes must load for a supported consumer?

- [resource-lifetime] Which Product-created resources or background work must the consumer stop, join, close, or release?

- [installed-package-consumer] Which public entries must an isolated consumer install, resolve, type-check when applicable, and run using only the released package?

- [consumer-failure-diagnostics] How does a package consumer distinguish invalid, unsupported, retryable, partial or uncertain, and terminal failure without parsing unstable text?

- [compatibility-matrix] Which package, language or runtime, compiler or resolver, loader, and platform combinations are supported?

- [consumer-upgrade-migration] What consumer code, import, configuration, or state work is required between supported package versions?

- [published-package-recovery] If a published package version is unsafe, how are consumers warned and directed to a safe version while existing builds remain explainable?

- [package-version-coexistence] When several package versions or entry formats coexist, which identity or shared state must remain coherent?

- [package-stability-level] Which public entries are experimental, stable, deprecated, or internal, and what compatibility and support promise does each level carry?
  - **Example:** A preview namespace may change before the stable public API does.

## Implementation
