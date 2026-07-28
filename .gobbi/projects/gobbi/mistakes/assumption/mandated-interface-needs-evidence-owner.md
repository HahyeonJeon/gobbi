---
name: mandated-interface-needs-evidence-owner
description: A required interface is an unsupported assumption when no evidence row owns why it is required.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [assumption, process]
keywords: [mandated-interface, evidence-owner, closing-condition]
author: codex
priority: high
domain: assumption
supersedes: null
superseded_by: null
---

# Give every mandated interface an evidence owner

## What happened

Two required desktop section shapes named platform interfaces that had no supporting claim in the
design's evidence register.

## Why it happens

A mandated document shape can make its mechanism appear researched and settled even when only the
outcome was established.

## Correct approach

Keep the obligation explicit, mark the mechanism with a closing condition, and route the gap to
the evidence owner. Do not invent a mechanism or silently weaken the obligation.

## How to detect

A requirement names a concrete interface, but the evidence register contains no row that owns why
that interface is necessary.
