---
name: valid-file-can-be-wrong-content
description: A whole-file reference whose purpose expects content that has moved away lands on a valid-but-wrong file — "the link resolves" does not prove the consumer receives what it needs.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process, verification]
keywords: [valid-reference, wrong-content, link-resolution, purpose-check, consumer-inventory]
author: claude
priority: high
domain: verification
---

# A valid, resolving file reference can still deliver the wrong content

## What happened

While auditing the consumer-migration inventory for the `planning`-skill split, a class of reference
was found where a downstream document's link or citation pointed at a file that genuinely EXISTS and
is genuinely VALID (the path resolves, the file is well-formed) — but the content the consumer's
PURPOSE actually needed had, by design, moved to a different file. A link-resolution check alone
(does this path exist? does this file parse?) would report the reference clean, while the consumer
reading that link would not find what it needs there anymore.

## Why it happens

"The link resolves" and "the file the link points to contains what the consumer needs" are two
independent properties, and mechanical link-checkers (by design and by necessity) verify only the
first. A file that USED to be the correct target, and still exists and still parses after a content
migration, silently satisfies a resolution check while failing the consumer's actual purpose. This is
especially dangerous in a split/migration where the SAME filename or a similarly-shaped path survives
the change — the checker has no way to know the file's ROLE changed underneath a stable-looking path.

## How to recognize it

Any migration, split, or content-move where a downstream reference's target path survives unchanged
(the file still exists, still resolves) but the SPECIFIC content that reference's context expects has
moved elsewhere. The tell: a link-checker or path-existence gate reports the reference clean, but a
close read of the CONSUMER's surrounding prose reveals it expects a specific section, primitive, or
fact that is no longer at that path. Trigger phrase to catch: "the link resolves, so this reference is
fine" — that conclusion answers a narrower question than "is this reference still correct."

## Corrected approach

For every consumer reference identified in a content-migration inventory, verify not just that the
target PATH resolves but that the target's CONTENT still satisfies the consumer's stated purpose —
read the consumer's surrounding context to determine what it actually needs, then confirm that need is
met at the (possibly repointed) target. A path-resolution check is necessary but not sufficient; treat
it as the FIRST of two checks, never the only one, whenever a reference's target document has recently
changed content ownership.

## Related

- [[enumerate-consumers-by-content-not-path]] — the companion enumeration trap: the same
  content-vs-path distinction that causes THIS trap (a valid path masking wrong content) also causes
  consumers to be MISSED entirely when a sweep searches by path instead of by content need
- `mistakes/verification/whole-file-allowlist-false-passes-same-file-residual.md` — a related but
  distinct trap: there, a whole-FILE allowlist masks a NEW residual inside an already-trusted file;
  here, a whole-file's continued VALIDITY masks that its ROLE has changed underneath a stable path
