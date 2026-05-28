# Codex Adversarial Eval — residue-completion (commit 720ae9d): add phase/loop-iter/sub-step/session-id to S + strip from 16 docs

Independent adversarial evaluator. Verify against files + git at HEAD; diff the commit yourself (do NOT trust the report). Standard = §4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`.

## Verify yourself (worktree root = CWD)
1. **Standard final** — `git show 720ae9d -- rules.md`: §4.4 S-set now also lists phase/loop-iter/sub-step/session-id (joining task/loop/scenario/iter/slug/finding_source); §4.5 gate regex matches them; archive-safe + all prior keys kept; §1-3 + KEEP list untouched.
2. **Residue gone** — `grep -rlE '^(phase|loop-iter|sub-step|session-id):' features/{agents,evaluation,git-workflow,guardrails,install-runtime} --include='*.md' | grep -v /archive/` = EMPTY.
3. **Full gate = 0** — §4.5 gate (all keys) over the 5 conformed features (archive-safe) = 0.
4. **CRITICAL — no KEEP key stripped:** `git show 720ae9d` — every `-` frontmatter line in the 16 docs is one of phase/loop-iter/sub-step/session-id ONLY. NO related/supersedes/superseded_by/source/design-id/domain/priority/ref_type/title/accessed/verdict/decision_status/shipped_in/value_proposition/discussion-id/topic/outcome/base key removed. (discussion-id is KEEP — confirm it survived.)
5. **No body touched** — all changes frontmatter-line deletions (+ rules.md); no body prose in the 16 docs.
6. **Scope** — `git show --stat 720ae9d`: exactly rules.md + 16 docs.

## Output (write exactly, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/07d-residue-completion/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = standard final + residue gone + gate 0 + ZERO KEEP key stripped + no body + scope clean. (Pre-existing residue in out-of-scope workflow/project-memory is NOT a defect — that's T9's scope.) If sound, PASS — don't manufacture findings.
