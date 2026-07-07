---
name: stdin-prompt-file-handoff
description: Official Codex prompt-file handoff uses stdin with dash for the full prompt.
type: references
scope: feature
feature: workflow
status: active
created: 2026-07-01
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [codex, validation]
keywords: [codex-exec, prompt-file, stdin, dash-prompt]
author: codex
title: Official stdin prompt-file handoff
source: https://developers.openai.com/codex/noninteractive
accessed: 2026-07-01
ref_type: docs
---

# Official stdin prompt-file handoff

## Insight
For a full prompt file, the bridge should invoke Codex with stdin as the prompt: `codex exec ... - < "$prompt_file"`. The official Codex docs and installed help document stdin with `-`; they do not document `@prompt-file` as the standard prompt-file form.

## Reason
The Claude wrapper to Codex handoff must use a command shape that future agents can verify from official sources. Teaching undocumented `@prompt-file` as the default would repeat the current source-of-truth drift.

## Source
- https://developers.openai.com/codex/noninteractive
- https://developers.openai.com/codex/cli/reference
- Local installed surface accepted in discussion: `codex exec --help` from `codex-cli 0.142.5`

## Excerpt
No verbatim excerpt needed. The approved research addendum records the applicable official sections and local help behavior.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-01 | 019f1f53-6ae2-7853-953e-4ee246cbef0b | Locking `codex/delegation.md` to official stdin prompt-file handoff. |

## Related

No related memory links staged in this iteration.
