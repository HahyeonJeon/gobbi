---
name: gobbi
description: MUST load at session start, resume, /clear, and runtime compaction. Rebuilds the manager floor and hands one validated durable cursor to orchestration.
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
skill-type: operation
---

# Gobbi

Use this skill as the cold entrypoint for a Gobbi manager. It rebuilds the minimum manager context after a session start or runtime context boundary, classifies the session through the orchestration owner, applies the Startup baseline gate only when triggered, and hands one validated cursor to orchestration.

Gobbi owns bootstrap edges only. It does not own workflow routing, record mutation, user-card formats, specialist assignment formats, Git mechanics, peer commands, plugin topology, or a productive-step method.

## Principles

### Bootstrap from durable owners

A cold manager reads the behavioral floor, role authority, applicable mistakes, and current workflow owner before acting. Runtime memory, a task-list view, or a stale entry document cannot replace those sources.

### Preserve session identity across runtime contexts

The Gobbi session UUID and version 3 cursor survive resume, `/clear`, rewind, and runtime compaction. A newly observed runtime identity is attached to the existing manifest by its owner; it never becomes a new Gobbi session identity.

### Decide before creating

A fresh start remains read-only until orchestration shows the defaults and resolves “use defaults or customize?” Branch, worktree, session tree, and manifest creation follow that decision.

### Bootstrap once, then follow one cursor

The entrypoint does not invent a second route. After session classification and any triggered Startup choice, the manager enters orchestration at the persisted cursor and loads productive-step specialists only when orchestration dispatches them.

### Treat missing retired machinery as success

Gobbi does not depend on hooks, environment-variable passthrough, transcripts, rollout lookup, operational telemetry, or a memory-merging subsystem. Their absence is not degraded operation.

## Rules

### Must follow

- **GB-1 — Run on every entry boundary.** Run this operation at session start, resume, `/clear`, rewind, runtime compaction, and any other boundary that discards or may stale manager context. Runtime compaction means a context boundary; it is unrelated to durable-memory maintenance.
- **GB-2 — Read the manager floor in order.** Read Principles, applicable project rules, the canonical manager role, Mistake plus applicable project and skill-owned mistakes, then Orchestration plus its mistake companion. Read each source completely before using it.
- **GB-3 — Load conditional owners before their action.** Load Discussion before any user decision, Git before any Configuration Git mutation, and Codex when native Codex or a Codex peer surface is used. Before authoring any specialist brief, load Orchestration's delegation child on demand.
- **GB-4 — Use durable identity and routing.** Preserve the Gobbi UUID and persisted version 3 cursor. On a runtime context boundary, let Orchestration and Record append a distinct observed runtime ID to the version 5 manifest before work continues.
- **GB-5 — Classify only the current worktree.** Resume automatically only when the current worktree contains exactly one unfinished Gobbi session. Zero means fresh classification. More than one requires an explicit session path or a fresh start. An explicit path is validated directly. Never use a global pointer or search other worktrees for a candidate.
- **GB-6 — Keep fresh preflight read-only.** On a fresh path, no branch, worktree, session directory, manifest, state file, or settings artifact may be created before Orchestration resolves the defaults/customize decision. Resolved settings live only in `session.json.settings`.
- **GB-7 — Reuse resumed settings.** A resumed, cleared, rewound, or runtime-compacted session validates and reuses its existing settings. Reconfiguration occurs only on explicit user request or an owner-defined decision at an exhausted iteration cap.
- **GB-8 — Gate Startup through its classifier.** After a fresh session is initialized and before its first Ideation transition, run Startup's read-only baseline classifier. A missing or invalid baseline opens a user-owned choice to run Startup or proceed without it. A valid baseline proceeds. Resume and other context boundaries do not reopen Startup automatically; an explicit baseline reset remains on demand.
- **GB-9 — Hand off exactly once.** After classification, runtime attachment, and any triggered Startup path, enter Orchestration at the validated durable cursor. Do not load or dispatch Ideation, Planning, Execution, or Wrap-up directly from Gobbi.
- **GB-10 — Respect owner and protected-source boundaries.** Current orchestration, record, discussion, Git, Startup, and Codex owners govern their facts. A cosmetic legacy heading, stale runtime overview, or obsolete statement in a protected role document does not reactivate retired behavior. Bootstrap never edits a protected role source to hide that accepted inconsistency.
- **GB-11 — Prove cold entry.** The active runtime entrypoint must resolve this canonical four-file operation bundle. A cold reader must be able to find every action owner from `SKILL.md` alone. Route entrypoint repair to the repository sync owner; do not hand-edit a generated or symlinked view.

