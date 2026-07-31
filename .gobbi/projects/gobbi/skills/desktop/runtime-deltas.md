# Desktop Outcome Projection — Target Deltas

This is a subordinate Desktop outcome projection. It records observable product differences across claimed
targets; it cannot replace an applicable Electron skill and is not an owner for Electron versions,
capabilities, APIs, defaults, lifecycle, native behavior, packaging, signing, update, or release facts.

Before using it, **MUST load [`electron`](../electron/SKILL.md)** and:

- [`electron-runtime`](../electron/electron-runtime/SKILL.md) for current, pinned-major process,
  capability, lifecycle, native, and operating-system lookup;
- [`electron-test`](../electron/electron-test/SKILL.md) for per-target Electron evidence; and
- [`electron-release`](../electron/electron-release/SKILL.md) for support windows, upgrades, packaging,
  hardening, signing, installation, updates, and release artifacts.

Load [`electron-convention`](../electron/electron-convention/SKILL.md) and
[`electron-development`](../electron/electron-development/SKILL.md) whenever their root triggers apply.

## Desktop projection

Maintain a product delta register rather than a copied platform matrix:

| Field | Required content |
|---|---|
| Product promise | The exact user-visible claim that may differ |
| Target | The operating system, architecture, delivery state, or entry mode |
| Current Electron evidence | A pointer to the applicable child’s pinned-major or release finding |
| User consequence | What changes in discovery, action, state, timing, failure, recovery, or accessibility |
| Design disposition | Equivalent experience, intentional difference, limitation, or target removed |
| Product evidence | Direct representative-user or whole-outcome evidence for this target |
| Electron evidence | Exact `electron-test` or `electron-release` result and artifact |
| Recheck trigger | The dependency, Electron upgrade, target change, or release event that can invalidate it |

Desktop owns the consequence and the product disposition. The Electron family owns the underlying fact and
its verification. Never copy a version literal or platform mechanism from the Electron family into this
projection; link to the current evidence so its recheck trigger remains with its owner.

Review the register whenever a claimed operating system, architecture, Electron major, packaging stack,
native dependency, distribution route, or update path changes. A result on one target supports no other
target, and a design equivalence supports no platform-mechanism claim.

This projection is complete when every material target difference has a user consequence, disposition,
truthful product evidence, Electron-owner evidence, and recheck trigger, with no parallel platform policy.
