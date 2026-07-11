# Ideation Loop — Evaluation Scenarios

Per-perspective GOOD / BAD / ADVERSARIAL discrimination scenarios for an Ideation Loop's
working draft. The evaluator loads this file at Stage 1 (Scenario-Checklist Frame Build) as
seed scenarios for the seven perspectives.

The evaluation **procedure** — the per-perspective lens definitions, recommended
verifications, perspective anti-patterns, and Overall (Stage 3) anchors — lives in the
sibling `evaluation.md`. The concrete yes/no **checks** each scenario references live 1:1 in
the sibling `checklist.md`, whose heading tree mirrors this file exactly.

The artifact under evaluation is **the Ideation working draft**
(`sessions/{date}-{session-id}/1-ideation/working/draft-iter{n}.md`): its Scope Contract,
Framed Problem, Research Insights, Scenarios, Implementation Checklist, and Design section.
Ideation is a **process loop** — the artifact is an idea, not code — so every family below
judges **idea quality**: is the problem framed at its root cause, is the scope enumerable and
refusable, is every design direction anchored to a confirmed reference, and can the next
consumer act on the draft alone. Each family carries a `### {ID}` heading, a **Category**, the
**Situation** it arises in, the **Good** outcome, the **Bad / failure** outcome, one
**Adversarial** case a real evaluator would probe, and the **Checklist IDs** whose joint
satisfaction proves the scenario handled. Scenario IDs follow `IDEA-{PERSPECTIVE}-SCENARIO-{NN}`;
each check follows `{scenario-id}-CHECK-{NN}` and lives in `checklist.md`.

---

## Project
_Lens (see `evaluation.md`):_ does the idea solve the **right** problem, inside the locked Scope Contract?

### IDEA-PROJ-SCENARIO-01 — Root cause, not a symptom
**Category:** golden-path
**Situation:** the draft's Framed Problem states a cause and the Design section proposes to address it.
**Good:** the "Why?" chain terminates at a cause that, if absent, would obviate the work; prior attempts (or a confirmed "None on record") are documented; the Design section solves the same problem the Framed Problem states.
**Bad / failure:** a visible symptom is accepted as the root cause, so the design treats a surface effect while the underlying cause stays live.
**Adversarial:** the Design section quietly solves a different, adjacent problem than the one framed, while reading as though it addresses the stated one — a framing-vs-design drift no single section reveals.
**Checklist IDs:** `IDEA-PROJ-SCENARIO-01-CHECK-*`

### IDEA-PROJ-SCENARIO-02 — Scope Contract is enumerated and refusable
**Category:** golden-path
**Situation:** the draft carries a Scope Contract and Sub-step B produced deferred candidates.
**Good:** the contract names explicit, non-overlapping Project / Feature / Task boundaries; every non-chosen candidate from Sub-step B has a backlog routing; no "etc." or "and related" phrasing softens the In-Scope / Out-of-Scope / Deferred enumeration.
**Bad / failure:** open-ended phrasing ("and related work", "etc.") leaves the boundary soft enough that a downstream agent cannot tell what to refuse.
**Adversarial:** an existing feature's scope silently overlaps the idea, and the overlap is never surfaced — so the same work is authorized in two places and the split is deferred, not decided.
**Checklist IDs:** `IDEA-PROJ-SCENARIO-02-CHECK-*`

### IDEA-PROJ-SCENARIO-03 — Trigger, success criteria, and counterfactual are concrete
**Category:** failure-mode
**Situation:** the draft states why the work is happening now and why the chosen approach beats doing nothing.
**Good:** the trigger (a specific failure / request / deadline / opportunity) is named with a concrete reference; success criteria are observable pass/fail from artifacts, not vibes; the counterfactual presents the strongest "do nothing" argument and states why it was rejected with evidence; the re-framing check recorded a confirmed re-frame or a defensible "no change".
**Bad / failure:** the "Why now?" answer is generic ("it would be nice to have"), success criteria are unobservable, or the re-framing check is skipped.
**Adversarial:** the counterfactual is strawmanned — a weak "do nothing" the creator already beat is presented as the steel-man, so the decision looks stress-tested but never was.
**Checklist IDs:** `IDEA-PROJ-SCENARIO-03-CHECK-*`

