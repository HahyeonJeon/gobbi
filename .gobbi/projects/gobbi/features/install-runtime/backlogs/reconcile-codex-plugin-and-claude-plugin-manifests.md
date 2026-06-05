---
name: reconcile-codex-plugin-and-claude-plugin-manifests
description: Reconcile the .codex-plugin and .claude-plugin manifests — dual-ecosystem authoring decision
type: backlogs
scope: feature
feature: install-runtime
project: gobbi
status: completed
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, codex-plugin, manifest, dual-ecosystem]
priority: low
disposition: completed
---

# Reconcile .codex-plugin and .claude-plugin manifests

Resolved in the 2026-06-02 consensus-structure refactor. The repo now has one shared bounded package at
`plugins/gobbi/` with both manifests:

- `plugins/gobbi/.claude-plugin/plugin.json`
- `plugins/gobbi/.codex-plugin/plugin.json`

The root-level marketplaces point at the same package using their ecosystem-specific schemas:

- `.claude-plugin/marketplace.json` uses Claude's bare string `source: "./plugins/gobbi"`.
- `.agents/plugins/marketplace.json` uses Codex's object source with `path: "./plugins/gobbi"`.

The old root-level `.codex-plugin/plugin.json` and `.claude-plugin/gobbi/` package were removed.
