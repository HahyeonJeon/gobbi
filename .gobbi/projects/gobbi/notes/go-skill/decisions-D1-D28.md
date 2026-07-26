# Material decisions — session 2f9595bb-307f-4260-bdd8-8bdb5b6df9ff

## D-1 — Session configuration (Configuration step)

**Decision:** Defaults with publication changed to `pull-request`.
Iteration cap 3 per productive step. Claude roles: opus (manager/leader/executor/evaluator),
sonnet (assistant). Codex roles: gpt-5.6-sol. `createIssue: false`, `draftPullRequest: false`.

**Authority:** user, Configuration defaults gate.

## D-2 — No compile verification of taught Go examples

**Decision:** Taught Go examples are NOT compile-verified. The Go toolchain is not installed
(`go: command not found` verified 2026-07-25) and will not be installed for this session.

**User words:** "We don't need to verify skills itself."

**Deviation recorded:** `skill-writing/SKILL.md` Must-Follow requires "MUST verify mechanism claims
from their owner and verify taught examples against the live surface." This decision knowingly
departs from the second clause. The manager surfaced the risk before the decision; the user chose
this option with the risk stated.

**Compensating controls agreed by the manager:** keep examples short, prefer prose rules and decision
tables over long code, and cite a primary source for every taught example so a later reader can
verify it against its owner.

**Precedent contrast:** the `typescript` skill compile-verified ~84 examples through a committed
repo-root `tsc` harness. `go` will have no equivalent.

**Authority:** user, explicit.

## D-3 — Codex waived for the entire session

**Decision:** Run Claude-only for every WORK and EVALUATION stage of this session.

**Trigger:** three consecutive `codex exec` attempts failed with upstream HTTP 503.
- Attempt 1 (09:22Z): `concurrency_limit` / "Too many concurrent requests"
- Attempt 2 (09:24Z): `biscuit_baker_service_me_circuit_open`
- Attempt 3 (09:31Z): `biscuit_baker_service_me_circuit_open`, 32x 503
All three returned an empty response file. The failure is upstream availability, not prompt,
schema, or auth shape.

**Deviation recorded:** `workflow/SKILL.md` Must-Follow requires both systems for every WORK and
EVALUATION stage unless the user explicitly approves a waiver limited to one named system, step,
and iteration. The user approved a BROADER waiver than that rule contemplates — whole session
rather than per-step-per-iteration.

**Risk stated to the user before the decision:** past sessions repeatedly recorded that Codex caught
real semantic defects that Claude had already passed (PR #355 Wrap-up: 4 High semantic bugs; PR #353
typescript: Codex out-caught Claude every round). This waiver is the option most likely to let a
defect through.

**Manager compensating control:** evaluators remain fresh, independent, and isolated from the
producing agent for every EVALUATION, per the unwaived producer/evaluator separation rule.

**Wrap-up obligation:** record this in `session.json` `outcome.waivers` as one waiver entry per
productive step (ideation, planning, execution, wrap-up), each naming system `codex` and its
iteration, with this file as the `decisionArtifact`.

**Authority:** user, explicit, after the risk was stated.

## D-4 — Go skill target context

**Decision:** the `go` skill targets a data-engineering platform backend. Named workloads:
backend services/APIs, CLI/tooling, Kubernetes/operators, Docker, AWS.

**Consequence:** the per-tool child set is bounded by this actual stack rather than by the
open-ended phrase "other major dev-ops tools".

**Authority:** user, explicit.

## D-5 — DevOps material uses PER-TOOL child docs

**Decision:** per-tool child docs, as originally requested — not the cross-cutting-only shape.

**Process note:** the manager presented evidence-backed pushback recommending one cross-cutting
child (`service-clients.md`) with a one-line-per-tool delta table. The user heard that argument
and reaffirmed per-tool children. Per the reaffirmation rule this is the user's decision and is
not to be re-litigated.

**Evidence the user decided against (retained so the trade-off stays visible):**
- Rot demonstrated live during research: community write-ups dated 2026 taught
  `client.NewClientWithOpts(...WithAPIVersionNegotiation())`; both symbols are now deprecated and
  `github.com/docker/docker` itself is deprecated in favor of `github.com/moby/moby/client`.
  Two of three sources taught the stale form confidently.
