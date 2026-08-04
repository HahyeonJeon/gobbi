# HTML/CSS Testing Procedure Evaluation Checklist

This unchecked source evaluates the complete `testing-procedure` subject owned by `html-css-testing`.
Each condition is defined once, and a complete evaluation keeps its evidence and verdict outside this source.

## Project

### HCTEST-SC-PROJECT-01 — Normal case: generated output, target identity, and claim ownership

A focused HTML/CSS claim is prepared after source or generator output changes. It passes when the exact source, target, mode, semantic owner, system under test, and newly emitted CSS are bound before evidence is selected; it fails when a test could pass against the wrong artifact or owner.

#### Checklist

- [ ] HCTEST-CK-PROJECT-01-01 — CSS newly emitted by a generator changed for this task is inspected rather than assumed.
- [ ] HCTEST-CK-PROJECT-01-02 — The test evidence identity is bound to the declared target and mode.
- [ ] HCTEST-CK-PROJECT-01-03 — Every assertion records its semantic owner and system under test.

## Structure

### HCTEST-SC-STRUCTURE-01 — Edge case: generated CSS, parser recovery, semantics, and atomic assertions

A repair affects generated CSS, parser recovery, or authored semantics and the requested claim contains several states. It passes when emitted output is inspected, source-to-DOM differences are explicit, semantic output is not assumed from a role, and each assertion is binary; it fails when one proxy or compound assertion hides a divergence.

#### Checklist

- [ ] HCTEST-CK-STRUCTURE-01-01 — The CSS newly emitted after a generated-CSS repair is inspected.
- [ ] HCTEST-CK-STRUCTURE-01-02 — Every recovery-sensitive fragment or markup states its parsing context, its expected DOM structure, and every material source-to-DOM difference.
- [ ] HCTEST-CK-STRUCTURE-01-03 — The test verifies authored name, role, and state or direct semantic and accessibility output without assuming behavior from the declared role.
- [ ] HCTEST-CK-STRUCTURE-01-04 — Every compound claim is decomposed into independently decidable assertions.

## Performance

### HCTEST-SC-PERFORMANCE-01 — Poor quality: representative before-and-after measurements with guards

A change claims a performance improvement under representative use. It passes when before-and-after measurements exercise the affected condition with behavior and accessibility guards intact; it fails when an unrepresentative or unguarded sample is treated as proof.

#### Checklist

- [ ] HCTEST-CK-PERFORMANCE-01-01 — Every performance claim rests on representative measurement of the affected condition.
- [ ] HCTEST-CK-PERFORMANCE-01-02 — Every performance measurement is taken with behavior and accessibility guards in place.
- [ ] HCTEST-CK-PERFORMANCE-01-03 — Performance is measured before and after the change under representative conditions.
- [ ] HCTEST-CK-PERFORMANCE-01-04 — Every measurement keeps behavior and accessibility guards in place.

### HCTEST-SC-PERFORMANCE-02 — Poor quality: non-default animation properties and minimum evidence

Motion uses an animated property other than `transform` or `opacity`, or another claim needs stronger evidence than source inspection. It passes when representative target measurements and the minimum establishing evidence are recorded; it fails when property preference or a weaker proxy substitutes for measurement.

#### Checklist

- [ ] HCTEST-CK-PERFORMANCE-02-01 — Every animated property other than `transform` or `opacity` carries an `html-css-testing`-owned representative before-and-after comparison based on direct target observations from `html-css-platform`, recorded beside the change.
- [ ] HCTEST-CK-PERFORMANCE-02-02 — Representative conditions are compared before and after.
- [ ] HCTEST-CK-PERFORMANCE-02-03 — Behavior and accessibility guards are in place during the comparison.
- [ ] HCTEST-CK-PERFORMANCE-02-04 — Each assertion selects the minimum evidence capable of establishing it.

## Aesthetics

### HCTEST-SC-AESTHETICS-01 — Adversarial: cosmetic success challenged by stronger evidence

The subject looks correct in a screenshot or ordinary happy path while its semantic, cascade, focus, or target contract may still be broken. It passes when an adversarial evidence case exposes cosmetic-only success; it fails when appearance alone can satisfy the evidence plan.

#### Checklist

- [ ] HCTEST-CK-AESTHETICS-01-01 — An adversarial cosmetic-green subject fails the selected evidence plan.

## Usage

### HCTEST-SC-USAGE-01 — Edge case: variant coverage, forced colors, and will-change evidence

The claim varies with extremes, zoom, reflow, direction, writing mode, forced colors, themes, or `will-change` behavior. It passes when the selected case set and direct measurements cover the material population and record gaps; it fails when one convenient sample is generalized.

#### Checklist

- [ ] HCTEST-CK-USAGE-01-01 — Applicable extremes, scrollbars, zoom, reflow, direction, and writing mode are verified wherever a physical property or clipping is used.
- [ ] HCTEST-CK-USAGE-01-02 — A custom focus, state, or contrast treatment is verified in forced-color mode and in every applicable theme rather than in one sample.
- [ ] HCTEST-CK-USAGE-01-03 — Direct target measurement establishes the need and effect claimed for `will-change` without promising promotion.
- [ ] HCTEST-CK-USAGE-01-04 — The case set records its variant population, selected tuples, rationale, and gaps.

## Consistency

### HCTEST-SC-CONSISTENCY-01 — Rule violation: checker identity and affected-layer reruns

A conformance checker or evidence layer is rerun after repair. It passes when checker version and configuration are recorded and every affected layer is reevaluated; it fails when changed evidence is compared with an unidentified tool or stale layer.

#### Checklist

- [ ] HCTEST-CK-CONSISTENCY-01-01 — Every conformance observation identifies the checker, its exact version, and its configuration.
- [ ] HCTEST-CK-CONSISTENCY-01-02 — Every evidence layer affected by the repair is re-evaluated.

## Risk

### HCTEST-SC-RISK-01 — Expected failure: risk-falsifying evidence across claimed variants

A claim spans several targets, themes, modes, or a risk that a weak evidence layer cannot falsify. It passes when each claimed case has evidence capable of exposing that risk; it fails when one target or proxy is used for the whole claim.

#### Checklist

- [ ] HCTEST-CK-RISK-01-01 — The evidence layer selected for every claim can falsify the risk that claim is offered against.
- [ ] HCTEST-CK-RISK-01-02 — A claim spanning several targets, themes, or modes carries evidence from each of them rather than from one sample.

## Overall

### HCTEST-SC-OVERALL-01 — Expected failure: reproduction, regression reruns, and reduced-motion verification

A reproduced failure has been repaired and reduced-motion behavior is part of the contract. It passes when the smallest failing fixture, affected downstream checks, and the actual reduced path are rerun; it fails when repair success or reduction is inferred without execution.

#### Checklist

- [ ] HCTEST-CK-OVERALL-01-01 — Every failure is reproduced in the smallest fixture before its repair.
- [ ] HCTEST-CK-OVERALL-01-02 — The failing check and every affected downstream check are rerun after the repair.
- [ ] HCTEST-CK-OVERALL-01-03 — The reduced path is verified under `prefers-reduced-motion: reduce` rather than inferred from the presence of the media block.
