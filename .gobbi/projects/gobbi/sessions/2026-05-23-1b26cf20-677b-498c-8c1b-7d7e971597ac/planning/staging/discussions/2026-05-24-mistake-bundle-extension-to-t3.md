---
date: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
loop: planning
feature: session-foundations-bundle-b
topic: T3 mistake bundle — extend all 3 T1 mistakes or Iron Law 7 only?
outcome: Iron Law 7 procedural mistake only for T3 tasks (LOCK #3); other 2 T1 mistakes not extended
---

# T3 mistake bundle extension (LOCK #3)

## Context

Preparation D-3 mandated a 3-mistake bundle for all T1 task briefs. The leader asked whether the same bundle should extend to T3 tasks, or whether only the Iron Law 7 procedural mistake applies.

## Question

Should T3 tasks (07-10) receive the full 3-mistake T1 bundle, or a narrower subset?

## Options considered

1. **Full 3-mistake bundle for T3** — consistent with T1; all three mistakes always loaded.
2. **Iron Law 7 mistake only for T3** (recommended) — `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` applies; the other two (cwd routing, rm -rf safety) are inapplicable to T3 surfaces.

## User decision

Iron Law 7 procedural mistake only confirmed (LOCK #3, narrowed from the leader's 3-mistake recommendation).

## Rationale

- `codex-eval-session-write-path-nested-in-worktree.md`: guards cwd routing for session writes. T3 tasks (hook script, reconstructor, settings.json, delegation headers) do not write to session paths. Inapplicable.
- `manager-rm-rf-without-investigating-tracked-files.md`: guards against destructive rm operations without investigation. T3 tasks do not remove files. Inapplicable.
- `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`: guards against paraphrasing "verbatim" spec content without re-reading. T3 tasks involve verbatim citation of hook stdin contract, structured-header regexes, and JSON schema field names. Directly applicable.

## Implication

T1 task briefs (Tasks 01-06): all three mistakes in tier-4. T3 task briefs (Tasks 07-10): Iron Law 7 mistake only in tier-4. Per-task additions allowed on top.

## Related

- draft-iter2.md:431-443 (§ Agent assignment table — LOCK #3 rationale)
- preparation/staging/decisions/planning-brief-mistake-load-directives-for-t1.md
