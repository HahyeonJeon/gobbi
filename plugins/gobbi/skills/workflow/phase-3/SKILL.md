---
name: phase-3
description: "Workflow Phase 3 evaluates the actual Memory closure, records PASS evidence, commits and merges the accepted result, and returns one factual note."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
user-invocable: false
---

# Workflow Phase 3

Workflow Phase 3 adapts Wrap-up to Workflow by materializing and evaluating durable Memory before Git
integration, then committing, merging into the base branch, and returning one Note. Use it after the verified
Phase 2 Hand-off activates `P3 · Wrap-up` or recovery selects unfinished Phase 3 work.

## Principles

### Freeze the terminal mutation boundary

Memory changes and the complete closure tree freeze before evaluation. Git integration begins only after the
actual pre-Git result earns PASS and RECORD is complete.

### Evaluate the actual closure

Evaluators judge applied Memory, accepted task commits, checks, and the planned base merge. An intended or
draft result is not the evaluation subject.

### Report final integration together

One response-only Note records the accepted work, Memory, verification, Git states, and recovery evidence for
every terminal result. It is produced after the last completed or attempted action and never becomes part of
the tracked closure.

## Rules

- **MUST enter through the parent route with a verified Phase 2 Hand-off and exactly one Phase 3 item active.**
  Return to recovery when tasks, authority, branch, worktree, TODO, or evidence disagree.
- **MUST apply the parent's [shared productive-step cycle](../SKILL.md#14-apply-the-shared-productive-step-cycle)
  and fast two-iteration gate to the actual closure.** Apply Gobbi's finding gate through the parent; only PASS
  continues to Git integration.
- **MUST prohibit Git integration before EVALUATION and RECORD accept the frozen closure tree.** Any tracked
  mutation after freeze returns to WORK and repeats the complete review.
- **MUST use [Wrap-up](../../wrap-up/SKILL.md) and its [Note template](../../wrap-up/templates/note.md) without
  copying their procedure or schema.** This child supplies Workflow inputs, gates, records, transitions, and
  terminal checks, and routes every terminal state to the Note.
- **MUST commit every closure-owned change and merge the accepted work head into the configured base branch.**
  Retain the work branch and worktree with exact recovery evidence when either action fails.
- **NEVER report an intended, deferred, failed, or unproved Memory or Git action as completed.** Build every
  terminal claim from current artifact, Git, and filesystem evidence.

## Procedure

### Phase 1 — Freeze Closure

#### 1.1 Enter and inventory accepted work

- Confirm the parent and its owner-skill register, Phase 2 Hand-off, active Wrap-up TODO, accepted Ideation and
  Planning results, every Execution task and focused commit, checks, evaluations, findings, decisions, waivers,
  amendments, exclusions, risks, and unresolved items.
- Load [Wrap-up](../../wrap-up/SKILL.md). Resolve UUID, immutable base commit, current base branch and head,
  bound base checkout and status, session branch and head, absolute worktree, stable closure assignment ID,
  project Memory root, complete Git state, and current commit and merge authority from direct evidence.
- Read current Memory, the [Note template](../../wrap-up/templates/note.md), repository checks, and Git state.
  For protected changes, an active writer, unsupported completion, unresolved material decisions, wrong-tree
  evidence, or missing authority, stop before WORK and continue to Step 3.3 with exact evidence.

#### 1.2 Supply Workflow's Wrap-up inputs

