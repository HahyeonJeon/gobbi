---
name: ideation
description: "MUST load when discussing a problem and exploring how to address it with the user. Ideation is an operation skill for understanding the problem, defining its boundaries, and developing an evidence-backed design through discussion."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Ideation

Use this skill to turn a user trigger into a complete, evidence-backed design through three phases: define and freeze the problem and requirements in `requirements.md`, study internal and external materials and freeze a project-specific discussion tree in `topics.md`, then resolve that tree with the user in `ideation.tmp.md` and integrate the discussions into `ideation.md`. The temporary file is a working record rather than a returned artifact; the first two returned documents are immutable supporting drafts after approval, and the approved `ideation.md` is the final authority that supersedes and returns with them as one independently readable Ideation result.

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

- Inspect the user trigger, current project state, governing materials, prior decisions, prior attempts, direct evidence, active scope, and known contradictions.
- Identify whether the user is shaping a product, feature, system, architecture, process, implementation change, or another design outcome.
- Summarize what is known, uncertain, or conflicting, and use that context to choose the first question.
- Do not draft requirements yet.

#### 1.2 Define the target, purpose, and problem

- Ask the user about the intended outcome, trigger, current reality, observed symptoms, underlying problem or opportunity, consequences, current approach, strongest credible do-nothing outcome, and why action matters now.
- Show the relevant context before each question and ask one focused question at a time.
- Follow each answer until it is concrete enough to classify as a fact, user report, assumption, contradiction, decision, or open question.

#### 1.3 Define the scope and rough result

- Ask the user to describe the rough result and what it must do for every affected person or actor.
- Define the intended form, desired outcomes, high-level capabilities, observable behavior, inputs and outputs, permitted boundaries, and unchanged behavior.
- Classify work as in scope, out of scope, deferred, or rejected.
- Describe only the rough external result and integration boundary for an implementation target, without prescribing ordered tasks or an internal solution.
- Continue questioning until the target, scope, and rough result state what must be achieved, for whom, what kind of result is expected, and where the obligation stops.
- Leave constraints, conventions, preferences, internal structure, and other design details for Phase 2 to specify as topics and Phase 3 to determine with the user.

#### 1.4 Draft `requirements.md`

- Create `requirements.md` from [the requirements template](templates/requirements.md) using the completed discussion.
- Classify every material statement as a fact, user report, assumption, contradiction, decision, or open question.
- Make the draft independently readable and solution-neutral.

#### 1.5 Reconcile and review the requirements

- Present the complete draft to the user.
- Review the target, scope, and rough result for conflicts, omissions, inaccurate interpretations, hidden solution choices, and unclear boundaries.
- Ask the user to correct the draft and resolve every material disagreement.
- Revise the draft and repeat the review until every target, purpose, problem, actor, desired outcome, rough-result expectation, scope inclusion, exclusion, deferral, rejection, and observable boundary is explicit.
- Close the phase only when `requirements.md` defines what to do, why, and the expected rough result without deciding the detailed design.

#### 1.6 Approve and freeze `requirements.md`

- Add a lifecycle notice stating that approval freezes the whole file, later corrections belong only in `ideation.md`, and final approval of `ideation.md` automatically supersedes this supporting draft.
- Obtain the user's explicit approval.
- Freeze the entire file without adding an approval stamp or making any later byte change.
- Do not start Phase 2 until the approved requirements contract is frozen.
- Preserve the frozen file if later evidence invalidates it, and record the correction, evidence, user decision, and consequence in `ideation.md`.

### Phase 2 — Study Materials and Prepare Topics

#### 2.1 Draft top-level topics from Phase 1 results

- Review the frozen target, purpose, problem, scope, and rough result in `requirements.md`.
- Identify the top-level questions that must be answered to turn the rough result into a coherent design.
- Draft one provisional top-level topic for each distinct decision area without choosing an answer or importing a fixed taxonomy.
- Write the complete initial topic draft to `topics.tmp.md`.

#### 2.2 Update topic by studying internal materials

