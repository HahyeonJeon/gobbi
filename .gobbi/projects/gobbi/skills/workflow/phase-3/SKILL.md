---
name: phase-3
description: "MUST load when Workflow enters Phase 3. Phase 3 evaluates the actual terminal closure, seals PASS evidence, resumes authorized Git finalization, and ends with the exact Hand-off and factual receipt."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
user-invocable: false
---

# Workflow Phase 3

The manager loads this child after the parent [Workflow](../SKILL.md) activates
`P3 · Wrap-up · DISCUSSION · 1/2`. Entry requires a verified Phase 2 Hand-off, completed task commits, and
current finalization authority.

Phase 3 applies the shared [Wrap-up](../../wrap-up/SKILL.md) operation in two parts. DISCUSSION and WORK freeze
and materialize its pre-Git Memory and handoff result; EVALUATION and RECORD judge and seal that actual tree.
Only after PASS does the manager resume Wrap-up for Git finalization and exact display.

This child owns the Workflow loop, fast gate, TODO route, and PASS boundary. Wrap-up owns Memory-to-Git order,
the tracked handoff, finalization sequence, receipt template, display, and recovery. Phase 3 never copies those
schemas or reports an intended Git action as complete.

## Principles

### Freeze the terminal mutation boundary

The tracked tree, handoff bytes, and Git intent become immutable before EVALUATION. Git is the final mutation
and begins only after RECORD proves PASS.

### Evaluate the actual pre-Git result

Evaluators judge the applied Memory changes, tracked handoff, commits, checks, and finalization plan. A draft
or intended closure cannot substitute for the actual worktree.

### Keep handoff and Git facts separate

The tracked handoff contains only pre-finalization facts. The display-only receipt reports later Git outcomes
from direct evidence without changing the handoff.

## Rules

- **MUST enter through the parent Workflow route with a verified Phase 2 Hand-off and one active Phase 3
  item.** Return to recovery when task commits, authority, branch, worktree, or TODO evidence disagree.

- **MUST evaluate and record the complete Wrap-up Phase 2 result before Git begins.** Any tracked mutation
  after the evaluated tree freezes returns to WORK and repeats the complete review.

- **MUST apply the parent fast gate and its two-iteration cap.** Preserve both evaluator verdicts and let only
  the parent workflow decision route the TODO.

- **MUST use Wrap-up and its `handoff.md` child without copying their tracked brief or receipt schemas.** This
  adapter supplies Workflow inputs, evaluation, RECORD evidence, and TODO transitions only.

- **MUST perform only Git actions that are currently configured and authorized.** Retain the branch and
  worktree with an exact recovery action when publication, merge, or cleanup cannot complete safely.

- **NEVER report intended, deferred, failed, or unproved Memory, commit, publication, merge, cleanup, or
  deletion as completed.** Every terminal claim comes from current artifact, Git, and filesystem evidence.

## Procedure

### Phase 1 — Freeze the closure contract

#### 1.1 Enter and operate continuously

- Confirm the parent Workflow is loaded, the Phase 2 Hand-off validates, and
  `P3 · Wrap-up · DISCUSSION · 1/2` is the only active TODO on first entry.
- Confirm the parent Workflow load register contains Delegation, Discussion, Git, Record, and Memory in that
  order. Return to parent recovery when any item is absent.
- Load [Wrap-up](../../wrap-up/SKILL.md), then apply its Phase 1 as the closure-discussion method with the
  owner-loaded [Memory](../../memory/SKILL.md) and [Git](../../git/SKILL.md) skills.
- After every returned artifact, verify it, update the active item, activate the next stage, and continue in
  the same turn. Ask the user only at the parent critical-blocker boundary.
- Treat active waiting for a required agent, system, or tool as work. A progress report or checkpoint is not a
  pause request.

#### 1.2 Inventory accepted work and terminal authority

- Collect the accepted Ideation and Planning artifacts, every Execution task and focused commit, checks,
  evaluations, findings, decisions, waivers, amendments, exclusions, risks, and unresolved items.
