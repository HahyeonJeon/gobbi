# iter3 Claude eval — Consistency perspective

## Frame

Consistency raised iter2's Critical finding (vocabulary used inconsistently across 10 sites). iter3 must restore consistency across every site that touches the Type vocabulary, the `.agents/skills` count, and the routing-anchor name.

## Findings

None. Consistency across all touched dimensions:

- **Type vocabulary**: 0 propagation sites left using `improvement` or `bug` as canonical Type values. All 4 remaining hits (lines 31, 484, 574, 597) are framed as "iter2 was wrong" meta-references with explicit `NOT in the 5-Type set` framing. The bundle name `gobbi-orchestration-workflow-improvements` (lines 2, 13, 44) is the English noun for the bundle, not a Type value — orthogonal.
- **`.agents/skills` count**: 7 mentions in iter3 — all read `16` (current count) or `16 → 17 post-ship` (after the bundle adds the codex symlink). Count math is internally consistent.
- **Routing anchor**: every reference to the Domain-routing table uses `§ Complete Domain → staging destination routing (general Type)` (e.g. lines 217, 302, 482, 497, 505, 563, 587). The 3 `Staging routing` strings in iter3 are all wrapped in "iter2 cited phantom anchor `§ Staging routing` which does NOT exist" — they correctly call out the phantom, never use it as a live anchor.
- **mechanical / judgment-required sets**: identical specification at all 5 cross-references — Iter3 Changelog row 1, Scope Contract Decisions Locked, Scenarios § Edge + § Adversarial, Implementation Checklist row 8, Design D § Step 2.5 + § audit trail, Decisions Log rows 7 + 18.
- **iter3-correction note (line 484)** uses the same Type definitions as Design D body — consistent within the design section.

## Verdict

**PASS** at Confidence 100. The iter2 Consistency Critical is fully resolved.

## Must-preserve

- The internal consistency between Scope Contract Decisions Locked (line 83), Decisions Log row 7 (line 563), and Design D § Step 2.5 (lines 481-497) — these three sites collectively define the routing rules and they must move together. iter3 keeps them aligned.
