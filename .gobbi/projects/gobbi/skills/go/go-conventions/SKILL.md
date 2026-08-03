---
name: go-conventions
description: "MUST load when choosing or reviewing Go names, files, packages, imports, documentation, comments, error text, or formatting."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# Go Conventions

Use this preference skill when choosing or reviewing the written form of Go code. It covers package name and
identifier spelling, source file names and layout, imports, documentation, comments, error text, and formatting.

Project conventions, generated source ownership, and project-selected formatters remain authoritative. This
skill supplies written form defaults only when the project is silent.

`go-design` owns each package name, import path, package directory or placement, package boundary, public API
or CLI, type, and error contract; this skill judges their written form after those decisions. Any exact package
pattern belongs only to project command selection or evidence, and `go-toolchain` alone owns its semantics and
all command behavior. `go-development` owns general construction.

## Principles

### Make code read like its package name

Go names are short because qualification by the package name supplies context. A name should state its role
without repeating that package name or encoding its type.

### Let tools own mechanical layout

Formatting is a deterministic source transformation, not a local style debate. Keep semantic choices with the
author and mechanical layout with the project formatter.

### Write documentation for the caller

Public documentation should let a caller understand a declaration without reading its implementation.
Comments inside an implementation should preserve rationale that the code cannot express.

### Treat consistency as evidence

Established project usage is stronger evidence than a general style default. Depart from nearby patterns only
when correctness, public compatibility, or a clearer project-wide convention justifies it.

## Rules

- **MUST follow the repository's accepted written names, source file layout, generated source contract, and
  formatter configuration before applying this skill's Preferences.** Record or discuss a material
  project-wide written form change instead of introducing it in one file.
- **MUST leave Go source in the project's canonical formatted form.** The project selects the formatter;
  `gofmt` is the default when it is silent, while `go-toolchain` owns exact command behavior and effects.
- **MUST keep written package clauses, import names, identifiers, and source file names valid for the module's
  Go language version and each project target file system.** `go-toolchain` owns selected Go toolchain version
  facts and the command evidence used to establish them; resolve each collision explicitly.
- **MUST make generated source ownership explicit.** A generated Go file must carry the generator's required
  marker and be changed through its source or generator unless the project contract says otherwise.
- **MUST keep package documentation and exported-declaration documentation true after a change.** Update or
  remove prose that no longer matches the declaration, observable behavior, error contract, or compatibility
  promise.
- **NEVER use an import solely for its side effects, or use a dot import, without a deliberate package-level
  reason visible to reviewers.** Keep the reason in project documentation or a nearby comment when it is not
  evident from the import path.

## Preferences

### Formatting and source layout

PREFER the layout produced by `gofmt`; it is the standard mechanical form described by
[Effective Go](https://go.dev/doc/effective_go#formatting). Let the formatter decide indentation, spacing,
alignment, and many line breaks. Depart only through an established project formatter or when invalid Go input
prevents formatting; `go-toolchain` owns the exact formatter command and its returned diagnostic.

PREFER one coherent responsibility per file and ordinary lowercase `.go` file names. Use suffixes such as
`_test.go`, platform constraints, or generated names when the project contract or `go-toolchain` establishes
their meaning; otherwise choose a short content name instead of encoding an arbitrary layer.

### Package name form

After `go-design` resolves the package name, import path, package directory or placement, package boundary, and
public API or CLI, PREFER the accepted package name's written form to be short, lowercase, and a single word
without underscores or mixed capitals, following the
[Go package name guidance](https://go.dev/blog/package-names). Within that accepted design, avoid generic
spellings such as `util`, `common`, `misc`, and `base` unless the project has established one or no more
specific word fits the accepted package responsibility. A protocol, established abbreviation, or generated
source contract may justify a different spelling when it is the clearest local convention.

PREFER exported identifiers that read naturally after qualification by the accepted package name:
`bytes.Buffer`, not `bytes.BytesBuffer`. When changed responsibility requires a different package name, import
path, package directory or placement, package boundary, or public API or CLI, route that design decision to
`go-design` instead of choosing it through a written form edit.

### Identifiers

PREFER concise local names whose scope is small, and more descriptive names as scope or semantic weight grows.
Use `i`, `r`, or `ctx` where the role is conventional and visible; use a fuller name where the reader would
otherwise need to inspect the value's origin.

PREFER consistent initialism spelling, such as `ID`, `HTTP`, and `URL`, in related exported names. Use short,
stable receiver names derived from the type, and keep the same receiver name across its methods. These defaults
follow the [Go review comments](https://go.dev/wiki/CodeReviewComments#initialisms); an established public API
or protocol spelling is stronger evidence.

PREFER `Owner()` over `GetOwner()` for a simple accessor. Keep `Get` when it carries domain meaning, pairs with
a protocol command, or distinguishes a lookup operation from direct field-like access.

### Imports

PREFER the import grouping and ordering produced by the project formatter or import tool. Add an import alias
only to resolve a collision, preserve a standard local name, or clarify a misleading package name; do not use
aliases as decoration.

AVOID blank imports outside a focused integration point such as driver or plugin registration. A dot import is
normally appropriate only in narrow tests that gain material clarity and remain unambiguous; package-local
conventions may rule it out entirely.

### Documentation and comments

PREFER a package comment that begins with `Package name` and an exported declaration comment that begins with
the declared name, as specified by the [Go doc-comment guide](https://go.dev/doc/comment). Write complete
sentences that explain purpose, important behavior, errors, concurrency, and ownership when those facts affect
callers. A tiny command package or generated declaration may use the documented exceptions.

PREFER links and headings in doc comments only when they add usable structure under the current Go
documentation syntax. Keep implementation comments for constraints, rationale, invariants, and non-obvious
trade-offs; avoid narrating syntax.

### Error text

PREFER lowercase error strings without trailing punctuation so callers can add context cleanly, following the
[Go review guidance](https://go.dev/wiki/CodeReviewComments#error-strings). Start with a capital only for a
proper name, initialism, quoted input, or another case where lowercasing would be wrong.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
