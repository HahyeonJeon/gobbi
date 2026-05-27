---
name: hook-contract-verification-gate
description: User authorized empirical verification of the PostToolUse hook payload before finalizing the hook design; verification confirmed both tool_input and tool_result available.
type: discussions
scope: feature
feature: install-runtime
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, post-tool-use, verification]
discussion-id: CP-4-1-beta
---

# Hook contract verification gate — empirical verification authorized before design

## Context

Before the PostToolUse hook design could be finalized, it rested on an unverified premise: that the hook payload actually contains the fields the design needs. The leader proposed gating the design behind an empirical check of a real transcript rather than trusting the documented contract alone.

## Question

Before finalizing the PostToolUse hook design, should empirical verification of the hook payload be performed — confirming both `tool_input` AND `tool_result` are available, and that `transcript_path` is present in stdin?

## Options considered

- Verify the payload empirically against a real transcript before locking the design (the recommended option).
- Proceed on the documented hook contract alone, without empirical confirmation.

## User decision

The user authorized the empirical verification (the recommended option). The check confirmed the premise: empirical inspection of a prior session's transcript (the `toolUseResult` lines under `~/.claude/projects/-playinganalytics-git-gobbi/`) confirmed both hook stdin fields and the richness of `toolUseResult`.

## Implication

The PostToolUse hook + shell-script reconstructor mechanism is fully supported. The hybrid metadata extraction design (input side vs result side) and the `tool_use_id` transcript correlation key design are both grounded in the empirical evidence confirming both the stdin payload and transcript richness.

## Related

- `discussions/hook-plus-reconstructor-mechanism.md` — the mechanism this verification unblocked.
- `design/metadata-extraction-input-vs-result.md` — the design grounded in this evidence.
- `design/tool-use-id-correlation-key.md` — the correlation-key design grounded in this evidence.
