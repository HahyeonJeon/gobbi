# Go — Errors

**Ownership** — the error model: sentinel, typed, and formatted errors and how to choose between them;
the `errors` API map (`New`, `Unwrap`, `Is`, `As`, `AsType`, `Join`) and `fmt.Errorf`; `%w` as an **API
commitment**; **error-string form**, which this file owns alone; handle-each-error-exactly-once;
the typed-nil trap; and the `panic` / `recover` boundary.

**Split criterion** — `skill-writing` P4 (b): a long lookup reference. The error-shape decision is made
once per signature, and a reader opens this file at the moment of that decision.

**Deepens, does not restate** — [`SKILL.md`](SKILL.md) Principle 2 (*errors are values on the normal
path: return them, and treat every wrap as an API commitment*) and Rules **H4** (return errors as
values, handle each exactly once, wrap only when committing), **H11** (never return a typed-nil pointer
through an `error`), **H16**'s in-band-error and discarded-error clauses, and **H19** (never teach a
symbol above the module floor as if it were available there). It is the P2 router destination for
*creating, wrapping, matching, or classifying an error; a sentinel-versus-type choice; error-string
form; `panic` or `recover`*. `SKILL.md` states the rules; this file states the mechanism and the
decision.

Every version number below resolves to the Version Currency Register in
[`modules-tooling.md`](modules-tooling.md) §9. The module floor assumed throughout is **`go 1.25.0`**,
which is what `go mod init` writes on today's toolchain — read your own `go.mod` before applying any
version-gated line here.

## Contents

