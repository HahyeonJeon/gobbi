---
name: phase-3
description: "MUST load when Workflow enters Phase 3. Evaluates the actual terminal closure, seals PASS evidence, resumes authorized Git finalization, and ends with the exact Hand-off and factual receipt."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
user-invocable: false
---

# Workflow Phase 3

The manager loads this child only after the parent [Workflow](../SKILL.md) activates
`P3 · Wrap-up · DISCUSSION · 1/2`, or when recovery selects an unfinished Phase 3 item. Entry requires the
verified Phase 2 Hand-off, completed task commits, and current finalization authority. The parent remains loaded
and owns all shared Workflow contracts.

Phase 3 adapts [Wrap-up](../../wrap-up/SKILL.md) to Workflow. It materializes and evaluates the actual pre-Git
Memory and handoff result, records PASS, then resumes authorized finalization and exact display. Wrap-up and its
[`handoff.md`](../../wrap-up/handoff.md) child retain their schemas and mechanics.

## Principles

### Freeze the terminal mutation boundary

Memory changes, handoff bytes, and Git intent freeze before evaluation. Git begins only after RECORD proves
PASS.

### Evaluate the actual pre-Git result

Evaluators judge the applied Memory changes, tracked handoff, commits, checks, and finalization plan, not an
intended closure.

### Keep handoff and Git facts separate

The tracked handoff contains only pre-finalization facts. The display-only receipt reports later Git outcomes.

## Rules

- **MUST enter through the parent route with a verified Phase 2 Hand-off and exactly one Phase 3 item active.**
  Return to recovery when tasks, authority, branch, worktree, TODO, or evidence disagree.
- **MUST apply the parent's [shared productive-step cycle](../SKILL.md#14-apply-the-shared-productive-step-cycle)
  and fast two-iteration gate to the actual closure.** Apply Gobbi's finding gate through the parent; only PASS
  continues.
- **MUST prohibit Git finalization before EVALUATION and RECORD accept the frozen pre-Git tree.** Any tracked
  mutation after freeze returns to WORK and repeats the complete review.
- **MUST use Wrap-up and `handoff.md` without copying their report or receipt schemas.** This child supplies
  Workflow inputs, gates, records, transitions, and terminal checks only.
- **MUST perform only currently configured and authorized Git actions.** Retain branch and worktree with an
  exact recovery action when publication, merge, or cleanup cannot complete safely.
- **NEVER report intended, deferred, failed, or unproved Memory or Git work as completed.** Every terminal
  claim comes from current artifact, Git, and filesystem evidence.

## Procedure

### Phase 1 — Freeze the closure contract

#### 1.1 Enter and inventory accepted work

- Confirm the parent and its owner-skill register, Phase 2 Hand-off, active Wrap-up TODO, accepted Ideation and
  Planning outputs, every Execution task and focused commit, checks, evaluations, findings, decisions, waivers,
  amendments, exclusions, risks, and unresolved items.
- Load [Wrap-up](../../wrap-up/SKILL.md). Resolve UUID, base branch/commit, session branch, absolute worktree,
  head/status, project Memory root, tracked handoff path, configured publication, and actual external or
  destructive authority from direct evidence.
- Read current Memory, Wrap-up `handoff.md`, repository checks, and Git posture. Record every unconfigured or
  unauthorized Git action literally. Stop before WORK for protected changes, an active writer, unsupported
  completion, unresolved material decisions, wrong-tree evidence, or missing mandatory authority.

#### 1.2 Supply Workflow's Wrap-up inputs

