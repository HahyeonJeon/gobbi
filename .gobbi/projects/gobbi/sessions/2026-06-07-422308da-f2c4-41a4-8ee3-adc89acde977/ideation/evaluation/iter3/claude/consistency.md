# Consistency (Stage 2) — iter3

## Frame
- Did everything that should change together, change together across the 3 files?
- Does the classification table (draft 69-77) agree with the per-section edits (File-1 §7.3/§7.4, File-2 framing + per-section)?
- Does the iter3 Chat-branch of the Stuck/Regression splits match existing behavior (no invented Chat rule)?
- (adversarial) Is the safety-gate carve-out worded so it cannot be over-applied to silence a real divergence?
- (adversarial) Does any mode-split contradict an unsplit safety gate in the same doc?

## Per-scenario per-check results
- **Classification table vs per-section edits — agree.** Table rows: Iteration Caps / Stuck / Regression = routine-triage→mode-split; Severity-gated-minor = keep no-interrupt; Severity-gated-major + Degraded-mode + both-fail = safety-gate→KEEP. The File-1 §7.3 prose (125-130), §7.4 row (139/141), and File-2 per-section edits (165-175 mode-split; 161/163 keep-interrupting) match the table row-for-row. No divergence. YES.
- **Line citations accurate against live evaluation.md:** Severity-gated minor=116 / major=119 (draft says ~117/~119 — close, accurate); Degraded-mode=188-199 (exact); Iteration Caps=253-258 (exact); Stuck=241-249 (draft ~242-249, accurate); Regression=234-239 (draft ~239 for the trigger line — line 239 is exactly the "regression at any iter triggers user awareness" sentence, accurate). YES.
- **Root cause P3 is real:** grep confirms live evaluation.md has ZERO mode-awareness on Stuck/Regression/Iteration-Caps. The mode-split adds the distinction that does not exist today. YES.
- **Chat branch = preserved behavior, not invented:** the Stuck/Regression escalations live in evaluation.md (manager-side reconciliation), currently mode-agnostic (apply in both modes). The split assigns the existing escalation to the Chat branch — it preserves current behavior for Chat, it does not invent a chat-mode.md rule. Verified: chat-mode.md is SILENT on stuck/regression (grep = none). See finding C1 below on the framing-sentence imprecision.
- **Safety-gate carve-out cannot be over-applied:** three independent statements (§7.3 carve-out, §7.4 NEVER-row, File-2 framing sentence) each name the exact safety gates (major divergence / degraded-mode / both-fail) and tie them to §1 "cannot resolve." The minor `PASS↔REVISE` divergence is explicitly excluded from interrupting. A reader cannot collapse "no routine triage" onto a safety gate without contradicting three places. YES.
- **No mode-split contradicts an unsplit gate:** § Iteration Caps (mode-split, Auto records abort) and § Degraded-mode (kept interrupting) are different triggers; § Iteration Caps Auto branch even cross-refs the §6 "unsound to proceed" exception, which itself can interrupt — consistent, no contradiction. YES.

## iter1/iter2 finding disposition
- **F9 (High) — placement contradiction across 5 locations.** disposition: **addressed** (unchanged). All locations agree on trailing §7, no renumber.
- **iter1 Medium — wrong "Principle 3" citation.** disposition: **addressed**. §7.2 carries no principle number; D7 + consistency-risk #6 correct it; Principle 3 verified = "Design With the User, Based on References" (principles/SKILL.md:47).
- **iter2 open finding (Codex-surfaced 3rd P3 instance — § Stuck detection).** disposition: **addressed**. Draft now explicitly lists 3c (Stuck) as an in-scope mode-split instance (52-59, D3, classification table row, File-2 edit at 169-171, scenario at 238). The Stuck section is mode-split with Chat/Auto branches mirroring § Iteration Caps. Consistent with auto-mode.md §6 (records, surfaces at Wrap-up). Verified the live § Stuck detection (241-249) is the unconditional "Escalate to user BEFORE reaching the iteration cap" the draft targets.

## Stage 2 findings
- **C1 — framing-sentence over-claims "chat-mode.md's existing language" for stuck/regression.**
  - **Type:** general / **Domain:** docs-sync / **Disposition:** open / **Confidence:** 75 / **Severity:** Low
  - **Evidence:** consistency-risk #1 (draft 214) says the mitigation is to "quote chat-mode.md's existing 'discuss findings' / 'escalate to user' language; do not add new Chat semantics." But chat-mode.md is silent on Stuck detection and Regression marking (grep: zero matches). Those escalations live only in evaluation.md (mode-agnostic today). The Chat branch of the Stuck/Regression splits therefore preserves *evaluation.md's* current behavior, not *chat-mode.md's* — the mitigation's anchor doc is imprecise for two of the three splits.
  - **Why it matters:** A Planner taking consistency-risk #1 literally may search chat-mode.md for stuck/regression wording, find none, and either stall or wrongly conclude the split is unsupported. The split is in fact correct (it preserves evaluation.md behavior); only the cited anchor is wrong for stuck/regression. Cosmetic — does not change any edit.
  - **Suggested direction:** in consistency-risk #1, note that for Iteration Caps the Chat anchor is chat-mode.md:154 ("Budget exhausted → escalate to user"), but for Stuck/Regression the Chat branch preserves evaluation.md's current (mode-agnostic) escalation — chat-mode.md does not encode those. Planning-stage clarification, not blocking.

## Low-confidence appendix
None.

## Verdict: PASS
