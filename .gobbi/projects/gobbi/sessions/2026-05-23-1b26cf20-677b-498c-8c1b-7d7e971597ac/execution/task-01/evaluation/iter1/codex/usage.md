---
perspective: usage
system: codex
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
task: task-01
iter: 1
verdict: REVISE
surfaced-by: codex
---

## Artifact Summary
Commit `14da700` changes the manager-facing Configuration instructions. Its user is the future manager agent reading `orchestration/SKILL.md` during session bootstrap. The Scope Contract is Task 01 in `planning/artifacts/plan.md`; the intended user experience is that the manager can determine direct vs worktree-pr mode, create or reuse the session worktree, then stamp row 6 without guessing.

## Memory reads
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/execution/evaluation.md`
- `.agents/skills/git/SKILL.md`
- `.agents/skills/git/conventions.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `.gobbi/projects/gobbi/mistakes/*.md`
- `planning/artifacts/plan.md`
- `rg -n "footnote below|D-5|direct-mode escape|direct.*mode" .../orchestration/SKILL.md`
- `nl -ba .../orchestration/SKILL.md | sed -n '96,108p'`

## Locked Frame (Stage 1)
Scenario: The manager can execute row 5.5 without asking for missing context.
- Check: direct mode says exactly what to do.
- Check: worktree-pr mode says exactly what to do.
- Check: repeat-session behavior says exactly what to do.
- Check: stale-path behavior says exactly what to do.

Scenario: The row does not send the reader to absent local context.
- Check: every "see below" reference has a visible target.
- Check: every link target is either valid or clearly recoverable by path.

Scenario: Direct-mode escape hatch remains understandable (adversarial).
- Check: direct mode is explicitly skipped.
- Check: row 6 still stamps branch/current HEAD in direct mode.
- Check: no wording makes direct mode appear deprecated or unsupported.

## Stage 2 Findings
Scenario: The manager can execute row 5.5 without asking for missing context.
- PASS: direct mode says skip worktree creation and row 6 stamps the current HEAD branch.
- PASS: worktree-pr mode says invoke `git/SKILL.md` P2 with `chore/session-{date}-{ssid-short}`.
- PASS: repeat-session with existing worktree path is explicit.
- FAIL: stale recorded worktree path is not explicit. The future manager has to infer whether to clear the path, re-add the worktree, reuse an existing branch, or escalate. See COD-PROJ-001.

Scenario: The row does not send the reader to absent local context.
- FAIL: row 5.5 says "preserves direct-mode escape hatch; see footnote below", but `rg -n "footnote below|D-5|direct-mode escape"` finds no footnote target outside row 5.5 itself.

Finding COD-USAGE-001
- Type: `design_flaw`
- Domain: `docs-sync`
- Confidence: 80
- Severity: Medium
- Disposition: open
- Evidence: `rg -n "footnote below|D-5|direct-mode escape|direct.*mode"` returns only row 5.5 and the existing git schema row; there is no visible footnote target below the table.
- Impact: the row points the manager to absent explanatory context. Task 06 may add the direct-mode footnote later, but this commit's standalone artifact contains the dangling reference.
- Corrective direction: remove "see footnote below" in Task 01 or add a minimal footnote in the same commit if the reference is needed.

Scenario: Direct-mode escape hatch remains understandable (adversarial).
- PASS: row 5.5 says `If direct: skip`.
- PASS: row 6 says direct mode stamps `git.branch` and leaves `git.worktreePath`/`pr` null.
- CONCERN: the dangling footnote makes the direct-mode rationale incomplete, but the operational instruction itself remains present.

## Per-Perspective Verdict
VERDICT: REVISE

## Low-confidence appendix
None.
