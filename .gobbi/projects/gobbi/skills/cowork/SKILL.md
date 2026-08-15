---
name: cowork
description: "Cowork is a user-led Gobbi work mode for bounded topics in one isolated worktree."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, Task, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
---

# Cowork

Cowork takes one user-supplied topic at a time through Fast or Light delivery in one isolated worktree. Use it
after Gobbi selects Cowork and before any Cowork topic, explicit evaluation, or explicit closure action.

## Principles

### Keep the user in control

The user owns every material scope, design, risk, destructive-action, and external-service decision. The
manager makes each topic concrete, returns accepted evidence, and waits at topic boundaries.

### Keep one inspectable local history

One linked worktree and one ordered writer chain keep tracked results attributable. Ignored shaping results
remain recoverable in the retained worktree, while implementation and durable Memory use focused commits.

### Separate stage quality from evaluation

Every selected stage self-reviews or self-verifies before acceptance. Independent evaluation is a separate
user-called judgment and never substitutes for stage quality.

### Route through one native TODO

The native TODO list selects Cowork's current action. Evidence proves transitions but never becomes a second
route.

## Rules

- **MUST establish one verified isolated Cowork worktree before the first tracked edit, except for the one
  user-approved layout-bootstrap commit.** Use the fully expanded worktree path for every later write and
  change nothing else in the main checkout.
- **MUST continue and recover only in the registered Cowork worktree and session root.** Never create or select
  a replacement worktree or session directory for the same Cowork identity.
- **MUST use the native TODO list to select Configuration, topic stages, explicit Evaluation, and explicit
  Wrap-up.** Use only `pending`, `in_progress`, and `completed`, with at most one item `in_progress`.
- **MUST select and report Fast or Light delivery while the user owns every material decision.** Fast skips
  Ideation and Planning; Light runs bounded canonical Ideation and Planning before Execution.
- **MUST keep one ordered writer chain with role-bound acceptance.** Leaders own ignored Ideation and Planning
  results, executors own implementation commits, and assistants own direct-Memory closure commits.
- **MUST run independent evaluation only after an explicit `evaluate` call.** One call authorizes one fresh
  active-runtime evaluator and one attempted Partner invocation per remaining runtime.
- **MUST run Cowork closure only after an explicit `wrap up` call.** Apply Memory directly and never load
  Wrap-up or create Workflow TODOs, gates, RECORD receipts, or a Workflow Note.

## Procedure

### Phase 1 — Configure the Cowork Session

#### 1.1 Initialize or recover the route

- Enter from Gobbi with `mode: Cowork`, the normalized slug, session partner policy, and validated Gobbi root
  pair. Load [Delegation](../delegation/SKILL.md), [Discussion](../discussion/SKILL.md),
  [Git](../git/SKILL.md), and [Memory](../memory/SKILL.md), in that order.
- Publish the complete fixed Cowork TODO template through the native runtime control. Start only
  `CW · Configuration`; recovery inspects the surviving route and direct evidence before changing a status.
- For a fresh session, capture the original UTC session-start date and generate one full lowercase hyphenated
  UUID. For recovery, require one matching recorded identity, branch, registered worktree, and session root;
  stop instead of creating or selecting a replacement.

#### 1.2 Create the worktree and configuration

- Apply Git preferences to capture the immutable base commit and create or verify the purpose-based work
  branch and isolated worktree. The sole main-checkout exception is an explicitly approved commit containing
  only Gobbi's required layout and ignore file.
- Name the worktree and session leaves `<YYYY-MM-DD>-<slug>-<full-uuid>` and require byte equality. Set the
  session root to `{worktree}/.gobbi/projects/{project}/sessions/<session-leaf>/` and place
  `configuration.md` directly below it.
- Render the [configuration template](templates/configuration.md) as the Configuration phase's accepted record,
  apply Memory `Temporary Record`, and verify
  its identity, locations, settings, evidence, ignored state, native TODO route, and recovery point before
  completing Configuration. A recovered session without this file may create it only when one exact identity,
  branch, registered worktree, session root, and accepted topic history agree.

#### 1.3 Establish topic and session locations

- Create each ignored directory only when its first result needs it, and name every temporary directory and
  file in its owning assignment. Drafts, subagent or teammate responses, Partner results, reviews, scratch
  work, and user-called evaluation material start below `tmp/`; accepted session records go in their topic
  phase or session wrap-up directory, while tracked results stay at their owner-defined paths.

