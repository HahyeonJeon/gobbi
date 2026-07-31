# Go Concurrency Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Concurrency](SKILL.md). Apply it to the exact work and
returned outcomes under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### GOCON-SC-PROJECT-01 — Normal case: Concurrency serves the caller contract

The outcome has a real need for overlapping work or owned background activity. Concurrency should improve that
outcome while preserving understandable failure and shutdown behavior; unnecessary concurrency fails.

#### Checklist

- [ ] GOCON-CK-PROJECT-01-01 — Every concurrent boundary serves a named caller or resource need.
- [ ] GOCON-CK-PROJECT-01-02 — The caller can observe completion or accepted process-lifetime loss.

### GOCON-SC-PROJECT-02 — Poor quality: A synchronous operation hides goroutines

An API could complete synchronously but starts background work without giving the caller lifecycle control.
The result may function in simple cases, yet hidden failure or shutdown makes it deficient.

#### Checklist

- [ ] GOCON-CK-PROJECT-02-01 — Every hidden goroutine belongs to an abstraction that owns its complete lifetime.
- [ ] GOCON-CK-PROJECT-02-02 — Ordinary work remains synchronous when the caller should own concurrency.

## Structure

### GOCON-SC-STRUCTURE-01 — Rule violation: A goroutine has no complete lifecycle owner

A goroutine starts successfully but no object or caller can stop, cancel, join, or observe it. Every goroutine
should have one owner and terminal path; orphaned lifetime fails.

#### Checklist

- [ ] GOCON-CK-STRUCTURE-01-01 — Every goroutine has one identifiable owner, a bounded stop condition, and a retained or exposed completion observation.

### GOCON-SC-STRUCTURE-02 — Edge case: Channel closure races with active senders

Shutdown begins while one or more goroutines can still send. The sending owner should stop those senders before
closing and receivers should not claim closure authority; send-after-close or double-close fails.

#### Checklist

- [ ] GOCON-CK-STRUCTURE-02-01 — The sending owner is the only channel-closing authority, and receiver completion never closes a sender-owned channel.
- [ ] GOCON-CK-STRUCTURE-02-02 — Channel closure cannot occur while an owned sender remains able to send.

### GOCON-SC-STRUCTURE-03 — Rule violation: Request context loses its propagation contract

Request-scoped work stores context in an unrelated struct, passes nil, invents a replacement type, or discards
the caller's cancellation. Context should remain an explicit first parameter with its request lifetime intact.

#### Checklist

- [ ] GOCON-CK-STRUCTURE-03-01 — Every request context is passed explicitly as the first parameter and is never nil.
- [ ] GOCON-CK-STRUCTURE-03-02 — No replacement context discards the caller's deadline or cancellation.

## Performance

### GOCON-SC-PERFORMANCE-01 — Edge case: Work reaches queue or worker capacity

Arrival rate reaches the designed concurrent capacity. The system should apply its stated blocking, rejection,
shedding, replacement, or persistence policy; silent unbounded growth fails.

#### Checklist

- [ ] GOCON-CK-PERFORMANCE-01-01 — Every worker pool and queue has a deliberate maximum-concurrency or capacity policy.
- [ ] GOCON-CK-PERFORMANCE-01-02 — Capacity behavior preserves the stated caller contract.

### GOCON-SC-PERFORMANCE-02 — Poor quality: Fan-out or timers grow without a resource bound

The work remains correct at small scale but starts one goroutine or timer per item without a governing limit.
Resource use should remain bounded by a real capacity; scale-dependent exhaustion fails.

#### Checklist

- [ ] GOCON-CK-PERFORMANCE-02-01 — Per-item goroutine, timer, and ticker creation stays bounded by an explicit resource limit and owner.
- [ ] GOCON-CK-PERFORMANCE-02-02 — Buffering does not conceal an indefinitely slow consumer.

## Aesthetics

### GOCON-SC-AESTHETICS-01 — Poor quality: Ownership and synchronization are unreadable

The code synchronizes correctly only after a reader reconstructs hidden writer, closer, or lock assumptions.
Names and structure should make lifetime and shared-state ownership apparent; opaque concurrency fails.

#### Checklist

- [ ] GOCON-CK-AESTHETICS-01-01 — Goroutine ownership is visible at its creation site.
- [ ] GOCON-CK-AESTHETICS-01-02 — Channel direction reflects the actual send and receive roles.
- [ ] GOCON-CK-AESTHETICS-01-03 — The protected invariant is clear at each synchronization boundary.

## Usage

### GOCON-SC-USAGE-01 — Expected failure: Caller cancellation interrupts blocking work

A caller cancels or reaches its deadline while work is blocked on I/O, a channel, a wait, or a queue. The work
should observe cancellation and reach its documented terminal state; indefinite blocking fails.

#### Checklist

- [ ] GOCON-CK-USAGE-01-01 — Caller cancellation reaches every blocking operation and every request-owned concurrent branch, each of which has a cancellation or bounded completion path.
- [ ] GOCON-CK-USAGE-01-02 — Cancellation returns the documented caller-visible outcome.

### GOCON-SC-USAGE-02 — Edge case: Shutdown is called repeatedly or concurrently

More than one caller invokes shutdown, or one caller retries after a timeout. The lifecycle contract should
remain safe and understandable; double close, panic, or abandoned work fails.

#### Checklist

- [ ] GOCON-CK-USAGE-02-01 — Repeated and concurrent shutdown follow one documented result and cannot close an owned resource twice.
- [ ] GOCON-CK-USAGE-02-02 — Shutdown completion accounts for every owned goroutine.

## Consistency

### GOCON-SC-CONSISTENCY-01 — Rule violation: Lifecycle documentation and behavior disagree

