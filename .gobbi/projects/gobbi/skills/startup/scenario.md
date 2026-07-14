# Startup — Evaluation Scenarios

Per-perspective GOOD / BAD / ADVERSARIAL discrimination scenarios for a completed startup baseline.
The evaluator loads this file at Stage 1 (Scenario-Checklist Frame Build) as seed scenarios for the
seven perspectives.

The evaluation **procedure** — the per-perspective lens definitions, recommended verifications,
perspective anti-patterns, the P6.5 verdict routing, and Overall (Stage 3) anchors — lives in the
sibling `evaluation.md`. The concrete yes/no **checks** each scenario references live 1:1 in the
sibling `checklist.md`, whose heading tree mirrors this file exactly.

The artifact under evaluation is **the completed startup baseline as a set**: the answer ledger and
its branch closures; the referenced decision briefs and evidence; the full staged-draft set,
including living-index candidates; the approved promotion manifest and preimages; the actual promoted
memory delta and the overlapping prior memory; the exact-path verification and standing-guard
results; and the startup summary. This evaluation is the **P6.5 non-skippable dual-system gate**: two
fresh evaluators, one Claude and one Codex, judge the frozen post-promotion set before P7 may write
`baseline_valid: true`. Startup is a non-loop target, so its evaluation evidence lives under
`sessions/{date}-{session-id}/startup/working/evaluation/iter{n}/{system}/`, NOT a numbered
`{N}-{loop}/evaluation/` path.

Startup establishes the reference later loops and later sessions trust. Every family below therefore
judges **baseline completeness and quality**: did the talk cover all 11 topics and 46 required
branches with real evidence; did product intent constrain system direction; did design-bearing
choices use prior art and a user decision; did synthesis preserve claim status; did promotion write
only the approved, validated, non-sensitive set; and can a cold reader use the baseline without the
startup record. Each family carries a `### {ID}` heading, a **Category**, the **Situation** it arises
in, the **Good** outcome, the **Bad / failure** outcome, one **Adversarial** case a real evaluator
would probe, and the **Checklist IDs** whose joint satisfaction proves the scenario handled. Scenario
IDs follow `STARTUP-{PERSPECTIVE}-SCENARIO-{NN}`; each check follows `{scenario-id}-CHECK-{NN}` and
lives in `checklist.md`.

---

## Project
_Lens (see `evaluation.md`):_ is this the **right project baseline**, with complete, substantive coverage and user-owned intent?

### STARTUP-PROJ-SCENARIO-01 — Required topic coverage is complete and substantive
**Category:** golden-path
**Situation:** the ledger claims the first-run traversal closed all 11 Level-1 topics and all 46 required Level-2 branches.
**Good:** every Level-1 checkpoint is user-confirmed; every required branch appears exactly once in the closure register as `confirmed`, `proven-irrelevant` with a reason, or `recorded-open` with an owner and resolution method; a confirmed load-bearing answer carries the evidence tuple its branch requires — source / actor, concrete event or observed state, date / time window, behavior, consequence, and claim status — rather than only echoing the prompt or restating it fluently.
**Bad / failure:** a required branch is absent, duplicated, closed without its required reason or owner, or marked confirmed from an answer missing its evidence tuple — whether a one-word answer such as "developers", "fast", or "standard", or a polished paragraph that names no behavior.
**Adversarial:** the coverage count is 46/46, but a load-bearing answer stamped `confirmed` is a fluent, evidence-free paragraph ("our users are time-pressed developers who deeply value speed and will adopt this because it fits their workflow") — it reads complete and names zero past behavior, so it FAILS the evidence-tuple check the same as a one-word answer.
**Checklist IDs:** `STARTUP-PROJ-SCENARIO-01-CHECK-*`

### STARTUP-PROJ-SCENARIO-02 — Product intent constrains architecture and stack
**Category:** failure-mode
**Situation:** Topics 7-9 record system and quality directions after Topics 2-5 establish users, outcomes, boundary, capabilities, and journeys.
**Good:** Topics 2-5 were confirmed before any future architecture or stack direction was locked; each system direction names the specific confirmed upstream branch — user, outcome, boundary, capability, or journey — it derives from, not a bare "follows from product intent"; any later technical answer that conflicts with product intent re-opened the earliest affected branch and recorded the resolution.
**Bad / failure:** architecture or stack was chosen before users and outcomes, then used to narrow users, scope, value-features, or journeys after the fact (architecture-before-users).
**Adversarial:** a plausible architecture decision cites only a technology preference; it silently changes the target user or outcome while every individual topic checkpoint still reads as internally complete.
**Checklist IDs:** `STARTUP-PROJ-SCENARIO-02-CHECK-*`

