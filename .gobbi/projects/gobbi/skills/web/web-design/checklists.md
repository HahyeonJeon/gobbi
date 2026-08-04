# Web Design Evaluation Checklist

This reusable unchecked source evaluates one web product's design lifecycle against the problem, identity,
evidence, alternatives, acceptance, validation, learning, replacement, and retirement obligations this skill
owns. It is governed by the [`web`](../SKILL.md) domain and [`web-design`](SKILL.md) preferences, with
[`web-frontend`](../web-frontend/SKILL.md) as the operation that applies this choice space,
[`web-interaction`](../web-interaction/SKILL.md) owning event, pointer, keyboard, focus, and widget mechanics,
and [`html-semantics`](../../html/html-semantics/SKILL.md), [`css-conventions`](../../css/css-conventions/SKILL.md),
[`css-motion`](../../css/css-motion/SKILL.md), and [`react-design`](../../react/react-design/SKILL.md) owning the
mechanics these judgments call for. The source commit that contains this file identifies the checklist version.
Its stable owner prefix is `WEBDES`.

The evidence Rule this source checks is a risk threshold, not an unconditional gate. Rows below test the
threshold as the Rule states it: an evidence class is named for every claim, and new representative-user
evidence is required only for a material choice that matches one of the Rule's named triggers.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBDES-SC-PROJECT-01 — Normal case: identity is resolved through the authority chain

A browser design decision needs a governing identity, and several candidate sources exist. The expected
outcome selects the highest available source in the chain, records it beside the decisions it constrains, and
routes every mechanism question outward; an identity assembled from whichever source was nearest is the
failure.

#### Checklist

- [ ] WEBDES-CK-PROJECT-01-01 — The identity source is the highest available in the chain: explicit `DESIGN.md`, brand, product, or design-system material, then the live product, system, and tokens, then a user-confirmed run-scoped brief.
- [ ] WEBDES-CK-PROJECT-01-02 — The selected identity source is recorded beside the decisions it constrains.
- [ ] WEBDES-CK-PROJECT-01-03 — Every mechanism question the design raises is routed to its named owner: element, name, state, and accessibility meaning to `html-semantics`; the emitted-presentation floor and token conventions to `css-conventions`; declarative motion mechanics to `css-motion`; event, pointer, keyboard, focus, and widget-pattern mechanics to `web-interaction`; component boundaries and state ownership to `react-design`; and the ordered browser operation to `web-frontend`.

### WEBDES-SC-PROJECT-02 — Rule violation: a project-wide design authority is created here

No governing material exists, so the work writes or prescribes a project-wide `DESIGN.md` to fill the gap. The
expected outcome falls back to the live product or a user-confirmed run-scoped brief; creating the project's
design authority from inside a design decision is the failure.

#### Checklist

- [ ] WEBDES-CK-PROJECT-02-01 — No project-wide `DESIGN.md` is created or prescribed by this work.
- [ ] WEBDES-CK-PROJECT-02-02 — A run-scoped brief used as the identity source is confirmed by the user rather than assumed.

### WEBDES-SC-PROJECT-03 — Normal case: the current design problem and learning path are named

A design record is opened or resumed. The expected outcome names its lifecycle stage, accepted problem,
affected people, and the live-learning questions that can change it; a design record detached from the
problem or later evidence is the failure.

#### Checklist

- [ ] WEBDES-CK-PROJECT-03-01 — The design record names the current lifecycle stage, accepted problem, and affected people.
- [ ] WEBDES-CK-PROJECT-03-02 — Every live-learning question remains traceable to the design decision, evidence class, and reopen condition it can change.

## Structure

### WEBDES-SC-STRUCTURE-01 — Normal case: two materially different concepts precede the choice

An interface concept is about to be selected. The expected outcome compares at least two concepts that differ
in a consequential property; two treatments of one model presented as alternatives is the failure.

#### Checklist

