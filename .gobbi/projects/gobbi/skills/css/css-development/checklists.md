# CSS Development Evaluation Checklist

This reusable unchecked source evaluates one CSS development run: a change-mode run that produced verified
CSS at its canonical source, or a review-mode run that produced a read-only assessment. It is governed by the
[`css`](../SKILL.md) domain and [`css-development`](SKILL.md) operation, with
[`css-conventions`](../css-conventions/SKILL.md) as the choice boundary and
[`css-platform`](../css-platform/SKILL.md) as the runtime-evidence manual. The source commit that contains
this file identifies the checklist version. Its stable owner prefix is `CSSDEV`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### CSSDEV-SC-PROJECT-01 — Normal case: the mode is selected and the work is bounded first

The selected mode fixes the authority for the whole run, so it must be recorded before anything is inspected
or edited, and the mode's frame must be complete. The scenario fails when the mode is inferred after the fact,
when the frame is partial, or when a request that supports both modes is resolved without asking the caller.

#### Checklist

- [ ] CSSDEV-CK-PROJECT-01-01 — The selected mode is recorded before any inspection or edit.
- [ ] CSSDEV-CK-PROJECT-01-02 — The frame required by the selected mode is complete: rendering outcome, canonical source, affected owners, and non-goals in change mode; source and transformed-output identity, targets, states, requested concerns, and limits in review mode.
- [ ] CSSDEV-CK-PROJECT-01-03 — The caller was asked to choose wherever the request supported both modes.

### CSSDEV-SC-PROJECT-02 — Expected failure: an outward-owner decision controls the result

A product, document, state, security, generator, or Electron decision that CSS does not own determines the
rendering outcome, or a material target, fixture, or access path is missing. The expected outcome is an exact
stop that names the gap and its owner; producing a result that assumes the decision is the failure.

#### Checklist

- [ ] CSSDEV-CK-PROJECT-02-01 — The run stops while an unresolved outward-owner decision, missing material target, missing fixture, or missing access path controls the result.
- [ ] CSSDEV-CK-PROJECT-02-02 — The stop names the exact missing decision, input, or access path and the owner who holds it.
- [ ] CSSDEV-CK-PROJECT-02-03 — No product outcome is decided on the outward owner's behalf.

### CSSDEV-SC-PROJECT-03 — Edge case: a review run reaches a repair it must not make

Review mode ends at its report step when it finds something that needs changing. The expected outcome routes
the repair to its owner and leaves it unmade until a new authorized change-mode run frames and evidences it.
Continuing the same run into the repair is the failure, even when the repair is correct.

#### Checklist

- [ ] CSSDEV-CK-PROJECT-03-01 — The review-mode run ends at its report step once a repair is identified.
- [ ] CSSDEV-CK-PROJECT-03-02 — Every identified repair is carried out only under a newly authorized change-mode run with its own frame and evidence.

## Structure

### CSSDEV-SC-STRUCTURE-01 — Normal case: change at the canonical source, grown in increments

A change-mode run edits the authorized canonical source and grows the result one observable behavior at a
time. The scenario fails when an edit lands in emitted output, when a generated-CSS defect is patched
downstream, or when an increment is large enough to hide an earlier failure.

#### Checklist

- [ ] CSSDEV-CK-STRUCTURE-01-01 — Every edit lands in the authorized canonical CSS source.
- [ ] CSSDEV-CK-STRUCTURE-01-02 — A generated-CSS defect is repaired at its source or routed to the generator's owner.
- [ ] CSSDEV-CK-STRUCTURE-01-03 — The CSS newly emitted after a generated-CSS repair is inspected.
- [ ] CSSDEV-CK-STRUCTURE-01-04 — The first increment is the minimal cascade, selector, custom-property, and layout skeleton the framed outcome needs.
- [ ] CSSDEV-CK-STRUCTURE-01-05 — Each increment is small enough to verify and repair without hiding an earlier failure.
- [ ] CSSDEV-CK-STRUCTURE-01-06 — A failing increment is repaired before another increment is added.

## Performance

### CSSDEV-SC-PERFORMANCE-01 — Normal case: a performance-affecting change is measured on both sides

