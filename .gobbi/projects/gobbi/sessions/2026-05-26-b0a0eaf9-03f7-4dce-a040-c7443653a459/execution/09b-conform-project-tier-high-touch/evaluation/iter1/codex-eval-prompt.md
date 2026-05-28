# Codex Adversarial Eval — T9b conform 35 project-tier docs (commit 2e24dfe)

Independent adversarial evaluator. Diff/inspect yourself; do NOT trust reports. Standard = §4 (finalized, incl §4.4 KEEP list) of `.gobbi/projects/gobbi/skills/memorization/rules.md`. T9b = project-tier `{decisions,design,learnings,notes,backlogs}/*.md` (maxdepth 1; NOT features/, NOT references/reviews/rules/plans/mistakes which are T9c).

## Verify yourself (worktree root = CWD; re-cd every call)
1. **§4.5 full gate = 0** over the 5 project-tier dirs (maxdepth 1, archive-safe, all S keys hyphen+underscore). Was 10.
2. **Base schema** — all 35 docs carry 9 base keys.
3. **scope/feature values** — project-tier docs are PROJECT-scoped: verify `scope: project` (NOT `scope: feature`) and `feature: null` (or absent feature value) on these docs. A project-tier doc with `scope: feature` is a conformance error. (This is the one judgment the executor flagged — check it.)
4. **disposition** — backlog files preserve/carry disposition; non-backlog (decisions/design/learnings/notes) have none.
5. **0 cryptic-led titles** (broadened incl LOCK/Task) over the 5 dirs.
6. **CRITICAL — no KEEP key stripped:** diff `git show 2e24dfe`; every removed frontmatter line is an S-set key ONLY (task/slug/loop/promoted-from/at/etc.). NO KEEP key (related/supersedes/superseded_by/source/design-id/domain/priority/ref_type/title/accessed/verdict/decision_status/shipped_in/value_proposition/discussion-id/topic/outcome/category/subsystems/project/last_updated/project-scope/plan/artifact_ref/anchor_session/date/pr/commit) removed. Per "when in doubt KEEP", non-S non-base keys must be KEPT.
7. **No body reshaping; no narrative deleted** — esp. notes/ session journals: their body narrative must be fully intact.
8. **Scope** — only the 5 project-tier dirs' top-level .md changed; no features/, no T9c dirs.

## Output (write to ABSOLUTE path)
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6/.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/09b-conform-project-tier-high-touch/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = gate 0 + base keys + correct scope:project/feature:null + disposition + 0 cryptic titles + ZERO KEEP key stripped + no reshaping + notes narrative intact + scope clean. If sound, PASS.
