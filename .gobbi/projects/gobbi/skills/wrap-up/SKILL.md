---
name: wrap-up
description: "Wrap-up is the terminal operation for preserving accepted work, committing closure changes, merging into the base branch, and returning one factual note."
allowed-tools: Read, Grep, Glob, Bash, Agent, Task, AskUserQuestion
skill-type: operation
---

# Wrap-up

Wrap-up keeps durable project context current, commits the complete closure, integrates the accepted work into
its base branch while applying Git preferences, and returns one development, research, or work note. Use it
only after the caller accepts the work and supplies the session root, project memory root, complete Git state,
and authority.

## Principles

### Keep project memory current

Reconcile useful session context with existing project memory instead of adding a session-shaped record.
Update current knowledge through Memory directory conventions, but preserve completed point-in-time records
under those conventions.

### Integrate the exact accepted work

The committed work tree and resulting base tree must match the closure tree that passed verification. Base
drift, unrelated work, or a merge conflict stops integration without changing the accepted result.

### Write one final note

One response-only Note records every terminal result, including a stop before or during Git integration. Write
it after the last completed or attempted action so every claim comes from current evidence.

### Preserve exact recovery evidence

A recoverable stop with exact evidence is valid failure handling. Never replace it with an unsupported or
altered completion claim.

## Rules

- **MUST freeze the closure subject, session and memory roots, complete Git state, stable closure assignment
  ID, and authority before changing memory.** Wrong-worktree evidence, unrelated changes, an active writer, or
  an unresolved material decision stops mutation.
- **MUST reconcile the full caller-supplied session root with related existing memory through Memory
  directory conventions before Git integration.** Read before writing; create only missing content, update
  current facts, move, merge, or reorganize overlaps, and remove stale or duplicate current content while
  preserving point-in-time records.
- **MUST apply Git to commit every closure-owned tracked change and integrate the accepted work into the exact
  caller-supplied base branch.** Reject base drift and prove the accepted work tree and resulting base tree are
  equal from current Git evidence.
- **MUST render one response-only Note for every terminal state.** Use the Note template to report context,
  work, memory, verification, Git states, concerns, and recovery from direct evidence.
- **NEVER resolve a merge conflict, rewrite accepted work, or absorb unrelated base changes inside Wrap-up.**
  Retain the work branch and worktree for a separately authorized repair.
- **NEVER report an intended, deferred, failed, or unproved action as completed.** Stop with the exact failure,
  retained objects, and first safe recovery command.

## Procedure

### Phase 1 — Freeze Closure

#### 1.1 Accept the completed work

- Enter only when the calling manager identifies accepted work as ready for terminal closure. The caller owns
  acceptance, required review, and the evidence gate.
- Read the accepted scope, results, artifacts, commits, verification, review coverage, user decisions,
  exclusions, risks, and unresolved items.
- When a completion claim lacks evidence or a material decision remains unresolved, stop mutation and
  continue to Step 3.4 with the exact unattempted state.

#### 1.2 Bind the repository state

- Resolve the caller context label, Gobbi UUID, repository root, Git common directory, immutable base commit,
  current base branch, head, tree, checkout path, and status, plus the work branch, head, tree, worktree, and
  status from the caller contract and direct evidence.
- Prove that the worktree belongs to the expected work branch, is not the main checkout, and has no unrelated
  change or concurrent writer. Prove that the named base branch has one clean bound checkout with no active
  Git operation.
- Freeze the observed identity and state. On failure, stop mutation and continue to Step 3.4 with the exact
  roots, branches, heads, trees, checkout states, and recovery point.

#### 1.3 Bind inputs and authority

- Take these five fixed properties from the caller. On a missing, ambiguous, malformed, or incorrectly rooted
  value, stop mutation and continue to Step 3.4 before changing memory.

| Property | Required value |
|---|---|
| Session root | Full closing session root used as input for durable Memory writes. |
| Project memory root | Closing project's `.gobbi/projects/<project>/memory/` root and the boundary for durable memory changes. |
| Base branch | Exact local branch that receives the accepted work head. |
| Git state | Exact repository, base, branch, worktree, accepted heads, and current status from the caller contract. |
| Git authority | Current authority to commit closure-owned changes and merge the work head into the base branch. |

- Freeze the UTC completion time, outcome title, closure evidence, and five properties. Confirm that the
  manager owns acceptance, user decisions, integration, Note delivery, and recovery, then assign one writer.
- Treat commit and merge as required but unproved until Git evidence confirms them. Missing commit or merge
  authority stops mutation and continues to Step 3.4 with the current recovery state preserved.

### Phase 2 — Reconcile Memory

#### 2.1 Reconcile one bounded memory set