- Of 24 tools inventoried, only `client-go` and `controller-runtime` clear the bar of teaching
  something the vendor's own docs do not.
- Every volatile category (import path, version suffix, function name, option semantics, default
  numerics) produced a documented break within ~18 months.
- Prior art converges on cross-cutting: AWS's own agent toolkit, the k8s API conventions doc, and
  gobbi's own `python/interoperability.md` + `typescript/runtime-deltas.md`.

**Manager compensating controls, adopted under the user's chosen structure:**
1. A shared `service-clients.md` owns the ~12 cross-cutting hazard classes ONCE. Per-tool children
   own only their tool-specific deltas and point at the shared base. This preserves the user's
   per-tool structure while preventing the same twelve rules being restated in every child and
   drifting apart — the specific failure the research warned about.
2. Every per-tool child carries a dated verification stamp and a link to the owner doc, so a later
   reader can tell how stale it is.
3. The per-tool set is CAPPED to the user's actual stack. No OpenAPI-generated or fast-churn
   long-tail SDK (Cloudflare, go-github) gets a child.

**Authority:** user, explicit, after the risk was stated and the recommendation was declined.

## D-6 — Locked per-tool child set

**In scope (6 tool children + 1 shared base):**
- `service-clients.md` — shared base owning the ~12 cross-cutting hazard classes ONCE
- `docker.md`, `kubernetes.md`, `aws.md` — user-named, locked
- `observability.md` — Prometheus client_golang + OpenTelemetry-Go
- `grpc.md` — gRPC + protobuf
- `messaging.md` — Kafka + NATS

**Explicitly OUT of scope:** Terraform provider authoring (user declined). Long-tail and
OpenAPI-generated SDKs (Cloudflare, go-github, Azure, GCP, Pulumi, Helm, etcd, containerd, Vault,
Consul, Nomad, Argo, Flux, CSI/CNI, Docker Compose, Testcontainers) — no child, per the churn
evidence and the manager's cap.

**Authority:** user, explicit multi-select.

## D-7 — Full 19-file scope in one session

**Decision:** author all 19 files in this session as one PR.

**Manager concern stated before the decision:** 19 files is ~1.7x either sibling (both 12 files);
each sibling consumed a full session, and typescript needed a further 3-round adversarial review.
With Codex waived, rigor is already reduced. Risk named: compressed evaluation per document.

**User decision:** proceed with all 19. Per the reaffirmation rule this is settled and the manager
does not re-raise it.

**Manager delivery plan under this scope — ordered writer chain (one writer at a time, per the
workflow invariant that implementation never parallelizes):**
1. `SKILL.md` — foundation; every child depends on its Rules and P2 router
2. language children A: `convention.md`, `design.md`, `errors.md`
3. language children B: `concurrency.md`, `modules-tooling.md`
4. language children C: `testing.md`, `performance.md`, `interop.md`
5. `service-clients.md` — shared hazard base
6. tool children A: `docker.md`, `kubernetes.md`, `aws.md`
7. tool children B: `observability.md`, `grpc.md`, `messaging.md`
8. triad: `scenarios.md`, `checklists.md`, `evaluation.md` (authored last, in that order, per
   operation-skill.md S8->S9->S10)
9. wiring: `gobbi/SKILL.md:73`, `ideation/SKILL.md:68,174`, `evaluation/SKILL.md:309-310`,
   then `scripts/sync-plugin-package.sh`

Research and evaluation parallelize; writes do not.

**Authority:** user, explicit, after the scope risk was stated.

## D-8 — Assertion style: stdlib + go-cmp

**Decision:** `testing.md` teaches plain `if` conditions plus `github.com/google/go-cmp/cmp` for deep
comparison, with the got-before-want failure format. "Follow the existing project convention" is the
standing override.

**Why this was a user decision:** the research found a genuine conflict with **no Go-team position**.
Google's Style Decisions states *"Do not create 'assertion libraries' as helpers for testing"* and
Best Practices states *"Assertion helpers are not considered idiomatic in Go"*; Uber takes no
position; ecosystem usage favors testify (v1.11.1). The manager did not settle it unilaterally.

