You are an INDEPENDENT adversarial evaluator (Codex) for the Wrap-up loop of a gobbi session. Do NOT trust the report — verify by reading files.
# CWD = worktree root: /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9 . Write output ONLY under this worktree.
# Contract: the Wrap-up WORK (commit 0752d08) promoted this session's NEW staging to project memory + updated HANDOFF.md to full completion + superseded the partial journal note. Verify the Wrap-up did its job correctly. This is the FINAL gate before the PR.
# Evaluate (focus on what Wrap-up uniquely produces — promotion correctness + handoff accuracy):
- **Promotion completeness / no silent drops**: read `<SD>/wrap-up/rawdata/promotion-manifest.md` and confirm every NEW staging file under `<SD>/{ideation,preparation,planning,execution}/**/staging/` is accounted for (promoted / skipped-already-promoted / recorded-resolved). `<SD>` = .gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
- **Promotion correctness**: the 3 new mistakes exist at `.gobbi/projects/gobbi/mistakes/`, 2 backlogs at `backlogs/`, 5 learnings at `learnings/`, 4 checklists + 1 changelog at `features/session-foundations-bundle-c/`. Frontmatter intact; each has the 4 mistake elements where applicable.
- **Handoff accuracy**: read `<SD>/HANDOFF.md` — its claims (T01-T07 all PASS, defect eradicated tree-wide, 2 deferred backlogs, commit range) must be backed by reality. Spot-check: `grep -rl 'gobbi mistake promote' .claude/ .gobbi/projects/gobbi/skills/ .codex/ .agents/` should be empty (defect eradicated); `git log --oneline develop..HEAD` shows the claimed commits.
- **Supersede-not-delete**: the partial journal `notes/2026-05-24-...-partial.md` must still exist with `status: superseded` + `superseded_by:` (NOT deleted); the new `notes/2026-05-25-...-complete.md` exists.
- **No project-memory write outside the routing table** (no invented destinations); commit 0752d08 scope is project-memory dirs + HANDOFF + wrap-up session dir only.
# Verify
```
cd /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9
git show --stat 0752d08
cat .gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/wrap-up/rawdata/promotion-manifest.md
ls .gobbi/projects/gobbi/mistakes/ .gobbi/projects/gobbi/backlogs/ .gobbi/projects/gobbi/learnings/ .gobbi/projects/gobbi/features/session-foundations-bundle-c/
grep -rl 'gobbi mistake promote' .claude/ .gobbi/projects/gobbi/skills/ .codex/ .agents/ 2>/dev/null || echo "NONE REMAIN"
git log --oneline develop..HEAD | head -25
grep -nE 'status: superseded|superseded_by' .gobbi/projects/gobbi/notes/2026-05-24-session-foundations-bundle-c-partial.md
```
# Output (markdown) under worktree: `.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/wrap-up/evaluation/iter2/codex/` — files project.md, consistency.md, risk.md, overall.md (others optional/"no findings"). Findings: Type/Severity/Confidence/Evidence/Why/Suggested-direction. Thresholds: Critical conf>=75→FAIL; High conf>=50→REVISE; else PASS. End overall.md with `VERDICT: PASS|REVISE|FAIL` + Must-preserve list.