| Content | Relative directory |
|---|---|
| Topic | `topic-NN-slug/` |
| Topic Ideation | `topic-NN-slug/1-ideation/` |
| Topic Planning | `topic-NN-slug/2-planning/` |
| Topic Execution records | `topic-NN-slug/3-execution/` |
| Session wrap-up | `wrap-up/` |
| Temporary work | `tmp/` |

- Keep these TODO titles fixed. Topic, task, assignment, stage, round, subject, and closure identifiers belong
  in contracts, paths, and evidence rather than TODO titles:

```text
CW · Configuration
CW · Topic · IDEATION
CW · Topic · PLANNING
CW · Topic · EXECUTION
CW · Topic · PASS
CW · Evaluation
CW · Wrap-up
```

- At every boundary, refresh `configuration.md` Progress evidence with exact accepted paths and hashes, then
  reconcile the native TODO against the registered worktree, topic contracts, indexed results, commits,
  checks, and evaluation coverage. Activate the earliest unproved item and stop on competing evidence.

### Phase 2 — Deliver User Topics

#### 2.1 Lock the topic and choose its depth

- Apply [Discussion](../discussion/SKILL.md) to lock the topic outcome, purpose, scope, acceptance evidence,
  material decisions, first action, and exclusions. Assign the next stable `topic-NN-slug` and keep this
  contract authoritative for the topic.
- Choose the smallest valid depth from this table:

| Depth | Selection evidence | Route |
|---|---|---|
| **Fast** | The outcome, acceptance evidence, material decisions, and one low-risk reversible task are complete; no design or decomposition choice remains. | Skip Ideation and Planning, then run Execution. |
| **Light** | The topic is bounded, but a design or decomposition choice remains. | Run bounded Ideation, bounded Planning, then ordered Execution. |

- If the topic is too broad, risky, irreversible, or uncertain for Light, use Discussion to ask the user to
  narrow or split it or start Workflow through Gobbi. Never create a hidden third depth or switch modes
  without the user's decision.

#### 2.2 Route the selected stages

- For Fast, mark the Ideation and Planning TODO items completed as not selected and activate Execution. For
  Light, activate Ideation, Planning, Execution, and PASS in order; neither shaping stage is optional.
- Build every assignment through [Delegation](../delegation/SKILL.md). Add the Cowork UUID, topic ID, depth,
  stage, stable assignment ID, absolute worktree and session root, branch, allowed and protected paths,
  exact temporary and final paths, authoritative result, verification, commit authority, and exact role and
  skill paths.
- Prefer re-delegating coherent follow-up to an addressable teammate whose role, evidence, and boundary still
  fit, and always issue a complete new Delegation brief. Compute the [Partner](../gobbi/partner/SKILL.md)
  launch set as the recorded set minus the active runtime. If that set is empty, launch nothing and do
  not rewrite the recorded policy to `disabled`. For each
  remaining runtime, make one attempted invocation with its own `tmp/` path, Delegation prompt, and
  `expected-partner`; Cowork validates each sole write and Handoff, or records Unavailable evidence when the
  attempt cannot launch. `disabled` invokes no external runtime.

#### 2.3 Accept the shaping results

- Fast produces no Ideation or Planning result. Existing recovered sessions retain accepted selected or
  omitted stages and one exact evidence-proved legacy result shape without renaming or migration.
- Light applies [Ideation](../ideation/SKILL.md) and then [Planning](../planning/SKILL.md). Name the complete
  absolute locators `{session-root}/topic-NN-slug/1-ideation/ideation-index.md` and
  `{session-root}/topic-NN-slug/2-planning/plan-index.md` in their assignments.
- Use caller-named `tmp/` paths for drafts and supporting inputs, then have the creator write the curated result
  directly to its phase directory. Accept it only after rereading the index and members, recording paths and
  hashes, and proving the tracked tree unchanged; any membership, order, path, or byte change makes it stale.

#### 2.4 Execute and accept the topic

- Assign each dependency-ready task through [Execution](../execution/SKILL.md). Fast receives one
  manager-assigned `task-NN-slug`; Light preserves the task IDs from the accepted Planning result.
- Keep one writer active, reread every promised result or commit, and reproduce verification before dependent
  work. Return failures, scope drift, or changed decisions to the earliest responsible stage.
