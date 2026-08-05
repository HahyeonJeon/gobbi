# HTML/CSS Semantics Evaluation Checklist

This unchecked source evaluates the complete `semantics` subject owned by `html-css-semantics`.
Each condition is defined once, and a complete evaluation keeps its evidence and verdict outside this source.

## Project

### HCSEM-SC-PROJECT-01 — Normal case: authored-semantic scope, owner routing, and preference departures

An authoring decision concerns an element, relationship, name, label, state, language, direction, or accessibility meaning. It passes when that scope is explicit, other claims route to their owners, and every preference departure has evidence inside the Rules; it fails when Semantics decides sequence, platform facts, or an unsupported exception.

#### Checklist

- [ ] HCSEM-CK-PROJECT-01-01 — Every claim owned by another skill is routed to that skill.
- [ ] HCSEM-CK-PROJECT-01-02 — Every decided choice is an HTML element, relationship, name, label, state, language, direction, or accessibility-semantic choice.
- [ ] HCSEM-CK-PROJECT-01-03 — No authoring sequence or platform-lookup decision is made here.
- [ ] HCSEM-CK-PROJECT-01-04 — Every departure from a Preference carries documented evidence.
- [ ] HCSEM-CK-PROJECT-01-05 — Every departure from a Preference stays inside the Rules.

### HCSEM-SC-PROJECT-02 — Normal case: default preservation without departure evidence

A proposed semantic departure has no recorded evidence. It passes when the documented preferred default remains in force; it fails when convenience or appearance silently replaces the default.

#### Checklist

- [ ] HCSEM-CK-PROJECT-02-01 — A choice without that evidence keeps the preferred default.

## Structure

### HCSEM-SC-STRUCTURE-01 — Edge case: explicit relationships, element purpose, and parser boundary

Controls, instructions, errors, tables, forms, or reordered/generated content depend on explicit relationships and purposeful elements. It passes when those relationships and element meanings survive transformation and are stated before parser output is inspected; it fails when styling or selector needs choose the structure.

#### Checklist

- [ ] HCSEM-CK-STRUCTURE-01-01 — Every applicable control group, instruction, error, or alternative has an explicit relationship to its subject.
- [ ] HCSEM-CK-STRUCTURE-01-02 — Every table and form control preserves its intended relationship: table header-to-data association and control-to-form association.
- [ ] HCSEM-CK-STRUCTURE-01-03 — Every such relationship is preserved in generated or reordered content.
- [ ] HCSEM-CK-STRUCTURE-01-04 — Every element is chosen for the content or action it represents rather than for default styling or a desired selector.
- [ ] HCSEM-CK-STRUCTURE-01-05 — The intended semantic meaning is explicit before parser-produced output is inspected.

## Performance

### HCSEM-SC-PERFORMANCE-01 — Poor quality: semantic meaning preserved under optimization

An optimization or scripting shortcut would change the authored element, relationship, name, role, state, language, or direction. It passes when semantic meaning is preserved and the optimization is solved elsewhere; it fails when performance convenience rewrites meaning.

#### Checklist

- [ ] HCSEM-CK-PERFORMANCE-01-01 — Semantic meaning is not changed for performance or scripting convenience.

## Aesthetics

### HCSEM-SC-AESTHETICS-01 — Rule violation: source order, purposeful structure, and consistent markup

Visual order, wrapper convenience, or selector reuse pressures the markup structure. It passes when source order carries meaning, every wrapper has purpose, repeated purposes use consistent patterns, and redundant attributes are absent; it fails when cosmetic convenience changes or duplicates semantics.

#### Checklist

- [ ] HCSEM-CK-AESTHETICS-01-01 — Source order reflects the intended content and interaction order.
- [ ] HCSEM-CK-AESTHETICS-01-02 — Every element choice and wrapper serves a current structural or semantic purpose rather than styling or selector convenience.
- [ ] HCSEM-CK-AESTHETICS-01-03 — The same semantic purpose uses a consistent markup pattern.
- [ ] HCSEM-CK-AESTHETICS-01-04 — Redundant and conflicting semantic attributes are absent.
- [ ] HCSEM-CK-AESTHETICS-01-05 — The same semantic purpose uses a consistent markup pattern across the reviewed markup.

### HCSEM-SC-AESTHETICS-02 — Rule violation: native semantics and justified custom semantics

A custom semantic construct is proposed beside an available native element. It passes when native semantics remain unconflicted or a named capability gap justifies the custom model; it fails when redundant ARIA or styling preference creates the departure.

#### Checklist

- [ ] HCSEM-CK-AESTHETICS-02-01 — No redundant or conflicting ARIA role, state, or property sits beside the native semantics it repeats.
- [ ] HCSEM-CK-AESTHETICS-02-02 — Every custom semantic choice names the capability gap that justified departing from the native element.

## Usage

### HCSEM-SC-USAGE-01 — Normal case: sequence, alternatives, labels, names, and states

A person encounters visually reordered content, non-text items, visible labels, controls, and state changes. It passes when source sequence, text alternatives, persistent labels, accessible names, and owner-exposed states all carry the intended meaning; it fails when any meaning exists only visually or disappears during input.

#### Checklist

