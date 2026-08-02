---
name: cowork
description: "Cowork is a user-led Gobbi orchestration mode for fast stepwise implementation in one isolated worktree, with optional Ideation and Planning and user-called evaluation."
allowed-tools: Read, Grep, Glob, Bash, Agent, Task, AskUserQuestion
skill-type: operation
---

# Cowork

Cowork is a user-led Gobbi orchestration mode for fast implementation after the user selects it at Gobbi
entry.

It takes one topic at a time through the smallest safe combination of optional Ideation, optional Planning,
and verified Execution, then returns control to the user.

## Principles

### Keep the user in control at topic boundaries

The user supplies each topic and owns every material scope, design, risk, destructive-action, and external
service decision. The manager makes the topic concrete, returns accepted evidence, and waits for direction.

### Keep one inspectable local history

One linked worktree and one ordered writer chain keep every result attributable and recoverable. Each selected
shaping artifact set and implementation unit becomes a focused verified commit before dependent work starts.

### Separate stage quality from independent evaluation

Every selected stage self-reviews or self-verifies before acceptance. Independent partner evaluation is a
separate user-called judgment, never a substitute for stage quality.

## Rules

- **MUST establish one verified isolated Cowork worktree before the first tracked edit, except for the one
  user-approved commit that bootstraps the required layout and its ignore file before the base is captured.**
  Use the fully expanded worktree path for every write after that commit and change nothing else in the main
  checkout.
- **MUST let the manager select and report Direct, Light, or Structured delivery while the user owns every
  material decision.** Changed evidence or a material user decision reruns topic routing.
- **MUST apply the canonical Ideation and Planning skills whenever their optional stages are selected.** Their
  canonical artifact sets are allowed Cowork outputs at exact user-approved project paths.
- **MUST keep one ordered writer chain with role-bound focused commits and manager acceptance.** Leaders own
  selected Ideation and Planning artifacts, executors own implementation units, and assistants own Wrap-up
  memory updates.
- **MUST run independent evaluation only after an explicit `evaluate` call, and let that call authorize
  evaluation alone.** One call authorizes one fresh partner evaluation round, a bare call uses the whole clean
  Cowork branch through its current head, and no other partner round runs on that trigger.
- **MUST run Cowork Wrap-up only after an explicit `wrap up` call.** Apply the canonical Memory operation
  before the final evaluation-freshness decision; never create Workflow TODOs, phase receipts, RECORD-stage
  evidence, or a Workflow Hand-off.

## Procedure

### Phase 1 — Establish the Isolated Cowork Session

#### 1.1 Supply the Git contract and create or recover the worktree

- Enter only after Gobbi records the user's Cowork selection. Cowork owns its Git session contract and states
  it as five properties for the [Git operation](../git/SKILL.md):

| Contract property | Where Cowork gets it |
|---|---|
| Proved identity | The Gobbi UUID locked in this conversation, checked against the session-branch name and the provenance trailer of every Cowork commit. |
| Immutable base commit | The clean head the manager inspects and the user confirms before the worktree exists, which is the bootstrap commit when the preflight below creates one. It never moves afterward. |
| Isolated worktree outside the main checkout | For a fresh session, the intended path derived from the session branch, resolving outside the main checkout with nothing registered there or to that branch. For a recovery, the path the user names, already registered to that exact branch. |
| Declared publication intent | Local retention. Push, pull request, merge, and cleanup happen only through a separate explicit Git operation with current user authority. |
| Required layout | The canonical `.gobbi/` paths, their tracked-or-ignored states, and the ignore-rule content that achieves them, defined by [Gobbi](../gobbi/SKILL.md) Step 1.1 and resolved for this repository's `<project>`. |

- Bootstrap the required layout before the base is captured. Resolve and validate `<project>` through the
  [Gobbi](../gobbi/SKILL.md) Step 1.1 resolver, require a clean current checkout, and let the Git operation
  verify the posture and stop on the conditions it names.
- When the posture is already correct, create nothing, commit nothing, and leave the main checkout unchanged.
  Otherwise create the required directories, write `.gobbi/.gitignore`, and obtain the user's explicit
  approval for exactly one bootstrap commit of those paths on the current branch. That commit's clean head is
  the immutable base commit; stop without that approval.
- The bootstrap is the only tracked write outside the session worktree. It covers only the required layout and
  its ignore file, happens at most once per repository, and never writes a repository's root `.gitignore`.
- Supply that contract in its matching lifecycle state, then create one isolated branch and worktree before
  any other tracked edit, or recover only the branch and worktree the user explicitly names. For a fresh
  session, the Git operation proves the intended path is free, creates it, and returns the registered worktree
  that completes the contract.
