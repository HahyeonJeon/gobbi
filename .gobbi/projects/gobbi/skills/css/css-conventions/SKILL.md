---
name: css-conventions
description: MUST load before creating, changing, or reviewing CSS, including debugging expected to produce a CSS change and choosing CSS conventions.
allowed-tools: Read
skill-type: preference
---

# CSS Conventions

## Intro

Use this preference skill before creating, changing, or reviewing CSS, debugging toward a CSS change, or choosing CSS conventions. It selects overridable project choices within the CSS constraints.

CSS conventions own cascade and selector choices, naming and hooks, custom-property and token interfaces, layout adaptation, and source or ownership seams. CSS constraints and outward domain owners remain authoritative.

## Principles

### Project contracts precede local taste

Existing public interfaces and nearby conventions provide the default unless an authorized, scoped departure improves the owned outcome.

### Cascade structure expresses ownership

Layers, specificity, scope, inheritance, custom properties, and order should reveal which source controls a rendered value.

### Actual constraints choose layout

Content, containers, writing systems, target modes, and required behavior determine the layout and adaptation technique.

### Departures remain bounded

A convention departure names its scope, preserves affected contracts, and carries evidence for the choice it changes.

## Rules

- **MUST keep every convention choice inside the CSS constraints.** A constraint wins every conflict with a project default or local preference.
- **MUST preserve established public hooks and custom-property or token interfaces unless an authorized migration updates every affected consumer.**
- **MUST make declaration, selector, custom-property, layer, and source ownership explicit at the canonical owner.**
- **NEVER invent a project-wide naming, layer, selector, token, or layout scheme for a local task.** Use an established convention or keep the decision scoped to its actual owner.
- **MUST route document meaning, application state, product direction, security, foreign syntax, transform configuration, trust, and runtime process decisions outward.**
- **NEVER treat convention, popularity, lint, or visual appearance as proof of behavior, target support, performance, or acceptance.**

## Preferences

Preferences apply only inside the Rules. A Rule wins every conflict.

### Naming and hooks

**Default:** **PREFER** established project names and stable hooks.

**Applicability:** Use them when an existing interface identifies the owned target without leaking a foreign concern.

**Departure:** Introduce a clearer name or hook only inside an authorized migration, update every affected consumer, and keep the new interface scoped.

### Cascade and selectors

**Default:** **PREFER** existing cascade contracts, layer order, stable selector seams, and low specificity.

**Applicability:** Use them when they express ownership and allow the required state or context to select the intended winner.

**Departure:** Use a more specific selector, different layer position, or public or third-party seam only when the established contract requires it; verify the winner.

### Custom properties and tokens

**Default:** **PREFER** existing custom-property and token interfaces for values that participate in established reuse, variation, or theming.

**Applicability:** Use them when the interface owner and consumer contract match the value being changed.

**Departure:** Keep a truly local value local, and introduce a new interface only when repeated ownership or variation justifies it and affected consumers agree.

### Layout and adaptation

**Default:** **PREFER** normal flow, intrinsic sizing, and logical properties, then choose flex, grid, positioning, overflow, containment, or queries from the actual constraint.

**Applicability:** Use this default when the layout must adapt across content, containers, zoom, reflow, locale, direction, or writing mode.

**Departure:** Use physical properties or clipping only for a genuinely physical requirement and verify applicable extremes, scrollbars, zoom, reflow, direction, and writing mode.

### Source and ownership seams

**Default:** **PREFER** existing canonical owners and transform boundaries.

**Applicability:** Use them when they can express the required presentation contract without importing foreign syntax or authority.

**Departure:** Introduce a new seam only when the current owner cannot express the contract, and keep configuration, trust, transform mechanics, and runtime decisions with their owners.

## References
