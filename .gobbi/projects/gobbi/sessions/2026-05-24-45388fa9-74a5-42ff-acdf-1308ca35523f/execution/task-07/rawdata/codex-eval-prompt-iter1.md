You are an INDEPENDENT adversarial evaluator (Codex) for a documentation defect-fix across 3 surfaces. Do NOT trust the author — verify by reading files.
# CWD = worktree root: /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9 . Write output ONLY under this worktree.
# User-locked direction: the `gobbi mistake promote` CLI does NOT exist. KEEP the two-layer promotion model; the mechanism is agent-driven promotion during the Wrap-up phase (Wrap-up assistant). Both layers happen in Wrap-up. Reconcile "agents never write to project memory" via the Wrap-up sole-writer exception.
# Contract (task T07), commit f2356ca — 4 files:
- `.claude/CLAUDE.md`: lines 48/50 reworded to drop the CLI + keep two-layer model (Wrap-up-phase promotion); line 13 reconciled (was stale `packages/cli/src/specs/` + `gobbi workflow init`; now skills-driven).
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` (= gobbi/SKILL.md): Layer 2 mechanism reworded from `gobbi mistake promote` CLI to Wrap-up-assistant promotion; two-layer model KEPT.
- `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md` (= wrap-up/SKILL.md): ADDED a Layer-2 promotion responsibility (project mistakes → workspace-level skill storage by the Wrap-up assistant). MUST NOT have disturbed the T06 `{session-id}` Path-conventions row.
- backlog `.gobbi/projects/gobbi/backlogs/gobbi-mistake-promote-command-does-not-exist.md`: status+disposition addressed + `## Resolution`.
Out of scope (UNTOUCHED): mistake/SKILL.md (T03 already fixed it — read it for coherence), orchestration/SKILL.md (T02), the 10 T06 sweep rows, the gobbi-hook-authoring skill, the design doc.
# Evaluate 7 perspectives + Overall (docs — Performance/visual-Aesthetics N/A; brief)
Focus: **Project** (all surfaces fixed per contract? backlog addressed?); **Consistency** — CRITICAL: read CLAUDE.md, gobbi/SKILL.md, wrap-up/SKILL.md AND mistake/SKILL.md (T03) and confirm the two-layer model + Wrap-up-agent mechanism is described COHERENTLY across all four (no surface still implies a CLI; no contradiction between "agents never write to project memory" and the Wrap-up sole-writer exception); verify the two-layer model is KEPT (not dropped) in gobbi/SKILL.md; verify the wrap-up Layer-2 addition is consistent with gobbi/SKILL.md's Layer-2 description; **correctness** of the CLAUDE.md line-13 reconcile (is `packages/cli` actually absent? is "governed by the orchestration skill" true? run `ls packages/cli`); **Risk** — scope exactly 4 files; the T06 wrap-up `{session-id}` row is byte-intact (regression). Flag any surface still referencing the nonexistent CLI or any model contradiction.
# Verify yourself
```
cd /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9
git show --stat f2356ca
git diff --name-only f2356ca~1 f2356ca           # exactly 4 files
git diff f2356ca~1 f2356ca                       # inspect for collateral; wrap-up {session-id} row must be untouched
grep -rc 'gobbi mistake promote' .claude/CLAUDE.md .gobbi/projects/gobbi/skills/gobbi/SKILL.md .gobbi/projects/gobbi/skills/wrap-up/SKILL.md   # all 0
grep -cE 'packages/cli|gobbi workflow init' .claude/CLAUDE.md ; ls packages/cli 2>/dev/null || echo "packages/cli absent"
grep -nE 'Layer 1|Layer 2|two-layer|wrap-up|Wrap-up' .gobbi/projects/gobbi/skills/gobbi/SKILL.md
grep -niE 'layer.2|workspace-level|cross-project' .gobbi/projects/gobbi/skills/wrap-up/SKILL.md
grep -c 'Do NOT read .*CLAUDE_CODE_SESSION_ID.* for this value' .gobbi/projects/gobbi/skills/wrap-up/SKILL.md   # 1 (T06 row intact)
grep -nE '^status:|^disposition:|^## Resolution' .gobbi/projects/gobbi/backlogs/gobbi-mistake-promote-command-does-not-exist.md
```
Read mistake/SKILL.md's promotion sections to confirm cross-surface coherence.
# Output (markdown) under worktree: `.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/execution/task-07/evaluation/iter1/codex/` — files project.md, structure.md, performance.md, aesthetics.md, usage.md, consistency.md, risk.md, overall.md. Each finding: Type/Severity/Confidence/Evidence(file+line)/Why/Suggested-direction. "No findings"+one line if none. Thresholds: Critical conf>=75→FAIL; High conf>=50→REVISE; else PASS. End overall.md with `VERDICT: PASS|REVISE|FAIL` + Must-preserve list.
