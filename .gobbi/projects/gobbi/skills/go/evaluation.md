# Go — Idiom Review Frame

Child doc for the evaluator, and for the author's [`SKILL.md`](SKILL.md) P8 pre-handoff self-check, grading
a change-set for **Go idiom** — the Go companion to [`../coding/evaluation.md`](../coding/evaluation.md).
That frame grades the language-agnostic **property** of good code; this one grades whether the property is
expressed in idiomatic Go. A change can satisfy a property and still read as un-Go (an interface declared
beside its implementation, a goroutine with no stop path, a map assignment treated as a copy), or read as
fluent Go and fail a property. Read both frames and grade each perspective against both.

This frame does not restate the parent — it **points**. The good, bad, and adversarial cases live in
[`scenarios.md`](scenarios.md) (`GO-SCENARIO-*`); the binary items in [`checklists.md`](checklists.md)
(`GO-CHECK-*`); the rules, principles, and steps they exercise live in [`SKILL.md`](SKILL.md). This file
owns the rule-key crosswalk, the case-and-check selection procedure, the seven Go lenses, the recommended
verifications, and the Overall anchors.

**It defines no perspective, no finding shape, no verdict, and no Overall method.** Those belong to
[`../evaluation/SKILL.md`](../evaluation/SKILL.md) — its Rules own the eight lenses and their order, its
step 5 owns causal finding content, its step 6 owns coverage closure, and its step 7 owns the
evidence-derived verdict. Read them there.

**It adds no tenth artifact.** Each system still writes exactly **nine** outputs: seven perspective files,
`overall.md`, and the copied phase `checklist.md`. Selected `GO-CHECK-*` items are staged inside that copied
checklist; findings stay in the seven perspective files and `overall.md`.

---

## Rule-key crosswalk — the sole crosswalk

Every `scenarios.md` case and `checklists.md` item names its source by `H1`–`H19` (a `SKILL.md` Rule),
`Principle 1`–`Principle 8` (a `SKILL.md` Principle), or `P1`–`P8` (a `SKILL.md` Procedure step). Each key
resolves here to a **verbatim substring of `SKILL.md`**, so a rule edit is caught by grep and propagates
through one legend rather than three copies. Edit this crosswalk in the same change that edits the clause.

**Disambiguation:** `Principle {n}` is a `## Principles` blockquote; `P{n}` is a `## Procedure` step. The
parent uses `P2`, `P7`, `P8` for its Procedure steps, and this crosswalk follows it.

### Rules — Must-Follow `H1`–`H10`

- `H1` — "MUST read `go.mod` first, let `go mod init` set the `go` line" — the floor is a semantics switch,
  and is not the toolchain version.
- `H2` — "MUST run a full `go vet ./...` separately from `go test`." — `go test` runs 11 analyzers, not 35.
- `H3` — "MUST keep every file `gofmt`-clean." — the tool's output is the format.
- `H4` — "MUST return errors as values, handle each error exactly once" — and `%w` publishes the wrapped
  error into your API.
- `H5` — "MUST take `ctx context.Context` as the first parameter, named `ctx`" — and never store it in a
  struct.
- `H6` — "MUST give every goroutine a predictable stop time or a stop signal" — plus a way for the caller to
  wait.
- `H7` — "MUST define an interface in the package that consumes it, and return concrete types."
- `H8` — "MUST copy at a slice or map boundary you do not own." — capacity is invisible at the call site.
- `H9` — "MUST run `go test -race` for any change with concurrent access" — and write the synchronization
  decision down.
- `H10` — "MUST cite the primary owner and a verification date for every version number" — binds whoever
  writes this skill, not the Go you write.

### Rules — Must-Not-Follow `H11`–`H19`

- `H11` — "NEVER return a concrete typed-nil pointer through an `error` interface." — no vet analyzer
  catches it.
- `H12` — "NEVER add the pre-1.22 loop shadow (`x := x`)" — and the assignment form still shares one
  variable.
- `H13` — "NEVER copy a `sync` type after first use." — a value receiver copies the lock on every call.
- `H14` — "NEVER create a `pkg/` directory or a `util`, `common`, or `misc` package."
- `H15` — "NEVER cite Effective Go for modules, generics, iterators, errors, or tooling" — and never cite
  `CommonMistakes` at all.
- `H16` — "NEVER discard an error with `_`, NEVER return an in-band error value" — and never assert without
  comma-ok.
