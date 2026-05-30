# T2 auto-mode.md — Performance Perspective (iter1, claude)

## Artifact Summary

(See `project.md`.)

## Memory reads

- Idea §4 / Plan T2

## Locked Frame (Stage 1)

**Scenario Perf1.** Doc-load cost — agents loading auto-mode.md as a sub-skill.
- [x] 202 lines / 12 267 bytes — well below any practical context budget
- [x] No code blocks, no large tables beyond two 11-row defaults tables — token cost trivial

**Scenario Perf2 (adversarial).** Runtime cost — does Auto-mode spec introduce per-loop overhead?
- [x] Structural invariant declared in §1 ("Nothing about the sequence … changes in Auto Mode") — no new state-machine surface
- [x] §3 defaults match Idea §5 (no new fields) — no schema bloat
- [x] §5 maxIterations exhaustion contract preserves the existing line-405 contract — no new interrupt path

**`not-applicable: <rationale>`.** Token/API cost-impact: none beyond a marginal one-time read; the doc itself is not on a hot path.

## Stage 2 — Performance verdict

- **Verdict: PASS.**

## Findings

None.

## Low-confidence appendix

- (Conf 25) Duplicate §3+§6 tables marginally increase per-load tokens. Negligible (~30 extra lines on a 1-2k-line skill load); not a Performance concern.
