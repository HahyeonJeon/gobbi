# Desktop Development Lifecycle Overlay

Select this overlay when the complete-stack Implementation packages, signs, updates, or verifies an installed
desktop artifact. Actor-visible install and update promises remain in Product Lifecycle.

## Project

## Product

## Implementation

- [desktop-release-approval] Which publisher-identity, platform-trust, signing, notarization, or review steps must the Desktop artifact pass?
  - **Owner:** Desktop Development release owner
  - **Purpose:** Prove publisher identity and platform trust for final Desktop bytes
  - **Oracle:** Final bytes pass signing, notarization, or platform assessment under authorized identity
  - **Activation evidence:** Accepted evidence establishes an installed OS artifact, installer, store input, signing, notarization, or updater target
  - **Source aliases:** desktop-release-approval

- [desktop-artifact-matrix] Which OS, architecture, format, native-module, and installer combinations must install and launch?
  - **Owner:** Desktop Development release owner
  - **Purpose:** Define the Desktop artifact matrix
  - **Oracle:** The exact target artifact installs and launches with checksum, signature, resources, and native modules verified
  - **Activation evidence:** Accepted evidence establishes multiple Desktop targets, native modules, or installer forms
  - **Source aliases:** NEW

- [desktop-update-recovery-evidence] What proves installed Desktop update, downgrade, feed withdrawal, interruption recovery, and compatible rollback?
  - **Owner:** Desktop Development release owner
  - **Purpose:** Define Desktop update and recovery mechanism evidence
  - **Oracle:** A supported predecessor updates to the exact candidate, incompatible or tampered input is rejected, and rollback preserves supported data and settings
  - **Activation evidence:** Accepted evidence establishes installed update, downgrade, or feed behavior
  - **Source aliases:** NEW
