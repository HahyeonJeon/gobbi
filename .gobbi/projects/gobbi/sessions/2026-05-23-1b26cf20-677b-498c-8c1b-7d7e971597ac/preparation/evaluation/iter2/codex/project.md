## Artifact Summary + Memory reads

What: Preparation iter2 is the FAIL re-entry readiness draft for Bundle B, correcting the iter1 mirror-policy premise before Planning consumes the Preparation output. Why: iter1 failed because the user-locked "workspace canonical, mirror auto-syncs" policy was based on an incomplete directory-only scan; iter2 must correct that premise, preserve audit history, close the moot sync backlog, and clarify the 5-vs-7 workflow-doc ambiguity. How: the artifact applies five surgical fixes: supersede the iter1 mirror policy, create the accepted mirror-canonical symlink decision, close the sync-mechanism backlog as moot, update the D-4 design file with the corrected mirror reference, and add the excluded-files rationale for `evaluation.md` and `memorization.md`. Scope: T1 worktree-first session architecture and T3 PostToolUse hook/reconstructor under `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/artifacts/bundle-b-ideation-pass.md`; T2 and broader cleanup remain out of scope. Consumers: Planning leaders, T1/T3 executors, Wrap-up promotion, and later evaluators.

Memory reads: `preparation/rawdata/draft-iter2.md`; all five iter2 target staging files under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/`; `preparation/rawdata/draft-iter1.md`; `preparation/rawdata/sub-steps-a-d-iter1.md`; all iter1 Codex and Claude per-perspective files under `preparation/evaluation/iter1/{codex,claude}/`; project rule `.gobbi/projects/gobbi/rules/stub-redirect-format.md`; all eight listed project mistakes under `.gobbi/projects/gobbi/mistakes/`; `.agents/skills/evaluation/SKILL.md`; `.agents/skills/preparation/evaluation.md`; `.agents/skills/orchestration/workflow/evaluation.md`. Tool checks run: symlink count `53`; workflow dir count `7`; workflow dir contents `evaluation.md execution.md ideation.md memorization.md planning.md preparation.md wrap-up.md`; new decision file exists; superseded statuses verified; full staging file list verified.

## Locked Frame (Stage 1)

Scenario P1: The iter2 work solves the iter1 FAIL root cause.
- Check P1.1: The accepted policy matches the real symlink topology.
- Check P1.2: The superseded iter1 policy remains as audit history but no longer controls Planning.
- Check P1.3: The sync backlog is closed as moot, not left as a live future task.

Scenario P2: The work stays inside the iter2 surgical scope.
- Check P2.1: Changes map to the five requested fixes.
- Check P2.2: No unrelated project-memory cleanup is absorbed.
- Check P2.3: The Scope Contract for T1/T3 remains intact, with T2 deferred.

Scenario P3: 5-vs-7 workflow-doc ambiguity is actually removed.
- Check P3.1: The D-4 design file names the five loop docs.
- Check P3.2: It explicitly excludes `evaluation.md` and `memorization.md`.
- Check P3.3: It explains why sub-phase docs do not own a per-iter cadence.

Scenario P4 (adversarial): A corrected policy still creates a new Planning hazard.
- Check P4.1: Planning can brief the source-of-truth model without inheriting the false workspace-canonical premise.
- Check P4.2: Any remaining edit-method risk is routed to the owning perspectives rather than treated as a project-scope failure.
- Check P4.3: Out-of-scope Memory Access Matrix cleanup is acknowledged without being absorbed.

Rule coverage: `stub-redirect-format.md` is not applicable because iter2 supersedes session-staged decision/backlog artifacts, not published documentation stubs.

## Per-scenario per-check results

P1.1: Yes. `mirror-propagation-policy-mirror-canonical-symlinks.md` has `status: accepted`, cites `find .claude/skills/ -type l -name "*.md" | wc -l` -> 53, and states mirror canonical plus workspace symlink runtime layer.
P1.2: Yes. `mirror-propagation-policy-workspace-canonical.md` has `status: superseded`, `superseded_by: mirror-propagation-policy-mirror-canonical-symlinks.md`, and a `## Supersession reason` preserving the original body above the correction.
P1.3: Yes. `workspace-to-mirror-sync-mechanism.md` has `status: superseded`, a moot `superseded_by` explanation, and a `## Moot reason` stating the symlink layer is the sync mechanism.
P2.1: Yes. The iter2 draft enumerates the five fixes and the staging files match them.
P2.2: Yes. The Memory Access Matrix clarification is recorded under Out of scope gaps, not performed.
P2.3: Yes. T1/T3 remain in scope; T2 remains deferred.
P3.1: Yes. D-4 lists `ideation.md`, `preparation.md`, `planning.md`, `execution.md`, and `wrap-up.md`.
P3.2: Yes. D-4 has `## Excluded files + rationale (added iter2)` and names `evaluation.md` plus `memorization.md`.
P3.3: Yes. The rationale correctly says cadence belongs to loops whose MEMORIZATION emits the commit, not to cross-cutting sub-phase docs.
P4.1: Yes for project-scope purposes. The false workspace-canonical decision is superseded and the accepted policy states the corrected topology.
P4.2: Partial but not project-owned. A narrower edit-method hazard remains, assessed under Structure, Usage, Consistency, and Risk.
P4.3: Yes. The cleanup is explicitly out of scope and deferred as an informal follow-up.

## Iter1 finding dispositions

ID: COD-PROJ-PREP1-001
disposition: addressed
evidence: Fixes 1 and 2 replace the false workspace-canonical policy with `status: accepted` mirror-canonical symlink policy and supersede the old decision.

ID: COD-PROJ-PREP1-002
disposition: addressed
evidence: Iter2's corrected policy and this Stage 1 frame include the adversarial mirror-policy scenario; the draft also records the user round-2 re-lock.

ID: COD-PROJ-PREP1-003
disposition: addressed
evidence: Iter2 no longer uses the broad "no hits outside session staging" sync-scan claim as a live premise; the old sync artifact is superseded as moot.

## Typed findings

No new Project-perspective findings. The remaining issue is not a scope-contract failure; it is an edit-surface safety gap covered in the Structure, Usage, Consistency, Risk, and Overall files.

## Low-confidence appendix

None.

VERDICT: PASS
