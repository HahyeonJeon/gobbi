---
name: ideation
description: "MUST load when discussing a problem and exploring how to address it with the user. Ideation is an operation skill for understanding the problem, defining its boundaries, and developing an evidence-backed design through discussion."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Ideation

Use this skill to turn a user trigger into a complete, evidence-backed design through three phases: define and freeze the problem and requirements in `requirements.md`, study internal and external materials and freeze a project-specific discussion tree in `topics.md`, then resolve that tree with the user in `ideation.md`. The first two documents are immutable supporting drafts after approval; the approved `ideation.md` is the final authority, supersedes both drafts, and returns with them as one independently readable Ideation result.

## Principles

### Question the user without hesitation until the idea is complete

An incomplete idea is a set of open topics, not a specification to fill by assumption. Question the user directly until every material gap or contradiction is answered, explicitly deferred, or removed from scope. Persistent questioning should remain relevant, evidence-backed, and respectful.

### Study trustworthy prior art before designing

Good ideas begin with proven solutions, not a blank page. Study established project patterns and trustworthy external prior art, judge each reference by its authority, relevance, currency, and applicability, and use the strongest fit as the baseline. Combine lessons or deviate only when the current problem or constraints require it.

### Discuss the design through a hierarchy of topics

A design discussion is a tree of topics rooted in the user's problem and desired outcome. Derive the tree from internal materials and trustworthy external references, then resolve parent topics before their children and reconcile sibling branches before moving deeper. When later learning changes the hierarchy, update the final tree in `ideation.md` and reopen the affected branches without editing the frozen `topics.md`.

### Find the best idea by comparing reference-backed alternatives

The first idea is a candidate, not the answer. Compare it with genuinely different, reference-backed alternatives by their pros, cons, and fit with the user's outcome and constraints. Use the comparison to improve or replace the leading idea, then explain why the best-supported idea wins and what would change the recommendation.

## Rules

### Must-Follow

- **MUST preserve material user authority.** The user decides material scope, success criteria, design direction, destructive implications, external dependencies or services, and whether a material assumption may constrain the design.
- **MUST complete Ideation from this operation and its owned companions.** Do not require another skill or outside procedure to supply a missing decision, evidence, completion, or evaluation method.

### Must-Not-Follow

- **NEVER change the accepted contract silently.** Any change to approved scope, decisions, constraints, or obligations requires new evidence, explicit user approval, and a recorded consequence.

## Procedure

### Phase 1 — Define Requirements and Problems

#### 1.1 Establish the discussion context

Inspect the user trigger, current project state, governing materials, prior decisions, prior attempts, direct evidence, active scope, and known contradictions. Identify whether the user is shaping a product, feature, system, architecture, process, implementation change, or another design outcome. Summarize what is known, uncertain, or conflicting, and use that context to choose the first question; do not draft requirements yet.

#### 1.2 Define the target, purpose, and problem

Question the user about the intended outcome, trigger, current reality, observed symptoms, underlying problem or opportunity, consequences, current approach, strongest credible do-nothing outcome, and why action matters now. Ask one focused question at a time, show the relevant context before the question, and follow each answer until it is concrete enough to distinguish fact, user report, assumption, contradiction, decision, and open question.

#### 1.3 Define the scope and rough result

Discuss the rough result the user expects and what it must do for every affected person or actor. Define its intended form, desired outcomes, high-level capabilities, observable behavior, inputs and outputs, boundaries the change may cross, and what must remain unchanged. Classify work as in scope, out of scope, deferred, or rejected; when the target is an implementation change, describe the rough external result and integration boundary without prescribing ordered implementation tasks or an internal solution.

Keep questioning until the target, scope, and rough result state what must be achieved, for whom, what kind of result is expected, and where the obligation stops. The rough result does not need settled constraints, conventions, internal structure, or other detailed design: Phase 2 specifies those dimensions as topics, and Phase 3 determines them with the user. If the discussion introduces such a detail, do not add it to the Phase 1 contract.

#### 1.4 Draft `requirements.md`

Create `requirements.md` from [the requirements template](templates/requirements.md) using the discussion so far. Classify every material statement as a fact, user report, assumption, contradiction, decision, or open question, and make the draft independently readable and solution-neutral.

