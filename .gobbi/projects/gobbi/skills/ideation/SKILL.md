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

Start from the user trigger, current project state, governing materials, prior decisions, prior attempts, direct evidence, active scope, and any contradictions. Create `requirements.md` from [the requirements template](templates/requirements.md), and keep each material statement visibly classified as fact, user report, assumption, contradiction, decision, or open question.

Question the user until the document defines a solution-neutral contract:

- the trigger, current reality, root problem, consequences, current workaround or alternative, strongest credible do-nothing outcome, and why action matters now;
- affected people and actors, their desired outcomes, and who owns each material decision;
- material requirements expressed as needed outcomes or constraints rather than preferred mechanisms;
- observable success, failure, falsification, and stop signals;
- in-scope, out-of-scope, deferred, and explicitly rejected work;
- hard constraints, soft preferences, authority boundaries, active-work overlap, and compatibility promises; and
- assumptions, contradictions, unresolved questions, and questions that later study must answer.

Challenge a requested mechanism against the underlying problem. Keep it as a binding requirement only when inspected evidence proves that it is a hard constraint; otherwise record it as an unselected candidate for later discussion. Do not infer missing requirements, silently close contradictions, or begin topic preparation while a material problem or boundary remains unresolved.

Before approval, write the lifecycle notice into `requirements.md`: after approval the whole file is immutable, later corrections belong only in `ideation.md`, and approval of the final `ideation.md` automatically supersedes this supporting draft. Obtain explicit user approval, then freeze the entire file without adding an approval stamp or making any later byte change.

**Phase evidence:** an approved and frozen `requirements.md` that is independently readable, solution-neutral, and complete enough to direct study.

**Recovery and next branch:** if evidence later invalidates the draft, preserve it unchanged and record the corrected requirement, evidence, user decision, and consequence in `ideation.md`. Continue to Phase 2 only after the frozen requirements contract exists.

### Phase 2 — Study Materials and Prepare Topics

After `requirements.md` freezes and before generating any topic, conduct one deliberate study pass across both internal and external materials. Internal study inspects relevant project documents, code, configuration, history, prior decisions, established patterns, counterexamples, and negative results. External study inspects trustworthy prior art, maintained standards, proven approaches, genuine alternatives, and documented failure lessons that bear on the frozen requirements.

For every material source, record its link or stable location, claimed authority, relevance, currency, applicability, and licensing when reuse may be affected. Separate what the design adopts, rejects as inapplicable, and keeps uncertain; record contradictions and useful negative results. There is no source-count target: study until the material requirements have an adequate foundation, and continue studying whenever an unresolved question or later decision needs more evidence.

Only after both study surfaces have been examined, create `topics.md` from [the topics template](templates/topics.md). Derive a project-specific hierarchy from the frozen requirements and studied materials rather than importing a fixed taxonomy. Render one ASCII `text` tree and matching Markdown topic headings. For each topic, record its purpose, parent, dependencies, connected requirements by exact descriptive heading, source basis, discussion questions, genuine alternatives, and completion condition.

Order the discussion parent-first and make dependencies and cross-topic conflicts visible. Audit the tree for every applicable concern across actors; boundaries and interfaces; state and data; resource use; failure and recovery; trust and governance; inclusion and locale; compatibility and reversal; and evidence, risk, and validation. Give an inspected not-applicable reason when a concern does not belong. Additional study is always allowed while preparing the tree.

Before approval, write the lifecycle notice into `topics.md`: it is a discussion agenda rather than a live tracker; after approval the whole file is immutable; later sources, corrected requirements, and emergent topics belong only in `ideation.md`; and approval of the final `ideation.md` automatically supersedes this supporting draft. Obtain explicit user approval, then freeze the entire file without adding an approval stamp or making any later byte change.

**Phase evidence:** an approved and frozen `topics.md` that independently explains the study foundation and supplies a requirement-grounded, source-grounded, complete discussion tree.

**Recovery and next branch:** if study is inadequate, a source conflict is unresolved, or topic coverage is incomplete, continue study and topic preparation before approval. After freeze, preserve the file unchanged and carry every later change in `ideation.md`. Continue to Phase 3 only after the frozen topic agenda exists.