### IDEA-PROJ-SCENARIO-04 — Load-bearing premises and prior art are grounded
**Category:** failure-mode
**Situation:** the idea rests on premises ("this will be adopted", "the cost stays bounded") and claims prior art was searched.
**Good:** each load-bearing assumption is named and tagged "if this is wrong, the design fails", and either cites supporting evidence or is surfaced as `assumption_risk`; the design names an observable signal that would confirm the idea worked and one that would falsify it; prior-art search ran across memory, codebase, adjacent work, and the community, with negative results recorded so absence of citation is auditable.
**Bad / failure:** a risky premise is buried in prose with no ledger entry, or "prior art" is asserted nominally ("we did it differently before") without a real search.
**Adversarial:** a premise the whole design depends on is stated as settled fact with no falsifiability signal, so an unproven assumption reads as a decided conclusion and passes review unchallenged.
**Checklist IDs:** `IDEA-PROJ-SCENARIO-04-CHECK-*`

---

## Structure
_Lens (see `evaluation.md`):_ is the idea's **organizing decomposition** sound, boring-by-default, maintainable, and testable?

### IDEA-STRUCT-SCENARIO-01 — Decomposition coheres and is boring-by-default
**Category:** golden-path
**Situation:** the Design section proposes components / modules / layers and the choices between them.
**Good:** each proposed component owns one named concern with coupling in one direction (no circular dependency in the decomposition); alternatives considered are documented or "no alternatives" is explicitly justified.
**Bad / failure:** two components share a concern with no clear owner, or coupling runs both directions between them.
**Adversarial:** a novel structural pattern is introduced where an existing project pattern already fits, spending an innovation token with no rationale — novelty dressed as necessity.
**Checklist IDs:** `IDEA-STRUCT-SCENARIO-01-CHECK-*`

### IDEA-STRUCT-SCENARIO-02 — Design direction is concrete and maintainable
**Category:** golden-path
**Situation:** the Design section commits to directional decisions the Planner and Executor will build on.
**Good:** each directional decision names the library / framework / design pattern / API shape explicitly; each has rationale anchored to a specific research insight; every element matches an existing project pattern or its deviation is justified; non-obvious terms are defined inline or by reference (two-week smell test).
**Bad / failure:** a decision is stated at slogan level ("use a clean pattern") with no named pattern or anchoring insight, so nothing concrete carries into Planning.
**Adversarial:** a "magic" component appears that names no library / pattern / API shape and matches no existing project pattern, so a maintainer returning in two weeks cannot map it to anything and the design reads coherent only to its author.
**Checklist IDs:** `IDEA-STRUCT-SCENARIO-02-CHECK-*`

### IDEA-STRUCT-SCENARIO-03 — Testability and acyclic data flow
**Category:** failure-mode
**Situation:** the design implies data flow between components and defers implementation to Execution.
**Good:** testability hooks are identified — what gets stubbed / faked / observed for verification; a verification approach is named per major component; cross-module data flow is traced and confirmed acyclic.
**Bad / failure:** testability is deferred wholesale to implementation, or the data-flow direction is left implicit.
**Adversarial:** the decomposition adds a "manager" / "coordinator" that touches every component — a shared-state hub the diagram reads as a clean center while it quietly couples everything through one node.
**Checklist IDs:** `IDEA-STRUCT-SCENARIO-03-CHECK-*`

---

## Performance
_Lens (see `evaluation.md`):_ are there **efficiency, resource, or scalability** risks the idea must address now rather than defer blindly?

