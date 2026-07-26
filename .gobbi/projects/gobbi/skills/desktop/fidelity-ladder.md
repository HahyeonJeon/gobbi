# The Design Fidelity Ladder

Nine ordered design rungs, three independent fidelity axes, and the validation method that closes each rung.
This is the generic layer: every definition here is product-neutral, and nothing in it names a platform, an
operating system, or a product class.

**One altitude rule governs the whole file, and it covers identifiers as well as prose.** Every rung is
written in generic terms and names no identifier except its own `DESK-RUNG-N`. Where a rung needs the policy
that makes it binding, or the floor that owns its evidence set, or the gate that approves it, it names that
owner **by role** — "the run's own skill's rule that makes the rungs binding", "the run's own skill's
direct-evidence floor", "the run's own skill's structural-approval gate". A rung that cited a rule or a floor
by identifier could not be relocated without editing its body, and relocation unchanged is the property this
file is written to preserve. For the same reason it carries no path, in its header or its body: there is no
path here to rewrite.

Where a rung's default artifact or its evidence axis depends on the product's shape, this file states the
**selection rule** and the run's own skill states the instantiation of it. No rung resolves that choice for a
particular product class.

**Nine rungs, and Build is not one of them.** The rungs are `DESK-RUNG-0` through `DESK-RUNG-8`. Build is the
terminus the ladder feeds: it has no design question, no default artifact, and no closing evidence of its own.

**Ordered and re-enterable.** The rungs are walked in order because each one's question depends on the answer
above it. They are explicitly re-enterable: the progression is iterative scaffolding rather than a recipe, so
a later rung's answer that invalidates an earlier rung returns to the earliest affected rung. Re-entry is
normal and is not a failure; an unresolved rung is the failure.

## The three fidelity axes

Fidelity is never one dial. Every **visual** artifact — rungs 6 through 8 — states its position on all three
axes independently. The structural rung, 5, is deliberately non-visual, so it carries no position on the
visuals axis and owes no fidelity statement at all.

| Axis | Low | High |
|---|---|---|
| Interactivity | a facilitator simulates the response | the artifact responds automatically |
| Visuals | schematic layout without visual hierarchy | realistic hierarchy, spacing, and layout |
| Content and navigation | summarized stand-ins | final content and real navigation |

An artifact may legitimately be high in content and low in visuals at the same time, so a two-step
low-then-high gate misrepresents the concept.

The axes carry a real selection consequence. High fidelity is better for testing a specific component, a
workflow, an affordance, and a realistic system response time, and for reducing facilitator error. Low
fidelity is better for rapid iteration, for changing the design mid-test, for lowering user pressure and
designer attachment, and for signalling to stakeholders that the work is unfinished. Choose per axis from the
question being asked, never from a stage number.

## The nine rungs

Every rung carries the same five fields: its identifier and name, its *Question*, its *Default artifact*, its
*Done-condition*, and its *Closing evidence*. `Done-condition` is the property that must hold; `Closing
evidence` is what a reader inspects to confirm it.

### `DESK-RUNG-0` — Research and problem definition

*Question:* Is this the right problem, for whom, in what situation?

*Default artifact:* personas grounded in observed behavior, plus an interview guide.

*Done-condition:* the problem, the affected people, and the situation that triggers the need are stated from
evidence about real people rather than from assumption.

*Closing evidence:* interview or contextual-inquiry records with participant context, consent, and the
separation of observation from interpretation.

### `DESK-RUNG-1` — Task analysis

*Question:* What does the user actually do, in what order, at what cognitive cost?

*Default artifact:* a hierarchical task-analysis diagram.

*Done-condition:* the task decomposition reflects observed work, not self-reported work, and names where cost
concentrates.

*Closing evidence:* observation in the real work context. A self-report alone does not close this rung, which
is this rung's own stated validator.

### `DESK-RUNG-2` — Information architecture

*Question:* What exists, how is it organized, and what is it called?

*Default artifact:* a content inventory, an audit, and a taxonomy.

*Done-condition:* every object the outcome exposes has a place and a name derived from users' own grouping,
not from the implementation's structure.

