---
name: freeze-requires-process-exit
description: Never declare a background generator's output frozen on content markers alone — the completion signal is process exit plus content validation, not a marker read while the generator may still be writing.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process, codex]
keywords: [freeze-discipline, background-generator, process-exit, skeleton-in-progress]
author: claude
priority: high
domain: process
---

# A background generator's output is frozen only after process exit, never on content markers alone

## What happened

During this session's Planning work, a background draft/evaluation generator's output was treated as
"frozen" — safe to hand to a downstream producer for integration — based on a content marker appearing
in the file (a section heading or completion-looking phrase), without confirming the generating
process had actually exited. The generator was still in progress; a downstream producer that read the
file at that point would have integrated an in-progress skeleton rather than the completed artifact.

## Why it happens

A content marker (a heading, a "Summary" section, a phrase that reads like a conclusion) is easy to
mistake for a completion signal because it LOOKS like the document's natural terminal shape. But a
generator that writes incrementally can place such a marker early — as a skeleton section it intends
to fill in later, or as a heading written before its body — well before the file is actually complete.
Only the generating PROCESS's own exit status is an unambiguous completion signal; any signal read
from the file's CONTENT while the process might still be writing is provisional by construction.

## How to recognize it

About to treat a background-generated file as "frozen" / "ready to integrate" / "safe to read" based
on a grep for a marker phrase, a heading, or "looks complete on a skim" — without first confirming
(via process status, an exit-code check, or an explicit completion callback) that the generating
process has actually exited. The trigger phrase to catch: "the file has the summary section now, so
it's done."

## Corrected approach

Treat freeze as a two-part gate: (1) the generating PROCESS has exited (checked via its actual exit
status or an explicit completion signal — never inferred from output content alone); AND (2) the
resulting file passes a content-validation check (non-empty, parses, carries its required terminal
marker). Only when both hold is the file safe to treat as frozen and hand to a downstream consumer.
Neither condition alone is sufficient — process-exit-without-content-check risks integrating an
error/empty result; content-marker-without-process-exit risks integrating a partial skeleton mid-write.

## Related

- [[terminator-not-in-skeleton]] — the companion trap: a write-early skeleton must not itself contain
  the completion terminator, because the terminator's presence is exactly the false-positive signal
  this trap warns against
- `mistakes/codex/codex-background-exec-exit-code-unreliable.md` — a related but distinct trap: even
  where process exit status IS the intended signal, a backgrounded process's reported exit code can
  itself be unreliable, so the output FILE must still be validated, not the raw exit code alone
