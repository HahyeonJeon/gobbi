# Agent Teams in Workflow

This document owns only what Workflow adds to persistent-specialist scheduling: TODO-based assignment, the
evidence walk that rebuilds a route after a context boundary, and Phase 2 and Phase 3 continuity. It does not
own the teammate mechanism. [`gobbi/agent-teams/SKILL.md`](../gobbi/agent-teams/SKILL.md) owns that mechanism
for every mode — preflight, spawn, acknowledgement, the single writer chain, reuse, continuation, replacement,
and lifecycle close. Workflow is one caller of that operation and supplies its five adapter inputs. A reader
looking for how a teammate is spawned, continued, or replaced is in the wrong file.

Build every fresh or continued brief through the [Delegation](../delegation/SKILL.md) skill with the
workflow-specific fields in [`SKILL.md` Step 1.3](SKILL.md#13-build-and-accept-specialist-assignments).

## TODO-based assignment

The parent Workflow Step 1.3 owns assignment metadata and the response prefix. This document owns only how
those assignments move along the TODO route. Workflow Step 1.3 alone owns report validation and manager
acceptance.

The manager creates, retitles, reorders, and completes TODO items. Specialists may report progress but cannot
self-claim, reassign, or change progression.

One mutable item represents one productive-step iteration. The manager retitles it from DISCUSSION through
WORK, EVALUATION, and RECORD; after verified PASS it uses the PASS gate marker and completes the item. A
revision creates a new iteration item rather than erasing the completed pass.

A task status is scheduling information and never establishes acceptance; Workflow Step 1.3 decides whether
the report may advance the TODO.

## Context-boundary recovery

After compact, clear, resume, rewind, lost TODO data, or another context boundary, walk Workflow's own
evidence:

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

Evidence is used to reconstruct a missing or incorrect native list, then the native list resumes sole routing.
It does not operate as a parallel live route.

When evidence is incomplete or contradictory, select the earliest safe unproved stage and repeat only
idempotent checks or work. Stop as a critical blocker when repetition could duplicate an unsafe effect or the
conflict cannot be resolved inside existing authority.

The latest Hand-off supplies phase, branch, worktree, next TODO, and continuation mode; the accepted plan
supplies Execution order.

Whether a specialist survived the boundary is decided elsewhere.
[`gobbi/agent-teams/SKILL.md` Step 4.2](../gobbi/agent-teams/SKILL.md#42-recover-after-a-context-boundary)
owns that check, and this walk produces the recovery evidence set Workflow hands it.

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

Write safety for a scheduled assignment is likewise not owned here.
[`gobbi/agent-teams/SKILL.md` Step 2.1](../gobbi/agent-teams/SKILL.md#21-spawn-and-assign-a-teammate)
re-anchors every brief, fresh or continued, to its exact worktree, branch, allowed paths, and protected paths,
and [Step 2.2](../gobbi/agent-teams/SKILL.md#22-take-the-acknowledgement-and-hold-the-single-writer-chain)
verifies before dispatch that no other writer holds them. Workflow supplies those paths through
[`SKILL.md` Step 1.3](SKILL.md#13-build-and-accept-specialist-assignments), which also owns report and
artifact validation.

## References

- [`gobbi/agent-teams/SKILL.md`](../gobbi/agent-teams/SKILL.md) owns the mode-neutral teammate operation this
  document adapts.
- [Delegation](../delegation/SKILL.md) owns the generic assignment shape.
- [`SKILL.md`](SKILL.md) owns routing, phase continuity, and blocker policy.
- [`phase-1/SKILL.md`](phase-1/SKILL.md), [`phase-2/SKILL.md`](phase-2/SKILL.md), and
  [`phase-3/SKILL.md`](phase-3/SKILL.md) own the phase-specific operations.
