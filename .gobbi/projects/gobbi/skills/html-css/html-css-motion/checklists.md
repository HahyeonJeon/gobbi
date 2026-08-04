# HTML/CSS Motion Evaluation Checklist

This unchecked source evaluates the complete `motion` subject owned by `html-css-motion`.
Each condition is defined once, and a complete evaluation keeps its evidence and verdict outside this source.

## Project

### HCMOT-SC-PROJECT-01 — Normal case: motion intent and specialist ownership

An approved interface state change may need declarative motion, direct target facts, measurement, or scripted interaction. It passes when the interface owner supplies intent and each standards, target, measurement, pointer, or scroll claim routes to its exact owner; it fails when Motion decides product intent or cites the wrong evidence owner.

#### Checklist

- [ ] HCMOT-CK-PROJECT-01-01 — Whether the change moves at all, and what the movement must communicate, is decided by the owning interface skill rather than here.
- [ ] HCMOT-CK-PROJECT-01-02 — Motion driven from a live pointer, scroll position, or a sequence that must reverse from where it stands is routed to `web-interaction`.
- [ ] HCMOT-CK-PROJECT-01-03 — Each motion claim cites the owner that established it: `html-css-platform` for standards facts or direct target observations and `html-css-testing` for focused comparisons and result claims.

## Structure

### HCMOT-SC-STRUCTURE-01 — Edge case: motion scale and lifecycle states

A component needs timing values and defined behavior for start, restart, interruption, cancellation, reversal, or removal. It passes when reusable timing uses the shared scale, justified one-off values stay recorded exceptions, shared tokens live at their owner, and every applicable lifecycle state is defined; it fails when a local number or missing state leaves consumers guessing.

#### Checklist

- [ ] HCMOT-CK-STRUCTURE-01-01 — Every duration, easing, and delay uses a project motion-scale step unless a recorded distance, content, or interaction-purpose exception makes that scale unsuitable.
- [ ] HCMOT-CK-STRUCTURE-01-02 — Every reusable timing value absent from the scale is added at the scale owner.
- [ ] HCMOT-CK-STRUCTURE-01-03 — Shared scale steps use the project's stable token mechanism at the owner its consumers read.
- [ ] HCMOT-CK-STRUCTURE-01-04 — Every one-off timing value names the distance, content, or interaction purpose that makes the shared scale unsuitable.
- [ ] HCMOT-CK-STRUCTURE-01-05 — The motion contract records start, restart, interruption, cancellation, reversal, and removal behavior when applicable.
- [ ] HCMOT-CK-STRUCTURE-01-06 — Every non-reusable timing value absent from the scale remains a recorded one-off exception.

## Performance

### HCMOT-SC-PERFORMANCE-01 — Poor quality: property risk and temporary will-change hints

A motion choice relies on preferred properties or proposes `will-change` for a measured hot path. It passes when property choices remain risk-aware defaults and every hint has bounded activation, removal, benefit, memory, and side-effect evidence; it fails when a declaration is treated as a compositor guarantee or a hint persists without proof.

#### Checklist

- [ ] HCMOT-CK-PERFORMANCE-01-01 — The chosen motion properties are treated as risk-aware defaults, not compositor or frame-rate guarantees.
- [ ] HCMOT-CK-PERFORMANCE-01-02 — Every `will-change` names only the properties that actually animate.
- [ ] HCMOT-CK-PERFORMANCE-01-03 — Each `will-change` is activated shortly before its measured need.
- [ ] HCMOT-CK-PERFORMANCE-01-04 — Every `will-change`, including a persistent hint, has direct target evidence that its benefit outweighs its memory and side effects.
- [ ] HCMOT-CK-PERFORMANCE-01-05 — Each `will-change` is removed when its measured need ends unless direct target evidence justifies persistent use.

## Aesthetics

### HCMOT-SC-AESTHETICS-01 — Normal case: shared timelines, direction, and bounded stagger

Several related items animate from one control or shared state. It passes when they use a coherent timeline, move toward or away from their cause, and drop staggering before the final start exceeds the largest timing step; it fails when group motion becomes directionless or excessively delayed.

#### Checklist

- [ ] HCMOT-CK-AESTHETICS-01-01 — Parts of a group share one timeline with a small constant stagger between them.
- [ ] HCMOT-CK-AESTHETICS-01-02 — Motion associated with a control travels toward or away from the element that caused it.
- [ ] HCMOT-CK-AESTHETICS-01-03 — The stagger is dropped wherever the last item's start time would exceed the scale's largest step.

## Usage

### HCMOT-SC-USAGE-01 — Edge case: flashing safety, reduced motion, and static meaning

A shipped material transition or animation may flash, be reduced, be paused, or carry meaning unavailable without motion. It passes when flashing stays safe, the reduced request changes the material motion, pause or static alternatives remain available, and meaning persists without animation; it fails when safety or understanding depends on the full stimulus.

#### Checklist

- [ ] HCMOT-CK-USAGE-01-01 — No shipped presentation produces unsafe flashing.
- [ ] HCMOT-CK-USAGE-01-02 — Every shipped material transition and animation responds to a reduced-motion request.
- [ ] HCMOT-CK-USAGE-01-03 — Applicable pause, stop, hide, or non-motion behavior is retained.
- [ ] HCMOT-CK-USAGE-01-04 — A declared reduced-motion path actually reduces or removes the motion it names rather than restating it.
- [ ] HCMOT-CK-USAGE-01-05 — Every state, relationship, direction, and result the motion expresses is also available from text, an accessible state, or a static styling difference.
- [ ] HCMOT-CK-USAGE-01-06 — Every static styling difference used to convey a state, relationship, direction, or result persists after the motion ends.

