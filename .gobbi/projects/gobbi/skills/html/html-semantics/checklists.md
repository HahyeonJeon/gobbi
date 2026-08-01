# HTML Semantics Evaluation Checklist

This reusable unchecked source evaluates one set of HTML element, relationship, name, state, language,
direction, and accessibility-semantic choices. It is governed by the [`html`](../SKILL.md) domain and
[`html-semantics`](SKILL.md) preferences, with [`html-development`](../html-development/SKILL.md) as the
operation that emits the artifact and [`html-platform`](../html-platform/SKILL.md) as the conformance and
target manual. The source commit that contains this file identifies the checklist version. Its stable owner
prefix is `HTMLSEM`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### HTMLSEM-SC-PROJECT-01 — Normal case: each choice stays inside markup judgment

An ordinary review decides which element carries the content or action, how it is named, and what state,
language, and direction it expresses. It fails this scenario when presentation, added interaction, untrusted
data, source transformation, or privileged process behavior is decided here instead of routed to its owner.

#### Checklist

- [ ] HTMLSEM-CK-PROJECT-01-01 — Every decided choice is an HTML element, relationship, name, label, state, language, direction, or accessibility-semantic choice.
- [ ] HTMLSEM-CK-PROJECT-01-02 — Presentation is routed to CSS, added interaction to JavaScript, untrusted data and dangerous sinks to security, source transforms to the generator, and privileged processes to Electron.
- [ ] HTMLSEM-CK-PROJECT-01-03 — No authoring sequence or platform-lookup decision is made here.

### HTMLSEM-SC-PROJECT-02 — Expected failure: a preference departure has no documented evidence

A choice departs from a preferred default, but the evidence that would permit the departure does not exist.
The expected outcome keeps the preferred default and records the open question; adopting the departure and
justifying it by intent is the observable failure.

#### Checklist

- [ ] HTMLSEM-CK-PROJECT-02-01 — Every departure from a Preference carries documented evidence.
- [ ] HTMLSEM-CK-PROJECT-02-02 — Every departure from a Preference stays inside the Rules.
- [ ] HTMLSEM-CK-PROJECT-02-03 — A choice without that evidence keeps the preferred default.

## Structure

### HTMLSEM-SC-STRUCTURE-01 — Normal case: relationships are expressed in markup

Groups, instructions, errors, and alternatives mean nothing unless the markup ties them to their subject, and
generated or reordered content can break the tie without changing appearance. The expected outcome expresses
each relationship structurally and preserves it through generation and reordering.

#### Checklist

- [ ] HTMLSEM-CK-STRUCTURE-01-01 — Every control group, instruction, error, and alternative has an explicit relationship to its subject.
- [ ] HTMLSEM-CK-STRUCTURE-01-02 — Every such relationship is preserved in generated or reordered content.
- [ ] HTMLSEM-CK-STRUCTURE-01-03 — Every element is chosen for the content or action it represents rather than for default styling or a desired selector.

## Performance

Not applicable: this skill decides meaning, naming, state, language, direction, and accessibility semantics
and states no latency, capacity, resource, or recurring-cost obligation of its own; the resource cost of
emitted markup is owned by `html-development` and evaluated by its checklist.

## Aesthetics

### HTMLSEM-SC-AESTHETICS-01 — Poor quality: valid markup whose meaning is hard to read

The choices are permitted, but the same purpose is expressed differently in different places and roles repeat
what the native element already means. The expected outcome uses one consistent pattern per purpose and adds
nothing that restates or contradicts native semantics.

#### Checklist

- [ ] HTMLSEM-CK-AESTHETICS-01-01 — The same semantic purpose uses a consistent markup pattern across the reviewed markup.
- [ ] HTMLSEM-CK-AESTHETICS-01-02 — No redundant or conflicting ARIA role, state, or property sits beside the native semantics it repeats.
- [ ] HTMLSEM-CK-AESTHETICS-01-03 — Every custom semantic choice names the capability gap that justified departing from the native element.

## Usage

### HTMLSEM-SC-USAGE-01 — Normal case: names, labels, states, and language are present where they apply

A person reading, hearing, or operating the content needs a purposeful name for every control, a visible
label that survives input, an exposed state, and accurate language and direction. The scenario fails when any
one of those is missing where it applies.

#### Checklist

