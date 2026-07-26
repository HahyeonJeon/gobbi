# Go — Interop and Boundaries

**Ownership** — every boundary where Go leaves ordinary Go: `cgo`; `unsafe`; reflection; serialization
boundaries and `encoding/json` struct tags; generated code; subprocesses via `os/exec`; and the
filesystem path boundary.

**Split criterion** — `skill-writing` P4 (b): a long lookup reference. A reader opens it when a change
crosses one specific boundary, and reads only that section.

**Deepens, does not restate** — [`SKILL.md`](SKILL.md) Principle 8 (*clear is better than clever:
reflection, `unsafe`, `cgo`, and generics must each be earned*) and Rule **H17** (never reach for
`unsafe`, `cgo`, reflection, or a type parameter without a named earned reason). It is the P2 router
destination for *`cgo`, `unsafe`, reflection, build constraints and cross-compilation, generated code,
serialization, or a filesystem path boundary*. `SKILL.md` states the rule — each escape hatch needs a
reason you can name; this file states what each one actually costs and how to use it correctly when the
reason exists. Generics are the fourth hatch and are **not** here: `design.md` owns the earned-type-
parameter decision.

Build constraints and cross-compilation mechanics live in
[`modules-tooling.md`](modules-tooling.md) §6; this file covers only what `cgo` changes about them.
Every version number below resolves to the Version Currency Register in
[`modules-tooling.md`](modules-tooling.md) §9.

## Contents

