---
name: cowork
description: "Cowork is a user-led Gobbi orchestration mode for fast stepwise implementation in one isolated worktree, with optional Ideation and Planning and user-called evaluation."
allowed-tools: Read, Grep, Glob, Bash, Agent, Task, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
---

# Cowork

Cowork is a user-led Gobbi orchestration mode for fast implementation after the user selects it at Gobbi
entry.

It takes one topic at a time through the smallest safe combination of optional Ideation, optional Planning,
and verified Execution, then returns control to the user. A native runtime TODO route keeps the current
session, topic stages, explicit evaluation, and explicit closure visible without creating Workflow evidence.

## Principles

### Keep the user in control at topic boundaries

The user supplies each topic and owns every material scope, design, risk, destructive-action, and external
service decision. The manager makes the topic concrete, returns accepted evidence, and waits for direction.

### Keep one inspectable local history

One linked worktree and one ordered writer chain keep tracked results attributable. Ignored shaping artifacts
remain recoverable in the retained worktree; implementation and durable Memory changes use focused commits.

### Separate stage quality from independent evaluation

Every selected stage self-reviews or self-verifies before acceptance. Independent evaluation is a
separate user-called judgment, never a substitute for stage quality. The active runtime always supplies the
fresh evaluator; an enabled partner policy adds the external evaluator.

### Route through one native TODO

The runtime TODO list selects Cowork's current action. Accepted artifacts, commits, and checks prove whether
the manager may advance it, but never become a second route.

### Route through one native TODO

The runtime TODO list selects Cowork's current action. Accepted artifacts, commits, and checks prove whether
the manager may advance it, but never become a second route.

## Rules

- **MUST establish one verified isolated Cowork worktree before the first tracked edit, except for the one
  user-approved commit that bootstraps the required layout and its ignore file before the base is captured.**
  Use the fully expanded worktree path for every write after that commit and change nothing else in the main
  checkout.
- **MUST use the native runtime TODO list to select Cowork Configuration, the current topic stage or execution
  task, explicit evaluation, and explicit closure.** Use only `pending`, `in_progress`, and `completed`, with
  at most one item `in_progress`.
- **MUST let the manager select and report Direct, Light, or Structured delivery while the user owns every
  material decision.** Apply canonical Ideation and Planning whenever selected, and reroute when evidence or
  a material decision changes the contract.
- **MUST keep one ordered writer chain with role-bound acceptance.** Leaders own ignored Ideation and Planning
  artifacts, executors own focused implementation commits, and assistants own focused direct-Memory closure
  commits.
- **MUST run independent evaluation only after an explicit `evaluate` call, and let that call authorize
  evaluation alone.** One call authorizes one fresh isolated active-runtime evaluator and, only when the
  session partner policy is enabled, one fresh external evaluator. A bare call uses the whole clean Cowork
  branch through its current head.
- **MUST run Cowork closure only after an explicit `wrap up` call.** Apply the canonical Memory operation
  directly before the final evaluation-freshness decision; never load the Wrap-up skill or create
  Workflow-formatted TODOs, phase receipts, RECORD-stage evidence, a tracked handoff, or a Workflow Hand-off.

## Procedure

### Phase 1 — Establish the Isolated Cowork Session and TODO Route

#### 1.1 Create or recover the Cowork worktree

- Load [Delegation](../delegation/SKILL.md), [Discussion](../discussion/SKILL.md),
  [Git](../git/SKILL.md), and [Memory](../memory/SKILL.md), in that order. Enter only from Gobbi's
  `mode: Cowork`, normalized slug or legacy `slug: not-applicable`, session-wide partner policy, and validated
  `{gobbi-skills-root}` and `{gobbi-agents-root}` pair.
- Use the runtime's native TODO control with only `pending`, `in_progress`, and `completed` and at most one
  active item. Gobbi publishes the complete fixed Cowork template immediately after mode selection; a fresh
  session starts its first item at `CW · Configuration`, and recovery first inspects the surviving list and
  current evidence. In Claude Code use the native task controls; in Codex publish the same ordered list with
  `update_plan`.
