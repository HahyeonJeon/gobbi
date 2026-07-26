# Go — Implementation Checklist Register

A binary register for a Go change-set, and for the Go documents in this skill. The author runs it as the
[`SKILL.md`](SKILL.md) P8 pre-handoff self-review; an evaluator entering through
[`evaluation.md`](evaluation.md) copies the activated items into the phase `checklist.md` under exactly
`## Stage 1 Additions`. This register deepens, it does not restate: every item carries a `SKILL.md` anchor —
`H{n}` a Rule, `Principle {n}` a Principle, `P{n}` a Procedure step — resolving to its verbatim clause
through [`evaluation.md`](evaluation.md)'s rule-key crosswalk. Nothing is checked here that `SKILL.md` does
not teach.

**Mode and use-style.** Source mode is **operational**: P8, the handoff, is a real pause point, and a failed
item still changes the next action. Default use-style `do-confirm`. The source ships with every box
unchecked and is never ticked in place — each run works a filled copy naming the run and this file's
version. When an evaluator imports items into a phase checklist, that run is an **evaluation coverage
register** and only the first three tokens below are legal in it.

**Resolution legend — four states.**

| Token | Meaning | Where legal |
|---|---|---|
| `PASS` | The pass condition is verified true, with the named evidence inspected | Every run |
| `FAIL:<finding-id>` | Verified false; cite the finding | Every run |
| `n/a:<property>` | The applicability predicate is false; name the property and cite the evidence that it is false | Every run |
| `recorded-open:<owner+method>` | Still open, with a named owner and how it resolves | The operational P8 run only — never an evaluation register run |

**Coverage closure is not acceptance.** Every applicable item reaching a terminal state closes coverage.
Acceptance is the separate, stronger claim: **every applicable gate and required item resolves `PASS`.** A
`FAIL` or a `recorded-open` is coverage-closed and not accepted. An owner, a filed follow-up, or a
reviewer's approval never stands in for the outcome.

**One positive acceptance outcome per box.** Each item passes if and only if its stated outcome holds. The
outcome may be a conjunction — every clause must hold, and a conjunction is still one outcome — but never a
disjunction and never an approval-based escape. The `FAIL if` clause only enumerates the forms the outcome
can be violated in; it never adds an alternative way to pass. This is load-bearing: sweep `V7` in this skill had to
be rewritten because its earlier form let the author it constrains adjudicate its own outcome, hit by hit.

Groups: **Hard invariants** · **Design judgment** · **Operation & evidence** · **Document currency and
citation**. `[gate]` marks a killer — its miss is the costly or silent one; `[req]` marks a required item.

## Hard invariants

- [ ] `GO-CHECK-01` **[gate]** — PASS if `go.mod` was read before design and the module floor and the
  installed toolchain version are recorded as two separate facts, with any raise made through
  `go get go@<version>` for a named feature. FAIL if the `go` line was hand-set, copied from a doc page, or
  used interchangeably with the toolchain version.
  *Evidence:* the recorded `go` line and `go version` output, against the P1 notes. *On fail:* the change is
  designed against semantics it does not have — stop at P1 and re-read `go.mod`. *(`H1`, `Principle 1`, `P1`)*
- [ ] `GO-CHECK-02` **[req]** — PASS if no `x := x` loop shadow exists in the change and every closure or
  goroutine capture happens in a `:=` declaration-form loop. FAIL if a shadow is added or left, or a capture
  reads a variable a `for k, v = range` loop declared outside itself.
  *Evidence:* `rg '(\w+) := \1$'` over the diff plus a read of each `range` header. *On fail:* open a finding
  on the owning loop. *(`H12`)*
- [ ] `GO-CHECK-03` **[gate]** — PASS if `go vet ./...` ran as its own gate, separate from `go test`, on
  fresh output. FAIL if the vet claim rests on a `go test` run, or on stale output.
  *Evidence:* the recorded command line and exit status. *On fail:* `copylocks` and `lostcancel` defects ship
  unseen — halt the handoff and run the full vet. *(`H2`, `P7`)*
- [ ] `GO-CHECK-04` **[gate]** — PASS if every error-returning path declares its variable as `error` and
  returns a literal `nil` on success. FAIL if a concrete pointer type reaches an `error` result.
  *Evidence:* read each function returning a custom error type; `rg 'var \w+ \*\w*Err'` over the diff. *On
  fail:* `err != nil` fires on the success path with no analyzer reporting it — open a blocking finding.
  *(`H11`, `Principle 2`)*
