---
loop: planning
iter: 1
system: codex
perspective: risk
verdict: revise
---

# Risk Perspective - Planning Evaluation Iter 1

## Artifact Summary + Memory reads

Risk review checks what fails if the plan is wrong: session writes can land in the wrong tree, locked decisions can be reopened, task rollback boundaries can blur, or a known prior mistake can recur.

Memory reads: target plan, locked Idea, planning child doc, `codex-eval-session-write-path-nested-in-worktree.md`, `manager-rm-rf-without-investigating-tracked-files.md`, and concern staging files.

W/W/H gate: clear. Phase match: planning.

## Locked Frame (Stage 1)

Scenario 1: Rollback and PR boundaries are clear.
- Check: each task is one worktree, branch, commit, and PR.
- Check: overlapping tasks are sequenced.

Scenario 2: Known path-discipline mistake is not repeated.
- Check: session-memory writes use the main-tree absolute path when concrete paths are required.
- Check: no worktree-relative or repo-root-relative session paths appear in task commands.

Scenario 3: High-blast decisions are gated once, not repeatedly.
- Check: Concern 3's user-selected Draft A is inlined, not re-asked.

Scenario 4 (adversarial): Verification succeeds locally but proves the wrong path.
- Check: file-existence verifiers point to the path Wrap-up/Memorization will actually consume.

Coverage matrix seeds: privacy/licensing are not applicable. Cost applies to codex skill content and is preserved. Supply-chain is not applicable. Error-budget impact is not applicable.

## Per-scenario per-check results

Scenario 1: PASS. The plan states one task -> one worktree/branch/commit/PR at `draft-iter1.md:138` and repeats this PR strategy at `draft-iter1.md:479-493`. File overlaps are sequenced at `draft-iter1.md:376-380`.

Scenario 2: FAIL. The prior mistake explicitly says evaluator/session writes must use `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/...`, not paths derived from CWD. Task 05's concrete verifier uses `sessions/...` at `draft-iter1.md:278`, and Task 07 uses `sessions/2026-05-23-...` at `draft-iter1.md:338`.

Scenario 3: FAIL. Reopening Concern 3 risks a stale or different row text from the user-selected Draft A. Evidence is the same as Project/Consistency.

Scenario 4: FAIL. Even if Task 05 creates the backlog correctly under the main-tree session path, its `test -f sessions/...` command would not prove the correct file from repo root. This is exactly the failure class the codex mistake warns about.

## Typed findings

### COD-RISK-001 - Session path verifiers can repeat the known wrong-root failure class

- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:278` and `draft-iter1.md:338` use relative/placeholder session paths. The applicable mistake says the corrected approach is to inline `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/...` and verify post-eval presence under that main-tree path.
- Why it matters: the plan is specifically about preventing wrong session-memory shapes. A wrong-root verifier can let Execution report success while Wrap-up sees nothing.
- FP check: not speculative; direct text plus project mistake memory.

### COD-RISK-002 - Locked Draft A decision is not represented in the risk gate

- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: user locked Draft A; artifacts still route to AskUserQuestion/default at `draft-iter1.md:89`, `draft-iter1.md:451`, and `concern-3-coverage-ownership-cell-text.md:48-50`.
- Why it matters: a settled user decision can diverge during execution.
- FP check: direct mismatch, in scope.

Risk verdict: REVISE. Two High findings meet the REVISE threshold. No Critical finding because both defects are straightforward text revisions before Execution.

## Low-confidence appendix

None.