1. [`cgo`](#1-cgo)
2. [`unsafe`](#2-unsafe)
3. [Reflection](#3-reflection)
4. [Serialization boundaries and `encoding/json`](#4-serialization-boundaries-and-encodingjson)
5. [Generated code](#5-generated-code)
6. [Subprocesses with `os/exec`](#6-subprocesses-with-osexec)
7. [The filesystem path boundary](#7-the-filesystem-path-boundary)

## 1. `cgo`

State the mechanics, and only the mechanics:

- **`cgo` is enabled by default for native builds.**
- **It is disabled by default when cross-compiling.**
- **Cross-compiling a package that uses it requires you to supply a C cross-compiler.**

*(Owner: `pkg.go.dev/cmd/cgo`, verified 2026-07-25. That page documents mechanics only and makes no
claim about portability cost.)*

So a `cgo` dependency turns a build-target change from a configuration flip into a toolchain decision:
the cross-compile that worked yesterday needs a C toolchain for the target today, and it needs one for
every target you ship. That is a real, checkable consequence, and it is the whole of what the owner
supports.

**Do not upgrade that into a claim that `cgo` makes cross-compilation impossible.** The owner states a
requirement — a C cross-compiler — not an impossibility, and any stronger causal claim is community
synthesis with no primary backing. A sharper cost framing exists and has a name: the Go proverb **"Cgo is not Go"**. Attribute it as what
it is — rhetoric expressing the language's values, **not** a normative source, and mutable: the proverb
list may be updated when the talk is next given. *(Owner: `go-proverbs.github.io`, read 2026-07-25.)*
Nothing here is a MUST on the proverb's authority.

**When the reason is genuinely earned** — an existing C library with no Go equivalent, a hardware or
platform API with no Go binding — write the reason down at the boundary, and keep the `cgo` surface in
one package so the rest of the module stays ordinary Go.

**Unverified:** the pointer-passing rules between Go and C (what may be stored where, and for how
long), the calling-overhead cost, and the build-time cost. All three are commonly asserted and none has
been fetched in either pass. **What would resolve each:** the first is a citation — `cmd/cgo`
§ *Passing pointers*, read at the pinned toolchain tag, where the rules are stated as a closed set. The
other two are **not** citations and must not be written as if a page could supply them: a calling
overhead and a build-time cost are measurements on your toolchain and target
([`performance.md`](performance.md) §1 owns measure-before-you-claim).

## 2. `unsafe`

`unsafe` is the one hatch whose cost is stated by its own owner: **it forfeits the Go 1 compatibility
promise.** *(Owner: `pkg.go.dev/unsafe`, verified 2026-07-25.)*

That is the whole argument. The promise is what lets a module compile unchanged across Go releases;
`unsafe` steps outside it, so a working program can stop working at the next toolchain upgrade with no
change of its own. Pair it with the promise's own scope: Go 1 compatibility is **source-level only**,
and binary compatibility is not promised at all. *(Owner: `go.dev/doc/go1compat`, verified 2026-07-25.)*

Consequences to apply when the reason is earned:

- **Confine it.** Keep every `unsafe` conversion inside one small, named function with the reason in
  its doc comment, so a reader finds the boundary instead of discovering it mid-file.
- **Re-verify it on every toolchain upgrade.** A construct outside the compatibility promise has no
  guarantee of surviving one, so the upgrade needs a test that exercises the conversion.
- **Never reach for it for convenience.** A conversion that only saves a copy is not an earned reason;
  measure first, and prefer the plain form (`performance.md`).

**Unverified:** the specific set of valid `unsafe.Pointer` conversion patterns and the rule that any
other conversion is invalid. The package documents a closed pattern set; neither pass fetched it, so no
pattern is reproduced here. **What would resolve it:** `pkg.go.dev/unsafe` § *Pointer*, read at the
pinned tag and transcribed in full — a partial transcription is worse than none, because the value of
the set is that it is closed. Read it before writing any conversion; reproducing the patterns from
memory is exactly the failure H10 exists to stop.

## 3. Reflection

Reflection defers to run time the checking the compiler was doing for you. Its own canonical
introduction closes with the position:

> reflection is "a powerful tool that should be used with care and **avoided unless strictly
> necessary**"
>
> *(*The Laws of Reflection*, Rob Pike, **2011-09-06**, `go.dev/blog/laws-of-reflection`, verified
> 2026-07-25. The date matters: it is one of Go's oldest published documents, and it is cited here for
> its closing judgment, not for current API detail.)*

The proverbs put the same judgment more bluntly — "Reflection is never clear" — as rhetoric, not as a
rule *(`go-proverbs.github.io`, read 2026-07-25)*.

> **Note which cost that is, and which cost has no owner.** Both sentences above are about **care and
> clarity**. **"Reflection is slow" is not a Go-team claim** — neither *The Laws of Reflection* nor
> `pkg.go.dev/reflect` states a performance cost, and the one Go-team performance sentence on the
> subject is in `go.dev/blog/gob`, which compares reflection to `unsafe`-based field access *inside a
> single encoder* and then records that `gob` dropped `unsafe` in Go 1.4 "with a modest performance
> drop" *(read 2026-07-26)*. So do not cite an owner for the speed claim. If reflection's cost matters
> to a decision, it is a benchmark ([`performance.md`](performance.md) §1), and the argument this file
> actually makes is the one below: reflection moves checking from compile time to run time.

**What reflection costs, concretely:** a type error that the compiler would have refused becomes a
run-time panic on a path a test may not execute; a rename that the compiler would have propagated
silently breaks a string-keyed lookup; and the code stops telling a reader what shapes it accepts.

**Where it is earned:** serialization of arbitrary user types, and a small number of framework
boundaries that must accept types they cannot name. In both cases the reflection sits in a library,
behind a typed API, and the caller never sees it. That is also the check to apply to your own code — if
reflection is visible in the signature, the abstraction is in the wrong place.

**The alternative to check first:** an interface the caller implements, or a type parameter. A type
parameter is earned by repeated identical code differing only in type, and it is **not** earned by
replacing an interface type — `design.md` owns that decision.

## 4. Serialization boundaries and `encoding/json`

A serialization boundary is an API. The field names on the wire outlive the struct that produced them,
so a struct tag is a published name, not a formatting detail. Treat renaming one as a breaking change.

Tags are a string literal on the field, and the JSON encoder reads the value under the `"json"` key:

```go
type Config struct {
    Name    string `json:"name"`
    Timeout int    `json:"timeout_seconds,omitempty"`
    secret  string // unexported: never encoded
}
```

`Source: https://pkg.go.dev/encoding/json (verified 2026-07-25) — the tag format string under the "json" key.`

Four behaviors decide most boundary bugs, all from that owner and all verified 2026-07-25:

- **`omitempty` has a defined, narrow meaning.** The empty values are "false, 0, a nil pointer, a nil
  interface value, and any array, slice, map, or string of length zero". It is **not** "the zero value
  of any type" — an empty struct is not empty by this definition, and a zero `time.Time` is not either.
  A field that must distinguish *absent* from *zero* needs a pointer or a wrapper type, not
  `omitempty`.
- **`-` always omits the field.** It is the explicit exclusion, and it is the right tool for a field
  that must never cross the boundary.
- **Unknown keys are ignored by default** when decoding. A payload with a misspelled field decodes
  successfully with that field left at its zero value, and nothing reports it.
- **`Decoder.DisallowUnknownFields` opts out** of that silence. Use it wherever an unrecognized key
  means a caller made a mistake — a configuration file, an internal API — and leave the default
  where forward compatibility with newer senders matters more.

**Unexported fields are never encoded**, which is why a boundary type is usually its own struct rather
than the domain type: the domain type's field names are yours to change, and the boundary type's are
not.

## 5. Generated code

Generated files are outputs, not sources. **Never hand-edit one** — the next generator run silently
discards the edit, and the discrepancy is invisible until behavior diverges from the input the
generator reads.

The rules that follow:

- **Fix the input or the generator**, never the output. This is the root-cause discipline — gobbi's
  behavioral principle 8 in the `principles` skill, not this skill's Principle 8 — applied to a build
  step.
- **Regenerate in the same change** that alters the input, and commit the result with it, so the tree
  is never internally inconsistent (P6 moves the whole affected set together).
- **Keep generated files out of review judgment** — review the input and the generator invocation; the
  output is evidence, not a design decision.

**Unverified:** the exact conventional header line that marks a file as generated, and the tooling that
recognizes it. The convention exists and is widely honored, but no owner page for its exact wording has
been fetched in either pass, so it is not reproduced here — and the wording is the whole point, since a
line that differs by a character is not recognized. **What would resolve it:** `go help generate` at
the pinned toolchain, and the go.dev page on generated-code comments — find that page from `go.dev`
rather than guessing its URL, because a plausible-looking citation is the defect this file is guarding
against. Copy the line from whichever of those you reach, never from another repository's file.

## 6. Subprocesses with `os/exec`

The single most important property of `os/exec`, and it is stated by the owner:

> "the os/exec package **intentionally does not invoke the system shell** and does not expand any glob
> patterns or handle other expansions, pipelines, or redirections typically done by shells."
>
> *(Verbatim from `pkg.go.dev/os/exec`, verified 2026-07-25.)*

Read it in both directions:

- **It removes a class of injection.** Arguments are passed as a list to the program, so shell
  metacharacters in an argument are just characters. The failure mode of a shell-string API — where
  untrusted input becomes syntax — does not exist here as long as you do not reintroduce it.
- **It also removes conveniences you may be assuming.** No glob expansion, no pipelines, no
  redirection, no variable expansion. Code that builds a command string containing `*`, `|`, or `>`
  gets those characters delivered literally to the program.

The rule that falls out: **do not reintroduce the shell.** Invoking `sh -c "<string built from
input>"` hands back exactly the injection surface the package removed. When you genuinely need a
pipeline, build it in Go — wire one command's output to the next through the process's own streams —
rather than delegating to a shell.

Two more boundary properties to design for, because a subprocess is an external process with its own
lifetime: give it a `Context` so cancellation reaches it, and decide what happens to its output before
you start it. A subprocess whose lifetime nobody owns is the same defect as a goroutine whose
termination nobody owns (this skill's Principle 3).

## 7. The filesystem path boundary

Building a path from untrusted input and then checking the result with string operations is the
long-standing source of path-escape bugs: cleaning a path and comparing prefixes is easy to get subtly
wrong, and symlinks defeat the check entirely.

`os.Root` and `os.OpenRoot` (Go **1.24**) replace that pattern with a directory-scoped handle: file
operations through the root cannot escape it. *(Owner: `go.dev/doc/go1.24`, verified 2026-07-25.
The version resolves to [`modules-tooling.md`](modules-tooling.md) §9, and 1.24 is below the
`go 1.25.0` floor, so it is available unqualified.)*

Use it at every boundary where a caller supplies part of a path. Keep hand-rolled cleaning and prefix
comparison out of new code — it is on the obsolete list in
[`modules-tooling.md`](modules-tooling.md) §10 for this reason.
