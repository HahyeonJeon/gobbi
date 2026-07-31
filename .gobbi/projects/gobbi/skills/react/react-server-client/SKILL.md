---
name: react-server-client
description: "MUST load when a React browser application or Electron renderer uses server rendering, hydration, Server Components, Server Functions, or client/server directives."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# React Server and Client

Use this lookup tool only when a compatible framework or bundler supplies React server rendering, hydration,
Server Components, Server Functions, or client/server directives. React's presence alone does not establish
those features.

This child answers module, value, endpoint, and hydration questions. `react-development` owns the work
sequence, while `react-idioms` owns React choice policy.

Apply the installed React line and the framework's supported integration; do not infer behavior from a
neighboring version or another framework.

## Principles

### Trace the exact direction

Module imports and runtime values cross different boundaries. Name the source, destination, and direction
before selecting a directive or transfer shape.

### Let the framework establish the feature

Server Components and their directives depend on framework or bundler support. The installed project
contract decides whether they exist and how they are built.

### Treat every endpoint as a trust boundary

A Server Function is remotely invokable even when trusted UI calls it. Validate, identify, authorize, and
limit disclosure on the server.

## Rules

- **MUST establish the installed React line and compatible framework or bundler support before applying this
  manual.** Use that integration's current contract when it narrows React's platform surface.

- **MUST treat [`'use client'`](https://react.dev/reference/rsc/use-client) as a module boundary.** It marks
  the module and its transitive dependencies as client code when server code imports it; keep the boundary at
  the smallest interactive subtree.

- **MUST use [`'use server'`](https://react.dev/reference/rsc/use-server) only for async Server Functions.**
  A [Server Component](https://react.dev/reference/rsc/server-components) has no directive of its own.

- **MUST check supported values for their actual direction and installed React line.** React supports nested
  content beyond JSON, but excludes unmarked ordinary functions, classes, and unsupported class instances.

- **MUST treat every Server Function argument as client-controlled.** Validate every argument, establish
  caller identity when required, authorize the exact action against current server state, and keep secrets
  and disclosure decisions on the server.

- **MUST make the first hydrated client output match the server output.** Repair mismatches under
  [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) instead of suppressing them.

## Manual

### Locate execution and module boundaries

- A `'use client'` directive begins a client module graph; a parent/child render relationship does not decide
  the execution environment.
- A [module-level `'use server'`](https://react.dev/reference/rsc/use-server) marks every exported async
  function and is required for direct client import. An inline directive marks one async function and is
  usable only when its reference crosses a framework-supported boundary such as a prop or form action.
- If client code tries to import an inline-only Server Function, treat the boundary as unsupported; move the
  function to a marked server module or pass its reference through a supported boundary.

### Check values by direction

| Direction | Supported examples | Important exclusions |
| --- | --- | --- |
| Server to client props or results ([`'use client'`](https://react.dev/reference/rsc/use-client)) | Primitives, global symbols, `Date`, supported built-ins, nested iterables and plain objects of supported values, marked Server Functions, promises, and component elements | Unmarked functions, classes and unsupported instances, null-prototype objects, and local symbols |
| Client to Server Function arguments ([`'use server'`](https://react.dev/reference/rsc/use-server)) | Primitives, global symbols, `Date`, `FormData`, supported built-ins, nested iterables and plain objects of supported values, marked Server Functions, and promises | React elements or JSX, event objects, unmarked functions, classes and unsupported instances, null-prototype objects, and local symbols |

When a value is unsupported, pass a stable identifier or smaller supported record and reconstruct the value
at its owner. Confirm the live direction-specific list rather than using `JSON.stringify` as a proxy.

### Operate Server Function endpoints

- Use [Server Functions](https://react.dev/reference/rsc/server-functions) for mutations, not general data
  fetching. A caller outside a form invokes one inside a Transition; `<form action>` and `formAction` calls
  are wrapped automatically.
- Treat expected validation failures as explicit user-visible outcomes. Keep unexpected failures observable
  at the nearest recoverable owner.
- Verify validation, applicable identity checks, exact authorization, disclosure, and failure recovery for
  every endpoint.

### Verify server output and hydration

Trace imports and values across each boundary, exercise server-rendered and hydrated output, and verify the
first client tree matches. Test the affected loading, failure, recovery, preservation, and reset paths.

## References
