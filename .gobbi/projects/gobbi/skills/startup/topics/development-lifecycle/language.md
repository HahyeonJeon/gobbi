# Language Development Lifecycle Overlay

Select this overlay for each accepted material language entry in the current Implementation. It adds
language-toolchain and delivered-artifact evidence without making the language a subject.

## Project

## Product

## Implementation

- [language-toolchain-contract] Which language, compiler or interpreter, runtime, and check, emit, or run roles are supported?
  - **Owner:** Material language Development owner
  - **Purpose:** Define supported language toolchain roles
  - **Oracle:** A pinned toolchain supports the source and the real host runs the artifact
  - **Activation evidence:** Accepted evidence establishes a material language or runtime entry
  - **Source aliases:** NEW

- [language-artifact-contract] Which declarations, binaries, module-loader, ABI, or consumer surfaces must the language artifact preserve?
  - **Owner:** Material language Development owner
  - **Purpose:** Define language artifact and consumer contract
  - **Oracle:** An external consumer or target resolves and runs the delivered artifact
  - **Activation evidence:** Accepted evidence establishes a delivered language artifact
  - **Source aliases:** NEW

- [language-transition-impact] Which version, support-floor, coexistence, and migration effects follow a language transition?
  - **Owner:** Material language Development owner
  - **Purpose:** Define language transition impact
  - **Oracle:** Upgrade, migration, replacement, old/new matrix, and recovery evidence pass
  - **Activation evidence:** Accepted evidence establishes language or runtime version transition
  - **Source aliases:** NEW
