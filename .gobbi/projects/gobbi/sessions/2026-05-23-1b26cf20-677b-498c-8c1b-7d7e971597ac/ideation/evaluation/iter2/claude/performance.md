# Performance — iter2 Claude

## Stage 0 — Artifact Summary
See `project.md`. iter2 adds bounded cost paragraph (line 426): `maxIterations × 5 loops = 15 commits per session` + N hook fires; transcript-scan cost O(L) per hook; storage cost ~10–50 KB per session committed to develop.

## Stage 1 — Locked Frame

### Scenarios (Performance)

**S-Pf-1 (carry)** — Hot path identified — iter1 PARTIAL (no latency budget); iter2 partial (bounded paragraph).
**S-Pf-2 (carry)** — Scale limit named — iter1 Low gap; iter2 documents bounds.
**S-Pf-3 (NEW iter2)** — flock acquisition cost on contended path is bounded.
  - [a] Lock-acquire latency under expected concurrency (≤ 5 parallel hook fires).
  - [b] No deadlock surface.

## Stage 2 — Findings

### S-Pf-1 (hot path)

The bounded paragraph at line 426 acknowledges per-hook cost is bounded by O(transcript_lines), typically < 5000 lines. No latency budget locked. This is acceptable for Ideation — bounds are stated, measurement deferred to Execution-time fixture. Matches iter1 Pf1's "downgrade to assumption_risk" recommendation. Disposition: addressed (assumption acknowledged).

### S-Pf-2 (scale limit)

The bounded paragraph cites "20-50 spawns per session typically" — explicit scale assumption. Does not cover the "what if a future workflow campaign pushes to 500+ spawns" question, but per iter1 Pf2 (Confidence 50, Low), that was a recommendation not a blocker. Disposition: addressed.

### S-Pf-3 (NEW — flock contention)

**S-Pf-3.a — PASS (with note).** flock `-x` blocks until acquired; under expected concurrency (dual-system evaluator pattern = 2 parallel hook fires per Task completion batch), the worst case is one hook waits the duration of another's read-modify-write — sub-second for the cited transcript scan. No explicit lock-acquire timeout is specified; if a hook crashes between flock and exit, the lock is released on process death per POSIX. Acceptable.

**S-Pf-3.b — PASS.** Single-resource lock (`session.json`); no other lock acquired by the same script. No deadlock surface.

### Typed findings

```yaml
finding-id: Pf1-iter2
type: assumption_risk
domain: performance
disposition: addressed
confidence: 75
severity: Low
surfaced-by: claude
inherited-from: iter1/claude/performance Pf1; iter1/codex/performance COD-PERF-001
```
**Pf1 (carry-forward, addressed)** — Bounded paragraph at line 426 names the operation rate (maxIter × 5 = 15 commits/session), dominant cost (transcript scan), scale assumption (20-50 spawns), and measurement deferral (Execution-time fixture). Acceptable for Ideation. Iron Law 6 satisfied — no vague "fast enough" claim.

```yaml
finding-id: Pf2-iter2
type: scenario_gap
domain: performance
disposition: deferred
confidence: 50
severity: Low
surfaced-by: claude
inherited-from: iter1/claude/performance Pf2
```
**Pf2 (carry-forward, deferred)** — Scale-limit scenario for > 100 spawns is acknowledged via the "20-50 typical" bound but not explicitly scenario'd. Low severity; defer to follow-up backlog.

### Low-confidence appendix
- (none above 25)

## Verdict
**PASS** — Performance is not a blocker. iter2 addressed iter1 Pf1 (bounded paragraph) and acceptably deferred Pf2. No NEW performance findings from D-3-5 flock or D-3-6 correlation key (both are O(1) lock + bounded jq scans).
