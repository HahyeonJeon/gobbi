---
name: git
description: "MUST load when work needs an isolated branch and worktree, a focused local commit, publication, merge, or recovery."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Git

Use this skill for the Git lifecycle of one session. It creates or recovers one isolated branch and worktree,
keeps an ordered local history of focused verified commits, and either retains that recovery path or performs
only the external and destructive actions the supplied contract and the user authorize.

The caller supplies one session contract with five properties: proved identity, an immutable base commit, a
registered worktree outside the main checkout, declared publication intent, and the required repository layout.
The manager owns session-level setup, acceptance, publication, merge, cleanup, and recovery. Any
assignment-named writer role, including an assistant, owns only the writes and local commit that its focused
assignment grants.
[`conventions.md`](conventions.md) owns deterministic formats.

## Principles

### Keep one identity and one isolated writer history

One session tuple identifies one session branch and one linked worktree. Every accepted commit extends that
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
- **MUST bind every session to one proved contract, immutable identity tuple, base commit, branch, and isolated
worktree.** Generate the full UUID before deriving the branch and leaf separately, preserve the original UTC
session-start date and normalized slug when applicable, and never create a per-task worktree.

<a id="g-2"></a>
- **MUST resolve every write against the validated fully expanded worktree path and keep one ordered writer
chain, allowing one user-approved bootstrap of the contract's required layout and its ignore file in the main
checkout before the session worktree exists.** Use `git -C <absolute-worktree>` for Git commands, revalidate
after context boundaries, never use `git stash` to compare or preserve work, and commit that bootstrap before
capturing the immutable base commit.

<a id="g-3"></a>
- **MUST create focused verified commits through the writer role the contract authorizes.** Stage only
assignment-owned paths, inspect the staged diff, attach the canonical provenance trailer, and reread the
commit before manager acceptance.

<a id="g-4"></a>
- **MUST separate local commits from publication, merge, cleanup, and configuration authority.** Perform only
what the declared publication intent authorizes, and retain local objects unless a separate explicit Git
operation receives current user authority.

<a id="g-5"></a>
- **MUST recheck mutable Git and GitHub evidence immediately before every dependent action and retain an exact
recovery path on failure or ambiguity.** Resume from the first unproved action and report completed, deferred,
failed, not-configured, and retained states literally.

<a id="g-6"></a>
- **NEVER force-push, hard-reset, mass-restore, rewrite published history, force-remove a worktree, delete
unproved unique work, or modify Git or runtime configuration without exact user authority.** The sole narrow
exception is post-squash local `git branch -D` after direct proof that the branch was the confirmed merged
pull-request head.

## Procedure

### Phase 1 — Bind and Prove the Session Contract

#### 1.1 Validate the supplied session contract

- Require exactly one session contract from the caller before any write. The contract must carry these five
  properties, each provable from direct evidence. Where the caller obtains each property is outside this
  operation:

| Property | What it must be |
|---|---|
| Proved identity | One runtime, original UTC session-start date, full session UUID, and normalized slug for a new identity. New names match that tuple; a legacy identity has no slug and retains its legacy names. The UUID matches every agent-authored commit trailer on the branch. |
| Immutable base commit | One commit hash the caller confirmed before the branch existed, still resolvable in this repository, and unchanged for the whole session. |
| Isolated worktree outside the main checkout | One absolute path resolving outside the main checkout, in whichever lifecycle state the table below matches. |
| Declared publication intent | One named external outcome — local retention, push, or pull request, with any issue action stated separately — declared before work and bounding every later external action. |
| Required layout | The set of repository paths that must exist, each path's required tracked-or-ignored state, and the ignore-rule content that achieves that state. The caller supplies all three; this operation verifies them and invents no path and no rule. |

- Outside the main checkout means the path is not the main worktree root and the required layout keeps it
  ignored there, so the main checkout never tracks it even when it sits under the repository root.
- The worktree property has two lifecycle states, because a session cannot prove a registered worktree before
  that worktree exists. Every contract is in exactly one state:

| Lifecycle state | What the worktree property must be | Where it is proved |
|---|---|---|
| Fresh | The intended absolute path, plus the runtime system, original UTC session-start date, normalized slug, and full UUID from which `conventions.md` derives the new branch and leaf separately. Nothing exists at the path, and no worktree is registered there or to that branch. | Step 2.1 proves that absence, creates the branch and worktree, and upgrades the property to the registered form before the first write. |
| Recovery | One absolute path that `git worktree list` already reports as registered to that exact branch. | This step, directly, before any write. |

