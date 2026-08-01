# CSS Motion Evaluation Checklist

This reusable unchecked source evaluates one piece of declarative motion against the mechanics and the
project motion system this skill owns. It is governed by the [`css`](../SKILL.md) domain and
[`css-motion`](SKILL.md) preferences, with [`css-conventions`](../css-conventions/SKILL.md) as the binding
safety floor, [`css-development`](../css-development/SKILL.md) as the operation that applies these choices,
and [`css-platform`](../css-platform/SKILL.md) as the runtime-evidence manual. The source commit that
contains this file identifies the checklist version. Its stable owner prefix is `CSSMOT`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### CSSMOT-SC-PROJECT-01 — Normal case: the motion decision sits with its owner

This skill owns how the movement is built, not whether the change should move or what the movement must
communicate, and not motion a script drives from a live input. The scenario fails when a decision belonging to
the interface owner, to `web-interaction`, or to `css-platform` is made inside the motion implementation.

#### Checklist

- [ ] CSSMOT-CK-PROJECT-01-01 — Whether the change moves at all, and what the movement must communicate, is decided by the owning interface skill rather than here.
- [ ] CSSMOT-CK-PROJECT-01-02 — Motion driven from a live pointer, scroll position, or a sequence that must reverse from where it stands is routed to `web-interaction`.
- [ ] CSSMOT-CK-PROJECT-01-03 — Every runtime, target, or performance observation behind the motion comes from `css-platform`.

## Structure

### CSSMOT-SC-STRUCTURE-01 — Normal case: timing comes from one project scale

Duration, easing, and delay belong to a single project scale so unrelated parts of the product move alike and
can be retuned in one place. The scenario fails when a component carries its own timing values, or when the
scale exists but the change does not resolve to a step in it.

#### Checklist

- [ ] CSSMOT-CK-STRUCTURE-01-01 — Every duration, easing, and delay value resolves to a step in the project motion scale.
- [ ] CSSMOT-CK-STRUCTURE-01-02 — A change needing a value the scale does not express extends the scale at its owner rather than holding the value locally.
- [ ] CSSMOT-CK-STRUCTURE-01-03 — The scale's steps are recorded as custom properties at the owner other components read.

### CSSMOT-SC-STRUCTURE-02 — Edge case: a scale step reads wrong for the distance or surface

The moved distance or the surface size makes an otherwise correct step read as too fast or too slow. The
expected outcome names that reason and returns the new value to the scale. A departure justified by taste, or
one that stops at the component, is the failure.

#### Checklist

- [ ] CSSMOT-CK-STRUCTURE-02-01 — Every departure from a scale step names the moved distance or surface size that motivates it.
- Also applies: CSSMOT-CK-STRUCTURE-01-02 (a new value is added to the scale at its owner).

## Performance

### CSSMOT-SC-PERFORMANCE-01 — Normal case: the animated property decides the cost

Compositor-only properties produce a new frame without recomputing layout or repainting, so the property
choice decides whether the motion survives a loaded main thread. The expected outcome animates `transform` and
`opacity`, and treats any other property as a measured exception rather than a judgement call.

#### Checklist

- [ ] CSSMOT-CK-PERFORMANCE-01-01 — Every animated property is `transform` or `opacity`.
- [ ] CSSMOT-CK-PERFORMANCE-01-02 — Every other animated property carries representative before-and-after measurement through `css-platform`, recorded beside the change.

### CSSMOT-SC-PERFORMANCE-02 — Poor quality: compositor hints applied without measurement

The motion works, but `will-change` has been added defensively, names more than the animating properties, or
stays after the motion ends. The expected outcome leaves the hint unset until measured dropped frames justify
it, since a promoted layer costs memory whether or not it moves.

#### Checklist

- [ ] CSSMOT-CK-PERFORMANCE-02-01 — Every `will-change` sits on an element with measured dropped frames.
- [ ] CSSMOT-CK-PERFORMANCE-02-02 — Every `will-change` names only the properties that actually animate.
- [ ] CSSMOT-CK-PERFORMANCE-02-03 — Every `will-change` is removed when its motion ends, except on a continuously running animation.

## Aesthetics

### CSSMOT-SC-AESTHETICS-01 — Normal case: a group moves as one composition

Several elements change together, or a new surface is associated with the control that opened it. The expected
outcome gives the group one timeline with a small constant stagger and moves the surface toward or away from
its cause. Independent timings, or a stagger that outruns the scale, fail the scenario.

#### Checklist

- [ ] CSSMOT-CK-AESTHETICS-01-01 — Parts of a group share one timeline with a small constant stagger between them.
- [ ] CSSMOT-CK-AESTHETICS-01-02 — Motion associated with a control travels toward or away from the element that caused it.
- [ ] CSSMOT-CK-AESTHETICS-01-03 — The stagger is dropped wherever the last item's start time would exceed the scale's largest step.

## Usage

### CSSMOT-SC-USAGE-01 — Normal case: the still version carries the meaning

Motion may reinforce what a change means but can never be its only carrier, because the still version is the
product. The scenario fails when a state, relationship, direction, or result is readable only while something
is moving, or when the distinguishing difference disappears once the motion ends.

#### Checklist

- [ ] CSSMOT-CK-USAGE-01-01 — Every state, relationship, direction, and result the motion expresses is also available from text, an accessible state, or a static styling difference.
- [ ] CSSMOT-CK-USAGE-01-02 — That static difference persists after the motion ends.

### CSSMOT-SC-USAGE-02 — Rule violation: a shipped animation has no reduced-motion path

A transition or animation ships without an explicit path under `prefers-reduced-motion: reduce`, or leans on
one blanket override for everything. The expected outcome substitutes a calmer change per animation and keeps
the state change and any completion event observable. Deleting the feedback outright is equally a failure.

