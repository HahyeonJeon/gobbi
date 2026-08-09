# CLI skill family

## Intent

The [CLI root](../../../skills/cli/SKILL.md) is a navigation-only domain skill for line-oriented TypeScript
command-line tools. It routes every applicable product concern to one or more direct children and owns no
child policy. Bun is the primary runtime. Node.js compatibility is claimed only when the exact Node target is
named and directly tested.

Full-screen terminal user interfaces and automatic pager management are outside the current family. They are
preserved as separate outcomes in the [CLI skill family backlog](../../backlogs/cli-skill-family.md).

## Family and ownership

| Child | Type | Current owner |
|---|---|---|
| [`cli-architecture`](../../../skills/cli/cli-architecture/SKILL.md) | Preference | Command hierarchy and semantics, configuration, semantic events and states, stream roles, output profiles, exits, compatibility, deprecation, and retirement. |
| [`cli-development`](../../../skills/cli/cli-development/SKILL.md) | Operation | Multi-owner lifecycle coordination without taking over specialist work or external-action authority. |
| [`cli-interface`](../../../skills/cli/cli-interface/SKILL.md) | Preference | Help, wording, diagnostics, prompts, progress, visualization, accessibility, localization, and adaptive line-oriented rendering. |
| [`cli-platform`](../../../skills/cli/cli-platform/SKILL.md) | Tool | Current terminal, stream, process, pipe, signal, shell, path, encoding, locale, runtime, and operating-system facts. |
| [`cli-release`](../../../skills/cli/cli-release/SKILL.md) | Preference | Support policy, consumer evidence, compatibility, readiness, rollout controls, recovery, support, deprecation, and retirement judgment. |
| [`cli-security`](../../../skills/cli/cli-security/SKILL.md) | Operation | CLI-specific threats, trust and authority boundaries, controls, evidence duties, safe failure, recovery, and residual risk. |

TypeScript implementation, typing, testing, toolchain, packaging, and direct-unit delivery remain with the
existing TypeScript children. The CLI family supplies product contracts, assurance requirements, platform
facts, and release judgments to those owners.

## Public output contract

The family defines four public result profiles:

- `human` provides adaptive, readable terminal output.
- `plain` provides deterministic line-oriented output without styling or motion.
- `json` provides one complete, versioned result envelope.
- `jsonl` provides versioned records or events for unbounded or incremental results.

All profiles preserve the same command meaning, result state, effects, stream roles, and exit meaning. TTY
state may change presentation and prompting defaults. It must not change semantic data or a machine schema.
Requested results go to stdout. Diagnostics, warnings, progress, and prompts go to stderr. Prompt responses
come from stdin.

## Checklist and evaluation composition

The root has no checklist. Each child has one local, unchecked, result-free checklist governed by the exact
hash of its sibling skill. The six sources contain 2,103 unique atomic leaves: Architecture 273, Development
369, Interface 358, Platform 256, Release 363, and Security 484. Their 233 scenario identifiers each have one
matching condition heading.

The completed [CLI skill family review](../../reports/review/2026-08-09-cli-skill-family-review.md) records the
benchmark, formal atomicity evaluation, independent cold audit, repository checks, and their limits. The
checklists are reusable source conditions. They were not executed or scored against a CLI product.

## Source and projection ownership

Canonical sources live in `.gobbi/projects/gobbi/skills/cli/`, with the CLI inventory entry in the canonical
Gobbi skill. `plugins/gobbi/skills/cli/` contains regular materialized package projections. Claude and agent
discovery links resolve to the canonical source. The repository sync script is the only projection writer:
repair canonical source first, then reconcile and verify the generated views.

## Decisions to preserve

- Keep the root policy-free and load every applicable direct child.
- Keep the family line-oriented. Do not fold full-screen state, raw mode, focus, mouse, or pager lifecycle into
  the current contracts.
- Keep semantic results separate from terminal expression. Rendering never becomes the source of state.
- Keep Bun primary and require named, direct evidence for every Node.js compatibility claim.
- Keep package, standalone executable, direct script, and workspace or revision consumers as distinct
  identities with distinct evidence.
- Keep readiness separate from credentials, publication, installation, rollout, rollback, forward fix, and
  other external-action authority.