- [ ] HCSEM-CK-USAGE-01-01 — Source order still carries the meaningful sequence wherever visual order differs from it, as the Flexbox order-accessibility requirements demand.
- [ ] HCSEM-CK-USAGE-01-02 — Every applicable non-text item carries a purposeful text alternative.
- [ ] HCSEM-CK-USAGE-01-03 — Every visible label remains available after input begins.
- [ ] HCSEM-CK-USAGE-01-04 — Every applicable control carries a purposeful accessible name.
- [ ] HCSEM-CK-USAGE-01-05 — Every applicable state is exposed by the element that owns it.

### HCSEM-SC-USAGE-02 — Normal case: permitted ARIA, custom controls, and action boundaries

Explicit ARIA or a custom interactive element supplies names, states, roles, labels, instructions, errors, or action behavior. It passes when ARIA is permitted and nonconflicting, custom semantics are complete, visible or contract-required text supplies guidance, and links do not perform actions; it fails when a role is expected to supply behavior.

#### Checklist

- [ ] HCSEM-CK-USAGE-02-01 — Every explicit ARIA role, state, and property is permitted on its HTML element.
- [ ] HCSEM-CK-USAGE-02-02 — No explicit ARIA value conflicts with native semantics.
- [ ] HCSEM-CK-USAGE-02-03 — Every custom interactive element exposes its purposeful name, every applicable state, and the role matching its promised behavior.
- [ ] HCSEM-CK-USAGE-02-04 — Every label, instruction, and error uses visible text, or uses another permitted source the content contract requires.
- [ ] HCSEM-CK-USAGE-02-05 — No link performs an action in place of a button.

### HCSEM-SC-USAGE-03 — Normal case: native links, buttons, and interaction behavior

An authored control must navigate or perform an action. It passes when links navigate, buttons act, native elements are used when they fit, and keyboard behavior comes from the interaction owner rather than ARIA; it fails when link and button purposes are reversed or native behavior is assumed from a role.

#### Checklist

- [ ] HCSEM-CK-USAGE-03-01 — No button navigates in place of a link.
- [ ] HCSEM-CK-USAGE-03-02 — No ARIA role is relied on to supply keyboard or activation behavior.
- [ ] HCSEM-CK-USAGE-03-03 — A button is used for an action.
- [ ] HCSEM-CK-USAGE-03-04 — A link is used for navigation.
- [ ] HCSEM-CK-USAGE-03-05 — A native element is used wherever its meaning and behavior fit.

### HCSEM-SC-USAGE-04 — Normal case: language, direction, and custom widget semantics

A document contains mixed languages, direction changes, or a custom widget. It passes when language and direction metadata are identified and authored at each change and the widget supplies a complete name, role, and state model; it fails when metadata or one widget state is implicit.

#### Checklist

- [ ] HCSEM-CK-USAGE-04-01 — Document and material direction metadata is identified where it is expressed or inferred.
- [ ] HCSEM-CK-USAGE-04-02 — Document and material-language metadata is identified where it is expressed.
- [ ] HCSEM-CK-USAGE-04-03 — Accurate direction is authored wherever the direction differs.
- [ ] HCSEM-CK-USAGE-04-04 — Accurate language is authored wherever the language differs.
- [ ] HCSEM-CK-USAGE-04-05 — A custom widget supplies a complete authored name, role, and state model.

### HCSEM-SC-USAGE-05 — Normal case: generated and conditional semantic variants

A generator or condition emits more than one markup variant. It passes when every material variant preserves the same authored semantic meaning; it fails when only the default branch retains the contract.

#### Checklist

- [ ] HCSEM-CK-USAGE-05-01 — Generated and conditional variants preserve authored semantic meaning.

## Consistency

### HCSEM-SC-CONSISTENCY-01 — Edge case: ARIA in HTML and native-semantic priority

Added ARIA overlaps an element's native semantics. It passes when ARIA in HTML permits every value, native meaning wins every conflict, and a fitting native element remains preferred; it fails when redundant ARIA weakens or replaces native semantics.

#### Checklist

- [ ] HCSEM-CK-CONSISTENCY-01-02 — Native semantics outrank every redundant or conflicting role.
- Also applies: HCSEM-CK-USAGE-02-01 (explicit ARIA is permitted on its HTML element).
- Also applies: HCSEM-CK-USAGE-03-05 (a native element is used wherever its meaning and behavior fit).

## Risk

### HCSEM-SC-RISK-01 — Adversarial: form-validation and security claim boundaries

Native form validation or authored markup appears to protect authorization, untrusted data, or a dangerous sink. It passes when those decisions remain with the security owner; it fails when browser validation or semantic markup is reported as security proof.

#### Checklist

- [ ] HCSEM-CK-RISK-01-01 — Native form validation is not treated as server validation or authorization.
- [ ] HCSEM-CK-RISK-01-02 — Every untrusted-data and dangerous-sink decision stays with its named security owner.

## Overall

### HCSEM-SC-OVERALL-01 — Expected failure: emitted-meaning limits and accessibility mismatch handoff

A semantic review reaches observed native behavior, accessibility output, product behavior, or another owner's claim. It passes when Semantics judges authored meaning only and every broader observation carries Platform, Testing, or owner evidence; it fails when emitted output is treated as authored-semantic proof.

#### Checklist

- [ ] HCSEM-CK-OVERALL-01-01 — Every claim evaluated here concerns authored meaning rather than observed native behavior or accessibility output.
- [ ] HCSEM-CK-OVERALL-01-02 — Every cross-owner or product claim carries matching evidence from its owner.
- [ ] HCSEM-CK-OVERALL-01-03 — An observed accessibility-output mismatch is handed to Testing or Platform without rewriting authored intent.
