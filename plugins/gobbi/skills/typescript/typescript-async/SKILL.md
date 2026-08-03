---
name: typescript-async
description: "MUST load when a TypeScript task involves promises, cancellation, concurrency, events, cleanup, or explicit resource management."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# TypeScript Async

TypeScript Async governs who observes asynchronous results and which code releases acquired resources. It applies to promises, cancellation, concurrent operations, event subscriptions, and values that require cleanup.

These preferences sit above the runtime mechanism in use. They do not assume that every named runtime supports the same cancellation, event, or explicit-resource APIs.

## Principles

### Name who observes and releases

Every started promise has a named caller, function, object, or framework callback that observes completion and failure. Every acquired resource has a named code path that releases it.

### Keep lifetime mechanisms distinct

Cancellation stops an operation when the underlying implementation cooperates; discarding a stale result only prevents that result from being used.

### Preserve the intended rejection observer

Where a promise is awaited determines which `try` block or caller observes its rejection.

## Rules

- **MUST** await, return, aggregate, or explicitly catch every promise so a named caller, function, object, or framework callback observes its rejection.
- **NEVER** treat the `void` operator as rejection handling; it only discards the expression's value.
- **MUST** distinguish cancellation from stale-result suppression and choose each for the failure and resource behavior it actually provides.
- **MUST** release listeners, timers, connections, locks, and other resources on success, failure, cancellation, and early exit.
- **MUST** place an `await` inside the `try` block or function that must catch its rejection or retain its resources until completion.
- **MUST** define admission, ordering, and failure behavior for every concurrent group and either set a named
  concurrency limit justified by named local and remote capacity constraints or record evidence that its
  maximum admitted operation count and per-operation resource demand fit those constraints.

## Preferences

- Prefer structured responsibility through `await`, a returned promise, or an aggregate over detached background operations.
- Prefer a caller-provided cancellation signal when the runtime operation supports cooperative cancellation.
- Prefer one release path close to acquisition; use the runtime's explicit-resource mechanism when it makes that path clearer, otherwise use `try`/`finally`.
- Prefer a named concurrency limit derived from the most restrictive measured local or remote capacity when
  per-operation demand or available capacity can vary. Depart only when recorded maximum admission and
  resource measurements establish that the full group fits every named capacity constraint. Choose fail-fast,
  collect-all, or best-effort behavior intentionally.
- Prefer typed event adapters that pair subscription with unsubscription and validate payloads received from an external source.

A project may depart from these preferences when another design makes observation or release clearer. The departure must name who observes completion and failure and which code releases each resource.

The fenced TypeScript example below passes with TypeScript 5.9.3, 6.0.3, and 7.0.2 under
`--noEmit --strict --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2022`. These compiler
checks do not prove arbitrary project `tsconfig.json`, runtime, or installed-package behavior.

This self-contained example returns the promise to its caller so the caller observes completion and failure:

```ts
interface CancellationSignal {
  readonly aborted: boolean;
}

interface Task {
  run(signal: CancellationSignal): Promise<void>;
}

async function runOwned(task: Task, signal: CancellationSignal): Promise<void> {
  await task.run(signal);
}
```

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for changes
  governed by this skill.
