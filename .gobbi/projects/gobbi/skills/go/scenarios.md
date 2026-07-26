# Go — Implementation Scenario Library

Good, bad, and adversarial Go cases. Load when a Go change-set is being evaluated, or when an author runs
the [`SKILL.md`](SKILL.md) P8 pre-handoff self-check. This library deepens, it does not restate: every case
exercises a `SKILL.md` clause and teaches nothing new. Its `Exercises` line anchors to Rules (`H{n}`),
Principles (`Principle {n}`), and Procedure steps (`P{n}`), each resolving to its verbatim `SKILL.md` clause
through [`evaluation.md`](evaluation.md)'s rule-key crosswalk; its `Checklist IDs` line points at the binary
items in [`checklists.md`](checklists.md).

**Two actors, one library.** Most cases grade the Go a reader writes. Five — `GO-SCENARIO-05`, `-12`, `-13`,
`-15`, `-16` — grade the document itself, because `H10` and `H19`'s second clause bind whoever writes or
revises this skill and its children. Each says which actor it grades in its `Situation`. Snippets are shapes
to recognize, not runnable code. Cases group under **Hard invariants** · **Design judgment** · **Bottom-up
operation**.

## Hard invariants

### GO-SCENARIO-01 — The `go` line is set by hand, and the toolchain version is read as the floor
- **Axis:** Hard invariant.
- **Situation:** a module is initialized, or an existing one is edited, and the author writes the `go` line
  from memory — or reasons about loop semantics, GODEBUG defaults, and standard-library availability without
  reading it. The `toolchain` directive and the installed toolchain are treated as the same number.
- **Good handling:** `go.mod` is read first; `go mod init` chose the `go` line and the author records what it
  actually wrote; the module floor and the installed toolchain version are recorded as two separate facts; a
  raise happens only for a named feature, through `go get go@<version>`.
- **Bad handling:** the `go` line is hand-set to the toolchain's own version, or copied from a doc page; the
  floor and the toolchain are used interchangeably to decide what is available.
- **Adversarial probe:** ask which of the four consequences the `go` line gates — language semantics, GODEBUG
  defaults, the `go vet stdversion` surface, and nothing about which commands exist. A floor confused with a
  toolchain answers three of them wrong and still builds today.
- **Exercises:** `H1`, `Principle 1`, `P1`.
- **Checklist IDs:** `GO-CHECK-01`, `GO-CHECK-26`.

### GO-SCENARIO-02 — A closure captures a loop variable, in both the `:=` and the `=` form
- **Axis:** Hard invariant.
- **Situation:** a `for ... range` starts a goroutine or stores a closure. One loop declares its variables with
  `:=`; a second ranges over pre-declared variables with `for k, v = range m`.
- **Good handling:** the `:=` loop relies on per-iteration variables and carries no `x := x` shadow; the
  assignment-form loop is recognized as still sharing one variable and is rewritten to the declaration form
  before a closure or goroutine captures it.
- **Bad handling:** a dead `x := x` shadow is added or left in place; or per-iteration semantics are assumed
  for the assignment form, so every closure sees the final value.
- **Adversarial probe:** run both loops with a capture and compare the collected values. The `:=` loop is
  correct with the shadow deleted; the `=` loop still races to one value, and no vet analyzer says so.
- **Exercises:** `H12`, `Principle 1`.
- **Checklist IDs:** `GO-CHECK-02`.

### GO-SCENARIO-03 — "The tests passed, so vet passed"
- **Axis:** Hard invariant.
- **Situation:** a change touching a mutex-bearing struct and a cancellable call is verified with
  `go test ./...` alone, and the author reports that vet is covered.
- **Good handling:** `go vet ./...` runs as its own gate, separate from `go test`; the author knows that
  `go test` executes 11 analyzers from the go command's `defaultVetFlags`, and that `copylocks` and
  `lostcancel` are outside that subset.
- **Bad handling:** the vet gate is folded into the test run; a `copylocks` or `lostcancel` defect ships with
  a green test suite as its evidence.
- **Adversarial probe:** introduce a value-receiver method on a `sync.Mutex`-bearing struct and a
  `context.WithCancel` whose `cancel` is never called. `go test ./...` stays green; the separate full vet does
  not.
- **Exercises:** `H2`, `P7`.
- **Checklist IDs:** `GO-CHECK-03`, `GO-CHECK-20`.

