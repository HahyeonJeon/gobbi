---
name: startup
description: "Use at a fresh or sparse project baseline, or for an explicit baseline reset, to classify the baseline read-only and optionally run a recorded adaptive Ideation interview."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Startup

Startup gives a manager an evidenced project-baseline result. It begins with a read-only classifier and,
when that baseline is insufficient and the user accepts, continues as an adaptive interview inside
ordinary Ideation DISCUSSION.

The accepted interview records structured questions, current answers, evidence, decisions, corrections,
and Phase checkpoints. Its final report is noncanonical Ideation research, not an evaluated design,
implementation plan, durable-memory artifact, or readiness verdict.

Load Startup for a new project, a sparse or contradictory baseline, or an explicit baseline reset. A
normal resume or runtime context boundary does not trigger it.

## Principles

### Put evidence before direction

Start with verified project facts, concrete problem events, observed behavior, and current alternatives.
Treat praise, preferences, forecasts, and unsupported claims as evidence gaps rather than proof.

### Adapt for complete project design

The seed topics provide a starting structure, not a mandatory questionnaire. Change that structure when
the interview context reveals a material project-design concern that would otherwise be missing or misplaced.

### Reconcile before advancing

A later answer never silently replaces an earlier answer. Make the conflict visible, let the user state
the current or conditional truth, and propagate the correction through every affected topic and checkpoint.

### Make Phase checkpoints recoverable

Each Phase checkpoint records the current project understanding and the first safe continuation action.
An interruption preserves that state without creating a separate Startup lifecycle or source of truth.

## Rules

- **MUST run only for `fresh-project`, `sparse-baseline`, or `explicit-reset` and keep classification
  read-only.** Classify substantive evidence rather than directory presence, and never repair or scaffold
  the baseline while classifying it.
- **MUST receive explicit user acceptance and validate the ordinary Ideation record location before the
  first interview write.** A `sufficient` result or user decline writes no Startup interview file.
- **MUST ask one neutral, evidence-led decision axis per turn and record the resulting structured
  evidence.** Show discoverable repository facts before asking, prefer observed behavior to praise, and
  keep unresolved claims open with an owner and method.
- **MUST adapt and close the current topic tree according to the interview context.** Record why each
  topic was added, adapted, merged, reopened, or marked `not-needed`, without treating seed coverage as acceptance.
- **MUST resolve material conflicts with the user before treating their affected answers as current.**
  Preserve correction links, reopen the earliest affected Phase, and reconfirm only affected checkpoints.
- **NEVER record a raw transcript, secret, credential, or user-marked sensitive value, and never create
  a Startup cursor, evaluation, promotion, durable-memory path, or private lifecycle.** Keep direction at
  project-design altitude and leave detailed mechanism and task decomposition to later workflow steps.

## Procedure

### Phase 1 — Classify the Project Baseline

#### 1.1 Confirm the trigger and caller context

- Receive the trigger, absolute project root, project-memory root when one exists, and current workflow
  context from the manager.
- Continue only for `fresh-project`, `sparse-baseline`, or `explicit-reset`. Return an invalid trigger to
  the caller without reading it as permission to create or change project state.
- During Configuration, run this Phase and the read-only accept or decline gate in Step 2.1. Do not run
  any later step or write an interview file until Workflow has entered ordinary Ideation DISCUSSION.

#### 1.2 Inventory the baseline read-only

- Read the project index, typed memory, repository documentation, source, tests, configuration, and
  relevant history. Inspect the closest current evidence before relying on summaries or user recollection.
- Separate directly verified facts, user-reported facts, assumptions, forecasts, contradictions,
  decisions, and open questions in working context.
- Do not create, edit, repair, archive, supersede, stage, or promote a file while inventorying or classifying.

#### 1.3 Classify substantive validity

- Test whether a cold Ideation reader can identify, without guessing:
  - the recurring problem, concrete behavioral evidence, affected people, jobs, and current alternatives;
  - the intended outcome, success and stop evidence, scope, boundaries, non-goals, capabilities, and journeys;
  - the rough experience, system, data, delivery, adoption, and compatibility direction;
  - feasibility, dependencies, capacity, ownership, operation, recovery, and maintenance constraints;
  - decision authority, license, governance, trust, safety, privacy, quality, and validation obligations; and
  - material risks, contradictions, assumptions, evidence gaps, and owned open questions.
- Require load-bearing claims about problem reality, feasibility, safety, and scope to be evidenced or
  explicitly open. Reject secrets, stale contradictions, cosmetic directories, and baselines that depend
  on an unstored conversation.
- Return exactly one classifier result with cited evidence and named gaps:
  - `sufficient` when ordinary Ideation can proceed without reconstructing a load-bearing premise;
  - `sparse` when usable evidence exists but one or more load-bearing areas are missing or weak;
  - `absent` when no substantive baseline exists; or
  - `contradictory` when load-bearing records disagree or are too stale for safe downstream use.
