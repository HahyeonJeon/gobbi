# HTML/CSS Platform Evaluation Checklist

This unchecked source evaluates the complete `platform` subject owned by `html-css-platform`.
Each condition is defined once, and a complete evaluation keeps its evidence and verdict outside this source.

## Project

### HCPLAT-SC-PROJECT-01 — Normal case: direct HTML/CSS facts and owner boundaries

A standards or renderer question enters the HTML/CSS Platform tool. It passes when the question is a direct HTML/CSS fact, accessibility policy stays outside the lookup, and browser-wide facts route to `web-platform`; it fails when the answer assumes ownership it does not have.

#### Checklist

- [ ] HCPLAT-CK-PROJECT-01-01 — Every out-of-boundary question is routed to its named owner.
- [ ] HCPLAT-CK-PROJECT-01-02 — The inspected question concerns the listed direct HTML/CSS platform facts.
- [ ] HCPLAT-CK-PROJECT-01-03 — No general accessibility policy is set from this lookup.
- [ ] HCPLAT-CK-PROJECT-01-04 — The answer separates direct HTML/CSS facts from browser facts owned by `web-platform`.

## Structure

### HCPLAT-SC-STRUCTURE-01 — Edge case: earliest falsifying layer and standards authority

A conformance or rendering claim could diverge at source, parsing, matching, cascade, computation, layout, or pixels. It passes when the earliest falsifying layer and its owning HTML or CSS specification are named and parser recovery stays distinct from source conformance; it fails when evidence from one layer is used for another.

#### Checklist

- [ ] HCPLAT-CK-STRUCTURE-01-01 — Every claim is tested at the earliest layer that can falsify it.
- [ ] HCPLAT-CK-STRUCTURE-01-02 — Every observation is attributed to the layer that produced it: parsing and CSSOM for acceptance, matched rules for selector application, cascade evidence for the winner, computed values for property resolution, layout and overflow for geometry, and rendered output for integrated appearance.
- [ ] HCPLAT-CK-STRUCTURE-01-03 — Parser recovery is not treated as permission to keep nonconforming source.
- [ ] HCPLAT-CK-STRUCTURE-01-04 — Every answer names the layer it concerns: source bytes, parser-produced DOM, runtime behavior, or product outcome.
- [ ] HCPLAT-CK-STRUCTURE-01-05 — Every conformance answer cites its owning specification: WHATWG HTML for an HTML authoring question or the applicable CSS Working Group specification for a CSS question.

### HCPLAT-SC-STRUCTURE-02 — Edge case: ARIA authority and earliest renderer divergence

The question concerns allowed ARIA or a defect visible only after several renderer stages. It passes when ARIA in HTML supplies the authority and diagnosis identifies the first source-to-rendering divergence; it fails when a general accessibility source or the final symptom replaces the owning layer.

#### Checklist

- [ ] HCPLAT-CK-STRUCTURE-02-01 — Every allowed-ARIA answer cites ARIA in HTML rather than a general accessibility source.
- [ ] HCPLAT-CK-STRUCTURE-02-02 — Diagnosis identifies the earliest divergence from source and parsing through rendering.

## Performance

### HCPLAT-SC-PERFORMANCE-01 — Poor quality: stage-specific cost and resource-behavior evidence

A result makes a cost, resource-request, paint, or compositing claim. It passes when evidence matches the named stage and target while selection, cache, hints, retries, paint, and compositing remain bounded observations; it fails when one request or one declaration is reported as a universal guarantee.

#### Checklist

- [ ] HCPLAT-CK-PERFORMANCE-01-01 — Every cost claim is matched to evidence for the stage it names: matching, style, layout, paint, compositing, memory, or latency.
- [ ] HCPLAT-CK-PERFORMANCE-01-02 — Candidate selection, hints, cache, and retry semantics are not reduced to an exact-one-request rule.
- [ ] HCPLAT-CK-PERFORMANCE-01-03 — Paint and compositing remain target hypotheses unless direct evidence establishes the bounded claim.

## Aesthetics

### HCPLAT-SC-AESTHETICS-01 — Expected failure: observation-first, uncertainty-preserving diagnosis

Inspection produces observations, inferences, and unresolved uncertainty. It passes when observations are recorded first and each diagnosis states its evidence, narrow conclusion, and unknowns; it fails when a broad compatibility or conformance label hides missing observation.

