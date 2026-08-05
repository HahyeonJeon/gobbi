---
name: go-source
description: "MUST load when choosing or reviewing Go source file organization, canonical formatting, import grouping, blank or dot imports, or generated source provenance."
allowed-tools: Read
skill-type: preference
---

# Go Source

Go Source guides Go authors and reviewers when source organization, formatting, import form, or generated
source provenance has more than one plausible expression. It defines the valid source-form boundary, then
recommends defaults within it.

Use this skill after the project has established its written conventions and tool policy. It owns source-file
cohesion, canonical form, import grouping and form, and generated-source provenance.

Source-file names, import aliases, other naming, and error text remain with
[`go-conventions`](../go-conventions/SKILL.md). Public documentation and comments remain with
`go-documentation`; exact formatter, import-tool, and generator commands remain with
[`go-toolchain`](../go-toolchain/SKILL.md).

## Principles

### Group source by reason to change

A source file is cohesive when its declarations change for the same reason. Clear grouping makes ownership
and review boundaries visible.

### Let canonical tools produce layout

Formatter-produced layout is a shared language, not a canvas for private alignment or line-length schemes.
Its value comes from making equivalent source look equivalent.

### Make import effects visible

Import form should expose both where symbols come from and why package initialization is required. An unusual
import earns its place through a narrow, visible purpose.

### Keep generated source reproducible

Generated source is the consequence of declared inputs and a declared generator. Regeneration should
reproduce every accepted correction without replacing work that belongs in owned source.

## Rules

- **MUST follow the accepted project source-organization, formatting, import-form, and generated-source
  contracts before applying these Preferences.** Route a material project-wide written-form departure to
  `go-conventions` and an exact command decision to `go-toolchain`.
- **MUST treat only valid Go source as canonically formatted.** Keep neither formatter-removed hand alignment
  nor a private line-length scheme, and keep an invalid-source formatter blocker visible.
- **MUST group declarations in each source file by a shared reason to change.** A generated boundary or other
  mechanical split does not justify mixing unrelated responsibilities.
- **MUST make generated-source provenance explicit through the required marker, declared inputs, and declared
  generator.** Every generated change must correspond to that generator.
- **NEVER use generated output as a substitute for a required owned-source change.** Regeneration must preserve
  every accepted generated-source correction.
- **MUST keep import grouping and ordering consistent with project tools, and keep every blank or dot import
  deliberate, visible, and narrow.** Blank imports need package-level side-effect contracts and focused
  integration points; dot imports need material narrow-test clarity and visible symbol provenance.

## Preferences

### Source organization

PREFER one coherent responsibility and reason to change per source file. Depart only when an accepted project
source-organization contract requires a different file boundary.

### Formatter-produced layout

PREFER the complete layout produced by the project's canonical formatter, including its spacing, indentation,
alignment, and line breaks. When the project is silent, follow Go's standard `gofmt` convention described by
[Effective Go](https://go.dev/doc/effective_go#formatting); route command details and diagnostics to
`go-toolchain`. Depart from that standard form only when an explicit project source-form contract and its
canonical formatter support the difference.

### Import grouping and ordering

PREFER the groups and order produced by the project's formatter or import tool. Depart only when the project
has an explicit source-form contract that its tool does not express.

### Blank imports

PREFER ordinary imports. Use a blank import only at a focused integration point where package initialization
is the intended contract, and keep that reason visible through the project's accepted source-form convention.

### Dot imports

PREFER qualified imports. Use a dot import only in a narrow test where it materially improves clarity and the
reader can still identify each imported symbol's provenance.

### Generated source

PREFER changing owned inputs and regenerating over editing generated output. Depart only when the generator's
owned workflow permits maintained corrections and the next regeneration demonstrably preserves them.

## References

- [Go Source evaluation checklist](checklists.md)
