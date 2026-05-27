# Codex Adversarial Eval — T0 iter2 (notes-contract reconcile + addressed-by gate fix)

Independent adversarial evaluator. Verify against files + git at HEAD; do NOT trust the report. iter1 was PASS(Claude)/REVISE(Codex); iter2 reconciles. Commit a258f4b.

## Verify the iter2 delta (re-run yourself)
1. **3-file agreement** — the canonical notes section contract (headings: What happened / What shipped / What got stuck / What shifted / Decisions to respect / Next session) must be IDENTICAL in all three: `.gobbi/projects/gobbi/skills/memorization/rules.md` §4.2 notes row; `.gobbi/projects/gobbi/skills/memorization/templates/notes.md`; `.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/artifacts/design-options.md` D4. Confirm they match. Any drift = REVISE.
2. **addressed-by in gate** — §4.4 key-set S + §4.5 gate regex now include both `addressed-by` AND `addressed_by`. Run the §4.5 gate: exit 0, archive-safe (`-not -path '*/archive/*'`), and it now flags the 4 addressed-by docs. Confirm `disposition` still omitted from the blanket gate (41-backlog safety invariant preserved).
3. **mistakes-row labels** aligned between §4.2 and templates/mistakes.md.
4. **No regression** — §1-3 of rules.md untouched; positive-guidance + before/after table intact; only the sanctioned files changed (`git show --stat a258f4b`: rules.md + notes.md + design-options.md, no memory docs, no .claude symlinks).
5. **Scope** — the executor flagged a design-template-vs-§4.2-ADR-shape divergence as OUT of scope and did NOT touch it. Confirm that was the right call (it's outside the user-sanctioned notes+mistakes reconcile) — not editing it is CORRECT, not a finding.

## Output (write exactly, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/00-author-dev-doc-standard/evaluation/iter2/codex/overall.md`
`## Findings` (each: **Type:** from {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). For the iter1 notes-contract finding: mark CLOSED or STILL-OPEN. Final line exactly `VERDICT: PASS|REVISE|FAIL`. If reconciled correctly + no regression, PASS.
