---
name: css-motion
description: "MUST load when specifying, implementing, or reviewing declarative motion in CSS, covering transitions, keyframe animations, the duration and easing scale, safe-to-animate properties, entry, exit, and choreography, and reduced-motion implementation."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# CSS Motion

## Intro

Use this preference skill when emitted presentation has to move: a state change that transitions, an element
that enters or leaves, an indicator that repeats, or a group whose parts must move together. It owns the
mechanics and the project-level system behind that movement — which properties move, for how long, on which
curve, and what happens for a person who has asked for less motion.

`css-conventions` sets the binding boundary every CSS choice sits inside, including the motion safety floor.
This skill supplies the implementation that floor requires and does not restate it. `css-development` runs
the ordered change or review that applies these choices, and `css-platform` supplies the runtime evidence
behind a performance or target claim.

Whether a change deserves motion at all, and what a transition must communicate, belongs to
[`web-interface`](../../web/web-interface/SKILL.md) or
[`desktop-interface`](../../desktop/desktop-interface/SKILL.md). Motion a script drives from a live input —
a pointer drag, a scroll position, a sequence that must reverse from where it stands — belongs to
`web-interaction`, which takes the scale, the safe-property limit, and
the reduced-motion obligation below as given. Rules define the valid choices, Preferences select defaults
inside them, and a Rule wins every conflict.

## Principles

### Motion is a system, not a per-component decision

Duration, easing, distance, and delay come from one project scale so unrelated parts of the product move
alike. A component that invents its own timing makes the product feel assembled rather than designed, and it
cannot be retuned in one place.

### Motion may reinforce meaning but never carry it

Whatever a transition expresses — a state, a relationship, a direction, a result — has to stay perceivable
when the motion is reduced, interrupted, or never runs. Treat the moving version as the enhancement and the
still version as the product.

### The animated property decides the cost

Compositor-only properties produce a new frame without recomputing layout or repainting, so the property
choice, not the duration, decides whether motion survives a loaded main thread. A cheap-looking animation on
an expensive property costs a full layout pass every frame.

### Reduced motion asks for less, not for nothing

`prefers-reduced-motion: reduce` reports a request to minimize non-essential motion, not an instruction to
delete feedback. The reduced path substitutes a calmer change so the person still sees that something
happened, and every consequence that depended on the animation still occurs.

## Rules

- **MUST give every shipped transition and animation an explicit reduced-motion path under
  [`prefers-reduced-motion`](https://www.w3.org/TR/mediaqueries-5/#descdef-media-prefers-reduced-motion).**
  Substitute a shorter, smaller, or non-moving change per animation instead of applying one blanket override,
  and keep the resulting state change and any completion event observable on the reduced path.
- **NEVER let motion be the only carrier of a state, relationship, direction, or result.** The same
  information MUST remain available from text, an accessible state, or a static styling difference that
  persists after the motion ends.
- **MUST take duration, easing, and delay from one project motion scale rather than choosing per-component
  values.** When no step in the scale expresses the change, extend the scale at its owner instead of
  hard-coding a local value.
- **MUST restrict animated properties to `transform` and `opacity` unless measured evidence justifies
  another.** Animating a property that forces layout or paint on every frame requires representative
  before-and-after measurement through `css-platform`, recorded beside the change.
- **MUST define the interrupted, cancelled, and never-started outcome for every animation, and NEVER gate
  content, focus, or completion on it finishing.** A `transitionend` or `animationend` event can fail to fire
  when the transition is replaced, the element is removed, the property never changes, or motion is reduced
  to nothing.

## Preferences

Preferences apply only inside the Rules. A Rule wins every conflict.

### Transition or keyframe animation

**Default:** **PREFER** a transition for a change between two states, and a keyframe animation only for a
sequence of more than two steps, a repeating indicator, or motion with no state change to attach to.

**Applicability:** Use this default when a class, attribute, or pseudo-class the CSS already owns drives the
change.

**Departure:** Use the Web Animations API through `Element.animate()`
([Web Animations Level 1](https://www.w3.org/TR/web-animations-1/)) when the values are computed at runtime,
the motion must reverse from its current position, or several elements must share one controllable timeline;
the scale, safe-property, and reduced-motion Rules above still apply to it.

### Duration and easing scale

**Default:** **PREFER** the project's existing motion custom properties. When the project has none, start the
scale at roughly 100–200 ms for a small local state change, 200–400 ms for an element entering or leaving,
and above 400 ms only for a full-view change, with an accelerating curve for exits, a decelerating curve for
entries, and a symmetric curve for a change that stays on screen.

**Applicability:** Use these steps as the project's starting values and record them as custom properties at
the owner that other components read.

**Departure:** Depart from a step when the moved distance or the surface size makes it read as too fast or
too slow, then add the new step to the scale rather than to the component.

### Entry and exit

**Default:** **PREFER** `@starting-style` with `transition-behavior: allow-discrete` for an element that
enters from `display: none` or the top layer, keeping entry and exit in the same declarative source as the
element's resting state.

**Applicability:** Use this default when the declared targets support it; it is
[Baseline 2024](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style), so older targets need the
fallback that `css-conventions` requires.

**Departure:** Use a keyframe animation, or a scripted two-frame class toggle owned by `web-interaction`,
when a declared target predates support.

### Compositor hints

**Default:** **PREFER** leaving `will-change` unset.

**Applicability:** Add it only to an element with measured dropped frames, name only the properties that
actually animate, and remove it when the motion ends.

**Departure:** Keep the hint in place for a continuously running animation, and never apply it broadly, since
a promoted layer costs memory whether or not it moves.

### Choreography

**Default:** **PREFER** one timeline for a group with a small constant stagger between its parts, and motion
that travels toward or away from the element that caused it.

**Applicability:** Use this default when several elements change together, or when a new surface is
associated with the control that opened it.

**Departure:** Drop the stagger when the group is long enough that the last item's start time would exceed
the scale's largest step; the total sequence, not the per-item step, is the duration the person experiences.

### Reduced-motion substitution

**Default:** **PREFER** an opacity cross-fade or an immediate change as the reduced substitute, rather than
removing the feedback.

**Applicability:** Use this default for movement, scaling, panning, and parallax, which are the common
vestibular triggers.

**Departure:** Keep essential motion that conveys information no static state can, and reduce its distance
and duration instead of removing it.

### Scroll-position and continuous-input motion

**Default:** **AVOID** tying motion to scroll position or pointer position at all; large scroll-linked
movement is the strongest vestibular trigger and the hardest to reduce well.

**Applicability:** Use this default unless the design records why the linkage is essential to the meaning.

**Departure:** When the linkage is accepted, a declarative `animation-timeline` is preferable to a scripted
one but is
[not Baseline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline), so it needs direct
target evidence; route the scripted alternative and its listener contract to `web-interaction`.

## References
