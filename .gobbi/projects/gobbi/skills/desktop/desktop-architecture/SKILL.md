---
name: desktop-architecture
description: "MUST load when choosing or reviewing view hierarchy, navigation, window model, activation request behavior, application-state ownership, or state restoration for an installable Electron desktop application written in TypeScript."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# Desktop Architecture

Use this preference skill to choose an installed application's view hierarchy, navigation, window model,
application-state authority and lifetime, and restoration behavior. It owns product structure and runtime
outcomes, not the operating-system or Electron mechanisms that realize them.

An Activation request is a product transition distinct from Launching. This skill chooses whether an
applicable request creates, reveals, focuses, navigates, handles, does nothing, or is rejected, while one
authoritative application instance and state owner protects the result.

Adjacent owners supply current facts, implementation, evidence, intent, coordination, and release judgment.
Rules define the valid choices below; Preferences recommend defaults inside that boundary, and Rules win
every conflict.

## Principles

### Views form the product structure; windows contain them

A window is an operating-system object, while views and their hierarchy describe where a person is in the
product. Treating every new view as a new window transfers an unmade product choice to window management.

### Navigation still exists without an address bar

Removing the URL removes the visible name of a location, not the location itself. An installed application
still needs a current place, a way back, and a deliberate meaning for returning later.

### Shared state exposes its authority

A state value that one renderer appears to own becomes ambiguous when another window, a reopened view, or
background work can observe it. One declared authority and lifetime keep every copy subordinate to the same
application state.

### Runtime transitions carry product meaning

Launching, Activation request, Window close, Normal quit, Abnormal termination, Later relaunch, and a
Qualified restart are different product conditions. Restoration and activation choices remain explicit even
when a platform event or Electron mechanism makes one path convenient.

## Rules

- **MUST name every view and its peer, nested, or transient place in one hierarchy before the second view is
  built.** Give each window one identifiable current location and a defined keyboard-operable way back that
  does not require closing the window.
- **MUST decide for every view whether reaching it changes current-window content or opens a window, and
  define every window's purpose, creation authority, restore, close, and focus behavior, minimum state that
  is both safe and useful, cleanup ownership, and later-created failure behavior.** A technical creation path
  cannot stand in for the product window model.
- **MUST assign every application-state item exactly one authoritative owner and one durable, session, or
  derived lifetime, and assign Activation requests exactly one authoritative application instance and state
  owner.** No renderer, later window, second instance, failed request, or recovery attempt may create another
  authority for the same state.
- **MUST define an accepted create, reveal, focus, navigate, handle, no-op, or reject outcome for each
  applicable Activation request while already running with windows, running with no windows, in
  background/tray mode, or launching because of activation, including second-instance, file, protocol, and
  notification entry where applicable.** Classify duplicate, stale, untrusted, malformed, unsupported,
  unavailable, and target-specific requests before state changes; rejection or failure leaves state unchanged
  or in a named safe state, and recovery uses only a newly validated request or an explicit accepted fallback.
- **MUST distinguish Launching, Activation request, Window close, Normal quit, Abnormal termination, Later
  relaunch, and every Qualified restart in the architecture.** Define restoration after Normal quit and
  Abnormal termination separately, classify an intentional immediate-exit mechanism as Abnormal termination
  with its cause, and keep command or test exit status outside product runtime state.
- **MUST keep product hierarchy, window, navigation, state, restoration, and activation-outcome judgment here,
  and accept a non-native product convention only when its decision record contains the motivating user need,
  current target facts from the applicable `desktop-windows`, `desktop-macos`, or `desktop-linux` Manual,
  and references to discoverability, accessibility, and recovery evidence from
  [`desktop-interface`](../desktop-interface/SKILL.md).** Route Electron security or structure judgment to
  [`electron-design`](../../electron/electron-design/SKILL.md), current lifecycle, event, delivery, and
  mechanism facts to [`electron-runtime`](../../electron/electron-runtime/SKILL.md), implementation to
  [`electron-development`](../../electron/electron-development/SKILL.md), evidence to
  [`electron-testing`](../../electron/electron-testing/SKILL.md), current target facts to the applicable
  [`desktop-windows`](../desktop-windows/SKILL.md), [`desktop-macos`](../desktop-macos/SKILL.md), or
  [`desktop-linux`](../desktop-linux/SKILL.md) Manual, product intent to `desktop-interface`, coordination to
  [`desktop-development`](../desktop-development/SKILL.md), and release or data-compatibility judgment to
  [`desktop-release`](../desktop-release/SKILL.md).

## Preferences

### Prefer one primary window whose content changes

**PREFER** one primary window that changes views when a person moves through the application, because every
additional window adds focus, restoration, synchronization, and cleanup decisions. Depart when a view is
genuinely used beside the main one, such as a preferences panel, detached inspector, or second document, and
record that simultaneous-use evidence beside the window decision.

### Prefer one shared authority for state several contexts can see

**PREFER** shared state to be held by one accepted authority in the main process or a bounded utility process,
with renderers treating their copies as views of that state. Depart only for state genuinely local to one
window, such as scroll position, a transient selection, or in-progress form input, and route the exact Electron
process placement through `electron-design`.

### Prefer an explicit location model before a routing library

**PREFER** naming product locations and transitions before choosing a routing library. Depart when the
renderer framework's router is the established project structure, and record how its history, refresh,
external-entry, and multi-view concepts map to the accepted installed-product locations before relying on
them.

### Prefer a shallow view hierarchy

**PREFER** at most two or three application levels when the product has no address bar exposing depth. Depart
for content with its own deep structure, such as a file tree, when that content supplies persistent navigation
without adding application levels.

### Prefer restoring the last safe location

**PREFER** a Later relaunch to restore the last safe location, selection, and unfinished input allowed by the
applicable Normal quit or Abnormal termination rule. Depart when the prior state is expired, unavailable,
incompatible, or harmful, and select the nearest named safe location while recording what was not restored.

### Prefer treating restored layout as persisted user data

**PREFER** declaring window layout, last location, and panel arrangement as persisted data with a named owner,
so release and data-compatibility judgment covers schema change and corrupt-state recovery. Depart for a value
that is genuinely recomputable during every Launching transition, and record the source from which it is
recomputed.

### Prefer a no-op for a validated duplicate effect

**PREFER** no-op when a validated Activation request would only repeat an effect the authoritative state
already records, because duplicate focus, navigation, or handling can corrupt intent. Depart when the newly
validated request carries a different target or effect, and record why it is not a duplicate before applying
the accepted outcome.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