### Must not follow

- Do not ask for an interaction mode or route to any alternate workflow.
- Do not read or create a separate `settings.json`.
- Do not depend on a hook, transcript path, rollout path, environment-export script, agent ledger, token count, cache count, integration counter, or iteration event log.
- Do not run durable-memory merge, threshold, hard-cap, or compaction behavior. Runtime compaction only reloads context and attaches runtime identity when distinct.
- Do not use retired creation vocabulary or a deleted creation child to decide WORK behavior. Follow Orchestration's dual-system WORK owner.
- Do not restate state transitions, session-tree mechanics, user cards, delegation fields, peer command syntax, Git procedures, plugin layout, or productive-step methods here.
- Do not let a stale root/runtime overview or protected role prompt override a current single owner.

## Procedure

### Session Bootstrap Order

#### 1. Establish the canonical entry context

Confirm the repository or project governance source that selected this skill, the active runtime system, and the entry trigger. Resolve this canonical skill directory through the active entrypoint. If the entrypoint does not resolve to the canonical source, stop and route repair to the repository sync owner; do not edit the view.

Evidence: canonical source path, runtime system, and trigger. The operation has not written anything.

#### 2. Read the complete manager floor

Read these sources in order:

1. [`../principles/SKILL.md`](../principles/SKILL.md).
2. Every applicable file under [`../../rules/`](../../rules/) and any governing repository instructions.
3. The canonical [`manager` role](../../agents/manager.md).
4. [`../mistake/SKILL.md`](../mistake/SKILL.md), applicable project mistakes, and each applicable skill-owned mistake companion.
5. [`../orchestration/SKILL.md`](../orchestration/SKILL.md) and [`../orchestration/mistakes.md`](../orchestration/mistakes.md).

Do not treat a missing optional rules tier as permission to skip the repository's declared empty-state rule. Do not follow a protected role document into a deleted workflow child; current owners in this list govern the active workflow.

Evidence: an ordered load register with exact paths.

#### 3. Load the owner needed for the next boundary

Before the first user-owned question, read [`../discussion/SKILL.md`](../discussion/SKILL.md). Before branch, worktree, commit, publication, merge, or cleanup work, read [`../git/SKILL.md`](../git/SKILL.md) and its mistake companion. When the active runtime is Codex or any operation uses a Codex peer, read [`../codex/SKILL.md`](../codex/SKILL.md). Before a specialist assignment, read [`../orchestration/delegation.md`](../orchestration/delegation.md).

Load only the owner whose trigger applies. These sources define their mechanics; Gobbi does not copy them.

Evidence: the conditional owner is in the load register before its first governed action.

#### 4. Let Orchestration classify the session

Invoke Orchestration's read-only fresh/resume classifier. It inspects unfinished sessions only in the current worktree unless the user already supplied an explicit session path.

- Exactly one unfinished session enters the resume path.
- Zero unfinished sessions enters the fresh path.
- More than one pauses for an explicit session path or fresh-start decision.
- An explicit session path is validated directly and never inferred from a global pointer.

If manifest, router, branch, worktree, or cursor evidence is invalid, stop at the Orchestration or Record recovery path. Do not infer state from artifact names or a runtime task list.

Evidence: the classifier result and the exact inspected worktree or explicit path.

#### 5. Complete the fresh path without early mutation