**Evidence supporting the chosen side:** only position with authoritative backing; zero dependency
cost. A 2026-04-20 critique (boldlygo.tech) documents concrete testify defects: ~100+ inconsistently
named functions, argument-order inconsistency between `Equal(expected, actual)` and
`EqualError(actual, expected)`, undocumented nil-vs-empty-slice semantics, and a direct stdlib
contradiction — `testify.Equal` treats nil and empty slices as distinct while `slices.Equal` treats
them as equal.

**Authority:** user, explicit.

---

# Locked design summary (end of Ideation DISCUSSION)

**Skill:** `go`, `skill-type: operation`, 19 files.
**Parent:** `SKILL.md` — 8 Go-delta Principles, fully-numbered Rules (typescript pattern), P1-P8
Procedure with per-step "Deepens ..." trace lines.
**Language children (8):** convention, design, errors, concurrency, modules-tooling, testing,
performance, interop.
**DevOps children (7):** service-clients (shared hazard base), docker, kubernetes, aws, observability,
grpc, messaging.
**Triad (3):** scenarios, checklists, evaluation — authored LAST in that order per operation-skill S8-S10.
**Check ID prefixes:** `GO-SCENARIO-NN`, `GO-CHECK-NN`.
**Wiring (3 files + sync):** `gobbi/SKILL.md:73`, `ideation/SKILL.md:68` and `:174`,
`evaluation/SKILL.md:309-310`, then `bash scripts/sync-plugin-package.sh`.
**Optional cleanup flagged to user, not yet approved:** `coding/SKILL.md:293` says idioms live in
"the **future** `python` / `typescript` skills" — stale wording independent of adding `go`.

**Non-negotiable content facts (all verified 2026-07-25, sources in report-go-language.md):**
- version floor `go 1.25.0` (go mod init writes N-1), current stable go1.26.5
- loop variable = Go 1.22 + the spec-only assignment-form trap
- `go test` runs 10 of 35 vet analyzers
- Effective Go officially not current; no single replacement
- `pkg/` repudiated by rsc; `internal/` is compiler-enforced
- golangci-lint v2 defaults = errcheck, govet, ineffassign, staticcheck, unused
- Docker canonical client = `github.com/moby/moby/client`; `github.com/docker/docker` deprecated
- Go 1.27 content is DRAFT — must not be taught as fact

## D-9 — Ideation iteration-1 finding dispositions (user-approved batch)

**Evaluator verdict:** REVISE. 6 High, 9 Medium, 8 Low. Report:
`1-ideation/evaluation/claude-evaluation-iter1.md`.

**Disposition:** FIX F-01..F-20 and F-22, F-23. **NO-CHANGE on F-21 only.**

