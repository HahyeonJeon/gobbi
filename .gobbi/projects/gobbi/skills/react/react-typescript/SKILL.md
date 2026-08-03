---
name: react-typescript
description: "MUST load when React source or tests use TypeScript, TSX, or installed React type definitions."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# React TypeScript

Use this lookup tool for React-specific TypeScript in browser applications and Electron renderers:
TSX, component props, children, events, Hooks, refs, JSX-facing values, and installed React types.

This child does not teach generic TypeScript. Load the `typescript` skill for strictness, narrowing, modules,
async behavior, resource handling, packaging, conventions, and type-level tests.

Apply the project's installed TypeScript, React, renderer, framework, configuration, and type definitions. Do not
substitute examples from another version for the types the project compiles.

## Principles

### Let the JSX boundary expose the public API

Props and children form the component's public TypeScript API. Model the values callers may actually provide
and keep invalid variants out of that API.

### Prefer inference until a boundary needs a name

React's installed types infer many Hook callbacks and inline events. Add an explicit type where extraction,
an incomplete initializer, a public prop, or a ref boundary makes the type clearer.

### Treat installed definitions as executable evidence

React APIs and their types can change independently of remembered examples. Hover, declarations, and the
project type check are the authority for the installed types.

## Rules

- **MUST inspect the installed TypeScript, React, renderer, framework, React type definitions, and `tsconfig`
  before applying this manual.** Record JSX mode, DOM libraries, strictness, module behavior, and the project
  type-check command.

- **MUST use `.tsx` for TypeScript source files that contain JSX and use the project's supported JSX compiler
  mode.** Project-authorized `.js` and `.jsx` remain valid in mixed-language projects; follow React's
  [TypeScript setup](https://react.dev/learn/typescript#installation) and the installed framework when it narrows
  the configuration.

- **MUST type component props as an object and use installed React types for React values.**
  Keep generic unions, narrowing, and public-type design with the `typescript` skill.

- **MUST type extracted event handlers for the exact element and read the stable `currentTarget` type.**
  Prefer inline inference when no extracted boundary needs an annotation.

- **MUST model ref absence and the exact target element or value type.** Include the initial null state when
  applicable, avoid render-time reads or writes, and use the exact installed React version's ref API.

- **NEVER use a broad React type to pretend the type system enforces a runtime or child-structure invariant
  it cannot express.** Validate runtime data and enforce exact child structure through component APIs and
  behavior.

## Manual

### Establish TSX configuration and installed type authority

- Inspect `tsconfig`, source extensions, React and renderer packages, installed React definitions, and
  framework-generated types.
- Require the DOM library only for browser or Electron renderer code that uses DOM types. Keep server-only
  and shared modules within their configured compilation target.
- Use the project's type-check command against the same configuration that builds the affected source.

### Type components and children

- Give a public component an explicit props object when that public API benefits callers or review. Let a small
  private component use clear local inference when it does not hide the boundary.
- Use `ReactNode` for the broad set of renderable children and `ReactElement` when the value must be an
  element, following React's [children guidance](https://react.dev/learn/typescript#typing-children).
- Do not claim TypeScript can restrict children to one component type; express that requirement with a
  narrower prop or composition API.
- Keep optional props optional and model mutually exclusive variants with the `typescript` skill.

### Type Hooks and events

- Let `useState` infer from a complete initializer. Add a type argument when the initial value is incomplete,
  such as a nullable value or a discriminated state not represented by the first value.
- Type reducer state and actions at their boundary, then require exhaustive handling through the
  `typescript` skill.
- Let inline event callbacks infer their element type. For an extracted handler, use the installed
  element-specific React event or handler type and read `currentTarget`.
- Preserve Hook call and naming rules with `react-design` and `react-conventions`; a type annotation cannot
  make an invalid Hook valid.

### Type refs and JSX-facing values

- Model DOM refs with the exact element type and their absent initial state. Avoid non-null assertions unless
  a proven lifecycle invariant makes absence impossible at that use.
- Apply the exact installed React version when a component accepts or forwards a ref; do not copy a neighboring
  version's ref-as-prop or forwarding pattern.
- Use `React.CSSProperties` for an exposed inline-style object when the project permits that public API. Keep
  CSS policy and authored styles with the CSS skill.
- Use the installed React event, element, node, ref, and JSX namespace definitions rather than hand-written
  approximations.

### Verify and recover

- Run the focused type check, affected tests, and build. Add a type-level test only when a public React type
  cannot be protected by ordinary use sites.
- When a type fails, inspect the installed declaration and the inferred call site before adding a cast.
  Repair the props, state, event, ref, boundary value, or project configuration that contains the mismatch.
- Record the exact configuration, installed type sources, command results, limitations, and any cast whose
  runtime proof remains external.

## References

- [React TypeScript Checklist](checklists.md)
