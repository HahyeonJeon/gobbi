---
name: recorded-mistakes-recurred-recording-is-not-enforcement
description: Two already-recorded mistakes both re-triggered this session despite being loadable — recording a mistake does not prevent it; a loaded mistake is not an enforced gate
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [assumption, process, verification]
keywords: [recording-not-enforcement, mistake-recurrence, delegation-cue, pre-edit-assertion]
author: claude
priority: high
domain: process
---

# Recording a mistake is not enforcing it — two recorded mistakes both recurred this session

## What happened

Two mistakes that were ALREADY recorded in `mistakes/` both re-triggered during this one session,
despite each being loadable at session start:

- `executor-wrote-to-main-tree-not-worktree` recurred (the executor edited the main-tree skill copies
  instead of the worktree copies during task 06).
- `executor-git-stash-in-worktree-during-verify` recurred (a verify gate was authored with `git stash`
  inside the worktree).

Both were caught by gates downstream, but both happened in the first place — the recordings did not
stop them.

## Why it happens

The implicit assumption is "if a mistake is recorded and loadable, it will not recur." That assumption
is false. A recorded mistake is a passive document an agent may or may not have loaded, may have
skimmed, and — critically — describes the trap in the surface where it was first seen, not in the new
surface where it re-appears (command-authoring vs command-running; a path-prefix slip in a self-edit
repo vs a generic relative-path slip). Loading raises awareness of the trap-as-described; it installs
no checkpoint at the moment of the wrong action. There is no mechanism that forces the recognizer to
fire.

## Correct approach

Do not rely on "the agent will load and remember the mistake." For the specific traps a task can hit,
the delegation brief MUST cue them actively, in the brief itself:

1. Inline the exact forbidden command(s) (e.g. literally: "never write `git stash` in any command";
   "every write path MUST contain `worktrees/{branch}/`").
2. Require a pre-edit path/command assertion as a concrete step (e.g. "before the FIRST Edit, assert
   the target path contains `worktrees/`").

Treat the recorded mistake as the source of the cue, and the brief as the place the cue is made
enforceable. A recording that is not turned into an inlined, checkable instruction will keep recurring.

## How to detect

- The same mistake class shows up in a session whose Load Directives DID include the mistakes — the
  signal that "load the mistake" alone is insufficient.
- A delegation brief says "load the mistake skill" but does not inline the EXACT forbidden command or a
  concrete pre-action assertion for the specific traps that apply to this task.

## Related

- [[executor-edited-main-tree-not-worktree-copy]] — one of the two recurrences this session
- [[git-stash-in-worktree-recurred-despite-loaded]] — the other recurrence this session
