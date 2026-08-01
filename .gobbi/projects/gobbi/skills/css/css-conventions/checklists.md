# CSS Conventions Evaluation Checklist

This reusable unchecked source evaluates one set of CSS choices against the boundary and defaults this skill
owns. It is governed by the [`css`](../SKILL.md) domain and [`css-conventions`](SKILL.md) preferences, with
[`css-development`](../css-development/SKILL.md) as the operation that applies them and
[`css-platform`](../css-platform/SKILL.md) as the runtime-evidence manual. The source commit that contains
this file identifies the checklist version. Its stable owner prefix is `CSSCONV`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### CSSCONV-SC-PROJECT-01 — Normal case: each choice sits inside the owned boundary

An ordinary CSS task decides values that emitted presentation owns, stays inside the Rule boundary, and
selects a project default within it. It fails this scenario when a foreign concern is decided inside CSS or
when a choice names neither the boundary it stays inside nor the default it selects.

#### Checklist

- [ ] CSSCONV-CK-PROJECT-01-01 — Every decided choice is emitted presentation.
- [ ] CSSCONV-CK-PROJECT-01-02 — Every triggered document-meaning, application-state, product-direction, security, trust, foreign-syntax, generator-mechanics, transform-configuration, and Electron or runtime-process question is routed to its named owner.
- [ ] CSSCONV-CK-PROJECT-01-03 — Every choice names the applicable Rule boundary it stays inside and the project default it selects within that boundary.
- [ ] CSSCONV-CK-PROJECT-01-04 — CSS newly emitted by a generator changed for this task is inspected rather than assumed.

### CSSCONV-SC-PROJECT-02 — Expected failure: the project has no established convention for the choice

Inspection finds no existing naming, layer, selector, token, or layout convention that answers the task's
choice. The expected outcome keeps the decision scoped to its actual owner or raises it there. Turning a local
task into a project-wide scheme is the observable failure.

#### Checklist

- [ ] CSSCONV-CK-PROJECT-02-01 — No project-wide naming, layer, selector, token, or layout scheme is introduced to satisfy a local task.
- [ ] CSSCONV-CK-PROJECT-02-02 — A choice with no established convention stays scoped to its actual owner or is raised to that owner for a decision.

## Structure

### CSSCONV-SC-STRUCTURE-01 — Normal case: the rendered value has a visible owner

Layers, specificity, scope, inheritance, custom properties, and order should reveal which source controls each
rendered value. The scenario fails when the winning declaration cannot be traced to a canonical owner, or when
ownership rests on an assumption about source order.

#### Checklist

- [ ] CSSCONV-CK-STRUCTURE-01-01 — Declaration, selector, custom-property, layer, and source ownership is explicit at the canonical owner for every changed value.
- [ ] CSSCONV-CK-STRUCTURE-01-02 — The intended winner for every affected value is established by cascade evidence.
- [ ] CSSCONV-CK-STRUCTURE-01-03 — Existing cascade contracts, layer order, stable selector seams, and the lowest workable specificity are used wherever they express the required ownership and still select the intended winner.
- [ ] CSSCONV-CK-STRUCTURE-01-04 — A new source or transform seam is introduced only where the current canonical owner cannot express the presentation contract.

### CSSCONV-SC-STRUCTURE-02 — Rule violation: a public interface changes without its migration

Established public hooks and custom-property or token interfaces have consumers outside the changed file. The
expected outcome preserves them, or changes them under an authorized migration that updates every consumer. A
changed or removed interface with a consumer left behind is the failure.

#### Checklist

- [ ] CSSCONV-CK-STRUCTURE-02-01 — Every established public hook and custom-property or token interface the change touches is preserved, or is changed under an authorized migration.
- [ ] CSSCONV-CK-STRUCTURE-02-02 — No consumer still depends on a name, hook, or token the migration removed or renamed.
- [ ] CSSCONV-CK-STRUCTURE-02-03 — A value that participates in established reuse, variation, or theming uses the existing custom-property or token interface.
- [ ] CSSCONV-CK-STRUCTURE-02-04 — A genuinely local value stays local.

## Performance

### CSSCONV-SC-PERFORMANCE-01 — Poor quality: a performance choice defended without measurement

A selector, property, containment, or layout choice is justified as the faster option. The expected outcome
carries representative measurement taken with the required guards. A choice defended by convention, a
specification label, or an impression of smoothness is the failure, even when the rendered result is correct.

