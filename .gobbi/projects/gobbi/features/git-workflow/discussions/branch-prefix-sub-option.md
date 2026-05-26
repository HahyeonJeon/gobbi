---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
feature: git-workflow
discussion-id: Fix-A-branch-prefix
slug: branch-prefix-sub-option
phase: ideation
sub-step: iter3-surgical-fix
loop-iter: 3
---

# Fix A sub-option selection — chore/session-{date}-{ssid-short} (option a)

## Question asked

iter3 Fix A AskUserQuestion: iter2's `session/{date}-{ssid-short}` uses an unregistered type prefix. Which registered type should replace it? Options: (a) `chore/session-{date}-{ssid-short}`, (b) `feat/session-{date}-{ssid-short}`, (c) leave as `session/` but add `session` to the registry.

## User answer

User selected **(a) `chore/session-{date}-{ssid-short}`** — use the existing `chore` type from the registry.

## Rationale confirmed by user

- `chore` is in the `git/conventions.md:22` registry
- The second component `session-{date}-{ssid-short}` satisfies the description-slug regex
- No need to extend the registry or use `feat` (which implies a product feature)

## Impact on design

All active design statements updated (D-1, T1-I-T1.a, T1-I-T1.h, G-1, E-2, F-4, validation table). The iter2 FAIL root cause is eliminated.

## Source

`rawdata/draft-iter3.md:520-527` (F-Fix-A fix-decision)
