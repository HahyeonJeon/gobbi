---
name: gobbi
description: MUST load at session start, resume, /clear, and runtime compaction. Rebuilds the five-skill manager floor and presents the on-demand skill-map index for both general and full-workflow sessions.
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
skill-type: operation
---

# Gobbi

Use this skill as the cold entrypoint for a Gobbi manager. It rebuilds a small always-load floor after a session start or runtime context boundary, then presents a skill-map index that routes to every other owner on demand. The same light entry serves a general (non-workflow) session and a full Gobbi workflow session.

Gobbi owns bootstrap edges and the skill-routing index only. It does not own workflow routing, record mutation, user-card formats, specialist assignment formats, Git mechanics, peer commands, plugin topology, or a productive-step method. It force-loads no workflow owner and runs no startup gate.

## Principles

### Bootstrap from durable owners

A cold manager reads the always-load floor, the applicable project rules, and the manager role from their durable sources before acting, then reaches every other owner through the skill-map index. Runtime memory, a task-list view, or a stale entry document cannot replace those sources.

### Preserve session identity across runtime contexts

The Gobbi session UUID and version 3 cursor survive resume, `/clear`, rewind, and runtime compaction. A newly observed runtime identity is attached to the existing manifest by its owner; it never becomes a new Gobbi session identity.

### Keep the entry read-only

Gobbi's entry writes nothing. Fresh/resume classification, the defaults decision, and any branch, worktree, session-tree, or manifest creation live inside the indexed `workflow` owner's Configuration, not in the entrypoint.

### Route on demand, do not force the workflow

The entrypoint invents no second route. After rebuilding the floor and presenting the skill map, a general session works from the floor and loads only the indexed skills its task needs; a workflow session loads the indexed `workflow` owner and enters it at the persisted cursor. The workflow owner is loaded only when the session is a workflow session.

### Treat missing retired machinery as success

Gobbi does not depend on hooks, environment-variable passthrough, transcripts, rollout lookup, operational telemetry, or a memory-merging subsystem. Their absence is not degraded operation.

## Rules

### Must follow

- **GB-1 — Run on every entry boundary.** Run this operation at session start, resume, `/clear`, rewind, runtime compaction, and any other boundary that discards or may stale manager context. Runtime compaction means a context boundary; it is unrelated to durable-memory maintenance.
- **GB-2 — Rebuild the floor of exactly five.** The always-load floor is exactly these five skills and no others: `principles`, `delegation`, `discussion`, `ideation`, and `git`. Read them in order, then the applicable project rules and the canonical manager role. Read each source completely before using it. No other skill — `mistake`, `workflow`, `startup`, or any language skill — belongs in the floor; each is reached through the skill map on demand.
- **GB-3 — Load a conditional owner before its action.** Load `codex` when the active runtime is native Codex or an operation uses a Codex peer surface. Before authoring a specialist brief in a workflow session, load the Gobbi assignment skeleton at [`../workflow/delegation.md`](../workflow/delegation.md). The floor already covers `discussion` and `git`, so they are not conditionally loaded here.
- **GB-4 — Preserve durable identity and reuse settings.** Preserve the Gobbi UUID and the persisted version 3 cursor across every boundary. On a runtime context boundary, let the indexed `workflow` owner and Record append a distinct observed runtime ID to the version 5 manifest before work continues. A resumed, cleared, rewound, or runtime-compacted session validates and reuses its existing settings; it never reconfigures merely because context was discarded.
- **GB-5 — Point classification and creation at the workflow owner.** Fresh/resume classification, the read-only defaults preflight, session-tree and manifest creation, and settings placement are owned by the indexed `workflow` skill. Gobbi neither restates their mechanics nor performs them; it loads that owner for a workflow session.
- **GB-6 — Route by session kind; hand off only for a workflow session.** A general session proceeds on the floor without loading the workflow owner. A workflow session enters [`../workflow/SKILL.md`](../workflow/SKILL.md) at the validated durable cursor. Gobbi never loads or dispatches Ideation, Planning, Execution, or Wrap-up specialists directly; the workflow owner dispatches them.
- **GB-7 — Respect owner boundaries and prove cold entry.** Current `workflow`, record, discussion, Git, startup, and Codex owners govern their facts; a cosmetic legacy heading or obsolete statement in a protected role document does not reactivate retired behavior. The active runtime entrypoint must resolve this canonical four-file operation bundle, and a cold reader must find every action owner from `SKILL.md` alone. Route entrypoint or mirror repair to the repository sync owner; never hand-edit a generated or symlinked view.

### Must not follow

