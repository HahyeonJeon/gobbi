# Performance — iter1 Claude

## Stage 0 — Artifact Summary
See `project.md` § Stage 0. The artifact is an Ideation draft for docs + 2 shell scripts; the runtime cost surface is minimal but non-zero (PostToolUse fires after every Task spawn).

### Memory reads — see `project.md`.

## Stage 1 — Locked Frame

### Scenarios (Performance)

**S-Pf-1: Expected operation rate stated** (seed)
- [a] Big-O / order-of-magnitude reasoning where loop / data scale matters
- [b] Scale assumptions documented (not "should be fine")

**S-Pf-2: Dominant cost identified** (seed)
- [a] External-call patterns characterized (file IO count, retries)
- [b] Caching / memoization decisions explicit

**S-Pf-3: Scale limits bounded** (seed)
- [a] The point at which the design no longer applies is named
- [b] Performance budgets stated (latency / throughput / memory)

**S-Pf-4: Hot paths flagged for Execution attention** (seed)
- [a] Each hot path has a measurement strategy committed
- [b] No silent "framework will handle it" assumption

**S-Pf-5: Reasonable design hides sub-linear bottleneck** (seed, adversarial)
- [a] Loops over potentially-large collections checked for per-iteration external calls
- [b] Recursive / nested structures checked for combinatorial blow-up

**S-Pf-6: PostToolUse hook adds latency to every Task return** (NEW, adversarial)
- [a] Hook cost dominated by transcript JSONL scan (linear in transcript length per spawn)
- [b] Worst-case bound is articulated for sessions with high spawn counts (e.g., > 50 spawns)

**S-Pf-7: Reconstructor cost grows with session length** (NEW, adversarial)
- [a] Reconstructor cost bound articulated for long sessions
- [b] Reconstructor invocation frequency is explicit

## Stage 2 — Findings

### S-Pf-1 results
- [a] PARTIAL — Order-of-magnitude not stated for T3 hook. The hook fires once per Task spawn; prior session had 17+ spawns over ~10 hours; typical session 5–50 spawns. Each fire reads `$transcript_path` JSONL — which grows with session length (prior session transcript = 1675 lines). The cost per hook fire is ~O(L) where L = current transcript length. Total session cost ~ O(N × L) where N = spawn count. For a 50-spawn session with 5000-line transcript at session end, that's 50 × ~2500 (average length) = ~125k lines of JSON scanned across the session. **Not stated anywhere in the draft.**
- [b] FAIL — Scale assumptions are implicit. "Hook does not block Task return" (F-1 mitigation) is the closest statement; that's a non-blocking promise, not a scale bound.

### S-Pf-2 results
- [a] PARTIAL — External-call pattern: hook does (1) jq parse of stdin, (2) read transcript JSONL, (3) jq filter for matching tool_use_id, (4) read session.json, (5) jq merge, (6) atomic write. Step (2) + (3) is the dominant cost. No caching (each invocation re-reads transcript from scratch). The draft doesn't characterize this.
- [b] PARTIAL — No memoization decision is made. The natural memoization would be "use a tail-from-last-known-offset" pattern (read only new transcript lines since last hook fire), but this is not discussed.

### S-Pf-3 results
- [a] FAIL — No "scale limit" named. A session with thousands of Task spawns (extreme case) would see hook cost grow polynomially.
- [b] FAIL — No latency or throughput budget. "Hook does not block Task return" is the only constraint.

### S-Pf-4 results
- [a] PARTIAL — The hook IS a hot path (fires on every Task tool completion). The draft does not explicitly flag it as a hot path with a measurement strategy. Validation method for D-3-1 says "single-script verifier on fixture transcript" — that's correctness, not latency.
- [b] PARTIAL — Implicit "Claude Code will handle it" — hook timeout / failure semantics are inherited from Claude Code's hook contract, not specified by the draft.

### S-Pf-5 results
- [a] FAIL — Per-iteration loop over transcript JSONL is the hidden bottleneck. Each hook fire is O(L) where L grows with the session.
- [b] PASS — No recursive / nested structure in the draft's design (the hook is non-recursive bash).

### S-Pf-6 results (NEW adversarial)
- [a] PARTIAL — Cost is acknowledged implicitly by the structure (read JSONL → jq filter) but never measured.
- [b] FAIL — No worst-case bound for high-spawn-count sessions.

### S-Pf-7 results (NEW adversarial)
- [a] PARTIAL — Reconstructor runs at Wrap-up or on-demand (one-time per invocation); cost ~O(L) once. Not bad. But not stated.
- [b] PASS — Frequency = once at Wrap-up + ad-hoc. Stated in G-2.

### Typed findings

```yaml
finding-id: Pf1-iter1
type: assumption_risk
domain: performance
disposition: open
confidence: 50
severity: Medium
surfaced-by: claude
```
**Pf1 — PostToolUse hook latency is undefined; per-spawn cost grows with transcript length (~O(L)); total session cost ~O(N×L) un-bounded.** Each hook fire reads the entire transcript JSONL via `cat` + `jq` to locate the matching `tool_use_id`. For typical sessions (5–50 spawns, transcript 1000–5000 lines) this is sub-second; for extreme sessions (hundreds of spawns, long transcripts) cost grows non-trivially. No latency budget, no tail-from-offset optimization, no hot-path flag for Execution measurement. Evidence: draft G-1 step 2 (read transcript line by `tool_use_id`), F-1 ("Hook does not block Task return"). Suggested direction: surface as an explicit `assumption_risk` (~O(L) per fire is acceptable for current session sizes; deferred until measurement-driven by Execution). OR add a hot-path flag with "measure hook latency on fixture transcript at PR review."

```yaml
finding-id: Pf2-iter1
type: scenario_gap
domain: performance
disposition: open
confidence: 50
severity: Low
surfaced-by: claude
```
**Pf2 — No scale-limit scenario for sessions with > 100 Task spawns.** Gobbi sessions appear to use 5–50 spawns currently; the next workflow-improvement campaign could push this higher (e.g., wider evaluator parallelism). A scenario stating "above what spawn count does the hook architecture need revisiting" is absent. Evidence: prior session had 17 spawns over 10 hours; draft cites this in T3-I-1 but does not project. Suggested direction: add an Edge case scenario "E-5 — high-spawn-count session (> 50 spawns)" with explicit measurement expectation.

### Low-confidence appendix
- (none above 25)

## Verdict
**PASS** — Performance is not a blocker for Ideation. The hook is a hot path with undefined latency budget, but at current session scale (5–50 spawns) the cost is acceptable. Pf1 (assumption-risk) and Pf2 (scale-limit scenario gap) are Medium/Low recommendations for Planning to weigh, not REVISE blockers.
