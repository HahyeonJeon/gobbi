---
name: cli-interface
description: "MUST load when choosing or reviewing help and discovery content, terminal wording, human, plain, or structured rendering within accepted stream roles, diagnostics, prompts, progress, visualization, accessibility, localization, or adaptive presentation for a line-oriented CLI."
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
skill-type: preference
---

# CLI Interface

CLI Interface guides the product owner who chooses or reviews how an accepted line-oriented command model
appears to people and automation. Its result is one expression contract for help, results, diagnostics,
prompts, progress, and visualization across terminal, redirected, piped, CI, localized, and assistive use.

[`cli-architecture`](../cli-architecture/SKILL.md) owns meaning, semantic fields, stream roles, modes, exits,
and compatibility. This skill expresses those accepted decisions without choosing parser or renderer
libraries, current platform facts, security policy, implementation, process tests, target support, automatic
paging, or full-screen terminal behavior.

## Principles

### Expression preserves one meaning

Human richness, plain text, and structured protocols are views of one accepted semantic model. A rendering
choice may reorder or label information for comprehension, but it never invents, removes, or reinterprets it.

### Streams adapt independently

stdin, stdout, and stderr can have different capabilities and destinations. Each stream uses its own facts
and explicit controls instead of borrowing another stream's TTY, width, encoding, or terminal state.

### Accessible expression is a complete path

Meaning survives without color, animation, cursor position, overwritten lines, alignment, or decorative
Unicode. Plain, ASCII, narrow, and screen-reader expressions are designed outcomes, not error fallbacks.

### Automation protocols resist presentation drift

Structured records remain locale-independent and decoration-free while human wording evolves. Presentation
defaults never make a machine consumer infer completeness or failure from terminal behavior.

## Rules

- **MUST define expression for all four accepted profiles: `human`, `plain`, `json`, and `jsonl`.** Every
  profile preserves Architecture-owned meaning, assigned streams, completeness, failure, and recovery.
- **MUST adapt stdout and stderr separately from their exact destination, TTY state, CI context, width,
  locale, encoding, Unicode capability, and explicit assistive controls.** Detection changes presentation
  defaults only and every explicit control overrides its corresponding automatic default.
- **NEVER make color, symbols, cursor position, rewritten lines, animation, alignment, or localized wording
  the sole carrier of identity, state, severity, change, completeness, or recovery.** Plain and structured
  output contains no ANSI control sequence or layout-dependent meaning.
- **MUST keep prompts and progress inside their accepted Architecture stream roles and interaction state.** A
  non-interactive path never waits for input, and any terminal mode changed for input is restored after every
  success, failure, EOF, timeout, cancellation, and signal path.
- **NEVER silently truncate requested data or disguise a partial view as a complete result.** A bounded human
  summary identifies its scope, states what was omitted when known, and names an explicit complete route.
- **NEVER change command semantics, stream roles, structured field meaning, exit behavior, security
  requirements, implementation mechanisms, evidence, or support policy from this skill.** Built-in paging
  and full-screen terminal interfaces remain outside this line-oriented subject.

## Preferences

### Prefer help that moves from purpose to safe action

**PREFER** root and group help that gives a short purpose, canonical commands, global controls, and the next
discovery step before detail. Command help should present usage, operands, options, input sources, output
profiles, examples, exits, configuration, effects, recovery, compatibility, and related commands in that
order when each item applies.

Prefer task-shaped examples that show the exact command and the expected kind of result. Keep an invalid
invocation's diagnostic on stderr and make any suggestion visibly non-executing. Architecture owns whether
help, version, or an invocation is accepted; Interface owns its wording, hierarchy, and rendering.

### Prefer an explicit profile matrix

**PREFER** explicit profile selection when a consumer needs stable expression and per-stream automatic
defaults only when no format was requested.

| Profile or default | stdout expression | stderr expression | Interaction and decoration |
|---|---|---|---|
| Explicit `human` | Adaptive line-oriented result | Adaptive diagnostics, prompts, and progress | Input may occur only when accepted and interactive; capability-safe decoration may apply. |
| Explicit `plain` | Deterministic append-only text | Deterministic append-only diagnostics and milestones | No ANSI, cursor rewrite, spinner, or alignment-dependent meaning. |
| Explicit `json` | One complete versioned result envelope, or the Architecture-defined failure form | Versioned JSONL diagnostics | Non-interactive and decoration-free. |
| Explicit `jsonl` | One versioned record or event per line, including the accepted completion rule | Versioned JSONL diagnostics | Non-interactive and decoration-free. |
| No explicit format | `human` for a capable TTY, otherwise `plain` | Independently `human` or `plain` from stderr facts | Per-stream defaults never alter semantic data or status. |

Use `jsonl` instead of `json` when an accepted result is unbounded or consumers need records before
completion. Preserve Architecture's schema version, discriminators, codes, ordering promises, prior-record
validity, and completion rules; a presentation change does not revise them.

### Prefer independent controls with visible conflicts

**PREFER** each control to affect only its named expression dimension. Reject an incompatible combination as
an invocation error instead of ignoring it.

