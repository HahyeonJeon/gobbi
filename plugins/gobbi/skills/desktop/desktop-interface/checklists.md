# Desktop Interface Evaluation Checklist

This reusable unchecked source evaluates one installed desktop application's design judgment against the
identity-authority, evidence-threshold, concept-exploration, expression-ordering, modality-coverage, and
success-measure obligations this skill owns. It is governed by the [`desktop`](../SKILL.md) domain and
[`desktop-interface`](SKILL.md) preferences, with [`desktop-delivery`](../desktop-delivery/SKILL.md) as the
operation that coordinates them, [`desktop-contract`](../desktop-contract/SKILL.md) as the owner of the
observable installed-platform contract, and the renderer's interaction, presentation, and motion owners —
including [`web-interaction`](../../web/web-interaction/SKILL.md) and
[`css-motion`](../../css/css-motion/SKILL.md) — as the owners of the mechanics these judgments call for. The
source commit that contains this file identifies the checklist version. Its stable owner prefix is `DTINTF`.

The evidence Rule this source checks is a risk threshold, not an unconditional gate. Rows below test the
threshold as the Rule states it: an evidence class is named for every claim, and new representative-user
evidence is required only for a choice that matches one of the Rule's named triggers.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### DTINTF-SC-PROJECT-01 — Normal case: identity is resolved through the authority chain

A design decision needs a governing identity, and several candidate sources exist. The expected outcome
selects the highest available source in the chain and records it beside the decisions it constrains; an
identity assembled from whichever source was nearest is the failure.

#### Checklist

- [ ] DTINTF-CK-PROJECT-01-01 — The identity source is the highest available in the chain: explicit `DESIGN.md`, brand, product, or design-system material, then the live product, system, and tokens, then a user-confirmed run-scoped brief.
- [ ] DTINTF-CK-PROJECT-01-02 — The selected identity source is recorded beside the decisions it constrains.
- [ ] DTINTF-CK-PROJECT-01-03 — No identity constraint excuses avoidable exclusion or harm.
- [ ] DTINTF-CK-PROJECT-01-04 — Every mechanism question the design raises is routed to its named owner: renderer event, pointer, keyboard, focus, and widget patterns to `web-interaction`; declarative motion mechanics to `css-motion`; installed-platform behavior to `desktop-contract`; and Electron security boundaries and ownership defaults to `electron-design`.

### DTINTF-SC-PROJECT-02 — Rule violation: a project-wide design authority is created here

No governing material exists, so the work writes or prescribes a project-wide `DESIGN.md` to fill the gap.
The expected outcome falls back to the live product or a user-confirmed run-scoped brief; creating the
project's design authority from inside a design decision is the failure.

#### Checklist

- [ ] DTINTF-CK-PROJECT-02-01 — No project-wide `DESIGN.md` is created or prescribed by this work.
- [ ] DTINTF-CK-PROJECT-02-02 — A run-scoped brief used as the identity source is confirmed by the user rather than assumed.

## Structure

### DTINTF-SC-STRUCTURE-01 — Normal case: two materially different concepts precede the choice

An application concept is about to be selected. The expected outcome compares at least two concepts that
differ in a consequential property; two treatments of one model presented as alternatives is the failure.

#### Checklist

- [ ] DTINTF-CK-STRUCTURE-01-01 — At least two application concepts were compared before one was selected.
- [ ] DTINTF-CK-STRUCTURE-01-02 — The compared concepts differ in hierarchy, action model, information flow, interaction strategy, or state communication.
- [ ] DTINTF-CK-STRUCTURE-01-03 — No pair of concepts differs only in color, type, spacing, icon style, or wording.

### DTINTF-SC-STRUCTURE-02 — Edge case: a recorded constraint leaves one viable concept

A platform, contractual, or resource constraint rules out every alternative model, so only one concept can be
built. The expected outcome records the real constraints and the evidence behind the exception; a
single-concept decision described as constrained without naming the constraint is the failure.

#### Checklist

- [ ] DTINTF-CK-STRUCTURE-02-01 — The single-concept exception records the real constraints that left one viable model.
- [ ] DTINTF-CK-STRUCTURE-02-02 — The single-concept exception records the evidence behind those constraints.

