---
name: execution
description: MUST load for Execution. Implements one locked plan task through study, bounded change, fresh verification, and a focused local commit.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Execution

Use this skill for one ordered Execution task at a time. The executor studies the locked task and live tree, applies only the resolved change, proves it on the final tree, and creates one focused local commit.

This skill owns the executor method. The plan is the scope contract; the repository is the current implementation truth. Orchestration owns shared dual-system WORK mechanics, evaluator dispatch, record routing, and cursor transitions.

## Principles

### The plan is the contract, not a script

The executor must satisfy the task's observable outcome and constraints. Routine in-scope implementation judgment is allowed. Scope, architecture, destructive action, publication, and user decisions are not.

### Study before mutation

Read the complete affected surface, consumers, tests, conventions, and mistakes before editing. A change built from a guessed preimage is not controlled work.

### One writer, one bounded diff

Only the active-runtime executor mutates the worktree. Peer work and parallel investigation remain read-only. Every changed path maps to the current task.

### Fresh evidence closes the task

Verification runs after the final edit on the exact tree to be committed. A prior run, a plausible summary, or an executor's confidence is not completion evidence.

## Rules

### Must follow

- **X-1 — Execute one locked task.** Use its stable ID, objective, files, inputs, outputs, traces, authority, and acceptance criteria. Stop if the contract is not executable as written.
- **X-2 — Preserve user work.** Inspect status and diffs before editing. Do not overwrite, reset, clean, or absorb unrelated changes.
- **X-3 — Map the blast radius.** Read all affected callers, schemas, validators, manifests, docs, tests, examples, and runtime references before the first edit.
- **X-4 — Keep scope exact.** Every changed path and behavior maps to the current task. Surface adjacent work; do not implement it.
- **X-5 — Build bottom-up.** Establish interfaces and the smallest valid structure first, then grow one verified increment at a time.
- **X-6 — Keep related surfaces synchronized.** Code, tests, types, docs, examples, schemas, validators, manifests, migrations, and references change together when the task affects them.
- **X-7 — Preserve safety and reversibility.** Validate untrusted input, keep authorization before privileged work, bound retries and cost, and pause for destructive or one-way actions not already authorized.
- **X-8 — Verify with direct evidence.** Run the task's exact checks on the final tree, add targeted checks for discovered risk, and inspect the final diff and status.
- **X-9 — Commit locally and focus the commit.** Stage only task paths, inspect the staged diff, commit the verified change, and never push or merge unless a later manager-owned finalization authorizes it.
- **X-10 — Report exactly.** Return the stable task ID, status, commit, changed paths, commands, results, and concerns. Do not claim success for an unrun or failing check.

### Must not follow

- Do not start editing before the task, relevant files, rules, skills, and mistakes are read.
- Do not reinterpret a missing design decision as routine implementation judgment.
- Do not run a second worktree writer in parallel.
- Do not weaken a test, threshold, fixture, schema, or validator merely to make the result pass.
- Do not leave temporary logs, skipped tests, commented-out code, placeholders, or stale docs.
- Do not push, merge, delete a worktree, or rewrite user history.

## Procedure

### 1. Confirm the task and tree

Read the task in isolation. Restate its objective, reason, traces, in-scope and out-of-scope paths, inputs, outputs, checks, required skills, authority, and stop conditions. Inspect the absolute worktree, branch, status, current diff, and recent commits.

If the task conflicts with the live tree, user changes, or an upstream contract, return NEEDS_CONTEXT with exact evidence. Do not repair the plan silently.

Evidence: a task-to-tree preimage register and a clean ownership decision for every existing change.

### 2. Study the affected surface

Read each target file completely enough to understand its contract. Trace callers and consumers. Inspect adjacent conventions, tests, types, schemas, validators, manifests, documentation, examples, build paths, and relevant history. Load applicable language and tool skills plus their mistake companions.

Run CRUD and 5W1H over the entire affected set. For a move or deletion, freeze the semantic union and inbound references before changing the source.

Evidence: an affected-file map that explains why each path is read, changed, created, moved, or deleted.

### 3. Establish a failing or discriminating check

When the task fixes behavior, reproduce the failure before changing it. When the task is structural or documentary, construct a direct discriminating check that fails the stale state. Identify a cosmetic-compliance result and ensure the check rejects it.