- [ ] `GO-CHECK-05` **[gate]** — PASS if every slice or map crossing a boundary this change does not own is
  copied — `slices.Clone`, the three-index form, or `slices.Clip` — and each returned slice or map says in
  its doc comment whether it is shared or owned. FAIL if `append` can write into a caller's array, a
  sub-slice pins a large backing array, or a map assignment is treated as a copy.
  *Evidence:* read every exported signature taking or returning a slice or map. *On fail:* caller memory is
  mutated invisibly — open a blocking finding. *(`H8`, `Principle 7`)*
- [ ] `GO-CHECK-06` **[gate]** — PASS if every goroutine the change starts has a named owner, a stop signal,
  and a way for the caller to block and wait. FAIL if any `go` statement has no stop path, or the caller
  cannot wait for it.
  *Evidence:* trace each `go` statement to its owner and stop signal. *On fail:* a leak no compiler, vet
  check, or test failure shows — open a blocking finding. *(`H6`, `Principle 3`)*
- [ ] `GO-CHECK-07` **[gate]** — PASS if every `sync` type is reached only through a pointer after first
  use, with pointer receivers throughout the holding struct. FAIL if a `Mutex`, `RWMutex`, `Once`,
  `WaitGroup`, `Cond`, `Map`, or `Pool` is copied by a value receiver, an assignment, or a range variable.
  *Evidence:* `go vet ./...` `copylocks` output plus a read of the receiver set. *On fail:* two copies guard
  nothing — open a blocking finding. *(`H13`)*
- [ ] `GO-CHECK-08` **[req]** — PASS if `test -z "$(gofmt -l .)"` and `test -z "$(goimports -l .)"` both
  exited zero on fresh output. FAIL if either ran bare (listing offenders while exiting `0`), was skipped, or
  is claimed without a recorded exit status.
  *Evidence:* the recorded command lines and exit statuses. *On fail:* return to P7 gate 1. *(`H3`, `P7`)*
- [ ] `GO-CHECK-09` **[req]** — PASS if every function that can block, do I/O, or be cancelled takes
  `ctx context.Context` as its first parameter named `ctx`, and no `Context` is stored in a struct. FAIL if
  the parameter is positioned elsewhere, renamed, or held on a type — unless the case is one of the two
  stated exceptions (a standard-library or third-party interface that requires it, or the `http.Request`
  retrofit), which is named in the diff.
  *Evidence:* read every changed signature and struct field list. *On fail:* open a finding on the signature.
  *(`H5`)*
- [ ] `GO-CHECK-10` **[gate]** — PASS if `go test -race ./...` ran on fresh output for a change touching
  concurrency AND the synchronization decision — owner and mechanism — is written down beside every piece of
  shared memory. FAIL if the race gate was skipped or assumed, or a shared value carries no written decision.
  *Evidence:* the recorded `-race` command and exit status, plus the in-code decision notes. *On fail:* a
  green run without the written decision is evidence, not proof — open a blocking finding.
  *(`H9`, `Principle 6`)*
- [ ] `GO-CHECK-11` **[gate]** — PASS if every error is handled or returned, every failure is reported
  through the error result, and every type assertion uses the comma-ok form. FAIL if an error is discarded
  with `_`, an in-band sentinel (`-1`, `""`) carries a failure, or a single-result assertion can panic.
  *Evidence:* `rg '_ = |_, _ :?=|\.\(\*?\w+\)$'` over the diff plus a read of each return type. *On fail:* a
  discarded error is a decision no reader can audit — open a blocking finding. *(`H16`)*
- [ ] `GO-CHECK-12` **[req]** — PASS if every dependency requirement is expressed with `require`, and any
  `replace` or `exclude` exists only in a main module for local development. FAIL if `go.sum` is described or
  used as a lockfile, or a library ships a `replace` or `exclude` expecting downstream effect.
  *Evidence:* read the changed `go.mod` and the artifact type recorded at P1. *On fail:* open a finding on
  `go.mod`. *(`H18`)*
