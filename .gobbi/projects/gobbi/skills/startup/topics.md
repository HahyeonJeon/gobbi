# Startup Topics

The lookup tree for startup's full first-run conversation. It is ordered by **dependency**, not by
document destination: problem space → boundary → solution space (product shape before system shape) →
guardrails. One question per turn. The full traversal, checkpoint, and mandatory-coverage rules are at the
end of this file.

## Contents

- [How to traverse the tree](#how-to-traverse-the-tree)
  - [Anti-sycophancy contract](#anti-sycophancy-contract)
  - [Worked pushback exemplars](#worked-pushback-exemplars)
- [Phase I — Problem space](#phase-i--problem-space)
  - [Topic 1 — Existing Reality & Intent](#topic-1--existing-reality--intent)
  - [Topic 2 — Problem, Vision & Success](#topic-2--problem-vision--success)
  - [Topic 3 — Users, Jobs, Alternatives & Value](#topic-3--users-jobs-alternatives--value)
- [Phase II — Boundary](#phase-ii--boundary)
  - [Topic 4 — Scope, Boundaries & Non-goals](#topic-4--scope-boundaries--non-goals)
  - [Problem-before-solution premise gate](#problem-before-solution-premise-gate)
- [Phase III — Solution space (product shape before system shape)](#phase-iii--solution-space-product-shape-before-system-shape)
  - [Topic 5 — Features & User Journeys](#topic-5--features--user-journeys)
  - [Topic 6 — Experience & Product Design](#topic-6--experience--product-design)
  - [Topic 7 — Architecture, System Context & Data](#topic-7--architecture-system-context--data)
  - [Topic 8 — Tech Stack, Delivery & Operations](#topic-8--tech-stack-delivery--operations)
- [Phase IV — Guardrails](#phase-iv--guardrails)
  - [Topic 9 — Conventions, Constraints & Quality bar](#topic-9--conventions-constraints--quality-bar)
  - [Topic 10 — Risks, Unknowns & Roadmap](#topic-10--risks-unknowns--roadmap)
  - [Topic 11 — Idioms, Rules & Recurring Mistakes](#topic-11--idioms-rules--recurring-mistakes)
- [Level-1 checkpoints](#level-1-checkpoints)
- [Traversal, mandatory coverage & resume rules](#traversal-mandatory-coverage--resume-rules)

## How to traverse the tree

1. Follow the topics and Level-2 branches in order. Ask **one question per turn**.
2. Each bullet under a branch is a **prompt bank**, not a single question. When a bullet bundles several
   decision axes (e.g. 1.4 license/governance, 8.2 build/deploy/observe/rollback, 10.1 likelihood/impact/
   warning/mitigation), ask **one axis per turn**; a single answer event may still fill several
   already-explicit ledger fields. Choose two to four prompts from a branch's bank as needed; do not
   recite the whole bank once the branch is already evidenced.
3. Before asking, inspect the relevant project docs and repo evidence. If a fact is verified, show it
   first and ask the user to confirm or correct it — a shown fact shortens the answer. **Prefer
   past-behavior and repository evidence over opinion or hypothetical, and never lead the answer** — ask
   what actually happened, not what the user supposes would happen.
4. **When a branch reaches a design-bearing choice** (marked under the heading below), do not close it
   from the user's initial preference. Run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop)
   before closing it. Capture-only branches trigger it only when they expose a choice.
5. If an answer is vague, probe with a concrete example, a past-behavior question, or a counterexample.
   If the re-answer is still vague, probe a second time (the [`discussion`](../discussion/SKILL.md)
   § Push-once-then-push-again rule); if it is still vague after the second probe, close the branch
   `recorded-open` with an owner and resolution method rather than accepting a vague answer or pushing
   indefinitely. Do not probe when the first answer is already concrete and evidenced.
6. Mark each answer `confirmed` / `assumption` / `open` / `contradicted` in the answer ledger, and record
   each Level-2 branch's own closure state in the ledger's `Branch closure` field
   ([`recording.md`](recording.md) §2 owns the schema).
7. Smart-skip a branch only when existing evidence fully answers it AND the user confirms; record the
   evidence and the confirmation.
8. Re-open an earlier branch when a later answer contradicts it. Architecture must not silently redefine
   scope; roadmap must not silently redefine the quality bar.

**Design-bearing markers.** Branches that settle a direction carry an inline marker under their heading.
The core design cluster is **Topics 6–9**, plus the always-design-bearing capability and journey branches
**5.1–5.2**; a conditional set (**4.4, 5.3, 5.4, 7.1, 8.4, 9.4, 10.4, 11.1, 11.2**) fires the same
micro-loop only when the branch selects or changes a direction rather than inventorying current state.
The markers below are the authoritative set; see the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop).

### Anti-sycophancy contract

Hold this posture through every turn:

- Do NOT use "that is interesting", "that could work", "there are many ways", or "you might consider" as
  standalone assessments — they read as agreement and teach nothing.
- Do NOT put the desired answer inside a discovery question.
- After each answer, state the read explicitly: "My read: [evidence status] because [specific evidence or
  gap]; this changes if [observable evidence]."
- When disagreeing, cite the contradiction, the source, or the missing signal — not a feeling.
- Push a vague or contradicted answer at most twice, then `recorded-open`.
- A user decision can lock intent, but it cannot convert a contradicted external fact into evidence.

### Worked pushback exemplars

Use these BAD → GOOD rewrites on the design-bearing and problem/user branches:

- **Vague target** — BAD: accept "developers". GOOD: "'Developers' is not a segment. Who experienced
  this last, what exact task, and what did the failure cost?"
- **Compliments** — BAD: treat "they love it" as demand. GOOD: "Liking it is free. Which of them changed
  behavior or gave up time, effort, or money?"
- **Undefined quality** — BAD: accept "seamless". GOOD: "'Seamless' is not measurable. Which step blocks
  first value, what is the baseline completion / time, and what threshold would pass?"
- **No alternative** — BAD: accept "there's nothing like it". GOOD: "The status quo is still what you
  must beat. What do users do now, and what anxiety or habit keeps them there?"

---

## Phase I — Problem space

### Topic 1 — Existing Reality & Intent

#### 1.1 Trigger & lifecycle
- Why is the baseline being established or revised **now**?
- Is the project greenfield, experimental, production, mature, legacy, or retiring?
- What confusion or repeated mistake should this reference prevent first?

#### 1.2 Current state & evidence
- What exists today — an idea, code, users, deployments, docs, or some combination?
- Which current-state claims can be verified directly from the repo or from observed behavior?
- What has already been tried, and what happened in the most recent concrete case?

#### 1.3 Authority & uncertainty
- Who settles product, technical, security, and delivery decisions?
- Which current answers are confirmed vs assumption vs open vs already contradicted?
- Which existing docs stay authoritative, and which are candidates for review or supersession?

#### 1.4 License, distribution & governance
- What license does the project ship under, and is it open-source, internal, commercial, or mixed?
- What external distribution, contribution, review-authority, or community-obligation model applies?
- Who can change the license or governance model, and which legal/compliance constraint also needs
  recording later (cross-refs Topic 9.4)?

*Not-applicable rule:* for a closed/internal project with no external distribution, record
`license/governance: internal — not applicable` as a one-line **confirmed** answer and move on. Never
fabricate a license, and never skip the branch silently.

### Topic 2 — Problem, Vision & Success

#### 2.1 Problem event & consequence
- What was the last concrete occurrence of the problem — when, and who experienced it?
- What did that person actually do when it happened, and what did it cost them?
- What recurring situation triggers the need for this project, and how often does it recur?

#### 2.2 Root cause, why-now & fatal premise
- Why does the problem persist, and what evidence would show the stated problem is only a symptom of a
  deeper cause?
- What recently changed that makes now the time to solve it?
- Which single claim, if false, would make this project pointless or wrong? (Ask one axis per turn.)

#### 2.3 Vision & durable outcome
- What have you already seen that makes a better outcome believable? Then, tagged `intent`: if the
  project succeeds, what is materially different for its users or operators?
- What stays true in three years even if the implementation changes completely?
- What one-sentence description should a new contributor be able to repeat accurately?

#### 2.4 Baseline, target, failure & stop threshold
- What is the current measured baseline from the most recent real case?
- Which target improvement — measured by whom, by when, and set on what sourced, context-specific basis or method (a prior comparable, a benchmark with its source, or a stated method, not an unsourced number) — would prove the project works, and what
  would count as a technically successful build but a failed project?
- What threshold or evidence would say stop, pivot, or narrow — and on what sourced basis or method?

### Topic 3 — Users, Jobs, Alternatives & Value

#### 3.1 First user, persona & roles
- Who is the one first user or segment, and what evidence makes them first?
- Where distinct roles exist, who operates, approves, supports, or is affected — each as a separately
  applicable axis, not a purchasing chain?
- Who is explicitly **not** a target in the current boundary?

#### 3.2 Job & switching forces
- In what concrete situation does the user reach for it, and what progress (not feature) are they trying
  to make?
- Complete the job story: "When [situation], I want [motivation], so I can [outcome]." What happens if
  that job fails?
- Name the switching forces: what pushes the user off the current way, what pulls them toward a new one,
  what anxiety the new approach creates, and what habit or allegiance holds them to the old. What event
  overcame those forces in the last real switch, and which force is strongest?

#### 3.3 Current alternatives & status quo
- What do target users do today instead — a workaround, doing nothing, or an adjacent tool? The status
  quo is the real thing the project must beat.
- How well does the current alternative actually work, and where does it break down?
- What anxiety or habit keeps users on the status quo even when it fails them?

#### 3.4 Behavioral evidence of the problem
- What dated instances of the problem can the user point to, and how frequent is the need among the first
  users?
- What has the first user already spent — effort, time, or money — or what workaround have they built to
  cope? (Past behavior only — never "what would you pay".)
- What is the consequence of doing nothing, and what observed behavior shows the problem is real?

#### 3.5 Value proposition
- What outcome does the project deliver better than the current alternative?
- What has the first target user already done when the current alternative fell short — switched tools,
  built a workaround, or absorbed the cost?
- Which value claim would be dropped if the supporting behavior never appears?

---

## Phase II — Boundary

### Topic 4 — Scope, Boundaries & Non-goals

#### 4.1 Outcome boundary
- Which user outcome does the first viable version own end to end?
- Where does the project's responsibility begin and end?
- Which adjacent outcome belongs to another tool, team, or workflow phase?

#### 4.2 In-scope
- Which capabilities must exist for the core value to be real?
- Which platforms, environments, data classes, and segments are included first?
- Which constraints are part of the scope contract rather than implementation preferences?

#### 4.3 Non-goals
- Which tempting feature would broaden the project without strengthening its core value?
- Which use cases will it refuse or leave manual for now?
- Which scope expansion has already been proposed or attempted, and why was it declined or left manual?
  Given that, what should a contributor never infer from the vision statement?

#### 4.4 Decision tests

*Conditionally design-bearing — triggers the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) only when the branch selects or changes a direction, not when inventorying current state.*

- What test decides whether a proposed capability belongs in the current scope?
- Which past scope decision has already been reversed or expanded, and what evidence drove it? Then,
  labeled `forecast`: what evidence or condition would justify expanding the boundary later?
- Which scope choices are reversible, and which create an expensive commitment?

### Problem-before-solution premise gate

After Topic 4 and before Topic 5, run an explicit confirmed checkpoint. Show these premises one by one
for agree / disagree:

1. the recurring problem + its last-instance evidence;
2. the first user / segment + the job;
3. the current alternative + the behavioral evidence the problem is real;
4. the root cause + why-now;
5. the fatal assumption + the current disconfirming evidence;
6. the outcome boundary + explicit non-goals.

A failed premise reopens its earliest owning branch; do not enter features until it is confirmed. No
commercial premise is graded here.

---

## Phase III — Solution space (product shape before system shape)

Establish and confirm product shape (Topics 5–6) before system shape (Topics 7–8). Do not use an
architecture or stack choice to narrow Topics 2–5 after the fact.

### Topic 5 — Features & User Journeys

#### 5.1 Durable capabilities

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- Which durable capabilities deliver the in-scope outcome?
- Which candidates are user-value features, and which are internal mechanisms or one-time tasks?
- What is the smallest useful foundation that delivers real value rather than only infrastructure?

#### 5.2 Critical journeys

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- Walk the primary journey from trigger to outcome in the user's own terms.
- Where does the user decide, provide data, wait, recover, or hand work to someone else?
- Which step has the highest cost of failure, and what happened in a comparable real flow?

#### 5.3 States & dependencies

*Conditionally design-bearing — triggers the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) only when the branch selects or changes a direction, not when inventorying current state.*

- Which capabilities already exist, are in progress, are planned, or were abandoned?
- What must be true before each planned capability can work?
- Which capability unlocks the most downstream value with the fewest prerequisites?

#### 5.4 Edge & failure journeys

*Conditionally design-bearing — triggers the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) only when the branch selects or changes a direction, not when inventorying current state.*

- What happens on invalid input, partial state, unavailable dependencies, or interrupted work?
- How does the user recover without hidden manual repair?
- Which misuse or abuse case changes the product boundary or requires an explicit refusal?

### Topic 6 — Experience & Product Design

#### 6.1 Interaction model

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- Which interface does each user need — CLI, API, UI, library, automation, or a mix?
- What is the first meaningful action and the first clear success signal?
- Which details must be visible to support trust and control, and which can stay hidden?

#### 6.2 Information & content model

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- Which objects and concepts does the user think in, and what names do they use?
- What information must be shown together to support a sound decision?
- Which current terms are overloaded, misleading, or likely to be confused?

#### 6.3 Accessibility, trust & failure experience

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- Which accessibility and internationalization needs belong in the first quality bar?
- What must the project explain before a user can trust an action or result?
- What should an error say, and what next action should it enable?

#### 6.4 Design references

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- Which existing product or interface do you already rely on as a positive reference, and for what exact,
  concrete property?
- Which apparent reference should not be copied, and why does it not fit here?
- What sketch or prototype would let you choose between concrete directions? The manager studies
  alternatives independently — the named reference is a starting point, not the full option set.

### Topic 7 — Architecture, System Context & Data

#### 7.1 System context

*Conditionally design-bearing — triggers the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) only when the branch selects or changes a direction, not when inventorying current state.*

- Which people and external systems exchange information with the project?
- What crosses each trust boundary, and in which direction?
- Which responsibility stays outside the system even when integration would be convenient?

#### 7.2 Building blocks & responsibilities

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- What are the major deployable units or containers, and what single responsibility does each own?
- Which boundaries should stay stable while their internals change?
- Where would tight coupling impose the highest future cost?

#### 7.3 Runtime & lifecycle

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- Walk the main runtime path from a user action to its result.
- Which background, async, scheduled, startup, shutdown, or recovery paths also matter?
- How is failure contained, retried, surfaced, and reversed along those paths?

#### 7.4 Data & state

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- What data is created, read, updated, deleted, retained, and exported?
- Which data is authoritative, derived, cached, sensitive, personal, or regulated?
- What consistency, migration, backup, retention, and deletion promises must hold?

#### 7.5 Architecture decisions & alternatives

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- Which architecture choices are already fixed, by whom, and for what reason?
- What credible alternative exists for each expensive or hard-to-reverse choice?
- What evidence would change the current direction?

### Topic 8 — Tech Stack, Delivery & Operations

#### 8.1 Stack choices

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- What does the repository use today — languages, frameworks, runtimes, data stores, build tools — and
  which concrete version or constraint has made a current choice succeed or fail?
- Which of those is a hard constraint, and which is only a current preference?
- Which stack direction should the project require going forward (intent/forecast), and what version,
  maturity, license, portability, or available-skill concern could invalidate it?

#### 8.2 Environments & deployment

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- Where does the project run in dev, test, staging, and production?
- How is it built, configured, deployed, observed, rolled back, and recovered?
- What must work offline, on-premises, across regions, or in restricted networks?

#### 8.3 Integrations & dependencies

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- Which external dependency is essential to the user value?
- What happens if that dependency changes, fails, becomes expensive, or disappears?
- Which dependency categories are preferred, banned, or require approval?

#### 8.4 Ownership & support

*Conditionally design-bearing — triggers the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) only when the branch selects or changes a direction, not when inventorying current state.*

- Who maintains each subsystem and responds when it fails?
- Which operational task must remain possible without the original author?
- Which logs, metrics, traces, alerts, and runbooks are required before launch?

---

## Phase IV — Guardrails

Guardrails reference the confirmed problem, boundary, product shape, and system shape. They come last so
they constrain a known project rather than invent one.

### Topic 9 — Conventions, Constraints & Quality bar

#### 9.1 Engineering conventions

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- Which directory, module, naming, interface, error, and documentation patterns are intentional?
- Which live files are the best examples of those patterns?
- Which locally common pattern should **not** be copied, and what makes it a counterexample?

#### 9.2 Quality attributes

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- Which qualities dominate trade-offs — correctness, security, latency, availability, usability,
  maintainability, or another?
- What scenario and measurable threshold define each top quality, and what sourced, context-specific basis or measurement method sets that threshold?
- Which quality may degrade first under pressure, and which cannot?

#### 9.3 Verification & review bar

*Design-decision trigger: run the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) when this branch selects or changes a direction.*

- Which unit, integration, end-to-end, security, and operational checks prove a change safe?
- What must every change request or release include before acceptance?
- Who reviews each class of change, and which changes need explicit approval?

#### 9.4 External & internal constraints

*Conditionally design-bearing — triggers the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) only when the branch selects or changes a direction, not when inventorying current state.*

- Which legal, regulatory, security, budget, schedule, compatibility, or organizational constraints bind
  the project?
- Who owns each constraint, and what citable source establishes it?
- What happens when two constraints conflict — including the license/distribution obligation recorded in
  Topic 1.4?

### Topic 10 — Risks, Unknowns & Roadmap

#### 10.1 Risk register
- What could make the project undesirable, infeasible, unsafe, or unsustainable?
- For each material risk — likelihood, impact, earliest warning, and mitigation?
- What is the strongest argument not to build it, or to stop after starting?

#### 10.2 Unknowns & assumptions
- Which load-bearing claim currently has the weakest evidence?
- What is the cheapest reliable way to resolve each unknown?
- Which unknown blocks scope, architecture, or sequencing and cannot be deferred?

#### 10.3 Capacity & time horizon
- Who is available, with what skills and decision authority?
- Which fixed date, budget, cost, or support obligation constrains sequencing?
- What can proceed in parallel without competing for the same scarce person or system?

#### 10.4 Roadmap & stop conditions

*Conditionally design-bearing — triggers the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) only when the branch selects or changes a direction, not when inventorying current state.*

- What belongs in now, next, and later, and which dependency explains that order?
- What milestone proves enough value to justify the next investment?
- What signal has paused, pivoted, or narrowed this or a comparable past project before? Then, labeled
  `forecast`: what evidence would pause, pivot, narrow, or retire this project?

### Topic 11 — Idioms, Rules & Recurring Mistakes

#### 11.1 Intentional idioms

*Conditionally design-bearing — triggers the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) only when the branch selects or changes a direction, not when inventorying current state.*

- What looks unusual here but is intentional and should be preserved?
- Which live example shows the idiom, and what problem does it solve?
- Where should the idiom **not** be used?

#### 11.2 Binding rules

*Conditionally design-bearing — triggers the [P3 design-decision micro-loop](SKILL.md#p3-design-decision-micro-loop) only when the branch selects or changes a direction, not when inventorying current state.*

- Which conventions are mandatory rather than preferred?
- What concrete failure or cost does each rule prevent, and where does it apply?
- What genuine exception exists, and does the user explicitly confirm the rule, its scope, its reason, and
  its exception?

#### 11.3 Recurring traps
- What do contributors or agents repeatedly get wrong?
- What was the most expensive past failure, what root assumption caused it, and how could it have been
  detected earlier?
- What approach looks reasonable here but reliably breaks, and what is the corrected approach?

#### 11.4 Hidden knowledge & decay
- What critical project knowledge lives in only one person's head?
- Which baseline claim is most likely to go stale first?
- What event should trigger a startup rerun or a focused topic review?

---

## Level-1 checkpoints

At the close of each Level-1 topic, show the user a checkpoint with exactly these categories:

- **Confirmed facts** and their evidence.
- **Assumptions** still needing evidence.
- **Open questions**, each with an owner and a resolution method.
- **Contradictions** that were resolved or that remain open.
- **Binding decisions** made in this topic.
- **Proposed durable doc effects**, split into atomic candidate records (one concept each).

Ask the user whether the checkpoint is accurate. On confirmation, append a resumable marker to the answer
ledger holding the Level-1 topic number and a confirmation timestamp. On correction, update the ledger
first, regenerate the affected staged drafts from the ledger, then present the checkpoint again.

---

## Traversal, mandatory coverage & resume rules

- **One question per turn**, following the topic and branch order above. Show any verified repo fact first
  to shorten the answer.
- **Mandatory coverage (first run):** a first run covers all 11 Level-1 topics and every Level-2 branch.
  There is no quick or core tier.
- **Answer status vs branch closure are separate, and closure is tracked per-branch.** An answer's
  `Status` is `confirmed` / `assumption` / `open` / `contradicted` (evidence strength). A branch's
  closure is a distinct axis, recorded for every Level-2 branch — not only at the Level-1 checkpoint — in
  the answer ledger's `Branch closure` field. [`recording.md`](recording.md) §2 owns that schema
  (`confirmed` / `proven-irrelevant:{reason}` / `recorded-open:{owner}`).
- **Validity gate:** the baseline is valid only after every required branch has a recorded closure state
  in the ledger. An unresolved branch without an owner blocks completion.
- **Smart-skip shortens, it does not drop.** Existing docs/repo evidence may close a branch when the user
  confirms — but coverage stays mandatory; smart-skip removes redundant questions, never required branches.
- **Probe up to twice, then record open.** Probe a vague answer with a concrete example, past-behavior
  question, or counterexample. If the re-answer is still vague, probe a second time (the
  [`discussion`](../discussion/SKILL.md) § Push-once-then-push-again rule); if it is still vague after the
  second probe, close the branch `recorded-open` with an owner and resolution method rather than accepting
  a vague answer or pushing indefinitely. Do not probe when the first answer is already concrete and
  evidenced.
- **Re-open on contradiction.** When a later answer contradicts an earlier branch, re-open the earlier
  branch and resolve it in the ledger — do not paper over it. Architecture must not silently redefine
  scope; roadmap must not silently redefine the quality bar.
- **Pause only at a confirmed checkpoint.** A run may pause only at a confirmed Level-1 checkpoint. On
  resume, reload the ledger, re-show each confirmed Level-1 summary for a quick re-confirm, regenerate the
  staged drafts from the ledger (idempotent), and continue from the first unconfirmed checkpoint.
- **Abandon-before-promote is safe.** If the user abandons an in-progress run before promotion, the
  session-local working and staging material can be dropped or ignored with no durable-memory cleanup.
- **Depth override.** After the first real problem event, run the [P3 riskiest-assumption-first depth override](SKILL.md#p3-riskiest-assumption-first-depth-override).
- **JTBD switching forces are user / problem understanding.** In 3.2 and 3.3, probe the four forces —
  push, pull, anxiety of the new, and habit / allegiance to the old — and the event that overcame them in
  the last real switch, to close the gap where a real problem still fails to produce a change in behavior.
  This is user / problem understanding, not competitive positioning.
- **Synthesis-in-sections before promotion.** Before synthesizing staged drafts, present the design back
  in small coherent sections (problem / evidence → first user → boundary → product shape → feasibility →
  guardrails), ask whether each interpretation is accurate, and allow backward movement on a new
  constraint. (A ~200–300-word-per-section heuristic, not a hard check.)

The full capture model, staging→destination contract, and startup-close promotion procedure that consume
these answers live in [`recording.md`](recording.md).
