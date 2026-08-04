# Web Interface Evaluation Checklist

This reusable unchecked source evaluates one browser feature's design judgment against the identity-authority,
evidence-threshold, concept-exploration, expression-ordering, and motion-intent obligations this skill owns. It
is governed by the [`web`](../SKILL.md) domain and [`web-interface`](SKILL.md) preferences, with
[`web-frontend`](../web-frontend/SKILL.md) as the operation that applies this choice space,
[`web-interaction`](../web-interaction/SKILL.md) owning event, pointer, keyboard, focus, and widget mechanics,
and [`html-css-semantics`](../../html-css/html-css-semantics/SKILL.md), [`html-css-conventions`](../../html-css/html-css-conventions/SKILL.md),
[`html-css-motion`](../../html-css/html-css-motion/SKILL.md), and [`react-design`](../../react/react-design/SKILL.md) owning the
mechanics these judgments call for. The source commit that contains this file identifies the checklist version.
Its stable owner prefix is `WEBINTF`.

The evidence Rule this source checks is a risk threshold, not an unconditional gate. Rows below test the
threshold as the Rule states it: an evidence class is named for every claim, and new representative-user
evidence is required only for a material choice that matches one of the Rule's named triggers.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBINTF-SC-PROJECT-01 — Normal case: identity is resolved through the authority chain

A browser design decision needs a governing identity, and several candidate sources exist. The expected
outcome selects the highest available source in the chain, records it beside the decisions it constrains, and
routes every mechanism question outward; an identity assembled from whichever source was nearest is the
failure.

#### Checklist

- [ ] WEBINTF-CK-PROJECT-01-01 — The identity source is the highest available in the chain: explicit `DESIGN.md`, brand, product, or design-system material, then the live product, system, and tokens, then a user-confirmed run-scoped brief.
- [ ] WEBINTF-CK-PROJECT-01-02 — The selected identity source is recorded beside the decisions it constrains.
- [ ] WEBINTF-CK-PROJECT-01-03 — Every mechanism question the design raises is routed to its named owner: element, name, state, and accessibility meaning to `html-css-semantics`; the emitted-presentation floor and token conventions to `html-css-conventions`; declarative motion mechanics to `html-css-motion`; event, pointer, keyboard, focus, and widget-pattern mechanics to `web-interaction`; component boundaries and state ownership to `react-design`; and the ordered browser operation to `web-frontend`.

### WEBINTF-SC-PROJECT-02 — Rule violation: a project-wide design authority is created here

No governing material exists, so the work writes or prescribes a project-wide `DESIGN.md` to fill the gap. The
expected outcome falls back to the live product or a user-confirmed run-scoped brief; creating the project's
design authority from inside a design decision is the failure.

#### Checklist

- [ ] WEBINTF-CK-PROJECT-02-01 — No project-wide `DESIGN.md` is created or prescribed by this work.
- [ ] WEBINTF-CK-PROJECT-02-02 — A run-scoped brief used as the identity source is confirmed by the user rather than assumed.

## Structure

### WEBINTF-SC-STRUCTURE-01 — Normal case: two materially different concepts precede the choice

An interface concept is about to be selected. The expected outcome compares at least two concepts that differ
in a consequential property; two treatments of one model presented as alternatives is the failure.

#### Checklist

- [ ] WEBINTF-CK-STRUCTURE-01-01 — At least two interface concepts were compared before one was selected.
- [ ] WEBINTF-CK-STRUCTURE-01-02 — The compared concepts differ in hierarchy, action model, information flow, interaction strategy, or state communication.
- [ ] WEBINTF-CK-STRUCTURE-01-03 — No pair of concepts differs only in color, type, spacing, icon style, or wording.

### WEBINTF-SC-STRUCTURE-02 — Edge case: a recorded constraint leaves one viable concept

A platform, contractual, or resource constraint rules out every alternative model, so only one concept can be
explored. The expected outcome records the real constraints and the evidence behind the exception; a
single-concept decision described as constrained without naming the constraint is the failure.

#### Checklist

- [ ] WEBINTF-CK-STRUCTURE-02-01 — The single-concept exception records the real constraints that left one viable model.
- [ ] WEBINTF-CK-STRUCTURE-02-02 — The single-concept exception records the evidence behind those constraints.

