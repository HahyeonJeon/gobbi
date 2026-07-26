# Go — Convention

**Ownership** — package names and what a bad one admits; package layout, including `internal/`, `cmd/`,
and the standing prohibition on `pkg/`; the naming rules this skill can actually source; doc comments
and comment style; import grouping; and **`defer` semantics in full**, including the fact that Go has
no scope-bound release.

**Split criterion** — `skill-writing` P4 (b): a long lookup reference. A reader opens it mid-edit for
one answer — what to call this package, where this directory goes, when this `defer` runs — and leaves.

**Deepens, does not restate** — [`SKILL.md`](SKILL.md) Principle 8 (*clear is better than clever:
formatting is settled by a tool*) and Rules **H3** (keep every file `gofmt`-clean) and **H14** (never
create a `pkg/` directory or a `util`, `common`, or `misc` package), plus Procedure step P3's design
acts 1 (fix the package boundary) and 6 (name each resource's release path). It is the P2 router
destination for *naming a package, file, receiver, or error string; `defer` ordering; a map or nil-map
access; a build tag; doc comments; the formatter stance*. `SKILL.md` states the rules; this file states
the conventions underneath them — and §7 names every routed topic it does **not** own.

Every version token below — including the pinned `go1.26.5` toolchain tag this file reads the
specification against — resolves to the Version Currency Register in
[`modules-tooling.md`](modules-tooling.md) §9.

## Contents

1. [Package names](#1-package-names)
2. [Package layout](#2-package-layout)
3. [Identifiers, receivers, and file names](#3-identifiers-receivers-and-file-names)
4. [Doc comments and comment style](#4-doc-comments-and-comment-style)
5. [Import grouping](#5-import-grouping)
6. [`defer`, in full](#6-defer-in-full)
7. [What this file points at](#7-what-this-file-points-at)

## 1. Package names

**Short and lowercase.** A package name is written at every call site, so its cost is paid by every
reader of every caller rather than by its author. *(Owner: `go.dev/blog/package-names`, read
2026-07-25 — the same page H14 rests on.)*

**Never `util`, `common`, or `misc`** (H14). The parent states the rule; the deepening is what such a
name actually tells you: **it admits the boundary was never decided.** A package named for what it
provides can be described in one sentence, and its contents either belong or do not. A package named
`util` has no such test, so nothing is ever out of place in it, and it grows into the catch-all that
every other package imports. The fix is not a better catch-all name — it is to make the decision the
name was avoiding: name the package for the thing it provides, and if two unrelated things are inside,
that is two packages.

**Avoid stutter: `http.Server`, not `HTTPServer`.** The caller already writes the package name, so a
type that repeats it produces `http.HTTPServer` at every use.

> **Tier: this is the skill's own rule.** No owner sentence for the no-stutter convention was fetched
> in this pass. `go.dev/blog/package-names` is the likely owner and is one read away; until someone
> makes it, do not present this as a Go-team mandate.

**No `Get` prefix on a getter** — write `user.Name()`, not `user.GetName()`. This is **Google's
position**, and Google's guidance has three tiers that must not be flattened: the Style **Guide** is
normative *and* canonical for Google, **Decisions** is normative and *not* canonical, and **Best
Practices** is neither. The rule is on **Decisions** — the middle tier, *"normative but not canonical,
and…subordinate to the core style guide"* — and not on the Guide:

> "Function and method names should not use a `Get` or `get` prefix, unless the underlying concept
> uses the word 'get'… Prefer starting the name with the noun directly, for example use `Counts` over
> `GetCounts`."
>
> *(Verbatim from `google.github.io/styleguide/go/decisions`, verified 2026-07-26.)*

Read the exception, because it is the half people drop: a domain that genuinely says "get" — an HTTP
`GET`, a cache `Get` — keeps the word. Cite the tier every time. Citing two tiers at one URL and one
strength is the error [`modules-tooling.md`](modules-tooling.md) §8 exists to prevent.

## 2. Package layout

The order is fixed and each step is earned by the one before it (H14's fix, and P3 design act 1):

1. **Start flat.** One package at the module root is a complete module. Splitting before there is a
   boundary produces packages named after layers rather than responsibilities.
2. **Reach for `internal/` early, because the compiler enforces it.** A package under `internal/` is
   importable only from the tree rooted at that `internal/` directory's parent. It is the one layout
   decision in Go with a compiler behind it, which makes it the cheapest way to keep a surface private
   while you are still learning what the surface is. *(Owner: `go.dev/doc/modules/layout`, read
   2026-07-25.)*
3. **Add `cmd/` only when there is more than one binary.** With one binary, `main` at the root is
   simpler and loses nothing.

> **NEVER create a `pkg/` directory.** It comes from the community `golang-standards/project-layout`
> repository, and it was repudiated **by Russ Cox, in that repository's own issue tracker —
> `golang-standards/project-layout` issue #117, titled "this is not a standard Go project layout"**.
> The official page, `go.dev/doc/modules/layout`, never mentions `pkg/` at all. *(Both read
> 2026-07-25.)*

The source is named inside the rule deliberately. "`pkg/` is not standard" is the kind of claim a
reader has heard both ways, and a NEVER that cannot say who repudiated it, and where, is an assertion
rather than a rule. This file adds no exception to it: there is no size, no team shape, and no
migration path under which `pkg/` becomes correct here.

## 3. Identifiers, receivers, and file names

**What this file states, and why so little of it.** Package naming (§1), the no-`Get`-prefix rule,
exported-identifier form, and receiver naming and type are sourced below. **General** identifier naming
and file naming are **not**, in any material read for this skill, so they take the stated fallback and
are dropped rather than written from memory. That is a
deliberate omission, not an oversight: Google's Style Guide and `go.dev/doc/effective_go` § *Names*
are the two places to read, and a later pass that reads either can add the section with a citation.
Effective Go is admissible **for naming specifically** — H15 bars it for modules, generics, iterators,
errors, and tooling, and naming is none of those — but it announces in its own header that it is not
current, so cite it for the unchanged concept and cross-check anything else.

One fact the whole skill already rests on, and the specification states it exactly:

> "An identifier is exported if both: the first character of the identifier's name is a Unicode
> uppercase letter (Unicode character category Lu); and the identifier is declared in the package block
> or it is a field name or method name."
>
> *(Verbatim from the specification § Exported identifiers, `doc/go_spec.html` @ `go1.26.5`, verified
> 2026-07-26.)*

Read both halves of the conjunction. The case rule is the entire access-control mechanism — there is
no `private`, no `public`, and no per-consumer visibility — and the **second** clause is why a capital
letter inside a function body exports nothing: a local declaration is not in the package block. So a
capital letter at package scope, on a field, or on a method is an API decision, and the review question
at every new exported name is whether you are prepared to keep it.

**Receiver naming and the receiver-type decision** — both routed here by P2 — are **Google's Style
Decisions**, the middle tier (§1): normative, not canonical. Neither is on the Style Guide, and no
Go-team page was found for either.

- **Receiver names** are *"Short (usually one or two letters in length) / Abbreviations for the type
  itself / Applied consistently to every receiver for that type / Not an underscore; omit the name if
  it is unused."* So `c`, not `this`, not `self`, and not a different letter on the next method.
- **Receiver type** leads with a priority rather than a default: *"**Correctness wins over speed or
  simplicity.**… pick pointers for large types or as future-proofing… and use values for simple [plain
  old data]."*

*(Both verbatim from `google.github.io/styleguide/go/decisions`, verified 2026-07-26.)*

Note what that second quotation is **not**: it is not a blanket "when in doubt, use a pointer
receiver". It ranks correctness first and then splits on the type. One adjacent rule is sourced
elsewhere and decides the case it covers outright: a struct holding a `sync` type must use pointer
receivers throughout, because a value receiver copies the lock on every call (H13).

## 4. Doc comments and comment style

**A doc comment is API text.** It is the comment immediately preceding a package, type, function,
constant, or variable declaration, and it is what `go doc` renders — so it is read by people who never
open the file. That makes it the place where a contract that the signature cannot express belongs.

The parent already requires one such contract, and it is the model for the rest: **H8's fix says to say
in the doc comment whether a returned slice or map is shared or owned.** Nothing in the type says it,
no reader can infer it, and the caller's correctness depends on it. Apply the same test to anything
else a caller must know and cannot see — what a returned value aliases, what a `Context` cancels, and
which goroutine a callback runs on.

**The form, with the attribution kept straight — this is two owners at two strengths, not one rule.**

- **`go.dev/doc/comment`, "Go Doc Comments", is the owner page**, and its actual wording is softer than
  the rule people quote: doc comments for types and functions *"start with complete sentences naming
  the declared symbol"*, and *"For a package comment, that means the first sentence begins with
  'Package '."*
- **The blunt form — *"Comments should begin with the name of the thing being described and end in a
  period"* — is on `go.dev/wiki/CodeReviewComments`, not on `doc/comment`.** That page describes itself
  as *"a laundry list of common style issues, not a comprehensive style guide"*, so it is **weaker**
  authority than the owner page. Quote it as the sharper phrasing of the owner's rule, never as the
  owner's own sentence.

*(Both pages verified 2026-07-26.)*

One further convention read across that pair is worth applying because it is mechanical: *"Doc comments
typically use the phrase 'reports whether' to describe functions that return a boolean. The phrase 'or
not' is unnecessary."* The sentence was transcribed without recording which of the two pages carries
it, so cite it as "the doc-comment guidance" and confirm the page before attributing it to either.

Beyond those, this file adds no comment-style policy the parent does not have.

What is mechanical rather than conventional is already settled elsewhere: `gofmt` normalizes comment
formatting as part of formatting the file, and H3 makes every file `gofmt`-clean.

## 5. Import grouping

**Run `goimports`.** It formats the file and fixes the import block in one pass, which is H3's own
stated fix and the reason the import block is not usually a decision anyone makes by hand. P7 gate 2
wraps it as `test -z "$(goimports -l .)"`, because — like `gofmt -l` — it reports offending files on
stdout and still exits `0`, so the bare command can never fail a chain.

**The grouping convention has a Go-team owner, and what it actually fixes is the first group:**

> "Imports are organized in groups, with blank lines between them. The standard library packages are
> always in the first group."
>
> *(Verbatim from `go.dev/wiki/CodeReviewComments`, verified 2026-07-26.)*

Two qualifications, both worth carrying:

- **It is not the tool's rule.** `goimports`' own documentation says **nothing** about grouping — it
  documents the `-local` flag and nothing else on the subject — so the convention is a convention, and
  the tool preserves and sorts rather than mandates. *(Read at `golang.org/x/tools/cmd/goimports`,
  2026-07-26. Note the URL: `pkg.go.dev/cmd/goimports` is an **HTTP 404** — `goimports` is not in the
  Go distribution, and a citation pointing there is citing a page that does not exist.)*
- **Stricter variants exist at lower tiers.** `gofumpt` enforces its own rule that standard-library
  imports be in a separate group at the top, and Google's Style Decisions extends the split to four
  groups. Neither overrides the sentence above; both are what a specific tool or house adds to it.

So: follow whatever grouping the package already uses, keep the standard library first when you are
choosing, and let the tool keep the block sorted.

## 6. `defer`, in full

**`defer` runs at *function* return — not at the end of the enclosing block. Go has no scope-bound
release.** There is no destructor, no `using`, no `with`, and no block-scoped RAII of any kind. The
function boundary is the only release boundary the language gives you. *(The specification owns
`defer`'s accumulation to function return — "invoked immediately before the surrounding function
returns" — and is quoted in full below at `go1.26.5`, verified 2026-07-26; `SKILL.md` P3 design act 6
carries the same clause.)*

**The consequence that bites is a `defer` inside a loop:** it accumulates. A loop that opens a
resource per iteration and defers its release holds every one of them until the whole function returns
— which, in a loop over a few thousand paths, is a file-descriptor exhaustion bug that reads like
correct code.

The fix is to make the release boundary explicit by making it a function boundary:

```go
func scanAll(paths []string) error {
	for _, p := range paths {
		if err := scanOne(p); err != nil {
			return err
		}
	}
	return nil
}

func scanOne(p string) error {
	f, err := os.Open(p)
	if err != nil {
		return err
	}
	defer f.Close()          // released when scanOne returns — once per path
	return scan(f)
}
```

`Source: the specification § Defer statements, doc/go_spec.html @ go1.26.5, verified 2026-07-26 —
"deferred functions are invoked immediately before the surrounding function returns", quoted in full
below. That one clause is what makes the two-function split the fix; the shape of the split is this
file's own.`

Written as a single function with the `defer` inside the loop, every handle stays open until `scanAll`
returns. Written as two, each one closes at the end of its own iteration. Nothing else changed.

**Three further semantics, which decide most `defer` surprises:**

- **Arguments are evaluated when the `defer` statement executes**, not when the deferred call runs. So
  `defer log(err)` captures the value of `err` at the `defer` line — usually nil. Deferring a closure
  (`defer func() { log(err) }()`) captures the variable instead, and reads it at return.
- **Deferred calls run last-added-first-called** — the reverse of registration order, which is what
  makes acquire-then-defer-release nest correctly without any thought.
- **A deferred function can read and modify named result parameters** after the `return` statement has
  set them. This is the mechanism behind converting a recovered panic into a returned error;
  [`errors.md`](errors.md) §8 owns the `panic` / `recover` boundary itself.

**All three are the specification's, read at the pinned tag.** § *Defer statements* states them in
these words:

> "Each time a 'defer' statement executes, the function value and parameters to the call are evaluated
> as usual and saved anew but the actual function is not invoked. Instead, deferred functions are
> invoked immediately before the surrounding function returns, in the reverse order they were deferred.
> That is, if the surrounding function returns through an explicit return statement, deferred functions
> are executed after any result parameters are set by that return statement but before the function
> returns to its caller."
>
> "the deferred function may access and modify the result parameters before they are returned. If the
> deferred function has any return values, they are discarded."
>
> *(Verbatim from the specification § Defer statements, `doc/go_spec.html` @ `go1.26.5`, verified
> 2026-07-26.)*

Three readings the bullets above depend on: *"evaluated as usual and saved anew"* is the
argument-evaluation timing; *"in the reverse order they were deferred"* is the last-added-first-called
order; and *"after any result parameters are set…but before the function returns to its caller"* is the
window in which a deferred function can still change a named result. The final sentence closes a
common misreading — **a deferred function's own return values are discarded**, so a `defer` cannot
report anything by returning it.

**A fourth clause decides when a nil deferred value panics:**

> "If a deferred function value evaluates to nil, execution panics when the function is invoked, not
> when the 'defer' statement is executed."
>
> *(Same section, same tag, verified 2026-07-26.)*

So `defer f()` with a nil `f` registers cleanly and blows up at return — the failure surfaces at the
function boundary, far from the line that caused it.

## 7. What this file points at

The P2 router sends several topics here that this file does not own. Each one is named so that a
reader who followed the router arrives at an answer rather than at a silence.

| Routed topic | Where it actually lives |
|---|---|
| **Error-string form** — capitalization, trailing punctuation, and their exceptions | [`errors.md`](errors.md) §5, which owns it **alone**. This file states no part of the rule, not even in summary |
| A build tag — `//go:build` and the retired `// +build` | [`modules-tooling.md`](modules-tooling.md) §6, with the version in §9 |
| The formatter stance — `gofmt` versus `gofumpt`, and where the mandate comes from | [`modules-tooling.md`](modules-tooling.md) §7 for the tools; H3 and P7 gates 1–2 for the mandate and how it fails a chain |
| Interface placement, embedding, and the useful zero value | [`design.md`](design.md) §§2, 3, 5 |

**Two routed topics have no owner in this tree, and this file will not invent one.** Both are recorded
here so the P2 router lands on a stated gap rather than on a silence, and the router row names them as
open.

- **A map or nil-map access.** Two items were specified for it — that map iteration order is
  unspecified and varies between runs, and the asymmetry between reading from a nil map and writing to
  one — and **neither was fetched in this pass, so neither is stated.** `go.dev/ref/spec` § *Map types*
  at the pinned tag would resolve both, and the aliasing property of map values is separately owned by
  [`SKILL.md`](SKILL.md) H8, which quotes the specification directly.
- **File naming.** §3 states why: no material read for this skill sources it, so it takes the stated
  fallback and is dropped rather than written from memory. Google's Style Guide and
  `go.dev/doc/effective_go` § *Names* are the two places to read.
