---
name: git
description: Load when creating or operating a Gobbi session branch, worktree, local commit, publication, merge, or recovery.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Git

Use this skill for the Git lifecycle of one Gobbi session. The operation creates one isolated branch and worktree after Configuration resolves settings, keeps every ordered Execution task in that worktree, requires focused verified local commits, and either retains the local recovery path or performs only the configured publication and user-authorized merge actions.

The manager owns session-level Git lifecycle and external actions. An assigned executor owns only the task-scoped worktree writes, verification, staging, and focused local commit authorized by its brief. [`conventions.md`](conventions.md) owns deterministic branch, path, commit, trailer, issue, and pull-request formats.

## Principles

### One session is one isolated writer history

The Gobbi session UUID, not a runtime context ID or issue number, identifies the session branch and worktree. Every planned task shares that worktree and extends one ordered local history. A second writer or a fallback to the main checkout destroys attribution.

### Local delivery is the invariant

A clean verified local commit is required even when no remote, GitHub authentication, issue, push, or pull request exists. Publication is a policy choice layered on top of the local result; it is not a prerequisite for doing the work.

### Authority precedes external or destructive action

Configured publication permits the named push or pull-request path. It does not authorize merge, history rewriting, destructive cleanup, or modification of user Git configuration. Merge always remains a user decision.

### Cleanup follows proof, never optimism

A worktree or branch is removed only after the exact pull request is confirmed merged, the base is synchronized, and the session worktree is clean. Unmerged or deferred work remains intact at an exact recovery path.

### Git evidence must describe the tree that actually exists

Branch, worktree, commit, push, pull-request, merge, and cleanup claims come from direct Git or GitHub evidence. The evaluated handoff states the authorized plan before finalization; a later factual receipt records what actually happened without rewriting the handoff.

## Rules

### G-1

Generate the Gobbi session UUID before deriving the branch or worktree. After the fresh-session defaults decision, create exactly one branch and one worktree for that session. Reuse both across all ordered Execution tasks. Do not create per-task worktrees.

### G-2

Resolve every write against the absolute `session.json.git.worktreePath`. A missing, null, mismatched, symbolic-link-escaped, or main-checkout path is an error. Never treat it as permission to write in the main checkout.

#### Worktree CWD discipline

Shell current working directories do not persist across all runtimes and tool boundaries. Use the validated absolute worktree path for every file write and `git -C <absolute-worktree>` for every Git command. Confirm `git -C <absolute-worktree> rev-parse --show-toplevel` equals the manifest path before the first write and after any context boundary. Do not use `git stash` to compare or preserve worktree state; use `git show`, `git diff`, or a separate explicitly authorized worktree.

### G-3

Keep one ordered worktree writer chain. Every planned Execution task produces a focused local commit only after its final verification passes. Stage only task-owned paths, inspect the staged diff, and attach the canonical `AI-Provenance-Record` trailer. Never push, merge, or clean up from an executor assignment unless a later manager-owned contract explicitly grants that distinct action.

### G-4

Treat `session.json.settings.git` as the publication contract:

| Setting | Meaning |
|---|---|
| `publication: local` | Create verified local commits and retain the unmerged branch and worktree. |
| `publication: push` | Create verified local commits and push the session branch. Do not open a pull request. |
| `publication: pull-request` | Create verified local commits, push the session branch, and open or reuse a pull request. |
| `createIssue: true` | Create or reuse an issue as an independent optional action. |
| `draftPullRequest: true` | Create a new configured pull request as a draft. It has no effect on local or push-only publication. |

An absent issue never blocks worktree creation, local commits, push, or pull-request creation. A pull request may have no linked issue.

#### Runtime git environment

Run [`scripts/git-posture-probe.sh`](scripts/git-posture-probe.sh) before a configured network action. The probe is read-only and reports unknown values honestly. Network and approval posture are runtime-owned; do not infer that push or `gh` will work from CLI presence alone. A blocked configured external action is reported and deferred unless the user separately authorizes a safe runtime change. Never edit `.git/config`, user Git configuration, Codex configuration, or Claude settings as an implicit remedy.

### G-5

Keep authority separated:

| Action | Normal owner | Required authority |
|---|---|---|
| Create session branch and worktree | manager during Configuration | resolved defaults/customization decision |
| Write, verify, stage, and commit one planned task | assigned executor | locked task brief |
| Create or update issue | manager | `createIssue: true` and available GitHub path |
| Push branch | manager | `publication: push` or `pull-request` |
| Open or reuse pull request | manager | `publication: pull-request` |
| Merge | manager | explicit user authority after the merge gate passes |
| Remove worktree and branches | manager | confirmed merge plus clean-tree cleanup gate |

