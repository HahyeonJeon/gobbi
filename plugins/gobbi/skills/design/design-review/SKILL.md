---
name: design-review
description: "Design Review is the bar a reviewer applies to visual work. Use it when reviewing UI, images, video, slides, reports, or other visual work."
allowed-tools: Read
skill-type: preference
---

# Design Review

Design Review is the domain bar for visual work inside [Review](../../review/SKILL.md), which owns the
procedure, the blocking rule, the report, and the verdict. Use it when reviewing UI, images, video, slides,
reports, or other visual work.

## Principles

### Judge what the viewer sees

Source code and mockups can look right while the rendered result does not. Judge the rendered result at the
sizes and in the states a viewer will meet.

## Rules

- **Let the project's own bar win.** The project's design system, brand, and accepted design come before these
  checks, because they are what the work must fit.
- **Apply only the checks the stage reaches.** A visual design at Ideation or Planning is judged on hierarchy,
  flow, and states, not on finished pixels it does not contain yet.

## Preferences

### Rendered Result

#### It is rendered at each target size and state

- Render the result with a browser, screenshot, or export at each size, viewport, and format the Goal names,
  and review those images, not the source.
- List each size or state that was not rendered under Not checked.

#### The hierarchy matches the accepted design

- The most important message or action is the most prominent, and order and grouping match the accepted design
  or wireframe.

#### Every state is shown, with feedback and recovery

- Empty, loading, error, success, disabled, first-use, and long-content states each exist. For static work,
  each variant the Goal names, such as print, dark mode, or a thumbnail, exists.
- Each action gives visible feedback, and each error says what happened and how to recover.

### Legibility and Access

#### Text and controls are legible

- Text contrast is at least 4.5:1, or 3:1 for large text, and controls and focus indicators reach 3:1 against
  their background (WCAG 2.2 SC 1.4.3, 1.4.11).
- No text is clipped, overlapped, or too small to read at the target size.

#### It adapts to each viewport

- Content reflows at 320 CSS px wide without horizontal scrolling (WCAG 2.2 SC 1.4.10), and nothing is cut off
  at any target size.
- Pointer targets are at least 24 by 24 CSS px (WCAG 2.2 SC 2.5.8).

#### It works without a mouse or sight

- Every control is reachable by keyboard in a sensible order with a visible focus indicator, and color is never
  the only signal (WCAG 2.2 SC 2.4.7, 1.4.1).
- Images and controls carry text alternatives and labels a screen reader can announce.

### Structure, Variation, and Vocabulary

#### Each screen, region, and component has one role, boundary, and set of relations

- For each screen, region, and component the change adds or changes, state its role in one sentence, the
  content, state, and interaction it owns, where it ends, and what it contains, triggers, or depends on.
- A component that does two jobs, regions whose responsibilities overlap, or a dependency on another
  component's internals fails this check. The fields of a [Ontology unit definition](../../ontology/SKILL.md) are
  the bar.

#### Shared parts are reused and variants are deliberate

- Repeated patterns use one component or token from the project's design system. Sizes, states, themes, and
  densities are named variants of that component, not one-off values.
- A near-duplicate component, or a color, type, or spacing value that differs by accident, fails this check.

#### Labels and names are consistent

- The same concept and the same action carry the same label on every screen, in the product's own vocabulary
  and the accepted design's terms.
- Component, variant, and token names follow the design system's naming.

### Fit and Content

#### Content is true and complete

- Every figure, label, and chart matches its source data, and the work uses real or realistic content, never
  placeholder text.

## References

| Name | Description |
|---|---|
| [Review](../../review/SKILL.md) | Owns the review procedure, stage bars, blocking rule, report, and verdict. |
| [Ontology](../../ontology/SKILL.md) | The six fields of an Ontology unit definition that the Structure checks test. |