### HCMOT-SC-USAGE-02 — Edge case: specific reduced paths and interrupted outcomes

A person requests reduced motion or a material animation is interrupted, cancelled, or never starts. It passes when each material animation has a specific lower-stimulus substitute that keeps feedback and a defined final outcome; it fails when one blanket override removes feedback or leaves state unresolved.

#### Checklist

- [ ] HCMOT-CK-USAGE-02-02 — Every shipped material transition and animation has an explicit path under `prefers-reduced-motion: reduce`.
- [ ] HCMOT-CK-USAGE-02-03 — Each reduced path substitutes a shorter, smaller, or non-moving change for that specific animation rather than relying on one blanket override.
- [ ] HCMOT-CK-USAGE-02-04 — Each reduced substitute keeps the feedback rather than removing it.
- [ ] HCMOT-CK-USAGE-02-05 — The interrupted, cancelled, and never-started outcome is defined for every animation.

### HCMOT-SC-USAGE-03 — Edge case: completion independence and motion-scale consumers

Application completion or a public timing token currently depends on animation events or shared motion interfaces. It passes when content, focus, and completion occur without end events, reduction preserves the outcome, and interface changes record consumer migration; it fails when a missing event or renamed token strands a consumer.

#### Checklist

- [ ] HCMOT-CK-USAGE-03-01 — No content, focus, or completion depends on an animation finishing.
- [ ] HCMOT-CK-USAGE-03-02 — Every `transitionend` and `animationend` consumer still reaches its outcome when the event does not fire.
- [ ] HCMOT-CK-USAGE-03-03 — The reduced-motion path preserves the required outcome while reducing the material stimulus.
- [ ] HCMOT-CK-USAGE-03-04 — A changed motion-scale interface records consumer and migration effects.

## Consistency

### HCMOT-SC-CONSISTENCY-01 — Rule violation: transitions, keyframes, and script ownership

An implementation must choose a transition, keyframes, or scripted animation for an approved effect. It passes when the documented state/timeline default applies or a target or interruption exception is recorded, and scripted mechanics route to `web-interaction`; it fails when a preference is enforced as an absolute rule or JavaScript behavior is decided here.

#### Checklist

- [ ] HCMOT-CK-CONSISTENCY-01-01 — A two-state property change uses a transition unless the target or interruption model makes another mechanic clearer and the departure is recorded.
- [ ] HCMOT-CK-CONSISTENCY-01-02 — Keyframes are used for named intermediate states, repetition, direction control, or an independent timeline unless a recorded target or interruption constraint requires another mechanic.
- [ ] HCMOT-CK-CONSISTENCY-01-03 — Every `Element.animate()` decision is routed to `web-interaction`.
- [ ] HCMOT-CK-CONSISTENCY-01-04 — Every `Element.animate()` use applies its recorded timing decision, risk-aware property choice, direct-target evidence limits, and material-motion reduced path.
- [ ] HCMOT-CK-CONSISTENCY-01-05 — Entry and exit live in the same declarative source as the element's resting state.
- [ ] HCMOT-CK-CONSISTENCY-01-06 — The Motion record for `Element.animate()` supplies only the approved timing, reduction, interruption, and cancellation contract.

### HCMOT-SC-CONSISTENCY-02 — Rule violation: fallbacks for unsupported declarative motion

A declared target lacks the selected declarative motion feature. It passes when a tested static, immediate, simpler-CSS, keyframe, or interaction-owned scripted fallback preserves the outcome; it fails when one unrelated fallback mechanic is required or unsupported motion blocks completion.

#### Checklist

- [ ] HCMOT-CK-CONSISTENCY-02-01 — Every declared target lacking a chosen declarative feature has a tested fallback that preserves the outcome through immediate state, static presentation, simpler CSS, keyframes, or `web-interaction`-owned script as applicable.

## Risk

### HCMOT-SC-RISK-01 — Adversarial: essential linked motion and reduced substitutes

Material motion is linked to scroll or pointer position, kept on the reduced path, or claimed to be essential. It passes when the meaning need is documented, a lower-stimulus substitute exists, distance and duration are reduced, and scripting routes to `web-interaction`; it fails when linkage or full stimulus survives by assertion alone.

#### Checklist

- [ ] HCMOT-CK-RISK-01-01 — Every material movement, scaling, panning, and parallax effect has a reduced substitute.
- [ ] HCMOT-CK-RISK-01-02 — Motion kept on the reduced path conveys information no static state can.
- [ ] HCMOT-CK-RISK-01-03 — The distance and duration of motion kept on the reduced path are reduced.
- [ ] HCMOT-CK-RISK-01-04 — Every motion tied to scroll position or pointer position has a design record of why the linkage is essential to the meaning.
- [ ] HCMOT-CK-RISK-01-05 — Every scripted scroll- or pointer-linked alternative and its listener contract is routed to `web-interaction`.

## Overall

### HCMOT-SC-OVERALL-01 — Expected failure: evidence limits and owner handoffs

A Motion result reaches a standards, target, test, source-change, product, or interaction boundary. It passes when evidence limits and the exact next owner are stated; it fails when Motion broadens a conclusion or silently performs another owner's work.

#### Checklist

- [ ] HCMOT-CK-OVERALL-01-01 — Target-evidence limits and handoffs to Platform, Testing, Development, or another owner are explicit.
