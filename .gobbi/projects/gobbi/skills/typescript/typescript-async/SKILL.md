---
name: typescript-async
description: "MUST load when TypeScript work involves promises, cancellation, concurrency, events, cleanup, or explicit resource management."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# TypeScript Async

TypeScript Async governs ownership and lifetime choices for asynchronous work and resources. It applies to promises, cancellation, concurrent work, event subscriptions, and values that require cleanup.

These preferences sit above the runtime mechanism in use. They do not assume that every host supports the same cancellation, event, or explicit-resource APIs.

## Principles

### Make ownership visible

Every started promise and acquired resource has an owner responsible for completion, failure, and cleanup.

### Keep lifetime mechanisms distinct

Cancellation stops work when the underlying operation cooperates; discarding a stale result only prevents that result from being used.

### Preserve the intended failure boundary

Where a promise is awaited determines which `try`, cleanup scope, or caller observes its rejection.

## Rules

- **MUST** await, return, aggregate, or explicitly catch every promise so its rejection has an observable owner.
- **NEVER** treat the `void` operator as rejection handling; it only discards the expression's value.
- **MUST** distinguish cancellation from stale-result suppression and choose each for the failure and resource behavior it actually provides.
- **MUST** release listeners, timers, connections, locks, and other resources on success, failure, cancellation, and early exit.
- **MUST** place an `await` inside the `try` or resource scope that is intended to catch its rejection or protect its lifetime.
- **NEVER** start unbounded concurrent work without defining admission, ordering, and failure behavior.

## Preferences

- Prefer structured ownership through `await`, a returned promise, or an aggregate over detached background work.
- Prefer a caller-provided cancellation signal when the host operation supports cooperative cancellation.
- Prefer one cleanup owner close to acquisition; use the host's explicit-resource mechanism when it fits the supported runtime, otherwise use `try`/`finally`.
- Prefer a named concurrency limit and an intentional choice among fail-fast, collect-all, and best-effort behavior.
- Prefer typed event adapters that pair subscription with unsubscription and validate payloads arriving from an external boundary.

A project may depart from these preferences when its host or framework supplies a stronger lifecycle owner, but the owner and cleanup evidence must remain explicit.

The harness compiles this partial teaching fragment with its declared prelude:

```ts prelude key=async-owner
interface Task {
  run(signal: AbortSignal): Promise<void>;
}
```

```ts partial key=async-owner
async function runOwned(task: Task, signal: AbortSignal): Promise<void> {
  await task.run(signal);
}
```

## References
