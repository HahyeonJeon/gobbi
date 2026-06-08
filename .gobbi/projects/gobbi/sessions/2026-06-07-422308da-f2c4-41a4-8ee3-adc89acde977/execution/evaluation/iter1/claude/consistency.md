# Consistency — Execution eval (iter1, claude)

## Frame
- C1 — everything that should change together changed together (bidirectional citations resolve)?
- C2 — no internal contradiction between §7 and existing auto-mode sections, or between the 3 files?
- C3 — exhaustive classification: every evaluation.md escalation site classified (cotouch-enumeration)?
- C4 — the by-name section references in the framing sentence match real headers?

## Results
- C1 ✓ Reciprocal eval↔auto edge: auto-mode §7 → 5 evaluation.md anchors (all resolve); evaluation.md:314 → auto-mode §7 (resolves to the §7 header T2 created). Mutual auto↔CLAUDE edge: auto-mode §7.2/§7.3/Cross-ref:362 → CLAUDE.md (generic, resolves); CLAUDE.md:27 → auto-mode.md (§7 exists) + chat-mode.md (exists). No dangling pointer either direction.
- C2 ✓ No contradiction. §7.3's "no routine triage mid-loop" is consistent with §6's existing no-interrupt contract (and §6:271 now forward-links §7.3). §7.3's safety carve-out is consistent with §1 interrupt list (#1 Always-Ask, #2 scope-change, #3 cannot-resolve). The minor-divergence auto-proceed in §7.3 matches evaluation.md:123. CLAUDE.md "never auto-apply" preserved and consistent with §7.3's Always-Ask carve-out.
- C3 ✓ cotouch-enumeration honored. Full grep sweep of evaluation.md escalation sites: lines 111 (same-symptom), 121 (Major), 139 (any-FAIL), 194/200/202/203 (degraded one-fails/both-fail/cost-budget), 245 (Regression), 252 (Stuck), 264 (Iteration Caps). All 9 classified: 3 routine→mode-split, 6 safety→labeled "interrupts in BOTH modes (NOT mode-split)". No unclassified survivor.
- C4 — by-name references: the framing sentence (line 93) says "§ Same symptom, different root cause" but the actual header is "Same symptom, different root cause — do not collapse". Also says "§ Verdict Aggregation Across Perspectives" which matches exactly. These are plain-text by-name references (not [](#anchor) links), so nothing is broken; the one paraphrase is recognizable. Minor imprecision only.

## Findings
- F C-1 | Type: general | Domain: docs-sync | Disposition: open | Confidence: 50 | Severity: Low
  Evidence: evaluation.md:93 framing names "§ Same symptom, different root cause" but the header is "### Same symptom, different root cause — do not collapse". By-name (not anchor) reference, so it resolves for a human reader; a strict literal-string match would miss the "— do not collapse" suffix.
  Why it matters: cosmetic; a reader still finds the section. No functional break. Routed here for completeness, not as a gate.
  Suggested direction: optional tighten to the full header text. User decides.

- F C-2 | Type: general | Domain: docs-sync | Disposition: open | Confidence: 50 | Severity: Low
  Evidence: safety-gate count asymmetry — evaluation.md:93 says "six safety-gate sites"; auto-mode.md §7.3/§7.4 enumerate three. (Same observation as usage.md finding; logged once here as the consistency owner.)
  Why it matters: completeness asymmetry, not contradiction. §7.3 does not claim exhaustiveness; evaluation.md is the designated exhaustive home (Plan T1/T4). Non-gating.
  Suggested direction: optional cross-note in §7.3. User decides.

Verdict: PASS (two Low findings, neither gates)
