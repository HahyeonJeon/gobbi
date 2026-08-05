---
name: go-design
description: "MUST load when designing or reviewing Go packages, public APIs or CLIs, functions, structs, methods, values and pointers, interfaces, errors, generics, mutable-data ownership, or ordinary resource lifetime."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# Go Design

Go Design guides Go authors and reviewers choosing package identities, public APIs or CLIs, values, errors,
ownership, and ordinary resource lifetime. It keeps those choices coherent from a package import path or CLI
entry point through failure and cleanup.

This skill owns package names, import paths, package directories or placement, package boundaries, public APIs
or CLIs, types, errors, mutable-data ownership, copying, and ordinary resource-lifetime judgment.

`go-architecture` owns confirmed project, package, module, or process design and the material-choice operation;
`go-development` owns construction and review. `go-concurrency` owns concurrent lifetime and cancellation;
`go-modules` owns module consumer compatibility. `go-conventions` owns naming and error text; `go-source` owns
source organization, formatter layout, import form, and generated provenance; `go-documentation` owns public
documentation and implementation comments. `go-toolchain` owns exact package pattern semantics, project
command facts, and tool behavior.

## Principles

### Design from the caller inward

A package boundary should give consumers a small, coherent vocabulary through its public API or CLI. Export
only the concepts they must name, and keep implementation choices private.

### Make zero values and ownership unsurprising

Useful zero values reduce mandatory setup. Explicit ownership of mutable data and resources prevents changes
in one part of a program from silently affecting another.

### Add abstraction after the relationship is real

An interface or type parameter should express a current relationship among behaviors or types. Speculative
abstraction enlarges the contract before evidence can shape it.

### Keep failure in ordinary control flow

Errors are values that callers inspect, add context to, and recover from. Panic is reserved for conditions
ordinary callers cannot reasonably handle.

## Rules

- **MUST make every package name, import path, package directory or placement, package boundary, and public API
  or CLI deliberate from current caller needs.** Define each caller-dependent type, method set, behavior,
  error, and ownership rule in the affected public API or CLI; classify every compatibility change as
  `compatible`, `migration supplied`, `authorized break`, or `unsupported`.
- **MUST define ownership when slices, maps, byte buffers, pointers, functions, or other reference-bearing
  values cross a public API or package boundary.** Copy, retain, or transfer them consistently with the
  accepted ownership contract, and route concurrent lifetime or cancellation to `go-concurrency`.
- **MUST give every returned error a handled or explicitly discarded flow.** Preserve each identity that callers
  inspect with `errors.Is` or `errors.As`, and do not both log and return the same failure from one handling
  layer without an accepted caller need.
- **MUST keep receiver choices compatible with mutation, identity, copy safety, method sets, and the other
  methods on the type.** Include copy cost and size, and never copy a value after it acquires non-copyable
  synchronization or resource state.
- **MUST release each acquired resource on every path that owns it.** Place `defer` after successful acquisition
  when function-scoped cleanup is correct, and use an explicit lifetime when cleanup must happen earlier.
- **NEVER use panic for an expected input, dependency, I/O, or domain failure in reusable code.** Return an error
  unless continuing would violate a programmer invariant or the governing public API explicitly requires panic.

## Preferences

### Packages and public APIs or CLIs

PREFER one cohesive responsibility per package boundary and the smallest public API or CLI that serves current
callers. Choose the package name, import path, and package directory or placement as one design, then put each
declaration where consumers naturally import or invoke it. Consider how a package-qualified name or CLI entry
point reads before adding another package or layer.

PREFER functions and concrete data until shared invariants, state, identity, or behavior justify a named type
and methods. Add a constructor only when it establishes an invariant, injects a required dependency, acquires
a resource, or materially improves clarity; otherwise make the zero value useful, as encouraged by
[Effective Go](https://go.dev/doc/effective_go#allocation_new).

PREFER options or a configuration type only when several related inputs form a stable concept or optional
growth is already real. Keep a direct parameter list when it is shorter and clearer, and do not hide required
dependencies in a generic options bag.

### Values, pointers, and methods

PREFER a value receiver for a small immutable value whose methods treat copies as equivalent. PREFER a pointer
receiver for mutation, identity, high copy cost, large values, non-copyable fields, or a method set that must
operate on one instance; keep the receiver kind consistent unless a specific method has a clear reason to
differ. The [Go FAQ](https://go.dev/doc/faq#methods_on_values_or_pointers) describes the method-set and receiver
trade-off.

PREFER values when absence is not meaningful and pointers when identity, mutation, large-copy avoidance, or
optional presence is part of the contract. Do not use a pointer merely to imitate another language's object
model.

### Interfaces

PREFER small interfaces defined by the consumer that needs the behavior. Accept an interface when multiple
real implementations or a meaningful seam exist, and normally return a concrete type so later methods do not
become breaking interface additions; the [Google Go guidance on interfaces](https://google.github.io/styleguide/go/decisions#interfaces)
gives the same consumer-side default.

AVOID an interface created only to mock one concrete implementation, a pointer to an interface, or a broad
provider interface whose caller uses one method. A generated boundary or stable external protocol may justify
an adapter, but its interface should still reflect client needs.

### Mutable data and nil

PREFER a clear copy boundary for slices, maps, and buffers that a caller may mutate. Return a copy when
independence is promised; return a view only when aliasing and lifetime are part of the accepted public API.

Choose nil and empty slices or maps deliberately at serialization, equality, and public API boundaries. Prefer
the simpler nil value inside ordinary Go code when callers treat both forms alike, but preserve an established
wire contract or test expectation.

### Errors

PREFER plain errors with useful operation context, wrapping with `%w` only when the wrapped identity becomes
part of the public API inspection contract. Use `errors.Is` and `errors.As` rather than string matching; see
[Go 1.13 errors](https://go.dev/blog/go1.13-errors) and the [`errors` package](https://pkg.go.dev/errors).

PREFER a sentinel or exported error type only when callers need a stable programmatic branch. Treat either as
public API, keep human text secondary, and avoid exposing an implementation dependency's error identity
accidentally.

Return a literal `nil` error when no failure exists. An interface containing a typed nil pointer is non-nil,
which creates the trap described by the [Go FAQ](https://go.dev/doc/faq#nil_error); avoid constructing or
returning such values.

PREFER handling an error at the layer that can add a decision or recovery path. Avoid redundant handling,
including logging and returning the same failure from one layer, unless the public API or CLI requires both.

### Ordinary resources

PREFER acquiring a resource only after its owner and failure behavior are clear. Keep acquisition and release
close when the lifetime is function-scoped; use an explicit owner when the resource outlives that scope.

### Generics

PREFER type parameters only when repeated type-safe algorithm or container behavior across current types
provides evidence for one implementation and preserves useful static information. Start from the operations
and callers, then choose the smallest constraint that supports them; do not begin with a constraint hierarchy
or replace a clear interface with a speculative generic abstraction. The
[official generics guidance](https://go.dev/doc/tutorial/generics) is the baseline for syntax and inference.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
