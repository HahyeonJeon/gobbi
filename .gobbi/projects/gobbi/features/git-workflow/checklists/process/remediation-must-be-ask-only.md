---
name: remediation-must-be-ask-only
description: Every sandbox/network remediation offered by the manager must be a user-owned Always-Ask decision; no auto-editing of config files
type: checklists
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [security]
keywords: [sandbox, remediation, always-ask]
author: claude
---

# Checklist — Remediation offered to the user must be an explicit Always-Ask; never auto-applied

## Context

Codex evaluator finding R1 (checklist_gap, security, High/75): the draft's remediation menu —
which can include `network_access=true` or approval escalation — did not carry an explicit
checklist item that every such remediation is ask-only and must never auto-edit
`.codex/config.toml`. Without this guard, Planning could convert "offer remediation" into automatic
sandbox/network configuration changes.

## Checklist items

All must be satisfied before the skill ships:

- [ ] The git skill text states that sandbox/network remediation options are OFFERED to the user,
  never auto-applied by the manager.
- [ ] The manager prompt / manager-facing text explicitly forbids auto-editing `.codex/config.toml`
  or CC settings (`.claude/settings.json` / `allowedDomains`) without user confirmation.
- [ ] Every specific remediation action (CC: `allowedDomains`/`excludedCommands`; Codex:
  `[sandbox_workspace_write] network_access=true` / approval escalation) is gated behind a
  user-decision primitive call, consistent with the Always-Ask classification in
  `git/SKILL.md:108`.
- [ ] No gobbi default ships with `network_access=true` or broad `allowedDomains`.
- [ ] S32 scenario passes: manager offers remediation menu but does not auto-edit config.

## Related

- `working/draft-iter2.md` § R3, C19, DD-2 ASK-ONLY GUARD, S32
- `skills/git/SKILL.md:108` — Forbidden-Ops / Always-Ask classification anchor