- Verify and report the UUID, repository, base branch and commit, session branch, absolute worktree, head,
  clean status, the validated `{gobbi-skills-root}` and `{gobbi-agents-root}` pair the
  [Gobbi](../gobbi/SKILL.md) Step 1.1 entry returned, the main checkout unchanged apart from an approved
  bootstrap commit, and recovery point. Record that pair with these session facts and carry it into every
  brief. Stop with exact evidence when identity, isolation, provenance, base, writer ownership, resolved
  roots, or recovery cannot be proved.

#### 1.2 Establish the Cowork session locations

- Root the session at `{worktree}/.gobbi/projects/{project}/sessions/{date}-{uuid}/` and report that path with
  the Step 1.1 evidence.
- Use `{session-root}/memory/` as the session memory tree. The [Record operation](../record/SKILL.md) names
  that tree's shape and Cowork roots it here; Step 4.1 memorizes it. Create each directory when its first
  record needs it.
- Use `{session-root}/work/` as the session-only sibling beside it. Selected shaping artifacts, plans,
  scenarios, and checklists land there unless the user approves another path.
- Never write a session-only kind inside `memory/`, and never write either location outside the verified
  worktree.

### Phase 2 — Run the User-Topic Loop

#### 2.1 Route and deliver one topic

- Inspect the user topic and relevant project evidence. Use [Discussion](../discussion/SKILL.md) to lock the
  outcome, purpose, scope, acceptance proof, material decisions, selected artifact paths, first action, and
  exclusions before dispatch.

| Depth | Evidence | Topic path |
|---|---|---|
| **Direct** | Outcome, root cause when applicable, acceptance proof, and one low-risk reversible unit are clear. | Execute the locked topic without Ideation or Planning. |
| **Light** | One bounded design choice or modest decomposition remains. | Run only the optional shaping stage the evidence requires, then execute. |
| **Structured** | Work is broad, cross-cutting, architectural, high-risk, hard to reverse, or materially uncertain. | Normally run Ideation, Planning, then ordered Execution. |

- Require Ideation for material design work and Planning for multiple dependent implementation units. Report
  the selected depth and reason; return to this decision when new evidence, changed stage selection, or a
  material user decision changes the contract.
- Build each specialist assignment through [Delegation](../delegation/SKILL.md). Add the Cowork UUID, topic,
  depth, selected stage, stable assignment, absolute worktree, branch, prerequisite commits, allowed and
  protected paths, expected artifact or implementation, verification, commit authority, and escape paths.
- Name the Step 1.1 `{gobbi-skills-root}` and `{gobbi-agents-root}` pair in every brief, and resolve each
  skill and role the specialist must load as an exact path from that pair. A bare skill or role name is not a
  resource a fresh specialist can reach.
- In Claude Code, load [Agent Teams](../gobbi/agent-teams/SKILL.md) before using persistent specialists. Its
  manual owns tool setup and use; Cowork owns assignment fields, reuse boundaries, acceptance, recovery
  evidence, and the ordered writer chain.
- Reuse a leader only within one topic's shaping stages, an executor only across related implementation units
  in one topic chain, and an assistant only within the Phase 4 memory chain.

- Reuse a write-capable specialist only after the manager accepts its focused commit and the Cowork worktree
  is clean. A read-only specialist creates no commit, so its gate is the accepted read-only result and a
  worktree it left unchanged. Retain the team across topics, and give every reuse a fresh assignment
  identifier and a re-anchored scope, worktree, branch, and path list.
- Rebuild a specialist assignment after a context boundary only from that Cowork evidence. Cowork has no
  Workflow Hand-off, TODO route, `gate.md`, or RECORD receipt, so its recovery never looks for one.
- For selected Ideation, assign a leader to apply [Ideation](../ideation/SKILL.md), self-review its canonical
  artifact set, and create one focused shaping commit. Ideation always evaluates its own result inline;
  Cowork neither suppresses that round nor counts it as Phase 3 coverage. For selected Planning, assign a
  leader to apply [Planning](../planning/SKILL.md) to the accepted design or locked topic contract,
  self-review its canonical artifact set, and create one focused planning commit.
- When a topic routes to Structured depth and selects Ideation, offer the user one partner creation round for
  that stage through [Discussion](../discussion/SKILL.md). The offer is never automatic, no `evaluate` call
  authorizes it, and the round runs only when the user calls for it. On that call, use
  [Partner](../gobbi/partner/SKILL.md) for one independent draft round and its cross-review round over the
  frozen topic contract, place the returned labeled content under `{session-root}/work/`, and let the assigned
  leader synthesize it into the Ideation artifact set it already owns. A creation round is creation, not
  judgment: it adds no evaluation coverage and is reported separately from coverage.
