# Codex Adversarial Eval — S-set extension + residue sweep (commit 5630aa4)

Independent adversarial evaluator. Verify against files + git at HEAD; do NOT trust the executor report — diff the commit yourself (a prior eval false-PASSed by trusting a report). Two parts: (A) §4.4/§4.5 of `.gobbi/projects/gobbi/skills/memorization/rules.md` amended to add session-routing-residue keys (task/loop/scenario/iter/slug/finding_source) to set S; (B) those keys stripped from 31 already-conformed docs across agents/git-workflow/guardrails/install-runtime.

## Re-run / verify yourself (worktree root = CWD)
1. **Standard amended** — `git show 5630aa4 -- .gobbi/projects/gobbi/skills/memorization/rules.md`: §4.4 S-set now lists task/loop/scenario/iter/slug/finding[-_]source (both spellings); §4.5 gate regex extended to match them; archive-safe retained. §1-3 + the rest of §4 untouched.
2. **Residue gone** — `grep -rlE '^(task|loop|scenario|iter|slug|finding_source):' features/{agents,evaluation,git-workflow,guardrails,install-runtime} --include='*.md' | grep -v /archive/` = EMPTY. >0 = REVISE.
3. **Extended gate = 0** — run the §4.5 gate (now with the new keys) over all 5 conformed features (archive-safe). = 0.
4. **CRITICAL — no legit key stripped:** `git show 5630aa4` — confirm ONLY the residue keys (task/loop/scenario/iter/slug/finding_source) were removed. NO `related`/`supersedes`/`superseded_by`/`source`/`design-id`/`domain`/`priority`/`ref_type`/base-key was dropped. Diff the deletions: every `-` frontmatter line is a residue key. If any legit/cross-ref/provenance/supersession key was deleted = REVISE/High (this is the failure mode from the prior task).
5. **No body touched** — `git show 5630aa4`: all changes are frontmatter-line deletions (+ rules.md). NO body prose lines changed in the 31 docs. Any body change = REVISE.
6. **Base schema intact** — spot-check 3 swept docs still carry all 9 base keys.
7. **Scope** — `git show --stat 5630aa4`: exactly rules.md + 31 feature docs. Any other file = REVISE/FAIL.

## Output (write exactly, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/07c-sset-extension-residue-sweep/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = standard amended correctly + residue gone + gate 0 + ZERO legit key stripped + no body touched + scope clean. If sound, PASS — don't manufacture findings.
