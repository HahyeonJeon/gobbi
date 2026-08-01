# CSS Platform Evaluation Checklist

This reusable unchecked source evaluates one browser or Electron-renderer CSS inspection, lookup, or
diagnosis produced under this manual. It is governed by the [`css`](../SKILL.md) domain and
[`css-platform`](SKILL.md) manual, with [`css-conventions`](../css-conventions/SKILL.md) owning validity and
project-choice judgment and [`css-development`](../css-development/SKILL.md) owning changes and read-only
assessment. The source commit that contains this file identifies the checklist version. Its stable owner
prefix is `CSSPLAT`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### CSSPLAT-SC-PROJECT-01 — Normal case: the question stays on the named platform

This manual answers questions about browser and Electron-renderer CSS processing and rendering. The scenario
fails when the answer decides an authoring, product, security, or Electron process question instead of routing
it to the owner who holds it.

#### Checklist

- [ ] CSSPLAT-CK-PROJECT-01-01 — The inspected question concerns browser or Electron-renderer CSS processing or rendering.
- [ ] CSSPLAT-CK-PROJECT-01-02 — Every authoring, product, security, and process question the inspection raises is routed to its owner: validity and project-choice judgment to `css-conventions`, changes and read-only assessment to `css-development`, document meaning and source-order repair to HTML, and transform mechanics to the transform's owner.

## Structure

### CSSPLAT-SC-STRUCTURE-01 — Normal case: evidence comes from the layer that owns the behavior

Parsing, cascade, computed values, layout, painting, and compositing answer different questions, so each claim
belongs to the earliest layer that can test it. The scenario fails when an observation is attributed to a
layer that did not produce it, or when a later layer is used where an earlier one would have settled it.

#### Checklist

- [ ] CSSPLAT-CK-STRUCTURE-01-01 — Every claim is tested at the earliest layer that can falsify it.
- [ ] CSSPLAT-CK-STRUCTURE-01-02 — Every observation is attributed to the layer that produced it: parsing and CSSOM for acceptance, matched rules for selector application, cascade evidence for the winner, computed values for property resolution, layout and overflow for geometry, and rendered output for integrated appearance.
- Also applies: CSSPLAT-CK-OVERALL-01-01 (no observation proves a property it does not establish).

## Performance

### CSSPLAT-SC-PERFORMANCE-01 — Normal case: a cost claim matched to its evidence

Matching, style, layout, paint, compositing, memory, and latency are separate costs with separate evidence.
The expected outcome compares representative conditions before and after with behavior and accessibility
guards in place. A cost claim measured under conditions the product does not meet is the failure.

#### Checklist

- [ ] CSSPLAT-CK-PERFORMANCE-01-01 — Every cost claim is matched to evidence for the stage it names: matching, style, layout, paint, compositing, memory, or latency.
- [ ] CSSPLAT-CK-PERFORMANCE-01-02 — Representative conditions are compared before and after.
- [ ] CSSPLAT-CK-PERFORMANCE-01-03 — Behavior and accessibility guards are in place during the comparison.

## Aesthetics

### CSSPLAT-SC-AESTHETICS-01 — Poor quality: observation and inference are mixed in the record

The result is correct but the record does not separate what was seen from what was concluded, so a reader
cannot tell which part is evidence. The expected outcome records observations first and names the evidence and
remaining unknowns behind each diagnosis.

#### Checklist

- [ ] CSSPLAT-CK-AESTHETICS-01-01 — Observations are recorded before any inference drawn from them.
- [ ] CSSPLAT-CK-AESTHETICS-01-02 — Every diagnosis names the evidence it rests on and the unknowns that remain.

## Usage

### CSSPLAT-SC-USAGE-01 — Normal case: an answer the caller can reproduce

Runtime evidence means nothing without the document, output, target, mode, and state it came from. The
scenario fails when an answer cannot be re-observed because its inputs are unstated, or because a transform or
source map between authored source and loaded bytes was not recorded.

#### Checklist

- [ ] CSSPLAT-CK-USAGE-01-01 — Every answer identifies the exact target, document state, mode, and emitted CSS it came from.
- [ ] CSSPLAT-CK-USAGE-01-02 — Every transform or source map that affects source identity is recorded with the answer.
- [ ] CSSPLAT-CK-USAGE-01-03 — Every answer names its authority: an official specification owner for semantics, or the declared target it was observed on for behavior.

### CSSPLAT-SC-USAGE-02 — Expected failure: required access, fixture, mode, or identity is missing

