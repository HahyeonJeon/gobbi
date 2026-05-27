# Codex Adversarial Eval — T8 conform features/project-memory (commits 54c0cde conform + dbe61c3 KEEP-key restore)

Independent adversarial evaluator. Evaluate the CURRENT state of features/project-memory at HEAD (T8 conform 54c0cde + manager KEEP-restore dbe61c3). Diff/inspect yourself; do NOT trust reports. Standard = §4 (finalized) of `.gobbi/projects/gobbi/skills/memorization/rules.md`.

## Verify yourself (worktree root = CWD)
1. **Full §4.5 gate = 0** over features/project-memory (archive-safe, all S keys hyphen+underscore: finding-id/confidence/severity/surfaced-by/promoted-from/at/addressed-by/mistake-candidate + task/loop/scenario/iter/slug/finding_source/phase/loop-iter/sub-step/session-id + disposition-on-non-backlog). Was 3.
2. **Base schema** — all 4 docs carry the 9 base keys.
3. **0 cryptic-led titles** in the 4: `grep -rlE '^#{1,3} +(T[0-9]|D-[0-9]|W[0-9]-T|COD-|F-[A-Z]|iter[0-9]|CP-)'` = empty.
4. **KEEP keys present** — `project` + `last_updated` were over-stripped by T8 and RESTORED in dbe61c3; verify they're PRESENT now (README has project+last_updated; decisions has project). Confirm no OTHER KEEP key (related/supersedes/superseded_by/source/design-id/domain/priority/ref_type/title/accessed/verdict/decision_status/shipped_in/value_proposition/discussion-id/topic/outcome/category/subsystems) is missing vs the pre-T8 baseline (54c0cde^).
5. **No body reshaping** — body SECTIONS not re-ordered/renamed to §4.2 across the T8 changes (inspect `git show 54c0cde`).
6. **No narrative deleted** — any removed body section relocated to ## Source, not vanished.
7. **Scope** — only features/project-memory/ paths changed (+ allowed rawdata note).

## Output (write exactly, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/08-conform-project-memory/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = gate 0 + base keys + 0 cryptic titles + KEEP keys present (incl restored project/last_updated) + no reshaping + no narrative lost + scope clean. If sound, PASS — don't manufacture findings.
