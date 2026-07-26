# Go — Modules and Tooling

**Verified:** 2026-07-25 against https://go.dev/doc/go1.26 — every other number in this file carries its
own owner and date in §9's Version Currency Register.

**Ownership** — the `go.mod` contract and the `go` line as a semantics switch; the module floor versus
the toolchain version; the GODEBUG chain; minimal version selection, `go.sum`, `replace` / `exclude`,
and vendoring; the `tool` directive; build constraints and cross-compilation; `go vet`, golangci-lint,
`govulncheck`, and `go fix`; the currency method this skill's citations follow; **the Version Currency
Register**, which every version number the skill asserts must resolve to; and the obsolete-guidance
table with a floor-availability qualifier on every row.

**Split criterion** — `skill-writing` P4 (b): a long lookup reference. A reader opens it for one fact
(which floor, which linter default, which version) and leaves.

**Deepens, does not restate** — [`SKILL.md`](SKILL.md) Principle 1 (*the `go` line is a semantics
switch, not metadata*) and Rules **H1** (read `go.mod` first; floor versus toolchain), **H2** (full
`go vet` separate from `go test`), **H10** (cite the primary owner and a date for every version claim),
**H18** (`go.sum` is not a lockfile; `replace` / `exclude` are main-module-only), and **H19** (never
teach a symbol above the floor as if it were available there). It is the P2 router destination for
*`go.mod` or `go.work`, the `go` / `toolchain` / `godebug` lines, dependency selection, vendoring, the
linter configuration, `go fix`, `govulncheck`, or any version claim*. `SKILL.md` states the rules; this
file states the mechanism and holds the numbers.

## Contents

