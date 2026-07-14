# Startup — Evaluation Checklist

> **Copy-then-tick — this file is the source; the evaluator copies it.** At Stage 0 the evaluator
> COPIES this file to `sessions/{date}-{session-id}/startup/working/evaluation/iter{n}/{system}/checklist.md`.
> The filled copy is a real **9th evaluation-output file**, alongside the seven per-perspective files
> + `overall.md`. The source here ships with every box UNCHECKED.
>
> **A ticked box = VERIFIED, not "done".** `- [x]` means the evaluator VERIFIED the check against the
> completed baseline set with the strongest verification the check admits (close-read the ledger /
> `grep` the branch closures / run the staged-set frontmatter dry-run / trace a claim through the
> manifest / diff the actual memory delta / run a secret scan / inspect guard evidence / cold-read the
> promoted README) — never that work merely happened.
>
> **Fill procedure.** Stage 0: copy (boxes unchecked). Stage 1: append a `## Stage 1 Additions`
> section for any scenario or check the Frame added that is not seeded here. Stage 2: tick each box
> `[x]` and annotate its outcome — `PASS:` (verified satisfied), `FAIL: {finding-id}` (verified
> violated, cite the finding), or `n/a: {reason}` (not applicable because a branch is proven
> irrelevant with evidence). The completeness gate requires every box resolved to exactly one of the
> three. `n/a` never excuses missing required coverage, an unowned open branch, or a failed
> verification.
>
> **Legend.** `- [ ]` unresolved · `- [x] … PASS:` verified satisfied · `- [x] … FAIL: {finding-id}`
> verified violated · `- [x] … n/a: {reason}` proven irrelevant. Record per-perspective counts
> (PASS / FAIL / n/a / total) in the filled copy's compact per-scenario results table.
>
> **Two gates — do not collapse them.** A branch closure and an acceptance pass are different
> gates. A branch is *accounted for* (coverage-closure gate) when it is `confirmed`,
> `proven-irrelevant` with a reason, or `recorded-open` with an owner — here `recorded-open` is a
> VALID closure. A design-substance check PASSes (acceptance-pass gate) only when the applicable
> load-bearing claim is *evidenced* — here `recorded-open` is NOT an acceptance pass: an applicable
> load-bearing design claim left `recorded-open` still drives REVISE (the `STARTUP-RISK-SCENARIO-06`
> teeth). A branch can be validly closed for coverage and still FAIL the substance check.

The scenario families, their lenses, and the adversarial cases these checks discriminate live in the
sibling `scenario.md`; the evaluation procedure lives in `evaluation.md`. The heading tree below is
1:1 with `scenario.md`.

---

## Project

### STARTUP-PROJ-SCENARIO-01 — Required topic coverage is complete and substantive
- [ ] STARTUP-PROJ-SCENARIO-01-CHECK-01 — All 11 Level-1 checkpoint markers exist and each is user-confirmed.
- [ ] STARTUP-PROJ-SCENARIO-01-CHECK-02 — All 46 required Level-2 branches appear exactly once in the branch-closure register.
- [ ] STARTUP-PROJ-SCENARIO-01-CHECK-03 — Every branch closes as `confirmed`, `proven-irrelevant` with a reason, or `recorded-open` with an owner and resolution method.
- [ ] STARTUP-PROJ-SCENARIO-01-CHECK-04 — Every `confirmed` load-bearing answer includes the evidence tuple its branch requires — source / actor, concrete event or observed state, date / time window, behavior, consequence, and claim status; a polished paragraph without the tuple FAILS the same as a one-word answer.
- [ ] STARTUP-PROJ-SCENARIO-01-CHECK-05 — A vague answer was probed up to twice and then resolved or recorded-open; it was not accepted as confirmed or probed indefinitely.
- [ ] STARTUP-PROJ-SCENARIO-01-CHECK-06 — The problem-before-solution premise gate ran between Topic 4 and Topic 5: every premise (problem + last-instance evidence, first user + job, current alternative + switching forces, root cause + why-now, fatal assumption, boundary + non-goals) was shown for agree / disagree and confirmed before any solution / features topic was entered; a failed premise reopened its earliest owning branch and no solution topic proceeded on an unconfirmed premise.

