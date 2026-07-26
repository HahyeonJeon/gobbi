# Go — Design

**Ownership** — the unit-shape decision (a function, a struct with methods, or neither); **where an
interface is defined**, and why that is the consumer's package; the useful zero value and the
constructor that follows from it; composition and embedding, including what an exported embedded type
publishes; and **when a type parameter is earned**, which this file owns alone.

**Split criterion** — `skill-writing` P4 (b) + (d): a long lookup reference for the shape decisions a
reader makes once per unit, plus one self-contained sub-procedure — the earned-generics decision — that
another consumer loads on its own ([`interop.md`](interop.md) §3 routes here for it).

**Deepens, does not restate** — [`SKILL.md`](SKILL.md) Principle 4 (*define interfaces where they are
consumed, and return concrete types*) and Principle 5 (*make the zero value useful, and compose instead
of inheriting*), and Rules **H7** (define an interface in the package that consumes it, and return
concrete types), **H10** (cite the primary owner and a verification date for every symbol and example),
and **H17**'s generics clause (never reach for a type parameter without a named earned reason). It also
deepens Procedure step **P3**, design acts **2** (pick the unit shape, and design the zero value) and
**3** (place the interfaces at the consumer). It is the P2 router destination for *a package boundary or
layout choice, an interface placement, embedding, the zero value, a channels-versus-mutex decision, or a
proposed type parameter* — and **§7 names the two rows in that list this file does not own**, so a
reader who followed the router arrives at an answer rather than at a silence. `SKILL.md` states the
rules; this file states the decision behind each one.

Every version token below resolves to the Version Currency Register in
[`modules-tooling.md`](modules-tooling.md) §9.

## Contents

