---
name: iter-heading-vs-stable-filename
description: The draft's H1 heading now says iter3 (not iter1) and the stable-filename-vs-iteration-number distinction is documented explicitly
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, docs-sync]
keywords: [f3-aesth-02, stable-filename, iter-heading, draft-iter1-naming]
author: claude
scenario: plan-aesth-self-description-accuracy
item_status: implemented
anchor: novel
implemented_in: null
---

# The draft's own heading and filename-vs-iteration callout are now accurate

## What

The canonical draft's H1 heading must reflect the CURRENT iteration, and any reader must be told, up front, that
the file stays at `working/draft-iter1.md` for stable-reference reasons even though its content is now iter3.

## Why

At iter2 the H1 still said "iter1" while the file's own frontmatter and content were iter2/iter3 — a small but
real self-description drift (`F2-AESTH-02`, Low/100), the kind that confuses a reader trying to match the
heading against the frontmatter `iter:` field.

## Verification

H1 now reads "…(iter3)"; a `> **Filename vs iteration.**` callout immediately below the H1 states explicitly that
the FILENAME is a stable identifier (referenced by both Integration Logs, both evaluation rounds, and the
restore point) while the frontmatter `iter:` field and the heading carry the actual iteration. Verified: the
freeze manifest (`.freeze-iter3.sha256`) matches the current file content.

## Status notes

Resolved. Cosmetic/self-description fix; no behavior or acceptance-criteria change.

## Related

- [[verbatim-token-invariant-exceptions]] — the sibling self-description-accuracy fix in the same finding family
