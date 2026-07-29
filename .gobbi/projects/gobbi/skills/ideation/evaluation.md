# Ideation Evaluation Entry

Use this entrypoint to evaluate one exact three-document Ideation candidate before final approval: frozen `requirements.md`, frozen `topics.md`, and the evolving `ideation.md`. It owns the Ideation-specific evidence frame, perspective review, causal findings, completed checks, supporting-draft comparison, and derived verdict. It verifies whether the candidate is ready for final user approval; it does not edit any subject document, grant final authority, supersede a supporting draft, or make a decision reserved for the user.

## Required Inputs

- exact bytes, digest, and version for `requirements.md`, `topics.md`, and `ideation.md`;
- the current bytes and digest of `ideation.tmp.md` as process evidence outside the returned candidate;
- the requirements approval record and freeze digest;
- the topics approval record, freeze digest, and chronology proving provisional topic drafting, internal refinement, external refinement, and revision and supplementation occurred in order;
- the intended final-approval condition and the documents' contingent authority statements;
- user-approved scope, requirements, material design decisions, and changes from the supporting drafts;
- topic-resolution discussion and study history sufficient to verify repeated decision-ready choices, recommendations, discussions, needed study, revised choices, and user decisions;
- integrated design-development history sufficient to trace every decision into the design and every newly exposed material choice through additional discussion and reintegration;
- internal and external source registers with authority, relevance, currency, applicability, disposition, and licensing assessments where applicable;
- direct evidence, prior attempts, active project scope, risk and validation records, and artifact inventory;
- [scenarios.md](scenarios.md) and [checklists.md](checklists.md); and
- direct verification evidence for the exact returned bundle.

Missing evidence is evaluated as a gap or unevaluable issue; it is not silently ignored.

## Evaluation Method

1. Bind the review to the exact bytes and digests of all three documents, the intended outcome, scope, exclusions, user decisions, lifecycle state, and acceptance criteria.
2. Select every applicable owned scenario and every atomic checklist item inside its `IDEA-CK-01` through `IDEA-CK-16` family group, add target-specific cases for material conditions the sources miss, and name the evidence method for each.
3. Establish chronology: requirements approval and freeze, provisional topic drafting, deliberate internal refinement, deliberate external refinement, revision and supplementation, hierarchy construction, topics approval and freeze, `ideation.tmp.md` initialization, iterative hierarchical discussion, decision integration in `ideation.tmp.md`, design development from `Integrated Decisions`, additional discussion and reintegration for every newly exposed material choice, final recording in `ideation.md`, and the complete pre-approval candidate. Confirm Step 3.3 never creates or updates `ideation.md` and final approval has not yet been claimed.
4. Compare each supporting draft and `ideation.tmp.md` with `ideation.md`. Confirm the supporting bytes remained stable; temporary records were grouped by topic and consolidated into current parent-first decisions; duplicates, dependencies, and consequences were reconciled; contradictions and unresolved choices returned to discussion rather than being decided by assumption; and every material record appears in the independently readable synthesis.
5. Inspect the exact bundle and direct evidence across every perspective. Record strengths and separate causal findings with expected condition, observed condition, impact, evidence, root cause or leading hypothesis, tested alternative, and corrective direction.
6. Resolve each applicable atomic checklist item as `PASS`, `FAIL:<finding-id>`, or `n/a:<property>`, then derive each family result from its lettered items. Missing, stale, contradictory, proxy-only, or unevaluable evidence cannot pass.
7. Classify findings, derive each perspective result, and derive the final verdict with the rules below.
8. Preserve evaluator independence, keep evaluation separate from correction, and repeat the complete review against new digests after any material change.

### Verdict Rules

