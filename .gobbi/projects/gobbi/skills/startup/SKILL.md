---
name: startup
description: "Use at a fresh or sparse project baseline, or for an explicit baseline reset, to classify the existing baseline read-only and optionally elicit evidence for ordinary Ideation."
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
skill-type: operation
---

# Startup

Startup is a read-only baseline operation. It classifies the existing project reference and, when the
user accepts, helps ordinary Ideation DISCUSSION establish the evidence and direction needed to start
well. It does not own a session, cursor, pipeline, promotion, evaluation lifecycle, or durable output.

Load Startup for a new project, when the project reference is absent or sparse, or when the user
explicitly requests a baseline reset. A normal resume or runtime context boundary does not trigger it.

## Principles

### Interview craft

1. **Start with a real problem event.** Establish who experienced the last concrete occurrence, what
   happened, what they did, and what it cost before accepting vision, feature, or solution language.
2. **Weight behavior over praise.** Existing workarounds, switches, repeated effort, time, or money are
   stronger evidence than compliments, surveys, or promises.
3. **Ask neutrally, then take a position.** Do not pitch inside a question. State the evidence read and
   what evidence would change it. Push a vague or contradicted answer at most twice, then leave it open.
4. **Attack the riskiest assumption first, then follow the evidence down.** Spend depth according to
   uncertainty × reversibility × magnitude, while still accounting for every required topic. A concrete,
   evidenced answer is a launch point for depth, not a stop signal: when it exposes a new in-scope claim,
   dependency, contradiction, or untested assumption, ask the next disconfirming probe and keep descending
   while each probe still moves the evidence within the branch's scope. This depth is distinct from the
   at-most-twice vague-repair cap in principle 3, which only bounds re-asking a still-vague answer.
5. **Name one first user and their switch.** Separate actors, operators, approvers, and affected people;
   identify their job, current alternative, push, pull, anxiety, and habit.

### Design craft

1. **Confirm problem premises before solution direction.** A feature, architecture, or stack choice
   cannot repair an unconfirmed problem, user, root cause, boundary, or non-goal.
2. **Study three layers and recommend.** Compare tried-and-true, new-and-popular, and first-principles
   options. Present genuinely distinct minimal and ideal directions at equal weight, recommend one, and
   name the evidence that would change the recommendation.
3. **Shape a rough, solved, bounded direction.** Connect the product elements, critical journeys,
   failure paths, boundary, and system direction at the macro level. Leave mechanism to later work.
4. **Test viability.** Check feasibility, dependencies, capacity, ownership, operation, recovery, and
   maintenance for the intended life of the project.
5. **The user owns intent.** The manager investigates, challenges, and recommends; the user locks scope
   and direction. Reopen a decision only when new evidence crosses its stated threshold.

## Rules

- **ST-1 — Read before asking.** Inventory the project reference, repository, tests, and known history.
  Show a verified fact before asking a question whose answer the repository can narrow.
- **ST-2 — Classify substance, not directory presence.** A `README.md`, `design/`, or `features/`
  directory does not prove a usable baseline.
- **ST-3 — Keep the classifier read-only.** Report validity and gaps without scaffolding, repairing,
  archiving, superseding, staging, or promoting anything.
- **ST-4 — Preserve user authority.** When the baseline is insufficient, the user may accept the guided
  question operation or proceed without it. Do not infer acceptance.
- **ST-5 — Use one evidence-led question per turn.** One decision axis keeps the evidence falsifiable.
  Apply smart-skip only when current evidence actually resolves the branch.
- **ST-6 — Close coverage explicitly.** Account for every required branch as `confirmed`,
  `proven-irrelevant` with a reason, or `open` with an owner. Coverage is not acceptance.
- **ST-7 — Keep claims typed.** Separate verified facts, user-reported facts, assumptions,
  contradictions, decisions, and open questions in the handoff.
- **ST-8 — Pass the problem-before-solution gate.** Do not enter product-shape questions until the
  problem event, first user and job, current alternative, root cause, why-now, fatal assumption, boundary,
  and non-goals have been shown to the user for agreement or correction.
- **ST-9 — Study design-bearing directions.** Use the Study operation for internal and external
  evidence. Never fabricate a source or close a design choice from an unexamined preference.
- **ST-10 — Stay at direction altitude.** Do not design signatures, schemas, algorithms, module
  internals, migrations, or task breakdowns.
- **ST-11 — Keep sensitive material out.** Do not place secrets or user-marked sensitive values in the
  returned packet or downstream artifacts.
- **ST-12 — Return evidence; do not write it.** Startup returns a structured packet to the manager.
  Accepted material enters the ordinary Ideation package through its owners.

## Procedure

### 1. Confirm the trigger and caller context

The manager supplies one trigger: `fresh-project`, `sparse-baseline`, or `explicit-reset`. Confirm the
project root and the existing project-memory root. During Configuration, run only the classifier in
steps 2–3. If the user accepts guided questioning, Workflow first enters Ideation DISCUSSION and
then invokes steps 4–9 as a bounded input-building operation at that ordinary cursor.

Do not create a Startup cursor, directory, record, mode, checklist run, or completion predicate.

### 2. Inventory the current baseline read-only

