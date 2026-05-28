# Codex Adversarial Eval — T9c conform project-tier remainder (commit 14041db)

Independent adversarial evaluator. Diff/inspect yourself; do NOT trust reports. Standard = §4 (finalized, incl §4.4 KEEP list + §1.3 anti-patterns + §2.1 scope/feature) of `.gobbi/projects/gobbi/skills/memorization/rules.md`. T9c = project-tier `{references,reviews,rules,plans,mistakes}/*.md` (maxdepth 1) + `features/README.md` + `README.md` (28 docs at HEAD).

## Verify yourself (worktree root = CWD; re-cd every call)
1. **§4.5 full gate = 0** over the T9c scope (archive-safe, all S keys hyphen+underscore).
2. **Base schema** — all T9c-scope docs carry 9 base keys.
3. **scope/feature per §2.1** — docs are `scope: project`; `feature:` non-null is OK when feature-bound (do NOT flag feature-bound mistakes with a feature slug as errors); flag only a doc with scope:feature or a clearly-wrong feature value.
4. **0 cryptic-led titles** — use §1.3 anti-patterns: `grep -rnE '^(#{1,3} +|title: "?)(Item [0-9]|T[0-9]|Task [0-9]|D-[0-9]|d-[0-9]|step-[0-9]|row-[0-9]|W[0-9]-T|COD-|F-[A-Z]|iter[0-9]|CP-|LOCK)'` over the scope = empty.
5. **CRITICAL — no KEEP key stripped:** diff `git show 14041db`; every removed frontmatter line is an S-set key ONLY. NO KEEP key (related/supersedes/superseded_by/source/design-id/domain/priority/ref_type/title/accessed/verdict/review_kind/subject/reviewer/reviewed_artifact/overall_verdict/perspectives/decision_status/shipped_in/value_proposition/discussion-id/topic/outcome/category/subsystems/project/last_updated/project-scope/plan/related_decisions/related_reports) removed. Per "when in doubt KEEP".
6. **No body reshaping; no mistake/narrative deleted** — esp. the 26 mistakes: bodies (What/Why/Recognize/Corrected) fully intact, none deleted/superseded-without-pointer.
7. **Scope** — only T9c-scope paths changed.

## Output (write to ABSOLUTE path)
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6/.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/09c-conform-project-tier-remainder/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = gate 0 + base keys + correct scope/feature + 0 cryptic titles + ZERO KEEP stripped + no reshaping + mistakes intact + scope clean. If sound, PASS.
