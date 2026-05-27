# Codex Adversarial Evaluation — Ideation Artifact iter2 (gobbi memory-doc refactor)

You are an independent adversarial evaluator. Do NOT trust any claim in the artifact; verify against the actual repository files with your own grep/find at HEAD.

## What you are evaluating

iter2 of the Ideation artifact for refactoring gobbi **project memory docs** to "development-document level" (building on PR #272's settled structural redesign). iter1 was REVISE; iter2 is the remediation. Your job: confirm the iter1 findings are GENUINELY fixed (not just claimed) AND do a fresh adversarial pass.

Primary artifact (READ IN FULL):
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/rawdata/draft-iter2.md`

Context:
- iter1 artifact (for diff): `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/rawdata/draft-iter1.md`
- iter1 findings being remediated: `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/evaluation/iter1/codex/overall.md` and `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/evaluation/iter1/claude/`
- User decisions (unchanged): `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/rawdata/discussion-log.md`
- Standard being extended: `./.claude/skills/memorization/rules.md`

## Verify the iter1 findings are actually closed (re-run, do not trust)

1. **F1 type-aware strip** — does the artifact now define a type-aware allowlist + file-selection predicate so `disposition` on `backlogs/` is preserved? Is the predicate + key-set actually grounded in rules.md (check line ~110 / §2.2-2.3)? Would following it avoid corrupting backlog frontmatter? Any remaining over-broad strip?
2. **F2 reproducible counts** — RE-RUN the artifact's stated `find`/`grep` commands yourself. Do the numbers (it claims ~208 live docs, ~50 base-schema, 28 legit disposition-on-backlogs, 59 true-leak files) reproduce at HEAD? Flag any that don't.
3. **F3 tiers 2+3** — are tier-2 (minimal grep gate; heavier deferred) and tier-3 (org/nav) now explicitly in the Scope Contract, not silently folded into tier-1?
4. **F4 12-vs-13 drift** — is there a checklist item to reconcile AGENTS.md / .codex/AGENTS.md? Verify the drift is real (grep both).
5. **F5 symlink target** — does a checklist item name the canonical `.gobbi/projects/gobbi/skills/memorization/rules.md` (non-symlink) as the edit target? Verify the symlink claim.

## Fresh adversarial pass
Also check: faithfulness to the 8 locked decisions (no drift, no new unapproved content vs iter1); scope still achievable as one session; success criteria measurable; any NEW issue introduced by the iter2 edits.

## Output (write exactly this file, path relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/evaluation/iter2/codex/overall.md`

Shape:
- `## Findings` — each with `**Type:**` from EXACTLY {`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`} + `**Severity:**` + `**Confidence:**` + file-path evidence + fix. For each iter1 finding, state CLOSED or STILL-OPEN with evidence.
- Final line exactly: `VERDICT: PASS` or `VERDICT: REVISE` or `VERDICT: FAIL`.

If iter2 genuinely closed the findings and introduced no new blocker, PASS is correct — do not manufacture findings to avoid a clean pass.