- [ ] WEBDES-CK-STRUCTURE-01-01 — At least two interface concepts were compared before one was selected.
- [ ] WEBDES-CK-STRUCTURE-01-02 — The compared concepts differ in hierarchy, action model, information flow, interaction strategy, or state communication.
- [ ] WEBDES-CK-STRUCTURE-01-03 — No pair of concepts differs only in color, type, spacing, icon style, or wording.

### WEBDES-SC-STRUCTURE-02 — Edge case: a recorded constraint leaves one viable concept

A platform, contractual, or resource constraint rules out every alternative model, so only one concept can be
explored. The expected outcome records the real constraints and the evidence behind the exception; a
single-concept decision described as constrained without naming the constraint is the failure.

#### Checklist

- [ ] WEBDES-CK-STRUCTURE-02-01 — The single-concept exception records the real constraints that left one viable model.
- [ ] WEBDES-CK-STRUCTURE-02-02 — The single-concept exception records the evidence behind those constraints.

### WEBDES-SC-STRUCTURE-03 — Rule violation: visual design decided over unresolved structure

Typography, color, density, and imagery are being settled while a state, a failure path, a recovery route, or
an accessibility obligation is still open. The expected outcome defers visual design until those are settled;
visual design that makes an unfinished structure look finished is the failure.

#### Checklist

- [ ] WEBDES-CK-STRUCTURE-03-01 — No detailed visual design is decided while structure, behavior, content, feedback, recovery, adaptation, or accessibility remains unresolved.
- [ ] WEBDES-CK-STRUCTURE-03-02 — No visual choice conceals missing structure or inaccessible behavior.

### WEBDES-SC-STRUCTURE-04 — Normal case: the design lifecycle is a revisitable map

The design is handed forward after acceptance, but later evidence may invalidate an earlier decision. The
expected outcome preserves every lifecycle stage and its return path; a one-way sequence with no owned return
is the failure.

#### Checklist

- [ ] WEBDES-CK-STRUCTURE-04-01 — The design map includes discovery, definition, alternatives, validation, delivery, learning, iteration, replacement, and retirement as revisitable stages.
- [ ] WEBDES-CK-STRUCTURE-04-02 — Every design-stage transition names its material input, success output, failure return, and next handoff.

## Performance

### WEBDES-SC-PERFORMANCE-01 — Poor quality: design evidence costs exclude affected people

Validation effort is either far larger than the decision warrants or too small to address its consequence,
and representative participation lacks required accommodation. The expected outcome makes evidence effort
proportionate and participation accessible; waste or exclusion presented as rigor is the failure.

#### Checklist

- [ ] WEBDES-CK-PERFORMANCE-01-01 — The evidence and validation effort is proportionate to the consequence, uncertainty, and reversibility of the decision.
- [ ] WEBDES-CK-PERFORMANCE-01-02 — The participation plan provides the required accessibility and accommodation support for representative use.

## Aesthetics

### WEBDES-SC-AESTHETICS-01 — Normal case: each visual choice earns its place

Structure is settled, so typography, color, density, spacing, shape, and imagery are decided. The expected
outcome is that each choice makes hierarchy, state, or affordance easier to read; a choice defended only by
taste or house style is the failure.

#### Checklist

- [ ] WEBDES-CK-AESTHETICS-01-01 — Every visual choice improves hierarchy, state recognition, affordance, trust, or identity fit.
- [ ] WEBDES-CK-AESTHETICS-01-02 — Every departure from visual design that carries meaning names the recorded identity obligation behind it.
- [ ] WEBDES-CK-AESTHETICS-01-03 — No visual choice falls below the `css-conventions` emitted-presentation floor.

### WEBDES-SC-AESTHETICS-02 — Poor quality: motion added with no state change to explain

A transition is added because the UI felt static, and nothing about location, state, or causality is
clearer afterwards. The expected outcome is motion only where it makes a change legible, with what it must
communicate stated; decorative motion accepted because it is subtle is the failure.

#### Checklist

