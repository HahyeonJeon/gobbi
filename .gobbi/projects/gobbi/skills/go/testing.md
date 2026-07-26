# Go — Testing

**Ownership** — subtests and the table-driven form; `t.Parallel` and the ordering hazards around it;
`Cleanup` and `t.Setenv`; `testing/synctest` for time-dependent tests; benchmarks with `b.Loop()`;
fuzzing; coverage; the race detector as a test gate; the assertion stance; and test-double design.

**Split criterion** — `skill-writing` P4 (b) + (d): a long lookup reference for the testing API's sharp
edges, and one self-contained sub-procedure — `testing/synctest` — that a reader loads on its own for a
single time-dependent test.

**Deepens, does not restate** — [`SKILL.md`](SKILL.md) Principle 6 (*share by communicating; where you
share memory, state the synchronization and prove it with `-race`*) and Rules **H9** (run
`go test -race` for any change with concurrent access, and state the synchronization decision),
**H12** (no pre-1.22 loop shadow, and no per-iteration assumption in the assignment form), **H10**
(cite the primary owner and a date), and **H19** (never teach a symbol above the module floor as if it
were available there); plus P7 gates 6, 7, and 8. It is the P2 router destination for *writing or
reviewing tests, benchmarks, fuzz targets, parallel subtests, time-dependent tests
(`testing/synctest`), or coverage*. `SKILL.md` states the gates; this file states what each testing
construct actually guarantees.

Every version number below resolves to the Version Currency Register in
[`modules-tooling.md`](modules-tooling.md) §9. The module floor assumed throughout is **`go 1.25.0`**
— read your own `go.mod` before applying any version-gated line here.

## Contents

