---
name: go-concurrency
description: "Load when working with goroutines, channels, context.Context, sync, atomics, timers, concurrent ownership, cancellation, shutdown, backpressure, or race safety."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# Go Concurrency

Use this preference skill when designing or reviewing goroutines, channels, contexts, synchronization,
atomics, timers, concurrent queues, cancellation, or shutdown. It helps make ownership and completion visible
at every concurrent boundary.

This skill owns concurrent lifetime and race safety, not general API shape or test procedure. `go-design`
owns ordinary resources, `go-testing` owns concurrency evidence, and `go-toolchain` owns race-detector commands.

## Principles

### Concurrency needs an owner

Every goroutine, channel, timer, queue, and cancellation function needs one owner responsible for ending it.
If no caller can name completion and shutdown, the design is incomplete.

### Share communication or state deliberately

Channels coordinate ownership transfer and events; locks protect shared state and invariants. Choose from the
problem's semantics instead of treating either mechanism as universally better.

### Cancellation is part of the contract

Request-scoped work must stop when its request stops, and long-lived work needs an explicit lifecycle.
Cancellation that is not propagated, observed, or joined only creates the appearance of control.

### Race freedom precedes scheduling luck

Unsynchronized conflicting access is incorrect even when tests usually pass. The
[Go memory model](https://go.dev/ref/mem) defines the synchronization relationships on which visibility may
rely.

## Rules

- **MUST assign an owner, stop condition, cancellation path, and completion observation to every goroutine.**
  A function that starts background work must expose or retain the means to stop and join it.
- **MUST synchronize every mutable value accessed concurrently when at least one access can write.** Use a
  channel, mutex, atomic operation, immutable handoff, or another memory-model-defined synchronization edge.
- **MUST pass a request `context.Context` explicitly as the first parameter and never pass nil.** Propagate
  cancellation and deadlines without storing the context in a struct unless an owning API explicitly requires
  that lifetime.
- **MUST call each returned cancel function when the work that owns it ends.** Ensure blocking sends, receives,
  waits, and I/O can observe cancellation or another bounded completion condition.
- **MUST make channel closure the responsibility of the sending owner.** A receiver must not close a channel
  merely because it is done receiving, and a channel must not be closed as a substitute for stopping senders.
- **NEVER copy a mutex, condition variable, wait group, once value, or another synchronization primitive after
  first use.** Store it in one owned object and use pointers when that object must be shared.

## Preferences

### Synchronous APIs and goroutine ownership

PREFER a synchronous API unless the abstraction genuinely owns background work or concurrency is part of its
caller contract. Let callers decide whether to launch ordinary work in a goroutine; hidden goroutines make
failure, cancellation, and shutdown hard to compose.

When an abstraction owns goroutines, PREFER one lifecycle object that starts them, records the first material
failure, cancels siblings, waits for completion, and makes repeated shutdown behavior clear. A fire-and-forget
goroutine is acceptable only for process-lifetime telemetry or similar work whose loss and inability to join
are explicitly accepted.

### Context propagation

PREFER `context.Context` only for deadlines, cancellation, request-scoped credentials, and request-scoped
values that cross API boundaries, following the [`context` package contract](https://pkg.go.dev/context).
Pass ordinary configuration and dependencies as ordinary parameters, never invent a custom context type, and
do not use `context.Background()` to discard a caller's cancellation.

PREFER not to store context in a struct. The
[Go guidance on contexts and structs](https://go.dev/blog/context-and-structs) permits exceptions when an
existing API or a lifetime-owning object makes per-method context impractical; document that lifetime and do
not mix unrelated requests in the same stored context.

### Channels, locks, and atomics

PREFER a channel when work, ownership, or an event moves between goroutines. PREFER a mutex when several fields
form shared state with one invariant, and keep the locked region small but complete; use atomics only for a
simple independent value whose memory ordering remains easy to explain.

PREFER the owner that creates and sends on a channel to decide when no more values can arrive and close it when
receivers need that signal. Leave a channel open when its lifetime ends with the owning object or context and
no receiver needs closure to make progress.

### Bounds and backpressure

PREFER bounded worker counts, queue sizes, and retry concurrency derived from a real resource limit. State
what happens at capacity—block, reject, shed, replace, or persist—and avoid unbounded goroutine fan-out even
when each item appears small.

Use a buffered channel only when the buffer represents deliberate burst tolerance or decoupling. Do not use
buffering to hide a slow consumer or a shutdown deadlock; measure the queue and preserve backpressure.

### Timers, tickers, and shutdown

PREFER `time.NewTimer` or `time.NewTicker` when work may end before the timer source, and stop what the owner no
longer needs. Account for already-fired values and reset semantics under the project's supported Go version;
avoid creating an unbounded series of timers in a loop.

PREFER shutdown that stops intake, cancels outstanding work, waits for owned goroutines, releases resources,
and returns an error or timeout to the caller. Make repeated or concurrent shutdown calls safe when the public
contract permits them.

### Race evidence

PREFER the race detector on tests and executable paths that exercise shared state. Its report is strong
evidence of a defect, but a clean run covers only executed paths and cannot prove the absence of races; the
[race detector guide](https://go.dev/doc/articles/race_detector) states this runtime coverage boundary.

Review ownership and synchronization even when `go test -race` passes. Include production-like workload paths
when practical, and treat unsupported target platforms or prohibitive runtime cost as explicit evidence gaps
rather than silent success.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
