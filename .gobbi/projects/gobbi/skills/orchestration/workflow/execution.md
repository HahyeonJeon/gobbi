# Execution Manager Adapter

[`execution/SKILL.md`](../../execution/SKILL.md) owns the executor lifecycle. This adapter owns per-task entry, dispatch inputs, user gates, completion proof, and transitions.

## Entry and DISCUSSION

Enter one locked task at a time in plan order. Dispatch the executor with the stable task ID, canonical plan, accepted upstream artifacts, current worktree preimage, applicable rules and mistakes, exact in-scope and out-of-scope paths, required skills, acceptance criteria, verification commands, and prior approved finding dispositions.

The manager resolves with the user any newly discovered scope, design, destructive, dependency, or authority decision. If the locked plan is invalid, return through Planning or Ideation as the evidence requires. DISCUSSION completes when the task contract is executable without changing scope.

## WORK

Run [`dual-system-work.md`](dual-system-work.md) for the current task. Both systems independently analyze the same task and frozen preimage, then cross-review. The active-runtime executor synthesizes, applies the resolved change, verifies it, and creates the focused local task commit required by the Git and Execution skills.

Only one worktree writer may run. Read-only investigation may be parallel, but no second specialist or peer process may mutate the worktree or session record concurrently.

## EVALUATION

Run [`evaluation.md`](evaluation.md). Both fresh evaluators receive the full creation package, resolved decisions, canonical implementation evidence, diff, task contract, tests, and relevant repository state. Evaluators independently verify claims with appropriate read-only commands and do not see each other's reports. Obtain the user's finding-disposition decision before RECORD.

## RECORD and task advance

Run [`record.md`](record.md). On PASS, reread the committed diff and verification evidence, verify the canonical task artifact, append the task identity to completed tasks, and enter the next task at iteration 1. After the final task passes, transition to Wrap-up DISCUSSION. On REVISE or FAIL, remain on the same task and follow [`state-machine.md`](state-machine.md). Empty staging is valid.

The same executor may continue across related ordered tasks only under [`agent-teams.md`](../agent-teams.md). A specialist report or idle state never replaces artifact and commit verification.
