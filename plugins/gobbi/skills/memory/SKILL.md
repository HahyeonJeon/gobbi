---
name: memory
description: "Memory is an operation for recording temporary session context and maintaining durable project knowledge."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Memory

Memory records compact recovery context for active sessions and keeps durable project knowledge current and
clear. Use **Temporary Record** for ignored recovery evidence and memory change points; use **Memorize** only
on an explicit user request or at a loaded caller skill's named Memory stage.

## Principles

### Preserve only useful future context

Temporary records preserve only accepted recovery context while their worktree remains. Durable memory keeps
evidence-backed context that will help future work understand or decide something.

### Write simply and compactly

Use short, descriptive titles, plain words, direct sentences, and a clear section hierarchy. Use lists for
parallel points and tables only for repeated fields or comparisons.

### Keep memory current and clear

Durable memory is a current, navigable model of project knowledge, not a stack of session records. Use
category-owned CRUD to update, move, merge, reorganize, or remove related content while preserving completed
point-in-time records.

## Rules

- **MUST take each action from an authorized call.** `Temporary Record` requires a caller skill that owns the
  exact session path; `Memorize` requires an explicit user request or a loaded caller skill's named Memory
  stage.
- **MUST validate one caller-supplied canonical session identity when an action uses session state.** Stop
  without writing when its format, containment, UUID uniqueness, or ownership is missing or conflicting.
- **MUST keep every Temporary Record below the active project's `sessions/*` tree and out of Git history.**
  During active work, record detected durable change points there instead of changing `memory/*`.
- **MUST reconcile durable knowledge before creating memory.** Read the full session root and all related
  project memory, then use category-owned CRUD to update, move, merge, reorganize, or remove existing content;
  create only truly missing context.
- **MUST verify and repair every write before returning.** Prove exact containment, content, affected paths,
  navigation, and unchanged protected paths for the selected action.
- **NEVER delete a session root or its contents directly.** A session may disappear only through separately
  authorized worktree cleanup after its recovery value is resolved.

## Procedure

### Phase 1 — Bind the Memory Action

#### 1.1 Accept an authorized action

- Accept `Temporary Record` only when a loaded caller skill names the exact ignored session path it owns.
  Memory owns the compact change-point schema at the caller's fixed `work/memory-change-points.md` path.
- Accept `Memorize` only on an explicit user request or when a loaded caller skill names its Memory stage and
  supplies the durable write boundary. An agent's observation that memory should change is not authorization.
- Require the action, caller, verified worktree, project, and exact output or input boundary. `Temporary Record`
  and caller-skill `Memorize` require a session identity and root; direct user `Memorize` requires the selected
  evidence and project memory root.

#### 1.2 Validate the canonical session identity when used

- Enter when the action uses session state. Require the caller's original UTC session-start date, normalized
  slug, full lowercase hyphenated UUID, and exact session root; Memory never derives Git identity.
- Require the session leaf to match `<YYYY-MM-DD>-<slug>-<full-uuid>` and this exact grammar:

```regex
^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
```

- Require a real Gregorian date and exact date, slug, and UUID equality with the caller. Require a 1–20
  character slug and reject `con`, `prn`, `aux`, `nul`, `com1`–`com9`, and `lpt1`–`lpt9`, case-insensitively.

#### 1.3 Resolve and freeze the boundaries

- Resolve the project memory root for `Memorize`; when session state is used, also resolve
  `.gobbi/projects/<project>/sessions/` and the caller-supplied session root below it. Reject parent traversal,
  symbolic-link components, a different project, or any root outside the verified worktree.
- When session state is used, require the caller UUID to identify only the supplied session root. Report every
  conflict; never choose a root, append a suffix, or create a replacement.
- Freeze the action, caller, applicable identity, roots, containment checks, UUID inventory, and exact output or
  input boundary. On any pre-write stop, return those facts, the failed check, unchanged inputs, protected paths,
  unresolved change points, and first safe recovery step.

### Phase 2 — Record Temporary Context

#### 2.1 Write and verify the temporary record

- Enter only for `Temporary Record`. Confirm the exact output resolves below the session root and every
  session path is ignored, untracked, unstaged, and uncommitted.
- Write the smallest accepted recovery state and exclude secrets, transcripts, raw logs, token data, private
  capture, and unsupported claims. For `work/memory-change-points.md`, use only the `# Memory Change Points`
  heading and a `Change point | Evidence` table; merge repeats and treat each row as a later review candidate.
- Reread the output and repeat its containment, ignore, index, staging, history, and tracked-tree checks.
  Repair an in-scope content defect and repeat this step, or return the path or no-write result, failed check,
  unchanged inputs, protected paths, and recovery state.

### Phase 3 — Memorize Durable Context

#### 3.1 Select and route durable value

- Enter only for an authorized `Memorize` call. Read the full session root and recorded change points when
  present, supplied user or closure evidence, accepted commits when applicable, current project state, all
  related project memory, and required navigation.
- Keep only evidence-backed context that will help future work. Reject secrets, raw conversation, speculative
  conclusions, temporary routing state, plans, evaluation results, receipts, and other operational exhaust
  unless a category skill independently justifies their durable content.
- Route every retained item through its category owner:

| Durable content | Category skill | Home below the project memory root |
|---|---|---|
| Current project design and direction | [`design`](design/SKILL.md) | `design/` |
| Reusable knowledge and repeated mistakes | [`learnings`](learnings/SKILL.md) | `learnings/` |
| Completed work reports | [`reports`](reports/SKILL.md) | `reports/` |
| Completed session history and project progression | [`history`](history/SKILL.md) | `history/` |
| Durable sources and supporting inputs | [`materials`](materials/SKILL.md) | `materials/` |
| Deferred project or feature outcomes | [`backlogs`](backlogs/SKILL.md) | `backlogs/` |

#### 3.2 Reconcile category-owned memory

- Load every applicable category skill, including both owners for a cross-category change. Map each item to
  related content, one owner, and one create, update, move, merge, reorganize, or remove action; before writing,
  return the no-write failure result when a category owner or required user decision is missing.
- Prefer updating or consolidating an existing source over creating another file. Create only missing
  context, preserve unique current knowledge and completed point-in-time records, and remove stale or
  duplicate current content.
- Keep the resulting structure, indexes, and links clear and current. Create history only when the completed
  session produced durable change, and stop when category guidance or a required user decision is missing.

#### 3.3 Verify and return the durable result

- Reread every changed path, related retained content, and required navigation. Confirm category compliance,
  tracked-root containment, one clear current home for each retained item, no unexplained duplicate, and
  unchanged session input and protected paths.
- Repair each in-scope defect and repeat verification. Stop when repair would cross the supplied scope,
  authority, memory root, or category contract.
- Return the source boundary and session root when used, exact durable path and action set or verified
  no-change result, loaded categories, checks, unresolved change points, and retained recovery state.

## References

| Name | Description |
|---|---|
| [`design`](design/SKILL.md) | Owns current architecture, feature, process, and roadmap memory. |
| [`learnings`](learnings/SKILL.md) | Owns reusable knowledge and repeated failure patterns. |
| [`reports`](reports/SKILL.md) | Owns durable notes, reviews, and analyses. |
| [`history`](history/SKILL.md) | Owns compact completed-session history. |
| [`materials`](materials/SKILL.md) | Owns durable sources and supporting evidence. |
| [`backlogs`](backlogs/SKILL.md) | Owns deferred outcomes and their reasons. |
