---
name: reconcile-codex-plugin-and-claude-plugin-manifests
description: Reconcile the .codex-plugin and .claude-plugin manifests — dual-ecosystem authoring decision
type: backlogs
scope: feature
feature: install-runtime
project: gobbi
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, codex-plugin, manifest, dual-ecosystem]
priority: low
disposition: deferred
---

# Reconcile .codex-plugin and .claude-plugin manifests

The repo already has `.codex-plugin/plugin.json` (Codex skills-only, points skills at
`./.gobbi/projects/gobbi/skills/`) and `.agents/plugins/marketplace.json` (Codex object-source schema).
After the `.claude-plugin/` lands, there will be two parallel plugin manifests pointing at the same
canonical skills tree. A future task could (a) document the relationship in the claude-plugin skill's
gobbi-specific section, and (b) decide whether a single shared metadata source feeds both. Out of scope
the 2026-05-30 session (scope is the Claude plugin + the skill, not a Codex refactor). The claude-plugin skill should
NOTE the parallel as prior art but not refactor Codex.
