# HTML/CSS Conventions Evaluation Checklist

This unchecked source evaluates the complete `conventions` subject owned by `html-css-conventions`.
Each condition is defined once, and a complete evaluation keeps its evidence and verdict outside this source.

## Project

### HCCONV-SC-PROJECT-01 — Normal case: owner routing and project-scoped convention selection

A local HTML/CSS presentation choice is being placed into an existing project. It passes when questions outside presentation conventions are routed, the applicable Rule and project default are named, and no local task invents a project-wide scheme; it fails when ownership or scope is widened silently.

#### Checklist

- [ ] HCCONV-CK-PROJECT-01-01 — Every triggered document-meaning, application-state, product-direction, security, trust, other-language syntax, generator-mechanics, transform-configuration, and Electron or runtime-process question is routed to its named owner.
- [ ] HCCONV-CK-PROJECT-01-02 — Every choice names the applicable Rule boundary it stays inside and the project default it selects within that boundary.
- [ ] HCCONV-CK-PROJECT-01-03 — No project-wide naming, layer, selector, token, or layout scheme is introduced to satisfy a local task.
- [ ] HCCONV-CK-PROJECT-01-04 — A choice with no established convention stays scoped to its actual owner or is raised to that owner for a decision.
- [ ] HCCONV-CK-PROJECT-01-05 — The convention defines one integrated HTML/CSS source-organization boundary.

## Structure

### HCCONV-SC-STRUCTURE-01 — Edge case: canonical cascade, selector, token, and public-hook ownership

A change touches cascade order, selectors, custom properties, tokens, source ownership, or public hooks. It passes when the canonical owner and stable seams remain explicit and any new seam or interface change has migration authority; it fails when specificity, a transform, or a private shortcut bypasses the existing contract.

#### Checklist

- [ ] HCCONV-CK-STRUCTURE-01-01 — Declaration, selector, custom-property, layer, and source ownership is explicit at the canonical owner for every changed value.
- [ ] HCCONV-CK-STRUCTURE-01-02 — Existing cascade contracts, layer order, stable selector seams, and the lowest workable specificity are used wherever they express the required ownership and still select the intended winner.
- [ ] HCCONV-CK-STRUCTURE-01-03 — A new source or transform seam is introduced only where the current canonical owner cannot express the presentation contract.
- [ ] HCCONV-CK-STRUCTURE-01-04 — Every established public hook and custom-property or token interface the change touches is preserved, or is changed under an authorized migration.
- [ ] HCCONV-CK-STRUCTURE-01-05 — A value that participates in established reuse, variation, or theming uses the existing custom-property or token interface.

### HCCONV-SC-STRUCTURE-02 — Edge case: local values and public name contracts

A value may be genuinely local while a markup or styling name may be public. It passes when the value stays at its narrow owner and every public name has exact spelling and casing; it fails when local data becomes a global token or consumers must guess an interface name.

#### Checklist

- [ ] HCCONV-CK-STRUCTURE-02-01 — A genuinely local value stays local.
- [ ] HCCONV-CK-STRUCTURE-02-02 — Every public markup and styling name has an exact spelling and casing contract.

## Performance

### HCCONV-SC-PERFORMANCE-01 — Poor quality: presentation conventions without performance guarantees

A convention is selected partly because it appears faster. It passes when the record presents it only as an emitted-presentation choice and routes performance proof to evidence owners; it fails when naming, layout, or selector preference is reported as a performance guarantee.

#### Checklist

- [ ] HCCONV-CK-PERFORMANCE-01-01 — Every convention is presented as an emitted-presentation choice, not a performance guarantee.

## Aesthetics

### HCCONV-SC-AESTHETICS-01 — Normal case: established names and stable hooks

A changed element, state, or hook already has an established project name. It passes when that name identifies the owned target without importing another concern; it fails when a new or misleading name makes one target appear to have two contracts.

#### Checklist

- [ ] HCCONV-CK-AESTHETICS-01-01 — Every name and hook identifies the owned target without naming a concern owned by another skill.
- [ ] HCCONV-CK-AESTHETICS-01-02 — An established project name or stable hook that already identifies the target is used instead of a new one.

## Usage

### HCCONV-SC-USAGE-01 — Edge case: resilient content, focus, color, and layout defaults