### WEBINTF-SC-STRUCTURE-03 — Rule violation: expression decided over unresolved structure

Typography, color, density, and imagery are being settled while a state, a failure path, a recovery route, or
an accessibility obligation is still open. The expected outcome defers expression until those are settled;
expression that makes an unfinished structure look finished is the failure.

#### Checklist

- [ ] WEBINTF-CK-STRUCTURE-03-01 — No detailed expression is decided while structure, behavior, content, feedback, recovery, adaptation, or accessibility remains unresolved.
- [ ] WEBINTF-CK-STRUCTURE-03-02 — No expressive choice conceals missing structure or inaccessible behavior.

## Performance

Not applicable: this skill decides which identity governs, what evidence a claim may rest on, which concepts
are compared, when expression is settled, and whether a motion is warranted. It owns no mechanics, so it
produces nothing whose latency, throughput, or resource cost can be measured. Motion duration, easing, and
motion-source defaults belong to [`html-css-motion`](../../html-css/html-css-motion/SKILL.md); presentation
source defaults belong to [`html-css-conventions`](../../html-css/html-css-conventions/SKILL.md). Direct
HTML/CSS target observations belong to [`html-css-platform`](../../html-css/html-css-platform/SKILL.md), focused
comparisons and result claims belong to [`html-css-testing`](../../html-css/html-css-testing/SKILL.md), and
application-level performance suites belong to [`web-testing`](../web-testing/SKILL.md).

## Aesthetics

### WEBINTF-SC-AESTHETICS-01 — Normal case: each expressive choice earns its place

Structure is settled, so typography, color, density, spacing, shape, and imagery are decided. The expected
outcome is that each choice makes hierarchy, state, or affordance easier to read; a choice defended only by
taste or house style is the failure.

#### Checklist

- [ ] WEBINTF-CK-AESTHETICS-01-01 — Every expressive choice improves hierarchy, state recognition, affordance, trust, or identity fit.
- [ ] WEBINTF-CK-AESTHETICS-01-02 — Every departure from expression that carries meaning names the recorded identity obligation behind it.
- [ ] WEBINTF-CK-AESTHETICS-01-03 — No expressive choice falls below the `html-css-conventions` emitted-presentation floor.

### WEBINTF-SC-AESTHETICS-02 — Poor quality: motion added with no state change to explain

A transition is added because the surface felt static, and nothing about location, state, or causality is
clearer afterwards. The expected outcome is motion only where it makes a change legible, with what it must
communicate stated; decorative motion accepted because it is subtle is the failure.

#### Checklist

- [ ] WEBINTF-CK-AESTHETICS-02-01 — Every transition makes a change of state, location, or causality legible.
- [ ] WEBINTF-CK-AESTHETICS-02-02 — Every warranted motion states what it must communicate.
- [ ] WEBINTF-CK-AESTHETICS-02-03 — No motion duration, easing, or safety floor is decided here rather than by `html-css-motion` and `html-css-conventions`.

## Usage

### WEBINTF-SC-USAGE-01 — Normal case: a claim about people rests on evidence from those people

A design claim states what people can perceive, operate, complete, or recover from, and some evidence supports
it. The expected outcome treats standards, expert review, prior research, analytics, and a project owner's
familiarity as framing and requires evidence from representative people for the claim itself; framing accepted
as support is the failure.

#### Checklist

- [ ] WEBINTF-CK-USAGE-01-01 — No claim about what people can perceive, operate, complete, or recover from is supported by a standard, expert review, prior research, analytics, or a project owner's familiarity alone.
- [ ] WEBINTF-CK-USAGE-01-02 — Stakeholder preference and design convention do not outrank observed use of the design by representative people.

### WEBINTF-SC-USAGE-02 — Rule violation: identity is used to justify an exclusionary choice

A brand, tone, or design-system constraint is offered as the reason a surface excludes or harms some of the
people who must use it. The expected outcome keeps identity inside what it may constrain; an exclusion
defended by identity is the failure.

#### Checklist

- [ ] WEBINTF-CK-USAGE-02-01 — No identity constraint is accepted as a reason for an avoidable exclusion or harm.
- Also applies: WEBINTF-CK-RISK-01-02 (an exclusionary choice is a named evidence trigger).

## Consistency

### WEBINTF-SC-CONSISTENCY-01 — Normal case: the live product is the identity source

