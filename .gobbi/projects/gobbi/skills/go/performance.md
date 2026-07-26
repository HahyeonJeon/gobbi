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

**The two profile lists disagree, so neither is a complete index.** `runtime/pprof` names seven —
`goroutine`, `goroutineleak`, `allocs`, `heap`, `threadcreate`, `block`, `mutex` — and says of the
missing one: *"The CPU profile is not available as a Profile. It has a special API, the
StartCPUProfile and StopCPUProfile functions, because it streams output to a writer during
profiling."* The diagnostics page names six — `cpu`, `heap`,
`threadcreate`, `goroutine`, `block`, `mutex` — with **no `allocs` and no `goroutineleak`**. *(Both
read 2026-07-26.)* Read the page for the toolchain you are on rather than reciting a list from either.

**`goroutineleak` is a Go 1.26 experiment, and it is off unless you build for it:**

> "A new profile type that reports leaked goroutines is now available as an experiment… named
> `goroutineleak` in the `runtime/pprof` package, may be enabled by setting
> `GOEXPERIMENT=goroutineleakprofile` at build time."
>
> *(Verbatim from `go.dev/doc/go1.26` § runtime, verified 2026-07-26. The same notes add a stated aim
> for the next release — which is **not yet released**, and whose notes are a **draft** that can still
> change, so read it as an aim and not as a fact: "We aim to enable goroutine leak profiles by default
> in Go 1.27." The versions resolve to [`modules-tooling.md`](modules-tooling.md) §9, and 1.26 is
> **above** the `go 1.25.0` floor — H19.)*

> **The trap is that the package documentation says none of that.** `runtime/pprof`'s own doc lists
> `goroutineleak` **unconditionally**, while the code registers it only under
> `if goexperiment.GoroutineLeakProfile`. So `pkg.go.dev` advertises a profile that a stock build never
> puts in the registry. *(Both read at `go1.26.5`, 2026-07-26.)* Never infer availability from a
> rendered package page — the general form of that rule is
> [`modules-tooling.md`](modules-tooling.md) §8.

**`net/http/pprof` exposes the profiles over HTTP, and what it documents is only the wiring:**

