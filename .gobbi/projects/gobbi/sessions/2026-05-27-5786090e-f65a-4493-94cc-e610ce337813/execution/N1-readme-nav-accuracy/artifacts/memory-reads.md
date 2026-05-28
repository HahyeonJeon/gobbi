---
loop: execution
iter: 2
artifact_type: memory-reads
created_at: 2026-05-28
status: final
supersedes: []
related:
  - execution/N1-readme-nav-accuracy/artifacts/change-summary.md
  - execution/N1-readme-nav-accuracy/artifacts/verification-report.md
---

# N1 — Memory Reads

Enumerates every evaluation file and project-memory source consumed during this task's MEMORIZATION synthesis.

## Evaluation files consumed

### iter1

- `execution/N1-readme-nav-accuracy/evaluation/iter1/claude/findings.md` — Claude PASS verdict; Low finding on root README prose footnote; 18-README nav-accuracy table; §4.5 leak gate output; git stat.
- `execution/N1-readme-nav-accuracy/evaluation/iter1/codex/findings.md` — Codex REVISE verdict; High finding on root README missing 4 bullet entries; per-README nav-accuracy table; scope check; §4.5 leak gate output.

No iter2 formal evaluation file exists — iter2 verdict was established by manager ground-truth verification (16/16 bullets confirmed post-`66bf1be`).

## Project memory reads (task context)

- `.gobbi/projects/gobbi/skills/principles/SKILL.md` — loaded per load directives; Iron Laws referenced for scope discipline.
- `.gobbi/projects/gobbi/skills/mistake/SKILL.md` — loaded per load directives; checked for relevant pitfalls before execution.
- `.gobbi/projects/gobbi/skills/memorization/SKILL.md` — loaded per load directives; governs artifact frontmatter schema, staging procedure, and cumulative-staging rule applied here.
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md` — loaded per load directives (project rules directory); not directly applicable to this task.

## Task-specific reads (referenced in Facts)

- `.gobbi/projects/gobbi/features/project-memory/design/rules.md` — §4 dev-doc standard defining memory-standard scope (memory tiers only; non-memory surfaces out of scope). Referenced by both evaluators to resolve the root README footnote question.
- `features/project-memory/` feature README template — context for `## Subdirectories` section contract.
- Project mistake `evaluator-false-pass-without-diffing` — referenced as context for why Codex's literal diffing approach is the correct discipline.
