# Project Evaluation — Performance Perspective

This perspective answers one question: is the implementation efficient relative to the problem it solves? Load this skill when evaluating project output — algorithms, queries, data transformations, network interactions — from an efficiency and resource angle.

The evaluator's job is to find performance problems, not to micro-optimize acceptable code.



---

## Core Principle

> **Efficiency is proportional to the problem, not absolute.**

A nested loop over five items is not a performance problem. The same pattern over ten thousand items at request time is. Evaluate efficiency in the context of actual data volumes, call frequency, and the system's performance envelope — not by applying a general rule that nested loops are bad.

> **Hot paths deserve scrutiny. Cold paths deserve proportionality.**

Code that runs once at startup has a different efficiency budget than code that runs for every user request or every database row. Identify which code is on the hot path and apply stricter scrutiny there.

---

## Evaluation Lenses

### Algorithm Complexity

Is the computational complexity appropriate for the scale of the problem?

Read the surrounding context to understand the expected data volumes and call patterns. An O(n²) algorithm over a collection that never exceeds a handful of elements is not a problem. The same algorithm over a collection that scales with user data — rows, events, messages — is.

Focus on asymptotic behavior relative to the inputs that actually grow. Look for nested iterations where the nesting is over the same unbounded collection, and for recursive patterns without memoization where sub-problems repeat.

### Database and Network Calls

Are queries and network calls structured for the actual access pattern?

Query structure: are queries fetching more data than needed (over-fetching columns, missing WHERE clauses, pulling related records individually when a join would work)? Are queries issued inside loops when a single batched query would suffice? N+1 query patterns — where a list is fetched and then each item triggers a follow-up query — are the most common failure here.

Caching: where the same external data is accessed multiple times within a single operation or request, is it cached? Where upstream data changes infrequently, is the absence of caching noted and intentional?

### Resource Allocation

Is resource usage proportional to the work being done?

Look for allocations inside tight loops that could be moved outside — buffers, compiled patterns, formatted strings. Look for deep copies of large structures where a reference or shallow copy would serve. Look for synchronous blocking operations in code that runs on a shared thread or event loop.

These are not always problems in isolation, but they accumulate. A deliverable that introduces several unnecessary allocations in a hot path is a meaningful regression.

### Redundant Computation

Is the same work being done more than once unnecessarily?

Redundant computation is often invisible: the same value derived multiple times from the same input, validation logic repeated at each call site instead of at the boundary, or a transformation applied inside a loop that produces the same result on every iteration. Read the code for repeated patterns that could be computed once and reused.

---

## Signals Worth Investigating

These patterns are not automatically failures, but each warrants examination:

- Iteration over a collection where each element triggers an external call
- A function called inside a loop that performs non-trivial work each time and the result does not vary with the loop variable
- A missing index on a field used in a WHERE or JOIN clause
- Memory allocated and discarded on every invocation of a frequently called function
- A synchronous file or network operation in a code path that handles concurrent requests

---

## Output Expectations

Report findings with enough specificity to be actionable: name the file and construct, describe the access pattern, and explain why the current approach creates a performance concern at realistic scale. Where scale matters, make the scale explicit — "this query runs once per row in the events table, which has X million rows."

Do not flag theoretical inefficiencies that have no realistic impact given the problem's actual scale. The goal is to catch meaningful performance regressions, not to enforce algorithmic purity.
