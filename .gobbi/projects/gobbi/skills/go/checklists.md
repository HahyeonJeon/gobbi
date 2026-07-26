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
  *Evidence:* the recorded command line and exit status, **dated, against the timestamp of the last
  change in the diff** — a command line and an exit status alone cannot distinguish a fresh run from a
  replayed one, so the run must be shown to postdate the code it claims to cover. *On fail:*
  `copylocks` and `lostcancel` defects ship unseen — halt the handoff and run the full vet.
  *(`H2`, `P7`)*
- [ ] `GO-CHECK-04` **[gate]** — PASS if every error-returning path declares its variable as `error` and
  returns a literal `nil` on success. FAIL if a concrete pointer type reaches an `error` result.
  *Evidence:* read each function returning a custom error type; `rg 'var \w+ \*\w*Err'` over the diff. *On
  fail:* `err != nil` fires on the success path with no analyzer reporting it — open a blocking finding.
  *(`H11`, `Principle 2`)*
- [ ] `GO-CHECK-05` **[gate]** — PASS if every slice or map crossing a boundary this change does not own is
  copied — `slices.Clone`, the three-index form, or `slices.Clip` — and each returned slice or map says in
  its doc comment whether it is shared or owned. FAIL if `append` can write into a caller's array, a
  sub-slice pins a large backing array, a map assignment is treated as a copy, **or a `slices.Clone` of
  a slice of pointers, slices, or maps is treated as a deep copy** — `Clone` copies one level only
  (`H8`), so a cloned `[]*T` is a new slice over the caller's pointees and the boundary is not closed.
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
- [ ] `GO-CHECK-28` **[req]** — PASS if every hit of the `V2` retired-vocabulary pattern set sits inside one
  of four declared homes: an explicitly-marked obsolete table, a forbidding sentence, an explicitly-labelled
  bad-case field in [`scenarios.md`](scenarios.md) (`**Situation:**`, `**Bad handling:**`,
  `**Adversarial probe:**`), or the `V2` allowlist below. FAIL if any hit appears in prescriptive prose.
  *Evidence:* the anchored `rg` run with its per-hit disposition. *On fail:* open a finding on the hit's
  sentence.
  **Scoring unit:** the sentence, with wrapped lines joined first — except that a table row is scored as a
  whole row and a `scenarios.md` field as a whole field, because in both the marking sits in the row's or
  field's label rather than in every sentence under it. **The fourth home is a completion, not a
  loosening:** the bad-case field labels are literal, machine-checkable markers, and a case whose whole job
  is to exhibit a retired form is the strongest forbidding frame in the tree — rewording five of them to
  insert the word "never" would damage the cases to satisfy a scorer. *(`H15`, `H12`)* — sweep `V2`.
- [ ] `GO-CHECK-29` **[req]** — PASS if every `go1.NN`, `vN.N(.N)`, and `N.NN` **version token** in the
  tree resolves to its declared owner: a **Go or Go-toolchain** figure to a Version Currency Register
  row in `modules-tooling.md` §9 or §10; a **per-tool SDK, module, or wire-API** figure to the owning
  tool child's own dated `**Version / support status:**` header line (`modules-tooling.md` §9 states
  the split and its reason). FAIL if any version token resolves to neither.
  *Evidence:* the extracted token list, each token marked Go-figure or tool-figure, against the register
  and the five child header lines. *On fail:* add the register row, add the child header line, or remove
  the claim.
  **Population:** a *version token* is a numeral the prose asserts as a version. A numeral inside a URL
  or a file path (`go.dev/blog/go1.13-errors`), and a numeral that is not a version (`DefaultQPS
  float32 = 5.0`), are not version tokens and are out of population — that is what the sweep measures,
  not an exemption from it. *(`H10`)* — sweep `V3`.
- [ ] `GO-CHECK-30` **[req]** — PASS if every `\b1\.27` occurrence sits in a sentence containing "draft"
  or "not yet released". FAIL if any presents unreleased behavior as current.
  *Evidence:* `rg -n '\b1\.27'` with each hit's sentence. *On fail:* open a finding on the sentence.
  **The leading `\b` is load-bearing and is a narrowing, not a loophole:** the population is the next
  Go release, whose notes are still a draft, and `\b1\.27` excludes a third-party module version whose
  minor happens to be 27 — `smithy-go`'s, which `aws.md`'s header owns — while still matching that
  numeral in every bare, prose, and backticked form. A Go-version hit still fails without the "draft"
  or "not yet released" qualifier. *(`H19`)* — sweep `V4`.
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
  rationale the base owns — halt and delete the restatement from the child.
  **Population:** a tool child's `## Hazard-class deltas` table and its `## Tool facts the shared base
  cannot carry` section. The header block and the `## Read the owner instead of this file` section are
  out of population, because `service-clients.md`'s read-order gate already declares those two blocks
  answerable without reading §1–§12 — they carry an import path, a version, and owner URLs, and cannot
  carry class rationale by construction.
  **Scoring unit:** the sentence. A hit passes only if the sentence containing it also contains one of
  the `/`-separated fragment tokens declared for that `(file, class)` pair.
  **Stated residual, which this item does not claim away:** rationale padding that reuses none of the
  twelve phrases is invisible to any token sweep. `V7` bounds the drift it can see; the delta test at
  review carries the rest. *(`P2`, `H10`)* — sweep `V7`.
