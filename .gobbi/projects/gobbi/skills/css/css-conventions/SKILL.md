---
name: css-conventions
description: "MUST load when a CSS task must decide whether a choice is valid and which project default applies, covering accessibility, target support, motion, evidence limits, cascade ownership, naming, custom-property and token interfaces, and layout adaptation."
allowed-tools: Read
skill-type: preference
---

# CSS Conventions

## Intro

Use this preference skill when a CSS task must decide whether a choice is valid and which project default applies. It owns the complete choice space for emitted presentation: the binding boundary every choice stays inside, and the overridable defaults selected within it.

The Rules define that boundary through presentation ownership, accessibility conditions, declared-target support, and evidence limits. The Preferences select cascade, naming, custom-property and token, layout, and source-seam defaults inside it, and a Rule wins every conflict.

Load `css-development` to make a change, `css-review` to assess existing CSS, and `css-platform` for runtime evidence. Document meaning, application state, product direction, security, and process work belong to their own domain owners.

## Principles

### Actual user and content conditions define correctness

Presentation remains correct across applicable content, interaction, user settings, fonts, themes, locale, direction, writing mode, zoom, and reflow. Those same conditions, with containers, writing systems, target modes, and required behavior, choose the layout and adaptation technique.

### Evidence follows the rendering risk

Specification semantics, target support, runtime behavior, performance, and acceptance are different claims with different evidence. CSS evidence can establish presentation behavior and limitations, but cannot alone establish complete product or accessibility acceptance.

### Ownership decides both the source and the cascade

CSS changes belong at the canonical source that owns emitted presentation, and foreign concerns remain with their domain owners. Layers, specificity, scope, inheritance, custom properties, and order should reveal which source controls a rendered value.

### Bounded defaults sit inside a binding boundary

Existing public interfaces and nearby conventions supply the default, while a Rule below outranks every project default and local preference. A departure names its scope, preserves affected contracts, and carries evidence for the choice it changes.

## Rules

- **MUST keep CSS within emitted presentation ownership and repair generated CSS at its canonical source.** Route document meaning, application state, product direction, security, trust, foreign syntax, generator mechanics, transform configuration, and Electron or runtime process decisions outward, then inspect any newly emitted CSS.
- **MUST preserve essential content and operation across applicable content, state, font failure, user settings, text spacing, zoom, reflow, source order, visual order, and focus order.** Keep focus visible and unobscured, preserve non-color cues, maintain required text and non-text contrast in every applicable state, theme, and forced-color mode, and follow the [Flexbox order-accessibility requirements](https://www.w3.org/TR/css-flexbox-1/#order-accessibility) when visual order differs from source order.
- **MUST keep motion safe and operable.** Avoid unsafe flashing, respect reduced motion, and retain applicable pause, stop, hide, or non-motion behavior under [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
- **MUST preserve essential outcomes on declared browsers or the pinned Electron renderer.** Use tested fallbacks or progressive enhancement when exact support differs.
- **MUST preserve established public hooks and custom-property or token interfaces unless an authorized migration updates every affected consumer, and make declaration, selector, custom-property, layer, and source ownership explicit at the canonical owner.** NEVER invent a project-wide naming, layer, selector, token, or layout scheme for a local task; use an established convention or keep the decision scoped to its actual owner.
- **NEVER accept a specification label, feature query, lint result, screenshot, visual appearance, convention, popularity, or unmeasured claim as proof of behavior, target support, performance, or acceptance.** Use evidence proportional to the affected risk, and never claim complete product or accessibility acceptance from CSS evidence alone.

## Preferences

Preferences apply only inside the Rules. A Rule wins every conflict.

### Accessible browser behavior

**Default:** **PREFER** browser focus and state defaults, wrapping text, and resilient font fallbacks.

**Applicability:** Use these defaults when the presentation contract leaves the treatment open and native behavior preserves the required outcome across applicable content, themes, font failure, and user modes.

**Departure:** Use custom treatment only when equivalent behavior is directly verified and every Rule still passes.

### Compatibility

**Default:** **PREFER** established features with direct evidence across the declared targets when they express the presentation contract clearly.

**Applicability:** Use this default when established and newer features can both satisfy the target-and-fallback Rule.

**Departure:** Choose a newer feature when it materially improves the implementation and direct target evidence proves the required outcome and fallback.

### Proportional verification

**Default:** **PREFER** the smallest evidence layer that can falsify the risk: parsing for syntax, CSSOM for emitted rules, cascade evidence for ownership, computed values for resolution, geometry and overflow for layout, and target or mode rendering for integrated appearance.

**Applicability:** Use this default when the selected layer can observe the affected claim under representative conditions.

**Departure:** Increase evidence with consequence and variation; for performance, use representative measurement with behavior and accessibility guards.

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
