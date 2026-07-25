# Workflow State Machine

This document is the sole owner of Gobbi cursor transitions. The manager applies every transition with [`record/scripts/session-record.sh`](../../record/scripts/session-record.sh) `transition`, using a patch file. The command validates the complete candidate and atomically replaces `state.json`; this document owns when a transition is legal, not how bytes are written.

## Cursor contract

Version 3 `state.json` is the only active router. `current.step`, `current.stage`, `current.iteration`, and `current.task` identify the exact work position.

- `configuration` uses `stage: null` and iteration 1.
- `ideation`, `planning`, and `wrap-up` use `task: null`.
- `execution` uses the current locked task identity.
- Iteration 1 is the initial pass. The cap in `session.json.settings.workflow.<step>.maxIterations` is the total number of authorized passes.
- `completedSteps`, `completedTasks`, `lastVerdict`, and `activeDispatches` are routing evidence, not alternate cursors.

The runtime task list is a one-way projection. It may be rebuilt from `state.json` but may never modify it.

## Legal transitions

The fixed step order is Configuration → Ideation → Planning → Execution → Wrap-up. Every productive step uses the same stage order.

| From | Required evidence | To |
|---|---|---|
| Configuration | Fresh or resumed manifest and record verify | Ideation DISCUSSION, iteration 1 |
| DISCUSSION | User gates resolved and neutral WORK contract locked | WORK, same step/iteration/task |
| WORK | Complete validated dual-system package and no unresolved material decision | EVALUATION, same step/iteration/task |
| EVALUATION | Two valid fresh reports, aggregate verdict, and approved finding-disposition batch | RECORD, same step/iteration/task, `lastVerdict` set |
| RECORD after PASS | Valid PASS artifacts and step completion proof | Next step DISCUSSION; next Execution task DISCUSSION; or complete after Wrap-up |
| RECORD after REVISE | Valid iteration record and authorized next pass below cap | Same step/task DISCUSSION, iteration + 1 |
| Any active cursor | Explicit halt condition | Same cursor with `status: halted` |

Write the transition before announcing it. After success, report only `step`, `stage`, `iteration`, and `task` from the persisted candidate.

## Verdict routing

### PASS

PASS advances only after RECORD verifies the canonical artifact and required evidence.

- Ideation PASS appends `ideation` to `completedSteps` and enters Planning DISCUSSION at iteration 1.
- Planning PASS appends `planning`, scaffolds every locked Execution task through the record command, and enters the first task's DISCUSSION.
- An Execution task PASS appends its stable identity to `completedTasks`. Enter the next ordered task at iteration 1, or append `execution` and enter Wrap-up DISCUSSION when all tasks pass.
- Wrap-up PASS appends `wrap-up`, records final completion, and sets `status: complete` only after the manifest outcome and local finalization evidence are checkpointed.

### REVISE below the cap

REVISE means the canonical artifact requires material change. RECORD first seals the current evidence. The next transition returns to DISCUSSION and increments the iteration. The entire WORK package and both fresh evaluator reports are rebuilt for the new iteration; no prior draft, review, or evaluator report satisfies the new pass.

Revision may begin only after the user approves or edits the complete finding-disposition batch.

### REVISE at the cap

If the current iteration equals the configured cap, set `status: halted` at the current RECORD cursor. Do not scaffold or enter an unauthorized iteration. Ask the user to choose among:

1. extend the cap;
2. change direction;
3. narrow scope;
4. return to Ideation; or
5. abort.

For an extension, checkpoint the new cap in `session.json.settings` first. Then scaffold only the newly authorized iteration, verify it, and transition to DISCUSSION. A direction or scope change returns to Ideation unless the user explicitly determines the locked Ideation contract still holds.

### FAIL

FAIL never consumes another iteration automatically. After RECORD seals the failure evidence, set `status: halted` at the current cursor and ask whether to return to Ideation, change scope, or abort. There is no direct automatic revision path.

## Returning to Ideation

A user-authorized return preserves prior artifacts as evidence and resets only progress invalidated by the new Ideation decision.

1. Identify the first Ideation iteration authorized for the changed scope.
2. Remove `ideation`, `planning`, `execution`, and `wrap-up` from `completedSteps` only where their completion depends on the invalidated contract.
3. Remove invalidated entries from `completedTasks`; keep independent completed tasks only when the user explicitly accepts them under the new scope.
4. Set `status: active`, clear obsolete `activeDispatches`, and enter Ideation DISCUSSION.
5. Planning runs again after the revised Ideation PASS.

The old files remain immutable evidence. New iteration directories receive the new work.

## Halt, abort, and resume

- `halted` preserves the exact cursor and reason in the material decision or final outcome. It does not imply failure or completion.
- Abort checkpoints the reason in the manifest outcome, clears active dispatches, and retains the branch and worktree unless authorized safe cleanup is possible.
- Resume validates the manifest, state, worktree, branch, and record. Continue the persisted cursor; do not infer a cursor from filenames or the runtime task list.
- After a runtime context boundary, attach the distinct runtime ID through a manifest checkpoint before continuing.
- Rewind uses the same validation. If durable state and runtime projection disagree, rebuild the projection from durable state.
- A partially reported specialist is not complete. Verify its identity, assignment, report, addressability when applicable, and promised artifact before transitioning.

## Active dispatch rules

`activeDispatches` records only currently relevant assignments. The manager may change an entry from assigned to running to reported to idle as evidence arrives. An idle value cannot create a completion transition. Remove or replace stale entries at a verified context boundary. Evaluator entries are always fresh and may never represent a persistent teammate.

Only one write-capable dispatch may be running at a time. Read-only dispatches may run concurrently when their contracts cannot mutate the worktree, session record, external systems, scope, or user decisions.

## Transition completion proof

A transition is complete only when:

1. the patch file expresses a legal branch above;
2. the record command accepts and atomically writes the candidate;
3. rereading `state.json` shows the intended cursor and status;
4. the required artifact, decision, verification, or record evidence exists and validates; and
5. the runtime task projection matches the persisted cursor.

On any failure, leave the prior state authoritative, keep the user-facing status unchanged, and surface the exact validation or evidence gap.