1. [Subtests and the table-driven form](#1-subtests-and-the-table-driven-form)
2. [`t.Parallel`: what it owns and what it does not](#2-tparallel-what-it-owns-and-what-it-does-not)
3. [`Cleanup`, `t.Setenv`, and the process-wide hazards](#3-cleanup-tsetenv-and-the-process-wide-hazards)
4. [`testing/synctest`: time-dependent tests](#4-testingsynctest-time-dependent-tests)
5. [Benchmarks: `b.Loop()`](#5-benchmarks-bloop)
6. [Fuzzing](#6-fuzzing)
7. [Coverage](#7-coverage)
8. [The race detector inside tests](#8-the-race-detector-inside-tests)
9. [Assertions: plain `if`, plus `go-cmp`](#9-assertions-plain-if-plus-go-cmp)
10. [Test doubles](#10-test-doubles)

## 1. Subtests and the table-driven form

`t.Run(name, f)` starts a subtest. Two properties of the parent/child relationship are stated by their
owners, and everything else in this file rests on them:

> "A parent test will only complete once all of its subtests complete."
>
> *(Verbatim from the `testing` package documentation, § Subtests, verified 2026-07-25.)*

> `Run` "blocks until f returns or calls t.Parallel to become a parallel test".
>
> *(Verbatim from `pkg.go.dev/testing#T.Run`, verified 2026-07-25.)*

So a subtest is a scope with a name, a completion point, and its own `Cleanup` stack — not a label.

**The table-driven form** is one slice of cases and one `t.Run` per case:

```go
func TestParse(t *testing.T) {
	tests := []struct {
		name string
		in   string
		want Config
	}{
		{name: "empty", in: "", want: Config{}},
		{name: "one field", in: "a=1", want: Config{A: 1}},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got, err := Parse(tc.in)
			if err != nil {
				t.Fatalf("Parse(%q) returned error: %v", tc.in, err)
			}
			if got != tc.want {
				t.Errorf("Parse(%q) = %v, want %v", tc.in, got, tc.want)
			}
		})
	}
}
```

Two rules the parent already carries apply directly to that loop. **Do not write `tc := tc`** — loop
variables are per-iteration since Go 1.22, so the shadow is dead code that misleads the reader (H12).
And the per-iteration guarantee applies only because the loop *declares* `tc` with `:=`; a loop written
`for _, tc = range tests` over a pre-declared variable still shares one variable, which a parallel
subtest (§2) will then read after it has moved on (H12 again).

**Unverified:** the table-driven framing itself. Two passes have now fetched no owner sentence
recommending tables as the standard form for subtests. **What would resolve it:**
`go.dev/wiki/TableDrivenTests` — and note in advance what that resolution would be worth. `go.dev/wiki`
is a community wiki: pages there carry Go-team involvement but not Go-team doc authority, so a hit
would license "the wiki recommends it", never "the Go team mandates it". Until then the sourced part
above is the `t.Run` mechanism; the table is this skill's stated house form for using it, and a reader
is free to write the same cases as separate `t.Run` calls.

## 2. `t.Parallel`: what it owns and what it does not

**Cite the right owner.** `T.Parallel` is routinely credited with the parent/subtest ordering that
makes parallel subtests work. It does not document that ordering — §1's two quotations do, and they
come from the package documentation and `T.Run`. Attributing the ordering to `T.Parallel` cites a
page that does not contain the claim.

**What `T.Parallel`'s own documentation covers is two sentences, and this is all of them:**

> "Parallel signals that this test is to be run in parallel with (and only with) other parallel tests.
> When a test is run multiple times due to use of -test.count or -test.cpu, multiple instances of a
> single test never run in parallel with each other."
>
> *(Verbatim from `src/testing/testing.go` § `func (t *T) Parallel()` at the released **`go1.26.5`**
> tag, verified 2026-07-26.)*

So the `-test.count` / `-test.cpu` clause is narrower than it is usually read: it bounds a single test
against **its own repeats**, and says nothing about that test running beside a *different* parallel
test. Repeating a suite does not serialize it.

> **There is no pause clause at the released tag — do not teach one.** "and pauses until all
> non-parallel tests have finished" is present in `src/testing/testing.go` on `master` (tip) and is
> **not** in the file at `go1.26.5`; the two sentences quoted above are the complete comment there.
> *(Both checked 2026-07-26.)* This is the pin-the-tag rule of
> [`modules-tooling.md`](modules-tooling.md) §8 with a live instance attached, and it is the reason
> the quotation above names a tag rather than a page: two surfaces disagreeing is a version difference
> until you have read both at one version, and quoting the pause clause today is quoting unreleased
> tip.

**The `t.Setenv` / `t.Chdir` conflict is not in this comment either.** `T.Parallel` does not document
it. The restriction is enforced in the test binary, and its message is a constant in the same file:

```go
const parallelConflict = "testing: test using t.Setenv, t.Chdir, or cryptotest.SetGlobalRandom can not use t.Parallel"
```

*(`src/testing/testing.go` @ `go1.26.5`, read 2026-07-26. Both methods reach it through
`t.checkParallel()`.)* So the conflict is caught when the test runs, not by the compiler and not by a
lint — but teach the rule from `Setenv`'s and `Chdir`'s own comments (§3), which do state it, and never
from `T.Parallel`'s.

**The idiom that follows from §1, not from `T.Parallel`.** A parallel subtest returns from `t.Run`
immediately and resumes when its parent's function body returns. So a group of parallel subtests
wrapped in one **non-parallel** `t.Run` gives you a place to clean up after all of them — and the
package documentation names that use directly:

> "Run does not return until parallel subtests have completed, providing a way to clean up after a
> group of parallel tests."
>
> *(Verbatim from the `testing` package documentation, § Subtests, verified 2026-07-25.)*

```go
t.Run("group", func(t *testing.T) {   // NOT parallel
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			// ...
		})
	}
})
// every parallel subtest above has completed here
```

**The hazard that survives the Go 1.22 loop-variable fix.** Per-iteration variables removed one class
of parallel-subtest bug and not the other. Anything the closure captures from *outside* the loop — a
shared map, a counter, a client the cases mutate — is still shared by every parallel subtest running at
once. That is shared memory under H9: give it a stated synchronization decision, or give each subtest
its own copy.

## 3. `Cleanup`, `t.Setenv`, and the process-wide hazards

**`Cleanup` registers a function to run when the test finishes.** Its two documented properties are
the ones that matter at a boundary:

- It is called when the test **"and all its subtests"** complete — so a cleanup registered in a parent
  outlives every child, including parallel ones.
- Cleanup functions run in **"last added, first called"** order.

*(Both verbatim fragments from `pkg.go.dev/testing#T.Cleanup`, verified 2026-07-25.)*

Last-added-first-called is the same order `defer` uses, and it composes the same way: register the
cleanup on the line after the thing it releases, and the teardown order takes care of itself.
[`convention.md`](convention.md) §6 owns `defer` itself — `Cleanup` is not a `defer` and is not bound
to the enclosing function's return.

**`t.Setenv` is process-wide, and the doc says so:**

> "Because Setenv affects the whole process, it cannot be used in parallel tests or tests with parallel
> ancestors."
>
> *(Verbatim from `pkg.go.dev/testing#T.Setenv`, verified 2026-07-25.)*

Read "or tests with parallel ancestors" carefully: it is not enough that *this* test is serial. If any
test above it in the `t.Run` chain called `t.Parallel`, `Setenv` is unavailable here too. The
restriction is a property of the whole ancestry, which is why environment-dependent tests and parallel
tests tend to be a design decision made once per package rather than per test.

**`T.Chdir` carries the same restriction, in the same words:**

> "Because Chdir affects the whole process, it cannot be used in parallel tests or tests with parallel
> ancestors."
>
> *(Verbatim from `T.Chdir`'s doc comment, `src/testing/testing.go` @ `go1.26.5`, verified
> 2026-07-26.)*

Both methods enforce it through the same `t.checkParallel()` call and the same `parallelConflict`
message quoted in §2, so treat the two as one decision: a test that sets the environment **or** the
working directory is a serial test, and so is every test below it.

## 4. `testing/synctest`: time-dependent tests

`testing/synctest` was added in **go1.25.0** — exactly the current module floor, so it is available
unqualified at that floor and unavailable below it (H19). It replaces `time.Sleep` waits in
concurrency tests, which are on the obsolete list in
[`modules-tooling.md`](modules-tooling.md) §10 for this reason.

The package runs a group of goroutines — a **bubble** — with a fake clock. Everything below is verbatim
or near-verbatim from `pkg.go.dev/testing/synctest`, verified 2026-07-25.

- **"The initial time is midnight UTC 2000-01-01."** A test that prints or records a timestamp gets
  that clock, not the wall clock.
- **"Time in a bubble only advances when every goroutine in the bubble is durably blocked."**
- **Durably blocked** means "blocked and can only be unblocked by another goroutine in the same
  bubble."

**What is durably blocking** — a send or receive on a bubble channel; a `select` where **every** case
is a bubble channel; `sync.Cond.Wait`; `sync.WaitGroup.Wait` when the matching `Add` happened in the
bubble; `time.Sleep`.

**What is NOT durably blocking — this is the sharp edge** — locking a `sync.Mutex` or `sync.RWMutex`;
blocking on I/O; system calls. A goroutine parked on any of these is blocked but *not durably* blocked,
so the bubble's clock does not advance and a test that expects a timer to fire simply waits.

The consequence is a design constraint, not a lint: **a component you intend to test under `synctest`
must wait on channels, condition variables, or timers — not on a mutex and not on real I/O.** A test
that hangs under `synctest` is usually reporting that a goroutine is blocked on something the bubble
cannot see.

**Inside a bubble, `T.Run`, `T.Parallel`, and `T.Deadline` must not be called.** And a deadlock inside
the bubble fails the test rather than hanging the run — which is the property that makes the package
worth the constraint: a missed wakeup becomes a test failure instead of a flake.

**The whole exported API is two functions**, which is why the package is a self-contained
sub-procedure rather than a framework:

```go
func Test(t *testing.T, f func(*testing.T))
func Wait()
```

*(Both signatures read from `testing/synctest` @ `go1.26.5`, verified 2026-07-26 — the package exports
nothing else.)*

`Test` is the entry point: it runs `f` as the bubble. Only the two signatures were transcribed, so
this file states no semantics for `Wait` beyond them — read `pkg.go.dev/testing/synctest` before using
it. What a reader has to hold is the durability list above, not the API.

## 5. Benchmarks: `b.Loop()`

`b.Loop()` (Go **1.24**, below the floor) is the current form, and the package says so:

> "New benchmarks should prefer using [B.Loop], which is more robust and more efficient."
>
> *(Verbatim from the `testing` package documentation, verified 2026-07-25.)*

```go
func BenchmarkParse(b *testing.B) {
	data := load()      // setup: runs once, and is not timed
	for b.Loop() {
		Parse(data)
	}
}
```

What `B.Loop` gives you over `for range b.N`:

- **It manages the timer itself** — it resets the timer on its first call and stops it when it returns
  false, so setup before the loop and cleanup after it are outside the measurement.
- **It keeps the loop body's arguments and results alive** against the compiler optimizing away a call
  whose result nobody uses.
- **The `b.N` hazard it removes:** with a `b.N` loop, "any setup done before the loop may be run several
  times" — the framework re-runs the benchmark function with a larger `b.N` until the run is long
  enough, and unguarded setup pays that cost on every attempt.

Two mechanical constraints, both from the same owner:

- **The condition must be written exactly as `b.Loop()`.** Assigning it to a variable, negating it, or
  wrapping it defeats the recognition that gives you the two properties above.
- **Use `b.Loop` or a `b.N` loop, never both** in one benchmark.

Benchmark *results* are `performance.md`'s subject: what to measure, and what a number licenses you to
claim. This file owns how the benchmark is written.

## 6. Fuzzing

A fuzz target is exercised by its own gate, which is P7 gate 8:

```
go test -run '^$' -fuzz '^FuzzName$' -fuzztime 60s ./path/to/pkg
```

Three properties of that command the parent states and this file will not restate past their
consequence: `-fuzz` takes a regexp that must match **exactly one** target, so the gate is repeated
once per target rather than written once for all of them; `-run '^$'` keeps the ordinary tests out of
the fuzzing run; and **without `-fuzztime` the run never ends**, which in a gate chain means every gate
below it never runs.

**The target itself.** `F.Add` supplies the seed corpus — *"Add will add the arguments to the seed
corpus for the fuzz test"* — and the argument types it accepts are a closed list:

> "[]byte, string, bool, byte, rune, float32, float64, int, int8, int16, int32, int64, uint, uint8,
> uint16, uint32, uint64."

A type outside that list cannot be fuzzed directly; fuzz the bytes and build the value inside the
target. Inside the `F.Fuzz` function the `*F` is nearly closed too:

> "The only [*F] methods that are allowed in the F.Fuzz function are [F.Failed] and [F.Name]."

**The corpus is on disk, and that is what makes fuzzing a regression tool rather than a one-off run.**
Both sentences are quoted in a code block because the directory name they contain is a literal
placeholder:

```
the fuzzing engine writes the inputs that caused the failure to a file in the directory
testdata/fuzz/<Name> within the package directory. This file later serves as a seed input.

When fuzzing is disabled, the fuzz target is called with the seed inputs registered with [F.Add]
and seed inputs from testdata/fuzz/<Name>. In this mode, the fuzz test acts much like a regular
test.
```

*(All five quotations in this section are verbatim from the `testing` package documentation,
§§ `F.Add`, `F.Fuzz`, and Fuzzing, at `go1.26.5`, verified 2026-07-26.)*

So the failing input is **committed**, and every later `go test ./...` replays it without `-fuzz`.
Deleting a file under `testdata/fuzz/` deletes a regression test.

## 7. Coverage

**The flags, and the one distinction that trips people.** `go test` takes `-cover`,
`-covermode` (`set`, `count`, `atomic` — the default is `set`, and `-race` makes it `atomic`), and
`-coverprofile`. `go build` takes `-cover`, `-covermode`, and `-coverpkg` — **but not
`-coverprofile`.** A built binary writes its counters to a directory instead:

> `GOCOVERDIR`: "Directory into which to write code coverage data files generated by running a
> \"go build -cover\" binary."

*(Flags read from `go help testflag` and `go help build`; `GOCOVERDIR` verbatim from `go help
environment`; the split is stated in the go command's own source — "We add -cover{mode,pkg} to the
build command and only -coverprofile to the test command" — all at `go1.26.5`, verified 2026-07-26.
Narrative owner: `go.dev/doc/build-cover`.)*

Two consequences for an integration test that runs the real binary: reach for `go build -cover` plus
`GOCOVERDIR`, not `-coverprofile`, and remember that `go build -cover` instruments only the main
module's packages unless `-coverpkg` widens it.

What needs no fetch is what a coverage number is. H9 already states the shape of this argument for the
race detector — it "only finds races that happen at runtime, so it can't find races in code paths that
are not executed", which makes a green run evidence and not proof. A coverage percentage reports which
lines a run executed. It does not report which behaviors the test asserted, so a package can be at 90%
with assertions no stronger than "it did not panic". Treat the number as a map of what is untested,
which is what it actually is, and never as a verdict on what is tested.

## 8. The race detector inside tests

`go test -race ./...` is P7 gate 7, required whenever the change touches concurrency (H9). Three facts
decide how to use it, all owned by `go.dev/doc/articles/race_detector` and quoted at the parent:

- **It costs 5-10x memory and 2-20x execution time.** That is why it is a gate and not the default test
  command — run the plain suite first, because a plain failure is far cheaper to diagnose (P7's stated
  ordering rationale).
- **It "only finds races that happen at runtime, so it can't find races in code paths that are not
  executed".** The detector observes; it does not analyze. A test that starts one goroutine gives it
  one goroutine's worth of evidence.
- **A green run is therefore evidence, not proof** — which is why H9 pairs the gate with a written-down
  synchronization decision. The decision is what a reviewer checks; the gate is what catches the case
  where the decision was not implemented.

The practical consequence for test design: `-race` finds what the test executes concurrently, so the
concurrent path has to be in a test at all. A parallel subtest (§2), or a test that starts the same
number of goroutines the production caller does, is what turns the gate from a formality into a check.

## 9. Assertions: plain `if`, plus `go-cmp`

**The stance this skill takes, stated as a project position rather than as consensus:** write
assertions as plain `if` conditions with `t.Errorf` / `t.Fatalf`, and reach for
`github.com/google/go-cmp/cmp` when the comparison is a deep one that `==` cannot express. **The
standing override is "follow the existing project convention"** — a package that already uses one
assertion library consistently is not improved by a second style arriving with your change.

```go
got, err := Parse(in)
if err != nil {
	t.Fatalf("Parse(%q) returned error: %v", in, err)
}
if got != want {
	t.Errorf("Parse(%q) = %v, want %v", in, got, want)
}
```

**Google's position, at its own tier.** Google's Go Style **Decisions** page — **normative but not
canonical**, and subordinate to the Style Guide — states it twice:

> "Do not create 'assertion libraries' as helpers for testing."
>
> and: "Instead of creating a domain-specific language for testing, use Go itself."
>
> *(Verbatim from `google.github.io/styleguide/go/decisions`, verified 2026-07-25. Mark the tier
> wherever this is cited: the `guide` page is normative **and** canonical for Google; `decisions` is
> normative and **not** canonical; `best-practices` is neither. Citing all three at one strength is
> the error [`modules-tooling.md`](modules-tooling.md) §8 exists to prevent.)*

**The split is real and stating it honestly is part of the stance.** Google's guidance bans assertion
helpers; the wider ecosystem uses `testify` heavily; and **no Go-team position on assertion libraries
was found in this pass**. That last one is a negative claim from one session's reading, not a proven
absence — do not build a rule on it, and do not present the stance as consensus. It is this skill's
choice, taken with the split in view.

**The got-before-want format the examples above follow has an owner, at the same tier as the rule
above it** — Google's Style **Decisions**, normative and **not** canonical:

> "A standard format for printing test outputs is `YourFunc(%v) = %v, want %v`. Where you would write
> 'actual' and 'expected', prefer using the words 'got' and 'want', respectively."
>
> *(Verbatim from `google.github.io/styleguide/go/decisions`, verified 2026-07-26.)*

Two things follow. The call that produced the value goes in the message, so a failure names the input
without the reader opening the test; and **the actual value comes first**, which is worth stating
because it is the opposite order from several assertion libraries. Mark the tier whenever you cite
this: it is Google's convention, not a Go-team one.

**This file makes no claim about any specific assertion library's behavior.** Two such claims were
carried in the design — an argument-order inconsistency between two `testify` functions, and a
nil-versus-empty-slice equality difference — and both are dropped as unsourced rather than restated. A
wrong claim about a named library's argument order is precisely the failure this skill exists to
prevent, and `go-cmp`'s own API is likewise not reproduced here: read
`pkg.go.dev/github.com/google/go-cmp/cmp` before writing the call.

## 10. Test doubles

A Go test needs no mocking framework, and the reason is structural. Interfaces are satisfied by method
set alone ([`SKILL.md`](SKILL.md) Principle 4), so a test can supply any type carrying the right
methods, and the production type never learns that it happened.

That gives the whole design in three moves:

1. **The consumer declares the interface it needs**, in its own package, with only the methods it calls
   (H7). A one-method interface is the common case, and it is the one a double is trivial to write for.
2. **The double is an ordinary struct in the test**, usually with function fields so each case can set
   the behavior it needs. No framework, no generated file, no `//go:generate` step to keep current.
3. **Never add an interface at the implementor "for mocking."** Go Code Review Comments states the
   position and ships a literal counter-example (H7). An interface added for a test narrows what every
   real caller can do, to serve one caller that is not real.

The same rule decides where a fake belongs: in the package that consumes the dependency, beside the
interface declaration it satisfies. When `service-clients.md` is written it points here for
test-double design rather than restating it — that is a forward obligation on the author of that file,
not a description of a file that exists today.
