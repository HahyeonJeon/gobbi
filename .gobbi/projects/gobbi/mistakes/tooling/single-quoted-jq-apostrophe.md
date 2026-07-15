---
name: single-quoted-jq-apostrophe
description: "Natural-language apostrophes can terminate a single-quoted shell program before jq runs."
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [process, tooling]
keywords: [jq, zsh, quoting, atomic-json]
author: codex
priority: medium
domain: tooling
---

# Avoid apostrophes inside single-quoted shell programs

## What happened

An atomic `jq` update failed to parse in `zsh` because natural-language text inside the single-quoted program contained an apostrophe. The apostrophe terminated the shell's quoted block before `jq` received a valid program.

## Why it happens

The command treated inner `jq` double quotes as if they also controlled outer-shell parsing. They do not protect an apostrophe from the outer single quote.

## Correct approach

Pass natural-language values through `jq --arg`, write to a same-directory temporary file, validate it with `jq -e`, and only then atomically rename it. Removing apostrophes from individual strings is fragile and is not the primary control. This keeps structured writes fail-closed and prevents a parse error from truncating the authoritative JSON file.

## How to detect

A single-quoted `jq`, `awk`, or similar shell program embeds user-facing or natural-language text that may contain an apostrophe.

## Related
- [[tempfile-move-after-jq-error]] — the paired atomic-write failure mode.