The run changes something whose cost can move: matching, style, layout, paint, compositing, or memory. The
expected outcome compares representative conditions before and after with the required guards, and treats
missing evidence as a stated limitation. An unmeasured performance conclusion is the failure.

#### Checklist

- [ ] CSSDEV-CK-PERFORMANCE-01-01 — Performance is measured before and after the change under representative conditions.
- [ ] CSSDEV-CK-PERFORMANCE-01-02 — Every measurement keeps behavior and accessibility guards in place.
- [ ] CSSDEV-CK-PERFORMANCE-01-03 — Missing material performance evidence is recorded as a limitation or a stop condition.

## Aesthetics

### CSSDEV-SC-AESTHETICS-01 — Poor quality: the result is correct but not reviewable

The change or assessment reaches the right outcome while remaining hard to review: unrelated churn in the
diff, claims without the observation behind them, or a finding list that repeats itself. The expected outcome
is a scoped diff and a record another person can follow item by item.

#### Checklist

- [ ] CSSDEV-CK-AESTHETICS-01-01 — The final diff is scoped to the framed outcome, with no unrelated declaration, selector, or file change.
- [ ] CSSDEV-CK-AESTHETICS-01-02 — Every recorded claim names the exact source, target, state, and observation behind it.
- [ ] CSSDEV-CK-AESTHETICS-01-03 — Every appearance-only, duplicate, speculative, and non-actionable item is removed from the assessment.

## Usage

### CSSDEV-SC-USAGE-01 — Normal case: the handoff lets the caller act

The consumer of this operation receives either a verified change or a read-only assessment and must be able to
act on it without reconstructing the run. The scenario fails when the record omits what was exercised, or when
an assessment blurs problems, optional improvements, strengths, and limitations together.

#### Checklist

- [ ] CSSDEV-CK-USAGE-01-01 — The handoff records the implemented outcome or assessment, targets and modes exercised, evidence, limitations, unresolved outward-owner decisions, and recovery state.
- [ ] CSSDEV-CK-USAGE-01-02 — Problems, optional improvements, strengths, and limitations are separated in a review-mode assessment.
- [ ] CSSDEV-CK-USAGE-01-03 — Every review-mode problem carries evidence, impact, confidence, an owner, and the verification a repair would need.
- [ ] CSSDEV-CK-USAGE-01-04 — Every optional improvement states its benefit, trade-off, and condition for adoption.
- [ ] CSSDEV-CK-USAGE-01-05 — Every optional improvement is recorded only where the current result remains valid.

### CSSDEV-SC-USAGE-02 — Expected failure: the review subject or its access is insufficient

The question, source and output identity, targets, fixtures, or inspection permission are not sufficient to
support the requested assessment. The expected outcome reports the missing input or records the unavailable
evidence as a limitation; substituting an assumption and continuing is the failure.

#### Checklist

- [ ] CSSDEV-CK-USAGE-02-01 — An insufficient review subject or access path is reported as a missing input rather than worked around.
- [ ] CSSDEV-CK-USAGE-02-02 — Every unavailable evidence source is recorded as a limitation rather than replaced by an assumption.

## Consistency

### CSSDEV-SC-CONSISTENCY-01 — Normal case: every choice agrees with `css-conventions` in both modes

Both modes apply the same choice boundary and the same project defaults, and route the same foreign concerns
outward. The scenario fails when a choice breaks a `css-conventions` Rule, silently departs from a default, or
answers a question this operation does not own.

#### Checklist

- [ ] CSSDEV-CK-CONSISTENCY-01-01 — Every presentation choice in the run satisfies the `css-conventions` Rules.
- [ ] CSSDEV-CK-CONSISTENCY-01-02 — Every `css-conventions` project default is applied, or its departure is evidenced.
- [ ] CSSDEV-CK-CONSISTENCY-01-03 — Every document, product, state, security, generator, and Electron process question the run raised is routed to its owner rather than answered here.

### CSSDEV-SC-CONSISTENCY-02 — Rule violation: a claim outruns the layer that produced it

