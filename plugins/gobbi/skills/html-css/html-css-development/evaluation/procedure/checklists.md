# HTML/CSS Development Procedure Evaluation Checklist

This unchecked source evaluates the complete `development-procedure` subject owned by `html-css-development`.
Each condition is defined once, and a complete evaluation keeps its evidence and verdict outside this source.

## Project

### HCDEV-SC-PROJECT-01 — Normal case: authorized change or protected-review frame

Before any HTML/CSS source is inspected or changed, the caller selects Change or maintenance, Protected review, or Migration. It passes when the requested outcome, authority, source boundary, external owners, and every field required by the selected mode are explicit; it fails when work begins with a missing mode frame or mutation authority.

#### Checklist

- [ ] HCDEV-CK-PROJECT-01-01 — Requested outcome is explicit.
- [ ] HCDEV-CK-PROJECT-01-02 — The authorized source and every decision owner outside the HTML/CSS family are explicit.
- [ ] HCDEV-CK-PROJECT-01-03 — The change-mode frame is complete.
- [ ] HCDEV-CK-PROJECT-01-04 — The protected-review frame is complete.
- [ ] HCDEV-CK-PROJECT-01-05 — The Migration-mode frame records the public interface, known consumers and discovery confidence, transition authority, compatibility plan, and coherent recovery state before mutation.

## Structure

### HCDEV-SC-STRUCTURE-01 — Edge case: root-cause repair in canonical HTML/CSS sources

A defect appears in emitted markup, generated CSS, or a rendered symptom rather than at its cause. It passes when the repair reaches the first wrong authorized source, assumption, transform, or owner decision while preserving source boundaries; it fails when generated output or the manifestation site is patched directly.

#### Checklist

- [ ] HCDEV-CK-STRUCTURE-01-01 — The repair changes the earliest authorized source or generator cause.
- [ ] HCDEV-CK-STRUCTURE-01-02 — Every repair changes the first wrong source, assumption, transform, or owner decision rather than the place the failure appeared.
- [ ] HCDEV-CK-STRUCTURE-01-03 — HTML content stays inside its authorized source boundary.
- [ ] HCDEV-CK-STRUCTURE-01-04 — A CSS edit lands in the authorized canonical source.
- [ ] HCDEV-CK-STRUCTURE-01-05 — Generated output is not the direct repair target.

### HCDEV-SC-STRUCTURE-02 — Edge case: generated CSS repair ownership

Generated CSS is wrong and the emitting source or generator may be outside the current write boundary. It passes when the responsible source is repaired or the defect is routed to its owner; it fails when emitted CSS is edited as the durable fix.

#### Checklist

- [ ] HCDEV-CK-STRUCTURE-02-01 — A generated-CSS defect is repaired at its source or routed there.

## Performance

### HCDEV-SC-PERFORMANCE-01 — Poor quality: small verifiable implementation increments

A change is large enough that one-pass implementation would hide the first regression. It passes when a minimal skeleton and each later increment are small, verified, and repaired before growth continues; it fails when work advances on top of a failing increment.

#### Checklist

- [ ] HCDEV-CK-PERFORMANCE-01-01 — The first change increment is a minimal skeleton.
- [ ] HCDEV-CK-PERFORMANCE-01-02 — Each increment stays small enough to verify and repair.
- [ ] HCDEV-CK-PERFORMANCE-01-03 — A failing increment is repaired before the next increment.

## Aesthetics

### HCDEV-SC-AESTHETICS-01 — Expected failure: missing prerequisites and safe stop

A required input, decision, owner, source, fixture, or access path is missing. It passes when the first missing prerequisite and its owner are named and acceptance remains open; it fails when partial work is formatted as a completed artifact.

#### Checklist

- [ ] HCDEV-CK-AESTHETICS-01-01 — An HTML stop identifies the first missing prerequisite.
- [ ] HCDEV-CK-AESTHETICS-01-02 — A CSS stop names the exact missing prerequisite and owner.
- [ ] HCDEV-CK-AESTHETICS-01-03 — Artifact acceptance remains open while an input or owner is unknown.
- [ ] HCDEV-CK-AESTHETICS-01-04 — The run stops while an unresolved prerequisite controls the result.

## Usage

### HCDEV-SC-USAGE-01 — Normal case: routing to product, platform, and security owners

The repair encounters a product, platform, security, or release decision outside HTML/CSS ownership. It passes when that question is routed and recovery changes only authorized sources or owners; it fails when Development decides the external outcome or repairs across the boundary.

#### Checklist

- [ ] HCDEV-CK-USAGE-01-01 — No product outcome is decided for the product owner.
- [ ] HCDEV-CK-USAGE-01-02 — Foreign questions are routed to their owners.
- [ ] HCDEV-CK-USAGE-01-03 — Recovery stays within the source and owner boundary.
- [ ] HCDEV-CK-USAGE-01-04 — The responsible source, generator, or owner is identified before repair.
- [ ] HCDEV-CK-USAGE-01-05 — Missing repair authority produces an exact stop.

## Consistency

### HCDEV-SC-CONSISTENCY-01 — Rule violation: mode authority and change authorization

The request could be a mutation, a protected review, or a public-interface migration. It passes when one mode and its authority are recorded and a review-discovered repair starts a new authorized run; it fails when modes are combined or a local choice expands write authority.

#### Checklist

- [ ] HCDEV-CK-CONSISTENCY-01-01 — A security or trust decision stays with its named owner.
- [ ] HCDEV-CK-CONSISTENCY-01-02 — A write stays within the selected mode's authority.
- [ ] HCDEV-CK-CONSISTENCY-01-03 — The selected mode is recorded before inspection or editing.
- [ ] HCDEV-CK-CONSISTENCY-01-04 — The caller chooses when more than one mode fits.
- [ ] HCDEV-CK-CONSISTENCY-01-05 — A repair after review requires a new authorized change-mode run.

## Risk

### HCDEV-SC-RISK-01 — Adversarial: protected review without mutation or verdict

A caller requests findings without authorizing any source, fixture, baseline, configuration, or lasting runtime change. It passes when Protected review ends with a report and routes verdicts or repairs to their owners; it fails when the review mutates the subject or performs its own fix.

#### Checklist

- [ ] HCDEV-CK-RISK-01-01 — A review-mode run ends at its report after identifying a repair.
- [ ] HCDEV-CK-RISK-01-02 — Development does not perform evaluation, product or scope decisions, or Git publication.
- [ ] HCDEV-CK-RISK-01-03 — A verdict request routes to evaluation.

## Overall

### HCDEV-SC-OVERALL-01 — Expected failure: partial migrations and superseded evidence

Generation or migration stops partway, or a changed source, transform, target, or interface makes older evidence stale. It passes when the last coherent state is restored or repaired fully forward and dependent evidence is marked replaced; it fails when consumers see a mixed state or stale evidence remains current.

#### Checklist

- [ ] HCDEV-CK-OVERALL-01-01 — An insufficient review subject or access is reported as missing.
- [ ] HCDEV-CK-OVERALL-01-02 — Partial generation or migration is contained in the last coherent domain state or repaired wholly forward.
- [ ] HCDEV-CK-OVERALL-01-03 — Changed source, transform, target, or interface invalidates and supersedes dependent evidence.
