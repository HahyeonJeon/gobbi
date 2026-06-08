# Planning Eval — Overall (Stage 3) (claude, iter1)

## Cross-perspective synthesis
Seven perspectives walked against the live worktree at c8a8654. The Plan is a HYBRID decomposition (3 per-file edit tasks + 1 consistency task) of the locked docs-only Idea. The decomposition is fundamentally sound: clean single-file-per-task boundaries, a correct citation-graph ordering (cite-target before citer), a verbatim output→input handoff chain, strong drift guards, and an interruption-safe sequence. Two defects surfaced.

## Findings rolled up
- **S-1 / R-2 (High, conf 100, docs-sync) — wrong anchor for the out-of-scope pointer.** The Plan cites `orchestration/SKILL.md:247` in five places as the "auto-mode.md §3/§6" pointer T4 must verify stays valid. Live, line 247 is a Verdict-aggregation table separator; the actual pointer is line 266. The readiness report explicitly handed Planning this correction (use 266). T4's drift-guard check is un-runnable as written. This is the dominant finding.
- **C-1 / R-1 (Medium, conf 75, process/docs-sync) — no semantic-survivor sweep.** T4 verifies only the named escalation sections; live grep shows mid-loop mode-agnostic AskUserQuestion at evaluation.md lines 109/137/197 that the Idea's 3+3 classification never names. Whether they should be mode-split is a locked-Idea design call I do not re-open, but the Plan adds no gate to even surface them — the cotouch-enumeration mistake class.

## Karpathy failure modes
- Wrong assumptions: YES, localized — T4 assumes line 247 holds the §3/§6 pointer; it does not (S-1). Also the Plan assumes the Idea's enumeration of escalations is complete; it is not (C-1).
- Overcomplexity: NO. The 4-task hybrid is proportionate; the dedicated T4 gate is justified by the citation graph.
- Orthogonal edits: NO. Each task is one file, one concern.
- Imperative-over-declarative: NO concern. Tasks state verifiable goals; they appropriately constrain locked specifics (no-rename, no-principle-number, split-anchor) without dictating exact prose.

## Cross-system note
The parallel Codex evaluator runs the same seven independently. The S-1 line-247 anchor error is mechanically checkable and should converge. The C-1 semantic-survivor gap is the kind of finding cross-system divergence is designed to surface — if Codex misses it, that is the anti-groupthink value; if Codex also finds it, confidence rises.

## Must-preserve list (remediation must not break)
1. The citation-graph ordering T1→T2→T3→T4 and T1's explicit no-header-rename constraint (the central cross-file invariant).
2. The C1 split-anchor encoding (Stuck/Regression → evaluation.md behavior; only Iteration-Caps → chat-mode.md) — verified correct against live chat-mode.md.
3. §7.2 "no principle number" drift guard (Idea D7) — avoids the stale Principle-11/Principle-3 trap.
4. line-27-only / line-31-untouched constraint (verified against live #295 paragraph layout).
5. The verbatim output→input handoff chain and one-file-per-task atomic-commit boundaries.
6. mode-split-not-delete / retire-nothing / canonical-.gobbi-paths / imperative-first edit-mechanics.

## Verdict
- S-1/R-2: High, confidence 100 → REVISE threshold met (High with conf ≥ 50).
- C-1/R-1: Medium, confidence 75 → does not gate.
- No Critical finding.

VERDICT: REVISE

Rationale: the decomposition is otherwise strong and ship-shaped, but the High-confidence wrong-anchor in the dedicated drift-guard task (a correction the upstream readiness artifact already provided) must be fixed before Execution, and the user should decide whether the un-enumerated mid-loop escalations (line 109/137/197) are in or out of scope for this Idea.
