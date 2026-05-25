# Performance — T04 gobbi-hook-authoring (iter1, claude)

## Artifact Summary + Memory reads
See project.md. Artifact is a static documentation file; no runtime hot path, IO, or benchmark surface is introduced by the skill itself.
**Memory reads**: as project.md.

## Locked Frame (Stage 1)
- **S1 No runtime perf surface introduced** — the skill is prose; it does not add code that executes.
- **S2 (adversarial) Does the skill teach a perf-harmful hook pattern?** — e.g., advising per-iteration external calls, or unbounded transcript scans.
- not-applicable: cost/budget + observability Coverage-Matrix items — a docs skill emits no tokens/metrics at runtime; the hooks it documents are pre-existing and out of T04 scope.

## Per-scenario per-check results
- S1 YES — pure documentation; no executable artifact added.
- S2 YES (no harm) — the patterns taught (read stdin once via `payload="$(cat)"`, single transcript `jq` with `tail -n1`, flock critical section) are the efficient patterns, matching the witnesses. The skill explicitly warns against streaming stdin to multiple jq calls (Constraints), which is the perf-positive guidance.

## Typed findings
None. Performance perspective is effectively N/A for this static docs artifact; the documented patterns are not perf-harmful.

**Verdict: PASS**

## Low-confidence appendix
(none)
