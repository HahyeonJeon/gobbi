# Performance Perspective — iter2 re-eval (Claude)

## Frame

Scenarios:
1. Stub size / footprint reasonable for a STUB artifact.
2. iter2 draft size — no bloat from changelog/concern reclassification.
3. Cost-awareness content (Idea-locked) preserved somewhere.

## Verification

- Stub: 136 lines, mostly HTML comments scaffolding Execution targets. Reasonable for an 8-section stub.
- iter2 draft: 169 lines (iter1 was 198 lines). Slightly leaner; iter2 trimmed.
- "Cost + sandbox budget awareness" content moved into `## Use cases` sub-bullet (stub lines 104-107) — content is preserved but no longer at a dedicated H2 grep target.

## Findings

### F-PF-01 — Cost-awareness content discoverability degraded (positive intent, negative outcome)
- Type: `assumption_risk`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 75
- Severity: Medium
- Evidence: Idea draft-iter3:349 + iter1 ideation Performance eval (iter3/codex/performance.md:28) both required "Cost + sandbox budget awareness" as a discoverable H2 to satisfy COD-PERF-001's anti-cost-balloon discipline. iter2 folded into `## Use cases` lines 104-107 — Execution can still write the content there, but a future reader running `grep "^## Cost" .gobbi/projects/gobbi/skills/codex/SKILL.md` will get zero hits. Cost-awareness is harder to discover/audit when buried in a "Use cases" subsection.
- Why it matters: COD-PERF-001 (the Ideation-phase performance lock) is partly weakened — the section that exists explicitly to gate cost balloons is no longer a structural top-level anchor. Tied to F-S-01.
- Suggested direction: covered by F-S-01 remediation (restore H2 #7).

## Must-preserve

- Stub size reasonable.
- iter2 draft trimmed iter1 down (good).
- Cost-awareness content body lines 104-107 (good — just needs an H2 anchor).

## Verdict

REVISE — Medium / 75 here is below revise threshold on its own (REVISE requires High Confidence ≥ 50), but inherits the project/structure verdict via F-S-01.