#### Checklist

- [ ] CSSCONV-CK-PERFORMANCE-01-01 — Every performance claim rests on representative measurement of the affected condition.
- [ ] CSSCONV-CK-PERFORMANCE-01-02 — Every performance measurement is taken with behavior and accessibility guards in place.

## Aesthetics

### CSSCONV-SC-AESTHETICS-01 — Poor quality: names and seams that hide the owner

The change is valid but its names, hooks, and seams make the owned target harder to identify, either by
naming a foreign concern or by adding a second name beside an existing one. The expected outcome reuses the
established project name or stable hook that already identifies the target.

#### Checklist

- [ ] CSSCONV-CK-AESTHETICS-01-01 — Every name and hook used identifies the owned target without naming a foreign concern.
- [ ] CSSCONV-CK-AESTHETICS-01-02 — An established project name or stable hook that already identifies the target is used instead of a new one.
- Also applies: CSSCONV-CK-STRUCTURE-02-01 (a changed interface carries an authorized migration).

## Usage

### CSSCONV-SC-USAGE-01 — Normal case: content and operation survive real user conditions

Presentation must stay usable across the content, interaction, settings, fonts, themes, locale, direction,
writing mode, zoom, and reflow the product actually meets. The scenario fails when essential content or
operation is lost, obscured, or made unreadable in any applicable condition.

#### Checklist

- [ ] CSSCONV-CK-USAGE-01-01 — Essential content and operation remain available across applicable content, state, font failure, user settings, text spacing, zoom, and reflow.
- [ ] CSSCONV-CK-USAGE-01-02 — Focus remains visible and unobscured in every applicable state.
- [ ] CSSCONV-CK-USAGE-01-03 — Every meaning carried by color is also carried by a non-color cue.
- [ ] CSSCONV-CK-USAGE-01-04 — Required text and non-text contrast holds in every applicable state, theme, and forced-color mode.
- [ ] CSSCONV-CK-USAGE-01-05 — Browser focus and state defaults, wrapping text, and resilient font fallbacks are kept wherever the presentation contract leaves the treatment open.

### CSSCONV-SC-USAGE-02 — Edge case: visual order diverges from source order

A layout technique reorders items so that what a person sees no longer matches the document sequence. The
expected outcome keeps a source order that carries the meaning and a focus order that stays operable. A
correct-looking visual arrangement over a broken sequence is the failure.

#### Checklist

- [ ] CSSCONV-CK-USAGE-02-01 — Source order still carries the meaningful sequence wherever visual order differs from it, as the Flexbox order-accessibility requirements demand.
- [ ] CSSCONV-CK-USAGE-02-02 — Focus order after visual reordering still reaches every operable element in a sequence a person can follow.

### CSSCONV-SC-USAGE-03 — Rule violation: motion breaks the safety floor

Emitted presentation moves in a way that flashes unsafely, ignores a reduced-motion request, or removes a
required pause, stop, hide, or non-motion path. The expected outcome keeps every shipped motion safe and
operable under WCAG 2.2; any one of those breaks fails the scenario on its own.

#### Checklist

- [ ] CSSCONV-CK-USAGE-03-01 — No shipped presentation produces unsafe flashing.
- [ ] CSSCONV-CK-USAGE-03-02 — Every shipped transition and animation responds to a reduced-motion request.
- [ ] CSSCONV-CK-USAGE-03-03 — Applicable pause, stop, hide, or non-motion behavior is retained.

### CSSCONV-SC-USAGE-04 — Edge case: layout meets its adaptation extremes

Containers, zoom, reflow, locale, direction, and writing mode push the layout to its limits. The expected
outcome starts from normal flow, intrinsic sizing, and logical properties and reaches for a stronger technique
only from an actual constraint. Clipping or a physical assumption that fails at an extreme is the failure.

#### Checklist

- [ ] CSSCONV-CK-USAGE-04-01 — Normal flow, intrinsic sizing, and logical properties are used unless a genuinely physical requirement is stated.
- [ ] CSSCONV-CK-USAGE-04-02 — Every use of flex, grid, positioning, overflow, containment, or a query names the constraint it satisfies.
- [ ] CSSCONV-CK-USAGE-04-03 — Applicable extremes, scrollbars, zoom, reflow, direction, and writing mode are verified wherever a physical property or clipping is used.

