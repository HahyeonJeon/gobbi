---
name: css-platform
description: "MUST load when understanding, inspecting, or diagnosing browser or Electron-renderer CSS behavior, including diagnosis before a CSS change, or when choosing runtime evidence for CSS."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# CSS Platform

## Intro

Use this tool skill to understand, inspect, or diagnose CSS on the browser and Electron-renderer processing and rendering surface, either read-only or before a CSS change. It maps CSS questions to runtime evidence.

The Manual owns stable platform concepts and evidence lookup. It does not edit CSS, teach a specific developer-tools interface, decide acceptance, or cover Electron process work.

## Principles

### Follow the rendering layer

Parsing, cascade, computed values, layout, painting, and compositing answer different
questions. Inspect the earliest layer that can test the claim.

### Bind observations to exact inputs

Runtime evidence needs a known document, transformed output, target, mode, and state.

### Treat support as target evidence

Specification status and target behavior are separate facts. Use official semantics and
current target observations.

### Separate observation from diagnosis

Record observations before inference. A diagnosis names its evidence and unknowns.

## Rules

- **MUST keep the named platform to browser and Electron-renderer CSS processing and
  rendering.** Route authoring, product, security, and process work outward.
- **MUST identify the exact target, document state, and emitted CSS under inspection.**
  Record transforms or source maps when they affect source identity.
- **MUST choose evidence from the layer that owns the behavior.** Source order does not prove
  a cascade winner, and a computed value does not prove layout.
- **MUST distinguish specification semantics from target support.** Verify the declared
  browsers or pinned Electron runtime.
- **MUST state access and observation limits.** Missing runtime access, fixtures, modes, or
  source identity makes the corresponding conclusion unavailable.
- **NEVER teach browser-specific steps or mutable version tables without current
  verification.** Prefer stable concepts and official owners.

## Manual

### Parsing and CSSOM

Parsing evidence shows whether CSS was accepted. Confirm input bytes, use syntax diagnostics,
and inspect the CSS Object Model (CSSOM); CSSOM presence proves neither match nor winner.

### Matching and cascade

Matched-rule evidence shows selector application. Cascade evidence identifies the winner
after origin, importance, encapsulation, layers, specificity, scope, order, inheritance,
and custom-property resolution.

### Computed values

A computed value shows property resolution. Use layout or rendering when intrinsic sizing,
fonts, fragmentation, transforms, or device conditions can change the result.

### Layout and overflow

Layout evidence includes boxes, intrinsic contributions, scroll dimensions, clipping, and
positioned geometry. Inspect applicable extremes, containers, scrollbars, zoom, reflow,
direction, and writing mode; a crop can hide overflow.

### Modes, order, and rendered output

Rendered evidence covers themes, forced colors, font and input states, motion preferences,
zoom, direction, and writing mode. Add focus, source-order, or geometry evidence; visual
reordering does not change document or focus order, as the
[Flexbox order-accessibility requirements](https://www.w3.org/TR/css-flexbox-1/#order-accessibility)
specify. Route document meaning and source-order repair to HTML.

### Declared-target support

Use the [CSS Working Group current-work index](https://www.w3.org/Style/CSS/current-work.en.html)
to locate specification status, not infer support. Use the declared browsers or pinned
Electron runtime and direct target evidence; feature detection proves neither semantics nor
speed.

### Transforms and source maps

Distinguish authored source, transform configuration, emitted bytes, source maps, and runtime
observation. Compare loaded and expected bytes, and route transform mechanics outward.

### Performance evidence

Match evidence to matching, style, layout, paint, compositing, memory, or latency cost.
Compare representative conditions before and after with behavior and accessibility guards.

### Diagnosis

Compare working and failing cases at the earliest divergence. Report target, state, evidence,
owner, and unknowns; route validity constraints to `css-constraints`, project-choice judgment
to `css-conventions`, changes to `css-development`, and read-only assessment to `css-review`.

## References
