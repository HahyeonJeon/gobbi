# Git Evaluation Entrypoint

Use this entrypoint to evaluate the [Git operation](SKILL.md). It extends the general
[Evaluation](../evaluation/SKILL.md) method with Git-specific scenarios, checks, lenses, and direct-object
evidence. A calling workflow owns any report shape or output path.

## Inputs

Read and freeze:

1. [Git](SKILL.md), [conventions](conventions.md), [scenarios](scenarios.md), [checklists](checklists.md), [recorded traps](mistakes.md), and the retained [posture probe](scripts/git-posture-probe.sh).
2. The version 5 session manifest, version 3 state, evaluated handoff, authorized finalization plan, task list, commits, verification evidence, and prior finalization receipt when resuming.
3. Current local repository, branch, worktree registration and status, configured base, remote refs, issue, pull request, checks, merge association, and cleanup state that apply to the subject.
4. The governing [Workflow](../workflow/SKILL.md), [Execution](../execution/SKILL.md), [Wrap-up](../wrap-up/SKILL.md), [Discussion](../discussion/SKILL.md), and [session schema](../record/schemas/session.schema.json).

Bind the review to the exact subject digest, system identity, branch head, and worktree path required by the Evaluation owner. Do not mutate the session or Git objects while constructing evidence.

## Selection and completion

1. Select every `GIT-SCEN-` case whose Given condition occurs in the subject. Run a disposable local repository or non-mutating model for mandatory boundaries absent from the live session.
2. Select every `GIT-CHECK-` item whose applicability predicate is true. Resolve a false predicate only from inspected settings and object state.
3. Always include the fresh local-only, resume, configured publication, issue-free request, draft request, merge-authority, failing-check, dirty-tree, squash-cleanup, retained-recovery, time-of-check/time-of-use, cosmetic legacy, and handoff-integrity probes.
4. Add a target-specific scenario and check when the subject adds a material Git object, external action, authority gate, cleanup branch, or recovery state not covered by the seed set.
5. Review all seven perspectives in order, then Overall. Every selected scenario reaches its linked check and every applicable check appears in the completed evaluation checklist.

## Perspective lenses

| Perspective | Git-specific lens | Seed routes | Recommended verification |
|---|---|---|---|
| Project | Does finalization deliver the configured local, push, pull-request, optional issue, and authorized merge outcome without hidden coupling or scope expansion? | 01, 04–07, 10, 15, 17 | Compare manifest settings, user authority, action trace, retained path, and actual objects |
| Structure | Is one Gobbi UUID bound to one session branch/worktree and one ordered writer history with clear manager/executor ownership? | 01–03, 08, 13 | Trace manifest identity to worktree, branch, commits, writer assignments, and object lifecycle |
| Performance | Are network queries, pushes, exact-head lookups, status scans, and cleanup retries bounded, idempotent, and limited to configured actions? | 04–07, 14, 16 | Count external calls and objects; inspect reuse queries and retry/stop behavior |
| Aesthetics | Are branch names, paths, commit subjects, trailers, pull-request bodies, and receipts concise, deterministic, and readable by a cold maintainer? | 01, 05, 06, 08, 17 | Validate formats and inspect the handoff/receipt boundary without relying on labels alone |
| Usage | Can a manager or next session create, resume, publish, stop, recover, and continue from exact commands and paths? | 01, 02, 04–07, 15–17 | Walk local-only, issue-free, deferred, partial-prefix, and resumed paths from the documented entrypoint |
| Consistency | Do manifest settings, state, branch, worktree, task commits, refs, pull-request head/base, merge state, handoff, and receipt agree? | 02, 04–08, 11, 13, 16–18 | Cross-check hashes and identities across every owner; run link and convention checks |
| Risk | Can work land in the main checkout, publish without configuration, merge without authority, delete dirty/unmerged work, race cleanup, or rewrite evaluated evidence? | 03, 07, 09–16, 18 | Run wrong-root, cosmetic-evidence, authority, dirty-boundary, squash-proof, race, retained-work, and immutable-handoff probes |
| Overall | Does the complete operation produce verified local history and either an exact recovery path or fully evidenced authorized finalization without losing work or overstating facts? | all applicable cases | Reconcile the parent contract, complete register, current objects, action log, and receipt |

## Rule crosswalk

