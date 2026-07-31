---
name: ideation
description: "MUST load when discussing a problem and exploring how to address it with the user. Ideation is an operation skill for understanding the problem, defining its boundaries, and developing an evidence-backed design through discussion."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Ideation

Use this skill to turn a user trigger into a complete, evidence-backed design through three phases: define the problem and requirements in `requirements.md`, study internal and external materials and prepare a project-specific discussion tree in `topics.md`, then resolve and integrate that tree in `ideation.tmp.md`, develop the integrated design, and create `ideation.md`. The temporary file is a working record rather than a returned artifact; the first two returned documents preserve the completed Phase 1 and Phase 2 results, and `ideation.md` consolidates the final Ideation result as one independently readable design.

Ideation always creates and self-reviews its complete artifact set, then performs independent evaluation
before returning.

## Principles

### Question the user without hesitation until the idea is complete

An incomplete idea is a set of open topics, not a specification to fill by assumption. Question the user directly until every material gap or contradiction is answered, explicitly deferred, or removed from scope. Persistent questioning should remain relevant, evidence-backed, and respectful.

### Study trustworthy prior art before designing

Good ideas begin with proven solutions, not a blank page. Study established project patterns and trustworthy external prior art, judge each reference by its authority, relevance, currency, and applicability, and use the strongest fit as the baseline. Combine lessons or deviate only when the current problem or constraints require it.

### Discuss the design through a hierarchy of topics

A design discussion is a tree of topics rooted in the user's problem and desired outcome. Derive the tree from internal materials and trustworthy external references, then resolve parent topics before their children and reconcile sibling branches before moving deeper. When later learning changes the hierarchy, update the final tree in `ideation.md` and reopen the affected branches without editing the preserved `topics.md`.

### Find the best idea by comparing reference-backed alternatives

The first idea is a candidate, not the answer. Compare it with genuinely different, reference-backed alternatives by their pros, cons, and fit with the user's outcome and constraints. Use the comparison to improve or replace the leading idea, then explain why the best-supported idea wins and what would change the recommendation.

## Rules

### Must-Follow

- **MUST preserve material user authority.** The user decides material scope, success criteria, design direction, destructive implications, external dependencies or services, and whether a material assumption may constrain the design.
- **MUST complete artifact creation, self-review, and independent evaluation from this operation and its owned
  companions.** Perform the separate independent review inline before returning the result.
- **MUST stop Ideation at the design boundary.** Return requirements, topics, and an integrated design without ordered implementation tasks, implementation diffs, or produced realization output.

### Must-Not-Follow

- **NEVER change the accepted contract silently.** Any change to established scope, decisions, constraints, or obligations requires new evidence, an explicit user decision, and a recorded consequence.

## Procedure

### Phase 1 — Define Requirements and Problems

#### 1.1 Establish the discussion context

- Inspect the user trigger, current project state, governing materials, prior decisions, prior attempts, direct evidence, active scope, and known contradictions.
- Identify whether the user is shaping a product, feature, system, architecture, process, implementation change, or another design outcome.
- Summarize what is known, uncertain, or conflicting, and use that context to choose the first question.
- Do not draft requirements yet.

#### 1.2 Define the target, purpose, and problem

- Ask the user about the intended outcome, trigger, current reality, observed symptoms, underlying problem or opportunity, consequences, current approach, strongest credible do-nothing outcome, and why action matters now.
- Show the relevant context before each question and ask one focused question at a time.
- Follow each answer until its meaning, basis, and material uncertainty are clear enough to use without assumption.

#### 1.3 Define the scope and result

- Ask the user to describe the result and what it must do for every affected person or actor.
- Define the intended form, desired outcomes, high-level capabilities, observable behavior, inputs and outputs, permitted boundaries, and unchanged behavior.
- Classify work as in scope, out of scope, deferred, or rejected.
- Describe only the external result and integration boundary for an implementation target, without prescribing ordered tasks or an internal solution.
- Continue questioning until the target, scope, and result state what must be achieved, for whom, what kind of result is expected, and where the obligation stops.
- Leave constraints, conventions, preferences, internal structure, and other design details for Phase 2 to specify as topics and Phase 3 to determine with the user.

#### 1.4 Draft `requirements.md`

- Create `requirements.md` from [the requirements template](templates/requirements.md) using the completed discussion.
- Keep each material claim at one semantic owner, attribute user reports, cite inspected facts, and state uncertainty where it affects the goal, problem, result, requirements, or scope.
- Write each material requirement under a descriptive heading with one solution-neutral outcome, its affected actors, its basis, and its observable result.
- Give each material outcome and user-named surface one `Included`, `Excluded`, `Deferred`, or `Rejected` scope status with a reason.
- Record only nonblocking design or study questions under `Open Questions`, and connect each question to the section its answer may refine.
- Make the draft independently readable and solution-neutral.

#### 1.5 Reconcile and review the requirements