- Read `topics.tmp.md` as the topic draft to update.
- Study relevant project documents, code, configuration, history, decisions, patterns, counterexamples, and negative results against the frozen Phase 1 results and provisional top-level topics.
- Update and refine the topics from the questions and design dimensions uncovered while studying the internal materials.
- Add each newly discovered detail beneath the top-level topic whose decision it informs.
- Annotate an internal answer only when a governing project rule, accepted prior decision, or established convention already determines it, and cite the material that establishes the answer.
- Write the complete internally updated topic draft back to `topics.tmp.md`.

#### 2.3 Update topic by studying external materials

- Read `topics.tmp.md` as the topic draft to update.
- Study trustworthy prior art, standards, proven approaches, genuine alternatives, and failure lessons against the frozen target, scope, rough result, and provisional topics.
- Update and refine the topics from the questions, alternatives, trade-offs, and design dimensions uncovered while studying the external materials.
- Write the complete externally updated topic draft back to `topics.tmp.md`.

#### 2.4 Revise and supplement the topic draft

- Read `topics.tmp.md` as the complete draft produced by the internal and external study passes.
- Compare the draft with the frozen requirements and studied materials to identify missing topics, weak questions, shallow source support, incomplete alternatives or trade-offs, unresolved contradictions, duplicate topics, and uncovered dependencies.
- Perform targeted additional internal or external study for every material gap that the existing sources cannot resolve.
- Revise weak topics, add missing topics or subtopics, merge duplicates, and preserve unresolved contradictions for discussion.
- Repeat the review, additional study, revision, and supplementation until no material topic gap remains.
- Write the complete revised and supplemented topic draft back to `topics.tmp.md`.

#### 2.5 Build and audit the topic hierarchy

- Read `topics.tmp.md` and verify that every topic is traceable to its Phase 1, internal, or external basis.
- Create `topics.md` from [the topics template](templates/topics.md) using `topics.tmp.md` as the current inventory.
- Organize the current inventory into a project-specific hierarchy derived from the frozen requirements and studied materials rather than a fixed taxonomy.
- Render one ASCII `text` tree with matching Markdown headings.
- Record each topic's purpose, parent, dependencies, connected requirements by exact descriptive heading, source basis, discussion questions, genuine alternatives, and completion condition.
- Order the hierarchy for parent-first discussion and expose dependencies and cross-topic conflicts.
- Audit actors, boundaries, interfaces, state, data, resources, failures, recovery, trust, governance, inclusion, locale, compatibility, reversal, evidence, risk, and validation for applicable topics.
- Record an inspected not-applicable reason for every concern that does not belong.
- Return to Step 2.4 while any material source conflict or coverage gap remains.

#### 2.6 Approve and freeze `topics.md`

- Add a lifecycle notice stating that `topics.md` is a discussion agenda rather than a live tracker.
- State that approval freezes the whole file, later sources and corrections belong only in `ideation.md`, and final approval of `ideation.md` automatically supersedes this supporting draft.
- Obtain the user's explicit approval.
- Freeze the entire file without adding an approval stamp or making any later byte change.
- Delete `topics.tmp.md` only after the frozen `topics.md` has been verified.
- Do not start Phase 3 until the frozen topic agenda independently explains its study foundation and complete discussion tree.

### Phase 3 — Discuss the Topics Hierarchically

#### 3.1 Initialize the temporary discussion record

- Create `ideation.tmp.md` as the editable working record for Phase 3.
- Copy the complete frozen problem, requirements contract, and prepared topic tree into it as discussion context.
- State that the file temporarily records discussions and decisions, is not final authority, and will not be returned.
- Do not create `ideation.md` until Step 3.3 integrates the completed discussion record.

#### 3.2 Traverse and resolve the topic hierarchy

- Start at the root topic and traverse parent before child while keeping every child or dependent topic open until its ancestors are resolved.
- State the current topic's question, connected requirements, ancestor decisions, context, and trustworthy evidence.
- Ask the user to choose through a decision-ready question that presents the alternatives as options, places the best-supported option first as the recommendation, explains why it is recommended, and states what evidence would change the recommendation.
- Discuss the user's response and revise the alternatives and recommendation, performing targeted additional study only when the discussion exposes an evidence gap.
- Ask another decision-ready question when the choice remains unresolved, and repeat the discussion, revision, and conditional study until the user makes the required decision or explicitly defers it.
- Temporarily record the discussion and decision in `ideation.tmp.md` with its selection, rationale, rejected alternatives, trade-offs, resulting design, reopen condition, corrected requirements, emergent topics under their correct parents, affected descendants, sibling reconciliation, and reopened branches.
- Move to the next topic only after the current topic is resolved, explicitly deferred, or reopened at the correct ancestor, and repeat the complete topic-resolution cycle until every topic in the evolving hierarchy is resolved or explicitly deferred.
- Treat no Phase 2 candidate as already decided, and never edit either frozen supporting draft.

