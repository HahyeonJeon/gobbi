---
name: gobbi-evaluation-performance
description: Load when evaluating output that affects performance-sensitive paths — algorithms, data structures, database queries, network calls, caching, or hot-path logic. Examines efficiency, scalability, resource usage, and latency.
allowed-tools: Read, Grep, Glob, Bash
---

# Evaluation Perspective: Performance

This perspective examines whether the output will perform acceptably under realistic load — not just whether it works correctly for a single input. Performance problems that are invisible at development scale become visible when the system is used as intended.

Performance perspective is most relevant at execution. It rarely adds signal at ideation unless performance is the core problem being solved. At plan, it is relevant only when the plan involves performance-sensitive design decisions.

---

## What This Perspective Examines

### Efficiency of Core Logic

The way an algorithm or data structure is chosen determines the cost ceiling for all calls that use it. An O(n²) operation in a hot path, a linear scan where a hash lookup would work, or a sort inside a loop — these are not stylistic concerns. They set a hard limit on how the system will behave as inputs grow.

Evaluating efficiency means identifying the operations that will run frequently or at large scale, then examining whether their implementation is appropriate for that use. Operations that run once at startup warrant different analysis than operations called per request or per item.

### Scalability Under Load

A system that works correctly for small inputs but degrades unacceptably at production scale has a performance defect. Scalability issues include: state that grows unboundedly as requests accumulate, resources that are not released, contention on shared resources that becomes a bottleneck under concurrent access, and serial operations that should be parallelized.

The question to ask is: as the number of users, records, or requests grows by an order of magnitude, what happens to the cost of the operations this output introduces?

### Resource Usage

Resources include memory, file descriptors, network connections, and database connections. Code that allocates resources must release them. Code that allocates resources repeatedly should consider whether reuse is appropriate. Unnecessary allocations in hot paths add garbage collection pressure.

Evaluate whether new resources introduced by the output are bounded, released on completion (including error paths), and sized proportionally to the workload.

### Hot Path Awareness

Not all code runs equally often. A function called once per server startup has a different performance budget than a function called on every HTTP request. The same operation that is acceptable in a cold path may be unacceptable in a hot path.

Evaluating hot path awareness means identifying where this code will sit in the call graph — is it initialization code, request-handling code, or inner-loop code? The appropriate performance concern changes dramatically based on the answer.

### Latency Characteristics

Latency problems often come from synchronous blocking operations on inherently asynchronous or slow resources: a database query that runs synchronously in a loop, a network call that blocks a thread, a file read inside a request handler. Identifying these patterns requires understanding what operations are involved and where they live relative to the request lifecycle.

---

## Stage Relevance

At **ideation**, performance perspective adds signal only when performance is the core concern motivating the work — a task to reduce latency, improve throughput, or fix a scalability issue. For general feature work, the performance implications of an idea are speculative and confidence in findings will be low.

At **plan**, performance perspective is relevant when the plan includes choices about data structures, caching strategies, query patterns, or other design decisions with performance implications. These choices, once committed to, constrain the implementation.

At **execution**, performance perspective is most productive. The actual implementation can be read and analyzed. Hot paths can be traced. Query patterns can be examined. Resource allocation can be verified. Grep for loops, allocations, and synchronous calls in the context of the request lifecycle.

For documentation-only or UI/visual tasks, performance perspective adds no signal and should be omitted.

---

## Scoring From This Perspective

Performance findings should be anchored to evidence, not speculation. A finding that a linear scan occurs on a collection where the size is known to be large is higher confidence than a finding that a particular approach "might have performance issues." Grep for the pattern; read the surrounding code to understand the scale.

Confidence in performance findings is significantly increased when benchmarks, profiling results, or known scale requirements are available in the codebase or task description. Without that context, assessments of "this will be slow" are inherently lower confidence and should be scored accordingly.

Severity should reflect the realistic likelihood of the performance concern manifesting given the task's context. A potential quadratic operation on a dataset that will never exceed 10 items in practice is low severity. The same operation on a dataset proportional to user count is high severity.

When a performance concern is theoretical but the remediation is low-cost, note it as a suggestion rather than a blocker. Reserve high-severity findings for patterns where the performance cost is likely to be observable and the fix is non-trivial to apply retroactively.