- Present the complete draft to the user.
- Review the target, scope, and result for conflicts, omissions, inaccurate interpretations, hidden solution choices, and unclear boundaries.
- Ask the user to correct the draft and resolve every material disagreement.
- Revise the draft and repeat the review until every goal, problem, actor, desired outcome, result expectation, requirement, scope inclusion, exclusion, deferral, rejection, observable boundary, and open question is explicit.
- Resolve every question that could change the goal, problem, result, requirements, or scope, and retain only questions whose answers can refine the later design without changing the Phase 1 contract.
- Close the phase only when `requirements.md` defines what to do, why, and the expected result without deciding the detailed design.

#### 1.6 Complete and preserve `requirements.md`

- Verify that the complete file satisfies Step 1.5 and contains no unresolved question that could change the requirements contract.
- Preserve the completed file as the Phase 1 supporting result without making later byte changes.
- Do not start Phase 2 until the requirements contract is complete and preserved.
- If later evidence invalidates the supporting result, record the correction, evidence, user decision, and consequence in `ideation.md` without editing `requirements.md`.

### Phase 2 — Study Materials and Prepare Topics

#### 2.1 Draft top-level topics from Phase 1 results

- Review the completed goal, problem, result, requirements, scope, and open questions in `requirements.md`.
- Identify the top-level questions that must be answered to turn the result into a coherent design.
- Draft one provisional top-level topic for each distinct decision area without choosing an answer or importing a fixed taxonomy.
- Write the complete initial topic draft to `topics.tmp.md`.

#### 2.2 Update topic by studying internal materials

- Read `topics.tmp.md` as the topic draft to update.
- Study relevant project documents, code, configuration, history, decisions, patterns, counterexamples, and negative results against the completed Phase 1 results and provisional top-level topics.
- Update and refine the topics from the questions and design dimensions uncovered while studying the internal materials.
- Add each newly discovered detail beneath the top-level topic whose decision it informs.
- Annotate an internal answer only when a governing project rule, accepted prior decision, or established convention already determines it, and cite the material that establishes the answer.
- Write the complete internally updated topic draft back to `topics.tmp.md`.

#### 2.3 Update topic by studying external materials

- Read `topics.tmp.md` as the topic draft to update.
- Study trustworthy prior art, standards, proven approaches, genuine alternatives, and failure lessons against the completed goal, result, requirements, scope, open questions, and provisional topics.
- Update and refine the topics from the questions, alternatives, trade-offs, and design dimensions uncovered while studying the external materials.
- Write the complete externally updated topic draft back to `topics.tmp.md`.

#### 2.4 Revise and supplement the topic draft

- Read `topics.tmp.md` as the complete draft produced by the internal and external study passes.
- Compare the draft with the completed requirements and studied materials to identify missing topics, weak questions, shallow source support, incomplete alternatives or trade-offs, unresolved contradictions, duplicate topics, and uncovered dependencies.
- Perform targeted additional internal or external study when more study can close a material gap.
- When a gap cannot be closed through study but enough is known to compare options safely, turn it into a topic that states the uncertainty, its effect, the decision question, and the supported options.
- When missing context prevents safe, decision-ready options, pause Phase 2 and ask the user for the missing context, authority, or scope change.
- Revise weak topics, add missing topics or subtopics, merge duplicates, and route unresolved contradictions into the affected discussion topics.
- Repeat the review, study, revision, and supplementation until every material gap is resolved or represented by a decision-ready topic.
- Write the complete revised and supplemented topic draft back to `topics.tmp.md`.

#### 2.5 Build and audit the topic hierarchy

- Read `topics.tmp.md` and verify that every topic is traceable to its Phase 1, internal, or external basis.
- Create `topics.md` from [the topics template](templates/topics.md) using `topics.tmp.md` as the current inventory.
- Organize the current inventory into a project-specific hierarchy derived from the completed requirements and studied materials rather than a fixed taxonomy.
- Render one ASCII `text` tree whose problem-and-outcome root is a visual label rather than a topic, and give every topic node below it a matching Markdown heading.
- Record each topic's purpose, parent, dependencies, connected requirements by exact descriptive heading, sources, questions, genuine options with their relevant pros, cons, and fit, and done condition.
- Order the hierarchy for parent-first discussion and expose dependencies and cross-topic conflicts.
- Audit actors, boundaries, interfaces, state, data, resources, failures, recovery, trust, governance, inclusion, locale, compatibility, reversal, evidence, risk, and validation for applicable topics.
- Record an inspected not-applicable reason for every concern that does not belong.
- Return to Step 2.4 while a material concern remains uncovered or an unresolved gap lacks safe, decision-ready options.

#### 2.6 Complete and preserve `topics.md`

- Verify that `topics.md` independently explains its study foundation and complete discussion tree as an agenda rather than a live tracker.
- Preserve the completed file as the Phase 2 supporting result without making later byte changes.
- Delete `topics.tmp.md` only after the completed `topics.md` has been verified.
- Do not start Phase 3 until the topic agenda is complete and preserved.

### Phase 3 — Discuss the Topics Hierarchically

#### 3.1 Initialize the temporary discussion record

