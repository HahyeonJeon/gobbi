# Codex Adversarial Eval — T6 conform install-runtime {discussions,design,decisions,changelogs} (commit 9f8562c)

Independent adversarial evaluator. Verify against files + git at HEAD; do NOT trust the executor report. Standard = §4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`. T6 = those 4 subdirs only (T7 does checklists/scenarios/references/backlogs/README).

## Re-run / verify yourself (worktree root = CWD)
1. **Leak gate = 0** — §4.5 archive-safe + HYPHEN/UNDERSCORE gate restricted to `features/install-runtime/{discussions,design,decisions,changelogs}/`. Must be 0. Confirm the underscore spellings (promoted_from etc.) are caught. >0 = REVISE.
2. **Base schema** — all 24 docs in those 4 subdirs carry 9 base keys. List missing.
3. **Scope** — `git show --stat 9f8562c`: every changed path under the 4 subdirs? T7 subdirs untouched? Out-of-scope = REVISE/FAIL.
4. **No body section reshaping (the key probe, learned from T5):** `git show 9f8562c` — confirm the executor did ONLY frontmatter changes + INLINE coord de-crypt, and did NOT re-order/rename body SECTION headings to the §4.2 per-type contract. If body sections were restructured (ADR→template etc.), that's prose-wave scope-creep → REVISE/Medium-High.
5. **No narrative deleted** — deletions are ONLY frontmatter keys / inline-coord replacements, not body prose.
6. **No non-S key wrongly dropped** — `related:`/`discussion-id`/`session-id` etc. (non-S) preserved (executor was told to leave them). Dropping a non-S key = a finding.
7. De-crypt quality: spot-check 3 inline de-crypts self-contained. The `type: decisions-log`→`decisions` normalization sensible?

## Output (write exactly, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/06-conform-install-runtime-a/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = conformance complete + scope clean + no body reshaping + no narrative/non-S-key lost. If sound, PASS — don't manufacture findings.