- For `sufficient`, return the classifier report with terminal outcome `sufficient` and write no interview
  file. Route every other result to the read-only Step 2.1 gate while Configuration remains active.

### Phase 2 — Prepare an Accepted Interview

#### 2.1 Obtain the user's accept or decline decision

- Use the user-decision mechanics owned by [`../discussion/SKILL.md`](../discussion/SKILL.md) to present
  the classifier, evidence, gaps, and optional guided interview.
- Do not infer acceptance. On decline, return the classifier, gaps, and terminal outcome `declined`
  without inventing facts or writing an interview file.
- On acceptance, return the accepted disposition to Workflow and suspend Startup without writing an
  interview file. After Workflow enters ordinary Ideation DISCUSSION, resume Startup at Step 2.2.
- Startup creates no step, stage, cursor, session, mode, or completion predicate.

#### 2.2 Validate the record target

- Receive the manifest-declared absolute `{session-root}` and current Ideation iteration `{n}`. Derive only
  these two regular-file targets:

```text
{session-root}/1-ideation/working/iteration-{n}/research/startup-interview.tmp.md
{session-root}/1-ideation/working/iteration-{n}/research/startup-interview.md
```

- Apply the containment and session-tree contract owned by
  [`../record/record-map.md`](../record/record-map.md). Confirm the root belongs to the current worktree and
  session, the cursor is Ideation DISCUSSION at iteration `{n}`, the `research/` directory is authorized,
  and no root, parent, or target is a symbolic link.
- Normalize both paths and require them to remain beneath the supplied session root. A missing, escaped,
  mismatched, symbolic-link-redirected, or unrelated pre-existing target stops before the first write.
- When a temporary file already exists, resume only after its project, session, iteration, trigger, and
  classifier identity match the current invocation. A confirmed final report is not overwritten as a new interview.

#### 2.3 Initialize the working record

- Create the temporary record from [`templates/interview.tmp.md`](templates/interview.tmp.md). Populate
  its identity, classifier evidence, current uncertainty, and the ten seed topics from [`topics.md`](topics.md).
- Use seed IDs `S01`–`S10`, preserve an adapted seed's ID, and give an emergent topic the earliest owning
  seed plus a sequence such as `S06.E01`.
- Set the interview and first Phase to active `draft`. The temporary file is structured, noncanonical
  Ideation research and the sole recoverable Startup working record.

### Phase 3 — Interview, Adapt, and Checkpoint

#### 3.1 Build the contextual topic agenda

- Order the current topics by dependency, uncertainty, reversibility, consequence, and the cheapest
  disconfirming evidence. Use the Phase order in [`topics.md`](topics.md) while moving within or back across
  Phases when evidence requires it.
- Rename, reorder, split, merge, narrow, reopen, or mark a seed topic `not-needed` when current evidence
  justifies the change. Record the reason, evidence, dependencies, origin, and disposition.
- Add an emergent topic when a material actor, dependency, interface, state, data duty, failure, recovery
  path, trust or governance concern, inclusion need, compatibility promise, risk, or validation claim has
  no owner. A proposed scope expansion still requires the user's decision before it enters the boundary.

#### 3.2 Ask and record one evidence-led axis

- Before each question, inspect available project evidence. Show a verified fact for confirmation or
  correction instead of asking the user to rediscover it.
- Ask one neutral decision axis per turn. Seek the last concrete event, current behavior, alternative,
  cost, constraint, or evidence-to-change before accepting a preference or forecast.
- Probe a still-vague answer with a concrete event, counterexample, or past-behavior question at most
  twice. If it remains unresolved, record it `open` with an owner and resolution method.
- Smart-skip a prompt only when current evidence resolves it and the user confirms or corrects that
  evidence. Continue deeper when a concrete answer reveals another material in-scope claim or dependency.
- For every material answer, write the exact question, faithful non-sensitive summary, claim kind,
  evidence status and source, interpretation, confidence gap, decision or open question, dependencies,
  topic effects, and follow-up owner and method. Record summaries, not conversation turns.

#### 3.3 Pass the problem-before-solution gate

- After topic Phase 2 and before topic Phase 3, present the current recurring problem and concrete event,
  first people and jobs, current alternatives and behavior, root cause and trigger, riskiest assumption,
  outcome boundary, and non-goals for the user's agreement or correction.
- If a premise fails, return to its earliest owning topic and update the record. Do not let a capability,
  experience, architecture, or technology preference rewrite the problem or boundary after the fact.

#### 3.4 Study and resolve design-bearing directions

- For a topic that selects project direction, invoke the read-only Study operation at the exact Ideation
  cursor under [`../study/SKILL.md`](../study/SKILL.md). Study current project evidence and applicable
  authoritative prior art before proposing a direction.
- Present two or three materially distinct, reference-backed directions with reuse, effort, risk,
  feasibility, and limits. Recommend one, state the evidence that would change it, and let the user decide
  through Discussion.
