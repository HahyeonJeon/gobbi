---
name: typescript-async
description: "MUST load when a TypeScript task involves promises, cancellation, concurrency, events, cleanup, or explicit resource management."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# TypeScript Async

TypeScript Async governs responsibility and lifetime choices for asynchronous operations and resources. It applies to promises, cancellation, concurrent operations, event subscriptions, and values that require cleanup.

These preferences sit above the runtime mechanism in use. They do not assume that every named runtime supports the same cancellation, event, or explicit-resource APIs.

## Principles

### Name the responsible scope

Every started promise and acquired resource has a named function, object, or lifecycle scope responsible for completion, failure, and cleanup.

### Keep lifetime mechanisms distinct

Cancellation stops an operation when the underlying implementation cooperates; discarding a stale result only prevents that result from being used.

### Preserve the intended rejection observer

Where a promise is awaited determines which `try`, cleanup scope, or caller observes its rejection.

## Rules

- **MUST** await, return, aggregate, or explicitly catch every promise so a named caller or lifecycle scope observes its rejection.
- **NEVER** treat the `void` operator as rejection handling; it only discards the expression's value.
- **MUST** distinguish cancellation from stale-result suppression and choose each for the failure and resource behavior it actually provides.
- **MUST** release listeners, timers, connections, locks, and other resources on success, failure, cancellation, and early exit.
- **MUST** place an `await` inside the `try` or resource scope that is intended to catch its rejection or protect its lifetime.
- **NEVER** start unbounded concurrent operations without defining admission, ordering, and failure behavior.

## Preferences

- Prefer structured responsibility through `await`, a returned promise, or an aggregate over detached background operations.
- Prefer a caller-provided cancellation signal when the runtime operation supports cooperative cancellation.
- Prefer one cleanup scope close to acquisition; use the runtime's explicit-resource mechanism when it fits the supported version, otherwise use `try`/`finally`.
- Prefer a named concurrency limit and an intentional choice among fail-fast, collect-all, and best-effort behavior.
- Prefer typed event adapters that pair subscription with unsubscription and validate payloads received from an external source.

A project may depart from these preferences when its runtime or framework supplies a stronger lifecycle scope, but the responsible scope and cleanup result must remain explicit.

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