### STARTUP-PROJ-SCENARIO-02 — Product intent constrains architecture and stack
- [ ] STARTUP-PROJ-SCENARIO-02-CHECK-01 — Topics 2-5 were user-confirmed before a future architecture, stack, or quality direction was locked.
- [ ] STARTUP-PROJ-SCENARIO-02-CHECK-02 — Each system direction names the specific confirmed upstream branch — user, outcome, boundary, capability, or journey — it derives from; a bare "follows from product intent" that names no specific branch FAILS.
- [ ] STARTUP-PROJ-SCENARIO-02-CHECK-03 — No later technical choice silently redefines users, outcomes, scope, value-features, or critical journeys.
- [ ] STARTUP-PROJ-SCENARIO-02-CHECK-04 — Any late-topic conflict re-opened the earliest owning branch and recorded the resolution and authority.

### STARTUP-PROJ-SCENARIO-03 — Design-bearing directions are researched and user-decided
- [ ] STARTUP-PROJ-SCENARIO-03-CHECK-01 — Every design-bearing branch has a decision brief with internal evidence and 2-3 identifiable external prior-art sources, each captured as Source / Insight / Why.
- [ ] STARTUP-PROJ-SCENARIO-03-CHECK-02 — At least one source directly supports each load-bearing rationale (its applicability and constraint stated), contrary evidence is addressed, the alternatives are genuinely distinct, and the recommendation names the recommended option first plus the evidence-to-change; source count alone proves nothing.
- [ ] STARTUP-PROJ-SCENARIO-03-CHECK-03 — The user's chosen direction, rationale, and rejected alternatives are recorded in the ledger and an atomic decision / design draft.
- [ ] STARTUP-PROJ-SCENARIO-03-CHECK-04 — Every cited source resolves and supports the claim made from it; no citation or project fact is fabricated.
- [ ] STARTUP-PROJ-SCENARIO-03-CHECK-05 — The decision stays at direction altitude and does not prescribe interface signatures, module internals, algorithms, schemas, or a task breakdown.

### STARTUP-PROJ-SCENARIO-04 — License, distribution, governance, and authority are explicit
- [ ] STARTUP-PROJ-SCENARIO-04-CHECK-01 — Topic 1.4 is present and closed; an internal project uses the confirmed internal / not-applicable statement with a recorded reason rather than a silent omission.
- [ ] STARTUP-PROJ-SCENARIO-04-CHECK-02 — The license / distribution / governance claim matches actual repository evidence, or is explicitly qualified as user intent / open rather than guessed.
- [ ] STARTUP-PROJ-SCENARIO-04-CHECK-03 — The recorded decision-maker has authority over the license / governance decision.
- [ ] STARTUP-PROJ-SCENARIO-04-CHECK-04 — Any unresolved legal, distribution, contribution, or governance constraint has an owner and resolution method.

### STARTUP-PROJ-SCENARIO-05 — The load-bearing problem is grounded in behavioral evidence
- [ ] STARTUP-PROJ-SCENARIO-05-CHECK-01 — Every load-bearing problem claim cites past behavior (a workaround built, effort / time / money already spent, or a recurring struggle) for a named user at a stated recurrence — not stated interest or a hypothetical; or is proven-irrelevant with a specific reason.

### STARTUP-PROJ-SCENARIO-06 — One first user and their job are clear
- [ ] STARTUP-PROJ-SCENARIO-06-CHECK-01 — The baseline names one first user / segment with a concrete job (situation, motivation, outcome), the current alternative, and at least one switching force; a bare category label ("developers", "everyone") without a concrete job FAILS; or proven-irrelevant with a specific reason.

### STARTUP-PROJ-SCENARIO-07 — The product shape is solved, bounded, and traceable
- [ ] STARTUP-PROJ-SCENARIO-07-CHECK-01 — The product shape connects user → job → value → boundary → capabilities → critical journeys with no orphan capability and no boundary / journey contradiction, stays at direction altitude (no interface signatures, schemas, algorithms, or task breakdown), and each direction traces to a confirmed constraint plus a studied reference; or proven-irrelevant with a specific reason.

---

## Structure

