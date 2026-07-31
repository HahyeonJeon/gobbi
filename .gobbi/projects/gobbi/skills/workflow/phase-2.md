# Phase 2 — Planning, Execution, and Hand-off

Phase 2 turns the locked Ideation contract into ordered tasks and completes them in one writer chain. It is
continuous: agents make routine in-contract decisions with each other, and the manager does not ask the user
routine questions or deliberately leave the session idle.

[`SKILL.md`](SKILL.md) owns routing, the universal cycle, iteration rules, and the critical-blocker boundary.
This document supplies Planning and Execution inputs, dispatch, evidence, and recovery details.

## Entry and continuous operation

Enter with `P2 · Planning · DISCUSSION · 1/2` in progress and a verified Phase 1 Hand-off.

After each nonterminal report:

1. confirm the specialist is idle and addressable when reuse is planned;
2. reread and verify the promised evidence;
3. retitle or complete the current TODO as required;
4. activate the next TODO; and
5. dispatch or perform the next bounded action immediately.

Waiting is valid only while an assigned agent, system, or tool is actively running. A progress message or
Hand-off is not a pause request.

Stop for the user only after safe in-contract recovery is exhausted and one of these conditions remains:

- required safety or user authority is missing;
- a required system is unavailable and no applicable waiver exists; or
- continuing requires an extremely material design or strategy change outside the locked Ideation contract.

## Planning cycle

### DISCUSSION

Give the leader:

- the canonical Ideation artifact and complete Phase 1 evidence;
- resolved settings, approved decisions, and accepted nonblocking findings;
- repository and worktree preimages;
- relevant memory and required skills;
- external-write and Git authority;
- known dependencies and writer boundaries; and
- the Planning iteration and acceptance criteria.

The manager and agents resolve:

- the complete task hierarchy;
- stable `task-NN-slug` identities;
- foundation-before-dependent order;
- task boundaries, outputs, and one accountable role;
- required skill loads;
- read-only parallel lanes and one-writer order;
- verification and focused-commit requirements; and
- coverage of every Ideation obligation.

Routine choices must preserve the Phase 1 contract. Unknown facts trigger bounded study, not invented scope or
a user question.

### WORK

1. Give independent Claude and Codex leaders the same frozen Planning contract.
2. Freeze both proposals before reciprocal review.
3. Dispatch each reciprocal review as a later, separate operation.
4. Freeze both reviews.
5. Let the active runtime's leader synthesize:
   - a complete hierarchy;
   - a dependency-valid ordered plan;
   - stable task IDs;
   - write and read-only lanes;
   - required skills and roles;
   - exact scope boundaries; and
   - acceptance and verification for every task.
6. Validate the complete work package with the exact command in
   [`phase-1.md`](phase-1.md) § Shared evidence adapter.
7. Reread the canonical candidate before EVALUATION.

### EVALUATION and RECORD

Use one fresh Claude evaluator and one fresh Codex evaluator with the complete creation package and finding
format from the shared evidence adapter. Neither sees the other report.

Preserve both declared report verdicts, then write a fast `gate.md`:

- PASS when no unresolved Critical or `blocking: yes` finding remains, even if a report declares REVISE for
  another finding;
- REVISE once when either blocking class remains after iteration 1; or
- FAIL and stop when either blocking class remains after iteration 2.

Run RECORD after every gate decision. Bind the creation package, reports, gate, checks, output, and staging in
`record/iteration-N.md`. On PASS:

- verify every Ideation obligation appears in the plan;
- verify stable IDs and dependency order;
- verify no two write-capable tasks overlap;
- preserve accepted nonblocking findings;
- freeze the canonical plan; and
- expand the Execution TODO route.

Do not ask the user to disposition routine or nonblocking findings. The manager records their evidence-backed
in-contract disposition.

## Execution route

Replace the pending `unplanned` placeholder with the first plan task and add the remaining tasks in plan order.
Each task begins as:

```text
P2 · Execution · task-NN-slug · DISCUSSION · 1/<configured-max>
```

Use exactly the plan's canonical ID in the TODO title, delegation, work package, validation command, record,
and commit evidence.

Retitle the active item for WORK, EVALUATION, RECORD, and PASS. When a pass needs revision, complete its item at
RECORD and add the next iteration at DISCUSSION; never overwrite the completed iteration's identity. Only the
first unproved item is in progress.

