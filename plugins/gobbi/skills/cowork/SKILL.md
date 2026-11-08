---
name: cowork
description: "Cowork is a user-led Gobbi work mode that keeps related requests in one topic in one worktree."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, Task, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
---

# Cowork

Cowork takes the user's requests through Ideation, Planning, and Execution in one isolated worktree. Related
requests stay in one topic, and a new topic starts only on the user's call or approval. Use it after Gobbi
selects Cowork and before any Cowork topic, explicit commit, explicit review, or explicit closure action.

## Principles

### Keep the user in control

The user owns every material scope, design, risk, destructive-action, and external-service decision. The
manager idle-waits after Configuration until the user delivers the work, then makes each topic concrete,
returns accepted evidence, and waits for the next request.

### Keep related work in one topic

A topic is the line of work the user is pursuing, not one request or one task. Most new requests continue it,
so related work, its decisions, and its records stay together. Changing the topic is the user's call.

### Keep one inspectable local history

One linked worktree and clear task ownership keep each tracked change traceable. Ignored shaping results
remain recoverable in the retained worktree; implementation commits happen only after an explicit user
`commit`, and durable Memory commits still happen on `wrap up`.

### Separate stage quality from review

Every selected stage self-reviews or self-verifies before acceptance. Independent review is a separate
user-called judgment and never substitutes for stage quality.

## Rules

- **MUST establish one verified isolated Cowork worktree before the first tracked edit, except for the one
  user-approved layout-bootstrap commit.** Use the fully expanded worktree path for every later write and
  change nothing else in the main checkout.
- **MUST continue and recover only in the registered Cowork worktree and session root.** Never create or select
  a replacement worktree or session directory for the same Cowork identity.
- **MUST continue related work in the current topic.** Open a new topic only when the user asks for one, or
  when the manager judges the work truly unrelated and the user approves. Ask with the reason, and stay in the
  current topic until the user answers.
- **MUST start a topic stage only after delivered work exists.** Delivered work is a user statement of the
  outcome, topic, or request, not mode, slug, partner policy, "continue", "ok", "looks good", or repository
  state.
- **MUST apply [Discussion](../discussion/SKILL.md) through the recorded participant policy before recommending
  a consequential topic/work option or asking for a required topic/work decision.** Cowork selects available
  subagents or teammates and each launchable remaining Partner, routes any needed focused follow-up to an
  addressable subagent or teammate, and owns user decisions and the reported route.
- **MUST keep role-bound acceptance.** The `leader` owns ignored Ideation and
  Planning results. The `executor` owns implementation writes and, only after `commit` authority,
  implementation commits. Assistants own direct-Memory closure commits.
- **MUST run review, implementation commit, and Cowork closure only after the matching explicit user
  `review`, `commit`, or `wrap up` call.** One `review` authorizes, for each artifact class in the subject,
  one fresh `reviewer`, not the producer, and one read-only background Partner run per remaining runtime;
  one `commit` authorizes focused implementation commits; one `wrap up` applies Memory directly and never
  loads Wrap-up or creates Workflow gates, RECORD receipts, or a Workflow Note.

## Procedure

### Phase 1 — Configure the Cowork Session

#### 1.1 Initialize or recover the route

- Enter from Gobbi with `mode: Cowork`, the normalized slug, session partner policy, and validated Gobbi root
  pair. Load [Delegation](../delegation/SKILL.md), [Discussion](../discussion/SKILL.md),
  [Git](../git/SKILL.md), and [Memory](../memory/SKILL.md), in that order.
- On recovery, recover the current topic from the topic records and the user's latest topic decision, then
  inspect its latest request and evidence, including unfinished work. Return to the idle wait when Configuration
  is complete and delivered work is absent, and resume the earliest unproved step only after delivered work
  exists.
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
  `{worktree}/.gobbi/projects/{project}/sessions/<session-leaf>/`, and place `configuration.md` and
  `README.md` directly below it.
- Render the [configuration template](templates/configuration.md) as the Configuration phase's accepted record,
  write it as an ignored session record as [Memory](../memory/SKILL.md) defines, and verify its identity,
  locations, settings, creation evidence, and ignored state before completing Configuration. A recovered session
  without this file may create it only when one exact identity, branch, registered worktree, session root, and
  accepted topic history agree; do not rewrite `configuration.md` again except to add a topic's first
  accepted-work pointer in Step 2.4.

#### 1.3 Establish topic and session locations

- Create each ignored directory only when its first result needs it, and name every temporary directory and
  file in its owning assignment. Drafts, subagent or teammate responses, Partner results, reviews, scratch
  work, and user-called review material start below the current topic's `tmp/`; accepted session records go
  in their topic phase or session wrap-up directory, while tracked results stay at their owner-defined paths.