### Phase 3 — Discuss the Topics Hierarchically

Create `ideation.md` from [the final Ideation template](templates/ideation.md). Copy the complete frozen problem and requirements contract and the prepared topic tree into it so the final document never depends on links to the supporting drafts for meaning. Mark `ideation.md` as the evolving final authority; it may be revised until final approval.

Traverse the hierarchy parent-first. Resolve a parent topic before its children, reconcile siblings before closing their parent, and keep dependent topics open while an ancestor decision is unresolved. Ask every relevant question needed to complete the idea. If a child contradicts an ancestor or new evidence invalidates an earlier decision, reopen the earliest affected branch in `ideation.md`, obtain the required user decision, and propagate the consequence through its descendants without editing either frozen draft.

For each material decision:

1. state the question, connected requirements, current context, and trustworthy evidence;
2. compare genuinely different reference-backed alternatives, including doing nothing when credible, by pros, cons, fit, risks, and consequences;
3. recommend the best-supported option and state what evidence would change the recommendation;
4. obtain the user's decision whenever the Rules reserve authority to the user; and
5. record the selection, rationale, rejected alternatives, trade-offs, resulting design, and reopen condition.

Study remains available throughout discussion. Record every late source with the same assessment used in Phase 2. Put each corrected requirement and each emergent topic only in `ideation.md`; place an emergent topic under the correct parent, mark it as added during discussion, and update the final ASCII tree and matching headings. Preserve decision synthesis rather than a conversational transcript.

Develop one integrated design that covers every applicable actor and responsibility; boundary, component, ownership, and interface; information, data, and state flow; normal, alternative, invalid, failure, and recovery path; performance and resource obligation; trust, governance, privacy, security, accessibility, locale, compatibility, migration, rollback, operation, and maintenance concern; and assumption, risk, evidence gap, and validation commitment. Give each concern one owner, keep interfaces consumer-readable and dependencies acyclic, contain dependency failure, and expose verification seams.

Distinguish evidence that exists now from proposed future validation, and never represent a planned walkthrough, prototype, experiment, code spike, benchmark, or user study as completed evidence. For each validation commitment, record the question it must answer, method or artifact, participants or environment, pass and fail signals, owner, execution condition, and reopen condition.

Before completion:

- list every change from the supporting drafts, with its evidence, user approval when material, affected branches, and consequence;
- trace requirements, sources, topics, decisions, resulting design, risks, and validation by exact descriptive heading paths rather than artificial identifiers;
- use [scenarios.md](scenarios.md) and [checklists.md](checklists.md) to confirm every applicable design obligation is present and testable;
- read all three documents independently as a cold reader and remove hidden context, placeholders, unsupported conclusions, unresolved material decisions, and broken links; and
- confirm that the result contains no ordered implementation tasks, implementation diff, produced realization output, or silently chosen design decision.

Evaluate the exact three-document candidate through [evaluation.md](evaluation.md) before final approval; the evaluation verifies approval readiness while `ideation.md` remains evolving and its authority remains contingent. Material revisions reopen this phase and require a fresh complete evaluation. Only after evaluation passes, obtain the user's approval of `ideation.md`; that approval makes it the final authoritative Ideation result and automatically supersedes both frozen supporting drafts.

**Completion evidence:** returned `requirements.md`, `topics.md`, and `ideation.md`; independently readable supporting drafts whose bytes remained frozen after approval; a user-approved authoritative final document with complete decision synthesis, change disclosure, traceability, and current-versus-future evidence boundaries; and a passing evaluation of the exact three-document result.

**Failure:** return to the earliest affected phase while respecting frozen-file immutability. Do not return a cosmetically complete bundle with a solution-biased requirement, missing internal or external study, inherited fixed taxonomy, unresolved material decision, silent contract change, broken trace, transcript-only discussion, unsupported evidence claim, or dependency on an outside method.

## References

- [Requirements template](templates/requirements.md)
- [Topics template](templates/topics.md)
- [Final Ideation template](templates/ideation.md)