### IDEA-PERF-SCENARIO-01 — Scale, dominant cost, and limits are stated
**Category:** golden-path
**Situation:** the idea operates over data or requests whose volume affects the approach.
**Good:** the expected request / operation rate is stated, not implicit, with order-of-magnitude / growth reasoning where scale matters; the dominant cost (compute / IO / memory / network) is identified and the external-call pattern is characterized (how many calls, whether they batch, and how the design behaves when an external call fails or is slow); caching / memoization is an explicit yes / no / deferred-with-reason; the point at which the approach stops applying is named, with any latency / throughput / memory budget stated.
**Bad / failure:** scale is waved off as "should be fine" with no order-of-magnitude reasoning, so the design commits to an approach whose breaking point is unknown.
**Adversarial:** a reasonable-looking design names no scale bound at all, so a volume that quietly exceeds the unstated assumption is discovered only after Execution commits to the approach.
**Checklist IDs:** `IDEA-PERF-SCENARIO-01-CHECK-*`

### IDEA-PERF-SCENARIO-02 — Hot paths carry a measurement commitment
**Category:** failure-mode
**Situation:** the idea has paths whose cost will matter under real volume.
**Good:** each hot path has a measurement strategy committed for the Execution loop; there is no silent assumption that "the framework will handle it".
**Bad / failure:** a hot path is flagged but no measurement is committed, so Execution inherits a performance claim with no way to check it.
**Adversarial:** a loop over a potentially-large collection hides a per-item external call — or a nested / recursive structure hides a combinatorial blow-up — that small-scale reasoning never surfaces, and the design defers it to Execution with no measurement plan.
**Checklist IDs:** `IDEA-PERF-SCENARIO-02-CHECK-*`

---

## Aesthetics
_Lens (see `evaluation.md`):_ is the **draft document itself** readable, self-evident, convention-matched, and free of filler? (For Ideation, "aesthetics" is the draft, not any downstream UI.)

### IDEA-AESTH-SCENARIO-01 — Draft is self-evident and convention-matched
**Category:** golden-path
**Situation:** a new reader opens the draft cold, without the leader's transcripts.
**Good:** "what is this proposing?" is answerable from the first page (Krug self-evidence); section ordering and heading style match prior Ideation drafts in this project; frontmatter, where applicable, is complete.
**Bad / failure:** the draft can only be understood by someone who sat in the discussion, or its section structure diverges from the project's Ideation-draft convention.
**Adversarial:** a heading or first-paragraph claim overstates the section that follows, so a reader skimming the draft walks away with a wrong impression while each section reads fine read in full.
**Checklist IDs:** `IDEA-AESTH-SCENARIO-01-CHECK-*`

### IDEA-AESTH-SCENARIO-02 — Names are liftable, stable, and no section is filler
**Category:** failure-mode
**Situation:** the draft names proposed components and carries several prose sections.
**Good:** names for proposed components / functions / paths are concrete enough that a Planner could lift them directly, and one concept does not appear under two names; there is no placeholder text (`TBD`, `TODO`, `...`, "see below" with no below); no paragraph could be deleted without losing information (Rams); conclusions are supported by the artifact's own evidence, not waved at.
**Bad / failure:** proposed names are vague enough that the Planner must invent replacements, the same concept carries two names, or a placeholder marker is left in the draft.
**Adversarial:** a section reads as substantive but restates an earlier one with no new information — filler that survives review because each sentence is individually well-written.
**Checklist IDs:** `IDEA-AESTH-SCENARIO-02-CHECK-*`

---

## Usage
_Lens (see `evaluation.md`):_ for the **next consumer** — the Planner who decomposes it, the Executor who implements it, the future-self who maintains it — is the artifact usable?

### IDEA-USAGE-SCENARIO-01 — Planner and Executor can act without re-asking the user
**Category:** golden-path
**Situation:** the draft is handed to Planning to decompose into tasks.
**Good:** every directional design decision has enough specificity to start implementation (no "we'll figure out the library later"); scenarios are concrete enough for Planning to map them to tasks 1:1; every scenario tells the Executor what file / module / function it concerns, target names stay stable across the document, and every cited research insight has a path / URL / reference the consumer can follow.
**Bad / failure:** a scenario is too abstract for Planning to turn into a task, a target name drifts between sections, or a cited insight has no followable reference.
**Adversarial:** a directional decision is left open ("we'll pick the approach later"), so the Planner must return to the user with the exact clarifying question the artifact existed to answer.
**Checklist IDs:** `IDEA-USAGE-SCENARIO-01-CHECK-*`