- Do not ask for an interaction mode or route to any alternate workflow.
- Do not force-load the workflow owner on entry, and do not run a startup or baseline-classifier gate. The workflow owner and `startup` are indexed skills, loaded only when the session needs them.
- Do not read or create a separate `settings.json`.
- Do not depend on a hook, transcript path, rollout path, environment-export script, agent ledger, token count, cache count, integration counter, or iteration event log.
- Do not run durable-memory merge, threshold, hard-cap, or compaction behavior. Runtime compaction only reloads context and attaches runtime identity when distinct.
- Do not use retired creation vocabulary or a deleted creation child to decide WORK behavior. Follow the `workflow` owner's dual-system WORK.
- Do not restate state transitions, session-tree mechanics, user cards, delegation fields, peer command syntax, Git procedures, plugin layout, or productive-step methods here.
- Do not let a stale root or runtime overview, or a protected role prompt, override a current single owner.

## Skill map

Every skill outside the floor is indexed here once — a name, a one-line description, and a neutral relevance note. The index orients the manager to owners; it is not a load-when gate. Each entry points to its owner and copies no mechanics.

| Skill | Description | Relevance note |
|---|---|---|
| [`mistake`](../mistake/SKILL.md) | Known-pitfall corpus; check before acting, stage a candidate after a correction. | Stays mandatory for non-trivial work and sits at position 4 of every subagent's delegation Load Directives. The index lazy-loads it; it does not weaken it. |
| [`memory`](../memory/SKILL.md) | Durable typed-memory schema, areas, and templates. | Relevant when reading or writing durable project memory. |
| [`workflow`](../workflow/SKILL.md) | The full DISCUSSION→WORK→EVALUATION→RECORD owner: fresh/resume classification, Configuration, routing, dual-system, and finalization. | Load it for a full Gobbi workflow session; it owns session classification, the read-only Configuration preflight, and the cursor handoff. |
| [`startup`](../startup/SKILL.md) | Read-only project-baseline classifier and optional Ideation elicitation. | Relevant to a new, sparse-baseline, or explicitly reset project; loaded when the manager judges it relevant. Gobbi adds no gate around it. |
| [`planning`](../planning/SKILL.md) | The Planning-step method: ordered, dependency-aware task decomposition. | Dispatched by `workflow` at the Planning step, not loaded directly from Gobbi. |
| [`execution`](../execution/SKILL.md) | The Execution-step method: one locked task through study, bounded change, verification, and a focused commit. | Dispatched by `workflow` at the Execution step. |
| [`wrap-up`](../wrap-up/SKILL.md) | The Wrap-up method: promotion, evaluated handoff, and Git finalization. | Dispatched by `workflow` at the Wrap-up step. |
| [`coding`](../coding/SKILL.md) | Language-agnostic construction quality. | Relevant whenever the task writes or changes code. |
| [`desktop`](../desktop/SKILL.md) | Desktop application delivery as an Electron and TypeScript vertical slice: the design fidelity ladder, the privilege boundary, and a signed, update-rehearsed per-OS release. | Relevant when the work targets an installed windowed application; not for a browser page, a command-line tool, a library, or a service. |
| [`python`](../python/SKILL.md) / [`typescript`](../typescript/SKILL.md) | Language method skills. | Relevant when the task enters that language. |
| [`electron`](../electron/SKILL.md) | Electron desktop-application method: process model, sandboxed bridge and IPC, code-only security items, window and native integration, build split, and packaging. | Relevant when the task builds or reviews an Electron desktop application. |
| [`codex`](../codex/SKILL.md) | Native Codex and Codex-peer invocation surfaces. | Relevant when the active runtime is Codex or an operation uses a Codex peer. |

## Procedure

### Session Bootstrap Order

#### 1. Establish the canonical entry context

Confirm the repository or project governance source that selected this skill, the active runtime system, and the entry trigger. Resolve this canonical skill directory through the active entrypoint. If the entrypoint does not resolve to the canonical source, stop and route repair to the repository sync owner; do not edit the view.

Evidence: canonical source path, runtime system, and trigger. The operation has written nothing.

#### 2. Rebuild the floor of exactly five

Read these sources in order:

1. [`../principles/SKILL.md`](../principles/SKILL.md).
2. [`../delegation/SKILL.md`](../delegation/SKILL.md).
3. [`../discussion/SKILL.md`](../discussion/SKILL.md).
4. [`../ideation/SKILL.md`](../ideation/SKILL.md).
5. [`../git/SKILL.md`](../git/SKILL.md).