### GO-SCENARIO-04 — A concrete typed nil returned through an `error`
- **Axis:** Hard invariant.
- **Situation:** a function declares `var err *MyError`, leaves it nil on the success path, and returns it
  through an `error` result.
- **Good handling:** the variable is declared as `error`, and the success path returns a literal `nil`.
- **Bad handling:** the concrete pointer type is returned, so the interface value carries a type with no
  value and `err != nil` fires on success.
- **Adversarial probe:** call the success path and branch on `err != nil`. It takes the error branch. No vet
  analyzer reports it, so a green build and a green vet are both consistent with the defect.
- **Exercises:** `H11`, `Principle 2`.
- **Checklist IDs:** `GO-CHECK-04`.

### GO-SCENARIO-05 — A slice or map crosses a boundary, and the spec is quoted from the tip-tracking page
- **Axis:** Hard invariant.
- **Situation:** two things at once. In the code: `append` is called on a caller-supplied slice, a small
  sub-slice of a large one is returned, and a map is assigned to a second variable. In the document (author
  actor): the aliasing sentence that justifies the rule is quoted from `go.dev/ref/spec`, which tracks tip
  rather than any released tag.
- **Good handling:** the code clones what it keeps, uses the three-index form or `slices.Clip` when handing a
  slice out, and says in the doc comment whether a returned slice or map is shared or owned; the quotation is
  read against a pinned released tag, and the `Source:` line names that tag and the read date.
- **Bad handling:** the caller's backing array is written through `append`; a sub-slice pins a large array; a
  map assignment is treated as a copy. In the document, the tip-rendered wording is quoted as current, so the
  skill teaches a sentence no released Go says.
- **Adversarial probe:** fetch the same section at the pinned tag and diff it against the quoted sentence — a
  tip-versus-tag divergence shows only under the diff. For the code, grow the caller's slice past its capacity
  and re-read the caller's array.
- **Exercises:** `H8`, `H10`, `Principle 7`.
- **Checklist IDs:** `GO-CHECK-05`, `GO-CHECK-35`.

### GO-SCENARIO-06 — A goroutine with no stop path, and a copied `sync` type
- **Axis:** Hard invariant.
- **Situation:** a `go` statement is written with no named owner and no stop signal, and a struct holding a
  `sync.Mutex` is passed and returned by value.
- **Good handling:** every goroutine has a named owner, a stop signal (`Context`, done channel, or
  `errgroup`), and a way for the caller to block and wait; the mutex-bearing struct is taken by pointer
  everywhere, with pointer receivers throughout.
- **Bad handling:** the goroutine outlives the call with nothing able to stop it; a value receiver copies the
  lock on every call, so two copies guard nothing.
- **Adversarial probe:** cancel the parent and count live goroutines after the deadline; and take two copies
  of the struct and have both enter the critical section. Neither shows in a passing test.
- **Exercises:** `H6`, `H13`, `Principle 3`.
- **Checklist IDs:** `GO-CHECK-06`, `GO-CHECK-07`, `GO-CHECK-10`.

### GO-SCENARIO-16 — A version-gated symbol taught above the module's floor
- **Axis:** Hard invariant.
- **Situation:** author actor. The module's floor is `go 1.25.0`, and the document teaches
  `errors.AsType[*MyErr](err)` with no floor qualifier — or lists `errors.As` in an obsolete-forms table as if
  it had been replaced.
- **Good handling:** `errors.As` is stated as the correct and current form at the declared floor;
  `errors.AsType` is stated as a `go 1.26.0`-floor convenience with its required floor beside it; neither is
  placed in the obsolete set; every obsolete-table row carries a floor-availability qualifier in both columns.
- **Bad handling:** the newer symbol is named with no version, so it reads as unconditionally available; or
  the older one is marked obsolete, so a reader on the floor deletes working code.
- **Adversarial probe:** set the floor to `go 1.25.0` and take every taught form literally. The defect is the
  form named *without* a version — a population defined as "forms the tree states a version for" would miss it.
- **Exercises:** `H19`, `H10`.
- **Checklist IDs:** `GO-CHECK-14`, `GO-CHECK-30`, `GO-CHECK-34`.

## Design judgment

### GO-SCENARIO-07 — An interface declared for mocking, and an exported type embedded for reuse
- **Axis:** Design judgment.
- **Situation:** a package declares an interface beside its implementation "so it can be mocked", returns that
  interface from its constructor, and embeds an exported third-party type to reuse its methods. No constructor
  is written for a type whose zero value would already work.