- For a fresh identity, generate one full lowercase hyphenated UUID and capture the original UTC session-start
  date before deriving names. Retain both across boundaries. Supply [Git](../git/SKILL.md) its five-property
  contract:

| Property | Cowork value |
|---|---|
| Proved identity | Runtime, original UTC date, normalized slug, full UUID, separately derived names, and matching provenance trailers; legacy recovery uses `slug: not-applicable`. |
| Immutable base | The user-confirmed clean head before worktree creation, including an approved bootstrap commit when required. |
| Isolated worktree | The unoccupied intended absolute path for fresh creation, or one exact registered new or permanent legacy branch/worktree pair for recovery. |
| Publication intent | Local retention. Publication, merge, and cleanup require a separate explicit Git operation and current user authority. |
| Required layout | Gobbi [Step 1.1](../gobbi/SKILL.md#11-establish-the-entry-context-runtime-and-canonical-layout) paths, tracked-or-ignored states, and exact ignore bytes for the resolved project. |

- Let Git validate posture, identity, derivation, collision, creation, writer authorization, and recovery. If
  the required layout is absent, obtain explicit approval for its one allowed bootstrap commit in the main
  checkout before fixing the base. This exception covers only Gobbi's namespace roots and ignore file; without
  approval, stop. Otherwise the main checkout remains unchanged.
- Fresh names derive separately from `(runtime, date, slug, UUID)`: branch
  `<runtime-prefix>-<YYYY-MM-DD>-<slug>-<full-uuid>` and worktree leaf
  `<YYYY-MM-DD>-<slug>-<full-uuid>`. Recovery accepts only one reproducible new or permanent legacy tuple and
  never renames, migrates, rewrites, or replaces an active object.
- Complete Configuration only after current evidence proves the UUID, repository, immutable base, branch,
  registered absolute worktree, head, clean status, original date, slug, identity shape, partner policy, fixed
  root pair, unchanged main checkout except an approved bootstrap, and exact recovery point. Record those facts
  and stop on any unproved identity, isolation, provenance, base, writer, root, or recovery claim.

#### 1.2 Establish the Cowork session locations

- Root a new session at
  `{worktree}/.gobbi/projects/{project}/sessions/<YYYY-MM-DD>-<slug>-<full-uuid>/`. The new session leaf is
  byte-identical to the new worktree leaf, not to the branch. A recovered legacy session keeps its permanent
  `<YYYY-MM-DD>-<full-uuid>` leaf. Apply Memory's separate validators and report the exact retained root with
  the Step 1.1 evidence.
- Use these exact ignored temporary paths. Create a directory only when its first output needs it:

| Content | Path below the session root |
|---|---|
| Topic Ideation | `work/topic-NN-slug/ideation.md` |
| Topic Planning | `work/topic-NN-slug/planning/{tasks.md,plan.md}` |
| Planning scratch | `work/topic-NN-slug/planning/`, removed by Planning when the artifacts freeze |
| Optional creation round | `work/topic-NN-slug/partner/creation/round-N/` |
| Explicit evaluation | `work/evaluation/{whole-branch|subject-slug}/round-N/` |
| Closure input | `work/wrap-up/closure.md` |

- Supply each exact path to [Memory](../memory/SKILL.md) `Temporary Record`. Memory owns identity validation,
  containment, and no-Git capture; Cowork never stages a session path or writes outside the verified worktree.
- Use this exact fixed Cowork title template. Topic discussion is owned by the Ideation stage, so it has no
  separate TODO title. Dynamic topic, task, subject, stage, iteration, and closure values stay in the topic
  contract, assignment, evidence path, or checkpoint; they never become TODO title fields:

```text
CW · Configuration
CW · Topic · IDEATION
CW · Topic · PLANNING
CW · Topic · EXECUTION
CW · Topic · PASS
CW · Evaluation
CW · Wrap-up
```

- Build the complete template at mode selection. Complete or omit optional items only from accepted topic
  evidence, and keep the fixed titles when activating them. The native TODO remains the sole route; topic and
  task identifiers remain required in assignments and recovery evidence, not in the title.

- At a boundary, reconcile the TODO list against identity, registered worktree, accepted commits, topic
  contracts, artifacts, clean status, and evaluation coverage. Reconstruct a missing list and activate the
  earliest unproved item; never trust TODO status without its evidence.

### Phase 2 — Run the User-Topic Loop

#### 2.1 Route and deliver one topic

- Lock the topic's outcome, purpose, scope, acceptance proof, material decisions, artifact paths, first action,
  and exclusions through the loaded [Discussion](../discussion/SKILL.md) contract. For Structured topics, this
  is the Ideation operation's DISCUSSION step and has no separate Cowork TODO. Assign the next stable
  `topic-NN-slug` and select the smallest safe depth:

| Depth | Evidence | Topic path |
|---|---|---|
| **Direct** | Outcome, root cause when applicable, acceptance proof, and one low-risk reversible task are clear. | Execute the locked topic without Ideation or Planning. |
| **Light** | One bounded design choice or modest decomposition remains. | Run only the optional shaping stage the evidence requires, then execute. |
| **Structured** | Work is broad, cross-cutting, architectural, high-risk, hard to reverse, or materially uncertain. | Normally run Ideation, Planning, then ordered Execution. |

- Keep the complete fixed template published at mode entry, with only `CW · Configuration` active initially.
  Activate `CW · Topic · IDEATION` when selected, then only the selected shaping stages, `CW · Topic · EXECUTION`,
  and `CW · Topic · PASS` in order; leave unused optional stages completed or pending according to accepted topic
  evidence. Direct and Light assign `task-NN-slug` before execution. Carry each task ID through the topic
  contract, brief, verification, commit, and recovery evidence, not through TODO titles. Reroute when evidence
  or a user decision changes the contract.
- Build each assignment through [Delegation](../delegation/SKILL.md). Add the Cowork UUID, topic, depth, stage,
  stable assignment and task ID, absolute worktree, branch, prerequisites, allowed and protected paths,
  result, verification, commit authority, escape paths, and exact skill/role paths resolved from the fixed root
  pair.
- In Claude Code, load [Agent Teams](../gobbi/agent-teams/SKILL.md) before persistent specialists. Reuse a
  leader only within one topic's shaping stages, an executor only within one related task chain, and an
  assistant only within one closure memory chain. Reuse only after manager acceptance and a clean tracked
  tree, with a fresh assignment and re-anchored paths and authority.
- Load selected [Ideation](../ideation/SKILL.md) or [Planning](../planning/SKILL.md) only when its TODO is active.
  The leader self-reviews the exact Step 1.2 output, removes Planning scratch, and proves no tracked change.
  For Structured Ideation, the local leader first freezes its draft. Enabled then calls
  [Partner](../gobbi/partner/SKILL.md) for the independent external draft and external cross-review, stores each
  labeled return in the creation round, and lets the leader synthesize. Disabled invokes no external runtime.
  The manager owns local participants, freeze order, assembly, acceptance, and routing. Creation evidence is
  never evaluation coverage.
- Assign each dependency-ready task through [Execution](../execution/SKILL.md). Keep one writer active. The
  manager rereads each artifact or commit and reproduces verification before acceptance or dependent work.
- Advance only from accepted evidence. On a missing or malformed result, failed check, unavailable capability,
  wrong tree, conflicting user work, unsafe recovery, or scope drift, report the exact failure and return to
  the earliest responsible stage. PASS requires every selected ignored artifact or focused commit, reproduced
  verification, and a clean tree. Then report outcome, scope, artifacts, commits, checks, exclusions, concerns,
  external creation evidence, and evaluation coverage as separate facts, and wait with no active item.

### Phase 3 — Evaluate on User Call

#### 3.1 Evaluate one frozen subject

- Enter only for an explicit `evaluate`; creation evidence never satisfies this call. A bare call requires a
  clean worktree and freezes the whole subject from immutable base through current head, including commits,
  tree, contracts, artifacts, user decisions, verification, status, and exclusions. A user-named subset is not
  whole-branch coverage.
- Activate the fixed `CW · Evaluation` item and make it the only active item. Load
  [Evaluation](../evaluation/SKILL.md) before dispatching the fresh evaluators. Place the round under
  `{session-root}/work/evaluation/{whole-branch|subject-slug}/round-N/` and apply Memory `Temporary Record` to
  each caller-named output.
- Dispatch one fresh isolated active-runtime evaluator. Enabled calls [Partner](../gobbi/partner/SKILL.md) for
  one fresh isolated external evaluator over the same frozen subject; neither sees the other report. Disabled
  invokes no external runtime. Each produces a complete [Evaluation](../evaluation/SKILL.md) report; the
  manager assembles the round and uses the more severe available verdict.
- Apply Gobbi's [session-wide finding gate](../gobbi/SKILL.md#14-apply-the-session-wide-finding-gate). A
  correction returns to its owning writer, creates a focused commit for tracked changes, makes coverage stale,
  and requires another explicit evaluation. Complete the item only when every finding has a disposition and no
  correction remains unevaluated.

### Phase 4 — Close on User Call

#### 4.1 Update memory and return the retained result

- Enter only for an explicit `wrap up`. Activate the fixed `CW · Wrap-up` item. Track MEMORY, FRESHNESS, and
  PASS as closure evidence, with only the current closure action active. Freeze the
  accepted topics, scope, decisions, artifacts, commits, checks, coverage, exclusions, risks, current project
  state, and existing memory. Apply [Memory](../memory/SKILL.md) directly; do not load Wrap-up or create
  Workflow closure state.
- Assign an assistant through Delegation with the Step 2.1 Cowork fields. It applies Memory `Memorize` to the
  full session root and frozen closure input, updates only durable current-project memory, verifies it, and
  creates one focused memory commit. Accept a verified no-change result. Stop and repair through that assignment
  for missing category guidance, unresolved decisions, invalid paths, failed checks, wrong-tree evidence, or
  unrelated work.
- Never create Workflow-formatted TODOs, phase receipts, RECORD-stage evidence, a tracked handoff, or a
  Workflow Hand-off. Cowork recovery never looks for `gate.md`, a RECORD receipt, or Workflow Hand-off.
- After the accepted Memory pass, complete MEMORY, activate FRESHNESS, and check evaluation coverage against
  the resulting head. When no independent verdict covers that whole branch, use
  [Discussion](../discussion/SKILL.md) to ask whether to evaluate or close with self-verification only; name
  the uncovered commit range and record a decline literally. An evaluation choice returns FRESHNESS to
  `pending`, inserts and runs Phase 3 as the only active item, then reactivates FRESHNESS and repeats this
  check without rerunning unchanged Memory work.
- Require current Execution and Git evidence, a clean Cowork worktree, and an unchanged main checkout. PASS
  returns a conversation-only handoff with outcome, scope, topics, artifacts, commits, memory result, checks,
  coverage and dispositions, exclusions, risks, UUID, base, branch, worktree, head, status, and first recovery
  command. Retain local objects; publication, merge, and cleanup require a separate explicit Git operation.

## References

| Owner | Boundary |
|---|---|
| [Gobbi](../gobbi/SKILL.md#14-apply-the-session-wide-finding-gate) | Owns the finding predicate, user boundary, fresh-evaluation rule, and PASS-only continuation. |
| [Git](../git/SKILL.md) | Owns identity and isolation validation, name derivation, collision handling, writer authorization, commits, publication, merge, cleanup, and Git recovery. |
| [Memory](../memory/SKILL.md) | Owns session identity and containment validation, Temporary Record safety, durable judgment, and category routing. |
| [Delegation](../delegation/SKILL.md) | Owns the base specialist brief; Cowork adds the Step 2.1 fields. |
| [Partner](../gobbi/partner/SKILL.md) | Owns each enabled external invocation and frozen return; Cowork owns participants, round assembly, acceptance, and routing. |
| [Evaluation](../evaluation/SKILL.md) | Owns each complete evaluator report; Cowork owns the call trigger, subject, participant count, coverage, and finding route. |
| [Agent Teams](../gobbi/agent-teams/SKILL.md) | Owns Claude Code team setup, use, limits, and cleanup. |
