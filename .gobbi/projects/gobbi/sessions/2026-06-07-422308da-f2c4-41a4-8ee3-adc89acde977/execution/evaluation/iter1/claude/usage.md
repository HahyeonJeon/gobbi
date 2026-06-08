# Usage — Execution eval (iter1, claude)

## Frame
- U1 — can the Auto manager, reading these 3 docs cold at 3am, avoid all 3 misbehaviors?
- U2 — are the cross-references navigable (forward pointers reach §7; §7 reaches its targets)?
- U3 — is the routine-vs-safety boundary usable without over-/under-applying it?

## Results
- U1 ✓ A manager scanning auto-mode.md now hits: §2 preamble pointer (line 54) → §7; §4 evaluate.mode row → "never asks … see §7"; §6 tail → §7.3; and §7 itself with the scannable §7.4 table. The three prohibitions are positive and emphatic, so the silence that caused each misbehavior is filled. Success criteria 1/2/3 from the Idea are each derivable from the text.
- U2 ✓ Forward pointers: §2 (54), §4 (210), §6 (271) all point to §7. §7 back-references §1/§3/§6 and forward to evaluation.md sections via working anchors. evaluation.md Cross-references gains the reciprocal row (line 314) → "auto-mode.md § Evaluation discipline (§7)". CLAUDE.md:27 → auto-mode.md + chat-mode.md (both exist). Bidirectional graph closes.
- U3 ✓ Boundary is stated in 3 places (§7.3 carve-out, §7.4 NEVER-row, evaluation.md framing line 93) plus per-site labels on all 6 safety gates. A reader cannot silently silence a gate — each gate row now says "safety gate — interrupts in BOTH modes (NOT mode-split)".

## Findings
- Type: general | Domain: docs-sync | Disposition: open | Confidence: 50 | Severity: Low
  Evidence: auto-mode.md §7.3 carve-out + §7.4 table enumerate THREE safety gates (major divergence, degraded/single-system, both-systems-fail), while evaluation.md:93 declares "**six safety-gate sites**" (adds any-FAIL, same-symptom-different-root-cause, cost-budget). A manager reading only auto-mode.md §7 could believe the safety-gate set is exhaustively three.
  Why it matters: minor; could let a reader under-count the gates if they never open evaluation.md. Mitigated because §7.3 frames its list as "the genuine dual-system safety gates" tied to §1 "cannot resolve" (not claimed exhaustive) and routes the exhaustive home to evaluation.md. Not a contradiction — a completeness asymmetry. Plan assigned exhaustive classification to evaluation.md (T1/T4), not §7.3, so this is within spec.
  Suggested direction: optional — §7.3 could add "(evaluation.md is the exhaustive home — six sites)" to set reader expectation. User decides; non-gating.

Verdict: PASS