### STARTUP-STRUCT-SCENARIO-01 — Records are atomic and match their memory types
- [ ] STARTUP-STRUCT-SCENARIO-01-CHECK-01 — Every staged and promoted typed record holds one durable concept; no "startup context" bundle exists.
- [ ] STARTUP-STRUCT-SCENARIO-01-CHECK-02 — Each record's body follows its memory type's required section contract.
- [ ] STARTUP-STRUCT-SCENARIO-01-CHECK-03 — Each title and slug names the durable subject rather than a generic category or an interview coordinate.
- [ ] STARTUP-STRUCT-SCENARIO-01-CHECK-04 — Answers with several durable effects were split into separate atomic records without duplicating one concept across types.

### STARTUP-STRUCT-SCENARIO-02 — Routing and frontmatter are deterministic
- [ ] STARTUP-STRUCT-SCENARIO-02-CHECK-01 — Every staged typed source has exactly one manifest row, and every promoted typed destination has exactly one staged source.
- [ ] STARTUP-STRUCT-SCENARIO-02-CHECK-02 — Each destination's type, scope, per-file feature, allowed area, slug, and filename form validate under the staging-to-destination contract.
- [ ] STARTUP-STRUCT-SCENARIO-02-CHECK-03 — The staged-set frontmatter dry-run passes before promotion, and the promoted-set validator passes after promotion.
- [ ] STARTUP-STRUCT-SCENARIO-02-CHECK-04 — Staging-only routing fields are stripped while durable base and destination-type extension fields remain.
- [ ] STARTUP-STRUCT-SCENARIO-02-CHECK-05 — An unresolved area or a destination collision halted for a user decision; no fallback area or plausible off-table path was invented.

### STARTUP-STRUCT-SCENARIO-03 — Feature directories represent durable user value
- [ ] STARTUP-STRUCT-SCENARIO-03-CHECK-01 — Every new `features/{feature-name}/` directory has an explicit user-ratified durable value proposition.
- [ ] STARTUP-STRUCT-SCENARIO-03-CHECK-02 — No feature directory names a task, sprint, epic, subsystem, internal mechanism, or speculative idea.
- [ ] STARTUP-STRUCT-SCENARIO-03-CHECK-03 — Each feature-scoped staged and promoted record names the same correct per-file feature target.
- [ ] STARTUP-STRUCT-SCENARIO-03-CHECK-04 — A feature README index candidate existed, was manifest-listed, and was promoted only for each ratified durable value-feature.

### STARTUP-STRUCT-SCENARIO-04 — Dependency and operational structure is explicit or proven irrelevant
- [ ] STARTUP-STRUCT-SCENARIO-04-CHECK-01 — Each essential dependency direction identifies its source, version / constraint, approval or trust basis, license status, and failure fallback, or the branch is proven irrelevant with a reason.
- [ ] STARTUP-STRUCT-SCENARIO-04-CHECK-02 — Dependency-graph and system-boundary implications are recorded; no dependency silently owns a core project responsibility.
- [ ] STARTUP-STRUCT-SCENARIO-04-CHECK-03 — Each trust boundary and major data-flow direction is consistent with the recorded architecture and data promises — no boundary or flow contradicts a stated data promise or the recorded architecture.
- [ ] STARTUP-STRUCT-SCENARIO-04-CHECK-04 — Observability direction covers applicable logs, metrics, traces, alerts, and runbooks, or records proven irrelevance with a reason.
- [ ] STARTUP-STRUCT-SCENARIO-04-CHECK-05 — Operational ownership and support expectations are named for each material subsystem, or recorded-open with an owner and resolution method.

### STARTUP-STRUCT-SCENARIO-05 — The shaped direction is feasible to build and sustainable to run
- [ ] STARTUP-STRUCT-SCENARIO-05-CHECK-01 — The shaped direction is buildable with the available skills, dependencies, and constraints (essential dependencies name source / version / approval / failure-fallback) AND sustainable to run across its intended life (capacity, ownership, failure-recovery, and upkeep named); an un-buildable or un-maintainable direction FAILS; or proven-irrelevant with a specific reason.

---

## Performance

