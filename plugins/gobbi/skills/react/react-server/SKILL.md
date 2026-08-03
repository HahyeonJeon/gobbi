---
name: react-server
description: "MUST load when a React browser application or Electron renderer uses server rendering, hydration, Server Components, Server Functions, or client/server directives."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# React Server

Use this lookup tool only when a compatible framework or bundler supplies React server rendering, hydration,
Server Components, Server Functions, or client/server directives. React's presence alone does not establish
those features.

This child answers module, value, endpoint, hydration, and server/client boundary performance questions.
`react-development` remains responsible for the work sequence, while `react-design` remains responsible for
React choice policy.

Apply the exact installed React version and the framework's supported integration; do not infer behavior
from a neighboring version or another framework.

## Principles

### Trace the exact direction

Module imports and runtime values cross different boundaries. Name the source, destination, and direction
before selecting a directive or transfer representation.

### Let the framework establish the feature

Server Components and their directives depend on framework or bundler support. The installed framework or
bundler configuration decides whether they exist and how they are built.

### Treat every endpoint as a trust boundary

A Server Function is remotely invokable even when trusted UI calls it. Validate, identify, authorize, and
limit disclosure on the server.

### Measure server/client boundary cost

Module boundaries and directives can change the server/client graph, shipped client code, and transferred
data. Compare a named build or interaction in a recorded environment before drawing a performance conclusion.

## Rules

- **MUST establish the exact installed React version and compatible framework or bundler support before
  applying this manual.** Use that integration's current guidance when it narrows React's platform features.

- **MUST treat [`'use client'`](https://react.dev/reference/rsc/use-client) as a module boundary.** It marks
  the module and its transitive dependencies as client code when server code imports it; default to the
  smallest interactive subtree and expand only for installed framework support, a required dependency, or
  measured transfer cost with a named build or interaction, environment, baseline, comparison, and supported
  conclusion.

- **MUST use [`'use server'`](https://react.dev/reference/rsc/use-server) only for async Server Functions.**
  A [Server Component](https://react.dev/reference/rsc/server-components) has no directive of its own.

- **MUST check supported values for their actual direction and exact installed React version.** React supports nested
  content beyond JSON, but excludes unmarked ordinary functions, classes, and unsupported class instances.

- **MUST treat every Server Function argument as client-controlled.** Validate every argument, establish
  caller identity when required, authorize the exact action against current server state, and keep secrets
  and disclosure decisions on the server.

- **MUST repair every avoidable mismatch between the first hydrated client output and the server output.**
  Under [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot), use
  `suppressHydrationWarning` only for a genuinely unavoidable text or attribute mismatch on one element and
  rely on it only one level deep.

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
in the receiving module that has the required data. Confirm the live direction-specific list rather than
using `JSON.stringify` as a proxy.

### Operate Server Function endpoints

- Follow the [`'use server'` Server Function API contract](https://react.dev/reference/rsc/use-server): use Server
  Functions for mutations, not general data fetching. Invoke them inside a Transition outside forms;
  `<form action>` and `formAction` provide Transition wrapping.
- Treat expected validation failures as explicit user-visible outcomes. Keep unexpected failures observable
  at the nearest recoverable error handler.
- Verify validation, applicable identity checks, exact authorization, disclosure, and failure recovery for
  every endpoint.

### Measure server/client graph and transfer cost

- Ordinary client render profiling remains in `react-development`. This tool owns measurement of server/client
  module graph cost, shipped client bundle or transfer cost caused by boundaries or directives, and comparable
  server/client transfer.
- Name the build or interaction, environment, baseline, and comparison for every measurement. Record the
  supported conclusion and keep it within the measured module graph, shipped code, or transferred data.
- Use comparable inputs and units when comparing server and client transfer. Do not present an installed
  directive, build success, or module graph alone as a measured performance result.

### Verify server output and hydration

Trace imports and values across each boundary, exercise server-rendered and hydrated output, and verify the
first client tree matches. Repair every avoidable mismatch; bounded `suppressHydrationWarning` use is an
escape hatch for an unavoidable one-element, one-level text or attribute difference, not a repair. Test the
affected loading, failure, recovery, preservation, and reset paths.

## References

- [React Server Checklist](checklists.md)
