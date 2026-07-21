---
name: deterministic-codex-policy-authorities
description: "Defines the effective native, workflow, bridge, validation, and delivery authorities for Codex defaults."
type: design
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, design]
keywords: [gpt-5.6-sol, xhigh, authority]
author: codex
related: [claude-to-codex-bridge-contract, validator-and-residual-guard-design, plugin-delivery-and-alias-topology]
---
# Deterministic Codex policy authorities

## Problem

Draft, cross-review, and evaluation peer operations can drift when native config, session settings, peer commands, and validators resolve models or output contracts differently.

## Scope

This record covers current cross-system draft, reciprocal cross-review, and evaluation operations. It preserves the configured role taxonomy, read-only peer posture, and user-owned settings decisions.

## Approach

Resolve every role model from `session.json.settings.models`. Start a new ephemeral, read-only opposite-system command-line process for each draft, cross-review, and evaluation operation. Give it the complete operation inputs and require artifact-specific schema-valid JSON.

The peer process never writes the session tree. The active-runtime assistant validates the response and stores the rendered Markdown through the record-owned command. Availability, timeout, empty output, malformed JSON, and schema failure halt with the exact error. Only an explicit user decision may waive one named system for one named step and iteration.

## Validation

Check the installed non-interactive CLI flags, schema enforcement, read-only behavior, model resolution, system and iteration labels, failure fixtures, and exact waiver scope in both runtime directions.

## Trade-offs

Deterministic peer operations increase repeatability and auditability. They do not authorize reducing dual-system rigor to control cost.

## Open issues

None. Settings changes remain available only through the workflow's explicit user gate.