No specialist may change scope, publication policy, or user authority.

### G-6

#### Prerequisites

Validate only the prerequisites required by the configured path:

- Every path requires a Git repository, the configured base branch, an ignored project worktree root, a unique session branch, and a writable Git/worktree posture.
- Push additionally requires a configured remote and runtime-approved network access.
- Pull-request publication additionally requires `gh`, authentication, repository access, and a usable remote.
- Issue creation additionally requires the same GitHub access, but issue failure does not invalidate a local, push, or pull-request result.

Recheck mutable prerequisites at the point of use. A missing external prerequisite defers that external action. It never causes a main-tree fallback or permits a false success claim.

### G-7

Run Git finalization only after Wrap-up PASS RECORD seals the evaluated handoff and promotion evidence. Before that boundary, create the task commits the plan requires but do not perform session publication, merge, cleanup, or final receipt claims.

### G-8

Merge requires all of these immediately before the merge command:

1. explicit user authority for this merge;
2. the pull request is open and points from the exact session branch to the configured base;
3. all required checks are green for the current pull-request head;
4. every planned task is complete with verified focused commits;
5. Wrap-up has PASS; and
6. the session worktree is clean.

Any failed or stale condition stops merge. A draft pull request is made ready only under the same manager authority; draft state never implies merge consent.

### G-9

After a confirmed merge, perform cleanup in this order: synchronize the configured base with a fast-forward-only update; recheck the session worktree is clean; remove that exact worktree without force; prune worktree metadata; then delete the remote and local session branches through the safe branch-deletion rules. Recheck merge association and liveness immediately before each destructive step.

For a normal merge, use `git branch -d`. A squash merge creates no ancestor relationship, so the narrow `git branch -D` exception is allowed only when pull-request association proves that the exact local branch was the head of the confirmed merged pull request. `-D` for a genuinely unmerged or unproven branch remains destructive and user-owned.

### G-10

If publication is local, publication is deferred, the pull request is open, merge is not authorized, merge is not confirmed, checks fail, or cleanup state becomes ambiguous, keep the session branch and worktree. Report their exact names, absolute path, head commit, current status, publication state, blocker, and first recovery command. Do not delete unique work merely because the workflow is stopping.

### G-11

Do not force-push, reset hard, mass-restore, rewrite published history, force-remove a worktree, delete an unmerged branch, close an unmerged pull request, delete an issue, or modify Git configuration without explicit user authority for that exact destructive action. Prefer additive commits, targeted read-only comparisons, standard worktree removal, and retained recovery paths.

The only non-user-gated force form is the exact post-squash local `git branch -D` exception in G-9 after direct merge-association proof.

### G-12

Treat cleanup and publication as time-of-check/time-of-use-sensitive. Re-read branch head, worktree registration, worktree status, pull-request head and state, check status, and merge association immediately before the dependent action. If the evidence changed, stop and rebuild the plan from the current state.

### G-13

Handle conflicts and partial external failure without hiding state. A base-sync or merge conflict returns to an authorized worktree writer for resolution and full re-verification. A failed push, issue operation, pull-request operation, merge, or cleanup records the exact completed prefix and leaves remaining objects intact. Re-running uses current evidence and idempotently skips already-complete actions.

### G-14

Keep the evaluated handoff immutable after Wrap-up evaluation. After finalization, append a factual receipt that distinguishes `not configured`, `not attempted`, `deferred`, `failed`, and `completed` for local commit, issue, push, pull request, merge, worktree removal, remote-branch deletion, and local-branch deletion.

### Prohibited shortcuts

- Do not require an issue for a branch, commit, push, or pull request.
- Do not publish merely because `gh` is installed or authenticated.
- Require Wrap-up PASS before the first finalization action.
- Do not use an idle notification, task-list state, or clean-looking summary instead of Git evidence.
- Do not remove a dirty or unmerged worktree to make the repository look clean.
- Do not use a recursively broad empty-directory deletion under the shared worktree root.

## Procedure

### 1. Bind the operation to the session manifest

Read the version 5 `session.json`, version 3 `state.json`, current branch, worktree registration, status, and configured base. Confirm the Gobbi session UUID, session branch, absolute worktree path, publication settings, issue/PR identities, and current workflow cursor agree.