- Reject a missing, null, relative, main-checkout, mismatched, or symbolic-link-escaped worktree path in either
  state. For a recovery contract, confirm `git -C <absolute-worktree> rev-parse --show-toplevel` equals the
  contract path before the first write and after any context boundary. For a fresh contract, run that same
  confirmation immediately after Step 2.1 creates the worktree and after any later context boundary.
- On resume, take the retained branch or worktree from current caller, session, and registered-worktree
  evidence and rebuild the contract through Step 1.2. Ask the user only when that evidence is missing,
  ambiguous, or conflicting; never search for a convenient alternative session. A rebuilt contract is always
  in the recovery state.
- Parse the supplied branch and worktree leaf separately through the new or legacy validators in
  [`conventions.md`](conventions.md). Require both to return one matching identity. For a new identity, require
  exact runtime, date, slug, and UUID equality. For a legacy identity, require exact runtime, date, and UUID
  equality with `slug: not-applicable`. Reject a mixed new/legacy pair, changed tuple, parse ambiguity, or
  same-UUID competing branch, worktree, or session evidence.
- Evidence is the contract source, lifecycle state, identity tuple and matched format, base commit, branch,
  absolute worktree, registered worktree record once it exists, head, status, and declared publication
  intent.

#### 1.2 Rebuild an unproved contract from Git evidence

- Parse the named branch and worktree leaf separately against both permanent formats in
  [`conventions.md`](conventions.md). Confirm they produce one matching new tuple or one matching legacy
  identity, the named worktree is registered to that exact branch, and it remains outside the main checkout.
- Collect current branch, worktree registration, session evidence, commit trailers, and retained caller
  records before asking for a fact. Reject multiple plausible parses or roots and any evidence that associates
  the same UUID with a different runtime, date, slug, branch, worktree, or session leaf. Never rename an
  object, add a suffix, silently migrate a legacy identity, or create a second object for the UUID.
- Inspect first-parent history for the earliest contiguous agent-authored commit whose `AI-Provenance-Record`
  carries the same session UUID. Its parent is the base commit; before the first session commit, the current
  clean head is the provisional base.
- Recover the base branch and publication intent from unambiguous current repository, session, or caller
  evidence. Ask only for the first fact that is missing, ambiguous, or conflicting. Stop when manual commits,
  missing or malformed provenance, multiple plausible bases or intents, a dirty conflicting worktree, an
  identity mismatch, or another writer makes reconstruction ambiguous.
- Report the rebuilt contract, every evidence source used, any user-supplied missing fact, and the exact
  recovery point before work.

### Phase 2 — Create, Re-anchor, and Commit Local Work

#### 2.1 Probe posture and create one isolated worktree

- Enter this step only with a fresh contract, and continue only after the caller declares its publication
  intent. Inspect the current checkout, branch, head, status, configured worktree root, ignore rule, existing
  worktrees, and target branch/path before mutation.
- Verify the contract's required layout before recommending a base or creating anything. Create every required
  directory first, then check each path with `git check-ignore --no-index -v <path>` and compare the result
  against that path's required tracked-or-ignored state.
- Run the check in that exact form. Create before checking, because a directory-only pattern cannot match a
  path that does not exist on disk; pass `--no-index`, because the plain form silently skips an already-tracked
  path and reports it as not ignored; and write the path with no trailing slash, because a trailing slash
  changes which pattern matches an absent path.
- Stop when an ancestor ignore file ignores `.gobbi/`, and name the exact file and line `git check-ignore -v`
  reports. A nested `.gobbi/.gitignore` is never read and can re-include nothing, so this is not repairable
  from inside `.gobbi/`.
- Stop when a file is already tracked under a path the layout requires to be ignored, and list every such path.
  Detect it with `git ls-files -- <path>`, which must print nothing. `git check-ignore` cannot detect this
  case, because it answers whether a path would be ignored, not whether it is tracked. A file committed before
  the ignore rule existed reports as ignored and stays tracked. An ignore rule does not untrack a file, and
  `git rm --cached` is never automatic.
- Stop when a conflicting or partial ignore file already exists at the layout's path, report its exact bytes,
  and obtain the user's disposition. Never overwrite or append to that file.
- Stop when a required path component exists as a file or a symbolic link instead of a directory, and name the
  path and what it is.
