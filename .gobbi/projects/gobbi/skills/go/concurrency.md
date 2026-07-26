# Go — Concurrency

**Ownership** — goroutine ownership and lifetime; `context` propagation, cancellation, and the two
documented exceptions to keeping it out of a struct; **the channels-versus-mutex decision, which this
file owns alone**; the `sync` primitives and how they are misused; the memory model and what a data race
actually costs in Go; `-race` as a gate; `errgroup`; and ordered shutdown.

**Split criterion** — `skill-writing` P4 (b) + (d): a long lookup reference for the primitives, plus one
self-contained sub-procedure — ordered shutdown (§8) — that a reader loads on its own while wiring a
single service down.

**Deepens, does not restate** — [`SKILL.md`](SKILL.md) Principle 3 (*own every goroutine's termination;
carry cancellation on a `Context`*) and Principle 6 (*share by communicating; where you share memory,
state the synchronization and prove it with `-race`*), and Rules **H5** (`ctx` first, named `ctx`, never
stored in a struct), **H6** (every goroutine gets a stop time or a stop signal, plus a way for the caller
to wait), **H9** (run `go test -race` for concurrent change, and state the synchronization decision),
**H12**'s capture clause, and **H13** (never copy a `sync` type after first use). It is the P2 router
destination for *starting a goroutine, a channel, a `sync` primitive, `context` cancellation, `errgroup`,
or any shared mutable state*. `SKILL.md` states the rules; this file states the mechanism and the
decision, and **§9 names every topic routed nearby that it does not own**.

Every version token below resolves to the Version Currency Register in
[`modules-tooling.md`](modules-tooling.md) §9. The module floor assumed throughout is **`go 1.25.0`** —
read your own `go.mod` before applying any version-gated line here.

## Contents

