# HTML/CSS Design Evaluation Checklist

This unchecked source evaluates the complete `design` subject owned by `html-css-design`.
Each condition is defined once, and a complete evaluation keeps its evidence and verdict outside this source.

## Project

### HCDES-SC-PROJECT-01 — Normal case: approved intent and proportional design record

A designer is deciding how much comparison evidence an HTML/CSS choice needs. It passes when the approved product or interaction intent and its owner are cited and the record depth matches the choice; it fails when a small record omits ownership or risk, or a material choice skips alternatives.

#### Checklist

- [ ] HCDES-CK-PROJECT-01-01 — The design cites the approved product or interaction intent and its owner.
- [ ] HCDES-CK-PROJECT-01-02 — The record explains why the choice requires a full alternatives comparison or a proportional short form.
- [ ] HCDES-CK-PROJECT-01-03 — A small design uses a complete proportional short form rather than omitting ownership or risk.

## Structure

### HCDES-SC-STRUCTURE-01 — Edge case: regions, layout, states, and large-system dependencies

A responsive, multi-state surface is being decomposed before mechanics are chosen. It passes when regions, relationships, layout, adaptation, presentation states, variants, interfaces, and handoffs form one complete structure; it fails when any dependent region or state must be invented during implementation.

#### Checklist

- [ ] HCDES-CK-STRUCTURE-01-01 — The design defines the material structural regions and relationships.
- [ ] HCDES-CK-STRUCTURE-01-02 — The design defines the layout and responsive or adaptive architecture.
- [ ] HCDES-CK-STRUCTURE-01-03 — Every approved state maps to an explicit presentation state.
- [ ] HCDES-CK-STRUCTURE-01-04 — A large system record exposes all dependent regions, variants, interfaces, and handoffs.

## Performance

### HCDES-SC-PERFORMANCE-01 — Poor quality: performance and resource hypotheses

A design proposes a resource or performance advantage before target evidence exists. It passes when the assumption is recorded as a hypothesis for Platform or Testing; it fails when the design presents that assumption as a measured guarantee.

#### Checklist

- [ ] HCDES-CK-PERFORMANCE-01-01 — Every performance or resource assumption is handed to Platform or Testing as a hypothesis.

## Aesthetics

### HCDES-SC-AESTHETICS-01 — Normal case: visual-system coherence within approved intent

Several regions and states must express the approved visual direction as one system. It passes when their presentation choices remain coherent with that intent; it fails when isolated polish introduces a conflicting visual rule.

#### Checklist

- [ ] HCDES-CK-AESTHETICS-01-01 — The selected system is coherent within the approved visual intent.

## Usage

### HCDES-SC-USAGE-01 — Edge case: material variants and adaptive conditions

The design is exercised with material content, locale, direction, writing-mode, zoom, input, and accessibility variants. It passes when consequences, selected cases, and unexamined cases are explicit; it fails when a variant changes the layout or state outcome without a recorded design response.

#### Checklist

- [ ] HCDES-CK-USAGE-01-01 — Material variant consequences and unexamined cases are explicit.
- [ ] HCDES-CK-USAGE-01-02 — Responsive, locale, direction, writing-mode, zoom, input, and accessibility consequences are covered when material.

## Consistency

### HCDES-SC-CONSISTENCY-01 — Rule violation: specialist ownership of design mechanics

The design depends on exact semantic, presentation-convention, and motion decisions. It passes when each mechanic is attributed to its specialist owner; it fails when the design record silently decides a child skill's policy.

#### Checklist

- [ ] HCDES-CK-CONSISTENCY-01-01 — Every exact semantic, convention, and motion choice is attributed to its specialist owner.

## Risk

### HCDES-SC-RISK-01 — Adversarial: public interfaces and unknown consumers

The design changes a public class, custom property, hook, or markup contract that may have unknown consumers. It passes when the interface, known consumers, discovery confidence, compatibility assumptions, and residual risk are explicit; it fails when a consumer can break without appearing in the record.

#### Checklist

- [ ] HCDES-CK-RISK-01-01 — Public-interface and unknown-consumer risks are explicit.

## Overall

### HCDES-SC-OVERALL-01 — Expected failure: unresolved intent, selected rationale, and implementation handoff

Product intent is incomplete or several reference-backed systems remain viable at handoff time. It passes when unresolved intent returns to its owner and the selected alternative records its criteria before Development receives a complete implementation contract; it fails when implementation must invent intent or rationale.

#### Checklist

- [ ] HCDES-CK-OVERALL-01-01 — Unresolved product or interaction intent is returned to the product or interaction owner.
- [ ] HCDES-CK-OVERALL-01-02 — The selected alternative records its criteria and rationale.
- [ ] HCDES-CK-OVERALL-01-03 — The development handoff is complete enough to implement without inventing design intent.
