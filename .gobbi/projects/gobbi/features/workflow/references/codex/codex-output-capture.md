---
name: codex-output-capture
description: JSONL and final-message capture support diagnostics, but contracted files are truth.
type: references
scope: feature
feature: workflow
status: active
created: 2026-07-01
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [codex, validation]
keywords: [jsonl, output-last-message, file-truth, diagnostics]
author: codex
title: Output capture and JSONL use
source: https://developers.openai.com/codex/cli/reference
accessed: 2026-07-01
ref_type: docs
---

# Output capture and JSONL use

## Insight
`--json` and `--output-last-message` are useful support signals for events, usage, diagnostics, and single final-message capture. They do not replace explicit contracted files when the bridge needs multiple artifacts or structural validation.

## Reason
Gobbi's proposer and evaluator workflows rely on files as truth. The wrapper can use event and final-message capture to diagnose or proxy usable Codex output, but success still depends on validating the contracted output path and structure.

## Source
- https://developers.openai.com/codex/cli/reference
- https://developers.openai.com/codex/noninteractive

## Excerpt
No verbatim excerpt needed. The approved research addendum records the applicable official sections.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-01 | 019f1f53-6ae2-7853-953e-4ee246cbef0b | Defining output capture as support evidence while keeping contracted files authoritative. |

## Related

No related memory links staged in this iteration.
