---
name: react-conventions
description: "MUST load when naming, defining, exporting, moving, organizing, or reviewing React components, Hooks, or JSX files."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# React Conventions

Use this preference skill when a React change creates, names, exports, moves, or reorganizes components,
Hooks, or JSX files in a browser application or Electron renderer.

This child owns React-specific source conventions. The project and its language, formatter, linter, framework,
and module owners decide generic layout and tooling conventions.

React Native is outside this skill. Use the project's React Native convention instead.

## Principles

### Let semantics lead spelling

React uses names and definition sites to distinguish components, Hooks, and host elements. A convention that
changes those signals can change behavior rather than style.

### Follow the project before adding a fallback

Existing source and configured tools are the local convention. Use a React fallback only when the project has
no established answer.

### Keep related source easy to find

A file boundary should help a reader locate one coherent unit and its private support. Split or promote a
unit when independent reuse or scanning cost supplies evidence.

## Rules

- **MUST name components with an initial capital and custom Hooks with `use` followed by a capital letter.**
  These names let React and its linter distinguish components and Hooks from ordinary functions, as described
  in React's [custom Hook guidance](https://react.dev/learn/reusing-logic-with-custom-hooks#hook-names-always-start-with-use).

- **MUST define components and Hooks at module scope rather than inside another component or Hook.** Nested
  definitions create a new component identity and reset state, as React's
  [component guidance](https://react.dev/learn/your-first-component#nesting-and-organizing-components)
  explains.

- **MUST write valid JSX.** Return one root or Fragment, close every tag, use React's attribute names, and
  preserve dashed `aria-*` and `data-*` attributes under the
  [JSX rules](https://react.dev/learn/writing-markup-with-jsx).

- **MUST give component functions and their files meaningful names.** Avoid anonymous component exports that
  hide useful names from stacks and debugging, following React's
  [import and export guidance](https://react.dev/learn/importing-and-exporting-components).

- **MUST follow established project choices for exports, filename casing, directories, imports, and
  formatting.** Never introduce a second convention or present a project preference as a React requirement.

## Preferences

### Prefer a file name that reveals its primary unit

PREFER naming a component or Hook file for its primary named export when the project has no conflicting
filename convention. Depart when a framework owns the filename or the file intentionally groups related
units.

### Prefer local colocation

PREFER keeping a unit's private test, style, and narrow helper beside the unit when the project permits it.
Move shared material only after another consumer or a project boundary proves broader ownership.

### Prefer a readable file boundary

PREFER keeping small, tightly related components together. Split a file when it becomes hard to scan or one
unit gains an independent reuse or change boundary.

### Prefer one project export style

PREFER the surrounding module's default-versus-named export convention. Either form is valid when imports and
exports correspond; consistency is more useful than a React-wide mandate.

### Prefer configured automation

PREFER the project's formatter and lint rules for whitespace, import order, and mechanical JSX layout. Do not
replace tool output with hand-maintained prose rules.

## References

- [React Conventions Checklist](checklists.md)
