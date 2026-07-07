---
name: regex-header-check-false-missing
description: Regex matching can false-report missing literal Markdown headers that contain regex metacharacters.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-02
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [process, verification]
keywords: [regex, fixed-string, header-check, rg, false-missing]
author: codex
priority: high
domain: verification
supersedes: null
superseded_by: null
---

# Regex Header Check False Missing

## What happened

During Ideation iter2 evaluation validation, the manager checked mandatory Markdown headings with `rg -q "^$h$"`. Two required headings contained regex metacharacters: `+` in `## Artifact Summary + Memory reads` and parentheses in `## Locked Frame (Stage 1)`. The regex treated those characters as syntax and falsely reported the headings missing.

## User feedback

No direct user wording. This was detected while repairing the evaluation validation.

## Why it happens

The mistaken assumption is that a shell variable holding expected literal text can be interpolated into a regular expression unchanged. For exact structure checks, common Markdown characters can change regex meaning.

## Correct approach

Use fixed-string whole-line matching for literal headings and command text: `rg -F -x -q "$expected" "$file"`. Reserve regex checks for intentionally regex-shaped expectations, and document that intent in the verification command.

## How to detect

Any validation gate that checks an exact heading, path, command example, or literal token with regex mode is a trigger. If the expected text contains `+`, `.`, `(`, `)`, `[`, `]`, `|`, `?`, `*`, `^`, or `$`, fixed-string matching is the default.

## Related

- [[grep-absence-claim-needs-exact-pattern]] — absence and structure claims need exact, checked patterns.