The shipped product already teaches its users a set of patterns, and a new surface must sit beside them. The
expected outcome prefers what the product teaches over a described intention; a new surface built to an
intention the product never expressed is the failure.

#### Checklist

- [ ] WEBINTF-CK-CONSISTENCY-01-01 — What the shipped product already teaches its users is preferred over a described intention.
- Also applies: WEBINTF-CK-PROJECT-01-02 (identity source recorded beside the decisions it constrains).

### WEBINTF-SC-CONSISTENCY-02 — Edge case: the governing material is current and the product is stale

Design material was updated and the live product has not caught up, so the two disagree. The expected outcome
departs from the live product and follows the current material; following the shipped product because it is
the running artifact is the failure.

#### Checklist

- [ ] WEBINTF-CK-CONSISTENCY-02-01 — The departure to the current governing material records that the live product is the stale artifact.

## Risk

### WEBINTF-SC-RISK-01 — Normal case: the evidence threshold matches what the choice risks

A set of design claims is being accepted, and the Rule requires new representative-user evidence for some of
them and not for others. The expected outcome names a class for every claim, obtains new representative-user
evidence for each choice matching a named trigger, and lets a choice matching no trigger proceed on its named
class; both a triggered choice accepted without new evidence and an evidence demand the Rule does not make are
failures.

#### Checklist

- [ ] WEBINTF-CK-RISK-01-01 — Every design claim names the evidence class it rests on.
- [ ] WEBINTF-CK-RISK-01-02 — Every material choice that is novel, uncertain, exclusionary, consequential, security- or compatibility-sensitive, hard to reverse, or carries material risk of harm is accepted only after new representative-user evidence.
- [ ] WEBINTF-CK-RISK-01-03 — A material choice matching none of those triggers is accepted on its named evidence class, without new representative-user evidence being required of it.
- [ ] WEBINTF-CK-RISK-01-04 — The evidence class is selected before the choice is decided.
- [ ] WEBINTF-CK-RISK-01-05 — The selected evidence class is one that could still falsify the choice at hand.
- [ ] WEBINTF-CK-RISK-01-06 — The evidence class rises as the consequence of the choice being wrong grows.

### WEBINTF-SC-RISK-02 — Expected failure: a triggered choice cannot get the evidence it needs

A choice matches one of the Rule's triggers, but the representative-user evidence cannot be collected in this
run. The expected outcome leaves the choice unaccepted and returns it with the missing evidence named;
committing it on framing evidence because collection was impractical is the failure.

#### Checklist

- [ ] WEBINTF-CK-RISK-02-01 — A triggered choice whose required representative-user evidence is unavailable is left unaccepted rather than committed on framing evidence.
- [ ] WEBINTF-CK-RISK-02-02 — The missing evidence, the choice it blocks, and the owner it is returned to are named.

### WEBINTF-SC-RISK-03 — Adversarial: the threshold is satisfied after the fact

A triggered choice was already locked and evidence was gathered afterwards to support it, or a single-concept
exception was written after the concept was chosen. The expected outcome rejects both; compliance shaped to
survive review rather than to change a decision is the failure.

#### Checklist

- [ ] WEBINTF-CK-RISK-03-01 — No evidence collected after a choice was locked is counted toward the evidence Rule for that choice.
- [ ] WEBINTF-CK-RISK-03-02 — No single-concept exception is recorded after the concept was selected as a substitute for comparing concepts.
- Also applies: WEBINTF-CK-STRUCTURE-01-03 (a visual variant is not a second concept).

## Overall

### WEBINTF-SC-OVERALL-01 — Normal case: identity, evidence, concept, expression, and motion decided together

A complete design judgment answers which identity governs, what evidence each claim rests on, which concepts
were compared, when expression was settled, and what each warranted motion must communicate. The scenario
fails when one of those five is unanswered, or when the design claims more than it settled.

#### Checklist

- [ ] WEBINTF-CK-OVERALL-01-01 — The design record answers identity authority, evidence class, concept comparison, expression ordering, and motion intent.
- [ ] WEBINTF-CK-OVERALL-01-02 — The design's claim is no broader than the judgments it actually settles.
- Also applies: WEBINTF-CK-RISK-01-03 (a choice matching no trigger needs no new evidence).
