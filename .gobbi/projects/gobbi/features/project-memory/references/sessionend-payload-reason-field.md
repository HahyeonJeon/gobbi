---
name: sessionend-payload-reason-field
description: The Claude Code SessionEnd hook payload carries a `reason` field — empirically confirmed this session (closes the G2 existence assumption)
type: references
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [hooks, session-end, metadata, payload, empirical]
title: SessionEnd hook payload `reason` field
source: sessions/2026-06-08-c7673705-2d69-4be8-9bd4-436c3eb91be2/execution/ (empirical, session c7673705)
accessed: 2026-06-08
ref_type: code
---

# SessionEnd payload `reason` field

## Insight

The Claude Code SessionEnd hook fires with a JSON payload that includes a `reason` field. This
was an *assumption* during Ideation (open question G2: "does Claude Code expose a usable
SessionEnd hook, and what does its payload carry?") and was **empirically confirmed during
Execution** — the SessionEnd handler (`session-end.sh`) reads the payload and the `reason`
field is present. G2 is closed.

## Related

- `decisions/2026-06-08-session-end-hook-existence-assumption.md` — the Ideation assumption this empirically closes.
- `decisions/2026-06-08-d5-amends-prior-agents-transcript-decision.md` — D5, which depends on a usable SessionEnd hook.

## Why it applies

D5's deterministic-metadata design relies on SessionEnd firing reliably with a usable payload.
Confirming the hook exists and carries `reason` de-risks the D5 mechanism (manager rollup +
codex capture at session close). Future hook work can read `reason` to distinguish session-end
causes if needed.

## Source

- Empirical, session c7673705 (2026-06-08) — `session-end.sh` end-to-end verification during
  Execution tasks 04/05.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-08 | c7673705 | Closing G2 (SessionEnd existence assumption); de-risking D5 |
