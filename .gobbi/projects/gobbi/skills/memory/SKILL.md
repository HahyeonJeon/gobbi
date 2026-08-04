---
name: memory
description: "MUST load when writing a temporary session record or memorizing durable project context. Memory is one operation with explicit Temporary Record and Memorize actions."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Memory

Memory owns two actions. **Temporary Record** writes compact recovery evidence below a caller-supplied ignored
`sessions/*` root. **Memorize** selects durable future value from a caller-supplied session root and closure
evidence, then updates a caller-supplied tracked `memory/*` root.

The caller must name the action and exact roots. Orchestration owners define every path and record schema below
the session root; Memory owns only containment, temporary-write safety, durable judgment, and category routing.

## Principles

### Keep sessions temporary

Session records support recovery and later memorization while their worktree remains. They are ignored,
uncommitted, and do not become durable merely because they exist.

### Remember only useful future context

Durable memory should help future work understand or decide something. Transient state and operational exhaust
stay temporary.

### Keep memory current and compact

Use the smallest cold-readable shape that preserves meaning. Revise, move, or remove stale durable content
while preserving completed point-in-time records under their category rules.

## Rules

- **MUST require the caller to name `Temporary Record` or `Memorize`, supply its absolute roots, and name the
  exact Temporary Record output.** Stop without writing when containment, ownership, or the verified worktree is ambiguous.
- **MUST keep every Temporary Record output below the caller-supplied ignored `sessions/*` root and out of Git
  history.** Never judge durable value, route a memory category, stage, or commit during that action.
- **MUST read the full caller-supplied session root during Memorize, including readable legacy session
  layouts.** Session placement is input evidence, not proof of durable value and not a required new layout.
- **MUST load every applicable category skill before changing tracked `memory/*`.** Load both source and
  destination categories for a move, and stop when required category guidance is incomplete.
- **MUST verify and repair every write before returning.** Prove exact containment, content, ignore or tracked
  posture, affected paths, and unchanged protected paths for the selected action.
- **NEVER delete a session root or its contents directly.** A session may disappear only with separately
  authorized worktree cleanup after its recovery value has been resolved.

## Procedure

### Phase 1 — Establish the caller contract

#### 1.1 Select and validate the action

- Take the action name, absolute verified worktree, absolute project root, and caller-owned inputs and outputs.
- For `Temporary Record`, require an absolute session root below
  `.gobbi/projects/<project>/sessions/<session>/` and one exact output below it.
- For `Memorize`, require the full absolute session root, frozen closure evidence, and the absolute tracked
  `.gobbi/projects/<project>/memory/` root.
- Resolve every supplied path without parent traversal or symbolic-link escape. Stop without writing when a
  path is missing, relative, outside its required root, or conflicts with protected work.

### Phase 2 — Write a temporary record

#### 2.1 Validate the temporary boundary

- Enter only for `Temporary Record`. Confirm the session root and output resolve inside the verified worktree.
- Prove the session root and output are ignored with `git check-ignore --no-index -v`, and prove no file below
  the session root is tracked with `git ls-files -- <session-root>`.
- Capture the tracked-tree preimage. Stop without writing when ignore posture or containment is not exact.

#### 2.2 Write the compact output

- Write the smallest cold-readable accepted state needed for recovery or later Memorize. Follow the schema
  supplied by the caller.
- Point to existing artifacts, commits, reports, decisions, and checks instead of copying them. Exclude
  secrets, transcripts, raw logs, token data, private capture, operational exhaust, and unsupported claims.
- Create only the parent directories the exact output needs. An honest no-write result is valid when existing
  temporary evidence already satisfies the caller.

#### 2.3 Verify and return the temporary result

- Reread the exact output and verify its content, resolved containment, and ignore posture.
- Prove the tracked-tree preimage is unchanged, the session root has no index entry, and no staged or committed
  path changed. Repair an in-scope content defect and repeat this step; stop on a boundary failure.
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

- Update only files, indexes, and links below the caller-supplied project memory root according to the loaded
  category skills. Preserve unique current knowledge and completed point-in-time records.
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
