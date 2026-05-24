# Performance — iter3 Claude

## Stage 0 — Target read

Performance lens: do the iter3 changes alter the runtime cost/latency surface from iter2? Are bounded budgets preserved?

## Stage 1 — Inheritance

| Finding | Source | iter3 disposition |
|---|---|---|
| iter1 Pf1 (latency budget) | claude | addressed iter2 (bounded paragraph line 439); preserved iter3 |
| iter1 Pf2 (scale > 100 spawns) | claude | deferred iter2; preserved iter3 |
| iter1 COD-PERF-001 (latency budget) | codex | addressed iter2; preserved iter3 |
| iter1 COD-PERF-002 (storage budget) | codex | addressed iter2; preserved iter3 |
| iter2 PERF (preserve lock-held timing measurement) | iter2 codex | preserved iter3 |

## Stage 2 — Performance walk

### P-A — Fix A performance impact

Fix A is a string-substitution of the branch-name token from `session/...` to `chore/session-...`. Zero runtime cost change. The added 4-char prefix adds 4 bytes to the branch name (negligible). No regex performance change (still O(branch_name_length)). Slug length increases from 23 chars to 27 chars (still within the 3-50 budget). **No performance impact.**

### P-B — Fix B performance impact

Fix B adds verbatim documentation quotes to the staged reference file + draft sections. No runtime mechanism change. The dual PostToolUse/PostToolUseFailure registration was already locked in iter2 CP-D-1. The added verbatim text is documentation-only; no impact on hook latency. **No performance impact.**

### P-C — Fix C performance impact

Fix C is documentation + a new backlog file + a 2-line annotation in D-3-3-resolver. The resolver's runtime path is unchanged: today it falls through to step (ii) regardless of whether step (i) is annotated as dormant. If step (i) ever activates (the file is created in a future Execution), the resolver shifts from one filesystem stat call (step (ii) directory enumeration) to two (step (i) file read + parse, possibly bypassing step (ii)). Either path is sub-millisecond on local SSD. **No measurable performance impact.**

### P-D — Bounded budgets preserved

iter2's performance budget paragraph (line 439):
- Worst-case 15 per-iteration session-memory commits (5 loops × 3 iter default `maxIterations`).
- Transcript-scan O(transcript_lines) bounded per hook fire; typical < 5000 lines.
- Storage cost ~10-50 KB per session committed to develop.
- No external network call (hook + reconstructor are local-only).

iter3 changes do not breach any of these budgets. **Preserved.**

### P-E — Concurrency budget

D-3-5 flock-x serialization bounds the worst-case concurrent hook contention. The lock is held for the read-modify-write cycle (jq parse + jq compose + atomic temp+mv). Typical hold time is well under 100ms. iter3 does not change this. **Preserved.**

## Stage 3 — Findings

### F-PERF-iter3-1 — No iter3 performance regression (POSITIVE)
- type: `general`
- domain: `performance`
- disposition: `addressed`
- confidence: 100
- severity: Low (informational)
- evidence: Fix A is a branch-name token change with zero runtime implication. Fix B is documentation-only. Fix C is a dormant-precondition annotation + backlog file with zero runtime cost change.
- why it matters: confirms iter3 surgical-fix discipline did not introduce performance debt.
- suggested direction: no change.

### F-PERF-iter3-2 — Inherited performance findings preserved
- type: `general`
- domain: `performance`
- disposition: `addressed`/`deferred`
- confidence: 100
- severity: Low
- inherited-from: `iter1/claude/performance-Pf1`, `iter1/codex/performance-COD-PERF-001/002`
- evidence: iter2 bounded-paragraph (line 439) untouched in iter3 diff; budgets remain valid.
- why it matters: tracking continuity.

## Preserve list (carry to Planning)

1. Bounded performance paragraph at line 439 (15-commit ceiling + transcript-scan O(N) per-hook).
2. D-3-5 flock-x lock-hold-time bound (sub-100ms typical).
3. No-external-network-call invariant for hook + reconstructor.

## Verdict

**PASS** — No new performance findings; all iter3 changes are documentation/token-level; bounded budgets preserved.
