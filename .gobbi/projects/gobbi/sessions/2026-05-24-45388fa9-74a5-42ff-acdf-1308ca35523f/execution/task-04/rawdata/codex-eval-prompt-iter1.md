You are an INDEPENDENT adversarial evaluator (Codex system) for a new project skill in the gobbi project. Do NOT trust the author's report — verify by reading files and running commands.

# Working directory
CWD = the git worktree root: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9`. All paths relative to it. Write ALL output under this worktree (never the main tree without the `worktrees/chore/session-2026-05-24-45388fa9` segment).

# Contract (task T04 / CL-2), commit `9dbb5da`
Author a NEW project skill `gobbi-hook-authoring` teaching how to author Claude Code hooks, using the two in-tree hooks as N=2 reference witnesses. Three actions:
- (a) Author SKILL.md at staged path `.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/preparation/staging/skills/gobbi-hook-authoring/SKILL.md` from template `.claude/skills/interview/templates/project-skill.md`; ≥4 canonical H2s (Core Principles/Procedures/Constraints/Output paths); cite BOTH `.claude/hooks/session-start.sh` and `.claude/hooks/post-tool-use-agents.sh` by path; M2-compliant (no `{session-id}` path-convention row citing `$CLAUDE_CODE_SESSION_ID`; factual hook-mechanics mentions of CCSI are allowed).
- (b) Promote byte-identical to `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md`.
- (c) Flip backlog `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` status deferred→closed.
Out of scope (must NOT be touched): mistake/SKILL.md, orchestration/SKILL.md, CLAUDE.md, gobbi/SKILL.md, wrap-up/SKILL.md, the 10 sweep skills, `.claude/hooks/**`, any `.claude/skills/` symlink (creating one is explicitly OUT of scope this task — the mirror-sync is tracked separately; do NOT flag its absence as a T04 defect, only optionally as a follow-up).

# Evaluate across 7 perspectives + Overall
Order: Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk, then Overall. Performance/visual-Aesthetics largely N/A for docs — say so briefly. Focus: **Project** (does it fulfil (a)(b)(c)?); **Consistency/correctness** — CRITICAL: read both hook witnesses (`.claude/hooks/session-start.sh`, `.claude/hooks/post-tool-use-agents.sh`) AND the authored skill, and check the skill's described patterns (env-file `@sh` passthrough, agents[] upsert, `flock -x`, matcher strings, stdin payload, settings.json registration) actually MATCH the real hook code — flag any invented/incorrect pattern as a finding; **Usage** (can an author write a correct hook from this doc alone?); **Structure** (template conformance, ≥4 canonical H2s); **Risk** (scope = exactly 3 files; M2 compliance).

# Verify yourself
```
cd /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9
git show --stat 9dbb5da
git diff --name-only 9dbb5da~1 9dbb5da          # must be EXACTLY the 3 in-scope files
test -f .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md && echo OK
grep -cE '^## (Core Principles|Procedures|Constraints|Output paths)' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md   # >=4
grep -cE 'session-start\.sh|post-tool-use-agents\.sh' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md   # >=2
grep -nE 'CLAUDE_CODE_SESSION_ID|\{session-id\}' .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md
diff .gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/preparation/staging/skills/gobbi-hook-authoring/SKILL.md .gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md   # identical
grep -E '^status:' .gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md   # closed
```
Then READ the full skill and BOTH hook scripts to judge factual accuracy.

# Output files (markdown) under the worktree
`.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/execution/task-04/evaluation/iter1/codex/`
Files: `project.md`, `structure.md`, `performance.md`, `aesthetics.md`, `usage.md`, `consistency.md`, `risk.md`, `overall.md`.
Each finding: Type (scenario_gap|checklist_gap|design_flaw|assumption_risk|general), Severity (Critical|High|Medium|Low), Confidence (0|25|50|75|100), Evidence (file+line/quote), Why-it-matters, Suggested-direction. "No findings" + one-line why if none.
Verdict thresholds: any Critical conf≥75 → FAIL; any High conf≥50 → REVISE; else PASS.
End `overall.md` with `VERDICT: PASS|REVISE|FAIL` and a Must-preserve list.
