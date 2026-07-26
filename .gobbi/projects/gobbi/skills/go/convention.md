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
Practices** is neither. **Unverified:** which of those pages carries the getter rule. The attribution
to Google is sourced; the subpage is not, so read the page before quoting a sentence from it — citing
two tiers at one URL and one strength is the error [`modules-tooling.md`](modules-tooling.md) §8 exists
to prevent.

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

**What this file states, and why so little of it.** Package naming (§1) and the no-`Get`-prefix rule
are sourced. General identifier naming and file naming are **not**, in any material read for this
skill, so they take the stated fallback and are dropped rather than written from memory. That is a
deliberate omission, not an oversight: Google's Style Guide and `go.dev/doc/effective_go` § *Names*
are the two places to read, and a later pass that reads either can add the section with a citation.
Effective Go is admissible **for naming specifically** — H15 bars it for modules, generics, iterators,
errors, and tooling, and naming is none of those — but it announces in its own header that it is not
current, so cite it for the unchanged concept and cross-check anything else.

One fact needs no fetch because the whole skill already rests on it: **an identifier is exported if and
only if its first character is upper case.** That is the entire access-control mechanism — there is no
`private`, no `public`, and no per-consumer visibility. So a capital letter is an API decision, and the
review question at every new exported name is whether you are prepared to keep it. *(The
specification § Exported identifiers owns this; it was not re-read at the pinned `go1.26.5` tag in
this pass.)*

**Unverified:** receiver naming and the receiver-type decision, both of which the P2 router sends here
— that a receiver is a short abbreviation of its type rather than `this` or `self`, that a type's
methods should not mix value and pointer receivers, and the "when in doubt, use a pointer receiver"
default. No owner sentence was fetched for any of the three in this pass; `go.dev/wiki/CodeReviewComments`
§ *Receiver Names* and § *Receiver Type* would resolve all of them. One adjacent rule **is** already
sourced and stands on its own: a struct holding a `sync` type must use pointer receivers throughout,
because a value receiver copies the lock on every call (H13).

## 4. Doc comments and comment style

**A doc comment is API text.** It is the comment immediately preceding a package, type, function,
constant, or variable declaration, and it is what `go doc` renders — so it is read by people who never
open the file. That makes it the place where a contract that the signature cannot express belongs.

The parent already requires one such contract, and it is the model for the rest: **H8's fix says to say
in the doc comment whether a returned slice or map is shared or owned.** Nothing in the type says it,
no reader can infer it, and the caller's correctness depends on it. Apply the same test to anything
else a caller must know and cannot see — what a returned value aliases, what a `Context` cancels, and
which goroutine a callback runs on.

**Unverified — the form itself.** The conventions for writing doc comments (the sentence that begins
with the name of the thing being documented, the list and heading syntax, the linking syntax) are owned
by `go.dev/doc/comment`, "Go Doc Comments", which was not fetched in this pass. No form rule is stated
here, and the same applies to general comment style: this file adds no comment-style policy the parent
does not have, because it has no source for one. Read the owner page before writing a house rule for
either.

What is mechanical rather than conventional is already settled elsewhere: `gofmt` normalizes comment
formatting as part of formatting the file, and H3 makes every file `gofmt`-clean.

## 5. Import grouping

**Run `goimports`.** It formats the file and fixes the import block in one pass, which is H3's own
stated fix and the reason the import block is not usually a decision anyone makes by hand. P7 gate 2
wraps it as `test -z "$(goimports -l .)"`, because — like `gofmt -l` — it reports offending files on
stdout and still exits `0`, so the bare command can never fail a chain.

**Unverified:** the grouping convention itself — the widely used split of standard-library imports from
everything else, separated by a blank line — and whether `goimports` produces that split or merely
preserves one it finds. No owner was read for either claim in this pass;
`pkg.go.dev/golang.org/x/tools/cmd/goimports` would resolve the tool's behavior, and Google's Style
Guide is the likely owner of the convention. Follow whatever grouping the package already uses, and let
the tool keep the block sorted.

## 6. `defer`, in full

**`defer` runs at *function* return — not at the end of the enclosing block. Go has no scope-bound
release.** There is no destructor, no `using`, no `with`, and no block-scoped RAII of any kind. The
function boundary is the only release boundary the language gives you. *(The specification owns
`defer`'s accumulation to function return; `SKILL.md` P3 design act 6 carries the same clause, verified
2026-07-25.)*

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

> **Unverified:** all three clauses immediately above, plus the timing of the panic when the deferred
> value is nil. The specification § *Defer statements* is the owner of every one of them, and it was
> **not** read at the pinned `go1.26.5` tag in this pass — only the accumulation-to-function-return
> clause above carries an owner and a date, through `SKILL.md`. Read `doc/go_spec.html` at that tag
> before quoting any of the four, and do not reproduce the specification's own example from memory.

## 7. What this file points at

The P2 router sends several topics here that this file does not own. Each one is named so that a
reader who followed the router arrives at an answer rather than at a silence.

| Routed topic | Where it actually lives |
|---|---|
| **Error-string form** — capitalization, trailing punctuation, and their exceptions | [`errors.md`](errors.md) §5, which owns it **alone**. This file states no part of the rule, not even in summary |
| A build tag — `//go:build` and the retired `// +build` | [`modules-tooling.md`](modules-tooling.md) §6, with the version in §9 |
| The formatter stance — `gofmt` versus `gofumpt`, and where the mandate comes from | [`modules-tooling.md`](modules-tooling.md) §7 for the tools; H3 and P7 gates 1–2 for the mandate and how it fails a chain |
| Interface placement, embedding, and the useful zero value | `design.md`, when it is written |

**One routed topic has no owner yet, and this file will not invent one.** The router also sends *a map
or nil-map access* here. Two items were specified for it — that map iteration order is unspecified and
varies between runs, and the asymmetry between reading from a nil map and writing to one — and
**neither was fetched in this pass, so neither is stated.** `go.dev/ref/spec` § *Map types* at the
pinned tag would resolve both, and the aliasing property of map values is separately owned by
`SKILL.md` H8, which quotes the specification directly.