#### Checklist

- [ ] CSSMOT-CK-USAGE-02-01 — Every shipped transition and animation has an explicit path under `prefers-reduced-motion: reduce`.
- [ ] CSSMOT-CK-USAGE-02-02 — Each reduced path substitutes a shorter, smaller, or non-moving change for that specific animation rather than relying on one blanket override.
- [ ] CSSMOT-CK-USAGE-02-03 — The resulting state change and any completion event remain observable on the reduced path.
- [ ] CSSMOT-CK-USAGE-02-04 — Each reduced substitute keeps the feedback, using an opacity cross-fade or an immediate change rather than removing it.

### CSSMOT-SC-USAGE-03 — Expected failure: the animation is interrupted, cancelled, or never starts

A transition is replaced, the element is removed, the property never changes, or motion is reduced to nothing,
so `transitionend` or `animationend` may not fire. The expected outcome is that the person still reaches the
same content, focus, and completion. A path that stalls when the motion does not finish is the failure.

#### Checklist

- [ ] CSSMOT-CK-USAGE-03-01 — The interrupted, cancelled, and never-started outcome is defined for every animation.
- [ ] CSSMOT-CK-USAGE-03-02 — No content, focus, or completion depends on an animation finishing.
- [ ] CSSMOT-CK-USAGE-03-03 — Every `transitionend` and `animationend` consumer still reaches its outcome when the event does not fire.

## Consistency

### CSSMOT-SC-CONSISTENCY-01 — Normal case: the technique matches the change it expresses

A two-state change, a multi-step sequence, a repeating indicator, and runtime-computed motion each have a
technique that fits them. The scenario fails when a keyframe animation replaces a simple transition, when
`Element.animate()` is used without one of its conditions, or when entry and exit drift away from the
element's resting state.

#### Checklist

- [ ] CSSMOT-CK-CONSISTENCY-01-01 — A change between two states uses a transition.
- [ ] CSSMOT-CK-CONSISTENCY-01-02 — A keyframe animation is used only for a sequence of more than two steps, a repeating indicator, or motion with no state change to attach to.
- [ ] CSSMOT-CK-CONSISTENCY-01-03 — `Element.animate()` is used only for runtime-computed values, motion that must reverse from its current position, or a timeline shared across elements, and the scale, safe-property, and reduced-motion Rules still hold for it.
- [ ] CSSMOT-CK-CONSISTENCY-01-04 — Entry and exit live in the same declarative source as the element's resting state.

### CSSMOT-SC-CONSISTENCY-02 — Edge case: a declared target predates `@starting-style` support

The preferred entry mechanism is Baseline 2024, so a declared target can predate it. The expected outcome
confirms support against the actual declared targets and supplies the fallback `css-conventions` requires for
the rest. Treating the Baseline label as target coverage is the failure.

#### Checklist

- [ ] CSSMOT-CK-CONSISTENCY-02-01 — Support for `@starting-style` and `transition-behavior: allow-discrete` is confirmed against the declared targets.
- [ ] CSSMOT-CK-CONSISTENCY-02-02 — Every declared target without support has a keyframe animation or a `web-interaction`-owned class-toggle fallback.

## Risk

### CSSMOT-SC-RISK-01 — Normal case: vestibular triggers are reduced rather than ignored

Movement, scaling, panning, and parallax are the common vestibular triggers, and a reduced-motion request asks
for less of them, not for nothing. The expected outcome substitutes a calmer change for each and keeps only
motion that conveys information no static state can, with its distance and duration reduced.

#### Checklist

- [ ] CSSMOT-CK-RISK-01-01 — Every movement, scaling, panning, and parallax effect has a reduced substitute.
- [ ] CSSMOT-CK-RISK-01-02 — Motion kept on the reduced path conveys information no static state can, and its distance and duration are reduced.

### CSSMOT-SC-RISK-02 — Rule violation: motion is tied to scroll or pointer position without a recorded reason

Scroll-linked movement is the strongest vestibular trigger and the hardest to reduce well, so the linkage
needs a recorded design reason. The expected outcome avoids it, or carries direct target evidence and routes
the scripted alternative outward. An unexplained linkage is the failure.

#### Checklist

- [ ] CSSMOT-CK-RISK-02-01 — Every motion tied to scroll position or pointer position has a design record of why the linkage is essential to the meaning.
- [ ] CSSMOT-CK-RISK-02-02 — Every accepted declarative `animation-timeline` linkage carries direct target evidence rather than a Baseline claim.
- [ ] CSSMOT-CK-RISK-02-03 — Every scripted scroll- or pointer-linked alternative and its listener contract is routed to `web-interaction`.

## Overall

### CSSMOT-SC-OVERALL-01 — Adversarial: cosmetic reduced-motion and cost compliance

A `prefers-reduced-motion` block, a token reference, or a `transform`-only declaration can present the
obligations as met while the person who asked for less motion still gets the same movement, loses the feedback
entirely, or loses a consequence the animation carried. The expected outcome verifies the reduced path and the
frame cost under the conditions they claim; the presence of the right syntax accepted as the result is the
failure.

#### Checklist

- [ ] CSSMOT-CK-OVERALL-01-01 — The reduced path is verified under `prefers-reduced-motion: reduce` rather than inferred from the presence of the media block.
- [ ] CSSMOT-CK-OVERALL-01-02 — Every consequence that depended on the animation still occurs on the reduced path.
- [ ] CSSMOT-CK-OVERALL-01-03 — No observation is treated as proof of a property it does not establish: the presence of a media block of reduced-motion behavior, a `transform` or `opacity` declaration of frame cost, a Baseline label of declared-target support, and a smooth local preview of measured performance.
