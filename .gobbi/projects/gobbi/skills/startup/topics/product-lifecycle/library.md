# Library Product Lifecycle Overlay

Select this overlay only from accepted imported-package or callable-library Product evidence. The language
remains a categorized Implementation entry.

## Project

## Product

- [package-acquisition] Where does a consumer obtain the supported package, and what proves its identity and authenticity?
  - **Owner:** Product stakeholder / Product Lifecycle Product section
  - **Purpose:** Select the supported package identity and authenticate its origin
  - **Oracle:** The intended supported package identity and authenticity are proven
  - **Activation evidence:** Accepted evidence establishes imported-package use plus registry or provenance evidence
  - **Source aliases:** NEW

- [package-entry-resolution] Which installed package entry points and import or resolution modes must load for a supported consumer?
  - **Owner:** Product stakeholder / Product Lifecycle Product section
  - **Purpose:** Define installed package entry and resolution support
  - **Oracle:** All promised installed entries resolve and load without source or workspace bypass
  - **Activation evidence:** Accepted evidence establishes an imported or installed package
  - **Source aliases:** NEW

- [resource-lifetime] Which Product-created resources or background work must the consumer stop, join, close, or release?
  - **Owner:** Product stakeholder / Product Lifecycle Product section
  - **Purpose:** Define consumer ownership of Product-created resources and background work
  - **Oracle:** Resources stop, join, close, or release on success, failure, cancellation, and early exit
  - **Activation evidence:** Accepted evidence establishes resource-owning or background-work behavior
  - **Source aliases:** NEW

- [installed-package-consumer] Which public entries must an isolated consumer install, resolve, type-check when applicable, and run using only the released package?
  - **Owner:** Product stakeholder / Product Lifecycle Product section
  - **Purpose:** Prove representative use at the installed-artifact boundary
  - **Oracle:** The shipped artifact works in an isolated consumer without checkout bypass
  - **Activation evidence:** Accepted evidence establishes representative public package entries
  - **Source aliases:** NEW

- [consumer-failure-diagnostics] How does a package consumer distinguish invalid, unsupported, retryable, partial or uncertain, and terminal failure without parsing unstable text?
  - **Owner:** Product stakeholder / Product Lifecycle Product section
  - **Purpose:** Define stable programmatic failure classification and safe action
  - **Oracle:** The consumer distinguishes failure classes, correlates context, and names a safe action without unstable text parsing
  - **Activation evidence:** Accepted evidence establishes a public package error contract
  - **Source aliases:** NEW

- [compatibility-matrix] Which package, language or runtime, compiler or resolver, loader, and platform combinations are supported?
  - **Owner:** Product stakeholder / Product Lifecycle Product section
  - **Purpose:** Define the installed-consumer compatibility matrix
  - **Oracle:** Every claimed combination passes the installed-consumer oracle and unsupported combinations fail safely
  - **Activation evidence:** Accepted evidence establishes a library or SDK compatibility boundary
  - **Source aliases:** library-runtime-support

- [consumer-upgrade-migration] What consumer code, import, configuration, or state work is required between supported package versions?
  - **Owner:** Product stakeholder / Product Lifecycle Product section
  - **Purpose:** Define consumer work and recovery across package transition
  - **Oracle:** A representative consumer reaches the target version or returns to a named supported state
  - **Activation evidence:** Accepted evidence establishes a package transition requiring consumer work
  - **Source aliases:** NEW

- [published-package-recovery] If a published package version is unsafe, how are consumers warned and directed to a safe version while existing builds remain explainable?
  - **Owner:** Product stakeholder / Product Lifecycle Product section
  - **Purpose:** Recover consumers from an unsafe published version without erasing history
  - **Oracle:** The affected version is identified, future selection avoids it, and historical builds remain understandable
  - **Activation evidence:** Accepted evidence establishes a versioned registry or published package
  - **Source aliases:** NEW

- [package-version-coexistence] When several package versions or entry formats coexist, which identity or shared state must remain coherent?
  - **Owner:** Product stakeholder / Product Lifecycle Product section
  - **Purpose:** Preserve identity or shared state under package-version coexistence
  - **Oracle:** The named identity or state remains coherent or safely refuses
  - **Activation evidence:** Accepted evidence establishes multi-version, plugin, peer-dependency, dual-format, or duplicate-bundle behavior
  - **Source aliases:** NEW

## Implementation
