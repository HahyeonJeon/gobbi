# Task plan — the `go` skill

**Session:** 2026-07-25-2f9595bb-307f-4260-bdd8-8bdb5b6df9ff
**Step:** 2-planning (WORK output)
**Consumer:** a fresh executor with no access to this session's discussion.
**Source of design authority:** `1-ideation/outputs/ideation-artifact.md` (revision 5, 1,281 lines, PASSED) and `1-ideation/working/iteration-1/open-decisions.md` (D-1…D-16).

All inputs verified on disk: the 1,281-line artifact, D-1…D-16, the five research reports, iteration-4 PASS, `operation-skill.md` S1–S11, `git/conventions.md`, the project rule (`rules/docs/point-dont-restate-workflow-docs.md`), all cited skills and mistake files, the four wiring anchors at their stated lines, `go: command not found`, and `sync-plugin-package.sh`'s generic `for_each_canonical_skill()` (no hardcoded skill list → no script edit).

---

## Deviations from D-16 requiring manager confirmation

**Read this before starting task 01.** Two things in this plan differ from the recorded user decision D-16. Both are stated here so no executor discovers them mid-run. Neither changes what is built; both change how the work is cut.

### Deviation 1 — eleven tasks, not the nine-to-ten D-16 records

D-16's item 10 bundled wiring + sync + the verification sweeps into one task. This plan splits that into **task 10 (whole-tree sweeps)** and **task 11 (wiring, sync, runtime proof)**.

**Why.** The artifact's §11 item 4 requires the whole-tree sweeps be their own work, and there is a hard causal seam: V7, V10 and V11 run on the **canonical** tree and may force edits, while V8 and V9 require the **generated mirrors**, which must be produced from a tree that is already final. Bundling them puts a sync before a possible fix.

**Status.** D-16 is a user decision. The manager should confirm the extra task with the user rather than let this plan silently resize it.

### Deviation 2 — language-child batch composition regrouped

D-7's manager delivery plan grouped the eight language children as `convention, design, errors | concurrency, modules-tooling | testing, performance, interop`. This plan uses `modules-tooling, errors, interop | testing, performance, convention | design, concurrency`.

**Why.** D-7's batch A puts `design.md` — which points at `interop.md` — three batches ahead of its target, and puts `errors.md`'s `go1.26.0` / `go1.20` version claims ahead of the Version Currency Register they must resolve to. Both are hoist-then-point violations against §5's own stated edge rule ("never point at content the owner does not yet hold"). The order used here is a topological sort of §4.7's *Points, does not own* lines.

**Status.** D-16 fixes the batch **count** (three) and the overall shape; it does not fix which file sits in which batch, and D-7's list was a manager delivery plan rather than the user's decision text. Every other element of D-16 — fetches first as one parallel task, parent, then three language batches, then the shared base, then two tool batches, then the triad, then wiring — is unchanged.

---

## Task table

| ID | Title | Files (repo-relative, in write order) | Requires | Role | Sweeps | Size | Commit subject |
|---|---|---|---|---|---|---|---|
| **01-o9-fetch-passes** | Run all five O-9 primary-source fetch branches | `…/3-execution/task-01-o9-fetch-passes/working/iteration-1/research/{o9h-parent,o9d-register,o9c-language,o9a-service-clients,o9b-tools}.md` + `…/outputs/o9-fetch-ledger.md` | — | 5 parallel assistants (read-only) + executor consolidates | none (read-only) | 3.0 ± high | `docs(go): add the o-9 primary-source fetch ledger` |
| **02-skill-parent** | Author `SKILL.md`, the cold-load floor | `.gobbi/projects/gobbi/skills/go/SKILL.md` | 01 (branch **O-9h** landed) | executor | V1 V2 V3 V4 V6ˢ V11ᵖ | 2.0 | `feat(go): add the go skill parent with rules and procedure` |
| **03-lang-modules-errors-interop** | Language children, batch A | `…/skills/go/modules-tooling.md` → `errors.md` → `interop.md` | 02; 01 (**O-9d**, **O-9c** rows X-6…X-10) | executor | V1 V2 V3 V4 **V5**(1 of 7) V6ˢ V11ᵖ | 3.0 | `feat(go): add modules-tooling, errors and interop children` |
| **04-lang-testing-performance-convention** | Language children, batch B | `…/skills/go/testing.md` → `performance.md` → `convention.md` | 03; 01 (**O-9c** rows X-1…X-5, X-11…X-13, X-16, X-17) | executor | V1 V2 V3 V4 V6ˢ V11ᵖ | 3.0 | `feat(go): add testing, performance and convention children` |
| **05-lang-design-concurrency** | Language children, batch C | `…/skills/go/design.md` → `concurrency.md` | 04; 02 (X-20 outcome); 01 (**O-9c** X-14, X-15) | executor | V1 V2 V3 V4 V6ˢ V11ᵖ | 2.0 | `feat(go): add design and concurrency children` |
| **06-service-clients-base** | Author the shared hazard base | `…/skills/go/service-clients.md` | 03, 05 (points at `errors.md`, `concurrency.md`, `testing.md`, `modules-tooling.md`); 01 (**O-9a**) | executor | V1 V2 V3 V4 **V5**(2 of 7) V6ˢ V11ᵖ | 1.5 | `feat(go): add the service-clients shared hazard base` |
| **07-tools-docker-k8s-aws** | Tool children, batch A | `…/skills/go/docker.md` → `kubernetes.md` → `aws.md` | 06; 01 (**O-9b**) | executor | V1 V2 V3 V4 **V5**(3,4,5 of 7) V6ˢ V11ᵖ | 1.5 | `feat(go): add docker, kubernetes and aws tool children` |
| **08-tools-observability-grpc** | Tool children, batch B | `…/skills/go/observability.md` → `grpc.md` | 07; 01 (**O-9b** incl. X-18, X-19) | executor | V1 V2 V3 V4 **V5**(6,7 of 7) V6ˢ V11ᵖ | 1.0 | `feat(go): add observability and grpc tool children` |
| **09-triad** | Author the verification triad, S8→S9→S10 | `…/skills/go/scenarios.md` → `checklists.md` → `evaluation.md` | 08 (whole taught surface exists) | executor | V1 V2 V4 V6ˢ | 2.5 | `feat(go): add scenarios, checklists and evaluation` |
| **10-tree-sweeps** | Run the whole-tree sweeps and fix forward | re-reads all 18; edits only what a sweep fails | 09 | executor + **fresh assistant** for V10 probe crafting | **V1 V2 V3 V4 V5 V6(canonical) V7 V10 V11** — all whole-tree | 1.5 ± defects | `fix(go): apply whole-tree verification sweep corrections` (or `chore(go): record whole-tree verification sweep evidence` if zero corrections) |
| **11-wiring-sync-proof** | Wire, sync, prove runtime load | `…/skills/gobbi/SKILL.md`, `…/skills/ideation/SKILL.md`, `…/skills/evaluation/SKILL.md`, then `bash scripts/sync-plugin-package.sh` | 10 | executor + **fresh assistant** for the cold load | **V6**(repo-wide) **V8 V9** | 1.0 | `feat(go): wire the go skill and sync the runtime mirrors` |