- `H17` — "NEVER reach for `unsafe`, `cgo`, reflection, or a type parameter without a named earned" reason.
- `H18` — "NEVER treat `go.sum` as a lockfile" — and `replace` / `exclude` are main-module-only.
- `H19` — "NEVER state unreleased-Go behavior as current" — and state the required floor beside every
  version-gated symbol. Its second clause binds whoever writes this skill.

### Principles `Principle 1`–`Principle 8`

- `Principle 1` — "Study the module contract before you design: the `go` line is a semantics switch, not metadata."
- `Principle 2` — "Errors are values on the normal path: return them, and treat every wrap as an API commitment."
- `Principle 3` — "Own every goroutine's termination; carry cancellation on a `Context`."
- `Principle 4` — "Define interfaces where they are consumed, and return concrete types."
- `Principle 5` — "Make the zero value useful, and compose instead of inheriting."
- `Principle 6` — "Share by communicating; where you share memory, state the synchronization and prove it with `-race`."
- `Principle 7` — "Treat a slice or map value as a reference to shared underlying data — copy at the boundary you do not own."
- `Principle 8` — "Clear is better than clever: formatting is settled by a tool, and reflection, `unsafe`, `cgo`, and generics must each be earned."

### Procedure steps `P1`–`P8`

- `P1` — "Study and lock the task and the Go module contract"
- `P2` — "Load the child docs for the forks in play"
- `P3` — "Design the units, the package boundary, and the interfaces, decomposed"
- `P4` — "Confirm the design, package layout, and names with the user"
- `P5` — "Build the compiling skeleton first"
- `P6` — "Grow in minimal verified slices"
- `P7` — "Verify the whole change — the Go gate order"
- `P8` — "Review: trace to the approved design and affected set"

---

## Selecting cases and checks

Run this after the Stage 0 target read and before the Stage 1 frame is locked.

1. **Load all four** — this file, [`scenarios.md`](scenarios.md), [`checklists.md`](checklists.md), and
   [`../coding/evaluation.md`](../coding/evaluation.md) for the independent language-agnostic axis.
2. **Map the diff to its Go surfaces** — `go.mod` and the floor; loop and closure captures; error shapes and
   wrapping; goroutines, channels, `sync` types, and `context`; interfaces and package boundaries; slices
   and maps at boundaries; the verification record; and, when the diff touches `skills/go/`, the documents
   themselves.
3. **Select the activated cases and checks.** Take every applicable `GO-SCENARIO-*` and its listed
   `GO-CHECK-*` items, **plus every check whose `H{n}` / `Principle {n}` / `P{n}` anchor applies directly
   with no seed case.** That second path is not optional: six rules — `H3`, `H5`, `H9`, `H16`, `H18`, and
   `H17`'s non-generics half — are declared uncovered by any scenario, so `GO-CHECK-08`, `-09`, `-10`,
   `-11`, `-12`, and `-13` reach the frame only through their anchors. Four Procedure steps — `P4`, `P5`,
   `P6`, `P8` — reach it the same way through `GO-CHECK-22`, `-23`, `-24`, `-25`.
4. **Resolve, never omit.** An inapplicable item the surface could plausibly activate is resolved
   `n/a:<property>` with the evidence that its predicate is false — never dropped silently. The ten
   `GO-CHECK-27` … `-36` document items resolve `n/a: the change-set contains no skills/go file` against
   ordinary Go source.
5. **Stage, do not copy prose.** Put the selected items into the copied phase checklist under exactly
   `## Stage 1 Additions`, keeping their IDs and wording, and edit neither source file. Every evaluation
   still walks all seven perspectives; one the change does not exercise is still walked and may record zero
   findings.
6. **Demand ordered evidence for the operation checks.** One final green `go build` proves final state only.
   Require the skeleton checkpoint (`GO-CHECK-23`) and the per-slice records (`GO-CHECK-24`) as separate
   evidence. First evidence arriving after a whole-feature pass fails the bottom-up checks.

---

## Perspectives

Each lens lists its activated IDs and its anti-patterns. The eight lenses, their order, and the finding and
verdict rules are owned by [`../evaluation/SKILL.md`](../evaluation/SKILL.md); this section only says what
each one looks at in Go.

### Project

**Lens:** does the approach fit the **declared module contract and artifact type** — the `go` line and its
four consequences, the toolchain version kept distinct, the package layout, and the scope actually agreed?

**Activated:** `GO-SCENARIO-01`, `-08` · `GO-CHECK-01`, `-16`, `-22`, `-26`.

| Anti-pattern | Correction |
|---|---|
| **The floor read off the toolchain** | Record them separately; the floor gates semantics and the standard-library surface, the toolchain gates which commands exist |
| **`pkg/` adopted as "the standard layout"** | Start flat, reach for `internal/` early because the compiler enforces it, and add `cmd/` only for a second binary |
| **A design packet reverse-engineered from bodies** | Approve the package tree, signatures, error taxonomy, and ownership map before P5 writes a stub |

