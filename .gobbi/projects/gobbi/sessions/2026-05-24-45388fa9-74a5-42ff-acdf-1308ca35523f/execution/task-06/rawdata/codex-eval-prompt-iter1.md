You are an INDEPENDENT adversarial evaluator (Codex) for a 10-file documentation sweep. Do NOT trust the author — verify by reading files.
# CWD = worktree root: /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9 . Write output ONLY under this worktree.
# Contract (task T06 / CL-5), commit a8968f8
Apply the LOCKED M2 `{session-id}` wording to the Path-conventions row in 10 skill files + mark f-risk-01 backlog addressed. The 3 LOCKED clauses each file's `{session-id}` row MUST contain: (1) the id comes "from the delegation prompt's `session-id:` field"; (2) "do NOT read `$CLAUDE_CODE_SESSION_ID` for this value"; (3) it is the "subagent's own UUID, not the parent session's".
The 10 files (real targets under .gobbi/projects/gobbi/skills/, read via .claude/skills/ symlinks): evaluation, execution, ideation, interview, memorization, orchestration/workflow/evaluation.md, planning, preparation, research, wrap-up.
f-risk-01 backlog `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md`: status:addressed + disposition:addressed + a `## Resolution` section.
EXCLUSIONS that must be UNTOUCHED: `mistake/SKILL.md` (T03 owns its M2 row), `gobbi/SKILL.md` (no Path-conventions section; its >=3 CCSI mentions are env-var-passthrough/Gate-1 prose and must remain), `orchestration/SKILL.md` (the PARENT doc — only the workflow/evaluation.md sub-doc is in scope), all other skills/backlogs.
# Evaluate 7 perspectives + Overall (docs sweep — Performance/visual-Aesthetics N/A; say so briefly)
Focus: **Project** (all 10 rows rewritten with the 3 clauses? backlog addressed + Resolution?); **Consistency** — CRITICAL: read each of the 10 files' Path-conventions `{session-id}` row and confirm the wording is faithful + uniform AND that ONLY that row changed per file (no collateral edits to other rows/sections — inspect `git diff a8968f8~1 a8968f8`); also confirm the wording is coherent with the mistake/SKILL.md M2 row landed by T03 (read `.claude/skills/mistake/SKILL.md` Path-conventions row); **Risk** — scope is exactly 11 files; the anti-game invariant holds: `gobbi/SKILL.md` CCSI mentions intact (>=3) and NOT edited; **Structure** (rows still valid markdown list items in their Path-conventions blocks).
# Verify yourself
```
cd /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9
git show --stat a8968f8
git diff --name-only a8968f8~1 a8968f8         # exactly 11 files; NONE of: mistake/SKILL.md, gobbi/SKILL.md, orchestration/SKILL.md
git diff a8968f8~1 a8968f8                     # inspect: only the {session-id} row changed per file (no collateral)
# per-file 3-clause presence + anti-game:
for F in evaluation execution ideation interview memorization planning preparation research wrap-up; do echo "== $F =="; awk '/Path conventions/,/^\*\*[^P]|^## |^### [^P]/' .claude/skills/$F/SKILL.md | grep -nE 'session-id:|CLAUDE_CODE_SESSION_ID|UUID'; done
awk '/Path conventions/,/^\*\*[^P]|^## /' .claude/skills/orchestration/workflow/evaluation.md | grep -nE 'session-id:|CLAUDE_CODE_SESSION_ID|UUID'
grep -cE '\$CLAUDE_CODE_SESSION_ID|`CLAUDE_CODE_SESSION_ID`' .claude/skills/gobbi/SKILL.md   # >=3, unchanged
grep -nE '^status:|^disposition:|^## Resolution' .gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md
```
# Output (markdown) under worktree: `.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/execution/task-06/evaluation/iter1/codex/` — files project.md, structure.md, performance.md, aesthetics.md, usage.md, consistency.md, risk.md, overall.md. Each finding: Type/Severity/Confidence/Evidence(file+line)/Why/Suggested-direction. "No findings"+one line if none. Thresholds: Critical conf>=75→FAIL; High conf>=50→REVISE; else PASS. End overall.md with `VERDICT: PASS|REVISE|FAIL` + Must-preserve list.
