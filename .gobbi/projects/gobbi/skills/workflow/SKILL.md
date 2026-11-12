---
name: workflow
description: "Workflow is a durable Gobbi work mode that runs one session through checkpointed phases. Use it after the user selects Workflow in Gobbi."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
---

# Workflow

Workflow runs one isolated session through three phases: Configuration and Ideation, Planning and Execution,
then Wrap-up. Use it when work needs a user-approved design, phase handoffs that survive a lost context, and a
User Review wait after each phase.

## Principles

### Design with the user, then deliver on your own

The user settles the design in Phase 1; later the manager and its participants decide inside it.

### Apply one frame to every unit

Every productive unit runs `DISCUSSION → WORK → RECORD`. Execution tasks and Wrap-up add `REVIEW` before
RECORD, so independent judgment stays separate from the work.

### Make every phase recoverable

Each phase ends with one verified `handoff.md`, whether it completed or stopped safely. A lost context resumes
from that file in the same worktree and session root.

## Rules

- **MUST work only in the session's registered worktree and session root, and never create a replacement for
  the same session.** Recovery and every handoff depend on that one recorded location.
- **MUST start work only after the user delivers it.** The user decides what work happens: delivered work
  states an outcome or request, and mode, slug, partner policy, "continue", "ok", "looks good", or repository
  state does not.
- **Apply [Discussion](../discussion/SKILL.md) through the recorded participant policy before presenting
  options or asking for a Phase 1 decision.** Principle 3 of [Principles](../principles/SKILL.md) has the user
  choose among options that participants studied and critiqued.
- **After `P1 · User Review`, rule each choice inside the accepted design yourself and ask the user nothing but
  Continue or Stop.** The user settled the design in Phase 1, so record each ruling in the unit's receipt as
  `Ruling: <what> — <why> — <cost if wrong>`, check rather than ask a question that running something can
  answer, and stop at a Stopped `handoff.md` only for an unauthorized irreversible, security-sensitive, or
  external action or a user-owned decision.
- **MUST wait at User Review after each phase's `handoff.md`, recorded as `configuration.md` `Latest handoff`.**
  Only the user's Continue on a shown Complete handoff starts the next phase, never silence; a Stopped handoff
  records the first unproved action and opens no User Review.
- **Accept a result only after rereading it or its commit and reproducing its verification.** A report,
  handoff, review report, receipt, or summary is a claim, not evidence.

## Procedure

### Phase 1 — Configure and Ideate

Settle the design with the user in a recoverable session. Done when a verified `1-ideation/handoff.md` is the
`Latest handoff` and, when it is Complete, waits at `P1 · User Review`.

#### 1.1 Create or recover the session

- Load [Discussion](../discussion/SKILL.md), [Delegation](../delegation/SKILL.md), [Git](../git/SKILL.md), and
  [Memory](../memory/SKILL.md). For a fresh session, record the start checkout's current branch as
  `Base branch` without asking which branch is the base, and stop if it is empty or the checkout is dirty.
- Resolve the participants, publication intent, merge and cleanup authority, protected work, and the
  current-project Memory root, then generate one lowercase UUID, create the work branch and worktree with Git,
  and name the worktree and session leaves `<YYYY-MM-DD>-<slug>-<uuid>`. In the session root,
  `{worktree}/.gobbi/projects/{project}/sessions/<session-leaf>/`, write `configuration.md` from the
  [configuration template](templates/configuration.md) and `README.md` as ignored session records, changing
  `configuration.md` later only to set `Latest handoff`, then wait for delivered work.
- On recovery, require the recorded identity, branch, worktree, session root, and latest handoff to match, and
  stop if they do not. Wait at User Review for a Complete handoff, and resume a Stopped one at its first
  unproved action.

#### 1.2 Session layout

| Content | Path below the session root |
|---|---|
| Ideation | `1-ideation/` |
| Planning | `2-planning/` |
| Execution, per task | `3-execution/task-NN-slug/` |
| Wrap-up | `wrap-up/` |
| Temporary work | `tmp/` |

- Each unit writes its receipt at `<unit-dir>/record/iteration-N.md`. Phase handoffs are
  `1-ideation/handoff.md`, `3-execution/handoff.md`, and `wrap-up/handoff.md`, from the
  [handoff template](templates/handoff.md).
- A REVIEW writes one report per reviewer at `<unit-dir>/review/iteration-N/<reviewer>.md`, such as
  `reviewer.md` or `codex.md`; the unit's receipt records the verdict.

#### 1.3 Review

- Apply [Review](../review/SKILL.md) to the unit's frozen subject, with the task Goal or the closure plan as its
  Goal. Record the verdict and its dropped and follow-up items in the unit's receipt.
- A finding does not reopen the accepted design, and a correction needs a re-review of the fixes.

#### 1.4 Ideation

- **DISCUSSION:** Apply Discussion to settle the design with the user and participants, and record every user
  decision.
- **WORK:** The `leader` applies the matching Ideation skill:
  [Coding Ideation](../coding/coding-ideation/SKILL.md),
  [Authoring Ideation](../authoring/authoring-ideation/SKILL.md), or
  [Design Ideation](../design/design-ideation/SKILL.md). Give it the scope, the participant discussion, and the
  output root `1-ideation/outputs/ideation/`, and take any returned decision back to DISCUSSION.
- **RECORD:** Reread the index and its members, record their paths and hashes, and write the receipt, returning
  to DISCUSSION for a missing decision and to WORK for an incomplete result. Then end Phase 1 at
  `1-ideation/handoff.md` and wait at `P1 · User Review`.

### Phase 2 — Plan and Execute