### STARTUP-PERF-SCENARIO-01 — Interview depth follows uncertainty and risk
- [ ] STARTUP-PERF-SCENARIO-01-CHECK-01 — Smart-skip is used only for fully evidenced branches after user confirmation; mandatory coverage is never dropped.
- [ ] STARTUP-PERF-SCENARIO-01-CHECK-02 — Every design-bearing choice is classified by uncertainty × reversibility × magnitude; each irreversible or high-magnitude choice carries a premise, a distinct alternative, a disconfirmation test, and an evidence-to-change, while an evidenced two-way door may smart-skip with a reason.
- [ ] STARTUP-PERF-SCENARIO-01-CHECK-03 — Vague answers were probed up to twice and then resolved or recorded-open rather than accepted shallowly or discussed indefinitely.
- [ ] STARTUP-PERF-SCENARIO-01-CHECK-04 — Confirmed Level-1 checkpoints and stable answer IDs keep interruption / resume bounded without replaying settled branches.

### STARTUP-PERF-SCENARIO-02 — Baseline size matches durable information value
- [ ] STARTUP-PERF-SCENARIO-02-CHECK-01 — Each durable concept maps to exactly one authoritative record and each record to exactly one concept — no duplicate authority and no multi-concept bundle; word count is diagnostic only, never the pass predicate.
- [ ] STARTUP-PERF-SCENARIO-02-CHECK-02 — No "one memory file per scratch thought" fragmentation and no oversized multi-concept bundle exists.
- [ ] STARTUP-PERF-SCENARIO-02-CHECK-03 — No raw discussion, ledger, research note, promotion manifest, startup summary, or transcript dump was promoted as durable memory.
- [ ] STARTUP-PERF-SCENARIO-02-CHECK-04 — Each promoted record is concise enough for future loading while retaining the evidence, rationale, and recovery detail its type requires.

### STARTUP-PERF-SCENARIO-03 — READMEs are indexes and budgets are explicit
- [ ] STARTUP-PERF-SCENARIO-03-CHECK-01 — The root and feature READMEs summarize identity and point to typed records; no section restates a typed-record body in full.
- [ ] STARTUP-PERF-SCENARIO-03-CHECK-02 — A sampled typed-record fact can change without requiring a second authoritative factual rewrite in a README.
- [ ] STARTUP-PERF-SCENARIO-03-CHECK-03 — Applicable recurring token / API / infra / storage cost dimensions carry order-of-magnitude estimates and a runaway scenario, or a proven-irrelevant reason.
- [ ] STARTUP-PERF-SCENARIO-03-CHECK-04 — Each applicable scale, latency, throughput, capacity, and quality threshold names a sourced, context-specific basis or measurement method; a bare number with no basis, or a "should be fine", FAILS.
- [ ] STARTUP-PERF-SCENARIO-03-CHECK-05 — Error-budget or availability impact is bounded with a recovery / rollback expectation, or the branch is proven irrelevant with a reason.

---

## Aesthetics

### STARTUP-AESTH-SCENARIO-01 — A cold reader can understand every promoted record
- [ ] STARTUP-AESTH-SCENARIO-01-CHECK-01 — A cold-reader TASK passes: with no startup-record access, the reader can identify the project purpose, first user, problem evidence, scope, decided direction, validation status, risks, and next action; any answer that needs hidden transcript context FAILS.
- [ ] STARTUP-AESTH-SCENARIO-01-CHECK-02 — Each typed record states its durable concept at the top and follows the established section order for its type.
- [ ] STARTUP-AESTH-SCENARIO-01-CHECK-03 — Prose is plain, literal, zero-context, and defines non-obvious terms without relying on the interview transcript.
- [ ] STARTUP-AESTH-SCENARIO-01-CHECK-04 — No promoted record buries its point under session narrative, filler, or duplicated context.

### STARTUP-AESTH-SCENARIO-02 — Names, headings, and pointers are stable
- [ ] STARTUP-AESTH-SCENARIO-02-CHECK-01 — Titles and slugs name durable concepts, not topic IDs, answer rows, iteration numbers, or checkpoint coordinates.
- [ ] STARTUP-AESTH-SCENARIO-02-CHECK-02 — No load-bearing session-coordinate token (for example "Topic 7.4", "checkpoint 3", or "ledger row") remains in promoted prose.
- [ ] STARTUP-AESTH-SCENARIO-02-CHECK-03 — No `TBD`, `TODO`, `???`, unfinished sentence, empty required section, or non-resolving "see above / below" placeholder remains.
- [ ] STARTUP-AESTH-SCENARIO-02-CHECK-04 — README and typed-record headings match the established templates and adjacent memory conventions.
- [ ] STARTUP-AESTH-SCENARIO-02-CHECK-05 — Every link and path pointer in promoted memory and the startup summary resolves from its intended reading context.

