---
name: html-css-conventions
description: "MUST load when choosing or reviewing binding presentation rules or overridable defaults for HTML/CSS source organization, cascade, selectors, public hooks, tokens, responsive adaptation, compatibility, or maintainability."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# HTML/CSS Conventions

Use this preference to choose binding presentation rules and overridable defaults for source ownership,
cascade layers, selectors, public hooks, tokens, responsive adaptation, compatibility, and maintenance. Apply
project conventions first when they are explicit and compatible with the binding Rules below.

This skill does not choose product aesthetics, execute source changes, prove browser facts, or define motion
mechanics. Route those claims to their design, development, platform, or motion owners.

## Principles

### Keep source ownership obvious

Place each rule at the earliest authorized source that owns it and make generated outputs traceable to that
source. A maintainer should not need specificity tricks to discover where a value comes from.

### Use the cascade as an interface

Treat origin, layer, scope, specificity, order, inheritance, and custom properties as explicit control points.
Stable intent matters more than a locally winning selector.

### Make defaults overridable

Choose defaults that work for the common case and expose narrow, documented override points for real consumer
needs. A default is not a performance or compatibility guarantee.

### Adapt to content and flow

Prefer logical, content-driven layout and naming that survives viewport, container, locale, direction, writing
mode, zoom, and content changes.

## Rules

- **MUST edit the authorized canonical source rather than generated output.** Record the generator or transform
  whenever markup or CSS is emitted.
- **MUST preserve valid HTML/CSS and project binding rules.** A local default or consumer override cannot weaken
  conformance, accessibility, security, or an approved public-interface contract.
- **MUST keep selectors and cascade control proportional to the ownership boundary.** Avoid accidental global
  reach, escalating specificity, and order dependencies that hide the source of a decision.
- **MUST treat public classes, IDs, attributes, custom properties, tokens, and selectors as consumer interfaces.**
  Record exact spelling, casing, owner, compatibility, and migration impact before changing them.
- **MUST provide required adaptation and support paths.** Use logical properties and explicit tested fallback
  or progressive enhancement when declared targets differ.
- **NEVER present a source convention as proof of rendering, performance, resource use, or target support.**
  Route direct target observations and diagnosis to `html-css-platform`; route focused comparison design,
  assertions, and result claims to `html-css-testing`.

## Preferences

### Prefer one obvious canonical source

Prefer colocating related markup and presentation ownership where the project can trace it without duplicating
rules. Split files or layers when ownership, loading, reuse, or maintenance evidence makes the boundary clearer.

### Prefer low-specificity, intention-revealing selectors

Prefer class, attribute, component-scope, and cascade-layer selectors that express the owned contract without
DOM-shape coupling. Use IDs, deep nesting, `!important`, or high-specificity selectors only when an established
external constraint requires them and the exception is documented.

### Prefer tokens for shared decisions

Prefer custom properties or the project's token mechanism for values that multiple consumers intentionally
share or override. Keep a literal value when it is genuinely local and a token would add indirection without a
shared decision.

### Prefer logical and content-driven adaptation

Prefer logical properties, intrinsic sizing, flow, grid, flex, container queries, and content breakpoints over
physical-direction assumptions and device labels. Depart for a proven target limit or owned design constraint,
with the affected locale, direction, and responsive cases recorded.

### Prefer stable public names

Prefer concise, purpose-based public names whose casing follows the project convention and does not expose
temporary DOM structure. Change a public name only with a complete consumer and transition record.

### Prefer explicit compatibility exceptions

Prefer a tested fallback or progressive enhancement for differing target support. Drop the fallback only when
the declared target policy and direct evidence show that no supported consumer requires it.

## References

- [`checklists.md`](checklists.md) evaluates HTML/CSS conventions across all eight perspectives.