- Repair any remaining mismatch only through the bootstrap [`G-2`](#g-2) allows: one user-approved write of the
  required layout and its ignore file in the main checkout, committed before the base commit is captured. Rerun
  the check after that commit.
- Recommend the current clean branch and head as the base. Ask the user when the checkout is dirty,
  detached, ambiguous, or conflicts with an existing target; do not silently exclude uncommitted work or
  invent `main`, `master`, `develop`, or a remote default.
- Run [`scripts/git-posture-probe.sh`](scripts/git-posture-probe.sh) for the local prerequisites every session
  requires. Probe remote and GitHub prerequisites only when the declared publication intent or a separate Git
  operation authorizes an external action.
- Generate the full session UUID before using [`conventions.md`](conventions.md). Normalize and validate the
  caller-supplied slug, retain the original UTC session-start date, then derive the new branch and worktree
  leaf separately from the same tuple. Confirm both equal the fresh contract's intended values. Before
  creation, search current branch, worktree, and session evidence for the UUID and reject any competing
  identity or occupied target. Create the branch and worktree once from the proved base, then verify the
  tuple, worktree root, branch, base commit, clean status, ignore posture, and unchanged main checkout.
- Upgrade the fresh contract's worktree property to the registered form from that `git worktree list`
  evidence. Every later step uses the upgraded contract; no write happens before the upgrade.
- If the same identity or target already exists, stop for recovery instead of adding a suffix, deleting it, or
  creating another worktree.

#### 2.2 Re-anchor the single writer

- Give every write-capable assignment its UUID, stable assignment ID, fully expanded absolute worktree,
  branch, allowlisted paths, protected paths, commit authority, and verification contract.
- Permit one write-capable assignment at a time. Read-only helpers may run in parallel but may not write to the
  worktree, Git objects, session records, or external systems.
- Authorize one named writer to write, verify, stage, and commit one locked unit of work. A second concurrent
  writer, an unnamed writer, or a unit the caller has not locked is not authorized.
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

- Enter only after the caller accepts the work it wants finalized, and finalize only what the declared
  publication intent covers. Local retention needs no network action; a push, pull request, merge, or cleanup
  the intent does not cover enters only as a separate explicit Git operation with a current subject and
  current user authority.
- Inventory the branch, base, head, accepted commits, provenance, worktree status, selected publication path,
  optional issue or pull request, remote refs, checks, merge association, and surviving objects.
- Return to the owning writer and create a new verified focused commit when authorized finalization-owned
  content is still uncommitted. A material mismatch with the accepted subject returns to the caller before
  external action.

#### 3.2 Complete local retention or declared publication

- For declared local retention, perform no network action. Verify the accepted local commits and retain the
  branch and worktree with their exact base, head, status, and first continuation command.
- For authorized push or pull-request publication, rerun the posture and remote checks, confirm the intended
  local head, push without force, and verify the remote ref equals that head. Stop and retain local recovery
  objects if the action is unavailable, declined, or fails.
- Create or reuse an issue only when the declared intent or a separate current authority includes that issue
  action. Issue failure never invalidates an otherwise authorized local, push, or pull-request result.
- For pull-request publication, query by exact head branch and repository. Reuse one open request with the
  matching head and base or create one through [`conventions.md`](conventions.md); stop on multiple or
  mismatched requests and retain the pushed branch.

#### 3.3 Gate merge and cleanup

- Ask for merge authority only after proving the exact open pull request, source branch, base branch, current
  head, green required checks, complete accepted commits, clean worktree, and the caller's stated completion
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

- Report the contract and UUID; base branch and commit; local commit hashes and verification; issue,
  push, pull-request, and merge authority and results; worktree and branch retained or removed states; exact
  blocker; and first recovery command.
- Distinguish `not configured`, `not authorized`, `not attempted`, `deferred`, `failed`, `completed`, and
  `retained`. Build every fact from direct evidence.
- Return the receipt to the caller that supplied the contract. Report only Git facts and invent no state,
  record, or artifact this operation does not own.

Completion is one verified local history plus either an exact retained recovery path or a fully evidenced,
authorized publication, merge, and cleanup result.

## References

- [Git conventions](conventions.md) owns deterministic branch, path, commit, trailer, issue, pull-request,
  label, and merge mappings.
- [Git posture probe](scripts/git-posture-probe.sh) owns the read-only runtime posture report.
