---
name: codex-network-off-by-default
description: Codex workspace-write keeps network OFF by default; git push and gh are blocked until network_access = true or per-call approval
type: references
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, codex, sandbox, network, config, runtime]
title: Codex workspace-write sandbox keeps network access OFF by default; enable with [sandbox_workspace_write] network_access = true
source: https://developers.openai.com/codex/concepts/sandboxing
accessed: 2026-06-14
ref_type: docs
---

# Codex workspace-write sandbox keeps network access OFF by default; enable with [sandbox_workspace_write] network_access = true

## Insight

Under the default `workspace-write` sandbox, Codex keeps network access turned OFF unless
explicitly enabled. The config key is `[sandbox_workspace_write] network_access = true`
(default false). Corroborated by two independent sources plus the config-reference.

## Related

- EXT-CODEX-2 — the internal insight label in draft-iter2.md
- DD-2 — safe-by-default; no auto-enable-network; remediation menu offers this as user choice
- C02/C03 checklist items

## Why it applies

`git push` and `gh` REQUIRE network. On Codex's default, both are blocked until either the user
sets `network_access = true` OR approves an escalation. Gobbi's PR lifecycle cannot run on a
default Codex session without explicit network enablement or per-call approval. This is the single
biggest dual-runtime gap and the strongest argument that "PR deferred" must generalize from
"gh missing" to "network/approval not granted."

## Source

- https://developers.openai.com/codex/concepts/sandboxing
- https://www.digitalapplied.com/blog/codex-cli-deep-dive-config-profiles-sandbox-2026
- https://developers.openai.com/codex/config-reference ([sandbox_workspace_write].network_access)

## Excerpt

> "the default `workspace-write` sandbox mode keeps network access turned off unless you enable
> it in your config." Enable via:
> ```toml
> [sandbox_workspace_write]
> network_access = true
> ```

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-14 | 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d | DD-2 (safe-by-default model) + DD-3 (probe network field) + C02/C03 |