- Complete PASS only after every selected result or focused commit is accepted and the worktree is clean.
  Report outcome, scope, results, commits, checks, exclusions, concerns, partner evidence, and evaluation
  coverage separately, then wait with no active item.

### Phase 3 — Evaluate on User Call

#### 3.1 Freeze and evaluate one subject

- Enter only for an explicit `evaluate`. Freeze the user-named subject, or the clean whole branch from the
  immutable base through the current head when no subset is named; an indexed result includes its index and
  every listed member.
- Activate only `CW · Evaluation`, define the decision criteria and report aggregation rule, assign one unique
  caller-named directory below `tmp/`, and apply Memory `Temporary Record` to each exact Evaluation output path.
- Apply [Evaluation](../evaluation/SKILL.md) through one fresh active-runtime evaluator. For each remaining
  runtime, make one attempted Partner invocation over the same frozen subject, each with its own `tmp/` path,
  Delegation prompt, and `expected-partner`. A launchable runtime produces an evaluator report; an Unavailable
  attempt produces Unavailable evidence, not a Partner Handoff. The manager validates and assembles reports
  only through the recorded criteria and aggregation rule.

#### 3.2 Apply findings and coverage

- Apply Gobbi's [finding gate](../gobbi/SKILL.md#23-apply-the-session-wide-finding-gate). A correction returns
  to its owning writer, creates a focused commit when tracked content changes, and makes prior coverage stale.
- Complete Evaluation only when every finding has a disposition and no correction remains unevaluated. Another
  corrected subject requires another explicit `evaluate` call.

### Phase 4 — Close on User Call

#### 4.1 Reconcile durable Memory

- Enter only for an explicit `wrap up`, activate only `CW · Wrap-up`, and organize the accepted closure input
  under `wrap-up/` from caller-named temporary sources. Freeze topics, decisions, results, commits, checks,
  coverage, exclusions, risks, change points, project state, and existing Memory without loading Wrap-up.
- Assign one assistant through Delegation to apply Memory `Memorize` to the full session root and closure input.
  Supply the exact absolute current-project Memory root, update only that boundary, verify it, and create one
  focused commit or a verified no-change result.
- Stop on invalid paths, unresolved decisions, failed checks, wrong-worktree evidence, or unrelated work.
  Never create Workflow TODOs, phase receipts, RECORD evidence, or a Workflow Note.

#### 4.2 Check freshness and return the result

- After the accepted Memory pass, compare evaluation coverage with the resulting head. When no verdict covers
  the whole branch, use Discussion to ask whether to evaluate or close with self-verification only; an
  evaluation choice runs Phase 3, then repeats this check without rerunning unchanged Memory work.
- Require current Execution and Git evidence, a clean Cowork worktree, and an unchanged main checkout. Stop at
  the exact retained recovery state when any claim is unproved.
- Return one compact conversation handoff with outcome, scope, topics, results, commits, Memory result, checks,
  coverage and dispositions, exclusions, risks, UUID, base, branch, worktree, head, status, and first recovery
  command. Retain local objects; publication, merge, and cleanup require another explicit request.

## References

| Name | Description |
|---|---|
| [Gobbi](../gobbi/SKILL.md#23-apply-the-session-wide-finding-gate) | Owns mode entry, the finding predicate, user boundary, and fresh-evaluation rule. |
| [Configuration template](templates/configuration.md) | Defines the ignored Cowork configuration and recovery record. |
| [Git](../git/SKILL.md) | Supplies branch, worktree, commit, publication, cleanup, and recovery preferences. |
| [Discussion](../discussion/SKILL.md) | Owns context understanding, design options, recommendations, and user decisions. |
| [Delegation](../delegation/SKILL.md) | Owns the base specialist prompt and final Handoff contract. |
| [Ideation](../ideation/SKILL.md) | Owns bounded Light design and its indexed result. |
| [Planning](../planning/SKILL.md) | Owns bounded Light task decomposition and its indexed result. |
| [Execution](../execution/SKILL.md) | Owns task implementation, verification, and focused commits. |
| [Evaluation](../evaluation/SKILL.md) | Owns independent target assessment and each complete report. |
| [Memory](../memory/SKILL.md) | Owns session validation, Temporary Record, durable reconciliation, and category routing. |
| [Partner](../gobbi/partner/SKILL.md) | Defines each named-runtime invocation, exact session write, and final Handoff. |
