---
name: gate-failure-needs-a-named-diagnosis
description: A non-zero gate with only a traceback is fail-closed but cannot identify the violated property.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [tooling, verification]
keywords: [gate-diagnostic, traceback, failure-contract]
author: codex
priority: high
domain: tooling
supersedes: null
superseded_by: null
---

# Give every gate failure a named diagnosis

## What happened

A negative verification could exit non-zero through an unhandled exception and appear to prove
the planted rejection.

## Why it happens

Exit status is treated as the whole failure contract, so fixture setup errors and unrelated
runtime failures are folded into expected rejection.

## Correct approach

Emit a stable diagnosis naming the subject and failed property. Negative tests assert both
status and that exact diagnosis; tracebacks remain unexpected failures.

## How to detect

A negative fixture accepts any non-zero status, or the only explanation of failure is a traceback.
