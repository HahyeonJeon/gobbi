---
name: cli-architecture
description: "MUST load when choosing or reviewing command hierarchy, command, option, or operand semantics, configuration sources or precedence, semantic result or error models, stream roles, exit-status contracts, public modes, compatibility, deprecation, or retirement for a line-oriented CLI."
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
skill-type: preference
---

# CLI Architecture

CLI Architecture guides the product owner who chooses or reviews the mechanism-free public contract for a
line-oriented command. Its result defines command meaning, input roles, configuration, semantic events,
stream roles, public modes, state, exits, compatibility, deprecation, and retirement before implementation.

This skill does not choose help wording, terminal rendering, parser or runtime mechanisms, security assurance,
tests, packages, delivery methods, or target support. Those results route to their named owners.

## Principles

### Meaning precedes syntax and expression

Start from the user's or automation consumer's outcome, state transitions, and recovery. Command grammar and
presentation express that model without redefining it.

### Human and automation paths share one model

Every public mode represents the same semantic command result and failure states. Terminal capability,
redirection, locale, and rendering may change expression but never meaning.

### One outcome has one canonical route

A command hierarchy stays predictable when each outcome has one canonical path. Workflows, aliases, and
compatibility paths must not create competing semantics.

### Compatibility includes failure and recovery

Commands, configuration, schemas, stream roles, codes, and exits are public contracts. Their evolution must
leave consumers an observable transition and safe next action.

## Rules

- **MUST define each supported command path as one complete semantic contract.** Include actor, purpose,
  preconditions, inputs, result, events, effects, failure, interruption, partial state, recovery, compatibility,
  and, when shipped, one schema-defined inert completion contract for Bash, Zsh, Fish, and PowerShell.
- **MUST assign one canonical route to each outcome and make command, option, operand, repetition, alias, and
  `--` behavior unambiguous.** Suggestions never execute or silently correct input; `--no-name` is valid only
  for a declared positive Boolean with a declared default, and a negative numeric token is an operand only
  where the schema expects one.
- **MUST disclose every configuration source and define deterministic discovery, precedence, merge, conflict,
  origin, and redaction semantics.** Invalid or untrusted configuration fails before product mutation.
- **MUST assign requested results to stdout and diagnostics, warnings, progress, and prompts to stderr, with
  prompt responses from stdin.** TTY or renderer state never changes semantic data, schema, effect, or exit meaning.
- **MUST define every public mode, machine schema, command state, and exit status as a compatibility-controlled
  contract.** Complete success never hides a failed or partial effect.
- **NEVER prescribe terminal expression, platform facts, security assurance, TypeScript or Bun mechanisms,
  test procedures, package behavior, direct delivery, or support judgment.** Route those results to their owners.

## Preferences

### Prefer resource-first groups with shallow workflow exceptions

Prefer resource-first groups for repeated operations against stable nouns. Prefer a shallow workflow command
only when a dominant end-to-end task crosses resources or does not map cleanly to one resource; record why the
workflow is independently useful and keep one canonical outcome route.

Avoid duplicating a workflow as another canonical resource action. An alias may preserve an accepted
compatibility window, but it should identify the canonical route and its deprecation state.

### Prefer a modern, explicit grammar

Prefer lowercase kebab case for canonical commands and long options. Prefer both `--name=value` and
`--name value` for valued long options, allow global options before or after the command path but before `--`,
and allow options and operands to intermix only while the schema stays unambiguous.

Prefer short aliases only when familiar and unambiguous. Allow a short-option cluster only when every member
is Boolean. Permit `--no-name` only when `name` is a declared Boolean with positive meaning and a declared
default. Treat a negative numeric token as an operand only where the schema expects a numeric operand; `--`
remains the escape for option-shaped data. Declare whether every repeated option rejects, appends, replaces,
counts, or merges.

