---
name: memory
description: "MUST load when writing a temporary session record or memorizing durable project context. Memory is one operation with explicit Temporary Record and Memorize actions."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Memory

Memory keeps temporary session evidence and durable project memory useful and current. **Temporary Record**
writes compact recovery evidence below `sessions/*`. **Memorize** selects durable future value from the
session and closure evidence, then updates tracked `memory/*`.

The active worktree, project, and session determine the roots. Cowork or Workflow owns each exact temporary
output path and schema. Memory owns containment, temporary-write safety, durable judgment, and category
routing.

## Principles

### Preserve only useful future context

Temporary records preserve only accepted recovery context while their worktree remains. Durable memory should
help future work understand or decide something; transient state and operational exhaust stay temporary.

### Write simply and compactly

Use simple words and the smallest cold-readable Markdown shape that preserves the full meaning. Point to
existing evidence instead of copying logs, transcripts, or other operational detail.

### Keep memory up to date

Temporary records are inputs to later memorization, not durable memory. Revise, move, or remove stale durable
content while preserving completed point-in-time records under their category rules.

## Rules

- **MUST select `Temporary Record` or `Memorize` from the active task and keep the action inside the verified
  worktree, project, and session context.** Stop without writing when containment or ownership is ambiguous.
- **MUST keep every Temporary Record output below the active project's `sessions/*` tree and out of Git
  history.** Cowork or Workflow owns the exact output; never judge durable value, route a memory category,
  stage, or commit during this action.
- **MUST read the full session root during Memorize, including readable legacy session
  layouts.** Session placement is input evidence, not proof of durable value and not a required new layout.
- **MUST load every applicable category skill before changing tracked `memory/*`.** Load both source and
  destination categories for a move, and stop when required category guidance is incomplete.
- **MUST verify and repair every write before returning.** Prove exact containment, content, affected paths,
  and unchanged protected paths for the selected action.
- **NEVER delete a session root or its contents directly.** A session may disappear only with separately
  authorized worktree cleanup after its recovery value has been resolved.

## Procedure

### Phase 1 — Resolve the active memory context

#### 1.1 Select and validate the action

- Determine the action and verified worktree from the active task. Resolve `{project-root}` as the current
  `.gobbi/projects/<project>/`, `{session-root}` as its active `sessions/<session>/`, and `{memory-root}` as
  its tracked `memory/` tree.
- For `Temporary Record`, use the exact output Cowork or Workflow owns below `{session-root}`. For `Memorize`,
  use the full `{session-root}`, frozen closure evidence, and `{memory-root}`.
- Resolve each path without parent traversal or symbolic-link escape. Stop without writing when a path falls
  outside its contextual root or conflicts with protected work.

### Phase 2 — Write a temporary record

#### 2.1 Write, verify, and return the compact output

- Enter only for `Temporary Record`. Confirm the exact output resolves below `{session-root}` and no path below
  that root is tracked.
- Write the smallest accepted state needed for recovery or later Memorize, using the schema owned by Cowork or
  Workflow. Exclude secrets, transcripts, raw logs, token data, private capture, and unsupported claims.
- Reread the output and confirm its content and containment. Confirm no session path is tracked, staged, or
  committed; repair an in-scope content defect and repeat this step, or stop on a boundary failure.
- Return the action, session root, written path or explicit no-write result, checks, and recovery state.

### Phase 3 — Memorize durable project context

#### 3.1 Review and route durable value

- Enter only for `Memorize`. Read the full session root, frozen closure evidence, accepted commits, current
  project state, and existing project memory. Read legacy `{session-root}/memory/` content as temporary input
  without rewriting it.
- Keep only evidence-backed context that will help future work. Reject secrets, raw conversation, speculative
  conclusions, temporary routing state, plans, evaluation packages, receipts, and other operational exhaust
  unless a category skill independently justifies their durable content.
- Route each retained item through the applicable category skill:

| Durable content | Category skill | Home below the project memory root |
|---|---|---|
| Current project design and direction | [`design/SKILL.md`](design/SKILL.md) | `design/` |
| Reusable knowledge and repeated mistakes | [`learnings/SKILL.md`](learnings/SKILL.md) | `learnings/` |
| Completed work reports | [`reports/SKILL.md`](reports/SKILL.md) | `reports/` |
| Completed session history and project progression | [`history/SKILL.md`](history/SKILL.md) | `history/` |
| Durable sources and supporting inputs | [`materials/SKILL.md`](materials/SKILL.md) | `materials/` |
| Deferred project or feature outcomes | [`backlogs/SKILL.md`](backlogs/SKILL.md) | `backlogs/` |

- Load each applicable category skill, review related records and navigation, then decide the exact create,
  update, move, or delete set. At session close, create history only when the session produced durable change.

#### 3.2 Update and verify durable memory

- Update only files, indexes, and links below `{memory-root}` according to the loaded category skills. Preserve
  unique current knowledge and completed point-in-time records.
- Reread every changed path and related navigation. Confirm category compliance, tracked-root containment,
  intended placement, no unexplained duplicate, and unchanged session input.
- Repair each in-scope defect and repeat verification. Return the action, source session root, exact durable
  path set or verified no-change result, loaded categories, checks, and any retained recovery state.

## References

| File | Description |
|---|---|
| [`design/SKILL.md`](design/SKILL.md) | Defines current architecture, feature, process, and roadmap memory. |
| [`learnings/SKILL.md`](learnings/SKILL.md) | Defines reusable knowledge and repeatable failure patterns. |
| [`reports/SKILL.md`](reports/SKILL.md) | Defines durable notes, reviews, and analyses. |
| [`history/SKILL.md`](history/SKILL.md) | Defines compact completed-session history. |
| [`materials/SKILL.md`](materials/SKILL.md) | Defines durable source materials and supporting evidence. |
| [`backlogs/SKILL.md`](backlogs/SKILL.md) | Defines deferred outcomes and their reasons. |
