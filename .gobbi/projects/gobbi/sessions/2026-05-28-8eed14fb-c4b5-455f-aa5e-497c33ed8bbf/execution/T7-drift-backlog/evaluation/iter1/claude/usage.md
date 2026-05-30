# T7 evaluation — usage perspective (iter1)

**Target:** `.gobbi/projects/gobbi/backlogs/model-assignment-drift-delegation-vs-settings-default.md`

**Perspective:** usage — how a future agent / user will pick this up.

## Stage 0–1: Frame
- Usage scenario: a future session at Configuration step queries `backlogs/` for open items, opens this file cold.
- Picking-up session needs: WHAT is open, WHERE the conflict lives, WHY it was deferred, WHAT options exist, HOW to pick one.

## Stage 2
- WHAT: title + frontmatter `description` deliver immediately.
- WHERE: both file paths are cited 7×, with the exact JSON keys (`chat.models.claude.executor`, `auto.models.claude.executor`) and the doc section (`§ Model Selection`).
- WHY deferred: dedicated section with reasoning (scope was mode structure, not model-assignment governance).
- WHAT options: three labeled options (a/b/c) with rationale per option.
- HOW to pick: option (c) explicitly says "run a dedicated Ideation loop" — actionable handoff.

## Findings
**F1** — Type: `general` · Domain: `docs-sync` · Disposition: `open` · Confidence: 25 · Severity: Low
- Evidence: No line-anchor (e.g., "delegation/SKILL.md line N") for the Model Selection table; reader must grep.
- Why it matters: minor reader friction; table is grep-able by name.
- Suggested direction: optional addition; not blocking.

## Verdict
**PASS** — Highly usable. A picking-up agent can act from this file alone.
