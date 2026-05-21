# Ideation iter2 — Overall (codex)

## Stage 0 Artifact Summary

The iter2 draft is a strong remediation of the iter1 destructive reset plan: it preserves the 17 user locks, fixes CLAUDE.md dangling links by narrow edit, clarifies post-merge branch cleanup, protects `.claude/agents` and `.claude/skills` symlink targets by keeping `.gobbi/projects/gobbi/{agents,skills}`, and records the accepted deletion of prior promoted mistakes and backlog promotion target. Codex's independent review still finds one aggregate blocker: the E.2 SHA gate is not satisfiable as written because it appears to require a commit containing the staged session dir to also contain its own SHA in `session.json`.

## Stage 1 Locked Frame

- Scenario O1: All seven perspective frames include adversarial coverage.
  - Checklist: project scope, structural commit model, performance boundedness, document clarity, executor usability, cross-section consistency, and destructive-operation risk are each walked.
- Scenario O2: Iter1 inherited findings are dispositioned before verdict.
  - Checklist: all iter1 High/Medium/Low findings are addressed, open, disputed, deferred, or superseded.
- Scenario O3 (adversarial): The iter2 remediation fixes the wording but not the executable invariant.
  - Checklist: Stage D/E.1/E.2 can be performed by normal git commands; session.json SHA semantics are not self-referential; failed gate cannot be rationalized.
- Scenario O4: The aggregate verdict follows threshold rules.
  - Checklist: any Critical>=75 means FAIL; any High>=50 means REVISE; otherwise PASS.

## Inherited Iter1 Findings

- Project: F-P-01 addressed; F-P-02 open Medium; F-P-03 addressed.
- Structure: F-S-02 and F-S-03 addressed; F-S-01 superseded by the new SHA-gate contradiction.
- Performance: F-PF-01 remains Low/deferred.
- Aesthetics: F-A-01 addressed; F-A-02 open Low.
- Usage: F-U-02 addressed; F-U-01 superseded by the new unsatisfiable SHA-gate finding.
- Consistency: F-C-01, F-C-02, F-C-03, and F-C-04 addressed.
- Risk: F-R-01 addressed; F-R-02 disputed/addressed by user-accepted trade-off; F-R-03 superseded by the new gate finding; F-R-04 deferred/n/a.
- Overall: F-OV-01 addressed by session-scoped backlog handling; F-OV-02 disputed by Q3 single-PR lock.

## Stage 2 Findings

### F-CX-OV-01 — E.2 SHA gate is impossible or underspecified

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: High
- **Evidence**: Stage D commits gitignore edits and captures a SHA at line 273; Stage E.1 stages the surviving session dir at lines 277-288; Stage E.2 requires the commit containing both gitignore edits and the staged session dir to have its SHA written into `session.json` at lines 292-294; D9 repeats the same gate at lines 416-422. A commit cannot include its own final SHA in a file in its tree because the SHA changes when the file content changes.
- **Why-it-matters**: This is the gate before deleting the live bare-UUID session directory. It must be non-rationalizable. As written, a strict executor stops, while a loose executor may delete state after matching an adjacent but wrong SHA.

### F-CX-OV-02 — Merge-head stability is not checked

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: Stage G merges with `gh pr merge --squash --delete-branch` at line 314 but does not capture or verify the PR head SHA immediately before merge.
- **Why-it-matters**: In the solo-user context this is not a threshold driver, but the destructive sweep should prove the squashed commit corresponds to the reviewed branch head.

## Aggregate Verdict

REVISE. Structure, Usage, Consistency, and Risk each contain a High-confidence High-severity finding around the same SHA-gate flaw, so the aggregate verdict is REVISE under the stated threshold. No Critical>=75 finding is recorded because the plan's intent is recoverable with a surgical rewrite of the gate semantics.

## Must-Preserve

- Preserve Q-F pre-reset tag at `487fc35` and push before deletion.
- Preserve Q-A survivor set: `.gobbi/projects/gobbi/{agents,skills,rules}`, current date-prefixed session, `worktrees/`, and `settings.json`.
- Preserve the CLAUDE.md two-row citation removal instead of expanding the design survivor set.
- Preserve `git rm` vs `rm -rf` distinctions and `.codex` symlink-target semantics.
- Preserve post-merge local sweep-branch deletion and `worktrees/` parent preservation with `-mindepth 1`.