- Assign each dependency-ready unit to an executor through [Execution](../execution/SKILL.md). Keep writers
  sequential; after every report, reread the promised artifact or implementation and commit, reproduce the
  relevant verification, and accept, repair, or redispatch it before dependent work begins.
- On missing artifacts, malformed output, failed checks, unavailable capability, wrong-tree evidence,
  conflicting user work, unsafe recovery, or scope drift, stop with the exact failure and return to the
  earliest responsible stage. Complete the topic only when every selected result is accepted in a focused
  verified commit and the worktree is clean; report outcome, scope, artifacts, commits, verification,
  exclusions, concerns, any partner creation round, and current evaluation coverage before waiting for the
  next topic or user call. Report the creation round and the coverage as separate facts, because a creation
  round never becomes coverage.

### Phase 3 — Evaluate on User Call

#### 3.1 Evaluate one frozen subject

- Cowork owns this evaluation policy. A selected stage evaluates or self-reviews inside its own operation:
  Ideation always runs its inline independent evaluation, and Planning and Execution self-review or
  self-verify. Cowork runs no automatic partner creation round and no automatic Phase 3 round, and the
  Step 2.1 creation round the user calls is creation rather than coverage. Independent Cowork evaluation
  happens only on an explicit `evaluate` call, and neither an inline stage evaluation nor a creation round
  satisfies it.
- Enter only for an explicit `evaluate`. A bare call requires a clean worktree and freezes the whole Cowork
  subject from the locked base commit through the current head, including all commits, tree changes, topic
  contracts, accepted artifacts, user decisions, verification, status, and exclusions. A user-named narrower
  subject is allowed but is not whole-branch coverage.
- Load [Partner](../gobbi/partner/SKILL.md) and call it for one evaluation round over that frozen subject:
  two fresh isolated reports, one from the active runtime and one from the partner system, neither holding
  the other. Each report is a complete [Evaluation](../evaluation/SKILL.md) output. A paused round stops this
  evaluation unless the user waives that named system for this round.
- Aggregate with the more severe verdict and present every material finding for user disposition before
  changing work. Accepted corrections return to the owning leader or executor in Phase 2 or the memory
  assistant in Phase 4, create new focused commits, make prior whole-branch coverage stale, and require another
  explicit `evaluate` call.

### Phase 4 — Wrap Up on User Call

#### 4.1 Update memory and return the retained result

- Enter only for an explicit `wrap up`. Freeze the accepted topics, scope, decisions, artifacts, commits,
  verification, evaluation coverage, exclusions, risks, current project state, and existing memory as the
  closure input.
- Assign an assistant through [Delegation](../delegation/SKILL.md) with the Cowork fields from Step 2.1 to
  apply [Memory](../memory/SKILL.md). It must read the Step 1.2 session memory tree together with the frozen
  closure input, review durable future value, load every applicable Memory category skill, update and verify
  only the current project's memory root, and create one focused memory commit through the ordered Cowork
  writer chain.
  Accept an explicit verified no-change result when no durable update is needed.
- Do not create Workflow TODOs, phase receipts, RECORD-stage evidence, or a Workflow Hand-off. Stop for missing
  category guidance, unresolved user decisions, invalid memory paths, failed validation, wrong-tree evidence,
  or unrelated user work, then repair through the same memory assignment.
- After the accepted Memory pass, check evaluation coverage against the resulting head. When no independent
  verdict covers that whole branch, use [Discussion](../discussion/SKILL.md) to ask whether to evaluate or
  close with self-verification only; name the uncovered commit range and record a decline literally. An
  evaluation choice runs Phase 3 and then repeats this freshness check without rerunning unchanged Memory work.
- Require current Execution and Git evidence for accepted focused commits, a clean Cowork worktree, and an
  unchanged main checkout. Return a conversation-only handoff with outcome, scope, topics, artifacts, commits,
  durable memory changes or verified no-change result, verification, evaluation coverage and dispositions,
  exclusions, risks, UUID, base, branch, worktree, head, status, and first recovery command. Retain local
  objects and route any later publication, merge, or cleanup through a separate explicit Git operation.

## References

- [Partner](../gobbi/partner/SKILL.md) owns every partner round Cowork calls, in both launch directions:
  preparation, launch, validation, failure handling, and the labeled frozen content it returns.
- [Agent Teams](../gobbi/agent-teams/SKILL.md) explains Claude Code team setup, use, limits, and cleanup.