### IDEA-USAGE-SCENARIO-02 — 3am maintainer, failure modes, and diagnosability
**Category:** failure-mode
**Situation:** the idea will be maintained and debugged long after this session, and it names failure modes.
**Good:** the artifact names its consumers (Planner / Executor / future-self) and confirms each can use it, with glossary terms defined inline or by reference; each named failure mode has a corresponding implementation expectation; the design names what would log and what would alert when something goes wrong (Coverage: Observability), or declares `not-applicable: <rationale>`; a 3am maintainer has enough surface (logs / signals / paths) to identify the failing component without re-reading the whole design.
**Bad / failure:** a promised behavior has no implementation expectation behind it, or the design names no diagnostic surface for its failure paths.
**Adversarial:** a named failure mode has no matching implementation expectation, so a 3am maintainer trusts a promised recovery behavior the design cannot actually deliver.
**Checklist IDs:** `IDEA-USAGE-SCENARIO-02-CHECK-*`

### IDEA-USAGE-SCENARIO-03 — Consumer mental model and accessibility / locale coverage
**Category:** coverage-matrix
**Situation:** the idea borrows project vocabulary and may touch a user-facing surface or user-facing strings.
**Good:** terms borrowed from the project's existing vocabulary are used with the same meaning, and any overloaded term states its local meaning; if the idea affects a user-facing surface, accessibility / keyboard-nav / screen-reader needs are surfaced as scenarios (Coverage: Usage) or `not-applicable: <rationale>` is declared; if the idea introduces user-facing strings, a localization strategy is named or the monolingual-scope rationale is stated.
**Bad / failure:** a user-facing surface or string is introduced with no accessibility or localization consideration and no not-applicable rationale.
**Adversarial:** a term borrowed from the project's vocabulary is used with a subtly different local meaning, so a consumer forms the wrong mental model while every sentence reads correct in isolation.
**Checklist IDs:** `IDEA-USAGE-SCENARIO-03-CHECK-*`

---

## Consistency
_Lens (see `evaluation.md`):_ did everything that should agree inside the idea agree? Any internal contradiction, section mismatch, or drift from cited research?

### IDEA-CONS-SCENARIO-01 — Scope Contract, Framed Problem, and Design describe one problem
**Category:** golden-path
**Situation:** the draft states the problem in the Scope Contract, the Framed Problem, and the Design section.
**Good:** the Design section solves the problem the Framed Problem states, not a different one; the Scope Contract's phrasing matches between the top of the document and any later restatement.
**Bad / failure:** the three sections describe subtly different problems, so a reader cannot tell which one the work commits to.
**Adversarial:** a later restatement of the Scope Contract drifts in wording from the top-of-document version, so two sections quietly authorize different boundaries and both read plausible.
**Checklist IDs:** `IDEA-CONS-SCENARIO-01-CHECK-*`

### IDEA-CONS-SCENARIO-02 — Design decisions match the insights they cite
**Category:** golden-path
**Situation:** design decisions cite research insights, and internal and external insights coexist.
**Good:** each design choice cites specific research-insight labels that actually exist in the Research Insights section, and each cited insight actually says what the decision claims (no over-citation).
**Bad / failure:** a design decision cites an insight that does not exist in the Research Insights section, or over-claims what an insight says.
**Adversarial:** an internal and an external insight tension with each other, and the artifact silently assumes them compatible instead of stating which prevails and why.
**Checklist IDs:** `IDEA-CONS-SCENARIO-02-CHECK-*`

### IDEA-CONS-SCENARIO-03 — Scenarios, checklist, and terms align
**Category:** failure-mode
**Situation:** the draft carries both a Scenarios section and an Implementation Checklist, using shared vocabulary.
**Good:** every Implementation Checklist item is anchored to at least one scenario (or its absence is justified); every scenario has at least one checklist item that would verify it; a term used in the Scope Contract is the same term in Design.
**Bad / failure:** a checklist item anchors to no scenario, or a scenario has no checklist item that would verify it.
**Adversarial:** the same concept carries two names across sections (e.g. "the Planner" vs "the Plan agent"), so synonym drift makes coverage look complete while a scenario ships effectively unverifiable.
**Checklist IDs:** `IDEA-CONS-SCENARIO-03-CHECK-*`

