# Codex Adversarial Eval — T9c RE-RUN (commit c001694, ON the chore branch)

Independent adversarial evaluator. Diff/inspect yourself; do NOT trust reports. Standard = §4 (finalized) of `.gobbi/projects/gobbi/skills/memorization/rules.md`. The prior T9c attempt (14041db) committed to develop by mistake and was discarded; this re-run (c001694) is on the worktree chore branch. T9c scope = project-tier `{references,reviews,rules,plans,mistakes}/*.md` (maxdepth 1) + `features/README.md` + `README.md`.

## Verify yourself (worktree root = CWD)
1. **Commit on correct branch:** `git -C /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6 rev-parse --abbrev-ref HEAD` = chore/session-2026-05-25-a10c82d6; `git log --oneline -1 c001694` is on this branch (HEAD~1 = cedd0cd). NOT on develop. If on wrong branch = FAIL.
2. **§4.5 full gate = 0** over T9c scope (archive-safe, all S keys).
3. **Base schema** — all T9c-scope docs carry 9 base keys.
4. **features/README scope** = `scope: project` (the prior attempt's defect — verify fixed).
5. **0 cryptic-led titles** (§1.3 anti-patterns incl Item/Task/iterN/Mistake-Candidate/"Mistake —"/COD-/CP-/F-/LOCK + parenthetical iterN like "(addressed in iter2)") over the scope = empty.
6. **CRITICAL — no KEEP key stripped:** diff `git show c001694`; every removed frontmatter line is S-set ONLY. NO KEEP key (related/supersedes/superseded_by/source/design-id/domain/priority/ref_type/title/accessed/verdict/review_kind/subject/decision_status/shipped_in/value_proposition/discussion-id/topic/outcome/category/subsystems/project/last_updated/project-scope/plan) removed.
7. **No body reshaping; mistakes intact** — the mistake docs' bodies unchanged; none deleted; supersede-not-delete honored.
8. **Scope** — only T9c-scope paths changed.

## Output (write to ABSOLUTE path)
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6/.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/09c-conform-project-tier-remainder/evaluation/iter2/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = commit on chore branch + gate 0 + base keys + features/README scope:project + 0 cryptic titles + ZERO KEEP stripped + no reshaping + mistakes intact + scope clean. If sound, PASS.
