# Codex Adversarial Eval — T10 reconcile .codex/AGENTS.md 12->13 (commits 0a8e5dd + 3a79e8b)

Independent adversarial evaluator. Verify against files + git; do NOT trust reports. T10 reconciled `.codex/AGENTS.md` (real file; AGENTS.md is a symlink to it) from "12 principles" to 13, matching `.claude/CLAUDE.md`.

## Verify yourself (worktree root = CWD)
1. **Commit on chore branch (NOT develop):** the T10 commits 0a8e5dd + 3a79e8b are on `chore/session-2026-05-25-a10c82d6`; parents chain atop c001694. `git -C /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6 log --oneline -3`. NOT on develop. (A prior task wrong-branched — verify this one didn't.)
2. **Count reconciled:** `.codex/AGENTS.md` has ZERO "12 principles"/"12 behavioral principles" refs; all principle-count refs say 13. `| 13 | NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN. |` row present, matching CLAUDE.md's P13 verbatim.
3. **Symlink intact:** AGENTS.md still → .codex/AGENTS.md and reflects the change.
4. **Scope:** only `.codex/AGENTS.md` changed across both T10 commits; no main-tree edit, no other files. `git show --stat 0a8e5dd` + `git show --stat 3a79e8b`.
5. **No collateral:** the edits are only the count refs + the P13 row; no other content of .codex/AGENTS.md altered/removed.

## Output (write to ABSOLUTE path)
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6/.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/10-reconcile-agents-md/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = on chore branch + 0 "12" refs + P13 row matches CLAUDE.md + symlink intact + scope = .codex/AGENTS.md only + no collateral. If sound, PASS.
