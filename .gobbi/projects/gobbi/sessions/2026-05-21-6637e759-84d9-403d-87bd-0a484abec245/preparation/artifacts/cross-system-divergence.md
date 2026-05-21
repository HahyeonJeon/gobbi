---
loop: preparation
iter: 2
artifact_type: cross-system-divergence
created_at: 2026-05-21
status: final
supersedes: []
related:
  - preparation/artifacts/resolution-log.md
  - preparation/evaluation/iter1/claude/overall.md
  - preparation/evaluation/iter1/codex/overall.md
  - preparation/evaluation/iter2/claude/overall.md
  - preparation/evaluation/iter2/codex/overall.md
---

# Cross-System Divergence — Preparation Loop

## iter1 divergence (Claude PASS vs. Codex REVISE)

**Aggregate verdict**: REVISE (pessimistic union per evaluator skill reconciliation rule).

| Perspective | Claude iter1 | Codex iter1 | Divergence |
|---|---|---|---|
| Overall | PASS | REVISE | Yes — Claude found no blocking gaps; Codex identified F-CX-PREP-O-01 (High/75) + F-CX-PREP-O-02 (Medium/75) |
| Project | PASS | REVISE | Yes — Codex found F-CX-PREP-P-01 (High/75, same root as O-01) |
| Risk | PASS | REVISE | Yes — Codex found F-CX-PREP-R-01 (High/75, same root as O-01) |
| Structure | PASS | PASS | No divergence |
| Consistency | PASS | PASS | No divergence |
| Usage | PASS | PASS | No divergence |
| Aesthetics | PASS | PASS | No divergence |
| Performance | PASS | PASS | No divergence |

**Root cause of divergence**: Claude iter1 accepted the locked H-2 trade-off (3 named mistakes encoded inline) as sufficient coverage for all mistake-memory continuity risk. Codex iter1 examined the full 40-mistake inventory and identified that ~37 non-named mistakes covering git/worktree/path domains would also be wiped post-Stage-C, creating blind spots for any post-Stage-C executor tasks not anticipated by H-2's limited scope. Claude's reading was narrower (3 named = sufficient); Codex's reading was broader (40 total = partially covered).

**Resolution**: User authorized surgical iter2 (additive fix, no re-litigation) to pre-route both Codex findings as Planning binding constraints. See discussion staging file `prep-codex-divergence-iter2.md`.

## iter2 convergence (Claude PASS + Codex PASS)

**Aggregate verdict**: PASS.

| Perspective | Claude iter2 | Codex iter2 | Divergence |
|---|---|---|---|
| Overall | PASS | PASS | No divergence |
| Project | PASS | PASS | No divergence |
| Risk | PASS | PASS | No divergence |
| Structure | PASS | PASS | No divergence |
| Consistency | PASS | PASS | No divergence |
| Usage | PASS | PASS | No divergence |
| Aesthetics | PASS | PASS | No divergence |
| Performance | PASS | PASS | No divergence |

**Remaining open Low findings** (both systems, not divergence — both systems agree these are below REVISE threshold):
- Wording inaccuracy "deletion already staged" vs. worktree-deleted (Low, Claude consistency + Codex overall/project/risk)
- Binding-constraint phrasing looseness for option (a) (Low, Claude structure/usage)
- Task-size implication of option (a) RECOMMENDED (Medium/50, Claude risk — below High/50 threshold)
