# HTML Platform Evaluation Checklist

This reusable unchecked source evaluates one HTML conformance, parsing, target-support, or evidence lookup
produced under this manual. It is governed by the [`html`](../SKILL.md) domain and
[`html-platform`](SKILL.md) manual, with [`html-development`](../html-development/SKILL.md) owning the
artifact outcome and [`html-semantics`](../html-semantics/SKILL.md) owning element and accessibility choices.
The source commit that contains this file identifies the checklist version. Its stable owner prefix is
`HTMLPLAT`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### HTMLPLAT-SC-PROJECT-01 — Normal case: the question stays on the standard and its targets

This manual answers what the Living Standard requires, what the parser produces, how a declared target
behaves, and what a piece of evidence establishes. The scenario fails when the answer authors an artifact,
sets accessibility policy, or decides an element choice instead of routing it to the owner who holds it.

#### Checklist

- [ ] HTMLPLAT-CK-PROJECT-01-01 — The inspected question concerns HTML authoring conformance, element content models, parser behavior, declared-target realization, or evidence meaning.
- [ ] HTMLPLAT-CK-PROJECT-01-02 — Every artifact-outcome question is routed to `html-development` and every element and accessibility choice to `html-semantics`.
- [ ] HTMLPLAT-CK-PROJECT-01-03 — No general accessibility policy is set from this lookup.

## Structure

### HTMLPLAT-SC-STRUCTURE-01 — Normal case: the answer names its layer and its owning section

Source bytes, the parsed DOM, runtime behavior, and product outcomes are distinct subjects, and each
conformance statement belongs to a section of the standard. The scenario fails when a layer is unnamed or a
requirement is asserted without the definition that carries it.

#### Checklist

- [ ] HTMLPLAT-CK-STRUCTURE-01-01 — Every answer names the layer it concerns: source bytes, parser-produced DOM, runtime behavior, or product outcome.
- [ ] HTMLPLAT-CK-STRUCTURE-01-02 — Every conformance answer cites the owning WHATWG definition for the element, permitted contents and contexts, ancestors, attributes, or authoring requirement it decides.
- [ ] HTMLPLAT-CK-STRUCTURE-01-03 — Every allowed-ARIA answer cites ARIA in HTML rather than a general accessibility source.

## Performance

Not applicable: this manual answers conformance, parsing, target-realization, and evidence-meaning questions
and states no latency, capacity, resource, or recurring-cost obligation of its own; the resource cost of
emitted markup is owned by `html-development` and evaluated by its checklist.

## Aesthetics

### HTMLPLAT-SC-AESTHETICS-01 — Poor quality: a broad label replaces the narrow answer

The lookup reaches a usable conclusion but presents it as a general support or conformance label, so the
reader cannot tell what was actually established. The expected outcome gives the narrowest supported answer
and carries the remaining uncertainty into it rather than resolving it by summary.

#### Checklist

- [ ] HTMLPLAT-CK-AESTHETICS-01-01 — Every answer is the narrowest one its evidence supports rather than a broad compatibility or conformance label.
- [ ] HTMLPLAT-CK-AESTHETICS-01-02 — Every remaining uncertainty is carried into the answer rather than replaced by a summary judgment.
- [ ] HTMLPLAT-CK-AESTHETICS-01-03 — Observations are recorded separately from the conclusions drawn from them.

## Usage

### HTMLPLAT-SC-USAGE-01 — Normal case: an answer the caller can reproduce

An observation means nothing without the artifact and target it came from. The scenario fails when a behavior
is reported without the exact emitted bytes, browser versions, or pinned Electron release behind it, or when
the record cannot support a repeat of the observation.

#### Checklist

- [ ] HTMLPLAT-CK-USAGE-01-01 — Every observed behavior binds to the exact emitted artifact and the target it was observed on.
- [ ] HTMLPLAT-CK-USAGE-01-02 — Every observation records enough identity to be repeated.
- [ ] HTMLPLAT-CK-USAGE-01-03 — Every compatibility answer names the browser versions or the pinned Electron release behind it.

### HTMLPLAT-SC-USAGE-02 — Expected failure: a target, version mapping, or test surface is unavailable

One of the claimed targets cannot be reached, its version mapping is unknown, or no test surface exists. The
expected outcome leaves the compatibility answer unresolved and names what was missing; an answer promoted to
a universal claim because the remaining targets passed is the observable failure.

#### Checklist

