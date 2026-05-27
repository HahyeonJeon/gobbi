# Codex Adversarial Eval — T3 conform git-workflow {discussions,design,decisions} (commit 2d01316)

Independent adversarial evaluator of a doc conformance change. Verify against files + git at HEAD; do NOT trust the executor report. Standard = §4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`. T3 covers ONLY 3 subdirs (T4 does the rest of git-workflow — do not fault T3 for untouched subdirs).

## Re-run / verify yourself (worktree root = CWD)
1. **Leak gate = 0** — §4.5 archive-safe + hyphen/underscore gate restricted to `features/git-workflow/{discussions,design,decisions}/`. Must be 0. >0 = REVISE.
2. **Base schema** — all 20 docs in those 3 subdirs carry the 9 base keys. List any missing.
3. **Scope** — `git show --stat 2d01316`: every changed path under `features/git-workflow/{discussions,design,decisions}/`? Anything in other subdirs or features = REVISE/FAIL.
4. **No narrative deleted** — `git show 2d01316`: the -334 deletions are ONLY frontmatter keys / cryptic-coord replacements, NOT body narrative paragraphs. Any prose content lost = REVISE.
5. **De-crypt quality** — spot-check 3-4 de-crypted body refs (the executor claims 15+) are now self-contained.
6. **Type corrections** — 2 decisions docs had design_flaw/checklist_gap → decisions; sensible? Any wrong derived value?
7. **related-frontmatter repoint** — one design doc's `related:` was repointed from session-internal to feature-memory paths; confirm the new targets are reasonable (not a fabricated path).

## Output (write exactly, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/03-conform-git-workflow-a/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = conformance complete + scope clean + no narrative lost. If sound, PASS — don't manufacture findings.