**F-21 no-change rationale:** F-21 claims the literal frontmatter block and the per-tool file skeleton
cross from directional design into an "implementation diff". The manager reads them as INTERFACE
SPECIFICATIONS, which `ideation/SKILL.md` explicitly requires ("Name components, ownership,
interfaces"), and the per-tool template is the load-bearing compensating control against F-06-class
duplication drift. Removing it would trade one defect class for another. The evaluator itself flagged
F-21 as a judgment call rather than asserting a breach.

**Already applied before the batch (mechanical, non-destructive, no artifact semantics changed):**
- **F-02 (partial):** the three evidence bases plus the two new research reports were copied from
  session-ephemeral `/tmp/.../scratchpad/` into `1-ideation/working/evidence/`. The remaining half of
  F-02 — adding repo-relative paths to every `D-n` and evidence reference — is part of the revision.
- **F-18:** the subagent harness trailer (`agentId:`, `<usage>`) was stripped from the canonical
  artifact. 843 -> 838 lines.

**Overtaken by work already done:** F-03's remedy said the Kafka/NATS and version-verification passes
belonged inside Ideation rather than deferred to Planning. The manager had already run both before the
evaluation returned. Their outputs are `evidence/report-kafka-nats.md` and
`evidence/report-verification-pass.md`. BC-1 and BC-2 are therefore CLOSED, not deferred.

## D-10 — Codex waiver extended to the P7 cold-load proof (F-05)

**Decision:** D-3's Codex waiver also covers the `skill-writing` P7 cold-load proof. The skill ships
with a Claude-Code-only `cold-load-result` record and a stated, recorded gap.

**Why it needed deciding:** D-3's waiver was scoped to "every WORK and EVALUATION stage". A P7
cold-load proof is neither, so V9's both-runtimes requirement was left standing against a runtime the
session had already recorded as unreachable (three consecutive upstream 503s). The contradiction would
otherwise have surfaced at the very end of a 19-file session.

**Consequence:** V9 is revised to require one `cold-load-result` for `claude-code`, with the codex
record recorded as waived-not-run. This is a one-session exception; it does not weaken the
`skill-writing` P7 contract for future skills.

**Authority:** user, explicit.

## D-11 — Kafka dropped; `messaging.md` removed from scope (19 -> 18 files)

**Decision:** Kafka is out of scope for this session, and `messaging.md` is removed entirely.

**User words:** "Let's drop kafa in this session." Then, on the consequent fork: drop `messaging.md`
entirely.

**Why the file goes rather than shrinking:** with Kafka out, the only remaining content is NATS, and
`evidence/report-kafka-nats.md` concluded — after primary-source research — that a NATS page teaches a
Go author nothing `docs.nats.io` and the `jetstream` godoc do not. Its verbatim finding: *"NATS — no.
Point at the owner's docs ... A NATS page should be a pointer page."* A file existing to hold one link
is the thin-child padding risk (R-5) with no offsetting value.

**Amends D-6.** The locked per-tool set is now: `service-clients.md` (shared base) + `docker.md`,
`kubernetes.md`, `aws.md`, `observability.md`, `grpc.md`. Six DevOps files, not seven.

**New file total: 18.** SKILL.md + 8 language children + 6 DevOps files + 3 triad.
Sibling ratio recomputed: this is now closer to typescript's 12 files than the prior 1.58x.

**Deferred with a named destination (not dropped silently):**
- Kafka Go client guidance -> a future session. The research is already done and durable at
  `1-ideation/working/evidence/report-kafka-nats.md`, including the client comparison, the cgo
  cross-compilation consequence, and the inverted-commit-defaults finding. A later session does not
  need to re-research it.
- NATS -> same file, same destination. Recorded conclusion: pointer page, low value.

**Consequential edits required in the artifact revision:**
- remove file 16 (`messaging.md`) from §4.7, the dependency order, and the totals
- remove E-61/E-62/E-63 (Kafka) and E-64 (NATS) from the active evidence register, or mark them
  deferred-not-active
- close Q-5 (which Kafka client) as moot — superseded by this decision
- recompute the line-count total and the sibling ratio
- S5/V5's "seven" becomes "six": the five per-tool children plus `service-clients.md`
- O-9a's per-tool fetch list drops its messaging entry

**Authority:** user, explicit, on both the Kafka drop and the file-removal consequence.

## D-12 — Ideation iteration-2 dispositions: fix all 14 in iteration 3

**Evaluator verdict:** REVISE. 2 High (G-01 @80, G-02 @75), 6 Medium, 6 Low. Report:
`1-ideation/evaluation/claude-evaluation-iter2.md`.

**Disposition:** FIX all fourteen (G-01..G-14) in Ideation iteration 3 — the final pass under the
cap of 3.

**Why all rather than the High pair:** G-01 and G-02 are both failures of the citation-only control,
which D-2 designated as the SOLE replacement for compile verification — a hole there is a hole in the
skill's central quality mechanism. G-03 (the floor sweep cannot catch the defect it was built for) and
G-05 (the delta index table is unbuildable as specified) are not cosmetic and would surface during
Execution at higher cost. The remaining ten are cheap, several one-line.

**The brief must attack the CLASS, not the named instances.** Both iterations have now repeated the
same failure at successive levels:
- iteration 1: attention followed the loudest risk (SDK rot), leaving the language core unexamined
- iteration 2: attention followed the LEDGER, fixing the eleven items the prior evaluator enumerated
  rather than re-running the sweep that found them
Iteration 3 must not fix "the four items G-01 names". It must re-run the method over the whole
surface and report what the method finds.

**Cap position:** this spends the last iteration. If iteration 3 still returns REVISE, the state
machine requires a user decision to continue rather than proceeding automatically.

**Authority:** user, explicit.

## D-13 — Ideation cap raised 3 -> 4; iteration 4 authorized

**Decision:** raise the Ideation iteration cap from 3 to 4 and run one final bounded pass fixing
H-01 plus M-02..M-05 and L-06..L-11, then re-evaluate.

**Cap-gate trigger:** iteration 3 returned REVISE with 1 High. The cap of 3 was exhausted, and
`workflow/SKILL.md` forbids adding a pass without the user's decision.

**Convergence evidence supporting one more pass:** High findings 6 -> 2 -> 1 across three iterations.
The evaluator's unprompted calibration: *"All eleven findings are correctable inside the existing
structure — none requires re-deciding a locked design question, and the single High is closed by
extending one population and moving one gate."*

**Why H-01 justified the extra pass rather than being carried as debt:** it sits in `SKILL.md` — the
cold-load floor that §1.3 makes every reader load, and now the least-gated file in the tree. D-2 makes
citation the ONLY fact-check, so an ungated parent is a hole in the control precisely where it matters
most. X-14's own fallback compounds it by relocating an unsourced claim INTO the parent.

**Settings change:** `session.json.settings.workflow.ideation.maxIterations` 3 -> 4. This is a
user-authorized settings change under the exhausted-cap gate, not a silent reconfiguration. No other
step's cap changes.

**Authority:** user, explicit, at the state-machine cap gate.

## D-14 — Ideation PASS; final ten findings applied inline

**Verdict:** iteration 4 PASS. High 6 -> 2 -> 1 -> 0. Critical 0, High 0, Medium 3, Low 7.
Report: `1-ideation/evaluation/claude-evaluation-iter4.md`.

**Disposition:** all ten remaining findings (F-01..F-10) applied inline as a manager-approved batch,
without a fifth WORK+EVALUATION cycle.

**Why inline rather than a fifth iteration:** all ten are index and citation corrections, not design
changes. The evaluator's own judgment: *"None meets the REVISE threshold, and none re-opens a locked
design question; they are a bounded disposition decision for the user, not another WORK iteration."*

**Accepted trade-off, recorded honestly:** applying fixes without re-evaluation bends the dual-system
contract, and every prior iteration demonstrated that fixes can introduce defects (M-02 was created by
the fix to G-02). The user chose this path with that risk stated.

**Class fix, not instance fix.** F-01 and F-10 shared one root cause — the census enumerates ITEMS but
not the CLAUSE SITES an item occupies. The batch was briefed to fix the class using the X-24/X-25 form
(each naming every site its claim occupies). **Result: 12 additional clause sites found beyond the two
the evaluator named.** This is the fourth and final recurrence of the session's defining defect
pattern: iteration 1 followed the loudest risk (files), iteration 2 the ledger, iteration 3 literal
specifications (pointers), iteration 4 items-not-sites.

**Final artifact:** 1,281 lines. Ideation is sealed.

**Carried into Wrap-up as the honest limit of this PASS:** with Codex waived (D-3) and no Go toolchain
(D-2), **no taught Go fact was ever checked against go.dev or any owner URL.** Every one of the four
evaluators flagged this identically — a claim wrong in BOTH an evidence report AND the artifact passes
undetected. Internal consistency is thoroughly verified; external truth rests entirely on the research
citations. This is the strongest argument for the O-9 fetch obligations being genuinely executed during
Execution rather than waved through.

**Authority:** user, explicit.

## D-15 — Session-record shape corrected (manager defect)

**Defect:** the manager invented `1-ideation/working/evidence/` and a flat
`1-ideation/evaluation/claude-evaluation-iter{n}.md` layout instead of reading the authorized shape in
`record/record-map.md:45-74` first. `session-record.sh verify` caught it:
*"session directory shape does not match the authorized manifest/task set."*

**Correction applied:**
- `working/evidence/*.md` -> `working/iteration-1/research/{slug}.md`
- `evaluation/claude-evaluation-iter{n}.md` -> `evaluation/iteration-{n}/claude.md`
- `working/material-decisions.md` -> `working/iteration-1/open-decisions.md`
- 27 artifact references repointed; all six referenced paths verified to resolve on disk
- `verify` now passes

**Class:** same as the session's defining pattern — acting on a plausible structure instead of
checking the owner. Mistake candidate for Wrap-up: **read `record-map.md`'s authorized shape before
creating any session-tree path, not after `verify` rejects it.**

## D-16 — Planning task shape: group by layer, fetches up front

**Decision:** ~9-10 ordered tasks — all O-9 fetch passes first as one parallel read-only task, then
parent -> language children in three batches -> shared base -> tool children in two batches -> triad
-> wiring.

**Why:** matches the artifact's own §5 dependency graph and O-9's "must land before the write slot"
rule; keeps each task reviewable at 2-4 files; fetch failures surface before any writing begins.

**Accepted cost:** one front-loaded research task whose failure stalls everything behind it. Mitigated
by O-9e (a fetch that cannot be performed takes its stated fallback or ships an explicit
`**Unverified:**` marker) — so a failed fetch degrades one item rather than blocking the chain.

**Rejected:** one-task-per-file (~21 tasks; per-task ceremony would exceed writing time for the thin
children) and two-phase (8-9 files per task; no intermediate checkpoint, against Principle 2).

**Authority:** user, explicit.

## D-17 — Planning deviations from D-16 accepted (user, explicit)

**1 — 11 tasks, not 9-10.** Whole-tree sweeps become their own task. V7/V10/V11 run on the CANONICAL
tree and can force edits; V8/V9 need the GENERATED mirrors from a final tree. Bundling puts
`sync-plugin-package.sh` before a possible fix.

**2 — language batches regrouped** to `modules-tooling,errors,interop | testing,performance,convention
| design,concurrency`. **Corrects a MANAGER error:** the original grouping put `design.md` three
batches ahead of the `interop.md` it points at, and `errors.md`'s version claims ahead of the Version
Currency Register — two hoist-then-point violations against §5. The user locked the SHAPE, which holds.

## D-18 — Locked task list (11)

01-o9-fetch-passes · 02-skill-parent · 03-lang-modules-errors-interop ·
04-lang-testing-performance-convention · 05-lang-design-concurrency · 06-service-clients-base ·
07-tools-docker-k8s-aws · 08-tools-observability-grpc · 09-triad · 10-tree-sweeps · 11-wiring-sync-proof

**Highest-value/highest-risk: task 01** — the first and only time any taught Go fact is checked against
an owner URL (D-2 + D-3 + no network during Ideation).

## D-19 — Planning ships WITHOUT evaluation (user directive)

**User words:** "Because we don't have enough token. Let's go to execution without evaluating the plan"

**Deviation:** `workflow/SKILL.md` requires DISCUSSION->WORK->EVALUATION->RECORD for every productive
step; `CLAUDE.md` says "Never reduce dual-system creation, Ideation, or evaluation rigor to save
tokens." This does that for Planning. Manager noted ~14.9M context tokens remained before proceeding.

**Lost:** no independent check that the 11 contracts are executable, that obligation coverage closes
both ways, or that the two deviations propagate correctly. Plan is self-reported READY with four gaps.
**Retained:** per-task Execution evaluation is NOT waived.

## D-20 — Infrastructure outage mid-session

Safety classifier went down, disabling `Bash` and `Agent`; API returned intermittent 529s. `WebFetch`,
`Read`, `Write` stayed up. Manager used WebFetch directly to start task 01's O-9h branch rather than
stall, and preserved the partial result at `2-planning/outputs/o9-partial-fetch-ledger.md`.
**Result: U-15 fully RESOLVED** — H16's three clauses now carry verbatim quotations from
go.dev/wiki/CodeReviewComments (which carries no deprecation notice), plus independent re-confirmation
of the error-string form and interface placement at their true owner.

## D-21 — V12 citation-support sweep added (user, explicit)

**Trigger:** task 02's evaluator found TWO High defects on the cold-load floor that **passed every
existing sweep** (V1, V3, V4, V11 all clean). Both were caught only by fetching the cited owner and
reading it.
- **F-01:** Principle 6 taught "a racing program has no defined behavior"; `go.dev/ref/mem` says the
  OPPOSITE by name — *"less like C and C++, where the meaning of any program with a race is entirely
  undefined."*
- **F-02:** the `-race` cost was cited to `go.dev/ref/mem`, a page with **zero occurrences of
  "detector"**. Real owner `go.dev/doc/articles/race_detector`: *"memory usage may increase by 5-10x
  and execution time by 2-20x."*

**The design hole, in the evaluator's words:** *"no sweep tests whether a cited owner actually contains
the claim attributed to it"* — the ledger's method rule ("read the source, not the rendered page") was
applied at **fetch time only, never at review time.**

**Decision: add V12 — citation-support sweep.** Samples taught claims across the finished tree and
fetches each cited owner to confirm it contains the claim. Runs in **task 10** (whole-tree).

**Stated limits, recorded honestly:** fetch-bound, so it **samples rather than exhausts**; it can
reduce the defect rate but **cannot prove absence**. Its population must prioritize (a) claims on the
cold-load floor, (b) any claim whose owner is a long page where a mis-citation is easy, (c) numeric
figures.

**Base rate that justified it:** two wrong-owner citations in the FIRST authored file, with sixteen
files still to write.

**Consequence:** the sweep set is now V1-V12. Task 10's contract and `checklists.md` must both carry it.

## D-22 — V12 amended: the sweep may not verify via rendered pages

**Trigger:** the second fetch pass caught **the fetch tool hallucinating a citation.** A fetch of
`pkg.go.dev/net/http/pprof` returned a confident, emoji-decorated *"Security Warning: never expose on
a public or internet-facing interface."* **That text does not exist** — a grep of
`src/net/http/pprof/pprof.go` @ `go1.26.5` for `public|internet|security|untrusted|expose|sensitive`
matches nothing in the doc comment.

**Why this matters to V12 specifically:** V12 was added (D-21) to catch citations that exist but do not
support their claim, by fetching the cited owner. **If the fetch itself can manufacture the supporting
text, V12 can confirm a defect instead of catching it.** The sweep would then launder a fabrication
into a verified fact — strictly worse than not running it.

**Amendment:** V12 must verify against **source files or raw documents at a pinned tag**, never a
rendered-page summary. A rendered fetch is a **lead**, not a citation.

**Second instance from the same pass:** `runtime/pprof`'s doc comment lists the `goroutineleak` profile
**unconditionally**, while `lockProfiles()` registers it only `if goexperiment.GoroutineLeakProfile`.
pkg.go.dev therefore advertises a profile **absent from a stock build**. Rendered docs can be
confidently wrong even without a summarizer in the loop.

## D-23 — Four widely-repeated Go claims have NO Go-team owner

Confirmed by targeted fetch, 2026-07-26: **string<->`[]byte` conversion cost** (spec specifies
semantics only; the optimization list is community wiki) · **struct field reordering to reduce
padding** (spec guarantees minimum alignment only; nothing recommends it) · **"reflection is slow"**
(the canonical page names a *care* cost, never a performance one) · **"preallocate when you know the
size"** (`slices.Grow` is the closest owner).

**Consequence under H10:** each must be presented as **the skill's own claim**, or as
measurable-by-the-reader, or omitted. **None may be attributed to a Go-team owner.** Same disposition
as `strings.Builder`.

**This is a durable finding worth promoting at Wrap-up:** a claim being true, useful and universally
repeated is not evidence that it is *owned*. The skill's whole premise is that the difference matters.

## D-24 — Recurring MANAGER defect: briefs overstate their evidence

Four instances this session, each caught by an executor rather than by the manager:

1. **Task 02** — the brief did not say which fetch branch resolved X-20, so the executor correctly
   applied the deletion fallback for a gate that was in fact already resolved by the proverbs fetch.
2. **Task 04** — the brief asserted `T.Parallel` documents "pauses until all non-parallel tests have
   finished"; the manager's OWN ledger retraction, written hours earlier, says that clause is tip-only
   and absent at `go1.26.5`. The executor followed the ledger over the brief. Correct precedence.
3. **Marker-closing pass** — the brief said the two fetch passes "resolved essentially all" of the 22
   markers. They resolved **13**. Seven had no corresponding pass content at all.
4. **Same pass** — the brief listed the "reports whether" sentence under a doc-comment correction
   without saying which of two pages carries it. The executor quoted it and **refused to assign a
   page**, which was the right restraint.

**Root cause:** the manager writes briefs from a compressed recollection of prior artifacts instead of
re-reading the artifact at brief-writing time. The failure shape is identical to the one every Ideation
evaluator named — acting on a summary one level shallower than the evidence.

**Correction to apply for the remaining tasks:** when a brief asserts what a prior artifact says, quote
it from the artifact rather than paraphrasing from memory; and when a brief names a gated item, state
which branch or pass resolved it and which did not.

**Mistake candidate for Wrap-up:** *a task brief is a citation surface too — it must quote its sources
rather than recall them, and it is subject to the same "verify the owner contains the claim" rule as
the skill it produces.*

## D-25 — struct-vs-function shape RESTORED to `design.md` as the skill's own position

**Decision:** keep the section, tier-marked as the skill's own claim, not attributed to an owner.

**Why it needed a user decision:** the ideation census DELETED this item as unsourced and recorded that
reintroducing it "is a scope change requiring a user decision." The manager's task-05 brief
re-contracted it without noticing — the fifth brief-vs-artifact mismatch this session (see D-24).

**Consistency argument that decided it:** this is the same disposition already agreed under D-23 for
four other unowned claims — string/[]byte conversion cost, struct field reordering, reflection's
performance cost, slice preallocation. Keep the useful content; never attribute it. Removing this one
while keeping those four would be incoherent.

**Also settled:** *functional options* stays DELETED. `design.md` §4 states no position on it and says why.

## D-26 — Task-10 cleanup queue (deferred, not dropped)

Recorded so the whole-tree sweep task does not have to rediscover them:
1. **Router mismatch:** `SKILL.md`'s P2 routes *channels-versus-mutexes* to `design.md`, but
   `concurrency.md` now owns it. `design.md` §7 carries a redirect so no reader is stranded, but the
   parent row should name the real owner.
2. **Benchmark ownership reads both ways:** the parent routes "benchmarks" to `testing.md` and
   "benchmarking" to `performance.md`. Construction lives in `testing.md`; measurement in
   `performance.md`. The row needs to say so.
3. **Stale forward-obligation prose in four files** — `errors.md`, `performance.md`, `convention.md`,
   `testing.md` each say "when X is written it must point here" about files that now exist. Convert to
   present tense.
4. **Three router triggers reach topics no file teaches** (map/nil-map access, file naming,
   string/[]byte conversion). Each is marked in-file so no reader is silently dropped; close by
   fetching or by editing the parent row.

## D-27 — Two struck claims restored after being sourced (manager ruling)

**`status` as a named symbol in `grpc.md` §6.** The design struck it as unsourced and pre-authorized
restoration "if O-9b's owner fetch names it." O-9b does not — **the task-08 executor's own fetch does**:
`Documentation/anti-patterns.md` @ `v1.82.1` uses `status.FromError(err)` in a worked example, and
`status/status.go` @ `v1.82.1` supplies the nil/`ok == true` clause verbatim. **Approved** — the
condition was "if sourced", and it is now sourced; which fetch sourced it is immaterial.

**`DialContext` deprecation.** The manager's brief said not to claim it unless verified independently,
because `anti-patterns.md` targets only `grpc.Dial`. The executor verified it: `clientconn.go` @
`v1.82.1` carries `// Deprecated: use NewClient instead.  Will be supported throughout 1.x.` on **both**
`Dial` and `DialContext`. **Approved** — the brief's caution was correctly aimed at the wrong document,
and the executor found the right one.

**Both rulings are the rule working, not exceptions to it:** a claim struck for being unsourced is
restorable by sourcing it.

## D-28 — Task-10 addition: V7's allowlist has a dead row

`grpc.md` §2 `new TCP connection per dial` is a declared V7 allowlist triple, but `service-clients.md`
absorbed that sentence verbatim when the base was written, so the child correctly omits it. A declared
triple with zero hits cannot fail the sweep, but the row is dead and **V7's own contract says the
allowlist changes only by an explicit edit BEFORE the run, never by a judgment during it.**
Edit it out in task 10 before running V7.
