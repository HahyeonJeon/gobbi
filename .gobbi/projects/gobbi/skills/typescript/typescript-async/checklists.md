# TypeScript Async Evaluation Checklist

This reusable unchecked source evaluates one set of asynchronous ownership and lifetime choices against the
preferences this skill owns. It is governed by the [`typescript`](../SKILL.md) domain and
[`typescript-async`](SKILL.md) preferences, with
[`typescript-development`](../typescript-development/SKILL.md) as the operation that applies them and
[`typescript-testing`](../typescript-testing/SKILL.md) as the operation that proves the resulting behavior.
The source commit that contains this file identifies the checklist version. Its stable owner prefix is
`TSASYNC`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### TSASYNC-SC-PROJECT-01 — Normal case: every started promise and acquired resource has a named owner

Ordinary asynchronous work starts promises and acquires resources that something must complete, fail, and
clean up. The expected outcome gives each of them an owner that the reader can name. The scenario fails when
work runs detached from any owner, or when a departure from these preferences leaves no lifecycle owner in
its place.

#### Checklist

- [ ] TSASYNC-CK-PROJECT-01-01 — Every started promise is awaited, returned, aggregated, or explicitly caught so its rejection has an observable owner.
- [ ] TSASYNC-CK-PROJECT-01-02 — Detached background work is used only where structured ownership through `await`, a returned promise, or an aggregate cannot carry the required lifetime.
- [ ] TSASYNC-CK-PROJECT-01-03 — Every departure from these preferences names the host or framework lifecycle owner it relies on.
- [ ] TSASYNC-CK-PROJECT-01-04 — Every departure from these preferences keeps that owner's ownership and cleanup evidence explicit.

### TSASYNC-SC-PROJECT-02 — Expected failure: the supported runtime lacks the mechanism a preference names

These preferences sit above the runtime mechanism, so a supported host may provide no cancellation, event, or
explicit-resource API. The expected outcome selects a mechanism the host actually provides and still satisfies
the ownership and cleanup obligation. Using an unconfirmed API, or dropping the obligation because the
preferred mechanism is absent, is the failure.

#### Checklist

- [ ] TSASYNC-CK-PROJECT-02-01 — No cancellation, event, or explicit-resource API is used before the supported runtime is confirmed to provide it.
- [ ] TSASYNC-CK-PROJECT-02-02 — Cleanup uses the host's explicit-resource mechanism where the supported runtime provides it and `try`/`finally` where it does not.
- [ ] TSASYNC-CK-PROJECT-02-03 — Every ownership and cleanup obligation is still satisfied under the mechanism the host actually provides.

## Structure

### TSASYNC-SC-STRUCTURE-01 — Normal case: the failure boundary sits where the `await` is placed

Where a promise is awaited decides which `try`, cleanup scope, or caller observes its rejection and which
scope protects its lifetime. The expected outcome places each `await` in the scope meant to hold it and keeps
one cleanup owner near each acquisition. An `await` outside its intended scope, or cleanup split across
scopes, is the failure.

#### Checklist

- [ ] TSASYNC-CK-STRUCTURE-01-01 — Every `await` is placed inside the `try` or resource scope intended to catch its rejection or protect its lifetime.
- [ ] TSASYNC-CK-STRUCTURE-01-02 — One cleanup owner is defined close to each acquisition.

## Performance

### TSASYNC-SC-PERFORMANCE-01 — Rule violation: concurrent work starts without a defined policy

Fan-out over a collection, a queue, or an event stream can start as much work as the input allows. The
expected outcome defines admission, ordering, and failure behavior and bounds the fan-out by a named limit.
Work started without those decisions breaks the Rule even when the run happens to complete.

#### Checklist

- [ ] TSASYNC-CK-PERFORMANCE-01-01 — No concurrent work starts without defined admission, ordering, and failure behavior.
- [ ] TSASYNC-CK-PERFORMANCE-01-02 — Every fan-out is bounded by a named concurrency limit rather than by the size of its input.

### TSASYNC-SC-PERFORMANCE-02 — Poor quality: the group's failure behavior is left to the helper's default

A concurrent group runs correctly on the happy path while its failure behavior is whatever the chosen
aggregation helper does. The expected outcome states the intended behavior and keeps every rejection
observable under it. An unstated failure mode that only the helper's implementation defines is the defect.

#### Checklist

- [ ] TSASYNC-CK-PERFORMANCE-02-01 — Every aggregate names its intended behavior among fail-fast, collect-all, and best-effort rather than inheriting the helper's default.
- [ ] TSASYNC-CK-PERFORMANCE-02-02 — Every rejection inside a concurrent group remains observable under the chosen aggregation behavior.

## Aesthetics

### TSASYNC-SC-AESTHETICS-01 — Poor quality: ownership exists but is not visible where the work starts

The code completes, fails, and cleans up correctly, but a reader cannot see who owns the work at the point it
starts, because ownership lives in a distant helper or is implied by the chosen library. The expected outcome
makes the owner and the concurrency policy readable at the site that starts the work.

#### Checklist

