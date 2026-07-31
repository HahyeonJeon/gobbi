---
name: react
description: "MUST load before writing or reviewing React for a browser application or Electron renderer. React is a domain skill that routes applicable operation, tool, and preference children."
allowed-tools: Read
skill-type: domain
---

# React

React is the domain for implementing or reviewing browser applications and Electron renderers that use
React. React Native requires project-specific guidance.

This root owns navigation only. Load every child whose trigger applies.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`react-development`](react-development/SKILL.md) | operation | MUST load when implementing or reviewing one scoped React change for a browser application or Electron renderer. |
| [`react-idioms`](react-idioms/SKILL.md) | preference | MUST load when choosing or reviewing React-specific render, Hooks, state, Effect, identity, compiler, TypeScript seam, or Error Boundary behavior. |
| [`react-server-client`](react-server-client/SKILL.md) | tool | MUST load when a React browser application or Electron renderer uses server rendering, hydration, Server Components, Server Functions, or client/server directives. |
