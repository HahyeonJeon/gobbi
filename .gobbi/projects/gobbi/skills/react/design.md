# React — Unit and Interface Design

**Ownership** — what a unit is and what it owes: when a component is earned and when a plain function
would do, when a custom hook is earned, composing instead of configuring, the prop surface, context as
dependency injection, where an error boundary belongs, and the accessibility mechanics an interface owes —
semantics, ARIA, focus, and generated identifiers.

**Split criterion** — `skill-writing` P4, category *a long lookup reference*: it is opened at a shaping
decision — should this be a component, should this prop exist, where does the boundary go — and read a
section at a time. P4's other three categories do not describe it: no artifact set, no per-unit
orchestration, not a sub-procedure another consumer loads.

This doc **deepens, and does not restate,** `SKILL.md` Principles 3 and 4 and Rules `H3` and `H9`, and the
`design.md` row of the P2 router. Where a value lives once its shape is settled is [`state.md`](state.md);
this file decides what the unit is and what its props are, and that one is decided at Procedure P3 act 2.
The *type* of a props surface is [`typing.md`](typing.md); the shape is here. A claim with no primary
source is labelled *ecosystem convention* where it is made; §7 lists every source.

---

## 1. Is a component earned?

React gives three shapes, and the test is what the unit does rather than where it sits.

| Shape | Earned when | Tell that it is wrong |
|---|---|---|
| **Component** | It renders | It returns no markup and exists to hold a calculation |
| **Custom hook** | It holds or subscribes to state, and that logic is reused | It calls no hook — `H3` says that makes it a plain function |
| **Plain function** | Neither of the above | It has been made a hook so it "fits in", and now the linter enforces rules it does not need |

`H3` decides the hook case mechanically rather than by taste: a function that calls hooks must be named
`use` first, and *"if it genuinely calls no hook"* it is a plain function. So the question "is this a
hook" has an answer that does not depend on judgment — read whether it calls one.

Custom hooks are also what replaced the old container-and-presentational split: *ecosystem convention* —
no react.dev position states this, and it is this skill's house default — a component that renders and a
hook that supplies its state achieve the same separation with one fewer component and no prop
pass-through.

## 2. Compose rather than configure

A component that grows a boolean prop per variant is being configured. The React answer is composition:
pass content as `children`, or expose parts that a caller assembles.

react.dev makes the same argument from the opposite direction when it warns against reaching for context —
*"Extract components and pass JSX as children to them. If you pass some data through many layers of
intermediate components that don't use that data (and only pass it further down), this often means that
you forgot to extract some components along the way."* The prop-drilling that motivates a configuration
flag is usually a missing extraction.

Two consequences worth stating because they are where the pattern is misapplied:

- **`children` is the composition seam**, and its type decides what may pass through it —
  [`typing.md`](typing.md) §3 covers what the type system can and cannot express there, including that it
  cannot constrain children to a particular element.
- **A compound component** — a parent plus named parts a caller arranges — is *ecosystem convention*. It
  is a real pattern with no react.dev position behind it, so this skill states it as a house default and
  names no library that packages it.

## 3. The prop surface

`SKILL.md` Principle 4 states the rule: pass the fields the unit reads, not the record that contains
them. This is the design consequence.

- **A wide prop is a wide coupling.** A component that accepts a whole record cannot be reused by a
  caller that does not have one, and it re-renders whenever any field changes, including the ones it never
  reads.
- **The markup is the second surface.** Principle 4's other half — a component's output is part of its
  contract — is what §5 and §6 are about. A component with a narrow, well-typed prop surface that renders
  a clickable `div` has failed half its contract.
- **Design it at P3 act 4, not afterward.** The props type is written before the body, which is what makes
  the surface a decision rather than a residue.

## 4. Context is dependency injection

Context passes a value to a subtree without threading it through every layer. That is injection, not
state management: react.dev's endorsed uses are *"theming"*, *"current account"*, and *"routing"* — all
values that are read widely and change rarely.

The design failure is treating a provider as a store: a fast-changing value in context re-renders every
reader, and memoizing the reader does not stop it. Which rung a value belongs on, and what promotes it
there, is [`state.md`](state.md) §2 — this file only says that reaching for context to avoid designing the
data flow is the wrong reason to reach for it.

## 5. Error boundaries

**Where they go.** react.dev states the granularity question directly: *"You don't need to wrap every
component into a separate Error Boundary. When you think about the granularity of Error Boundaries,
consider where it makes sense to display an error message."* Its own example is a messaging app —
*"it makes sense to place an Error Boundary around the list of conversations. It also makes sense to place
one around every individual message. However, it wouldn't make sense to place a boundary around every
avatar."* The design question is where a partial failure should still leave a usable screen.