1. [Three shapes, one decision](#1-three-shapes-one-decision)
2. [Constructing an error](#2-constructing-an-error)
3. [`%w` is an API commitment](#3-w-is-an-api-commitment)
4. [Matching: `Is`, `As`, `AsType`](#4-matching-is-as-astype)
5. [Error-string form](#5-error-string-form)
6. [Handle each error exactly once](#6-handle-each-error-exactly-once)
7. [The typed-nil trap](#7-the-typed-nil-trap)
8. [`panic` and `recover`](#8-panic-and-recover)

## 1. Three shapes, one decision

Go gives failure no language machinery. An error is an ordinary return value, so its **shape** is a
design act taken at the same moment as the signature — not a formatting choice made later.

There are three shapes:

- **Sentinel** — a package-level `var` holding one distinct error value, which callers compare against.
- **Typed** — a custom type implementing `error`, carrying fields a caller can read.
- **Formatted** — a one-off value built at the failure site, carrying only its message.

Choose on two axes: does a caller need to **match** on this failure, and does the failure carry
**dynamic data**?

| Caller needs to match | Failure carries dynamic data | Shape | Construction |
|---|---|---|---|
| No | No | formatted | `errors.New("…")` at the failure site |
| No | Yes | formatted | `fmt.Errorf("…: %v", x)` |
| Yes | No | sentinel | a package-level `var ErrX = errors.New("…")` |
| Yes | Yes | typed | a struct type with an `Error() string` method |

This table is the skill's own decision aid, not an owner's rule. The two axes come from what the
`errors` API can actually do: `errors.Is` answers *is this that specific value*, and `errors.As`
answers *is this that kind of value, and give me its fields*. If no caller will ask either question, a
formatted error is the whole answer and a sentinel is premature API surface.

**Every shape a caller can match on is public API.** A sentinel is a value someone will compare
against; a typed error is a struct someone will read fields from. Neither can be changed later without
breaking them. Prefer the formatted shape until a caller has a reason to branch on the failure.

## 2. Constructing an error

- **`errors.New(text)`** returns a **distinct value on every call**, even for identical text. Two
  separately-constructed errors with the same message are never equal, which is exactly why a sentinel
  must be a single package-level `var` — constructing one per call site defeats matching.
- **`fmt.Errorf(format, …)`** formats a message. With a `%w` verb it also wraps (§3); with `%v` it does
  not.
- **`errors.Join(errs …error)`** combines several errors into one. It discards nil arguments, returns
  nil when every argument is nil, and its message is the joined errors' messages separated by newlines.
  It is the multi-failure form — a batch operation that must report every failure rather than the first.
- **`errors.Unwrap(err)`** returns the next error in the chain, or nil.

**Wrapping is defined by method set, not by the `fmt` call.** An error wraps another when its type has
an `Unwrap() error` method, or an `Unwrap() []error` method for a tree. `fmt.Errorf` with `%w` is the
common way to get one, not the only way — a custom type with an `Unwrap` method is wrapped too.

*(Owner: `pkg.go.dev/errors`, verified 2026-07-25. `errors.Join` and `fmt.Errorf`'s support for
**multiple** `%w` verbs in one call both arrived in **Go 1.20** — owner `go.dev/doc/go1.20`, verified
2026-07-25. Both are below the `go 1.25.0` floor, so both are safe to use unqualified.)*

## 3. `%w` is an API commitment

`%w` is not a nicer `%v`. It exposes the wrapped error to `errors.Is` and `errors.As`, which publishes
it into your API for as long as any caller may match on it:

> "wrapping an error makes that error part of your API"
>
> and, stated as the decision rule: "If you don't want to commit to supporting that error as part of
> your API in the future, you shouldn't wrap the error."
>
> *(Verbatim from `go.dev/blog/go1.13-errors`, 2019-10-17, verified 2026-07-25.)*

So the wrap decision is a contract decision. Ask one question at every `fmt.Errorf` call: **is a caller
meant to match on the error underneath?**

- **Yes** — wrap with `%w`. You now support that error as part of your surface.
- **No** — format with `%v`. The message still reaches the log; the type stays private.

This is where the ecosystem genuinely disagrees, and the disagreement is worth stating honestly rather
than hiding behind a house rule:

| Position | Source | Standing |
|---|---|---|
| `%w` is "a good default" | Uber Go Style Guide | A derivative, non-Go-team source. Cite the section, never the guide as a mandate |
| Wrap only when committing to the error as API | `go.dev/blog/go1.13-errors` | The Go team's own statement, and the position this skill takes |
| Same as the Go blog | Google's Go Style Guide | Google's position, normative and canonical **for Google** |

*(All three read 2026-07-25.)* **This skill takes the restrictive position**, and states it as a project
position rather than as consensus, because consensus does not exist.

One further rule is **Google-only** and must be labelled as such wherever it appears: placing the `%w`
verb last in the format string, and first for sentinels. It is not a Go-team rule.

**Wrapping adds context, and context is not the error's identity.** A wrap chain that reads
`open config: read file: permission denied` tells a reader where the failure happened. Adding the
function's own name to every layer does not — the call stack already carries that, and the message
becomes a stutter of package names.

## 4. Matching: `Is`, `As`, `AsType`

Three questions, three functions:

- **`errors.Is(err, target)`** — walks the chain and reports whether any error in it equals `target`.
  It compares with `==`, so `target` must be **comparable**. This is the sentinel test.
- **`errors.As(err, &target)`** — walks the chain looking for an error assignable to `*target`, and
  assigns it. `target` is a pointer to the concrete error type you want. This is the typed test, and
  it is **the correct and current form at the `go 1.25.0` floor**.
- **`errors.AsType[E error](err) (E, bool)`** — the same semantics as `errors.As` with less ceremony:
  a type parameter instead of a pre-declared variable and an address-of. It was added in **go1.26.0**,
  which is **above** the `go 1.25.0` floor.

**Neither `As` nor `AsType` is obsolete.** At a `go 1.25.0` floor, `AsType` does not exist and `As` is
the only form that compiles; at a `go 1.26.0` or higher floor, both work and `AsType` is the shorter
one. Do not teach `AsType` as the default while the floor is 1.25, and never state either as the
obsolete form of the other (H19). [`modules-tooling.md`](modules-tooling.md) §10 records this
explicitly, and deliberately keeps `errors.As` out of the obsolete table.

*(Owners: `pkg.go.dev/errors` for the API, and `go.dev/doc/go1.26` for `AsType`'s introduction, both
verified 2026-07-25. The floor numeral follows the toolchain — read the register in
[`modules-tooling.md`](modules-tooling.md) §9, then read your own `go.mod`.)*

**Never type-switch on an error you did not construct.** A type switch tests the outermost error only,
so it silently fails the moment any layer wraps. `errors.As` walks the chain; the switch does not.

**Match on a chain, not on a string.** Comparing `err.Error()` against text couples you to a message
that no compatibility promise covers, and it breaks the first time a wrap layer prepends context.

## 5. Error-string form

**This file owns error-string form.** When `convention.md` is written it must point here rather than
restate the rule — that is a forward obligation on the author of that file, not a description of a file
that exists today.

The owner states the rule and both of its exceptions in one sentence:

> "Error strings should not be capitalized (unless beginning with **proper nouns or acronyms**) or end
> with punctuation... **This does not apply to logging**, which is implicitly line-oriented and not
> combined inside other messages."
>
> *(Verbatim from `go.dev/wiki/CodeReviewComments`, verified 2026-07-25.)*

So: **not capitalized, no trailing punctuation**, with a proper noun or an acronym at the start as the
one in-string exception, and **log messages out of scope entirely**.

The exceptions follow from the reason, which is compositional rather than aesthetic: an error string is
a fragment that gets embedded inside another error's string. `fmt.Errorf("read config: %w", err)`
produces one sentence out of several fragments, so a capital letter or a full stop in the middle of the
chain reads as a defect. A proper noun or an acronym is capitalized wherever it appears, and a log line
is never embedded in anything — neither case is composed, so neither needs the rule.

Uber's guide adds one refinement worth applying — **drop `"failed to"`** and similar prefixes. Every
error is a failure; the words are noise repeated at every layer of the chain. *(Uber's position, not a
Go-team rule; read 2026-07-25.)*

## 6. Handle each error exactly once

Handling an error means doing something that resolves it: logging it, converting it to a user-facing
result, or retrying. **Returning it is not handling it — it defers handling to the caller.** So the
count is one:

- **Log and return** is the named anti-pattern. It produces two reports of one fault, and it takes the
  choice away from the caller, who now cannot decide whether this failure was worth a log line.
- **Return the error, or handle it — never both.**

*(Owner: Google's Go Best Practices page, verified 2026-07-25. Mark this attribution honestly: that
page self-declares as **neither normative nor canonical**, which makes it the weakest of Google's three
tiers. It is the owner this clause rests on, and the clause is stated at that strength.)*

Two adjacent rules the parent states categorically, deepened here:

- **Never discard an error with `_`.** "Do not discard errors using `_` variables" is stated
  categorically by Code Review Comments *(verified 2026-07-25)*. A discarded error is a decision no
  reader can audit. The owner states no exception and `SKILL.md` H16 is a NEVER, so this file adds
  none: handle the error, or return it.
- **Never return an in-band error value.** A `-1`, an empty string, or a zero-value sentinel is a
  failure the type system will not force any caller to check. Return `(value, error)` — or `(value,
  ok)` where the failure carries no information.

## 7. The typed-nil trap

An interface value is nil only when **both** its type and its value are unset.
*(Owner: `go.dev/doc/faq`, verified 2026-07-25.)*

The consequence for errors is a bug that survives every check the toolchain offers. A function
declaring `var err *MyError`, leaving it nil, and returning it as `error` returns an interface that
holds the *type* `*MyError` and a nil pointer. That interface is **not** nil, so `if err != nil` fires
on the success path — and the caller then calls a method on a nil receiver or reports a failure that
never happened.

**No vet analyzer catches it**, and no compiler error or default lint reports it either. Treat that as
this skill's stated position rather than as an audited result: no per-analyzer audit is recorded
anywhere in this skill, and [`modules-tooling.md`](modules-tooling.md) §7 gives the analyzer **count**,
not a check of each one against this bug. The defense is structural either way:

- **Declare the variable as `error`, never as the concrete type**, wherever it can reach a return.
- **Return a literal `nil` on the success path**, not a nil-valued concrete variable.
- **Never store a concrete error pointer in a struct field** that a method later returns as `error`.

The same trap applies to any interface, not just `error`. `error` is where it costs the most, because
`err != nil` is the most-executed branch in a Go program.

## 8. `panic` and `recover`

A panic is not Go's error mechanism. It is for failures where continuing is not meaningful.

**When `panic` is the right call:**

- **Program initialization** that cannot produce a working program — a malformed embedded template or a
  bad compiled-in regular expression. The standard library ships this shape as the `Must` idiom
  (`template.Must`), which panics rather than returning an error, because the input is a constant the
  author controls.
- **An invariant that a caller cannot cause and cannot handle** — a state the program's own logic made
  impossible.

**When it is not:** anything a caller could have caused, anything an input could trigger, and anything
a caller might reasonably want to handle. Those are errors, and errors are return values (H4).

**`recover` mechanics:**

- `recover` returns a non-nil value only when called **directly by a deferred function** during a
  panic. Called anywhere else it returns nil.
- Recovering does not resume the panicking statement. Execution continues after the deferred call
  returns, at the point where the function that deferred it returns.
- **Unverified:** the standard statement that `recover` only stops a panic in **the same goroutine** as
  the one that panicked. The fact is standard and this skill treats it as true, but no primary sentence
  was found for it in this pass, so it is written here without a quotation and without an owner. The
  specification's *Handling panics* section, read at the pinned toolchain tag, would resolve it. Until
  then: a goroutine that panics takes the program down regardless of any `recover` on another
  goroutine — so every goroutine that can panic needs its own recovery boundary, or must not panic.

**Where a recovery boundary belongs:** at a process boundary that must survive one bad unit — a request
handler, a worker loop, a user-supplied callback. Recover there, convert the panic into an error or a
logged failure, and return. Do not scatter `recover` through a call chain: a recovery boundary that is
not at a boundary hides the bug and keeps the program running in a state nobody designed.

**`panic(nil)`** yields a `*runtime.PanicNilError` since **Go 1.21**, so a `recover()` after it returns
non-nil like every other panic. The pre-1.21 behavior — `recover()` returning nil, making the panic
undetectable — is restorable with `GODEBUG=panicnil=1`. *(Owners: `go.dev/doc/go1.21` and
`go.dev/doc/godebug`, verified 2026-07-25.)*
