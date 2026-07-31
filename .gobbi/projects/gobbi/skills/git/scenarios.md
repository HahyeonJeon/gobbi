# Git Operation Scenarios

Seed scenarios for the [Git operation](SKILL.md). They exercise the parent rules without adding Git policy. Each case names an observable failure oracle, one design obligation, and a reserved item in [checklists.md](checklists.md).

## Set contract

- **Target:** one Workflow or Cowork session's branch, worktree, local commits, authorized publication, merge,
  cleanup, and recovery.
- **Consumers:** manager, leader, executor, Cowork, Workflow, Wrap-up, and independent evaluators.
- **Lifecycle:** reusable design and evaluation seed set.
- **Scope:** mode-contract binding through local retention or authorized finalization receipt.
- **Non-goals:** workflow routing, task implementation, handoff content design, and runtime peer work.
- **Stable IDs:** `GIT-FAMILY-{NN}`, `GIT-SCEN-{NN}`, and `GIT-CHECK-{NN}` are never renumbered.
- **Scale threshold:** split under an index above 12 families or 40 category-by-case cells.
- **Coverage gaps:** category 8 is not applicable because this operation has no locale-dependent input or user interface.

## Coverage register

| # | Category | Disposition | Covering families or property |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | selected | GIT-FAMILY-01, 02, 07, 08 |
| 2 | Actors / stakeholders / use-context | selected | GIT-FAMILY-01, 03, 04, 08 |
| 3 | Behavior / state / data | selected | GIT-FAMILY-01, 03, 05, 06, 08 |
| 4 | Interfaces / dependencies / structure | selected | GIT-FAMILY-01, 02, 05, 08 |
| 5 | Quality attributes / resource economics | selected | GIT-FAMILY-02, 06; external calls are bounded by configured actions and idempotent reuse |
| 6 | Failure / recovery / operations | selected | GIT-FAMILY-02, 04, 05, 06, 08 |
| 7 | Trust / harm / governance | selected | GIT-FAMILY-01, 04, 05, 08 |
| 8 | Inclusion / locale | n/a: no locale-dependent input, format, or interaction surface | No family |
| 9 | Change / compatibility / reversibility | selected | GIT-FAMILY-01, 05, 06, 08 |
| 10 | Evidence / traceability / clarity | selected | All families |

## Coverage matrix

| Family | Positive floor | Alternative-valid | Negative | Exact boundary | Failure / recovery | Adversarial | Change | Counterfactual |
|---|---|---|---|---|---|---|---|---|
| GIT-FAMILY-01 | 01 | n/a: one session identity class | n/a: wrong-root behavior is exercised by 03 | n/a: identity equality is exact, not numeric | n/a: conflict halts before mutation | 03 | 02 | n/a: UUID ownership is locked |
| GIT-FAMILY-02 | 04 | 05, 06 | n/a: unconfigured actions are exercised by 07 | n/a: publication is a closed enum | 07 | 07 | n/a: one v5 settings contract | n/a: settings are authoritative |
| GIT-FAMILY-03 | 08 | n/a: every task uses the same commit rule | n/a: unverified work is exercised by 09 | n/a: task path set is exact | n/a: failing verification stops before commit | 09 | n/a: plan supplies task order | n/a: verification evidence is direct |
| GIT-FAMILY-04 | 11 | n/a: one merge authority route | 10 | n/a: authority is binary | 11 | 10 | n/a: current head is rechecked by family 05 | n/a: user authority is not inferred |
| GIT-FAMILY-05 | 13 | n/a: standard and squash local deletion differ inside 13 | n/a: dirty cleanup is exercised by 12 | 12 | 12 | 14 | 14 | n/a: merge association is direct evidence |
| GIT-FAMILY-06 | 16 | n/a: local, deferred, and partial paths share retained recovery | n/a: destructive abandonment is exercised by 15 | n/a: recovery starts at first unproven action | 16 | 15 | 16 | n/a: current inventory disconfirms stale assumptions |
| GIT-FAMILY-07 | 17 | n/a: one receipt schema covers all publication policies | n/a: handoff mutation is exercised by 18 | n/a: receipt follows the evaluated body | n/a: missing facts remain explicit states | 18 | 18 | n/a: facts come from direct evidence |
| GIT-FAMILY-08 | 19, 21 | 20 | 22 | 23 | 20, 24 | 22, 24 | 20 | n/a: Cowork is explicitly manifest-free |