1. [The `go.mod` contract](#1-the-gomod-contract)
2. [The module floor versus the toolchain version](#2-the-module-floor-versus-the-toolchain-version)
3. [GODEBUG: the compatibility dial](#3-godebug-the-compatibility-dial)
4. [Selection: MVS, `go.sum`, `replace`, vendoring](#4-selection-mvs-gosum-replace-vendoring)
5. [The `tool` directive](#5-the-tool-directive)
6. [Build constraints and cross-compilation](#6-build-constraints-and-cross-compilation)
7. [The verification tools](#7-the-verification-tools)
8. [The currency method](#8-the-currency-method)
9. [The Version Currency Register](#9-the-version-currency-register)
10. [Obsolete forms, floor-checked](#10-obsolete-forms-floor-checked)

## 1. The `go.mod` contract

`go.mod` declares the module path, the language floor, and the dependency requirements. Read it before
you design, because it decides which semantics your source compiles under (H1).

The `go` line is the switch. It has four consequences, and none of them is cosmetic:

- **It is a strict minimum, not an advisory.** Since Go 1.21 a toolchain older than the `go` line
  refuses the build rather than trying anyway. *(Owner: `go.dev/doc/go1.21`, read 2026-07-25.)*
- **It gates language semantics.** Loop variables became per-iteration in Go 1.22, and a module still
  declaring an older floor keeps the old shared-variable behavior. *(Owners: `go.dev/doc/go1.22` and
  `go.dev/ref/spec`, read 2026-07-25.)*
- **It selects GODEBUG defaults** — see §3. *(Owner: `go.dev/doc/godebug`, read 2026-07-25.)*
- **It bounds the standard-library surface** the toolchain will accept: `go vet`'s `stdversion`
  analyzer reports a symbol used below the version that introduced it. *(Owner: `pkg.go.dev/cmd/vet`,
  read 2026-07-25.)*

The same source therefore has two different meanings under two different `go` lines. That is why H1
makes reading it the first act of P1, ahead of the code.

## 2. The module floor versus the toolchain version

Two numbers, two jobs. Conflating them produces guidance that does not compile.

| | What it is | What it gates |
|---|---|---|
| **Module floor** | the `go` line in `go.mod` | language semantics, GODEBUG defaults, the accepted standard-library surface |
| **Toolchain version** | the `go` binary that runs | which commands exist, which `go fix` analyzers exist, which releases are supported |

Do not hand-set the floor. Let `go mod init` write it, because the toolchain already knows what it
should be:

> "Running `go mod init` using a toolchain of version `1.N.X` will create a `go.mod` file specifying
> the Go version `go 1.(N-1).0`."
>
> *(Verbatim from the Go 1.26 release notes, `https://go.dev/doc/go1.26`, read 2026-07-25.)*

The same note continues that pre-release versions of `1.N` write `go 1.(N-2).0`, and states the intent:
to encourage modules compatible with currently supported versions of Go. On today's `go1.26.5`
toolchain the result is **`go 1.25.0`** — but the numeral follows the toolchain, so it moves. Never
copy the number out of this file; read what `go mod init` actually wrote. Raise the floor only for a
named feature, with `go get go@<version>`, which the same note names as the follow-up command.

**Unverified:** the `toolchain` directive's selection and upgrade rules, and `go.work` workspace
semantics. **What would resolve it:** the Go Modules Reference (`go.dev/ref/mod`) §§ *Go toolchains*
and *Workspaces*. Both passes read that page — for the selection facts in §4 — and neither read those
two sections, so this is an unresearched gap, not an unsourceable one: the owner is known, reachable,
and one read away. Until someone makes that read, this file states nothing about either beyond the
floor facts above.

## 3. GODEBUG: the compatibility dial

A GODEBUG setting restores an older behavior when a Go release changes one. The resolution chain runs
**toolchain defaults → the `go` line in `go.mod` → a `//go:debug` directive**, each overriding the one
before it. `go.mod` also accepts a `godebug (…)` block, added in 1.23.

Settings added for compatibility are maintained "for a minimum of two years (four Go releases)". That
is a floor, not a schedule: the page says some settings, "such as `http2client` and `http2server`, will
be maintained much longer, even indefinitely" — and it names only those two. Every other setting,
including `panicnil`, carries the minimum and nothing more. Do not read a 1.21-era example as a
permanent one; check the page before depending on any single setting still existing.
*(Owner: `go.dev/doc/godebug`, read 2026-07-25.)*

Pair that page with the compatibility promise itself, because the promise page does not mention
GODEBUG: Go 1 compatibility is **source-level only**, and binary compatibility is not promised.
*(Owner: `go.dev/doc/go1compat`, read 2026-07-25.)*

## 4. Selection: MVS, `go.sum`, `replace`, vendoring

Go selects dependency versions by **minimal version selection**: for each module, the build takes the
highest version anyone in the graph explicitly required, and nothing newer. Four consequences the
Modules Reference states, all read 2026-07-25 at `go.dev/ref/mod`:

- **There is no lockfile.** MVS is deterministic from the requirement graph alone, so no separate
  selection file exists. `go.sum` records **integrity hashes** for module content — it does not choose
  versions. Calling it "the lockfile" is a category error: it answers *is this the bytes I expected*,
  never *which version do I build*.
- **`replace` and `exclude` are main-module-only.** They are "ignored in other modules". A library that
  ships one gets no downstream effect from it, so express a real requirement with `require` and keep
  `replace` for local development in a main module (H18).
- **Vendoring activates silently.** When a `vendor/` directory exists and the module declares `go 1.14`
  or higher, the go command uses it automatically — no flag, no message. A stale `vendor/` therefore
  becomes the build without anyone choosing it. Check for the directory during P1.
- **`-mod=readonly` is the default** since 1.16: a build that would need to edit `go.mod` fails instead
  of editing it.

## 5. The `tool` directive

Declare a build-time tool dependency in `go.mod` with the `tool` directive (1.24), add one with
`go get -tool`, and run it with `go tool`. This replaced the older blank-import file convention, which
is obsolete — see §10. *(Owner: `go.dev/doc/go1.24`, read 2026-07-25.)*

## 6. Build constraints and cross-compilation

A build constraint restricts which files a build includes. The current form is the `//go:build` line,
which replaced the older `// +build` comment form in 1.17 (§10).

Cross-compilation is a build-target choice: set `GOOS` and `GOARCH` for the `go build` invocation. It
is P7 gate 10 whenever a change ships for another platform.

One interaction belongs here because it decides whether that gate can pass at all: **cgo is enabled by
default for native builds and disabled by default when cross-compiling, and cross-compiling with it
requires a C cross-compiler.** *(Owner: `pkg.go.dev/cmd/cgo`, read 2026-07-25 — it documents mechanics
only.)* So a package that needs cgo needs a toolchain decision, not a flag flip. The escape-hatch
depth, including what `unsafe` and cgo cost you, lives in the interop child.

**Unverified:** the `//go:build` expression syntax, the `_GOOS` / `_GOARCH` filename-suffix rule, and
the exact `GOOS` / `GOARCH` value sets. No owner page for these has been fetched in either pass, and Go
facts written from memory are what H10 exists to stop. **What would resolve it:** `go help
buildconstraint` for the first two and `go help environment` for the third, both run on the pinned
toolchain — these are `go help` topics rather than web pages, so a fetch cannot answer them and a
rendered page must not be substituted (§8). Do not reach for `go tool dist list` here either; it has
not been verified.

## 7. The verification tools

**`go vet` ships 35 analyzers. `go test` runs 11 of them.** The go command's doc comment says ten; the
array it actually executes has eleven. Trust the array.

- The executed set is `var defaultVetFlags` in `src/cmd/go/internal/test/test.go` at the pinned
  `go1.26.5` tag: `atomic`, `bool`, `buildtags`, `directive`, `errorsas`, `ifaceassert`, `nilfunc`,
  `printf`, **`slog`**, `stringintconv`, `tests`.
- The doc prose in the *same file* still reads: "Only a high-confidence subset of the default go vet
  checks are used. That subset is: atomic, bool, buildtags, directive, errorsas, ifaceassert, nilfunc,
  printf, stringintconv, and tests." The framing is accurate and citable; the list drifted when `slog`
  was added. Quote the framing, not the list.
- The design point is unchanged and strengthened by the drift: `copylocks` and `lostcancel` sit outside
  the subset either way, so **"the tests pass" is not "vet passed"** (H2). Run `go vet ./...` as its own
  P7 gate.

*(Owners: `pkg.go.dev/cmd/vet` for the 35, and the pinned `go1.26.5` source file for the 11, both read
2026-07-25. Check names differ between the vet flag and the analyzer package in both directions — the
flag `-buildtags` against the analyzer `buildtag`, the flag `-bool` against the analyzer `bools` — so
there is no rule to apply. Copy the spelling from the surface you are addressing.)*

**golangci-lint v2.12.2.** Its default linter set is exactly five: `errcheck`, `govet`, `ineffassign`,
`staticcheck`, `unused`. That was read from the five `GroupStandard` registrations in
`pkg/lint/lintersdb/builder_linter.go` at the `v2.12.2` tag, because the published docs render an
unfilled template placeholder. `gosimple` and `stylecheck` no longer exist as separate linters in v2 —
they were folded into `staticcheck`, and both names occur zero times in the v2 source. A v2
configuration requires `version: "2"`.

**staticcheck v0.7.0 (release 2026.1).** A `2026.2rc1` prerelease exists; the module proxy's `@latest`
excludes prereleases, so `go install …@latest` gives v0.7.0. Record the stable one.

**gofumpt v0.10.0** is opt-in and stricter than `gofmt`; `gofmt` remains the invariant (H3).

**`govulncheck`** is symbol-reachability-based — it reports a vulnerability only when your build
actually reaches the affected symbol — and it is **not** integrated into `go` or `go vet`, so it runs
only when you run it (P7 gate 9). *(Owner: `go.dev/security/vuln/`, read 2026-07-25.)*

**`go fix`** was revamped in Go 1.26 as the home of the modernizers. It is gated on the **installed
toolchain** being 1.26 or newer, **not** on the module floor — a `go 1.25.0` module built with a 1.26
toolchain can run it. *(Owner: `go.dev/doc/go1.26`, read 2026-07-25.)*

## 8. The currency method

These rules are how this skill's version claims were produced, and how to re-produce them. They were
each learned by a fetch that returned a confident wrong answer.

- **Pin the tag.** A default-branch path and an HTTP 200 are assumptions, not currency guarantees. Two
  live instances from 2026-07-25: golangci-lint's `master` branch returns **v1-era content at HTTP
  200** — no `GroupStandard` at all, a six-linter default set, `gosimple` present — because the live
  branch is `main`; and Prometheus' `main/CHANGELOG.md` is stale by a full minor while the tagged copy
  is correct. Nothing errors. You simply get the wrong answer.
- **Read the source file when exact wording is load-bearing — at the same version you are citing.**
  This skill's own retracted finding is the worked example. An earlier pass reported that `pkg.go.dev`
  had *dropped* a clause from `testing.T.Parallel` which the source carried. Re-checked on 2026-07-25,
  it had not: the clause is in `src/testing/testing.go` on `master` (tip), is **not** in the file at
  the released `go1.26.5` tag, and `pkg.go.dev` renders identically to the released tag. The finding
  was a **tip source read against a released rendering** — the exact comparison the pin-the-tag rule
  above forbids, committed while applying it. A wording difference between two surfaces is not
  evidence that one dropped something until both are read at the same version. Re-confirmed
  2026-07-26: the comment at `go1.26.5` is two sentences and carries no pause clause, which is what
  [`testing.md`](testing.md) §2 now quotes.
- **Treat a rendered-page summary as a lead, not a citation — it can manufacture the support you are
  checking for.** A 2026-07-26 fetch of `pkg.go.dev/net/http/pprof` returned a confident, formatted
  **"Security Warning: never expose on a public or internet-facing interface."** That text does not
  exist: a grep of `src/net/http/pprof/pprof.go` at `go1.26.5` for `public`, `internet`, `security`,
  `untrusted`, `expose`, and `sensitive` matches only an unrelated internal comment. A verification
  sweep that fetches rendered pages can therefore confirm a citation that was never written. **Verify
  wording against source or raw docs**, and see [`performance.md`](performance.md) §1 for how the
  claim is stated once the owner turns out not to carry it.
- **A rendered package page can also advertise what a stock build does not have.** `runtime/pprof`'s
  documentation lists the `goroutineleak` profile unconditionally, while the code registers it only
  under `if goexperiment.GoroutineLeakProfile` — so presence on `pkg.go.dev` is not availability.
  Check the registration, not the prose, before teaching a symbol as usable.
- **A plausible URL is not an existing URL.** `pkg.go.dev/cmd/goimports` returns **HTTP 404**;
  `goimports` is not in the Go distribution, and its real path is `golang.org/x/tools/cmd/goimports`.
  Fetch a citation's URL before writing it down — inventing the path a tool "should" live at is the
  same failure as inventing its content. *(Checked 2026-07-26.)*
- **Never take a date from a rendered releases listing.** Two of eleven verification fetches returned
  wrong years from rendered GitHub `/releases` pages; the raw `CHANGELOG.md` and the module proxy
  agreed with each other against them. Dates in §9 come from the proxy or a raw changelog.
- **Cite a per-symbol "added in", never a package-level version.** `pkg.go.dev` badges only symbols
  added *after* the package was introduced, so an **unbadged** symbol means "shipped with the package",
  not "version unknown". `slices.Sort` and `slices.Contains` carry no badge, which is why `slices` is
  Go 1.21 and not something older.
- **"Latest" is not a currency signal.** A frozen, abandoned module renders as the latest version
  forever, because module metadata carries no deprecation state. A healthy-looking module page cannot
  clear a staleness question; only the owner's own notice can.

## 9. The Version Currency Register

**Scope — what this register owns, and what it deliberately does not.** This register holds every
**Go and Go-toolchain** figure the skill asserts: Go release versions and dates, module-floor numerals,
the pinned toolchain tag, the version that introduced a standard-library symbol or a `go` subcommand,
and the versions of the Go-toolchain-adjacent tools this skill names (`golangci-lint`, `staticcheck`,
`gofumpt`, `testify`). Other files point at this table rather than restating any of those numbers.

**A per-tool SDK, module, or wire-API version belongs to its tool child, not here.** Each of the five
tool children carries its own dated `**Version / support status:**` header line with an owner URL, and
that line is the single owner of every version figure inside that file — `aws-sdk-go-v2` and
`smithy-go`, `moby/moby` `client` and `api` (including `MinAPIVersion` and `MaxAPIVersion`),
`grpc-go`, `client-go` and `controller-runtime`, `client_golang` and `opentelemetry-go`. **The reason
is that those five move on five independent clocks:** centralising them here would create one file that
is stale five different ways, and would put the number a reader needs one hop away from the delta it
qualifies. Sweep `V3` reads a tool child's own header line as the resolution for that file's SDK
figures, and this table as the resolution for everything else.

**One numeral sits outside both** and is named here so it is not an orphan: the proxy answer for the
**deprecated, do-not-start-new-code-on-it** `github.com/docker/docker` module, quoted in
[`service-clients.md`](service-clients.md) §12. That
file carries its own dated `**Verified:**` stamp against exactly that module page, which is the
numeral's owner, and §12 marks it as evidence of a trap rather than a version this skill teaches.

Each row carries its own verification date in the last column — most are
**2026-07-25**, and a second pass added or re-read the rows dated **2026-07-26**. Dates in the value
column come from the module proxy or a raw changelog, never from a rendered releases page (§8). §10's
table is part of this register: each row there names its introducing version, and the release notes for
that version are its owner.

| Claim | Value | Owner | Verified |
|---|---|---|---|
| Current toolchain | `go1.26.5`, released **2026-07-07** | `https://go.dev/VERSION?m=text` for the version; `go.dev/doc/devel/release` for the release date | 2026-07-25 |
| Go 1.26.0 general availability | 2026-02-10 | `go.dev/doc/devel/release` | 2026-07-25 |
| Supported release lines | 1.26 and 1.25 (`go1.25.12` current on the 1.25 line); a release is supported until there are two newer major releases | `go.dev/doc/devel/release` | 2026-07-25 |
| Floor a new module gets today | `go 1.25.0` (follows the toolchain — §2) | `go.dev/doc/go1.26` | 2026-07-25 |
| Go 1.27 | **not yet released**; its notes are a DRAFT and can still change | `go.dev/doc/go1.27` | 2026-07-25 |
| `go vet` analyzers | 35 | `pkg.go.dev/cmd/vet` | 2026-07-25 |
| Vet checks `go test` runs | 11 | `src/cmd/go/internal/test/test.go` @ `go1.26.5` | 2026-07-25 |
| golangci-lint | v2.12.2 (2026-05-06) | module proxy | 2026-07-25 |
| golangci-lint default linters | exactly 5 | `pkg/lint/lintersdb/builder_linter.go` @ `v2.12.2` | 2026-07-25 |
| staticcheck | v0.7.0 / 2026.1 (2026-02-13) | module proxy | 2026-07-25 |
| gofumpt | v0.10.0 (2026-05-04) | module proxy | 2026-07-25 |
| testify | v1.11.1 (2025-08-27) | module proxy | 2026-07-25 |
| `gob` stopped using `unsafe` | Go 1.4 — "As of Go 1.4, package unsafe is no longer use by the gob package, with a modest performance drop" | `go.dev/blog/gob` | 2026-07-26 |
| `errors.Is`, `errors.As`, `Unwrap`, and the `%w` verb | Go 1.13 — the release the *Working with Errors* post is named for; absent at `go1.12.17`, present at `go1.13`. Far below the floor, so all four are safe unqualified | `go.dev/doc/go1.13`, `src/errors/wrap.go` @ `go1.13` | 2026-07-26 |
| Automatic vendoring when a `vendor/` directory exists | `go 1.14` or higher — "At `go 1.14` or higher, automatic vendoring may be enabled" | `go.dev/ref/mod` | 2026-07-26 |
| `-mod=readonly` as the default | 1.16 | `go.dev/ref/mod` | 2026-07-25 |
| `//go:build` constraint form | 1.17 | `go.dev/doc/go1.17` | 2026-07-25 |
| Typed `sync/atomic` values (`atomic.Int64`, `atomic.Bool`, `atomic.Pointer`) | **Go 1.19** — below the floor, safe to teach unqualified | `pkg.go.dev/sync/atomic` per-symbol badges | 2026-07-25 |
| `errors.Join`; `fmt.Errorf` with multiple `%w` | 1.20 | `go.dev/doc/go1.20` | 2026-07-25 |
| `go` line as a strict minimum; `panic(nil)` yielding `*runtime.PanicNilError` | 1.21 | `go.dev/doc/go1.21`, `go.dev/doc/godebug` | 2026-07-25 |
| `slices` package | **Go 1.21** (unbadged symbols — §8) | `pkg.go.dev/slices` | 2026-07-25 |
| Per-iteration loop variables; `math/rand/v2`; `for i := range n` | 1.22 | `go.dev/doc/go1.22` | 2026-07-25 |
| `godebug (…)` block in `go.mod` | 1.23 | `go.dev/doc/godebug` | 2026-07-25 |
| `tool` directive; `b.Loop()`; `os.Root` / `os.OpenRoot` | 1.24 | `go.dev/doc/go1.24` | 2026-07-25 |
| `testing/synctest` | **go1.25.0** | `pkg.go.dev/testing/synctest` | 2026-07-25 |
| `wg.Go(f)`; container-aware `GOMAXPROCS` | 1.25 | `go.dev/doc/go1.25` | 2026-07-25 |
| `errors.AsType` | **go1.26.0 — above the `go 1.25.0` floor** | `go.dev/doc/go1.26`, `pkg.go.dev/errors` | 2026-07-25 |
| `goroutineleak` profile | **Go 1.26, and an EXPERIMENT** — requires `GOEXPERIMENT=goroutineleakprofile` at build time; the notes aim to enable it by default in 1.27, which is **not yet released** and whose notes are a draft | `go.dev/doc/go1.26` | 2026-07-26 |
| `go fix` as the modernizer home; `go doc` as the surviving doc command | **toolchain 1.26**, not floor-gated | `go.dev/doc/go1.26` | 2026-07-25 |

## 10. Obsolete forms, floor-checked

Two things gate availability, and this table keeps them apart (§2). Every row carries a floor
qualifier, because a rule that forbids a working form or prescribes an unavailable one is the same
defect twice.

| Obsolete form | Replacement | Since | Availability at the `go 1.25.0` floor |
|---|---|---|---|
| `x := x` / `tc := tc` / `i := i` loop shadowing | delete it — unnecessary at the floor | 1.22 | **Available.** The automated `go fix forvar` remedy is **toolchain-1.26-gated** |
| `go func(v T){}(v)` for capture safety | no longer a correctness requirement | 1.22 | **Available** |
| `interface{}` | `any` | 1.18 | **Available.** The automated `go fix any` remedy is **toolchain-1.26-gated** |
| `for i := 0; i < n; i++` as a pure counter | `for i := range n` | 1.22 | **Available.** The automated `go fix rangeint` remedy is **toolchain-1.26-gated** |
| `tools.go` blank imports | the `tool` directive, `go get -tool`, `go tool` | 1.24 | **Available** |
| `for range b.N` | `for b.Loop()` | 1.24 | **Available** |
| `wg.Add(1)` / `defer wg.Done()` | `wg.Go(f)` | 1.25.0 | **Available exactly at the floor** |
| `time.Sleep` waits in concurrency tests | `testing/synctest` | 1.25 | **Available exactly at the floor** |
| `rand.Seed(time.Now()…)` | `math/rand/v2`, randomly seeded | 1.22 | **Available** |
| hand-rolled `filepath.Clean` + prefix checks | `os.Root` / `os.OpenRoot` | 1.24 | **Available** |
| `// +build` | `//go:build` | 1.17 | **Available** |
| `ioutil.*` | `os` / `io` | 1.16 (**Unverified:** the numeral alone, unfetched in both passes; the obsolescence is not in doubt. **What would resolve it:** the per-symbol deprecation notes on `pkg.go.dev/io/ioutil`, which is the owner §8's cite-a-per-symbol-"added in" rule points at) | **Available** |
| `go.uber.org/atomic` as the default | standard-library typed atomics | 1.19 | **Available** |
| `automaxprocs` cgroup shims on Linux | nothing — the runtime is container-aware | 1.25 | **Available exactly at the floor** |
| `cmd/doc` / `go tool doc` | `go doc`, the surviving command | deleted in **toolchain 1.26** | **Toolchain fact, not a floor fact.** A 1.25 toolchain still accepts the old spelling; a 1.26 one does not |
| `exportloopref` linter | removed; a deprecation error in golangci-lint v2 | golangci-lint v2 | Linter lifecycle, not a Go floor |
| `golint` | staticcheck + `go vet` + revive | archived | Tool lifecycle, not a Go floor |
| `gosimple` / `stylecheck` as separate linters | folded into `staticcheck` | golangci-lint v2 | Linter lifecycle, not a Go floor |
| golangci-lint v1 config schema | the v2 schema (`version: "2"`) | golangci-lint v2 | Linter lifecycle, not a Go floor |
| `pkg/` and the community project-layout repository | flat → `internal/` → `cmd/` | — | Not version-gated |
| Effective Go as a current complete guide | the substitute set (H15) | — | Not version-gated |

**`errors.As` is not in this table, and must never be added to it.** `errors.AsType[E error](err) (E, bool)`
was added in **go1.26.0**, which is above the `go 1.25.0` floor, so at the floor `errors.As` is the
correct and current form and `AsType` does not exist. **Neither is obsolete.** Do not teach `AsType` as
the default while the floor is 1.25; state the required floor beside it every time (H19). The error
child owns the two forms' semantics.

**The three `go fix` rows are the trap in this table.** Each carries *two* remedies: a primary one
available at the floor (delete the shadow; write `any`; write `range n`) and a `go fix` analyzer that
needs a **toolchain** 1.26 or newer. Only the second is gated. Never prescribe `go fix forvar`,
`go fix any`, or `go fix rangeint` as available "at the floor" — **whether the command exists** is a
toolchain question, and the floor does not answer it. The floor is not irrelevant to the *rewrite*,
though: a modernizer only fires where its target form is legal for the module, so `rangeint` needs a
1.22 floor and `any` an 1.18 one. Both are below `go 1.25.0`, so at today's floor the toolchain is the
only thing standing between you and the rewrite.
