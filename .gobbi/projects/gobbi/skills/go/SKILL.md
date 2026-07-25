---
name: go
description: "MUST load before writing or reviewing Go code. The concrete Go-idiom layer beneath the language-agnostic coding standard — module contract, errors, concurrency, interfaces, tooling, testing, and the service-client boundary."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# Go

The concrete Go-idiom layer, sitting UNDER `coding`. The `coding` standard states the
language-agnostic properties of good software; this skill says what they look like in idiomatic Go —
the module contract that decides which semantics compile, errors as ordinary values, goroutine
ownership and cancellation, interface placement, the tool chain that verifies a change, and the
service-client boundary. It specializes those properties for Go; it does not repeat them, and it
assumes the `coding` and gobbi behavioral layers are already in context.

Load it before writing or reviewing any Go. The Principles, Rules, and Procedure below carry an
ordinary Go change from first read through design, construction, and verification without opening
anything else; a Procedure step (P2) routes you to a child doc only when a decision needs depth this
cold-load floor does not carry. Review is the one exception: the final review step and any independent
evaluation load the scenario, checklist, and evaluation companions, because binary checks and graded
verdicts are theirs to own, not this file's.

---

## Principles

> **1. Study the module contract before you design: the `go` line is a semantics switch, not metadata.**

The parent says study the code and its prior art first; the Go delta is that the concrete contract is
`go.mod`, not the abstract problem. One line decides whether a loop variable is per-iteration, which
GODEBUG defaults apply, and which standard-library surface the toolchain will accept. The same source
therefore compiles with different meaning under two different `go` lines, so reading that line is not
housekeeping — it is the first fact the design depends on.

> **2. Errors are values on the normal path: return them, and treat every wrap as an API commitment.**

The parent says surface failure where a caller can act on it; the Go delta is that Go gives failure no
language machinery at all. An error is an ordinary return value, so its shape — sentinel, custom type,
or plain text — is a design act taken at the same moment as the signature. And wrapping is not a
formatting choice: `%w` exposes the wrapped error to `errors.Is` and `errors.As`, which publishes it
into your API for as long as callers may match on it.

> **3. Own every goroutine's termination; carry cancellation on a `Context`.**

The parent says isolate side effects and finish what you start; the Go delta is the asymmetry between
starting concurrency and stopping it. Starting is one keyword. Stopping is entirely manual: goroutines
are not garbage collected and must exit on their own, so a goroutine with no stop path is a leak that
no compiler, vet check, or test failure will show you. Every one needs a named owner, a stop signal,
and a way for that owner to wait.

> **4. Define interfaces where they are consumed, and return concrete types.**

The parent says design the contract first and keep units deep; the Go delta is *where* the contract
lives. Go's interfaces are satisfied structurally — the specification defines a type as implementing
an interface when its method set contains the interface's methods, with no declaration of intent — so
a consumer can declare exactly the method set it needs after the fact, without the implementor
knowing or being changed. Declaring an interface next to its implementation "for
mocking" therefore buys nothing and costs the caller: it narrows what a return value can do, and it
freezes a method set before any consumer has asked for one.

> **5. Make the zero value useful, and compose instead of inheriting.**

