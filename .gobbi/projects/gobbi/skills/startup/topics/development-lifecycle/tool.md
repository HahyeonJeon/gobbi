# Tool Development Lifecycle Overlay

Select this overlay for each accepted material tool or toolchain entry in the current Implementation. The tool
remains a participating entry and never becomes a subject.

## Project

## Product

## Implementation

- [tool-version-invocation] Which exact tool version, provisioning, configuration, and invocation participate in this Development scenario?
  - **Owner:** Material tool Development owner
  - **Purpose:** Define exact tool provision, pin, configuration, and invocation
  - **Oracle:** A clean environment resolves the same version and configuration and runs the owning command
  - **Activation evidence:** Accepted evidence establishes a material tool or toolchain entry
  - **Source aliases:** NEW

- [tool-effect-boundary] Which files, downloads, caches, network access, executed code, or persistent configuration may this tool affect?
  - **Owner:** Material tool Development owner
  - **Purpose:** Bound tool side effects and cleanup
  - **Oracle:** Effects, authority, cleanup, and output diff are known and reviewed
  - **Activation evidence:** Accepted evidence establishes a tool with material side effects
  - **Source aliases:** NEW

- [tool-output-contract] Which input, output, drift check, and consumer contract does this tool own?
  - **Owner:** Material tool Development owner
  - **Purpose:** Define the tool-specific input, output, drift, and consumer link
  - **Oracle:** A clean narrow run produces expected reviewed output and consumers pass
  - **Activation evidence:** Accepted evidence establishes tool-owned transformation or generation
  - **Source aliases:** NEW
