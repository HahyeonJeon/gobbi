---
name: git
description: Load when creating or operating a Gobbi session branch, worktree, local commit, publication, merge, or recovery.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Git

Use this skill for the Git lifecycle of one selected Gobbi orchestration mode. It creates or recovers one
isolated branch and worktree, keeps an ordered local history of focused verified commits, and either retains
that recovery path or performs only the external and destructive actions the active mode and user authorize.

Workflow supplies a durable manifest-backed Git contract. Cowork supplies a manifest-free contract locked in
the conversation and revalidated from direct Git evidence. The manager owns session-level setup, acceptance,
publication, merge, cleanup, and recovery; a leader or executor owns only the writes and local commit granted
by one assignment. [`conventions.md`](conventions.md) owns deterministic formats.

## Principles

### Keep one identity and one isolated writer history

One Gobbi UUID identifies one session branch and one linked worktree. Every accepted commit extends that
history through one ordered writer chain; a second writer or a fallback to the main checkout breaks isolation.

### Make local delivery the invariant

A clean verified local commit is required even when no remote, GitHub authentication, issue, push, or pull
request exists. Publication is a separate policy or user-authority layer, never a prerequisite for local work.

### Require authority before external or destructive action

Only the manager may perform an authorized network or cleanup action. Merge, history rewriting, destructive
abandonment, and configuration changes always require the exact current user authority this operation names.

### Prefer current evidence and recoverable stops

Git claims come from the objects and worktrees that exist now, not a report or remembered state. When evidence
is missing, stale, or contradictory, retain unique work and stop at an exact recovery path.

## Rules

<a id="g-1"></a>
### G-1 — Bind one isolated session identity

**MUST bind every session to one proved mode contract, Gobbi UUID, base commit, branch, and isolated
worktree.** Generate the UUID before deriving the branch or worktree, and never create a per-task worktree.

<a id="g-2"></a>
### G-2 — Validate every writer root

**MUST resolve every write against the validated fully expanded worktree path and keep one ordered writer
chain.** Use `git -C <absolute-worktree>` for Git commands, revalidate after context boundaries, and never use
`git stash` to compare or preserve work.

<a id="g-3"></a>
### G-3 — Commit one verified assignment

**MUST create focused verified commits through the role authorized for the selected mode.** Stage only
assignment-owned paths, inspect the staged diff, attach the canonical provenance trailer, and reread the
commit before manager acceptance.

<a id="g-4"></a>
### G-4 — Separate external authority

**MUST separate local commits from publication, merge, cleanup, and configuration authority.** Workflow
follows its persisted publication settings; Cowork retains local objects unless a separate explicit Git
operation receives current user authority.

<a id="g-5"></a>
### G-5 — Recheck evidence and retain recovery

**MUST recheck mutable Git and GitHub evidence immediately before every dependent action and retain an exact
recovery path on failure or ambiguity.** Resume from the first unproved action and report completed, deferred,
failed, not-configured, and retained states literally.

<a id="g-6"></a>
### G-6 — Reject destructive shortcuts

**NEVER force-push, hard-reset, mass-restore, rewrite published history, force-remove a worktree, delete
unproved unique work, or modify Git or runtime configuration without exact user authority.** The sole narrow
exception is post-squash local `git branch -D` after direct proof that the branch was the confirmed merged
pull-request head.

## Procedure

### Phase 1 — Bind and Prove the Session Contract

#### 1.1 Select and validate the mode-specific Git contract

- Read the active mode from the calling orchestration owner and bind exactly one contract:

| Mode | Identity source | Required Git facts | Publication source |
|---|---|---|---|
| **Workflow** | validated version 5 `session.json` plus version 3 `state.json` | session UUID, runtime system, configured base branch and commit, branch, absolute worktree, current cursor | `session.json.settings.git` |
| **Cowork** | conversation-locked contract plus direct Git evidence | mode, UUID, runtime system, start date, repository and project roots, base branch and commit, branch, absolute worktree, head, clean status | local retention until a separate explicit Git operation |

- Reject a missing, null, relative, main-checkout, mismatched, or symbolic-link-escaped worktree path. Confirm
  `git -C <absolute-worktree> rev-parse --show-toplevel` equals the contract path before the first write and
  after any context boundary.