Content grows, fonts fail, user settings change, and the surface is viewed with text spacing, zoom, reflow, or alternate state. It passes when content and operation remain available with visible focus, non-color meaning, resilient defaults, normal flow, intrinsic sizing, and logical properties; it fails when presentation assumptions hide or obstruct an essential outcome.

#### Checklist

- [ ] HCCONV-CK-USAGE-01-01 — Essential content and operation remain available across applicable content, state, font failure, user settings, text spacing, zoom, and reflow.
- [ ] HCCONV-CK-USAGE-01-02 — Focus remains visible and unobscured in every applicable state.
- [ ] HCCONV-CK-USAGE-01-03 — Every meaning carried by color is also carried by a non-color cue.
- [ ] HCCONV-CK-USAGE-01-04 — Browser focus and state defaults, wrapping text, and resilient font fallbacks are kept wherever the presentation contract leaves the treatment open.
- [ ] HCCONV-CK-USAGE-01-05 — Normal flow, intrinsic sizing, and logical properties are used unless a genuinely physical requirement is stated.

### HCCONV-SC-USAGE-02 — Edge case: layout constraints, fallbacks, contrast, and locale adaptation

A layout uses flex, grid, positioning, overflow, containment, queries, fallbacks, or responsive adaptation. It passes when each mechanic answers a named constraint and target, contrast, locale, direction, and writing-mode requirements hold; it fails when a mechanic or fallback works only in the author's sample.

#### Checklist

- [ ] HCCONV-CK-USAGE-02-01 — Every use of flex, grid, positioning, overflow, containment, or a query names the constraint it satisfies.
- [ ] HCCONV-CK-USAGE-02-02 — Every declared target provides the required native path or an explicit fallback.
- [ ] HCCONV-CK-USAGE-02-03 — Non-text contrast satisfies the applicable binding threshold.
- [ ] HCCONV-CK-USAGE-02-04 — Text contrast satisfies the applicable binding threshold.
- [ ] HCCONV-CK-USAGE-02-05 — Responsive adaptation defaults cover locale, direction, and writing mode when material.

## Consistency

### HCCONV-SC-CONSISTENCY-01 — Rule violation: neighboring conventions and justified departures

The local choice differs from neighboring cascade, naming, token, or layout conventions. It passes when the project default is followed or the departure has a bounded scope and preserves every affected contract; it fails when preference overrides a binding Rule.

#### Checklist

- [ ] HCCONV-CK-CONSISTENCY-01-01 — The change follows the convention observed in neighboring source for cascade, naming, custom properties, and layout.
- [ ] HCCONV-CK-CONSISTENCY-01-02 — Every departure from a project default names its scope.
- [ ] HCCONV-CK-CONSISTENCY-01-03 — Every departure from a project default preserves the affected contracts.
- [ ] HCCONV-CK-CONSISTENCY-01-04 — No project default or local preference produces an outcome an applicable Rule forbids.

## Risk

### HCCONV-SC-RISK-01 — Adversarial: newer CSS features with tested fallbacks

A newer CSS feature behaves differently across declared browsers or the pinned renderer. It passes when direct target evidence proves the required outcome and a tested fallback or progressive enhancement; it fails when novelty or a support label replaces target proof.

#### Checklist

- [ ] HCCONV-CK-RISK-01-01 — Every feature whose support differs across the declared targets carries a tested fallback or progressive enhancement.
- [ ] HCCONV-CK-RISK-01-02 — A newer feature is chosen over an established one only where direct target evidence proves both the required outcome and its fallback.

## Overall

### HCCONV-SC-OVERALL-01 — Expected failure: native paths, progressive enhancement, and safe exceptions

An enhancement or exact-target shortcut is ready for acceptance. It passes when every declared target retains an essential native path, enhancements activate only on proven support, and exceptions preserve public contracts; it fails when the baseline disappears or a pinned-runtime assumption leaks into a broader claim.

#### Checklist

- [ ] HCCONV-CK-OVERALL-01-01 — An essential native path exists across every declared target.
- [ ] HCCONV-CK-OVERALL-01-02 — Every enhancement is layered only on proven support.
- [ ] HCCONV-CK-OVERALL-01-03 — An exact-target path is used only where the complete target is one pinned runtime and no broader claim is made.
- [ ] HCCONV-CK-OVERALL-01-04 — Every justified exception preserves binding Rules and public consumer contracts.
