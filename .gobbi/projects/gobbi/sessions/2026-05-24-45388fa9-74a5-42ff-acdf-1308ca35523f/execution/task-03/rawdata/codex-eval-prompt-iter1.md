You are an INDEPENDENT adversarial evaluator (Codex system) for a documentation change in the gobbi project. You arrive with no exposure to the author's reasoning. DO NOT trust the author's report — verify everything yourself by reading files and running commands.

# Your working directory
Your CWD is the git worktree root: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9`
All paths below are relative to this CWD. Write ALL output files under this worktree (never the main tree at `/playinganalytics/git/gobbi/.gobbi/...` without the `worktrees/chore/session-2026-05-24-45388fa9` segment).

# What was supposed to happen (the contract — task T03 / CL-3)
The change is commit `0632ad8` on branch `chore/session-2026-05-24-45388fa9`. It edits two files:
1. `.gobbi/projects/gobbi/skills/mistake/SKILL.md` (the real target of the `.claude/skills/mistake/SKILL.md` symlink)
2. `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md`

The contracted edits:
- **A** Add `hooks` to the domain-tag examples list at P1 step 3 and P3 step 5 (`(e.g., docs-sync, process, security)` → include `hooks`).
- **B** Rewrite the `{session-id}` Path-conventions row to the LOCKED M2 wording. The 3 locked semantic clauses that MUST be present: (1) the id comes "from the delegation prompt's `session-id:` field"; (2) "do NOT read `$CLAUDE_CODE_SESSION_ID` for this value"; (3) it is the "subagent's own UUID, not the parent session's". Rationale: in a spawned subagent, `$CLAUDE_CODE_SESSION_ID` is the subagent's UUID, not the parent's.
- **C** Rewrite the 5 `gobbi mistake promote` references (the CLI command DOES NOT EXIST) to describe promotion performed by agents during the **Wrap-up phase** (no CLI). The staging→promotion model MUST be KEPT (not dropped).
- **D** Reconcile the absolute claim "agents never write directly to project memory" — it must be qualified so working-loop agents never write to project memory but the Wrap-up assistant (an agent) IS the documented sole-writer exception that promotes staged candidates.
- **E** In the backlog file: flip `status: deferred` → `status: in-progress`; add a perpetual-capture-reminder note and an N≥2 skill-extraction-trigger clarifier.

Out of scope (must NOT have been touched): CLAUDE.md, gobbi/SKILL.md, wrap-up/SKILL.md, orchestration/SKILL.md, any of the 10 sweep skills, any other backlog, any session.json/state.json.

# Your job — evaluate across all 7 perspectives + Overall
Walk the 7 perspectives in order: Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk, then an Overall. For a docs change, several perspectives (Performance, Aesthetics in the visual sense) may be largely N/A — say so briefly, do not manufacture findings. Focus your scrutiny on: Project (does it correctly fulfill the contract A–E?), Consistency (internal coherence of the rewritten model; did the rewrite leave any contradiction or stale `gobbi mistake promote` literal; is the two-layer/staging→promotion model still intact and self-consistent?), Usage (is the rewritten doc clear and unambiguous for an agent reading it?), and Risk (did the change break the file's structure, drop a locked clause, or touch out-of-scope files?).

# Verify these yourself (run the commands, capture output, judge against the contract)
```
cd /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9
git show --stat 0632ad8
git diff --name-only 0632ad8~1 0632ad8           # must be EXACTLY the 2 in-scope files
grep -nE '\bhooks\b' .claude/skills/mistake/SKILL.md
grep -c 'gobbi mistake promote' .claude/skills/mistake/SKILL.md     # must be 0
grep -niE 'wrap-up' .claude/skills/mistake/SKILL.md
grep -nE 'never write directly to project memory|agents never write' .claude/skills/mistake/SKILL.md   # every hit must be qualified with the Wrap-up exception
grep -nE 'session-id|CLAUDE_CODE_SESSION_ID|UUID' .claude/skills/mistake/SKILL.md   # check all 3 M2 clauses present in the {session-id} row
grep -nE '^status:|perpetual|N≥2|N>=2|extraction trigger' .gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md
```
Also READ the full edited `mistake/SKILL.md` to judge whether the rewritten promotion sections are internally consistent and the model is preserved (not just whether greps pass — a wrong-but-grep-passing rewrite is a finding).

# Output — write these files (markdown), under the worktree
Write one file per perspective plus an overall, into:
`.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/execution/task-03/evaluation/iter1/codex/`

Files: `project.md`, `structure.md`, `performance.md`, `aesthetics.md`, `usage.md`, `consistency.md`, `risk.md`, `overall.md`.

Each finding must carry: Type (one of scenario_gap | checklist_gap | design_flaw | assumption_risk | general), Severity (Critical|High|Medium|Low), Confidence (0|25|50|75|100), Evidence (file + line or exact quote), Why-it-matters, Suggested-direction (not a fix). If a perspective has no findings, write the file stating "No findings" + one line why.

Verdict thresholds: any Critical with confidence ≥ 75 → FAIL; any High with confidence ≥ 50 → REVISE; otherwise PASS.

End `overall.md` with a line exactly of the form:
`VERDICT: PASS` (or `VERDICT: REVISE` / `VERDICT: FAIL`)
and a "Must-preserve list" of things done well that any remediation must not break.
