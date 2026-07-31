---
name: css-review
description: "MUST load when performing a focused review of existing CSS."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# CSS Review

## Intro

Use this operation for a focused, read-only CSS review in a browser or Electron renderer. It assesses problems, optional improvements, strengths, limitations, and action owners.

The operation inspects without editing or accepting. Formal verdicts belong to evaluation, implementation to `css-development`, and both validity constraints and implementation defaults to `css-conventions`.

## Principles

### Evidence precedes conclusions

State the exact source, target, state, and observation that support each assessment item.

### Findings reflect consequence

Separate behavior or ownership defects from valid optional improvements and confirmed
strengths.

### Review the layer that owns the risk

Source, parsing, cascade, computed values, layout, modes, rendering, and performance answer different questions.

### Read-only work routes action outward

The reviewer identifies the responsible owner and evidence needed for a repair without
changing the subject.

## Rules

- **MUST keep the review read-only.** Do not edit source, output, configuration, fixtures,
  baselines, or runtime state beyond reversible inspection.
- **MUST frame the subject and review boundary.** Name source, transformed output, targets, states, requested concerns, and limits.
- **MUST apply the `css-conventions` Rules and relevant Preferences.** Route
  document, product, state, security, generator, and Electron process questions outward.
- **MUST inspect evidence in proportion to the claim and consequence.** Appearance or lint
  alone cannot establish cascade, order, focus, layout, support, performance, or acceptance.
- **MUST distinguish problems, optional improvements, strengths, and limitations.** Give
  each problem evidence, impact, confidence, and an owner.
- **NEVER issue a formal evaluation verdict from this focused review.** Load the general
  evaluation skill when its seven-perspective report and verdict are requested.

## Procedure

### Phase 1 — Bound the Review

#### 1.1 Frame the subject and authority

- Start from the question, source and output identities, targets, fixtures, and inspection
  permission.
- Define affected content, interaction, modes, known transforms, requested depth, non-goals,
  and outward-owner boundaries.
- Continue with sufficient subject and access; otherwise report the missing input.

#### 1.2 Select review evidence

- Inspect nearby source and conventions, then identify ownership, cascade, adaptation,
  accessibility, compatibility, and performance risks.
- Select only evidence that can test those risks: source and parsing, CSSOM, matched and
  cascaded rules, computed values, geometry, overflow, modes, targets, or rendering.
- Load `css-platform` for runtime lookup; unavailable evidence becomes a limitation.

### Phase 2 — Inspect the CSS

#### 2.1 Inspect source and ownership

- Confirm source and output identity, transform boundary, stable hooks, cascade structure,
  custom-property interfaces, and foreign-owner seams.
- Trace suspicious overrides or declarations to their winner and intended owner.
- Record evidence and scope; route foreign-owner concerns without recasting them as CSS.

#### 2.2 Inspect observable behavior

- Exercise applicable extremes, states, focus, modes, preferences, zoom, reflow, locale,
  direction, writing mode, targets, and fallbacks.
- Inspect computed, layout, overflow, order, and rendered evidence according to the framed
  risks; measure representative conditions for a performance claim.
- For conflicting evidence, narrow the state and compare the earliest divergent layer.

### Phase 3 — Form the Assessment

#### 3.1 Classify the observations

- Record a problem for a violated requirement, broken behavior, owner leak, unsupported
  target, or unguarded material risk.
- Record an optional improvement only when the current result remains valid; state its
  benefit, trade-off, and condition for adoption.
- Record evidenced strengths and limits on unsupported claims.

#### 3.2 Challenge each item

- Test each item against `css-conventions`, counterevidence, target scope, and owner
  boundaries.
- Remove appearance-only, duplicate, speculative, or non-actionable conclusions.
- Update changed classes or owners before handoff; withdraw items whose evidence fails.

### Phase 4 — Hand Off the Read-Only Result

#### 4.1 Report the assessment

- Present problems by consequence, then improvements, strengths, limitations, and routing.
- For each problem, include the evidence, affected behavior and targets, confidence, owner,
  and verification needed after a repair.
- Complete with a read-only, reproducible assessment; route changes to `css-development` and
  formal verdicts to evaluation.

## References