---

## Usage

### STARTUP-USAGE-SCENARIO-01 — Downstream loops can start from the baseline safely
- [ ] STARTUP-USAGE-SCENARIO-01-CHECK-01 — The README plus the typed records answer what the project is, who it serves, its scope / non-goals, durable features, decided directions, constraints, risks, and evidence without the startup record.
- [ ] STARTUP-USAGE-SCENARIO-01-CHECK-02 — Decided baseline directions are clearly distinguishable from open mechanism questions reserved for later loops.
- [ ] STARTUP-USAGE-SCENARIO-01-CHECK-03 — Every `recorded-open` item has an owner, a resolution method, and a trigger or runnable next action.
- [ ] STARTUP-USAGE-SCENARIO-01-CHECK-04 — A cold Ideation / Preparation simulation reveals no startup question that must be re-asked because the baseline omitted its answer or status.

### STARTUP-USAGE-SCENARIO-02 — Resume, rerun, and completion states are usable
- [ ] STARTUP-USAGE-SCENARIO-02-CHECK-01 — Ledger events have stable Answer IDs; a correction appends a linked superseding event rather than editing history in place.
- [ ] STARTUP-USAGE-SCENARIO-02-CHECK-02 — Resume re-confirms checkpoint summaries, regenerates staged drafts from the current event set, and continues from the first unconfirmed checkpoint.
- [ ] STARTUP-USAGE-SCENARIO-02-CHECK-03 — A rerun classifies every output as unchanged, living-index update, new record, superseding record, or deferred / open; it never blind-appends.
- [ ] STARTUP-USAGE-SCENARIO-02-CHECK-04 — The startup summary lists promoted paths, unresolved questions, rerun triggers, and the live-session completion state.
- [ ] STARTUP-USAGE-SCENARIO-02-CHECK-05 — Later-session completion is derived from durable memory, not from the gitignored record-level startup summary.

### STARTUP-USAGE-SCENARIO-03 — Human and operator quality needs are represented
- [ ] STARTUP-USAGE-SCENARIO-03-CHECK-01 — Accessibility needs for applicable user-facing, operator-facing, and agent-facing surfaces are recorded as directions / scenarios, or proven irrelevant with a reason.
- [ ] STARTUP-USAGE-SCENARIO-03-CHECK-02 — Internationalization / locale needs are recorded or proven irrelevant; baseline prose avoids unexplained idiom and culture-bound metaphor.
- [ ] STARTUP-USAGE-SCENARIO-03-CHECK-03 — Applicable failure experiences name a clear recovery or next action rather than only reporting an error.
- [ ] STARTUP-USAGE-SCENARIO-03-CHECK-04 — For each material failure scenario, the baseline names at least one observable signal, an owner, a diagnosis pointer, and a recovery / next action, or proves operations irrelevant with a reason.

---

## Consistency

### STARTUP-CONS-SCENARIO-01 — Cross-topic contradictions are resolved
- [ ] STARTUP-CONS-SCENARIO-01-CHECK-01 — For each required pair (vision vs scope, users vs journeys, non-goals vs roadmap, quality vs stack, data promises vs architecture, risk mitigations vs schedule / capacity, and rules vs live examples) the §7 pass cites both claims, tests whether they can be simultaneously true, and points to a ledger resolution / authority or an owned open contradiction; a recorded "all clear" without the pairwise evidence FAILS.
- [ ] STARTUP-CONS-SCENARIO-01-CHECK-02 — Every detected contradiction re-opened the earliest owning branch and records its selected authority and resolution, or remains `recorded-open` with an owner and resolution method.
- [ ] STARTUP-CONS-SCENARIO-01-CHECK-03 — No promoted records or README sections make mutually incompatible claims without an explicit unresolved-status marker.
- [ ] STARTUP-CONS-SCENARIO-01-CHECK-04 — Product scope, privacy / retention promises, quality thresholds, roadmap, and system direction remain mutually feasible.

