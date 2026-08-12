# Documentation review operation

## Intent

`docs-review` is the shared operation for reviewing one caller-named Markdown subject for reader-facing
quality. It returns one evidence-backed report while keeping the reviewed subject read-only. It separates
Defects, Optional Improvements, Strengths, and Evidence Gaps so each result has the right owner and decision.

## Ownership and distribution

The canonical owner is [`docs-review/SKILL.md`](../../../skills/docs-review/SKILL.md). Its required late-loaded
report form is [`templates/report.md`](../../../skills/docs-review/templates/report.md). The shared `gobbi`
map routes the operation. Generated repository discovery and plugin package views are projections: the Codex
directory and Claude report links resolve to the canonical owner, while package files are materialized regular
copies. Regenerate and compare these views instead of editing them directly.

## Review contract

- Bind the exact subject identity, readers, tasks, scope, governing basis, caller questions, reviewer
  relationship, output boundary, and any caller-supplied labels before judgment.
- Inspect shape and structure, vocabulary and precision, economy and necessity, readability and flow, plus
  applicable cross-cutting concerns. Route specialized factual judgment to its domain owner.
- Use typed `D-NN`, `I-NN`, `S-NN`, and `Q-NN` records with locations, evidence, impact, owners, and checks.
  Keep the types distinct and never derive severity, priority, blocker, verdict, or acceptance.
- Complete improvement analysis for the whole review. Render supported `I-NN` opportunities or an evidenced
  `None supported` result; do not invent cosmetic work to satisfy a quota.
- Load the report template after reconciliation. Verify identity, anchors, fields, counts, zero states,
  output effects, and the unchanged subject before handoff.

## Boundaries

The operation writes only the caller-selected report file, or no file for explicit response-only delivery. A
changed subject or failed or unauthorized write is a recoverable stop. The operation does not edit the subject,
grant acceptance or release authority, or replace specialist security, legal, runtime, accessibility, or
evaluation judgment.
