---
name: shell-backticks-in-double-quoted-pattern
description: Backticks in a double-quoted shell search pattern triggered command substitution
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-06
session: 019f283d-e961-7442-9c22-319f26798141
tags: [process, verification, codex, tooling]
keywords: [shell-quoting, backticks, rg, codex-exec]
author: codex
priority: medium
domain: tooling
supersedes: null
superseded_by: null
related: [codex-background-exec-exit-code-unreliable]
---

# Quote shell patterns that contain backticks literally

## What happened

During Task 01 official-doc searching, an executor ran an exploratory `rg` command with a double-quoted pattern containing Markdown backticks around `codex exec`. The shell interpreted the backticks as command substitution and attempted to run `codex exec` with no prompt. The executor discarded that output, reran the search with a single-quoted literal pattern, and used no evidence from the accidental command.

## Why it happens

In POSIX-style shells, backticks inside double quotes still perform command substitution. Markdown documentation commonly contains backtick-delimited code names, so this can happen during ordinary `rg` searches.

## Correct approach

Use single quotes around search patterns that contain backticks, or pass patterns through an interface that treats them as literal arguments. If accidental command substitution happens, discard its output, rerun the search with safe quoting, and record the incident when it could affect evidence or runtime state.

## How to detect

A shell command searches for text like `` `codex exec` `` or another Markdown code span and the pattern is wrapped in double quotes. Backticks in double quotes are executable, not literal.

## Related

- [[codex-background-exec-exit-code-unreliable]] — Codex command status can be misleading when invoked unintentionally.
