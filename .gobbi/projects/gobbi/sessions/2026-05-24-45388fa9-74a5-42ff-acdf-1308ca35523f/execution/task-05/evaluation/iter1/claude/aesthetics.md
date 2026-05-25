# Aesthetics — T05 design doc (iter1, claude)

## Artifact Summary + Memory reads
(Shared Stage 0 summary in project.md.)

## Locked Frame (Stage 1)

Visual aesthetics are N/A (no UI). Prose/readability aesthetics DO apply to a design doc.

S1 — Readability + scannability.
- [ ] Headings scannable; prose wraps reasonably; lists used where appropriate
- [ ] Bolded lead-ins (D-1/D-2/D-4/D-5) aid navigation

S2 — Naming/terminology accurate and self-consistent.
- [ ] Terms (worktreePath, worktree-pr, direct mode, P2/P5, row labels) used consistently
- [ ] No leftover template placeholders ({slug}, TODO)

S3 (adversarial) — Doc "looks polished" but a confidently-worded claim is wrong (polish masking inaccuracy).
- [ ] Confident assertions cross-checked against source (cross-ref to Consistency)

## Per-scenario per-check results

S1: Markdown is clean — tables, bolded D-N lead-ins, fenced code blocks for the smoke-test jq. Highly scannable ✓. PASS.
S2: terminology consistent throughout; no leftover placeholders ✓. The internal row-label terminology IS self-consistent within the doc (always "row 5.5") — but that self-consistent label is factually wrong vs the source (see S3 + Consistency). PASS on style; the substance is a Consistency/Risk concern.
S3: The doc reads as confident and authoritative — and the row-5.5 worktree-creation claim is stated with full confidence yet contradicts the authoritative orchestration table. This is the "polish masking inaccuracy" pattern. Recorded as the load-bearing finding under Consistency (F-CONS-1) and Risk (F-RISK-1); not double-counted here as an Aesthetics finding since the defect is factual, not stylistic.

## Typed findings

A-1 (style, Low). The phrase "the 3-50 character length constraint (27 characters)" (lines 51-53) attaches "27 characters" to "the branch name", but the 27-char figure is the *description slug* length (`session-2026-05-24-45388fa9`); the full branch name is 33 chars. Minor imprecision, not misleading enough to block.
- Type: general | Domain: docs-sync | Disposition: open | Confidence: 75 | Severity: Low
- Evidence: doc lines 51-53; verified `printf 'session-2026-05-24-45388fa9'|wc -c`=27, full branch=33.
- Why: a precise reader may briefly miscount; the conventions check (git/conventions.md:27-29) applies 3-50 to the slug, which is what 27 measures, so the underlying claim is correct — only the antecedent ("branch name") is loose.
- Suggested direction: clarify "the description slug (27 chars)".

Per-perspective verdict: PASS

## Low-confidence appendix
(none)
