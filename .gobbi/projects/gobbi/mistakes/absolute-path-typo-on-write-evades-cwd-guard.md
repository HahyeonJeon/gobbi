---
name: absolute-path-typo-on-write-evades-cwd-guard
description: A one-character typo in an absolute Write path creates a stray directory tree at a valid-but-wrong location, silently, bypassing all cwd-reset protections.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-16
session: 3596d7f1-ee88-4055-8e66-a67f977812ad
tags: [process, write-safety, absolute-path]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Absolute-path typo on Write evades the cwd-reset guard

## What happened

While writing a file revision, an agent mistyped one character in the UUID/session-id segment of an absolute Write path (`...a87f...` instead of the correct `...a67f...`). The path was well-formed and pointed to a valid location — just the wrong one. The Write tool accepted it silently and created a stray directory tree. The agent noticed the error, re-wrote to the correct path, but could not `rm` the stray tree (permission-blocked). The manager cleaned it up manually.

## Why it happens

A single-character typo in an absolute path produces a path that is syntactically valid and resolves to a real location. The Write tool has no way to know that the caller intended a different path. This error silently succeeds — it does NOT trigger the cwd-reset protections that catch relative or `pwd`-derived path errors, because those guards test whether a path is relative or derived from a stale working directory. An absolute path that is merely mistyped passes those checks. The protection that prevents cwd-reset drift is precisely what makes a mistyped absolute path undetectable at write time.

## Correct approach

Never retype the session-id or UUID segment of an absolute path by hand. Always paste it from a confirmed source: the delegation prompt's stated write root, the output of a prior `pwd` or `ls` command, or a verified `find`/`Bash` result from this turn. Prefer constructing long absolute paths from a verified `$ROOT` variable (or an explicit Bash confirmation step) over typing the full path inline. If the path must be typed, verify the UUID segment character-by-character against the confirmed source before submitting the Write call.

## How to detect

Watch for this situation whenever an agent:
- Retypes a long UUID or session-id segment into an absolute Write/Edit path from memory or context, rather than copying it from a confirmed source.
- Uses a UUID segment that appears in multiple, visually-similar locations in the session (e.g., UUIDs whose digits differ in only one position from another known path).
- After a Write, the expected file does not appear where the agent assumed it would be — check whether a stray tree was created at a near-miss path instead.

## Related

- `edit-write-tool-success-without-disk-persistence.md` — the paired write-safety mistake: verify the post-condition on disk, do not trust the tool's self-report.