### DTINTF-SC-STRUCTURE-03 — Rule violation: expression decided over unresolved structure

Typography, color, density, and imagery are being settled while a state, a failure path, a recovery route, or
an accessibility obligation is still open. The expected outcome defers expression until those are settled;
expression that makes an unfinished structure look finished is the failure.

#### Checklist

- [ ] DTINTF-CK-STRUCTURE-03-01 — No detailed expression is decided while structure, behavior, content, feedback, recovery, adaptation, or accessibility remains unresolved.
- [ ] DTINTF-CK-STRUCTURE-03-02 — No expressive choice conceals missing structure or inaccessible behavior.

## Performance

Not applicable: this skill decides whether an interaction or a motion is warranted and what it must
communicate, not how it is produced or what it costs. Motion duration, easing, and rendering cost belong to
[`css-motion`](../../css/css-motion/SKILL.md) and the renderer's presentation owners, and installed
responsiveness and resource measurement is assigned by [`desktop-delivery`](../desktop-delivery/SKILL.md)
Step 3.2 and Step 4.1.

## Aesthetics

### DTINTF-SC-AESTHETICS-01 — Normal case: each expressive choice earns its place

Structure is settled, so typography, color, density, spacing, shape, and imagery are decided. The expected
outcome is that each choice makes hierarchy, state, or affordance easier to read; a choice defended only by
taste or house style is the failure.

#### Checklist

- [ ] DTINTF-CK-AESTHETICS-01-01 — Every expressive choice improves hierarchy, state recognition, affordance, trust, or identity fit.
- [ ] DTINTF-CK-AESTHETICS-01-02 — Every departure from expression that carries meaning names the recorded identity obligation behind it.
- [ ] DTINTF-CK-AESTHETICS-01-03 — No expressive choice falls below the accessibility floor the renderer's presentation owner defines.

### DTINTF-SC-AESTHETICS-02 — Poor quality: motion added with no state change to explain

A transition is added because the surface felt static, and nothing about location, state, or causality is
clearer afterwards. The expected outcome is motion only where it makes a change legible, with what it must
communicate stated; decorative motion accepted because it is subtle is the failure.

#### Checklist

- [ ] DTINTF-CK-AESTHETICS-02-01 — Every transition makes a change of state, location, or causality legible.
- [ ] DTINTF-CK-AESTHETICS-02-02 — Every warranted motion states what it must communicate.
- [ ] DTINTF-CK-AESTHETICS-02-03 — Every warranted motion leaves its duration, easing, and safety floor to the renderer's motion and presentation owners.

## Usage

### DTINTF-SC-USAGE-01 — Normal case: every required action reaches each supported modality

An action, state, or meaning must be available whichever way a person operates the application. The expected
outcome carries it through every supported desktop modality and makes it legible before the person acts; a
capability that exists only through the pointer, or only inside the main window, is the failure.

#### Checklist

- [ ] DTINTF-CK-USAGE-01-01 — Every required action, state, and meaning is available through window chrome, menus, tray, global and in-window shortcuts, notifications, and the keyboard, pointer, and assistive-input paths the product supports.
- [ ] DTINTF-CK-USAGE-01-02 — Every required action, state, and meaning is legible before a person acts on it.

### DTINTF-SC-USAGE-02 — Expected failure: a consequential action is about to be taken

A person is at the point of an action that is destructive, costly, or hard to undo. The expected outcome
exposes the consequence, the reversibility, and the recovery route at that point; a warning placed elsewhere,
or a recovery route discoverable only afterwards, is the failure.

#### Checklist

- [ ] DTINTF-CK-USAGE-02-01 — Consequence, reversibility, and the recovery route are exposed at the point of decision rather than before or after it.
- [ ] DTINTF-CK-USAGE-02-02 — That exposure is available through each supported modality the action itself is available through.

## Consistency

### DTINTF-SC-CONSISTENCY-01 — Normal case: the live product is the identity source

The shipped application already teaches its users a set of patterns, and a new surface must sit beside them.
The expected outcome prefers what the application teaches over a described intention; a new surface built to
an intention the product never expressed is the failure.

