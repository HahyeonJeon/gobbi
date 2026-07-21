---
name: use-full-runtime-posture-heading
description: "Use the full runtime-posture heading when exact section text is required."
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [docs-sync, verification]
keywords: [runtime-posture, heading-reference]
author: codex
scenario: deterministic-codex-policy
item_status: pending
anchor: novel
implemented_in: null
archived_at: 2026-07-20
archive_reason: dropped
---

# Use the full runtime-posture heading

## What

When exact heading text matters, cite `Runtime git posture - where it is configured`
rather than its resolvable shortened prefix.

## Why

Claude Aesthetics finding `F-AES-1` found an optional clarity improvement. The current
reference resolves and does not block Task 01.

## Verification

Compare the config comment with the live heading in `git/conventions.md` and confirm the
reference remains unambiguous.

## Status notes

Pending optional polish. This is not required by Task 01's eight-file contract.

## Related

- [[native-defaults-and-settings-shipped]] - the shipped task whose comment was reviewed.