- Create `ideation.tmp.md` as the editable working record for Phase 3 with separate `Discussion Records` and `Integrated Decisions` sections.
- Copy the complete preserved problem, requirements contract, and prepared topic tree into it as discussion context.
- State that the file temporarily records discussions and decisions and will not be returned.
- Do not create `ideation.md` until Step 3.4 completes the integrated design.

#### 3.2 Traverse and resolve the topic hierarchy

- Start at the first top-level topic below the visual root and traverse parent before child while keeping every child or dependent topic open until its ancestors are resolved.
- State the current topic's question, connected requirements, ancestor decisions, context, and trustworthy evidence.
- Ask the user to choose through a decision-ready question that presents the alternatives as options, places the best-supported option first as the recommendation, explains why it is recommended, and states what evidence would change the recommendation.
- Discuss the user's response and revise the alternatives and recommendation, performing targeted additional study only when the discussion exposes an evidence gap.
- Ask another decision-ready question when the choice remains unresolved, and repeat the discussion, revision, and conditional study until the user makes the required decision or explicitly defers it.
- Temporarily record the discussion and decision under `Discussion Records` in `ideation.tmp.md` with its selection, rationale, rejected alternatives, trade-offs, resulting design, reopen condition, corrected requirements, emergent topics under their correct parents, affected descendants, sibling reconciliation, and reopened branches.
- Move to the next topic only after the current topic is resolved, explicitly deferred, or reopened at the correct ancestor, and repeat the complete topic-resolution cycle until every topic in the evolving hierarchy is resolved or explicitly deferred.
- Treat no Phase 2 candidate as already decided, and never edit either preserved supporting draft.

#### 3.3 Integrate the discussions and decisions

- Read the complete discussion and decision record in `ideation.tmp.md` against the preserved requirements, study foundation, and topic hierarchy.
- Group the temporary records by topic in parent-first order and keep every discussion round about the same choice together.
- Consolidate each topic's rounds into one current decision record containing its question, connected requirements, evidence, alternatives, recommendation, status, selection or deferral, rationale, rejected alternatives, trade-offs, resulting design, consequences, and reopen condition.
- Return every material conflict, reopened topic, or unresolved user choice to Step 3.2, record the resulting discussion and decision in `ideation.tmp.md`, and restart integration.
- Merge duplicate records, reconcile compatible decisions, connect dependent decisions, propagate every parent decision or correction through affected children and sibling branches, and expose contradictions, omissions, stale conclusions, and unresolved consequences without resolving them by assumption.
- After the integrated decision set is coherent, write the complete parent-first decision synthesis, corrected requirements, and emergent topics under their correct parents to `Integrated Decisions` in `ideation.tmp.md` without removing material discussion evidence.
- Treat the integrated temporary record as an evolving input to design development rather than a finalized result.

#### 3.4 Develop, refine, and record the integrated design

- Use `Integrated Decisions` in `ideation.tmp.md` as the basis for developing one coherent design from the target and outcomes through the topic hierarchy.
- Organize the integrated decisions, dependencies, consequences, corrections, and emergent topics into a coherent design structure and detailed behavior.
- Design the actors, responsibilities, boundaries, components, ownership, and interfaces required by the integrated decisions.
- Design information, data, and state flows for normal, alternative, invalid, failure, and recovery paths.
- Design the applicable performance and resource behavior together with trust, governance, privacy, security, accessibility, locale, compatibility, migration, rollback, operational, and maintenance obligations.
- When design development exposes a material topic or user choice, discuss it through Step 3.2, record the decision in `ideation.tmp.md`, reintegrate it through Step 3.3, and refine the design from the updated decisions until every integrated decision is expressed and no material design choice remains unresolved.
- Finalize `ideation.md` from [the final Ideation template](templates/ideation.md) with the preserved context, integrated decisions, corrected requirements, emergent topics, final topic tree, design, risks, and validation commitments.

#### 3.5 Audit and return or evaluate the result

- Self-review `requirements.md`, `topics.md`, `ideation.tmp.md`, and `ideation.md` against this operation and
  its templates. Correct every material omission, inconsistency, unresolved decision, broken link, or
  prohibited implementation output through the earliest affected step.
- Freeze all four files as one exact review subject and ask a fresh independent evaluator to review them
  without mutation. Present every material finding for disposition, apply only accepted corrections through
  the earliest affected step, freeze the revision as a new subject, and repeat until no material issue
  remains.
- Display a concise summary of the problem, scope, key decisions, integrated design, material trade-offs,
  risks, deferred items, and independent-evaluation state. Delete `ideation.tmp.md`, then return
  `requirements.md`, `topics.md`, and `ideation.md` together as the complete Ideation result.

## References

- [`requirements.md`](templates/requirements.md) defines the Phase 1 goal, problem, result, requirements, scope, and open questions.
- [`topics.md`](templates/topics.md) defines the Phase 2 study foundation, topic hierarchy, and discussion contract.
- [`ideation.md`](templates/ideation.md) defines the Phase 3 decision synthesis, integrated design, risks, validation commitments, and deferred ideas.