#### Checklist

- [ ] HCPLAT-CK-AESTHETICS-01-01 — Observations are recorded before any inference drawn from them.
- [ ] HCPLAT-CK-AESTHETICS-01-02 — Every diagnosis names the evidence it rests on and the unknowns that remain.
- [ ] HCPLAT-CK-AESTHETICS-01-03 — Every answer is the narrowest one its evidence supports rather than a broad compatibility or conformance label.
- [ ] HCPLAT-CK-AESTHETICS-01-04 — Every remaining uncertainty is carried into the answer rather than replaced by a summary judgment.
- [ ] HCPLAT-CK-AESTHETICS-01-05 — Observations are recorded separately from the conclusions drawn from them.

## Usage

### HCPLAT-SC-USAGE-01 — Normal case: inspection identity, authority, and access limits

A Platform answer depends on a transformed or generated artifact and limited inspection access. It passes when target, document state, mode, applicable markup/CSS/DOM/CSSOM identity, transforms, authority, unavailable inputs, and observation limits are recorded; it fails when the answer cannot be repeated or claims unavailable evidence.

#### Checklist

- [ ] HCPLAT-CK-USAGE-01-01 — Every answer identifies the exact target, document state, mode, and applicable emitted artifact—markup, CSS, DOM, or CSSOM—from which it was derived.
- [ ] HCPLAT-CK-USAGE-01-02 — Every transform or source map that affects source identity is recorded with the answer.
- [ ] HCPLAT-CK-USAGE-01-03 — Every answer names its authority: an official specification owner for semantics, or the declared target it was observed on for behavior.
- [ ] HCPLAT-CK-USAGE-01-04 — Every conclusion depending on missing runtime access, a missing fixture, an unavailable mode, or an unresolved source identity is reported as unavailable.
- [ ] HCPLAT-CK-USAGE-01-05 — The access and observation limits of the inspection are stated with the result.

### HCPLAT-SC-USAGE-02 — Normal case: repeatable target-bounded compatibility evidence

Observed behavior may differ across browser versions or a pinned Electron renderer. It passes when artifact and target identity make the observation repeatable and every compatibility claim names tested versions or remains explicitly unresolved; it fails when one target is generalized or a missing test surface is concealed.

#### Checklist

- [ ] HCPLAT-CK-USAGE-02-01 — Every observed behavior binds to the exact emitted artifact and the target it was observed on.
- [ ] HCPLAT-CK-USAGE-02-02 — Every observation records enough identity to be repeated.
- [ ] HCPLAT-CK-USAGE-02-03 — Every compatibility answer names the browser versions or the pinned Electron release behind it.
- [ ] HCPLAT-CK-USAGE-02-04 — Every compatibility answer lacking an available target, version mapping, or test surface remains unresolved rather than becoming universal.
- [ ] HCPLAT-CK-USAGE-02-05 — The exact unavailable target, version mapping, or test surface is named with the unresolved answer.

### HCPLAT-SC-USAGE-03 — Normal case: accessibility output as a target observation

A target exposes semantic or accessibility output that may differ from authored source. It passes when that output is recorded as an observed target layer; it fails when source markup alone is reported as the target's accessibility result.

#### Checklist

- [ ] HCPLAT-CK-USAGE-03-01 — Accessibility output is treated as an observed target layer rather than a source-only fact.

## Consistency

### HCPLAT-SC-CONSISTENCY-01 — Rule violation: standards meaning versus verified target support

Specification status, support data, and direct target evidence are all available for a question. It passes when specifications locate meaning while declared browsers or the pinned renderer establish behavior and every version-specific claim is current; it fails when maturity or a support table substitutes for target proof.

#### Checklist

- [ ] HCPLAT-CK-CONSISTENCY-01-01 — Specification status is used to locate semantics rather than to infer support.
- [ ] HCPLAT-CK-CONSISTENCY-01-02 — Support is established on the declared browsers or the pinned Electron runtime by direct target evidence.
- [ ] HCPLAT-CK-CONSISTENCY-01-03 — No browser-specific step or version table is stated without current verification.
- [ ] HCPLAT-CK-CONSISTENCY-01-04 — Stable concepts and official owners are used wherever they can answer the question.
- [ ] HCPLAT-CK-CONSISTENCY-01-05 — Authoritative compatibility data is used to form a support hypothesis rather than to prove behavior in the declared targets.