For a fresh classification, keep preflight read-only while Orchestration displays the defaults once and asks “use defaults or customize?” After the user resolves every customized value, let Git create the session branch and worktree and let Record initialize the version 5 manifest, version 3 router, and eager session skeleton.

The Gobbi UUID is generated before the branch and worktree. Resolved settings are stored under the manifest. Reread and validate the resulting record before the first productive transition.

Evidence: no-write preimage, defaults decision, UUID creation order, Git isolation evidence, and Record verification.

#### 6. Apply the fresh-session Startup gate

After fresh initialization and before entering Ideation, load [`../startup/SKILL.md`](../startup/SKILL.md) and run its read-only lifecycle and baseline classifier.

- A valid, sufficiently complete baseline proceeds without a Startup conversation.
- A missing or invalid baseline opens one user-owned choice through Discussion: run Startup now or proceed without establishing it.
- Acceptance runs Startup under its own contract and returns here only after its close condition.
- Decline records the decision only where the current record owner requires it and proceeds without inventing baseline facts.

Do not use a fixed `README.md`, `design/`, or `features/` presence heuristic. Startup owns baseline validity. An explicit baseline-reset request may invoke Startup independently later.

Evidence: classifier result, any user decision, and Startup completion evidence when accepted.

#### 7. Complete the resume or context-boundary path

For an exact resume or other context boundary, validate the existing settings and durable cursor. Preserve them automatically. If the active runtime identity is newly observed, let Orchestration use Record's manifest checkpoint to append it uniquely and in order. Preserve the Gobbi UUID.

Do not rerun the fresh defaults gate, recreate the worktree, or reopen Startup merely because context was cleared, rewound, resumed, or compacted.

Evidence: before/after manifest identity, ordered runtime IDs, unchanged settings, and persisted cursor.

#### 8. Hand one cursor to Orchestration

Enter [`../orchestration/SKILL.md`](../orchestration/SKILL.md) at the validated `state.json.current` cursor. Orchestration selects the step adapter, user gates, dual-system WORK, EVALUATION, RECORD, iteration handling, and finalization path.

Gobbi does not load a productive-step specialist directly. It is complete when Orchestration has accepted one durable cursor and the runtime task view, when present, is a projection of that cursor.

On a blocked handoff, report the exact invalid owner artifact, identity, or missing authority. Preserve the prior durable state and do not invent a fallback route.

## References

- [`../orchestration/SKILL.md`](../orchestration/SKILL.md) owns fresh/resume classification, Configuration, workflow routing, dual-system guarantees, runtime attachment, and the handoff cursor.
- [`../orchestration/workflow/state-machine.md`](../orchestration/workflow/state-machine.md) owns legal cursor transitions, iteration routing, halt, and resume behavior.
- [`../record/SKILL.md`](../record/SKILL.md) and its [session-record map](../record/record-map.md) own version 5 and version 3 files, settings placement, initialization, checkpointing, containment, and atomic writes.
- [`../discussion/SKILL.md`](../discussion/SKILL.md) owns user question cards, decision classification, challenge, and finding-disposition exchange.
- [`../git/SKILL.md`](../git/SKILL.md) owns branch, worktree, local commit, publication, merge, cleanup, and recovery mechanics.
- [`../startup/SKILL.md`](../startup/SKILL.md) owns baseline classification, the optional Startup conversation, baseline validity, and explicit reset.
- [`../codex/SKILL.md`](../codex/SKILL.md) owns native Codex and Codex-peer invocation surfaces.
- [`../orchestration/delegation.md`](../orchestration/delegation.md) owns specialist brief construction and status handling.
- [`../../agents/manager.md`](../../agents/manager.md) owns manager role behavior; its protected legacy workflow text is an accepted exception and does not own active routing.
- [`../../../../../scripts/sync-plugin-package.sh`](../../../../../scripts/sync-plugin-package.sh) owns repository entrypoint and plugin-source topology checks.
- [`scenarios.md`](scenarios.md), [`checklists.md`](checklists.md), and [`evaluation.md`](evaluation.md) exercise this operation without adding policy.
