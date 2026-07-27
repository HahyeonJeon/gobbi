---
name: row-label-rename-needs-inbound-reference-sweep
description: Renaming an owned table row can leave inbound prose pointers stale because link checks do not see row labels.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [refactor, rename-sweep, docs-sync]
keywords: [row-label, inbound-reference, table-owner]
author: codex
priority: high
domain: refactor
supersedes: null
superseded_by: null
---

# Sweep inbound references when a row label changes

## What happened

A version-owner row was renamed while a sibling still pointed to its old title. The Markdown
link checker passed because a row label is not a link.

## Why it happens

Rename planning often inventories paths and anchors but omits human-resolved table labels.

## Correct approach

Treat row labels as an inbound reference class. Sweep prose, fences, inventories, and
cross-document mentions, then repoint them in the same change.

## How to detect

A table row title changes and verification contains no exact search for the old label.