1. [Goroutine ownership and lifetime](#1-goroutine-ownership-and-lifetime)
2. [`context`: one call's deadline, not an object's](#2-context-one-calls-deadline-not-an-objects)
3. [Channels or mutexes](#3-channels-or-mutexes)
4. [`sync`: what its own documentation forbids](#4-sync-what-its-own-documentation-forbids)
5. [The memory model](#5-the-memory-model)
6. [`-race`: what the gate proves, and what it cannot](#6--race-what-the-gate-proves-and-what-it-cannot)
7. [`errgroup`](#7-errgroup)
8. [Ordered shutdown](#8-ordered-shutdown)
9. [What this file points at](#9-what-this-file-points-at)

## 1. Goroutine ownership and lifetime

Starting concurrency is one keyword. Stopping it is entirely manual, and nothing in the toolchain will
tell you that you did not.

**The closest owner for the rule is Go Code Review Comments § Goroutine Lifetimes**, and it states both
the obligation and the fallback:

> "When you spawn goroutines, make it clear when - or whether - they exit... the garbage collector will
> not terminate a goroutine even if the channels it is blocked on are unreachable... If that just isn't
> feasible, document when and why the goroutines exit."
>
> *(Verbatim from `go.dev/wiki/CodeReviewComments`, read 2026-07-25.)*

**The blog states the underlying fact in one sentence:**

> "Goroutines are not garbage collected; they must exit on their own."
>
> *(Verbatim from `go.dev/blog/pipelines`, **2014-03-13**, read 2026-07-25.)*

Read the two together. A goroutine ends by returning, and by nothing else: unreachability is not enough,
and the collector will not step in. So a goroutine blocked forever on a channel nobody will touch is
retained forever, along with everything it holds a reference to — a leak with no error, no panic, and no
failing test.

**H6's obligation has three parts, and only the first two are the owners':**

1. **A named owner at the `go` statement** — the function or type responsible for this goroutine.
2. **A stop time or a stop signal** — it returns on its own, or a `Context`, a closed channel, or a
   closed input channel tells it to.
3. **A way for the caller to block and wait** — a `WaitGroup`, an `errgroup` (§7), or a done channel.
   **This third part is this skill's addition**, carried by neither page above; the parent records it as
   such and this file does not upgrade it.

**Two failure shapes to look for at review**, both of which read as correct code. **A receiver whose
producer never closes:** `for v := range ch` ends only when `ch` is closed, so a sending side that
returns early on an error and forgets to close parks every receiver permanently. **A sender with no
receiver left:** a goroutine sending to an unbuffered channel blocks until someone receives, and if the
caller already returned — a timeout fired, a sibling errored first — nobody ever will.

**One capture rule applies at the `go` statement itself.** Use the `:=` declaration form for anything a
goroutine closes over: loop variables are per-iteration only in the form the loop *declares* (H12).
[`testing.md`](testing.md) §1 covers the same rule for parallel subtests.

## 2. `context`: one call's deadline, not an object's

**A `Context` carries a deadline and a cancellation signal that belong to one call**, not to an object's
lifetime. Everything in H5 follows from that sentence, and the package states the rule:

> "Do not store Contexts inside a struct type; instead, pass a Context explicitly to each function that
> needs it."
>
> *(Verbatim from `pkg.go.dev/context`, read 2026-07-25.)*

**Take it as the first parameter, and name it `ctx`** — but mark the tiers, because they differ. The
do-not-store rule is the owner's; **the naming half is this skill's house rule**, because the package
says the parameter is *"typically named ctx"*, a description of practice rather than a mandate *(same
page and date)*.

**Go Code Review Comments states exactly one exception**, and it is narrow:

> "The one exception is for methods whose signature must match an interface in the standard library or
> in a third party library."
>
> *(Verbatim from `go.dev/wiki/CodeReviewComments`, read 2026-07-25.)*

**A second exception exists and has a different owner.** The `http.Request` case — a type that predates
`context` and ended up carrying one as a field — is owned by `go.dev/blog/context-and-structs`
(**2021-02-24**, read 2026-07-25). Cite that page if you teach it, and read it before copying the shape.

**Cancellation propagates down, and only down.** A derived context cancels when its parent does, so one
cancel at the top of a request reaches every goroutine below it that took the context and passed it on.
A goroutine that takes no context is outside that tree — the same defect §1 names.

**Every cancel function returned to you must be called**, on every path including the success path. The
toolchain has an analyzer for exactly this failure, `lostcancel`, and it is one of the checks **`go test`
does not run** ([`modules-tooling.md`](modules-tooling.md) §7 lists the eleven it does) — so a green test
suite cannot rule it out. Run the full `go vet ./...` (H2).

**Keep values out of the control path.** A context value is request-scoped data that travels with the
call — a request ID, an auth subject — not a way to pass dependencies a function needs to work. A
function whose behavior changes with what someone put in the context has an untyped parameter list no
signature shows. *(This skill's own position; no owner sentence for it was fetched.)*

## 3. Channels or mutexes

**This file owns the decision alone** — [`design.md`](design.md) §7 routes here for it.

The owner refuses to rank them, and that refusal is the guidance:

> "Use whichever is most expressive and/or most simple."
>
> *(Verbatim from `go.dev/wiki/MutexOrChannel`, read 2026-07-26.)*

It then names the failure it actually sees:

> "A common Go newbie mistake is to over-use channels and goroutines just because it's possible, and/or
> because it's fun. Don't be afraid to use a `sync.Mutex` if that fits your problem best."
>
> *(Same page and date.)*

> **Tier.** `go.dev/wiki` pages carry Go-team involvement but not Go-team documentation authority — the
> tier [`testing.md`](testing.md) §1 records for the same domain. Both sentences are quoted as the
> wiki's, and neither is a MUST on this file's authority.

**The split that guidance lands on maps onto what each primitive is for:**

| Reach for a channel when | Reach for a mutex when |
|---|---|
| you are **passing ownership** of a value from one goroutine to another | you are guarding **state that stays put** — a cache, a counter, a registry |
| you are **distributing work** across a set of workers | the critical section is short and the data does not travel |
| you are **communicating an asynchronous result** back to a waiter | the invariant spans several fields that must change together |

**The reverse check, applied at review.** When the locking rules around a piece of state have grown into
something you have to explain — lock ordering, a lock held across a call into another package, a comment
saying which lock covers which field — that is the signal to consider handing the state to one owning
goroutine and talking to it over a channel. The check runs the other way just as often: a channel used
only to protect one counter is a mutex with more moving parts.

Whichever you pick, **H9's second half applies unchanged**: write the decision down beside the state —
who owns it, and what protects it. That sentence is what a reviewer can check; a green `-race` run (§6)
is not.

## 4. `sync`: what its own documentation forbids

**The package states one rule for everything it exports:**

> "Values containing the types defined in this package should not be copied."
>
> *(Verbatim from `pkg.go.dev/sync`, read 2026-07-25.)*

A copied `Mutex`, `RWMutex`, `Once`, `WaitGroup`, `Cond`, `Map`, or `Pool` duplicates state that was
supposed to be shared, so the two copies guard nothing and neither reports a problem. H13 draws the
consequence: **a struct holding one uses pointer receivers throughout**, because a value receiver copies
the lock on every call. `go vet copylocks` catches it — another check outside the set `go test` runs (H2).

**`sync.Map` is not the concurrent map you reach for by default.** Its documentation names **exactly
two** cases it is appropriate for, and then says what everything else should do:

> "Most code should use a plain Go map instead, with separate locking or coordination, for better type
> safety and to make it easier to maintain other invariants along with the map content."
>
> *(Verbatim from `pkg.go.dev/sync#Map`, read 2026-07-26.)*

**Read the two cases at the owner rather than from any summary, including this one** — a paraphrase of a
closed two-item list is worth less than no list at all, which is the same reason
[`interop.md`](interop.md) §2 declines to reproduce `unsafe.Pointer`'s pattern set from memory. What this
file states is the default the quotation gives: **a plain `map` plus a `sync.RWMutex`**, until you are in
one of those two cases.

**The rest of the package, at the level a decision needs:**

- **`WaitGroup`** — `wg.Go(f)` is the current form; the `wg.Add(1)` / `defer wg.Done()` pair it replaced
  is on the obsolete list at [`modules-tooling.md`](modules-tooling.md) §10, with its floor qualifier.
- **`Once`** — one-time initialization that several goroutines may reach first.
- **Typed atomics** — `atomic.Int64`, `atomic.Bool`, and `atomic.Pointer` are values with methods, and
  they resolve below the floor in [`modules-tooling.md`](modules-tooling.md) §9, so they are safe to use
  unqualified. Prefer them to the older free functions over bare integers. But **an atomic is one
  variable**: the moment an invariant spans two fields, an atomic per field protects neither, because a
  reader can see the first updated and the second not. That is a mutex.
- **`sync.Pool`** is [`performance.md`](performance.md) §5's, including the one memory-model guarantee it
  makes about the handoff.

## 5. The memory model

**The page opens by telling you not to need it, and the sentence is the design guidance:**

> "If you must read the rest of this document to understand the behavior of your program, you are being
> too clever. Don't be clever."
>
> *(Verbatim from `go.dev/ref/mem`, read 2026-07-25.)*

**Go does not make a racing program undefined, and this file states that explicitly because the opposite
is the widespread claim.** The page names the comparison itself:

> "These implementation constraints make Go more like Java or JavaScript, in that most races have a
> limited number of outcomes, and less like C and C++, where the meaning of any program with a race is
> entirely undefined."
>
> *(Verbatim from `go.dev/ref/mem` § Implementation Restrictions, read 2026-07-25.)*

> **Never write that a racing Go program is undefined behavior.** That is the C and C++ position, and
> the owner names Go as the contrast case. The error is easy to make from memory — it shipped in an
> earlier draft of this skill's parent and was caught at the owner — so it is stated here as a rule.

**What Go does allow is termination:**

> "Any implementation can, upon detecting a data race, report the race and halt execution."
>
> *(Verbatim from `go.dev/ref/mem`, read 2026-07-25.)*

**So there is no benign race, and the argument does not need undefined behavior to reach that.** A
bounded set of wrong answers is still wrong answers, and an implementation that halts on detection
removes the last version of "it works in practice". There is no "it is only a counter" exemption: a
counter that reports the wrong number is the defect, and the race is how it got there. The practical
consequence is H9's, and it is a documentation obligation as much as a testing one: **every piece of
shared mutable state carries a written statement of who owns it and what synchronizes it** — channel,
mutex, or atomic. That statement survives into the next change; the test run does not.

## 6. `-race`: what the gate proves, and what it cannot

**Cite the detector's own page, and not the memory model.** `go.dev/ref/mem` describes the *model*; it
says nothing about the race detector, and the string "detector" does not occur on it. The owner is
`go.dev/doc/articles/race_detector`, and its § Runtime Overhead gives the cost:

> "memory usage may increase by 5-10x and execution time by 2-20x."
>
> *(Verbatim from `go.dev/doc/articles/race_detector` § Runtime Overhead, read 2026-07-25.)*

That is why `-race` is a separate P7 gate (gate 7) and not the default test command: run the plain suite
first, because a plain failure is far cheaper to diagnose.

**The coverage limit, from the same page:**

> "The race detector only finds races that happen at runtime, so it can't find races in code paths that
> are not executed."
>
> *(Same page and date.)*

**So a green `-race` run is evidence, not proof.** The detector observes an execution; it does not
analyze the program. A race on a path no test reaches is invisible to it forever. That asymmetry is why
H9 pairs the gate with the written-down synchronization decision (§5): the decision is what a reviewer
checks, and the gate catches the case where the decision was not implemented.
[`testing.md`](testing.md) §8 owns what this means for test design.

## 7. `errgroup`

`errgroup` is the shape H6's fix names: one stop signal for a set of goroutines, and one place for their
caller to block and collect the first error. It replaces a hand-rolled `WaitGroup` plus an error channel
plus a cancel function — three things to get right instead of one.

**It is not in the standard library.** It lives in `golang.org/x/sync/errgroup`, so adopting it is a
dependency decision like any other — [`modules-tooling.md`](modules-tooling.md) §4 owns selection, and
the version resolves to §9 of the same file.

> **Unverified:** the per-method semantics — what `WithContext` cancels and when, whether `SetLimit(n)`
> blocks or reports, and what `TryGo` returns. Two verification passes transcribed none of them, and
> writing them from memory is exactly the failure H10 exists to stop. **What would resolve it:**
> `pkg.go.dev/golang.org/x/sync/errgroup`, read at a pinned module version and transcribed — one read,
> one page. Until then this file teaches the *role* and states no method contract: read the page before
> writing the call.

What holds without that read is the rule the group has to satisfy anyway: every goroutine in the set
still needs §1's three parts. The group is an implementation of them, not an exemption from them — it
cannot stop a goroutine that ignores the context it was given.

**Bounded work.** A `go` statement inside a loop over untrusted input is an unbounded goroutine count,
one per element, decided by whoever supplies the input. The fixed shape is a set number of workers
reading one channel of jobs — a count you chose and can defend, rather than a consequence of the input
size. *(This skill's own position.)*

## 8. Ordered shutdown

Shutdown exercises every goroutine's stop path at once, so it is where §1's obligations either exist or
do not. The order below is this skill's own; each step is the precondition of the next, which is what
makes it a procedure rather than a preference.

1. **One context at the top.** The process, request, or job creates one cancellable context and passes
   it down. Anything that did not take it cannot be told to stop.
2. **Cancel, then wait — in that order.** Cancelling without waiting proves nothing: the goroutines were
   *told*, not observed to have stopped. Waiting without cancelling hangs.
3. **Stop producers before consumers.** A consumer that exits first strands a producer mid-send (§1); a
   producer that stops first lets the pipeline drain the way the data was already flowing.
4. **Close a channel from the sending side only.** A receiver cannot know whether another send is
   coming, so closing is a decision only the sender can make correctly.
5. **Release resources after the wait, not before.** Closing a connection a still-running goroutine is
   using turns a clean shutdown into an error path.
6. **Bound the wait.** A shutdown that can block forever is §1's leak arriving when nobody is watching.
   Give the wait a deadline and decide in advance what happens when it expires — logging and exiting is
   a decision; hanging is not.

The review question this section exists to make answerable: **for every `go` statement in the change,
which of these six steps stops it?** If no step does, the goroutine has no owner.

## 9. What this file points at

Several topics sit one step from this file's subject and are owned elsewhere. Each is named so a reader
arrives at an answer rather than at a silence.

| Adjacent topic | Where it actually lives |
|---|---|
| **`testing/synctest`** — the fake clock, the bubble, and what is *durably* blocked | [`testing.md`](testing.md) §4, which owns it alone. Note the sharp edge it records: a `sync.Mutex` is **not** durably blocking |
| **Container-aware `GOMAXPROCS`** | [`performance.md`](performance.md) §6, which owns it alone, including which cgroup limit the runtime reads and which it ignores |
| **The `automaxprocs`-is-obsolete row** | [`modules-tooling.md`](modules-tooling.md) §10, with its floor qualifier |
| `-race` **inside tests**, and the `goroutineleak` profile for a leak you already suspect | [`testing.md`](testing.md) §8 and [`performance.md`](performance.md) §1 (which records that the profile is an experiment, off in a stock build) |
| A subprocess's lifetime — the same ownership problem outside the process | [`interop.md`](interop.md) §6 |
| `panic` in a goroutine, and where a recovery boundary belongs | [`errors.md`](errors.md) §8 |
