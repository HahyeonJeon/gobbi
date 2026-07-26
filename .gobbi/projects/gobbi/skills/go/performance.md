# Go — Performance

**Ownership** — the profiling surface and the measure-first discipline; allocation and escape thinking;
slice capacity and preallocation; `strings.Builder`; `sync.Pool`; and **container-aware `GOMAXPROCS`,
which this file owns alone.**

**Split criterion** — `skill-writing` P4 (b): a long lookup reference. A reader opens it at the moment
a cost question comes up — which profile, which capacity, which pool — and leaves with one answer.

**Deepens, does not restate** — [`SKILL.md`](SKILL.md) Principle 7 (*treat a slice or map value as a
reference to shared underlying data — copy at the boundary you do not own*) and Rules **H8** (copy at a
slice or map boundary you do not own), **H13** (never copy a `sync` type after first use — `Pool` is on
its list), and **H10** (cite the primary owner and a verification date for every version, symbol, and
example). It is the P2 router destination for *allocation or escape behavior, slice capacity, string
and `[]byte` conversion, benchmarking, profiling, or `GOMAXPROCS`*. `SKILL.md` states the rules; this
file states the cost model behind them and the evidence discipline that goes with it.

**Benchmark construction lives in [`testing.md`](testing.md) §5** — `b.Loop()`, the timer, and the
`b.N` hazard. This file owns what to do with the measurement, not how to write it.

Every version number below resolves to the Version Currency Register in
[`modules-tooling.md`](modules-tooling.md) §9.

## Contents