For a resumed session, reuse the persisted settings and existing branch/worktree. Verify the current runtime context boundary was recorded by the manifest owner when required. Do not create another branch or worktree. For a fresh session, continue only after the manager reports the defaults/customize decision complete.

Evidence: manifest identity, `git worktree list --porcelain`, exact branch head, and worktree status.

### 2. Probe the required Git posture

Run the retained posture probe and inspect the local repository without mutation. Validate the configured base and worktree-root ignore rule. Determine which external prerequisites apply from the publication and issue settings; do not run GitHub checks for a local-only result unless issue creation is configured.

Classify each prerequisite as ready, unavailable, runtime-blocked, or not applicable. An unavailable GitHub path may defer only the actions that need it. A repository or worktree-isolation failure blocks session creation.

Evidence: probe output plus direct checks for each applicable prerequisite.

### 3. Create the session branch and worktree during Configuration

For a fresh session, derive the branch and worktree path through [`conventions.md`](conventions.md). Recheck the base and target path. Ensure neither the branch nor target worktree is already owned by another session.

For a configured remote publication path, fetch and fast-forward the configured local base before branching when the remote is ready. For a local-only path, use the inspected local configured base unless the user separately requests synchronization. Never make network availability an unstated local-session prerequisite.

Create the branch and worktree once from that configured base. Verify the resulting worktree root, branch, and clean status before Record initialization. If dependency installation is required by the project, treat it as a separate configured project action and preserve any lockfile change as explicit work; do not assume network access.

If a same-identity worktree already exists, stop for recovery evidence rather than creating a suffix or deleting it.

Evidence: exact branch, absolute worktree, base commit, worktree registration, and clean initial status.

### 4. Re-anchor every writer

Give each write-capable assignment the fully expanded absolute worktree and allowlisted paths. Before its first write, verify G-2. Permit only one writer at a time.

After a runtime context boundary or continued assignment, re-read the manifest and repeat the root check. A relative patch path, a path under the main checkout, or an unverified current directory blocks mutation.

Evidence: validated root and one active write-capable assignment.

### 5. Create each planned task commit

After a task's final-tree verification passes, inspect the unstaged diff and map every path to the locked task. Stage only those paths. Inspect the staged path list and full staged diff. Construct the commit message and provenance trailer through [`conventions.md`](conventions.md), then create the local commit.

Reread the commit, confirm its tree contains the verified bytes, and confirm no task-owned change remains uncommitted. Preserve unrelated user work and stop if it cannot be separated safely. Do not push from the executor path.

Evidence: verification command results, staged diff, commit hash, trailer, and post-commit status.

### 6. Freeze the pre-finalization state after Wrap-up PASS

After Wrap-up PASS RECORD, inventory the final task and promotion commits, branch head, worktree status, configured publication, optional issue/PR identity, and authorized finalization plan from the evaluated handoff. If the worktree has uncommitted finalization-owned content, create and verify the required focused local commit before any external action.

Any material mismatch with the evaluated plan returns to the owning workflow step. A factual change produced only by executing the authorized plan belongs in the later receipt.

### 7. Complete local publication

For `publication: local`, perform no network action. Verify the branch contains every required commit and the worktree status is clean or exactly records preserved unrelated user work that blocks finalization. Retain the branch and worktree under G-10.

Record the exact recovery path, head commit, configured base, and first continuation command. Local publication is complete when those facts are reproducible; absence of a remote is not a defect.

### 8. Push when configured

For `publication: push` or `pull-request`, re-run the applicable posture and remote checks. Confirm the local branch head is the intended head, then push that branch without force. Verify the remote ref resolves to the same commit.

If push is blocked, declined, or fails, stop the external sequence, keep the worktree and branch, and report the exact error and recovery action. Do not mark a pull request as attempted when its prerequisite push never succeeded.

Evidence: posture result, push command result, and equal local/remote ref hashes or exact deferral error.

### 9. Create an optional issue independently

When `createIssue` is false, record issue as not configured. When true, look for a session-associated existing issue before creating one. Use the optional issue format in [`conventions.md`](conventions.md), store the resulting identity through the manifest owner, and continue the configured publication path.

If issue creation fails, record the failure and continue a push or issue-free pull-request path when those actions remain authorized and possible. Never invent an issue number for branch naming or provenance.

Evidence: configured boolean, lookup result, created/reused identity or exact failure, and unchanged publication authority.

### 10. Open or reuse the pull request

