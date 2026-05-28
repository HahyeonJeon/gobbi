---
loop: preparation
iter: 1
artifact_type: memory-reads
created_at: 2026-05-26
status: final
supersedes: []
related:
  - preparation/artifacts/handoff.md
---

# Preparation Loop — Memory Reads (iter 1, PASS)

Every evaluation file consumed by MEMORIZATION at Step 6, enumerated per system and perspective.

## System: claude — iter 1

| File | Perspectives |
|---|---|
| `preparation/evaluation/iter1/claude/project.md` | Project |
| `preparation/evaluation/iter1/claude/risk.md` | Risk |
| `preparation/evaluation/iter1/claude/usage.md` | Usage |
| `preparation/evaluation/iter1/claude/structure.md` | Structure |
| `preparation/evaluation/iter1/claude/consistency.md` | Consistency |
| `preparation/evaluation/iter1/claude/aesthetics.md` | Aesthetics |
| `preparation/evaluation/iter1/claude/performance.md` | Performance |
| `preparation/evaluation/iter1/claude/overall.md` | Overall |

## System: codex — iter 1

| File | Perspectives |
|---|---|
| `preparation/evaluation/iter1/codex/overall.md` | Overall |

## Finding summary across all files

| Finding ID | System | Perspective | Type | Domain | Severity | Confidence | Disposition |
|---|---|---|---|---|---|---|---|
| F1 | claude | project | general | docs-sync | Medium | 100 | addressed (remediation applied) |
| F2 | claude | project | assumption_risk | docs-sync | Low | 75 | open (deferred, user-ratified) |
| F3 | claude | consistency | general | docs-sync | Low | 100 | open (Execution-deferred, CN-1) |
| F4 | claude | risk | design_flaw | process | Medium | 75 | addressed (remediation applied) |
| F5 | claude | performance | assumption_risk | process | Low | 50 | open (Planning carry-forward) |
| F6 | claude | usage | general | docs-sync | Medium | 100 | addressed (remediation applied) |
| C-PREP-001 | codex | overall | general | docs-sync | Low | 90 | addressed (noted for record; backlog deleted so moot) |

## Draft read

- `preparation/rawdata/draft-iter1.md` — Preparation readiness assessment, READY, HEAD d2b5b37.
