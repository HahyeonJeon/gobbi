# Web Interaction Evaluation Checklist

This reusable unchecked source evaluates one browser feature's interaction choices against the
keyboard-parity, pointer-floor, role-and-pattern, focus-decision, listener-contract, and rate-limit obligations
this skill owns. It is governed by the [`web`](../SKILL.md) domain and [`web-interaction`](SKILL.md)
preferences, with [`web-frontend`](../web-frontend/SKILL.md) as the ordered operation that applies them,
[`html-css-semantics`](../../html-css/html-css-semantics/SKILL.md) as the owner of which element, name, role, and state
express the meaning, [`html-css-motion`](../../html-css/html-css-motion/SKILL.md) as the owner of declarative motion
mechanics, and [`web-interface`](../web-interface/SKILL.md) and
[`desktop-interface`](../../desktop/desktop-interface/SKILL.md) as the owners of whether an interaction is
warranted at all. The source commit that contains this file identifies the checklist version. Its stable owner
prefix is `WEBIXN`.

This source evaluates interaction choices, not an ordered procedure. The obligation that every state,
transition, interaction, and recovery path is specified and implemented belongs to `web-frontend`; the rows
below judge the choices those obligations are satisfied from.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBIXN-SC-PROJECT-01 — Normal case: an interaction choice stays inside its boundary

An interaction question is answered for a control with several nearby owners. The expected outcome decides
only the choice space this skill holds and routes the rest, applying a Rule over any conflicting Preference;
an element-meaning, motion-mechanics, or navigation decision made here is the failure.

#### Checklist

- [ ] WEBIXN-CK-PROJECT-01-01 — Every decision made here is a choice within the valid space: the event contract, the control's states, focus placement and return, the keyboard path for a pointer behavior, or the applicable widget pattern.
- [ ] WEBIXN-CK-PROJECT-01-02 — Every adjacent question is routed to its owner: the ordered browser operation and the obligation that each state and recovery path is specified and implemented to `web-frontend`, element, name, role, and state to `html-css-semantics`, declarative motion mechanics and the project motion scale to `html-css-motion`, emitted styling to `html-css-conventions`, whether an interaction is warranted at all to `web-interface` or `desktop-interface`, platform facts and evidence to `web-platform`, untrusted input and dangerous sinks to `web-security`, and navigation and state ownership above the control to `web-architecture`.
- [ ] WEBIXN-CK-PROJECT-01-03 — A Rule is applied over a conflicting Preference rather than balanced against it.

## Structure

### WEBIXN-SC-STRUCTURE-01 — Normal case: the listener contract is defined before the listener exists

Listeners, captures, observers, and timers are being added to a component. The expected outcome decides each
one's target, phase, default-action handling, and removal point at the moment it is added; a listener whose
removal was never chosen is the failure.

#### Checklist

- [ ] WEBIXN-CK-STRUCTURE-01-01 — Each listener's target, phase, default-action handling, and removal point are defined before it is added.
- [ ] WEBIXN-CK-STRUCTURE-01-02 — Every listener an interaction needs is added with a single `AbortController` signal, or a listener that deliberately outlives the component names its owner and removal point where it is added.
- [ ] WEBIXN-CK-STRUCTURE-01-03 — One listener sits on the nearest container that outlives its children, or the departure names the event that does not bubble.
- [ ] WEBIXN-CK-STRUCTURE-01-04 — That listener reads the origin from `event.target`, or the departure names the event that does not bubble.

### WEBIXN-SC-STRUCTURE-02 — Normal case: the control's state set is declared before it is styled

A control can enter several states and each must be recognisable. The expected outcome names the whole set
before any of it is styled and exposes each state beyond sight; a state that exists in code but was never
declared or announced is the failure.

#### Checklist

- [ ] WEBIXN-CK-STRUCTURE-02-01 — The states the control can enter — rest, hover, focus-visible, active, pending, disabled, error, and where they apply selected or expanded — are named before any of them is styled.
- [ ] WEBIXN-CK-STRUCTURE-02-02 — Each declared state is exposed to assistive technology as well as to sight.
- [ ] WEBIXN-CK-STRUCTURE-02-03 — A state is removed from the set only because the control cannot enter it, never by leaving it undefined.

### WEBIXN-SC-STRUCTURE-03 — Poor quality: a widget pattern is implemented in part

A control matches a published Authoring Practices pattern and most of that pattern is built. The expected
outcome builds the pattern or records a justified departure from it, and never announces more than it
implements; a partial pattern promising keys, states, or announcements the widget does not have is the
failure.

#### Checklist

- [ ] WEBIXN-CK-STRUCTURE-03-01 — A widget that matches a WAI-ARIA Authoring Practices pattern is built from that pattern, or the departure records the evidence that it still satisfies ARIA's normative requirements and follows the keyboard conventions of a similar pattern or the native platform widget.
- [ ] WEBIXN-CK-STRUCTURE-03-02 — The pattern name is recorded beside the implementation.
- [ ] WEBIXN-CK-STRUCTURE-03-03 — Every deviation from the pattern records the evidence behind it.
- [ ] WEBIXN-CK-STRUCTURE-03-04 — Where the pattern is followed, no key, state, or announcement it guarantees is left unimplemented.

