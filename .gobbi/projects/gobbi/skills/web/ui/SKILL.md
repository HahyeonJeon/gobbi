---
name: ui
description: Use after the web and generic UI skills to design, implement, and evaluate the browser-interface realization of one web feature.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Web User Interface Development

Web specialization for realizing one accepted interface outcome in production browser mechanics. Load
[`web`](../SKILL.md) first and generic [`ui`](../../ui/SKILL.md) second; this skill is third. The parent owns
the complete feature contract and release gate. Generic UI owns research, specification, disposable prototype,
direct-user testing, and design acceptance. This child owns the browser-specific realization of that accepted
specification: semantic documents, focus and input, forms, responsive states, overlays, asynchronous feedback,
browser rendering lifecycles, and evidence.

Load the applicable language and framework skill for implementation idioms. React is an integration case
here—hydration, routing, state continuity, and semantic output—not an API, hooks, rendering-mode, router,
state-library, or ecosystem policy source.

## Principles

> **The accepted interface specification is the production source of truth.**

Translate its hierarchy, content, states, interactions, responsive behavior, and evidence conditions into
browser behavior; do not redesign implicitly while implementing.

> **Browser semantics and interaction are observable behavior.**

Document structure, accessible name/role/value/state, keyboard sequence, focus, URL, form ownership, and live
status are part of the interface, even when they are not visible in a screenshot.

> **Every state deserves an interface, not only success.**

Initial, empty, loading, partial, stale, invalid, disabled, pending, success, error, recovery, and unavailable
states must tell the truth and preserve the next safe action.

> **Composition must survive real variation.**

The interface is one system across viewport, zoom, text size, content length, locale, theme, preferences,
input modality, browser lifecycle, and data state.

> **Rendered pixels, DOM semantics, and operated behavior are separate evidence.**

Use each to support only what it can observe, and preserve the generic UI direct-user evidence boundary.

## Rules

### Must-Follow

- **WEB-UI-R01 — MUST preserve the accepted generic UI specification and web feature contract.** Trace each
  implemented region, state, interaction, and responsive behavior to the accepted specification and parent
  feature state. A conflict returns to the owning specification or parent contract before code chooses it.
- **WEB-UI-R02 — MUST start from a meaningful semantic document.** Use the native element and interaction
  before recreating one; preserve headings, landmarks, lists, tables, forms, labels, descriptions, controls,
  status, accessible name/role/value/state, and a sensible source order. Add ARIA only where semantics remain
  missing, and test the resulting accessibility tree.
- **WEB-UI-R03 — MUST implement the complete component and page state set.** Cover initial, empty, loading,
  skeleton if specified, partial, stale, invalid, disabled, pending, optimistic only when truthful, success,
  error, recovery, unavailable, permission-denied, and duplicate-action states that the feature activates.
  State changes must not announce or display false completion.
- **WEB-UI-R04 — MUST make layout intrinsically responsive.** Preserve content order, hierarchy, readability,
  reachability, and actions across the project browser/viewport matrix, zoom and text enlargement, content
  growth, locale, orientation, safe areas, theme, contrast preferences, reduced motion, and forced colors when
  applicable. Do not encode one captured viewport as the layout contract.
- **WEB-UI-R05 — MUST support every applicable input modality.** Keyboard, pointer, touch, switch-like
  sequential navigation, and assistive technology must reach and operate equivalent outcomes with adequate
  targets and without gesture-only or hover-only information.
- **WEB-UI-R06 — MUST manage focus deliberately.** Preserve logical source/tab order, visible focus, entry and
  exit, restoration after removal or navigation, focus after validation and asynchronous change, and correct
  containment for modal interaction. Inactive content must not remain operable or exposed as active.
- **WEB-UI-R07 — MUST implement forms as browser-native transactions.** Provide persistent programmatic labels,
  correct input types and autocomplete tokens, instructions, constraints, inline and summary errors, invalid-
  field focus/navigation, retained user input, review/correction where needed, safe submission locking or
  idempotent resubmission, and recovery after server rejection.
- **WEB-UI-R08 — MUST make overlays and asynchronous work truthful.** Define ownership, trigger, dismissal,
  escape/outside behavior, focus, background interaction, scroll, stacking, status announcement, progress,
  cancellation, late result, and recovery for dialogs, popovers, menus, toasts, loading, and background work.
  A transient toast cannot be the sole carrier of critical information.
- **WEB-UI-R09 — MUST cover applicable browser rendering lifecycles.** Direct entry, navigation, refresh,
  back/forward, restore, server-rendered or pre-rendered markup, hydration, delayed JavaScript, unavailable
  JavaScript where the project promises it, stale assets, and duplicate initialization must remain semantic,
  operable, and state-consistent.
- **WEB-UI-R10 — MUST select and execute a browser interface matrix.** Derive browsers, devices/viewports,
  zoom/text, input modes, assistive technology, themes/preferences, locales/content stress, auth/data states,
  network conditions, and lifecycle entries from project commitments and feature risk. Record evidence and
  limitations; do not claim an untested matrix.
- **WEB-UI-R11 — MUST verify each interface claim at its observable owner.** Use source/static checks for
  structure, DOM/accessibility-tree inspection for semantics, keyboard/pointer/touch operation for interaction,
  live resizing and preference changes for adaptation, captured renderings for visible pixels in the captured
  state, and representative-user evidence from generic UI for acceptance. A screenshot cannot prove hidden
  semantics, focus order, keyboard operation, responsiveness, DOM conformance, or design acceptance.