- A **revision finding** identifies a correctable defect while the accepted problem, intended outcome, scope, artifact lifecycle, and design direction remain assessable and viable.
- A **failure finding** shows that the accepted problem, intended outcome, scope, authority, safety, feasibility, lifecycle integrity, or design direction is invalid, or that missing, stale, contradictory, or unevaluable core evidence prevents reliable judgment.
- A perspective is `FAIL` when it contains a failure finding, `REVISE` when it contains no failure finding but contains a revision finding, and `PASS` when it contains no findings.
- Every failed atomic checklist item cites one or more findings and inherits the most severe cited classification. A perspective or checklist item without an applicable property is `n/a:<property>` and does not affect the final verdict.
- The final verdict is the most severe applicable perspective or atomic checklist result: `FAIL` over `REVISE` over `PASS`. It is `PASS` only when every applicable perspective and atomic checklist item passes.
- A missing document, missing perspective, unresolved check, malformed or unclassified finding, changed supporting-draft digest, stale subject digest, or inconsistent severity makes the report invalid rather than producing a verdict. Correct the evaluation record or subject lifecycle before issuing the result.

## Perspective Lenses

### Project

Test the root cause, trigger, desired outcome, success and falsification signals, strongest do-nothing case, solution-neutral requirements, user-approved scope, active-scope overlap, material authority, and complete obligation coverage. Confirm the final design solves the approved problem without silent expansion and that every material supporting-draft change carries evidence and approval where required.

### Structure

Test the three-phase order, topic-grouped discussion consolidation inside `ideation.tmp.md`, decision-to-design development, additional-discussion and reintegration loops, final-artifact creation boundary, document authority, dynamic topic hierarchy, parent-before-child resolution, concern ownership, component boundaries, interfaces, dependency direction, state and data invariants, and test seams. Confirm Step 3.3 writes only the temporary record, every integrated decision shapes the design, newly exposed material choices return to the user, and Step 3.4 records the coherent design in `ideation.md`.

### Performance

Test scale assumptions, dominant resources, external-call counts, batching, timeout and retry behavior when applicable, recurring cost, capacity limits, and committed measurement. At Ideation, evidence may be an estimate and measurement design; unsupported speed, capacity, or cost claims fail.

### Aesthetics

Read each document cold and independently. Test first-page lifecycle clarity, `## Contents`, stable descriptive headings, matching ASCII trees and heading hierarchies, concise blocks and tables, scanability, placeholders, filler, and whether a skim yields the same authority and meaning as a full read.

### Usage

Test whether intended users, readers, callers, operators, maintainers, and approvers can understand and use each document without private context. Confirm the topic agenda supports parent-first discussion, the final document supports later consumers without pointers to hidden meaning, and applicable accessibility, locale, actionable failure, diagnosis, and future-validation instructions are usable.

### Consistency

Compare frozen requirements, assessed sources, prepared topics, final requirements, final topic tree, decisions, integrated design, risks, validation, traceability, and supporting-draft changes. Search for changed frozen bytes, source links without assessment, stale heading paths, mismatched tree nodes, contradictory decisions, transcript without synthesis, artificial trace IDs, fixed inherited taxonomies, future validation represented as current evidence, and final content that merely points to a supporting draft.

### Risk

Test blast radius, rollback, one-way actions, security and authorization, privacy and retention, shared state, compatibility, dependency and license risk, cost runaway, and load-bearing assumptions. Treat a post-freeze supporting-draft edit, silent contract change, unsupported governing source, missing recovery, or planned prototype, spike, benchmark, experiment, or study cited as completed proof as a material risk.

### Overall

Challenge wrong premises, solution-biased requirements, unrefined provisional topics, token source assessment, unclosed missing or weak topics, copied fixed taxonomies, unnecessary novelty, unrelated bundled outcomes, premature implementation tasks, external-method dependencies, and process theater. Preserve trustworthy source assessments, sharp scope language, explicit authority, genuine alternatives, parent-to-child reasoning, draft immutability, and complete decision synthesis.

## Recommended Verification

Use direct reads and safe read-only commands:

- compute and record all three subject digests, then compare the two supporting digests with their freeze evidence;
- verify the chronology `requirements freeze → provisional topics → internal refinement → external refinement → revision and supplementation → hierarchy construction → topics freeze → temporary hierarchical discussion → temporary decision integration → design development and refinement → final recording in ideation.md → complete pre-approval candidate`, then confirm final approval and authority are still contingent on a later passing evaluation;
- resolve every local link and every `## Contents` entry;
- compare each ASCII topic-tree node with its matching heading and find headings missing from the tree;
- search for placeholders, artificial trace identifiers, transcript-only language, ordered implementation tasks, and stale single-artifact claims;
- reject any produced realization output in the returned bundle even when it is accurately labeled and is not cited as current evidence;
- trace each requirement to assessed sources, topics, decisions, resulting design, risks, validation, and supporting-draft changes by descriptive heading path;
- compare every late source, corrected requirement, emergent topic, reopened decision, and consequence with “Changes from the Supporting Drafts”;
- trace every topic through its options, recommendation, user choice, discussion, needed additional study, revised choice, and decision or explicit deferral before the traversal advances;
- compare `ideation.tmp.md` with `ideation.md` and reject every omitted material discussion, decision, correction, emergent topic, consequence, or reopen condition;
- group temporary records by topic and reject chronological copying, unconsolidated rounds, surviving duplicates, unpropagated consequences, or assumed conflict resolutions;
- verify file-creation chronology and reject any Step 3.3 write to `ideation.md` or any final-artifact creation before Step 3.4 completes the integrated temporary design;
- trace each integrated decision into the developed structure or behavior and every newly exposed material choice through additional discussion, temporary recording, and reintegration;
- classify every evidence claim as current evidence, rejected evidence, uncertainty, or future validation;
- inspect every `n/a` disposition for a named property and direct evidence;
- perform isolated cold reads of all three documents; and
- exercise boundary, failure, adversarial, change, counterfactual, and cosmetic-compliance probes.

At minimum, run these discriminating behavior probes:

| Probe | Expected result |
|---|---|
| A proposed mechanism appears as a requirement without hard-constraint evidence | fail IDEA-CK-13 |
| A material requirement statement lacks a visible fact, user-report, assumption, contradiction, decision, or open-question classification | fail IDEA-CK-13 |
| Provisional topics are drafted before `requirements.md` freezes | fail IDEA-CK-14 |
| Internal or external study is absent or does not materially refine the topic draft | fail IDEA-CK-14 |
| A material missing or weak topic survives the revision and supplementation pass | fail IDEA-CK-14 |
| A fixed generic or Startup taxonomy is copied despite project-specific evidence | fail IDEA-CK-14 |
| A topic omits its purpose, parent, dependencies, exact connected requirements, source basis, discussion questions, genuine alternatives, or completion condition | fail IDEA-CK-14 |
| Source links exist but authority, relevance, currency, applicability, and disposition are absent | fail IDEA-CK-14 or IDEA-CK-11 |
| An approval stamp or correction changes a frozen supporting file | fail IDEA-CK-15 |
| Late study, a corrected requirement, or an emergent topic appears only in the final document with disclosure and propagation | pass the lifecycle part of IDEA-CK-15 |
| A child decision changes an ancestor without reopening and reconciling it | fail IDEA-CK-15 or IDEA-CK-04 |
| A material topic asks the user to answer without presenting genuine options and a supported recommendation | fail IDEA-CK-16 |
| A topic reaches a decision while a discussion-created evidence gap or follow-up question remains unresolved | fail IDEA-CK-16 |
| Traversal advances to a child while its ancestor remains unresolved | fail IDEA-CK-16 |
| `ideation.md` omits a material discussion or decision recorded in `ideation.tmp.md` | fail IDEA-CK-16 |
| `ideation.md` copies temporary records chronologically or retains duplicate, stale, contradictory, or unconsolidated decisions | fail IDEA-CK-16 |
| Step 3.3 creates or updates `ideation.md`, or Step 3.4 creates it before the integrated temporary design is coherent | fail IDEA-CK-16 |
| `ideation.tmp.md` is deleted before evaluation or included in the returned bundle | fail IDEA-CK-16 |
| A material integrated decision does not shape the design, or design development silently resolves a newly exposed material choice | fail IDEA-CK-16 |
| The final document links to a supporting draft instead of restating material context | fail IDEA-CK-16 |
| The final document preserves turns but omits alternatives, selection, rationale, consequence, or reopen condition | fail IDEA-CK-16 |
| A material decision omits its explicit question, evidence-that-would-change, trade-offs, or reopen condition | fail IDEA-CK-16 |
| The final document contains ordered implementation tasks or an implementation diff | fail IDEA-CK-16 |
| The returned bundle contains a produced realization output even when it is honestly labeled | fail IDEA-CK-12 or IDEA-CK-16 |
| The candidate claims final approval, final authority, or supporting-draft supersession before evaluation passes | fail IDEA-CK-16 |
| An applicable actor, state, interface, resource, failure, trust, inclusion, or compatibility concern is missing | fail its corresponding IDEA-CK-02 through IDEA-CK-09 |
| A planned validation artifact is cited as existing evidence | fail IDEA-CK-12 |
| All three documents are independently readable, lifecycle-correct, complete, and traceable | eligible for `PASS` after all other checks pass |