## Performance

### WEBIXN-SC-PERFORMANCE-01 — Normal case: high-frequency input is coalesced

Scrolling, pointer movement, and resizing fire far faster than the screen updates. The expected outcome
coalesces presentation work into the frame loop and reads visibility and size from an observer; geometry read
inside a scroll handler, forcing synchronous layout, is the failure.

#### Checklist

- [ ] WEBIXN-CK-PERFORMANCE-01-01 — `scroll`, `pointermove`, and `resize` presentation work is coalesced into one `requestAnimationFrame` callback, or the departure names the event that must act immediately and pairs a leading edge with a trailing follow-up.
- [ ] WEBIXN-CK-PERFORMANCE-01-02 — Work that should run once the input settles uses a trailing debounce.
- [ ] WEBIXN-CK-PERFORMANCE-01-03 — `IntersectionObserver` answers whether an element is visible, or the departure names the need for the scroll offset itself.
- [ ] WEBIXN-CK-PERFORMANCE-01-04 — `ResizeObserver` answers whether an element changed size, or the departure names the need for the scroll offset itself.

### WEBIXN-SC-PERFORMANCE-02 — Rule violation: rate limiting is applied to a handler that owns correctness

A debounce or throttle is placed on a handler because the event fires often. The expected outcome rate-limits
only presentation work and keeps authoritative behavior on the real event; a dropped or delayed submission,
validation, or state update is the failure.

#### Checklist

- [ ] WEBIXN-CK-PERFORMANCE-02-01 — No handler that owns correctness is debounced, throttled, or otherwise rate-limited.
- [ ] WEBIXN-CK-PERFORMANCE-02-02 — Authoritative state updates, validation, and submission run on the real event.

### WEBIXN-SC-PERFORMANCE-03 — Edge case: a passive listener meets a default action

A `wheel`, `touchstart`, or `touchmove` listener on `Window`, `Document`, or `Document.body` needs to cancel
the browser's default. The expected outcome registers it with `{ passive: false }` or does not cancel; calling
`preventDefault` from a listener that is passive by default is the failure.

#### Checklist

- [ ] WEBIXN-CK-PERFORMANCE-03-01 — No default action is cancelled from a passive listener.
- [ ] WEBIXN-CK-PERFORMANCE-03-02 — A `wheel`, `touchstart`, or `touchmove` listener on `Window`, `Document`, or `Document.body` that must cancel a default action is registered with `{ passive: false }`.

## Aesthetics

### WEBIXN-SC-AESTHETICS-01 — Poor quality: state names drift between the layers that use them

The same control state is referred to in the specification, in the assistive exposure, and in the styling hook
handed to `html-css-conventions`. The expected outcome uses one name across all three; three names for one state,
leaving a reviewer to match them by inspection, is the failure.

#### Checklist

- [ ] WEBIXN-CK-AESTHETICS-01-01 — The declared state names are used consistently across the specification, the assistive exposure, and the styling hook handed to `html-css-conventions`.
- Also applies: WEBIXN-CK-STRUCTURE-03-02 (pattern name recorded beside the implementation).

## Usage

### WEBIXN-SC-USAGE-01 — Normal case: every pointer affordance has a keyboard path

A behavior is reachable with a mouse. The expected outcome makes it reachable, operable, and observable from
the keyboard through focus and key paths; a reveal that only happens on hover, or a behavior that only
tracks pointer position, is the failure.

#### Checklist

- [ ] WEBIXN-CK-USAGE-01-01 — Every pointer-operable affordance can be reached from the keyboard.
- [ ] WEBIXN-CK-USAGE-01-02 — Every pointer-operable affordance can be operated from the keyboard.
- [ ] WEBIXN-CK-USAGE-01-03 — Every pointer-operable affordance produces the same observable state change from the keyboard as from the pointer.
- [ ] WEBIXN-CK-USAGE-01-04 — No behavior exists only on hover, only from pointer position, or only through a drag.
- [ ] WEBIXN-CK-USAGE-01-05 — A hover-revealed affordance is also revealed on focus.

### WEBIXN-SC-USAGE-02 — Rule violation: a gesture or a target falls below the pointer floor

A control requires a path gesture, a pinch, or a drag, or its hit area is smaller than the minimum. The
expected outcome supplies a single-pointer alternative unless the gesture is essential and keeps the target at
or above the minimum size; a control operable only by dragging is the failure.

#### Checklist

