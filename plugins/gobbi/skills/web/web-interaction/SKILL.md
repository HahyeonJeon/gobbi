---
name: web-interaction
description: "MUST load when choosing or reviewing browser interaction behavior, including event and pointer contracts, keyboard operation, focus management, drag and gesture alternatives, listener lifetime and rate limiting, or WAI-ARIA widget patterns."
allowed-tools: Read, Grep, Glob, WebFetch
skill-type: preference
---

# Web Interaction

Use this preference skill when a browser feature's interaction needs a judgment rather than a step: what an
event contract must define, which states a control has, where focus goes and where it returns, how a pointer
behavior is reached from a keyboard, and which published widget pattern applies. It owns the valid choice
space that `web-frontend` applies, and it holds for any browser interface, including an Electron renderer.

`web-frontend` owns the ordered browser operation and the obligation that every state, transition,
interaction, and recovery path is specified and implemented; this skill owns the choices those obligations
are satisfied from. [`html-css-semantics`](../../html-css/html-css-semantics/SKILL.md) owns which element, name, role,
and state express the meaning; this skill owns the behavior a chosen role promises.
[`html-css-motion`](../../html-css/html-css-motion/SKILL.md) owns declarative motion mechanics and the project motion scale;
this skill owns motion a script drives from a live input and the listener contract behind it.

`web-design` and `desktop-interface` decide whether an interaction or a transition is warranted at all,
`web-platform` owns platform facts and evidence, `web-security` owns untrusted input and dangerous sinks, and
`web-architecture` owns navigation and state ownership above the control. Rules define the boundary,
Preferences select defaults inside it, and a Rule wins every conflict.

## Principles

### Pointer and keyboard are one requirement

An affordance is finished when it works by pointer and by keyboard, not when it works by pointer. A behavior
that only appears on hover, only tracks pointer position, or only responds to a drag does not exist for the
people who never use a mouse, so each one needs a focus or key path that produces the same state change.

### Focus is application state

Where focus sits, where it may travel, and where it returns after an overlay closes are decisions the feature
makes deliberately. Left to DOM order and default behavior, focus lands somewhere the person did not ask for
and often cannot find.

### Normative ARIA binds, a published pattern persuades

WAI-ARIA and WCAG state requirements a widget must meet, while W3C calls the Authoring Practices an
"informative" resource whose examples are "illustrative, not prescriptive". A matching pattern still carries
the key and state model people learned from other products, so leaving it costs that transfer and has to be
justified against the normative requirements the pattern conveys.

### Listener lifetime is part of the contract

Every listener, pointer capture, observer, and timer an interaction adds has a removal point chosen when it
is added. A listener that outlives its element keeps acting on state the person has already left, and the
resulting bug appears far from its cause.

## Rules

- **MUST give every pointer-operable affordance an equivalent keyboard path.** A hover-only reveal, a
  pointer-position-only behavior, or a control reachable only by dragging is incomplete until a keyboard user
  can reach it, operate it, and observe the same state change.
- **MUST keep every pointer affordance operable without a path gesture, a multipoint gesture, or a drag, and
  no smaller than the minimum target size.** Provide a single-pointer alternative unless the gesture is
  essential, per [WCAG 2.2](https://www.w3.org/TR/WCAG22/) SC 2.5.1 Pointer Gestures (A), SC 2.5.7 Dragging
  Movements (AA), and SC 2.5.8 Target Size (Minimum) (AA, 24 by 24 CSS pixels with that criterion's
  exceptions).
- **MUST meet the normative [WAI-ARIA](https://www.w3.org/TR/wai-aria-1.2/) requirements for every role a
  widget claims, and NEVER announce a role whose keys, states, and announcements the widget does not
  implement.** When a [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/) pattern
  matches, record its name beside the implementation, and record each departure with the evidence that it
  still satisfies ARIA and follows the keyboard conventions of a similar pattern or the native platform
  widget.
- **MUST decide focus entry, containment, and return for every overlay, and NEVER leave focus on a removed or
  hidden element.** A modal holds focus while open and returns it to the invoking control, except
  when that control no longer exists or the work flow continues at a following control or result, and a
  composite widget exposes one tab stop while moving its inner selection with roving `tabindex` or
  `aria-activedescendant`.
- **MUST define each listener's target, phase, default-action handling, and removal point before adding it.**
  NEVER cancel a default action from a passive listener, and treat a `wheel`, `touchstart`, or `touchmove`
  listener on `Window`, `Document`, or `Document.body` as passive unless it is registered with
  [`{ passive: false }`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).
- **NEVER debounce, throttle, or otherwise rate-limit a handler that owns correctness.** Rate-limit only
  presentation work driven by a high-frequency event such as `scroll`, `resize`, `pointermove`, or keystroke
  echo, and keep correctness-critical state updates, validation, and submission on the real event.

## Preferences

### Prefer a matching published pattern over an invented model

**PREFER** building a control from the matching
[WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/) pattern, because that pattern
conveys requirements from the normative standards and its key and state model is the one people already
learned. Depart when the design need falls outside the catalog, which W3C says "is not intended to serve as a
catalog of all possible, valid, and potentially usable ways of building accessible user interfaces", and then
satisfy ARIA's normative requirements and mimic the keyboard conventions of a similar pattern or the native
platform widget.

### Prefer delegation at a stable container

**PREFER** one listener on the nearest container that outlives its children over one listener per item, and
read the origin from `event.target`. Depart when the event does not bubble, such as `focus`, `blur`, or
`scroll` on a non-root element, and use `focusin`, `focusout`, or a listener on the element itself.

### Prefer the pointer model over parallel mouse and touch paths

**PREFER** [Pointer Events](https://www.w3.org/TR/pointerevents/), `setPointerCapture` for the duration of a
drag, and an explicit `touch-action` that declares which gestures the element handles. Depart for a behavior
that genuinely differs by input type, and keep both paths converging on one state update.

### Prefer one declared interaction state set

**PREFER** naming the states a control can enter — rest, hover, focus-visible, active, pending, disabled,
error, and where they apply selected or expanded — before any of them is styled, and expose each to assistive
technology as well as to sight. Depart by removing a state the control cannot enter, never by leaving one
undefined; the emitted styling belongs to [`html-css-conventions`](../../html-css/html-css-conventions/SKILL.md) and its
motion to [`html-css-motion`](../../html-css/html-css-motion/SKILL.md).

### Prefer roving `tabindex` for a composite widget

**PREFER** roving `tabindex`, so the active item is the focused element and assistive-technology review
follows it. Depart to `aria-activedescendant` when focus must stay in a text field that drives the
collection, as in a combobox, or when the collection is virtualized and moving real focus is impractical.

### Prefer one abort signal per component

**PREFER** adding every listener an interaction needs with a single `AbortController` signal, so one
`abort()` during teardown removes them all and no removal can be forgotten. Depart for a listener that must
deliberately outlive the component, and name its owner and removal point where it is added.

### Prefer the frame loop for continuous input and a trailing debounce for settling

**PREFER** coalescing `scroll`, `pointermove`, and `resize` presentation work into one
`requestAnimationFrame` callback, and a trailing debounce for work that should run once the input settles,
such as recalculating layout after a resize. Depart when the first event must act immediately, then use a
leading edge with a trailing follow-up so the final state is never skipped.

### Prefer an observer over a scroll handler

**PREFER** `IntersectionObserver` for "is it visible" and `ResizeObserver` for "did it change size" over
reading geometry inside a scroll or resize handler, because the observer reports without forcing a
synchronous layout. Depart when the behavior needs the scroll offset itself, and then apply the frame-loop
preference above.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
