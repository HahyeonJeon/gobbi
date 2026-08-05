# Desktop Interface Evaluation Checklist

This reusable unchecked source evaluates one installed desktop application's complete design-lifecycle
judgment: the seven activity results, identity authority, evidence threshold, concept exploration,
prototyping, representative-user testing, expression ordering, modality coverage, collaboration,
interaction and motion intent, and post-release improvement. It is governed by the
[`desktop`](../SKILL.md) domain and [`desktop-interface`](SKILL.md) preferences, with
[`desktop-development`](../desktop-development/SKILL.md) as the ordered operation that coordinates the work.
The source commit that contains this file identifies the checklist version. Its stable owner prefix is
`DTINTF`.

The evidence Rule this source checks is a risk threshold, not an unconditional gate. Rows below test the
threshold as the Rule states it: an evidence class is named for every claim, and new representative-user
evidence is required only for a choice that matches one of the Rule's named triggers.

This source judges whether an interaction or motion is warranted and what state, location, or causality it
communicates. Event, pointer, keyboard, focus, drag, gesture, widget-pattern, and script-driven mechanics
belong to [`web-interaction`](../../web/web-interaction/SKILL.md); declarative motion mechanics belong to
[`html-css-motion`](../../html-css/html-css-motion/SKILL.md). Other product, implementation, Electron, renderer, release,
and operating-system questions remain with their named owners.

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

### DTINTF-SC-PROJECT-02 — Rule violation: a project-wide design authority is created here

No governing material exists, so the work writes or prescribes a project-wide `DESIGN.md` to fill the gap.
The expected outcome falls back to the live product or a user-confirmed run-scoped brief; creating the
project's design authority from inside a design decision is the failure.

#### Checklist

- [ ] DTINTF-CK-PROJECT-02-01 — No project-wide `DESIGN.md` is created or prescribed by this work.
- [ ] DTINTF-CK-PROJECT-02-02 — A run-scoped brief used as the identity source is confirmed by the user rather than assumed.

### DTINTF-SC-PROJECT-03 — Normal case: every design activity returns a bounded judgment

The design record covers the whole lifecycle while ordered work remains elsewhere. The expected outcome gives
each activity one disposition and a traceable result; an omitted activity, double disposition, or ownerless
record is the failure.

#### Checklist

- [ ] DTINTF-CK-PROJECT-03-08 — Each design activity maps to its exact named result: Discovery research — `Discovery evidence reviewed`; Problem framing and design requirements — `Design requirements accepted for the current subject`; Concept alternatives — `Concept decision recorded`; Prototyping — `Prototype evidence reviewed`; Representative-user testing — `Test evidence reviewed`; Design–implementation collaboration — `Design and implementation obligations reconciled for the current subject`; Post-release measurement and improvement — `Post-release design review closed`.
- [ ] DTINTF-CK-PROJECT-03-02 — Each activity result has exactly one disposition: `Performed for the current subject`, `Reused current evidence`, or `Not applicable with exact reason`.
- [ ] DTINTF-CK-PROJECT-03-07 — Each activity result names its actor or owner, subject and scope, current inputs, method, evidence, decision state, counterevidence, failure, uncertainty, limitations, dependencies, routes, trace, reopen condition, and evidence location.

### DTINTF-SC-PROJECT-04 — Poor quality: Discovery evidence cannot change the decision

Discovery is described as complete because sources were collected. The expected outcome returns evidence
that is stale, weak, disconnected from affected people or context, silent about counterevidence or
uncertainty, or unable to affect the current decision; source volume presented as relevance is the failure.

#### Checklist

- [ ] DTINTF-CK-PROJECT-04-01 — The Discovery research result returns without closing when sources are weak or stale; affected people, context, or counterevidence is missing; uncertainty is unresolved; or the evidence cannot affect the decision.

### DTINTF-SC-PROJECT-05 — Rule violation: requirements are not current problem evidence