- Build the assistant brief through [Delegation](../../delegation/SKILL.md) and
  [parent Step 1.3](../SKILL.md#13-build-and-accept-specialist-assignments). Apply Wrap-up Phase 1 with these
  fixed properties:

| Property | Workflow value |
|---|---|
| Session root | Full parent Step 1.2 evidence root. |
| Project memory root | Current project's bounded `.gobbi/projects/{project}/memory/` root. |
| Base branch | Configured local base branch from the verified Workflow configuration. |
| Git state | Exact repository, base, branch, worktree, accepted heads, and current status from the verified session contract. |
| Git authority | Current authority to commit closure changes and merge the session head into the base branch. |

- Freeze the Memory review boundary, verification, accepted task commits, exact pre-Git evidence, base-merge
  plan, exclusions, risks, and recovery state.
- Claim no commit or merge outcome before Phase 3 proves it. The Note is response-only and outside the frozen
  evaluation subject.

### Phase 2 — Materialize and Evaluate

#### 2.1 Reconcile and freeze durable Memory

- Invoke parent WORK with local role `assistant`, accepted Workflow evidence as the frozen subject, and the
  Memory candidate as output. The assistant self-reviews and synthesizes policy-selected drafts.
- Give one authorized assistant the synthesis, exact Memory root, allowed and protected paths, and checks.
  Apply Wrap-up Phase 2 through [Memory](../../memory/SKILL.md); every other process remains read-only.
- Verify every changed and related retained Memory path, CRUD decision, index, link, and the complete worktree
  diff. Reject stacked session records, stale facts, needless fragments, and unexplained duplicates, then freeze
  the actual pre-Git tree, task commits, checks, heads, authority, risks, and recovery before EVALUATION.

#### 2.2 Evaluate and record the actual closure

- Complete parent EVALUATION over the actual pre-Git tree, Memory diff, task commits, checks, base-merge plan,
  authority, exclusions, risks, and recovery paths.
- Apply the parent fast gate and RECORD schema. Seal reports, source evidence, Memory verification, tree identity,
  checks, decisions, findings, Git authority, and retained recovery state.
- On first-pass REVISE, create iteration 2 at DISCUSSION and repeat the complete cycle. On second-pass FAIL,
  preserve the branch, worktree, evidence, and recovery choices, then continue to Step 3.3; on PASS, retitle
  Wrap-up to PASS and keep it active until RECORD completes.

#### 2.3 Recover a failed participant

- Preserve the last valid evidence and identify the exact failed system, assignment, operation, and check. Use
  [Partner](../../gobbi/partner/SKILL.md) to classify a failed external run.
- Retry only the failed bounded operation when safe. Replace a stale specialist under Workflow's
  [`gobbi/agent-teams`](../../gobbi/agent-teams/SKILL.md) policy and continue only after the output validates.
- Use a single-system waiver only when existing authority names the system, productive step, and iteration.
  Any tracked mutation returns to Step 2.1 and repeats the complete review.

### Phase 3 — Commit, Merge, and Note

#### 3.1 Revalidate the PASS subject

- Reread closure evidence, reports, records, task commits, current tree, branch and worktree state, base head,
  checks, authority, and the active PASS item.
- Require the current tracked tree to equal the evaluated tree. Confirm every accepted task change is committed
  and each remaining tracked change is closure-owned; otherwise return to the responsible Wrap-up step.

#### 3.2 Commit and merge the closure

- Apply Wrap-up Steps 3.1 through 3.3 while using [Git](../../git/SKILL.md) preferences. Commit every remaining
  closure-owned change on the work branch, then merge the exact accepted work head into the configured base
  branch.
- Recheck branch, worktree, base head, work head, clean state, and authority immediately before each mutation.
  Reject a base head or tree that differs from the frozen evidence. Never resolve a conflict or change the
  accepted tree inside Wrap-up.
- Prove the closure commit tree and resulting base tree equal the evaluated closure tree. On failure, record
  the bound base checkout state and retain every surviving branch and worktree with the exact failed action
  and first safe recovery command.

#### 3.3 Return the Note and terminate

- Enter after successful integration or any terminal stop in Phases 1 through 3. Apply Wrap-up Step 3.4 and
  render the [Note template](../../wrap-up/templates/note.md) as the response body with the accepted context,
  result, Memory, verification, Git states, concerns, and recovery evidence.
- Verify the Note, TODO, commits, base merge, branch, worktree, and recovery command against direct evidence.
  Complete `P3 · Note` only when they agree.
- Leave no next TODO and end Workflow. A failed integration ends at an exact recoverable state rather than a
  false completion claim.

## References

| Name | Description |
|---|---|
| [Parent Workflow](../SKILL.md) | Owns shared Workflow contracts, participant gates, records, and terminal routing. |
| [Wrap-up](../../wrap-up/SKILL.md) | Owns durable Memory closure, commit, base-branch merge, Note delivery, and recovery. |
| [Note template](../../wrap-up/templates/note.md) | Defines the response-only development, research, or work Note. |
| [Memory](../../memory/SKILL.md) | Owns durable memory selection, category routing, and verification. |
| [Git](../../git/SKILL.md) | Supplies commit, integration, retained-state, and recovery preferences; Wrap-up owns the ordered Git actions. |