- Resolve the Workflow UUID, base branch and commit, session branch, absolute worktree, current head and
  status, project Memory root, intended tracked handoff path, configured publication, and actual destructive
  or external authority from current evidence.
- Read current Memory, the [handoff template](../../wrap-up/handoff.md), repository checks, and Git posture.
  Record each unconfigured or unauthorized Git action literally rather than treating it as an automatic
  blocker.
- Stop before WORK for protected user changes, an active writer, unsupported completion claims, unresolved
  material decisions, wrong-tree evidence, or missing mandatory authority.

#### 1.3 Lock the DISCUSSION result

- Build each brief through [Delegation](../../delegation/SKILL.md) with parent Workflow Step 1.3 fields.
- Resolve agent-to-agent the complete Memory review boundary, tracked handoff path and content contract,
  verification, immutable pre-Git evidence, finalization intent, exclusions, risks, and recovery behavior.
- Freeze one neutral closure contract for both WORK systems. It permits no post-EVALUATION tracked repair and
  contains no claimed final Git outcome.
- Retitle the active item to WORK only after the contract, inputs, paths, authority, and checks are complete.

### Phase 2 — Materialize, evaluate, and record closure

#### 2.1 Produce and cross-review closure drafts

- Call the [Partner](../../gobbi/partner/SKILL.md) operation for one specialist draft round and its
  cross-review round over the same frozen contract and immutable evidence. That operation owns each run's
  independence, freeze order, and validation.
- Require system-labeled Memory-and-handoff drafts that include the complete expected path set and
  verification. Place the returned labeled content, then give the active runtime specialist the contract,
  drafts, and reviews for synthesis.
- Require one decision-complete Memory plan and tracked handoff candidate. Resolve routine in-contract
  differences agent-to-agent and stop only for the parent critical-blocker boundary.

#### 2.2 Apply and freeze Wrap-up Phase 2

- Give one authorized assistant the synthesis, exact Memory root, allowed and protected paths, and checks.
  Apply Wrap-up Phase 2 through the Memory operation; every other process remains read-only.
- Verify every Memory change, required index and link, tracked handoff field, and the complete worktree diff.
  Reject an unrelated path, stale navigation, unsupported claim, or duplicate report.
- Freeze the tracked handoff repository path, exact bytes, SHA-256 digest, actual pre-Git tree, and current Git
  intent. Do not start Wrap-up Phase 3 or add a factual receipt.
- Render the parent-owned Wrap-up WORK package and read it directly against the parent Workflow Step 1.2
  written contract before activating EVALUATION. No script enforces this; refuse the stage when a
  system-labeled draft, cross-review, synthesis, or open-decisions record is missing.

#### 2.3 Evaluate and apply the fast gate

- Load [Evaluation](../../evaluation/SKILL.md) and call the [Partner](../../gobbi/partner/SKILL.md) operation
  for one evaluation round with two fresh evaluators, one from the active runtime and one from the partner
  system. That operation isolates every evaluator; neither may be a creator or persistent teammate.
- Give both the complete creation package, actual pre-Git tree, Memory diff, tracked handoff bytes and digest,
  task commits, checks, finalization intent, authority, exclusions, risks, and retained recovery paths.