A requirements record exists but embeds an invented solution or lacks current authority and trace. The
expected outcome returns every invented, solution-locked, authority-free, untraceable, incomplete, or
contradicted problem or requirement; a polished requirements list treated as acceptance is the failure.

#### Checklist

- [ ] DTINTF-CK-PROJECT-05-01 — The Problem framing and design requirements result returns without closing when a problem or requirement is invented, solution-locked, authority-free, untraceable, incomplete, or contradicted.

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

### DTINTF-SC-STRUCTURE-04 — Expected failure: a prototype cannot answer its design question

A prototype is offered as evidence for a choice or for production behavior. The expected outcome returns when
its fidelity hides the question, required experience coverage is absent, or its evidence is promoted beyond
the prototype; a polished demonstration treated as production proof is the failure.

#### Checklist

- [ ] DTINTF-CK-STRUCTURE-04-03 — The Prototyping result returns without closing when fidelity hides the question; a required path, state, failure, recovery, accessibility, or adaptation is missing; or prototype evidence is treated as production proof.

### DTINTF-SC-STRUCTURE-05 — Adversarial: concept alternatives hide the actual trade-off

Several candidates are presented as concept work, but they share one consequential model or hide its costs.
The expected outcome returns cosmetic alternatives, hidden trade-offs, or an unsupported single-concept
claim; the appearance of choice used to close the activity is the failure.

#### Checklist

- [ ] DTINTF-CK-STRUCTURE-05-01 — The Concept alternatives result returns without closing when alternatives are cosmetic variants, trade-offs are hidden, or fewer than two material concepts remain without the evidenced single-viable exception.

## Performance

### DTINTF-SC-PERFORMANCE-01 — Normal case: post-release evidence can reopen the design

A released interface has current outcome evidence. The expected outcome compares it with dated success
targets and harm guardrails and reopens an affected decision when warranted; a favorable proxy used to close
the design permanently is the failure.

#### Checklist

- [ ] DTINTF-CK-PERFORMANCE-01-01 — Post-release measurement identifies the exact design subject, affected people, observation conditions, date, current reach, and applicable success target and harm guardrail.
- [ ] DTINTF-CK-PERFORMANCE-01-04 — Crossing a success target or harm guardrail reopens the affected decision for an improvement judgment.
- [ ] DTINTF-CK-PERFORMANCE-01-03 — The Post-release measurement and improvement result returns without closing when a signal is missing or unanswerable, a proxy has a harmful interpretation, monitoring is unbounded, an owner or consumer is missing, a guardrail is crossed, an explicit improvement-or-no-change decision or Maintenance decision is absent, or a no-change result is not dated, bounded, and falsifiable.

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

A transition is added because the interface felt static, and nothing about location, state, or causality is
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

### DTINTF-SC-USAGE-03 — Normal case: representative people exercise the relevant experience

A prototype or current product is tested before its choice is accepted. The expected outcome observes people
who represent those affected while they encounter the relevant tasks, modalities, access needs, failures,
and recovery; stakeholder approval or analytics alone is the failure.

#### Checklist

- [ ] DTINTF-CK-USAGE-03-01 — Participants, tasks, settings, supported modalities, access needs, and operating conditions represent the people and experience affected by the choice.
- [ ] DTINTF-CK-USAGE-03-02 — The result records observed success, failure, recovery, counterevidence, and coverage gaps before the choice is accepted.
- [ ] DTINTF-CK-USAGE-03-03 — The Representative-user testing result returns without closing when people, subject, tasks, conditions, or modalities are wrong; failure or harm is hidden; generalization is unsupported; or evidence is insufficient.

### DTINTF-SC-USAGE-04 — Normal case: interaction and motion intent is explicit

A design activity contains an applicable interaction or motion choice. The expected outcome states whether
the behavior is warranted and the meaning it carries before mechanics are selected; omitted intent or an
unspecified state, location, or cause is the failure.

#### Checklist

