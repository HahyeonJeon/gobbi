---
name: rg-l-is-not-files-without-match
description: `rg -L` follows symlinks; it does not list files without a matching pattern.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-02
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [process, verification, tooling]
keywords: [ripgrep, rg, files-without-match, symlinks, header-validation]
author: codex
priority: high
domain: verification
supersedes: null
superseded_by: null
---

# Rg -L Is Not Files Without Match

## What happened

During Planning iter2 evaluation validation, the manager used `rg -L` while intending to list files that lacked a required header. In ripgrep, `-L` follows symlinks. The command printed matching lines and could have produced a false validation conclusion.

## User feedback

No direct user wording. The mistake was found while validating Planning evaluation artifacts.

## Why it happens

The mistaken assumption is that ripgrep short flags match familiar grep mental models. In ripgrep, `-L` is not "files without match"; the long option is `--files-without-match`.

## Correct approach

Use fixed-string or line-anchored `rg -q` checks inside an explicit loop for required markers. For file lists, use `rg --files-without-match`, not `rg -L`.

## How to detect

Any validation that claims "files missing pattern" with ripgrep is a trigger. A short `-L` flag in ripgrep validation is a warning sign unless the command is intentionally about symlink following.

## Related

- [[regex-header-check-false-missing]] — another validation failure from using the wrong matching semantics for literal headers.
