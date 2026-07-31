---
name: css-constraints
description: MUST load before creating, changing, or reviewing CSS, including debugging expected to produce a CSS change and choosing CSS conventions.
allowed-tools: Read
skill-type: preference
---

# CSS Constraints

## Intro

Use this preference skill before creating, changing, or reviewing CSS, debugging toward a CSS change, or choosing CSS conventions. It defines the binding valid-choice boundary for emitted presentation.

CSS constraints own presentation and outward-owner boundaries, essential outcomes, accessibility conditions, target resilience, canonical-source repair, and evidence ceilings. Project-overridable implementation choices belong to CSS conventions.

## Principles

### User and content conditions define correctness

Presentation remains correct across applicable content, interaction, user settings, fonts, themes, locale, direction, writing mode, zoom, and reflow.

### Evidence follows the rendering risk

Specification semantics, target support, runtime behavior, performance, and acceptance are different claims with different evidence.

### Repair the responsible owner

CSS changes belong at the canonical source that owns emitted presentation; foreign concerns remain with their domain owners.

### Keep acceptance boundaries honest

CSS evidence can establish presentation behavior and limitations, but cannot alone establish complete product or accessibility acceptance.

## Rules

- **MUST keep CSS within emitted presentation ownership and repair generated CSS at its canonical source.** Route meaning, application state, product direction, security, generator mechanics, and Electron process work outward, then inspect any newly emitted CSS.
- **MUST preserve essential content and operation across applicable content, state, font failure, user settings, text spacing, zoom, reflow, source order, visual order, and focus order.** When visual order differs from source order, follow the [Flexbox order-accessibility requirements](https://www.w3.org/TR/css-flexbox-1/#order-accessibility).
- **MUST keep focus visible and unobscured, preserve non-color cues, and maintain required text and non-text contrast in every applicable state, theme, and forced-color mode.**
- **MUST keep motion safe and operable.** Avoid unsafe flashing, respect reduced motion, and retain applicable pause, stop, hide, or non-motion behavior under [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
- **MUST preserve essential outcomes on declared browsers or the pinned Electron renderer.** Use tested fallbacks or progressive enhancement when exact support differs.
- **NEVER accept a specification label, feature query, lint result, screenshot, convention, or unmeasured claim as sufficient proof.** Use evidence proportional to the affected risk, and never claim complete product or accessibility acceptance from CSS evidence alone.

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

## References