| Control | Human or plain expression | Structured expression |
|---|---|---|
| `--color=auto|always|never` | Controls color only; `auto` respects current stream facts and the documented `NO_COLOR` precedence. | `always` is invalid; `auto` and `never` remain decoration-free. |
| `--progress=auto|always|never` | Controls whether accepted semantic progress appears; rendering may be redraw or append-only by stderr capability. | `auto` emits none; `always` emits versioned records on structured stderr without cursor motion. |
| `--no-input` | Forbids prompts and requires the accepted non-interactive failure or alternate input route. | Valid and already implied by the profile. |
| `--ascii` | Replaces decorative glyphs without changing user data or meaning. | Invalid because structured data is not terminal decoration. |
| `--screen-reader` | Selects label-rich, append-only, cursor-stable expression with sparse milestones. | Invalid because structured protocols already have their own contract. |

Do not infer screen-reader or reduced-motion use from a terminal or environment variable. Make the explicit
control discoverable and preserve it across stdout and stderr expression where it applies. Treat
[`NO_COLOR`](https://no-color.org/) as an assessed color opt-out convention only; it does not disable all
ANSI sequences or define progress, motion, or accessibility.

### Prefer semantic structure over ornamental layout

**PREFER** headings, labels, grouping, and whitespace that expose the accepted information hierarchy before
borders, icons, and color. Use a table when rows share comparable fields and the available width preserves
every field; switch to labeled record blocks when width, wrapping, plain output, or assistive use makes
columns hard to follow.

Use trees only for genuine parent-child relationships, and provide an indented path or labeled-record form
that preserves ancestry without box-drawing glyphs. Diffs should retain explicit old/new or added/removed
labels in addition to signs and color. Summaries should foreground outcome, affected scope, retained state,
and safe next action rather than decorative totals.

Prefer wrapping a value at a safe boundary over clipping it. Current display-column, grapheme, terminal, and
encoding facts come from [`cli-platform`](../cli-platform/SKILL.md); [Unicode East Asian Width](https://www.unicode.org/reports/tr11/)
is one input and does not establish universal terminal alignment.

### Prefer diagnostics that can be found and acted on

**PREFER** a short first line that identifies the failed subject and accepted error code, followed by the
cause, current state, retained effects, and one safe recovery action when those fields exist. Keep debug
detail separate and explicitly requested so ordinary diagnostics remain navigable and secret-safe.

Quote or encode untrusted identifiers so they cannot forge lines, links, emphasis, or terminal state. The
required control-character, bidirectional-text, invisible-character, and secret-handling policy routes to
[`cli-security`](../cli-security/SKILL.md); Interface makes the accepted safe representation readable.

### Prefer sparse semantic progress

**PREFER** progress only for work long enough that silence would make state unclear. On a capable stderr TTY,
redraw may express the latest accepted milestone; on plain, redirected, CI, or screen-reader paths, use sparse
append-only milestones with labels and avoid repeated percentages that add no decision value.

Completion and failure must have stable final expression independent of the last progress frame. If progress
is unavailable or disabled, the command result and recovery remain complete. Current TTY, cursor, signal,
pipe, and drain behavior comes from `cli-platform`; process-boundary proof belongs to
[`typescript-testing`](../../typescript/typescript-testing/SKILL.md).

### Prefer prompts only for recoverable interactive gaps

**PREFER** a prompt only when stdin is interactive, input is allowed, the missing value is safe to request,
and an explicit non-interactive source exists. Define the label, visible or secret input class, echo policy,
default, validation, retry bound, EOF result, interruption result, timeout when applicable, and alternate
source before accepting the prompt expression.

For a secret, show neither entered data nor a revealing default and restore the prior terminal mode on every
exit path. If the command cannot prompt, name the exact option, environment, file, or configuration route that
can supply the value; do not fall back to a hidden prompt.

### Prefer label-rich accessible expression

**PREFER** stable headings and `Field: value` records for screen-reader and narrow-width paths. Announce only
meaningful state changes, keep record identity adjacent to its values, and place the error summary and
recovery action where sequential reading reaches them without traversing ornamental output.

Use color, icons, line styles, and indentation only as redundant cues. Apply ASCII fallback to decoration,
not user data. A positive claim that people can discover, understand, complete, or recover through an
assistive path requires current representative-user evidence; standards and prior research can shape the
requirement but cannot prove that product-specific outcome.

### Prefer locale-aware human text and locale-stable machine data

**PREFER** whole, contextual human messages that may be translated and locale-aware rendering for human
numbers, dates, units, sorting, and collation. Depart only when the product deliberately promises one human
locale, and record that scope so adding another locale reopens the decision.

Keep structured keys, discriminators, codes, numbers, timestamps, and ordering promises locale-independent.
Preserve user data exactly in structured protocols and use the accepted safe human representation for
ambiguous boundaries, bidirectional controls, or invisible characters. Locale and encoding facts route to
`cli-platform`; spoofing requirements route to `cli-security`.

### Route realization and claims to their owners

Give the accepted expression contract to
[`typescript-development`](../../typescript/typescript-development/SKILL.md) and
[`typescript-typing`](../../typescript/typescript-typing/SKILL.md) for realization. Process behavior,
redirection, profile/control combinations, signals, prompts, progress, and exact consumer-entry proof route to
`typescript-testing`.

Route current terminal and stream questions to `cli-platform`, semantic or stream changes to
`cli-architecture`, trust constraints to `cli-security`, multi-owner state to
[`cli-development`](../cli-development/SKILL.md), and target or support judgment to
[`cli-release`](../cli-release/SKILL.md). A user may pipe output to a separately chosen pager, but this skill
does not launch or manage one.

## References

- [CLI Interface checklist](checklists.md) supplies reusable unchecked conditions for this preference.