Deliver the accepted design as reviewed task commits. Done when a verified `3-execution/handoff.md` is the
`Latest handoff`, Complete only after every task has passed review.

#### 2.1 Planning

- **DISCUSSION:** Give the `leader` the accepted goal, the Ideation result, and participant input. The leader
  chooses the major goals and the task split.
- **WORK:** The `leader` applies the matching Planning skill:
  [Coding Planning](../coding/coding-planning/SKILL.md),
  [Authoring Planning](../authoring/authoring-planning/SKILL.md), or
  [Design Planning](../design/design-planning/SKILL.md), with output directory `2-planning/`.
- **RECORD:** Reread every plan document, record their paths and hashes, and write the receipt. Return to WORK
  when tasks miss or overlap part of the work, a Goal cannot be judged, an item lacks a source, or the Task Graph
  has a cycle.

#### 2.2 Task discussion and work

- **DISCUSSION:** Pick the next ready task, or several to run in parallel when the Task Graph allows it and they
  change different files. Consult participants when the approach needs it, and build each Execution brief
  through [Delegation](../delegation/SKILL.md) from the task's Goal, Context, Constraints, and Taste and
  Preference, adding the paths it may change, the protected work, and commit authority for the task's paths.
- **WORK:** The role for the task's subject applies its Execution skill: the `developer` with
  [Coding Execution](../coding/coding-execution/SKILL.md), the `author` with
  [Authoring Execution](../authoring/authoring-execution/SKILL.md), or the `designer` with
  [Design Execution](../design/design-execution/SKILL.md). Each task ends with one focused local commit, and
  commits are made one at a time.

#### 2.3 Task review and record

- **REVIEW:** Apply Review with the Execution stage bar and the task's domain bar.
- **RECORD:** Write the receipt with the verdict; REVISE returns to WORK as the next iteration, and FAIL stops
  the phase. After PASS, reread the commit and checks before starting a task that needs it, and amend only
  pending plan work when a plan defect inside the accepted design appears.
- When every task has passed, end Phase 2 at `3-execution/handoff.md` and wait at `P2 · User Review`.

### Phase 3 — Wrap Up

Carry the accepted work into Memory and the base branch. Done when a verified `wrap-up/handoff.md` is the
`Latest handoff` and, after Continue, the Note is returned from the verified Git state.

#### 3.1 Closure discussion and work

- **DISCUSSION:** Load [Wrap-up](../wrap-up/SKILL.md), list the accepted results, commits, checks, decisions,
  risks, and open items, and have participants check the closure and merge plan. Stop when authority or safety
  does not support one route.
- **WORK:** Apply Wrap-up Phase 2: brief one assistant to apply [Memory](../memory/SKILL.md) with the session
  root, the current-project Memory root, and the protected work. The assistant self-reviews its Memory changes,
  and the manager checks the full worktree diff.

#### 3.2 Closure review, merge, and handoff

- **REVIEW:** Apply Review with the Execution stage bar to the closure tree, with the Memory diff, the durable
  note, commits, checks, and merge plan. REVISE returns to DISCUSSION.
- **RECORD:** After PASS, write the receipt with the verdict, then apply Wrap-up's Git procedure and
  [Git](../git/SKILL.md) to commit the closure changes and merge the accepted head into `Base branch`, rerunning
  the accepted checks on a temporary merge first when the base moved.
- End Phase 3 at `wrap-up/handoff.md` and wait at `P3 · User Review`. After Continue, return Wrap-up's
  [Note](../wrap-up/templates/note.md) from the verified Git state; publication and cleanup need another request.

## References

| Name | Description |
|---|---|
| [Configuration template](templates/configuration.md) | Defines the ignored Workflow configuration and session identity. |
| [Handoff template](templates/handoff.md) | Defines each phase handoff and recovery checkpoint. |
| [Gobbi](../gobbi/SKILL.md#23-apply-the-session-wide-finding-gate) | Owns mode entry and the session-wide finding gate. |
| [Principles](../principles/SKILL.md) | Defines the behavioral disciplines; Principle 3 has the user choose among studied options. |
| [Discussion](../discussion/SKILL.md) | Owns understanding the task, studying options with participants, deciding with the user, and the Continue or Stop ask. |
| [Delegation](../delegation/SKILL.md) | Defines the brief for work handed to another agent. |
| [Partner](../partner/SKILL.md) | Defines how the manager launches a partner CLI and reads its output. |
| [Wrap-up](../wrap-up/SKILL.md) | Owns Memory extraction, the durable note, commit, merge, and the Git and recovery Note. |
| [Git](../git/SKILL.md) | Supplies branch, commit, and merge conventions and the shared Git safety rules. |
| [Memory](../memory/SKILL.md) | Decides when a file is project memory or a session record, and how to write it. |
| [Coding Ideation](../coding/coding-ideation/SKILL.md), [Authoring Ideation](../authoring/authoring-ideation/SKILL.md), [Design Ideation](../design/design-ideation/SKILL.md) | Own code, writing, and visual design. |
| [Coding Planning](../coding/coding-planning/SKILL.md), [Authoring Planning](../authoring/authoring-planning/SKILL.md), [Design Planning](../design/design-planning/SKILL.md) | Own code, writing, and visual planning. |
| [Coding Execution](../coding/coding-execution/SKILL.md), [Authoring Execution](../authoring/authoring-execution/SKILL.md), [Design Execution](../design/design-execution/SKILL.md) | Own code, writing, and visual implementation and verification. |
| [Review](../review/SKILL.md) | Owns independent review: the reviewers, the report, the verdict, and fix rounds. |
