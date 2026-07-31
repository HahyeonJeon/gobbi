---
name: wrap-up
description: "MUST load for terminal closure. Wrap-up updates durable Memory, completes authorized Git operations, and displays an immutable handoff with a factual receipt."
allowed-tools: Read, Grep, Glob, Bash, Agent, Task, AskUserQuestion
skill-type: operation
---

# Wrap-up

Wrap-up is the shared terminal operation for a manager closing accepted Cowork or Workflow work. It produces
current durable memory, a finalized Git state, and an exact operator handoff followed by a factual receipt.

The manager owns entry, the closure contract, user gates, Git actions, acceptance, display, and recovery. A
delegated assistant applies Memory inside the bounded project memory root before the manager starts Git.

## Principles

### Memory owns durable context

Memory preserves the completed work, current decisions, and session progression that future work needs.

### Git is the final mutation

All tracked content is complete and frozen before Git finalization begins. Later evidence may be read and
displayed, but it cannot be used to repair or decorate the result.

### Handoff and receipt contain different facts

The tracked handoff describes delivered work and pre-finalization Git intent. The display-only receipt reports
Git outcomes that direct evidence proves afterward.

### Recovery is more important than appearance

A recoverable stop with exact evidence is complete failure handling. Unsupported or altered completion text
is not.

## Rules

- **MUST freeze the exact closure inputs and authority before changing Memory.** Wrong-worktree evidence,
  unrelated changes, an active writer, or an unresolved decision stops the operation before Git.
- **MUST apply Memory before Git and write the tracked handoff as report memory.** Verify every affected
  memory path, index, and link before freezing the report.
- **MUST make the authorized Git sequence the final mutating operation.** Follow the current mode contract
  and the [Git operation](../git/SKILL.md), with current authority for every external or destructive action.
- **MUST freeze the handoff bytes and SHA-256 digest before Git, then reread and verify the exact source
  afterward.** Display those bytes unchanged before appending a separate factual receipt.
- **NEVER put final commit, publication, merge, branch-removal, or worktree-removal results in the tracked
  handoff.** It may state only the Git intent known before finalization.
- **NEVER repair, rewrite, or counterfeit completion after Git begins.** Complete the authorized Git sequence
  or stop with the exact failure, retained objects, and first safe recovery command.

## Procedure

### Phase 1 — Freeze the closure contract

#### 1.1 Validate the completed work and session identity

- Enter only when the calling Cowork or Workflow manager identifies accepted work as ready for terminal
  closure. The caller owns its trigger, acceptance gate, and any required evaluation or record evidence.
- Read the accepted scope, outcomes, artifacts, commits, verification, evaluation coverage, user decisions,
  exclusions, risks, and unresolved items. Reject an unsupported completion claim or an unresolved material
  decision.
- Resolve the mode, Gobbi UUID, repository root, project memory root, base branch and commit, work branch,
  absolute worktree, current head, and status from the current caller contract and direct evidence.
- Prove that the worktree is registered to the expected branch, is not the main checkout, and contains no
  unrelated change or concurrent writer. Stop before mutation with the observed root, branch, head, status,
  and recovery point when any proof fails.

#### 1.2 Resolve Memory, handoff, and Git authority

- Freeze the UTC completion time, descriptive outcome title, closure inputs, project memory root, and intended
  handoff path. Freeze the selected Git intent and every authority already granted by the mode contract.
- For Workflow, read publication and related Git intent from its validated current contract. For Cowork,
  default to local retention; push, pull request, issue, merge, or cleanup requires a separate current user
  authorization through the Git operation.
- Confirm that the manager owns user decisions, the final Git sequence, acceptance, display, and recovery.
  Assign one assistant to the bounded Memory update; no other writer may run.
- Treat every unperformed Git action as intent, not outcome. Missing Memory, external, destructive, or
  finalization authority stops before Git and preserves the current recovery state.

### Phase 2 — Update Memory and write the handoff

#### 2.1 Apply Memory

- Give the assistant the frozen closure inputs, exact project memory root, allowed paths, protected paths,
  expected report, and verification contract through the generic [Delegation](../delegation/SKILL.md)
  template plus the calling mode's fields.