For `publication: pull-request`, query by exact head branch and repository. Reuse one open pull request whose head and base match; otherwise create one from the deterministic template. Apply draft state only when `draftPullRequest` is true for a newly created request. Do not require or synthesize a linked issue section.

Verify the pull request head commit, base branch, state, URL, and optional issue association. If creation fails, retain the pushed branch and worktree and report recovery under G-10.

Evidence: exact-head query, request identity and state, base/head hashes, body, and retained worktree.

### 11. Gate and perform a user-authorized merge

Ask for merge authority after the complete G-8 evidence is current. The merge question states the exact pull request, head, base, check status, and cleanup consequence. Without explicit approval, keep the open pull request and worktree.

After approval, re-run the complete gate to close the time-of-check/time-of-use window. Merge using the project convention. Verify GitHub reports the exact pull request merged with a non-null merge timestamp and the remote base reports the merge result before entering cleanup.

On a conflict, changed head, failing check, dirty worktree, or withdrawn authority, stop. Resolve code only through an authorized writer, create a new verified commit, push it, and rebuild the gate.

Evidence: current authority decision, gate results, merge response, merge timestamp, and synchronized base result.

### 12. Clean up only the confirmed merged session

Synchronize the configured base with a fast-forward-only update. Re-read the session worktree status and require it to be clean. Confirm the worktree registration, branch head, and merged pull-request association again.

Remove the exact session worktree without `--force`. Prune worktree metadata. If a nested branch path left an empty parent, use `rmdir` only on that specific parent chain; never scan or delete the shared worktree tree.

Delete the remote session branch when it still exists. Delete the local branch with `-d` when Git recognizes the merge. For a verified squash merge only, use the G-9 `-D` exception after rechecking the exact branch-to-pull-request association. Verify each object is absent after its deletion.

If any check fails, stop at that point and report the surviving objects. Never force-remove the worktree or delete an unproven branch to finish the sequence.

Evidence: ordered action receipt plus post-action worktree and branch inventories.

### 13. Recover a retained or interrupted session

For resume, local publication, deferred publication, failed external action, or interrupted cleanup, start with a read-only inventory: manifest, branch head, local and remote refs, worktree registration and status, pull-request state and head, checks, merge association, and completed receipt actions.

Protect any live or dirty worktree. Continue from the first unproven action, not from a remembered step. If the branch is unmerged, retain it unless the user explicitly authorizes destructive abandonment. If the worktree is orphaned but contains unique commits or edits, surface the exact recovery choices; do not clean it automatically.

For partial cleanup after confirmed merge, re-run the G-9 and G-12 evidence before each remaining action. An already-absent object is idempotently complete only when its prior removal is supported by the current merged state.

Evidence: fresh inventory, proven completed prefix, retained unique work, and first safe recovery action.

### 14. Emit the factual finalization receipt

After the authorized path stops or completes, build the receipt from direct evidence. Report:

- local commit hashes and verification status;
- issue number or `not configured`, plus actual create/reuse/failure state;
- push remote and exact ref, or `not configured`/deferred/failure;
- pull-request number, URL, head/base, and draft/open/merged state, or `not configured`;
- merge authority and actual merge result;
- worktree path and retained/removed state;
- remote and local branch retained/removed state; and
- the exact recovery command when anything remains.

Append the receipt after the complete evaluated handoff. Do not edit the handoff body to make later Git facts appear pre-evaluated.

Completion evidence is one verified local history plus either an exact retained recovery path or a fully evidenced authorized publication, merge, and cleanup result.

## References

- [Git conventions](conventions.md) owns deterministic branch, path, commit, trailer, optional issue, pull-request, label, and merge-format mappings.
- [Git scenarios](scenarios.md), [checklist](checklists.md), and [evaluation entrypoint](evaluation.md) exercise this operation without adding policy.
- [Workflow](../workflow/SKILL.md) owns Configuration, workflow routing, user authority, and the post-Wrap-up finalization boundary.
- [Execution](../execution/SKILL.md) owns task implementation and final-tree verification before commit.
- [Wrap-up](../wrap-up/SKILL.md) owns the evaluated handoff and pre-finalization plan.
- [Discussion](../discussion/SKILL.md) owns user decision cards and merge-authority questioning.
- [Session manifest schema](../record/schemas/session.schema.json) owns the executable Git identity and publication-setting shape.
- [Git posture probe](scripts/git-posture-probe.sh) owns the read-only runtime posture report.
- [Recorded Git traps](mistakes.md) remains a required read before Git work.
