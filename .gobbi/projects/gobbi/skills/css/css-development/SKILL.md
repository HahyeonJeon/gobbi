---
name: css-development
description: "MUST load when creating, changing, or reviewing CSS, including debugging expected to produce a CSS change and focused read-only assessment of existing CSS."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# CSS Development

## Intro

Use this operation when authorized work creates, changes, or reviews CSS in a browser or Electron
renderer. It runs in one of two modes, selected before any inspection or edit: change mode produces
verified CSS at its canonical source, and review mode produces a read-only assessment of existing CSS.

The selected mode fixes the authority for the whole run. Change mode writes only the authorized
canonical source. Review mode writes nothing and routes every repair to its owner, so making a change
found during a review requires a new authorized change-mode run.

Route product direction, document meaning, application state, security, transform internals, formal
evaluation verdicts, acceptance, and Git publication outward. Load `css-conventions` for validity and
project defaults, and `css-platform` for runtime evidence.

## Principles

### One subject, two authorities

A CSS engagement is either a change or a review, and the difference is authority rather than subject
matter. Change mode writes at the canonical source, while review mode changes nothing and instead
names the responsible owner and the evidence a repair would need.

### Start from the rendering contract

Identify the outcome or subject, canonical source owner, cascade boundary, targets, and affected
states before acting. In change mode that frame is the contract to satisfy; in review mode it is the
boundary of what the assessment may claim.

### Work the layer that owns the risk

Source, parsing, cascade, computed values, layout, modes, rendering, and performance answer different
questions, so use the smallest layer that can expose the affected risk. Name the exact source, target,
state, and observation behind every claim, and weigh each result by its consequence.

### Build and repair in the smallest coherent slice

Establish a minimal cascade and layout skeleton, then add one observable behavior at a time. Trace a
failure to the first wrong source, transform, assumption, or owner decision, and act on that owner
rather than on the place the failure appeared.

## Rules

- **MUST select change mode or review mode and frame the work before touching the subject.** In change
  mode, name the rendering outcome, canonical source, and affected owners, and stop when an unresolved
  outward-owner decision controls the result; in review mode, name the source, transformed output,
  targets, states, requested concerns, and limits.
- **NEVER edit anything in review mode.** Do not change source, output, configuration, fixtures,
  baselines, or runtime state beyond reversible inspection; route every repair to its owner and make it
  only in a newly authorized change-mode run.
- **MUST change only authorized canonical CSS source in change mode, and grow the change in observable
  increments.** For generated CSS, change its source or route generator mechanics outward and then
  inspect the emitted CSS; keep each increment small enough to verify and repair without hiding an
  earlier failure.
- **MUST apply `css-conventions` to every choice in both modes.** Treat its Rules as the valid-choice
  boundary and its Preferences as the project's overridable defaults, and route document, product,
  state, security, generator, and Electron process questions outward.
- **MUST work evidence in proportion to the claim, consequence, and target variation.** Appearance,
  lint, and specification labels alone do not establish cascade, order, focus, layout, support,
  performance, or acceptance; NEVER claim product acceptance from CSS evidence, and hand off
  outward-owner decisions without deciding the product outcome.
- **MUST distinguish problems, optional improvements, strengths, and limitations in a review-mode
  assessment.** Give each problem evidence, impact, confidence, and an owner; NEVER issue a formal
  evaluation verdict from this operation, and load the general evaluation skill when its
  seven-perspective report and verdict are requested.

## Procedure

### Phase 1 — Select the Mode and Bound the Work

#### 1.1 Select change mode or review mode

- Start from the request, the granted authority, and the result the caller asked for.
- Select change mode when the work must create or change CSS, including debugging expected to produce a
  CSS change; select review mode when the work must assess existing CSS without changing it.
- Record the selected mode before inspecting or editing anything, and ask the caller when the request
  supports both modes.
- Continue at Step 1.2 in change mode or Step 1.4 in review mode. A repair found in review mode ends
  that run at Step 3.5 and requires a new authorized change-mode run.

#### 1.2 Define the rendering outcome and authority — change mode

- State the outcome, affected content and interaction, authority, canonical source, transformed output
  when applicable, and non-goals.
- Route HTML meaning, product direction, JavaScript state, security authorization, generator mechanics,
  and Electron process or release work to their owners.
- Continue at Step 1.3 only when CSS can produce the outcome inside the granted authority.

#### 1.3 Bound the environment and evidence — change mode

