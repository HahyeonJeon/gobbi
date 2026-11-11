---
name: cowork
description: "Cowork is a user-led Gobbi work mode in one worktree, where related requests stay in one topic. Use it after the user selects Cowork in Gobbi."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, Task, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
---

# Cowork

Cowork takes the user's requests through Ideation, Planning, and Execution in one isolated worktree. Related
requests stay in one topic, and review, commit, and closure happen only when the user calls for them. Use it
after Gobbi selects Cowork.

## Principles

### Keep the user in control

The user owns every scope, design, risk, destructive-action, and external-service decision, and calls review,
commit, and closure. The manager makes each request concrete, delivers verified results, and waits for the next
request.

### Keep related work in one topic

A topic is the line of work the user is pursuing, not one request or one task. Most new requests continue it,
so related work, its decisions, and its records stay together. Changing the topic is the user's call.

### Separate stage quality from review

Every stage verifies its own result before acceptance. Independent review is a separate user-called judgment
and never replaces stage quality.

## Rules

- **MUST work only in the session's registered worktree and session root.** The main checkout holds work this
  session does not own, so create the worktree before the first tracked edit, never create a replacement, and
  change the main checkout only for a user-approved commit of Gobbi's required layout.
- **MUST keep related work in the current topic, and open a new one only on the user's call.** The topic keeps
  related decisions and records together; when work looks truly unrelated, ask with the reason and stay in the
  current topic until the user answers.
- **MUST start work only on delivered work, and review, commit implementation, or close only on the user's
  explicit `review`, `commit`, or `wrap up`.** These calls are the user's control in Cowork; delivered work
  states an outcome or request, and mode, slug, partner policy, "continue", "ok", "looks good", or repository
  state does not.
- **Apply [Discussion](../discussion/SKILL.md) through the recorded participant policy before recommending a
  consequential option or asking the user for a decision.** Principle 3 of [Principles](../principles/SKILL.md)
  has the user choose among options that participants studied and critiqued.
- **Rule a minor choice yourself, and take a material one to the user.** A minor choice changes no scope,
  design, risk, or destructive or external action, so asking costs the user a turn without giving control;
  record it in the topic contract as `Ruling: <what> — <why> — <cost if wrong>`, and check, rather than ask, a
  question that running something can answer.
- **Accept a result only after rereading it or its commit and reproducing its verification.** A report or
  summary is a claim, not evidence.

## Procedure

### Phase 1 — Configure the Session

Give the session one recorded home. Done when the session records match the registered worktree and session
root, and a fresh session waits for delivered work or a recovered one has resumed its current topic.

#### 1.1 Create or recover the session

- Load [Delegation](../delegation/SKILL.md), [Discussion](../discussion/SKILL.md), [Git](../git/SKILL.md), and
  [Memory](../memory/SKILL.md). For a fresh session, record the start checkout's current branch as
  `Base branch` without asking which branch is the base, and stop if it is empty or the checkout is dirty.
- Generate one lowercase UUID, create the work branch and worktree with Git, and name the worktree and session
  leaves `<YYYY-MM-DD>-<slug>-<uuid>`. In the session root,
  `{worktree}/.gobbi/projects/{project}/sessions/<session-leaf>/`, write `configuration.md` from the
  [configuration template](templates/configuration.md) and `README.md` as ignored session records, changing
  `configuration.md` later only to add a topic to `Accepted topics`, then wait for delivered work.
- On recovery, require the recorded identity, branch, worktree, and session root to match, and stop if they do
  not. Resume the current topic from its contract, its latest request, and any unfinished work.

#### 1.2 Session layout

| Content | Path below the session root |
|---|---|
| Topic contract | `topic-NN-slug/topic.md` |
| Ideation, one directory per result | `topic-NN-slug/1-ideation/NN-slug/` |
| Planning | `topic-NN-slug/2-planning/` |
| Execution records | `topic-NN-slug/3-execution/` |
| Temporary work | `topic-NN-slug/tmp/` |
| Closure input | `wrap-up/` |

- Drafts, participant and Partner output, and review reports go in the current topic's `tmp/`; accepted
  records go in their stage directory.

### Phase 2 — Deliver Requests

Deliver each request as verified results in its topic. Done when the request's outcome and evidence paths are
in the topic contract and its report has gone to the user.

#### 2.1 Settle the request

- The first delivered work, including a `review`, opens `topic-01-slug`; a later request is added, with its
  decisions, to the current topic contract, and a new topic opens only as the topic Rule allows. Apply
  Discussion to settle the request's outcome, scope, acceptance, exclusions, and required user decisions.
- Run Ideation when the request has an open design choice and Planning when the work needs more than one task;
  otherwise go straight to Execution. If the request is too large, risky, or irreversible for Cowork, ask the
  user to narrow it or start Workflow through Gobbi.
- Build every assignment through [Delegation](../delegation/SKILL.md), naming the topic, worktree and session
  root, the paths it may change and the ones it must not, exact output and `tmp/` paths, and commit authority.
  Execution commit authority stays none until the user calls `commit`.

#### 2.2 Ideation

- The `leader` applies the matching Ideation skill: [Coding Ideation](../coding/coding-ideation/SKILL.md),
  [Authoring Ideation](../authoring/authoring-ideation/SKILL.md), or
  [Design Ideation](../design/design-ideation/SKILL.md).
- Give it the request, the participant discussion, and the output root `topic-NN-slug/1-ideation/NN-slug/`,
  reused when resuming that result. Take any returned decision to the user through Discussion.

#### 2.3 Planning