1. [Measure first: the profiling surface](#1-measure-first-the-profiling-surface)
2. [Allocation and escape](#2-allocation-and-escape)
3. [Slice capacity and preallocation](#3-slice-capacity-and-preallocation)
4. [`strings.Builder`](#4-stringsbuilder)
5. [`sync.Pool`](#5-syncpool)
6. [Container-aware `GOMAXPROCS`](#6-container-aware-gomaxprocs)

## 1. Measure first: the profiling surface

**Two owners, and they are not interchangeable.**

- **`pkg.go.dev/runtime/pprof` is the API owner, not the teaching owner.** Its package documentation is
  one sentence plus the profile registry and a `go test -cpuprofile` recipe, and it then points onward
  to the `google/pprof` tool's own README. Cite it for **API surface only** — which symbols exist and
  what they are called. *(Read 2026-07-25.)*
- **`https://go.dev/doc/diagnostics` is the teaching owner.** It describes itself as a summary of the
  tool suite, and it owns the per-profile semantics: what each profile records, and how to turn the
  ones that are off by default on. *(Read 2026-07-25.)*

**The operational fact worth the read: `block` and `mutex` are not enabled by default.** They are
switched on with `runtime.SetBlockProfileRate` and `runtime.SetMutexProfileFraction`. Until you call
one, the corresponding profile is empty — and an empty block profile reads exactly like "no
contention" when it means "not measured". *(Owner: `go.dev/doc/diagnostics`, read 2026-07-25.)*

**The two profile lists disagree, so neither is a complete index.** `runtime/pprof`'s registry carries
`allocs` and a `goroutineleak` profile that the diagnostics page does not list; the diagnostics page
lists `cpu`, which goes through `StartCPUProfile` rather than through the `Profile` registry, and omits
`allocs`. Read the page for the toolchain you are on rather than reciting a list from either.

**Unverified:** which Go release introduced the `goroutineleak` profile. It is present in the
`runtime/pprof` registry as read on 2026-07-25 and absent from the diagnostics page, and no
introduction version was found. **Do not teach it, and do not gate it on a guessed version** — the
release notes for the release that added it would resolve this, and until then the honest statement is
that it exists in the registry and its floor is unknown (H19).

**The discipline the whole file rests on.** `coding` P14 owns the language-agnostic property; the Go
delta is that the tooling makes the excuse unavailable. A profile is one command away, so an
optimization without a before-and-after measurement is a guess with a diff attached. Two rules follow,
and both are cheap:

- **Profile before you change anything.** The bottleneck is routinely not where the reading of the code
  suggests, which is the entire reason the profilers exist.
- **A benchmark that shows no change is a result, not a failed attempt.** It is the evidence that
  removes the change: an "optimization" with no measured effect is a permanent cost to every future
  reader for a benefit nobody demonstrated.

## 2. Allocation and escape

**Unverified — the whole mechanism half of this topic.** Whether a value lives on the stack or the heap
is decided by the compiler's escape analysis, and this pass fetched no owner for any of it: not the
`-gcflags=-m` flag that prints the decision, and not the FAQ entry on stack-versus-heap placement.
`pkg.go.dev/cmd/compile` for the flag and `go.dev/doc/faq` § *stack or heap* would resolve both. No
escape rule is stated here, because a plausible-sounding escape rule written from memory is exactly
what H10 exists to stop.

What survives without a citation is the discipline rather than the mechanism, and it is the useful
half anyway: **the placement is not visible in a signature.** Two functions with identical signatures
can differ, the same function can differ between compiler releases, and no reviewer can read it off the
page. So every allocation claim — in a review comment, in a code comment, or in this skill — is a
**measurement** (§1) or it is nothing. "This escapes to the heap" is a profile result, never an
observation.

## 3. Slice capacity and preallocation

A slice value is a pointer into a backing array plus a length and a capacity. Everything below follows
from the array being shared while the slice header is copied.

**The sourced half — this is correctness, not speed:**

- **Whether `append` writes into the caller's array is capacity-dependent, and invisible at the call
  site.** If the slice has spare capacity, `append` writes into the existing array and any other slice
  over that array sees the write. If it does not, `append` allocates and the two stop aliasing. Nothing
  in the signature tells a reader which happened (H8).
- **A small returned sub-slice keeps the whole backing array alive.** *Go Slices: usage and internals*
  names this retention gotcha and answers it with a copy: if you keep a few elements out of a large
  slice, copy them out rather than re-slicing. *(Owner: `go.dev/blog/slices-intro`, read 2026-07-25.)*
- **`slices.Clone` copies one level only.** A cloned `[]*T` gives you a new slice over the same
  pointers. *(Owner: `pkg.go.dev/slices`, read 2026-07-25.)*
- **`slices.Clip` removes unused capacity**, and the three-index form `a[low:high:max]` sets the
  capacity explicitly. Either one turns "the callee might write into my array" into "the callee cannot"
  — the next `append` is forced to allocate. *(Owner: `pkg.go.dev/slices`, read 2026-07-25.)*

The rule these serve is H8's: **copy at a boundary you do not own**, and say in the doc comment whether
a returned slice is shared or owned.

**Unverified — the performance half.** `make([]T, 0, n)` as the remedy for repeated `append` growth is
not stated by any owner read in this pass, and neither is `append`'s growth behavior itself.
`go.dev/ref/spec` § *Appending to and copying slices* and `pkg.go.dev/builtin` § `append` would resolve
it. Until then, treat preallocation as a change to be measured (§1) rather than as a rule.

**Keep the two reasons apart, because only one of them needs a benchmark.** Setting a capacity for
**aliasing control** is a correctness decision, sourced above, and it holds whether or not it is
faster. Setting a capacity for **speed** is a performance claim and needs a number. A change that
claims both and measures neither has made the correctness argument unfalsifiable.

## 4. `strings.Builder`

**The package's complete documentation is four sentences, and this is all of them:**

> "A Builder is used to efficiently build a string using Builder.Write methods. It minimizes memory
> copying. The zero value is ready to use. Do not copy a non-zero Builder."
>
> *(Verbatim from `pkg.go.dev/strings#Builder`, verified 2026-07-25.)*

Three things follow directly, and none of them needs anything added:

- **The zero value is ready to use** — no constructor, no initialization. `SKILL.md` Principle 5 already
  uses this as the standard library's illustration of a useful zero value.
- **Do not copy a non-zero Builder.** This is the package's own rule, stated for `Builder` alone. It is
  not H13 — H13 governs the `sync` types — but the failure is the same shape: a copy carries state that
  no longer matches the original.
- **It minimizes memory copying.** That is the mechanism the owner claims, and it is the extent of it.

**The prefer-`Builder`-over-`+=` advice is this skill's own claim, not the package's.** The
documentation gives **no** rationale for replacing string concatenation in a loop, states nothing about
`+=` being quadratic, and does not mention `+` at all. So this skill says, on its own authority: in a
loop that builds one string from many pieces, use a `Builder`; outside a loop, `+` and `fmt.Sprintf`
are clearer and the difference is not worth a name. Anyone who wants the cost argument itself must
measure it (§1) — that is the honest position when the mechanism is sourced and the causal advice is
not.

**Unverified:** the cost of converting between `string` and `[]byte`, which the P2 router also sends
here. Whether a conversion copies, and when the compiler elides the copy, was not fetched in this pass;
`go.dev/ref/spec` § *Conversions* at the pinned tag would resolve the language half. The topic is named
rather than silently dropped so that the router does not point at an answer this file never gives.

## 5. `sync.Pool`

A `Pool` caches allocated objects for reuse. It has one clause worth teaching above all others, because
it names the case people reach for it in:

> "a free list maintained as part of a short-lived object is not a suitable use for a Pool, since the
> overhead does not amortize well… A Pool must not be copied after first use."
>
> *(Verbatim from `pkg.go.dev/sync#Pool`, verified 2026-07-25.)*

Read both halves:

- **Not suitable for a short-lived object's free list.** The pool machinery has its own overhead, and a
  cache that lives briefly never earns it back. A `Pool` is for objects reused across many operations
  over a long-lived process — the parse buffer a server reuses on every request, not the scratch slice
  a function keeps for its own duration.
- **Never copy it after first use.** H13 already forbids this for every `sync` type and names `Pool`
  explicitly; the consequence H13 draws applies unchanged — a struct holding one uses pointer receivers
  throughout, and `go vet copylocks` checks it, which `go test` does not run (H2).

**The house position, which is §1's rule and not a new one:** a `Pool` is earned by a measured
allocation cost, never assumed. It adds a lifetime question to every object that passes through it —
what state a reused object carries, and who resets it — and that cost is paid whether or not the
allocation was ever the bottleneck.

**Unverified:** the rest of `Pool`'s contract — when the runtime may drop pooled items, and the role of
the `New` field. Neither was transcribed in this pass; `pkg.go.dev/sync#Pool` would resolve both. Do
not assume an item put into a `Pool` is still there.

## 6. Container-aware `GOMAXPROCS`

**This file owns container-aware `GOMAXPROCS` alone.** When `concurrency.md` is written it points here
rather than restating it, and the `automaxprocs`-is-obsolete row stays in
[`modules-tooling.md`](modules-tooling.md) §10 — both are forward obligations on the authors of those
files, not descriptions of files that exist today.

**Since Go 1.25 the runtime is container-aware on Linux**, so the third-party `automaxprocs` cgroup
shim is no longer needed there. That shim existed because the runtime did not read the container's CPU
limit; a Go process under a quota sized `GOMAXPROCS` from the host's CPU count instead. The obsolete
row is [`modules-tooling.md`](modules-tooling.md) §10, and the version resolves to §9 of the same file
— 1.25 is **exactly the current `go 1.25.0` floor**, so it is available at the floor and absent below
it (H19).

The practical check for an existing service: an `automaxprocs` import in a module at the 1.25 floor is
now dead weight, and removing it is a dependency change like any other — one that
[`modules-tooling.md`](modules-tooling.md) §10 already sanctions.

**Unverified:** the mechanism's details — which cgroup limit the runtime reads, whether it re-reads the
limit while the process runs, and the behavior on non-Linux platforms. `go.dev/doc/go1.25` § *runtime*
would resolve all three, and it is the same owner the register row already names. Until then, state the
availability fact above and measure the resulting `GOMAXPROCS` in the target environment rather than
predicting it.