*Closing evidence:* a generative card sort followed by an evaluative tree test, in that order. The two
methods, and the reason their order is part of the contract, are set out under validation methods below.

### `DESK-RUNG-3` — Navigation design

*Question:* Can users reach it?

*Default artifact:* navigation components derived from the information architecture.

*Done-condition:* every object in the architecture is reachable, and reachable directly enough to be found
rather than hunted.

*Closing evidence:* tree testing reporting both success rate and directness. Success rate alone does not close
it, because a found-by-wandering path passes success and fails directness.

### `DESK-RUNG-4` — User flows

*Question:* What is the path through a task, end to end?

*Default artifact:* a user flow or journey map.

*Done-condition:* each task from the task analysis has a complete path including its decision points, waits,
failures, and recovery routes.

*Closing evidence:* a walkthrough of each flow against the task analysis, naming any task with no flow and any
flow with no task.

### `DESK-RUNG-5` — Structural skeleton, surface-neutral

*Question:* Does one whole structure hold the outcome together, before any surface, layout, or visual decision
is made?

*Default artifact:* a surface-neutral structural specification — hierarchy, regions or stages, navigation or
command structure, action priority, information flow, system status, state relationships, decision points,
failure zones, recovery routes, handoffs, adaptation, and completion evidence, stated without assuming a
graphical layout — plus the mapping from each claimed surface onto that one structure.

*Done-condition:* every claimed surface realizes the same structure and serves one outcome, and no local unit
detail has been designed yet.

*Closing evidence:* the versioned structural specification with its state and path map, its surface mapping,
and its open-question register, recorded as this rung's resolution in the register **and explicitly approved
at the run's own skill's structural-approval gate before any later rung begins**. The register row records the
approval decision, not merely the artifact.

> **This rung carries its own approval point, and it fires before any visual rung.** The rung closes only when
> the approver has explicitly approved the structure or reopened it. Folding that decision into the later
> design-acceptance gate would mean the structure is first seen after the visual artifacts already exist,
> which inverts what a structure-before-visuals ladder is for. The gate is named and numbered by the run's own
> skill; this rung names it by role only.

### `DESK-RUNG-6` — Low-fidelity structure

*Question:* Does the structure hold when a person tries to use it?

*Default artifact:* selected by the product's shape. Where the product is few surfaces that change dynamically
in place, the default is a **wireflow**; where it is many discrete largely static pages, the default is page
wireframes plus a site map. This file states the rule; the run's own skill states which side of it the product
falls on.

The default is a default, not a mandate: a run may choose page wireframes and a site map, and records why the
product's shape differs from the stated condition. What it may not do is skip the rung.

*Done-condition:* the structure supports the flows without a dead end, a hidden state, or an unreachable
required action.

*Closing evidence:* an iteration round with representative users on the structure, with findings recorded and
the design record revised before the artifact. This round is **iteration evidence, not acceptance evidence**.

### `DESK-RUNG-7` — High-fidelity presentation

*Question:* Do hierarchy and affordance read correctly with real content and every state present?

*Default artifact:* the rung-6 artifact carried to high visual and content fidelity, holding real content and
all applicable states.

*Done-condition:* hierarchy, affordance, and state distinction are legible with real content, and every state
named in the design record is present.

*Closing evidence:* heuristic review plus component-level checks. This rung's artifact is a static simulation,
so it may not be offered as behavioral or accessibility evidence.

### `DESK-RUNG-8` — Interactive prototype

*Question:* Can the task be completed unaided, at a realistic response speed?

*Default artifact:* an interactive prototype plus its prototype specification.

*Done-condition:* representative users complete the task unaided, and the failures they hit are the ones the
design record already anticipated and handles.

*Closing evidence:* a round with representative users on this run's own post-approval artifact, **per claimed
surface or delivery target the run declares**, covering every applicable dimension in the observation set,
with observations separated from interpretation and claims bounded to the evidence. The method, the sample,
and the claim boundary are derived from the question, the diversity of the affected people, the uncertainty,
the impact, and the risk — never from a fixed participant count. This is the rung whose evidence the run's own
skill makes the acceptance evidence, at its direct-evidence floor; that floor is also what states which axis
the run's claimed targets are.