- [ ] `GO-CHECK-13` **[req]** — PASS if every use of `unsafe`, `cgo`, or reflection carries a named earned
  reason recorded in the review. FAIL if any of the three appears with no stated reason, or with a reason
  that a plain-Go form would also satisfy.
  *Evidence:* `rg 'unsafe\.|"C"|reflect\.'` over the diff, against the review record. *On fail:* open a
  finding on the escape hatch. *(`H17`, `Principle 8`)*
- [ ] `GO-CHECK-14` **[gate]** — PASS if every version-gated symbol taught or used states the module floor it
  needs, and no symbol above the declared floor is presented as available there. FAIL if a version-gated
  symbol is named with no floor qualifier, or a form that is correct at the floor is marked obsolete.
  *Evidence:* per-symbol "added in" citation against the recorded floor. *On fail:* code that does not build
  at the stated floor ships as guidance — open a blocking finding. *(`H19`, `H10`)*

## Design judgment

- [ ] `GO-CHECK-15` **[req]** — PASS if every interface the change introduces is declared in the package that
  consumes it, and every producer returns a concrete type. FAIL if an interface sits beside its
  implementation, is declared before a consumer needs it, or is returned where a concrete type would serve.
  *Evidence:* locate each interface declaration and its consumers. *On fail:* return to P3 step 3.
  *(`H7`, `Principle 4`)*
- [ ] `GO-CHECK-16` **[req]** — PASS if the layout is flat-first with `internal/` where the boundary must be
  compiler-enforced and `cmd/` only for more than one binary. FAIL if a `pkg/` directory exists, or a `util`,
  `common`, or `misc` package does.
  *Evidence:* the package tree, and `rg '(^|[^/.])\bpkg/'` over the change. *On fail:* return to P3 step 1.
  *(`H14`, `P3`)*
- [ ] `GO-CHECK-17` **[req]** — PASS if every error is handled exactly once, `%w` is used only where a caller
  is meant to match on the wrapped error, and error strings are uncapitalized with no trailing punctuation.
  FAIL if a path logs and returns the same error, wraps reflexively at every layer, or capitalizes or
  punctuates an error string.
  *Evidence:* read each error return path and each `fmt.Errorf` verb. *On fail:* return to P3 step 5.
  *(`H4`, `Principle 2`, `P3`)*
- [ ] `GO-CHECK-18` **[req]** — PASS if every type parameter is earned by repeated identical code differing
  solely in type. FAIL if a type parameter replaces an interface type, or serves a single call site.
  *Evidence:* substitute the interface or concrete type and compare. *On fail:* return to P3 step 2.
  *(`H17`, `Principle 8`)*
- [ ] `GO-CHECK-19` **[req]** — PASS if each new type's zero value was designed before its constructor, and
  every reuse of another type is a named field with explicit delegation unless the embedded API is meant to
  be permanently public. FAIL if a constructor exists only to set fields a useful zero value would already
  carry, or an exported type is embedded so its promoted method set becomes this package's surface.
  *Evidence:* read each new type declaration and its constructor. *On fail:* return to P3 step 2.
  *(`Principle 5`, `P3`)*

## Operation & evidence

- [ ] `GO-CHECK-20` **[gate]** — PASS if every applicable P7 gate ran in order on fresh output and failed the
  chain by exit status, with each skipped gate recorded together with its reason. FAIL if a gate was skipped
  silently, reordered past a gate it depends on, asserted without running, or run in a form that reports and
  still exits `0`.
  *Evidence:* the ordered command lines with their exit statuses. *On fail:* the whole-change claim is
  unproven — halt the handoff. *(`P7`)*
- [ ] `GO-CHECK-21` **[req]** — PASS if every fork the change activates had its P2 child read before the
  decision it governs, with the routing re-run after each design change. FAIL if a decision was made before
  its child was read, or a service-API call was made without reading `service-clients.md` §1–§12 first.
  *Evidence:* the P2 routing record against the diff's surfaces. *On fail:* return to P2. *(`P2`)*
- [ ] `GO-CHECK-22` **[req]** — PASS if the P4 design packet was approved before any body in author mode, or
  reconstructed and graded without editing in review mode. FAIL if bodies preceded the packet, the approval
  is not recorded and no prior decision is cited, or review mode edited.
  *Evidence:* the recorded packet and its approval or citation. *On fail:* return to P4. *(`P4`, `P3`)*