## Source register

| Parent rule | Scenario coverage |
|---|---|
| [G-1](SKILL.md#g-1) | 01, 02, 03 |
| [G-2](SKILL.md#g-2) | 01, 02, 03, 08 |
| [G-3](SKILL.md#g-3) | 03, 08, 09, 21 |
| [G-4](SKILL.md#g-4) | 04–07, 10, 11, 23 |
| [G-5](SKILL.md#g-5) | 07, 11–18, 20, 24 |
| [G-6](SKILL.md#g-6) | 03, 10, 12–15, 22, 24 |

## GIT-FAMILY-01 — Session isolation and resume

- **Primary category:** 4 Interfaces / dependencies / structure. The defining concern is the one-to-one session-to-branch-to-worktree relationship.
- **Secondary categories:** 1, 2, 3, 7, 9, 10.
- **Actor and outcome:** the manager creates or resumes the exact isolated session without touching another checkout.
- **Source and rationale:** G-1 and G-2 bind all writes to the Gobbi UUID and selected mode contract.
- **Applicability:** every Gobbi session.
- **Priority:** critical.
- **Adversarial face:** GIT-SCEN-03.

### GIT-SCEN-01

- **Primary type:** Positive. A fresh local-only session creates one isolated local delivery path.
- **Coverage role:** positive; categories 1, 3, 4, 10.
- **Actor:** manager.
- **Given:** a defaults decision, Gobbi UUID, local publication, configured base, clean repository, and no session worktree.
- **When:** Configuration derives and creates the session branch and worktree.
- **Then:** exactly one matching branch and worktree exist from the configured base; no remote or issue action occurs.
- **Failure oracle:** zero or multiple session worktrees, a runtime-ID branch, any network action, or a write in the main checkout.
- **Evidence tuple:** manifest fields, worktree porcelain output, branch head, status, and remote/issue action log.
- **Sources:** [G-1](SKILL.md#g-1), [G-2](SKILL.md#g-2), [G-4](SKILL.md#g-4).
- **Obligation:** fresh local-only Configuration must produce exactly one isolated local session without external prerequisites.
- **Check:** [GIT-CHECK-01](checklists.md#git-check-01).

### GIT-SCEN-02

- **Primary type:** Change. A runtime context boundary resumes the same Gobbi branch and worktree.
- **Coverage role:** change; categories 3, 4, 9, 10.
- **Actor:** manager.
- **Given:** one unfinished session in the current worktree and a newly attached runtime ID.
- **When:** the manager resumes after clear, compaction, rewind, or another context boundary.
- **Then:** the persisted UUID, branch, worktree, base, and settings remain unchanged; no second Git object is created.
- **Failure oracle:** the runtime ID replaces the UUID, the branch changes, or an additional worktree appears.
- **Evidence tuple:** before/after manifest identity, branch list, worktree list, and object counts.
- **Sources:** [G-1](SKILL.md#g-1), [G-2](SKILL.md#g-2).
- **Obligation:** resume must re-anchor to the existing session Git identity rather than recreate it.
- **Check:** [GIT-CHECK-02](checklists.md#git-check-02).

### GIT-SCEN-03

- **Primary type:** Adversarial. A writer uses a plausible canonical relative path or proposes a per-task worktree.
- **Coverage role:** adversarial; categories 3, 4, 7, 10.
- **Actor:** executor or manager.
- **Given:** the same tracked relative path exists in the main checkout and session worktree, or the next task begins.
- **When:** the writer supplies a path without the validated worktree prefix or tries to create another task branch/worktree.
- **Then:** mutation is rejected before writing; the main checkout remains clean and the existing session worktree remains the sole writer root.
- **Failure oracle:** any main-checkout byte changes, a second task worktree appears, or verification inspects a different tree than the write.
- **Evidence tuple:** resolved roots, before/after hashes and statuses, and worktree inventory.
- **Sources:** [G-1](SKILL.md#g-1), [G-2](SKILL.md#g-2), [G-3](SKILL.md#g-3), [G-4](SKILL.md#g-4).
- **Obligation:** cosmetic path validity or task boundaries must not bypass session-root isolation.
- **Check:** [GIT-CHECK-03](checklists.md#git-check-03).

## GIT-FAMILY-02 — Optional publication paths

- **Primary category:** 1 Purpose / outcomes / scope. The defining concern is executing only the configured local, push, pull-request, and optional issue outcome.
- **Secondary categories:** 4, 5, 6, 10.
- **Actor and outcome:** the manager finalizes the verified local result without hidden issue or remote coupling.
- **Source and rationale:** G-4 and G-6 make publication and issue actions independent settings.
- **Applicability:** every session finalization.
- **Priority:** critical.
- **Adversarial face:** GIT-SCEN-07.

### GIT-SCEN-04

- **Primary type:** Positive. Configured push publishes the verified branch and stops without a pull request.
- **Coverage role:** positive; categories 1, 4, 5, 10.
- **Actor:** manager.
- **Given:** `publication: push`, no issue, Wrap-up PASS, clean worktree, ready remote, and known head commit.
- **When:** finalization runs.
- **Then:** the remote session ref equals the local head; no issue or pull request is created; the unmerged worktree remains.
- **Failure oracle:** no push, a pull request appears, an issue is required, or the worktree is removed.
- **Evidence tuple:** settings, local and remote ref hashes, GitHub query, and worktree list.
- **Sources:** [G-4](SKILL.md#g-4).
- **Obligation:** push publication must perform exactly one configured remote branch action and retain unmerged recovery.
- **Check:** [GIT-CHECK-04](checklists.md#git-check-04).

### GIT-SCEN-05

- **Primary type:** Alternative-valid. Pull-request publication succeeds without an issue.
- **Coverage role:** alternative-valid; categories 1, 4, 10.
- **Actor:** manager.
- **Given:** `publication: pull-request`, `createIssue: false`, `draftPullRequest: false`, ready GitHub access, and a pushed session branch.
- **When:** the manager opens or reuses the request.
- **Then:** one open request has the exact head and base and no invented issue link.
- **Failure oracle:** creation is blocked for a missing issue, a duplicate request appears, or a fake issue number is used.
- **Evidence tuple:** settings, exact-head query, pull-request body, head/base hashes, and issue query.
- **Sources:** [G-4](SKILL.md#g-4).
- **Obligation:** a pull request must be valid and idempotent without issue identity.
- **Check:** [GIT-CHECK-05](checklists.md#git-check-05).

### GIT-SCEN-06

- **Primary type:** Alternative-valid. A newly created configured pull request is a draft.
- **Coverage role:** alternative-valid; categories 1, 2, 4, 10.
- **Actor:** manager.
- **Given:** pull-request publication, `draftPullRequest: true`, no matching existing request, and a pushed head.
- **When:** the manager creates the request.
- **Then:** the request is draft with the exact head/base and deterministic body; local commits and issue choice are unchanged.
- **Failure oracle:** the request is ready, draft settings suppress local delivery, or an issue is created implicitly.
- **Evidence tuple:** settings, creation command evidence, request state, body, and issue inventory.
- **Sources:** [G-4](SKILL.md#g-4).
- **Obligation:** draft state must be an independent pull-request creation option.
- **Check:** [GIT-CHECK-06](checklists.md#git-check-06).

### GIT-SCEN-07

- **Primary type:** Adversarial. A legacy-looking flow claims compliance by asking for an issue or remote before local work, or by reporting an unavailable external action as success.
- **Coverage role:** adversarial; categories 1, 5, 6, 10.
- **Actor:** manager or cosmetic implementation.
- **Given:** local publication or an issue/GitHub prerequisite failure.
- **When:** the implementation follows an old issue-first gate, falls back to the main checkout, or renders a planned push/PR as completed.
- **Then:** the operation rejects the flow, preserves the local branch/worktree, and records the external action as not configured, deferred, or failed.
- **Failure oracle:** local work is blocked by issue absence, main-tree work begins, or the receipt contains a false completed state.
- **Evidence tuple:** settings, action trace, branch/worktree inventory, exact external error, and receipt states.
- **Sources:** [G-4](SKILL.md#g-4).
- **Obligation:** cosmetic legacy compliance must fail when local-first semantics or truthful external states are absent.
- **Check:** [GIT-CHECK-07](checklists.md#git-check-07).

## GIT-FAMILY-03 — Focused verified task commits

- **Primary category:** 3 Behavior / state / data. The defining concern is the verified task diff becoming one traceable local history increment.
- **Secondary categories:** 2, 7, 10.
- **Actor and outcome:** the assigned executor commits only the locked task after fresh verification.
- **Source and rationale:** G-3 and G-5 define the ordered writer and local commit boundary.
- **Applicability:** every Workflow Execution task; Cowork role-bound commits are covered by GIT-FAMILY-08.
- **Priority:** critical.
- **Adversarial face:** GIT-SCEN-09.

### GIT-SCEN-08

- **Primary type:** Positive. One completed task becomes a focused verified local commit.
- **Coverage role:** positive; categories 2, 3, 10.
- **Actor:** executor.
- **Given:** an allowlisted task diff, passing final-tree verification, stable task ID, and unrelated paths absent or separable.
- **When:** the executor stages, inspects, and commits.
- **Then:** the commit contains only task paths, has the canonical provenance trailer, and matches the verified bytes.
- **Failure oracle:** an unverified, unrelated, missing, or wrong-tree path enters the commit, or the trailer identity is malformed.
- **Evidence tuple:** verification output, staged list and diff, commit tree, trailer, and post-commit status.
- **Sources:** [G-2](SKILL.md#g-2), [G-3](SKILL.md#g-3).
- **Obligation:** every planned task must leave a focused, verified, provenance-bearing local commit.
- **Check:** [GIT-CHECK-08](checklists.md#git-check-08).

### GIT-SCEN-09

- **Primary type:** Adversarial. A clean-looking report or staged diff substitutes for final verification.
- **Coverage role:** adversarial; categories 3, 7, 10.
- **Actor:** executor or manager accepting the commit.
- **Given:** a task report says checks passed, but the final-tree check was not run or now fails.
- **When:** the implementation tries to commit based on the report, an earlier run, or file presence.
- **Then:** commit creation or acceptance stops until fresh direct verification passes on the exact staged tree.
- **Failure oracle:** a commit is created or accepted with missing, stale, or failing final-tree evidence.
- **Evidence tuple:** command timestamps, subject/staged digest, exit status, and commit timestamp/tree.
- **Sources:** [G-3](SKILL.md#g-3).
- **Obligation:** cosmetic green status must not substitute for direct verification bound to the commit.
- **Check:** [GIT-CHECK-09](checklists.md#git-check-09).

## GIT-FAMILY-04 — Merge authority and readiness

- **Primary category:** 7 Trust / harm / governance. The defining concern is preventing an externally visible merge without current authority and readiness evidence.
- **Secondary categories:** 2, 6, 10.
- **Actor and outcome:** the manager merges only the exact approved, green, complete, clean request.
- **Source and rationale:** G-4 and G-5 make authority and current readiness conjunctive.
- **Applicability:** any session with a pull request considered for merge.
- **Priority:** critical.
- **Adversarial face:** GIT-SCEN-10.

### GIT-SCEN-10

- **Primary type:** Adversarial. A green or user-requested publication state is treated as implicit merge authority.
- **Coverage role:** adversarial; categories 2, 7, 10.
- **Actor:** manager.
- **Given:** an open pull request with green checks but no explicit merge approval, or approval for a different head.
- **When:** finalization reaches the merge decision.
- **Then:** no merge occurs; the exact branch, request, and worktree remain recoverable.
- **Failure oracle:** merge occurs based on configuration, old approval, issue closure, or green checks alone.
- **Evidence tuple:** decision record, approved head if any, pull-request state, and unchanged refs.
- **Sources:** [G-4](SKILL.md#g-4).
- **Obligation:** merge must stop without explicit authority for the current subject.
- **Check:** [GIT-CHECK-10](checklists.md#git-check-10).

### GIT-SCEN-11

- **Primary type:** Failure / recovery. Checks fail or the head changes after merge approval.
- **Coverage role:** failure/recovery; categories 3, 6, 7, 10.
- **Actor:** manager and authorized executor.
- **Given:** explicit merge approval followed by a failing required check or a changed pull-request head.
- **When:** the manager re-runs the merge gate.
- **Then:** merge stops; an authorized writer diagnoses, fixes, fully verifies, commits, and pushes before authority is sought against the new head.
- **Failure oracle:** merge uses stale approval/check evidence or a fix bypasses the focused verified commit path.
- **Evidence tuple:** before/after head hashes, check results, decision subject, fix commit, and re-verification.
- **Sources:** [G-4](SKILL.md#g-4).
- **Obligation:** a failed or changed merge subject must return to verified work and a fresh authority gate.
- **Check:** [GIT-CHECK-11](checklists.md#git-check-11).

## GIT-FAMILY-05 — Safe cleanup after confirmed merge

- **Primary category:** 6 Failure / recovery / operations. The defining concern is removing only a proven merged, clean, inactive session without losing work.
- **Secondary categories:** 3, 4, 7, 9, 10.
- **Actor and outcome:** the manager synchronizes, removes, prunes, and deletes the exact merged session objects safely.
- **Source and rationale:** G-5 and G-6 constrain every cleanup action.
- **Applicability:** post-merge finalization.
- **Priority:** critical.
- **Adversarial face:** GIT-SCEN-14.

### GIT-SCEN-12

- **Primary type:** Boundary. The cleanup gate distinguishes a clean worktree from one changed byte.
- **Coverage role:** boundary; categories 3, 6, 7, 10.
- **Actor:** manager.
- **Given:** a confirmed merged request and two otherwise identical worktrees, one clean and one with one uncommitted change.
- **When:** cleanup begins.
- **Then:** the clean worktree may proceed; the dirty worktree is retained with its exact status and no force removal or branch deletion.
- **Failure oracle:** the dirty tree is removed, its branch is deleted, or the one-byte difference is ignored.
- **Evidence tuple:** porcelain status, file diff/hash, worktree list, and branch refs before/after.
- **Sources:** [G-6](SKILL.md#g-6).
- **Obligation:** cleanup must fail closed at the exact clean-to-dirty boundary.
- **Check:** [GIT-CHECK-12](checklists.md#git-check-12).

### GIT-SCEN-13

- **Primary type:** Positive. A confirmed squash merge cleans up in the safe order.
- **Coverage role:** positive; categories 3, 4, 6, 9, 10.
- **Actor:** manager.
- **Given:** explicit merge authority, confirmed squash merge for the exact head branch, synchronized base, and clean session worktree.
- **When:** cleanup runs.
- **Then:** the worktree is removed without force, metadata is pruned, the remote branch is deleted, and the local branch uses `-D` only after the exact association proof.
- **Failure oracle:** branch deletion precedes worktree removal, force worktree removal occurs, association is absent, or another worktree path changes.
- **Evidence tuple:** merge association, base log, status, ordered action log, worktree list, and local/remote refs.
- **Sources:** [G-6](SKILL.md#g-6).
- **Obligation:** post-squash cleanup must use the ordered non-force path and narrow proven local `-D` exception.
- **Check:** [GIT-CHECK-13](checklists.md#git-check-13).

### GIT-SCEN-14

- **Primary type:** Adversarial. Cleanup state changes after preview but before action.
- **Coverage role:** adversarial; categories 3, 6, 7, 9, 10.
- **Actor:** concurrent session or manager.
- **Given:** a clean merged worktree at preview time.
- **When:** another actor changes the worktree, branch head, pull-request state, or registration before removal.
- **Then:** the immediate recheck detects the change, skips the destructive action, and reports the new state.
- **Failure oracle:** cleanup acts on the stale preview or a broad directory sweep touches another live session.
- **Evidence tuple:** two time-separated snapshots, mutation witness, action log, and surviving objects.
- **Sources:** [G-6](SKILL.md#g-6).
- **Obligation:** every destructive cleanup action must close its time-of-check/time-of-use window.
- **Check:** [GIT-CHECK-14](checklists.md#git-check-14).

## GIT-FAMILY-06 — Retained and interrupted recovery

- **Primary category:** 6 Failure / recovery / operations. The defining concern is preserving and resuming unique work when finalization cannot complete.
- **Secondary categories:** 3, 5, 7, 9, 10.
- **Actor and outcome:** the manager reports an exact recovery path and resumes from the first unproven action.
- **Source and rationale:** G-5 and G-6 make retention the safe default.
- **Applicability:** local publication, deferred publication, unmerged state, conflict, or partial external failure.
- **Priority:** critical.
- **Adversarial face:** GIT-SCEN-15.

### GIT-SCEN-15

- **Primary type:** Adversarial. A tidy final state is pursued by deleting an unmerged or deferred branch.
- **Coverage role:** adversarial; categories 6, 7, 9, 10.
- **Actor:** manager.
- **Given:** local publication, an open unmerged pull request, or a deferred external action with unique local commits.
- **When:** finalization stops.
- **Then:** branch and worktree remain; the report names path, head, status, blocker, and first recovery command.
- **Failure oracle:** either object is deleted, unique work becomes unreachable, or the report omits the exact recovery location.
- **Evidence tuple:** refs, worktree list/status, commit reachability, publication state, and receipt.
- **Sources:** [G-5](SKILL.md#g-5).
- **Obligation:** an unmerged or deferred session must remain exactly recoverable.
- **Check:** [GIT-CHECK-15](checklists.md#git-check-15).

### GIT-SCEN-16

- **Primary type:** Failure / recovery. Push, pull-request creation, merge, or cleanup stops after a partial prefix.
- **Coverage role:** failure/recovery; categories 3, 5, 6, 9, 10.
- **Actor:** manager.
- **Given:** an authorized sequence whose earlier action succeeded and later action failed or was interrupted.
- **When:** the session resumes.
- **Then:** a fresh inventory proves the completed prefix, reuses existing remote objects, and continues from the first unproven action without duplication.
- **Failure oracle:** a duplicate issue/PR appears, an already completed action is guessed rather than checked, or surviving state is discarded.
- **Evidence tuple:** action receipt, current local/remote refs, exact-head queries, worktree state, and resumed action log.
- **Sources:** [G-5](SKILL.md#g-5).
- **Obligation:** interrupted finalization must be idempotently resumable from direct current evidence.
- **Check:** [GIT-CHECK-16](checklists.md#git-check-16).

## GIT-FAMILY-07 — Handoff and receipt truth

- **Primary category:** 10 Evidence / traceability / clarity. The defining concern is separating the evaluated pre-finalization plan from actual later Git facts.
- **Secondary categories:** 1, 2, 3, 7, 9.
- **Actor and outcome:** the manager displays the evaluated handoff unchanged and appends a reproducible factual receipt.
- **Source and rationale:** G-5 defines the evidence boundary.
- **Applicability:** every session finalization.
- **Priority:** high.
- **Adversarial face:** GIT-SCEN-18.

### GIT-SCEN-17

- **Primary type:** Positive. The final response reports every Git object and configured action accurately.
- **Coverage role:** positive; categories 1, 2, 3, 10.
- **Actor:** manager and next-session reader.
- **Given:** an evaluated handoff and a completed or stopped finalization path.
- **When:** the final response is assembled.
- **Then:** the handoff body is unchanged and the appended receipt distinguishes all required action states with direct evidence and a recovery command when needed.
- **Failure oracle:** a configured action is omitted, a planned action is reported as actual, or the surviving branch/worktree cannot be found from the receipt.
- **Evidence tuple:** handoff hash, final response body, refs, worktree list, GitHub objects, and receipt fields.
- **Sources:** [G-5](SKILL.md#g-5).
- **Obligation:** final Git reporting must be complete, factual, and usable as the next recovery entrypoint.
- **Check:** [GIT-CHECK-17](checklists.md#git-check-17).

### GIT-SCEN-18

- **Primary type:** Adversarial. Later Git facts are inserted into the evaluated handoff to make the document look complete.
- **Coverage role:** adversarial; categories 3, 7, 9, 10.
- **Actor:** manager or cosmetic implementation.
- **Given:** the handoff was frozen before push, merge, or cleanup.
- **When:** finalization produces new facts.
- **Then:** the handoff hash stays unchanged and the facts appear only in the appended receipt.
- **Failure oracle:** either handoff copy changes, the copies diverge, or later facts are represented as evaluated content.
- **Evidence tuple:** pre/post hashes of both handoff bodies and final response boundary.
- **Sources:** [G-5](SKILL.md#g-5).
- **Obligation:** cosmetic completeness must not rewrite or overstate the evaluated handoff.
- **Check:** [GIT-CHECK-18](checklists.md#git-check-18).

## GIT-FAMILY-08 — Manifest-free Cowork lifecycle

- **Primary category:** 4 Interfaces / dependencies / structure. The defining concern is replacing Workflow
  manifest identity with a complete, recoverable Cowork Git contract.
- **Secondary categories:** 1, 2, 3, 6, 7, 9, 10.
- **Actor and outcome:** the manager creates, commits, retains, and recovers one Cowork history without
  Workflow records or weakened Git evidence.
- **Source and rationale:** G-1 through G-6 apply the same isolation and safety invariants through a different
  identity source.
- **Applicability:** every Cowork session.
- **Priority:** critical.
- **Adversarial face:** GIT-SCEN-22 and GIT-SCEN-24.

### GIT-SCEN-19

- **Primary type:** Positive. Fresh Cowork creates one manifest-free local session before tracked editing.
- **Coverage role:** positive; categories 1, 3, 4, 10.
- **Actor:** manager.
- **Given:** Cowork was explicitly selected, the current checkout is clean and attached, and the derived
  branch and worktree do not exist.
- **When:** the manager locks the inspected base, generates the UUID, and creates the session branch and
  worktree.
- **Then:** exactly one clean registered worktree exists at the deterministic absolute path, the main checkout
  is unchanged, publication is local retention, and no `session.json` or `state.json` was created.
- **Failure oracle:** setup writes a Workflow record, creates more than one worktree, uses a runtime ID, or
  edits the main checkout.
- **Evidence tuple:** Cowork contract, before/after status, worktree porcelain, branch head, path proof, and
  absence check for Workflow records.
- **Sources:** [G-1](SKILL.md#g-1), [G-2](SKILL.md#g-2), [G-4](SKILL.md#g-4).
- **Obligation:** Cowork must obtain full Git isolation without a Workflow manifest.
- **Check:** [GIT-CHECK-19](checklists.md#git-check-19).

### GIT-SCEN-20

- **Primary type:** Alternative-valid change. An explicit retained Cowork worktree resumes after a context
  boundary.
- **Coverage role:** alternative-valid, change, and recovery; categories 3, 4, 6, 9, 10.
- **Actor:** manager.
- **Given:** the user names one retained Cowork branch or worktree with contiguous canonical provenance.
- **When:** the manager reconstructs the UUID and base commit and revalidates branch, registration, head, and
  status.
- **Then:** the same objects are reused, no manifest or second worktree appears, and evaluation is treated as
  absent unless the conversation proves its frozen subject.
- **Failure oracle:** resume guesses another worktree, changes the branch, invents durable state, or trusts a
  stale evaluation.
- **Evidence tuple:** branch parse, provenance scan, earliest session commit parent, worktree inventory, status,
  and evaluation evidence.
- **Sources:** [G-1](SKILL.md#g-1), [G-2](SKILL.md#g-2), [G-5](SKILL.md#g-5).
- **Obligation:** Cowork recovery must come from the explicit retained path and direct history evidence.
- **Check:** [GIT-CHECK-20](checklists.md#git-check-20).

### GIT-SCEN-21

- **Primary type:** Positive. Cowork leaders and executors commit only their authorized assignment type.
- **Coverage role:** positive and exact boundary; categories 2, 3, 7, 10.
- **Actor:** leader or executor.
- **Given:** one locked Cowork assignment, absolute worktree, allowlist, verification contract, UUID, and stable
  assignment ID.
- **When:** the assigned writer completes and commits the work.
- **Then:** a leader commit contains only one accepted Ideation or Planning artifact set; an executor commit
  contains only one implementation unit; each carries matching provenance.
- **Failure oracle:** a leader changes implementation, an executor changes shaping authority, paths cross the
  allowlist, or provenance names another identity.
- **Evidence tuple:** assignment, role, staged diff, verification, commit tree, trailer, and manager reread.
- **Sources:** [G-2](SKILL.md#g-2), [G-3](SKILL.md#g-3).
- **Obligation:** fast Cowork cycles must preserve role and commit boundaries.
- **Check:** [GIT-CHECK-21](checklists.md#git-check-21).

### GIT-SCEN-22

- **Primary type:** Negative adversarial. Cosmetic Cowork setup bypasses isolation or creates hidden Workflow
  state.
- **Coverage role:** negative and adversarial; categories 3, 4, 7, 10.
- **Actor:** manager or writer.
- **Given:** the same relative file exists in main and worktree, or a helper proposes a minimal manifest for
  recovery.
- **When:** the path or hidden-state proposal is checked.
- **Then:** it is rejected before mutation; the exact worktree remains the only write root and Workflow-owned
  records remain absent.
- **Failure oracle:** any wrong-tree byte changes, hidden state appears, or the manifest becomes the effective
  Cowork router.
- **Evidence tuple:** before/after hashes, status, exact paths, rejected proposal, and record-absence check.
- **Sources:** [G-2](SKILL.md#g-2), [G-6](SKILL.md#g-6).
- **Obligation:** a manifest-free label must reflect real behavior, not cosmetic wording.
- **Check:** [GIT-CHECK-22](checklists.md#git-check-22).

### GIT-SCEN-23

- **Primary type:** Exact boundary. Cowork closure retains local objects and does not inherit Workflow
  publication settings.
- **Coverage role:** exact boundary; categories 1, 3, 7, 10.
- **Actor:** manager.
- **Given:** a clean completed Cowork branch and no separate Git-operation authority.
- **When:** Cowork closes.
- **Then:** no network, merge, cleanup, branch deletion, or worktree removal occurs; the receipt reports the
  retained branch, worktree, base, head, and recovery command.
- **Failure oracle:** Workflow settings are inferred, an external action occurs, or local recovery objects are
  removed.
- **Evidence tuple:** authority trace, action trace, refs, worktree inventory, and receipt.
- **Sources:** [G-4](SKILL.md#g-4), [G-5](SKILL.md#g-5).
- **Obligation:** Cowork publication and cleanup remain separate explicit Git operations.
- **Check:** [GIT-CHECK-23](checklists.md#git-check-23).

### GIT-SCEN-24

- **Primary type:** Failure / recovery adversarial. Cowork history cannot prove one base or one safe writer.
- **Coverage role:** failure, recovery, and adversarial; categories 3, 6, 7, 9, 10.
- **Actor:** manager.
- **Given:** manual commits interrupt canonical provenance, the base branch is ambiguous, the worktree is dirty
  with conflicting work, or another writer remains active.
- **When:** resume or reassignment is attempted.
- **Then:** mutation pauses, every object and unique edit is retained, and the user receives the exact
  ambiguity and safe recovery choices.
- **Failure oracle:** the manager guesses the base, discards edits, rewrites history, or starts another writer.
- **Evidence tuple:** provenance sequence, candidate bases, status/diff, writer state, object inventory, and
  recovery response.
- **Sources:** [G-5](SKILL.md#g-5), [G-6](SKILL.md#g-6).
- **Obligation:** manifest-free recovery must stop rather than fabricate missing identity.
- **Check:** [GIT-CHECK-24](checklists.md#git-check-24).

## Omission and trace sweep

Every parent rule G-1 through G-6 maps to at least one case in the source register. Every case maps to one
parent clause, one design obligation, and one checklist item. The mandatory fresh Workflow and Cowork local
sessions, configured publication, manifest-free recovery, role-bound commits, unauthorized merge, failing
checks, dirty worktree, post-squash cleanup, retained recovery, cleanup race, and cosmetic probes are explicit.