- **Good handling:** the interface is declared in the consuming package with exactly the method set that
  consumer needs; the producer returns the concrete type; a compile-time check, where it is worth having, is a
  blank variable assertion at the implementor; reuse is a named field with explicit delegation; the zero value
  is designed first, which removes the constructor.
- **Bad handling:** the producer-side interface narrows what the return value can do and freezes a method set
  no consumer asked for; the exported embedded field publishes both the field and the promoted method set, so
  a change in the embedded API becomes a change in this one.
- **Adversarial probe:** ask a second consumer for a method the interface omits, then add a method to the
  embedded type's next release. The first is unreachable; the second silently widens this package's API.
- **Exercises:** `H7`, `Principle 4`, `Principle 5`, `P3`.
- **Checklist IDs:** `GO-CHECK-15`, `GO-CHECK-19`.

### GO-SCENARIO-08 — A project scaffolded with `pkg/` and a `util` package
- **Axis:** Design judgment.
- **Situation:** a new module is laid out with `pkg/`, `cmd/`, `internal/`, and a `util` package for the
  helpers that did not fit anywhere.
- **Good handling:** the layout starts flat; `internal/` appears early because the compiler enforces it;
  `cmd/` appears only when there is more than one binary; there is no `pkg/`, and no `util`, `common`, or
  `misc` package; the import graph stays acyclic.
- **Bad handling:** `pkg/` is adopted as "the standard layout"; a `util` package accretes into the catch-all
  every other package imports.
- **Adversarial probe:** ask which official page mandates `pkg/`. None does — the convention comes from a
  community repository and was repudiated in that repository's own issue tracker.
- **Exercises:** `H14`, `P3`.
- **Checklist IDs:** `GO-CHECK-16`, `GO-CHECK-22`.

### GO-SCENARIO-09 — `%w` applied reflexively at every layer
- **Axis:** Design judgment.
- **Situation:** each layer wraps the error beneath it with `%w` before returning, and one layer both logs the
  error and returns it.
- **Good handling:** `%w` is used only where a caller is meant to match on the wrapped error, because that
  publishes it into this package's API for as long as callers may match on it; every error is handled exactly
  once — returned or handled, never both; error strings are uncapitalized and carry no trailing punctuation.
- **Bad handling:** every layer wraps, so every internal error type becomes part of the public contract; a
  log-and-return produces two reports of one fault and denies the caller the choice.
- **Adversarial probe:** change an internal error type and see how many callers' `errors.Is` and `errors.As`
  matches break. Reflexive wrapping makes that number nonzero by construction.
- **Exercises:** `H4`, `Principle 2`, `P3`.
- **Checklist IDs:** `GO-CHECK-17`.

### GO-SCENARIO-10 — A type parameter reached for to accept "any reader"
- **Axis:** Design judgment.
- **Situation:** a helper is made generic so it can accept "any reader", replacing what an `io.Reader`
  parameter already expressed.
- **Good handling:** the interface parameter stays; a type parameter is added only for repeated identical code
  that differs solely in type, and the reason is written down in the review.
- **Bad handling:** the type parameter replaces an interface type, adding inference cost and a worse error
  message for nothing.
- **Adversarial probe:** delete the type parameter and substitute the interface. If the code is shorter and
  behaves identically, the parameter was never earned.
- **Exercises:** `H17` (type-parameter half only), `Principle 8`.
- **Checklist IDs:** `GO-CHECK-18`.

## Bottom-up operation

### GO-SCENARIO-11 — The whole change verified with `go test ./...` alone
- **Axis:** Bottom-up operation.
- **Situation:** a change touching concurrency and a fuzz target ships, and the whole-change evidence is one
  `go test ./...` run. Formatting is checked with a bare `gofmt -l .`.
- **Good handling:** the P7 gates run in order, each failing the chain by exit status — the two listing tools
  wrapped in `test -z "$(...)"`, then build, full vet, lint, test, `-race`, a per-target `-fuzz` with an
  explicit `-fuzztime`, `govulncheck`, and a cross-platform build where the change ships for one; a skipped
  gate is recorded with its reason.
- **Bad handling:** the bare `gofmt -l .` lists offenders and still exits `0`, so it can never fail the chain;
  `-race` and `govulncheck` are assumed covered by `go test`; a `-fuzz` run without `-fuzztime` never ends and
  stalls every gate below it.
- **Adversarial probe:** introduce an unformatted file and a reachable vulnerable symbol, then run the
  author's exact command line and read its exit status. A pipeline that reports and exits `0` is not a gate.