Then read every applicable file under [`../../rules/`](../../rules/) and any governing repository instructions, and the canonical [`manager` role](../../agents/manager.md). The floor is exactly these five skills; no sixth skill joins it. Do not treat a missing optional rules tier as permission to skip the repository's declared empty-state rule, and do not follow a protected role document into a deleted workflow child.

Evidence: an ordered load register with exact paths and exactly the five floor skills.

#### 3. Load the owner needed for the next boundary

Consult the skill map and load only the indexed owner whose trigger applies. Read [`../codex/SKILL.md`](../codex/SKILL.md) when the active runtime is Codex or any operation uses a Codex peer. Read [`../workflow/delegation.md`](../workflow/delegation.md) before authoring a specialist brief in a workflow session. Load `mistake` before any non-trivial work, and a language skill when the task enters its domain. These sources define their own mechanics; Gobbi does not copy them.

Evidence: each conditional owner is in the load register before its first governed action.

#### 4. Preserve durable identity across the boundary

Preserve the Gobbi UUID and the persisted version 3 cursor. If the active runtime identity is newly observed, let the indexed `workflow` owner use Record's manifest checkpoint to append it uniquely and in order. Validate and reuse the existing settings. Do not rerun any defaults gate, recreate the worktree, or reconfigure merely because context was cleared, rewound, resumed, or compacted.

Evidence: before/after manifest identity, ordered runtime IDs, unchanged settings, and the persisted cursor.

#### 5. Route by session kind

The split is the manager's routine judgment from the task, not a user-facing mode question.

- **General (non-workflow) session:** work from the floor (`principles`, `delegation`, `discussion`, `ideation`, `git`) and load any indexed skill the task needs — `mistake` for a non-trivial decision, a language skill for code. The `workflow` owner is never loaded. There is no Configuration, no session tree, and no dual-system machinery.
- **Workflow session:** load the indexed [`../workflow/SKILL.md`](../workflow/SKILL.md) and enter it at the validated `state.json.current` cursor. The workflow owner then holds fresh/resume classification, the read-only Configuration preflight, the Ideation transition, and every productive step. Gobbi creates nothing and dispatches no productive specialist directly.

On a blocked handoff, report the exact invalid owner artifact, identity, or missing authority. Preserve the prior durable state and do not invent a fallback route.

Evidence: the recorded session kind, the floor load register, and — for a workflow session — the validated cursor handed to the workflow owner.

## References

- [`../principles/SKILL.md`](../principles/SKILL.md) owns the ten behavioral laws every session obeys.
- [`../delegation/SKILL.md`](../delegation/SKILL.md) owns the generic bounded-delegation contract for any session.
- [`../discussion/SKILL.md`](../discussion/SKILL.md) owns user question cards, decision classification, challenge, and finding-disposition exchange.
- [`../ideation/SKILL.md`](../ideation/SKILL.md) owns the refine-what/why/how discipline before acting.
- [`../git/SKILL.md`](../git/SKILL.md) owns branch, worktree, local commit, publication, merge, cleanup, and recovery mechanics.
- [`../workflow/SKILL.md`](../workflow/SKILL.md) owns fresh/resume classification, Configuration, workflow routing, dual-system guarantees, runtime attachment, and the handoff cursor.
- [`../workflow/steps/state-machine.md`](../workflow/steps/state-machine.md) owns legal cursor transitions, iteration routing, halt, and resume behavior.
- [`../workflow/delegation.md`](../workflow/delegation.md) owns the Gobbi specialist brief construction and status handling.
- [`../record/SKILL.md`](../record/SKILL.md) and its [session-record map](../record/record-map.md) own version 5 and version 3 files, settings placement, initialization, checkpointing, containment, and atomic writes.
- [`../startup/SKILL.md`](../startup/SKILL.md) owns read-only baseline classification, the optional Ideation input-building operation, baseline validity, and explicit reset.
- [`../mistake/SKILL.md`](../mistake/SKILL.md) owns the mistake corpus, staging, and Wrap-up promotion.
- [`../codex/SKILL.md`](../codex/SKILL.md) owns native Codex and Codex-peer invocation surfaces.
- [`../../agents/manager.md`](../../agents/manager.md) owns manager role behavior; its protected legacy workflow text is an accepted exception and does not own active routing.
- [`../../../../../scripts/sync-plugin-package.sh`](../../../../../scripts/sync-plugin-package.sh) owns repository entrypoint and plugin-source topology checks.
- [`scenarios.md`](scenarios.md), [`checklists.md`](checklists.md), and [`evaluation.md`](evaluation.md) exercise this operation without adding policy.
