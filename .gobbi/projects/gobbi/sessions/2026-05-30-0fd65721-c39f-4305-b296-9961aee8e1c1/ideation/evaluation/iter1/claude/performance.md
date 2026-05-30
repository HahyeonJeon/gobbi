# Performance — Ideation eval iter1 (claude)

## Artifact Summary + Memory reads
(See project.md.) Performance lens on a markdown/manifest packaging artifact: install-time copy cost, hook-fire overhead, scale of the skills tree.

## Locked Frame (Stage 1)
- **S1 Dominant cost identified.** (a) install-time copy of the bundled tree characterized; (b) hook-fire overhead per event noted.
- **S2 Scale limits bounded.** (a) point where approach breaks named (e.g. tree size, hook latency).
- **S3 (adversarial) A reasonable design hides a per-iteration cost blow-up.** (a) no per-tool-call heavy work added; (b) bundling the whole `.gobbi/projects/gobbi/skills+agents` tree into the cache copy is bounded.
- not-applicable (cost/budget): no paid API / infra / token cost introduced — local file packaging only; Risk perspective carries the cost-runaway check.

## Per-scenario per-check results
- **S1a** PARTIAL — the artifact does not quantify install-copy cost of bundling the full canonical tree, but at Ideation stage this is correctly deferred ("Execution refines mechanism"); the child-doc anti-pattern explicitly says Ideation cannot measure, only commit a strategy. The validation lines ("confirm files present in cached copy") are an adequate Execution strategy. **S1b** YES — hooks already fire on SessionStart/PostToolUse today; relocation does not change fire frequency. No new overhead.
- **S2a** ACCEPTABLE — no explicit scale ceiling, but the surface (one user, one repo, ~59 skill files + 5 agents + 2 hook scripts) is trivially small; a perf ceiling would be over-engineering at this scope. The child doc warns against "premature optimization used to dismiss" but also that Ideation measurement is premature.
- **S3a** YES — DD-3 keeps hook bodies UNCHANGED; no per-tool-call work added; relocation is registration-only. I confirmed both hook scripts resolve targets from runtime inputs (no added filesystem walks). **S3b** YES — the copy is one-time-per-install of a small tree; no combinatorial blow-up.

## Typed findings
(none above confidence 25)

## Low-confidence appendix
**F-PERF1** — Type: checklist_gap · Domain: performance · Disposition: open · Confidence: 25 · Severity: Low
Evidence: No bounded statement of how large the bundled canonical tree is, so a future maintainer can't tell when install-copy cost matters. Why it matters: negligible at current scale; only relevant if gobbi's skill tree grows orders of magnitude. Suggested direction: optional one-line "bundle is ~N files, copy cost negligible" note. Suppressed (≤25): genuinely premature at this scale.

## Per-perspective verdict: PASS
