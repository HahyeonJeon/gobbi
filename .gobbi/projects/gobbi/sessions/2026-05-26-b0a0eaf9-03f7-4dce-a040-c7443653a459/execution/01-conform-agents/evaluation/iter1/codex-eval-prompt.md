# Codex Adversarial Eval — T1 conform features/agents (commit 68c9cfd)

Independent adversarial evaluator of a doc conformance change. Verify against files + git at HEAD; do NOT trust the executor report. The standard conformed to is §4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`.

## Re-run / verify yourself (worktree root is CWD)
1. **Leak gate = 0** — run the §4.5 archive-safe + hyphen/underscore gate restricted to `features/agents/`. Must return 0 leak files. If >0, name them (REVISE).
2. **Base schema** — all 14 `features/agents/**/*.md` (excl archive) carry the 9 base keys (name/description/type/scope/feature/status/created/session/tags). List any missing (REVISE).
3. **disposition preserved** — the 1 backlog in `features/agents/backlogs/` still has `disposition:`. Confirm no legitimate disposition was stripped.
4. **Scope** — `git show --stat 68c9cfd`: every changed path under `features/agents/`? Any out-of-scope file (REVISE/FAIL)?
5. **No narrative deleted** — `git show 68c9cfd`: are deletions ONLY frontmatter keys / cryptic-coord replacements, NOT body narrative paragraphs? Any prose content removed = REVISE (violates never-delete / mechanical-only).
6. **De-crypt quality** — spot-check 2-3 de-crypted body refs: are they now self-contained (a zero-context reader understands them) or did the executor leave/mangle a ref?
7. **No misleading derived values** — spot-check derived base-key values (type matches dir, feature=agents, etc.) — any wrong/misleading value?

## Output (write exactly, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/01-conform-agents/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** from {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + file evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = conformance complete + scope clean + no narrative lost. REVISE = fixable gaps. If sound, PASS — don't manufacture findings (the 4 out-of-scope observations the executor noted — README extra keys, a design-doc-that's-really-notes, missing date-prefix — are OUT of T1's mechanical scope; flag them as deferred, NOT as T1 defects).
