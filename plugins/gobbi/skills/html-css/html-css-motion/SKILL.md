---
name: html-css-motion
description: "MUST load when choosing or reviewing declarative CSS motion mechanics or motion-system defaults for transitions, animations, timing, interruption, cancellation, reduced motion, or performance-sensitive motion choices."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# HTML/CSS Motion

Use this preference after an interface owner has approved the need and intent for motion. Choose declarative
transition and animation mechanics, timing defaults, start and restart behavior, interruption, cancellation,
reduced-motion alternatives, and performance-sensitive source choices.

This skill does not decide whether motion is warranted and does not promise compositor promotion or target
performance. Route standards facts, direct target observations, and diagnosis to `html-css-platform`; route
focused comparison design, assertions, and result claims to `html-css-testing`; route source changes to
`html-css-development`; and route JavaScript interaction behavior to its Web or framework owner.

## Principles

### Motion is an interruptible state transition

Design start, delay, completion, reversal, restart, interruption, cancellation, and removal as observable
states. Do not treat a single uninterrupted playback as the whole contract.

### Reduced motion preserves the outcome

A reduced-motion path should preserve information, state, and task completion while reducing or removing the
stimulus. Replacing one intense effect with another is not meaningful reduction.

### Declarations are hypotheses, not measurements

Property choice and `will-change` can express intent or risk, but they do not prove compositor execution,
frame rate, memory cost, or responsiveness on a target.

### Motion interfaces have consumers

Durations, easings, names, custom properties, and shared keyframes can become public contracts. Track their
consumers and migration effects like other styling interfaces.

## Rules

- **MUST start from approved product or interaction motion intent and named states.** Return the necessity or expressive
  question when no interface owner has supplied it.
- **MUST define interruption, cancellation, reversal, restart, and removal behavior when those events can occur.**
  No path may require animation completion to reach a correct state.
- **MUST provide an effective reduced-motion path for material motion.** Preserve the outcome and avoid an
  equivalent vestibular, flashing, or attention burden.
- **MUST keep performance claims within direct target evidence.** Treat transform, opacity, containment, and
  `will-change` as choices with tradeoffs, never compositor or frame-rate guarantees.
- **MUST record material target, state, content, direction, and reduced-preference variants.** State which cases
  were not observed.
- **NEVER hide state, input, focus, errors, or recovery behind motion.** The correct end state must remain
  reachable when motion is skipped, interrupted, cancelled, or unsupported.

## Preferences

### Prefer transitions for property changes and animations for explicit timelines

Prefer a transition when an existing state change should interpolate between two values. Prefer keyframes
when the approved effect needs named intermediate states, repetition, direction control, or an independent
timeline; depart when the target or interruption model makes the other mechanic clearer.

### Prefer short, coherent timing scales

Prefer a small set of purpose-based durations and easing curves shared through stable tokens. Use a one-off
value when the motion's distance, content, or interaction purpose makes the shared scale unsuitable and the
exception is recorded.

### Prefer end-state correctness independent of events

Prefer state classes, attributes, or owned component state that establish the final presentation without
depending on `transitionend` or `animationend`. Use completion events only for optional follow-up work that has
an explicit cancellation and missing-event path.

### Prefer simple interruption and reversal

Prefer mechanics that continue from the current rendered value or restart predictably without flashing,
jumping, duplicate events, or stale classes. More complex timelines are valid when their state machine and
recovery are explicit.

### Prefer no `will-change` until measured need

Prefer omitting `will-change`; add it shortly before a measured hot path and remove it when the need ends.
A persistent hint is justified only by direct target evidence that also considers memory and side effects.

### Prefer explicit motion-interface migration

When shared durations, easings, animation names, keyframes, or custom properties change, prefer an atomic
consumer update. Use a staged domain transition only when known external consumers require it and the owning
release context authorizes coexistence.

## References

- [`checklists.md`](checklists.md) evaluates declarative motion choices across all eight perspectives.