Read the root project index and the relevant typed memory, repository documentation, source, tests, and
history. Record in working context which facts are directly verified, which are user claims, and which
are unknown. Do not mutate invalid or stale records during classification.

### 3. Classify baseline validity

Return one classifier result:

- `sufficient` — downstream Ideation can identify the agreed problem, user/job, boundary, rough product
  direction, feasibility constraints, authority, risks, and important open questions without guessing;
- `sparse` — some usable evidence exists, but one or more load-bearing areas are absent or too weak;
- `absent` — no substantive baseline exists; or
- `contradictory` — load-bearing records disagree or are stale enough that downstream use is unsafe.

Apply all baseline-quality tests in [`topics.md`](topics.md#baseline-quality-tests): coverage, user/job,
behavioral evidence, bounded shape, feasibility, authority, license/governance, downstream usability,
contradictions, secrecy, and load-bearing evidence. Cite the evidence and gaps. A `sufficient` result
returns directly to Gobbi. Every other result goes through Discussion for the user's accept/decline
choice; a decline produces no invented baseline.

### 4. Build a transient coverage frame

Inside Ideation DISCUSSION, load [`topics.md`](topics.md) and account for its eleven topic groups. Start
from verified evidence, mark the riskiest assumption, and order unanswered branches by dependency and
risk. The frame is working context, not a second ledger or stored artifact.

### 5. Ask one evidence-led question at a time

Use the anti-sycophancy and smart-skip rules in [`topics.md`](topics.md#anti-sycophancy-contract). Ask for
the last concrete event, current behavior, alternatives, and costs before accepting preferences. Show
verified repository facts first. After each answer, state the evidence read and what would change it.
Keep unresolved or contradicted claims explicit.

### 6. Pass the problem-before-solution gate

Before product-shape questions, present the problem premises listed in ST-8 for agree/correct. If a
premise fails, return to its earliest owning topic. Do not let a proposed solution narrow the earlier
problem or user after the fact.

### 7. Study, recommend, and resolve design directions

For each design-bearing branch, call [`../study/SKILL.md`](../study/SKILL.md) with the exact
Ideation cursor. Compare tried-and-true, new-and-popular, and first-principles evidence. Present at least
two distinct directions—one minimal and one ideal—with effort, risk, reuse, feasibility, a recommendation,
and evidence-to-change. Discussion owns the user decision. Record rejected directions in the returned
packet so Ideation can preserve the reasoning.

### 8. Check closure and viability

Revisit all eleven topic groups. Every required branch must be confirmed, proven irrelevant with a
reason, or open with an owner. Challenge contradictions, load-bearing assumptions, unsupported demand,
unclear authority, sensitive material, and infeasible or unsustainable directions. An open
load-bearing claim is valid coverage but is not evidence of readiness.

### 9. Return the Startup input packet

Return a structured packet containing:

1. trigger and classifier result;
2. verified repository and project-reference facts;
3. behavioral problem evidence and evidence strength;
4. first user, job, current alternative, and switching forces;
5. agreed scope, boundary, and non-goals;
6. rough product and system direction, alternatives, decisions, and evidence-to-change;
7. feasibility, sustainability, authority, license, and governance constraints;
8. contradictions, risks, open questions, and owners; and
9. the coverage disposition for every required topic branch.

The manager supplies this packet to ordinary Ideation DISCUSSION. Ideation owns any canonical artifact,
dual-system WORK, evaluation, finding disposition, RECORD staging, and later Wrap-up promotion. Startup
does not write the packet into the session tree or durable memory.

## Output contract

Startup returns either a classifier report or the structured Ideation input packet from step 9. It
creates no output path. A user decline returns the classifier plus the declined disposition and gaps;
it never fabricates missing project facts.

## Boundaries

- Discussion owns user questions and decisions.
- Workflow owns Configuration, the v3 cursor, productive-step transitions, and iteration policy.
- Ideation owns the first productive artifact and its full DISCUSSION → WORK → EVALUATION → RECORD loop.
- Study owns read-only evidence gathering for design-bearing questions.
- Record owns all session-tree writes and typed staging.
- Wrap-up owns durable promotion.
- Evaluation owns the seven perspectives, dual-system reports, verdict aggregation, and finding gate.

## References

- [`topics.md`](topics.md) owns the eleven-topic elicitation tree and its baseline-quality tests.
- [`scenarios.md`](scenarios.md), [`checklists.md`](checklists.md), and [`evaluation.md`](evaluation.md)
  exercise this operation without creating another lifecycle or output.
- [`../gobbi/SKILL.md`](../gobbi/SKILL.md) owns the Configuration trigger and read-only classifier gate.
- [`../workflow/SKILL.md`](../workflow/SKILL.md) owns the workflow and cursor.
- [`../ideation/SKILL.md`](../ideation/SKILL.md) owns accepted input and productive artifacts.
- [`../discussion/SKILL.md`](../discussion/SKILL.md) owns user-decision mechanics.
- [`../record/SKILL.md`](../record/SKILL.md) owns session records and staging.
- [`../memory/SKILL.md`](../memory/SKILL.md) and [`../wrap-up/SKILL.md`](../wrap-up/SKILL.md) own durable memory and promotion.
