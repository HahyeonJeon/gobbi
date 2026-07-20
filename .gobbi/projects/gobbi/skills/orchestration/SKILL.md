---
name: orchestration
description: How a manager orchestrates specialists through one durable Gobbi workflow.
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, Task, AskUserQuestion
skill-type: operation
---

# Orchestration

Use this skill when a manager starts, resumes, routes, or closes a Gobbi session. The outcome is one isolated, recoverable session that follows Configuration → Ideation → Planning → Execution → Wrap-up and leaves verified local commits plus a durable handoff.

The manager owns user discussion, authority, dispatch, routing, and verification. Specialists own the work assigned to their roles. The user retains final authority over material direction, scope, destructive action, publication, waivers, and finding disposition.

## Principles

### One workflow, one cursor

Every productive step runs DISCUSSION → WORK → EVALUATION → RECORD. `state.json` version 3 is the only active router. Runtime task lists and concise progress messages are one-way views of that file.

### Independent work before synthesis

Each WORK stage begins with independent Claude and Codex drafts created from the same neutral contract. Reciprocal review begins only after both drafts are frozen. The active runtime's specialist synthesizes after both cross-reviews. Cost is never a reason to narrow independent Ideation, independent creation, or evaluation rigor.

### Fresh independent review

Every productive step receives two fresh evaluator reports. Each system independently covers Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall. A materially revised canonical artifact receives the complete review again.

### Durable evidence before routing

The manager advances only after rereading promised artifacts and verifying the record. A specialist report, idle notice, runtime task status, or progress message is not completion evidence by itself.

### Isolated local delivery

Each Gobbi session owns one UUID, branch, and worktree. All ordered Execution writes use that worktree and one writer chain. Verified local commits are mandatory. Remote issue, push, pull-request, and merge actions occur only under their configured and user-authorized conditions.

## Rules

### Must follow

- Read [`delegation.md`](delegation.md) before every specialist dispatch.
- Generate the Gobbi session UUID before creating its branch or worktree. A runtime identity never replaces that UUID.
- Write a validated `state.json` transition before announcing any visible transition.
- Run Planning. It cannot be skipped.
- Use both systems for every WORK and EVALUATION stage unless the user explicitly approves a waiver limited to one named system, step, and iteration.
- Keep evaluators fresh, isolated from creator roles, and isolated from each other.
- Present one recommended finding-disposition batch to the user after evaluation. Do not revise the canonical artifact until the user approves or edits the batch.
- Keep all worktree writes ordered through one writer chain even when read-only investigation is parallel.
- Verify the promised artifact or commit after every specialist report and before advancing the cursor.
- Preserve settings on resume. Change them only on explicit user request or a user decision after an exhausted iteration cap.

### Must not follow

- Do not let a runtime task list, progress message, or specialist change `state.json` directly.
- Do not let a specialist change scope, make a user decision, accept its own work, reassign work, or authorize a destructive action.
- Do not place an evaluator in a persistent team.
- Do not silently continue with one system after the other fails.
- Do not create session files before the fresh-session defaults decision.
- Do not search other worktrees for an active session or maintain a global active-session pointer.
- Do not write step artifacts to durable project memory before Wrap-up.

## Procedure

### 1. Classify fresh start or resume

Run a read-only preflight in the current worktree. Look only for unfinished Gobbi sessions in that worktree.

- If exactly one unfinished session exists, validate its version 5 `session.json`, version 3 `state.json`, worktree path, branch, settings, and current cursor. Resume it automatically with those settings.
- If none exists, continue as a fresh session.
- If more than one exists, ask for an explicit session path or offer a fresh session. Do not guess.
- If the user supplied an explicit session path, validate and use only that path.

After compact, clear, resume, rewind, or another runtime context boundary, append the newly observed runtime ID to `session.json.runtime.ids` only when distinct. Preserve the existing Gobbi session UUID. Use the record checkpoint command for the validated atomic update.

### 2. Resolve fresh-session settings

For a fresh session, show the defaults once and ask exactly: **"use defaults or customize?"**

The default iteration cap is three total passes for each productive step. The default role selections are:

| System | manager | leader | executor | evaluator | assistant |
|---|---|---|---|---|---|
| Claude | opus | opus | opus | opus | sonnet |
| Codex | gpt-5.6-sol | gpt-5.6-sol | gpt-5.6-sol | gpt-5.6-sol | gpt-5.6-sol |

The default Git policy is local publication, no issue, and no draft pull request. If the user customizes, resolve every changed value before any filesystem mutation. Planning remains enabled with a positive cap.

### 3. Create the isolated session

After the defaults decision:

1. Generate a Gobbi-owned UUID.
2. Derive the session branch from the active system, start date, and UUID.
3. Create one branch and worktree under the Git skill's safe worktree procedure.
4. Invoke [`record/scripts/session-record.sh`](../record/scripts/session-record.sh) `init` with the absolute session root, UUID, project, runtime system and ID, timestamp, branch, absolute worktree, repository data, and optional resolved-settings file.
5. Run the command's `verify` operation and reread `session.json` and `state.json`.