Runtime access, a fixture, a mode, or the source identity is unavailable, so the corresponding conclusion
cannot be reached. The expected outcome reports that conclusion as unavailable and states the limit; an
answer produced anyway from adjacent evidence is the failure.

#### Checklist

- [ ] CSSPLAT-CK-USAGE-02-01 — Every conclusion depending on missing runtime access, a missing fixture, an unavailable mode, or an unresolved source identity is reported as unavailable.
- [ ] CSSPLAT-CK-USAGE-02-02 — The access and observation limits of the inspection are stated with the result.

## Consistency

### CSSPLAT-SC-CONSISTENCY-01 — Rule violation: specification status is presented as target support

Specification status and target behavior are separate facts, and only the declared browsers or the pinned
Electron runtime decide support. The expected outcome uses the current-work index to locate semantics and
direct target observation to establish support; inferring one from the other is the failure.

#### Checklist

- [ ] CSSPLAT-CK-CONSISTENCY-01-01 — Specification status is used to locate semantics rather than to infer support.
- [ ] CSSPLAT-CK-CONSISTENCY-01-02 — Support is established on the declared browsers or the pinned Electron runtime by direct target evidence.

### CSSPLAT-SC-CONSISTENCY-02 — Poor quality: mutable browser detail taught as stable knowledge

The answer is usable today but rests on a developer-tools sequence or a version table that changes without
notice. The expected outcome prefers stable concepts and official owners, and verifies any browser-specific
detail at the time it is given.

#### Checklist

- [ ] CSSPLAT-CK-CONSISTENCY-02-01 — No browser-specific step or version table is stated without current verification.
- [ ] CSSPLAT-CK-CONSISTENCY-02-02 — Stable concepts and official owners are used wherever they can answer the question.

## Risk

### CSSPLAT-SC-RISK-01 — Normal case: inspection leaves the subject unchanged

This manual observes; it does not edit CSS or decide acceptance. The expected outcome keeps every inspection
read-only or reversible and restores anything it altered. A conclusion that only holds because the inspection
itself changed the document is the failure.

#### Checklist

- [ ] CSSPLAT-CK-RISK-01-01 — Every inspection is read-only or reversible.
- [ ] CSSPLAT-CK-RISK-01-02 — Every state an inspection changed is restored.
- [ ] CSSPLAT-CK-RISK-01-03 — No conclusion depends on a document state the inspection itself created.

### CSSPLAT-SC-RISK-02 — Edge case: the inspected document differs from the authored source

A transform, a cache, or a stale build makes the loaded bytes something other than what the author wrote, so
a source-level conclusion can be drawn from a document that is not the subject. The expected outcome compares
loaded and expected bytes first and routes transform mechanics outward.

#### Checklist

- [ ] CSSPLAT-CK-RISK-02-01 — Loaded bytes are compared against the expected emitted bytes before any source-level conclusion is drawn.
- [ ] CSSPLAT-CK-RISK-02-02 — Authored source, transform configuration, emitted bytes, source maps, and runtime observation are kept distinct in the record.

## Overall

### CSSPLAT-SC-OVERALL-01 — Adversarial: a plausible observation stands in for the missing one

A screenshot, a developer-tools panel, a feature query, or a passing lint run can be offered as the evidence
a claim needs, producing an answer that looks fully supported. The expected outcome keeps each observation
inside what it establishes and leaves the missing part unknown; a substitute accepted as the evidence is the
failure.

#### Checklist

- [ ] CSSPLAT-CK-OVERALL-01-01 — No observation is treated as proof of a property it does not establish: source order of a cascade winner, CSSOM presence of a selector match, CSSOM presence of a cascade winner, a computed value of layout, an uncropped view of absent overflow, a feature query of semantics, a feature query of speed, a specification status of target support, and a rendered screenshot of accessibility.
- [ ] CSSPLAT-CK-OVERALL-01-02 — Every unavailable observation remains an open unknown rather than an inferred result.

### CSSPLAT-SC-OVERALL-02 — Normal case: a diagnosis another person can reproduce

A diagnosis compares a working and a failing case and reports what it found and what it does not know. The
scenario fails when the comparison starts at the surface instead of the earliest divergence, or when the
report omits the target, state, evidence, owner, or unknowns needed to repeat it.

#### Checklist

- [ ] CSSPLAT-CK-OVERALL-02-01 — The diagnosis compares the working and failing cases at their earliest divergent layer.
- [ ] CSSPLAT-CK-OVERALL-02-02 — The report states the target, state, evidence, owner, and unknowns.