## Execution task cycle

### DISCUSSION

Give the executor one task with:

- stable task ID and canonical plan;
- exact absolute worktree and current preimage;
- allowed and protected paths;
- prerequisites and upstream artifacts;
- required skills;
- acceptance criteria and verification commands;
- commit and external-action authority; and
- accepted findings from prior passes.

Agents resolve ordinary implementation details through evidence and peer discussion. When Execution exposes
an in-contract plan defect, preserve the completed Planning item and create a numbered plan amendment during
the current task's DISCUSSION:

1. record the defect, cause, affected pending tasks, new order or contracts, and verification;
2. retitle or reorder only pending Execution items;
3. preserve completed task commits;
4. add a compensating pending task when an in-contract change must alter a completed result; and
5. stop at the critical-blocker boundary when safe compensation is impossible or the change exceeds the
   locked contract.

The amendment never reopens Planning, consumes another Planning iteration, or mutates the canonical plan
artifact. The Phase 2 Hand-off lists every amendment.

### WORK

1. Give one Claude contributor and one Codex contributor the same task contract and frozen preimage.
2. Freeze both independent proposals.
3. Run reciprocal cross-review only after both freeze.
4. Give the active runtime's executor all four frozen inputs.
5. Let that executor synthesize and implement as the sole worktree writer.
6. Run the task's verification.
7. Create one focused local task commit.
8. Validate and reread the creation package, diff, checks, and commit.

Peer processes and read-only helpers cannot mutate the worktree, TODO route, external systems, scope, or user
decisions.

### EVALUATION

Use two fresh independent evaluators and the normal evaluation gate. Both receive:

- the task and scope contract;
- frozen drafts and cross-reviews;
- resolved decisions;
- implementation diff;
- tests and command results;
- focused commit;
- repository state; and
- findings relevant to the current pass.

Each evaluator uses the shared evidence adapter's report format. The manager hashes both reports, records both
verdicts in normal-mode `gate.md`, and derives the workflow decision by severity: FAIL outranks REVISE, which
outranks PASS. A non-PASS decision cannot become PASS merely because its correction is inconvenient or its
configured cap is close.

### RECORD

For each task pass:

1. seal both evaluation reports and normal-mode `gate.md`;
2. preserve findings and their evidence-backed dispositions;
3. reread the committed diff;
4. rerun or inspect the required verification;
5. verify that only authorized paths changed;
6. confirm the focused commit exists in the exact worktree;
7. write `record/iteration-N.md` with the exact TODO, package and report hashes, gate hash, checks, commit,
   output, and staging; and
8. update the TODO only after rereading that receipt and its evidence.

On PASS, complete the task item and begin the next task immediately.

On REVISE below the configured cap, record the pass, add the next task iteration, and continue immediately.

On FAIL or an exhausted cap, try every safe in-contract recovery first. If the task still cannot pass, keep the
current route recoverable and report the blocker, evidence, preserved branch and worktree, and available
recovery choices.

## System and agent failure

For a timeout, malformed result, identity failure, invalid artifact, lost specialist, or unavailable peer:

1. preserve the last valid evidence;
2. identify the exact failed system, assignment, operation, and check;
3. retry only that bounded operation when safe;
4. replace stale or unaddressable specialists with fully primed fresh ones; and
5. continue only when the missing evidence validates.

Use a single-system waiver only when existing authority names the affected system, productive step, and
iteration. Otherwise the unavailable system is a critical blocker.

## Phase 2 Hand-off

Render:

```text
Phase: Phase 2
Outcome: <planned and executed outcome>
Completed: <Planning and stable task IDs>
Evidence: <plan, task commits, tests, and evaluations>
Decisions: <autonomous in-contract decisions and material authorities>
Accepted nonblocking findings: <findings or none>
Branch: <exact branch>
Worktree: <absolute worktree>
Next TODO: P3 · Wrap-up · DISCUSSION · 1/2
Continuation: automatic unless the user interrupts for clear or compact
```

This Hand-off is the Phase 2 clear or compact checkpoint. Display it, complete its TODO, activate Wrap-up
DISCUSSION, and continue immediately without asking whether to proceed.
