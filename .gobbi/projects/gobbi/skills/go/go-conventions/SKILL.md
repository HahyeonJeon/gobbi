---
name: go-conventions
description: "MUST load when choosing or reviewing Go package names, identifiers, receiver names, source file names, import aliases, error text, or project-wide written-form conventions."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# Go Conventions

Use this preference skill when choosing or reviewing Go package names, identifiers, receiver names, source
file names, import aliases, error text, or project-wide written-form conventions.

Accepted project conventions and design decisions remain authoritative. This skill supplies naming and error
text defaults only when the project is silent. A material project-wide departure requires project authority
and a substantive basis.

`go-design` owns each package name, import path, package directory or placement, package boundary, public API
or CLI, type, and error contract; this skill judges their written form after those decisions. `go-source` owns
source organization, formatter layout, import form, and generated provenance. `go-documentation` owns public
documentation and implementation comments. `go-toolchain` owns Go version and command evidence, and
`go-development` owns general construction.

## Principles

### Let project meaning lead written form

Established project usage is stronger evidence than a general naming default. Depart only when project
authority and a substantive reason support one clearer project-wide form.

### Make names work in context

Package qualification and lexical scope supply context. A name should state its role without repeating that
context or encoding its type.

### Keep names honest

A name should expose the behavior and result a caller receives. Concision never justifies hiding I/O,
mutation, blocking, or failure.

### Make error text compose

Error text often gains context when callers wrap it. Ordinary strings should remain readable inside that
larger message while literal proper names and quoted input keep their required case.

## Rules

- **MUST follow accepted project naming and error-text conventions before applying these Preferences.** Give
  every material project-wide departure the required authority and a substantive recorded basis.
- **MUST apply written form only after the accepted semantic owner resolves the underlying choice.** Keep
  package design with `go-design` and general construction with `go-development`.
- **MUST keep written package clauses, identifiers, import aliases, and source file names valid for the
  module's Go language version and each project target file system.** Resolve each collision explicitly and
  leave the exact Go version and command evidence with `go-toolchain`.
- **MUST keep every name accurate about the role, result, I/O, mutation, blocking, and failure behavior it
  represents.** Do not encode a type or repeat package context when the surrounding code already supplies it.
- **MUST keep receiver names, initialisms, and local vocabulary consistent across each affected declaration
  set.** An established public API, protocol term, or project convention may supply the controlling spelling.
- **NEVER use this skill to decide source organization, formatter layout, import grouping, blank or dot import
  form, generated provenance, public documentation, implementation comments, or exact command behavior.**
  Route those judgments to `go-source`, `go-documentation`, or `go-toolchain`.

## Preferences

### Package name form

After `go-design` resolves the package name, import path, package directory or placement, package boundary,
and public API or CLI, PREFER the accepted package name's written form to be short, lowercase, and a single
word without underscores or mixed capitals, following the
[Go package name guidance](https://go.dev/blog/package-names). Within that accepted design, avoid generic
spellings such as `util`, `common`, `misc`, and `base` unless the project has established one or no more
specific word fits the accepted package responsibility. A project convention, protocol term, established
abbreviation, or generated source contract may justify a different spelling when it is the clearest local
form.

PREFER exported identifiers that read naturally after qualification by the accepted package name:
`bytes.Buffer`, not `bytes.BytesBuffer`. When changed responsibility requires a different package name, import
path, package directory or placement, package boundary, or public API or CLI, route that design decision to
`go-design` instead of choosing it through a written form edit.

### Identifiers

PREFER concise local names when scope is small and more descriptive names as scope or semantic weight grows.
Use `i`, `r`, or `ctx` where the role is conventional and visible. Use a fuller name where the reader would
otherwise need to inspect the value's origin, and avoid encoding a type the declaration already makes clear.

PREFER consistent initialism spelling, such as `ID`, `HTTP`, and `URL`, in related exported names. These
defaults follow the [Go review comments](https://go.dev/wiki/CodeReviewComments#initialisms); an established
public API or protocol spelling is stronger evidence.

PREFER `Owner()` over `GetOwner()` for a simple accessor. Keep `Get` when it carries domain meaning, pairs
with a protocol command, or distinguishes a lookup operation from direct field-like access.

### Receiver names

PREFER a short receiver name derived from the type, and keep the same receiver name across its methods. Depart
when a collision, established public API, or clearer project convention supplies a better stable name.

### Source file names

PREFER ordinary lowercase `.go` source file names. Give every suffix, platform name, or generated filename an
established project or tool meaning. Otherwise use a short content name instead of an arbitrary layer name.

### Import aliases

PREFER an import alias only to resolve a collision, preserve a standard local name, or clarify a misleading
package name. Avoid aliases used only as decoration; `go-source` owns import grouping and ordering.

### Error text

PREFER lowercase error strings without trailing punctuation so callers can add context cleanly, following the
[Go review guidance](https://go.dev/wiki/CodeReviewComments#error-strings). Start with a capital only for a
proper name, initialism, quoted input, or another case where lowercasing would be wrong.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