### Structure

**Lens:** are the **package boundary, unit shape, interfaces, and zero values** idiomatic — consumer-side
interfaces, concrete returns, a useful zero value, composition over embedding, an acyclic import graph?

**Activated:** `GO-SCENARIO-07`, `-08` · `GO-CHECK-15`, `-16`, `-19`, `-23`.

| Anti-pattern | Correction |
|---|---|
| **An interface declared beside its implementation "for mocking"** | Declare it in the consuming package; a producer-side interface deletes the methods the caller did not anticipate |
| **An exported type embedded for reuse** | Use a named field and delegate explicitly; embedding an exported type publishes the field and the promoted method set |
| **A constructor for a type whose zero value would work** | Design the zero value first; it removes the constructor, the builder, and the initialized flag from every caller |

### Performance

**Lens:** is the change **efficient in idiomatic Go** — allocation and escape behavior, slice capacity,
retained backing arrays, bounded fan-out, and a measured claim rather than an assumed one?

**Activated:** `GO-SCENARIO-05` · `GO-CHECK-05`, `-06`.

| Anti-pattern | Correction |
|---|---|
| **A sub-slice pinning a large backing array** | Copy what you keep; a small returned sub-slice retains the whole array for as long as the caller holds it |
| **Unbounded goroutine fan-out** | Bound the concurrency and give the group an owner and a wait; goroutines are not garbage collected |
| **An optimization with no benchmark** | Measure before and after; the clear form stands until a measurement earns the clever one |

### Aesthetics

**Lens:** does it read like **one Go codebase** — `gofmt` output as the format, short lowercase package
names, receiver and error-string convention, doc comments that say what the signature cannot?

**Activated:** `GO-SCENARIO-09` · `GO-CHECK-08`, `-17`.

| Anti-pattern | Correction |
|---|---|
| **Formatting argued rather than run** | `goimports` decides; it formats and fixes the import block in one pass |
| **A capitalized, punctuated error string** | Lowercase, no trailing punctuation — the string is usually concatenated into a larger one |
| **A `util` package name** | Name the boundary; `util` admits the boundary was never decided |

### Usage

**Lens:** for the **next caller** — can they use each changed unit from its signature and doc comment alone,
with ownership of a returned slice or map, the failure shape, and the cancellation surface all explicit?

**Activated:** `GO-SCENARIO-05`, `-07`, `-09` · `GO-CHECK-05`, `-09`, `-15`, `-17`.

| Anti-pattern | Correction |
|---|---|
| **A returned slice or map with no stated ownership** | Say in the doc comment whether it is shared or owned; the caller cannot see capacity or aliasing at the call site |
| **A `Context` stored on a struct** | Pass it explicitly as the first parameter; a stored context hides which call a cancellation cancels |
| **An interface return** | Return the concrete type; every method you did not anticipate stays available |

### Consistency

**Lens:** did **everything that must change together change together** — callers, tests, doc comments,
generated code, `go.mod`, and, for a document change, the register rows, stamps, and links?

**Activated:** `GO-SCENARIO-14`, `-15` · `GO-CHECK-21`, `-24`, `-25`, `-29`, `-31`, `-32`, `-33`.

| Anti-pattern | Correction |
|---|---|
| **A tool child restating the base's class rationale** | Keep the rationale in `service-clients.md` §1–§12; a child owns only its delta |
| **A version numeral with no register row** | Resolve every version token to the Version Currency Register; an orphan numeral rots invisibly |
| **A stale caller or generated file** | Move the whole affected set in the same slice; the diff is not the change |

### Risk

**Lens:** which **Go footgun** makes this fail silently — a typed nil, a leaked goroutine, a copied lock, a
data race, a discarded error, an aliased map — or which taught claim is false?

**Activated:** `GO-SCENARIO-02`, `-03`, `-04`, `-06`, `-11`, `-12`, `-13`, `-16` · `GO-CHECK-02`, `-03`,
`-04`, `-06`, `-07`, `-10`, `-11`, `-13`, `-14`, `-20`, `-27`, `-28`, `-30`, `-34`, `-35`, `-36`.

| Anti-pattern | Correction |
|---|---|
| **A green test run offered as a vet or race result** | Run `go vet ./...` and `go test -race ./...` as their own gates; `copylocks` and `lostcancel` are outside the test subset |
| **A discarded error** | Return it or handle it; `_` is a decision no reader can audit |
| **A citation that resolves but does not support its claim** | Open the owner at a pinned tag, find the claim's key term, and copy the quoted sentence from what you read |