- **Exercises:** `P7`, `H2`, `H3`, `H9`.
- **Checklist IDs:** `GO-CHECK-20`, `GO-CHECK-08`, `GO-CHECK-03`, `GO-CHECK-10`.

### GO-SCENARIO-12 — A retired source cited as current
- **Axis:** Bottom-up operation.
- **Situation:** author actor. A guidance claim about modules, generics, iterators, errors, or tooling is
  sourced to Effective Go, or a reader lands on `go.dev/wiki/CommonMistakes` and applies its `i := i` fix.
- **Good handling:** Effective Go is cited only as the owner of its own not-current notice; the document states
  that nothing replaced it and names the working substitute set — the specification, Go Code Review Comments,
  the release notes, and Google's style guide cited as Google's position; `CommonMistakes` appears only inside
  a forbidding sentence.
- **Bad handling:** Effective Go carries a module or error claim; `CommonMistakes` appears in prescriptive
  prose, teaching a fix Go 1.22 retired.
- **Adversarial probe:** grep the tree for `CommonMistakes` and for retired tokens (`x := x`, `i := i`,
  `ioutil`, `golint`, `// +build`, `rand.Seed`). Every hit must sit inside a forbidding sentence or an
  explicitly-marked obsolete table.
- **Exercises:** `H15`, `H10`, `H12`.
- **Checklist IDs:** `GO-CHECK-28`, `GO-CHECK-27`.

### GO-SCENARIO-13 — A citation that exists, resolves, and does not support its claim
- **Axis:** Bottom-up operation.
- **Situation:** author actor, and the highest-yield defect this skill has actually shipped. Three shapes seen
  in one session: an entry citing a plausible owner page that contains **zero** occurrences of the claim's key
  term; a rendered documentation page fetched and quoted back with supporting text that does not exist in the
  source; and an `[S]`-flagged summary item promoted into prose with a **function name the owner does not
  have**.
- **Good handling:** before an entry lands, the cited owner is opened at a pinned tag or as raw source, the
  claim's key term is located in it, and the quoted sentence is copied from what was read; the `Source:` line
  names the owner, the tag, and the date; a symbol is confirmed to exist at the owner before it is taught.
- **Bad handling:** a plausible owner is attached to a true-sounding claim and passes every link check, every
  citation-presence count, and every version sweep; a rendered summary substitutes for the source.
- **Adversarial probe:** for each taught claim, grep the cited source for the claim's key term and for the
  exact symbol name. Zero hits is the finding. Then refetch the same page as raw source at the tag and diff it
  against the quoted sentence — a rendered fetch fabricated exactly the support it was asked to confirm.
- **Exercises:** `H10`, `Principle 1`.
- **Checklist IDs:** `GO-CHECK-35`, `GO-CHECK-27`, `GO-CHECK-29`.

### GO-SCENARIO-14 — A tool child restating the hazard-class rationale the base owns
- **Axis:** Bottom-up operation.
- **Situation:** a retry loop is added around an AWS call and a Kubernetes conflict error is wrapped with `%w`
  before being returned to `RetryOnConflict`. Author actor, same case: the tool child's delta cell grows a
  sentence explaining *why* the retry class matters — rationale [`service-clients.md`](service-clients.md)
  already owns.
- **Good handling:** `service-clients.md` §1–§12 is read before any tool child's delta table; `aws.md` states
  only its delta (it retries by default, so do not add your own), `kubernetes.md` states only its delta (the
  helper recognizes the conflict error unwrapped); the class rationale appears exactly once, in the base.
- **Bad handling:** the reader acts on a delta table without the class it is a delta from; or a child pads an
  existing delta cell with class rationale, which lands inside a cell the ownership sweep already expects to
  match and therefore scores as expected.
- **Adversarial probe:** grep each class's distinguishing phrase across the five tool children and require
  every hit to fall inside a pre-declared `(file, class, fragment)` triple. A hit anywhere else — including
  padding inside an expected cell — is a class restatement.
- **Exercises:** `P2`, `H4`, `H10`.
- **Checklist IDs:** `GO-CHECK-33`, `GO-CHECK-32`, `GO-CHECK-21`.

