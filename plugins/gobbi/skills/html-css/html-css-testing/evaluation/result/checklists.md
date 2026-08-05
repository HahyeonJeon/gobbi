# HTML/CSS Testing Result Evaluation Checklist

This unchecked source evaluates the complete `testing-result` subject owned by `html-css-testing`.
Each condition is defined once, and a complete evaluation keeps its evidence and verdict outside this source.

## Project

### HCTEST-SC-PROJECT-02 — Normal case: evidence bound to exact source, target, and state

A focused test result is ready to support a claim. It passes when every observation binds to the exact source, emitted identity, target, mode, and state named by that claim; it fails when evidence from a neighboring artifact or state is substituted.

#### Checklist

- [ ] HCTEST-CK-PROJECT-02-01 — Every claim's evidence was gathered on the exact source, target, and state the claim names.

## Structure

### HCTEST-SC-STRUCTURE-02 — Edge case: cascade, conformance, DOM, and evidence-layer separation

The result combines cascade, HTML conformance, parser DOM, target behavior, or product evidence. It passes when the winning declaration and every evidence layer are established and recorded separately; it fails when source, DOM, rendering, or product conclusions are collapsed into one proxy.

#### Checklist

- [ ] HCTEST-CK-STRUCTURE-02-01 — The intended winner for every affected value is established by cascade evidence.
- [ ] HCTEST-CK-STRUCTURE-02-02 — Every applicable WHATWG authoring requirement is satisfied: permitted element context, permitted element content, permitted attribute, conforming attribute value, applicable document-level constraint, and conforming serialized syntax.
- [ ] HCTEST-CK-STRUCTURE-02-03 — Source, emitted bytes, parsed DOM, target behavior, and product evidence remain separate in the record.
- [ ] HCTEST-CK-STRUCTURE-02-04 — The parser-produced DOM observation is recorded separately from authored source.

## Performance

### HCTEST-SC-PERFORMANCE-03 — Poor quality: bounded performance and resource observations

Performance or resource evidence is incomplete or bounded by a specific artifact, target, candidate, cache, hint, or retry state. It passes when those conditions and every missing measurement remain explicit; it fails when a narrow observation becomes a general performance claim.

#### Checklist

- [ ] HCTEST-CK-PERFORMANCE-03-01 — Missing material performance evidence is recorded as a limitation or a stop condition.
- [ ] HCTEST-CK-PERFORMANCE-03-02 — Every HTML-attributed performance claim identifies the exact emitted artifact.
- [ ] HCTEST-CK-PERFORMANCE-03-03 — Every HTML-attributed performance claim stays within the observed target conditions.
- [ ] HCTEST-CK-PERFORMANCE-03-04 — Observed resource behavior names the target, candidate state, cache state, hints, and retries that affect the claim.

## Aesthetics

### HCTEST-SC-AESTHETICS-02 — Adversarial: traceable claim identity

A recorded claim appears polished but may not be reproducible. It passes when the exact source, target, state, and observation are named; it fails when a summary judgment cannot be traced to the observation behind it.

#### Checklist

- [ ] HCTEST-CK-AESTHETICS-02-01 — Every recorded claim names the exact source, target, state, and observation behind it.

## Usage

### HCTEST-SC-USAGE-02 — Edge case: focus, keyboard, support, and reduced-motion outcomes

Visual reordering, native controls, support differences, apparent operability, or reduced motion affect the user outcome. It passes when focus, keyboard activation, exact target scope, operability, and reduced stimulus are directly observed as applicable; it fails when appearance or declared role is used as behavior evidence.

#### Checklist

- [ ] HCTEST-CK-USAGE-02-01 — Focus order after visual reordering still reaches every operable element in a sequence a person can follow.
- [ ] HCTEST-CK-USAGE-02-02 — Every native interactive element retains its expected keyboard and activation behavior.
- [ ] HCTEST-CK-USAGE-02-03 — A support difference remains limited to the exact affected targets.
- [ ] HCTEST-CK-USAGE-02-04 — Every element that appears operable is operable by keyboard.
- [ ] HCTEST-CK-USAGE-02-05 — Direct observation confirms that the reduced-motion path preserves the outcome and materially reduces the stimulus.