- Identify targets, modes, user settings, representative content, checks, and regression scope.
- Inspect current source, cascade boundaries, stable hooks, transforms, and nearby patterns.
- Select evidence that can falsify each risk. Load `css-platform` for runtime lookup, and stop when a
  material target, fixture, or access path is missing.
- Continue at Phase 2 with the framed outcome, bounded environment, and selected evidence.

#### 1.4 Frame the review subject and authority — review mode

- Start from the question, source and output identities, targets, fixtures, and inspection permission.
- Define affected content, interaction, modes, known transforms, requested depth, non-goals, and
  outward-owner boundaries.
- Continue at Step 1.5 with sufficient subject and access; otherwise report the missing input.

#### 1.5 Select review evidence — review mode

- Inspect nearby source and conventions, then identify ownership, cascade, adaptation, accessibility,
  compatibility, and performance risks.
- Select only evidence that can test those risks: source and parsing, CSSOM, matched and cascaded rules,
  computed values, geometry, overflow, modes, targets, or rendering.
- Load `css-platform` for runtime lookup; unavailable evidence becomes a limitation.
- Continue at Phase 3, keeping every selected inspection reversible.

### Phase 2 — Produce the Verified Change — change mode

#### 2.1 Build and grow the implementation

- At canonical source, apply `css-conventions`, then create only the cascade, selector,
  custom-property, and layout skeleton needed for the first outcome.
- Inspect transformed output, then add one state or constraint at a time and check its
  winner and affected computed or layout result.
- Repeat until the framed behavior is complete; repair a failing slice before adding another,
  and route an unclear or foreign source-to-output mechanism outward.

#### 2.2 Verify the complete implementation

- Exercise applicable content extremes, states, containers, preferences, modes, targets,
  fallbacks, and progressive enhancements.
- Run source and parse checks, then inspect cascade, computed values, geometry, overflow,
  focus visibility, and rendered output according to risk.
- Measure performance before and after with behavior and accessibility guards; missing
  material evidence is a limitation or stop condition.
- When this change is evaluated, the [evaluation checklist](checklists.md) and every
  checklist owned by an active `css` sibling supply the applicable conditions; the general
  evaluation skill resolves them and issues any verdict.

#### 2.3 Repair a failed result

- Reproduce the failure in the smallest fixture and find the first wrong source, assumption,
  transform, or owner decision.
- Repair the smallest complete canonical-source unit, then rerun the failing check and every
  affected downstream check from Step 2.2.
- Stop with exact evidence when the cause belongs outside CSS or cannot run in the target.

#### 2.4 Close the implementation

- Reinspect final source, emitted CSS, scoped diff, and fresh verification.
- Record the implemented outcome, targets and modes exercised, evidence, limitations,
  unresolved outward-owner decisions, and recovery state.
- Complete only when the authorized source contains the intended change and the required
  evidence passes; do not publish, accept, or broaden the product on this operation's behalf.

### Phase 3 — Produce the Read-Only Assessment — review mode

#### 3.1 Inspect source and ownership

- Confirm source and output identity, transform boundary, stable hooks, cascade structure,
  custom-property interfaces, and foreign-owner seams.
- Trace suspicious overrides or declarations to their winner and intended owner.
- Record evidence and scope; route foreign-owner concerns without recasting them as CSS.

#### 3.2 Inspect observable behavior

- Exercise applicable extremes, states, focus, modes, preferences, zoom, reflow, locale,
  direction, writing mode, targets, and fallbacks.
- Inspect computed, layout, overflow, order, and rendered evidence according to the framed
  risks; measure representative conditions for a performance claim.
- For conflicting evidence, narrow the state and compare the earliest divergent layer.

#### 3.3 Classify the observations

- Record a problem for a violated requirement, broken behavior, owner leak, unsupported
  target, or unguarded material risk.
- Record an optional improvement only when the current result remains valid; state its
  benefit, trade-off, and condition for adoption.
- Record evidenced strengths and limits on unsupported claims.

#### 3.4 Challenge each item

- Test each item against `css-conventions`, counterevidence, target scope, and owner
  boundaries.
- Remove appearance-only, duplicate, speculative, or non-actionable conclusions.
- Update changed classes or owners before handoff; withdraw items whose evidence fails.

#### 3.5 Report the assessment

- Present problems by consequence, then improvements, strengths, limitations, and routing.
- For each problem, include the evidence, affected behavior and targets, confidence, owner,
  and verification needed after a repair.
- Complete with a read-only, reproducible assessment; route a repair to a new authorized
  change-mode run, and a formal verdict to the general evaluation skill together with the
  [evaluation checklist](checklists.md).

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
