---
name: reproducing-a-bugged-command-is-not-validation
description: Evaluators who re-run a command with a flawed predicate confirm only that the command is deterministic — not that its predicate matches its declared scope. Multiple evaluators agreeing on a metric derived from one shared command does not verify the metric is correct.
type: mistakes
scope: project
feature: project-memory
status: active
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [process, evaluation, metrics, predicates]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Reproducing a bugged command is not validation of the result

## What went wrong

The Ideation counts (208 files / 191 content docs / 59 leak files) passed TWO consecutive dual-system evaluation rounds without correction. The `find` predicate used to produce those counts included `-not -path "*/agents/*"`, which wrongly excluded the entire in-scope `features/agents/` capability feature (14 docs, 4 leak files). The true baseline was 222 / 204 / 63. Both evaluators "reproduced" the numbers by re-running or reasoning from the same predicate — they matched each other but not reality.

Planning caught the error only by reasoning about scope-vs-filter: `features/agents/` is a named in-scope feature but the predicate excluded it. The count correction was NOT a scope change.

## Why it went wrong

Evaluators treated command-reproduction as validation. Re-running a command verifies that the command is deterministic — NOT that the command's predicate matches its declared intent. When multiple evaluators agree on a number derived from one shared command, they have verified only that the command is stable, not that it is correct. The predicate (globs, exclusions, filters) is itself an auditable artifact that requires independent scrutiny.

## How to recognize this situation

Any metric or count defined by a command whose exclusion set or filter predicate has not been independently audited against the declared scope. Specific signals:

- Multiple evaluators agree on a metric but the only verification was "I re-ran the command."
- The command contains `-not -path`, `-exclude`, `--include`, or `| grep -v` clauses whose scope boundary has not been cross-checked against the declared in-scope set.
- The metric's denominator is a file-set claim ("222 docs in scope") where the count command's exclusion list was not audited for inadvertent exclusion of in-scope items.

## Corrected approach

When validating a count or metric:

1. **Audit the predicate** against the declared scope: for every exclusion in the command, ask "does this exclusion match the Out-of-Scope declaration exactly, or could it also exclude in-scope items?"
2. **Cross-check with an independently-constructed query**: derive a second command from the scope declaration without looking at the first command, then compare outputs.
3. **Enumerate the exclusion set**: for any `find` or `grep` command with `-not -path`, enumerate the dirs that the exclusion actually matches and verify they are all out-of-scope.

Do not accept "I reproduced the same number" as evidence that the number is correct when both reproductions use the same predicate.