**What they are.** *"To implement an Error Boundary component, you need to provide `static
getDerivedStateFromError` which lets you update state in response to an error and display an error message
to the user. You can also optionally implement `componentDidCatch` to add some extra logic, for example, to
log the error to an analytics service."* Both are class APIs on `Component`, which is why an error boundary
is a class in a codebase that is otherwise entirely functions, and why react.dev documents them on the
class-component reference.

**What they do not catch** — quoted, because every item is a case where a boundary looks like it should
help and does not: *"Event handlers / Server side rendering / Errors thrown in the error boundary itself
(rather than its children) / Asynchronous code (e.g. `setTimeout` or `requestAnimationFrame` callbacks); an
exception is the usage of the `startTransition` function returned by the `useTransition` Hook."* An event
handler is the common surprise: the error that a button's `onClick` throws needs its own handling, not a
boundary.

## 6. Accessibility mechanics

`H9` is the rule, it is sourced, and this section is the mechanism behind it. Nothing here adds an
obligation the rule does not state.

### Native first, and the three circumstances that allow ARIA

The First Rule of ARIA Use asks whether a native element already carries the semantics and behavior:
*"If you can use a native HTML element […] or attribute with the semantics and behavior you require
already built in, instead of re-purposing an element and adding an ARIA role, state or property to make
it accessible, then do so."*

**Read that quotation with its provenance.** W3C **discontinued** *Using ARIA* on 2026-02-24. The
document now states that its four rules *"are kept for historical purposes and for easier reference"*,
that *"it is inappropriate to cite this document as other than abandoned work"*, and that for current
guidance *"see the ARIA Authoring Practices Guide (APG)"*. The formulation below is still the clearest
articulation of the native-first test and `H9` keeps it — as this skill's house default with a
historical origin, never as a current W3C position. No current W3C document restates the three
circumstances: the APG covers authoring practice and *ARIA in HTML* covers which ARIA is permitted on
which element, and neither reproduces this list.

It then names when that is not possible, and there are **three** circumstances, all of which `H9` now
carries:

| Circumstance, in the source's words | What it looks like |
|---|---|
| *"If the feature is available in HTML […] but it is not implemented or it is implemented, but accessibility support is not."* | The element exists but a target browser or assistive technology does not support it |
| *"If the visual design constraints rule out the use of a particular native element, because the element cannot be styled as required."* | The native control cannot be styled to the required appearance |
| *"If the feature is not currently available in HTML."* | HTML has no element or attribute for the state at all — for example, marking which item in a set is the current one |

The third is the one to know, because it is easy to force an honest case into the wrong justification.
A state like "this is the current item" has no native expression, so it is the third circumstance and not
a styling compromise. `REACT-CHECK-27` asks which circumstance applies; naming a different one to make the
item resolve is the failure the item now names.

### ARIA in React is HTML

`H9` states it and it has one practical consequence worth repeating: every `aria-*` attribute is written
exactly as in HTML, so an accessibility fix is an ordinary markup change rather than a React-specific
mechanism. What React adds is `useId` (below) and the discipline of doing it in the component that owns
the markup.

### Focus, and what is not a rule

`H9` requires focus to move into a dialog when it opens and back to the invoking control when it closes,
per the APG modal dialog pattern — and the pattern states two conditions under which the close
destination legitimately differs: *"When a dialog closes, focus returns to the element that invoked the
dialog unless either: The invoking element no longer exists. Then, focus is set on another element that
provides logical work flow"*, or the work flow makes another element the more logical choice, which the
pattern scopes to the case where *"it is very unlikely users need to immediately re-invoke the dialog"*
and *"the task completed in the dialog is directly related to a subsequent step in the work flow"* — its
own example being a dialog that adds grid rows, after which focus goes to the first new cell.

A confirm-delete dialog that removes its own invoking row is the first condition, not a violation. What
`H9` forbids is an undeliberate destination: focus left wherever the closing dialog dropped it.

**Route-change focus management is not part of that rule.** Moving focus after a client-side navigation is
widely practised and is *ecosystem convention* — no primary source in this skill's References states it,
so it must never be reported as a WAI-ARIA or React-team requirement. It is a reasonable house practice
for an application that navigates without a document load; it is not `H9`.

### `useId` — generated identifiers

*"`useId` is a React Hook for generating unique IDs that can be passed to accessibility attributes."* It
exists because the alternative breaks precisely when a component is doing its job: *"hardcoding IDs like
this is not a good practice in React. A component may be rendered more than once on the page—but IDs
have to be unique!"*

Two constraints:

- **Not for list keys.** *"Do not call `useId` to generate keys in a list. Keys should be generated from
  your data."* That is `H4` from the other direction — a key is identity from the data, and a generated
  id is neither.
- **It assumes the trees match.** *"`useId` requires an identical component tree on the server and the
  client. If the trees you render on the server and the client don't match exactly, the generated IDs
  won't match."* On a host that server-renders, that puts it under the same hydration contract
  [`server-client.md`](server-client.md) §6 describes.

The everyday case is a label, an input, and its hint text: the generated id ties them together, and the
component stays reusable because two instances on one page cannot collide.

## 7. Sources and evidence classes

Read on 2026-07-26; every quoted sentence located on that date. `SKILL.md`'s References register owns the
rule-level citations.

| Source | What it supports here |
|---|---|
| [Using ARIA](https://www.w3.org/TR/using-aria/) — **W3C Discontinued Draft, 2026-02-24** | §6 — the First Rule of ARIA Use and all three circumstances, carried for provenance; not a current W3C position, and the document itself points to the APG |
| [ARIA Authoring Practices Guide, modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | §6 — the focus obligation on open and close, and the two conditions under which the close destination may differ |
| [`useId`](https://react.dev/reference/react/useId) | §6 — what `useId` is for, why hardcoded ids fail, the list-key prohibition, and the identical-tree requirement |
| [`Component`](https://react.dev/reference/react/Component) | §5 — what implementing an Error Boundary requires, the granularity guidance and its messaging-app example, and the list of what boundaries do not catch |
| [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) | §2 — extracting components and passing JSX as children · §4 — the endorsed context use cases |

**Ecosystem convention in this file**, named where it appears and never as a React-team or W3C position:
custom hooks superseding the container-and-presentational split; the compound-component pattern; and
route-change focus management. Everything else resolves to a primary source above or to `SKILL.md`.

**Not covered here.** Which library packages a pattern named above, and whether it is maintained, is a
faster-moving question than this file carries — the same line `state.md` draws: a sentence that could
become false without React changing does not belong here.
