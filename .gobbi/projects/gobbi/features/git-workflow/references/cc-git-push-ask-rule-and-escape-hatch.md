---
name: cc-git-push-ask-rule-and-escape-hatch
description: Bash(git push *) ask-rules force a prompt even in auto-allow; dangerouslyDisableSandbox escape hatch disabled by Strict mode
type: references
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, claude-code, sandbox, approval, escape-hatch, runtime]
title: Claude Code — Bash(git push *) ask-rules force a prompt even in auto-allow; sandbox-failed commands can retry unsandboxed via dangerouslyDisableSandbox
source: https://code.claude.com/docs/en/sandboxing#sandbox-modes
accessed: 2026-06-14
ref_type: docs
---

# Claude Code — Bash(git push *) ask-rules force a prompt even in auto-allow; sandbox-failed commands can retry unsandboxed via dangerouslyDisableSandbox

## Insight

Two Claude Code behaviors shape git ops: (1) a content-scoped ask rule such as `Bash(git push *)`
forces a permission prompt even when the command would otherwise auto-run sandboxed — push is a
natural ask-rule target. (2) When a command fails because of sandbox restrictions, Claude Code may
retry it with `dangerouslyDisableSandbox`, running it OUTSIDE the sandbox through the normal
permission flow; this escape hatch can be disabled with `allowUnsandboxedCommands: false`
("Strict sandbox mode").

## Related

- EXT-CC-4 — the internal insight label in draft-iter2.md
- DD-2 — CC analogue of Codex approval escalation; both need skill acknowledgment
- C08 checklist item

## Why it applies

The git skill's Forbidden Operations are framed as "Always-Ask via the user-decision primitive"
(`git/SKILL.md:108`), but on Claude Code an OS-level sandbox + ask-rule layer ALSO gates push —
independent of gobbi's own rule. The skill should acknowledge that push/PR may require an
`allowedDomains` entry, an excluded command, or an out-of-sandbox retry, and that Strict mode
removes the retry path.

## Source

- https://code.claude.com/docs/en/sandboxing (§ Sandbox modes)

## Excerpt

> "Content-scoped ask rules like `Bash(git push *)` still force a prompt even for sandboxed
> commands." … "when a command fails because of sandbox restrictions, Claude analyzes the failure
> and may retry the command with the `dangerouslyDisableSandbox` parameter. The retried command
> runs outside the sandbox … You can disable this escape hatch by setting
> `'allowUnsandboxedCommands': false`."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-14 | 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d | C08 checklist item + DD-2 remediation menu + S23/S24 scenarios |
