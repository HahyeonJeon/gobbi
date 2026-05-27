# Codex Adversarial Evaluation — Preparation Readiness Artifact (gobbi memory-doc refactor)

You are an independent adversarial evaluator. Do NOT trust any claim in the artifact; verify against the actual repository files at HEAD with your own grep/find/test.

## What you are evaluating

The Preparation readiness assessment for a session that will refactor gobbi **project memory docs** to development-document level (building on PR #272). Preparation's job: confirm project memory + skills are READY for Planning + Execution, surface gaps, propose resolutions. The artifact concluded READY with one deferred (backlogged) out-of-scope finding.

Primary artifact (READ IN FULL):
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/preparation/rawdata/draft-iter1.md`
Staged backlog: `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/preparation/staging/backlogs/project/dangling-claude-doc-skill-link.md`

Context (the locked Idea this readiness check serves):
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/artifacts/` (idea.md, scope-contract.md, design-options.md)

## What to check (adversarially — RE-VERIFY, do not trust)

1. **Gap coverage** — did the readiness check actually verify everything Execution will need for the retrofit waves? Re-derive the readiness signals from the Ideation Idea and check each was scanned. Any input the waves need that Preparation did NOT check (missing coverage = a real gap)?
2. **Baseline reproduction** — RE-RUN the claims: is `.gobbi/projects/gobbi/skills/memorization/rules.md` a real file (not a symlink)? Does `.claude/skills/memorization/rules.md` resolve to it (`readlink -f`)? Does `rules.md` actually contain the naming/frontmatter/structure sections + the `disposition` legitimate-on-backlogs rule (~line 110)? Do 17 per-type templates exist? Does P_live reproduce 208/17/191? Does the 50/208 conformance baseline + 59-file leak baseline reproduce? Flag any that don't.
3. **re-ideate triggering** — is there any gap the artifact called "missing/deferred" that is actually an UNWORKABLE design problem (should be re-ideate, not defer)? Specifically: is deferring the dangling `claude` skill-link genuinely safe, or does any wave actually depend on a `.claude/`-doc-authoring standard?
4. **Decision faithfulness** — does the artifact correctly record the two user decisions (advance to Planning; backlog the dangling link) and is the backlog file well-formed?
5. **Missing considerations** — anything a readiness check for a 208-doc multi-wave retrofit should surface but didn't (e.g., executor context-budget per wave, ordering hazards between conformance and prose waves touching the same files, worktree CWD discipline for executors)?

## Output (write exactly this file, path relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/preparation/evaluation/iter1/codex/overall.md`

Shape:
- `## Findings` — each with `**Type:**` from EXACTLY {`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`} + `**Severity:**` + `**Confidence:**` + file-path evidence + recommended fix.
- Final line exactly: `VERDICT: PASS` or `VERDICT: REVISE` or `VERDICT: FAIL`.
  - PASS = readiness assessment is sound; safe to advance to Planning. REVISE = a coverage/verification gap to fix. FAIL = a gap that makes Planning unworkable (re-ideate territory).

If the readiness check is genuinely complete and the baselines reproduce, PASS is correct — do not manufacture findings.
