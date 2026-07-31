---
name: css-development
description: "MUST load when creating or changing CSS, including debugging expected to produce a CSS change."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# CSS Development

## Intro

Use this operation when authorized work creates or changes CSS, including debugging expected to produce a CSS change. It produces verified CSS changed at its canonical source.

The operation owns the ordered implementation path. Route product direction, document meaning, state, security, transform internals, acceptance, and Git publication outward.

## Principles

### Start from the rendering contract

Identify the outcome, source owner, cascade boundary, targets, and affected states before editing.

### Build the smallest coherent slice

Establish a minimal cascade and layout skeleton, then add one observable behavior at a time.

### Verify the layer that can fail

Choose the smallest evidence layer that can expose the affected risk.

### Repair the earliest wrong owner

Trace failures to the first wrong source, transform, assumption, or owner decision.

## Rules

- **MUST change only authorized canonical CSS source.** For generated CSS, change its source
  or route generator mechanics outward, then inspect the emitted CSS.
- **MUST frame the rendering outcome and affected owners before editing.** Stop when an unresolved outward-owner decision controls the result.
- **MUST apply CSS constraints and the project's CSS conventions to every implementation
  choice.** Treat constraints as the valid-choice boundary and conventions as project
  defaults.
- **MUST grow the change in observable increments.** Keep each increment small enough to
  verify and repair without hiding an earlier failure.
- **MUST verify in proportion to consequence and target variation.** Appearance, lint, and
  specification labels do not prove behavior, support, or performance.
- **NEVER claim product acceptance from CSS evidence.** Hand off CSS behavior, evidence,
  limitations, and outward-owner decisions without deciding the product outcome.

## Procedure

### Phase 1 — Frame the CSS Change

#### 1.1 Define the rendering outcome and authority

- State the outcome, affected content and interaction, authority, canonical source,
  transformed output when applicable, and non-goals.
- Route HTML meaning, product direction, JavaScript state, security authorization, generator
  mechanics, and Electron process or release work to their owners.
- Continue only when CSS can produce the outcome inside the granted authority.

#### 1.2 Bound the environment and evidence

- Identify targets, modes, user settings, representative content, checks, and regression scope.
- Inspect current source, cascade boundaries, stable hooks, transforms, and nearby patterns.
- Select evidence that can falsify each risk. Load CSS platform for runtime lookup, and stop
  when a material target, fixture, or access path is missing.

### Phase 2 — Establish the Rendering Skeleton

#### 2.1 Build and grow the implementation

- At canonical source, apply CSS constraints and project conventions, then create only the
  cascade, selector, custom-property, and layout skeleton needed for the first outcome.
- Inspect transformed output, then add one state or constraint at a time and check its
  winner and affected computed or layout result.
- Repeat until the framed behavior is complete; repair a failing slice before adding another,
  and route an unclear or foreign source-to-output mechanism outward.

### Phase 3 — Verify and Recover

#### 3.1 Verify the complete implementation

- Exercise applicable content extremes, states, containers, preferences, modes, targets,
  fallbacks, and progressive enhancements.
- Run source and parse checks, then inspect cascade, computed values, geometry, overflow,
  focus visibility, and rendered output according to risk.
- Measure performance before and after with behavior and accessibility guards; missing
  material evidence is a limitation or stop condition.

#### 3.2 Repair a failed result

- Reproduce the failure in the smallest fixture and find the first wrong source, assumption,
  transform, or owner decision.
- Repair the smallest complete canonical-source unit, then rerun the failing check and every
  affected downstream check from Step 3.1.
- Stop with exact evidence when the cause belongs outside CSS or cannot run in the target.

### Phase 4 — Hand Off the Verified CSS

#### 4.1 Close the implementation

- Reinspect final source, emitted CSS, scoped diff, and fresh verification.
- Record the implemented outcome, targets and modes exercised, evidence, limitations,
  unresolved outward-owner decisions, and recovery state.
- Complete only when the authorized source contains the intended change and the required
  evidence passes; do not publish, accept, or broaden the product on this operation's behalf.

## References
