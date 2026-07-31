---
name: react-idioms
description: "MUST load when choosing or reviewing React-specific render, Hooks, state, Effect, identity, compiler, TypeScript seam, or Error Boundary behavior."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# React Idioms

Use this preference skill to choose or review React-specific behavior in a browser application or Electron
renderer after the React domain root routes the task here.

This child owns the valid React choice space and its defaults. `react-development` owns the ordered work
outcome, while `react-server-client`, framework, HTML, interface, accessibility, and host skills own their
platform depth.

React Native is outside this skill. Use project-specific React Native guidance instead of applying DOM
assumptions.

## Principles

### Render is a calculation

A component calculates UI from props, state, and context. React may repeat or discard that calculation, so
render must remain pure and inputs are immutable snapshots.

### Own each fact once

Derive what can be calculated, store only what must persist, and give each stateful fact one narrow owner.
Duplicate state creates synchronization work and conflicting truths.

### Make escape hatches pay for themselves

Effects synchronize external systems; memoization avoids demonstrated work or preserves required identity.
Neither mechanism is a default way to structure ordinary React data flow.

### Boundaries define correctness

Component APIs, rendered markup, Error Boundaries, and host interfaces limit what may cross and what may fail.
Make those limits visible before choosing an implementation.

## Rules

- **MUST follow the [Rules of React](https://react.dev/reference/rules).** Keep components and Hooks pure, call
  Hooks only at the top level of capitalized components or custom Hooks
  [whose names start with `use` followed by a capital letter](https://react.dev/learn/reusing-logic-with-custom-hooks#hook-names-always-start-with-use),
  and treat React inputs as immutable.

- **MUST keep state minimal and give each fact one owner.** Compute renderable values during render, use keys
  that express durable identity, and lift state only to the narrowest owner that coordinates its consumers.

- **NEVER use an Effect to derive render data or handle the user action that caused a change.** Follow React's
  [Effect guidance](https://react.dev/learn/you-might-not-need-an-effect): synchronize a named external system
  with complete dependencies, cleanup, and protection from obsolete asynchronous results.

- **MUST let actual [React Compiler](https://react.dev/learn/react-compiler/introduction) coverage govern
  memoization.** Record the configured
  [`compilationMode`](https://react.dev/reference/react-compiler/compilationMode), establish whether each
  affected function is compiled, and change manual memoization only with focused evidence.

- **MUST let installed React types own the TypeScript seam.** Use them for props, children, events, refs, and
  JSX-facing values; keep generic type design and narrowing with the `typescript` skill.

- **MUST model Error Boundary behavior accurately.** A boundary catches descendant render failures and errors
  thrown inside the function passed to `startTransition`, and shows a fallback; it does not catch ordinary
  event-handler, server-rendering, self-boundary, or unrelated asynchronous failures, which must route to
  their actual owners according to React's
  [Error Boundary reference](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

## Preferences

### Prefer the narrowest state owner

PREFER render-time derivation, then local state. Move a fact to an accepted shared store or server cache only
when mapped consumers require shared ownership or persistence beyond the local tree.

### Prefer composition for genuine variation

PREFER narrow props and composition when callers supply real structural variation. Use one explicit
configuration prop instead when the variants share the same structure and that prop makes the behavior
clearer.

### Prefer custom Hooks for reusable stateful behavior

PREFER a custom Hook when stateful React behavior has multiple consumers. Keep single-use logic with its
component unless extraction produces a clearer tested boundary rather than a renamed helper.

### Prefer compiler memoization inside proven coverage

PREFER the React Compiler for functions proven to be compiled. Add or preserve `memo`, `useMemo`, or
`useCallback` only when measurement, a required identity consumer, or a documented compiler escape hatch
justifies departure.

### Prefer the native browser surface

PREFER native semantic elements, explicit labels, and the required keyboard and focus behavior. Depart only
when no native element expresses the accepted interaction and the HTML, interface, and accessibility owners
define the substitute.

### Prefer the smallest useful Error Boundary

PREFER the smallest independently recoverable subtree with an observable fallback and recovery path. Use a
broader boundary when a framework or project owner constructs the coherent recovery surface.

## References
