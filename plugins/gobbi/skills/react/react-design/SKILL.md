---
name: react-design
description: "MUST load when choosing or reviewing React-specific component boundaries, props, composition, render, Hooks, state, Effect, identity, native interface, or Error Boundary behavior."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# React Design

Use this preference skill to choose or review React behavior for a browser application or Electron renderer
after the domain root routes the task here.

This child owns React design judgment. Development order, source conventions, tests, compiler behavior,
TypeScript integration, server/client mechanics, framework behavior, HTML, and host seams remain with their
own skills.

React Native is outside this skill. Use project-specific React Native guidance instead of applying DOM
assumptions.

## Principles

### Render is a calculation

A component calculates UI from props, state, and context. React may repeat or discard that calculation, so
render must remain pure and its inputs remain immutable snapshots.

### Own each fact once

Derive what can be calculated, store only what must persist, and give each stateful fact one narrow owner.
Duplicate state creates synchronization work and conflicting truths.

### Make escape hatches pay for themselves

Effects synchronize external systems, refs retain non-rendered values, and memoization avoids demonstrated
work or preserves required identity. None is a default replacement for ordinary React data flow.

### Bound failure and variation

Component APIs, rendered markup, Error Boundaries, and host interfaces define what may vary, cross, or fail.
Make those boundaries explicit before selecting an implementation.

## Rules

- **MUST follow the [Rules of React](https://react.dev/reference/rules).** Keep components and Hooks pure,
  treat React-owned inputs as immutable, call ordinary Hooks at the top level, and apply the documented
  [`use` exception](https://react.dev/reference/eslint-plugin-react-hooks/lints/rules-of-hooks) only inside a
  component or Hook and never inside `try`/`catch`.

- **MUST keep state minimal and give each fact one owner.** Compute renderable values during render, use keys
  that express durable identity, and lift state only to the narrowest owner that coordinates its consumers.

- **NEVER use an Effect to derive render data or handle the user action that caused a change.** Follow
  React's [Effect guidance](https://react.dev/learn/you-might-not-need-an-effect) and synchronize a named
  external system with complete dependencies, cleanup, and obsolete-result protection.

- **MUST keep privileged and host capabilities behind their approved owner.** React code consumes typed,
  limited interfaces and never expands a browser, framework, Electron, or server trust boundary.

- **MUST model Error Boundary behavior accurately.** A boundary catches descendant render failures and
  errors thrown inside a function passed to the `startTransition` function returned by `useTransition`, but
  not ordinary event-handler, server-rendering, self-boundary, or unrelated asynchronous failures, according
  to React's
  [Error Boundary reference](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

## Preferences

### Prefer the narrowest state owner

PREFER render-time derivation, then local state. Move a fact outward only when mapped consumers require shared
ownership or persistence beyond the local tree.

### Prefer components with one clear concern

PREFER a component boundary when it gives one coherent part of the interface a clear responsibility or
independent change boundary. Keep a fragment inline when extraction would only add a name and prop plumbing.

### Prefer composition for genuine variation

PREFER narrow props and composition when callers supply structural variation. Use one explicit configuration
prop when variants share the same structure and the prop states the behavior more clearly.

### Prefer focused custom Hooks

PREFER a custom Hook for reusable stateful behavior with a concrete purpose. Keep single-use logic with its
component unless extraction creates a clearer testable boundary.

### Prefer the native browser surface

PREFER native semantic elements, explicit labels, and required keyboard and focus behavior. Depart only when
no native element expresses the accepted interaction and the HTML, interface, and accessibility owners
define the substitute.

### Prefer the smallest useful Error Boundary

PREFER the smallest independently recoverable subtree with an observable fallback and recovery path. Use a
broader boundary when a framework or project owner constructs the coherent recovery surface.

## References

- [React Design Checklist](checklists.md)
