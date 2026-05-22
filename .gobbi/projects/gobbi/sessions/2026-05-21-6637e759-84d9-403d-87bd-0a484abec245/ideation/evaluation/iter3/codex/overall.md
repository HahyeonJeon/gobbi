# Ideation iter3 — Overall (codex)

## Stage 0 Artifact Summary

The iter3 draft is a strong final Ideation artifact for the gobbi destructive reset. It preserves the 18 locked decisions, retains the iter2 fixes, and fully repairs the prior High/100 self-referential E.2 gate by removing SHA-in-session.json entirely. One Medium issue remains: F-CX-OV-02 is only partially fixed because Stage G captures the PR head SHA but verifies it through squash commit body text instead of using the atomic `gh pr merge --match-head-commit` option.

## Stage 1 Locked Frame

- Scenario O1: All seven perspectives include adversarial coverage.
  - Checklist: project scope, structural sequencing, performance boundedness, readability, executor usability, cross-section consistency, and destructive-operation risk are each walked.
- Scenario O2: Iter2 inherited findings are dispositioned before verdict.
  - Checklist: F-CX-OV-01, F-CX-OV-02, and perspective-specific carried findings are marked addressed/open/disputed/deferred/superseded.
- Scenario O3 (adversarial): The E.2 fix removes circularity without losing required auditability.
  - Checklist: no SHA is written into a tracked file; `git log` and `git ls-tree` are enough to prove the branch has committed the kept session dir; NEEDS_CONTEXT survives gate failure.
- Scenario O4 (adversarial): The Stage G fix does not silently pass a wrong merge.
  - Checklist: source SHA is not assumed to exist in a squash body; a rebase between capture and merge is blocked before merge, not merely detected afterward.
- Scenario O5: Aggregate verdict follows thresholds.
  - Checklist: Critical>=75 means FAIL; High>=50 means REVISE; otherwise PASS.

## Stage 2 Findings

### F-CX-OV-02 — Merge-head stability remains a message-grep heuristic, not a merge gate

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence with line numbers**: The draft captures `HEAD_SHA` at `draft-iter3.md:343-345`, but the merge command at `draft-iter3.md:346` does not include a head-match guard. The post-merge check expects the squash commit body to contain the source SHA at `draft-iter3.md:347-350`, `draft-iter3.md:486-488`, and Success Criterion #14 at `draft-iter3.md:126`. The local `gh pr merge --help` documents `--match-head-commit SHA`, and this repo's git convention says squash commit body comes from the PR body's `## Summary` section at `.gobbi/projects/gobbi/skills/git/conventions.md:207-211`.
- **Why-it-matters**: The remediation does not prove what it says it proves. GitHub/repo squash-message behavior is configurable and not a reliable source-head ledger; body grep can fail on correct merges or pass if stale SHA text is present. The surgical fix is to merge with `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"` and then verify the returned `mergeCommit.oid` is the new `develop` tip.

## Stage 2 Step 3 — Iter2 Inherited Finding Disposition

- F-CX-OV-01: addressed. The Stage E.2 gate is now non-circular: `git log --format=%H -1 <sweep-branch>` must be non-empty and `git ls-tree <sweep-branch> <kept-session-dir>/` must list content at `draft-iter3.md:318-324`. The draft repeatedly states no SHA is written into tracked files at `draft-iter3.md:77`, `draft-iter3.md:326`, and `draft-iter3.md:470`. NEEDS_CONTEXT on gate failure is preserved at `draft-iter3.md:323` and `draft-iter3.md:469`.
- F-CX-OV-02: open, Medium. Capture was added, but merge-head stability is not enforced at merge time and the post-merge check relies on an unsupported source-SHA-in-body assumption.
- Structure F-CX-S-01 / Usage F-CX-U-01 / Consistency F-CX-C-01 / Risk F-CX-R-01: addressed as instances of F-CX-OV-01.
- Structure F-CX-S-02: addressed. E.2's `git ls-tree` precondition naturally handles D/E.1 separate commits by failing until E.1 is committed.
- Risk F-CX-R-02: open/deferred Medium. Failed worktree-remove recovery remains implied, not fully specified.
- Iter1 inherited High findings: remain addressed or user-disputed as in iter2; no regression found for CLAUDE.md citation removal, mistake-file deletion trade-off, Stage E split, backlog session-scoping, post-merge branch cleanup, or `worktrees/` parent preservation.

## Aggregate Verdict

PASS. The prior High/100 blocker is fixed. The remaining F-CX-OV-02 issue is Medium/75, so it does not meet the High>=50 REVISE threshold, but it should be carried as a concrete Planning/Execution correction if the artifact is accepted at maxIterations=3.

## Must-Preserve

- Preserve Q-F pre-reset tag at `487fc35` and push before deletion.
- Preserve Q-A survivor set: `.gobbi/projects/gobbi/{agents,skills,rules}`, current date-prefixed session, `worktrees/`, and `settings.json`.
- Preserve the CLAUDE.md two-row citation removal instead of expanding the design survivor set.
- Preserve `git rm` vs `rm -rf` distinctions and `.codex` symlink-target semantics.
- Preserve E.2's non-circular `git log` + `git ls-tree` gate and NEEDS_CONTEXT failure path.
- Preserve post-merge local sweep-branch deletion and `worktrees/` parent preservation with `-mindepth 1`.