The API describes cancellation, channel closure, or shutdown differently from its implementation. Callers,
tests, and code should share one lifecycle contract; contradiction fails.

#### Checklist

- [ ] GOCON-CK-CONSISTENCY-01-01 — Documented cancellation and channel-closure behavior match runtime behavior.
- [ ] GOCON-CK-CONSISTENCY-01-02 — Tests exercise the documented shutdown terminal state.

### GOCON-SC-CONSISTENCY-02 — Normal case: Race evidence matches the concurrent surface

The work returns race-detector evidence for concurrent state. Its target, workload, platform, and executed
paths should correspond to the changed behavior; unrelated or overly broad claims fail.

#### Checklist

- [ ] GOCON-CK-CONSISTENCY-02-01 — Race evidence exercises the changed shared-state paths.
- [ ] GOCON-CK-CONSISTENCY-02-02 — Race claims stay within the executed platform and workload.

### GOCON-SC-CONSISTENCY-03 — Adversarial: A lifecycle test is fitted to the observed timing

A shutdown, cancellation, or ordering test is made to pass by adding a sleep, widening a tolerance, retrying,
or accepting the timing the implementation happens to produce. The test should assert the documented lifecycle
contract, so a wrong lifecycle fails; a test fitted to observed timing agrees with the defect.

#### Checklist

- [ ] GOCON-CK-CONSISTENCY-03-01 — No lifecycle assertion depends on a sleep, retry, or widened tolerance in place of an observable completion signal.
- [ ] GOCON-CK-CONSISTENCY-03-02 — Every lifecycle assertion states the documented contract rather than the currently observed timing.

## Risk

### GOCON-SC-RISK-01 — Rule violation: Shared mutable state lacks synchronization

At least two concurrent paths access one mutable value and one can write. A memory-model-defined
synchronization edge should protect the complete invariant; scheduling luck fails.

#### Checklist

- [ ] GOCON-CK-RISK-01-01 — Every concurrent read and write of shared mutable state is protected by a memory-model-defined synchronization edge.
- [ ] GOCON-CK-RISK-01-02 — Synchronization covers the complete multi-field invariant when one exists.

### GOCON-SC-RISK-02 — Rule violation: A synchronization primitive is copied after use

A mutex, condition variable, wait group, once value, or similar primitive moves through a value copy after
becoming active. The primitive should remain in one owned object; copied synchronization state fails.

#### Checklist

- [ ] GOCON-CK-RISK-02-01 — Every synchronization primitive stays in one owned object at one stable address and is never copied after first use.

### GOCON-SC-RISK-03 — Adversarial: Input amplifies concurrent resource use

An attacker or extreme client supplies enough items, retries, or requests to maximize fan-out and queue
pressure. The design should preserve its bounds and failure policy; resource amplification fails.

#### Checklist

- [ ] GOCON-CK-RISK-03-01 — Untrusted input and retry behavior cannot push work beyond the stated concurrency bound.
- [ ] GOCON-CK-RISK-03-02 — Over-capacity input reaches the documented containment outcome.

### GOCON-SC-RISK-04 — Adversarial: A receiver or stale sender violates channel ownership

A receiver closes a channel or a sender continues after its owner declares completion. Channel ownership
should prevent both paths structurally; relying on caller goodwill fails.

#### Checklist

- [ ] GOCON-CK-RISK-04-01 — The exposed API structurally prevents a receiver from closing a sender-owned channel and a sender from outliving the owner's close decision.

### GOCON-SC-RISK-05 — Rule violation: A returned cancel function has no caller

A context constructor returns a cancel function, but no owner retains or invokes it when the owned work ends.
The creating scope should release the context resources on every terminal path; discarded cancellation fails.

#### Checklist

- [ ] GOCON-CK-RISK-05-01 — Every returned cancel function has one owner.
- [ ] GOCON-CK-RISK-05-02 — Every returned cancel function runs when its owned work ends, on every terminal path.

### GOCON-SC-RISK-06 — Normal case: An ordinary run leaves no concurrent residue

The operation completes normally under its expected load. After it returns, no owned goroutine, timer,
ticker, channel, lock, or context should remain held, and the process should be able to exit without waiting
on abandoned work; residue that only a long-running process reveals fails.

#### Checklist

- [ ] GOCON-CK-RISK-06-01 — Every goroutine, timer, ticker, and context the ordinary run created has ended or been released when the operation returns.
- [ ] GOCON-CK-RISK-06-02 — Repeating the ordinary run does not accumulate held concurrent resources.

## Overall

### GOCON-SC-OVERALL-01 — Normal case: The complete concurrent lifecycle is coherent

The work should connect justified concurrency, ownership, cancellation, bounds, synchronization, shutdown, and
evidence into one lifecycle. Any owned concurrent resource without a terminal story fails the whole.

#### Checklist

- [ ] GOCON-CK-OVERALL-01-01 — Every concurrent resource belongs to one coherent lifecycle.
- [ ] GOCON-CK-OVERALL-01-02 — Every lifecycle reaches completion, cancellation, or an accepted process lifetime.

### GOCON-SC-OVERALL-02 — Adversarial: A clean race run masks a leak or unexecuted race

Current race tests pass, but an unexecuted path can race or an ownerless goroutine can leak without a data
race. Tool success must not replace ownership review; cosmetic race safety fails.

#### Checklist

- [ ] GOCON-CK-OVERALL-02-01 — Acceptance is not based solely on a clean race-detector run.
- [ ] GOCON-CK-OVERALL-02-02 — Unexecuted concurrent paths still have explicit synchronization.
- [ ] GOCON-CK-OVERALL-02-03 — Race-free goroutines still satisfy lifecycle ownership.
