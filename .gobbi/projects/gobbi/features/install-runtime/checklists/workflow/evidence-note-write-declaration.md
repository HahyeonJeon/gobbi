---
name: evidence-note-write-declaration
description: "Every task that appends to the gitignored evidence note now declares that write in its own files list, closing a gitignore-blind scope-check gap"
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification, process]
keywords: [f3-usage-01, evidence-note, session-audit-declaration, gitignore-blind-scope-check]
author: claude
scenario: plan-usage-declared-writes
item_status: implemented
anchor: novel
implemented_in: null
---

# Every task that writes the migration evidence note declares it

## What

Any task that appends rows to the shared `4-execution/working/startup-migration-evidence.md` evidence note must
declare that write in its own `files:` list (`kind: session-audit`) and name the rows it produces in `outputs:`.

## Why

At iter2, T2, T3, T4 and T5 were each instructed to append rows to the evidence note but none declared it —
and because the note lives under the gitignored `sessions/` tree, the task-local scope check (`git diff
--name-only` + `git ls-files --others`) is STRUCTURALLY BLIND to it (`git-gate-blind-to-gitignored-writes`), so
the omission could never be caught mechanically (`F2-USAGE-01`, Medium/100).

## Verification

Every writing task now lists the evidence note in `files:` with `op: create` or `op: modify` +
`kind: session-audit`, and names its produced rows in `outputs:` (e.g. `startup-migration-evidence.md#t2-va09-trials`).
The DECLARATION is the control, since the git-based gate cannot see the write itself — verified every writing
task (T1-T9) carries the declaration.

## Status notes

Resolved. This is a plan-authoring control, not a runtime guard; Execution's task-local scope check still cannot
see the write, so the declaration remains the sole enforcement mechanism going forward.

## Related

- [[trial-row-ownership-assignment]] — the sibling declaration-completeness fix (trial rows, not evidence-note writes)
