---
name: wrap-up
description: "Wrap-up is the terminal operation for extracting accepted work into Memory, committing closure changes, merging into the base branch, and returning one Git/recovery note."
allowed-tools: Read, Grep, Glob, Bash, Agent, Task, AskUserQuestion
skill-type: operation
---

# Wrap-up

Wrap-up extracts accepted session knowledge into Memory, writes one durable work Note, commits the complete
closure, integrates the accepted work into its base branch, and returns one Git/recovery Note. Use it only
after the caller accepts the work and supplies the session root, project memory root, complete Git state, and
authority.

## Principles

### Keep project memory current

Extract accepted design, decisions, behaviors, and standing preferences into existing Memory homes instead of
adding a session-shaped record. Update current knowledge through Memory directory conventions, and preserve
completed point-in-time records under those conventions.

### Integrate the exact accepted work

The committed work tree and resulting base tree must match the closure tree that passed verification. Base
drift, unrelated work, or a merge conflict stops integration without changing the accepted result.

### Write one final note

When Memory runs, Phase 2 writes one tracked durable work Note. After the last Git action or stop, return one
response-only Git/recovery Note from current evidence.

### Preserve exact recovery evidence

A recoverable stop with exact evidence is valid failure handling. Never replace it with an unsupported or
altered completion claim.

## Rules

- **MUST freeze the closure subject, session and memory roots, complete Git state, stable closure assignment
  ID, and authority before changing memory.** Wrong-worktree evidence, unrelated changes, an active writer, or
  an unresolved material decision stops mutation.
- **MUST extract accepted design, decisions, intended behaviors, and standing preferences from the full
  session root into Memory homes, then write the durable work Note, before Git.** Update or merge existing
  homes first; create only missing content; reject session-shaped dumps and talk.
- **MUST apply Git to commit every closure-owned tracked change and integrate the accepted work into the exact
  caller-supplied base branch.** Reject base drift and prove the accepted work tree and resulting base tree are
  equal from current Git evidence.
- **MUST render one response-only Git/recovery Note for every terminal state.** Cite the durable Note path
  when Phase 2 wrote one; fill Git, concerns, and recovery from current evidence.
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
  continue to Step 3.4 with the exact unattempted state and no Memory write.

#### 1.2 Bind the repository state

- Resolve the caller context label, Gobbi UUID, repository root, Git common directory, immutable base commit,
  current base branch, head, tree, checkout path, and status, plus the work branch, head, tree, worktree, and
  status from the caller contract and direct evidence.
- Prove that the worktree belongs to the expected work branch, is not the main checkout, and has no unrelated
  change or concurrent writer. Prove that the named base branch has one clean bound checkout with no active
  Git operation.
- Freeze the observed identity and state. On failure, stop mutation and continue to Step 3.4 with the exact
  roots, branches, heads, trees, checkout states, recovery point, and no Memory write.

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

### Phase 2 — Extract Memory

#### 2.1 Extract accepted current knowledge

- Give one writer the frozen closure evidence, session and memory roots, allowed and protected paths, required
  actions, expected result, and verification contract.
- Require the writer to apply [Memory](../memory/SKILL.md) preferences, including Closure, to extract accepted
  design, decisions, intended behaviors, and standing preferences into `design/`, `learnings/`, and `backlogs/`.
- Update or merge existing homes first; create only missing content. Reject session-shaped dumps and talk.

#### 2.2 Write the durable work Note

- Write one `reports/note/YYYY-MM-DD-<descriptive-title>.md` from the
  [memory-note template](templates/memory-note.md). Omit Git action states, recovery commands, and session
  UUID-as-knowledge.
- Write one `history/` file only when the session made a durable project change. Create none when it did not.
- Update the `reports/` README and, when a history file was written, the `history/` README. Link from related
  Memory instead of copying.

#### 2.3 Accept memory and freeze the closure tree

- Reread every changed path, related retained content, and required navigation, and run the applicable memory,
  link, repository, and accepted-work checks. Confirm the result stays inside the project memory root, follows
  Memory conventions, has one home per item, and matches the accepted work.
- Confirm each tracked change is closure-owned, the work branch contains every accepted task commit, the current
  base head equals the bound base head, and no protected or unrelated path changed. Freeze the closure tree
  identity, changed paths, checks, work head and tree, base head and tree, base checkout state, commit
  authority, and merge authority.
- When memory or its verification fails, stop before Git and continue to Step 3.4 with the exact retained
  worktree and recoverable state. Any later drift also stops mutation and continues to Step 3.4.

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
- Cite the Phase 2 memory Note path when it exists; use `None` when Phase 1 stopped before Memory. Fill Git
  and recovery from current evidence, and do not edit the durable Note after freeze.
- Complete Wrap-up only when Memory is verified, all closure-owned changes are committed, the work head is
  integrated into the base branch, the resulting base tree equals the accepted work tree, and the Note reports
  the same evidence. Otherwise return the exact stopped state.

## References

| Name | Description |
|---|---|
| [Wrap-up checklist](checklist.md) | Reusable unchecked source for evaluating closure governance, durable Memory, exact-tree integration, recovery, and factual Note reporting. |
| [Memory-note template](templates/memory-note.md) | Tracked Memory report shape for the Phase 2 `reports/note/` work account. |
| [Note template](templates/note.md) | Response-only Git/recovery note for every terminal state. |
| [Memory](../memory/SKILL.md) | Defines the memory tree, directory conventions, Closure extraction, and session-versus-durable split. |
| [Git](../git/SKILL.md) | Supplies focused-commit, integration, retained-object, and recovery preferences; Wrap-up owns the ordered Git actions. |