- The `leader` applies the matching Planning skill: [Coding Planning](../coding/coding-planning/SKILL.md),
  [Authoring Planning](../authoring/authoring-planning/SKILL.md), or
  [Design Planning](../design/design-planning/SKILL.md).
- Give it the goal, the accepted Ideation result or the topic contract, and `topic-NN-slug/2-planning/`; plan
  and task numbers continue across the topic.
- Accept it after rereading the plan documents and confirming Planning's checks.

#### 2.4 Execution

- The role for the task's subject applies its Execution skill: the `developer` with
  [Coding Execution](../coding/coding-execution/SKILL.md), the `author` with
  [Authoring Execution](../authoring/authoring-execution/SKILL.md), or the `designer` with
  [Design Execution](../design/design-execution/SKILL.md). Without Planning, assign the topic's next
  `task-NN-slug`; with Planning, build each brief from the task's Goal, Context, Constraints, and Taste and
  Preference.
- Run ready tasks in parallel when the Task Graph allows it and they change different files.
- Reread each result and reproduce its verification before work that needs it. Return a failure, scope drift, or
  changed decision to the stage that owns it.

#### 2.5 Accept the request

- When every selected result is accepted and verified, append the request's outcome and evidence paths to the
  topic contract. On the topic's first PASS, add the topic and its contract path to `Accepted topics`.
- Report the outcome, results, checks, exclusions, concerns, and partner evidence, then wait for the next
  request.

### Phase 3 — Commit on User Call

Commit the accepted work the user called for. Done when no accepted tracked change is left uncommitted and
each commit holds only accepted changes.

#### 3.1 Commit the accepted changes

- On `commit`, the `developer`, `designer`, or `author` that matches the work commits the accepted uncommitted
  tracked changes: one focused commit in the normal case, split into independent changes when needed. The call
  is the confirmation; do not show the diff first.
- Verify that each commit holds only accepted changes.

### Phase 4 — Review on User Call

Judge the named subject independently. Done when the verdict and its dropped and follow-up items are in the
topic contract and reported to the user.

#### 4.1 Run the review

- On `review`, freeze the subject the user names, or the whole branch from the base when none is named. If
  uncommitted tracked changes exist and no subject is named, ask for `commit` or a subject.
- Apply [Review](../review/SKILL.md) with the topic contract's acceptance for the subject as its Goal and the
  bar of each stage the subject covers. Save one report per reviewer at `tmp/review-NN/<reviewer>.md` in the
  topic.

#### 4.2 Record the verdict

- Record the verdict and its dropped and follow-up items in the topic contract, and report them to the user.
- A correction that Gobbi's [finding gate](../gobbi/SKILL.md#23-apply-the-session-wide-finding-gate) allows goes
  back to its writer, waits for `commit`, and needs another `review` of the fixes.

### Phase 5 — Close on User Call

Record the session in Memory and hand it back. Done when Memory is committed or reported unchanged and the
closure handoff is returned.

#### 5.1 Prepare the closure

- On `wrap up`, stop and ask for `commit` first when uncommitted tracked changes remain. When no review covers
  the current head, ask whether to review first or close with self-verification only.
- Gather the accepted topics, decisions, results, commits, checks, review coverage, and risks under `wrap-up/`.

#### 5.2 Write Memory and return the handoff

- Assign one assistant to apply [Memory](../memory/SKILL.md), including Closure, to the session root: update
  existing Memory, write one `reports/note/` work account, write `history/` only on durable change, and make one
  Memory commit or report no change. The user's `wrap up` grants that commit authority for Memory paths only.
- Do not load Wrap-up and do not merge; publication, merge, and cleanup need another request.
- Return one handoff with the outcome, topics, commits, Memory result, note path, checks, review coverage,
  risks, UUID, branch, worktree, head, and first recovery command.

## References

| Name | Description |
|---|---|
| [Configuration template](templates/configuration.md) | Defines the ignored Cowork configuration and recovery record. |
| [Gobbi](../gobbi/SKILL.md#23-apply-the-session-wide-finding-gate) | Owns mode entry and the session-wide finding gate. |
| [Principles](../principles/SKILL.md) | Defines the behavioral disciplines; Principle 3 has the user choose among studied options. |
| [Discussion](../discussion/SKILL.md) | Owns understanding the task, studying options with participants, and deciding with the user. |
| [Delegation](../delegation/SKILL.md) | Defines the brief for work handed to another agent. |
| [Partner](../partner/SKILL.md) | Defines how the manager launches a partner CLI and reads its output. |
| [Git](../git/SKILL.md) | Supplies branch and commit conventions and the shared Git safety rules. |
| [Memory](../memory/SKILL.md) | Decides when a file is project memory or a session record, and how to write it. |
| [Coding Ideation](../coding/coding-ideation/SKILL.md), [Authoring Ideation](../authoring/authoring-ideation/SKILL.md), [Design Ideation](../design/design-ideation/SKILL.md) | Own code, writing, and visual design. |
| [Coding Planning](../coding/coding-planning/SKILL.md), [Authoring Planning](../authoring/authoring-planning/SKILL.md), [Design Planning](../design/design-planning/SKILL.md) | Own code, writing, and visual planning. |
| [Coding Execution](../coding/coding-execution/SKILL.md), [Authoring Execution](../authoring/authoring-execution/SKILL.md), [Design Execution](../design/design-execution/SKILL.md) | Own code, writing, and visual implementation and verification. |
| [Review](../review/SKILL.md) | Owns independent review: the reviewers, the report, the verdict, and fix rounds. |