| Content | Relative directory |
|---|---|
| Topic | `topic-NN-slug/` |
| Topic Ideation, one directory per Ideation result | `topic-NN-slug/1-ideation/NN-slug/` |
| Topic Planning | `topic-NN-slug/2-planning/` |
| Topic Execution records | `topic-NN-slug/3-execution/` |
| Topic temporary work | `topic-NN-slug/tmp/` |
| Session wrap-up | `wrap-up/` |

#### 1.4 Complete Configuration as an idle wait

- Complete Configuration without rewriting `configuration.md`, then wait for delivered work. Start no topic
  stage.

### Phase 2 — Deliver User Topics

#### 2.1 Settle the request and choose its stages

- Enter only when Configuration is complete and delivered work exists; a concrete outcome statement already
  in the session may be used after Configuration, not during it. If delivered work is absent, idle-wait;
  asking the user to state the work is allowed, and studying, ideating, planning, or
  executing is not.
- The first delivered work, including a review request, opens `topic-01-slug` before Discussion or temporary
  output. Apply [Discussion](../discussion/SKILL.md) to settle the request's outcome, purpose, scope, acceptance
  evidence, first action, exclusions, and required user decisions. A later request continues the current topic:
  add it and its decisions to the topic contract and keep the earlier entries. Open the next `topic-NN-slug` only
  as the topic Rule allows. The topic contract stays authoritative. Define topic/work design and decisions as
  choices whose viable answers can change the topic/work goal, requirements, scope or boundary, observable
  behavior, policy, strategy, algorithm, pattern or design direction, safety or privacy risk, authority, cost,
  dependency or reversibility, or acceptance.
- For each request, run Ideation when it has an open design choice, and Planning when the work is too large for
  one task; go straight to Execution when neither applies. Ideation and Planning are the same as in Workflow.
  If a request is too broad, risky, irreversible, or uncertain for Cowork, ask the user to narrow it or start
  Workflow through Gobbi, and never switch modes without the user's decision.

#### 2.2 Route the selected stages

- Run the selected stages in order, then PASS. After the request is settled, start the next selected stage and
  stop on competing evidence. Do not rewrite `configuration.md` at request, stage, commit, or review boundaries.
- Build every assignment through [Delegation](../delegation/SKILL.md) with the Cowork UUID, topic ID, stage, stable
  assignment ID, absolute worktree and session root, branch, allowed and protected paths, exact temporary and final
  paths, authoritative result, verification, commit authority, a skills index of skill, path, and description, a
  docs index of doc, path, and description, and, when the assignment is Review, one named `review-depth` token. Set
  Execution commit authority to none unless the assignment is the user-called `commit`.
- Route a needed Discussion follow-up to an addressable subagent or teammate whose role, evidence, and boundary
  still fit, and always issue a complete new Delegation brief. Apply [Partner](../partner/SKILL.md) to the
  recorded launch set minus the active runtime; launch none when the set is empty or disabled without rewriting
  the policy. Otherwise, the manager launches one background Partner run per launchable runtime with a Delegation
  brief, read-only unless the assignment needs writes, keeps each run's output under the topic's `tmp/`, and
  records Unavailable when launch fails.

#### 2.3 Accept the shaping results

- A skipped stage produces no result. Existing recovered sessions keep their accepted stages and result shapes
  without renaming or migration.
- For a request with an open design choice, apply the collaboration Rule and select
  [Coding Ideation](../coding/coding-ideation/SKILL.md) when the productive subject has an unresolved material
  code-design choice, [Authoring Ideation](../authoring/authoring-ideation/SKILL.md) when it has an unresolved
  material writing-design choice, or [Design Ideation](../design/design-ideation/SKILL.md) when it has an
  unresolved material visual-design choice. Give the selected operation that skill's complete caller contract
  plus the topic/work scope, applicable participant discussion records, an output root
  `{session-root}/topic-NN-slug/1-ideation/NN-slug/` for this Ideation result, reused when resuming it, and its
  `ideation-index.md` locator, and recovery boundary, then route a returned decision package to Step 2.1. When
  only Planning runs, select no ideation operation.
- Use caller-named paths in the topic's `tmp/` for drafts and supporting inputs, then have the creator write the
  curated result directly to its phase directory. Accept Ideation only when its caller completion test passes,
  the index and members are reread, paths and hashes are recorded, and the tracked tree is unchanged; any
  membership, order, path, or byte change makes it stale.
- When the work needs more than one task, apply the matching domain planning skill:
  [Coding Planning](../coding/coding-planning/SKILL.md) for code work,
  [Authoring Planning](../authoring/authoring-planning/SKILL.md) for writing work, or
  [Design Planning](../design/design-planning/SKILL.md) for visual work. Give the `leader` the goal, the accepted
  Ideation result or the topic contract, and output directory `{session-root}/topic-NN-slug/2-planning/`; plan
  and task numbers continue across the topic. Reread the returned plan documents and confirm Planning's checks
  before Execution; otherwise go to Execution.

