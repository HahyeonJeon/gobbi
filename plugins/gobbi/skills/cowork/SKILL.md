---
name: cowork
description: "Cowork is a user-led Gobbi work mode for bounded topics in one isolated worktree."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, Task, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
---

# Cowork

Cowork takes one user-supplied topic at a time through Fast or Light delivery in one isolated worktree. Use it
after Gobbi selects Cowork and before any Cowork topic, explicit commit, explicit evaluation, or explicit
closure action.

## Principles

### Keep the user in control

The user owns every material scope, design, risk, destructive-action, and external-service decision. The
manager idle-waits after Configuration until the user delivers the work, then makes each topic concrete,
returns accepted evidence, and waits at later topic boundaries.

### Keep one inspectable local history

One linked worktree and one ordered writer chain keep tracked results attributable. Ignored shaping results
remain recoverable in the retained worktree; implementation commits happen only after an explicit user
`commit`, and durable Memory commits still happen on `wrap up`.

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
- **MUST use the native TODO list to select Configuration, topic stages, Commit, Evaluation, and Wrap-up,
  using only `pending`, `in_progress`, and `completed`, with at most one item `in_progress`, and complete
  Configuration as an idle wait that leaves later items `pending`.** Start a topic stage only after
  delivered work exists: a user statement of the outcome, topic, or request, not mode, slug, partner
  policy, "continue", "ok", "looks good", or repository state.
- **MUST apply [Discussion](../discussion/SKILL.md) through the recorded participant policy before recommending
  a consequential topic/work option or asking for a required topic/work decision.** Cowork selects available
  subagents or teammates and each launchable remaining Partner, routes any needed focused follow-up to an
  addressable subagent or teammate, and owns user decisions and the reported route; Fast skips Ideation and
  Planning, while Light runs bounded canonical Ideation and Planning before Execution.
- **MUST keep one ordered writer chain with role-bound acceptance.** The matching craft owns ignored Ideation
  and Planning results and implementation writes, and, only after `commit` authority, implementation commits;
  assistants own direct-Memory closure commits.
- **MUST run evaluation, implementation commit, and Cowork closure only after the matching explicit user
  `evaluate`, `commit`, or `wrap up` call.** One `evaluate` authorizes one fresh matching-craft agent and
  one Partner wrapper per remaining runtime; one `commit` authorizes focused implementation commits; one
  `wrap up` applies Memory directly and never loads Wrap-up or creates Workflow TODOs, gates, RECORD receipts,
  or a Workflow Note.

## Procedure

### Phase 1 — Configure the Cowork Session

#### 1.1 Initialize or recover the route

- Enter from Gobbi with `mode: Cowork`, the normalized slug, session partner policy, and validated Gobbi root
  pair. Load [Delegation](../delegation/SKILL.md), [Discussion](../discussion/SKILL.md),
  [Git](../git/SKILL.md), and [Memory](../memory/SKILL.md), in that order.
- Publish the complete fixed Cowork TODO template through the native runtime control. Start only
  `CW · Configuration`; recovery inspects the surviving route and direct evidence before changing a status,
  reconstructs the idle wait when Configuration is complete and delivered work is absent, and may activate
  the earliest unproved item only after delivered work exists.
- For a fresh session, capture the original UTC session-start date and generate one full lowercase hyphenated
  UUID. For recovery, require one matching recorded identity, branch, registered worktree, and session root;
  stop instead of creating or selecting a replacement, and do not ask which branch is the base.

#### 1.2 Create the worktree and configuration

- On the start checkout Gobbi started in, run `git branch --show-current` before creating the worktree, and
  record that name as `Base branch` and that checkout as `Base checkout`. If the name is empty, or the
  checkout is dirty or unusable, stop; do not ask which branch is the base, and never use the worktree
  branch as the base.
