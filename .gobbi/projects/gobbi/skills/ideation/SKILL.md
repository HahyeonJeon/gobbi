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

#### 1.2 Discuss the purpose and current problem

Question the user about the intended outcome, trigger, current reality, observed symptoms, underlying problem or opportunity, consequences, current approach, strongest credible do-nothing outcome, and why action matters now. Ask one focused question at a time, show the relevant context before the question, and follow each answer until it is concrete enough to distinguish fact, user report, assumption, contradiction, decision, and open question.

#### 1.3 Elicit outcome and behavior requirements

Question the user about every affected person or actor, their desired outcomes, required capabilities, observable behaviors, inputs and outputs, data and state changes, interfaces, integrations, and normal, alternative, invalid, failure, and recovery paths. When the subject is an implementation change, capture the required external behavior, integration boundaries, and compatibility outcome without prescribing ordered implementation tasks. Keep questioning until each requirement states what the result must accomplish and how a reader could recognize that outcome.

#### 1.4 Elicit quality and operational requirements

Discuss every applicable quality across performance and scale; reliability and availability; security, privacy, and access; accessibility and locale; compatibility, migration, and rollback; observability and diagnosis; deployment and operation; and maintenance and ownership. For each applicable quality, identify its required condition, relevant boundary, and acceptance signal. Record an inspected not-applicable reason when a material quality does not belong.

#### 1.5 Define constraints, scope, authority, and acceptance

Discuss hard constraints, soft preferences, platform or runtime constraints, permitted and prohibited dependencies, active-work overlap, compatibility promises, and other implementation conditions that genuinely restrict the design. Define in-scope, out-of-scope, deferred, and rejected work; identify who owns each material decision; and agree observable success, failure, falsification, acceptance, and stop signals. Keep questioning until the user can distinguish required outcomes and hard constraints from preferences and candidate solutions.

#### 1.6 Challenge assumptions and proposed mechanisms

Test each material assumption against the available evidence and ask the user to resolve any unsupported premise that would constrain the design. Challenge each requested mechanism against the underlying problem: treat it as a binding requirement only when inspected evidence proves it is a hard constraint; otherwise keep it as an unselected candidate for Phase 3. Do not infer missing requirements or accept a proposed solution as a substitute for defining the problem.

#### 1.7 Reconcile and close the requirements discussion

Review the complete requirement set for conflicts, omissions, hidden dependencies, and incompatible acceptance conditions. Ask the user to resolve or prioritize competing requirements and continue the discussion until every material assumption, contradiction, open question, and boundary is answered, explicitly deferred, rejected, or removed from scope. Close the discussion only when the contract covers the intended outcome, required behavior, applicable qualities, constraints, authority, scope, and acceptance conditions without embedding an unproven solution.

#### 1.8 Draft and review `requirements.md`

Create `requirements.md` from [the requirements template](templates/requirements.md) using the completed discussion. Classify every material statement as a fact, user report, assumption, contradiction, decision, or open question, and make the document independently readable and solution-neutral. Present the complete draft to the user, discuss corrections, and revise it until the document accurately represents the agreed problem, requirements, and boundaries.

#### 1.9 Approve and freeze `requirements.md`

Add the lifecycle notice: approval freezes the whole file; later corrections belong only in `ideation.md`; and approval of the final `ideation.md` automatically supersedes this supporting draft. Obtain the user's explicit approval, then freeze the entire file without adding an approval stamp or making any later byte change. Do not start Phase 2 until the approved requirements contract is frozen; if later evidence invalidates it, preserve the file and record the correction, evidence, user decision, and consequence in `ideation.md`.

### Phase 2 — Study Materials and Prepare Topics

#### 2.1 Study internal materials

After `requirements.md` freezes, inspect the relevant project documents, code, configuration, history, prior decisions, established patterns, counterexamples, and negative results. Connect each material finding to the frozen requirements it informs.

#### 2.2 Study external materials

Inspect trustworthy prior art, maintained standards, proven approaches, genuine alternatives, and documented failure lessons that bear on the frozen requirements. Do not generate the topic hierarchy until both internal and external study have been performed.

#### 2.3 Assess the study materials

For every material source, record its link or stable location, claimed authority, relevance, currency, applicability, and licensing when reuse may be affected. Classify its lessons as adopted, rejected as inapplicable, or uncertain, and record contradictions and useful negative results. Use no source-count target; continue study until every material requirement has an adequate foundation.

#### 2.4 Build and audit the topic hierarchy

Create `topics.md` from [the topics template](templates/topics.md). Derive a project-specific hierarchy from the frozen requirements and studied materials rather than importing a fixed taxonomy. Render one ASCII `text` tree and matching Markdown headings; for each topic, record its purpose, parent, dependencies, connected requirements by exact descriptive heading, source basis, discussion questions, genuine alternatives, and completion condition.

Order the discussion parent-first and expose dependencies and cross-topic conflicts. Audit the hierarchy for every applicable concern across actors; boundaries and interfaces; state and data; resource use; failure and recovery; trust and governance; inclusion and locale; compatibility and reversal; and evidence, risk, and validation. Record an inspected not-applicable reason for each concern that does not belong, and continue study or topic preparation while any material source conflict or coverage gap remains.

#### 2.5 Approve and freeze `topics.md`

Add the lifecycle notice: `topics.md` is a discussion agenda rather than a live tracker; approval freezes the whole file; later sources, corrected requirements, and emergent topics belong only in `ideation.md`; and approval of the final `ideation.md` automatically supersedes this supporting draft. Obtain the user's explicit approval, then freeze the entire file without adding an approval stamp or making any later byte change. Do not start Phase 3 until the frozen topic agenda independently explains its study foundation and complete discussion tree.

### Phase 3 — Discuss the Topics Hierarchically

#### 3.1 Initialize the final document

Create `ideation.md` from [the final Ideation template](templates/ideation.md). Copy the complete frozen problem and requirements contract and the prepared topic tree into it so the final document does not depend on the supporting drafts for meaning. Mark it as the evolving final authority until final approval.

#### 3.2 Traverse the topic hierarchy

Resolve parent topics before their children, reconcile siblings before closing their parent, and keep dependent topics open while an ancestor decision is unresolved. Ask every relevant question needed to complete the idea. When a child contradicts an ancestor or new evidence invalidates an earlier decision, reopen the earliest affected branch, obtain the required user decision, and propagate the consequence through its descendants without editing either frozen draft.

#### 3.3 Resolve each material decision

1. state the question, connected requirements, current context, and trustworthy evidence;
2. compare genuinely different reference-backed alternatives, including doing nothing when credible, by pros, cons, fit, risks, and consequences;
3. recommend the best-supported option and state what evidence would change the recommendation;
4. obtain the user's decision whenever the Rules reserve authority to the user; and
5. record the selection, rationale, rejected alternatives, trade-offs, resulting design, and reopen condition.

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