- [ ] WEBIXN-CK-USAGE-02-01 — Every pointer affordance is operable without a path gesture or a multipoint gesture, with a single-pointer alternative unless the gesture is essential.
- [ ] WEBIXN-CK-USAGE-02-02 — Every pointer affordance is operable without a drag.
- [ ] WEBIXN-CK-USAGE-02-03 — Every pointer target is at least 24 by 24 CSS pixels, or it meets one of that criterion's exceptions.

### WEBIXN-SC-USAGE-03 — Expected failure: an overlay closes or a focused element is removed

A dialog is dismissed, or the element holding focus is hidden or destroyed. The expected outcome has already
decided focus entry, containment, and return, and moves focus somewhere findable; focus left on a removed or
hidden element, or dropped to the document, is the failure.

#### Checklist

- [ ] WEBIXN-CK-USAGE-03-01 — Focus entry, containment, and return are decided for every overlay.
- [ ] WEBIXN-CK-USAGE-03-02 — A modal surface holds focus while it is open.
- [ ] WEBIXN-CK-USAGE-03-03 — A modal surface returns focus to the invoking control, or moves focus to the element that continues the work flow when the invoking control no longer exists or the work flow continues at a following control or result.
- [ ] WEBIXN-CK-USAGE-03-04 — Focus is never left on a removed or hidden element.
- [ ] WEBIXN-CK-USAGE-03-05 — A composite widget exposes one tab stop.
- [ ] WEBIXN-CK-USAGE-03-06 — A composite widget moves its inner selection with roving `tabindex` or `aria-activedescendant`.

### WEBIXN-SC-USAGE-04 — Edge case: focus must stay in a field that drives a collection

A combobox or a virtualized collection cannot move real focus to the active item. The expected outcome
defaults to roving `tabindex` and departs to `aria-activedescendant` only for those cases; the departure
chosen for convenience is the failure.

#### Checklist

- [ ] WEBIXN-CK-USAGE-04-01 — Roving `tabindex` is the default so the active item is the focused element.
- [ ] WEBIXN-CK-USAGE-04-02 — `aria-activedescendant` is chosen only when focus must stay in a text field driving the collection or the collection is virtualized.

## Consistency

### WEBIXN-SC-CONSISTENCY-01 — Normal case: one state update behind every input path

The same behavior is reachable by mouse, touch, pen, and keyboard. The expected outcome uses the pointer model
and converges every retained path on one state update; parallel paths that diverge into two states are the
failure.

#### Checklist

- [ ] WEBIXN-CK-CONSISTENCY-01-01 — Pointer Events, `setPointerCapture` for the duration of a drag, and an explicit `touch-action` are used, or the departure names the behavior that genuinely differs by input type.
- [ ] WEBIXN-CK-CONSISTENCY-01-02 — Parallel mouse and touch paths, where kept, converge on one state update.
- Also applies: WEBIXN-CK-USAGE-01-03 (the keyboard path produces the same observable state change).

## Risk

### WEBIXN-SC-RISK-01 — Poor quality: a listener outlives its element

A component is torn down and something it registered keeps running. The expected outcome removes every
listener, capture, observer, and timer at its chosen removal point; a handler acting on state the person has
already left, producing a bug far from its cause, is the failure.

#### Checklist

- [ ] WEBIXN-CK-RISK-01-01 — Every listener, pointer capture, observer, and timer an interaction adds is removed at the removal point chosen when it was added.
- [ ] WEBIXN-CK-RISK-01-02 — No listener continues acting on state the person has already left.

### WEBIXN-SC-RISK-02 — Adversarial: a requirement is satisfied in appearance only

A role announces a pattern the widget does not implement, a keyboard path reaches a control it cannot operate,
a target looks large but is not, and a rate limit is described as presentation-only. The expected outcome
rejects each; compliance shaped to pass a review rather than to work is the failure.

#### Checklist

- [ ] WEBIXN-CK-RISK-02-01 — No `role` or `aria-*` attribute names a pattern whose keys, states, and announcements the widget does not implement.
- [ ] WEBIXN-CK-RISK-02-02 — No keyboard path is counted as equivalent when it reaches the control but cannot produce its state change.
- [ ] WEBIXN-CK-RISK-02-03 — No target meets the minimum size through a visual affordance larger than its actual hit area.
- [ ] WEBIXN-CK-RISK-02-04 — No rate limit is described as presentation-only while an authoritative update rides on the coalesced call.

## Overall

### WEBIXN-SC-OVERALL-01 — Normal case: the interaction is complete across input, focus, pattern, and lifetime

A complete interaction choice answers the keyboard path, the pointer floor, the declared state set, the focus
decisions, the matched pattern, and every listener's removal point. The scenario fails when one of those is
unanswered, or when a decision this skill does not own was made here.

#### Checklist

- [ ] WEBIXN-CK-OVERALL-01-01 — The interaction record answers the keyboard path, the pointer floor, the declared state set, the focus decisions, the matched pattern, and every listener's removal point.
- Also applies: WEBIXN-CK-PROJECT-01-02 (adjacent questions routed to their owners).
