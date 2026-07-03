---
name: prompt-plus-stdin-context
description: Prompt-plus-stdin is for argument instructions plus extra context, not full prompt files.
type: references
scope: feature
feature: workflow
status: active
created: 2026-07-01
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [codex, validation]
keywords: [codex-exec, stdin, prompt-argument, context]
author: codex
title: Prompt-plus-stdin context semantics
source: https://developers.openai.com/codex/noninteractive
accessed: 2026-07-01
ref_type: docs
---

# Prompt-plus-stdin context semantics

## Insight
When `codex exec` receives both a prompt argument and piped stdin, the argument is the instruction and stdin is appended as additional context. That is different from `codex exec -`, where stdin is the full prompt.

## Reason
The bridge prompt file is the full instruction contract for a stateless Codex job. The child doc should use prompt-plus-stdin only when the wrapper intentionally separates the instruction from supplemental context.

## Source
- https://developers.openai.com/codex/noninteractive
- Local installed surface accepted in discussion: `codex exec --help`

## Excerpt
No verbatim excerpt needed. The approved research addendum records the applicable official sections and local help behavior.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-01 | 019f1f53-6ae2-7853-953e-4ee246cbef0b | Distinguishing full prompt-file handoff from context piping in the bridge contract. |

## Related

No related memory links staged in this iteration.
