# Aesthetics — iter2 Claude

## Stage 0 — Artifact Summary
See `project.md`. iter2 adds CL-1 (process/docs path-vocabulary reconciliation note, line 286), F-6 input-side/result-side disambiguation (line 377-381), and several "(UPDATED iter2 — finding N)" inline flags.

## Stage 1 — Locked Frame

### Scenarios (Aesthetics)

**S-A-1 (carry)** — Self-evident structure — iter1 PASS.
**S-A-2 (carry)** — No placeholders / TODO leakage — iter1 PASS.
**S-A-3 (carry)** — Cross-references resolve — iter1 PASS.
**S-A-4 (carry)** — Phrasing precision — iter1 A1 (over-claim on T3 contract — Low); iter2 D-3-3 narrative re-checked.
**S-A-5 (carry)** — Term consistency — iter1 A2 (hyphenation drift — Low); iter2 inherits.
**S-A-6 (NEW iter2)** — iter2 inline "UPDATED iter2 — finding N" flags are consistent and findable.
**S-A-7 (NEW iter2)** — CL-1 reconciliation note (line 286) explains the `.claude/` vs `.agents/` vs `.gobbi/` surface split.

## Stage 2 — Findings

### S-A-4 (phrasing precision)

iter1 A1 said the "Decisions Locked" bullet over-claimed `tool_result` richness. Re-check iter2 line 57: "Both events confirmed as officially supported shell-command hooks per `https://code.claude.com/docs/en/hooks` (fetched 2026-05-23; see Decisions Log iter2 fix-decision F-3)." This is the iter2 NEW phrasing for D-3-3 (line 350): "verified via WebFetch ... Result: `PostToolUseFailure` IS officially documented." Phrasing is direct and source-cited (modulo F-3 verification concern in project.md P2). Disposition: addressed for A1 stand-alone language.

### S-A-5 (term consistency)

A2 (hyphenation drift): iter1 noted "session memory" vs "session-memory" drift. iter2 has NOT cleaned this up — grep `session.memory` shows both forms still proliferate (e.g., line 67 "session.json.agents[]" vs line 218 "session-memory commits"). Low-severity carry-forward.

### S-A-6 (NEW — inline flag consistency)

Whole-file scan: "UPDATED iter2 — finding N" appears at:
- line 263 (T1-I-T1.a, finding 4) ✓
- line 266 (T1-I-T1.d, finding 2) ✓
- line 271 (T1-I-T1.i, new — from C2) — actually labeled "(NEW iter2 — from iter1 C2)" ✓
- line 272 (T1-I-T1.j, new from R2) ✓
- line 276 (T3-I-T3.a, finding 1) ✓
- line 277 (T3-I-T3.b, finding 1) ✓
- line 278 (T3-I-T3.c, finding 3) ✓
- line 280 (T3-I-T3.e, finding 6) ✓
- line 282 (T3-I-T3.g, new from finding 1 design) ✓
- line 286 (CL-1, new from COD-CONS-001/AESTH-001/USAGE-001) ✓
- line 296 (D-1, finding 4) ✓
- line 310 (D-3, finding 2) ✓
- line 334 (D-3-1, finding 1) ✓
- line 343 (D-3-2, finding 1) ✓
- line 350 (D-3-3, finding 3) ✓
- line 359 (D-3-3-resolver, new from finding 5) ✓
- line 375 (D-3-4, finding 6) ✓
- line 388 (D-3-5, new from finding 1) ✓
- line 395 (D-3-6, new from finding 7) ✓

19 inline flags. All findable by grep. Disposition: PASS — consistent flagging.

### S-A-7 (NEW — CL-1 reconciliation)

CL-1 (line 286) explains the path-vocabulary split in 1 paragraph: `.claude/skills/` is Claude-runtime-facing; `.gobbi/projects/gobbi/skills/` is Codex/plugin-facing; `.agents/skills/{slug}` are symlinks. The paragraph also clarifies the Scope Contract intentionally targets `.claude/skills/` because T1+T3 are Claude-runtime concerns. This addresses iter1 codex/aesthetics COD-AESTH-001 directly. Disposition: addressed.

### Typed findings

```yaml
finding-id: A1-iter2
type: general
domain: docs-sync
disposition: open
confidence: 50
severity: Low
surfaced-by: claude
inherited-from: iter1/claude/aesthetics A2
```
**A1 (carry-forward)** — Hyphenation drift "session memory" / "session-memory" persists in iter2. Whole-file grep returns both forms scattered across § Scope Contract, § Framed Problem, § Scenarios. Not blocking; Planning-stage docs polish.

```yaml
finding-id: A2-iter2
type: general
domain: docs-sync
disposition: addressed
confidence: 100
severity: Medium
surfaced-by: claude
inherited-from: iter1/codex/aesthetics COD-AESTH-001
```
**A2 (carry-forward, addressed)** — Path-vocabulary `.claude/` vs `.agents/` vs `.gobbi/` reconciliation note CL-1 (line 286) explicitly explains the surface split + the intentional Claude-runtime scoping. Disposition: addressed.

```yaml
finding-id: A3-iter2
type: general
domain: docs-sync
disposition: deferred
confidence: 25
severity: Low
surfaced-by: claude
inherited-from: iter1/codex/aesthetics COD-AESTH-002
```
**A3 (carry-forward, deferred)** — DQ-anchor visibility: iter1 codex flagged that `T1-DQ-N` / `T3-DQ-N` labels appear in design rationales without an in-draft glossary. iter2 deferred this per F-9 line 502 (anchors live in `sub-step-d-design-iter1.md`). Low severity. Acceptable defer.

### Low-confidence appendix
- (none above 25)

## Verdict
**PASS** — Aesthetics is acceptable. CL-1 reconciliation is real, inline iter2 flags are consistent, all phrasing precision concerns are Low-severity carry-forwards. iter2 introduces no NEW aesthetic regressions.