- Apply Git preferences to capture the immutable base commit from the recorded `Base branch` and create or
  verify the purpose-based work branch and isolated worktree; the sole main-checkout exception is an
  explicitly approved commit containing only Gobbi's required layout and ignore file. Name the worktree and
  session leaves `<YYYY-MM-DD>-<slug>-<full-uuid>` and require byte equality, set the session root to
  `{worktree}/.gobbi/projects/{project}/sessions/<session-leaf>/`, and place `configuration.md` directly
  below it.
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
CW · Commit
CW · Evaluation
CW · Wrap-up
```

#### 1.4 Complete Configuration as an idle wait

- Mark `CW · Configuration` completed after refreshing `configuration.md` Progress evidence and recording
  the idle-wait recovery point when delivered work is absent. Leave every later item `pending` with no item
  `in_progress`, and do not activate the earliest unproved item.

### Phase 2 — Deliver User Topics

#### 2.1 Lock the topic and choose its depth

- Enter only when Configuration is complete and delivered work exists; a concrete outcome statement already
  in the session may be used after Configuration, not during it. If delivered work is absent, idle-wait with
  no item `in_progress`; asking the user to state the work is allowed, and studying, ideating, planning, or
  executing is not.
- Apply [Discussion](../discussion/SKILL.md) to lock the topic outcome, purpose, scope, acceptance evidence,
  first action, exclusions, and required user decisions; assign the next stable `topic-NN-slug` and keep this
  contract authoritative. Define topic/work design and decisions as choices whose viable answers can change
  the topic/work goal, requirements, scope or boundary, observable behavior, policy, strategy, algorithm,
  pattern or design direction, safety or privacy risk, authority, cost, dependency or reversibility, or
  acceptance.
- Choose the smallest valid depth from this table. Document completeness and implementation detail enter the
  topic/work design and decision scope only when they prove a missing or contradictory topic/work choice; if
  the topic is too broad, risky, irreversible, or uncertain for Light, ask the user to narrow or split it or
  start Workflow through Gobbi, and never create another depth or switch modes without the user's decision.

| Depth | Selection evidence | Route |
|---|---|---|
| **Fast** | The topic contract is complete, no in-scope design choice remains, and the work needs no decomposition. | Skip Ideation and Planning, then run Execution. |
| **Light** | The topic is bounded, but an in-scope design choice or decomposition need remains; decomposition may select Light without becoming an Ideation decision. | Run bounded Ideation, bounded Planning, then ordered Execution. |

#### 2.2 Route the selected stages

- For Fast, mark the Ideation and Planning TODO items completed as not selected and activate Execution; for
  Light, activate Ideation, Planning, Execution, and PASS in order, and neither shaping stage is optional.
  After a topic is locked, later boundaries refresh `configuration.md` Progress evidence and activate the
  next selected stage, and stop on competing evidence.
- Build every assignment through [Delegation](../delegation/SKILL.md) with the Cowork UUID, topic ID, depth,
  stage, stable assignment ID, absolute worktree and session root, branch, allowed and protected paths,
  exact temporary and final paths, authoritative result, verification, commit authority, a skills index of
  skill, path, and description, a docs index of doc, path, and description, and, when the assignment is Evaluate, one named `evaluation-depth` token. Set Execution
  commit authority to none unless the assignment is the user-called `commit`.
- Route a needed Discussion follow-up to an addressable subagent or teammate whose role, evidence, and boundary
  still fit, and always issue a complete new Delegation brief. Apply [Partner](../gobbi/partner/SKILL.md) to the
  recorded launch set minus the active runtime; launch none when the set is empty or disabled without rewriting
  the policy, otherwise spawn one parallel-capable wrapper per launchable runtime through the active runtime's
  subagent system with its named outside-session capture, prompt, and `expected-partner`, then validate the
  worktree write set, unchanged main checkout, and Handoff after return or record Unavailable when launch fails.

#### 2.3 Accept the shaping results

- Fast produces no Ideation or Planning result. Existing recovered sessions retain accepted selected or
  omitted stages and one exact evidence-proved legacy result shape without renaming or migration.
- For Light with an in-scope topic/work design or decision, apply the collaboration Rule and select
  [Coding Ideation](../coding/coding-ideation/SKILL.md) when the productive subject has an unresolved material
  code-design choice; otherwise select
  [Ideation Step 1.1](../ideation/SKILL.md#11-establish-the-operation-contract). Give the selected operation
  Generic Ideation's complete caller contract plus the topic/work scope, applicable participant discussion
  records, absolute locators
  `{session-root}/topic-NN-slug/1-ideation/ideation-index.md` and
  `{session-root}/topic-NN-slug/2-planning/plan-index.md`, and recovery boundary, then route a returned decision
  package to Step 2.1; a decomposition-only Light route selects neither Ideation operation, creates no Ideation
  decision or participant discussion, and proceeds to Generic Planning.
- Use caller-named `tmp/` paths for drafts and supporting inputs, then have the creator write the curated result
  directly to its phase directory. Accept Ideation only when its caller completion test passes, the index and
  members are reread, paths and hashes are recorded, and the tracked tree is unchanged; any membership, order,
  path, or byte change makes it stale, and accepted Ideation then continues to [Planning](../planning/SKILL.md).

#### 2.4 Execute and accept the topic

- Assign each dependency-ready task through [Coding Execution](../coding/coding-execution/SKILL.md) with
  [Execution](../execution/SKILL.md) when its settled writer frontier includes code; otherwise use Execution
  alone. Fast receives one manager-assigned `task-NN-slug`; Light preserves the task IDs from the accepted
  Planning result.
- Keep one writer active, reread every promised result or commit, and reproduce verification before dependent
  work. An explicitly authorized [Coding Review](../coding/coding-review/SKILL.md) result stays review-only
  inside the current stage, creates no TODO or gate, and cannot replace required implementation or Evaluation;
  return failures, scope drift, or changed decisions to the earliest responsible stage.
- Complete PASS only after every selected result is accepted and verified. Do not require a focused
  implementation commit or a clean tracked tree; report outcome, scope, results, commits, checks, exclusions,
  concerns, partner evidence, and evaluation coverage separately, then wait with no active item.

### Phase 3 — Commit on User Call

#### 3.1 Commit accepted implementation changes

- Enter only for an explicit `commit` and activate only `CW · Commit`. Do not render the diff; the call is the
  confirmation.
- Assign the matching craft through [Delegation](../delegation/SKILL.md) to create focused commit(s) of
  accepted uncommitted tracked implementation changes. Use one commit in the normal case, or one commit per
  accepted topic when the dirty set spans more than one topic.
- Verify the resulting commits and that each tree contains only accepted tracked implementation changes.
  Complete `CW · Commit` and wait with no active item.

### Phase 4 — Evaluate on User Call

#### 4.1 Freeze and evaluate one subject

- Enter only for an explicit `evaluate` and freeze the user-named subject, or the whole branch from the
  immutable base through the current head when no subset is named and no uncommitted tracked implementation
  changes exist; an indexed result includes its index and every listed member, and whole-branch evaluate uses
  `evaluation-depth` `by-owning-stage`. If uncommitted tracked implementation changes exist and the user did
  not name a subset, stop and ask for `commit` or a named subject.
- Activate only `CW · Evaluation`, name one locked `evaluation-depth` token, define the decision criteria and
  contract-gate aggregation rule, assign one unique caller-named directory below `tmp/` as the aggregation
  parent with per-runtime children `<runtime>/report.md` and `<runtime>/checklist.md`, apply Memory
  `Temporary Record` to each exact file path under that parent, and keep runtime tokens `claude-code`,
  `codex`, `cursor`, and `grok`; do not use `claude` or alias historical names such as `codex.md`. Use
  `ideation-design` for Ideation (goal, decisions, boundaries, constraints, work strategy, indexed
  integrity, required discussion, and user decisions, not implementation completeness or document polish),
  `planning-decomposition` for Planning (hierarchy coverage, grouping coherence, dependency-valid order,
  assignment contract, and indexed integrity, not implementation recipes), `execution-implementation` for
  implementation, and `by-owning-stage` for mixed subjects.
- Apply Generic [Evaluation](../evaluation/SKILL.md) only through one fresh matching-craft agent and one
  Partner wrapper subagent per remaining runtime over the same frozen subject and named `evaluation-depth`. For a
  frozen target or owned slice with an in-contract code judgment, each evaluating agent consumes the
  [Coding Review checklist](../coding/coding-review/checklist.md) as Evaluation's code baseline after recording
  its unaided critique; under `by-owning-stage`, apply that baseline only to matching implementation slices, and
  never run Coding Review as Evaluation. Keep
  remaining-runtime briefs naming write set `runtime-directory`, the caller-named aggregation parent, a
  Delegation prompt, `expected-partner`, and `evaluation-depth`; a missing write set still means
  `writing-path-only` and cannot complete this assignment. Wrapper capture stays private outside the
  session and is not the evaluation parent; a launchable runtime produces both files, an Unavailable
  attempt produces Unavailable evidence, and the manager aggregates only contract-gate verdicts from
  complete pairs after Evaluation has applied the token rather than writing a RECORD.

#### 4.2 Apply findings and coverage

- Apply Gobbi's [finding gate](../gobbi/SKILL.md#23-apply-the-session-wide-finding-gate). A correction returns
  to its owning writer and waits for `commit` when it changes tracked files; it does not auto-commit, and it
  makes prior coverage stale.
- Treat a runtime directory that holds only one of `report.md` and `checklist.md` as incomplete evidence, never
  a report to disposition, and never PASS input. Assemble and disposition only complete pairs, using
  contract-gate verdicts; do not treat quality opinion or out-of-contract Problems as the aggregation result.
- Complete Evaluation only when every finding has a disposition and no correction remains unevaluated. Another
  corrected subject requires another explicit `evaluate` call.

### Phase 5 — Close on User Call

#### 5.1 Reconcile durable Memory

- Enter only for an explicit `wrap up` and activate only `CW · Wrap-up`. If uncommitted tracked implementation
  changes remain, stop and require `commit` first; otherwise organize the accepted closure input under
  `wrap-up/` from caller-named temporary sources and freeze topics, decisions, results, commits, checks,
  coverage, exclusions, risks, change points, project state, and existing Memory without loading Wrap-up.
- Assign one assistant through Delegation to apply Memory `Memorize` to the full session root and closure input.
  Supply the exact absolute current-project Memory root, update only that boundary, verify it, and create one
  focused commit or a verified no-change result.
- Stop on invalid paths, unresolved decisions, failed checks, wrong-worktree evidence, or unrelated work.
  Never create Workflow TODOs, phase receipts, RECORD evidence, or a Workflow Note.

#### 5.2 Check freshness and return the result

- After the accepted Memory pass, compare evaluation coverage with the resulting head. When no contract-gate
  verdict covers the whole branch, use Discussion to ask whether to evaluate or close with self-verification
  only; quality `does-not-meet` with contract-gate PASS is not REVISE and is not missing coverage, and an
  evaluation choice runs Phase 4 then repeats this check without rerunning unchanged Memory work.
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
| [Delegation](../delegation/SKILL.md) | Owns the base specialist prompt, skills and docs indexes, and final Handoff contract. |
| [Ideation](../ideation/SKILL.md) | Owns bounded Light design and its indexed result. |
| [Planning](../planning/SKILL.md) | Owns bounded Light task decomposition and its indexed result. |
| [Execution](../execution/SKILL.md) | Owns task implementation, verification, and focused commits. |
| [Evaluation](../evaluation/SKILL.md) | Owns independent target assessment and each complete `report.md` plus working `checklist.md`. |
| [Coding Ideation](../coding/coding-ideation/SKILL.md) | Adds code-design coverage to a matching Light Ideation stage. |
| [Coding Execution](../coding/coding-execution/SKILL.md) | Adds code-specific implementation coverage to a matching Execution task. |
| [Coding Review](../coding/coding-review/SKILL.md) | Produces an explicitly authorized review-only result without creating a mode gate. |
| [Memory](../memory/SKILL.md) | Owns session validation, Temporary Record, durable reconciliation, and category routing. |
| [Partner](../gobbi/partner/SKILL.md) | Defines each named-runtime invocation, worktree write root, and final Handoff. |