- Give one writer the frozen closure evidence, session and memory roots, allowed and protected paths, required
  actions, expected result, and verification contract.
- Require the writer to apply [Memory](../memory/SKILL.md) preferences to the full session root, read related
  records and navigation, and decide what changes.
- Require one directory-owned CRUD set: create only missing context; update current facts; move, merge, or
  reorganize overlapping content; and remove stale or duplicate content. Keep indexes and links current, then
  return every changed path, action, reason, and verification.

#### 2.2 Accept current durable memory

- Reread every changed path, related retained content, and required navigation. Confirm that the result stays
  inside the project memory root, follows Memory directory conventions, and matches the accepted work.
- Confirm that every CRUD action has a present need and one Memory directory, and every recorded memory change
  point was applied or rejected with a reason. Preserve completed point-in-time records; reject stacking, stale
  facts, needless fragments, unclear placement, duplicates, and unresolved change points.
- When memory or its verification fails, stop before Git integration and continue to Step 3.4 with the exact
  retained worktree and recoverable state.

#### 2.3 Verify the closure tree

- Run the applicable memory, link, repository, and accepted-work checks against the complete current worktree.
  Compare every changed path with the frozen closure contract.
- Confirm that each tracked change is closure-owned, the work branch contains every accepted task commit, the
  current base head equals the bound base head, and no protected or unrelated path changed.
- Freeze the closure tree identity, changed paths, checks, work head and tree, base head and tree, base checkout
  state, commit authority, and merge authority. Any later drift stops mutation and continues to Step 3.4.

### Phase 3 — Commit, Merge, and Note

#### 3.1 Revalidate the accepted closure

- Immediately before Git mutation, reread the repository, worktree, branches, heads, status, complete diff,
  accepted task commits, verification, and authority.
- Require the current closure tree to equal the frozen tree and the current base head, tree, checkout path,
  status, and operation state to equal the frozen base evidence.
- When any input drifted, stop before mutation and continue to Step 3.4 with every Git action marked
  `not attempted` and the exact recovery point.

#### 3.2 Commit closure changes

- Apply [Git](../git/SKILL.md) preferences while Wrap-up stages only closure-owned paths, inspects the staged
  paths and diff, and commits every remaining tracked closure change on the work branch. When no change remains,
  prove that the existing accepted work head already contains the complete verified tree.
- Reread the resulting commit and prove that its tree equals the frozen closure tree and contains the required
  closure changes and every accepted task commit. Confirm that no closure-owned tracked change remains
  uncommitted.
- On failure, do not edit, restage, or change content for a retry. Retain the work branch and worktree, then
  continue to Step 3.4 with the failed command, current evidence, and first safe recovery command.

#### 3.3 Merge into the base branch

- Recheck the exact work head and tree, unchanged base head and tree, clean bound base checkout, repository
  identity, merge authority, and absence of an active Git operation immediately before the merge.
- Apply [Git](../git/SKILL.md) preferences while Wrap-up integrates the accepted work through its authorized
  merge path. If the caller contract cannot authorize and prove that path, stop without an independent merge,
  conflict resolution, or accepted-work change.
- Prove that the resulting base tree equals the accepted work tree. Record the base heads and trees before and
  after, merge form, base checkout state, surviving branch and worktree, failure, and first safe recovery
  command.

#### 3.4 Return the Note

- Enter after successful integration or any terminal stop in Phases 1 through 3. Select `Development`,
  `Research`, or `Work` from the accepted result and render the [Note template](templates/note.md) as the
  response body after any caller-required prefix; do not write it as a tracked artifact.
- Complete every field from the accepted purpose, requirements, scope, exclusions, decisions, sources, and
  direct closure, memory, verification, repository, commit, merge, base checkout, branch, and worktree
  evidence. Use Git's exact action-state vocabulary and state the recovery owner and first safe command.
- Complete Wrap-up only when Memory is verified, all closure-owned changes are committed, the work head is
  integrated into the base branch, the resulting base tree equals the accepted work tree, and the Note reports
  the same evidence. Otherwise return the exact stopped state.

## References

| Name | Description |
|---|---|
| [Wrap-up checklist](checklist.md) | Reusable unchecked source for evaluating closure governance, durable Memory, exact-tree integration, recovery, and factual Note reporting. |
| [Note template](templates/note.md) | Response-only development, research, or work note for the final result, memory, verification, Git integration, and recovery. |
| [Memory](../memory/SKILL.md) | Defines the memory tree, directory conventions, and session-versus-durable split. |
| [Git](../git/SKILL.md) | Supplies focused-commit, integration, retained-object, and recovery preferences; Wrap-up owns the ordered Git actions. |
