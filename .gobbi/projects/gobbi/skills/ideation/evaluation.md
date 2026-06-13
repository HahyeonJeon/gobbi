# Ideation Loop — Evaluation Frame

Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `ideation`. Provides per-perspective **seed scenarios with attached checklists** + **recommended tool verifications** + **perspective-specific anti-patterns** for an Ideation Loop's working draft.

The artifact under evaluation is the leader's draft at `sessions/{date}-{session-id}/1-ideation/working/draft-iter{n}.md`. It contains: Scope Contract, Framed Problem (six forcing questions), Research Insights (internal + external, managed independently), Scenarios, Implementation Checklist, Design (directional decisions).

Scope Contract schema canonical at `evaluation/SKILL.md` § Scope Contract Schema.

For each perspective below, scenarios are listed in bold and each scenario carries its **attached checklist** — the concrete yes/no conditions that, if all satisfied, prove the scenario is handled. Scenarios include adversarial cases (edge / failure / attack) so Stage 2 needs no separate adversarial pass. The evaluator CRUDs both scenarios and their attached checklists at Stage 1 against the artifact's own scenario+checklist content.

---

## Project

**Lens**: Does the idea solve the **right** problem, inside the locked Scope Contract?

### Seed scenarios with attached checklists

**The root cause the artifact claims to address is the actual root cause, not a symptom**
- The "Why?" terminates at a cause that, if absent, would obviate the work
- Prior attempts (or "no prior attempts" with confirmation) are documented
- No scope drift between the framed problem and the design (Design section does not solve a different problem)

**The Scope Contract is sharp enough that an Executor can refuse out-of-scope tasks**
- Scope Contract has explicit `Project / Feature / Task` fields with non-overlapping boundaries
- Backlog routing exists for every non-chosen candidate task from Sub-step B
- No "etc." or "and related" phrasing — Scope Contract enumerates

**The "Why now?" answer is concrete (a specific failure / opportunity / deadline), not generic**
- Success criteria are measurable — pass/fail observable from artifacts, not vibes
- The trigger (failure, request, deadline, opportunity) is named with a specific reference

**The Framed Problem's counterfactual (steel-man for *not* doing this) is taken seriously, not strawmanned (adversarial)**
- The counterfactual presents the strongest "do nothing" argument, not a weak version
- The reason the counterfactual was rejected is stated with evidence

**The re-framing check (6th forcing question) produced either a confirmed re-frame or a defensible "no change"**
- Re-framing check outcome is recorded with reasoning
- If "no change" — the rationale is defensible against alternative framings

**An adjacent feature/scope absorbs this idea quietly (adversarial)**
- The idea was checked against existing feature scopes (search `.gobbi/projects/{project-name}/features/`) — no silent overlap with an active feature
- If overlap exists, the scope split or merge is explicit, not deferred

**Every risky premise has an assumption-ledger entry**
- The idea names its load-bearing assumptions explicitly (each one tagged "if this is wrong, the design fails")
- Each assumption either cites supporting evidence (research insight / prior data / experiment), or is surfaced as `assumption_risk`
- The Why / Why-now answer's premises (e.g., "users will adopt this", "the cost will be ≤ X") are each in the ledger, not hidden in prose

**Hypothesis / testability criteria are stated**
- The design names what observable signal would confirm the idea worked, and what signal would falsify it
- "Success" criteria are observation-level, not vibe-level — they survive being checked by an outsider

