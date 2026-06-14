---
name: cc-gh-tls-excludedcommands
description: Go-based CLIs including gh may fail TLS under macOS Seatbelt sandbox; fix is excludedCommands
type: references
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, claude-code, sandbox, gh-cli, tls, runtime]
title: Claude Code — gh / Go-based CLIs may fail TLS verification under the macOS Seatbelt sandbox; need excludedCommands
source: https://code.claude.com/docs/en/sandboxing#troubleshooting
accessed: 2026-06-14
ref_type: docs
---

# Claude Code — gh / Go-based CLIs may fail TLS verification under the macOS Seatbelt sandbox; need excludedCommands

## Insight

Under the macOS Seatbelt sandbox, Go-based CLIs — explicitly including `gh`, `gcloud`,
`terraform` — may fail TLS verification because the sandbox blocks the Mach IPC channel to
`com.apple.trustd.agent` that Go's crypto/x509 uses. The documented fix is to list these tools in
`excludedCommands` so they run OUTSIDE the sandbox (where they go through the normal permission
flow).

## Related

- EXT-CC-2 — the internal insight label in draft-iter2.md
- `skills/git/SKILL.md:71-74` — P1 checks `gh --version`/`gh auth status` (passes yet P4 can fail)
- DD-2 — remediation menu includes `gh` in `excludedCommands`

## Why it applies

Gobbi's entire PR lifecycle is built on `gh`. If a Claude Code user runs sandboxed on macOS, every
`gh` call can fail TLS unless `gh` is in `excludedCommands` — a setup precondition the skill never
documents. The skill's P1 "verify gh available + authenticated" check would pass yet P4's
`gh pr create` could still fail under sandbox.

## Source

- https://code.claude.com/docs/en/sandboxing (§ Troubleshooting)

## Excerpt

> "Go-based CLIs fail TLS verification on macOS: tools such as `gh`, `gcloud`, and `terraform`
> may fail TLS verification under Seatbelt. List these tools in `excludedCommands` to run them
> outside the sandbox."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-14 | 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d | C07 checklist item + DD-2 remediation menu |
