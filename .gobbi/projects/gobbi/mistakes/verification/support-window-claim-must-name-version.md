---
name: support-window-claim-must-name-version
description: A claim over every supported release can expire without triggering a version-literal maintenance sweep.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [verification, docs-sync]
keywords: [support-window, version, temporal-claim]
author: codex
priority: high
domain: verification
supersedes: null
superseded_by: null
---

# Name the version in support-window claims

## What happened

A compatibility correction said an API remained available on every currently supported major.
The statement would become false when the support window reached the removal release.

## Why it happens

"Currently supported" appears safer than a version literal while hiding the boundary that should
trigger re-verification.

## Correct approach

Name the decisive version, or state a stable property that no support-window change can falsify.

## How to detect

A compatibility claim covers all supported releases but names neither a release boundary nor a
window-independent invariant.