- [ ] `GO-CHECK-34` **[gate]** — PASS if every taught form in the tree — every symbol, directive, command,
  option, and example construct the tree instructs a reader to use or to stop using — has been classified
  as available at the `go 1.25.0` floor, needing a named raised floor, or toolchain-gated; **and** every
  form in the second and third classes carries that qualifier, or a pointer to the file that states it,
  beside the place the tree teaches it. FAIL if a form cannot be classified, or if a raised-floor or
  toolchain-gated form is taught with no qualifier and no pointer.
  *Evidence:* the enumerated form list with its per-form classification and owner. **The population is
  every taught form, with or without a stated version** — a form named with no version is the defect's
  most common shape, and classification is the sweep's output, never its input filter. A form that
  classifies as available at the floor needs no qualifier; it still has to appear in the enumeration.
  *On fail:* a raised-floor form named without its floor reads as unconditionally available — halt and
  qualify it. *(`H19`, `H10`)* — sweep `V11`.
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

All three lists are frozen sweep inputs. None changes during a run: a change is an explicit edit to this
file, made before the sweep runs.

### `V1` — the pre-declared exemption list

Two exemption classes exist and no others: **(i)** a fenced ` ```go ` block inside an explicitly-labelled
obsolete or forbidden table; **(ii)** a block whose adjacent line reads exactly
`Illustrative sketch — not a taught form`.

**Declared exemptions: none.** The list is empty. Every fenced ` ```go ` block in the tree must carry an
adjacent `Source:` line. An author who needs an exemption adds the row here first, with the file, the
approximate line, and the class — and only then runs the sweep. **The list stayed empty through the
2026-07-26 whole-tree run:** ten uncited blocks were found and all ten were resolved by citing an
owner, none by exemption. Widening this list to clear a `V1` failure is the failure `V1` exists to
prevent.

### `V2` — the retired-vocabulary allowlist

`GO-CHECK-28` names this list; here it is. A hit at one of these exact strings is expected and passes
without sitting in an obsolete table or a forbidding sentence. Nothing else does.

| Allowlisted string | Why it is expected |
|---|---|
| `pkg/lint/lintersdb/builder_linter.go` | The golangci-lint source path the default-linter count is read from — a required citation, and the `(^\|[^/])\bpkg/` pattern matches it. `modules-tooling.md` §7 and §9 |
| any `pkg.go.dev` URL | The `(^\|[^/])\bpkg/` pattern matches the host name. `service-clients.md`'s header stamp is the live instance |

The allowlist is part of the sweep definition, not a per-run judgment call. A retired token anywhere
else — including a sweep-data table in this file — must sit in an explicitly-marked obsolete table or a
forbidding sentence, which is why the `docker.md` §12 row in the triple table below names the symbol as
one the child forbids.

### `V7` — the allowlisted `(file, class, fragment)` triples

A hit passes only if it falls inside the declared fragment's sentence. A pair-level match is not enough: the
defect this triple form exists to catch is a child padding an already-expected cell with class rationale.
A fragment cell is a `/`-separated list of literal tokens; a hit passes if its sentence contains any one
of them.

| File | Class | Declared delta fragment |
|---|---|---|
| `aws.md` | §3 | `aws.Config.Retryer` / `Retryer` / `RetryMaxAttempts` |
| `aws.md` | §5 | `NewListObjectsV2Paginator` / `HasMorePages` / `StopOnDuplicateToken` |
| `aws.md` | §6 | `smithy.APIError` / `smithy.OperationError` |
| `aws.md` | §7 | `ClientLogMode` / `LogRequestWithBody` / `LogRetries` |
| `kubernetes.md` | §3 | `RetryOnConflict` |
| `kubernetes.md` | §5 | `no paginator object` / `ListOptions.Limit` / `ListMeta.Continue` |
| `kubernetes.md` | §6 | `apierrors` |
| `kubernetes.md` | §8 | `SharedInformerFactory` / `StartWithContext` / `Shutdown` |
| `kubernetes.md` | §11 | `resourceVersion` / `apierrors.IsConflict` |
| `docker.md` | §12 | `WithAPIVersionNegotiation` — **the no-op option `docker.md` forbids writing into new code** — / `WithAPIVersion` / `Negotiation only ever` / `MaxAPIVersion` |
| `grpc.md` | — | none declared |
| `observability.md` | — | none declared |

**Dropped rows — three, all dead against the tree.** A dead triple is removed rather than carried,
because a row that can never match hides the fact that the class it names is unclaimed.

- `grpc.md` §2 *"new TCP connection per dial"* — `service-clients.md` §2 absorbed that sentence and the
  child correctly omits it. `grpc.md` produces **zero** hits on all twelve phrases, which is why its row
  now reads *none declared* rather than naming a fragment.
- `kubernetes.md` §4 `DefaultQPS` / `DefaultBurst` — the child has no §4 row; `service-clients.md` §4
  owns those two constants outright.
- `kubernetes.md` §9 `fake clientset` / `envtest` — the child has no §9 row; `service-clients.md` §9
  owns the official-fake class and quotes both notices.

**Reconciliation of 2026-07-26, made as an explicit edit before the run that scored it.** Reading the
tree found the frozen list disagreed with the files in six places, and every one was resolved here
first: `aws.md` §3's delta is `aws.Config.Retryer` / `RetryMaxAttempts` and not `retry.Standard` /
`3 attempts` — the latter is `service-clients.md` §3's own content, so the old triple pointed the sweep
at the base's text; three dead rows were dropped as above; and `kubernetes.md` §5, §6 and §8 carried
legitimate delta rows that no triple covered, so a real hit in any of them scored FAIL. Scored against
the un-reconciled list the tree failed **10 of 16** hits; against this list it fails **0 of 16**, and
the ten were mis-declared triples rather than restatements in the children. Nothing in a tool child was
edited to make `V7` pass.

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