> **The observation set has one home, and it is not here.** The complete dimension set and its count are
> stated once, by the run's own skill's direct-evidence floor — the same floor that makes this rung's evidence
> the acceptance evidence. This rung requires coverage of **every applicable dimension that floor names** and
> enumerates none of them itself, because a set enumerated twice drifts.

## The Build terminus

**Build.** No question, no default artifact, no validator, and no position on any fidelity axis. It is entered
only from a resolved rung register and a passed design-acceptance gate, and it is owned by the construction
phases of the run's own skill rather than by this ladder. It is named here so the rung count carries no
ambiguity: Build is the terminus the ladder feeds, not a tenth rung.

## Validation methods

### Card sorting, then tree testing

The two methods are not interchangeable, and their order is part of the rung contract.

| Method | Kind | What it produces | Participants |
|---|---|---|---|
| Card sorting | generative — participants group labeled cards by their own criteria | users' own mental model and grouping vocabulary | about 15 qualitative, or 30–50 quantitative, with 30–50 cards |
| Tree testing | evaluative — users locate features in a given hierarchy | success rate and directness; needs no visual design or content | about 5 qualitatively |

Order: card sort to **generate** the structure at `DESK-RUNG-2`, then tree test to **validate** it at
`DESK-RUNG-2` and again at `DESK-RUNG-3`. For validating a structure that already exists, tree testing is the
recommended choice over a closed card sort. Running only a card sort leaves the structure ungraded; running
only a tree test grades a structure the users never shaped.

### Round cadence

Zero users give zero insights; one user reveals roughly 31% of problems; five reach roughly 85%; past the
fifth user in one round the marginal return is spent. The prescription is therefore to divide the budget:
rather than one fifteen-user study, run three rounds of five, because each round's fixes expose the deeper
problems the surface defects were masking.

Mapped onto the ladder: a round at `DESK-RUNG-6`, fix, a round at `DESK-RUNG-8`, fix. The tree-test rounds at
`DESK-RUNG-2` and `DESK-RUNG-3` run at about five participants qualitatively; the card sort at `DESK-RUNG-2`
needs its own larger sample, above.

**The five-user figure is an iteration heuristic and never an acceptance threshold.** No participant count
stated here sets an acceptance bar. The run's own skill's direct-evidence floor owns that question, and it
sets no fixed count.

## Deliverable definitions

Each name below has its own established definition. That is why these are separate rungs rather than fidelity
settings on a single artifact.

- **wireframe** — an outline of structure and functionality, produced before visual design.
- **mockup** — a static high-fidelity simulation including visual design detail.
- **prototype** — an early version for testing and validating ideas and functionality.
- **wireflow** — wireframe-style layout combined with a simplified flowchart-like representation of the
  interactions between those layouts.
- **user flow** — the typical steps needed to accomplish a common task.
- **hierarchical task-analysis diagram** — a graphical breakdown of a user process into tasks.
- **paper prototype** — a low-cost research tool sketching concepts for user testing.
- **site map** — a visual representation of content organization.
- **storyboard** — images in sequential panels, chronologically mapping the main events.

### Two senses of `skeleton`, and which one each rung means

Both senses are legitimate, both are in use, and no inflection of the word is prohibited.

- **The structural sense — a design artifact.** The whole surface-neutral hierarchy, state, and path map,
  produced and approved *before* any local detail. This is `DESK-RUNG-5`.
- **The code sense — a construction artifact.** Stub modules and empty bodies, produced *after* design
  acceptance and verified by a compiler. This belongs to the construction phases the Build terminus feeds,
  not to any rung.

Each rung's own *Default artifact* field says which deliverable it means, so nothing depends on a reader
disambiguating the word. **What no rung does is call a visual deliverable a skeleton:** a wireflow, a mockup,
and an interactive prototype are the visual deliverables at rungs 6 through 8, and they are neither sense of
the word.
