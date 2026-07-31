---
name: phase-3
description: "MUST load when Workflow enters Phase 3. Phase 3 is an operation skill for promoting supported durable material, producing the evaluated handoff, performing authorized Git finalization, and ending with a verified terminal Hand-off."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
user-invocable: false
---

# Workflow Phase 3

The manager loads this child skill after the parent [Workflow](../SKILL.md) operation activates
`P3 · Wrap-up · DISCUSSION · 1/2`, or when recovery selects an unfinished Phase 3 item. Entry requires a
verified Phase 2 Hand-off, completed task commits, and the configured finalization authority.

Phase 3 promotes only supported durable material, evaluates the actual closure result, performs only
authorized Git finalization, and reports the exact terminal state. It completes when the terminal Hand-off,
finalization receipt, native TODO, Git state, and filesystem evidence agree.

This child owns Phase 3 actions, decisions, evidence, failure recovery, and terminal checks. It applies the
parent's shared route, evidence, and fast-gate contracts, the Wrap-up operation's final Hand-off body
contract, and the Git skill's finalization receipt contract. It never invents promotion material or authority.

## Principles

### Promote only what typed evidence supports

Every durable destination change must trace to a staged source whose type, content, and evidence justify
promotion.

### Evaluate the actual closure result

Wrap-up evaluation judges the real post-promotion worktree, handoff, commits, and finalization plan rather than
an intended or pre-application result.

### Report only actions that occurred

The terminal Hand-off and factual receipt distinguish completed, retained, deferred, failed, and unconfigured
outcomes without rewriting history.

## Rules

- **MUST enter through the parent Workflow route with a verified Phase 2 Hand-off and exactly one unfinished
  Phase 3 item in progress.** Return to recovery when task evidence, commits, staging, authority, branch, or
  worktree disagree.

- **MUST verify every changed durable destination against one evidenced staged source and confirm the source
  remains unchanged.** Empty staging is valid and never requires invented material.

- **MUST apply the parent fast gate and its two-iteration cap to Wrap-up.** Preserve both evaluator verdicts
  and let only the separate workflow decision route the TODO.

- **MUST perform only Git actions that are already configured and authorized.** Retain the branch and worktree
  with an exact recovery action when publication, merge, or cleanup is unavailable, unauthorized, deferred, or
  incomplete.

- **NEVER treat an optional remote action without authority as an automatic blocker.** Complete the authorized
  local outcome and report the unperformed action unless the locked outcome made it mandatory.

- **NEVER report an intended, deferred, or failed promotion, publication, merge, cleanup, or deletion as
  completed.** Every terminal claim must come from current Git, filesystem, and artifact evidence.

## Procedure

### Phase 1 — Freeze the closure contract

#### 1.1 Enter and operate continuously

- Confirm the parent [Workflow](../SKILL.md) operation is loaded, the Phase 2 Hand-off validates, and
  `P3 · Wrap-up · DISCUSSION · 1/2` is the only active TODO on first entry.
- Load the [Wrap-up](../../wrap-up/SKILL.md), [Memory](../../memory/SKILL.md), and
  [Git](../../git/SKILL.md) skills before the closure discussion.
- After every returned artifact, verify it, retitle or complete the active item, activate the next stage, and
  continue immediately.
- Ask the user only through the parent critical-blocker boundary for missing safety or authority, an
  unavailable required system without waiver, or an extremely material change outside the Phase 1 contract.
- Treat active waiting for an assigned agent, required system, or tool as work. A progress message or Hand-off
  is not a pause request.

#### 1.2 Inventory promotion and finalization inputs

- Collect the canonical Ideation and Planning artifacts, every completed Execution task and focused commit,
  checks, evaluations, accepted findings, decisions, system waivers, and plan amendments.
- Read the typed staging inventory, durable destination preimages, memory and record rules, handoff
  requirements, configured Git finalization, and actual external and destructive authority.
- Verify each staged candidate has a type, source evidence, intended destination, and current destination
  preimage. Preserve empty staging as a valid input.
- Identify local commit coverage, retained recovery paths, unresolved items, and every configured publication,
  pull-request, merge, or cleanup action.
- Stop before WORK when protected user changes, unsupported candidates, conflicting commits, or missing
  mandatory authority make safe closure impossible.

#### 1.3 Lock the closure discussion contract

- Give the Wrap-up specialist the complete closure inventory through the
  [Delegation](../../delegation/SKILL.md) template plus the parent Workflow Step 1.3 fields.
- Resolve agent-to-agent:
  - which typed candidates have sufficient evidence;
  - source-to-destination promotion mapping;
  - empty staging;
  - the Wrap-up-owned handoff body;
  - unresolved items and recovery;
  - local commit coverage;
  - configured publication steps; and
  - actual merge or cleanup authority.
- Never invent a durable item to populate empty staging or promote material that lacks typed evidence.
- Freeze the neutral closure contract, immutable inputs, promotion boundary, handoff requirements, and checks
  before retitling the TODO to WORK.

### Phase 2 — Produce and record Wrap-up

#### 2.1 Produce and cross-review closure drafts