- For Workflow resume, reuse the validated manifest identity and settings. For Cowork resume, require the user
  to name the retained branch or worktree explicitly and rebuild the contract through Step 1.2; never search
  other worktrees for an implicit active session.
- Evidence is the selected mode, contract source, UUID, base commit, branch, absolute worktree, registered
  worktree record, head, and status.

#### 1.2 Recover a manifest-free Cowork contract

- Validate the named branch against the session-branch format and extract its runtime prefix, start date, and
  UUID. Confirm the named worktree is registered to that exact branch and remains outside the main checkout.
- Inspect first-parent history for the earliest contiguous agent-authored commit whose
  `AI-Provenance-Record` contains the same Cowork UUID. Its parent is the Cowork base commit; before the first
  Cowork commit, the current clean head is the provisional base.
- Recover the base branch only from unambiguous repository evidence or a current user confirmation. Stop when
  manual commits, missing or malformed provenance, multiple plausible bases, a dirty conflicting worktree, a
  branch/path mismatch, or another writer makes reconstruction ambiguous.
- Treat independent evaluation as absent after recovery unless the current conversation proves the exact
  frozen subject and completed round. Report the reconstructed contract and exact recovery point before work.

### Phase 2 — Create, Re-anchor, and Commit Local Work

#### 2.1 Probe posture and create one isolated worktree

- For a fresh Workflow session, continue only after its settings decision. For a fresh Cowork session, inspect
  the current checkout, branch, head, status, configured worktree root, ignore rule, existing worktrees, and
  target branch/path before mutation.
- Recommend the current clean branch and head as Cowork's base. Ask the user when the checkout is dirty,
  detached, ambiguous, or conflicts with an existing target; do not silently exclude uncommitted work or
  invent `main`, `master`, `develop`, or a remote default.
- Run [`scripts/git-posture-probe.sh`](scripts/git-posture-probe.sh) for the local prerequisites required by
  every mode. Probe remote and GitHub prerequisites only when Workflow settings or a separate Cowork Git
  operation authorizes an external action.
- Generate the Gobbi UUID before using [`conventions.md`](conventions.md) to derive the branch and absolute
  worktree. Create them once from the proved base, then verify the worktree root, branch, base commit, clean
  status, ignore posture, and unchanged main checkout.
- If the same identity or target already exists, stop for recovery instead of adding a suffix, deleting it, or
  creating another worktree.

#### 2.2 Re-anchor the single writer

- Give every write-capable assignment its mode, UUID, stable assignment ID, fully expanded absolute worktree,
  branch, allowlisted paths, protected paths, commit authority, and verification contract.
- Permit one write-capable assignment at a time. Read-only helpers may run in parallel but may not write to the
  worktree, Git objects, session records, or external systems.
- Workflow authorizes an executor to write, verify, stage, and commit one planned Execution task. Cowork
  authorizes a leader to do so for one locked Ideation or Planning artifact set, or an executor to do so for
  one locked implementation unit.
- After a specialist report, the manager rereads the promised artifact or implementation, reproduces the
  relevant verification, checks the exact worktree path, and confirms the writer is no longer active before
  accepting the result or assigning the next writer.

#### 2.3 Create one focused verified commit

- After final-tree verification passes, inspect the unstaged diff and map every changed path to the locked
  assignment. Stop if unrelated user work cannot be separated safely.
- Stage only assignment-owned paths. Inspect the staged path list and full staged diff, construct the subject
  and provenance trailer through [`conventions.md`](conventions.md), and create the local commit.
- Reread the commit, confirm its tree contains the verified bytes, confirm the trailer uses the contract UUID
  and stable assignment ID, and confirm no assignment-owned change remains uncommitted.
- Specialists never push, merge, publish, clean up, delete branches, or alter configuration. Return the commit,
  verification evidence, post-commit status, retained objects, and any exact blocker to the manager.

### Phase 3 — Finalize Only the Authorized Path

#### 3.1 Freeze the pre-finalization evidence

- Workflow enters only after Wrap-up PASS RECORD and uses its evaluated handoff and persisted finalization
  plan. Cowork local retention needs no network action; any Cowork push, pull request, merge, or cleanup enters
  only as a separate explicit Git operation with a current subject and current user authority.
