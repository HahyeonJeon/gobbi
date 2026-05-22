# Ideation iter4 — Project perspective (codex)

## Stage 0 Artifact Summary

Iter4 is a surgical Ideation revision of the gobbi destructive repo-reset draft. The scope remains the same single worktree PR sweep: wipe runtime/package surfaces, preserve `.gobbi/projects/gobbi/{agents,skills,rules}` plus this date-prefixed session, placeholder most project memory, track sessions, archive pre-reset state with `pre-reset-2026-05-21`, and squash-merge into `develop`. The only authorized iter4 delta is Q-iter4-Override: replace iter3's post-merge body-grep head verification with pre-merge `HEAD_SHA` capture and `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"`.

Memory reads: `draft-iter4.md`; `draft-iter3.md`; `discussion-log.md`; `settings.json`; iter3 codex `overall.md`; iter3 claude `overall.md` and `usage.md`; `.gobbi/projects/gobbi/rules/stub-redirect-format.md`; `.gobbi/projects/gobbi/mistakes/executor-rationalized-failing-verification-gate.md`; local `gh pr merge --help`; GitHub CLI manual `gh_pr_merge`; GitHub REST "Merge a pull request" docs.

## Locked Frame (Stage 1)

- Scenario P1: Q-iter4-Override stays inside the user-authorized scope.
  - Checklist: Stage G uses `--match-head-commit "$HEAD_SHA"`; D11 is rewritten; D2 #20/#21 collapse to one atomic-guard verification; no unrelated decisions are re-opened.
- Scenario P2: All 19 locks remain honored.
  - Checklist: Q1-Q8, Q-A-Q-G, Q-Survivor, Q-StageE, Q-Gate-Redesign, and Q-iter4-Override are present and compatible.
- Scenario P3: Prior audit trail remains intact.
  - Checklist: iter1, iter2, and iter3 drafts remain separate; iter4 is a new artifact; settings override is documented.
- Scenario P4 (adversarial): The surgical fix smuggles in broader process changes.
  - Checklist: no survivor-set expansion; no new project-memory destination; no change to destructive reset shape; no direct-develop flow.
- Scenario P5 (adversarial): The atomic guard is only asserted, not contractually supported.
  - Checklist: local `gh` help and GitHub docs support `--match-head-commit`/REST `sha`; REST `merge_method` includes `squash`; head mismatch has a documented failure response.

## Stage 2 Findings

No new project-scope finding. Q-iter4-Override is authorized by `discussion-log.md:171-178` and `settings.json:5-10`, and the draft scopes it narrowly at `draft-iter4.md:5-9`, `draft-iter4.md:116-118`, and `draft-iter4.md:570-580`. The change is in-scope at `draft-iter4.md:70`, while post-merge body-grep is explicitly out-of-scope at `draft-iter4.md:82`.

## Stage 2 Step 3 — Disposition Of Every Iter3 Inherited Finding

- F-CX-OV-01: addressed, Confidence 100, Severity High. The iter3 non-circular E.2 gate is preserved at `draft-iter4.md:13-16`, `draft-iter4.md:326-336`, and `draft-iter4.md:471-480`.
- F-CX-OV-02: addressed, Confidence 100, Severity Medium. The project contract now uses `--match-head-commit "$HEAD_SHA"` at `draft-iter4.md:70`, `draft-iter4.md:135`, `draft-iter4.md:356-359`, and `draft-iter4.md:498-500`.
- Iter3 Claude High findings F-U3-02 / F-C3-01 / F-C3-02 / F-R3-01: addressed as the same project-scoped Q-iter4-Override root cause; see `draft-iter4.md:571-578`.
- Iter3 Low findings F-U3-03 / F-A3-01 / F-A3-02: addressed or explicitly deferred below threshold at `draft-iter4.md:640-645`; no project-scope lock changes required.

## Per-perspective Verdict

PASS. No Critical>=75 or High>=50 project finding.

## Must-Preserve

- Preserve all 19 user locks and the single-sweep PR scope.
- Preserve Q-Gate-Redesign's "no sweep SHA in tracked files" rule.
- Preserve the iter4 atomic guard as a one-mechanism substitution, not a broader redesign.
- Preserve the settings override reason at `settings.json:8-9`.

