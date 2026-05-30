# Planning Evaluation — Risk — iter1 — claude

## Artifact Summary + Memory reads
(See project.md.) Focus: what breaks if the PLAN is wrong — order risk, rollback granularity, blast radius, the cache allow-set gate adequacy, the DD-7 install on the shared worktree branch.

## Locked Frame (Stage 1)
- **S1 Mid-plan task failure has a clear rollback boundary.** checklist: per-task atomic revert; coherent state between tasks.
- **S2 Tasks touching shared infra are isolated/sequenced first.** checklist: settings.json edit isolated.
- **S3 Plan ordering robust to interruption.** checklist: stop-after-N is a valid intermediate state.
- **S4 High-blast tasks gated.** checklist: the conditional settings.json edit (T6) + the git push (T5) gated.
- **S5 (adversarial) A task silently widens a prior task's outputs.** checklist: monotonic output addition check.
- **S6 (adversarial) The cache-contents allow-set gate (R1) is folded into T1 --check — is that adequate, or a coverage gap?** checklist: does T1 --check actually assert allow-set membership, or only real-files+freshness?
- **S7 DD-7 commit/push of the worktree branch — branch/cwd blast radius.** checklist: does pushing for the install-test risk polluting develop or the wrong branch?
- **S8 Reversibility of the conditional permissions edit.** checklist: T6 +2 allow entries reversible.

## Per-scenario per-check results
- **S1 YES.** Each task is a single coherent commit (mode worktree-pr). Per-task atomic revert is feasible — T2-T8 each touch 1-2 files. T1 (the script + its generated tree) reverts as one unit. Failure between tasks leaves a coherent partial package.
- **S2 YES.** The only shared-infra mutation is `.claude/settings.json` (T6, conditional, isolated to that one task, +2 entries max). Not sequenced "first" — but it is sequenced LAST-ish (T6) and is conditional, which is lower-risk than an early unconditional infra edit. Acceptable.
- **S3 MOSTLY YES.** Stop-after-T1..T4 = a built-but-unvalidated package (coherent). Stop-after-T5 = validated hooks. Stop-after-T6 = validated invocability. Each is a valid intermediate. One caveat: T5 commits+pushes the worktree branch as a precondition — see RK-2.
- **S4 PARTIAL.** T6's settings.json edit is gated (conditional on auto-grant FALSE) — good. **T5's git push is NOT gated with a go/no-go** — it is a precondition baked into the verifies clause. See RK-2.
- **S5 YES (no widening).** Output sets are monotonic-additive and disjoint; no task re-declares a prior task's output under a new name. Verified outputs per task are distinct.
- **S6 PARTIAL — RK-1.** The R1 allow-set gate `{.claude-plugin, skills, agents, hooks}` is folded into (a) T1 `--check` and (b) the T5 install assertion. But T1's `--check` as specified asserts *real-files-only + freshness/diff* (verifies clause d-e: "every file is a real file, find -type l returns empty" + "exits non-zero after a tamper"). It does NOT, as written, assert that `plugins/gobbi/` contains ONLY the 4 allowed subtrees and no stray `node_modules`/`.git`/extra dir. The allow-set MEMBERSHIP check is asserted only at the T5 install step ("the installed cache must contain only those subtrees") — and T5 is the operator-assisted install task whose verification an executor cannot autonomously run (ST-2/US-1). So the R1 gate's pre-install enforcement is weaker than the readiness doc implies. See RK-1.
- **S7/S8 — see findings.**

## Typed findings
- **RK-1 — The R1 cache-contents allow-set gate is folded into T1 `--check` but T1's verifies asserts real-files+freshness, NOT allow-set membership; the membership check lands only at the operator-assisted T5 install.** Type: design_flaw. Domain: process. Disposition: open. Confidence: 50. Severity: Medium. Evidence: readiness Item-1 + §Cache-contents gate note (plan line 318) claim T1 `--check` covers "real-files-only" and T5 install asserts "only those subtrees"; but T1 verifies clauses (a)-(e) assert dir count (18), agent count (5/0), real-files (find -type l empty), and tamper-detection — none asserts the package root contains ONLY `{.claude-plugin, skills, agents, hooks}` (e.g. nothing would catch a stray top-level file added under `plugins/gobbi/`). The 77M-payload R1 regression was exactly a "package contains more than the allow-set" failure. Why it matters: the strongest pre-install guard against R1 recurrence is left implicit; the explicit membership assertion is deferred to the one verification step that cannot run autonomously. Suggested direction: add an allow-set membership clause to T1 `--check` (e.g. `ls plugins/gobbi/ == {.claude-plugin, skills, agents, hooks}` exactly), so R1 is guarded pre-install regardless of whether T5's install runs. Flag for user discussion. (Confidence 50 not 75: the gate IS named and partially covered; the gap is that the membership half lands in a non-autonomous step.)
- **RK-2 — T5 commits+pushes the worktree branch as an un-gated verification precondition; cwd-reset branch footgun is the project's most-repeated mistake.** Type: assumption_risk. Domain: process. Disposition: open. Confidence: 50. Severity: Medium. Evidence: T5 verifies "commit/push the worktree branch, add the marketplace from a git-ref source pointing at that branch, install." The agent-assignment table DOES attach `executor-cwd-reset-commits-task-to-wrong-branch` to T5 (good awareness). But the verification mandates a push as a side effect of a verification step, with no explicit go/no-go gate and no statement of which remote/branch. Why it matters: pushing mid-plan for an install-test, combined with cwd-reset-to-main-tree (the most-recurring mistake family: subagent-relative-write-paths, executor-cwd-reset, sendmessage-continued-cwd-resets), risks committing/pushing to the wrong branch or polluting develop. Reversible (a pushed session branch can be deleted), so Medium not High. Suggested direction: make the push an explicit gated step naming the exact session branch + remote, and confirm it targets the session branch not develop/main. (The DD-7 ratified decision already chose this path, so it is not re-litigable — the gap is the missing go/no-go gating + branch-name pin in the task.)

## Low-confidence appendix
- (25, Low) T6's +2 allow-entry edit is reversible (delete 2 lines) — S8 satisfied, not a finding.
- (25, Low) Supply-chain: no new production dep introduced; `python3`/`claude` CLI/`git`/coreutils are pre-existing. Not a finding.

**Verdict: PASS** (RK-1 and RK-2 are both Medium/50 — below the High≥50 REVISE threshold. They are real and worth user discussion but do not block.)