- [ ] WEBDES-CK-AESTHETICS-02-01 — Every transition makes a change of state, location, or causality legible.
- [ ] WEBDES-CK-AESTHETICS-02-02 — Every warranted motion states what it must communicate.
- [ ] WEBDES-CK-AESTHETICS-02-03 — No motion duration, easing, or safety floor is decided here rather than by `css-motion` and `css-conventions`.

## Usage

### WEBDES-SC-USAGE-01 — Normal case: a claim about people rests on evidence from those people

A design claim states what people can perceive, operate, complete, or recover from, and some evidence supports
it. The expected outcome treats standards, expert review, prior research, analytics, and a project owner's
familiarity as framing and requires evidence from representative people for the claim itself; framing accepted
as support is the failure.

#### Checklist

- [ ] WEBDES-CK-USAGE-01-01 — No claim about what people can perceive, operate, complete, or recover from is supported by a standard, expert review, prior research, analytics, or a project owner's familiarity alone.
- [ ] WEBDES-CK-USAGE-01-02 — Stakeholder preference and design convention do not outrank observed use of the design by representative people.

### WEBDES-SC-USAGE-02 — Rule violation: identity is used to justify an exclusionary choice

A brand, tone, or design-system constraint is offered as the reason a UI excludes or harms some of the
people who must use it. The expected outcome keeps identity inside what it may constrain; an exclusion
defended by identity is the failure.

#### Checklist

- [ ] WEBDES-CK-USAGE-02-01 — No identity constraint is accepted as a reason for an avoidable exclusion or harm.
- Also applies: WEBDES-CK-RISK-01-02 (an exclusionary choice is a named evidence trigger).

### WEBDES-SC-USAGE-03 — Normal case: post-release evidence changes the design disposition

Live evidence arrives after delivery. The expected outcome compares it with the accepted signals and harm
guardrails, records one disposition, and returns any change to its earliest design stage; evidence recorded
without changing or retaining the decision is the failure.

#### Checklist

- [ ] WEBDES-CK-USAGE-03-01 — Post-release evidence is evaluated against the accepted success signals and harm guardrails.
- [ ] WEBDES-CK-USAGE-03-02 — Live learning records exactly one current disposition: retain, refine, replace, retire, or reopen.
- [ ] WEBDES-CK-USAGE-03-03 — A refine, replace, retire, or reopen disposition names the earliest design stage it returns to.

## Consistency

### WEBDES-SC-CONSISTENCY-01 — Normal case: the live product is the identity source

The shipped product already teaches its users a set of patterns, and a new browser interface must sit beside them. The
expected outcome prefers what the product teaches over a described intention; a new browser interface built to an
intention the product never expressed is the failure.

#### Checklist

- [ ] WEBDES-CK-CONSISTENCY-01-01 — What the shipped product already teaches its users is preferred over a described intention.
- Also applies: WEBDES-CK-PROJECT-01-02 (identity source recorded beside the decisions it constrains).

### WEBDES-SC-CONSISTENCY-02 — Edge case: the governing material is current and the product is stale

Design material was updated and the live product has not caught up, so the two disagree. The expected outcome
departs from the live product and follows the current material; following the shipped product because it is
the running artifact is the failure.

#### Checklist

- [ ] WEBDES-CK-CONSISTENCY-02-01 — The departure to the current governing material records that the live product is the stale artifact.

### WEBDES-SC-CONSISTENCY-03 — Expected failure: design and delivered evidence disagree

The accepted design, implemented result, validation claim, or live-learning record names a different decision
or version. The expected outcome returns the discrepancy to its earliest owner; silently reconciling unlike
artifacts is the failure.

#### Checklist

- [ ] WEBDES-CK-CONSISTENCY-03-01 — The accepted design, implemented result, validation claim, and live-learning record identify the same design decision and version.
- [ ] WEBDES-CK-CONSISTENCY-03-02 — A discrepancy among design, implementation, validation, and live learning returns to its earliest owner rather than being reconciled by assumption.

## Risk

### WEBDES-SC-RISK-01 — Normal case: the evidence threshold matches what the choice risks