#### 1.5 Reconcile and review the requirements

Present the complete draft to the user and review the target, scope, and rough result for conflicts, omissions, inaccurate interpretations, hidden solution choices, and unclear boundaries. Ask the user to correct the draft, then revise it and repeat the review until every material target, purpose, problem, actor, desired outcome, rough-result expectation, scope inclusion, exclusion, deferral, rejection, and observable boundary is explicit. Close the phase only when `requirements.md` defines what to do, why, and the rough result expected without deciding the detailed design.

#### 1.6 Approve and freeze `requirements.md`

Add the lifecycle notice: approval freezes the whole file; later corrections belong only in `ideation.md`; and approval of the final `ideation.md` automatically supersedes this supporting draft. Obtain the user's explicit approval, then freeze the entire file without adding an approval stamp or making any later byte change. Do not start Phase 2 until the approved requirements contract is frozen; if later evidence invalidates it, preserve the file and record the correction, evidence, user decision, and consequence in `ideation.md`.

### Phase 2 — Study Materials and Prepare Topics

#### 2.1 Study internal materials

Build an initial provisional topic inventory by studying the project documents, code, configuration, history, prior decisions, established patterns, counterexamples, and negative results that bear on the frozen target, scope, and rough result. Judge each material while reading it by its stable location, authority, relevance, currency, applicability, and licensing when reuse may be affected; compare related materials to expose contradictions; and classify each lesson as a candidate, an inapplicable rejection, or an uncertainty.

Translate every applicable lesson or unresolved contradiction into the design-decision topics Phase 3 must determine, including constraints, preferences, conventions, qualities, behaviors, interfaces, data and state concerns, operational needs, failure paths, and other open details. For each topic, record the question, why it matters to the target, scope, or rough result, its internal source basis, known alternatives, affected actors, dependencies, decision owner, and completion condition. Merge duplicate questions, keep conflicting evidence visible, and do not treat an existing project pattern as an already selected answer. Do not target a fixed number of internal materials; stop when every project-grounded design dimension has a provisional topic or an inspected not-applicable reason.

#### 2.2 Study external materials

Complete and challenge the provisional topic inventory by studying trustworthy prior art, maintained standards, proven approaches, genuine alternatives, and documented failure lessons that bear on the frozen target, scope, rough result, and internally identified topics. Judge each source while reading it by its link or stable location, authority, relevance, currency, applicability, and licensing when reuse may be affected; compare it with internal findings and other external sources; and classify each lesson as a candidate, an inapplicable rejection, or an uncertainty.

Use the comparison to add missing topics, split compound questions, merge equivalent questions, expose contradictions and trade-offs, add genuine alternatives, and remove inapplicable topics with a recorded reason. Complete each retained topic's relevance, source basis, alternatives, affected actors, dependencies, decision owner, and completion condition without choosing an answer. Do not target a fixed number of external materials; stop when the topic inventory covers every applicable design dimension, each material topic has an adequate internal or external foundation, and a missing-alternative search finds no material gap.

#### 2.3 Build and audit the topic hierarchy

Create `topics.md` from [the topics template](templates/topics.md), and organize the completed provisional inventory into a project-specific hierarchy derived from the frozen requirements and studied materials rather than a fixed taxonomy. Render one ASCII `text` tree and matching Markdown headings; for each topic, record its purpose, parent, dependencies, connected requirements by exact descriptive heading, source basis, discussion questions, genuine alternatives, and completion condition.

Order the discussion parent-first and expose dependencies and cross-topic conflicts. Audit the hierarchy for every applicable concern across actors; boundaries and interfaces; state and data; resource use; failure and recovery; trust and governance; inclusion and locale; compatibility and reversal; and evidence, risk, and validation. Record an inspected not-applicable reason for each concern that does not belong, and continue study or topic preparation while any material source conflict or coverage gap remains.

#### 2.4 Approve and freeze `topics.md`

