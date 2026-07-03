---
name: tempfile-move-after-jq-error
description: A failed structured JSON write can move an empty temp file over the target if the shell script does not fail closed.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-01
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [process, tooling]
keywords: [jq, temp-file, metadata, fail-closed, session-json]
author: codex
priority: critical
domain: tooling
supersedes: null
superseded_by: null
---

# Tempfile Move After Jq Error

## What happened

During Configuration, the manager stamped `session.json` with a multi-step shell command. `jq` failed while formatting a timestamp, but the shell script did not run with `set -e`. The command continued and moved the empty temp file over `session.json`, leaving a zero-byte metadata file.

## User feedback

No direct user wording. The session recovered the metadata file and recorded the process failure.

## Why it happens

The mistaken assumption is that a failed command inside a multi-line metadata write stops the rest of the script. Without `set -euo pipefail`, the shell can continue past the failed `jq` call and execute `mv`.

## Correct approach

Run generated metadata writes with `set -euo pipefail`, validate the temp file with `jq -e` before `mv`, and pass timestamp strings through `--arg` instead of fragile time formatting inside the filter. If a write fails, inspect file size and parse validity before proceeding.

## How to detect

Any structured write command with `jq > "$tmp_file"` followed by `mv "$tmp_file" "$target"` is a trigger. If the snippet lacks `set -euo pipefail` and a parse validation before `mv`, stop and harden the write first.

## Related

- [[verify-state-from-authoritative-source-not-proxy]] — session state must be verified from the real target, not assumed from a command's apparent success.