- Inventory the branch, base, head, accepted commits, provenance, worktree status, selected publication path,
  optional issue or pull request, remote refs, checks, merge association, and surviving objects.
- Return to the owning writer and create a new verified focused commit when authorized finalization-owned
  content is still uncommitted. A material mismatch with an evaluated or accepted subject returns to its
  orchestration owner before external action.

#### 3.2 Complete local retention or configured publication

- For Workflow `publication: local` and ordinary Cowork closure, perform no network action. Verify the accepted
  local commits and retain the branch and worktree with their exact base, head, status, and first continuation
  command.
- For authorized push or pull-request publication, rerun the posture and remote checks, confirm the intended
  local head, push without force, and verify the remote ref equals that head. Stop and retain local recovery
  objects if the action is unavailable, declined, or fails.
- Workflow creates or reuses an issue only when `createIssue: true`; issue failure never invalidates an
  otherwise authorized local, push, or pull-request result. A separately authorized Cowork issue action is
  likewise independent.
- For pull-request publication, query by exact head branch and repository. Reuse one open request with the
  matching head and base or create one through [`conventions.md`](conventions.md); stop on multiple or
  mismatched requests and retain the pushed branch.

#### 3.3 Gate merge and cleanup

- Ask for merge authority only after proving the exact open pull request, source branch, base branch, current
  head, green required checks, complete accepted commits, clean worktree, and the active mode's completion
  gate. Recheck all evidence after approval and immediately before merging.
- On conflict, changed head, failing check, dirty worktree, unavailable action, or withdrawn authority, stop.
  Resolve content only through an authorized writer, create and verify a new focused commit, then rebuild the
  gate and obtain authority for the new head.
- After a confirmed merge, fast-forward the base, recheck the exact worktree is clean and registered to the
  merged branch, remove it without force, prune metadata, and remove only its specific empty parent with
  `rmdir` when needed.
- Delete the remote branch when authorized and still present. Delete the local branch with `-d`; use the
  post-squash `-D` exception only after rechecking exact merged pull-request association. Verify every removed
  object is absent and stop with surviving objects if any proof fails.

### Phase 4 — Recover and Report

#### 4.1 Resume from current evidence

- For retained local work, deferred or failed publication, an open pull request, interrupted cleanup, or a
  context boundary, begin with a read-only inventory of the applicable contract source, local and remote refs,
  branch head, worktree registration and status, accepted commits, pull-request state and head, checks, merge
  association, and prior receipt.
- Protect every live or dirty worktree. Continue from the first unproved action, idempotently reuse proved
  external objects, and never delete an unmerged branch or unique edit merely because the session is stopping.
- For partial cleanup after confirmed merge, rerun the complete merge, liveness, cleanliness, and association
  evidence before each remaining destructive action.

#### 4.2 Emit the factual receipt

- Report the mode contract and UUID; base branch and commit; local commit hashes and verification; issue,
  push, pull-request, and merge authority and results; worktree and branch retained or removed states; exact
  blocker; and first recovery command.
- Distinguish `not configured`, `not authorized`, `not attempted`, `deferred`, `failed`, `completed`, and
  `retained`. Build every fact from direct evidence.
- For Workflow, append the receipt after the immutable evaluated handoff. For Cowork, return it after the
  conversation handoff or separate Git operation without inventing Workflow state or records.

Completion is one verified local history plus either an exact retained recovery path or a fully evidenced,
authorized publication, merge, and cleanup result.

## References

- [Git conventions](conventions.md) owns deterministic branch, path, commit, trailer, issue, pull-request,
  label, and merge mappings.
- [Git scenarios](scenarios.md), [checklist](checklists.md), and [evaluation entrypoint](evaluation.md) exercise
  both mode contracts without adding policy.
- [Workflow](../workflow/SKILL.md) owns its durable Configuration, routing, and finalization boundary.
- [Cowork](../cowork/SKILL.md) owns its user-led topic loop, evaluation call, conversation handoff, and explicit
  closure.
- [Execution](../execution/SKILL.md) owns implementation and final-tree verification before an executor commit.
- [Discussion](../discussion/SKILL.md) owns user decisions.
- [Session manifest schema](../record/schemas/session.schema.json) owns only the Workflow Git identity and
  publication shape.
- [Git posture probe](scripts/git-posture-probe.sh) owns the read-only runtime posture report.