- Give independent Claude and Codex specialists the same frozen closure contract and immutable evidence.
- Require independent promotion-and-handoff drafts. Freeze and verify both drafts before reciprocal review.
- Dispatch reciprocal reviews as later, separate operations and freeze both.
- Give the active runtime specialist the contract, both drafts, and both reviews. Require a canonical
  promotion manifest and Wrap-up-owned handoff body.
- Reread the synthesis and resolve routine in-contract differences agent-to-agent. Stop for the parent
  critical-blocker boundary when synthesis would require new scope or authority.

#### 2.2 Apply and verify supported promotion

- Give one authorized writer the resolved promotion manifest and exact destination allowlist.
- Apply only supported promotion inside the isolated worktree. Keep every other process read-only.
- Verify every changed destination against exactly one staged source and confirm the source evidence remains
  unchanged.
- Verify the applied result is repeatable and that the session handoff and any durable handoff note use the
  same substantive body.
- Run the required project checks and inspect the actual post-promotion tree.
- Render the complete WORK package at the parent-owned Wrap-up path and run the exact parent Workflow Step 1.2
  validator command for `--step wrap-up`.
- Freeze the actual tree, promotion evidence, and handoff before activating EVALUATION. Add no factual
  finalization receipt until the authorized Git actions occur.

#### 2.3 Evaluate and apply the fast gate

- Load the [Evaluation](../../evaluation/SKILL.md) skill and dispatch one fresh Claude evaluator and one fresh
  Codex evaluator. Neither may be a creator, persistent teammate, or recipient of the other report.
- Give both evaluators the complete creation package, actual post-promotion tree, source and destination
  evidence, promotion manifest, handoff, commits, checks, configured Git plan, and retained recovery paths.
- Require complete Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall coverage
  and the parent-owned finding fields.
- Preserve both declared verdicts and apply the parent Wrap-up fast gate and two-iteration cap.
- Retitle the active TODO to RECORD only after both independent reports and the workflow decision validate.

#### 2.4 Record and route the result

- Load the [Record](../../record/SKILL.md) skill under the parent Workflow Step 1.2 evidence-only override.
- Seal the creation package, evaluator reports, system provenances, promotion evidence, handoff, checks,
  decisions, findings, and retained recovery state.
- Write `gate.md` with report paths and hashes, declared verdicts, unresolved Critical IDs, actual blocking
  IDs, accepted nonblocking IDs, and the workflow decision.
- Verify every promotion source and destination mapping, the Wrap-up-owned handoff body, and that no
  unsupported material was staged or promoted.
- Write `record/iteration-N.md` with the exact TODO, package and report hashes, gate hash, promotion checks,
  canonical output, and staging. Reread the receipt before updating the TODO.
- On iteration-1 REVISE, create Wrap-up iteration 2 at DISCUSSION and repeat the complete cycle immediately.
- On iteration-2 FAIL, preserve the evidence, branch, worktree, and exact recovery choices. Never create
  iteration 3.
- On PASS, write and verify canonical Wrap-up evidence and retitle the Wrap-up item to PASS. Keep that item in
  progress through authorized Git finalization; do not activate `P3 · Hand-off` yet.

### Phase 3 — Finalize and finish

#### 3.1 Verify PASS and the authorized local state

- Verify canonical Wrap-up evidence, promotion results, every local task and promotion commit, required
  checks, Wrap-up-owned handoff body, branch, worktree, and active Wrap-up PASS item.
- Confirm the evaluated finalization plan agrees with current configured authority and current Git and
  filesystem evidence.
- Create a required final local documentation or promotion commit only when its exact content was evaluated
  and is not already committed.
- Return to the earliest responsible Wrap-up step when a material mismatch exists. Do not make an external
  action conform to a stale evaluated plan.

#### 3.2 Perform configured Git finalization

- Confirm every in-scope change has a verified focused local commit and the committed tree matches the
  evaluated result.
- Perform configured publication only when it is already authorized and its current prerequisites pass.
- Merge only with explicit user authority and current merge-gate evidence.
- Clean up only after a confirmed merge, synchronized base, clean session worktree, and verified safe
  preimage. Otherwise retain the branch and worktree.
- Record the actual outcomes required by the [Git](../../git/SKILL.md) skill's factual finalization receipt.
- When an external action is unconfigured, unauthorized, deferred, or failed, preserve the completed local
  outcome and the exact recovery evidence required by the Git skill.

#### 3.3 Render and verify the terminal Hand-off

- Complete the Wrap-up PASS item and activate `P3 · Hand-off` only after Step 3.2 records the actual outcomes
  of every authorized Git action.
- Display the complete evaluated Hand-off body defined by the [Wrap-up](../../wrap-up/SKILL.md) operation.
- Append the factual finalization receipt defined by the [Git](../../git/SKILL.md) skill without rewriting
  the evaluated Hand-off body.
- Verify the Hand-off, receipt, native TODO, local commits, publication state, branch, worktree, and any
  recovery command against direct evidence.
- Complete `P3 · Hand-off` only when those facts agree. Display the terminal checkpoint and end the workflow.
- When the branch or worktree remains, include its exact identity, status, head commit, and first recovery
  command.

## References