- Build the assistant brief through [Delegation](../../delegation/SKILL.md) and
  [parent Step 1.3](../SKILL.md#13-build-and-accept-specialist-assignments). Apply Wrap-up
  Phase 1 using these four fixed properties:

| Property | Workflow value |
|---|---|
| Session root | The full parent Step 1.2 evidence root. |
| Project memory root | The current project's bounded `.gobbi/projects/{project}/memory/` root. |
| Handoff path | `.gobbi/projects/{project}/memory/reports/note/YYYY-MM-DD-{descriptive-title}.md`. |
| Authorized finalization sequence | Only parent Step 1.2 configured intent with current authority. |

- Freeze the complete Memory review boundary, tracked handoff contract, verification, pre-Git evidence,
  finalization intent, exclusions, risks, and recovery. The contract permits no post-evaluation tracked repair
  and claims no final Git outcome.

### Phase 2 — Materialize, evaluate, and record closure

#### 2.1 Produce, apply, and freeze Wrap-up Phase 2

- Invoke parent WORK with local role `assistant`, accepted Workflow evidence as the frozen subject, and the
  Memory/handoff candidate as output. The assistant self-reviews and synthesizes the policy-selected drafts.
- Give one authorized assistant the synthesis, exact Memory root, allowed/protected paths, and checks. Apply
  Wrap-up Phase 2 through [Memory](../../memory/SKILL.md); every other process remains read-only.
- Verify every Memory path, index, link, tracked handoff field, and complete worktree diff. Reject an unrelated
  path, stale navigation, unsupported claim, or duplicate report.
- Freeze the tracked handoff repository path, exact bytes, SHA-256 digest, actual pre-Git tree, and current Git
  intent. Do not start Wrap-up Phase 3 or add a factual receipt. Read and accept the complete parent WORK
  package before EVALUATION.

#### 2.2 Evaluate and record the actual closure

- Complete parent EVALUATION over the creation package, actual pre-Git tree, Memory diff, handoff bytes and
  digest, task commits, checks, finalization intent, authority, exclusions, risks, and recovery paths.
- Apply the parent fast gate and RECORD schema. Seal reports, provenance, Memory verification, handoff path and
  digest, checks, decisions, findings, Git intent, authority, and retained recovery state.
- On first-pass REVISE, create iteration 2 at DISCUSSION and repeat the complete cycle. On second-pass FAIL,
  preserve evidence, branch, worktree, and recovery choices without a third iteration.
- On PASS, verify canonical closure evidence, retitle Wrap-up to PASS, and keep it active. Git remains prohibited
  until RECORD is complete. A failed partner run or specialist follows parent Step 1.5 and may not change the
  frozen tree; any tracked mutation returns to Step 2.1.

### Phase 3 — Finalize and finish

#### 3.1 Revalidate the immutable PASS subject

- Reread closure evidence, reports, receipts, task commits, current tree, handoff bytes/digest, branch,
  worktree, Git intent, authority, and active PASS item. Require the current tracked tree to equal the evaluated
  tree exactly; otherwise return to the earliest responsible Wrap-up step.
- Confirm every in-scope tracked change is in a verified focused commit or is the exact evaluated closure
  content authorized for the final local commit.

#### 3.2 Resume authorized finalization

- Apply Wrap-up Phase 3 through [Git](../../git/SKILL.md). Recheck branch, worktree, publication, merge, and
  cleanup evidence immediately before each dependent action. Perform only configured actions with current
  authority.
- Record each outcome literally as `not configured`, `not authorized`, `not attempted`, `deferred`, `failed`,
  `completed`, or `retained`. Preserve exact recovery evidence when any object remains.
- Complete the Wrap-up PASS item and activate `P3 · Hand-off` only after every authorized action reaches a
  proved completed or recoverable terminal state.

#### 3.3 Display and terminate

- Apply Wrap-up Phase 4. Reread the tracked handoff from its accepted commit object, recompute its digest, and
  require exact equality with the frozen bytes.
- Display the tracked handoff byte-for-byte, then append the separate factual Git receipt defined by
  `handoff.md`. Do not write the receipt to a tracked file.
- Verify handoff, receipt, TODO, commits, publication state, branch, worktree, and recovery command against
  direct evidence. Complete `P3 · Hand-off` only when they agree. Leave no next TODO and end Workflow.

## References

- [Parent Workflow](../SKILL.md) owns shared Workflow contracts and terminal routing.
- [Wrap-up](../../wrap-up/SKILL.md) owns Memory-to-Git order, tracked handoff, finalization, display, and
  recovery.
- [Wrap-up handoff](../../wrap-up/handoff.md) owns the tracked report and display-only Git receipt schemas.
- [Memory](../../memory/SKILL.md), [Evaluation](../../evaluation/SKILL.md), and
  [Git](../../git/SKILL.md) own their mechanisms.
