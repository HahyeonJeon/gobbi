---
name: pacing-regex-reaches-locked-site
description: T9's pacing candidate regex now reaches the locked IP-2-c site topics.md:38, resolving F2-PROJ-01/F3-PROJ-01
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification, docs-sync]
keywords: [f3-proj-01, pacing-candidate-regex, topics-md-38, ip-2-c]
author: claude
scenario: plan-proj-pacing-coverage
item_status: implemented
anchor: novel
implemented_in: null
---

# T9 pacing candidate regex reaches the user-adjudicated `topics.md:38` site

## What

The T9 whole-bundle pacing sweep's candidate regex must reach every locked pacing-removal site, including the
user-adjudicated `topics.md:38-39` prompt-selection-count line ("Choose two to four prompts"), IP-2-c / VA-05.

## Why

At iter2 the regex used a digits-only numeric-range alternative and returned 16 hits, missing `topics.md:38`
entirely — a genuine coverage gap on a site the user explicitly locked into scope 2026-07-17
(`F2-PROJ-01`/`F3-PROJ-01`, High/100). A gate that misses a locked obligation while looking complete is exactly
the failure `verify-ssot-and-metrics-by-location-not-intent` warns against.

## Verification

Widened the regex to spelled-number ranges + selection-verb counts. Re-ran against the live `topics.md`: **17**
hits including `topics.md:38`. Diff of the old (16) vs new (17) hit sets is exactly `+topics.md:38`. The
enumerated 17-hit table in the plan matches the live `rg` output file-by-file — reproduced-then-confirmed by the
iter3 evaluator, not accepted from the report.

## Status notes

Resolved and confirmed by execution. The regex's residual incompleteness against OTHER plausible pacing
phrasings (not this specific locked site) is tracked separately —
[[pacing-regex-residual-formulation-gaps]] — and is explicitly by-design, not a defect of this fix.

## Related

- [[pacing-regex-residual-formulation-gaps]] — the residual-coverage decision this fix does not itself close