### STARTUP-PROJ-SCENARIO-03 — Design-bearing directions are researched and user-decided
**Category:** golden-path
**Situation:** a design-bearing branch selects or changes a product, architecture, stack, convention, quality, or roadmap direction.
**Good:** the branch has a decision brief with internal and external prior art, at least one source directly supporting each load-bearing rationale (with each source's applicability and constraint stated), genuinely distinct alternatives, a recommendation that names the recommended option first, an evidence-to-change, the user's chosen direction and rationale, and the rejected alternatives; the recorded direction stays at direction altitude rather than inventing mechanism.
**Bad / failure:** the manager records the user's first preference as settled, fabricates a citation, presents no recommendation, or designs detailed interfaces, algorithms, schemas, or a task breakdown during startup.
**Adversarial:** a hard-to-reverse choice looks well reasoned but has no rejected alternative and no user-decision record, so a bare preference is dressed as a reference-informed decision.
**Checklist IDs:** `STARTUP-PROJ-SCENARIO-03-CHECK-*`

### STARTUP-PROJ-SCENARIO-04 — License, distribution, governance, and authority are explicit
**Category:** coverage-matrix
**Situation:** Topic 1.4 must close even when the project is internal or has no external distribution.
**Good:** Topic 1.4 records a verified license / distribution / governance answer, or the confirmed internal `not applicable` statement with a reason; the actual repository evidence and the recorded decision authority support the claim; any unresolved legal or governance constraint has an owner and resolution method.
**Bad / failure:** Topic 1.4 is missing, silently skipped, guessed, or decided by someone without the recorded authority (missing-license).
**Adversarial:** the baseline confidently says "MIT" because that is common, but no license file, user confirmation, or authorized decision supports it.
**Checklist IDs:** `STARTUP-PROJ-SCENARIO-04-CHECK-*`

### STARTUP-PROJ-SCENARIO-05 — The load-bearing problem is grounded in behavioral evidence
**Category:** golden-path
**Situation:** the baseline promotes a problem as `confirmed` and later loops will build design on it.
**Good:** the load-bearing problem is grounded in a concrete last instance with past behavior — a workaround built, effort / time / money already spent, or a repeated struggle — for a named user at a stated recurrence.
**Bad / failure:** the problem rests on stated interest, "users would love this", a compliment, or a hypothetical, with no past behavior.
**Adversarial:** a fluent, evidence-free paragraph ("our users are time-pressed developers who deeply value speed and will adopt this because it fits their workflow") is stamped `confirmed` — it reads complete and names zero past behavior, so it FAILS the same as a one-word answer.
**Checklist IDs:** `STARTUP-PROJ-SCENARIO-05-CHECK-*`

### STARTUP-PROJ-SCENARIO-06 — One first user and their job are clear
**Category:** golden-path
**Situation:** the baseline records who the project serves and the job they hire it for.
**Good:** one named first user / segment with a concrete job (situation → motivation → outcome), the current alternative, and at least one switching force (anxiety / habit); distinct roles (user / operator / approver / affected) are separated where they exist.
**Bad / failure:** "everyone", a whole category, or a vague persona; a "job" that is really a feature list; no current alternative recorded.
**Adversarial:** the user is named, but the job is a feature list and no current alternative or switching force is recorded — so nothing shows the user would actually change behavior.
**Checklist IDs:** `STARTUP-PROJ-SCENARIO-06-CHECK-*`

### STARTUP-PROJ-SCENARIO-07 — The product shape is solved, bounded, and traceable
**Category:** failure-mode
**Situation:** the baseline shapes a product direction the later loops will design against.
**Good:** the shaped direction is solved at the macro level (elements, critical journeys, failure paths, and boundary connect), rough at the detail level (no mechanism), and bounded (explicit non-goals); each direction traces to a confirmed user / problem constraint and a studied reference.
**Bad / failure:** the shape is vague (elements don't connect), OR it dives into mechanism (interface signatures, schemas, algorithms, task breakdown), OR a capability has no traceable user / problem reason.
**Adversarial:** every topic checkpoint reads internally complete, but the shape doesn't hang together — the boundary excludes a capability the primary journey needs, or a "feature" serves no recorded user job.
**Checklist IDs:** `STARTUP-PROJ-SCENARIO-07-CHECK-*`

---

## Structure
_Lens (see `evaluation.md`):_ is the baseline decomposed into atomic records, deterministic destinations, durable value-features, and sound dependency / operational directions?

### STARTUP-STRUCT-SCENARIO-01 — Records are atomic and match their memory types
**Category:** golden-path
**Situation:** the staged and promoted sets contain decisions, designs, references, rules, mistakes, learnings, scenarios, checklists, backlogs, and living indexes.
**Good:** each typed record holds one durable concept, follows its type's section contract, and carries a subject-named slug; one answer may create several atomic records, but no record bundles unrelated concepts.
**Bad / failure:** a "startup context" document bundles vision, stack, risks, rules, and roadmap, or a single decision record carries unrelated binding choices.
**Adversarial:** a record looks atomic from its title but combines a license decision and a stack decision in its body, making later supersession impossible at the right granularity.
**Checklist IDs:** `STARTUP-STRUCT-SCENARIO-01-CHECK-*`

### STARTUP-STRUCT-SCENARIO-02 — Routing and frontmatter are deterministic
**Category:** failure-mode
**Situation:** every staged typed record is mapped through the promotion manifest to an exact durable destination.
**Good:** each staged source has one manifest row and one deterministic destination; type, scope, per-file feature, allowed area, slug, and filename validate; staging-only fields are stripped and durable base / type fields survive; an unresolvable area or a collision halted for a user decision.
**Bad / failure:** a free-form area is invented, a staged record has no manifest row, two sources target one destination, or a staging-only routing field survives promotion.
**Adversarial:** a plausible off-table destination passes link checks and frontmatter parsing, but it was improvised rather than resolved by the staging-to-destination contract.
**Checklist IDs:** `STARTUP-STRUCT-SCENARIO-02-CHECK-*`

### STARTUP-STRUCT-SCENARIO-03 — Feature directories represent durable user value
**Category:** failure-mode
**Situation:** startup creates or updates `features/{feature-name}/` directories and feature indexes.
**Good:** each new feature directory maps to a user-ratified durable capability with an enduring value proposition, and each feature-scoped record carries the correct per-file feature target.
**Bad / failure:** a feature directory is created for a task, sprint, epic, subsystem, speculative idea, or internal mechanism (feature-dir-for-a-task).
**Adversarial:** a one-time migration task receives a polished user-facing name and is promoted as a feature even though no user receives enduring value from that directory's capability.
**Checklist IDs:** `STARTUP-STRUCT-SCENARIO-03-CHECK-*`

### STARTUP-STRUCT-SCENARIO-04 — Dependency and operational structure is explicit or proven irrelevant
**Category:** coverage-matrix
**Situation:** Topics 7-9 may establish dependency, supply-chain, trust-boundary, runtime, observability, and ownership directions.
**Good:** dependency choices name the source, version / constraint, license / approval status, failure fallback, and structural impact where applicable; system boundaries and data flow are coherent; logs, metrics, traces, alerts, runbooks, and ownership are recorded or the branch is proven irrelevant with a reason.
**Bad / failure:** an essential dependency is accepted from an untrusted source, its graph impact is absent, or an operationally important component has no diagnostic or ownership direction.
**Adversarial:** a dependency looks harmless because it is already popular, but its version, license, failure mode, and authority are absent while the architecture assumes it will always be available.
**Checklist IDs:** `STARTUP-STRUCT-SCENARIO-04-CHECK-*`

### STARTUP-STRUCT-SCENARIO-05 — The shaped direction is feasible to build and sustainable to run
**Category:** failure-mode
**Situation:** the baseline commits to a product direction the team must actually build and operate across its life.
**Good:** the shaped direction is buildable with the available skills, dependencies, and constraints (each essential dependency names source / version / approval / failure-fallback), and is sustainable to run across its intended life — capacity, ownership, failure-recovery, and upkeep are named or proven irrelevant.
**Bad / failure:** the direction assumes skills or dependencies the team does not have and cannot get; an essential component has no owner, no failure-recovery, and no upkeep plan; a continuously-running capability has no capacity or diagnostic direction.
**Adversarial:** the product shape is elegant and internally coherent, but it depends on a capability no one on the team can build or maintain, or on a dependency with no fallback — sound on paper, un-buildable / un-sustainable in practice, while every topic checkpoint still reads complete.
**Checklist IDs:** `STARTUP-STRUCT-SCENARIO-05-CHECK-*`

---

## Performance
_Lens (see `evaluation.md`):_ are interview depth, baseline size, cost, and operational budgets proportional without dropping mandatory coverage?

### STARTUP-PERF-SCENARIO-01 — Interview depth follows uncertainty and risk
**Category:** golden-path
**Situation:** all 46 branches are mandatory, but existing evidence and design risk vary by branch.
**Good:** verified low-risk facts smart-skip only with cited evidence and user confirmation; vague answers receive up to two concrete probes before becoming recorded-open; every design-bearing choice is classified by uncertainty × reversibility × magnitude, and irreversible or high-magnitude choices carry a premise, a distinct alternative, a disconfirmation test, and an evidence-to-change; checkpoint markers keep pause / resume bounded.
**Bad / failure:** the run mechanically asks 2-4 questions for every branch, or rushes every branch into one shallow answer to reduce turn count.
**Adversarial:** the run is short because required branches were nominally closed, but an irreversible architecture choice received no more scrutiny than a verified repository fact.
**Checklist IDs:** `STARTUP-PERF-SCENARIO-01-CHECK-*`

### STARTUP-PERF-SCENARIO-02 — Baseline size matches durable information value
**Category:** failure-mode
**Situation:** the completed run produces a set of atomic records plus root and feature living indexes.
**Good:** each durable concept maps to exactly one authoritative record and each record to one concept — no duplicate authority and no multi-concept bundle, with word count diagnostic only; records are concise and zero-context; no raw audit, transcript, ledger, manifest, research note, or scratch thought is promoted as memory.
**Bad / failure:** startup produces one memory file per scratch thought, a few oversized transcript-like bundles, or promotes record-level audit material.
**Adversarial:** every file is individually within a reasonable line bound, but the aggregate baseline far exceeds the information learned because one concept was fragmented across many tiny records.
**Checklist IDs:** `STARTUP-PERF-SCENARIO-02-CHECK-*`

### STARTUP-PERF-SCENARIO-03 — READMEs are indexes and budgets are explicit
**Category:** coverage-matrix
**Situation:** the root and feature READMEs summarize the baseline, while quality, capacity, cost, and error-budget directions live in typed records.
**Good:** each README summarizes and points to typed records without restating their bodies; recurring token / API / infra / storage costs, scale assumptions, quality thresholds, and error-budget or availability impact are recorded with an estimate or a proven-irrelevant rationale.
**Bad / failure:** a README duplicates full design / decision bodies (README-duplicating-memory), or a recurring cost and error-budget commitment is omitted or dismissed as "should be fine".
**Adversarial:** changing one typed-record fact would require a second authoritative prose edit in the README, revealing a duplication that doubles future-session load and creates drift.
**Checklist IDs:** `STARTUP-PERF-SCENARIO-03-CHECK-*`

---

## Aesthetics
_Lens (see `evaluation.md`):_ is the durable baseline readable, template-conformant, self-evident, and free of record-level coordinates or filler?

### STARTUP-AESTH-SCENARIO-01 — A cold reader can understand every promoted record
**Category:** golden-path
**Situation:** a later agent reads promoted memory without the startup transcript, ledger, or topic tree.
**Good:** each record states its durable concept at the top, follows its type's section order, uses plain literal language, defines non-obvious terms, and stands alone without session context; the root README makes the project's identity clear on first read.
**Bad / failure:** a record requires the talk to make sense, hides its point under session narrative, or uses placeholder prose.
**Adversarial:** polished prose still depends on an unstated interview fact, so it feels complete to the author but loses meaning when `sessions/.../startup/` is unavailable.
**Checklist IDs:** `STARTUP-AESTH-SCENARIO-01-CHECK-*`

### STARTUP-AESTH-SCENARIO-02 — Names, headings, and pointers are stable
**Category:** coverage-matrix
**Situation:** staged and promoted records use slugs, headings, internal links, and cross-record pointers.
**Good:** titles and slugs name durable concepts rather than topics or checkpoints; typed docs and living indexes match the established section order; no `TBD`, `TODO`, `???`, unfinished sentence, or load-bearing topic / ledger / checkpoint coordinate remains; all pointers resolve.
**Bad / failure:** a file is named `topic-7-decision.md`, a body says "per checkpoint 3", a required section is empty, or a pointer dangles.
**Adversarial:** the document is scannable and well formatted, but its slug and first heading encode only the startup interview position, making it inaccessible to a cold agent and unstable across reruns.
**Checklist IDs:** `STARTUP-AESTH-SCENARIO-02-CHECK-*`

---

## Usage
_Lens (see `evaluation.md`):_ can later loops, later sessions, users, and operators act from the baseline without reconstructing the startup talk?

### STARTUP-USAGE-SCENARIO-01 — Downstream loops can start from the baseline safely
**Category:** golden-path
**Situation:** Ideation and Preparation load the promoted baseline after startup closes.
**Good:** the README plus the typed records answer what the project is, who it serves, its boundary, value-features, decided directions, constraints, risks, and evidence; decided directions are distinguishable from open mechanism questions; every recorded-open item has an owner, a resolution method, and a trigger or next action.
**Bad / failure:** the next loop must re-ask a startup question, or an open item says only `TBD` / "figure it out later" with no owner or resolution path.
**Adversarial:** simulate a cold Ideation start with no startup record; the agent cannot tell whether an architecture direction is locked or an unresolved mechanism, and must re-litigate a settled decision.
**Checklist IDs:** `STARTUP-USAGE-SCENARIO-01-CHECK-*`

### STARTUP-USAGE-SCENARIO-02 — Resume, rerun, and completion states are usable
**Category:** failure-mode
**Situation:** startup may be interrupted, resumed in the live session, or invoked later against an established baseline.
**Good:** the ledger has stable answer IDs and confirmed Level-1 checkpoint markers; resume regenerates staged drafts from the current event set and continues from the first unconfirmed checkpoint; a rerun classifies each output as unchanged, living-index update, new, superseding, or deferred / open; the summary records live-session completion and rerun triggers without pretending to be cross-session durable evidence.
**Bad / failure:** resume replays confirmed questions, a rerun blind-appends over current memory, or a later session relies on the gitignored startup summary as proof of validity.
**Adversarial:** the live-session summary says complete, but durable memory lacks the required root index or typed records, so a later classifier would wrongly infer completion if it trusted the summary.
**Checklist IDs:** `STARTUP-USAGE-SCENARIO-02-CHECK-*`

### STARTUP-USAGE-SCENARIO-03 — Human and operator quality needs are represented
**Category:** coverage-matrix
**Situation:** Topics 5-9 establish critical journeys, interaction direction, accessibility, internationalization, failure experience, and operational diagnostics.
**Good:** accessibility and internationalization needs are recorded as directions / scenarios or proven irrelevant with reasons; terms avoid unexplained idiom and culture-bound metaphor; failure messages or interfaces name a recovery action; operators have the logs / signals / pointers needed to diagnose a failure at 3am.
**Bad / failure:** a user-facing or agent-facing surface has no accessibility / i18n treatment, or an operator-facing failure has no diagnostic and recovery direction.
**Adversarial:** the baseline is readable to its author but uses locale-specific assumptions and provides no recovery / diagnostic path for the operator who must act without the original author.
**Checklist IDs:** `STARTUP-USAGE-SCENARIO-03-CHECK-*`

---

## Consistency
_Lens (see `evaluation.md`):_ do topic answers, claim status, decisions, staging, manifest, promoted memory, indexes, and summary tell one coherent story?

### STARTUP-CONS-SCENARIO-01 — Cross-topic contradictions are resolved
**Category:** failure-mode
**Situation:** later topics test and may contradict earlier product, data, quality, risk, or roadmap decisions.
**Good:** the §7 contradiction pass explicitly checks vision vs scope, users vs journeys, non-goals vs roadmap, quality vs stack, data promises vs architecture, risk mitigations vs schedule / capacity, and binding rules vs live examples; each contradiction re-opens the earliest owning branch and records the authority and resolution, or remains recorded-open with an owner.
**Bad / failure:** two baseline claims conflict, or synthesis hides the conflict by choosing one without a ledger resolution (cross-topic-contradiction).
**Adversarial:** the non-goals exclude a capability that appears in "now", or the data-deletion promise cannot be met by the chosen architecture, while each individual record remains plausible in isolation.
**Checklist IDs:** `STARTUP-CONS-SCENARIO-01-CHECK-*`

### STARTUP-CONS-SCENARIO-02 — Claim kind and evidence status survive promotion
**Category:** failure-mode
**Situation:** the ledger distinguishes observed fact, user intent, forecast, preference, decision, and open question, with a separate evidence status.
**Good:** promoted prose preserves those distinctions; verified facts cite evidence, user intent is presented as intent, and assumptions / open claims stay qualified or recorded-open; no load-bearing claim becomes stronger during synthesis.
**Bad / failure:** an unverified market, scale, security, license, or operational claim is promoted as an unqualified confirmed fact (unverified-claim-promoted).
**Adversarial:** a plausible load-bearing forecast is rewritten into the present tense during synthesis, so readers treat it as observed reality even though the ledger marks it `unverified`.
**Checklist IDs:** `STARTUP-CONS-SCENARIO-02-CHECK-*`

### STARTUP-CONS-SCENARIO-03 — The full baseline set traces one-to-one
**Category:** coverage-matrix
**Situation:** each promoted claim and destination should trace through the completed baseline set.
**Good:** sampled claims trace memory → manifest row → staged source → ledger answer / decision → evidence or decision brief; every staged candidate and every actual memory change has exactly one manifest disposition; README pointers and summary promoted paths match the actual delta; unchanged records were not rewritten; supersessions carry paired links and archive moves.
**Bad / failure:** a promoted claim has no source evidence, a staged candidate disappears, an unlisted memory change appears, or summary / index paths disagree with the promoted set.
**Adversarial:** the manifest and summary agree with each other, but both omit a real staged file or actual memory edit, so an internal two-document comparison falsely passes.
**Checklist IDs:** `STARTUP-CONS-SCENARIO-03-CHECK-*`

---

## Risk
_Lens (see `evaluation.md`):_ what breaks if the baseline is wrong — leaked data, unsupported authority, memory corruption, irrecoverable promotion, or premature validity?

### STARTUP-RISK-SCENARIO-01 — Secrets and sensitive values never cross into durable output
**Category:** failure-mode
**Situation:** the raw log and ledger may hold credentials, private URLs, PII, customer data, or user-marked sensitive values.
**Good:** sensitive values remain record-level and are stripped or safely generalized in every staged candidate, living-index candidate, summary, evaluation-evidence file, and promoted destination; the secret scan covers sources and destinations rather than relying only on the ledger flag.
**Bad / failure:** a secret, credential, personal datum, customer name, private URL, or user-marked sensitive value reaches promoted memory or evaluation evidence (promoted-secret).
**Adversarial:** a user-marked sensitive token survives inside an otherwise valid decision record and is absorbed by the standalone commit, because the scan covered only typed fields, not prose and indexes.
**Checklist IDs:** `STARTUP-RISK-SCENARIO-01-CHECK-*`

### STARTUP-RISK-SCENARIO-02 — License, authority, binding-rule, and prior-art use are safe
**Category:** coverage-matrix
**Situation:** startup records license / governance and binding-rule decisions and uses external prior art for design-bearing choices.
**Good:** repository evidence supports the license claim; the deciding person has recorded authority; every promoted binding rule has explicit user confirmation of its invariant, scope, reason, and genuine exception; borrowed code / content / patterns are identifiable and license-compatible where applicable; essential dependencies have trusted sources and approval; an unresolved compliance issue blocks validity or stays owned rather than being guessed.
**Bad / failure:** license is omitted or fabricated, a preference is hardened into a binding rule with no user confirmation, prior art is copied without compatible terms, or an unauthorized person settles a binding legal / security direction.
**Adversarial:** a cited reference supports the design idea but its code / content license does not permit the intended reuse, and the baseline records the choice without checking the distinction between learning from and copying it.
**Checklist IDs:** `STARTUP-RISK-SCENARIO-02-CHECK-*`

### STARTUP-RISK-SCENARIO-03 — Promotion is approved, bounded, and collision-safe
**Category:** failure-mode
**Situation:** P5 validates and approves the whole manifest before P6 performs any memory mutation.
**Good:** every candidate validates before the first write; the final Always-Ask approval covers the exact destinations and operations; each mutation rechecks its recorded preimage; every actual memory change is listed; a create collision halts or becomes an explicit supersession; no memory changed before validation and approval.
**Bad / failure:** memory changes before the gate, an unlisted or colliding destination is overwritten, or a concurrent edit is clobbered after a stale P5 preimage.
**Adversarial:** the manifest was valid at P5, but a user edit landed before P6; promotion writes anyway because no per-mutation TOCTOU recheck enforced the preimage.
**Checklist IDs:** `STARTUP-RISK-SCENARIO-03-CHECK-*`

### STARTUP-RISK-SCENARIO-04 — Promotion finishes in a verified, recoverable state
**Category:** failure-mode
**Situation:** P6 writes typed records, supersessions, archive moves, and indexes, then verifies destinations and runs standing guards.
**Good:** exact destinations and expected content verify; supersession links and archive moves pair; indexes update last and their pointers resolve; all standing guards pass; promotion is complete or fully rolled back, with any partial state routed through the Always-Ask recovery contract.
**Bad / failure:** promotion is partial or unverified, a guard is red, an index points to a missing record, or recovery deletes or overwrites pre-existing memory outside the narrow carve-out.
**Adversarial:** the root README makes the baseline appear complete while a typed-record write or an archive move failed earlier, and the summary hides the partial state.
**Checklist IDs:** `STARTUP-RISK-SCENARIO-04-CHECK-*`

### STARTUP-RISK-SCENARIO-05 — P6.5 gates validity and records cost / error-risk commitments
**Category:** coverage-matrix
**Situation:** two fresh evaluators review the frozen promoted baseline after the guards and before P7; the baseline may also encode recurring-cost, error-budget, rollback, and irreversible commitments.
**Good:** both systems produce all nine evaluation files; the manager reconciles their verdicts; `PASS` alone permits P7 and `baseline_valid: true`; `REVISE` returns to the earliest owning phase and `FAIL` halts; cost / error-budget / rollback / irreversibility risks are recorded with limits or proven-irrelevant reasons.
**Bad / failure:** `baseline_valid: true` is set before exact verification and P6.5 PASS, one evaluator is missing, a divergence is ignored, or a cost / error-risk commitment has no bound or recovery direction.
**Adversarial:** the summary is stamped valid after only one system passes, while the other system is absent or has a Critical finding; a superficially complete baseline enters later loops without the anti-groupthink gate.
**Checklist IDs:** `STARTUP-RISK-SCENARIO-05-CHECK-*`

### STARTUP-RISK-SCENARIO-06 — Load-bearing design claims are evidenced or fail
**Category:** failure-mode
**Situation:** the baseline carries load-bearing claims across problem reality, user clarity, product-shape soundness, and feasibility & sustainability that later loops will trust.
**Good:** every load-bearing design claim across the four substance dimensions is either evidenced to its standard or `recorded-open` with an owner; none is a bare assertion; no fabricated citation and no laundered `n/a`.
**Bad / failure:** a load-bearing design claim is un-evidenced, un-owned, and not proven-irrelevant (drives REVISE); a fabricated citation, a silently-strengthened claim status, or an `n/a` with no genuine claim-specific reason (drives FAIL).
**Adversarial:** the baseline is fully covered, atomic, secret-free, and traceable, yet its core problem / user / product-shape / feasibility claims have no behavioral or verified evidence — process-perfect, substance-hollow.
**Checklist IDs:** `STARTUP-RISK-SCENARIO-06-CHECK-*`