### STARTUP-CONS-SCENARIO-02 — Claim kind and evidence status survive promotion
- [ ] STARTUP-CONS-SCENARIO-02-CHECK-01 — Sampled promoted claims trace to ledger entries carrying separate claim-kind and evidence-status fields.
- [ ] STARTUP-CONS-SCENARIO-02-CHECK-02 — Observed fact, user intent, forecast, preference, decision, assumption, and open question remain distinguishable in durable prose.
- [ ] STARTUP-CONS-SCENARIO-02-CHECK-03 — No `user-asserted` or `unverified` load-bearing market, scale, security, license, privacy, or operational claim is promoted as an unqualified fact.
- [ ] STARTUP-CONS-SCENARIO-02-CHECK-04 — Evidence references resolve and say what the promoted claim says; evidence strength never increases silently during synthesis.

### STARTUP-CONS-SCENARIO-03 — The full baseline set traces one-to-one
- [ ] STARTUP-CONS-SCENARIO-03-CHECK-01 — Sampled claims trace memory → manifest → staged source → ledger answer / decision → evidence or decision brief.
- [ ] STARTUP-CONS-SCENARIO-03-CHECK-02 — Every staged candidate has exactly one manifest disposition, and every manifest create / update / supersede row has an approved staged source.
- [ ] STARTUP-CONS-SCENARIO-03-CHECK-03 — Every actual memory delta path appears in the manifest; no unlisted path changed.
- [ ] STARTUP-CONS-SCENARIO-03-CHECK-04 — Root / feature README pointers and startup-summary promoted paths match the actual promoted set.
- [ ] STARTUP-CONS-SCENARIO-03-CHECK-05 — Existing records classified `unchanged` were not rewritten; superseding records carry paired forward / back links and exact archive moves.
- [ ] STARTUP-CONS-SCENARIO-03-CHECK-06 — Staging filenames follow the per-record slug / collision policy; no bulk finding file and no silent same-path overwrite hides a distinct record.

---

## Risk

### STARTUP-RISK-SCENARIO-01 — Secrets and sensitive values never cross into durable output
- [ ] STARTUP-RISK-SCENARIO-01-CHECK-01 — The ledger marks sensitive answers, and synthesis strips or safely generalizes them from every typed draft, index candidate, summary, and promoted destination.
- [ ] STARTUP-RISK-SCENARIO-01-CHECK-02 — Automated and manual secret / sensitive-data scans cover the full staged set, the living-index candidates, the startup summary, the evaluation evidence, and the actual promoted memory delta.
- [ ] STARTUP-RISK-SCENARIO-01-CHECK-03 — No secret, credential, token, private URL, PII / customer datum, or user-marked sensitive value appears in durable memory or evaluation artifacts.
- [ ] STARTUP-RISK-SCENARIO-01-CHECK-04 — Sensitive data that remains in the gitignored startup record is explicitly treated as record-level exposure and is never cited verbatim into memory.

### STARTUP-RISK-SCENARIO-02 — License, authority, binding-rule, and prior-art use are safe
- [ ] STARTUP-RISK-SCENARIO-02-CHECK-01 — Actual repository evidence supports Topic 1.4's license / distribution / governance claim.
- [ ] STARTUP-RISK-SCENARIO-02-CHECK-02 — The person who approved each binding license, governance, security, rule, or scope direction has recorded authority.
- [ ] STARTUP-RISK-SCENARIO-02-CHECK-03 — Every prior-art source used in a decision is identifiable, applicable, and license-compatible where code / content was borrowed.
- [ ] STARTUP-RISK-SCENARIO-02-CHECK-04 — Essential dependencies come from trusted sources and carry license / approval and failure-fallback information.
- [ ] STARTUP-RISK-SCENARIO-02-CHECK-05 — Any unresolved legal, compliance, IP, dependency, or authority issue blocks validity or remains recorded-open with an owner; it is never guessed away.
- [ ] STARTUP-RISK-SCENARIO-02-CHECK-06 — Every promoted `rules/` record has explicit user confirmation of its invariant, scope, reason, and genuine exception; no preference was hardened into a binding rule without it.