Exercise at least one self-containment probe using a project-only, software, interface or experience, or mixed-domain idea. The probe fails when the method requires another skill, omits an applicable concern, imports an outside procedure, accepts a non-authoritative source, or lets source order silently resolve an authority conflict.

## Rule Crosswalk

| Parent rule | Primary report coverage |
|---|---|
| MUST preserve material user authority | Project, Usage, Risk; IDEA-CK-01, IDEA-CK-02, IDEA-CK-07, IDEA-CK-09, IDEA-CK-13, IDEA-CK-15, IDEA-CK-16 |
| MUST complete Ideation from this operation and its owned companions | Structure, Consistency, Overall; IDEA-CK-04, IDEA-CK-10, IDEA-CK-11, IDEA-CK-16 |
| NEVER change the accepted contract silently | Project, Consistency, Risk; IDEA-CK-01, IDEA-CK-09, IDEA-CK-10, IDEA-CK-15 |

## Principle Crosswalk

| Parent principle | Primary scenarios and checks |
|---|---|
| Question the user without hesitation until the idea is complete | IDEA-SC/CK-01, 02, 10, 13, 16 |
| Study trustworthy prior art before designing | IDEA-SC/CK-04, 07, 11, 14 |
| Discuss the design through a hierarchy of topics | IDEA-SC/CK-03, 04, 09, 15, 16 |
| Find the best idea by comparing reference-backed alternatives | IDEA-SC/CK-01, 07, 12, 16 |

## Procedure and Template Crosswalk

| Parent clause | Primary report coverage |
|---|---|
| Phase 1 — solution-neutral problem and requirements definition, approval, and whole-file freeze | Project, Usage, Consistency; IDEA-CK-01, IDEA-CK-02, IDEA-CK-13 |
| Phase 2 — progressive topic drafting, internal and external refinement, gap-driven revision and supplementation, hierarchy construction, approval, and whole-file freeze | Structure, Aesthetics, Consistency, Overall; IDEA-CK-10, IDEA-CK-11, IDEA-CK-14 |
| Phase 3 — temporary hierarchical discussion records, decision integration, design development and refinement through additional discussion, final recording, evaluation, approval, and temporary-file cleanup | all perspectives; IDEA-CK-01 through IDEA-CK-12, IDEA-CK-15, IDEA-CK-16 |
| `templates/requirements.md` — independently readable solution-neutral supporting contract and lifecycle notice | Project, Aesthetics, Consistency; IDEA-CK-13, IDEA-CK-16 |
| `templates/topics.md` — assessed sources, dynamic matching hierarchy, completeness audit, and lifecycle notice | Structure, Aesthetics, Consistency; IDEA-CK-10, IDEA-CK-14, IDEA-CK-16 |
| `templates/ideation.md` — final authority, decision synthesis, integrated design, draft-change disclosure, traceability, and approval | all perspectives; IDEA-CK-01 through IDEA-CK-12, IDEA-CK-15, IDEA-CK-16 |

Every applicable lettered item inside the `IDEA-CK-01` through `IDEA-CK-16` family groups appears in the report checklist. The evaluator adds an item for any target-specific case. A material revision repeats all seven perspectives plus Overall from a fresh independent evaluator against new document digests.
