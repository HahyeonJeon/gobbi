# Claude Code Agent Teams

This document owns Gobbi's persistent-specialist policy for Claude Code. Current Claude Code forms one implicit team when the first teammate starts, displays teammates in-process by default, and cleans the team up automatically when the session exits. Manual team lifecycle calls are obsolete. See the [official Agent Teams guide](https://code.claude.com/docs/en/agent-teams).

The capability is valuable but not required. When unavailable, use fresh subagents with the complete delegation contract. Native Codex uses its native specialist mechanism instead.

## Roster and creation

The manager is the lead and sole task creator. Lazily start a predictably named `leader`, `executor`, or `assistant` on first use. Retain a teammate only while its role and dependency chain remain coherent.

An `evaluator` is never a teammate. Every evaluator is a fresh isolated agent outside the persistent team.

Claude Code supports one team per session. Teammates use the shared runtime task list, but `state.json` and verified artifacts remain authoritative. The manager assigns tasks; teammates never self-claim or reassign them.

## Allowed concurrency

Parallel teammate work is limited to read-only research, competing hypotheses, factual investigation, and critique whose contracts cannot mutate the worktree, session record, external systems, scope, or user decisions.

All worktree mutations use one ordered writer chain. A leader, executor, or assistant with write authority must not overlap another writer. The manager rejects any task layout that would create parallel writers.

## Direct messages

Direct teammate messages are allowed only for explicitly assigned research, factual handoffs, and critique. They may not:

- change or expand scope;
- decide for the user;
- reassign or accept work;
- authorize destructive action or publication; or
- mark a durable workflow transition complete.

Material disagreements return to the manager, who presents user-owned choices when needed.

## Assignment handshake

Every teammate assignment follows this order:

1. The manager creates and assigns a stable task ID with the bounded brief from [`delegation.md`](delegation.md).
2. The teammate explicitly acknowledges the task ID, scope, and expected artifact.
3. The manager waits for the response-first structured status report.
4. The manager confirms the teammate is idle and addressable after the report.
5. The manager rereads the promised artifact or commit and runs its verification.
6. Only then does the manager mark the runtime task complete and advance `state.json`.
7. A follow-up brief is sent only after all prior steps succeed.

An idle notification alone means neither success nor failure. Shared task status can lag actual work and cannot override verified artifact evidence.

## Continuation and replacement

Continue the same leader across a coherent Ideation or Planning chain. Continue the same executor across related ordered tasks in the same subsystem when its scope and context remain reliable. Continue an assistant across a coherent bounded support chain.

Replace a teammate when:

- the subsystem or role changes;
- context drift makes the prior brief unreliable;
- the teammate fails or loses addressability;
- the next assignment requires independence; or
- durable artifacts no longer agree with its reported context.

There is no arbitrary limit on the number of related tasks. Evidence of coherence, not a counter, decides continuation.

## Runtime context boundaries

Teammates are not restored by resume or rewind. After compact, clear, resume, rewind, or another runtime context boundary:

1. read `state.json` and the runtime task list;
2. identify the expected teammate and stable assignment;
3. verify identity, assignment, addressability, and idle state;
4. continue only when all four match durable evidence; and
5. otherwise start a replacement and fully re-prime it from the canonical session artifacts.

Do not infer survival from a name in the runtime task list. Resume and rewind therefore take the replacement path; the confirmed-survivor path applies only to a boundary where the runtime still exposes the same live teammate. Any survivor may continue only after the same verification.

## Write safety

Every write-capable brief contains the exact absolute worktree and session root. Continued specialists re-anchor on those paths for each assignment. The manager checks the promised paths and Git branch after every report before assigning more work.

No Agent Teams quality enforcement is added outside this evidence handshake. Runtime notifications support scheduling; durable state, artifacts, tests, and commits prove completion.

## Completion conditions

A persistent assignment closes only when the structured report matches the stable task ID, the teammate is idle and addressable, the manager rereads and verifies its artifact, and the durable transition succeeds. Session exit needs no manual team cleanup; unmerged branch and worktree retention follow the Git and Wrap-up policies, not the runtime team's lifecycle.
