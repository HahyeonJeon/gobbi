---
name: react
description: "MUST load before working in React. React is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# React

React covers design, implementation, test creation or revision, and review for browser applications and
Electron renderers that use React. React Native requires project-specific guidance.

This root provides navigation only. Load every child whose trigger applies.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`react-compiler`](react-compiler/SKILL.md) | tool | MUST load when React Compiler configuration, diagnostics, coverage, migration, memoization, or compiler-related performance is in scope. |
| [`react-conventions`](react-conventions/SKILL.md) | preference | MUST load when naming, defining, exporting, moving, organizing, or reviewing React components, Hooks, or JSX files. |
| [`react-design`](react-design/SKILL.md) | operation | MUST load when designing React-specific component structure, props, composition, render, Hooks, state, Effects, identity, native interface, or Error Boundary behavior. |
| [`react-development`](react-development/SKILL.md) | operation | MUST load when implementing one scoped React change for a browser application or Electron renderer. |
| [`react-server`](react-server/SKILL.md) | tool | MUST load when a React browser application or Electron renderer uses server rendering, hydration, Server Components, Server Functions, or client/server directives. |
| [`react-testing`](react-testing/SKILL.md) | operation | MUST load when creating or revising React component or Hook tests. |
| [`react-typescript`](react-typescript/SKILL.md) | tool | MUST load when React source or tests use TypeScript, TSX, or installed React type definitions. |