#### Checklist

- [ ] DTINTF-CK-CONSISTENCY-01-01 — What the shipped application already teaches its users is preferred over a described intention.
- Also applies: DTINTF-CK-PROJECT-01-02 (identity source recorded beside the decisions it constrains).

### DTINTF-SC-CONSISTENCY-02 — Edge case: the governing material is current and the product is stale

Design material was updated and the live application has not caught up, so the two disagree. The expected
outcome departs from the live product and follows the current material; following the shipped application
because it is the running artifact is the failure.

#### Checklist

- [ ] DTINTF-CK-CONSISTENCY-02-01 — The departure to the current governing material records that the live application is the stale artifact.

## Risk

### DTINTF-SC-RISK-01 — Normal case: the evidence class matches what the choice risks

A set of design claims is being accepted, and each rests on some evidence. The expected outcome names the
class for every claim and obtains new representative-user evidence for the choices the Rule's triggers name,
while a choice matching no trigger proceeds on its named class; both an unnamed class and an
evidence demand the Rule does not make are failures.

#### Checklist

- [ ] DTINTF-CK-RISK-01-01 — Every design claim names the evidence class it rests on.
- [ ] DTINTF-CK-RISK-01-02 — Every material choice that is novel, uncertain, exclusionary, consequential, security- or compatibility-sensitive, hard to reverse, or carries material risk of harm was accepted only after new representative-user evidence.
- [ ] DTINTF-CK-RISK-01-03 — A material choice matching none of those triggers is accepted on its named evidence class, without new representative-user evidence being required of it.
- [ ] DTINTF-CK-RISK-01-04 — The evidence class is selected before the choice is decided.
- [ ] DTINTF-CK-RISK-01-05 — The evidence class chosen is one that could still falsify that choice.

### DTINTF-SC-RISK-02 — Rule violation: a claim about people rests on evidence that is not from people

A design claim states what people can perceive, operate, complete, or recover from, and its support is a
standard, an expert review, prior research, analytics, or the project owner's familiarity. The expected
outcome treats those as framing and requires evidence from representative people for the claim itself;
framing accepted as support is the failure.

#### Checklist

- [ ] DTINTF-CK-RISK-02-01 — No claim about what people can perceive, operate, complete, or recover from is supported by a standard, expert review, prior research, analytics, or a project owner's familiarity alone.
- [ ] DTINTF-CK-RISK-02-02 — Stakeholder preference and design convention do not outrank observed use of the design by representative people.

### DTINTF-SC-RISK-03 — Adversarial: the threshold is satisfied after the fact

A triggered choice was already locked, and evidence was gathered afterwards to support it, or the success
measure was defined so the number can improve while people do worse. The expected outcome rejects both;
compliance shaped to survive review rather than to change a decision is the failure.

#### Checklist

- [ ] DTINTF-CK-RISK-03-01 — No evidence collected after a choice was locked is counted toward the evidence Rule for that choice.
- [ ] DTINTF-CK-RISK-03-02 — Every success measure names its intended interpretation and its harmful interpretation.
- [ ] DTINTF-CK-RISK-03-03 — Every success measure names the guardrail that detects the harmful interpretation, so a proxy improving while the user outcome worsens cannot stand alone.
- [ ] DTINTF-CK-RISK-03-04 — Every success measure names the evidence that would reopen the design.

## Overall

### DTINTF-SC-OVERALL-01 — Normal case: identity, evidence, concept, expression, modality, and measure decided together

A complete design judgment answers which identity governs, what evidence each claim rests on, which concepts
were compared, when expression was settled, how meaning reaches every modality, and what a success measure
must survive. The scenario fails when one of those six is unanswered, or when the design claims more than it
settled.

#### Checklist

- [ ] DTINTF-CK-OVERALL-01-01 — The design record answers identity authority, evidence class, concept comparison, expression ordering, modality coverage, and success measures.
- [ ] DTINTF-CK-OVERALL-01-02 — The design's claim is no broader than the judgments it actually settles.
- Also applies: DTINTF-CK-PROJECT-01-04 (mechanism questions routed to their named owners).
