---
name: zsh-special-variable-names-break-shell-checks
description: Using zsh special variable names such as path or status can break verification snippets.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-02
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [process, verification, tooling]
keywords: [zsh, path, PATH, status, shell]
author: codex
priority: high
domain: verification
supersedes: null
superseded_by: null
---

# Zsh Special Variable Names Break Shell Checks

## What happened

During RECORD verification, a shell loop assigned a file path to a variable named `path`. In `zsh`, `path` is tied to the executable search path. The assignment replaced command lookup, so later commands such as `rg` and `grep` failed as not found. Later in the session, using `status` as a variable also failed because it is read-only in `zsh`.

## User feedback

No direct user wording. The failures were observed while validating execution RECORD artifacts.

## Why it happens

The mistaken assumption is that common English names such as `path` and `status` are ordinary local variables in shell snippets. In `zsh`, they have special semantics.

## Correct approach

Use neutral variable names such as `file_path`, `target_path`, `output_file`, and `rc`. Avoid assigning to shell-special names such as `path`, `PATH`, `status`, or `pipestatus` in verification snippets.

## How to detect

Any `zsh` command snippet that assigns `path=...`, `status=...`, or another shell-special variable before running checks is a warning sign. Symptoms include common commands suddenly failing with `command not found` or assignments failing as read-only.

## Related

- [[tempfile-move-after-jq-error]] — another shell snippet failure that corrupted session metadata.
