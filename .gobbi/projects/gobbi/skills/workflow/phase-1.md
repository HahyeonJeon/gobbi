# Phase 1 — Configuration, Ideation, and Hand-off

Phase 1 creates or recovers one isolated session, locks the user's intent, and produces the first recovery
checkpoint. The manager may ask the user during Configuration and Ideation because this phase owns settings,
direction, and scope.

[`SKILL.md`](SKILL.md) owns routing, the universal cycle, the two-iteration gate, and continuation. This
document supplies Phase 1 inputs, dispatch details, evidence, and recovery checks.

## Entry

Enter with `P1 · Configuration` in progress. On recovery, enter at the first Phase 1 item that the recovery
algorithm cannot prove complete.

The manager owns every user question. Leaders return missing decisions to the manager and never question the
user directly.

## Configuration

### Fresh session

1. Inspect the repository, branch, worktrees, unfinished work, project rules, system availability, and native
   TODO tools without mutation.
2. Show the defaults once and ask whether to use them or customize.
3. Resolve:
   - Execution `maxIterations`, default three total passes per task;
   - role and model selections;
   - local and remote Git finalization;
   - required Claude and Codex availability;
   - any narrow missing-system waiver authority; and
   - the intended repository and project.
4. Generate the Gobbi session UUID.
5. Derive and create one session branch and worktree through the Git skill.
6. Create the evidence root defined by [`SKILL.md`](SKILL.md) Step 1.2 and write `configuration.md` with the
   UUID, every resolved setting, repository, base revision, branch, absolute worktree, runtime system, and
   creation evidence.
7. Create the fixed step owners, iteration directories, evaluation directories, record directories, staging,
   and outputs authorized by the resolved caps. Execution task interiors wait for Planning PASS.
8. Reread `configuration.md` and verify the evidence root, branch, exact worktree, and clean preimage.
9. Complete Configuration and activate Ideation DISCUSSION.

The receipt is lifecycle evidence, not progression authority. No runtime identity replaces the Gobbi session
UUID, and no later write may target the main checkout or another worktree.

### Recovered session

1. Read the latest completed Hand-off and its named branch, worktree, and `Next TODO`.
2. Reread the Configuration receipt and verify its settings against the current branch and worktree.
3. Walk later canonical records, task checks, and focused commits in workflow order.
4. Recreate completed items only through the strongest verified evidence and activate the first unproved item.
5. Preserve resolved settings unless the user explicitly changes them during Phase 1.

When evidence conflicts, choose the earlier safe item and re-verify. Stop for the user only when the conflict
cannot be recovered safely without changing the session contract or authority.

## Shared evidence adapter

Use the workflow-owned evidence layout from [`SKILL.md`](SKILL.md) Step 1.2 for every phase. Draft and
cross-review inputs follow the Record-owned schemas, but the manager-side writer renders them at the
workflow-owned paths and does not invoke an imported operation that requires another progression authority.

Validate each WORK package with:

```text
scripts/validate-dual-system-work.sh
  --root <absolute-evidence-root>
  --step <ideation|planning|execution|wrap-up>
  --iteration <n>
  --assignment <id>
  --runtime-system <claude|codex>
  [--task task-NN-slug]
```

Evaluation reports are complete human-readable outputs from the Evaluation skill. Each finding has an ID,
severity, evidence, impact, cause, confidence, suggested direction, and `blocking: yes|no`.

The workflow-owned `gate.md` binds both report hashes and records the decision. The workflow-owned RECORD
receipt then binds the gate, WORK package, checks, canonical output, and staging. These files provide recovery
evidence; only the native TODO selects the next action.

## Ideation cycle

### DISCUSSION

Give the leader:

- the user's request and prior explicit decisions;
- applicable project rules and durable memory;
- relevant code, documents, history, prior art, and current behavior;
- affected people, constraints, risks, and recovery needs;
- accepted prior findings and decisions; and
- the exact phase, TODO, stage, iteration, scope, and expected artifact.

The manager and user lock:

- the root problem and intended outcome;
- What, Why, and How;
- included, excluded, deferred, and rejected work;
- success and verification evidence;
- material assumptions and trade-offs;
- authority boundaries; and
- one neutral contract for independent creation.

Treat a prior explicit user decision as resolved. DISCUSSION completes only when every material unknown has an
owner or decision.

### WORK

1. Dispatch one Claude leader and one Codex leader through [`delegation.md`](delegation.md) with the same
   neutral contract and frozen inputs.
2. Require each author to return only its own system-labeled draft.
3. Freeze and validate both drafts before starting either reciprocal review.
4. Start reciprocal review as later, separate operations:
   - Claude reviews the frozen Codex draft.
   - Codex reviews the frozen Claude draft.
5. Freeze and validate both reviews.
6. Give all four frozen inputs to the active runtime's leader.
7. Synthesize one plan-ready What, Why, and How by selecting the strongest supported content, not by averaging.
8. Resolve user-owned material conflicts through the manager and record accepted nonblocking differences.
9. Validate the complete package with the exact command in the Shared evidence adapter.

A draft and its reciprocal review must use separate round trips. The manager must observe and verify the freeze
boundary before exposing either draft.

### EVALUATION

Use one fresh Claude evaluator and one fresh Codex evaluator. Neither may be a creator, persistent teammate, or
recipient of the other evaluator's report.

Both receive:

- the neutral contract;
- both independent drafts;
- both reciprocal reviews;
- the synthesis;
- scope, settings, decisions, and authority;
- relevant project evidence; and
- named verification results.

Both cover Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall. Keep the reports
complete but concise and require every finding to include its severity and blocking classification.

Preserve each evaluator's declared verdict as report evidence, then write a separate fast `gate.md`:

- PASS when no unresolved Critical or `blocking: yes` finding remains, even if a report declares REVISE for
  another finding;
- REVISE on iteration 1 when either blocking class remains; or
- FAIL and stop on iteration 2 when either blocking class remains.

Optional improvements and nonblocking problems are recorded under accepted nonblocking findings. They do not
force a revision.

### RECORD

For every verdict:

1. Seal the current creation and evaluation evidence.
2. Preserve both system provenances, `configuration.md`, and every material decision.
3. Write `gate.md` with report paths, hashes, declared verdicts, blocking IDs, accepted nonblocking IDs, and
   workflow decision.
4. Verify the promised artifacts directly.
5. Write a canonical Ideation artifact only after a fast-gate PASS.
6. Stage only durable candidates supported by evidence; empty staging is valid.
7. Write `record/iteration-N.md` with the exact TODO, input and output hashes, gate hash, checks, canonical
   output, and staging.
8. Update the TODO route only after rereading that receipt and its evidence.

A clean specialist report, idle signal, or TODO status cannot replace these checks.

## Phase 1 Hand-off

Render:

```text
Phase: Phase 1
Outcome: <locked Ideation outcome>
Completed: <Configuration and Ideation completion>
Evidence: <Configuration receipt, canonical artifact, and verification>
Decisions: <resolved settings and material user decisions>
Accepted nonblocking findings: <findings or none>
Branch: <exact branch>
Worktree: <absolute worktree>
Next TODO: P2 · Planning · DISCUSSION · 1/2
Continuation: automatic unless the user interrupts for clear or compact
```

This Hand-off is the Phase 1 clear or compact checkpoint. Display it, complete its TODO, activate Planning
DISCUSSION, and continue immediately without asking whether to proceed.