#### 3.3 Integrate the discussions and decisions

- Read the complete discussion and decision record in `ideation.tmp.md` against the frozen requirements, study foundation, and topic hierarchy.
- Group the temporary records by topic in parent-first order and keep every discussion round about the same choice together.
- Consolidate each topic's rounds into one current decision record containing its question, connected requirements, evidence, alternatives, recommendation, status, selection or deferral, rationale, rejected alternatives, trade-offs, resulting design, consequences, and reopen condition.
- Merge duplicate records, reconcile compatible decisions, connect dependent decisions, propagate every parent decision or correction through affected children and sibling branches, and expose contradictions, omissions, stale conclusions, and unresolved consequences without resolving them by assumption.
- Return every material conflict, reopened topic, or unresolved user choice to Step 3.2, record the resulting discussion and decision in `ideation.tmp.md`, and restart integration.
- After the integrated decision set is coherent, create or update `ideation.md` from [the final Ideation template](templates/ideation.md) with the complete frozen context, integrated decision synthesis, corrected requirements, and emergent topics under their correct parents.
- Compare the integrated draft with `ideation.tmp.md`, add every omitted material record, align the final ASCII tree with its headings, make the document independently readable, and mark it as the evolving final authority until final approval.
- Treat the integrated document as an evolving input to design development rather than a finalized result.

#### 3.4 Develop and refine the integrated design

- Review the integrated discussions and decisions together to identify cross-topic relationships, contradictions, gaps, consequences, and new or reopened topics.
- Return to Step 3.2 for every material topic or user choice exposed by the integrated review, record the additional discussion and decision in `ideation.tmp.md`, and rerun Step 3.3 before continuing design development.
- Define every applicable actor, responsibility, boundary, component, owner, and interface.
- Define information, data, and state flows across normal, alternative, invalid, failure, and recovery paths.
- Define applicable performance, resource, trust, governance, privacy, security, accessibility, locale, compatibility, migration, rollback, operation, and maintenance obligations.
- Record every material assumption, risk, evidence gap, and validation commitment.
- Assign one owner to each concern.
- Keep interfaces consumer-readable and dependencies acyclic.
- Contain dependency failures and expose verification seams.
- Repeat integrated review, additional discussion, reintegration, and design development until the design is coherent and no material topic or decision remains unresolved.

#### 3.5 Audit, evaluate, approve, and return the result

- Compare `ideation.tmp.md` with `ideation.md` and confirm that every material discussion, decision, correction, emergent topic, consequence, and reopen condition was integrated.
- List every change from the supporting drafts with its evidence, material user approval, affected branches, and consequence.
- Trace requirements, sources, topics, decisions, resulting design, risks, and validation by exact descriptive heading paths rather than artificial identifiers.
- Use [scenarios.md](scenarios.md) and [checklists.md](checklists.md) to confirm that every applicable design obligation is present and testable.
- Read all three documents independently as a cold reader.
- Remove hidden context, placeholders, unsupported conclusions, unresolved material decisions, and broken links.
- Confirm that the result contains no ordered implementation tasks, implementation diff, produced realization output, or silently chosen design decision.
- Evaluate the exact three-document candidate through [evaluation.md](evaluation.md) while `ideation.md` remains evolving and its authority remains contingent.
- Reopen the earliest affected operation after every material revision.
- Run a fresh complete evaluation without changing either frozen supporting draft.
- Obtain the user's approval of `ideation.md` only after evaluation passes.
- Make the approved `ideation.md` authoritative and automatically supersede both supporting drafts.
- Verify that the approved `ideation.md` contains every material discussion and decision from `ideation.tmp.md`, then delete `ideation.tmp.md`.
- Return `requirements.md`, `topics.md`, and `ideation.md` together.

## References

- [Requirements template](templates/requirements.md)
- [Topics template](templates/topics.md)
- [Final Ideation template](templates/ideation.md)