### GO-SCENARIO-15 — A stale answer that passes every mechanical check
- **Axis:** Bottom-up operation.
- **Situation:** `client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())` is written from
  memory or from a recent blog post. The author then checks: the default-branch URL for the owner's docs
  returns HTTP 200, and the module's pkg.go.dev page renders as "Latest" with a healthy-module checklist. Both
  agree with the stale form. Author actor, same case: a version number appears in prose with no register row,
  and a file carrying an owner-URL claim ships without a dated `**Verified:**` stamp.
- **Good handling:** the canonical import path, the current constructor, and the inverted negotiation option
  are read from the owner's own notice; the document states that module metadata carries no deprecation state,
  so a frozen module renders as current forever, and names the live instance; a default-branch HTTP 200 is
  never taken as a currency guarantee; every version token resolves to the Version Currency Register row, and
  all seven stamped files carry a dated stamp.
- **Bad handling:** the deprecated constructor and the no-op option ship because two mechanical checks agreed
  with them; a version numeral floats free of the register; a stamp count is right and its composition wrong.
- **Adversarial probe:** read the same doc path at the released tag and diff it against the default-branch
  read — a stale branch answers HTTP 200 exactly like a live one. Then count the stamps *and* check which
  seven files carry them; a tree with seven stamps in the wrong seven files passes a count.
- **Exercises:** `H10`, `P2`.
- **Checklist IDs:** `GO-CHECK-36`, `GO-CHECK-31`, `GO-CHECK-29`, `GO-CHECK-21`.

## Guaranteed coverage map

This map states two different things, and the second one is a declared gap, not a completeness claim.

**Scenario-complete over sixteen cases.** Every case `GO-SCENARIO-01` … `-16` above is present, carries all
seven fields, names at least one `GO-CHECK-*` item, and can fail a real change-set or a real document. No
case is reserved, deferred, or a placeholder.

**Rule-partial over nineteen rules.** **Covered** means a case's pass/fail turns on that rule — the rule is
the case's defining discrimination. A case may *touch* a rule incidentally (`GO-SCENARIO-11` runs the
`gofmt` gate) without covering it. Thirteen of the nineteen `SKILL.md` Rules are covered. **Six are
uncovered: no case above can fail on them alone.** Each is covered by a checklist item instead, and that
item is selected by [`evaluation.md`](evaluation.md) on its rule anchor rather than through a seed case:

| Uncovered rule | Why no case | Covering check |
|---|---|---|
| `H3` — every file `gofmt`-clean | A formatting state has no interesting good/bad narrative; it is a gate outcome, and `GO-SCENARIO-11` exercises the *wrapper* that makes the gate fail, not the rule | `GO-CHECK-08` |
| `H5` — `ctx` first, named `ctx`, never stored in a struct | No case turns on context *placement*; `GO-SCENARIO-06` uses a `Context` as a stop signal, which is `H6`'s discrimination, not `H5`'s | `GO-CHECK-09` |
| `H9` — `go test -race` plus a written synchronization decision | `GO-SCENARIO-06` turns on goroutine ownership and lock copying; the race gate and the written decision are graded directly | `GO-CHECK-10` |
| `H16` — no `_`-discarded error, no in-band error, no single-result assertion | Three distinct footguns with no shared situation; each is a direct diff read | `GO-CHECK-11` |
| `H18` — `go.sum` is not a lockfile; `replace` / `exclude` are main-module-only | The failure is invisible downstream, so no single change-set exhibits it observably | `GO-CHECK-12` |
| `H17`, non-generics half — `unsafe`, `cgo`, reflection each need a named earned reason | `GO-SCENARIO-10` covers the type-parameter half only; the other three escape hatches share no situation with it | `GO-CHECK-13` |

**Principle-partial: seven of eight by case, one by check.** `Principle 1` → `-01`, `-02`, `-13`;
`Principle 2` → `-04`, `-09`; `Principle 3` → `-06`; `Principle 4` → `-07`; `Principle 5` → `-07`;
`Principle 7` → `-05`; `Principle 8` → `-10`. **`Principle 6` has no case** — the written synchronization
decision has no good/bad narrative separable from `H9`'s gate; its covering check is `GO-CHECK-10`.

**Procedure-partial: four of eight by case, four by check.** `P1` → `-01`; `P2` → `-14`, `-15`; `P3` →
`-07`, `-08`, `-09`; `P7` → `-03`, `-11`. **`P4`, `P5`, `P6`, and `P8` have no case** — each grades the
*history* of a change rather than a situation inside it, which a case cannot exhibit. Their covering checks
are `GO-CHECK-22`, `GO-CHECK-23`, `GO-CHECK-24`, and `GO-CHECK-25`.