- [ ] HTMLPLAT-CK-USAGE-02-01 — Every compatibility answer lacking an available target, version mapping, or test surface remains unresolved rather than becoming universal.
- [ ] HTMLPLAT-CK-USAGE-02-02 — The exact unavailable target, version mapping, or test surface is named with the unresolved answer.

## Consistency

### HTMLPLAT-SC-CONSISTENCY-01 — Rule violation: specification status presented as target support

A specification section or a support table is used to conclude how the declared browsers or the pinned
Electron renderer behave. The manual requires target evidence for that claim. The expected outcome uses the
standard to locate semantics and the target to establish behavior; inferring one from the other is the
failure.

#### Checklist

- [ ] HTMLPLAT-CK-CONSISTENCY-01-01 — Specification status and support tables are used to locate semantics rather than to prove behavior in the declared targets.
- [ ] HTMLPLAT-CK-CONSISTENCY-01-02 — Every target included in a claim is tested rather than inferred from another target.
- [ ] HTMLPLAT-CK-CONSISTENCY-01-03 — When sources disagree, each source's identity and date are preserved and the narrowest supported answer or the unresolved difference is reported.

### HTMLPLAT-SC-CONSISTENCY-02 — Edge case: the parsed tree differs from the authored source

Tables, forms, formatting elements, templates, nested interaction, and generated fragments can parse into a
DOM the source does not show, and a fragment's tree depends on its context element. The expected outcome
reports both layers and treats recovery as a description, not a repair.

#### Checklist

- [ ] HTMLPLAT-CK-CONSISTENCY-02-01 — Every recovery-sensitive question reports the authored source and the parsed tree when they differ.
- [ ] HTMLPLAT-CK-CONSISTENCY-02-02 — Every fragment answer names the context element that produced the tree.
- [ ] HTMLPLAT-CK-CONSISTENCY-02-03 — Parser recovery is not reported as repairing or authorizing the source error.

## Risk

### HTMLPLAT-SC-RISK-01 — Normal case: the lookup leaves its subject unchanged

This manual observes documents and targets; it does not author or accept them. The expected outcome keeps
every inspection read-only or reversible and restores anything it altered. A conclusion that holds only
because the inspection changed the document or the target state is the failure.

#### Checklist

- [ ] HTMLPLAT-CK-RISK-01-01 — Every inspection of a document or target is read-only or reversible, and any state it changed is restored.
- [ ] HTMLPLAT-CK-RISK-01-02 — No conclusion depends on a document or target state the inspection itself created.

### HTMLPLAT-SC-RISK-02 — Adversarial: a conformance answer stretched into a safety claim

A clean conformance result is requested as the evidence that a page is secure, private, or accessible enough
to ship, and the lookup is the last check before release. The expected outcome refuses the transfer and keeps
each claim with its owner; a conformance answer accepted as clearance is the failure.

#### Checklist

- [ ] HTMLPLAT-CK-RISK-02-01 — No conformance or parsing result is offered as evidence of security, privacy, or product acceptance.
- [ ] HTMLPLAT-CK-RISK-02-02 — Every accessibility or product observation is limited to the tested outcome and its conditions rather than extended to WCAG 2.2 or product conformance.

## Overall

### HTMLPLAT-SC-OVERALL-01 — Adversarial: a substitute observation accepted as the missing evidence

A silent validator, a source reading, a parsed tree, or one passing target can each be offered as the
evidence the question actually needs. The expected outcome keeps every observation inside what it establishes
and reports only the checks performed; a substitute accepted as the answer is the failure.

#### Checklist

- [ ] HTMLPLAT-CK-OVERALL-01-01 — No observation is treated as proof of a property it does not establish: validator silence of semantic intent, validator silence of runtime behavior, source inspection of the parsed tree, a parsed tree of complete native behavior, one target observation of another target, and a specification status of target support.
- [ ] HTMLPLAT-CK-OVERALL-01-02 — Only the diagnostics and checks actually performed are reported, each against WHATWG HTML or another named owner.

### HTMLPLAT-SC-OVERALL-02 — Normal case: a result another person can act on

A finished lookup states what was asked, what layer answered it, which evidence supports it, and what remains
unknown. The scenario fails when the report omits the layer, the target, the evidence, the owner, or the
unknowns needed to use the answer safely.

#### Checklist

- [ ] HTMLPLAT-CK-OVERALL-02-01 — The report states the layer, the target, the evidence, the owner, and the unknowns.
- Also applies: HTMLPLAT-CK-PROJECT-01-02 (every routed question names the owner it went to).