---

## Risk
_Lens (see `evaluation.md`):_ **what breaks if this idea is wrong?** Blast radius, reversibility, security surface, scope drift, and the coverage-matrix risk items.

### IDEA-RISK-SCENARIO-01 — Blast radius and rollback are bounded
**Category:** golden-path
**Situation:** the idea, if implemented, changes files / consumers / interfaces and may need to be undone.
**Good:** a rollback path is stated for each irreversible step (or "no irreversible steps" confirmed) and it does not require perfect coordination across the team; the blast radius is enumerated — files / modules / consumers / external systems impacted; backwards-compat impact is stated for any external interface.
**Bad / failure:** the rollback path assumes everyone notices fast and acts in concert, or the blast radius is asserted without enumeration.
**Adversarial:** a change framed as "just a docs change" has real blast radius through `MUST load` directives and link targets it never enumerated, so the reach and the rollback are both understated.
**Checklist IDs:** `IDEA-RISK-SCENARIO-01-CHECK-*`

### IDEA-RISK-SCENARIO-02 — Security surface and irreversible steps are gated
**Category:** failure-mode
**Situation:** the idea may expand the security surface, add irreversible steps, or introduce shared mutable state.
**Good:** the security-surface delta is `none` or explicitly described (new auth boundary / data egress / untrusted-input path), and each new untrusted-input path names a validation strategy; each irreversible step (data migration / public-interface change / external write) is flagged as such with a go/no-go decision point; shared mutable state is identified (or "no shared mutable state" confirmed) with a synchronization decision named per surface.
**Bad / failure:** an irreversible step is not flagged, or a shared-state surface has no synchronization decision.
**Adversarial:** the security-surface delta is declared "none" with no check of the auth / token / data-egress paths the idea actually touches, so a new untrusted-input path ships unvalidated behind a confident "no change".
**Checklist IDs:** `IDEA-RISK-SCENARIO-02-CHECK-*`

### IDEA-RISK-SCENARIO-03 — Design stays inside the Scope Contract
**Category:** failure-mode
**Situation:** the Design section is written after the Scope Contract is locked.
**Good:** diffing the Scope Contract against the Design section surfaces no file / module mention outside the contract; any outside-scope change is re-scoped into the contract or backlogged, not silently absorbed; the Design avoids load-bearing future-self promises ("we'll improve this later") and names its maintenance burden (two-week smell test).
**Bad / failure:** the Design leans on a "we'll clean it up later" promise, or names maintenance-heavy work it does not account for.
**Adversarial:** the Design section names a file or module outside the locked Scope Contract, and the drift is neither re-scoped nor backlogged — scope creep entering through the design, not the contract.
**Checklist IDs:** `IDEA-RISK-SCENARIO-03-CHECK-*`

### IDEA-RISK-SCENARIO-04 — Privacy, license, and cost surfaces reviewed
**Category:** coverage-matrix
**Situation:** the idea may touch sensitive data, borrow external code / patterns, or introduce recurring cost.
**Good:** a new sensitive-data surface is identified (or explicit "no new sensitive data") with a retention / scrubbing strategy for anything persisted (Coverage: Privacy); borrowed code or patterns have a license verified compatible with project policy, and any decision to introduce a new external dependency names its license class (Coverage: License/IP); recurring-cost dimensions (paid API / infra / storage) are named with order-of-magnitude estimates (Coverage: Cost).
**Bad / failure:** a persisted sensitive-data surface has no retention strategy, borrowed code lands with no license check, or a recurring cost is introduced with no estimate.
**Adversarial:** a recurring paid-service or storage cost is introduced with no order-of-magnitude estimate and no runaway scenario, so a cost-runaway path ships unbounded on an axis no one priced.
**Checklist IDs:** `IDEA-RISK-SCENARIO-04-CHECK-*`