#### 2.4 Execute and accept the request

- Assign each ready task to the `executor` through the matching domain execution skill:
  [Coding Execution](../coding/coding-execution/SKILL.md) when the writer frontier includes code,
  [Authoring Execution](../authoring/authoring-execution/SKILL.md) when it includes durable prose, or
  [Design Execution](../design/design-execution/SKILL.md) when it includes visual work. Without Planning, the
  manager assigns the topic's next `task-NN-slug`; otherwise keep the plan's task IDs and build each brief from
  the task's Goal, Context, Constraints, and Taste and Preference.
- Decide which ready tasks run in parallel and which in order from the Task Graph and the files they change.
  Tasks that run at the same time must not change the same files, and commits are made one at a time. Reread
  every promised result or commit and reproduce verification before dependent work. An in-stage review cannot
  replace required implementation or a user-called review;
  return failures, scope drift, or changed decisions to the earliest responsible stage.
- Complete PASS for the request only after every selected result is accepted and verified. On each PASS, append
  the request's outcome and evidence paths to the topic contract. On the topic's first PASS, add its topic ID and
  contract path to `configuration.md` `Accepted topics` once. PASS does not close the topic. Do not copy hashes
  or idle state, and do not replace earlier pointers. Do not require a focused implementation commit or a clean
  tracked tree; report outcome, scope, results, commits, checks, exclusions, concerns, partner evidence, and
  review coverage separately, then wait for the user's next request, which continues this topic by default.

### Phase 3 — Commit on User Call

#### 3.1 Commit accepted implementation changes

- Enter only for an explicit `commit`. Do not render the diff; the call is the
  confirmation.
- Assign the `executor` through [Delegation](../delegation/SKILL.md) to create focused commit(s) of accepted
  uncommitted tracked implementation changes. Use one focused commit in the normal case, and split independent
  changes when needed.
- Verify the resulting commits and that each tree contains only accepted tracked implementation changes.
  Then wait for the user's next request.

### Phase 4 — Review on User Call

#### 4.1 Freeze and review one subject

- Enter only for an explicit `review` and freeze the user-named subject, or the whole branch from the
  immutable base through the current head when no subset is named and no uncommitted tracked implementation
  changes exist; an indexed result includes its index and every listed member, and whole-branch review uses
  `review-depth` `by-owning-stage`. If uncommitted tracked implementation changes exist and the user did
  not name a subset, stop and ask for `commit` or a named subject.
- Name one locked `review-depth` token, define the decision criteria and contract-gate aggregation rule, assign
  one unique caller-named directory below the current topic's `tmp/` as the aggregation parent with children
  `<class>/<runtime>/report.md`, one class directory per artifact class the subject contains, so a single-class
  subject has one. Write each of those paths as an ignored session record as Memory defines. Keep class tokens
  `code`, `docs`, and `design`, and runtime tokens `claude-code`, `codex`, `cursor`, and `grok`; do not use
  `claude` or alias historical names such as `codex.md`. Use `ideation-design` for Ideation (goal, decisions,
  boundaries, constraints, work strategy, indexed integrity, required discussion, and user decisions, not
  implementation completeness or document polish), `planning-decomposition` for Planning (coverage without
  overlap, goal-based tasks, sourced constraints, tastes, and numbers, and an acyclic Task Graph, not
  implementation steps), `execution-implementation` for implementation, and `by-owning-stage` for mixed subjects.
- In the same `review` call, for each artifact class the subject contains, apply the matching domain review
  skill through one fresh `reviewer`, not the producer, and one read-only Partner run per remaining
  runtime over that class's slice of the same frozen subject and the named `review-depth`:
  [Coding Review](../coding/coding-review/SKILL.md) for software, including architecture designs (`code`),
  [Authoring Review](../authoring/authoring-review/SKILL.md) for writing (`docs`), or
  [Design Review](../design/design-review/SKILL.md) for visual work (`design`).
  Apply each review skill only to the artifact class it owns. Each remaining-runtime Partner run is
  read-only. The Delegation brief for each reviewer and each run names that class's slice, the review skill
  and its report template, and `review-depth`. The manager saves each run's final message as
  `<class>/<runtime>/report.md` below the aggregation parent; an Unavailable attempt produces Unavailable
  evidence, and the manager aggregates only contract-gate verdicts from complete reports after the assigned
  review skill has applied the token rather than writing a RECORD.

#### 4.2 Apply findings and coverage

- Apply Gobbi's [finding gate](../gobbi/SKILL.md#23-apply-the-session-wide-finding-gate). A correction returns
  to its owning writer and waits for `commit` when it changes tracked files; it does not auto-commit, and it
  makes prior coverage stale.
