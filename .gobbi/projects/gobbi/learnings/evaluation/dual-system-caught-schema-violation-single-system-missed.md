---
name: dual-system-caught-schema-violation-single-system-missed
description: Dual-system cross-family review catches schema-compliance defects a single family's self-consistent review misses
type: learnings
scope: project
feature: null
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [evaluation, codex, verification, docs-sync]
keywords: [schema-violation, cross-system-divergence, general-general, finding-mapping]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Dual-system evaluation catches schema-compliance defects a single-system review misses

## Insight

When authoring a doc that reuses a schema (a finding schema, a memory-frontmatter schema, a CLI contract), the executor's own V-checks and the same-family evaluator can both PASS the doc while a cross-family evaluator catches that the doc's own examples or mappings violate that schema. Add a schema-validity check explicitly to the V-check list for any doc that teaches or demonstrates a schema.

## Context

task-01 (author `skills/coding/review.md`) ran dual-system production and evaluation. The Claude executor authored the doc, ran V-checks (including "no language-siloed headings", "UPPERCASE verdicts", "no `blocking` field"), and passed. The Claude evaluator ran all 7 perspectives + Overall and returned PASS. The Codex evaluator ran independently and returned REVISE on a High/100 finding: 4 per-point finding-mappings in the doc (points 3a, 3b, 6a, 6b) used `Type=general` + `Domain=general`, the combo `evaluation/SKILL.md` explicitly forbids (the metadata contract error). Claude did not surface this. The doc explicitly states it reuses the canonical gobbi evaluation schema; those 4 mappings violated it. The fix was one central rule paragraph + 4 one-line rewrites.

## Reason

If only Claude had run evaluation, the schema violation would have shipped. A future reviewer applying the playbook would have emitted invalid `general`+`general` findings that violate the evaluation contract — a silent, latent defect. The dual-system divergence (Claude PASS / Codex REVISE) was the correct anti-groupthink signal. The cost of missing it was real: a public playbook teaching schema-invalid practice would have required a retrofit pass.

## How

For any doc that teaches, demonstrates, or reuses a formal schema:
1. Add to the V-check list: "every example, mapping, or specimen in the doc is valid under the schema it reuses."
2. In dual-system production, treat a cross-system divergence on a schema-compliance finding as a strong signal — both systems share the schema spec, but independent read-paths catch different violations.
3. After authoring a doc with mapping tables (Type/Domain, frontmatter fields, CLI flags), grep for the forbidden combos explicitly before declaring the V-checks PASS.

The general form: when a doc DEMONSTRATES a system (evaluation schema, memory schema, CLI contract), validation must check not just the doc's structure but also whether the doc's OWN examples are valid inputs to that system.

## Counter-cases

- If the doc does not reuse or teach a formal schema (e.g., a pure narrative doc, a changelog), no schema-validity V-check is needed.
- If both systems agree on PASS, the schema-compliance check did run on both sides. This learning applies when cross-system divergence surfaces — it is the anti-groupthink signal doing its job, not a routine pattern to enforce every loop.
- Single-system runs (`propose.mode: single`) cannot produce this divergence signal. This is one concrete cost of running degraded.

## Related

- [[review-md-finding-mapping-schema-fixed]] — the addressed decision record for this specific defect