## Consistency

### HCTEST-SC-CONSISTENCY-02 — Rule violation: project defaults, support claims, and CSS evidence limits

The result departs from project defaults or asserts cascade, layout, support, performance, or product acceptance. It passes when each departure and support claim has the evidence layer that owns it; it fails when lint, appearance, a specification label, or CSS evidence is used beyond its claim boundary.

#### Checklist

- [ ] HCTEST-CK-CONSISTENCY-02-01 — Every departure from a project default carries evidence for the choice it changes.
- [ ] HCTEST-CK-CONSISTENCY-02-02 — No cascade, order, focus, layout, support, performance, or acceptance claim rests on appearance, lint output, or a specification label alone.
- [ ] HCTEST-CK-CONSISTENCY-02-03 — Product acceptance is never claimed from CSS evidence.
- [ ] HCTEST-CK-CONSISTENCY-02-04 — Support for `@starting-style` and `transition-behavior: allow-discrete` is confirmed against the declared targets.

### HCTEST-SC-CONSISTENCY-03 — Rule violation: emitted identity and semantic evidence layers

Generated output and semantic evidence are reported together. It passes when conformance, DOM, authored meaning, target output, and product claims bind to one emitted identity but stay in separate layers; it fails when authored semantics is reported as observed accessibility output.

#### Checklist

- [ ] HCTEST-CK-CONSISTENCY-03-01 — Conformance, DOM, semantic, and target observations bind to that emitted identity.
- [ ] HCTEST-CK-CONSISTENCY-03-02 — Each source, DOM, target, and product claim stays within its owning evidence layer.
- [ ] HCTEST-CK-CONSISTENCY-03-03 — The result distinguishes authored semantics from direct semantic or accessibility output.

## Risk

### HCTEST-SC-RISK-02 — Expected failure: target support, security boundaries, and conflicting observations

The result claims target support, timeline behavior, security, or acceptance despite flaky or conflicting observations. It passes when essential outcomes have direct target evidence, security stays with its owner, and conflict remains unresolved until discriminated; it fails when Baseline, validation, or a lucky run supplies false assurance.

#### Checklist

- [ ] HCTEST-CK-RISK-02-01 — Every essential outcome is preserved on the declared browsers or the pinned Electron renderer.
- [ ] HCTEST-CK-RISK-02-02 — Every accepted declarative `animation-timeline` linkage carries direct target evidence rather than a Baseline claim.
- [ ] HCTEST-CK-RISK-02-03 — No markup or validator result is offered as evidence of security or of protection for untrusted data or a dangerous sink.
- [ ] HCTEST-CK-RISK-02-04 — Flaky or conflicting observations remain contained, limited, and unresolved until discriminated.

## Overall

### HCTEST-SC-OVERALL-02 — Expected failure: open claims, evidence ceilings, and broader test handoff

Evidence is insufficient for some claims or the conclusion belongs to an application suite. It passes when unmeasured claims stay open, evidence is not generalized, reduced-path consequences hold, and broader proof is handed to `web-testing`; it fails when the family result claims more than it established.

#### Checklist

- [ ] HCTEST-CK-OVERALL-02-01 — Every unmeasured claim remains an open question rather than an accepted result.
- [ ] HCTEST-CK-OVERALL-02-02 — Every consequence that depended on the animation still occurs on the reduced path.
- [ ] HCTEST-CK-OVERALL-02-03 — No observation is treated as proof of a property it does not establish.
- [ ] HCTEST-CK-OVERALL-02-04 — One target observation is not generalized to unobserved targets.
- [ ] HCTEST-CK-OVERALL-02-05 — Application-suite and Web-feature claims are handed to `web-testing` with the family evidence ceiling.
