---
name: reused-session-dir-collides-task-artifacts-across-tasks
description: "Two distinct tasks ran under the same session-id + date directory; task 2's eval-prompt path already held task-1's committed file, so the Codex evaluator silently ran against the stale (wrong-task) prompt and produced a false evaluation."
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-01
session: a30b7a6e-164f-49ac-a857-ee225e831a7c
tags: [process, session-lifecycle, evaluation, codex, artifact-collision]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Reused session dir collides task artifacts across tasks

## What happened

During a session where two distinct user tasks ran under the same session-id (`a30b7a6e`) and date directory (`2026-05-31-a30b7a6e-...`), the Codex evaluator for the second task (4-field principles redesign) was dispatched with a Write to `sessions/2026-05-31-a30b7a6e-.../execution/evaluation/iter1/codex/eval-prompt.md`. That exact path already held a committed eval-prompt from the first task (the title-merge, shipped via PR #277 and inherited into the new worktree). The Write tool refused the operation ("file has not been read yet"), so the old title-merge prompt remained in place. Codex then executed against that stale prompt — evaluating the title-merge change, not the 4-field change — and could have produced a false PASS or REVISE.

The manager caught the error by checking the evaluator's first input line and recognizing it described the wrong change. The run was killed, the correct prompt was written to a new filename (`eval-prompt-4field.md`), and Codex was re-run. The second run (against the correct prompt) returned PASS.

## Why it happens

Multiple distinct user tasks were run under ONE session-id + date directory. Per-task ephemeral artifacts — eval prompts, `evaluation/iter{n}/` outputs — are keyed only by session dir + iteration counter. When a second task reuses the same session dir, it shares the same iteration-keyed paths that task 1 already wrote and committed. Task 1's committed files silently shadow task 2's intended writes: the Write tool rejects an unread file, and any read returns task 1's stale content. The evaluator then operates against the wrong artifact with no visible error signal.

Root cause: there is no isolation boundary between tasks within a shared session directory; the directory's structure assumes one task per session-id + date combination.

## How to recognize

- You are starting a new, distinct task but the worktree or delegation prompt reuses a prior task's session-id and date directory.
- A Write to an eval-prompt path is rejected ("file has not been read yet") when you expected a fresh file — this means a committed file already occupies that path.
- Eval output paths (`evaluation/iter1/`, `evaluation/iter2/`) already exist with timestamps or content from an earlier, unrelated task.
- The evaluator's findings describe a change (feature, wording, or structure) that does not match the current task's scope.
- Running `git log --oneline -- <eval-prompt-path>` shows a commit from a different task or session.

## Corrected approach

1. **One task, one task-scoped subpath.** When two or more distinct tasks run in the same session, each task MUST use a dedicated task-slug subdir: `sessions/{date}-{sid}/{task-slug}/evaluation/...`. Never write task 2's eval prompts into the same unqualified `evaluation/iter{n}/` path that task 1 used. The manager's delegation prompt must specify the full task-scoped absolute path for every eval write.

2. **Read before Write on any eval-prompt path.** Before writing an eval prompt, Read the target path first. If it returns existing content, confirm it is for THIS task (check the first line or a distinctive identifier). If it belongs to a prior task, write to a disambiguated filename (e.g., `eval-prompt-{task-slug}.md`) or a dedicated task-slug subdir — never overwrite task 1's artifact.

3. **Sanity-check the evaluator's first input line.** After spawning any evaluator, verify that the first distinctive line of the eval prompt (the change description, commit ref, or task name) matches the current task. If it does not match, the evaluator is running against the wrong prompt — kill the run before it produces output.

4. **Prefer a new session-id for each distinct task.** The cleanest isolation is a separate session-id per task. When the same session-id must be reused (e.g., continuation session), qualify every per-task ephemeral path with a task slug to prevent collision.

## Related

- `[[codex-eval-session-write-path-nested-in-worktree]]` — Codex writing to the wrong path (worktree-nested vs main-tree); same symptom class of wrong-path evaluation.
- `[[evaluator-false-pass-without-diffing]]` — evaluator asserting a result without reading the actual change; the stale-prompt scenario produces the same false-PASS risk.
