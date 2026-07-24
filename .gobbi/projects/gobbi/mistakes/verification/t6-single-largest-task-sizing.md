---
name: t6-single-largest-task-sizing
description: A file-count-based task sizing heuristic hid a task's true output-volume and manual-verification burden, letting the plan's largest single task go unflagged.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [verification]
keywords: [f-struct-03, task-sizing-heuristic, file-count-vs-output-volume, effort-banding-origin]
author: claude
priority: medium
domain: process
supersedes: null
superseded_by: null
related: [t6-t9-effort-banding]
---

# File-count sizing heuristics hide a task's true output-volume burden

## What happened

At iter1, a task rewriting a large multi-family document was flagged as an observation, not a blocking
finding — it was the plan's largest single task by real effort, even though it touched the same small
number of files as every other task. The plan's own sizing convention at the time (files-touched count)
could not surface this, because file count is not the axis where the task's true size actually lives.

## Why it happens

"How many files does this task touch" is an easy, mechanical sizing heuristic, but it silently assumes
file count correlates with effort — true for most small doc-editing tasks, false for a task whose real
burden is OUTPUT VOLUME (many families' worth of new SOP-conformant prose) or MANUAL-VERIFICATION BURDEN
(a non-sampled, exhaustive walk over dozens of items). A sizing model anchored to the wrong axis
systematically under-flags exactly the tasks most likely to run an executor out of context mid-task.

## Correct approach

Size a task by its REAL unit of work — output volume and manual-predicate burden, not file count — and
state the sizing explicitly where an executor will read it before starting, with a named
checkpoint/continuation point for any task that will not fit in one sitting. See the companion effort-
banding fix this observation's own follow-through became.

## How to detect

A plan or task decomposition where every task's estimated effort is inferred solely from a files-touched
count, and no task states its expected OUTPUT VOLUME or the scope of any accompanying manual/non-sampled
verification walk. The signal: a task whose verification instruction includes a "no sampling" or
"exhaustive" instruction, sized the same as a one-file, one-paragraph edit.

## Related

- [[t6-t9-effort-banding]] — the fix (an explicit effort-banding table) this observation's own follow-through
  became
