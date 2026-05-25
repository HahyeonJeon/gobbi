# Overall (Stage 3) — T05 design doc (iter1, claude)

## Per-perspective verdict roll-up
- Project: PASS (clean 1:1 scope, 2 files, real content backs the backlog close)
- Structure: PASS (5 contract sections, valid frontmatter, related-links resolve)
- Performance: PASS (N/A — docs-only)
- Aesthetics: PASS (clean prose; A-1 Low slug-vs-branch phrasing nit)
- Usage: REVISE (F-USAGE-1 High — row-label pointer misdirects the reader)
- Consistency: REVISE (F-CONS-1 High — doc ↔ orchestration row-label desync; load-bearing)
- Risk: REVISE (F-RISK-1 High — misinformation propagation from an `accepted` canonical doc)

## Cross-perspective tensions
Project/Structure PASS (the doc is well-built and in-scope) but Usage/Consistency/Risk REVISE (one factual claim is wrong). This is the classic "structurally sound, substantively wrong" split. The factual error is not a scope or organization defect — it is an accuracy defect — which is why it surfaces only in the consumer-facing and cross-reference perspectives. The contract explicitly warned about exactly this ("a doc that grep-passes but misdescribes the model is a real finding"), and the warning landed: header-grep passes, the model description does not.

## Single load-bearing issue (one root cause, three lenses)
F-USAGE-1 / F-CONS-1 / F-RISK-1 are the **same root defect** viewed through three perspectives: the doc states worktree creation happens at orchestration "row 5.5", but the authoritative Step-1 table places it at row 5 (5.5 = state.json, 6 = session.json; the direct-mode header is titled "Row 5"; the smoke-test gate says "row 5 was skipped"). The doc faithfully mirrors git/SKILL.md:155 and the D-1 memorial — both of which also say "5.5" — so the doc inherited a pre-existing cross-skill contradiction and propagated it into an `accepted` canonical artifact rather than reconciling it. Confidence 100 (direct reads of both source files). One remediation fixes all three findings: correct the doc to "row 5"; the orchestration↔git/SKILL.md contradiction itself is a separate follow-up outside T05 scope.

Everything else the doc claims is factually ACCURATE (verified): branch regex match (tested), worktreePath write-root rule + main-tree fallback + transcript-outside-both-trees (git Matrix), P2=create / P5=land-PR-and-remove, "git worktree remove discards uncommitted" (git P5), direct-mode for hotfix+read-only, smoke-test gate, D-4 per-iter cadence, D-5 settings.git.workflow.mode parity, and the 9-surface table rows (preparation `git -C "$worktreePath"` and delegation qualified write-path both confirmed present).

## Karpathy failure modes
- Wrong assumptions: PRESENT — the doc assumed the D-1/git-skill "row 5.5" framing reflected the as-shipped orchestration table; it does not. This is the root of F-CONS-1.
- Overcomplexity: absent — the doc is appropriately concise; Lessons is deliberately shallow per DL-1.
- Orthogonal edits: absent — exactly 2 in-contract files; no "while I was here".
- Imperative-over-declarative: absent — the doc states the verifiable model + smoke-test gate (declarative) rather than prescribing mechanism.

## Must-preserve list
- The clean 2-file scope and accurate backlog close (Project).
- The 5-section contract structure + valid frontmatter + resolving related-links (Structure).
- The intentionally-shallow Lessons note (1191 bytes) with its DL-1 β-1 / N=2 rationale — this is correct by contract; a REVISE must NOT delete it.
- Every factually-correct claim listed above (write-root rule, P2/P5, smoke-test gate, branch regex, direct-mode, cadence, surfaces table content) — the fix is surgical to the row-label only.
- The "this session as N=2 witness" Validation passage (branch verified MATCH, worktree path verified) — accurate and valuable.

## Overall finding
F-OVERALL-1 (High, the consolidated root). See F-CONS-1/F-USAGE-1/F-RISK-1.
- Type: general | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: High
- Evidence: doc:45-46,69,84 vs orchestration/SKILL.md:102,103,104,107,134; contradicting source git/SKILL.md:155.
- Why: canonical aggregation doc misdescribes which Step-1 row creates the worktree; high reader-trust + reverse-contamination risk.
- Suggested direction: user-decided; correct doc to "row 5"; file orchestration↔git-skill reconciliation as a separate follow-up. Do not auto-apply.

## Overall verdict
Highest-severity contributing finding: High @ confidence 100 → REVISE (no Critical; thresholds: Critical≥75→FAIL, High≥50→REVISE).

VERDICT: REVISE

Must-preserve list (restated): clean 2-file scope; 5-section contract structure + valid frontmatter; the intentionally-shallow Lessons note + DL-1 rationale; all factually-correct claims (write-root, P2/P5, smoke-test, branch regex, direct-mode, cadence, surfaces content); the N=2-witness Validation passage.
