---
name: terminator-not-in-skeleton
description: A write-early skeleton must not contain the completion terminator — the terminator is the completion signal and belongs only after the last section fills.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process]
keywords: [skeleton, completion-terminator, write-early, false-completion-signal]
author: claude
priority: medium
domain: process
---

# A write-early skeleton must not carry the completion terminator

## What happened

During this session, a document's skeleton was written early (headings and structural scaffolding
before content) as good bottom-up-construction discipline, but the skeleton itself included the
document's completion terminator (a final "Done" / "Summary" / closing marker) among the placeholder
headings. This created exactly the false-positive completion signal that
`freeze-requires-process-exit` warns about — a reader (or an automated check) scanning for the
terminator would find it present in a document that was still, structurally, an empty skeleton.

## Why it happens

Writing the full skeleton up front — including the LAST section's heading — feels complete and
consistent with bottom-up construction (Principle 2: build the foundation, including its final shape,
before filling it in). But a section HEADING is not the same as a section's CONTENT, and if the
terminator's role is to signal "this document is finished," its heading appearing early defeats that
signal's entire purpose: a reader or checker cannot distinguish "the terminator heading exists because
the document is structurally planned" from "the terminator exists because the document is actually
done."

## How to recognize it

A document-writing plan or in-progress skeleton that includes the FINAL / terminal section (a closing
summary, a "Complete" marker, a sign-off heading) among its EARLY-written placeholder sections. The
tell: a completion check (grep for the terminator, or a reader skimming for "is this done?") would
report YES on a document that is still substantially empty.

## Corrected approach

When building a skeleton bottom-up, write every section's PLACEHOLDER except the terminal completion
marker — hold the terminator back and write it only after every other section has real content, as the
literal last write action. This keeps the terminator meaningful as a completion signal: its presence
becomes equivalent to "every section before it is filled," rather than a structural artifact of the
skeleton-writing pass. Pairs directly with `freeze-requires-process-exit`: even with this discipline
followed, a downstream consumer should still confirm process exit, not rely on the terminator's
presence alone — but withholding the terminator from the skeleton removes the most common way a
content-only check gets fooled.

## Related

- [[freeze-requires-process-exit]] — the companion trap: the completion signal this discipline
  protects is the same signal a downstream consumer must not read from content alone
