# Git Evaluation Register

Unchecked source register for evaluating the [Git operation](SKILL.md) against the [Git scenarios](scenarios.md).

## Register contract

- **Mode:** evaluation coverage register.
- **Owner:** independent evaluator.
- **Consumer:** the active productive-step evaluation.
- **Run use-style:** `do-confirm`.
- **Source state:** every item below remains unchecked. Work a fresh filled copy for each run.
- **Source version:** the filled copy records this file's Git blob hash and review identity.
- **Trace count:** 18 checks map one-to-one to 18 scenario seeds and one or more parent rules.
- **Permitted terminal tokens:** `PASS`, `FAIL:<finding-id>`, or `n/a:<property>`.
- **Coverage closure:** all 18 rows have one terminal token with inspected evidence.
- **Acceptance:** every applicable row is `PASS`. Coverage closure alone is not acceptance.
- **Evidence rule:** a matching heading, setting, clean-looking status, or reported success is not enough without the named property and actual Git objects.

## Session isolation and resume

### GIT-CHECK-01

- [ ] **Criticality:** gate
- **Claim:** Fresh local-only Configuration creates exactly one branch/worktree from the configured base and performs no external action.
- **Applicability:** every fresh session with `publication: local` and `createIssue: false`; otherwise run as a seeded local-only probe.
- **Pass:** one manifest-matching branch and worktree exist, the base commit is correct, and issue/push/pull-request activity is zero.
- **Evidence:** version 5 manifest, worktree porcelain, branch log, status, and action trace.
- **On fail:** open a blocking isolation finding and stop acceptance because the session cannot guarantee local-only delivery.
- **Sources:** [G-1](SKILL.md#g-1), [G-2](SKILL.md#g-2), [G-6](SKILL.md#g-6), [GIT-SCEN-01](scenarios.md#git-scen-01).

### GIT-CHECK-02

- [ ] **Criticality:** required
- **Claim:** Resume preserves the Gobbi UUID, branch, worktree, base, and settings while attaching runtime identity separately.
- **Applicability:** resumed or context-boundary session; otherwise exercise the seeded before/after fixture.
- **Pass:** Git identity and object counts are unchanged and no second branch/worktree appears.
- **Evidence:** before/after manifests, branch list, worktree list, and heads.
- **On fail:** open an identity-drift finding and stop acceptance.
- **Sources:** [G-1](SKILL.md#g-1), [G-2](SKILL.md#g-2), [GIT-SCEN-02](scenarios.md#git-scen-02).

### GIT-CHECK-03

- [ ] **Criticality:** gate
- **Claim:** A relative/main-checkout path or per-task worktree attempt is rejected before mutation.
- **Applicability:** unconditional; use a non-mutating simulated bad-root and task-boundary probe when absent live.
- **Pass:** main-checkout hashes and status stay unchanged, one session worktree remains, and no write or extra worktree occurs.
- **Evidence:** resolved roots, before/after hashes/statuses, rejected command plan, and worktree inventory.
- **On fail:** open a blocking wrong-tree finding and stop acceptance because user work or session isolation is at risk.
- **Sources:** [G-1](SKILL.md#g-1), [G-2](SKILL.md#g-2), [G-3](SKILL.md#g-3), [G-11](SKILL.md#g-11), [GIT-SCEN-03](scenarios.md#git-scen-03).

## Optional publication paths

### GIT-CHECK-04

- [ ] **Criticality:** required
- **Claim:** Push publication produces an equal remote ref, no issue or pull request, and a retained unmerged worktree.
- **Applicability:** `publication: push`; otherwise select only when a safe isolated fixture is available.
- **Pass:** local and remote heads match, issue/PR counts do not change, and the worktree remains registered.
- **Evidence:** settings, local/remote ref hashes, GitHub query, and worktree list.
- **On fail:** open a publication-scope finding and stop acceptance.
- **Sources:** [G-4](SKILL.md#g-4), [G-6](SKILL.md#g-6), [G-7](SKILL.md#g-7), [GIT-SCEN-04](scenarios.md#git-scen-04).

### GIT-CHECK-05

- [ ] **Criticality:** gate
- **Claim:** Pull-request publication can open or reuse exactly one issue-free request with the exact head and base.
- **Applicability:** pull-request publication with `createIssue: false`; otherwise run the issue-free fixture.
- **Pass:** one matching request exists, no issue was invented, and repeated execution reuses the same request.
- **Evidence:** settings, exact-head/base query, request body, issue inventory, and rerun result.
- **On fail:** open a blocking optionality/idempotency finding and stop acceptance.
- **Sources:** [G-4](SKILL.md#g-4), [G-6](SKILL.md#g-6), [GIT-SCEN-05](scenarios.md#git-scen-05).

### GIT-CHECK-06

- [ ] **Criticality:** required
- **Claim:** `draftPullRequest: true` affects only a newly created configured pull request.
- **Applicability:** configured draft pull-request creation; otherwise exercise a command/body fixture without external mutation.
- **Pass:** the new request is draft, uses the exact head/base and template, and neither issue choice nor local delivery changes.
- **Evidence:** settings, command construction, request state/body, refs, and issue inventory.
- **On fail:** open a draft-setting finding and stop acceptance.
- **Sources:** [G-4](SKILL.md#g-4), [GIT-SCEN-06](scenarios.md#git-scen-06).

### GIT-CHECK-07

- [ ] **Criticality:** gate
- **Claim:** Issue-first, remote-first, main-tree fallback, and false completed-state implementations fail the local-first contract.
- **Applicability:** unconditional seeded adversarial probe.
- **Pass:** the probe is rejected, local objects remain recoverable, and unavailable external actions are labeled not configured, deferred, or failed.
- **Evidence:** settings, rejected flow, action trace, local object inventory, external error, and receipt.
- **On fail:** open a blocking legacy-flow false-pass finding and stop acceptance.
- **Sources:** [G-4](SKILL.md#g-4), [G-6](SKILL.md#g-6), [G-10](SKILL.md#g-10), [G-13](SKILL.md#g-13), [GIT-SCEN-07](scenarios.md#git-scen-07).

## Focused verified task commits

### GIT-CHECK-08

- [ ] **Criticality:** gate
- **Claim:** Every planned task commit contains only task-owned verified bytes and the canonical provenance trailer.
- **Applicability:** every completed Execution task.
- **Pass:** task allowlist, staged diff, commit tree, verification subject, stable task ID, and trailer all agree.
- **Evidence:** plan task, final verification output, staged path/diff evidence, `git show`, trailer parse, and status.
- **On fail:** open a blocking commit-integrity finding and stop acceptance.
- **Sources:** [G-2](SKILL.md#g-2), [G-3](SKILL.md#g-3), [G-5](SKILL.md#g-5), [GIT-SCEN-08](scenarios.md#git-scen-08).

### GIT-CHECK-09

- [ ] **Criticality:** gate
- **Claim:** A creator report, old check, file presence, or clean-looking staged diff cannot substitute for final-tree verification bound to the commit.
- **Applicability:** unconditional; use one stale/failing evidence probe if the live run is fully verified.
- **Pass:** the probe stops commit/acceptance, while the real commit cites fresh command results for the same subject or staged digest.
- **Evidence:** command timestamps, subject digest, exit statuses, staged digest, commit time/tree, and acceptance trace.
- **On fail:** open a blocking false-verification finding and stop acceptance.
- **Sources:** [G-3](SKILL.md#g-3), [GIT-SCEN-09](scenarios.md#git-scen-09).

## Merge authority and readiness

### GIT-CHECK-10

- [ ] **Criticality:** gate
- **Claim:** Merge does not occur without explicit user authority for the exact current pull-request head.
- **Applicability:** every pull request considered for merge; otherwise evaluate the seeded no-authority fixture.
- **Pass:** absence or mismatch of authority leaves the request, branch, and worktree unchanged and recoverable.
- **Evidence:** decision artifact, approved/current heads, pull-request state, refs, and worktree list.
- **On fail:** open a Critical authority finding and halt because an externally visible irreversible action was unauthorized.
- **Sources:** [G-5](SKILL.md#g-5), [G-8](SKILL.md#g-8), [G-10](SKILL.md#g-10), [G-11](SKILL.md#g-11), [GIT-SCEN-10](scenarios.md#git-scen-10).

### GIT-CHECK-11

- [ ] **Criticality:** gate
- **Claim:** A failing check or changed head after approval stops merge and returns fixes through focused commit and full re-verification.
- **Applicability:** merge path; inject or model one failing/check-changed state when the live request is green.
- **Pass:** merge is absent under stale evidence and any repair produces a new verified head before another authority gate.
- **Evidence:** head/check timeline, decision subject, merge query, repair commit, and verification results.
- **On fail:** open a Critical stale-gate finding and halt merge.
- **Sources:** [G-8](SKILL.md#g-8), [G-10](SKILL.md#g-10), [G-12](SKILL.md#g-12), [G-13](SKILL.md#g-13), [GIT-SCEN-11](scenarios.md#git-scen-11).

## Safe cleanup

### GIT-CHECK-12

- [ ] **Criticality:** gate
- **Claim:** One uncommitted worktree change stops removal and branch deletion without force.
- **Applicability:** every cleanup path; use a disposable fixture for the dirty boundary if the live worktree must remain untouched.
- **Pass:** clean state may proceed, dirty state retains worktree/branch and exact diff, and no force form runs.
- **Evidence:** clean/dirty status and hashes, action trace, worktree list, and refs.
- **On fail:** open a Critical data-loss finding and halt cleanup.
- **Sources:** [G-9](SKILL.md#g-9), [G-10](SKILL.md#g-10), [G-11](SKILL.md#g-11), [G-12](SKILL.md#g-12), [G-13](SKILL.md#g-13), [GIT-SCEN-12](scenarios.md#git-scen-12).

### GIT-CHECK-13

- [ ] **Criticality:** gate
- **Claim:** Confirmed squash cleanup synchronizes base, removes the clean worktree without force, prunes, then deletes remote/local branches with `-D` limited to exact association proof.
- **Applicability:** confirmed squash merge; otherwise exercise the ordered cleanup fixture without the live session.
- **Pass:** the action/evidence order is exact, unrelated worktrees are unchanged, and every removed object is proven absent.
- **Evidence:** merge association, base log, status, ordered commands, worktree inventory, refs, and unrelated-worktree hashes.
- **On fail:** open a Critical cleanup-order finding and halt remaining deletion.
- **Sources:** [G-9](SKILL.md#g-9), [G-11](SKILL.md#g-11), [G-12](SKILL.md#g-12), [GIT-SCEN-13](scenarios.md#git-scen-13).

### GIT-CHECK-14

- [ ] **Criticality:** gate
- **Claim:** Cleanup rechecks liveness, status, head, and merge association immediately before each destructive action.
- **Applicability:** every cleanup action; inject a time-of-check/time-of-use state change in a fixture.
- **Pass:** the changed object is skipped, new state is reported, and no broad shared-root deletion occurs.
- **Evidence:** preview and immediate snapshots, injected mutation, action/skip log, and surviving object inventory.
- **On fail:** open a Critical race/data-loss finding and halt cleanup.
- **Sources:** [G-8](SKILL.md#g-8), [G-9](SKILL.md#g-9), [G-12](SKILL.md#g-12), [GIT-SCEN-14](scenarios.md#git-scen-14).

## Retained and interrupted recovery

### GIT-CHECK-15

- [ ] **Criticality:** gate
- **Claim:** Local, deferred, open, or otherwise unmerged work remains reachable at an exact branch and worktree recovery path.
- **Applicability:** every non-merged terminal or stopped state; otherwise run the seeded unmerged fixture.
- **Pass:** branch/worktree remain, unique commits are reachable, and the receipt names path, head, status, blocker, and first command.
- **Evidence:** refs, worktree list/status, reachability, publication state, and receipt.
- **On fail:** open a Critical recovery/data-loss finding and stop acceptance.
- **Sources:** [G-10](SKILL.md#g-10), [G-11](SKILL.md#g-11), [GIT-SCEN-15](scenarios.md#git-scen-15).

### GIT-CHECK-16

- [ ] **Criticality:** required
- **Claim:** Partial external finalization resumes from current evidence without duplicate issues, requests, pushes, or destructive replay.
- **Applicability:** interrupted or failed external sequence; otherwise use a fixture with a completed prefix and failed suffix.
- **Pass:** current objects prove the prefix, already-complete work is reused, and only the first unproven action resumes.
- **Evidence:** prior receipt, current local/remote refs, exact-head queries, worktree state, and resumed action log.
- **On fail:** open an idempotency/recovery finding and stop acceptance.
- **Sources:** [G-6](SKILL.md#g-6), [G-10](SKILL.md#g-10), [G-12](SKILL.md#g-12), [G-13](SKILL.md#g-13), [GIT-SCEN-16](scenarios.md#git-scen-16).

## Handoff and receipt truth

### GIT-CHECK-17

- [ ] **Criticality:** required
- **Claim:** The receipt reports every configured Git action and surviving object from direct evidence with an exact recovery command when needed.
- **Applicability:** every final response.
- **Pass:** local commits, issue, push, pull request, merge, worktree, remote branch, and local branch each have an accurate explicit state.
- **Evidence:** evaluated handoff, final response, commit log, refs, worktree list, GitHub queries, and receipt.
- **On fail:** open a handoff-usability finding and stop acceptance.
- **Sources:** [G-5](SKILL.md#g-5), [G-7](SKILL.md#g-7), [G-14](SKILL.md#g-14), [GIT-SCEN-17](scenarios.md#git-scen-17).

### GIT-CHECK-18

- [ ] **Criticality:** gate
- **Claim:** Later Git facts appear only in the appended receipt and never mutate either evaluated handoff body.
- **Applicability:** every finalization that produces a post-evaluation Git fact; otherwise verify body identity at the no-op boundary.
- **Pass:** both handoff bodies retain their evaluated hashes and the receipt is structurally separate.
- **Evidence:** pre/post handoff body hashes, final response boundary, and later Git facts.
- **On fail:** open a blocking evaluated-subject-integrity finding and stop acceptance.
- **Sources:** [G-14](SKILL.md#g-14), [GIT-SCEN-18](scenarios.md#git-scen-18).

## Pilot expectations

A valid pilot includes:

1. a passing fresh local-only run;
2. configured push, issue-free pull-request, and draft-request paths or isolated command/object fixtures;
3. a resumed same-session run;
4. an unauthorized-merge refusal;
5. failing-check and changed-head refusal;
6. the exact clean-to-dirty cleanup boundary;
7. confirmed post-squash cleanup in a disposable repository;
8. a cleanup race that changes state after preview;
9. an unmerged/deferred recovery run;
10. a partial-prefix resume; and
11. cosmetic issue-first and handoff-mutation probes.

Coverage closes only after every selected row has inspected evidence. Acceptance remains false if any applicable gate or required row is not `PASS`.