Initialization eagerly creates the configured iteration skeleton. Planning later supplies the locked task list to `scaffold-tasks`. The record skill and command own all schemas, directory mechanics, rendering, root containment, and atomic replacement; orchestration does not reproduce them.

### 4. Enter Ideation

Use a record-command transition patch to move the cursor from Configuration to Ideation DISCUSSION. Confirm the candidate state validates, then render only:

`step=<step> stage=<stage> iteration=<n> task=<task-or-none>`

Project the same cursor into the runtime-native task list. The projection cannot write back.

### 5. Run each productive step

Load the step adapter and run its four stages in order:

1. DISCUSSION locks the inputs, decisions, scope, and specialist contract for the iteration.
2. WORK follows [`workflow/dual-system-work.md`](workflow/dual-system-work.md).
3. EVALUATION follows [`workflow/evaluation.md`](workflow/evaluation.md).
4. RECORD follows [`workflow/record.md`](workflow/record.md).

The step adapters are:

| Step | Manager adapter | Specialist owner |
|---|---|---|
| Ideation | [`workflow/ideation.md`](workflow/ideation.md) | [`ideation/SKILL.md`](../ideation/SKILL.md) |
| Planning | [`workflow/planning.md`](workflow/planning.md) | [`planning/SKILL.md`](../planning/SKILL.md) |
| Execution | [`workflow/execution.md`](workflow/execution.md) | [`execution/SKILL.md`](../execution/SKILL.md) |
| Wrap-up | [`workflow/wrap-up.md`](workflow/wrap-up.md) | [`wrap-up/SKILL.md`](../wrap-up/SKILL.md) |

Use [`workflow/state-machine.md`](workflow/state-machine.md) for every verdict branch, iteration-cap branch, halt, return, and cursor advance. Update state before every visible transition.

### 6. Coordinate specialists

The role roster is fixed:

| Role | Ownership |
|---|---|
| manager | User relationship, authority, routing, assignment, and verification |
| leader | Ideation and Planning |
| executor | Ordered implementation tasks |
| evaluator | Fresh independent evaluation |
| assistant | Narrow research, record support, and bounded mechanical support |

In Claude Code, apply [`agent-teams.md`](agent-teams.md) when the capability is available. Otherwise use fresh specialists. Native Codex uses its native specialist mechanism and an ephemeral Claude command-line peer for opposite-system operations. In either runtime, the same assignment, evidence, and independence rules apply.

### 7. Handle failures and exhausted iterations

An unavailable system, timeout, malformed structured response, missing artifact, invalid package, or failed validator pauses the current stage. Surface the exact failure and recovery choices. A user-approved missing-system waiver is narrow, recorded as a material decision, and linked from the final outcome. It does not authorize any later iteration or step.

When an iteration cap is exhausted or evaluation returns FAIL, follow the state-machine user gate. Never add another pass or redirect the workflow without the user's decision.

### 8. Close through Wrap-up

Wrap-up is the final productive step, not a separate pipeline. After its PASS RECORD, verify its canonical artifacts and post-promotion tree. Then create verified local commits and execute only the configured Git finalization actions. Merge still requires explicit user authority.

Checkpoint the version 5 manifest with the final durable outcome and mark version 3 state complete. Display the full evaluated handoff, its durable path, and a factual receipt of actual commit, publication, merge, cleanup, branch, and worktree results. Do not alter the evaluated handoff merely to add that receipt.

### 9. Prove completion

Before declaring the session complete:

1. Run the record command's `verify` operation with the locked task list when applicable.
2. Confirm every productive step has a final PASS verdict and canonical artifact pointer, or the final outcome names the user-approved halt or abort reason.
3. Confirm every completed Execution task has verification evidence and a focused local commit.
4. Confirm every waiver and approved finding disposition is durable and linked.
5. Confirm the handoff's session body and durable-memory body match.
6. Confirm `state.json` and `session.json` carry the final state and outcome.

## References

- Transition rules and recovery: [`workflow/state-machine.md`](workflow/state-machine.md)
- Session command boundary: [`workflow/session-record.md`](workflow/session-record.md)
- Dual-system WORK contract: [`workflow/dual-system-work.md`](workflow/dual-system-work.md)
- Evaluation gate: [`workflow/evaluation.md`](workflow/evaluation.md)
- RECORD gate: [`workflow/record.md`](workflow/record.md)
- Delegation contract: [`delegation.md`](delegation.md)
- Persistent-team contract: [`agent-teams.md`](agent-teams.md)
- Git isolation and finalization: [`git/SKILL.md`](../git/SKILL.md)
- Operation scenarios, checks, and review entrypoint: [`scenarios.md`](scenarios.md), [`checklists.md`](checklists.md), [`evaluation.md`](evaluation.md)
