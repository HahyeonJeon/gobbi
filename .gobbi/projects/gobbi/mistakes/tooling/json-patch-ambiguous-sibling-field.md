---
name: json-patch-ambiguous-sibling-field
description: "A broad JSON patch changed the first repeated verdict field instead of the intended workflow sibling."
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-11
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [process, tooling]
keywords: [json, apply-patch, sibling-fields, state, verification]
author: codex
supersedes: null
superseded_by: null
priority: high
domain: tooling
---

# Anchor JSON patches to the intended object

## What happened

A patch intended to set `workflow.execution.verdict` matched the first repeated
`"verdict": null` line in `state.json`, changing `workflow.configuration.verdict` instead. The
execution phase changed correctly because its phase line was unique, which made the mixed result
less obvious.

## Why it happens

The patch hunk used a repeated leaf as context without including the owning sibling key. Text
patches do not understand JSON structure and select the first matching hunk.

## Correct approach

Include the unique owning object key and neighboring fields in every structured-file patch, then
read back the exact structured paths with `jq`. For multi-field state transitions, validate both
the intended path and invariant siblings immediately after the patch.

## How to detect

A structured file contains repeated leaf names such as `state`, `verdict`, `iter`, or `phase`, and
an `apply_patch` hunk changes one of them without including the parent object name in the same
context block.
