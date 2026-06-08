# Planning Eval — Structure (claude, iter2)

## Frame
Decomposition shape: task boundaries, ordering, dependency graph, handoff chain, atomicity.

## Walk
- HYBRID: 3 per-file edit tasks + 1 consistency task. One file per edit task (T1=evaluation.md, T2=auto-mode.md, T3=CLAUDE.md), T4 read-only. No two tasks touch the same file — clean atomic-commit boundaries.
- Ordering T1→T2→T3→T4 is citation-graph-correct (cite-target before citer): T1 finalizes the section names T2's §7 cites; T2 finalizes the §7 that T3's CLAUDE.md cites; T4 validates end-to-end. Verified the headers T2 will cite exist and are stable in live evaluation.md (Regression 234 / Stuck 241 / Iteration Caps 253 / Severity-gated 112 / Degraded-mode 188).
- Mutual citation auto-mode↔CLAUDE.md (iter1 Codex finding) resolved without reorder: T2 words its CLAUDE.md reference GENERICALLY (DD5, T2 verifies-(c)), so T2 does not depend on T3's text; T3 needs §7 to exist (true after T2); T4 validates both directions. Order T1→T2→T3→T4 stays sound.
- Output→input handoff chain is verbatim and acyclic: T1→`evaluation.md-final-section-names`→T2/T4; T2→`auto-mode-section-7`→T3/T4; T3→`claude-md-eval-blockquote-reconciled`→T4. Dependency table + parallel-lanes (single sequential lane) consistent.

## Findings
None. The T2 generic-reference encoding (verifies-c: "the Auto-mode counterpart to the Chat-scoped finding-discussion rule in CLAUDE.md — NOT a quote") correctly breaks the mutual-citation cycle. Structure is sound; no regression to ordering.
