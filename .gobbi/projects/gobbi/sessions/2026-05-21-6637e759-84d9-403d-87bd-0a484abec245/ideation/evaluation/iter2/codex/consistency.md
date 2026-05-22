# Ideation iter2 — Consistency perspective (codex)

## Stage 0 Artifact Summary

The artifact must keep four representations synchronized: the Scope Contract success criteria, the scenario table, the Implementation Checklist, and Design D1-D10. Iter2 adds remediation summaries and new success criteria, so the Consistency lens checks whether each added statement says the same thing everywhere.

## Stage 1 Locked Frame

- Scenario C1: Scope Contract, scenarios, checklist, and design describe the same reset.
  - Checklist: survivor set matches everywhere; CLAUDE.md edit appears in scope, scenario, checklist, design, and success criteria; post-merge branch cleanup appears in branch success criteria and Stage G.
- Scenario C2: Verification commands match intended post-state.
  - Checklist: gitignore checks match edited files; symlink checks include `.claude/agents` and `.claude/skills`; branch checks are post-merge only.
- Scenario C3 (adversarial): A remediation creates a new contradiction while fixing an old one.
  - Checklist: E.1/E.2 split uses one coherent commit model; SHA gate semantics do not conflict between Stage D, Stage E, invariants, and D9.
- Scenario C4: Cross-cutting retention claims match data flow.
  - Checklist: backlog remains session-scoped; deleted mistakes are acknowledged; root and project README stubs match placeholder policy.

## Inherited Iter1 Findings

- F-C-01 (Success #2 multi-commit contradiction): addressed. Success #2 is explicitly post-merge on `develop` at line 95, and commit labels are sweep-branch commits at line 227.
- F-C-02 (missing post-merge sweep branch deletion): addressed. Stage G includes `git branch -d <sweep-branch>` at line 315.
- F-C-03 (`worktrees/` preserved vs command deleting it): addressed. Line 303 uses `-mindepth 1`.
- F-C-04 (`.gitignore` line-number citation): addressed. I6 line 181 cites line content rather than brittle line number.

## Stage 2 Findings

### F-CX-C-01 — The E.2 gate contradicts the draft's own commit model

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: High
- **Evidence**: Line 273 captures Stage D's commit SHA before Stage E.1's session `git add` at line 279. Line 288 says E.1 may commit separately and "re-record the SHA in session.json." Lines 292-294 require the commit containing the gitignore edits plus staged session dir to be the SHA found in `session.json`. Lines 320-323 summarize Stage D committed before E.1 and E.2 gated by the sweep commit SHA in `session.json`.
- **Why-it-matters**: These statements cannot all be true under normal git object semantics. A commit SHA is a hash of the tree and metadata; writing that SHA into a file included in the same tree changes the SHA. This is not just wording polish: it makes the artifact's core safety gate internally inconsistent.

### F-CX-C-02 — `gh pr merge --squash --delete-branch` lacks a head-stability check

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: Stage G pushes the sweep branch, opens a PR, then merges with `gh pr merge --squash --delete-branch` at lines 311-315. The draft does not instruct capturing the PR head SHA immediately before merge or verifying that the squashed commit corresponds to the reviewed sweep head.
- **Why-it-matters**: In a solo repo this is unlikely, but the consistency contract says "the squashed PR" is exactly the reviewed sweep. A last-minute branch update or stale PR view could make post-merge verification count commits correctly while missing that the merged head was not the expected one.

## Per-perspective Verdict

REVISE. F-CX-C-01 is High/100.

## Must-Preserve

- Preserve the post-merge-only definition of "one new commit on develop."
- Preserve explicit local sweep-branch deletion after merge.
- Preserve symlink verification over both `.claude/skills` and `.claude/agents`.
