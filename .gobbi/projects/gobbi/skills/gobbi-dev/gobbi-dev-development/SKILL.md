---
name: gobbi-dev-development
description: "MUST load when realizing an accepted Gobbi change contract and coordinating it through a verified local commit and lifecycle handoffs."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Gobbi Development

A development coordinator uses this operation after a Gobbi change contract has been accepted. The result is
one verified focused local commit plus exact testing, review, or recovery handoffs bound to that commit.

This operation coordinates existing mechanism owners. It does not design the change, issue an Evaluation
verdict, accept work, create mode state, or take Git authority from its owner.

## Principles

### Start from accepted meaning

Implementation realizes a frozen contract; it does not silently redesign it. A material gap returns to the
owner that can change the contract.

### Route work to its mechanism owner

Skill, agent, script, documentation, package, and Git changes have existing owners and checks. Coordination
keeps their contracts aligned without copying them here.

### Bind proof to one commit

Working-tree observations can change before handoff. Verification and downstream requests must identify the
exact committed tree they support.

### Recover at the earliest failed owner

A downstream symptom may come from an earlier contract, implementation, tool, or evidence defect. Return the
failure to the earliest supported cause and preserve the current branch and worktree.

## Rules

- **MUST begin with an accepted change contract that names scope, outcome, criteria, authority, mode or caller,
  and exact starting revision.** Missing, conflicting, or changed acceptance is a stop for the manager or user.
- **MUST map every planned write, read, update, delete, caller, consumer, check, document, generated view, and
  protected surface before implementation.** Unowned or out-of-scope work returns for a scope decision.
- **MUST load each mechanism owner before using its commands, schemas, authoring rules, or mutation path.**
  This operation coordinates their outputs and never replaces their authority.
- **MUST keep one ordered writer, one isolated session worktree, and one focused verified local commit for the
  accepted implementation unit.** Git owns staging, provenance, commit, publication, merge, and cleanup.
- **MUST bind testing and review requests to the exact commit, contract, claims, relevant checks, limits, and
  requested evidence.** Findings, Evaluation verdicts, and manager or user acceptance remain separate.
- **NEVER widen scope, alter mode or TODO state, suppress a failure, publish, merge, release, deploy, or clean
  up through this operation.** Stop with the exact retained state and next owner when those actions are needed.

## Procedure

### Phase 1 — Bind the Accepted Contract

#### 1.1 Validate acceptance and mode contract

- Take the accepted change contract, acceptance record, mode or stateless caller contract, session identity
  when present, base and current revisions, isolated worktree, scope, criteria, authority, and protected paths.
- Re-read applicable accepted Ideation and Planning, governing rules, relevant owners, and current repository
  state. Confirm that the contract still describes the requested outcome and live preimage.
- Require the manager or user acceptance to apply to the exact contract. Mode evidence and any TODO remain
  owned by that mode; General supplies no invented identity, TODO, or state.
- Stop without implementation when the contract, acceptance, identity, worktree, branch, preimage, scope, or
  authority is absent, ambiguous, dirty in conflict, or changed. Return the mismatch to the manager.

### Phase 2 — Coordinate Realization

#### 2.1 Route mechanism owners

- Map the complete affected set through Create, consistency Read, exact Update, Delete, and co-touches. Answer
  who consumes each surface, what changes, when it applies, where it propagates, why it is needed, and how it
  will be verified.
- Build the accepted implementation from its foundation upward. For each unit, load and follow the current
  skill, agent, package, runtime, language, or documentation owner before its first governed action.
- Keep one writer and the accepted path boundary. Generated views are reconciled only through their owner;
  protected and unrelated work remains unchanged.
- After each complete unit, run its narrow checks and inspect the observable result. Trace a failure to the
  earliest incorrect contract, mechanism choice, source, integration, projection, or check before repair.

#### 2.2 Verify the focused commit

- Run every accepted and risk-driven check on the exact final tree. Inspect the complete diff for scope,
  stale mirrors or callers, authority drift, unsafe effects, unexpected churn, and current documentation.
- Hand the verified allowlisted paths and evidence to the Git owner for explicit staging and one focused local
  commit with the session's required provenance. No publication, merge, cleanup, or history rewrite follows.
- Re-read the commit object and tree. Require the committed path set and bytes to equal the verified result,
  the base ancestry and provenance to match the contract, assignment paths to be clean, and unrelated work to
  remain preserved.
- If commit creation or reread fails, preserve the branch, worktree, diff, and verification evidence. Return
  the first mismatch to the Git or implementation owner instead of claiming completion.

### Phase 3 — Handoff or Recover

#### 3.1 Issue testing and review requests

- Build each request from the accepted contract and exact commit. Include claims, affected surfaces, required
  and risk-driven checks, prior failures, evidence already gathered, environment limits, and protected paths.
- Request exact-revision evidence from `gobbi-dev-testing` when proof is needed. Request protected findings
  from `gobbi-dev-review` when review is needed; load both when both triggers apply.
- Keep Evaluation and acceptance outside both requests. Return the committed implementation and separate
  evidence or findings to the mode or caller that owns their routing and decisions.
- Completion is one verified focused commit with exact handoffs, preserved unrelated work, no unauthorized
  side effect, and no uncommitted in-scope implementation.

#### 3.2 Return exact failure state

- On a testing, review, or later owner failure, bind the finding to the exact commit and reproduce it safely
  when possible. A changed subject invalidates the prior result.
- Route an accepted-contract defect to its design or planning owner, an authoring defect to its authoring
  owner, an implementation defect to Execution, a tool fact to its tool owner, a Git defect to Git, and an
  ambiguous cause to the manager.
- Preserve the exact branch, worktree, commit or diff, observations, first useful diagnostic, evidence limits,
  and next authorized action. Do not amend, retry, revert, or broaden scope without a new accepted contract.

## References