### CSSCONV-SC-USAGE-05 — Adversarial: cosmetic accessibility compliance

A visible focus ring in one theme, a declared reduced-motion block, or a passing contrast sample can present
an accessibility Rule as satisfied while the outcome still fails somewhere the person actually is. The expected
outcome verifies the required behavior in the affected state, theme, and mode; the appearance of compliance
accepted as compliance is the failure.

#### Checklist

- [ ] CSSCONV-CK-USAGE-05-01 — A declared reduced-motion path actually reduces or removes the motion it names rather than restating it.
- [ ] CSSCONV-CK-USAGE-05-02 — A custom focus, state, or contrast treatment is verified in forced-color mode and in every applicable theme rather than in one sample.
- Also applies: CSSCONV-CK-OVERALL-01-01 (no observation proves a property it does not establish).

## Consistency

### CSSCONV-SC-CONSISTENCY-01 — Normal case: the change agrees with what already exists

Nearby source, existing interfaces, and the project's established choices supply the default the change should
follow. The scenario fails when the change adopts a second style beside an existing one, or departs from a
default without naming its scope and evidence.

#### Checklist

- [ ] CSSCONV-CK-CONSISTENCY-01-01 — The change follows the convention observed in neighboring source for cascade, naming, custom properties, and layout.
- [ ] CSSCONV-CK-CONSISTENCY-01-02 — Every departure from a project default names its scope.
- [ ] CSSCONV-CK-CONSISTENCY-01-03 — Every departure from a project default preserves the affected contracts.
- [ ] CSSCONV-CK-CONSISTENCY-01-04 — Every departure from a project default carries evidence for the choice it changes.

### CSSCONV-SC-CONSISTENCY-02 — Rule violation: a default is used to override a Rule

Preferences apply only inside the Rules, so a project default cannot license an outcome a Rule forbids. The
expected outcome resolves the conflict in the Rule's favor; a documented default or local preference presented
as sufficient authority is the failure.

#### Checklist

- [ ] CSSCONV-CK-CONSISTENCY-02-01 — No project default or local preference produces an outcome an applicable Rule forbids.

## Risk

### CSSCONV-SC-RISK-01 — Normal case: essential outcomes hold on the declared targets

The declared browsers or the pinned Electron renderer decide whether a feature is available where the product
runs. The expected outcome preserves every essential outcome there, with a tested fallback or progressive
enhancement wherever exact support differs. Support inferred rather than observed is the failure.

#### Checklist

- [ ] CSSCONV-CK-RISK-01-01 — Every essential outcome is preserved on the declared browsers or the pinned Electron renderer.
- [ ] CSSCONV-CK-RISK-01-02 — Every feature whose support differs across the declared targets carries a tested fallback or progressive enhancement.
- [ ] CSSCONV-CK-RISK-01-03 — A newer feature is chosen over an established one only where direct target evidence proves both the required outcome and its fallback.

### CSSCONV-SC-RISK-02 — Poor quality: evidence weaker than the risk it covers

The choice works, but the evidence behind it cannot fail. The expected outcome selects the smallest layer that
can falsify the affected risk and adds evidence as consequence and target variation grow. An evidence layer
that could not have exposed the failure is the observable defect.

#### Checklist

- [ ] CSSCONV-CK-RISK-02-01 — The evidence layer selected for every claim can falsify the risk that claim is offered against.
- [ ] CSSCONV-CK-RISK-02-02 — A claim spanning several targets, themes, or modes carries evidence from each of them rather than from one sample.

## Overall

### CSSCONV-SC-OVERALL-01 — Adversarial: proxy evidence presented as proof

A specification label, a feature query, a clean lint run, a screenshot, or an appeal to convention can be
offered as proof of behavior, target support, performance, or acceptance. The expected outcome keeps every
claim inside what its evidence establishes; a proxy accepted as the result is the failure.

#### Checklist

- [ ] CSSCONV-CK-OVERALL-01-01 — No observation is treated as proof of a property it does not establish: a specification label of target support, a feature query of behavior, a lint result of rendered outcome, a screenshot of accessibility, a visual appearance of cascade ownership, a convention or popularity of correctness, and CSS evidence alone of complete product or accessibility acceptance.
- [ ] CSSCONV-CK-OVERALL-01-02 — Every unmeasured claim remains an open question rather than an accepted result.
