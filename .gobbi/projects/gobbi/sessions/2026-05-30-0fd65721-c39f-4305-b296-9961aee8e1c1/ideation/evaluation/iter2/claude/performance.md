# Performance Perspective — Claude Evaluation (iter 2)

## Artifact Summary + Memory reads
See project.md. Performance lens for ideation: resource/payload budgets, cache footprint, the 77M sessions-tree exclusion (PERF1/R1 from iter-1).

**Memory reads:** as project.md. No perf-sensitive code paths to read (markdown-driven repo).

## Locked Frame (Stage 1)
- **Expected resource cost stated, not implicit** — the plugin cache payload is bounded and its allow-set named.
- **Dominant cost identified** — what gets copied into `~/.claude/plugins/cache` on install.
- **Scale limit bounded** — the 77M sessions tree is excluded by construction.
- **Hot path flagged for Execution** — cache-contents enumeration committed as a verification.
- **Reasonable-looking design hides a bottleneck (adversarial)** — does materialization itself create an unbounded copy (e.g., all 16 skills × many files)?

## Per-scenario per-check results
- Resource cost stated: YES. R1 is the headline: repo-root would copy 77M sessions tree; bounded package removes it. The allow-set (skills/agents/hooks only) is the budget.
- Dominant cost identified: YES. Install-time copy into cache; bounded to the 3 component types.
- Scale limit bounded: YES. Post-install cache-contents gate asserts NO sessions/, NO project memory, NO repo content.
- Hot path flagged: YES. Cache-contents enumeration is a committed verification (`[verify: enumerate ~/.claude/plugins/cache/<id>/ ...]`).
- Hidden bottleneck (adversarial): PARTIAL — see F-PERF1. The draft bounds the EXCLUSIONS (no sessions tree) but does not state the order-of-magnitude of the INCLUDED payload (16 skills materialized = how many files/MB?). #251 materialized "49 skill directories / 170 files" historically; the current 16-skill v0.5 tree's materialized size is not estimated.

## Typed findings

### F-PERF1 — Included-payload size not order-of-magnitude estimated
- Type: assumption_risk · Domain: performance · Disposition: open · Confidence: 25 · Severity: Low
- Evidence: DD-2/DD-2a bound what is EXCLUDED (77M sessions tree) but the draft gives no estimate of the materialized INCLUDED payload (16 skills + 5 agents + 2 hooks). Historical #251 shipped 170 skill files; current tree differs.
- Why it matters: a bounded package is the right call and the included payload is certainly small relative to 77M, so this is near-FP. But "bounded" is asserted via exclusion only; a one-line "~X files / <Y MB materialized" estimate would make the cache budget complete. Low/25 — speculative, no evidence of an actual problem.
- Suggested direction: optionally note the included-payload order of magnitude; not a Planning blocker.

## iter-1 finding dispositions (Performance/Risk-shared)
- **PERF1 (repo-root cache payload, Medium/75)** — RESOLVED/addressed. Subsumed by R1's bounded-package resolution (DD-2) + the cache-contents gate. Confidence 100. (R1 itself is owned in risk.md.)

## Per-perspective verdict: PASS
Only Low/25 finding.

## Low-confidence appendix
- F-PERF1 (Confidence 25) retained above for visibility per evaluator judgment (borderline; kept because it completes the cache-budget criterion).