- [ ] DTINTF-CK-USAGE-04-01 — Every applicable interaction or motion judgment states whether it is warranted and what state, location, or causality it communicates.

## Consistency

### DTINTF-SC-CONSISTENCY-01 — Normal case: the live product is the identity source

The shipped application already teaches its users a set of patterns, and a new view, window, page, panel,
dialog, or control must sit beside them. The expected outcome prefers what the application teaches over a
described intention; a new view, window, page, panel, dialog, or control built to an intention the product
never expressed is the failure.

#### Checklist

- [ ] DTINTF-CK-CONSISTENCY-01-01 — What the shipped application already teaches its users is preferred over a described intention.
- Also applies: DTINTF-CK-PROJECT-01-02 (identity source recorded beside the decisions it constrains).

### DTINTF-SC-CONSISTENCY-02 — Edge case: the governing material is current and the product is stale

Design material was updated and the live application has not caught up, so the two disagree. The expected
outcome departs from the live product and follows the current material; following the shipped application
because it is the running artifact is the failure.

#### Checklist

- [ ] DTINTF-CK-CONSISTENCY-02-01 — The departure to the current governing material records that the live application is the stale artifact.

### DTINTF-SC-CONSISTENCY-03 — Expected failure: implementation challenges a design decision

Implementation exposes a constraint that conflicts with an accepted observable decision. The expected
outcome records and returns the conflict for design judgment before behavior changes; silently redefining the
experience in code is the failure.

#### Checklist

- [ ] DTINTF-CK-CONSISTENCY-03-01 — The Design–implementation collaboration result records each implementation constraint or contradiction, its evidence, owner, and accepted disposition before it changes an observable decision.
- [ ] DTINTF-CK-CONSISTENCY-03-03 — The Design–implementation collaboration result returns without closing when the handoff is one-way, a mechanism changes intent, a conflict is unowned, the trace is stale, or a contradiction is unverified.

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

### DTINTF-SC-RISK-05 — Adversarial: reused evidence does not reach the current decision

An activity reuses a nearby study without proving that it reaches the present subject and people. The
expected outcome binds the evidence to its original and current conditions and keeps it falsifiable;
similarity used as current reach is the failure.

#### Checklist

- [ ] DTINTF-CK-RISK-05-01 — A `Reused current evidence` result identifies the exact subject, affected people, source, date, context, conditions, falsifiability, and current reach.

### DTINTF-SC-RISK-06 — Adversarial: non-applicability hides a decision risk

An activity is declared unnecessary because the team expects no useful result. The expected outcome proves
both that the activity cannot change the scoped decision and that no binding risk trigger applies;
convenience presented as an exact reason is the failure.

#### Checklist

- [ ] DTINTF-CK-RISK-06-01 — A `Not applicable with exact reason` result proves that the activity cannot change the scoped decision and that no binding risk trigger applies.

## Overall

### DTINTF-SC-OVERALL-02 — Normal case: the complete lifecycle stays inside Interface judgment

A complete design judgment covers every activity and routes ordered work and mechanisms without copying
their policy. The expected outcome claims only what its current results settle and sends each adjacent
question to its exact owner; an overbroad claim or locally invented mechanism policy is the failure.

#### Checklist

- [ ] DTINTF-CK-OVERALL-02-01 — The design's claim is no broader than the current activity results and judgments it actually settles.
- [ ] DTINTF-CK-OVERALL-02-02 — Adjacent questions are routed without copied policy: product structure and runtime outcomes to `desktop-architecture`; ordered lifecycle work to `desktop-development`; release judgment to `desktop-release`; Electron mechanisms to the `electron` family; current operating-system facts to `desktop-linux`, `desktop-macos`, or `desktop-windows`; other renderer policy to its web, HTML/CSS, React, or TypeScript owner; event, pointer, keyboard, focus, drag, gesture, widget-pattern, and script-driven mechanics to `web-interaction`; and declarative motion mechanics to `html-css-motion`.