ˢ = scoped to the files that task wrote. ᵖ = partial/advisory run; the authoritative run is task 10.

**Size unit:** 1.0 = authoring one ~250-line `python`/`typescript` language child to full citation discipline (reference class: those two completed sessions, 2,724/12 and 3,523/12 lines-per-file from disk). Task 01 has **no reference class** — no prior gobbi session ran a fetch-only task of this width; the number is a stated uncertainty, not an estimate.

Both deviations behind this table are stated in full under `## Deviations from D-16 requiring manager confirmation` above.

---

## Task contracts

Absolute worktree root for every path below:
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-07-25-2f9595bb-307f-4260-bdd8-8bdb5b6df9ff/`
Design artifact: `.gobbi/projects/gobbi/sessions/2026-07-25-2f9595bb-307f-4260-bdd8-8bdb5b6df9ff/1-ideation/outputs/ideation-artifact.md` (cited as `§N` below).
Session task interior: `.gobbi/projects/gobbi/sessions/2026-07-25-2f9595bb-307f-4260-bdd8-8bdb5b6df9ff/3-execution/task-{ID}/`.
Trailer for every commit: `AI-Provenance-Record: gobbi://session/2f9595bb-307f-4260-bdd8-8bdb5b6df9ff/task/{ID}`.

### 01-o9-fetch-passes — the only parallel task in the plan

**Objective.** Produce one fetch ledger that gives every gated item exactly one of three outcomes, so no later task decides a sourcing question at the keyboard.

**Read.** §3 preamble (marker legend + the METHOD NOTE), §3.1 rows E-67/E-68/E-69/E-72, §3.2 (the `[S]` rows only: E-44, E-46, E-47, E-48-controller-runtime-half, E-49, E-60), §3.3 **including U-14…U-17**, §3.4 **entire census** (25 routed rows, the 5-item deletion table, the clause-site index), §7.4 **O-9a…O-9h**, §8.3 Q-1.

**Scope, by branch — one assistant each, no shared files:**

