# Codex Adversarial Eval — title-de-crypt sweep, 18 docs (commit 6ba07a1)

Independent adversarial evaluator. Verify against files + git at HEAD; do NOT trust the executor report. This sweep made in-doc TITLES/HEADINGS concept-first per §4.1 of `.gobbi/projects/gobbi/skills/memorization/rules.md`, across 18 already-conformed docs in features/{agents,git-workflow,install-runtime}. It resolves T6's REVISE (install-runtime titles) + a T1/T3/T4 consistency gap.

## Re-run / verify yourself (worktree root = CWD)
1. **Gate = 0 cryptic-led headings** — `grep -rlE '^#{1,3} +(T[0-9]|D-[0-9]|W[0-9]-T|COD-|F-[A-Z]|iter[0-9]|CP-)' features/agents features/git-workflow features/install-runtime --include='*.md' | grep -v /archive/` returns NOTHING. (A code in a `## Source` footer or parenthetical-after-concept is fine; the gate is about headings LEADING with a bare code.) >0 = REVISE.
2. **Scope** — `git show --stat 6ba07a1`: only (a subset of) the 18 contracted files? Any out-of-scope file = REVISE/FAIL.
3. **Headings-only** — `git show 6ba07a1`: every changed line is a heading (`#`/`##`/`###`) line (or an added `## Source` footer). NO frontmatter changes, NO body prose paragraph changes, NO section restructuring. If body/frontmatter changed = REVISE.
4. **Concept-first quality** — spot-check 4-5 rewritten headings: does each name the SUBJECT understandably to a zero-context reader? Any heading still opaque or now misleading?
5. **Traceability preserved** — design codes (D-*) kept (parenthetical or footer); session task codes (T1/T04/W3-T*) dropped only where they were pure session coordinates with no cross-ref value. Any meaningful code lost?

## Output (write exactly, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/06b-title-decrypt-sweep/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = 0 cryptic-led headings + scope clean + headings-only + concept-first + no meaningful code lost. If sound, PASS — don't manufacture findings.
