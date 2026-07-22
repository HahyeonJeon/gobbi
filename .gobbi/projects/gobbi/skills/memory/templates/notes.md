# `notes/`

> Evaluated session handoffs. One project-scoped note preserves the agreed outcome, evidence, durable changes, decisions, risks, recovery state, and exact next-session start point.

## Core principles

> **Write one evidence-backed body that both session and durable readers receive unchanged.**

A handoff is not a recollection of the session. Each completion, decision, risk, unresolved item, Git fact, and next action points to evidence the next manager can inspect.

> **Keep evaluated facts separate from later finalization facts.**

The evaluated body freezes the pre-finalization state and authorized plan. Commit, publication, merge, and cleanup results created afterward belong only in the factual receipt appended by the manager.

## Write it

| Field | Value |
|---|---|
| When | Wrap-up WORK authors exactly one handoff candidate after closure inputs and material decisions are resolved. |
| Source cursor | Gobbi-owned session UUID plus `step: wrap-up`, `stage: WORK`, the current `iteration`, and `task: null`. |
| Typed staging source | `4-wrap-up/staging/notes/{slug}.md` — the only handoff promotion source; it follows the same manifest, preimage, apply, and evaluation rules as every typed source. |
| PASS session destination | `4-wrap-up/outputs/handoff.md` — written only by RECORD after the evaluated Wrap-up subject receives PASS. |
| Durable destination | `notes/{area}/{YYYY-MM-DD}-{slug}.md` — project-only; `{area}` follows the [Memory area-selection owner](../rules.md#15-area-namespace-the-second-category-axis-under-each-type). |
| Body equality | The body beginning at the `#` title is byte-for-byte identical in the PASS session output and durable note. Only this durable frontmatter wrapper differs. |
| Receipt boundary | The evaluated body ends before Git finalization. The manager appends the factual finalization receipt after displaying the complete body and does not edit either evaluated copy. |
| Filename | `{YYYY-MM-DD}-{slug}.md`; the slug names the session's durable outcome in three to six words. |

[`wrap-up/SKILL.md`](../../wrap-up/SKILL.md) owns the nine-section handoff contract. [`wrap-up/promotion.md`](../../wrap-up/promotion.md) owns source inventory, mapping, body comparison, and actual-tree evidence.

## Frontmatter + body

Use the shared base frontmatter plus the notes extensions `features_touched`, `steps_completed`, and `shipped` from [Memory rules §2.2](../rules.md#22-per-type-extension-fields--the-status-model). Notes are project-only and use `status: active`.

```markdown
---
name: {stable handoff slug}
description: {one-line session outcome}
type: notes
scope: project
feature: null
status: active
created: YYYY-MM-DD
session: {Gobbi session UUID}
tags: [{values from the notes controlled vocabulary}]
keywords: []
author: claude | codex | user
features_touched: [{value-feature slugs changed or promoted into}]
steps_completed: [ideation, planning, execution, wrap-up]
shipped: [{durable artifact slugs produced or superseded}]
---

# {Session handoff title}

## 1. Outcome and agreed scope

{State the final outcome and the exact agreed in-scope and out-of-scope boundary. Cite the locked design, plan, or user decision that defines it.}

## 2. Completed or shipped work, with artifact and verification evidence

{List each completed result with its canonical artifact, focused commit when available, and exact verification evidence. Do not claim work from status text alone.}

## 3. Dual-system evaluation result, approved finding dispositions, and any waiver

{Record both systems' final report identities and verdicts, the aggregate result, the approved disposition artifact, and each exact user-approved missing-system waiver. State none when there is no waiver.}

## 4. Decisions to respect

{List settled user decisions, scope locks, and constraints the next session must preserve. Link the durable decision when one exists.}

## 5. Durable memory promoted or superseded

{List every promoted record, ordinary reciprocal supersession, archive move, or explicit empty result. Cite durable repository-relative paths and promotion evidence.}

## 6. Pre-finalization Git state and authorized finalization plan

{State the exact branch, absolute worktree, head commit, clean or known-dirty status, configured publication, issue and pull-request state, and authorized next Git actions. Future actions remain plans, not completed facts.}

## 7. Unresolved, blocked, or deferred items with explicit reasons

{For every remaining item, state its status, reason, owner, evidence pointer, and exact continuation action. State none when the set is empty.}

## 8. Known risks and accepted exceptions

{State each remaining risk or accepted exception, its evidence, consequence, authority, and containment. State none when there are no known accepted risks.}

## 9. Exact next-session start point: objective, required reads, current branch/worktree state, and first action

{Give one concrete objective, ordered required reads, exact branch and worktree state, and the first safe action or command. The next manager must be able to start without private session context.}
```

## Notes

- **Typed-source only.** The handoff enters promotion through `4-wrap-up/staging/notes/{slug}.md`; no working-file or direct journal exception exists.
- **Wrap-up WORK promotion only.** Durable note creation occurs through the frozen promotion manifest during Wrap-up WORK; no other step or stage writes the durable notes tree.
- **PASS-only session copy.** The session output is absent before Wrap-up RECORD with `lastVerdict: PASS` and remains valid after the completed-step transition.
- **Append-only evaluated body.** A later session corrects a handoff through new durable evidence. It does not rewrite the closed session's evaluated body.
- **Evidence over narrative.** Short chronological context may explain an outcome, but it never replaces artifacts, commits, verification, dispositions, or exact paths.
