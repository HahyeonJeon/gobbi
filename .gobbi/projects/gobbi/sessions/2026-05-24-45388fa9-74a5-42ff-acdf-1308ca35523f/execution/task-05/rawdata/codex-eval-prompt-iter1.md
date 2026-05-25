You are an INDEPENDENT adversarial evaluator (Codex) for a NEW design doc. Do NOT trust the author — verify by reading files.

# CWD = worktree root
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9 . Write ALL output ONLY under this worktree (never the main tree).

# Contract (task T05 / CL-4), commit ecb1a5e
CREATE `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` from template `.claude/skills/memorization/templates/design.md`, with 5 H2 sections: `## Problem`, `## Approach`, `## Surfaces`, `## Validation`, `## Lessons`. Lessons must be non-empty (>100 bytes) AND contain an inline shallow-by-design note (phrase like "intentionally sparse"/"authored before Wrap-up"/"shallow-by-design-per-DL-1") per DL-1 (β-1: this session self-counts as N=2, so Lessons is deliberately shallow now). Plus flip backlog `.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md` status deferred→closed.
Out of scope (must NOT be touched): any session.json/state.json, any other backlog, any skill file, the gobbi-hook-authoring skill, the bundle-B memorials.

# Evaluate 7 perspectives + Overall (docs — Performance/visual-Aesthetics N/A; say so briefly)
Focus: **Project** (does it fulfil the contract — 5 sections, Lessons + shallow note, backlog closed, 2-file scope?); **Consistency/correctness** — CRITICAL: do the doc's factual claims about the worktree model MATCH the real sources? Read `.claude/skills/orchestration/SKILL.md` (Step 1 rows 5/5.5/6, Direct-mode opt-out, smoke-test gate + branch regex) and `.claude/skills/git/SKILL.md` (Memory Access Matrix "Critical rule — write paths"; P2; P5) and check the doc's Approach/Surfaces/Validation claims are accurate (e.g. the branch regex, worktreePath-as-root rule, row 5.5-before-state.json ordering, direct-mode opt-out). Flag any invented/incorrect claim. **Usage** (is it clear/useful as a design doc?); **Structure** (template conformance, 5 sections); **Risk** (scope = exactly 2 files).

# Verify yourself
```
cd /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9
git show --stat ecb1a5e
git diff --name-only ecb1a5e~1 ecb1a5e               # must be EXACTLY the 2 in-scope files
grep -nE '^## (Problem|Approach|Surfaces|Validation|Lessons)' .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md   # >=5
awk '/^## Lessons/{f=1;next} /^## /{f=0} f{print}' .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md | wc -c    # >100
grep -cE 'shallow-by-design-per-DL-1|intentionally sparse|authored before Wrap-up' .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md   # >=1
grep -E '^status:' .gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md   # closed
```
Then READ the full doc + the orchestration/git skills to judge factual accuracy of its claims.

# Output (markdown) under worktree
`.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/execution/task-05/evaluation/iter1/codex/`
Files: `project.md`,`structure.md`,`performance.md`,`aesthetics.md`,`usage.md`,`consistency.md`,`risk.md`,`overall.md`. Each finding: Type(scenario_gap|checklist_gap|design_flaw|assumption_risk|general), Severity, Confidence(0|25|50|75|100), Evidence(file+line), Why-it-matters, Suggested-direction. "No findings"+one line if none.
Thresholds: Critical conf≥75→FAIL; High conf≥50→REVISE; else PASS. End overall.md with `VERDICT: PASS|REVISE|FAIL` + Must-preserve list.
