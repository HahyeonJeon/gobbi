---
name: dual-system-production-is-not-optional
description: "Manager downgraded dual-system PRODUCTION to single-mode for efficiency; user corrected — keep the Codex co-work at creation, not only evaluation."
  domain: process
type: mistakes
status: active
scope: project
domain: codex
priority: high
feature: null
---

# Dual-system production is core, not optional ceremony

**What went wrong**
At the Ideation WORK sub-phase, the manager (auto-decide) downgraded `propose.mode`
from the default `dual` to a single Claude-only leader run, framing the Codex
proposer as heavyweight ceremony not worth it for a "well-specified fix whose
design decisions the user decides anyway." The manager reserved dual-system only
for evaluation. The user corrected: "keep the codex co-work system, not only for
evaluation."

**Why it went wrong (mistaken assumption)**
The manager assumed the cross-family value of the Codex co-worker lives mainly at
review time, and that at creation the user's own decision is a sufficient
cross-check. That is wrong: dual-system PRODUCTION is a core gobbi principle —
the anti-groupthink second generator at creation that the user trusts at review
must also exist at creation (`orchestration/workflow/production.md` § Why
dual-system production). Treating the proposer as optional silently strips the
creation-time anti-groupthink signal.

**How to recognize it next time**
Any internal monologue that proposes setting `propose.mode: single`, skipping the
Codex proposer, or "running this loop Claude-only to save effort / because the
user decides anyway." Default is `dual` for all five productive steps; `single`
is a deliberate, user-authorized exception, never a manager efficiency shortcut.

**Corrected approach**
Run dual-system production (Codex proposer in parallel with the Claude producer,
then selective integration of the frozen proposal) for every productive loop by
default. Only set `single` mode when the user explicitly authorizes it. The
Codex co-work runs at BOTH production and evaluation.
