---
name: wrap-up
description: "MUST load when accepted work must be closed with durable memory and an exact handoff. Wrap-up memorizes the session's durable records, performs the authorized finalization sequence last, and displays an immutable handoff with a factual receipt."
allowed-tools: Read, Grep, Glob, Bash, Agent, Task, AskUserQuestion
skill-type: operation
---

# Wrap-up

Wrap-up is the terminal operation for a manager closing accepted work. It produces current durable memory, a
completed authorized finalization sequence, and an exact operator handoff followed by a factual receipt.

The manager owns entry, the closure contract, user gates, the finalization sequence, acceptance, display, and
recovery. One bounded writer memorizes the session's durable records inside the caller-supplied project memory
root before finalization begins.

## Principles

### Memorizing makes session evidence durable

A session's recorded evidence survives only once it is memorized into the project memory root. That durable
memory preserves the completed work, current decisions, and session progression that future work needs.

### Finalization is the final mutation

All tracked content is complete and frozen before the authorized finalization sequence begins. Later evidence
may be read and displayed, but it cannot be used to repair or decorate the result.

### Handoff and receipt contain different facts

The tracked handoff describes delivered work and the intent known before finalization. The display-only
receipt reports the outcomes that direct evidence proves afterward.

### Recovery is more important than appearance

A recoverable stop with exact evidence is complete failure handling. Unsupported or altered completion text
is not.

## Rules

- **MUST freeze the exact closure inputs and authority before changing memory.** Wrong-worktree evidence,
  unrelated changes, an active writer, or an unresolved decision stops the operation before finalization.
- **MUST memorize the session's durable records before finalization and write the tracked handoff to the
  caller-supplied handoff path.** Verify every affected memory path, index, and link before freezing the report.
- **MUST make the caller-supplied authorized finalization sequence the final mutating operation.** Perform only
  the actions that sequence authorizes, with current authority for every external or destructive action.
- **MUST freeze the handoff bytes and SHA-256 digest before finalization, then reread and verify the exact
  source afterward.** Display those bytes unchanged before appending a separate factual receipt.
- **NEVER put final commit, publication, merge, branch-removal, or worktree-removal results in the tracked
  handoff.** It may state only the intent known before finalization.
- **NEVER repair, rewrite, or counterfeit completion after finalization begins.** Complete the authorized
  sequence or stop with the exact failure, retained objects, and first safe recovery command.

## Procedure

### Phase 1 — Freeze the closure contract

#### 1.1 Validate the completed work and session identity

- Enter only when the calling manager identifies accepted work as ready for terminal closure. The caller owns
  its trigger, acceptance gate, and any required evaluation or recorded evidence.
- Read the accepted scope, outcomes, artifacts, commits, verification, evaluation coverage, user decisions,
  exclusions, risks, and unresolved items. Reject an unsupported completion claim or an unresolved material
  decision.
- Resolve the caller context label, Gobbi UUID, repository root, base branch and commit, work branch, absolute
  worktree, current head, and status from the current caller contract and direct evidence.
- Prove that the worktree is registered to the expected branch, is not the main checkout, and contains no
  unrelated change or concurrent writer. Stop before mutation with the observed root, branch, head, status,
  and recovery point when any proof fails.

#### 1.2 Resolve the caller-supplied inputs and authority

- Take four properties from the caller and treat each as fixed for this closure:

| Property | Value |
|---|---|
| Session memory tree location | The location of the closing session's memory tree, read as the memorization source. |
| Project memory root | The closing project's bounded `.gobbi/projects/<project>/memory/` root, under which every durable memory change must land; reject a value of any other shape. |
| Handoff path | The exact repository-relative path the tracked handoff report is written to. |
| Authorized finalization sequence | The ordered final actions the caller authorizes, with the authority already granted for each. |

- Freeze the UTC completion time, descriptive outcome title, closure inputs, and those four properties. A
  missing, relative, ambiguous, or unauthorized property stops the operation before any memory change.
- Confirm that the manager owns user decisions, the finalization sequence, acceptance, display, and recovery.
  Assign one bounded writer to the memorization; no other writer may run.
- Treat every unperformed final action as intent, not outcome. Missing memory, external, destructive, or
  finalization authority stops before finalization and preserves the current recovery state.

### Phase 2 — Memorize the session and write the handoff

#### 2.1 Assign one bounded writer

