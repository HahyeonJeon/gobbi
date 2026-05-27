# Codex Adversarial Evaluation — Planning Artifact iter2 (gobbi memory-doc refactor, 25-task plan)

You are an independent adversarial evaluator. Do NOT trust claims; verify against the real repo at HEAD with your own grep/find. iter1 was REVISE (5 findings); iter2 remediates. Confirm each finding is GENUINELY closed AND do a fresh pass.

Primary artifact: `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/planning/rawdata/draft-iter2.md`
iter1 (for diff): `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/planning/rawdata/draft-iter1.md`
iter1 findings: `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/planning/evaluation/iter1/{claude,codex}/`
Locked Idea/scope: `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/artifacts/` (D6/FIX-1, D10 archive-exclusion)

## Verify each iter1 finding CLOSED (re-run, don't trust)
1. **Archive-glob leak** — does every `**` glob task now exclude archive (both `files:` and `verifies`)? Re-check: would ANY task edit `features/*/archive/` docs? (7 frozen docs: 2 content + 5 READMEs.) Spot-check T9a/P6/N1 + the others.
2. **Prose over-budget** — are P3/P5/P7 split so every prose task ≤~35 docs? Re-count each prose task's doc set. New total should be 25.
3. **Underscore staging keys** — does the conformance gate key-set now include underscore spellings (`promoted_from`/`promoted_at`)? Re-run: `grep -rlE '^(promoted_from|promoted_at):' features/install-runtime --include='*.md' | grep -v /archive/ | wc -l` should be 5; confirm the gate would now catch them. Do T1/T5 verifies assert disposition-preservation?
4. **T10 symlink** — does T10 now edit ONLY `.codex/AGENTS.md` (the real file)? Verify `AGENTS.md` is a symlink to it (`readlink`). Worktree-edit guard present?
5. **Count prose** — normalized to 25? T11 transitive-closure note present?

## Fresh pass
Faithfulness to the 8 locked decisions + corrected counts (222/18/204/63); ordering DAG still enforces conformance-before-prose on shared files after the prose splits; outputs→inputs chain connected for the new P*a/P*b tasks; any NEW issue from the iter2 edits; zero placeholders.

## Output (write exactly this file, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/planning/evaluation/iter2/codex/overall.md`
Shape: `## Findings` (each: `**Type:**` from {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix; mark each iter1 finding CLOSED or STILL-OPEN). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
If iter2 closed the findings and introduced no new blocker, PASS — do not manufacture findings.