Choose stricter POSIX-oriented ordering when an explicit portability requirement outweighs the modern
default; the [POSIX utility syntax](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap12.html)
and [GNU command conventions](https://www.gnu.org/prep/standards/html_node/Command_002dLine-Interfaces.html)
are assessed inputs, not claims that one grammar fits every product.

### Prefer discovery from the semantic schema

Prefer side-effect-free root and group discovery, `-h`, `--help`, a `help` command, and root `--version`.
Recognized-command help should bypass required operands and effects. Unknown paths, conflicting discovery
requests, and effect-bearing use of root version should remain invocation errors with no product effect.

Keep command paths, aliases, operands, options, input sources, modes, states, exits, compatibility, and
deprecation in one semantic schema. [`cli-interface`](../cli-interface/SKILL.md) owns help wording, examples,
and layout.

### Prefer completion from the command schema

When a product ships completion, use the command schema as the sole semantic source for Bash, Zsh, Fish, and
PowerShell. Treat partial shell input as untrusted, escape each candidate for the exact shell without
evaluation, and keep generation and execution inert: no prompt, state mutation, default network access,
secret dependency, or secret disclosure.

Accept local dynamic lookup only when the command contract declares a bounded cost, failure behavior, and
privacy boundary. A lookup failure does not weaken the inert completion contract or change command meaning.

Architecture owns the completion schema and semantic behavior.
[`cli-interface`](../cli-interface/SKILL.md) owns completion expression, and
[`cli-security`](../cli-security/SKILL.md) owns threat, control, and assurance results. Completion generator
implementation and source logic route to
[`typescript-development`](../../typescript/typescript-development/SKILL.md). Compiler, build, runtime, and
other tool mechanisms used by the generator route to
[`typescript-toolchain`](../../typescript/typescript-toolchain/SKILL.md). Exact-shell behavior proof routes to
[`typescript-testing`](../../typescript/typescript-testing/SKILL.md), package-backed shipping and installation
route to [`typescript-packaging`](../../typescript/typescript-packaging/SKILL.md), and direct non-archive
shipping and installation route to
[`typescript-cli-delivery`](../../typescript/typescript-cli-delivery/SKILL.md).

### Prefer explicit configuration precedence and origins

Prefer this low-to-high precedence when the target supplies the relevant layers: built-in defaults, system
configuration, user configuration, project or workspace configuration, environment variables, then command
options. Prefer an explicit `--config` to replace discovered configuration-file layers without suppressing
documented environment variables or command options.

Declare the discovery anchor and traversal stop, schema version, environment prefix and mapping, repeat and
file-merge behavior, object and list semantics, `null`, unset, unknown and deprecated keys, duplicates, and
conflicts. Prefer an origin explanation that identifies winning and shadowed sources while omitting secret
values. Current path and environment availability routes to [`cli-platform`](../cli-platform/SKILL.md);
configuration trust routes to [`cli-security`](../cli-security/SKILL.md).

### Prefer one semantic event and state model

Prefer explicit events for complete result, declared partial result, error, warning, progress, prompt, and
requested debug evidence. Define their semantic payload, default stream, persistence, completeness, and
compatibility before Interface chooses their expression.

Prefer explicit states for applicable read-only, dry-run, mutating, destructive, retryable, idempotent,
resumable, interrupted, partial, recovered, deprecated, and retired paths. A mutating command should define
its authoritative state and recovery independently from whether stdout remains writable. Trust, authority,
containment, and destructive confirmation route to [`cli-security`](../cli-security/SKILL.md).

### Prefer four public result profiles

Prefer `human`, `plain`, `json`, and `jsonl` as public semantic profiles. `json` should mean one complete
versioned result envelope; use `jsonl` when results are unbounded or consumers need versioned records or
events with an explicit prior-record validity and completion rule. Stable structured keys, discriminators,
codes, numeric meanings, and ordering promises should not depend on locale.

The profiles share command meaning and assigned streams. [`cli-interface`](../cli-interface/SKILL.md) owns
serialization, wording, visualization, adaptation, accessibility, color, progress, input, ASCII, and
screen-reader expression within those streams. Full-screen terminal interfaces and built-in paging remain
outside this line-oriented family.

### Prefer a small exit taxonomy with stable extensions

Prefer `0` for complete success, `1` for operational or domain failure, and `2` for invocation, option,
input-shape, or configuration failure. Preserve conventional process meanings such as `126`, `127`, and
signal-derived results only where the exact execution target exposes them.

Add another nonzero code only when automation needs a stable distinction that the command contract and help
can preserve. Current process and signal facts route to [`cli-platform`](../cli-platform/SKILL.md); exact
process-boundary evidence routes to
[`typescript-testing`](../../typescript/typescript-testing/SKILL.md).

### Prefer additive evolution and explicit retirement

Prefer additive commands, options, configuration, and structured fields when old accepted invocations keep
the same meaning. A rename or move should retain an explicit alias or compatibility route for the accepted
window, identify the canonical replacement, and expose machine-identifiable deprecation without corrupting
the requested result.

For a removal, define detection, replacement or recovery, compatibility window, and retirement state. This
skill owns command grammar, semantic result, configuration, stream, schema, code, and exit compatibility.
Runtime targets, artifacts, installation, persisted data, update routes, support windows, and readiness route
to [`cli-release`](../cli-release/SKILL.md).

### Route realization without transferring product ownership

Give the accepted semantic contract to
[`typescript-development`](../../typescript/typescript-development/SKILL.md) and
[`typescript-typing`](../../typescript/typescript-typing/SKILL.md) for implementation and input modeling.
Runtime, compiler, module, and build mechanisms route to
[`typescript-toolchain`](../../typescript/typescript-toolchain/SKILL.md). Process behavior proof routes to
[`typescript-testing`](../../typescript/typescript-testing/SKILL.md).

Package-backed command artifacts and consumers route to
[`typescript-packaging`](../../typescript/typescript-packaging/SKILL.md). Standalone executables and other
direct non-archive units route to
[`typescript-cli-delivery`](../../typescript/typescript-cli-delivery/SKILL.md). Multi-owner state, stale
evidence, blockers, and cold handoff route to [`cli-development`](../cli-development/SKILL.md).

## References

- [CLI Architecture checklist](checklists.md) supplies reusable unchecked conditions for this preference.