- [ ] HTMLSEM-CK-USAGE-01-01 — Every control and non-text item carries a purposeful accessible name or text alternative.
- [ ] HTMLSEM-CK-USAGE-01-02 — Every label, instruction, and error uses visible text, or uses another permitted source the content contract requires.
- [ ] HTMLSEM-CK-USAGE-01-03 — Every visible label remains available after input begins.
- [ ] HTMLSEM-CK-USAGE-01-04 — Every applicable state is exposed by the element that owns it.
- [ ] HTMLSEM-CK-USAGE-01-05 — Accurate `lang` and `dir` are used wherever language or direction is expressed.

### HTMLSEM-SC-USAGE-02 — Edge case: a real capability gap requires a custom widget

No native element supplies the required meaning and behavior, so a custom widget is built. The expected
outcome supplies and verifies the complete name, role, state, keyboard, and activation model; a widget whose
model is assumed from the role it declares is the failure.

#### Checklist

- [ ] HTMLSEM-CK-USAGE-02-01 — Every custom widget supplies its complete name, role, state, keyboard, and activation model.
- [ ] HTMLSEM-CK-USAGE-02-02 — Every custom widget's model is verified rather than assumed from the role it declares.

### HTMLSEM-SC-USAGE-03 — Adversarial: a semantic counterfeit

A styled generic element or an added role presents itself as a control, and the appearance is convincing
enough that review stops there. The expected outcome uses the native element or fulfills the promise the
markup exposes; a role or a style accepted as behavior is the failure.

#### Checklist

- [ ] HTMLSEM-CK-USAGE-03-01 — No link performs an action in place of a button, and no button navigates in place of a link.
- [ ] HTMLSEM-CK-USAGE-03-02 — No ARIA role is relied on to supply keyboard or activation behavior.
- [ ] HTMLSEM-CK-USAGE-03-03 — Every element that appears operable is operable by keyboard.

## Consistency

### HTMLSEM-SC-CONSISTENCY-01 — Rule violation: ARIA not permitted on its element

Explicit roles, states, and properties are added to native elements. ARIA in HTML defines which of them the
element allows, and native semantics outrank a role that repeats or contradicts them. An ARIA value the
element does not permit is the failure, whatever it improves elsewhere.

#### Checklist

- [ ] HTMLSEM-CK-CONSISTENCY-01-01 — Every added ARIA role, state, and property is permitted on its element by ARIA in HTML.
- [ ] HTMLSEM-CK-CONSISTENCY-01-02 — Native semantics outrank every redundant or conflicting role.
- [ ] HTMLSEM-CK-CONSISTENCY-01-03 — A native element is used wherever its meaning and behavior fit.

## Risk

### HTMLSEM-SC-RISK-01 — Adversarial: markup offered as protection

A required attribute, a pattern check, or a clean markup review is offered as the safety story for untrusted
data or an unvalidated submission. The expected outcome keeps each protection claim with the mechanism that
enforces it; native validation accepted as a server or authorization check is the failure.

#### Checklist

- [ ] HTMLSEM-CK-RISK-01-01 — Native form validation is not treated as server validation or authorization.
- [ ] HTMLSEM-CK-RISK-01-02 — No markup or validator result is offered as evidence of security or of protection for untrusted data or a dangerous sink.
- [ ] HTMLSEM-CK-RISK-01-03 — Every untrusted-data and dangerous-sink decision stays with its named security owner.

## Overall

### HTMLSEM-SC-OVERALL-01 — Normal case: the claim matches what markup evidence supports

Markup evidence establishes emitted meaning and native behavior and nothing beyond it. The scenario fails
when a product, security, or conformance claim rests on the markup review alone, or when source, emitted
bytes, parsed DOM, target behavior, and product evidence are merged into one result.

#### Checklist

- [ ] HTMLSEM-CK-OVERALL-01-01 — Every claim stays inside emitted meaning and native behavior.
- [ ] HTMLSEM-CK-OVERALL-01-02 — Every cross-owner or product claim carries matching evidence from its owner.
- [ ] HTMLSEM-CK-OVERALL-01-03 — Source, emitted bytes, parsed DOM, target behavior, and product evidence remain separate in the record.

### HTMLSEM-SC-OVERALL-02 — Edge case: support differs across the declared targets

A chosen element or attribute behaves differently across the declared targets, so the essential path and the
enhancement diverge. The expected outcome keeps an essential native path everywhere and layers enhancements
on proven support; an exact-target path used while a broader claim is made is the failure.

#### Checklist

- [ ] HTMLSEM-CK-OVERALL-02-01 — An essential native path exists across every declared target, with enhancements layered only on proven support.
- [ ] HTMLSEM-CK-OVERALL-02-02 — An exact-target path is used only where the complete target is one pinned runtime and no broader claim is made.
