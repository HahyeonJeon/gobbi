---
name: claude-code-changelog-ccsi-version
description: "Claude Code changelog — CLAUDE_CODE_SESSION_ID introduced in v2.1.132"
type: references
scope: feature
feature: install-runtime
status: active
created: 2026-05-22
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
tags: [env-vars, changelog, version, ccsi]
title: "Claude Code changelog — CLAUDE_CODE_SESSION_ID introduced in v2.1.132"
source: https://docs.anthropic.com/en/docs/claude-code/changelog
accessed: 2026-05-22
ref_type: docs
---

# Claude Code changelog — `CLAUDE_CODE_SESSION_ID` introduction version

## Insight

`$CLAUDE_CODE_SESSION_ID` was introduced in Claude Code **v2.1.132** (not v2.1.128+, as an earlier draft had incorrectly stated). The official Claude Code changelog is the authoritative source for the exact version number, and the correction propagated to every version reference in the env-var work.

## Related

- [`claude-code-hooks-stdin-contract.md`](claude-code-hooks-stdin-contract.md) — the companion reference establishing that `$CLAUDE_CODE_SESSION_ID` is runtime-auto-set (not hook-only), which is the env var whose introduction version this reference pins.

## Why it applies

Any skill doc that says "as of Claude Code v2.1.132" is making a version claim that should be accurate. An incorrect version number causes false confidence in users on older releases and introduces version-test confusion in Execution. The changelog cross-reference settled this definitively.

## Source

- Primary: https://docs.anthropic.com/en/docs/claude-code/changelog (Claude Code release changelog)
- Accessed: 2026-05-22 via the Codex evaluator during the env-var-audit Ideation loop

## Excerpt

The changelog entry pins the introduction to v2.1.132; the exact release-note wording is recoverable from the linked changelog. No verbatim quote is reproduced here — the version number is the load-bearing fact.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-22 | 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d | Corrected version number in all 7 version references in the artifact; now cited in P5 sub-section as the `CLAUDE_CODE_SESSION_ID` introduction version |
