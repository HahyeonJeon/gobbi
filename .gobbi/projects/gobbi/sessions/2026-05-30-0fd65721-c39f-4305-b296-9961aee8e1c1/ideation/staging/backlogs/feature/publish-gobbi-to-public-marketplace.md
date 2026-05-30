---
title: "Publish gobbi plugin to a public/hosted Claude Code marketplace"
type: backlogs
scope: feature
feature: install-runtime
project: gobbi
status: deferred
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, marketplace, distribution, publish]
priority: medium
---

# Publish gobbi plugin to a hosted Claude Code marketplace

Deferred from the .claude-plugin ideation. This session frames + builds the in-repo `.claude-plugin/`
manifest and (proposed) an in-repo Claude-schema `marketplace.json`. Actually publishing/hosting the
marketplace for external discovery (`github`/`url` source, version-bump release cadence, reserved-name
checks) is a separate distribution task. Gobbi is solo-user (see feedback_solo_user_context), so external
publish is low urgency — local-source / `--plugin-dir` / `@skills-dir` install covers the solo user's own
machine. Revisit if/when gobbi targets external adopters.

Pointer: marketplace schema + source types in
`sessions/.../ideation/staging/references/marketplace-json-schema-and-skills-dir-plugins.md`.
