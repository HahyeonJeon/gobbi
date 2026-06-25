---
name: edit-write-tool-success-without-disk-persistence
description: Under transient API overload (529), the Edit/Write tool reported success while the change never reached disk — and the Read tool served a stale cached snapshot
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-16
session: 3596d7f1-ee88-4055-8e66-a67f977812ad
tags: [process, tooling, verification]
keywords: [persistence, api-overload]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Edit/Write "success" is not proof of disk persistence under API overload

## What happened

During Execution, while the Anthropic API was transiently overloaded (repeated 529s, safety classifier intermittently unavailable), the `Edit`/`Write` tool reported "updated successfully" multiple times but the change did NOT reach disk (the file stayed byte-identical, confirmed by md5/grep). Separately, the `Read` tool served a STALE cached snapshot of `git/SKILL.md` (an old ~286-line version) after the file had grown to ~390 lines on disk via committed edits. Both failure modes appeared specifically under the transient-overload window. An executor that trusted the tool result would have committed nothing (or reasoned against stale content) while believing it had succeeded.

## Why it happens

Tool-result acknowledgements are not a durability or freshness guarantee, especially under degraded infrastructure. A "success" message is the tool's intent-to-apply, not a verified post-condition on disk. The same overload that makes the model call flaky can make the side effect (file write) or the read cache inconsistent.

## Correct approach

- After EVERY edit, independently verify the change on disk via Bash (`grep`/`md5sum`/`sed -n`) BEFORE treating it as landed and BEFORE committing. This session's executors adopted a Python/shell write path + re-grep and recovered cleanly every time.
- Treat Bash/disk as authoritative over the Read tool's cached view when they disagree.
- This pairs with the absolute-path-typo lesson: verify the post-condition on disk, do not trust the tool's self-report.

## How to detect

- The API is returning 529s / the safety classifier is reported temporarily unavailable.
- A multi-edit task where one edit "succeeded" but a follow-up grep shows the old content.
- A `Read` whose line count or content disagrees with `wc -l` / `sed -n` via Bash on the same path.

## Related

- `absolute-path-typo-on-write-evades-cwd-guard.md` — the paired write-safety mistake: never retype an absolute path segment by hand.
