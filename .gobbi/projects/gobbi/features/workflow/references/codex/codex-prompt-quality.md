---
name: codex-prompt-quality
description: Codex bridge prompts must include context, focused scope, validation, and done criteria.
type: references
scope: feature
feature: workflow
status: active
created: 2026-07-01
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [codex, design, validation]
keywords: [prompting, context, validation, definition-of-done]
author: codex
title: Codex prompt quality guidance
source: https://developers.openai.com/codex/prompting
accessed: 2026-07-01
ref_type: docs
---

# Codex prompt quality guidance

## Insight
Codex prompts work better when they include focused scope, useful context, and clear validation or test criteria. The bridge prompt must therefore state role, Scope Contract, paths, allowed writes, output structure, validation gates, and definition of done.

## Reason
The Claude wrapper cannot rely on follow-up conversation with the Codex job. A self-contained prompt is the main control surface for preventing ambiguous output, wrong writes, and invalid success reports.

## Source
- https://developers.openai.com/codex/prompting

## Excerpt
No verbatim excerpt needed. The approved research addendum records the applicable official sections.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-01 | 019f1f53-6ae2-7853-953e-4ee246cbef0b | Defining self-contained proposer and evaluator prompt anatomy. |

## Related

No related memory links staged in this iteration.