- Treat a `<class>/<runtime>/` directory without a complete `report.md` as incomplete
  evidence, never a report to disposition, and never PASS input. Assemble and disposition only complete
  reports, using contract-gate verdicts; do not treat quality opinion or out-of-contract Problems as the
  aggregation result. The aggregate passes only when every class passes; a class passes only when every
  complete `report.md` in its directory passes, and a class with no complete `report.md` does not pass.
- Complete Review only when every finding has a disposition and no correction remains unreviewed. Another
  corrected subject requires another explicit `review` call.

### Phase 5 — Close on User Call

#### 5.1 Reconcile durable Memory

- Enter only for an explicit `wrap up`. If uncommitted tracked implementation
  changes remain, stop and require `commit` first; otherwise organize the accepted closure input under
  `wrap-up/` from caller-named temporary sources and freeze topics, decisions, results, commits, checks,
  coverage, exclusions, risks, change points, project state, and existing Memory without loading Wrap-up.
- Assign one assistant through Delegation to apply [Memory](../memory/SKILL.md), including Closure,
  to the full session root and closure input: extract accepted knowledge into existing homes, write
  one `reports/note/` durable work account, and write `history/` only on durable change. Supply the exact absolute
  current-project Memory root, update only that boundary, verify it, and create one focused Memory commit or a
  verified no-change result.
- Stop on invalid paths, unresolved decisions, failed checks, wrong-worktree evidence, or unrelated work.
  Never merge, and never create Workflow phase receipts, RECORD evidence, or a Workflow Note.

#### 5.2 Check freshness and return the result

- After the accepted Memory pass, compare review coverage with the resulting head. When no contract-gate
  verdict covers the whole branch, use Discussion to ask whether to review or close with self-verification
  only; quality `does-not-meet` with contract-gate PASS is not REVISE and is not missing coverage, and a
  review choice runs Phase 4 then repeats this check without rerunning unchanged Memory work.
- Require current Execution and Git evidence, a clean Cowork worktree, and an unchanged main checkout. Stop at
  the exact retained recovery state when any claim is unproved.
- Return one compact conversation handoff with outcome, scope, topics, results, commits, Memory result, durable
  `reports/note/` path or `None`, checks, coverage and dispositions, exclusions, risks, UUID, base, branch,
  worktree, head, status, and first recovery command. Retain local objects; publication, merge, and cleanup
  require another explicit request.

## References

| Name | Description |
|---|---|
| [Gobbi](../gobbi/SKILL.md#23-apply-the-session-wide-finding-gate) | Owns mode entry, the finding predicate, user boundary, and fresh-review rule. |
| [Configuration template](templates/configuration.md) | Defines the ignored Cowork configuration and recovery record. |
| [Git](../git/SKILL.md) | Supplies branch, commit, pull-request, and tag conventions and the shared Git safety rules. |
| [Discussion](../discussion/SKILL.md) | Owns the SOP for understanding the task, studying options with participants, and deciding with the user. |
| [Delegation](../delegation/SKILL.md) | Defines the brief template and the final Handoff for work handed to another agent. |
| [Coding Planning](../coding/coding-planning/SKILL.md) | Owns code-work planning and its plan documents. |
| [Authoring Planning](../authoring/authoring-planning/SKILL.md) | Owns writing-work planning and its plan documents. |
| [Design Planning](../design/design-planning/SKILL.md) | Owns visual-work planning and its plan documents. |
| [Coding Review](../coding/coding-review/SKILL.md) | Owns independent code assessment and each complete `report.md`. |
| [Authoring Review](../authoring/authoring-review/SKILL.md) | Owns independent writing assessment and each complete `report.md`. |
| [Design Review](../design/design-review/SKILL.md) | Owns independent visual assessment and each complete `report.md`. |
| [Coding Ideation](../coding/coding-ideation/SKILL.md) | Owns code design and its indexed result. |
| [Authoring Ideation](../authoring/authoring-ideation/SKILL.md) | Owns writing design and its indexed result. |
| [Design Ideation](../design/design-ideation/SKILL.md) | Owns visual design and its indexed result. |
| [Coding Execution](../coding/coding-execution/SKILL.md) | Owns code-task implementation, verification, and the commit-or-retain handoff. |
| [Authoring Execution](../authoring/authoring-execution/SKILL.md) | Owns writing-task implementation, verification, and the commit-or-retain handoff. |
| [Design Execution](../design/design-execution/SKILL.md) | Owns visual-task implementation, verification, and the commit-or-retain handoff. |
| [Memory](../memory/SKILL.md) | Decides when a file is project memory or a session record, and how to write it. |
| [Partner](../partner/SKILL.md) | Defines how the manager launches a partner CLI in the background, reads its output, and follows up. |
