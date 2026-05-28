# Overall — T0 iter2 reconciliation (claude)

**Target:** commit a258f4b on be43c43 — reconcile the notes section-contract across §4.2 + templates/notes.md + design D4, align mistakes-row labels, and extend set S with `addressed-by`/`addressed_by` in §4.4 + §4.5.

## Cross-perspective synthesis
All 7 perspectives PASS (Performance N/A — genuine: doc/standard change, no runtime surface). No Critical, no High, no new Low at iter2.

Hard-evidence checks I ran (not the executor's report):
- **3-file agreement (own grep):** notes contract IDENTICAL in all three — rules.md §4.2 line 180, templates/notes.md body sections 64-79, design-options.md D4 line 24. Six headings, same order: What happened / What shipped / What got stuck / What shifted / Decisions to respect / Next session.
- **Gate re-run (verbatim §4.5):** exit 0, archive-safe, underscore-aware; surfaced the 4 `addressed-by` docs the iter1 PR-1 finding said it would miss. `disposition` still omitted; 41 backlog disposition files preserved (invariant intact).
- **mistakes-row alignment:** §4.2 now `Correct approach` / `How to detect` in template order — matches templates/mistakes.md.
- **Regression:** only 4 sanctioned files changed; §1-3 byte-untouched (hunks all in §4, ≥line 175); §4.1 positive bar + before/after table and §4.3 reclassify-not-delete fully intact; no `.claude` symlink edited (canonical file edited, symlink resolves correctly); no other memory docs touched.
- **Out-of-scope divergence left untouched (correctly):** the design-template body (Problem/Scope/Approach/...) does not match §4.2's ADR shape for `design`. This was NOT a ratified iter2 finding; editing it would breach Iron Law 4. Leaving it is correct — recorded as an observation, not a finding.

## iter1 finding disposition
- **Codex iter1 REVISE (notes section-contract mismatch §4.2 vs D4, design_flaw/High/100):** CLOSED. The chosen RECONCILE path unified all three sources to one canonical contract and documented the divergence inline in D4 — faithfully satisfying Codex's second fix-option ("revise the locked design through the workflow"). The two checklists (downstream notes retrofit vs Ideation-approved) now verify against the same headings.
- **Claude iter1 ST-1 (mistakes-row labels):** CLOSED — labels aligned to template.
- **Claude iter1 PR-1/RK-1 (addressed-by absent from S):** CLOSED — added to §4.4 + §4.5; gate now catches the 4-file leak.
- **Claude iter1 CN-1 (disposition data drift) + US-1 (prose sub-check):** unchanged, out of iter2 scope, Low, no regression.

## Karpathy failure-mode scan
- Hallucinated structure: none — every heading traces to the unified contract.
- Over-engineering: none — one regex alternation + one table row + heading additions.
- Gaming (Iron Law 11): none — gate now catches a real leak it previously missed (harder to pass, not easier).
- Scope creep: none — 4 sanctioned files only; the tempting design-template fix was correctly left alone.

## Must-preserve (any future remediation must not break)
- The unified notes contract across all three sources (do not let any one drift again).
- §4.4 conditional-disposition safety invariant + 41-backlog preservation (no blanket disposition strip).
- §4.1 positive bar + before/after table; §4.3 reclassify-not-delete.
- Canonical-file edits with `.claude` as symlink mirror (never edit the symlink).
- §1-3 byte integrity.

## Decision
No Critical (≥75) → not FAIL. No High (≥50) → not REVISE. All iter1 blocking findings CLOSED; reconciliation is faithful and no regression introduced.

VERDICT: PASS