Source, parsing, cascade, computed values, layout, modes, rendering, and performance answer different
questions. The expected outcome keeps each conclusion inside the layer that can support it. Appearance, a lint
run, or a specification label offered as proof of a stronger claim is the failure.

#### Checklist

- [ ] CSSDEV-CK-CONSISTENCY-02-01 — No cascade, order, focus, layout, support, performance, or acceptance claim rests on appearance, lint output, or a specification label alone.
- [ ] CSSDEV-CK-CONSISTENCY-02-02 — Product acceptance is never claimed from CSS evidence.
- [ ] CSSDEV-CK-CONSISTENCY-02-03 — Every claim's evidence was gathered on the exact source, target, and state the claim names.

## Risk

### CSSDEV-SC-RISK-01 — Normal case: the run stays inside its granted authority

Each mode grants a different authority, and neither grants acceptance, verdict, or publication authority. The
expected outcome keeps every action inside the mode's grant and leaves terminal decisions to their owners. Any
action beyond the grant fails the scenario even when its result is correct.

#### Checklist

- [ ] CSSDEV-CK-RISK-01-01 — Every write in the run lands inside the authority the selected mode grants.
- [ ] CSSDEV-CK-RISK-01-02 — No formal evaluation verdict, product acceptance, scope broadening, or Git publication is performed by this operation.
- [ ] CSSDEV-CK-RISK-01-03 — A request for a seven-perspective report and verdict is routed to the general evaluation skill.

### CSSDEV-SC-RISK-02 — Adversarial: a review-mode run edits the subject

This operation holds `Write` and `Edit` because change mode needs them, so no tool surface prevents a
review-mode run from editing. Rule 2 is the only remaining guard, and a small repair made mid-review, a
toggled fixture, a regenerated baseline, or a saved runtime override can all be presented afterwards as a
read-only run. The expected outcome leaves the subject exactly as it was found; any residue that the run
itself created, or an assessment that depends on it, is the failure.

#### Checklist

- [ ] CSSDEV-CK-RISK-02-01 — No source, generated output, configuration, fixture, or baseline differs after the review-mode run.
- [ ] CSSDEV-CK-RISK-02-02 — Every runtime or inspection state the review-mode run touched is restored, leaving no residual declaration, override, or toggled fixture.
- [ ] CSSDEV-CK-RISK-02-03 — No conclusion in the assessment depends on a state the run itself created.
- [ ] CSSDEV-CK-RISK-02-04 — Every repair the review identified was routed to its owner.
- [ ] CSSDEV-CK-RISK-02-05 — Every repair the review identified was left unmade within this run.
- Also applies: CSSDEV-CK-PROJECT-03-02 (a repair requires a newly authorized change-mode run).

## Overall

### CSSDEV-SC-OVERALL-01 — Normal case: completion matches the selected mode's contract

Completion means different things in the two modes, and neither means more than the evidence supports. The
scenario fails when a change-mode run completes with a failing or unrun required check, when a review-mode
result cannot be reproduced from its record, or when the completion claim is broader than its evidence.

#### Checklist

- [ ] CSSDEV-CK-OVERALL-01-01 — In change mode, the authorized source contains the intended change and every required check passes.
- [ ] CSSDEV-CK-OVERALL-01-02 — In review mode, the assessment is read-only and reproducible from the recorded evidence.
- [ ] CSSDEV-CK-OVERALL-01-03 — The completion claim is no broader than the evidence that supports it.

### CSSDEV-SC-OVERALL-02 — Poor quality: a repair that hides the failure instead of removing it

A failing check passes again after the run adjusts the place the failure appeared. The expected outcome
reproduces the failure in the smallest fixture, repairs the first wrong cause, and reruns the failing check
with every affected downstream check. A green result over an untraced cause is the failure.

#### Checklist

- [ ] CSSDEV-CK-OVERALL-02-01 — Every failure is reproduced in the smallest fixture before its repair.
- [ ] CSSDEV-CK-OVERALL-02-02 — Every repair changes the first wrong source, assumption, transform, or owner decision rather than the place the failure appeared.
- [ ] CSSDEV-CK-OVERALL-02-03 — The failing check and every affected downstream check are rerun after the repair.
