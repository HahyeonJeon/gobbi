# RECORD Manager Adapter

[`record/SKILL.md`](../../record/SKILL.md) owns RECORD procedure, typed candidates, canonical artifact rules, validation, and all record paths. [`session-record.md`](session-record.md) owns the manager-to-command boundary. This adapter owns assistant dispatch, gates, and the transition after a verdict.

## Entry and dispatch

Enter after EVALUATION has two valid reports or a valid narrow waiver, an aggregate verdict, and a user-approved finding-disposition batch. Dispatch an assistant with the complete current-iteration WORK and EVALUATION evidence, prior iteration evidence required by the record owner, resolved decisions, exact cursor, and expected canonical artifact.

The assistant follows the record skill. It cannot change verdicts, finding dispositions, scope, settings, routing, or user decisions.

## Manager gates

After the assistant reports:

1. reread every promised artifact;
2. run the record command's `verify` operation, including the locked task list when applicable;
3. confirm output files exist only for PASS;
4. confirm typed staging contains only evidence-supported candidates;
5. accept empty staging on a clean PASS; and
6. confirm no durable memory write occurred before Wrap-up.

On Wrap-up, use the wrap-up owner instead of the pre-Wrap-up memory boundary and verify the actual post-promotion tree.

## Transition

RECORD seals every verdict's evidence. After verification, route PASS, REVISE, or FAIL only through [`state-machine.md`](state-machine.md). A failed record validation leaves the current cursor unchanged and surfaces the exact gap. There is no skip path.

## Completion proof

RECORD is complete when the assistant's status report exists, the manager has reread the promised artifacts, the command verifies the record, artifact placement matches the verdict, and the next state transition succeeds atomically.