**Prior-art search was real, not nominal**
- Search ran across memory, codebase, adjacent libraries, and the broader community (not just "we did this differently before")
- Negative results are recorded (what was searched, what wasn't found) so absence of citation is auditable
- Top 3 closest prior arts are characterized: why each isn't a fit / where each is borrowed-from

### Recommended verifications

| Tool | Use for |
|---|---|
| `git log` / file existence | Confirm "prior attempts" claims (commits / branches / PRs the artifact cites) actually exist |
| Grep into existing memory | Confirm the framed problem is not already solved or already deferred |
| Read Scope Contract against project's `features/{feature-name}/` | Detect contract overlap with active features |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Symptom framing accepted as root cause** | Push back: the "Why" must terminate at a cause that, if absent, would obviate the work |
| **Scope Contract that uses "etc." or "and related"** | Reject — Scope Contract must enumerate. Open-ended phrasing is scope creep waiting to happen |
| **Counterfactual that the creator already won** | Steel-man failed. Re-derive counterfactual with the strongest possible "do nothing" argument |

---

## Structure

**Lens**: Is the idea's **organizing decomposition** sound? Are abstractions appropriate? Will the implementation that follows be maintainable and testable?

### Seed scenarios with attached checklists

**The proposed components / modules / layers cohere — each owns one concern, depends on one direction**
- Coupling is unidirectional — no circular dependencies in the proposed decomposition
- Each component's owning concern is named, not implied

**A skeptical reader can map every checklist item to a specific structural element**
- Directional design decisions name the **library / framework / design pattern / API shape** explicitly
- Each design decision has rationale anchored to a research insight (internal or external)

**Boring-by-default holds — no novel pattern where an existing one suffices**
- Alternatives considered are documented (or "no alternatives" explicitly justified)
- Any novel structural choice spends an explicit innovation token with rationale

**The two-week smell test passes — a maintainer returning in two weeks understands the structure from the artifact alone**
- No "magic" components — every element either matches an existing project pattern or the deviation is justified
- Glossary or in-doc definitions exist for any non-obvious term

**Testability is a first-class concern, not deferred to implementation**
- Testability hooks are identified — what gets stubbed / faked / observed for verification
- For each major component, a verification approach is named

**Decomposition silently introduces a circular dependency or shared-state hub (adversarial)**
- Cross-module data flow direction is traced and confirmed acyclic
- No "manager" / "coordinator" object that touches every component (anti-pattern check)

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep into project for the proposed library/pattern | Confirm it's not already in use in a way that would conflict |
| Read project's existing module boundaries | Detect cross-cutting concerns the new decomposition would violate |
| Check project's `mistakes/` for related structural lessons | Avoid repeating known structural mistakes |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Innovation token spent on the wrong thing** | Every novel structural choice spends a finite innovation budget — gstack: "every company gets three innovation tokens". Push back if the idea spends one without justification |
| **Premature abstraction** | If three callers do not yet exist, the abstraction is speculative. Flag as `assumption_risk` |
| **Untestable decomposition** | A design that cannot be incrementally verified will not be incrementally implemented. Flag `design_flaw` |

---

## Performance

**Lens**: Are there **efficiency, resource, or scalability** risks the idea must address now (vs deferring)?

### Seed scenarios with attached checklists

**The expected request / operation rate is stated, not implicit**
- Big-O / order-of-magnitude reasoning is present where loop / data scale matters
- Scale assumptions are documented (not "should be fine")

**The dominant cost (CPU / IO / memory / network) is identified**
- External-call patterns (DB queries, network requests, file IO) are characterized — count, batching, retry policy
- Caching / memoization decisions are explicit (yes / no / deferred-with-reason)

**Scale limits — when does this approach break — are bounded**
- The point at which the design no longer applies is named
- Performance budgets, if any, are stated (latency target / throughput target / memory ceiling)

**Hot paths are flagged for the Execution loop's attention**
- Each hot path has a measurement strategy committed for Execution
- No silent assumption that "the framework will handle it"

**A reasonable-looking design hides a sub-linear bottleneck (adversarial)**
- Loops over potentially-large collections are checked for hidden per-iteration external calls
- Recursive / nested structures are checked for combinatorial blow-up

### Recommended verifications

| Tool | Use for |
|---|---|
| Read existing perf-sensitive code paths in the project | Confirm the proposed change does not regress an already-tight budget |
| Grep for benchmarks / load tests in the repo | Confirm the perf claim has a verification path |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Premature optimization" used to dismiss valid concerns** | The label is overused. If a perf risk has a non-trivial probability and the fix is cheap during design, raise it |
| **Reasoning about big-O instead of measuring** | For artifacts at the Ideation stage measurement is not yet possible — but the artifact should commit to a measurement strategy for Execution |

---

## Aesthetics

**Lens**: Is the **artifact itself** readable, consistent, and free of polish gaps? (For Ideation, "aesthetics" applies to the draft document, not to UI of any downstream implementation.)

### Seed scenarios with attached checklists

**A new reader understands the framed problem from the draft alone, without reading the leader's transcripts**
- Document is self-evident (Krug): "what is this proposing?" answerable from the first page
- Section headings match the project's standard for Ideation drafts

**Naming in the draft is accurate and self-explanatory**
- Names for proposed components / functions / paths are concrete enough that a Planner could lift them directly
- No internal contradictions where the same thing has two names

**The draft follows project conventions for similar docs**
- Section ordering and heading style match prior Ideation drafts in this project
- Frontmatter (if applicable) is complete

**Every section earns its place — no filler, no redundant boilerplate (Rams: "as little design as possible")**
- No placeholder text (`TBD`, `TODO`, `...`, "see below" with no below)
- No paragraph that could be deleted without losing information

**A reader skims the draft and walks away with a wrong impression (adversarial)**
- Headlines / first-paragraph claims accurately summarize the section that follows (no clickbait)
- Conclusions reached are supported by the artifact's own evidence, not waved at

### Recommended verifications

| Tool | Use for |
|---|---|
| Compare to a known-good prior Ideation draft in the project | Detect divergence from project conventions |
| Grep for placeholder strings (`TBD`, `TODO`, `???`) | Mechanical placeholder check |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Aesthetics treated as "style preferences"** | Drop confidence to ≤ 25 only if the finding is genuinely subjective. Convention violations and ambiguity-causing names are not preferences |
| **Aesthetics findings used as `FAIL` blockers** | Aesthetics rarely produces `FAIL`. Most findings are Medium or Low; calibrate severity accordingly |

---

## Usage

**Lens**: For the **next consumer of this idea** — the Planner who decomposes it, the Executor who implements it, and the future-self who maintains it — is the artifact usable?

### Seed scenarios with attached checklists

**The Planner produces a task list without going back to the user with clarifying questions**
- Every directional design decision has enough specificity to start implementation (no "we'll figure out the library later")
- Scenarios are concrete enough for Planning to map them to tasks 1:1

**The Executor reads each scenario and knows what file / module / function to change**
- Every research insight cited has a path / URL / reference the consumer can follow
- Component / function / path names are stable across the document

**A maintainer at 3am who has not seen this work before can understand what was built and why**
- The artifact explicitly names its consumers (Planner / Executor / future-self) and confirms each can use it
- Glossary terms are defined inline or by reference

**Failure modes communicated by the artifact match what the implementation will exhibit**
- Each named failure mode has a corresponding implementation expectation
- No promised behavior the design cannot actually deliver

**A consumer reads the artifact and forms the wrong mental model (adversarial)**
- Terms borrowed from the project's existing vocabulary are used with the same meaning
- Where a term is overloaded, the local meaning is stated explicitly

**Accessibility / I18n awareness** (Coverage Matrix: Usage; `not-applicable:` if scope excludes UI / user-facing strings)
- If the idea affects a user-facing surface, accessibility / keyboard nav / screen-reader needs are surfaced as scenarios
- If the idea introduces user-facing strings, i18n strategy is named (or rationale for monolingual scope)

**Observability / "diagnosable at 3am"** (Coverage Matrix: Structure + Usage)
- The design names what would log / what would alert when something goes wrong
- A maintainer at 3am has enough surface (logs / metrics / paths) to identify the failing component without re-reading the design

### Recommended verifications

| Tool | Use for |
|---|---|
| Read the project's Planning skill's input requirements | Confirm the draft contains everything Planning expects |
| Test the "3am test" by reading only the artifact | Identify what context is missing without the leader's session |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Usage findings collapsed into Aesthetics** | Usage is about *consumability*, not *readability*. A perfectly written doc can fail Usage if it omits what the consumer needs |
| **"The Planner will ask if unclear"** | The Planner asking the user is a failure mode for the Ideation artifact — the artifact's job was to answer those questions |

---

## Consistency

**Lens**: Did everything that should sync inside the idea, sync? Are there internal contradictions, mismatches between sections, or drifts from cited research?

### Seed scenarios with attached checklists

**The Scope Contract, Framed Problem, and Design section describe the same problem**
- Scope Contract phrasing matches between top of document and any later restatement
- The Design section solves the problem the Framed Problem states (not a different one)

**Every directional design decision is consistent with the research insights it cites**
- Design choices cite specific research insight IDs / labels that actually exist in the Research Insights section
- Cited insights actually say what the design claims they say (no over-citation)

**Scenarios and Implementation Checklist are aligned**
- Every Implementation Checklist item is anchored to at least one scenario (or its absence is justified)
- Every scenario has at least one Implementation Checklist item that would verify it

**Glossary terms (if any) are used consistently across sections — no synonym drift**
- A term used in Scope Contract is the same term in Design (not paraphrased)
- No "the Planner" vs "the Plan agent" oscillation

**Internal vs external research findings conflict and the conflict is not resolved (adversarial)**
- Where internal and external insights tension, the artifact states which prevails and why
- Both insight sets are not silently assumed compatible

### Recommended verifications

| Tool | Use for |
|---|---|
| `grep -n` for each defined term across the draft | Detect synonym drift |
| Cross-reference scan: every "see Section X" target exists | Detect broken internal links |
| Diff Research Insights vs Design rationale | Detect insight-design drift |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"The reader will understand from context"** | Internal contradictions are not resolved by good readers. Flag `design_flaw` |
| **Cited insight that doesn't say what's cited** | Misquoted / over-claimed research. Re-read the insight and either restate accurately or drop the citation |

---

## Risk

**Lens**: **What breaks if this is wrong?** Blast radius, reversibility, security surface, rollback path. The two-week smell test.

### Seed scenarios with attached checklists

**If the idea is implemented and turns out wrong, the rollback path is identified**
- Rollback path stated for each irreversible step (or "no irreversible steps" confirmed)
- Rollback does not require perfect coordination across the team

**The blast radius is bounded — which downstream consumers / files / services are affected**
- Blast radius enumerated — list of files / modules / consumers / external systems impacted
- Backwards-compat impact stated for any external interface

**The idea does not silently expand the security surface**
- Security surface delta is `none` or explicitly described (new auth boundary / data egress / untrusted input path)
- For each new untrusted input path, validation strategy is named

**Irreversible steps (data migration, public-API change, external write) are gated with extra caution**
- Each irreversible step is explicitly flagged as such
- Each carries an explicit "go/no-go" decision point

**Two-week smell test: in two weeks, the team is glad they shipped this, not paying maintenance debt**
- The Design avoids load-bearing future-self promises ("we'll improve this later")
- Maintenance burden is named, not denied

**Scope drift check: the design touches files outside the Scope Contract (adversarial)**
- Diff the Scope Contract against the Design section — flag any file/module mention outside contract
- If outside-scope changes are needed, they are either (a) re-scoped into the contract, or (b) backlogged

**Concurrency / race-condition surface evaluated**
- Shared mutable state is identified (or "no shared mutable state" confirmed)
- Synchronization decision is named for each shared-state surface

**Privacy / data retention** (Coverage Matrix: Risk + Consistency)
- New PII or sensitive-data surface identified (or explicit "no new sensitive data")
- Retention / scrubbing strategy named for any persisted sensitive data

**License / IP risk** (Coverage Matrix: Risk + Consistency)
- Borrowed code / patterns from external sources have license verified compatible with project policy
- New dependency-introducing decisions name their license class

**Cost / budget impact** (Coverage Matrix: Performance + Risk)
- Recurring-cost dimensions (paid API, infra, storage) are named with order-of-magnitude estimates
- A cost-runaway scenario is identified (or explicit "no runaway possible")

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep for callers of any function / module the design will change | Quantify blast radius |
| Read project's `mistakes/` for related risk lessons | Avoid repeating a known risk pattern |
| Diff the Scope Contract against the Design section | Detect scope drift directly |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"It's just a docs change"** | Docs changes can have blast radius through `MUST load` directives, link targets, and downstream skill behaviors. Don't dismiss |
| **Rollback path that requires perfect coordination** | If rollback assumes everyone notices fast and acts in concert, the rollback path is not real. Flag `assumption_risk` |
| **Security surface delta declared "none" without checking** | "I don't think this changes auth" is not a check. Grep for auth / token / cookie / cors code paths the artifact touches |

---

## Overall (Stage 3) — phase-specific anchors

When the evaluator runs Stage 3 on an Ideation artifact, the Karpathy-4 check applies as follows:

| Karpathy mode | What it looks like in an Ideation artifact |
|---|---|
| **Wrong assumptions** | A premise in the Framed Problem section that the research insights do not support |
| **Overcomplexity** | A directional design decision that could have been "use the existing pattern" but spent an innovation token instead |
| **Orthogonal edits** | The Scope Contract spans subsystems that should have been decomposed into separate ideas — bundling them invites scope creep |
| **Imperative-over-declarative** | The Evaluation Criteria prescribe implementation mechanism instead of stating the verifiable goal (e.g., "must use a recursive parser" instead of "must handle nested expressions correctly") |

**Preserve-list anchors specific to Ideation**: the leader's research insights that are well-grounded; directional design decisions that defensibly chose the boring path; Scope Contract phrasing that is sharp.

---

## Output reminder

The evaluator writes:
- Seven per-perspective files at `sessions/{date}-{session-id}/1-ideation/evaluation/iter{n}/{system}/{project,structure,performance,aesthetics,usage,consistency,risk}.md`
- One overall file at `sessions/{date}-{session-id}/1-ideation/evaluation/iter{n}/{system}/overall.md`

Each per-perspective file structure (mandatory headers): `## Artifact Summary + Memory reads` (from Stage 0; includes paths consumed for project/feature overrides + project mistakes + project rules + prior-phase canonical when applicable) → `## Locked Frame (Stage 1)` (augmented from this child doc's seed content + prior-iter open findings + overrides) → `## Per-scenario per-check results` → `## Typed findings` (Stage 2, each with Type / Domain / Disposition / Confidence / Severity / Evidence) → `## Low-confidence appendix` section.