### STARTUP-RISK-SCENARIO-03 — Promotion is approved, bounded, and collision-safe
- [ ] STARTUP-RISK-SCENARIO-03-CHECK-01 — The complete staged set and manifest validated before the first memory mutation; memory was unchanged through that pre-write gate.
- [ ] STARTUP-RISK-SCENARIO-03-CHECK-02 — The final Always-Ask approval covers the exact manifest destinations, operations, supersessions, archive moves, and unresolved questions.
- [ ] STARTUP-RISK-SCENARIO-03-CHECK-03 — Every destination records a P5 preimage and every P6 mutation immediately rechecks that live state against the preimage.
- [ ] STARTUP-RISK-SCENARIO-03-CHECK-04 — A create collision or a changed preimage halted; no unlisted, colliding, or concurrently edited destination was overwritten.
- [ ] STARTUP-RISK-SCENARIO-03-CHECK-05 — Every actual P6 memory change is listed in the approved manifest and stays within the startup memory-write grant.
- [ ] STARTUP-RISK-SCENARIO-03-CHECK-06 — Startup changed no repository code, skill, template, agent, or unrelated memory path.

### STARTUP-RISK-SCENARIO-04 — Promotion finishes in a verified, recoverable state
- [ ] STARTUP-RISK-SCENARIO-04-CHECK-01 — Every manifest destination exists with the expected post-strip / post-stamp content, and each verification result is recorded beside its row.
- [ ] STARTUP-RISK-SCENARIO-04-CHECK-02 — Every supersession link is paired, every planned archive path exists, and every living-index pointer resolves.
- [ ] STARTUP-RISK-SCENARIO-04-CHECK-03 — Typed records and supersessions were applied before living-index updates; the indexes were written last.
- [ ] STARTUP-RISK-SCENARIO-04-CHECK-04 — All named standing guards ran over the post-promotion tree and exited 0.
- [ ] STARTUP-RISK-SCENARIO-04-CHECK-05 — Promotion state is complete or fully rolled back; no writing / verifying / partial state is hidden by the summary.
- [ ] STARTUP-RISK-SCENARIO-04-CHECK-06 — Rollback deletes only this promotion's matching-hash uncommitted creates and restores pre-existing edits / moves to their recorded preimages; it never deletes pre-existing memory.

### STARTUP-RISK-SCENARIO-05 — P6.5 gates validity and records cost / error-risk commitments
- [ ] STARTUP-RISK-SCENARIO-05-CHECK-01 — Two fresh evaluators, one Claude and one Codex, evaluated the same frozen completed baseline set.
- [ ] STARTUP-RISK-SCENARIO-05-CHECK-02 — Each system wrote all nine required files under `startup/working/evaluation/iter{n}/{system}/` before reconciliation (completeness gate only — writing the files never proves the content is correct; Overall PASS still depends on the substantive checks).
- [ ] STARTUP-RISK-SCENARIO-05-CHECK-03 — The manager reconciled both systems pessimistically and routed any material divergence through the user-decision gate.
- [ ] STARTUP-RISK-SCENARIO-05-CHECK-04 — `baseline_valid: true` appears only after exact-path verification, the standing guards, and the reconciled P6.5 verdict all PASS.
- [ ] STARTUP-RISK-SCENARIO-05-CHECK-05 — REVISE names the earliest owning startup phase and blocks P7; FAIL halts with `baseline_valid` false rather than silently continuing.
- [ ] STARTUP-RISK-SCENARIO-05-CHECK-06 — Applicable recurring-cost, error-budget, rollback, and irreversible commitments carry bounds and recovery directions, or a proven-irrelevant reason.

### STARTUP-RISK-SCENARIO-06 — Load-bearing design claims are evidenced or fail
- [ ] STARTUP-RISK-SCENARIO-06-CHECK-01 — Every applicable load-bearing design claim (problem reality, user clarity, product-shape soundness, or feasibility & sustainability) is evidenced to its standard or proven-irrelevant; a claim left un-evidenced and not proven-irrelevant drives REVISE — ownership does not excuse it, `recorded-open` is coverage, not acceptance. A fabricated citation, a silently-strengthened claim status, or an `n/a` without a genuine claim-specific reason drives FAIL.
