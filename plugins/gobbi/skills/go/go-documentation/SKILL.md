---
name: go-documentation
description: "MUST load when writing or reviewing Go package comments, declaration comments, doc-comment links or headings, or implementation comments."
allowed-tools: Read
skill-type: preference
---

# Go Documentation

Go Documentation guides Go authors and reviewers when public documentation or implementation comments have
more than one valid expression. It defines the documentation boundary, then recommends forms that serve
callers and future maintainers.

This skill owns package comments, declaration comments, doc-comment links and headings, complete-sentence
public documentation, and implementation-comment judgment.

It describes accepted behavior without designing it. Public API, CLI, and error contracts remain with
`go-design`; names and error text remain with `go-conventions`; source form and generated provenance remain
with `go-source`; exact version, command, and tool behavior remain with `go-toolchain`.

## Principles

### Write public documentation for the caller

Public documentation should let a caller understand the accepted contract without reading implementation.
Internal detail belongs only when it changes how the caller uses the code.

### Name the subject and purpose

A public comment becomes useful when readers can identify what it describes and why that subject exists.
Either fact without the other leaves the contract incomplete.

### Add structure only when it helps

Links and headings should make distinct topics easier to find. Decorative structure makes a short comment
harder to follow.

### Preserve reasons the code cannot express

Implementation comments should retain constraints, rationale, invariants, and trade-offs that remain current.
Restating syntax adds no durable understanding.

## Rules

- **MUST describe the accepted public API or CLI and error contract without choosing or changing it.** Keep
  design with `go-design`, names and error text with `go-conventions`, source form and generated provenance
  with `go-source`, and exact version, command, and tool facts with `go-toolchain`.
- **MUST make every package comment and exported declaration comment name its subject and state its purpose.**
  The wording may vary only while both facts remain explicit.
- **MUST place every caller-relevant behavioral condition in public documentation.** Internal mechanics that
  do not affect use remain outside that contract.
- **MUST write public documentation in complete sentences and use doc-comment links or headings only when they
  add usable structure.** Decorative structure cannot replace clear prose.
- **MUST keep every changed public declaration, documented error condition, and retained comment aligned with
  the current implementation contract.** Stale prose is a contract defect.
- **MUST use implementation comments to preserve applicable constraints, rationale, invariants, and
  trade-offs.** NEVER use them to narrate syntax.

## Preferences

### Package comments

PREFER opening a package comment by naming the package and stating its purpose, following the
[Go doc-comment guide](https://go.dev/doc/comment). A documented command-package or generated-source form may
justify a different opening when the subject and purpose remain explicit.

### Declaration comments

PREFER beginning an exported-declaration comment with the declared name and its caller-facing purpose. Depart
when grammar or an established project phrase identifies the same subject more clearly without mechanical
repetition.

### Caller-relevant behavior

PREFER documenting behavioral conditions only when they affect use, including applicable errors, concurrency,
or ownership. Include an internal detail only when a caller must know it to use the accepted contract safely.

### Links and headings

PREFER direct prose for a short comment. Add links or headings when they make distinct topics easier to find,
and omit them when linear prose is clearer.

### Implementation comments

PREFER an implementation comment where code alone cannot preserve an applicable constraint, rationale,
invariant, or trade-off. Omit the comment when it would only restate syntax.

### Current documentation

PREFER removing obsolete prose over retaining a misleading explanation. Keep historical rationale only while
it still constrains the current implementation contract.

## References

- [Go Documentation evaluation checklist](checklists.md)