- **O-9h** (parent, runs first in the write order it protects): X-20, X-21, X-22, X-23, X-24, X-25, U-14, U-15, U-16, U-17. **Six fetches cover all ten:** `pkg.go.dev/cmd/gofmt` (U-14, both halves), `go.dev/wiki/CodeReviewComments` (U-15's three sentences + X-20 cross-check), `go-proverbs.github.io` (X-21, X-22, X-25), `go.dev/ref/spec` § Map types (X-23), `pkg.go.dev/cmd/cgo` (X-24, shared with X-6), Google's Go Style Guide (U-16), Uber's guide **cited by section** (U-17).
- **O-9d**: every Version Currency Register row — E-01, E-02, E-10 (read from `pkg/lint/lintersdb/builder_linter.go` source), E-25, E-26, E-28, E-35, E-58.
- **O-9c**: X-1…X-17 (X-14 resolves **jointly with X-20** — one fetch, one outcome, both files), plus U-1.
- **O-9a**: E-47 (class §7), E-49 (class §8), and the live-owner citations for the base's stamp — moby (§12), client-go (§4), AWS (§3, §5), grpc-go (§2).
- **O-9b**: per-tool canonical import path, current version, support status, plus E-44, E-46, E-48's controller-runtime half, E-60's unverifiable maintenance date, X-18, X-19.

**Binding rules on every fetch.** **O-9e** — for a date prefer raw `CHANGELOG.md` or pkg.go.dev over a rendered GitHub releases page; for a behavioral default read the raw source file, not a rendered summary. **O-9f** — the fetched source wins over the E-item; record old and new; **if the contradiction changes a design decision (an ownership boundary, a file's existence, a locked scope item), STOP and raise it to the manager — do not absorb it.** **O-9g** — an unreachable owner takes the row's stated fallback or the item ships with `**Unverified:** <what, why, what would resolve it>`; never an unmarked assertion.

**Out of scope.** No Kafka or NATS owner is fetched (D-11). The five deleted census items — struct-vs-function shape, input-surface narrowing, map-and-set selection, functional options, the `plugin` boundary — get **no fetch target and no ledger row**; reintroducing one is a scope change needing a user decision.

**Completion evidence.** The ledger at `…/task-01-o9-fetch-passes/outputs/o9-fetch-ledger.md` has **one row per gated ID** with columns `ID | branch | gated file(s) and every clause site | outcome ∈ {FETCHED, FALLBACK-APPLIED, UNVERIFIED-MARKER} | owner URL | verification date | verbatim sentence or the exact fallback text to apply`. Self-failing bar: `grep -c '^| X-'` = 25 and `grep -c '^| U-'` covers U-1, U-3, U-14, U-15, U-16, U-17; **zero rows with an empty outcome cell**; every FETCHED row carries a URL *and* a date; every FALLBACK row states which **sites** the deletion touches (X-20/X-14 = four sites; X-23 = Principle 7 **and H8**; X-24/X-25 = Principle 8 **and H17**; the ten router triggers). A ledger that names an item but not its sites has not applied §3.4's standing rule.

**Failure route.** >50% of one branch unreachable → executor stops and reports to the manager before task 02 starts; the fallbacks then materially change what `SKILL.md` teaches, which is a manager call, not an author's.

**Sweeps.** None — read-only, writes nothing under `skills/`.

### 02-skill-parent — `SKILL.md`

**Objective.** The file §1.3 promises can carry an ordinary Go change alone, with citation as its only fact-check.

**Preconditions.** Task 01 committed; **O-9h rows all dispositioned** in the ledger. Create `.gobbi/projects/gobbi/skills/go/` (verify it does not exist first; it does not, as of 2026-07-25).

**Read.** §1.3, §4.1 (frontmatter, **literal**), §4.2 (8 Principles + the deliberate-omissions block), §4.3 (19 Rules, the derivation table, the hazard→home table), §4.4 (P1–P8), §4.6 (router), §4.7 file 1, §7.1, §7.4 O-10/O-11/O-12.

**In scope.** Frontmatter with **exactly four keys in order** `name, description, allowed-tools, skill-type` — do not imitate `python`/`typescript`'s three-key gap. Two-paragraph Intro, no steps and no owner links (S3). 8 Principles, each naming the parent `coding` clause it specializes and stating a Go delta. 19 Rules as `### Must-Follow` H1–H10 / `### Must-Not-Follow` H11–H19, **numbered inline**. P1–P8 with `*Deepens …*` opening and `**P{n} is complete when …**` closing. The P2 router, 16 rows. References mapping every borrowed fact to one owner.

**Gated items.** X-20 (four sites: Principle 5, **P3 design act (2)**, the router's `design.md` "the zero value" trigger, and `design.md` itself in task 05), X-21, X-22, X-23 (**two sites: Principle 7 and rule H8**), X-24, X-25 (**each two sites: Principle 8 and H17**), U-14 (H3), U-15 (H16 rests **entirely** on it), U-16 (H4's exactly-once clause), U-17 (H6's tri-part formulation — never present it as go.dev's).

**Carry into the brief.** O-11 — **no principle may contain a "see §X"**; each stands alone cold. O-10 — scrub `dataclass`, `tsconfig`, `.d.ts`, `Promise`, `strict`, `pyproject` if any structure is adapted from a sibling. Do **not** "fix" the recorded omissions: layout is H14 not a principle, verification-coverage is H2 not a principle, 8 principles is locked (no 7, no 9). H10 states D-2's no-compile-verification deviation in the skill's own text (Q-3, recommended yes).

**Completion evidence.** File at the absolute path, size sane (~430 lines target, not a gate). `rg -n '^H1[0-9]?\b|^\| H'` shows **19** rule IDs, H1–H19, none missing, none extra. Every hazard row in §4.3's hazard→home table resolves to a live H-rule or a named child. Every Rule's Owner is an E-ID, D-2, an `[S]` E-ID with its U-tracker, or a routed X-row — no rule on unattributed prose. **Fallback closure check:** for each X row whose ledger outcome is FALLBACK-APPLIED, `rg` proves the claim is absent from **all** its named sites *including the router trigger word*; a claim deleted at one site and surviving at another is a FAIL. V1 binary over this file; V2 zero non-allowlisted hits in prescriptive prose; V4 every `1.27` hit in a DRAFT/"not yet released" sentence; `rg -n '\]\(\.\./\.\./'` empty (no repo-root climb, mirror-depth trap); `rg -n 'messaging\.md'` empty; `test ! -e .claude/skills/go` (nobody hand-created a mirror).

### 03-lang-modules-errors-interop — batch A

**Write order (fixed).** `modules-tooling.md` → `errors.md` → `interop.md`.

**Read.** §4.7 files 6, 4, 9; §3.1 **E-21 expanded table with the floor column on all 21 rows and the five-bucket audit**; §3.1 E-01–E-03, E-06, E-10, E-11, E-16, E-20, E-25–E-28, E-31, E-34–E-37, E-39, E-58, E-59, E-65, E-69; §3.4 X-6…X-10; §4.6 those three router rows; §7.1; §7.3 V3, V5, V11; §7.4 O-9c, O-9d, O-9g, O-12, O-13.

**Key obligations.**

- `modules-tooling.md` carries the **Version Currency Register** — one table, owner URL + date per number, stating its own sourcing rule from E-65 — and the **seventh `**Verified:**` stamp**. Every E-21 row ships with its floor-availability qualifier. Teach the **module-floor vs toolchain-version** distinction (H1) and the pkg.go.dev **badging mechanism** (E-58) as the reason for per-symbol "added in".
- `errors.md`: `errors.As` is **correct and current at the `go 1.25.0` floor**; `errors.AsType` is a `go1.26.0` convenience; **neither is obsolete** and neither enters the obsolete table. U-3 (recover-same-goroutine) stated **without a fabricated quotation**.
- `interop.md`: X-6 covers **all** `cgo` content *including the cross-compilation property itself* — its only fetched instance travelled to §3.5 with D-11 and **must not be reintroduced from memory** (O-13). `go tool dist list` stays omitted regardless (U-6). `laws-of-reflection` cited **with its 2011-09-06 date**. The `plugin` boundary is deleted, not routed; `os/exec` survives as X-9.

**Completion evidence.** Three files on disk. V5: `rg -n '^\*\*Verified:\*\* 20[0-9]{2}-[0-9]{2}-[0-9]{2} against http'` matches in `modules-tooling.md`. V3 scoped: every version token in these three files resolves to a register row — run `rg -no 'go1\.[0-9]+(\.[0-9]+)?|v[0-9]+\.[0-9]+\.[0-9]+'` and check each against the register. V1 binary; V2; V4; `rg -n 'messaging\.md'` empty; each file's opening line names the parent Rule or router row it deepens (R-7 control). X-6…X-10 disposition matches the ledger exactly — a fetched item carries its URL and date, a fallback item leaves **no residue** and its router trigger dies in task 10's sweep only if task 02 already removed it.

### 04-lang-testing-performance-convention — batch B

**Write order.** `testing.md` → `performance.md` → `convention.md`.

**Read.** §4.7 files 7, 8, 2; §3.1 E-12, E-23, E-24, E-27, E-32, E-33, E-37, E-70; §3.4 X-1…X-5, X-11…X-13, X-16, X-17; §4.6 rows; D-8 in `open-decisions.md`.

**Key obligations.** `testing.md`: the D-8 assertion stance (plain `if` + `go-cmp`, "follow the existing project convention" as standing override) with the split presented honestly — **the stance is sourced; X-17's three concretes are not** (got-before-want format, both testify defect claims): fetch or drop **all three**. A wrong claim about a named library's argument order is exactly the failure this skill exists to prevent. `testing/synctest` in full including **what is not durably blocking** (mutex, I/O, syscalls). `performance.md` owns container-aware `GOMAXPROCS` **solely**; the `automaxprocs`-obsolete row lives in `modules-tooling.md` and this file points; **map-and-set selection is deleted — do not reintroduce**. `convention.md` owns `defer` in full including "Go has no scope-bound RAII", and **points** at `errors.md` for error-string form; it does not own it.

**Completion evidence.** As batch A (V1/V2/V3/V4/V6ˢ + disk + parent-clause opening line), plus: `rg -n 'error string|capitaliz'` in `convention.md` shows a pointer, not an owned section (§4.7 single-owner table); the X-1…X-5, X-11…X-13, X-16, X-17 dispositions match the ledger; if a fallback omitted content, the corresponding §4.6 router trigger is on task 02's removal list.

### 05-lang-design-concurrency — batch C

**Write order.** `design.md` → `concurrency.md`.

**Read.** §4.7 files 3, 5; §4.2 Principles 4–8; §3.1 E-09, E-13–E-19, E-22, E-29–E-31, E-57, E-70, E-72; §3.4 X-14, X-15; §4.7 single-owner table.

**Key obligations.** `design.md`: **X-14's fallback is deletion from both files, not relocation to the parent** — it takes the same outcome task 02 took for X-20. **"Accept interfaces, return structs" is current (E-22) and must NOT enter the obsolete table.** Three items are deleted from this file's spec — struct-vs-function shape, input-surface narrowing, functional options — **do not reintroduce**. `concurrency.md`: X-15 — only `pipelines`' ownership quotation is sourced; the done-channel/fan-in/fan-out **catalogue** is not; if fetched, **date the citation 2014-03-13**. Typed `sync/atomic` is Go 1.19 (E-57), below the floor, safe unqualified. `errgroup` is this file's owned material. It **points** for `synctest`, `GOMAXPROCS`, and the `automaxprocs` row.

**Completion evidence.** As above, plus a cross-file consistency check: `design.md`'s zero-value outcome is byte-consistent with `SKILL.md` Principle 5, P3 act (2), and the router trigger — one claim, one outcome, four sites.

### 06-service-clients-base — the strongest edge in the graph

**Read.** §4.5 **in full** (the §1–§12 contract, the unnumbered structural elements, the read-order gate **with its stated header exception**, the delta-index row shapes, the per-tool template), §4.7 file 10, §3.2 E-40, E-47, E-49, E-55, E-59, §7.3 V5/V7, §7.4 O-9a.

**Key obligations.** The twelve hazard classes are numbered **§1–§12 in E-40's fixed order** — that numbering is the stable citation target every tool child uses, so it is frozen here. Each class's **rationale is stated once, here**; a tool child may never restate it. §12 additionally owns **E-59** ("module metadata is not a deprecation signal") with `docker/docker` as the live instance. The delta index ships with **five child rows and zero childless rows** — population at ship time is zero, and **adding a childless row is a user decision**, not an author's. The `**Verified:**` stamp (2 of 7). This file **points** — never restates — for `errgroup` (`concurrency.md`), `errors.As`/`errors.Is` (`errors.md`), context mechanics (`concurrency.md`), and test-double design (`testing.md`).

**Messaging stop sign.** This file is the **whole answer** for any service API with no child, messaging included: the twelve classes plus the owner's own docs. That is the design, not a gap. `messaging.md` does not exist and must not be linked, referenced, or planned for (D-11, O-13, R-10).

**Completion evidence.** `rg -n '^## §|^### §|^\| §'` shows twelve classes, §1–§12, in E-40's order, none merged, none renumbered. Delta index has exactly **5** rows, all child rows, fourth column a link to a file that does not exist yet — **so the link target check defers to task 10's V6**; state this explicitly in the evidence rather than pre-creating stubs. V5 stamp present. V1/V2/V3/V4. `rg -n 'messaging'` empty. Every "points" target is a file already written (tasks 03, 05) — hoist-then-point proven by `test -f` on each target before the pointer is written.

### 07-tools-docker-k8s-aws — batch A of the thin children

**Write order.** `docker.md` → `kubernetes.md` → `aws.md`.

**Read.** §4.5's **fixed template and the delta test**, §4.7 files 11, 12, 13; §3.2 E-41–E-49, E-59, E-60; §7.3 V2, V5, V7; §8.1 R-5; §9 OC-4.

**Carry verbatim into the brief.** **"Do not pad, and apply the delta test."** A delta must be **false or absent for at least one other tool in the set**. A hazard class with no delta is **omitted**, never written as "same as base". A cell that explains *why* a hazard exists is a class restatement and must be struck. Report B rates `docker.md`'s durable content at roughly five lines and the template makes that acceptable — **thinness is honesty; padding is the failure**. D-11 is the precedent: when honest content shrank to a pointer, the user removed the file rather than pad it.

**Already struck — do not restore.** `docker.md`: "reuse one client" (§2 rationale), "all API methods take `context.Context` first" (§1 rationale). `kubernetes.md`: "handlers run in the informer's own goroutine…" (§8 rationale). `aws.md`: "drain the paginator" (§5 rationale), "client construction once at startup" (§2 rationale).

**Must survive.** `docker.md`: canonical `github.com/moby/moby/client`, `client.New`, **the inverted `WithAPIVersionNegotiation()` option**, `Close()` as the §2 delta, the **E-59 live instance**, the **absence of a stated removal date recorded as the finding**. `kubernetes.md`: `DefaultQPS: 5`/`DefaultBurst: 10` **with the negative-QPS conditional**, `RetryOnConflict` requiring the error **unwrapped** (`%w` silently disables it), the §8 concrete lifetime calls, E-54's pinning stated as **a tested client-go pairing plus a Go floor, not a hard three-way pin**. `aws.md`: v1 **EOS + archived 2025-07-31**, and **explicitly not** the 2024-07-31 maintenance date; retries-by-default and the 9-attempts consequence; the `AWS_NEW_RETRIES_2026` numerics marked **pending, not current**; the paginator construction form; `smithy.OperationError` wrapping `smithy.APIError`; `ClientLogMode`/`LogRequestWithBody`.

**Completion evidence.** Each file matches the template's five blocks exactly. Three `**Verified:**` stamps (3, 4, 5 of 7). V2 must **see** the forbidden symbols here — `NewClientWithOpts`, `WithAPIVersionNegotiation`, `github.com/docker/docker` appear only inside forbidding sentences. V1/V3/V4. Ledger dispositions for E-44, E-46, E-47, E-48, E-49, E-60 all reflected. Delta-test self-check recorded per cell: name the other tool in the set for which the sentence is false or absent.

### 08-tools-observability-grpc — batch B

**Write order.** `observability.md` → `grpc.md`.

**Read.** §4.5 template + delta test, §4.7 files 14, 15, §3.2 E-50, E-52, E-53, E-65, §3.4 X-18, X-19, §10 BC-2, §7.3 V2/V3/V5.

**Carry into the brief.** **"Do not pad, and apply the delta test"** — and specifically: **this task is the most likely to shrink.** If X-18 and X-19 both take their omission fallback, `observability.md` ends at the `api/` semver carve-out plus two dated versions, which is exactly what Report B rates it at. That is a correct outcome, not a failure.

**Must survive.** `observability.md`: the `api/` subpackage's **experimental, semver-exempt** carve-out verbatim; `client_golang` v1.24.1 (2026-07-23) **with v1.24.0's raise of the minimum to Go 1.25 stated as a floor interaction the reader checks against their own `go` line**; OTel v1.44.0 (2026-05-27) with traces Stable / metrics Stable / logs Beta as a **dated snapshot with an explicit expiry warning**. `grpc.md`: v1.82.1 (2026-07-15) **with both intervening releases named as security releases**, `grpc.NewClient` replacing deprecated `Dial`/`DialContext`, the new-TCP-connection-per-dial mechanism as the §2 delta, and `WithBlock`/`FailOnNonTempDialError` **named in order to be forbidden** (V2 must be able to grep them).

**Struck — restore only on ledger authority.** `status` as the named way to examine RPC errors (zero evidence hits; restore only if O-9b's grpc-go fetch sourced it). "Do not retry without backoff" — symbol-free, points at the owner's `Documentation/anti-patterns.md`. "A `ClientConn` is concurrency-safe and must be reused" — §2 rationale.

**Completion evidence.** As task 07, with stamps 6 and 7 of 7 → the tree now carries **exactly seven** stamps; task 10's V5 checks count **and composition**.

### 09-triad — `scenarios.md` → `checklists.md` → `evaluation.md`

**Objective.** Convert the finished surface into observable obligations and binary evidence, in the mandated S8→S9→S10 order.

**Read.** §4.7 files 16, 17, 18; §7.2 (all sixteen reserved scenarios); §7.3 (all eleven sweeps — the checks encode them); §4.3 (rule keys H1–H19); §8.3 Q-2. Load `evaluation/scenario/SKILL.md` **completely** before `scenarios.md`; `evaluation/checklist/SKILL.md` completely before `checklists.md`; `evaluation/SKILL.md` completely before `evaluation.md`. Loading them out of order invalidates the artifact set.

**Key obligations.**

- `scenarios.md`: three `##` families (Hard invariants / Design judgment / Bottom-up operation), IDs `GO-SCENARIO-01`…`-16`, per-case fields Axis / Situation / Good / Bad / Adversarial probe / Exercises / Checklist IDs. The coverage map **must state both things**: scenario-complete over sixteen cases **and explicitly rule-partial over nineteen Rules**, naming **H3, H5, H9, H16, H18, and H17's non-generics half** and pointing at the `GO-CHECK-*` item covering each. A "guaranteed coverage map" without that split is the escape-hatch phrasing `checklists.md` forbids. A fourth family, or an added scenario for one of the six, is a **variation to raise with the manager, not to take silently** (Q-2: three families recommended).
- `checklists.md`: the four-state legend `PASS | FAIL:<finding-id> | n/a:<property> | recorded-open:<owner+method>` stated explicitly; **one positive acceptance outcome per box, never an OR / sign-off escape**; pass condition, evidence method, on-fail route per gate; the closing `| Check | Anchor(s) | Seed scenario |` reverse-trace table. It must reproduce **V7's eleven `(file, class, fragment)` triples** and **V1's pre-declared exemption list** — both sweeps are defined as depending on this file.
- `evaluation.md`: the rule-key crosswalk quoting **verbatim `SKILL.md` substrings** for H1–H19, the eight Principles and P1–P8; the seven perspectives with Go lenses; recommended verifications = the P7 ten-gate order plus §7's sweeps; Overall anchors as a four-row failure-mode table plus a preserve-list. **The nine-output contract is unchanged — this file adds no tenth evaluator artifact.**

**Completion evidence.** S11 bidirectional trace closes: every load-bearing parent clause is exercised by a scenario **or** named in the six-rule exception list with its check; every scenario obligation has a checklist ID; every checklist ID is selected by `evaluation.md` when its trigger holds. `rg -c 'GO-SCENARIO-'` = 16 distinct IDs; `GO-CHECK-` IDs are dense from 01 with no gap. `rg -n 'or the author judges|sign-off|as appropriate'` in `checklists.md` returns zero (escape-hatch guard). No new policy appears in any of the three — `rg` each normative sentence back to a live `SKILL.md` clause.

### 10-tree-sweeps — the whole-tree gate

**Objective.** Run the sweeps that cannot run per-task, then fix forward in the canonical tree only.

**Read.** §7.3 V1–V11 in full, §7.1, §4.5 delta test, §4.7 single-owner table, §3.1 E-21's five-bucket audit, §8.1 R-5/R-6.

**Runs here, whole-tree.**

- **V7 — ownership non-duplication.** Twelve pre-enumerated phrases grepped across the five tool children, scored against the **eleven `(file, class, declared fragment)` triples**. Binary: a hit passes **only inside the declared fragment's sentence**; a hit at any other pair, **or padding inside an allowlisted cell**, FAILS. **No human adjudicates a hit.** The allowlist changes only by an explicit edit **before** the run. Second pass: each entry of §4.7's single-owner table grepped across all 17 children. **Stated residual:** padding that reuses none of the twelve phrases is invisible to any token sweep — record it, do not claim it away.
- **V10 — adversarial check probes.** Every newly authored `GO-CHECK-*` predicate is probed against a passing, a failing, an n/a, a boundary, and a **cosmetically-conformant-but-wrong** input. **Probes are crafted by a fresh assistant who did not write task 09** — an author probing their own predicate is the recorded mistake this sweep exists for. A check that passes every input is not a check.
- **V11 — floor availability.** Population is **every taught form in the tree, with or without a stated version** — a form named without a version is the most common shape of the defect and is exactly how `errors.AsType` slipped through. Floor classification is the **output**, not the input filter. Run over both columns of E-21 and over every prescriptive sentence elsewhere.
- **V1–V5 re-run whole-tree.** V5 checks **count and composition together**: seven stamps in exactly `docker.md`, `kubernetes.md`, `aws.md`, `observability.md`, `grpc.md`, `service-clients.md`, `modules-tooling.md`. Seven stamps in the wrong seven files passes a count check and **fails this one**.
- **V6, canonical half.** Every intra-skill link is same-directory or sibling; `rg -n '\]\(\.\./\.\./'` over `skills/go/` is empty; `rg -n 'messaging\.md'` over the whole tree is empty.

**Completion evidence.** One sweep report at `…/task-10-tree-sweeps/outputs/sweep-report.md` with, per sweep, the exact command, the raw counts, and a binary PASS/FAIL — **not a narrative**. Every FAIL is fixed in the canonical file and the sweep re-run to green in the same task (P-9: the tree is coherent at task end). Corrections are recorded per file so the commit body can state what changed and why.

**Failure route.** A sweep failure that can only be fixed by changing a locked design decision (a class boundary, a file's existence, a stamp population) is **not** fixed here — stop and raise it to the manager (O-9f's design-consequence rule applies to sweeps too).

### 11-wiring-sync-proof — wiring, mirrors, cold load

**Read.** §6.1–§6.4 in full, §7.3 V6/V8/V9, §7.4 O-13, §8.1 R-9, D-10 in `open-decisions.md`, `skill-writing/SKILL.md` P7, and `skill-writing/mistakes.md` §§ *Claude Skills Mirror Is Symlink Not Copy*, *Planning Leader Asserted File Type Without Verifying*.

**Wiring — the surface is exactly three files, four sites.** `skills/gobbi/SKILL.md:73` (extend the single "Language method skills" row's link list — do **not** add a row); `skills/ideation/SKILL.md:68` and `:174`; `skills/evaluation/SKILL.md:309-310`. All four verified present at those lines on 2026-07-25 — **still verify by pattern match, not by line number**, before editing. **No other file is touched:** `coding/SKILL.md:293` and `coding/review.md:472` are recorded backlog; `ideation/evaluation.md:58` is a probe-kind enumeration and takes NO EDIT with the reasoning already stated in §6.2; `agents/executor.md:37` is a pre-existing false claim, surface-only.

**Mirrors are generated — never hand-created.** Run `bash scripts/sync-plugin-package.sh --check` **first** (read-only), then `bash scripts/sync-plugin-package.sh`. `.claude/skills/go/` is a real directory of **one symlink per file**; `.agents/skills/go` is a single directory symlink; `plugins/gobbi/skills` is one top-level symlink for the whole tree — **no per-skill entry and no plugin-manifest registration**. Never `Write` through a mirror path: it converts a symlink to a regular file and destroys the topology. *Expected intermediate state, stated so it is not "fixed": between tasks 02 and 11 the go mirror is absent or partial. That is correct. Each earlier task's `test ! -e .claude/skills/go` guard exists to catch a hand-created one.*

**V9 — the cold load, one runtime plus a written waiver.** A **fresh agent** (not the author of tasks 02–10), given only the normal load context, writes one `cold-load-result` record for `runtime: claude-code` at `…/task-11-wiring-sync-proof/outputs/cold-load-result.md`, with `selected_skill_type: operation`, `selected_type_child: operation-skill.md`, `loaded_type_children: [operation-skill.md]`, and `no_extra_type_child_proof.loaded_child_count: 1` with an empty `unexpected_children`. **The record admits exactly the P7 fields and no others** — do not put the waiver inside it. The codex waiver is a **separate written block in the same file**: `waived-not-run`, naming the system (`codex`), the step (P7 cold load), the authority (**D-10**), and the trigger (three consecutive upstream HTTP 503s on 2026-07-25). **A missing codex record without that written entry is a FAIL, not an omission.**

**Completion evidence.** `rg -n 'go/SKILL.md' skills/gobbi/SKILL.md skills/ideation/SKILL.md skills/evaluation/SKILL.md` shows four hits, one per site. `bash scripts/check-markdown-links.sh` green repo-wide (V6). V8: `ls -l .claude/skills/go/` shows **18** entries, every one a symlink, none extra and **no `messaging.md` link**; `test -L .agents/skills/go` true; `bash scripts/sync-plugin-package.sh --check` green. V9 record complete, zero unknown fields, zero FAIL checks, waiver block present. `git status` clean; commit carries the trailer.

---

## Cross-cutting

**Standing rules every task brief repeats (short form).**

1. Edit **canonical only**: `.gobbi/projects/gobbi/skills/go/…`. Mirrors are generated by `scripts/sync-plugin-package.sh` and are never hand-created or hand-edited. Run `--check` before any mirror-adjacent action.
2. Use the **absolute worktree path** on every write; re-`cd` does not survive a tool boundary. **O-12** — after each write, confirm the file exists at the absolute path with the expected size.
3. **Citation is the only fact-check** (D-2, D-3). No compiler, no second system. Every taught version, symbol, import path and example carries a primary owner and a verification date (H10). An item written from model memory is a rule violation and a V1 failure.
4. **`messaging.md` does not exist. Kafka and NATS are out of scope (D-11).** Its research at `1-ideation/working/iteration-1/research/report-kafka-nats.md` is a deferral with a named destination, not a to-do. Reopening is a user decision (O-13, R-10; guarded by V6 and V8).
5. Every child opens by naming the **parent Rule or router row it deepens** (R-7). No policy lives only in a child.
6. **O-9f/O-9g** apply during authoring too: a source that contradicts a locked E-item wins on fact and is recorded with old and new; a **design** consequence stops and goes to the manager.
7. Required skills, all verified present: `principles`, `mistake`, `skill-writing` (+ `operation-skill.md`, `scenarios.md`, `checklists.md`, `mistakes.md`), `coding`, `git` (+ `conventions.md`), `record`; **task 09 adds** `evaluation/scenario`, `evaluation/checklist`, `evaluation`; **task 11 adds** `claude-plugin`. Project rules: `.gobbi/projects/gobbi/rules/docs/point-dont-restate-workflow-docs.md` (present; governs `workflow/steps/*.md` only — it does **not** bind the `go` skill, but its hoist-then-point clause does).

**Obligation coverage (both directions).**

| Obligation | Task(s) |
|---|---|
| O-9h / O-9c / O-9d / O-9a / O-9b | 01 (fetch) → consumed by 02 / 03-05 / 03 / 06 / 07-08 |
| O-9e, O-9f, O-9g | 01 and every authoring task |
| O-10 (stack-idiom scrub) | 02–09 |
| O-11 (self-standing principles) | 02 |
| O-12 (disk persistence) | 02–11 |
| O-13 (no resurrection) | 03, 06, 09, 10, 11 |
| X-1…X-5 | 04 · X-6…X-10 → 03 · X-11…X-13 → 04 · X-14 → 05 (+02) · X-15 → 05 · X-16, X-17 → 04 · X-18, X-19 → 08 · X-20…X-25 → 02 |
| U-1 → 03 · U-3 → 03 · U-4/U-5/U-6/U-8 omitted (01 records) · U-9 never quoted · U-10 → 07, 08 · U-13 no rule built on it · U-14…U-17 → 02 |
| V1–V4 | per-task 02–09, whole-tree 10 |
| V5 (7 stamps) | 03, 06, 07, 08; composition check 10 |
| V6 | scoped 02–09; canonical whole-tree 10; repo-wide 11 |
| V7, V10, V11 | 10 |
| V8, V9 | 11 |
| S1–S6 success signals | S1/S2/S3 provable at 02+03; S4 → V1 at 10; S5 → V5 at 10; S6 → V10 at 10 |
| F1–F6 falsification | F1/F2 → V2/V4; F3 → V7; F4 → V1; F5 → V9; F6 → V11 |
| Deferred (no task, by design) | quarterly re-verification; a Go compile harness; `coding` stale-"future" cleanup (both sites); `agents/executor.md:37`; a Codex cold load (Q-6, backlog); Kafka/NATS |

**Load-bearing assumptions, with signposts and named responses (P-14).**

| Assumption | Signpost | Response |
|---|---|---|
| Subagents can fetch external owners in task 01 | first fetch returns a network error | per item: O-9g fallback or `**Unverified:**` marker. **>50% of one branch failing → stop, escalate to manager before task 02** |
| The four wiring anchors stay where §6.1 found them | pattern match at task 11 finds 0 or >1 hit | do not edit by line number; re-locate by pattern, report the drift in the commit body |
| Go 1.27 does not GA mid-session (A-4) | `go.dev/doc/devel/release` shows 1.27.0 GA during task 01 | H19 and the register go stale immediately → **escalate; this is a design consequence, not a fact fix** |
| No concurrent session touches `skills/go/` or the three wiring files | `git status`/`git log` shows a foreign change in the worktree | stop, re-read HEAD, reconcile before continuing (recorded gotcha: a concurrent session can sweep uncommitted edits — commit promptly) |
| The delta test leaves the five tool children viable | a tool child's honest content shrinks to a single pointer | **do not pad.** Raise to the manager as a D-11-class removal decision — a user decision, never an author's |

**One writer chain.** Only task 01's five fetch branches and task 10's V10 probe crafting are parallel and read-only. Tasks 02–11 are strictly sequential and file-disjoint by construction; no two tasks write the same file, except task 10, which edits only what a sweep fails. Per-task dual-system WORK and EVALUATION are workflow-owned and sit outside these contracts — with Codex waived for the whole session (D-3), each task's evaluation is fresh-Claude-only, which is the reason every completion bar above is mechanical and binary rather than judgment-based.

---

## Readiness

**Ideation was sufficient to plan from. Gate result: READY.** All required inputs were present and usable, not merely existent: the 1,281-line artifact with a locked scope contract, 18-file file-set, dependency constraint graph, wiring map with a full hit disposition, eleven defined sweeps, thirteen standing obligations, ten risks with residuals, eight falsifiable assumptions, and four open conflicts reported rather than hidden; sixteen decisions D-1…D-16 including the user-locked task shape; five research reports on disk; and an iteration-4 PASS whose ten findings were applied inline as revision 5 (verified: X-23 now names H8, X-20 now names P3 and the router, V7's triples, E-72/U-17, the D-1…D-13 correction). Nothing was routed back to Ideation and no design decision was reopened.

**Four gaps I worked around, all named rather than papered over:**

1. **D-16's task count (9–10) versus §11 item 4's "sweeps as their own work."** I split into 11 tasks. The justification is causal, not stylistic: V7/V10/V11 run on the canonical tree and can force edits; V8/V9 require mirrors generated from a final tree. Merging them would sync before a possible fix. **Manager should confirm the extra task with the user, since D-16 is a user decision.**
2. **D-7's language-child batch composition contradicts §5's own hoist-then-point edge.** `design.md` points at `interop.md`, and `errors.md` asserts `go1.26.0`/`go1.20` versions that must resolve to a register `modules-tooling.md` owns. I regrouped to the topological order of §4.7's *Points, does not own* lines. Batch count and D-16's overall shape are untouched.
3. **The intermediate mirror state is undefined in the artifact.** Between tasks 02 and 11 the canonical `go/` tree exists with no mirror, so `sync-plugin-package.sh --check` will report it. The artifact never says whether that is a failure. I resolved it as expected-and-correct and added a per-task `test ! -e .claude/skills/go` guard so the far more dangerous response — hand-creating the mirror — fails loudly instead.
4. **`service-clients.md`'s five child rows link to files that do not yet exist when task 06 writes them.** §5 mandates that order, so a link-existence check cannot run at task 06. I deferred it explicitly to task 10's V6 and required task 06 to record the deferral rather than pre-creating stub files, which would corrupt the mirror's per-file link count.

**Concerns carried forward, unchanged from Ideation and not resolvable in Planning:** no taught Go fact has ever been checked against go.dev or any owner URL (D-2 + D-3 + no network at Ideation time), which makes task 01 the single highest-value task in this plan and the one whose failure degrades everything downstream; the five per-tool children remain a recorded `skill-writing` P4 deviation under D-5; and V9 proves one runtime only under D-10.