### HCPLAT-SC-CONSISTENCY-02 — Rule violation: multi-target evidence, source conflicts, and parser context

A claim spans targets, sources disagree, or parser recovery depends on document or fragment context. It passes when each target is tested, conflicting sources retain identity and date, and authored source, parsed tree, and context element are recorded; it fails when differences are averaged into one answer.

#### Checklist

- [ ] HCPLAT-CK-CONSISTENCY-02-01 — Every target included in a claim is tested rather than inferred from another target.
- [ ] HCPLAT-CK-CONSISTENCY-02-02 — When sources disagree, each source's identity and date are preserved.
- [ ] HCPLAT-CK-CONSISTENCY-02-03 — When sources disagree, the narrowest supported answer or the unresolved difference is reported.
- [ ] HCPLAT-CK-CONSISTENCY-02-04 — Every recovery-sensitive question reports the authored source and the parsed tree when they differ.
- [ ] HCPLAT-CK-CONSISTENCY-02-05 — Every fragment answer names the context element that produced the tree.

### HCPLAT-SC-CONSISTENCY-03 — Rule violation: parser recovery and specification maturity

A browser recovers from invalid source or a specification has a particular maturity level. It passes when recovery is not called repair or permission and maturity remains separate from target support; it fails when either label broadens the conclusion.

#### Checklist

- [ ] HCPLAT-CK-CONSISTENCY-03-01 — Parser recovery is not reported as repairing or authorizing the source error.
- [ ] HCPLAT-CK-CONSISTENCY-03-02 — Specification maturity is recorded separately from declared-target support.

## Risk

### HCPLAT-SC-RISK-01 — Adversarial: source-to-runtime identity and reversible inspection

Inspection uses loaded bytes, generated output, source maps, configuration, or temporary runtime state. It passes when those identities remain distinct, the operation is read-only or reversible, and every changed state is restored; it fails when a conclusion depends on a state the inspection created.

#### Checklist

- [ ] HCPLAT-CK-RISK-01-01 — Loaded bytes are compared against the expected emitted bytes before any source-level conclusion is drawn.
- [ ] HCPLAT-CK-RISK-01-02 — Authored source, transform configuration, emitted bytes, source maps, and runtime observation are kept distinct in the record.
- [ ] HCPLAT-CK-RISK-01-03 — No conclusion depends on a state the inspection itself created.
- [ ] HCPLAT-CK-RISK-01-04 — Every inspection is read-only or reversible.
- [ ] HCPLAT-CK-RISK-01-05 — Every state an inspection changed is restored.

### HCPLAT-SC-RISK-02 — Adversarial: security, accessibility, and product claim boundaries

A caller tries to use conformance, parsing, or one observed accessibility outcome as security, privacy, Web Content Accessibility Guidelines, or product acceptance evidence. It passes when the answer stays limited to the tested outcome and conditions; it fails when a Platform proxy is promoted into another owner's verdict.

#### Checklist

- [ ] HCPLAT-CK-RISK-02-01 — No conformance or parsing result is offered as evidence of security, privacy, or product acceptance.
- [ ] HCPLAT-CK-RISK-02-02 — Every accessibility or product observation is limited to the tested outcome and its conditions rather than extended to WCAG 2.2 or product conformance.

## Overall

### HCPLAT-SC-OVERALL-01 — Expected failure: unknowns, earliest divergence, and evidence-bounded report

An observation is unavailable or working and failing cases diverge somewhere in the pipeline. It passes when the unknown remains open, comparison starts at the earliest divergent layer, and the report names target, evidence, owner, limitations, and only performed checks; it fails when inference fills the gap or overstates the observation.

#### Checklist

- [ ] HCPLAT-CK-OVERALL-01-01 — Every unavailable observation remains an open unknown rather than an inferred result.
- [ ] HCPLAT-CK-OVERALL-01-02 — The diagnosis compares the working and failing cases at their earliest divergent layer.
- [ ] HCPLAT-CK-OVERALL-01-03 — No platform observation is treated as proof of a property it does not establish.
- [ ] HCPLAT-CK-OVERALL-01-04 — The report states the layer or state identity, target, evidence, owner, and unknowns.
- [ ] HCPLAT-CK-OVERALL-01-05 — Only the diagnostics and checks actually performed are reported, each against WHATWG HTML or another named owner.
