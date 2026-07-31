# Agent Teams

This document owns persistent-specialist scheduling for runtimes that support it and the shared rules for
TODO-based assignment and recovery. Persistent specialists improve continuity but do not change routing,
authority, independence, evidence, or one-writer rules.

When persistent specialists are unavailable, use fresh agents with the complete
[`delegation.md`](delegation.md) contract. Native Codex uses the matching repository custom-agent role; Claude
Code may retain addressable teammates when its runtime supports them.

## Roster

The manager is the sole assignment creator, dispatcher, and TODO owner.

Start these specialists lazily:

| Role | Reuse boundary |
|---|---|
| leader | A coherent Ideation or Planning chain |
| executor | Related ordered tasks in one subsystem |
| assistant | A coherent narrow support or promotion chain |

Evaluators are always fresh and never join a persistent team.

## TODO-based assignment

Every assignment names:

- the exact current TODO and status;
- phase;
- productive step and stage;
- iteration and cap;
- stable `task-NN-slug` when applicable;
- assignment ID; and
- expected evidence.

The manager creates, retitles, reorders, and completes TODO items. Specialists may report progress but cannot
self-claim, reassign, or change progression.

One mutable item represents one productive-step iteration. The manager retitles it from DISCUSSION through
WORK, EVALUATION, and RECORD; after verified PASS it uses the PASS gate marker and completes the item. A
revision creates a new iteration item rather than erasing the completed pass.

A task status is scheduling information until the manager rereads and verifies the promised artifact or
commit.

## Allowed concurrency

Parallel work is limited to independent read-only:

- study;
- factual investigation;
- competing hypotheses;
- test interpretation; and
- critique.

All worktree, record, Git, TODO, and external-system mutations use one ordered writer chain. The manager rejects
a dispatch that overlaps another writer.

## Direct messages

Specialists may exchange only assigned facts, research results, and critique.

They may not:

- change scope;
- decide for the user;
- accept or reassign work;
- change the TODO route;
- authorize destructive or external action; or
- turn an evaluator into a persistent teammate.

Material disagreement returns to the manager. During Phase 2 and Phase 3, the manager resolves routine
in-contract disagreements from evidence and escalates only a critical blocker.

## Assignment handshake

Use this order:

1. The manager creates a stable assignment under [`delegation.md`](delegation.md).
2. A persistent specialist acknowledges the assignment ID, scope, and expected artifact.
3. The specialist performs the bounded work and returns the required status.
4. The manager confirms idle and addressable state when reuse is planned.
5. The manager rereads the artifact or commit and runs the named checks.
6. The manager retitles or completes the TODO only after evidence passes.
7. The next assignment starts only after the prior assignment closes.

An idle notification or lagging task status proves neither success nor failure.

## Continuation and replacement

Continue a specialist only when all of these remain coherent:

- role;
- scope;
- subsystem;
- dependency chain;
- authority;
- loaded context;
- write boundary; and
- addressability.

Replace the specialist after:

- role or subsystem change;
- context drift;
- failed or malformed work;
- lost addressability;
- protected-work conflict; or
- a fresh-independence requirement.

There is no arbitrary task-count limit. Evidence of coherent context decides reuse.

## Context-boundary recovery

After compact, clear, resume, rewind, lost TODO data, or another context boundary:

1. Read the latest completed Hand-off. If none exists, read and verify the Configuration receipt.
2. Inspect the native runtime TODO list when it survives.
3. Verify the Hand-off's claims against workflow-owned RECORD receipts, `gate.md` decisions, canonical
   outputs, checks, task commits, branch, and worktree.
4. Recreate the minimum canonical item sequence from that checkpoint.
5. Walk later evidence strictly in workflow and plan order, applying numbered plan amendments only to the
   pending Execution items they name. Mark an item completed only when its required receipt, gate, artifact,
   verification, and commit all pass.
6. Create or correct the exact first unproved item and make it the only `in_progress` item.
7. Leave every later item `pending`.
8. Verify any surviving specialist's identity, assignment, addressability, and idle state.
9. Continue that specialist only when every check agrees; otherwise start a fully primed replacement.

Evidence is used to reconstruct a missing or incorrect native list, then the native list resumes sole routing.
It does not operate as a parallel live route.

When evidence is incomplete or contradictory, select the earliest safe unproved stage and repeat only
idempotent checks or work. Stop as a critical blocker when repetition could duplicate an unsafe effect or the
conflict cannot be resolved inside existing authority.

Do not infer specialist survival from a name or task entry. The latest Hand-off supplies phase, branch,
worktree, next TODO, and continuation mode; the accepted plan supplies Execution order.

## Phase 2 and Phase 3 continuity

During Phase 2 and Phase 3:

- activate the next stage immediately after verification;
- send the next bounded assignment in the same turn when possible;
- monitor actively running agents or tools;
- resolve routine in-contract choices agent-to-agent;
- record nonblocking findings without a user question; and
- stop only at the workflow's critical-blocker boundary.

A Hand-off is a clear or compact checkpoint. Phase 1 and Phase 2 Hand-offs do not become idle waits;
continuation remains automatic unless the user interrupts.

## Write safety

Every write-capable assignment contains the exact absolute worktree and protected paths. Continued specialists
re-anchor to those paths on every assignment.

Before reuse, the manager verifies the branch, worktree, changed paths, promised artifact, and commit. A report
never substitutes for that reread.

## Completion conditions

A persistent assignment completes only when:

- the status matches the assignment;
- the specialist is idle and addressable when reuse is planned;
- the manager rereads the artifact or commit;
- verification passes;
- scope and protected paths pass; and
- the matching TODO update succeeds.

Runtime scheduling supports the workflow. It never replaces evidence or manager authority.

## References

- [`delegation.md`](delegation.md) owns the assignment shape.
- [`SKILL.md`](SKILL.md) owns routing, phase continuity, and blocker policy.
- [`phase-1.md`](phase-1.md), [`phase-2.md`](phase-2.md), and [`phase-3.md`](phase-3.md) own phase-specific
  operation.