A set of design claims is being accepted, and the Rule requires new representative-user evidence for some of
them and not for others. The expected outcome names a class for every claim, obtains new representative-user
evidence for each choice matching a named trigger, and lets a choice matching no trigger proceed on its named
class; both a triggered choice accepted without new evidence and an evidence demand the Rule does not make are
failures.

#### Checklist

- [ ] WEBDES-CK-RISK-01-01 — Every design claim names the evidence class it rests on.
- [ ] WEBDES-CK-RISK-01-02 — Every material choice that is novel, uncertain, exclusionary, consequential, security- or compatibility-sensitive, hard to reverse, or carries material risk of harm is accepted only after new representative-user evidence.
- [ ] WEBDES-CK-RISK-01-03 — A material choice matching none of those triggers is accepted on its named evidence class, without new representative-user evidence being required of it.
- [ ] WEBDES-CK-RISK-01-04 — The evidence class is selected before the choice is decided.
- [ ] WEBDES-CK-RISK-01-05 — The selected evidence class is one that could still falsify the choice at hand.
- [ ] WEBDES-CK-RISK-01-06 — The evidence class rises as the consequence of the choice being wrong grows.

### WEBDES-SC-RISK-02 — Expected failure: a triggered choice cannot get the evidence it needs

A choice matches one of the Rule's triggers, but the representative-user evidence cannot be collected in this
run. The expected outcome leaves the choice unaccepted and returns it with the missing evidence named;
committing it on framing evidence because collection was impractical is the failure.

#### Checklist

- [ ] WEBDES-CK-RISK-02-01 — A triggered choice whose required representative-user evidence is unavailable is left unaccepted rather than committed on framing evidence.
- [ ] WEBDES-CK-RISK-02-02 — The missing evidence, the choice it blocks, and the owner it is returned to are named.

### WEBDES-SC-RISK-03 — Adversarial: the threshold is satisfied after the fact

A triggered choice was already locked and evidence was gathered afterwards to support it, or a single-concept
exception was written after the concept was chosen. The expected outcome rejects both; compliance shaped to
survive review rather than to change a decision is the failure.

#### Checklist

- [ ] WEBDES-CK-RISK-03-01 — No evidence collected after a choice was locked is counted toward the evidence Rule for that choice.
- [ ] WEBDES-CK-RISK-03-02 — No single-concept exception is recorded after the concept was selected as a substitute for comparing concepts.
- Also applies: WEBDES-CK-STRUCTURE-01-03 (a visual variant is not a second concept).

### WEBDES-SC-RISK-04 — Expected failure: replacement or retirement lacks transition evidence

A design is being replaced or retired without evidence for the people affected, their migration, or the
support they need. The expected outcome leaves the disposition unaccepted; removal presented as a design
decision without transition evidence is the failure.

#### Checklist

- [ ] WEBDES-CK-RISK-04-01 — Replacement or retirement is accepted only after affected-user, migration, and support evidence is available.

## Overall

### WEBDES-SC-OVERALL-01 — Normal case: identity, evidence, concept, visual design, and motion decided together

A complete design judgment answers which identity governs, what evidence each claim rests on, which concepts
were compared, when visual design was settled, and what each warranted motion must communicate. The scenario
fails when one of those five is unanswered, or when the design claims more than it settled.

#### Checklist

- [ ] WEBDES-CK-OVERALL-01-01 — The design record answers identity authority, evidence class, concept comparison, visual-design ordering, and motion intent.
- [ ] WEBDES-CK-OVERALL-01-02 — The design's claim is no broader than the judgments it actually settles.
- Also applies: WEBDES-CK-RISK-01-03 (a choice matching no trigger needs no new evidence).

### WEBDES-SC-OVERALL-02 — Normal case: the design record can be resumed or closed exactly

A cold reader must determine what the design currently accepts, what its evidence cannot prove, what can
reopen it, and whether it has a successor or terminal state. An ambiguous current or closing state is the
failure.

#### Checklist

- [ ] WEBDES-CK-OVERALL-02-01 — The design record names the current decision, accurate limits of the evidence, reopen condition, successor, and terminal state.