- [ ] `GO-CHECK-23` **[req]** — PASS if `go build ./...` was green on the stub-bodied skeleton before any
  behavior was written. FAIL if the first build evidence postdates a written body.
  *Evidence:* the build record at the skeleton checkpoint. *On fail:* return to P5. *(`P5`)*
- [ ] `GO-CHECK-24` **[req]** — PASS if each slice produced fresh focused evidence — `gofmt`, `go build
  ./...`, the focused `go test` — before the next began, and every affected caller, test, doc comment, and
  generated artifact moved in the same slice. FAIL if first evidence arrives only after a whole-feature pass,
  or an affected surface lagged its slice.
  *Evidence:* the per-slice records in order. *On fail:* return to P6. *(`P6`)*
- [ ] `GO-CHECK-25` **[gate]** — PASS if the trace closes in both directions: every approved design item maps
  to implemented code, every scope item maps to a diff line with nothing exceeding it, every affected-set
  file is updated or is a justified no-op, and every success criterion has fresh evidence. FAIL if any
  approved item is unimplemented, any diff line is outside scope, or any caller, test, doc comment, or
  generated file is stale.
  *Evidence:* the P4 packet and the P1 affected set, walked against the diff. *On fail:* the change is
  out of contract or incomplete — halt the handoff. *(`P8`)*
- [ ] `GO-CHECK-26` **[req]** — PASS if scope, success, artifact type, layout, mode, and either the affected
  set or the reproduced root were all written down at P1. FAIL if any of the six is missing, or a bug was
  repaired before it was reproduced.
  *Evidence:* the P1 record. *On fail:* return to P1. *(`P1`)*

## Document currency and citation

These items grade this skill's own files. They apply when the change-set edits `skills/go/`; against
ordinary Go source they resolve `n/a: the change-set contains no skills/go file`.