- **WEB-UI-R12 — MUST finish the browser realization without stealing framework policy.** Update all affected
  production markup/styles/behavior, routes, state/error bindings, tests, docs, diagnostics, and compatibility
  surfaces. Framework-specific APIs and idioms stay with that framework owner; this skill verifies their
  semantic, responsive, state, interaction, and lifecycle outcomes.

### Must-Not-Follow

- **NEVER replace a native control with a styled generic element without proving equivalent semantics and
  operation.** Return to WEB-UI-R02 and WEB-UI-R05.
- **NEVER hide focus, clip required content, disable zoom, encode meaning by color alone, or make critical
  content depend only on hover, animation, or a disappearing message.** Return to WEB-UI-R04–WEB-UI-R08.
- **NEVER approve an interface from a single viewport, input method, happy state, DOM snapshot, or polished
  screenshot.** Execute the risk-based matrix and maintain the evidence boundaries in WEB-UI-R10–WEB-UI-R11.
- **NEVER treat this child as permission to revise the accepted design or narrow the parent feature.** Reopen
  the earliest owning generic UI or web decision.

## Procedure

Run eight phases after the parent routes the feature here.

### P1 — Read the accepted contract and live interface

Read the parent feature contract, accepted generic UI specification and evidence, project accessibility and
browser commitments, current routes/components/styles, semantic patterns, test tooling, and captured states.
Map every accepted clause to an affected production surface. Stop with `NEEDS_CONTEXT` if generic UI requires
evidence that is absent.

**Evidence:** accepted-clause trace, live-interface inventory, project matrix sources, conflict list.

### P2 — Lock the semantic and state model

Write the intended document outline, landmarks, headings, regions, relationships, controls, names,
descriptions, status/live behavior, source order, and full page/component state table. Reconcile every state
with the parent browser/server truth before styling.

**Evidence:** semantic outline/accessibility-tree expectation and state-to-domain trace.

### P3 — Lock interaction, focus, form, and overlay behavior

For each action and transition, specify input modalities, target behavior, focus entry/order/result/restoration,
keyboard commands, validation, submission/retry, cancellation, overlays, asynchronous status, and recovery.
Use [`ideation.md`](ideation.md) for unresolved browser-interface axes.

**Evidence:** interaction/focus sequence, form contract, overlay/async table.

### P4 — Lock responsive and lifecycle matrices

Derive the smallest risk-complete matrix from project commitments. Include viewport/content/locale/theme/
preference variation and direct entry/navigation/refresh/history/restore/render/hydration states where
applicable. Define oracles before implementation.

**Evidence:** selected matrix, scenario/check register, expected evidence per cell.

### P5 — Build the semantic skeleton

Materialize native document and control structure, labels, relationships, state hooks, route entries, and test
seams first. Verify semantics and basic keyboard order before visual breadth or framework abstraction.

**Evidence:** focused static/DOM/accessibility-tree and keyboard proof for the skeleton.

### P6 — Grow states and responsive behavior in slices

Add one accepted state or responsive/interaction slice at a time. Keep content, semantics, styles, behavior,
tests, and docs together. Exercise the focused scenario and check before the next slice; verify framework
integration only by its browser outcome.

**Evidence:** ordered slice log with fresh DOM, interaction, and rendering results.

### P7 — Verify the complete interface realization

Run selected [`scenarios.md`](scenarios.md) and [`checklists.md`](checklists.md) across the locked matrix. Combine
automated accessibility/static checks, live DOM/accessibility-tree inspection, keyboard/pointer/touch operation,
resize/zoom/content/preference stress, browser lifecycle checks, and captured rendering inspection. Keep direct-
user design evidence separate and inherited from generic UI.

**Evidence:** interface claim matrix with environment, result, artifact, and limitation.

### P8 — Evaluate and hand back to the parent

Use [`evaluation.md`](evaluation.md) inside the active evaluation. Resolve findings through the earliest owner,
rerun dependent checks, and hand the accepted-spec trace, matrix, evidence, limitations, and implementation
status to the root web release gate. Do not claim feature readiness independently.

**Evidence:** filled child checks, evaluation findings/dispositions, root handoff.

## References

- [`../SKILL.md`](../SKILL.md) owns the complete feature contract and release-ready gate.
- [`../../ui/SKILL.md`](../../ui/SKILL.md) owns generic UI research, specification, disposable prototype,
  direct representative-user evidence, and design acceptance.
- [`ideation.md`](ideation.md), [`scenarios.md`](scenarios.md), [`checklists.md`](checklists.md), and
  [`evaluation.md`](evaluation.md) operationalize this child without adding policy.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) is the normative accessibility reference selected through project
  requirements and feature risk.
- [WHATWG HTML](https://html.spec.whatwg.org/) defines native document, form, interaction, history, and
  navigation mechanics.
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) supplies informative composite-widget
  patterns when native HTML cannot express the accepted interaction; it does not override ARIA or HTML.
- [React hydration](https://react.dev/reference/react-dom/client/hydrateRoot) and [state preservation](https://react.dev/learn/preserving-and-resetting-state)
  are integration references only; the future React skill owns React policy.