- [ ] TSASYNC-CK-AESTHETICS-01-01 — The owner responsible for completion, failure, and cleanup is identifiable at the point where the promise is started or the resource is acquired.
- [ ] TSASYNC-CK-AESTHETICS-01-02 — The admission, ordering, failure, and limit decisions for concurrent work are stated in the code rather than implied by the helper chosen.

## Usage

### TSASYNC-SC-USAGE-01 — Normal case: the caller can cancel, unsubscribe, and trust the payload

A consumer of asynchronous work needs to stop it, detach from it, and rely on what it delivers. The expected
outcome accepts a caller-provided cancellation signal where the host cooperates, pairs each subscription with
its unsubscription, and validates payloads that cross an external boundary. Any of those missing is the
failure.

#### Checklist

- [ ] TSASYNC-CK-USAGE-01-01 — A caller-provided cancellation signal is accepted wherever the host operation supports cooperative cancellation.
- [ ] TSASYNC-CK-USAGE-01-02 — Every event adapter pairs its subscription with its unsubscription.
- [ ] TSASYNC-CK-USAGE-01-03 — Every event payload arriving from an external boundary is validated by its adapter before use.

### TSASYNC-SC-USAGE-02 — Expected failure: the caller cancels work already in flight

Cancellation arrives after the operation started, so the caller must learn what happened and the work must
release what it holds. The expected outcome reports the cancelled outcome to its owner and stops or suppresses
according to what the chosen mechanism actually provides. A silently discarded outcome is the failure.

#### Checklist

- [ ] TSASYNC-CK-USAGE-02-01 — A cancelled operation's outcome is observable by its owner rather than silently discarded.
- [ ] TSASYNC-CK-USAGE-02-02 — The caller is given the behavior the mechanism actually provides, with stopped work distinguished from a suppressed stale result.
- Also applies: TSASYNC-CK-RISK-01-01 (resources released on cancellation).

## Consistency

### TSASYNC-SC-CONSISTENCY-01 — Normal case: the mechanism matches the behavior it is chosen for

Cancellation stops cooperating work; discarding a stale result only prevents that result from being used. The
expected outcome selects each mechanism for the failure and resource behavior it actually provides. A choice
whose named intent and actual effect disagree is the failure.

#### Checklist

- [ ] TSASYNC-CK-CONSISTENCY-01-01 — Each cancellation and each stale-result suppression is chosen for the failure and resource behavior it actually provides.
- [ ] TSASYNC-CK-CONSISTENCY-01-02 — No operation relies on stale-result suppression to obtain the stopped work or released resources that only cancellation provides.

### TSASYNC-SC-CONSISTENCY-02 — Adversarial: rejection handling that only looks like handling

A `void` operator, a discarded expression, or a `catch` that observes nothing can make a floating promise
satisfy an ownership review while its rejection still reaches no owner. The expected outcome accepts only
handling that actually observes the rejection; the appearance of handling accepted as handling is the failure.

#### Checklist

- [ ] TSASYNC-CK-CONSISTENCY-02-01 — No `void` operator is treated as rejection handling for the promise whose value it discards.
- [ ] TSASYNC-CK-CONSISTENCY-02-02 — Every `catch` offered as the owner of a rejection observes that rejection rather than only removing it from the unhandled path.

## Risk

### TSASYNC-SC-RISK-01 — Normal case: every acquired resource is released on every exit

Listeners, timers, connections, and locks survive the scope that acquired them unless something releases them.
The expected outcome releases each of them on success, failure, cancellation, and early exit. A path that
leaves any of them held is the failure.

#### Checklist

- [ ] TSASYNC-CK-RISK-01-01 — Every acquired listener, timer, connection, lock, and other cleanup-bearing resource is released on success, failure, cancellation, and early exit.
- Also applies: TSASYNC-CK-PROJECT-02-02 (the cleanup mechanism matches the supported runtime).

### TSASYNC-SC-RISK-02 — Edge case: failure or cancellation arrives during cleanup

Cleanup itself can fail or be interrupted, which is the limit case of the release obligation. The expected
outcome still releases the remaining resources and keeps the failure raised inside cleanup observable. A
partial release that stops at the first cleanup failure is the observable defect.

#### Checklist

- [ ] TSASYNC-CK-RISK-02-01 — A failure raised during cleanup does not prevent the remaining acquired resources from being released.
- [ ] TSASYNC-CK-RISK-02-02 — Every promise or rejection raised inside a cleanup scope has an observable owner.

## Overall

### TSASYNC-SC-OVERALL-01 — Poor quality: locally acceptable choices with no owner for the whole flow

Each function awaits, catches, and cleans up acceptably, yet the flow across them has no single owner, so
completion and failure cannot be traced end to end and two scopes both attempt cleanup. The expected outcome
keeps one traceable owner per flow and one cleanup owner per resource.

#### Checklist

- [ ] TSASYNC-CK-OVERALL-01-01 — Every asynchronous flow the work introduces can be traced from its start to the scope that observes its completion and failure.
- [ ] TSASYNC-CK-OVERALL-01-02 — No two scopes claim cleanup for the same resource.