- Give one writer everything it needs stated inline: the frozen closure inputs, the session memory tree
  location, the exact project memory root, the caller-supplied handoff path, the allowed and protected paths,
  the required actions, the expected report, and the verification contract. Name no other writer.
- Require it to read the session memory tree that the [Record operation](../record/SKILL.md) wrote at the
  caller-supplied location, and to treat that tree as the complete memorization source.
- Require it to apply the [Memory operation](../memory/SKILL.md) to each category the tree holds, loading every
  applicable category skill and reorganizing or copying each durable record into the project memory root under
  that skill's rules.
- Require it to write the tracked handoff report to the caller-supplied handoff path, and to keep every index
  and link that the applied memory rules require current in the same update.
- Require it to create, update, move, or remove only what the loaded category owners require, and to reread
  every changed memory path and return the exact path set with its verification. A memory failure, an invalid
  path, unrelated work, or an unexplained stale copy stops before finalization with the recoverable worktree
  retained.

#### 2.2 Verify and freeze the handoff report

- Reread the complete memory result as manager. Confirm that every change stays under the bounded project
  memory root, follows its category owner, keeps required navigation current, and matches the accepted work.
- Populate the tracked report from [the handoff template](handoff.md). Use factual work evidence and
  pre-finalization intent only; use `None` for mandatory empty content.
- Confirm that the report is independently readable, contains no secret or transient exhaust, and makes no
  unsupported finalization claim. Resolve an existing same-day filename with a more descriptive title, never a
  sequence number or overwrite of another completed event.
- Run the applicable memory, link, and repository checks. Compare the full worktree diff with the frozen
  closure contract and stop before finalization if any changed path is unrelated, missing, or unverified.
- Freeze the report's repository-relative path, exact bytes, and SHA-256 digest in manager runtime context.
  Do not create a second tracked receipt or mutate any session record to hold the digest.

### Phase 3 — Perform the authorized finalization

#### 3.1 Perform the caller-supplied sequence as the final mutation

- Immediately before its first mutation, recheck the worktree root, branch, head, status, accepted diff, report
  path, and frozen digest. Stop before mutation when any input drifted.
- Perform the caller-supplied authorized finalization sequence and make it the last mutation of any filesystem,
  memory, version-control, session-record, or external state. Stage only closure-owned paths, inspect the
  staged diff, create the required focused local commit, and reread that commit.
- Continue only through the publication, merge, and cleanup actions that sequence authorizes. Recheck mutable
  evidence before each dependent action and retain unique work on ambiguity, refusal, unavailability, or
  failure.
- If the local commit fails, do not edit, restage, or retry by changing content. Retain the worktree, record
  the failed command and evidence, and use the retained handoff path as the Phase 4 source.
- Record each resulting state literally as `not configured`, `not authorized`, `not attempted`, `deferred`,
  `failed`, `completed`, or `retained`; branch and worktree may be `removed` only when direct evidence proves
  removal.

### Phase 4 — Display the exact handoff

#### 4.1 Reread and verify the handoff

- When the local commit completed, reread the handoff from that accepted commit's stored object using its exact
  repository-relative path. This remains the preferred source after publication, merge, or cleanup.
- When the local commit failed, reread the exact retained worktree path without changing it. Do not fall back
  to remembered text, a draft, another branch, or a generated substitute.
- Compute SHA-256 from the reread bytes and compare it with the frozen digest. A missing source, byte
  difference, digest mismatch, or evidence of a post-finalization mutation stops display without any repair.
- On a stop, return the expected and observed source, path, digest, finalization state, retained objects, exact
  failure, and first read-only recovery command.

#### 4.2 Display the handoff and factual receipt

- Display the verified tracked handoff byte-for-byte unchanged. Do not add a heading, annotation, status, or
  finalization result inside its byte boundary.
- After the complete handoff, append the separate conversation-only receipt from
  [the handoff template](handoff.md). Keep every receipt row and derive its state and evidence from direct
  current reads of the affected systems.
- Give one exact first recovery command, or the template's explicit no-recovery value. Do not write the
  receipt to the report, another memory file, a session record, or the repository.
- Complete only when the exact handoff was displayed, the receipt reports every final action literally, no
  post-finalization mutation occurred, and the result is either finalized or retained at an exact recovery
  point.

## References

- [Handoff template](handoff.md) defines the tracked operator brief and the separate display-only receipt.
- [Record operation](../record/SKILL.md) owns the session memory tree this operation memorizes.
- [Memory operation](../memory/SKILL.md) owns the durable memory rules applied to that tree.
