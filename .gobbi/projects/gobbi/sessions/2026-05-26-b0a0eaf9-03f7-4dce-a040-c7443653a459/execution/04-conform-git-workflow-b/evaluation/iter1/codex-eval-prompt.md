# Codex Adversarial Eval — T4 conform git-workflow remaining 21 docs (commit 33340be)

Independent adversarial evaluator. Verify against files + git at HEAD; do NOT trust the executor report. Standard = §4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`. T4 = git-workflow subdirs EXCEPT discussions/design/decisions (T3 did those) + README. Cumulative gate covers the whole 41-doc feature.

## Re-run / verify yourself (worktree root = CWD)
1. **Cumulative leak gate = 0** — §4.5 archive-safe + hyphen/underscore gate over ALL of `features/git-workflow/` (41 docs, T3+T4). Must be 0. >0 = REVISE (name files).
2. **Base schema** — all 41 `features/git-workflow/**/*.md` (excl archive) carry the 9 base keys. List missing.
3. **disposition preserved** — the 3 backlogs in features/git-workflow/backlogs/ still have `disposition:`; non-backlog files have NONE.
4. **Scope** — `git show --stat 33340be`: changed paths only in T4 subdirs {backlogs,changelogs,checklists,plans,references,scenarios} + README (+ a rawdata session note, which is fine). NO discussions/design/decisions re-touch. Out-of-scope feature edits = REVISE/FAIL.
5. **No narrative deleted** — `git show 33340be`: the -204 deletions are ONLY frontmatter keys / cryptic-coord replacements, NOT body narrative. Any prose lost = REVISE.
6. **De-crypt quality** — spot-check 3 de-crypted refs self-contained.
7. **references type migration** — `type:`→`ref_type:` + `type: references` base; sensible / not lossy?

## Output (write exactly, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/04-conform-git-workflow-b/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = cumulative gate 0 + all 41 base keys + scope clean + no narrative lost. The other-feature leaks (install-runtime/workflow/guardrails/etc.) the executor noted are OUT of T4 scope (later tasks) — NOT T4 defects. If sound, PASS — don't manufacture findings.