| Parent rule | Scenarios | Checks | Primary perspectives |
|---|---|---|---|
| [G-1](SKILL.md#g-1) | 01–03 | 01–03 | Project, Structure |
| [G-2](SKILL.md#g-2) | 01–03, 08 | 01–03, 08 | Structure, Risk |
| [G-3](SKILL.md#g-3) | 03, 08, 09 | 03, 08, 09 | Structure, Consistency |
| [G-4](SKILL.md#g-4) | 04–07 | 04–07 | Project, Usage |
| [G-5](SKILL.md#g-5) | 08, 10, 17 | 08, 10, 17 | Structure, Risk |
| [G-6](SKILL.md#g-6) | 01, 04, 05, 07, 16 | 01, 04, 05, 07, 16 | Project, Performance |
| [G-7](SKILL.md#g-7) | 04, 08, 10, 17 | 04, 08, 10, 17 | Project, Consistency |
| [G-8](SKILL.md#g-8) | 10, 11, 14 | 10, 11, 14 | Risk, Consistency |
| [G-9](SKILL.md#g-9) | 12–14 | 12–14 | Risk, Structure |
| [G-10](SKILL.md#g-10) | 07, 10–12, 15, 16 | 07, 10–12, 15, 16 | Usage, Risk |
| [G-11](SKILL.md#g-11) | 03, 10, 12, 13, 15 | 03, 10, 12, 13, 15 | Risk |
| [G-12](SKILL.md#g-12) | 11–14, 16 | 11–14, 16 | Risk, Consistency |
| [G-13](SKILL.md#g-13) | 07, 11, 12, 16 | 07, 11, 12, 16 | Usage, Risk |
| [G-14](SKILL.md#g-14) | 17, 18 | 17, 18 | Consistency, Overall |

## Required adversarial verifications

- **Wrong-root probe:** a plausible relative path shared by main and worktree must be rejected without changing the main checkout.
- **Per-task-worktree probe:** a task transition must reuse the session worktree and cannot create a new branch/worktree.
- **Legacy issue-first probe:** local, push, and pull-request paths must remain valid without an issue.
- **False-publication probe:** a configured but blocked action must not appear as completed and must retain recovery objects.
- **Cosmetic-verification probe:** a report, heading, staged diff, or old green run must not authorize the task commit or merge.
- **Merge-authority probe:** green checks and configured pull-request publication must not merge without explicit approval for the current head.
- **Changed-head probe:** a head or check change after approval must stop merge.
- **Dirty-boundary probe:** one uncommitted byte must stop non-force worktree removal and branch deletion.
- **Squash-association probe:** local `git branch -D` must be unreachable without exact merged pull-request head association.
- **Cleanup-race probe:** changed liveness, status, head, or merge state after preview must skip the destructive action.
- **Unmerged-recovery probe:** local, deferred, open, or failed publication must retain exact branch/worktree/head recovery evidence.
- **Partial-prefix probe:** resume must reuse existing external objects and continue from the first unproven action.
- **Handoff-mutation probe:** finalization facts must not change either evaluated handoff body.

## Finding focus

Open a finding when direct evidence shows:

- the session UUID, branch, worktree, or base disagree;
- a runtime ID or issue number replaces Gobbi session identity;
- a write targets the main checkout or another worktree;
- more than one write-capable assignment or task worktree exists;
- a task commit is broad, unverified, or missing canonical provenance;
- issue absence changes local, push, or pull-request behavior;
- configured publication performs an extra action or omits a required one;
- an external prerequisite blocks local work or triggers a false success claim;
- merge lacks current explicit authority, green current-head checks, complete tasks, Wrap-up PASS, or cleanliness;
- cleanup acts before confirmed merge, against a dirty/live tree, out of order, with force, or from stale evidence;
- post-squash `-D` lacks exact pull-request association;
- unmerged or partial work loses its branch, worktree, reachability, or exact recovery instructions; or
- later Git facts mutate the evaluated handoff or the receipt contradicts actual objects.

## Anti-patterns

- Accepting a session because the expected branch name exists without checking UUID, base, worktree, and head.
- Treating `gh auth status` or the posture probe as proof that a network action succeeded.
- Counting an issue or pull request as mandatory local-work evidence.
- Treating `publication: pull-request` as merge authority.
- Using `git branch --merged` alone for squash-merge proof.
- Running a broad empty-directory cleanup under the shared worktree root.
- Treating an absent object as safely cleaned without proving the exact merged session state.
- Copying later finalization facts into the evaluated handoff.

## Overall anchors

### PASS anchor

All applicable checks pass with direct evidence. The session has focused verified local commits and either a precise retained recovery path or a configured, authorized, fully verified publication/merge/cleanup result. No issue coupling, wrong-tree write, unauthorized action, cleanup risk, or evidence overstatement remains.

### REVISE anchor

No proven Critical authority or data-loss action occurred, but one or more High-confidence defects remain in optionality, identity, commit focus, current-head checks, idempotency, cleanup order, receipt completeness, or companion trace closure. The current canonical artifact must be materially revised and fully re-evaluated.

### FAIL anchor

Direct evidence shows an unauthorized merge or destructive action, wrong-tree mutation, lost/unreachable unique work, force cleanup of a dirty/unmerged session, unproven post-squash branch deletion, or another Critical finding with confidence at least 75.

## Output

Write one result through the active [Evaluation method](../evaluation/SKILL.md). Cover Project, Structure,
Performance, Aesthetics, Usage, Consistency, Risk, and Overall exactly once. Use its separate problem and
optional-improvement ledgers, verified strengths, completed checklist and applicable tests, declared scoring,
and verdict. Preserve the exact Git subject identity and do not run mutating Git or GitHub actions during
evaluation. Let the caller serialize or store the result.
