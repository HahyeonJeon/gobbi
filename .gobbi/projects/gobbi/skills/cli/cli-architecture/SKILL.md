---
name: cli-architecture
description: "MUST load when choosing or reviewing command hierarchy, command, option, or operand semantics, configuration sources or precedence, semantic result or error models, stream roles, exit-status contracts, public modes, compatibility, deprecation, or retirement for a line-oriented CLI."
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
skill-type: preference
---

# CLI Architecture

This nonproduction skeleton reserves the mechanism-free command and automation contract for a line-oriented
CLI. It owns semantic command decisions and public compatibility, not terminal expression or mechanisms.

A fresh Preference Skill Writing pass will replace every placeholder below. It must retain this trigger,
route expression and facts to their owners, and leave TypeScript implementation and evidence outside this skill.

## Principles

### Keep the reserved semantic boundary visible

The final principles will govern command meaning, stream roles, public modes, and compatibility without
prescribing parser, runtime, test, package, or delivery mechanisms.

## Rules

- **MUST replace this nonproduction skeleton through the assigned fresh preference pass.** The final skill
  must preserve the canonical trigger and accepted owner boundary.

## Preferences

### Reserved judgment surface

The final preferences will cover command hierarchy, grammar, configuration precedence, semantic events,
exit behavior, public modes, compatibility, deprecation, and retirement.

Expression routes to `cli-interface`; current facts route to `cli-platform`; trust analysis routes to
`cli-security`; coordination routes to `cli-development`; target and delivery support routes to `cli-release`.
Implementation and evidence route to the applicable `typescript-development`, `typescript-typing`,
`typescript-toolchain`, and `typescript-testing` owners.

## References

- [CLI Architecture checklist](checklists.md)