Add the lifecycle notice: `topics.md` is a discussion agenda rather than a live tracker; approval freezes the whole file; later sources, corrected requirements, and emergent topics belong only in `ideation.md`; and approval of the final `ideation.md` automatically supersedes this supporting draft. Obtain the user's explicit approval, then freeze the entire file without adding an approval stamp or making any later byte change. Do not start Phase 3 until the frozen topic agenda independently explains its study foundation and complete discussion tree.

### Phase 3 — Discuss the Topics Hierarchically

#### 3.1 Initialize the final document

Create `ideation.md` from [the final Ideation template](templates/ideation.md). Copy the complete frozen problem and requirements contract and the prepared topic tree into it so the final document does not depend on the supporting drafts for meaning. Mark it as the evolving final authority until final approval.

#### 3.2 Traverse the topic hierarchy

Resolve parent topics before their children, reconcile siblings before closing their parent, and keep dependent topics open while an ancestor decision is unresolved. Ask every relevant question needed to complete the idea. When a child contradicts an ancestor or new evidence invalidates an earlier decision, reopen the earliest affected branch, obtain the required user decision, and propagate the consequence through its descendants without editing either frozen draft.

#### 3.3 Determine each design topic

1. state the question, connected requirements, current context, and trustworthy evidence;
2. compare genuinely different reference-backed alternatives, including doing nothing when credible, by pros, cons, fit, risks, and consequences;
3. recommend the best-supported option and state what evidence would change the recommendation;
4. obtain the user's decision whenever the Rules reserve authority to the user; and
5. record the selection, rationale, rejected alternatives, trade-offs, resulting design, and reopen condition.

Use this decision process to refine the rough result and determine its applicable constraints, preferences, conventions, qualities, behaviors, interfaces, data and state design, operational needs, failure paths, and other details. Reject alternatives that exceed the approved scope, and do not treat any candidate from Phase 2 as already decided.

#### 3.4 Incorporate later learning

Continue study whenever a decision needs more evidence, and assess every late source through the Phase 2 source fields. Put corrected requirements and emergent topics only in `ideation.md`; place each emergent topic under the correct parent, mark it as added during discussion, and update the final ASCII tree and matching headings. Preserve decision synthesis rather than a conversational transcript.

#### 3.5 Develop the integrated design

Cover every applicable actor and responsibility; boundary, component, ownership, and interface; information, data, and state flow; normal, alternative, invalid, failure, and recovery path; performance and resource obligation; trust, governance, privacy, security, accessibility, locale, compatibility, migration, rollback, operation, and maintenance concern; and assumption, risk, evidence gap, and validation commitment. Assign one owner to each concern, keep interfaces consumer-readable and dependencies acyclic, contain dependency failure, and expose verification seams.

#### 3.6 Define future validation

Separate existing evidence from proposed future validation. Never represent a planned walkthrough, prototype, experiment, code spike, benchmark, or user study as completed evidence. For each validation commitment, record the question, method or artifact, participants or environment, pass and fail signals, owner, execution condition, and reopen condition.

#### 3.7 Audit the three-document candidate

- list every change from the supporting drafts, with its evidence, user approval when material, affected branches, and consequence;
- trace requirements, sources, topics, decisions, resulting design, risks, and validation by exact descriptive heading paths rather than artificial identifiers;
- use [scenarios.md](scenarios.md) and [checklists.md](checklists.md) to confirm every applicable design obligation is present and testable;
- read all three documents independently as a cold reader and remove hidden context, placeholders, unsupported conclusions, unresolved material decisions, and broken links; and
- confirm that the result contains no ordered implementation tasks, implementation diff, produced realization output, or silently chosen design decision.

#### 3.8 Evaluate, approve, and return the result

Evaluate the exact three-document candidate through [evaluation.md](evaluation.md) while `ideation.md` remains evolving and its authority remains contingent. Reopen the earliest affected operation and run a fresh complete evaluation after every material revision, without changing either frozen supporting draft. After evaluation passes, obtain the user's approval of `ideation.md`; return `requirements.md`, `topics.md`, and `ideation.md` together, with `ideation.md` authoritative and both supporting drafts automatically superseded.

## References

- [Requirements template](templates/requirements.md)
- [Topics template](templates/topics.md)
- [Final Ideation template](templates/ideation.md)
