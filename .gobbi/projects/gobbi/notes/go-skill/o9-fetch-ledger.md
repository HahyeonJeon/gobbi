# O-9 fetch ledger — task 01 completion evidence
Fetched 2026-07-25. **All four branches complete.** Branch detail in
`../working/iteration-1/research/{o9h-parent,o9d-register,o9c-language,o9ab-service-clients-and-tools}.md`.

**This is the first and only time any taught Go fact in this skill met a real owner URL.**
D-2 removed the compiler; D-3 removed the second system. Everything below is what stands between the
skill and model memory.

## Result: 11 corrections. Zero branches failed. No design escalation required.

The task-01 failure route (>50% of a branch unreachable → stop before task 02) **was not triggered.**

## Corrections that change what the skill may teach

| # | Correction | Consequence |
|---|---|---|
| **1** | **`go test` runs 11 vet checks, not 10** — `defaultVetFlags` includes `-slog`; the doc prose in the same file drifted | Write **11 of 35**. The design point is unchanged and strengthened: `copylocks`/`lostcancel` remain outside it |
| **2** | **Map aliasing IS spec-owned** — in *Representation of values* + *Assignment statements*, not Map types | **X-23's deletion fallback CANCELLED.** Claim is citable. But the spec never says "reference type" — use its words: *"a reference to the implementation-specific data structure"* |
| **3** | **"cgo forecloses pure-Go cross-compilation" is NOT supported** — the page says cgo defaults to disabled when cross-compiling and needs a C cross-compiler. Configuration, not foreclosure | Reword to the mechanics, or attribute the cost claim to the proverb *"Cgo is not Go"* as rhetoric. **The causal claim is community synthesis** |
| **4** | **`gofmt` has NO Go-team normative owner.** `cmd/gofmt` is purely mechanical | H3 is citable as **Google's** rule (`styleguide/go/guide#formatting`, "normative and canonical"). **Do not attribute to go.dev** |
| **5** | **Google's guide has THREE authority tiers** — `guide` normative+canonical; `decisions` normative-not-canonical; `best-practices` **neither** | Assertion-libraries is on `decisions`; log-and-return is on `best-practices`. **Citing both at one URL and one strength is wrong twice** |
| **6** | **`WithAPIVersionNegotiation` is a NO-OP**, not merely deprecated; both deprecated Docker symbols carry `//go:fix inline` | Teach **`go fix`**, not a manual migration. "Call it for safety" is cargo cult |
| **7** | **The pkg.go.dev "Latest" trap is mechanical and unfixable by waiting** — `docker/docker` has no newer version, so tooling calls it latest **forever**. Removal date: **confirmed none** (`grep -i remov` = 0 hits) | Teach as the durable hazard: **module metadata is not a deprecation signal** |
| **8** | **AWS retry costs are ENV-GATED** — `newRetries2026()` reads `AWS_NEW_RETRIES_2026`; `RetryCost` 5→14. **pkg.go.dev prose never mentions it** | State as defaults **with the env gate named**. Fixed constants would be wrong for anyone with the flag set |
| **9** | **`t.Parallel` does NOT own parent/subtest ordering** | Cite **package doc §Subtests + `T.Run`** instead |
| **10** | **`runtime/pprof` is a thin API owner, not a teaching owner** | Teach from **`go.dev/doc/diagnostics`**; cite `runtime/pprof` for API surface only. The two profile lists disagree; **`goroutineleak` version UNVERIFIED — do not teach without a gate** |
| **11** | **`strings.Builder`'s doc gives NO rationale for preferring it over `+=`** | Present as the skill's own claim or cite elsewhere. **Do not attribute to the package doc** |

## Weakenings — claims that overstate their source
- **controller-runtime:** Go column is literally *"minimum Go version"*; client-go pairing is
  *"by chance and neither supported nor tested"*. **"CR vX requires client-go vY" overstates it.**
  Current top row: **CR v0.24 / k8s v0.36 / Go 1.26**.
- **`DialContext` deprecation** is NOT supported by `anti-patterns.md` (which targets `grpc.Dial`).
- **`grpc.Dial` is deprecated but explicitly still supported** — *"no plans for a v2 exist"*. Not
  removal-imminent.
- **Go Proverbs are mutable** — the site says the list *"may be updated when he next gives the talk"*.
  Date any citation.

## ★ The method rule, corrected twice by its own application

The project's note said *"prefer raw CHANGELOG.md over rendered releases pages."* **Incomplete.**
- golangci-lint `master` returns **v1-era content at HTTP 200** — the live branch is `main`
- Prometheus `main/CHANGELOG.md` is **stale by a full minor**; the tagged copy is correct
- ~~pkg.go.dev **dropped a clause** present in `src/testing/testing.go`~~ **RETRACTED 2026-07-26 —
  this claim was itself an instance of the trap it warned about.** Verified at source by the task-03
  evaluator: `src/testing/testing.go` @ **`go1.26.5`** does NOT contain "and pauses until all
  non-parallel tests have finished" (`grep -c` = 0); `master` DOES; and pkg.go.dev renders text
  **identical to the released tag**. pkg.go.dev dropped nothing. The O-9c researcher compared a **tip**
  source read against a **released** rendering. **Do not use this as the worked example for the
  pin-the-tag rule — it is a counter-example to itself.**
- Go stdlib quotes read from `master` are **ahead of go1.26.0** — this is the real lesson, and the
  retraction above is its own best illustration

> **Corrected rule: pin the tag. A default-branch path and a 200 response are both assumptions, not
> currency guarantees. When exact wording is load-bearing, read the source file, not the rendered page.**

## Verified figures for the Version Currency Register
Go **1.26.0** GA 2026-02-10 (toolchain 1.26.5) · floor for a new module **`go 1.25.0`** ·
golangci-lint **v2.12.2**, default set exactly `errcheck govet ineffassign staticcheck unused` ·
staticcheck **v0.7.0 / 2026.1** · gofumpt **v0.10.0** · testify **v1.11.1** ·
`go vet` **35 analyzers** · moby client **v0.5.0**, API 1.40–1.55 ·
client-go `DefaultQPS 5.0` / `DefaultBurst 10` · AWS `DefaultMaxAttempts 3`, backoff 20s, 500 tokens ·
gRPC **v1.82.1** · Prometheus **v1.24.1** · OTel **v1.44.0**, Logs **Beta** ·
`slices` = **Go 1.21** (empty badge means present-at-introduction) · `synctest` = **go1.25.0**

## Still UNVERIFIED — must ship with an explicit marker or take a fallback
- `goroutineleak` profile introduction version
- Go Proverbs list stability beyond "may be updated"
Per **O-9g**: an unfetched item takes its stated fallback or ships
`**Unverified:** <what, why, what would resolve it>`. **Never an unmarked assertion.**