- Record the decision, rejected alternatives, rationale, and evidence-to-change. Keep the result at
  project, experience, system-context, quality, and ownership direction rather than detailed schemas,
  algorithms, modules, migrations, or task order.

#### 3.5 Reconcile a conflicting answer

- When answers conflict, assign a conflict ID and show the user both answer IDs, their incompatible
  claims, available evidence, and the downstream consequence. Ask which claim is current or whether they
  apply under distinct conditions; never assume the later answer wins.
- Write one current corrected answer, mark replaced answers superseded, and preserve bidirectional
  correction links. Re-evaluate every dependent topic and reopen the earliest affected Phase.
- Propagate the correction through affected checkpoints. Reconfirm only the reopened Phase and its
  affected downstream checkpoints rather than restarting unaffected work.

#### 3.6 Confirm a Phase checkpoint

- A Phase may checkpoint when every current topic is `resolved`, `not-needed` with reason and evidence,
  `merged`, or `open` with an owner and method. Mechanical topic coverage never proves that a load-bearing
  assumption is ready.
- Record the current topic tree and dispositions, current answers, facts and evidence, assumptions,
  decisions, rejected alternatives, evidence-to-change, open questions with owners and methods, conflicts,
  corrections, downstream effects, and the user's confirmation.
- Set the Phase status to `confirmed` or `corrected`. Use `reopened` after a material correction and
  return it to `confirmed` or `corrected` only after the user reconfirms the affected result.
- A checkpoint is a recoverable interview state, not an evaluation verdict. Continue until all four
  topic Phases have current checkpoints.

#### 3.7 Preserve an interruption

- If the interview pauses after initialization, leave the temporary record at its latest complete write.
  Do not delete, partially finalize, stage, promote, or copy it elsewhere.
- Return terminal outcome `interrupted`, the temporary path, current Phase and status, next unresolved
  topic, and first recovery action. Resume through Step 2.2 identity validation.

### Phase 4 — Finalize the Ideation Research Input

#### 4.1 Audit the current interview

- Confirm every current topic has an allowed disposition, every adaptation has a reason, every open item
  has an owner and method, every material conflict has the user's resolution, and every reopened checkpoint
  is current.
- Cross-check answers, evidence, decisions, topic dependencies, Phase checkpoints, risks, and the final
  topic tree. Remove no correction provenance needed to understand a current answer.
- Verify that secrets, credentials, user-marked sensitive values, raw transcript content, implementation
  detail, and unsupported readiness claims are absent.
- On an audit or finalization failure, retain the temporary record and return `interrupted` with the
  failed condition and first recovery action.

#### 4.2 Create and confirm the final report

- Create the final path from [`templates/interview.md`](templates/interview.md). Synthesize only current
  answers while retaining concise provenance for material corrections that changed an answer, topic, or
  checkpoint.
- Include the final topic tree, Phase results, evidence and uncertainty, decisions and rejected
  alternatives, open questions and owners, risks, constraints, and the ordinary Ideation handoff.
- Re-read the rendered report and compare it with the temporary record. Verify its required sections,
  keyed current-answer register, final topic tree, current Phase statuses, open owners, material correction
  provenance, and sensitive-data exclusions.
- On any mismatch, retain the temporary record, repair through it, regenerate the report, and repeat
  Steps 4.1–4.2. Do not delete the temporary record or claim completion.
- Present only the verified report to the user for confirmation. Apply user corrections through the
  temporary record, reopen affected checkpoints when required, regenerate the report, and repeat Steps
  4.1–4.2 before asking again.

#### 4.3 Complete and hand off

- After the post-render verification and user confirmation both succeed, remove the temporary record and
  verify the final report remains at:

```text
{session-root}/1-ideation/working/iteration-{n}/research/startup-interview.md
```

- Return terminal outcome `completed`, the final path, current Phase statuses, open owners, and material
  correction IDs. Supply the report to ordinary Ideation as noncanonical DISCUSSION research before
  dual-system WORK.
- Ideation owns its canonical synthesis and productive loop; Evaluation, Record, Memory, and Wrap-up keep
  their existing ownership. Startup creates no output, verdict, staging candidate, or durable promotion.

#### 4.4 Report the terminal outcome

- Return exactly one terminal outcome:
  - `sufficient` with the classifier evidence and no interview path;
  - `declined` with the classifier gaps and no interview path;
  - `interrupted` with the retained temporary path and first recovery action; or
  - `completed` with the confirmed final report path and Ideation handoff.
- Do not claim completion when the final report is unconfirmed, the temporary record remains after
  confirmation, the rendered report mismatches the temporary record, or a material conflict lacks the
  user's current answer.

## References

- [`topics.md`](topics.md)
- [`templates/interview.tmp.md`](templates/interview.tmp.md)
- [`templates/interview.md`](templates/interview.md)
