---
name: recorded-mistakes-recurred-recording-is-not-enforcement
description: Two already-recorded mistakes both re-triggered despite being loadable — recording a mistake does not prevent it; a loaded mistake is not an enforced gate
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [assumption, process, verification]
keywords: [recording-not-enforcement, mistake-recurrence, delegation-cue, pre-action-assertion]
author: claude
priority: high
domain: process
layer: 2
layer2-source: .gobbi/projects/gobbi/mistakes/assumption/recorded-mistakes-recurred-recording-is-not-enforcement.md
layer2-rationale: Generalizable across all projects and any agent system with a memory of past mistakes. The assumption that a recorded/loadable mistake will not recur is false everywhere — a recording is a passive document, not a checkpoint at the moment of the wrong action, and it describes the trap on the surface where it was first seen, not the new surface where it re-appears. The fix (inline the exact forbidden action + a concrete pre-action assertion into the task brief, do not rely on "load the memory") is task-agnostic. Not gobbi-specific.
supersedes: null
superseded_by: null
---

# Recording a mistake is not enforcing it — recorded mistakes still recur

## Layer-2 note

This is a Layer-2 copy of
`mistakes/assumption/recorded-mistakes-recurred-recording-is-not-enforcement.md`. It lives in
`skills/mistake/` so it persists and loads across all projects and future sessions. The canonical record
is at the project mistakes path above; this copy exists only for cross-project recall.

---

## What happened

Two mistakes that were ALREADY recorded and loadable both re-triggered during a single session despite
being in the session's loadable mistake set. Both were caught downstream by gates, but both happened in
the first place — the recordings did not stop them.

## Why it happens

The implicit assumption is "if a mistake is recorded and loadable, it will not recur." That is false. A
recorded mistake is a passive document an agent may or may not have loaded, may have skimmed, and —
critically — describes the trap on the surface where it was first seen, not the new surface where it
re-appears (e.g. command-authoring vs command-running; a context-specific slip vs the generic one the
recording describes). Loading raises awareness of the trap-as-described; it installs no checkpoint at
the moment of the wrong action. Nothing forces the recognizer to fire.

## Correct approach

Do not rely on "the agent will load and remember the mistake." For the specific traps a task can hit,
the task brief MUST cue them actively, in the brief itself:

1. Inline the exact forbidden action / command (literally, not by reference).
2. Require a concrete pre-action assertion as a step (e.g. "before the first edit, assert <condition>").

Treat the recorded mistake as the SOURCE of the cue, and the brief as where the cue is made enforceable.
A recording that is not turned into an inlined, checkable instruction will keep recurring.

## How to detect

- The same mistake class shows up in a task whose load directives DID include the mistake.
- A brief says "load the relevant memory/mistakes" but does not inline the exact forbidden action or a
  concrete pre-action assertion for the specific traps that apply to this task.