- [ ] `GO-CHECK-27` **[gate]** — PASS if `cited_blocks + declared_exemptions == total_blocks` over every
  fenced ` ```go ` block in the tree, counting only exemptions named in the frozen list below. FAIL if any
  count differs.
  *Evidence:* the block count, the adjacent-`Source:` count, and the exemption list, recorded together. *On
  fail:* an uncited example is the one fact-check a reader has, missing — halt and cite or remove the block.
  *(`H10`)* — sweep `V1`.
- [ ] `GO-CHECK-28` **[req]** — PASS if every hit of the `V2` retired-vocabulary pattern set sits inside an
  explicitly-marked obsolete table, a forbidding sentence, or the `V2` allowlist. FAIL if any hit appears in
  prescriptive prose.
  *Evidence:* the anchored `rg` run with its per-hit disposition. *On fail:* open a finding on the hit's
  sentence. *(`H15`, `H12`)* — sweep `V2`.
- [ ] `GO-CHECK-29` **[req]** — PASS if every `go1.NN`, `vN.N.N`, and `N.NN` token in the tree resolves to a
  Version Currency Register row in `modules-tooling.md`. FAIL if any version token is orphaned.
  *Evidence:* the extracted token list against the register. *On fail:* add the register row or remove the
  claim. *(`H10`)* — sweep `V3`.
- [ ] `GO-CHECK-30` **[req]** — PASS if every `1.27` occurrence sits in a sentence containing "draft" or "not
  yet released". FAIL if any presents unreleased behavior as current.
  *Evidence:* `rg -n '1\.27'` with each hit's sentence. *On fail:* open a finding on the sentence. *(`H19`)*
  — sweep `V4`.
- [ ] `GO-CHECK-31` **[gate]** — PASS if a dated `**Verified:** YYYY-MM-DD against <URL>` header line exists
  in exactly these seven files: `aws.md`, `docker.md`, `grpc.md`, `kubernetes.md`, `observability.md`,
  `service-clients.md`, `modules-tooling.md`. FAIL if a stamp is missing, undated, or present in a file
  outside that set while one inside it lacks one.
  *Evidence:* the seven header lines, read by name. *On fail:* a tree with seven stamps in the wrong seven
  files passes a count and hides the rot — halt and fix the composition. *(`H10`)* — sweep `V5`.
- [ ] `GO-CHECK-32` **[req]** — PASS if every Markdown link in the tree resolves, every intra-skill link is
  same-directory or sibling, and zero links point at `messaging.md`. FAIL if a link is broken,
  repo-root-relative, or names the deferred file.
  *Evidence:* `scripts/check-markdown-links.sh` plus a read of every intra-skill link target. *On fail:* the
  P2 router names a destination a reader cannot reach — open a finding. *(`P2`)* — sweep `V6`.
- [ ] `GO-CHECK-33` **[gate]** — PASS if every hit of the twelve hazard-class phrases across the five tool
  children falls inside the declared fragment's sentence in an allowlisted `(file, class, fragment)` triple
  below, and no single-owner item from the ownership table appears in two children. FAIL if a hit lands
  outside a declared fragment — including padding inside a cell the sweep already expects to match.
  *Evidence:* the twelve phrase greps with each hit located against its triple. *On fail:* a child has taken
  rationale the base owns — halt and delete the restatement from the child. *(`P2`, `H10`)* — sweep `V7`.
- [ ] `GO-CHECK-34` **[gate]** — PASS if every taught form in the tree — every symbol, directive, command,
  option, and example construct the tree instructs a reader to use or to stop using — is classified as
  available at the floor, needing a named raised floor, or toolchain-gated. FAIL if any taught form carries
  none of the three, including a form named with no version at all.
  *Evidence:* the enumerated form list with its per-form classification and owner. *On fail:* a form named
  without a version reads as unconditionally available — halt and classify it. *(`H19`, `H10`)* — sweep
  `V11`.
- [ ] `GO-CHECK-35` **[gate]** — PASS if, for each sampled taught claim, the cited owner was read as source
  or raw document at a pinned tag and contains the claim — its key term located and its quoted sentence
  copied from what was read. FAIL if the cited page does not contain the claim's key term, the quoted
  sentence is absent from the source, or the support was taken from a rendered summary.
  *Evidence:* the raw-source or pinned-tag fetch, the key-term grep result, and the diff of the quoted
  sentence against the source. *On fail:* a rendered fetch has been caught fabricating exactly the support
  it was asked to confirm — halt and re-source or drop the claim. *(`H10`)* — sweep `V12`.
- [ ] `GO-CHECK-36` **[gate]** — PASS if every currency claim rests on the owner's own notice, read at a
  released tag. FAIL if a staleness question is cleared by a module page rendering "Latest", by a
  default-branch URL returning HTTP 200, or by a clean `go fix` run.
  *Evidence:* the owner notice with its read date, beside the tag it was read at. *On fail:* a stale answer
  that passes every mechanical check ships — halt and read the owner. *(`H10`, `P2`)*

## Sweep data this file owns

Both lists are frozen sweep inputs. Neither changes during a run: a change is an explicit edit to this file,
made before the sweep runs.

### `V1` — the pre-declared exemption list

Two exemption classes exist and no others: **(i)** a fenced ` ```go ` block inside an explicitly-labelled
obsolete or forbidden table; **(ii)** a block whose adjacent line reads exactly
`Illustrative sketch — not a taught form`.