- Apply the [Memory operation](../memory/SKILL.md) to the completed work. Load every applicable category skill,
  including [Reports](../memory/reports/SKILL.md) for the handoff and
  [History](../memory/history/SKILL.md) when the completed session produced a durable project change.
- Create the handoff at
  `<project-memory-root>/reports/note/YYYY-MM-DD-{descriptive-title}-handoff.md`, using the UTC completion date
  and report naming rules. Update the report index and every other index or link required by Memory.
- Review all other applicable durable categories, then create, update, move, or remove only what their loaded
  owners require. A completed session with no durable project change creates no History record.
- Require the assistant to reread every changed memory path and return the exact path set and verification.
  Memory failure, an invalid path, unrelated work, or an unexplained stale copy stops before Git with the
  recoverable worktree retained.

#### 2.2 Verify and freeze the handoff report

- Reread the complete Memory result as manager. Confirm that every change stays under the bounded project
  memory root, follows its category owner, keeps required navigation current, and matches the accepted work.
- Populate the tracked report from [the handoff template](handoff.md). Use factual work evidence and
  pre-finalization Git intent only; use `None` for mandatory empty content.
- Confirm that the report is independently readable, contains no secret or transient exhaust, and makes no
  unsupported Git claim. Resolve an existing same-day filename with a more descriptive title, never a
  sequence number or overwrite of another completed event.
- Run the applicable Memory, link, and repository checks. Compare the full worktree diff with the frozen
  closure contract and stop before Git if any changed path is unrelated, missing, or unverified.
- Freeze the report's repository-relative path, exact bytes, and SHA-256 digest in manager runtime context.
  Do not create a second tracked receipt or mutate any session record to hold the digest.

### Phase 3 — Finalize Git

#### 3.1 Perform the authorized Git operation as the final mutation

- Immediately before the first Git mutation, recheck the worktree root, branch, head, status, accepted diff,
  report path, and frozen digest. Stop before mutation when any input drifted.
- Start the [Git operation](../git/SKILL.md) and make its authorized sequence the last mutation of any
  filesystem, Memory, Git, session-record, or external state. Stage only closure-owned paths, inspect the
  staged diff, create the required focused local commit, and reread that commit.
- Continue only through the publication, merge, and cleanup actions that the validated Workflow settings or
  a current Cowork Git authorization permits. Recheck mutable evidence before each dependent action and
  retain unique work on ambiguity, refusal, unavailability, or failure.
- If the local commit fails, do not edit, restage, or retry by changing content. Retain the worktree, record
  the failed command and evidence, and use the retained handoff path as the Phase 4 source.
- Record each resulting state literally as `not configured`, `not authorized`, `not attempted`, `deferred`,
  `failed`, `completed`, or `retained`; branch and worktree may be `removed` only when direct evidence proves
  removal.

### Phase 4 — Display the exact handoff

#### 4.1 Reread and verify the handoff

- When the local commit completed, reread the handoff from that accepted commit's Git object using its exact
  repository-relative path. This remains the preferred source after publication, merge, or cleanup.
- When the local commit failed, reread the exact retained worktree path without changing it. Do not fall back
  to remembered text, a draft, another branch, or a generated substitute.
- Compute SHA-256 from the reread bytes and compare it with the frozen digest. A missing source, byte
  difference, digest mismatch, or evidence of a post-Git mutation stops display without any repair.
- On a stop, return the expected and observed source, path, digest, Git state, retained objects, exact failure,
  and first read-only recovery command.

#### 4.2 Display the handoff and factual Git receipt

- Display the verified tracked handoff byte-for-byte unchanged. Do not add a heading, annotation, status, or
  Git result inside its byte boundary.
- After the complete handoff, append the separate conversation-only Git receipt from
  [the handoff template](handoff.md). Keep every receipt row and derive its state and evidence from direct
  current Git and external-system reads.
- Give one exact first recovery command, or the template's explicit no-recovery value. Do not write the
  receipt to the report, another Memory file, a session record, or the repository.
- Complete only when the exact handoff was displayed, the receipt reports every Git action literally, no
  post-Git mutation occurred, and the result is either finalized or retained at an exact recovery point.

## References

- [Handoff template](handoff.md) defines the tracked operator brief and the separate display-only Git receipt.
