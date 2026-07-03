---
name: sandbox-writable-roots
description: Codex bridge commands should use least sandbox and narrow writable roots.
type: references
scope: feature
feature: workflow
status: active
created: 2026-07-01
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [codex, security, validation]
keywords: [sandbox, writable-roots, add-dir, workspace-write]
author: codex
title: Sandbox and writable-root design
source: https://developers.openai.com/codex/concepts/sandboxing
accessed: 2026-07-01
ref_type: docs
---

# Sandbox and writable-root design

## Insight
Codex bridge invocations should use `--cd` for the workspace root, minimal `--add-dir` for the contracted output directory, and the least sandbox that can satisfy the job. Broad access is not needed for this documentation contract.

## Reason
The known bridge failures include wrong-root writes and unauthorized source mutation. Narrow command-line roots let the wrapper state exactly where Codex may write and make missing or wrong-root output easy to detect.

## Source
- https://developers.openai.com/codex/concepts/sandboxing
- https://developers.openai.com/codex/cli/reference
- https://developers.openai.com/codex/config-reference

## Excerpt
No verbatim excerpt needed. The approved research addendum records the applicable official sections.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-01 | 019f1f53-6ae2-7853-953e-4ee246cbef0b | Defining `--cd`, `--add-dir`, and sandbox rules for wrapper commands. |

## Related

No related memory links staged in this iteration.
