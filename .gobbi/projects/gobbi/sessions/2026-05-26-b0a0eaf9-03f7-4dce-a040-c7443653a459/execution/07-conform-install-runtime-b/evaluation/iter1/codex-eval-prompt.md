# Codex Adversarial Eval — T7 conform install-runtime remaining 20 docs (commit 6f9dbf9)

Independent adversarial evaluator. Verify against files + git at HEAD; do NOT trust the executor report. Standard = §4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`. T7 = install-runtime subdirs EXCEPT discussions/design/decisions/changelogs (T6) + README. Cumulative gate covers whole 44-doc feature. NOTE: title/heading de-crypt is now IN conformance scope (user-ratified).

## Re-run / verify yourself (worktree root = CWD)
1. **Cumulative leak gate = 0** — §4.5 archive-safe + hyphen/underscore over ALL `features/install-runtime/` (44 docs). Must be 0. Confirm underscore caught. >0 = REVISE.
2. **Base schema** — all 44 carry 9 base keys. List missing.
3. **disposition** — the 7 backlogs preserve `disposition:`; non-backlog files none.
4. **Title gate** — 0 cryptic-led titles/headings in T7's 20 files: `grep -rlE '^#{1,3} +(T[0-9]|D-[0-9]|W[0-9]-T|COD-|F-[A-Z]|iter[0-9]|CP-)'` over the 20. =0.
5. **Scope** — `git show --stat 6f9dbf9`: only T7's 20 paths (backlogs/checklists/scenarios/references + README); T6 subdirs untouched.
6. **No body section reshaping** — `git show 6f9dbf9`: only frontmatter + inline-coord + heading-line changes; body SECTIONS not re-ordered/renamed to §4.2. Reshaping = REVISE.
7. **No narrative deleted; no non-S key dropped** (related: kept). De-crypt quality spot-check 3.

## Output (write exactly, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/07-conform-install-runtime-b/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = cumulative gate 0 + 44 base keys + disposition preserved + 0 cryptic titles + scope clean + no body reshaping + no content lost. If sound, PASS — don't manufacture findings.
