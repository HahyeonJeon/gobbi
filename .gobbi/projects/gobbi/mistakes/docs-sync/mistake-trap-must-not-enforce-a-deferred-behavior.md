---
name: mistake-trap-must-not-enforce-a-deferred-behavior
description: "A new skill-owned mistake trap was authored that enforced a behavior the same session explicitly DEFERRED, contradicting the deferral — the manager's task brief listed it without cross-checking it against the deferred-scope set."
type: mistakes
scope: project
feature: null
status: active
priority: medium
domain: process
created: 2026-07-16
session: e5c0af1d-005d-4455-a58f-efe601ed342f
tags: [docs-sync, process]
keywords: [mistake-trap, deferred-behavior, e7, wrap-up-additions, brief-scope-cross-check, baseline-immutable]
author: claude
---

# A mistake trap must not enforce a deferred behavior

**What happened** — During the wrap-up redesign, the triad-hardening task's brief listed four new skill-owned mistake traps to add; one was "Wrap-Up Additions Must Enter Typed Staging Before Promotion". That trap enforces the E7 target behavior (route all additions through typed staging) — but E7 was explicitly DEFERRED this session, and the redesign KEEPS the non-staging rule-candidate + journal sources. So the trap contradicted the deferral, and it displaced the mandated `baseline-immutable-across-REVISE` trap. The Execution evaluation (Codex) caught it.

**Why it happens** — The manager's task brief enumerated the new traps from the design's scenario list without cross-checking each against the session's DEFERRED-scope set. A "harden against X" item silently reintroduces X's behavior as a normative rule even when X was deferred. (Same class the Ideation eval flagged earlier: the "NEVER promote from non-staging" Rule that contradicted E7.)

**Correct approach** — Every normative rule / mistake trap authored in a "restructure + fix-where-wrong" session is cross-checked against the deferred-scope set before it ships: a trap that enforces a deferred behavior is itself out of scope. When deferring a behavior E, grep the new Rules/traps for anything that mandates E and remove it.

**How to detect** — After authoring rules/traps, list the deferred items and grep the new normative text for each deferred behavior's enforcement; a match is a contradiction. An evaluator lens: "does any new NEVER/MUST/trap prohibit or mandate a behavior on the deferred list?"
