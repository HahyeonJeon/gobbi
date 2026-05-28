# Codex Adversarial Eval — T5 conform features/guardrails (commit 8e6ae25)

Independent adversarial evaluator. Verify against files + git at HEAD; do NOT trust the executor report. Standard = §4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`.

## Re-run / verify yourself (worktree root = CWD)
1. **Leak gate = 0** — §4.5 archive-safe + hyphen/underscore gate over `features/guardrails/`. Must be 0 (was 5). >0 = REVISE.
2. **Base schema** — all 10 `features/guardrails/**/*.md` (excl archive) carry 9 base keys. List missing.
3. **disposition** — 3 backlogs preserve `disposition:`; non-backlog files have none.
4. **Scope** — `git show --stat 8e6ae25`: all changed paths under `features/guardrails/`? Out-of-scope = REVISE/FAIL.
5. **CRITICAL — backlog body reformatting (the key probe):** the executor reformatted 3 backlog bodies (`goodhart-factor-when-demanded-deferred.md`, `hook-event-count-31-vs-29-docs-sync.md`, `posttooluse-failure-webfetch-verification-gap.md`) from ADR-shape (## Decision/Rationale/Alternatives/Consequences) to the backlogs-template shape (## Context/Why deferred/When to pick up/Suggested approach/Originating session), claiming "reorganized not deleted." VERIFY via `git show 8e6ae25`: did the reformatting LOSE any decision rationale / alternatives / consequences content? Is reorganizing section STRUCTURE within "mechanical de-crypt" scope, or is it prose-wave restructuring that overstepped T5's mechanical bound (scope-creep)? This is the main thing to judge — be strict: if rationale was dropped = REVISE/High; if it's a faithful reorg with all content preserved but arguably over-scope, note severity per your judgment.
6. **No narrative deleted** elsewhere; de-crypt quality on 2-3 refs self-contained.

## Output (write exactly, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/05-conform-guardrails/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = conformance complete + scope clean + no content lost + the backlog reformat preserved all rationale. The `references/ related:`-in-frontmatter obs is OUT of T5 mechanical scope (deferred). If sound, PASS — don't manufacture findings.
