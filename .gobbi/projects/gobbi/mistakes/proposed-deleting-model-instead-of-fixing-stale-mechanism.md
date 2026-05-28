---
name: proposed-deleting-model-instead-of-fixing-stale-mechanism
description: "Manager proposed deleting the two-layer promotion MODEL because its CLI mechanism (`gobbi mistake promote`) was stale; correct approach is to fix the mechanism, not delete the model."
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [process, docs-sync, orchestration]
domain: docs-sync
supersedes: null
superseded_by: null
---

# Proposed deleting a documented model when only its mechanism reference was stale

## What happened

While scoping the `gobbi mistake promote` defect fix, the manager presented a "Layer 2 fate" question whose recommended option was *drop Layer 2 entirely*, and the user initially selected it. The user then interrupted to correct the framing: the two-layer promotion model is wanted and should be KEPT; the only thing wrong is the mechanism — `gobbi mistake promote` is a nonexistent CLI command. Promotion (both layers) should be performed by agents during the **Wrap-up phase**, not a post-session CLI command.

## Why it happens

The manager assumed that because Layer 2's *implementation reference* (the CLI command) did not exist, the Layer 2 *concept* had no mechanism and should therefore be removed. This conflated "the documented mechanism is wrong" with "the model is unwanted." Solo-user + abandoned-CLI context made deletion feel like the simplest accurate fix, but the user's intent was to retain the cross-session/cross-project promotion model and re-home its mechanism into the existing Wrap-up phase.

## How to detect

When a documented model/concept references a tool, command, or path that turns out not to exist, the default fix is to **correct the mechanism while preserving the intent/model** — not to delete the model. Deleting a conceptual model is a larger, intent-bearing decision; only do it when the user explicitly wants the *capability* gone, not merely its broken implementation reference. Treat "this command doesn't exist" as a mechanism bug, not a model-deletion trigger. When in doubt, present "fix the mechanism" as the recommended option, with "drop the model" as the alternative, not the reverse.

## Correct approach

Rewrite every `gobbi mistake promote` reference (CLAUDE.md, mistake/SKILL.md, gobbi/SKILL.md) to describe Wrap-up-phase agent-driven promotion (no CLI). KEEP the two-layer model: Layer 1 = staging → project `mistakes/` (Wrap-up MEMORIZATION, already real); Layer 2 = project mistakes → workspace-level skill storage, also performed by agents during Wrap-up. Reconcile the "agents never write directly to project memory" claim: Wrap-up-phase agents are the documented sole-writer/promotion exception.

## Related

- [[gobbi-mistake-promote-command-does-not-exist]] — the originating backlog item naming the broken CLI mechanism.