1. [The unit shape](#1-the-unit-shape)
2. [Where an interface is defined](#2-where-an-interface-is-defined)
3. [The useful zero value](#3-the-useful-zero-value)
4. [Constructors, earned](#4-constructors-earned)
5. [Composition and embedding](#5-composition-and-embedding)
6. [When a type parameter is earned](#6-when-a-type-parameter-is-earned)
7. [What this file points at](#7-what-this-file-points-at)

## 1. The unit shape

`SKILL.md` P3 design act 2 gives the rule in one sentence: a function over plain data is often the whole
unit, and a struct with methods is reached for when state and behavior must travel together. The
deepening is the test that decides it, and the third option people reach for that is not a shape at all.

**The test is whether anything survives the call.** A unit that reads its inputs, computes, and returns
is a function — giving it a receiver adds a lifetime nobody needed and a construction step every caller
now performs. A unit that holds something between calls — an open connection, a cache, a counter, a
configured client — is a struct with methods, because the state and the operations on it have to be
handed around as one thing.

**A struct whose fields are all set once and never read by more than one method is a parameter list
wearing a receiver.** Pass the values.

**An interface is not a third shape you pick here.** Nothing at the implementor decides to "be an
interface": Go's interfaces are satisfied by method set alone, so an interface is a *consumer's*
declaration about what it needs, made in the consumer's own package (§2). At the implementor there are
two shapes, function and struct, and the interface question is asked somewhere else entirely by someone
else.

> **Tier: this section is this skill's own position.** No Go-team page states a function-versus-struct
> rule, and none is invented here — the language-agnostic property belongs to `coding` P2 / P3, and what
> is written above is the Go-shaped form of the parent's own P3 act 2 sentence. The one sourced clause
> in it is the method-set property, which `SKILL.md` Principle 4 carries from the specification.

## 2. Where an interface is defined

**This is the single decision with the most leverage in a Go package boundary, and the owner states it
outright:**

> "Go interfaces generally belong in the package that uses values of the interface type, not the package
> that implements those values. The implementing package should return concrete (usually pointer or
> struct) types: that way, new methods can be added to implementations without requiring extensive
> refactoring... Do not define interfaces on the implementor side of an API 'for mocking'; instead,
> design the API so that it can be tested using the public API of the real implementation."
>
> *(Verbatim from `go.dev/wiki/CodeReviewComments`, read 2026-07-25. The same page ships a worked
> counter-example beside that text; read it there — this file does not reproduce code it has not
> transcribed at source.)*

Three consequences, in the order they bite:

- **The consumer declares the method set it needs, after the fact.** It needs no cooperation from the
  implementor and no change to it, because satisfaction is structural (`SKILL.md` Principle 4). So the
  interface is usually one or two methods wide — the ones this consumer actually calls — rather than a
  mirror of the implementing type.
- **Returning a concrete type keeps every method available.** An interface return deletes the methods
  the author did not anticipate, and it deletes them for everyone. Adding a method to a concrete type is
  backwards-compatible; adding one to a published interface breaks every implementor.
- **"For mocking" is named by the owner as the wrong reason** — and it is the reason most implementor-
  side interfaces exist. [`testing.md`](testing.md) §10 owns the test-double design that replaces it.

**Do not define an interface before a consumer has asked for one.** An interface with one implementation
and no second caller is a guess about a future method set, written at the moment you know least.

**"Accept interfaces, return structs" is current, and must never be filed as obsolete.** Both
`go.dev/wiki/CodeReviewComments` and Google's Style **Decisions** restate the position as live guidance
*(both re-read 2026-07-26; `decisions` is normative and **not** canonical — mark the tier, per
[`modules-tooling.md`](modules-tooling.md) §8)*. Every "this advice is outdated" source found in two
verification passes was community blogging with no primary backing, so **the supposed exceptions are not
taught here as facts** and the rule does not appear in the obsolete table at
[`modules-tooling.md`](modules-tooling.md) §10. If someone proposes an exception, the question to ask is
which owner states it.

**The compile-time check, when one is worth having.** Assert satisfaction at the implementor with a
blank variable rather than by changing the return type:

```go
var _ http.Handler = (*Handler)(nil)
```

`Source: the specification § Assignability, doc/go_spec.html @ go1.26.5, read 2026-07-26 — a value is
assignable to a variable of an interface type when "T is an interface type, but not a type parameter,
and x implements T", which is the rule that makes the declaration a compile-time check.`

The assignment is checked at compile time, so a missing or misspelled method fails the build instead of
failing at the first call site. `SKILL.md` P3 design act 3 already prescribes this over an interface
return; the **mechanism** above is the specification's, but the **idiom** — a blank variable at the
implementor rather than a test — is this file's own, and no owner sentence prescribing it was fetched.
Do not present the form as a Go-team mandate.

## 3. The useful zero value

Every Go type already has a zero value, and a caller can build one without asking you. Designing what it
does is therefore the cheapest abstraction available: a type that works from its zero value needs no
constructor, no builder, and no `initialized` flag in any caller.

The language states this as one of its values:

> "Make the zero value useful"
>
> *(`go-proverbs.github.io`, read 2026-07-25. The site attributes the list as "Proverbs from
> @robpike.io's inspiring talk at Gopherfest SV 2015" and says it "may be updated when he next gives the
> talk" — so it is mutable, and every citation of it carries a date.)*

> **Tier, stated once and applied everywhere this file cites a proverb.** The proverbs are the
> language's stated values expressed as rhetoric. They are **not** a normative source, and **nothing in
> this skill is a MUST on their authority.** What makes the design act above a rule here is the parent's
> Principle 5, not the proverb.

**The standard library carries the same claim as a shipped contract**, which is the corroboration worth
having:

> "The zero value is ready to use."
>
> *(Verbatim from `pkg.go.dev/strings#Builder`, verified 2026-07-25 —
> [`performance.md`](performance.md) §4 quotes the package's complete four-sentence documentation.)*

**How to design one.** Ask what each field means when it is zero, before the type has a constructor. The
three checks below are this skill's own, derived from field semantics the parent already states; only
the two quotations above carry owners.

- **A field whose zero value is already the right default costs nothing.** An empty count, an empty
  buffer, and a nil slice that will be appended to are all usable as they stand, so they need no
  constructor line and no caller ceremony.
- **A field the type must write *through* is where a zero value usually fails.** A map field is the
  common instance. **Unverified:** the nil-map read-versus-write asymmetry — the mechanism that decides
  the case. **What would resolve it:** `go.dev/ref/spec` § *Index expressions*, read at the pinned
  `go1.26.5` tag; this is the same gap [`convention.md`](convention.md) §7 records and declines to fill
  from memory. Until someone makes that read, treat a map the type writes to as the field that forces a
  constructor or a lazy `make`, and state no mechanism for it.
- **If zero has to mean "unset", the field is a pointer or a wrapper type, not a bare value.** A zero
  `time.Duration`, a zero `int`, and an empty `string` are all values a caller may have meant — the same
  absent-versus-zero distinction [`interop.md`](interop.md) §4 draws for `omitempty`.

**The check to apply:** if the doc comment has to say "call `New` first", the zero value lost. Sometimes
that is correct and unavoidable (§4). It should be a decision, not a default.

## 4. Constructors, earned

The zero value decides whether a constructor exists at all, so this decision comes second and not first
(P3 design act 2).

**A constructor is earned by one of three things:**

1. **A dependency with no useful zero** — a database handle, a client, a logger the type cannot invent.
2. **Validation that must happen before first use**, so that no caller can hold an invalid value.
3. **A resource acquired at construction**, which then has a release path the caller must be told about.

**When one is earned, four rules follow from the rest of this skill rather than from taste:**

- **Return the concrete type** (§2, H7). A constructor returning an interface is the implementor-side
  interface problem wearing a different hat.
- **Return `(T, error)` when construction can fail**, and never a half-built value plus a later `Init()`
  the caller may forget: nothing in the type says the second call is required, so the compiler cannot
  make anyone do it.
- **Name it for what it makes, in a package whose name already carries the type** — `New` when the
  package has one principal type, `NewX` when it has several. The package name is written at every call
  site, so `pkg.NewPkgThing` stutters ([`convention.md`](convention.md) §1).
- **Say what the caller now owns** in the doc comment — what must be closed, what is shared, and what a
  returned slice or map aliases (H8's fix; [`convention.md`](convention.md) §4).

**Do not write a constructor that only assigns fields the caller could have set in a struct literal.** It
adds a name to learn and a version to keep compatible, and it removes the caller's ability to set fields
by name.

> **Tier: everything in this section is this skill's own position.** **No Go-team page states a
> constructor convention**, and this file does not invent an owner for one — including for the
> options-function shape, on which it therefore takes **no position at all**. A package that already uses
> one consistently is followed, not converted; that is the same standing override
> [`testing.md`](testing.md) §9 applies to assertion style.

## 5. Composition and embedding

Go has no inheritance. It has **embedding**, and embedding is not private reuse.

The mechanism is the specification's, and `SKILL.md` Principle 5 states it: an embedded field is a field
*named for its type*, and that type's methods are promoted onto yours. Both halves matter, and the first
is the one that surprises people — the field is reachable by name, so `outer.Inner` is part of your
surface the moment `Inner` is exported.

**The consequence this skill draws, stated as a design rule:**

> **An exported embedded type becomes a permanent public field.** Every future version of your type must
> keep it, and every method added to the embedded type appears on yours without your involvement. A
> change in the embedded API is a change in your own.

This is **Uber's** position, reached from experience rather than from a Go-team page: its style guide
calls embedding in exported structs rarely necessary *(`github.com/uber-go/guide`, read 2026-07-25)*.

> **Attribute it as one organization's position, never as Go-team guidance — and note the currency
> defect.** That guide is a derivative source, and it carries verified staleness: its introduction still
> recommends **`golint`**, which is archived ([`modules-tooling.md`](modules-tooling.md) §10 lists it as
> obsolete). A source that is out of date on its own tooling advice is cited by section, at its own
> strength, and is never the reason a rule is a MUST.

**The default is a named field with explicit delegation:**

```go
type Server struct {
	log *slog.Logger      // named field: not promoted, not published
}

func (s *Server) Info(msg string, args ...any) {   // delegate only what you mean to offer
	s.log.Info(msg, args...)
}
```

`Source: the specification § Struct types, doc/go_spec.html @ go1.26.5, read 2026-07-26 — "A field
declared with a type but no explicit field name is called an embedded field... The unqualified type
name acts as the field name." A field declared WITH a name, as above, is not embedded and promotes
nothing. The delegation shape is this file's own.`

Three or four lines buy you a surface that is yours: you choose which methods exist, their names do not
change when the dependency's do, and replacing `*slog.Logger` later is an internal edit.

**Where embedding is genuinely right:** when the embedded API *should* be permanently public and you
intend to keep it — embedding `io.Reader` in a wrapper whose entire point is to be a reader. The cost
also disappears when there is no exported surface to pay it: embedding inside an **unexported** outer
type publishes nothing outside the package.

**Three traps worth naming:**

- **Hiding the field does not hide the method set.** An *unexported* embedded type still promotes its
  *exported* methods onto an exported outer type — promotion follows the method's own name, and
  [`convention.md`](convention.md) §3 quotes the specification's rule that a method name is what decides
  export. You get a hidden field and a public method.
- **A promoted method has the embedded type as its receiver**, so it can see nothing your outer type
  added — a promoted `String()` will not report your fields.
- **An embedded value carrying a `sync` type is copied when the outer value is copied**, which is H13's
  rule reaching you through a field you did not write.

## 6. When a type parameter is earned

**This file owns the generics decision alone.** H17 names four escape hatches; `unsafe`, `cgo`, and
reflection are [`interop.md`](interop.md)'s, and the type parameter is this section's.

The owner states the earning condition directly:

> "If you find yourself writing the exact same code multiple times, where the only difference between the
> copies is that the code uses different types, consider whether you can use a type parameter."
>
> *(Verbatim from `go.dev/blog/when-generics`, Ian Lance Taylor, **2022-04-12**, read 2026-07-25.)*

Read what that requires: **the same code, already written more than once, differing only in type.** Not
an anticipated second type, not a shape that "could be generic" — repeated code that exists.

**The counter-example the same page ships is the one that matters most, because it is the most common
misuse:**

```go
func ReadSome(r io.Reader) ([]byte, error)      // the interface version

func ReadSome[T io.Reader](r T) ([]byte, error) // the type-parameter version
```

`Source: https://go.dev/blog/when-generics, Ian Lance Taylor, 2022-04-12, re-read 2026-07-26 — both
signatures are transcribed from the page's § "Don't replace interface types with type parameters",
which introduces them as "it might be tempting to change the first function signature here, which uses
just an interface type, into the second version, which uses a type parameter."`

The page's verdict on that change is two sentences:

> "Don't make that kind of change. Omitting the type parameter makes the function easier to write,
> easier to read, and the execution time will likely be the same."
>
> *(Verbatim from the same page and date.)*

Read the cost claim at its stated strength: the page says the execution time will **likely** be the
same, not that performance is identical. So **a type parameter is not earned by replacing an interface
type** — H17 states that as a rule, and this is where it comes from. When a value is only ever used
through its methods, the interface is already the abstraction, and the type parameter adds inference,
constraint syntax, and error messages for nothing.

**The page opens with the ordering rule for the whole decision**, under its § *Write code* — it is the
first guideline on the page, not its conclusion:

> "write Go programs by writing code, not by defining types"
>
> and, two sentences later: "Start by writing functions."
>
> *(Verbatim from the same page and date. The two sentences are separated by one intervening sentence
> and are quoted separately for that reason. The page's **closing** guideline is the earning condition
> quoted above, under its § "One simple guideline".)*

**So the procedure is:** write the concrete version; write the second one when a second type actually
appears; then, if the two bodies are identical apart from the type, replace them with one type
parameter. The earned reason you write down at review is the *pair of functions that existed* — H17 asks
for a reason you can name, and "there were two identical copies" is one.

**What genuinely earns it, in practice:** containers and algorithms over element types the code never
inspects — the shape the standard `slices` and `maps` packages have. What does not: a single call site, a
constraint that ends up being `any`, or a type parameter that appears exactly once in the signature.

Type parameters are available far below the module floor, so no version gate applies here; the floor
itself resolves to [`modules-tooling.md`](modules-tooling.md) §9.

## 7. What this file points at

The P2 router sends two topics here that this file does **not** own, and three neighbouring decisions are
made next door. Each is named so the router lands on an answer.

| Routed or adjacent topic | Where it actually lives |
|---|---|
| **A package boundary or layout choice** — flat first, `internal/` early, `cmd/` for more than one binary, and the standing `pkg/` prohibition with its repudiation source | [`convention.md`](convention.md) §2, which owns package layout **alone**. This file states no part of it |
| **A channels-versus-mutex decision** | [`concurrency.md`](concurrency.md) §3, which owns it alone, with the `MutexOrChannel` quotations |
| `unsafe`, `cgo`, and reflection — the other three of H17's escape hatches | [`interop.md`](interop.md) §§1–3. This file owns only the type-parameter one |
| The error shape a signature returns — sentinel, typed, or formatted — and whether to wrap | [`errors.md`](errors.md) §§1–3 |
| Test doubles, and why an implementor-side interface is not how you get one | [`testing.md`](testing.md) §10 |