> "The package is typically only imported for the side effect of registering its HTTP handlers. The
> handled paths all begin with /debug/pprof/. As of Go 1.22, all the paths must be requested with GET."
>
> *(Verbatim from `pkg.go.dev/net/http/pprof`, verified 2026-07-26. It also states: "If you are not
> using DefaultServeMux, you will have to register handlers with the mux you are using.")*

> **The exposure risk is this skill's own operational judgment, and is marked as such deliberately.**
> The package documentation contains **no security warning of any kind** — a grep of
> `src/net/http/pprof/pprof.go` @ `go1.26.5` for `public`, `internet`, `security`, `untrusted`,
> `expose`, and `sensitive` matches only an unrelated internal comment *(2026-07-26)*. An earlier fetch
> of the rendered page returned a confident "Security Warning" that **does not exist in the source**;
> it must not be reintroduced. The judgment still stands on its own terms — a blank-import in `main`
> puts profiling endpoints on whatever mux the process already serves, so bind them to an internal
> listener or put them behind authentication — but state it as a house rule, never as the package's.

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

**Whether a value lives on the stack or the heap is decided by the compiler's escape analysis, and you
ask the compiler rather than reason about it.** The owner is the GC guide, and the invocation it gives
is not the bare `-m`:

> `$ go build -gcflags=-m=3 [package]`
>
> *(Verbatim from `go.dev/doc/gc-guide` § Escape analysis, verified 2026-07-26.)*

**Cite that page and not the two that get cited instead.** `pkg.go.dev/cmd/compile` documents `-m` only
as *"Print optimization decisions"* and never uses the phrase "escape analysis", so it cannot carry the
claim; and `go.dev/doc/faq`'s stack-versus-heap entry leads with *"From a correctness standpoint, you
don't need to know"* — which is guidance not to reason about placement, not a description of how it
works. *(Both read 2026-07-26.)*

**No escape rule is stated here, and that is the point of the flag.** "A pointer returned from a
function escapes" and its relatives are compiler behavior, not language rules: **the placement is not
visible in a signature.** Two functions with identical signatures can differ, the same function can
differ between compiler releases, and no reviewer can read it off the page. So every allocation claim —
in a review comment, in a code comment, or in this skill — is either `-gcflags=-m=3` output or a
**measurement** (§1). "This escapes to the heap" is a tool result, never an observation.

**Struct field order changes a struct's size, and this file states that as its own claim.** The
specification guarantees *minimum* alignment only, and `unsafe.Sizeof`'s documentation goes no further
than admitting *"the size includes any padding introduced by field alignment"*. **No Go-team document
read for this skill recommends ordering fields large-to-small** — a negative from two passes rather than
a proven absence, which is exactly why the advice must not be presented as documented practice or
attributed to the specification. *(Both pages read at `go1.26.5`, 2026-07-26.)*

What is real is that the size is **measurable**: `unsafe.Sizeof(v)` before and after gives the actual
number for your toolchain and target instead of a rule of thumb. Two limits on that. H17 is not
softened by it — a one-off `unsafe.Sizeof` in a test or a scratch program is the named earned reason,
and it licenses nothing else from `unsafe` in the code under measurement. And a smaller struct is a
performance claim like any other here: measured, or not made.

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

**The performance half — the mechanism is sourced, the advice is this skill's own.** The specification
states what `append` does when it runs out of room:

> "If the capacity of `s` is not large enough… `append` allocates a new, sufficiently large underlying
> array."
>
> *(Verbatim from the specification § Appending to and copying slices, `doc/go_spec.html` @ `go1.26.5`,
> verified 2026-07-26.)*

**"Preallocate when you know the size" is not stated by any owner**, and this skill does not attribute
it to one. `go.dev/blog/slices-intro` says only that you *can* control growth; it prescribes nothing.
If you want a symbol whose own documentation carries the intent, it is not `make` — it is
`slices.Grow`:

> "Grow increases the slice's capacity, if necessary, to guarantee space for another n elements."
>
> *(Verbatim from `pkg.go.dev/slices#Grow`, verified 2026-07-26. `slices` resolves to
> [`modules-tooling.md`](modules-tooling.md) §9 at Go 1.21, below the floor.)*

So: `slices.Grow` when you are growing an existing slice and can name `n`, `make([]T, 0, n)` when you
are building a new one. Both are cheap and neither needs defending. What needs defending is the
*claim* that either one made the code faster — that is a number (§1), not a rule.

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

**Converting between `string` and `[]byte`** is the other topic the P2 router sends here, and the
honest answer is that **no Go-team document states a cost for it.** The specification § *Conversions*
was read in full at `go1.26.5` on 2026-07-26: it specifies **semantics only**, and the word "copy" does
not appear in the conversion rules at all. It leaves room in the other direction as well —
*"The capacity of the resulting slice is implementation-specific and may be larger than the slice
length."* `strings` documents nothing on the subject either.

**So this file states it as its own claim, with the tier attached.** A conversion is a distinct value
of a distinct type, so treat it as one you pay for, and keep conversions out of hot loops by choosing
one representation for the path. The familiar list of cases the compiler is said to optimize —
`m[string(b)]`, `for range []byte(s)`, `string(a) == string(b)` — comes from
`go.dev/wiki/CompilerOptimizations`, a **community wiki page, not a Go-team document** *(read
2026-07-26)*. Cite it as that if you cite it, never as the specification, and never as a guarantee: an
optimization the language does not promise can be absent in the next release, on the next architecture,
or in a build with different flags. If the conversion cost matters to a decision, measure it (§1).

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

**One more clause is sourced, and it is the one that makes a `Pool` safe to hand between goroutines:**

> "a call to Put(x) 'synchronizes before' a call to Pool.Get returning that same value x."
>
> *(Verbatim from `pkg.go.dev/sync#Pool`, verified 2026-07-26.)*

That is a memory-model guarantee in the memory model's own vocabulary: whatever the putting goroutine
wrote to `x` before `Put` is visible to the goroutine that later `Get`s it. It covers the handoff and
nothing else — it says nothing about the object's *contents* being reset, which is still your job.

**Unverified:** two parts of `Pool`'s contract remain untranscribed after two passes — **when the
runtime may drop pooled items**, and **the role of the `New` field** (whether `Get` can return nil when
`New` is unset). **What would resolve it:** `pkg.go.dev/sync#Pool`, read in full rather than for the
two clauses quoted here; both sentences are on that one page, so this is an unread gap and not an
unsourceable one. Until then, do not assume an item put into a `Pool` is still there.

## 6. Container-aware `GOMAXPROCS`

**This file owns container-aware `GOMAXPROCS` alone.** [`concurrency.md`](concurrency.md) §9 points
here rather than restating it, and the `automaxprocs`-is-obsolete row lives in
[`modules-tooling.md`](modules-tooling.md) §10 with its floor qualifier.

**Since Go 1.25 the runtime is container-aware on Linux**, so the third-party `automaxprocs` cgroup
shim is no longer needed there. That shim existed because the runtime did not read the container's CPU
limit; a Go process under a quota sized `GOMAXPROCS` from the host's CPU count instead. The obsolete
row is [`modules-tooling.md`](modules-tooling.md) §10, and the version resolves to §9 of the same file
— 1.25 is **exactly the current `go 1.25.0` floor**, so it is available at the floor and absent below
it (H19).

The practical check for an existing service: an `automaxprocs` import in a module at the 1.25 floor is
now dead weight, and removing it is a dependency change like any other — one that
[`modules-tooling.md`](modules-tooling.md) §10 already sanctions.

**Which limit it reads, and the one that it does not.** The 1.25 release notes are the owner:

> "On Linux, the runtime considers the CPU bandwidth limit of the cgroup containing the process… In
> container runtime systems like Kubernetes, cgroup CPU bandwidth limits generally correspond to the
> 'CPU limit' option. **The Go runtime does not consider the 'CPU requests' option.**"
>
> "On all OSes, the runtime periodically updates `GOMAXPROCS` if the number of logical CPUs available
> or the cgroup CPU bandwidth limit change."
>
> *(Both verbatim from `go.dev/doc/go1.25` § runtime, verified 2026-07-26.)*

Read the emphasized sentence against how Kubernetes manifests are actually written. A pod with a CPU
*request* and no *limit* gets no container-aware sizing at all — the runtime falls back to the logical
CPU count of the node, which is the same over-sizing the now-obsolete `automaxprocs` shim existed to
fix. Setting a
request is not setting a limit.

Two more mechanics from the same notes. The behavior is **disabled** by setting `GOMAXPROCS` manually,
or with the `containermaxprocs=0` and `updatemaxprocs=0` settings the notes name; and
`runtime.SetDefaultGOMAXPROCS` restores the default sizing after a manual set. Re-reading is periodic,
not one-shot — the second quotation is the whole of what 1.25 promises about timing.

> **Do not attribute the CPU-affinity clause to 1.25.** The current `runtime#GOMAXPROCS`
> documentation at `go1.26.5` adds that the runtime also considers the process's CPU affinity mask,
> never sets `GOMAXPROCS` below 2 unless the CPU or affinity count is itself below 2, rounds a
> fractional cgroup limit **up**, and updates at most **once per second**. **None of that is in the
> 1.25 release notes** *(both read 2026-07-26)*. Cite the runtime documentation at the toolchain you
> build with for those four, and the 1.25 notes only for the two quotations above.

The standing advice is unchanged by any of this: measure the resulting `GOMAXPROCS` in the target
environment rather than predicting it.
