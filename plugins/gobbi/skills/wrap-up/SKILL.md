---
name: wrap-up
description: "Wrap-up extracts accepted work into Memory, commits and merges it into the base branch, and returns a Git and recovery note. Use it when a Workflow session closes accepted work."
allowed-tools: Read, Grep, Glob, Bash, Agent, Task, AskUserQuestion
skill-type: operation
---

# Wrap-up

Wrap-up extracts accepted session knowledge into Memory, commits the closure, merges the accepted work into
its base branch, and returns one Git/recovery Note. Use it only after the caller accepts the work and supplies
the session root, project memory root, Git state, and authority.

## Principles

### Keep project memory current

Extract accepted design, decisions, behaviors, and standing preferences into existing Memory homes instead of
adding a session-shaped record.

### Integrate the accepted work

Merge the accepted work when it merges cleanly. When the base moved since review, rerun the accepted checks on
a temporary merge first; only a conflict or a failed check stops the merge.

### Report exactly what happened

A stop with exact recovery evidence is valid failure handling. The Note the caller receives reports only
what current Git evidence shows.

## Rules

- **Freeze the closure inputs once before changing Memory.** They are what the caller accepted, so wrong-worktree
  evidence, unrelated changes, or an unresolved material decision stops mutation.
- **Extract accepted knowledge into Memory and write the durable work Note before Git.** The closure commit
  must carry the Memory it records.
- **MUST commit and merge only with the caller's commit and merge authority, into the exact base branch the
  caller supplied.** Both change shared history.
- **Return one response-only Git/recovery Note for every terminal state.** The caller needs the Git result and
  the first recovery step whether closure finished or stopped.
- **NEVER resolve a merge conflict or change the accepted work inside Wrap-up.** Either would change what
  review accepted, so retain the work branch and worktree for a separately authorized repair.
- **NEVER report an intended, deferred, failed, or unproved action as completed.** The caller acts on the
  Note, so stop with the exact failure, retained objects, and first safe recovery command.

## Procedure

### Phase 1 — Freeze Closure

Fix what closure works from before anything changes. Done when the accepted work and all five caller
properties are bound and confirmed against Git, or closure has gone to Step 3.4.

#### 1.1 Accept the completed work

- Enter only when the calling manager identifies accepted work as ready for closure. The caller owns
  acceptance, required review, and the evidence gate.
- Read the accepted scope, results, commits, checks, review coverage, user decisions, risks, and open items.
- When a completion claim lacks evidence or a material decision is unresolved, stop and go to Step 3.4 with no
  Memory write.

#### 1.2 Bind inputs, state, and authority

- Take these five properties from the caller:

  | Property | Required value |
  |---|---|
  | Session root | Full closing session root used as input for durable Memory writes. |
  | Project memory root | Closing project's `.gobbi/projects/<project>/memory/` root and the boundary for durable memory changes. |
  | Base branch | Exact local branch that receives the accepted work head. |
  | Git state | Exact repository, base, branch, worktree, accepted heads, and current status from the caller contract. |
  | Git authority | Current authority to commit closure-owned changes and merge the work head into the base branch. |

- Confirm from Git that the worktree belongs to the work branch, is not the main checkout, and has no
  unrelated change, and that the base branch has a clean checkout with no Git operation in progress.
- Record the UTC completion time and outcome title. On a missing, ambiguous, or wrong value, or missing commit
  or merge authority, stop before Memory and go to Step 3.4.

### Phase 2 — Extract Memory

Put the accepted knowledge into Memory. Done when every changed Memory path is reread and checked and the
closure tree, its changed paths, passing checks, and work head are frozen.

#### 2.1 Brief one writer

- The caller briefs one writer through [Delegation](../delegation/SKILL.md). Goal: the accepted knowledge is in
  its Memory homes, written by [Memory](../memory/SKILL.md) Closure, with one durable work Note.
- Give the writer the closure evidence, the session root, and the project memory root.

#### 2.2 Accept memory and freeze the closure tree

- Reread every changed path and run the applicable memory, link, and accepted-work checks. Confirm the changes
  stay inside the project memory root, keep one home per item, and match the accepted work.
- Freeze the closure tree, its changed paths, the checks that passed, and the work head. When memory or its
  checks fail, stop before Git and go to Step 3.4 with the retained worktree.

### Phase 3 — Commit, Merge, and Note

Integrate the frozen closure and report it. Done when the Note is returned and every action it reports as
completed is proven by current Git evidence.

#### 3.1 Revalidate the closure

- Immediately before Git, reread the worktree, branches, heads, status, diff, and authority, and confirm the
  closure tree equals the frozen tree.
- When the closure tree or authority changed, stop with every Git action `not attempted` and go to Step 3.4.

#### 3.2 Commit closure changes

- Apply [Git](../git/SKILL.md): stage only closure-owned paths, inspect the staged diff, and commit on the work
  branch. Confirm the commit tree equals the frozen closure tree, or that the accepted head already holds it.
- On failure, do not edit or restage for a retry. Retain the work branch and worktree and go to Step 3.4 with
  the failed command and first safe recovery command.

#### 3.3 Merge into the base branch

- Merge the work head into the base branch by the merge path the caller authorized, applying
  [Git](../git/SKILL.md). When the base has not moved, confirm the resulting base tree equals the work tree.
- When the base moved, merge the work head onto the current base in a temporary branch and rerun the accepted
  checks there; move the base branch only after they pass.
- On a conflict or a failed check, leave the base branch at its prior head, retain the work branch and
  worktree, and go to Step 3.4.

#### 3.4 Return the Note

- Render the [Note template](templates/note.md) as the response body after any caller-required prefix, not as
  a tracked file. Cite the durable Note path, or `None` when closure stopped before Memory.
- Report Complete only when Memory is verified, closure changes are committed, and the work head is merged
  with its checks passing. Otherwise report the exact stopped state.

## References

| Name | Description |
|---|---|
| [Memory-note template](templates/memory-note.md) | Tracked Memory report shape for the Phase 2 `reports/note/` work account. |
| [Note template](templates/note.md) | Response-only Git/recovery note for every terminal state. |
| [Memory](../memory/SKILL.md) | Owns where closure knowledge goes, the durable work Note, and the `history/` file. |
| [Delegation](../delegation/SKILL.md) | Shape of the brief for the Memory writer. |
| [Git](../git/SKILL.md) | Supplies commit and merge conventions and the shared Git safety rules; Wrap-up owns the ordered Git actions. |