- Require each evaluator to apply the complete
  [Evaluation guidelines](../../evaluation/SKILL.md#procedure) to the full frozen Wrap-up subject and use the
  parent finding fields. Preserve both verdicts and apply the parent Wrap-up fast gate.
- Retitle the active item to RECORD only after both reports and the workflow decision validate.

#### 2.4 Record and route the result

- Apply the loaded [Record](../../record/SKILL.md) skill rooted at the parent Workflow Step 1.2 session memory
  tree.
- Seal the creation package, evaluator reports, system provenance, Memory verification, tracked handoff path
  and digest, checks, decisions, findings, Git intent, authority, and retained recovery state.
- Write and verify `gate.md` and `record/iteration-N.md` with their required report, package, gate, output, and
  check hashes before updating the TODO.
- On iteration-1 REVISE, create Wrap-up iteration 2 at DISCUSSION and repeat the complete cycle. On an
  iteration-2 blocking result, preserve the evidence, branch, worktree, and recovery choices with no third
  iteration.
- On PASS, write and verify canonical closure evidence and retitle the Wrap-up item to PASS. Keep it active
  through authorized Git finalization; do not activate `P3 · Hand-off` yet.

#### 2.5 Recover a failed partner run or specialist

- Preserve the last valid evidence and identify the exact failed system, assignment, operation, and check. The
  [Partner](../../gobbi/partner/SKILL.md) operation classifies a failed run and surfaces its evidence; this
  step decides what the workflow does with the paused round.
- Retry only the failed bounded operation when safe. Replace a stale or unaddressable specialist under
  Workflow's [`agent-teams.md`](../agent-teams.md) policy; use the
  [Agent Teams manual](../../gobbi/agent-teams/SKILL.md) for Claude Code tool limits.
- Continue only after the missing output validates. Use a single-system waiver only when existing authority
  names the system, productive step, and iteration.
- Treat an unavailable required system without that waiver as a critical blocker. Never let recovery change the
  frozen pre-Git tree or the tracked handoff bytes; a tracked mutation returns to Step 2.2 and repeats the
  complete review.

### Phase 3 — Finalize and finish

#### 3.1 Verify PASS and the immutable pre-Git state

- Reread canonical closure evidence, evaluator reports, RECORD receipts, every task commit, current tree,
  tracked handoff bytes and digest, branch, worktree, Git intent, authority, and active PASS item.
- Require the current tracked tree to match the evaluated tree exactly. A material difference returns to the
  earliest responsible Wrap-up stage instead of making Git conform to stale evidence.
- Confirm every in-scope tracked change has a verified focused local commit or is the exact evaluated closure
  content authorized for the final local commit.

#### 3.2 Resume Wrap-up Phase 3 and finalize Git

- Apply Wrap-up Phase 3 through the [Git operation](../../git/SKILL.md). Recheck mutable branch, worktree,
  publication, merge, and cleanup evidence immediately before each dependent action.
- Perform configured publication only with its current prerequisites. Merge and cleanup require explicit
  current user authority and their complete safety gates.
- Record each actual outcome as `not configured`, `not authorized`, `not attempted`, `deferred`, `failed`,
  `completed`, or `retained`. Preserve exact recovery evidence when any object remains.
- Complete the Wrap-up PASS item and activate `P3 · Hand-off` only after every authorized Git action reaches a
  proved completed or recoverable terminal state.

#### 3.3 Resume Wrap-up Phase 4 and close the workflow

- Reread the tracked handoff from its accepted commit object, recompute its digest, and require an exact match
  with the frozen bytes before display.
- Display the tracked handoff byte-for-byte, then append the separate factual Git receipt defined by
  [Wrap-up `handoff.md`](../../wrap-up/handoff.md). Do not add the receipt to any tracked file.
- Verify the handoff, receipt, native TODO, commits, publication state, branch, worktree, and recovery command
  against direct evidence.
- Complete `P3 · Hand-off` only when those facts agree. Leave no next TODO, display the terminal checkpoint,
  and end the Workflow.

## References

- [Parent Workflow](../SKILL.md) owns native TODO routing, shared evidence, assignment additions, gates, and
  partner-round coordination.
- [Wrap-up](../../wrap-up/SKILL.md) owns shared terminal Memory, Git, handoff, display, and recovery order.
- [Wrap-up handoff](../../wrap-up/handoff.md) owns the tracked operator brief and display-only Git receipt.
- [Memory](../../memory/SKILL.md), [Evaluation](../../evaluation/SKILL.md),
  [Record](../../record/SKILL.md), and [Git](../../git/SKILL.md) own their respective mechanisms.