The parent says hide complexity behind a simple interface and build only what is needed; the Go delta
starts before the constructor. Every Go type already has a zero value, and a caller can build one
without asking you — so "make the zero value useful", which the Go Proverbs state as one of the
language's values, is the cheapest abstraction available: a type that works from its zero value needs
no constructor, no builder, and no initialized flag, and the standard library shows the shape
(`strings.Builder`'s documentation says its zero value is ready to use). The second half is the other
Go delta: Go offers no inheritance, only embedding — and embedding is not private reuse. The
specification makes an embedded field a field named for its type, with that type's methods promoted
onto yours; the consequence this skill draws is that embedding an **exported** type therefore publishes
both the field and the promoted method set, so a change in the embedded API becomes a change in your
own. (Uber's style guide reaches the same place from experience, calling embedding in exported structs
rarely necessary.) A named field with explicit delegation
costs a few lines and keeps the surface yours.

> **6. Share by communicating; where you share memory, state the synchronization and prove it with `-race`.**

The parent says make sharing and synchronization explicit; the Go delta is that Go's memory model
admits no benign race: any implementation may, on detecting a data race, report it and halt the
program. Go deliberately does not go as far as C and C++ — its implementation restrictions keep a
racing program to a limited set of outcomes rather than making its meaning entirely undefined — but a
bounded wrong answer is still a wrong answer, and there is no "it's only a counter" exemption. The
only proof available is a runtime detector that finds only races a run actually executed, so the
synchronization decision must be written down, not inferred from a green test run.

> **7. Treat a slice or map value as a reference to shared underlying data — copy at the boundary you do not own.**

The parent says minimize shared mutable state; the Go delta is that Go shares it implicitly. A map
value is a reference to the implementation-specific data structure behind it, so assigning or passing
one copies the reference and not the data. A slice carries a pointer into a backing array, so whether
`append` writes into a caller's memory depends on capacity — a property no signature shows and no
reader can see at the call site.

> **8. Clear is better than clever: formatting is settled by a tool, and reflection, `unsafe`, `cgo`, and generics must each be earned.**

The parent says prefer the clear form over the clever one; the Go delta is that Go already made most
of that choice for you and removed the argument. Formatting is decided by `gofmt`'s output rather than
by taste. The four remaining escape hatches each trade away a guarantee the plain form gives you —
`unsafe` forfeits the Go 1 compatibility promise by its own package documentation, and a type
parameter is earned only by repeated identical code that differs solely in type — so each needs a
reason you can name.

---

## Rules

These Rules are the house default for new and changed code. When reviewing or maintaining an EXISTING
codebase, apply them to what the change touches; they are not a mandate to restructure a working
module. Two of them bind a different actor: **H10, and H19's second clause, govern whoever writes or
revises this skill and its children** — they are citation and currency rules for the document, not
constraints on the Go you write.

### Must-Follow

- **H1 — MUST read `go.mod` first, let `go mod init` set the `go` line, and keep the module floor
  distinct from the toolchain version.** The `go` line gates language semantics, GODEBUG defaults, and
  the standard-library surface `go vet stdversion` accepts; the installed toolchain gates which
  commands and `go fix` analyzers exist. The rule is the robust part: let `go mod init` choose, because
  Go 1.26 states that running it on a toolchain of version `1.N.X` "will create a `go.mod` file
  specifying the Go version `go 1.(N-1).0`". The numeral follows from your toolchain, so it moves: on a
  1.26.x toolchain that is `go 1.25.0`, and a 1.27 toolchain will write `go 1.26.0`. Never hard-code
  the number from this page — read what `go mod init` actually wrote. Fix: raise the floor only for a
  named feature, with `go get go@<version>`, and never teach a symbol newer than the floor without
  saying which floor it needs.
- **H2 — MUST run a full `go vet ./...` separately from `go test`.** `go vet` ships 35 analyzers;
  `go test` runs 11 of them — what `go help test` calls a "high-confidence subset", executed from the
  go command's own `defaultVetFlags`: `atomic`, `bool`, `buildtags`, `directive`, `errorsas`,
  `ifaceassert`, `nilfunc`, `printf`, `slog`, `stringintconv`, `tests`. (The doc comment beside that
  list still names only ten; it drifted when `slog` was added. Trust the executed set.) `copylocks`
  and `lostcancel` sit outside the subset, so "the tests pass" is not "vet passed". Fix: make the full
  vet its own gate in P7.
- **H3 — MUST keep every file `gofmt`-clean.** Formatting in Go is not a style preference; the tool's
  output is the format. Attribute the mandate correctly: `cmd/gofmt` documents mechanics only and never
  says Go code must be formatted with it, while Google's Go Style Guide — self-declared "normative and
  canonical", for Google — states that all Go source files must conform to `gofmt`'s output. Fix: run
  `goimports`, which formats and fixes the import block in one pass.
- **H4 — MUST return errors as values, handle each error exactly once, and wrap with `%w` only when
  committing to that error as part of your API.** Handling twice is the common failure: log-and-return
  produces two reports of one fault and denies the caller the choice. Error strings are not capitalized
  and carry no trailing punctuation. Mark the authority honestly — the error-string form comes from Go
  Code Review Comments, but the handle-once and do-not-log-and-return guidance sits on Google's
  `best-practices` page, which self-declares "neither normative nor canonical". Fix: return the error
  or handle it, never both.
- **H5 — MUST take `ctx context.Context` as the first parameter, named `ctx`, and MUST NOT store a
  `Context` in a struct.** A context carries a deadline and a cancellation signal that belong to one
  call, not to an object's lifetime; storing it hides which call a cancellation actually cancels. Go
  Code Review Comments states **one** exception — matching a standard-library or third-party interface
  that requires it. The `http.Request` retrofit is the second, and it is owned by
  `go.dev/blog/context-and-structs`, not by Code Review Comments. One deliberate upgrade to record:
  `pkg.go.dev/context` says the parameter is "typically named ctx", so the naming half of this MUST is
  this skill's house rule, not the package's mandate. Fix: pass it explicitly through the call chain.
- **H6 — MUST give every goroutine a predictable stop time or a stop signal, plus a way for the caller
  to block and wait.** Two Go-team owners carry most of this: Code Review Comments § Goroutine
  Lifetimes says to make it clear when — or whether — a spawned goroutine exits, and
  `go.dev/blog/pipelines` says goroutines are not garbage collected and must exit on their own. The
  third part, requiring a way for the caller to block and wait, is this skill's addition, not a Go-team
  mandate. Fix: name the owner at the `go` statement and give it a `Context`, a done channel, or an
  `errgroup`.
- **H7 — MUST define an interface in the package that consumes it, and return concrete types.** Go
  Code Review Comments states the position and ships a literal counter-example: do not define
  interfaces on the implementor side "for mocking", and do not define interfaces before they are used.
  A concrete return keeps every method available to the caller; an interface return deletes the ones
  you did not anticipate. Fix: return the struct, and let each consumer declare the method set it
  needs.
- **H8 — MUST copy at a slice or map boundary you do not own.** Whether `append` overwrites a caller's
  array is capacity-dependent and invisible at the call site; a small returned sub-slice keeps the
  whole backing array alive, which *Go Slices: usage and internals* names as the retention gotcha and
  answers with a copy; `slices.Clone` copies one level only. For maps the spec is explicit that a map
  value is a reference to the implementation-specific data structure, so an assignment copies the
  reference and the two names then alias one map:

```go
var m1 = make(map[string]int)
var m2 = m1        // m2 stores the map descriptor of m1
m1["foo"] = 42     // setting m1["foo"] changes m2["foo"] as well
```

  `Source: the specification § Assignment statements, read against the pinned go1.26.5 tag
  (doc/go_spec.html) on 2026-07-25. The rendered page at go.dev/ref/spec tracks tip, so pin the tag
  whenever the exact wording is load-bearing.`

  Fix: clone what you keep, use the three-index form or `slices.Clip` — which the `slices` package
  documents as removing unused capacity — when you hand a slice out, and say in the doc comment whether
  a returned slice or map is shared or owned.
- **H9 — MUST run `go test -race` for any change with concurrent access, and MUST state the
  synchronization decision for every piece of shared memory.** Budget for it: the race detector's own
  page puts the runtime overhead at 5-10x memory and 2-20x execution time, which is why it is a gate
  and not the default test command. And it "only finds races that happen at runtime, so it can't find
  races in code paths that are not executed" — a green race run is evidence, not proof, and the
  written-down decision is what a reviewer actually checks. Fix: record the owner and the mechanism
  (channel, mutex, atomic) beside the shared state, and make `-race` its own gate in P7.
- **H10 — MUST cite the primary owner and a verification date for every version number, symbol, import
  path, and example this skill teaches.** Taught Go examples here are not compile-verified, so the
  citation is the only fact-check a reader has. Two traps this rule exists to stop: a module's
  pkg.go.dev page is NOT evidence that the module is current — a frozen, abandoned module still renders
  as "Latest", because module metadata is not a deprecation signal in Go; and a default-branch URL that
  returns HTTP 200 is not a currency guarantee, because a stale branch answers exactly like a live one.
  Fix: pin the tag, read the source file rather than the rendered page when exact wording is
  load-bearing, and date every claim.

### Must-Not-Follow

- **H11 — NEVER return a concrete typed-nil pointer through an `error` interface.** An interface value
  is nil only when both its type and its value are unset, so a nil `*MyError` returned as `error` is
  non-nil and `err != nil` fires on the success path. No vet analyzer catches it. Fix: declare the
  variable as `error`, and return a literal `nil` on success.
- **H12 — NEVER add the pre-1.22 loop shadow (`x := x`), and NEVER assume per-iteration variables in
  the assignment form.** Loop variables became per-iteration in Go 1.22, which makes the shadow dead
  code that now misleads the reader. But the change applies only to variables the loop *declares*:
  `for k, v = range m` over pre-declared variables still shares one variable in 1.22 and later. Fix:
  delete the shadow, and use the `:=` declaration form when a closure or goroutine captures the
  variable.
- **H13 — NEVER copy a `sync` type after first use.** A `Mutex`, `RWMutex`, `Once`, `WaitGroup`,
  `Cond`, `Map`, or `Pool` carries state that a copy silently duplicates, so two copies guard nothing —
  the package documentation states the must-not-copy rule for each. The practical consequence this
  skill draws: a struct holding one has to use pointer receivers throughout, because a value receiver
  copies the lock on every call. Fix: take the struct by pointer everywhere, and let `go vet copylocks`
  — which `go test` does not run (H2) — check it.
- **H14 — NEVER create a `pkg/` directory or a `util`, `common`, or `misc` package.** `pkg/` comes from
  the community `golang-standards/project-layout` repository and was repudiated in its own issue
  tracker by Russ Cox (`golang-standards/project-layout` issue #117); the official module-layout page
  never mentions it; a
  `util` package is a name that admits the boundary was never decided, and it grows into the catch-all
  every import touches. Fix: start flat, reach for `internal/` early because the compiler enforces it,
  and add `cmd/` only when there is more than one binary.
- **H15 — NEVER cite Effective Go for modules, generics, iterators, errors, or tooling, and NEVER cite
  `go.dev/wiki/CommonMistakes` at all.** Effective Go says in its own header that it is not current,
  and nothing replaced it; CommonMistakes still teaches the retired `i := i` fix as a solution. Fix:
  use the working substitute set — the specification, Go Code Review Comments, the release notes, and
  Google's style guide cited as Google's position.
- **H16 — NEVER discard an error with `_`, NEVER return an in-band error value, and NEVER assert a
  type without the comma-ok form.** A discarded error is a decision no reader can audit; an in-band
  sentinel (`-1`, `""`) is a value the type system will not force a caller to check; a single-result
  assertion panics instead of returning a fault the caller can handle. Go Code Review Comments owns all
  three, and states the first categorically — "Do not discard errors using `_` variables" — which is
  why this rule is a NEVER. (Google's `decisions` page, normative but not canonical, hedges the same
  point to "not usually appropriate"; the categorical owner is the one this rule rests on.) Fix: return
  `(v, ok)` or `(v, error)`, and handle or return every error.
- **H17 — NEVER reach for `unsafe`, `cgo`, reflection, or a type parameter without a named earned
  reason.** `unsafe` forfeits the Go 1 compatibility promise by its own package documentation.
  Reflection defers to run time what the compiler was checking for you; *The Laws of Reflection* closes
  by calling it "a powerful tool that should be used with care and avoided unless strictly necessary",
  and the proverbs put it more bluntly still — "Reflection is never clear". `cgo` changes how the
  package builds: the cgo tool is enabled by default for native builds but disabled by default when
  cross-compiling, and cross-compiling with it requires you to supply a C cross-compiler — that is a
  configuration requirement, and the sharper cost framing ("Cgo is not Go") is a Go proverb, which is
  rhetoric rather than a normative source. A type parameter is earned by repeated identical code
  differing only in type, and is NOT earned by replacing an interface type. Fix: write the reason in
  the review, or write the plain version.
- **H18 — NEVER treat `go.sum` as a lockfile, and NEVER ship a `replace` or `exclude` from a library
  expecting downstream effect.** Minimal version selection has no lockfile: `go.sum` records integrity
  hashes, not the selection. `replace` and `exclude` apply to the main module only and are ignored in
  every module that consumes yours. Fix: express a requirement with `require`, and keep `replace` to
  local development in a main module.
- **H19 — NEVER state unreleased-Go behavior as current, and NEVER teach a symbol above the module's
  declared floor as if it were available there.** Go 1.27 is not yet released and its notes are a
  draft, so anything in them can still change. `errors.AsType` needs a `go 1.26.0` floor; at today's
  `go 1.25.0` floor, `errors.As` is the correct and current form, and neither is obsolete. Fix: state
  the required floor beside every version-gated symbol.

---

## Procedure

**MUST load `coding/SKILL.md` and `principles/SKILL.md` first** and keep them in context — this
Procedure **operationalizes** their disciplines for Go; it does not restate them.

Run P1–P8 in **author mode**; in **review mode**, run P1–P4 read-only to reconstruct and grade the
existing design, skip P5–P6, and grade read-only at P7–P8, editing nothing unless the user authorizes
a fix. **P2 is the router** for specialized depth; these steps plus the Rules above are the floor for
an ordinary Go change.

### P1 — Study and lock the task and the Go module contract

*Deepens principles P1 / P4 and coding P1 — study first, refine the task.*

Lock What / Why / How, in and out of scope, and success with the user, or cite a Scope Contract. Then
read `go.mod` **before** anything else: the `go` line, the `toolchain` directive, any `godebug` block,
whether a `vendor/` directory exists, and whether a `go.work` file is in play. Record the **toolchain**
version separately from the module floor — they gate different things (H1). Read the specs, design
notes, README, package documentation, project rules, applicable mistakes, neighboring packages,
callers, tests, and local prior art. Then fix the artifact type (library, command, or operator), the
current package layout, and the boundary conditions: trusted versus untrusted input, sync versus async
callers, goroutine and resource lifetimes, and the exported identifiers. **Declare author or review
mode.** For an **edit**, map the affected set — callers, tests, docs, generated code, `go.mod` — with
CRUD and 5W1H. For a **bug**, reproduce it first, then trace to the root before repairing.

**P1 is complete when** scope and success are explicit (or a Scope Contract is cited), the `go` line
and toolchain version are both recorded, the artifact type and layout are known, prior art is read,
the mode is declared, and the affected set or the reproduced root is written down.

### P2 — Load the child docs for the forks in play

*Deepens coding P1 — study the prior art the decision needs.*

Read each child **before** the decision it governs, and re-run this routing when the design changes.
An ordinary Go change needs no specialist child to be valid, but every change uses the scenario and
checklist material at P8 before handoff (an evaluator enters through `evaluation.md`).

| Read | When the change involves |
|---|---|
| `convention.md` | naming a package, file, receiver, or error string; `defer` ordering; a map or nil-map access; a build tag; doc comments; the formatter stance |
| `design.md` | a package boundary or layout choice, an interface placement, embedding, the zero value, a channels-versus-mutex decision, or a proposed type parameter |
| `errors.md` | creating, wrapping, matching, or classifying an error; a sentinel-versus-type choice; error-string form; `panic` or `recover` |
| `concurrency.md` | starting a goroutine, a channel, a `sync` primitive, `context` cancellation, `errgroup`, or any shared mutable state |
| `modules-tooling.md` | `go.mod` or `go.work`, the `go` / `toolchain` / `godebug` lines, dependency selection, vendoring, the linter configuration, `go fix`, `govulncheck`, or any version claim |
| `testing.md` | writing or reviewing tests, benchmarks, fuzz targets, parallel subtests, time-dependent tests (`testing/synctest`), or coverage |
| `performance.md` | allocation or escape behavior, slice capacity, string and `[]byte` conversion, benchmarking, profiling, or `GOMAXPROCS` |
| `interop.md` | `cgo`, `unsafe`, reflection, build constraints and cross-compilation, generated code, serialization, or a filesystem path boundary |
| `service-clients.md` | **any** call to a cloud, container, orchestration, or observability API — read its twelve hazard classes **before** acting on any tool child's delta table. This row is also the route for a service API that has no child of its own, including messaging: the twelve classes plus the owner's own documentation are then the whole answer |
| `docker.md` | the Docker Engine API from Go |
| `kubernetes.md` | client-go, apimachinery, controller-runtime, informers, CRDs, or an operator |
| `aws.md` | the AWS SDK for Go v2 |
| `observability.md` | Prometheus `client_golang` or OpenTelemetry-Go instrumentation |
| `grpc.md` | gRPC-Go or protobuf |
| `scenarios.md` / `checklists.md` | self-review before handoff (P8), or the good, bad, and adversarial probes and binary `GO-CHECK-*` items an evaluator activates |
| `evaluation.md` | grading the Go idiom of a change-set — it routes the evaluator to the scenarios, checks, and verifications (see P8) |

The Rules above stay the floor after any child loads. **P2 is complete when** every active fork is
loaded before its decision, and the pre-handoff or evaluation path includes the triad routing.

### P3 — Design the units, the package boundary, and the interfaces, decomposed

*Deepens coding P2 / P3 / P4 / P17 and principles P3 — design the contract, deep units, decompose by responsibility.*

Take these as ordered design acts, not one flat construct-pick, and take them all before any body:

1. **Fix the package boundary and the import direction.** Start flat; reach for `internal/` early
   because the compiler enforces it; add `cmd/` only for more than one binary; never `pkg/` and never
   a `util` package (H14). Keep the import graph acyclic — Go rejects an import cycle outright.
2. **Pick the unit shape, and design the zero value.** A function over plain data is often the whole
   unit; reach for a struct with methods when state and behavior must travel together. Decide what the
   type's zero value does before writing a constructor — a zero value that already works removes the
   constructor, the builder, and the initialized flag from every caller. Reach for embedding only when
   the embedded API should be permanently public (Principle 5); otherwise use a named field and
   delegate explicitly.
3. **Place the interfaces at the consumer and return concrete types** (H7). Where a compile-time check
   is worth having, assert it at the implementor with a blank variable rather than by changing the
   return type.
4. **Sketch every signature**, with `ctx context.Context` first wherever the call can block, do I/O, or
   be cancelled (H5). Decide what each function returns before deciding how it computes it.
5. **Choose the failure shape**: a sentinel value, a custom error type, or a plain formatted error —
   and, separately, whether to wrap. Wrap with `%w` only where a caller is meant to match on the
   wrapped error, because that publishes it into your API (H4).
6. **Name each goroutine's owner and stop signal, and each resource's release path.** Remember that
   `defer` runs at **function** return, not at the end of the enclosing block — Go has no scope-bound
   release — so a `defer` inside a loop accumulates until the function returns.

**P3 is complete when** the package boundary and import direction are fixed; each unit has one
responsibility and an earned shape; every interface sits at its consumer; every signature, error
shape, goroutine owner, and release path is concrete; one credible alternative is recorded for the P4
gate; and no behavior body exists.

### P4 — Confirm the design, package layout, and names with the user

*Deepens principles P3 — design with the user before building.*

Run the design-with-user gate on the Go **design packet**: the package tree and import direction, the
exported identifiers, the interface placements, the signatures with their `ctx` and error positions,
the error taxonomy (which sentinels, which types, what is wrapped), the concurrency ownership map, the
verification seams, and the P3 alternative. Record the approval, or cite an already-explicit decision.
**Author mode only:** in review mode, reconstruct the packet from the existing code and grade it
without editing.

**P4 is complete when** the author-mode packet is approved (or a prior decision is cited), or the
review-mode packet is reconstructed and graded.

### P5 — Build the compiling skeleton first

*Deepens coding P7 and principles P2 — build bottom-up, skeleton first.*

Materialize the approved design before any behavior: create the packages, the types, and the full
signatures with stub bodies. Get `go build ./...` green before growing a single body, and let a
structural defect send you back through P2–P4 rather than be absorbed into a body. A skeleton that
does not build is a design that has not been checked.

**P5 is complete when** the skeleton matches the approved packet, `go build ./...` is green, and no
behavior is implemented.

### P6 — Grow in minimal verified slices

*Deepens coding P7 / P8 / P15 — grow verified, build only what's needed, move the whole affected set.*

Grow the bodies bottom-up, one dependency-setting slice at a time. Verify each slice before starting
the next: `gofmt` → `go build ./...` → the focused `go test` for that package. Firm up each signature
as you learn. Apply the Rules floor and the active child guidance as you write, and follow the
surrounding code where it does not contradict a Rule. Update every affected caller, test, doc comment,
and generated artifact in the **same** slice. Add nothing beyond the agreed contract, and finish every
in-scope path with no placeholder.

**P6 is complete when** every in-scope path is implemented with no placeholder, each slice had fresh
focused evidence before the next began, and every affected surface moved in lockstep.

### P7 — Verify the whole change — the Go gate order

*Deepens coding P6 and principles P8 — design for verification, prove the root cause is gone.*

Prove the whole change after the per-slice checks. Run these gates in order, fixing a failure before
moving on. Each gate must **fail the chain by exit status** (`cmd || exit 1`) — which means the two
listing tools need wrapping, because they report unformatted files on stdout and still exit `0`:

1. `test -z "$(gofmt -l .)"` — the bare `gofmt -l .` exits `0` while listing offenders, so it can never
   fail a chain; the `test -z` wrapper is what turns the file list into a non-zero exit (H3).
2. `test -z "$(goimports -l .)"` — same trap, same wrapper; this one also covers the import block.
3. `go build ./...` — everything compiles, including the packages the change did not touch.
4. `go vet ./...` — the **full** analyzer set, not the 11 that `go test` runs (H2).
5. `golangci-lint run` — the configured linters.
6. `go test ./...` — behavior.
7. `go test -race ./...` — required whenever the change touches concurrency (H9).
8. `go test -run '^$' -fuzz '^FuzzName$' -fuzztime 60s ./path/to/pkg` — when a fuzz target exists.
   `-fuzz` takes a regexp that must match exactly **one** target, so name it and repeat the gate per
   target; without `-fuzztime` the run never ends, which would stall every gate below it.
9. `govulncheck ./...` — it is symbol-reachability-based and is not integrated into `go` or `go vet`,
   so it only runs when you run it.
10. `GOOS=… GOARCH=… go build ./...` — when the change ships for another platform.

Optional, and gated on the **installed toolchain** being 1.26 or newer rather than on the module
floor: `go fix ./...`, which is now the home of the modernizers.

**This order is a recommendation with a stated rationale, not a sequence Go mandates.** Each gate is
verified at its own owner; the ordering is this skill's inference: build before vet, because vet needs
a type-checkable package; vet before lint, because correctness beats noise; plain test before race,
because a plain failure is far cheaper to diagnose. For a bug, re-run the original P1 reproducer last.

**P7 is complete when** every applicable gate exits clean on fresh output and the reproducer no longer
fires. A skipped gate is recorded with its reason, not left silent.

### P8 — Review: trace to the approved design and affected set

*Deepens principles P9 and coding P15 — CRUD and 5W1H, change with blast-radius awareness.*

Review on two independent axes, then trace. Grade the language-agnostic **property** with
`../coding/evaluation.md` and the Go **idiom** with `evaluation.md`. For a pre-handoff check, read
`scenarios.md` for the task-relevant good, bad, and adversarial probes, then answer the activated
binary `GO-CHECK-*` items in `checklists.md`; a failed item returns to its owning step. An evaluator
enters through `evaluation.md`, which loads both siblings. Then run **traceability** in both
directions: every approved design item (P4) maps to an implemented package, type, name, error shape,
and test seam; every scope item maps to a diff line and nothing exceeds it; every affected-set file
(P1) is updated or is a justified no-op; every success criterion has fresh evidence; and no caller,
test, doc comment, or generated file is stale.

**P8 is complete when** both reviews pass, all activated binary checks pass, the code traces to the
approved design, names, scope, and affected set with no stale dependent, and every success criterion
has fresh evidence.

---

## References

One owner per borrowed fact; the body states the fact and this register names its owner. Every entry
was read on **2026-07-25**. Go facts rot: re-verify before treating any of them as current, pin a tag
when reading a source file, and never take an HTTP 200 from a default branch as a currency guarantee.
Before adding an entry here, confirm the named page actually contains the claim — a plausible owner is
the failure mode this register exists to prevent, and it passes every mechanical check.

- [`coding/SKILL.md`](../coding/SKILL.md) — owns the language-agnostic properties of good software that
  this skill specializes into concrete Go idioms.
- [`principles/SKILL.md`](../principles/SKILL.md) — owns the ten gobbi behavioral principles that this
  skill's Procedure operationalizes for Go.
- [The Go Programming Language Specification](https://go.dev/ref/spec) — interface satisfaction by
  method set, the structural property behind Principle 4 and H7 (`#Interface_types`); embedded fields
  and method promotion, the mechanism behind Principle 5 (`#Struct_types`); the loop-variable semantics
  and the assignment-form limit (H12); `defer`'s accumulation to function return (P3); slice capacity
  and `append` aliasing; and — at `#Representation_of_values` and `#Assignment_statements` — that a map
  value is a reference to the implementation-specific data structure, with the aliasing example quoted
  under H8. The specification does not use the term "reference type"; neither does this skill. The
  rendered page tracks tip, so H8's quotation was read against the pinned `go1.26.5` tag.
- [Go Modules Reference](https://go.dev/ref/mod) — minimal version selection, `go.sum` as integrity
  rather than selection, and `replace` / `exclude` as main-module-only (H18).
- [The Go Memory Model](https://go.dev/ref/mem) — data-race-free sequential consistency; that any
  implementation may report a detected data race and halt execution (the no-benign-race half of
  Principle 6); and, at § Implementation Restrictions, the bounded-outcome position that Principle 6
  now states — Go is "more like Java or JavaScript, in that most races have a limited number of
  outcomes, and less like C and C++, where the meaning of any program with a race is entirely
  undefined". This page says nothing about the race detector; do not cite it for one.
- [Data Race Detector](https://go.dev/doc/articles/race_detector) — the detector's owner. § Runtime
  Overhead gives the cost H9 quotes ("memory usage may increase by 5-10x and execution time by 2-20x"),
  and the same page owns the coverage limit: it "only finds races that happen at runtime, so it can't
  find races in code paths that are not executed".
- [Go 1.26 release notes](https://go.dev/doc/go1.26) — the `go mod init` default quoted in H1, and
  `go fix` as the modernizer home (P7). The resulting floor numeral depends on the toolchain that runs
  `go mod init`, so H1 states the rule rather than pinning the number.
- [Go 1.22 release notes](https://go.dev/doc/go1.22) — per-iteration loop variables (H12).
- [Go 1.27 release notes (draft)](https://go.dev/doc/go1.27) — unreleased; the owner for H19's
  do-not-teach-it-as-current rule.
- [GODEBUG history](https://go.dev/doc/godebug) and [Go 1 and the Future of Go
  Programs](https://go.dev/doc/go1compat) — GODEBUG defaults selected by the `go` line (H1) and the
  source-only scope of the compatibility promise (H17).
- [Go module layout](https://go.dev/doc/modules/layout) — the official layout, which never mentions
  `pkg/`, and compiler-enforced `internal/` (H14).
- [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments) — interface placement and the
  do-not-define-for-mocking position (H7); `ctx` as the first parameter, with **one** stated exception
  (H5); § Goroutine Lifetimes, which asks that a spawned goroutine's exit be made clear (H6); comma-ok
  assertions, in-band errors, and the categorical "Do not discard errors using `_` variables" (H16);
  and error-string form (H4).
- [Contexts and structs](https://go.dev/blog/context-and-structs) — the `http.Request` retrofit, which
  is H5's second exception and is not in Code Review Comments.
- [Effective Go](https://go.dev/doc/effective_go) — cited only as the owner of its own
  not-current notice (H15).
- [`go help test`](https://pkg.go.dev/cmd/go#hdr-Testing_flags) and
  [`cmd/vet`](https://pkg.go.dev/cmd/vet) — the "high-confidence subset" framing and the analyzer set
  behind H2. The count of 11 comes from the go command's `defaultVetFlags` at go1.26.5, which is what
  the command executes; the adjacent doc prose still lists ten.
- [Go FAQ](https://go.dev/doc/faq) — an interface value is nil only when both type and value are unset
  (H11).
- [Errors are values / Go 1.13 errors](https://go.dev/blog/go1.13-errors) — `%w` as a commitment to
  supporting that error as part of your API (Principle 2, H4).
- [Go Concurrency Patterns: Pipelines and cancellation](https://go.dev/blog/pipelines) — goroutines are
  not garbage collected and must exit on their own (Principle 3, H6). H6's third part — a way for the
  caller to block and wait — is this skill's addition, carried by neither this page nor Code Review
  Comments.
- [Go Slices: usage and internals](https://go.dev/blog/slices-intro) — slice internals, and the
  retention gotcha behind H8: a sub-slice keeps the whole backing array alive, and the answer is to
  copy what you keep.
- [The Laws of Reflection](https://go.dev/blog/laws-of-reflection) — Rob Pike, 2011-09-06. Closes by
  calling reflection "a powerful tool that should be used with care and avoided unless strictly
  necessary" (H17).
- [When To Use Generics](https://go.dev/blog/when-generics) — a type parameter is earned by repeated
  identical code, and is not earned by replacing an interface type (H17).
- [`golang-standards/project-layout` issue #117](https://github.com/golang-standards/project-layout/issues/117)
  — Russ Cox's repudiation of `pkg/` in the community repository that popularized it (H14).
- [Package names](https://go.dev/blog/package-names) — short lowercase names, and `util` / `common` /
  `misc` as names to avoid (H14).
- [`context`](https://pkg.go.dev/context), [`sync`](https://pkg.go.dev/sync),
  [`slices`](https://pkg.go.dev/slices), and [`unsafe`](https://pkg.go.dev/unsafe) — the "typically
  named ctx" wording H5 records as an upgrade; the per-type must-not-copy-after-first-use rule (H13,
  whose pointer-receiver consequence is this skill's, not the package's); `Clone`'s shallow copy and
  `Clip`'s removal of unused capacity (H8); and `unsafe` forfeiting the Go 1 promise (H17).
- [`cmd/cgo`](https://pkg.go.dev/cmd/cgo) — cgo is enabled by default for native builds, disabled by
  default when cross-compiling, and requires a C cross-compiler to cross-compile with (H17). It
  documents mechanics only and makes no claim about portability cost.
- [`cmd/gofmt`](https://pkg.go.dev/cmd/gofmt) — the formatter's mechanics. It does NOT state that Go
  code must be gofmt-formatted; H3's mandate is Google's, below.
- [Go Style Guide](https://google.github.io/styleguide/go/guide) — **Google's position, and normative
  and canonical for Google only.** Owns H3's formatting mandate.
  [Go Style Decisions](https://google.github.io/styleguide/go/decisions) is normative but **not**
  canonical and subordinate to the guide; it carries the hedged "not usually appropriate to discard
  errors using `_` variables", which H16 cites only as corroboration — the categorical form it rests on
  is Code Review Comments'.
  [Go Best Practices](https://google.github.io/styleguide/go/best-practices) is **neither normative nor
  canonical**; it owns H4's handle-once and do-not-log-and-return guidance, which is why H4 marks that
  clause as the weakest tier. Cite the page that carries the sentence, at its own strength.
- [Go Proverbs](https://go-proverbs.github.io/) — attributed by the site as "Proverbs from
  @robpike.io's inspiring talk at Gopherfest SV 2015". Owns "Make the zero value useful"
  (Principle 5), "Don't communicate by sharing memory, share memory by communicating" (Principle 6),
  "Clear is better than clever" (Principle 8), "Reflection is never clear" and "Cgo is not Go" (H17).
  These are the language's stated values expressed as rhetoric, **not** normative sources — nothing
  here is a MUST on their authority. The site says the list may be updated when the talk is next
  given, so it is mutable and community-maintained rather than a frozen 2015 artifact: date every
  citation of it (read 2026-07-25).
- [`strings.Builder`](https://pkg.go.dev/strings#Builder) — "The zero value is ready to use", the
  standard-library illustration of the useful zero value in Principle 5.
- [Uber Go Style Guide](https://github.com/uber-go/guide/blob/master/style.md) — a derivative,
  non-Go-team source, cited by section and never as a mandate: it calls embedding in exported structs
  rarely necessary, which corroborates Principle 5's second half without owning it.
- [`govulncheck`](https://go.dev/security/vuln/) — symbol-level reachability, and not integrated into
  `go` or `go vet` (P7 gate 9).