If no check can distinguish correct from incorrect behavior, stop and repair the verification contract through the manager.

Evidence: a before-state failure or explicit preimage mismatch.

### 4. Prepare the neutral WORK contract

Freeze the task contract, worktree preimage, affected-file map, applicable references, checks, and constraints as identical inputs to the orchestration-owned dual-system WORK procedure. Both systems analyze the same task independently. Peer processes remain read-only.

The active-runtime executor synthesizes the implementation approach after both drafts and cross-reviews freeze. Record material design, scope, destructive, dependency, or authority disagreements and route them to the user before editing.

Evidence: a validated, decision-complete dual-system package.

### 5. Lay the smallest valid foundation

Create or settle the interfaces, directory shape, types, schemas, or document skeleton the task requires before filling behavior. Reuse project patterns and names. Keep the tree valid at each increment.

For a bug, fix the root cause that produced the failure chain. For a refactor, prove behavior preservation before deleting the old path. For documentation, update the owner and all affected consumers in the same task.

Evidence: a reviewable sequence of bounded changes, not one opaque rewrite.

### 6. Implement the resolved change

Apply only the synthesized, user-resolved approach. Keep inputs validated before privileged sinks. Make errors actionable. Define timeouts, retries, batching, cache behavior, cost ceilings, synchronization, migration, and rollback where applicable. Update tests and documentation with the behavior they cover.

After each increment, run the narrowest useful check. Stop if the change requires new scope, new authority, destructive recovery, or a protected user-file overwrite.

### 7. Verify the final tree

Run the task's exact verifies commands on the final tree. Add targeted regression, type, format, link, schema, security, performance, compatibility, and runtime checks where the changed surface requires them. Confirm tests actually ran and no check modified the tree to create its own pass.

Inspect old names, stale paths, skipped tests, debug output, placeholders, safety-bypass flags, unbounded external calls, sensitive logging, and unexpected generated churn. Re-run the direct discriminating check from step 3.

Evidence: fresh command lines, exit statuses, and relevant output from the final tree.

### 8. Inspect scope and consistency

Read the complete diff, not only the summary. Compare changed paths with the task allowlist and each diff hunk with an output or trace. Confirm related code, tests, types, docs, schemas, validators, manifests, migrations, examples, and runtime references agree.

Run [scenarios.md](scenarios.md) and a fresh copy of [checklists.md](checklists.md). Revert any unrelated edit only when it is known to be this task's own change; never discard pre-existing user work.

### 9. Create the focused local commit

Confirm the final verification still passes and the worktree contains only the intended task delta plus any preserved unrelated user change. Stage only task-owned paths. Inspect the staged diff and staged file list. Commit with the stable task ID and an accurate description.

Reread the commit and verify the branch contains it. Do not push. If committing would absorb unrelated work or miss an in-scope path, stop and report the conflict.

Evidence: commit hash, staged-diff review, and post-commit status.

### 10. Hand off for independent review

Return the required status contract with the canonical task artifact, commit, changed paths, checks, evidence, and any concern. The manager rereads the commit and routes two fresh evaluations. The executor does not accept its own work or apply evaluator findings before the user approves their dispositions.

On REVISE, start a complete new iteration from the current committed evidence and approved dispositions. Rebuild the full dual-system WORK package and final verification; do not patch the prior evidence in place.

Completion evidence: a task-scoped commit, fresh final-tree checks, complete dual-system creation evidence, and no unauthorized side effect.

## References

- [Orchestration Execution adapter](../orchestration/workflow/execution.md) owns per-task entry, user gates, and task transitions.
- [Dual-system WORK](../orchestration/workflow/dual-system-work.md) owns independent drafts, reciprocal reviews, decision handling, and package validation.
- [Delegation](../orchestration/delegation.md) owns the executor brief, authority boundary, and status contract.
- [Git](../git/SKILL.md) owns worktree safety, commit procedure, publication, and cleanup.
- [Coding](../coding/SKILL.md) owns language-agnostic construction quality; language skills add concrete idioms.
- [Evaluation](../evaluation/SKILL.md) owns the independent review method, causal findings, and verdict
  derivation. The active workflow adapter owns finding dispositions.
- [Record](../record/SKILL.md) owns task evidence, typed staging, and PASS-only artifacts.
