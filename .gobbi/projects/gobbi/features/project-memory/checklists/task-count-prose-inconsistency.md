---
name: task-count-prose-inconsistency
description: "Checklist gap: plan draft task-count prose contradicts the enumerated task list; all count prose must match the canonical 25-record table."
tags: [checklist, task-count, prose, conformance]
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
type: checklists
domain: docs-sync
status: accepted
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
---

# Plan task-count prose must match the enumerated task list — implementation checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Every prose claim of a task total must match the count of enumerated heading-level task IDs and the `task_count:` frontmatter field | novel | implemented | `rg '^### (T[0-9]\|P[0-9]\|N[0-9])' <plan-draft> \| wc -l` equals every narrative count and the staged plan's `task_count:` |
| 2 | A transitive-closure dependency claim (e.g., one task covering more records than it has direct edges) must include an explicit note naming which direct edges cover which records | novel | implemented | The dependency prose states the direct-edge-to-covered-record mapping rather than asserting a bare coverage count |

## Item details

### 1. Count prose must match the enumerated IDs and frontmatter

An early plan draft claimed "18 in-session tasks" and "20 records" while actually enumerating 22 task IDs, and the staged plan's `task_count:` disagreed with the body. Any disconnect between narrative count claims and the enumerated ID list signals either stale prose or missing records, both of which mislead a future reader sizing the work.

**Anchor reasoning:** novel — there was no prior reference for this self-consistency check; it arose from the count drift observed in this plan.

**Verification approach:** before finalizing a plan, mechanically count the heading-level task IDs with `rg '^### (T[0-9]|P[0-9]|N[0-9])' <plan-draft> | wc -l`; that count must match every prose total and the `task_count:` frontmatter field.

### 2. Transitive-closure dependency claims need an explicit mapping

When one task's direct dependency edges cover more records than the edge count (e.g., 10 direct edges covering 11 conformance records because two records chain through their split halves), the prose must name which direct edge transitively covers which extra record. A bare "covers all N" claim is unverifiable.

## Related

- [`plans/2026-05-26-dev-doc-standard-retrofit`](../plans/2026-05-26-dev-doc-standard-retrofit.md) — the plan whose final task list (25 records) this check is reconciled against
