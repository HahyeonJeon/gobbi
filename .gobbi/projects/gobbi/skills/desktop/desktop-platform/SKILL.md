---
name: desktop-platform
description: "Use when defining or reviewing observable installed-desktop behavior across targets, entry modes, windows, lifecycle, native integration, local data, installation, updates, and recovery."
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
skill-type: tool
---

# Desktop Platform

This manual helps an agent define and review the user-visible contract of an installed desktop application. It covers the operating-system and installed-state behavior a product promises, independently of the framework or mechanism used to implement it.

It does not own complete delivery, release choices, interface design, or framework mechanics. `desktop-delivery` coordinates the whole outcome, `desktop-release` owns release judgments, and an Electron implementation loads the [`electron`](../../electron/SKILL.md) root and every applicable Electron child.

## Principles

### Treat the installed application as the product

Source, a development run, and an unpacked build are intermediate states. Judge launch, windows, native behavior, data, updates, and recovery from the exact installed artifact and target being claimed.

### Make platform differences explicit

Desktop operating systems differ in lifecycle, integration, permissions, installation, and update behavior. A coherent cross-platform promise names those differences instead of hiding them behind one generic path.

### Specify effects at the user-visible seam

A native call or framework event is not the product result. Define what the person observes, what authoritative effect occurs, how failure appears, and how recovery works.

### Keep mechanism with its owner

The platform contract states required behavior and evidence. The selected framework or operating-system owner chooses and verifies the APIs, settings, process placement, packaging, and failure signals that realize it.

## Rules

- **MUST name the exact operating system, architecture, application version, artifact, and delivery state before judging platform behavior.** Evidence from another target or state cannot substitute.
- **MUST define every supported entry, window, lifecycle, native, data, installation, update, and recovery path as observable success, failure, and recovery behavior.** An unhandled state narrows the supported claim.
- **MUST keep each operating system's intended behavior explicit where conventions or capabilities differ.** Shared wording is valid only when direct evidence proves the same contract on every named target.
- **MUST route implementation mechanics to the selected framework and operating-system owners.** Electron process, bridge, security, lifecycle, build, package, test, and release mechanics belong to the Electron root and its applicable children.
- **MUST verify the platform contract through the exact installed artifact and the native operation's real result or failure signal.** A development run, non-throwing call, or source inspection alone cannot prove installed behavior.
- **NEVER let a platform convention or technical capability change an accepted product requirement or user authority.** Return the conflict to the product owner instead of treating implementation as approval.

## Manual

### Ownership boundary

Desktop Platform owns the observable contract and the evidence question. It may state that an installed application must restore a window after activation, preserve a launch input, expose a usable failure, or recover user data; it does not select an Electron event, process, IPC channel, permission handler, package format, updater, or signing mechanism.

For Electron work, load the Electron root and then select every applicable child:

| Electron concern | Owner |
|---|---|
| Security boundaries, project organization, bridge and IPC contracts, window ownership, native defaults, and errors | [`electron-design`](../../electron/electron-design/SKILL.md) |
| Main, preload, renderer, utility, window, lifecycle, or native implementation and review | [`electron-development`](../../electron/electron-development/SKILL.md) |
| Process capabilities, preload and IPC mechanics, lifecycle, native behavior, and platform failure lookup | [`electron-runtime`](../../electron/electron-runtime/SKILL.md) |
| Process, trust, lifecycle, native, packaged, and installed evidence | [`electron-testing`](../../electron/electron-testing/SKILL.md) |
| Packaging, signing, notarization, upgrades, updates, and release artifacts | [`electron-release`](../../electron/electron-release/SKILL.md) |

### Contract matrix

Record only supported rows. Each row states the target, trigger, observable result, authoritative effect, failure, recovery, owner, and evidence:

| Surface | Questions the contract must answer |
|---|---|
| Installation and first launch | What is installed, where does the person start, what readiness or permission state can intervene, and how is failure repaired? |
| Ordinary and alternate entry | Which launcher, file, protocol, notification, command, or second-instance paths exist, and how does each preserve its input? |
| Windows and lifecycle | When are windows created, restored, hidden, closed, or recreated; when does the application remain active or quit; what survives restart? |
| Native integration | What menu, tray, dock, shortcut, dialog, notification, clipboard, file, shell, or protocol effect is visible, cancellable, and reversible? |
| Local data | Where does each datum live, who owns it, when is it read or written, how is it protected, and what happens when it is absent, corrupt, locked, or incompatible? |
| Update and recovery | What does the person see before, during, and after update; what remains usable after interruption or failure; where is support found? |

An entry is incomplete when it names only a framework callback, native API, or test. The contract must identify the product meaning and the result a person or operator can observe.

### Targets and lifecycle

Model cold start, ready, active with windows, active without windows, background or tray-only operation when supported, shutdown, restart, update restart, second instance, and external entry. For each claimed operating system, state which transitions exist and which inputs or resources must survive them.

Do not infer one operating system's convention from another. Record intentional differences in close-versus-quit behavior, activation, background presence, installer flow, protocol or file delivery, notification behavior, and native permissions. If the product chooses a non-native convention, record the user need, discoverability, accessibility, and recovery evidence that supports it.

### Windows and native integration

For each window, name its purpose, creation owner, restore behavior, close behavior, focus rules, minimum useful state, and cleanup owner. Cover later-created windows and failure paths, not only the first window.

For each native integration, record support by target, permission or entitlement preconditions, cancellation, duplicate activation, unavailable behavior, returned failure state, cleanup, and accessible alternative. A call that does not throw is not proof; use the mechanism owner's documented return value, event, state, or installed observation.

### Local data and installed resources

Inventory settings, documents, caches, credentials, logs, indexes, downloads, and application resources by owner and lifecycle. State create, read, update, delete, retention, export, backup, migration, compatibility, corruption, interruption, and recovery behavior; let `desktop-release` decide release-facing compatibility defaults and the implementation owner choose mechanisms.

Resolve paths from the installed environment, not the source tree. Verify packaged resources, writable data, native dependencies, protocol identities, and permissions from the exact artifact without treating an archive, bundle, or installer as a secrecy boundary.

### Evidence and diagnosis

Collect one target row for every claimed operating-system and architecture pair. Each row names the exact artifact, installed state, entry and lifecycle paths exercised, native results, data fixtures, recovery observations, conditions, limitations, and evidence class.

When behavior fails, inspect in this order:

1. the promised observable contract and target;
2. installed-versus-development state and artifact identity;
3. entry or lifecycle timing and preserved input;
4. native support, permission, return value, and failure event;
5. local-data or resource location and ownership;
6. the selected framework's mechanism and packaged output.

Do not weaken a security, accessibility, consent, data, or authority boundary to make the symptom disappear. Return a contract mismatch to its product owner and a mechanism defect to the selected framework owner.

## References
