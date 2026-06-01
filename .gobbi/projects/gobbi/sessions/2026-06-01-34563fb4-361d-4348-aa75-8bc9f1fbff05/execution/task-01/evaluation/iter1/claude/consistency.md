---
perspective: consistency
system: claude
loop: execution
iter: 1
verdict: REVISE
---

# Consistency perspective — Execution eval iter1 (claude)

## Artifact Summary + Memory reads
(See project.md for the full Artifact Summary + Memory reads register; not repeated.)

## W/W/H gate
What ✓ / Why ✓ / How ✓.

## Locked Frame (Stage 1)

**S1 — All count statements INSIDE the reference doc agree**
- [ ] frontmatter/prose, enumeration header, reconciliation note, usage-history row all read 30 (or describe the 31→30 correction)
- [ ] frontmatter `accessed:` matches the re-verification date claimed in prose

**S2 — Enumeration internally coherent**
- [ ] header count (30) equals the actual enumerated entry count (30)
- [ ] reconciliation parenthetical's "30 events / MessageDisplay at 12" matches the list

**S3 — Frontmatter still conforms to the references-type standard (memorization/rules.md §2.1–2.2)**
- [ ] base keys present; `type: references`; `ref_type`, `title`, `source`, `accessed` extensions present
- [ ] no staging-routing leak keys (S-set, §4.4)
- [ ] slug unchanged (stable address, §1.1 rule 5)

**S4 — Cross-artifact sync: everything that should change together changed together (P8/P13 blast radius)**
- [ ] the feature README `Open items` pointer to this docs-sync item is consistent with the corrected target (30)
- [ ] the tracking backlog + checklist are consistent with the corrected target (30) / closed
- [ ] no OTHER guardrails doc still asserts the old count as the live truth

**S5 — line-34 sibling pointer `claude-code-hooks-12-lifecycle-events.md` ("12 lifecycle events")**
- [ ] determine whether the "12" is the same count claim (→ inconsistency this change should fix) or a different source (→ out of scope)

**S6 (adversarial) — Doc passes its own internal checks but a sibling/index now contradicts it**
- [ ] grep the feature tree for surviving "31…29" correction text that now contradicts the corrected reference

## Per-scenario per-check results

- **S1**: PASS. Lines 35, 40, 56, 89 all read 30 / describe the 31→30 correction; usage-history line 119 logs "31→30". `accessed: 2026-06-01` (line 13) matches the "re-verified 2026-06-01" prose. ✓✓
- **S2**: PASS. Header "All **30**" (line 56) == 30 enumerated entries (verified `grep -c`). Reconciliation line 89 "30 events…MessageDisplay at position 12" matches list (MessageDisplay@line 69 = #12). ✓✓
- **S3**: PASS. Frontmatter unchanged except `accessed:` 2026-05-23→2026-06-01 (a legitimate references extension field, §2.2). All base keys present; `type: references`; no S-set leak keys; slug unchanged. Conformant. ✓✓✓
- **S4**: **FAIL on two of three checks.**
  - `features/guardrails/README.md:50` (a LIVE feature-README, not a backlog) still reads: "Correct the '31 hook events' claim to the verified count of **29** in surviving references." The reference it points readers toward is now corrected to 30, so this Open-items line is now actively misleading on BOTH the target (29 vs 30) and the done/not-done state. ✗
  - `backlogs/hook-event-count-31-vs-29-docs-sync.md` (description + body + suggested-approach) and `checklists/hook-event-count-31-vs-29-docs-sync.md` still state the correction target is "29" and are `status: active` / unchecked. The backlog's own acceptance gate `grep -rn '"31 hook' features/guardrails/` → 8 matches (not 0). ✗
  - No third unrelated doc asserts the old count as live truth. ✓ (the schema reference is the only one that ever stated a live count)
- **S5**: PASS — legitimately out of scope. The sibling `claude-code-hooks-12-lifecycle-events.md` is a DIFFERENT source (`source: https://claudefa.st/blog/...`, `ref_type: blog`, "12+ hook lifecycle events" framing) versus this doc's official-page WebFetch (30 events on code.claude.com). The "12" is a separate, blog-sourced "12+" count of a curated subset, not the same 30-event official-page claim. It carries its own `accessed: 2026-05-23` and is not named in either backlog. Updating it would be scope creep (P4). Recorded as out-of-scope, not a finding. ✓
- **S6**: FAIL — the grep in S4 surfaces the README/backlog/checklist contradiction. ✗

## Typed findings

**C-1 — Stale "correct to 29" pointers survive in the live feature README + tracking backlog/checklist after the reference was corrected to 30**
- Type: `general` · Domain: `docs-sync` · Disposition: `open` · Confidence: 100 · Severity: High
- Evidence (grep-verified, all in `features/guardrails/`, excluding `sessions/`):
  - `README.md:50` — "Correct the '31 hook events' claim to the verified count of **29** in surviving references" (live Open-items list; the reference it links is already corrected to 30).
  - `backlogs/hook-event-count-31-vs-29-docs-sync.md` lines 3/21/35 — target stated as "29"; `status: active`, `shipped_in: null`.
  - `checklists/hook-event-count-31-vs-29-docs-sync.md` lines 3/17/19/21/29 — "correct all … to '29'"; boxes unchecked.
  - Backlog's own closure gate `grep -rn '"31 hook' features/guardrails/` → 8 matches (gate requires 0).
- Why it matters: P8 (docs are a deliverable, ship the matching co-update) and P13 (blast radius — a doc change must enumerate every file the SAME change must co-touch). The reference doc was corrected, but the three artifacts that *point at* the correction were left asserting the wrong target (29) and the wrong done-state. A future agent reading the README "Open items" will (a) believe the task is still open and (b) re-correct the reference to the wrong value 29 — re-introducing the exact defect this change fixed. The research artifact itself (lines 19, 104–105) explicitly flagged that the backlog/checklist target is stale and "should be corrected to 31 → 30" and surfaced to the user before editing — so this co-update was a known, named blast-radius item.
- FP-check: not pre-existing (the README/backlog were *correct-relative-to-their-own-target* before; this change made the reference disagree with them); not style; not speculative (grep-confirmed). The only mitigation is the brief's narrow scope — but the brief scoping a co-update out does not make the resulting cross-artifact contradiction disappear; it makes it a deliberate-deferral decision the user must ratify.
- Suggested direction: either (a) in-scope follow-up that updates README line 50 to "30 (corrected 2026-06-01)", flips the backlog/checklist to closed/`shipped_in`, and re-targets their "29" text to "30"; or (b) an explicit user-ratified deferral recorded on the backlog. Manager + user decide per Principle 2 (never auto-apply).

## Verdict

**REVISE.** The reference doc is internally fully coherent (S1–S3 PASS) and the line-34 sibling pointer is correctly left out of scope (S5). But the change left a High-severity cross-artifact docs-sync contradiction (C-1, Confidence 100): a live feature README + the tracking backlog/checklist still assert the superseded "correct to 29" target after the reference was corrected to 30, and the backlog's own closure gate fails. Per the Stage-2 threshold (any High ≥ 50 → REVISE), Consistency is REVISE. This is a manager/user decision (in-scope fix vs ratified deferral), not an evaluator-applied fix.

## Low-confidence appendix
(none)
