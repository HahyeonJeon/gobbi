# Codex Adversarial Eval — T9a conform features/workflow (commit 1287e88)

Independent adversarial evaluator. Diff/inspect yourself; do NOT trust reports. Standard = §4 (finalized) of `.gobbi/projects/gobbi/skills/memorization/rules.md`. T9a = features/workflow EXCLUDING features/workflow/archive/.

## Verify yourself (worktree root = CWD)
1. **Full §4.5 gate = 0** over features/workflow (ARCHIVE-SAFE `-not -path '*/archive/*'`, all S keys incl session-routing residue hyphen+underscore). Was 19.
2. **Base schema** — all 26 non-archive docs carry 9 base keys.
3. **disposition** — the 1 backlog preserves disposition; non-backlog none.
4. **0 cryptic-led titles/headings** in the 26.
5. **Scope** — `git show --stat 1287e88`: only NON-archive features/workflow/ paths. NO archive doc touched. NO other feature.
6. **No body reshaping** — `git show 1287e88`: body SECTIONS not re-ordered/renamed to §4.2; only frontmatter + inline-coord + heading-line changes.
7. **CRITICAL — no KEEP key stripped:** diff the deletions; every removed frontmatter line is an S-set key ONLY (finding-id/confidence/severity/surfaced-by/promoted-from/at/addressed-by/addressed-in/mistake-candidate/finding-source/task/loop/scenario/iter/slug/phase/loop-iter/sub-step/session-id + disposition-on-non-backlog). NO related/supersedes/superseded_by/source/design-id/domain/priority/ref_type/title/accessed/verdict/decision_status/shipped_in/value_proposition/discussion-id/topic/outcome/category/subsystems/project/last_updated/project-scope/plan removed. Any KEEP key stripped = REVISE/High.

## Output (write exactly, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/09a-conform-workflow/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = gate 0 + 26 base keys + disposition + 0 cryptic titles + scope clean (no archive) + no reshaping + ZERO KEEP key stripped. If sound, PASS.
