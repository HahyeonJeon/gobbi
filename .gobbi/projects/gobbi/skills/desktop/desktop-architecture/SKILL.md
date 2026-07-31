---
name: desktop-architecture
description: "MUST load when choosing or reviewing an installed desktop application's in-application information architecture or renderer state architecture, covering view hierarchy, navigation without URLs, state ownership across processes and windows, and what a relaunch restores."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# Desktop Architecture

Use this preference skill when an installed application's internal structure needs a judgment rather than a
step: which views exist and how they nest, whether a new surface opens a window or replaces the current
content, which process owns each piece of state, and what a person finds after quitting and relaunching. It
covers the structure inside the application, not the operating-system behavior around it.

`desktop-contract` owns the observable installed-platform promise — targets, entry modes, window and
lifecycle behavior, native integration, local data, update, and recovery — and this skill owns the view
structure and state ownership that promise is built from. `desktop-interface` owns identity, evidence, concept
exploration, and expression; `desktop-delivery` coordinates the outcome and keeps each decision with its
owner, so it routes here rather than deciding; and
[`electron-design`](../../electron/electron-design/SKILL.md) owns the process, privilege, bridge, and IPC
mechanics that carry these decisions.
[`web-architecture`](../../web/web-architecture/SKILL.md) is this skill's web peer and does not replace it: it
reasons from a URL-addressed document delivered over a network, with rendering mode, caching, history, deep
links, refresh, and multiple tabs. An installed application has none of those, and its server is a main
process one inter-process call away, so the same questions have different answers here. Rules define the
boundary, Preferences select defaults inside it, and a Rule wins every conflict.

## Principles

### The window is not the unit of structure

A window is an operating-system object the person arranges, minimizes, and closes; the views inside it are the
product's structure. Collapsing the two makes "open another window" the answer to every new surface, and the
person inherits the window management the application declined to design.

### Navigation still exists without an address bar

Removing the URL removes the visible name of a location, not the location itself. An installed application
still needs a current place, a way back, and a way to return to that place later, and it has to build all
three deliberately because nothing supplies them.

### A second window makes every state decision visible

State a single renderer holds looks authoritative until a second window displays a stale copy of it. Decide
where each value truly lives before the second window exists, because that is the moment a wrong answer stops
being theoretical.

### Reopening is not restoring

A person who quits expects to come back to what they left, and a person who relaunches after a crash expects
the same. Opening at the default view is a defensible choice only when it is chosen; when it is a default
nobody decided, it reads as data loss.

## Rules

- **MUST name every view and the hierarchy containing it before the second view is built.** Record which views
  are peers, which are nested, and which are transient, because an unnamed structure becomes whatever the
  first navigation control happened to do.

- **MUST give the application one identifiable current location per surface and one defined way back.** A
  person must be able to tell where they are and return without closing a window, and the same path must work
  from the keyboard alone.

- **MUST assign every piece of application state one owning process and one lifetime — durable, session, or
  derived — and NEVER let two renderers each hold an authoritative copy.** A renderer's copy is a view of
  state the main process owns unless the state is genuinely local to that one window.

- **MUST decide, per view, whether reaching it opens a window or changes the current window's content, and
  record the rule.** Route the resulting window's creation, restore, focus, and cleanup promise to
  `desktop-contract` and its implementation to [`electron-design`](../../electron/electron-design/SKILL.md).

- **MUST define separately what a relaunch after an ordinary quit restores and what a relaunch after a crash
  restores.** Name the location, selection, unsaved input, and scroll position each case restores, or state
  explicitly that a class is not restored.

- **NEVER adopt a web application's routing model without deciding what each borrowed concept means when
  installed.** Refresh, browser history, deep links, and multiple tabs have no installed equivalent, so a
  router taken for familiarity brings behavior the platform does not provide.

## Preferences

### Prefer one primary window whose content changes

**PREFER** a single primary window that switches views over a separate window per surface, because every
additional window adds lifecycle, focus, restore, and synchronization work the person did not ask for. Depart
for a surface genuinely used beside the main one — a preferences panel, a detached inspector, a second
document — and record why that surface is separate.

### Prefer main-process ownership for anything two surfaces can see

**PREFER** holding shared state in the main process or a bounded utility process with renderers subscribing to
it, so a second window, a reopened window, and a background task cannot disagree. Depart for state that is
genuinely per-window, such as scroll position, a transient selection, or an in-progress form, and say so where
that state is declared.

### Prefer an explicit location model over a router adopted wholesale

**PREFER** naming the application's locations and the transitions between them first, then choosing a library
that fits that model. Depart when the renderer's framework already makes its router the idiomatic structure,
and then define what its history, refresh, and deep-link behavior mean inside a window before relying on any
of them.

### Prefer a shallow view hierarchy

**PREFER** at most two or three levels of nesting, because an installed application has no address bar to tell
a person how deep they are or how to climb out. Depart for content whose own structure is deep, such as a file
tree, and give that content persistent navigation of its own rather than adding application levels.

### Prefer restoring the last location over opening a default one

**PREFER** relaunching into the view the person left, with their selection and unsaved input intact, because
that is what quitting an installed application is normally understood to mean. Depart when the restored state
could be harmful or confusing — an expired session, an unavailable document, an interrupted transaction — and
open the nearest safe location while saying what was not restored.

### Prefer treating restored layout as persisted user data

**PREFER** declaring window layout, last location, and panel arrangement as persisted data with a named owner,
so `desktop-release`'s schema-version and corrupt-state recovery obligations apply to it. Depart for a value
genuinely recomputable at every launch, such as a derived ordering, and recompute it rather than persisting
it.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
