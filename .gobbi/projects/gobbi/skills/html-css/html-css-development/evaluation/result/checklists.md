# HTML/CSS Development Result Evaluation Checklist

This unchecked source evaluates the complete `development-result` subject owned by `html-css-development`.
Each condition is defined once, and a complete evaluation keeps its evidence and verdict outside this source.

## Project

### HCDEV-SC-PROJECT-02 — Normal case: reproducible output identity and transition record

The selected Development mode has finished and its result is being handed off. It passes when emitted identity, reproducibility, interface transition, residual gaps, and recovery are recorded as applicable; it fails when a reviewer cannot identify or reproduce the returned state.

#### Checklist

- [ ] HCDEV-CK-PROJECT-02-01 — Emitted output identity is recorded.
- [ ] HCDEV-CK-PROJECT-02-02 — The assessment is read-only and reproducible.
- [ ] HCDEV-CK-PROJECT-02-03 — The result records the interface transition, residual gaps, and domain recovery.

## Structure

### HCDEV-SC-STRUCTURE-03 — Edge case: artifact provenance, variants, and public interfaces

Generated output, material variants, and public markup or styling interfaces changed together. It passes when provenance, regenerated identity, selected-case records, and one consumer-facing interface inventory agree; it fails when any emitted file, variant, or public name lacks an owner or origin.

#### Checklist

- [ ] HCDEV-CK-STRUCTURE-03-01 — The emitted artifact has exact provenance.
- [ ] HCDEV-CK-STRUCTURE-03-02 — Regenerated output has a new identity.
- [ ] HCDEV-CK-STRUCTURE-03-03 — The result records the material variant population and selected-case identities.
- [ ] HCDEV-CK-STRUCTURE-03-04 — The result contains one unified inventory of public markup and styling interfaces.

## Performance

### HCDEV-SC-PERFORMANCE-02 — Poor quality: required resource-bearing repeated content

The result contains resource-bearing elements or repeated or hidden subtrees. It passes when each is required by the outcome, content, behavior, or fallback; it fails when avoidable resource or subtree work survives merely because the page still functions.

#### Checklist

- [ ] HCDEV-CK-PERFORMANCE-02-01 — Every resource-bearing element and every repeated or hidden subtree is required by the outcome, content, behavior, or fallback.

## Aesthetics

### HCDEV-SC-AESTHETICS-02 — Expected failure: scoped and actionable review result

A protected review or change result contains findings, strengths, limitations, and possible improvements. It passes when the diff stays scoped and result categories remain separate and actionable; it fails when noise, mixed categories, or an optional suggestion obscures an invalid result.

#### Checklist

- [ ] HCDEV-CK-AESTHETICS-02-01 — The final diff stays scoped.
- [ ] HCDEV-CK-AESTHETICS-02-02 — Nonactionable items are absent from the result.
- [ ] HCDEV-CK-AESTHETICS-02-03 — Review result categories remain separated.
- [ ] HCDEV-CK-AESTHETICS-02-04 — An optional improvement appears only when the result is otherwise valid.

## Usage

### HCDEV-SC-USAGE-02 — Edge case: consumer safety, handoff, and repair routing

A public class, property, hook, or markup interface changes and consumers must continue or migrate. It passes when known consumers, discovery confidence, compatibility, handoff evidence, repair owners, and optional adoption choices are explicit; it fails when a removed interface leaves an unaccounted consumer.

#### Checklist

- [ ] HCDEV-CK-USAGE-02-01 — No consumer depends on a removed or renamed interface.
- [ ] HCDEV-CK-USAGE-02-02 — The handoff records outcome, targets, evidence, limitations, and next owners.
- [ ] HCDEV-CK-USAGE-02-03 — Each optional improvement states benefit, tradeoff, and adoption choice.
- [ ] HCDEV-CK-USAGE-02-04 — An identified repair is routed to its owner.
- [ ] HCDEV-CK-USAGE-02-05 — The result records each known consumer and the confidence of consumer discovery.

## Consistency

### HCDEV-SC-CONSISTENCY-02 — Rule violation: accepted identity, findings, and project defaults

The final result is compared with the accepted emitted identity and project presentation defaults. It passes when evidence, findings, conventions, and justified departures all refer to that same identity; it fails when stale evidence or a local preference is used to accept the result.

#### Checklist

- [ ] HCDEV-CK-CONSISTENCY-02-01 — Evidence and completion refer to the accepted identity.
- [ ] HCDEV-CK-CONSISTENCY-02-02 — Each review problem carries its evidence, impact, and repair boundary.
- [ ] HCDEV-CK-CONSISTENCY-02-03 — A presentation choice satisfies the applicable convention Rules.
- [ ] HCDEV-CK-CONSISTENCY-02-04 — A project default is applied or its departure is evidenced.

## Risk

### HCDEV-SC-RISK-02 — Adversarial: byte-preserving protected review

A Protected review has completed after using temporary inspection or runtime state. It passes when source, output, configuration, fixtures, baselines, and lasting runtime state match the pre-review identity and every repair remains unmade; it fails when the review leaves any mutation or depends on state it created.

#### Checklist

- [ ] HCDEV-CK-RISK-02-01 — A repair identified by protected review remains unmade.
- [ ] HCDEV-CK-RISK-02-02 — Source, output, configuration, fixtures, and baselines remain unchanged after review.
- [ ] HCDEV-CK-RISK-02-03 — Runtime and inspection state are restored after review.
- [ ] HCDEV-CK-RISK-02-04 — No conclusion depends on state created by the review run.

## Overall

### HCDEV-SC-OVERALL-02 — Expected failure: evidence-bounded completion

A completion claim is made for the accepted canonical source and emitted identity. It passes when the intended source change is present, every required check passes, limitations remain explicit, and the claim stays within current evidence; it fails when an unresolved failure, decision, or unavailable check is hidden.

#### Checklist

- [ ] HCDEV-CK-OVERALL-02-01 — The accepted emitted identity has no unresolved failure or decision.
- [ ] HCDEV-CK-OVERALL-02-02 — The authorized canonical source contains the intended change.
- [ ] HCDEV-CK-OVERALL-02-03 — Every unresolved limitation is explicit.
- [ ] HCDEV-CK-OVERALL-02-04 — Unavailable evidence is recorded as a limitation.
- [ ] HCDEV-CK-OVERALL-02-05 — A completion claim stays within its evidence ceiling.
- [ ] HCDEV-CK-OVERALL-02-06 — Every required source, regeneration, variant, consumer, and focused-test check for the accepted emitted identity passes.