---

## Recommended verifications

Capabilities are binding; exact commands are the parent's. **First run the P7 gate order** — the ten ordered
gates the parent owns, each failing the chain by exit status, with the two listing tools wrapped in
`test -z "$(...)"`. Do not restate the order here; read it at `SKILL.md` P7 and record each exit status.

**Then run the twelve document sweeps.** Nine resolve to a `SKILL.md` clause and carry a checklist item.
Three do not — they are listed for the evaluator's awareness with their real owner, and this file does not
invent a parent rule for them.

| Sweep | Confirms | Item |
|---|---|---|
| `V1` | Citation presence: `cited_blocks + declared_exemptions == total_blocks`, exemptions from the frozen list only (`H10`) | `GO-CHECK-27` |
| `V2` | Retired vocabulary: every anchored hit sits in an obsolete table, a forbidding sentence, or the allowlist (`H15`, `H12`) | `GO-CHECK-28` |
| `V3` | Version-claim closure: every version token resolves to a Version Currency Register row (`H10`) | `GO-CHECK-29` |
| `V4` | Draft guard: every `1.27` hit says "draft" or "not yet released" (`H19`) | `GO-CHECK-30` |
| `V5` | Staleness stamps: seven dated `**Verified:**` headers, checked by count **and** composition (`H10`) | `GO-CHECK-31` |
| `V6` | Link integrity: every link resolves, every intra-skill link is sibling, zero `messaging.md` references (`P2`) | `GO-CHECK-32` |
| `V7` | Ownership non-duplication: every hazard-phrase hit falls inside an allowlisted `(file, class, fragment)` triple (`P2`, `H10`) | `GO-CHECK-33` |
| `V11` | Floor availability over every taught form, whether or not the tree states a version for it (`H19`, `H10`) | `GO-CHECK-34` |
| `V12` | **Citation support:** each sampled taught claim is actually present in its cited owner (`H10`) | `GO-CHECK-35` |
| `V8` | Mirror topology — per-file symlinks and the directory symlink | **None.** Owned by `scripts/sync-plugin-package.sh`; no `SKILL.md` clause covers it |
| `V9` | Cold load — a fresh agent loading the parent alone | **None.** Owned by `skill-writing` P7; no `SKILL.md` clause covers it |
| `V10` | Adversarial check probes — every new predicate fails at least one crafted input | **None.** Owned by [`../evaluation/checklist/SKILL.md`](../evaluation/checklist/SKILL.md) |

**`V12` reads source, never a rendered summary.** Sample the taught claims, then open each cited owner as
raw source or raw document **at a pinned tag**, locate the claim's key term, and diff the quoted sentence
against what the source says. A rendered page is not acceptable evidence here: a rendered fetch was caught
fabricating the exact supporting text it was asked to confirm, and a page that renders fine can contain zero
occurrences of the claim's key term. Report a citation that exists, resolves, and does not support its claim
as a Risk finding, not a Consistency one.

---

## Overall — Go-specific anchors

Step back from the per-perspective passes and check the change-set against the four Go failure modes, then
against what exists only **between** lenses — a clean interface hiding a leaked goroutine, a correct gate
order run on stale output, a well-cited page that does not contain the claim.

| Mode | What it looks like in a Go change-set |
|---|---|
| **Silent at every gate** | A typed-nil error, a leaked goroutine, a copied lock, or an aliased map — each compiles, passes `go test`, and produces the wrong answer with no tool reporting it |
| **Verification theater** | A gate that reports and exits `0`, a vet claim resting on `go test`, a `-race` run assumed, or fresh-looking evidence taken from a stale run |
| **Contract drift** | A symbol taught above the module floor, a `%w` that published an internal error type, or a `replace` shipped from a library expecting downstream effect |
| **A confident falsehood** | A claim with a citation that resolves and does not support it, a quotation taken from a tip-tracking page, or a stale answer cleared by an HTTP 200 and a "Latest" badge |

**Preserve-list anchors specific to Go idiom** — what a strong change already got right, which a REVISE
iteration must not undo: a recorded floor kept distinct from the toolchain; consumer-side interfaces with
concrete returns; a useful zero value and named-field delegation; every goroutine with an owner, a stop
signal, and a wait; errors returned once with `%w` reserved for a published match; boundary copies with
stated ownership; the full ordered P7 gate record; and every taught claim carrying an owner, a pinned tag,
and a date that a reader can check. If none apply, state `none — every Go-idiom surface needs revision`.