**Declared exemptions: none.** The list is empty. Every fenced ` ```go ` block in the tree must carry an
adjacent `Source:` line. An author who needs an exemption adds the row here first, with the file, the
approximate line, and the class — and only then runs the sweep.

### `V7` — the allowlisted `(file, class, fragment)` triples

A hit passes only if it falls inside the declared fragment's sentence. A pair-level match is not enough: the
defect this triple form exists to catch is a child padding an already-expected cell with class rationale.

| File | Class | Declared delta fragment |
|---|---|---|
| `aws.md` | §3 | `retry.Standard` / `3 attempts` |
| `aws.md` | §5 | `NewListObjectsV2Paginator` / `HasMorePages` |
| `aws.md` | §6 | `smithy.OperationError` |
| `aws.md` | §7 | `ClientLogMode` / `LogRequestWithBody` |
| `kubernetes.md` | §3 | `RetryOnConflict` |
| `kubernetes.md` | §4 | `DefaultQPS` / `DefaultBurst` |
| `kubernetes.md` | §9 | `fake clientset` / `envtest` |
| `kubernetes.md` | §11 | `resourceVersion` |
| `docker.md` | §12 | `WithAPIVersionNegotiation` |
| `observability.md` | — | none declared |

**Dropped row.** `grpc.md` §2 *"new TCP connection per dial"* was declared and is dead:
`service-clients.md` absorbed that sentence and the child correctly omits it, so the row can never match.
It is removed rather than carried.

**Pre-run reconciliation required — read before the next `V7` run.** Reading the tree on 2026-07-26 found
four further discrepancies between this frozen list and the files. They are recorded, not silently edited,
because the list changes only by an explicit edit: `aws.md` §3's delta is `aws.Config.Retryer` /
`RetryMaxAttempts`, not `retry.Standard` / `3 attempts`; `kubernetes.md` has no §4 and no §9 row, so both
those triples are dead like the `grpc.md` one; and `kubernetes.md` carries §5 and §8 rows that no triple
covers, so a legitimate hit there scores FAIL. Resolve all four by an explicit edit to the table above
before the sweep is scored.

## Reverse-trace table

Every check resolves to a live `SKILL.md` anchor. The seed column names the case whose obligation produced
the check; `activation only` means the case selects the check without the anchor being that case's defining
discrimination, and `none — rule-partial` means [`scenarios.md`](scenarios.md)'s coverage map declares that
anchor uncovered and this item is what covers it.

| Check | Anchor(s) | Seed scenario |
|---|---|---|
| `GO-CHECK-01` | `H1`, `Principle 1`, `P1` | `GO-SCENARIO-01` |
| `GO-CHECK-02` | `H12` | `GO-SCENARIO-02` |
| `GO-CHECK-03` | `H2`, `P7` | `GO-SCENARIO-03` |
| `GO-CHECK-04` | `H11`, `Principle 2` | `GO-SCENARIO-04` |
| `GO-CHECK-05` | `H8`, `Principle 7` | `GO-SCENARIO-05` |
| `GO-CHECK-06` | `H6`, `Principle 3` | `GO-SCENARIO-06` |
| `GO-CHECK-07` | `H13` | `GO-SCENARIO-06` |
| `GO-CHECK-08` | `H3`, `P7` | none — rule-partial; `GO-SCENARIO-11` activation only |
| `GO-CHECK-09` | `H5` | none — rule-partial |
| `GO-CHECK-10` | `H9`, `Principle 6` | none — rule-partial; `GO-SCENARIO-06`, `-11` activation only |
| `GO-CHECK-11` | `H16` | none — rule-partial |
| `GO-CHECK-12` | `H18` | none — rule-partial |
| `GO-CHECK-13` | `H17`, `Principle 8` | none — rule-partial |
| `GO-CHECK-14` | `H19`, `H10` | `GO-SCENARIO-16` |
| `GO-CHECK-15` | `H7`, `Principle 4` | `GO-SCENARIO-07` |
| `GO-CHECK-16` | `H14`, `P3` | `GO-SCENARIO-08` |
| `GO-CHECK-17` | `H4`, `Principle 2`, `P3` | `GO-SCENARIO-09` |
| `GO-CHECK-18` | `H17`, `Principle 8` | `GO-SCENARIO-10` |
| `GO-CHECK-19` | `Principle 5`, `P3` | `GO-SCENARIO-07` |
| `GO-CHECK-20` | `P7` | `GO-SCENARIO-03`, `-11` |
| `GO-CHECK-21` | `P2` | `GO-SCENARIO-14`, `-15` |
| `GO-CHECK-22` | `P4`, `P3` | `GO-SCENARIO-08` |
| `GO-CHECK-23` | `P5` | none — `P5` is procedure-partial |
| `GO-CHECK-24` | `P6` | none — `P6` is procedure-partial |
| `GO-CHECK-25` | `P8` | none — `P8` is procedure-partial |
| `GO-CHECK-26` | `P1` | `GO-SCENARIO-01` |
| `GO-CHECK-27` | `H10` | `GO-SCENARIO-12`, `-13` |
| `GO-CHECK-28` | `H15`, `H12` | `GO-SCENARIO-12` |
| `GO-CHECK-29` | `H10` | `GO-SCENARIO-13`, `-15` |
| `GO-CHECK-30` | `H19` | `GO-SCENARIO-16` |
| `GO-CHECK-31` | `H10` | `GO-SCENARIO-15` |
| `GO-CHECK-32` | `P2` | `GO-SCENARIO-14` |
| `GO-CHECK-33` | `P2`, `H10` | `GO-SCENARIO-14` |
| `GO-CHECK-34` | `H19`, `H10` | `GO-SCENARIO-16` |
| `GO-CHECK-35` | `H10` | `GO-SCENARIO-05`, `-13` |
| `GO-CHECK-36` | `H10`, `P2` | `GO-SCENARIO-15` |
