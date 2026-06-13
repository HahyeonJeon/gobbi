---
name: insight-headlines-factual-not-self-graded
description: Insight headlines must state the insight as a fact, then where it applies — no self-grading phrases
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [docs-sync, aesthetics, insight-writing]
---

# Insight headlines: factual form, not self-grading — implementation checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Insight headlines must state the insight as a fact ("Industry names X separately from Y") | `evaluation/iter1/claude/aesthetics.md` (aest-insight-headlines-overstate-scope-safety) | implemented | Read all INT-* + EXT-* headlines; confirm none say "strongly validates" or "shows that our approach is correct" |
| 2 | Each insight states where it applies immediately after the fact statement | Same | implemented | Each EXT-* entry ends with "Applies to D-N: …" |

## Item details

### 1. Factual headline form
Self-grading phrases like "this strongly validates our D8 decision" evaluate the design from the insight instead of stating the insight and letting the reader draw conclusions. The correct form: state the fact, then where it applies.

**Anchor reasoning**: Principle 7 (write plainly and literally). The insight must stand on its own fact — the application is the connection to the design, not a quality endorsement.
