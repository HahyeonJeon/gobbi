---
name: union-diff-must-reach-named-primitive-granularity
description: A compaction union-diff that stops at condition/footgun granularity misses dropped named APIs and parameters; diff each named primitive.
type: mistakes
scope: project
feature: null
status: superseded
created: 2026-07-14
session: 6a9e0963-2ca1-4d07-83d3-1889aa16bcf4
tags: [docs-sync, verification]
keywords: [compaction, union-diff, named-primitive, granularity, condition-level, api-preservation]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: named-primitives-must-survive-generalization
archived_at: 2026-07-26
archive_reason: superseded
related: [union-diff-occurrence-vs-distinct-primitive, gate-c-structural-mapping-is-not-semantic-union-preservation, consolidating-per-perspective-verification-tables-narrows-the-union]
---

# A compaction union-diff must reach named-primitive granularity

## What happened

Compacting python `concurrency.md` + `performance.md`, both the producer's own union
self-diff AND the Claude evaluator's union-diff ran at CONDITION / footgun granularity and
passed clean. The Codex evaluator, diffing at NAMED-PRIMITIVE granularity, caught six
operational primitives silently dropped while their parent condition survived: the
`max_workers` pool-bound mechanism, the `queue.Queue` thread-safe/no-lock property, the
`ContextVar` copied-per-context behavior, the SQL `IN (...)` batching primitive, and
`pstats.print_stats(20)`. Each was in the doc's stated union scope. iter1 REVISE → iter2
restored five (one Codex flag was a code-fence false positive) → PASS.

## Why it happens

A condition can survive as a surviving heading or clause while the named mechanism it
carried — the specific API, parameter, or property a reader actually needs (the HOW) — is
dropped inside it. A condition-level diff ("is this footgun still here?") answers yes and
reads complete, so the drop is invisible until someone diffs at the granularity of the named
primitive. A commit report that claims "every primitive survives" without running a
primitive-level diff overstates preservation (the T6 executor's report did exactly this).

## Correct approach

When the compaction brief's union scope includes named primitives, run the union-diff at
NAMED-PRIMITIVE granularity, not just condition/footgun granularity: enumerate every named
API, parameter, and operational property in the pre-trim source and confirm each survives in
the compacted doc. Restore a dropped primitive minimally into its surviving condition's
clause. Do not claim "every primitive survives" in a commit report unless a primitive-level
diff was actually run.

## How to detect

The compacted doc keeps every source heading/condition but a named API or parameter present
in the pre-trim (`max_workers`, `IN (...)`, `print_stats(20)`, a thread-safety property) is
absent from the compacted text. Tell: the union self-diff was run at the condition level
only. Enumerate every named primitive in the pre-trim and grep each in the compacted doc.

## Related

- [[union-diff-occurrence-vs-distinct-primitive]] — the paired over-flag trap: the union floor is each DISTINCT primitive surviving once, not every occurrence
- [[gate-c-structural-mapping-is-not-semantic-union-preservation]] — a structural coverage map is not a semantic union proof
- [[consolidating-per-perspective-verification-tables-narrows-the-union]] — the same union-narrowing family at table-consolidation granularity
