# Workflow Session Record

This is the manager adapter to the session-record owner. [`record/SKILL.md`](../../record/SKILL.md), its schemas, and [`record/scripts/session-record.sh`](../../record/scripts/session-record.sh) solely own manifest and state structure, directory shape, canonical artifact placement, peer response rendering, validation, root containment, and atomic replacement.

## Manager contract

The manager uses exactly these command surfaces:

| Need | Command operation |
|---|---|
| Initialize a fresh version 5 manifest, version 3 router, and eager skeleton | `init` |
| Create plan-locked Execution task interiors | `scaffold-tasks` |
| Change active routing | `transition` |
| Change lifecycle manifest data | `checkpoint` |
| Validate and render an opposite-system structured response | `write-artifact` |
| Validate the complete record and optional task coverage | `verify` |

`transition` and `checkpoint` receive patch files. The manager never passes interpolated JSON, edits either JSON file in place, or moves routing data through a lifecycle checkpoint. The command validates the complete candidate before same-directory atomic replacement; a failure must leave the prior file byte-for-byte unchanged.

## Orchestration gates

Before any command, resolve the absolute session root from the validated manifest worktree and require root containment for every target. Before advancing a stage, reread the file the command wrote and run `verify` at the level required by the current cursor.

Use `write-artifact` only for the peer artifact kinds exposed by the command and supply the expected system, step, iteration, and assignment. The command validates structured input and renders Markdown; the opposite-system process never writes into the session tree.

After Planning PASS, pass the complete locked task list to `scaffold-tasks` and `verify`. After an explicit cap extension, create only the newly authorized iteration through the record owner. Existing compatible initialization is idempotent. An older schema is rejected before mutation and remains in its pinned worktree.

## Failure boundary

On a parse, schema, path, rendering, coverage, or shape failure, stop the visible transition and report the command's exact error. Do not repair around the command with ad hoc filesystem writes. If the durable files disagree with the runtime task projection, the durable files win and the projection is rebuilt.

## Completion proof

The record side of a manager action is complete only when the command succeeds, the written file rereads with the intended value, `verify` succeeds, and the required artifact exists at the canonical target selected by the record owner.
