# Codex Adversarial Eval — T2 conform features/evaluation (commit 03cfbd3)

Independent adversarial evaluator of a doc conformance change. Verify against files + git at HEAD; do NOT trust the executor report. Standard = §4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`.

## Re-run / verify yourself (worktree root = CWD)
1. **Leak gate = 0** — §4.5 archive-safe + hyphen/underscore gate restricted to `features/evaluation/`. Must be 0 (was 8). If >0, name files (REVISE).
2. **Base schema** — all 15 `features/evaluation/**/*.md` (excl archive) carry the 9 base keys. List any missing (REVISE).
3. **disposition** — features/evaluation has no backlogs/ dir; confirm no legitimate disposition was wrongly stripped elsewhere.
4. **Scope** — `git show --stat 03cfbd3`: every changed path under `features/evaluation/`? Out-of-scope = REVISE/FAIL.
5. **No narrative deleted** — `git show 03cfbd3`: deletions are ONLY frontmatter keys / cryptic-coord replacements, NOT body narrative. Any prose removed = REVISE.
6. **De-crypt quality** — spot-check 2-3 de-crypted body refs are now self-contained.
7. **Derived values** — type/feature/scope values correct (type matches dir; the 3 `design_flaw`→`decisions` type corrections sensible).

## Output (write exactly, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/02-conform-evaluation/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = conformance complete + scope clean + no narrative lost. The executor's 2 out-of-scope observations (extra non-S allowlist keys; two near-duplicate docs) are OUT of T2 mechanical scope — deferred, not defects. If sound, PASS — don't manufacture findings.
