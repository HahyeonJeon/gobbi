---
name: checklist
description: "Checklist is an operation for creating one reusable, unchecked evaluation source. It organizes lifecycle categories, broad expected scenarios, and independently answerable problem signs."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Checklist

Checklist creates or revises one reusable, unchecked evaluation source for a stable subject class or exact
target. Use it before Evaluation when lifecycle categories, broad expected scenarios, and observable problem
signs must be prepared; it stops before executing the items or judging the subject.

## Principles

### Let the subject determine coverage

Inspect the subject, intended results, affected people and systems, boundaries, risks, and available evidence
before choosing categories or scenarios. Include only coverage supported by that context.

### Assign each concern to its owning lifecycle

Project Lifecycle examines the project as a unit of work, while Design and Development Lifecycle examines how
project or product results are conceived, created, handed off, used within the work, maintained, and changed.
Product Lifecycle examines an operating app, service, library, or comparable product through consumer use,
operation, support, evolution, and retirement; a work artifact is not a product merely because it has readers
or downstream consumers.

### Keep scenarios broad and items precise

Use each expected scenario for one broad, coherent family of mistakes, omissions, violations, failures, or
poor results. Keep scenarios flat below their category, and put the precise observable signs in checklist items.

### Prefer broadly reusable checklist items

Write each item as one observable sign that its scenario's problem is present, not as a positive requirement,
test method, narrow example, command, file, implementation, or exact value. Add subject-specific detail only
when omitting it would make the sign ambiguous or unanswerable.

## Rules

- **MUST bind the checklist to one stable subject class or one exact target, plus its scope and context.** Give
  a reusable source an applicability boundary; give a target-specific source an exact artifact identity.
- **MUST use the fixed lifecycle structure in this order: Project, Design and Development, then Product.**
  Render each lifecycle at level two, each category at level three, and each broad expected scenario at level
  four; use Product only for an operating app, service, library, or comparable product.
- **MUST make each expected scenario one broad problem family that can group related checklist items.** Never
  nest scenarios, create a separate scenario for each sign, or invent a sign to meet a count.
- **MUST give each checklist item one broadly reusable, independently answerable sign of its scenario's
  problem.** Phrase the item as an undesirable observable condition; a checked item means the problem is present.
- **NEVER assign an ID to a lifecycle, category, scenario, or checklist item.** Use the
  lifecycle/category/scenario heading path when traceability is needed.

## Procedure

### Phase 1 — Understand the Subject

#### 1.1 Bind and inspect the subject

- Decide whether the checklist is reusable for a stable subject class or specific to one exact target. Record
  its intended evaluation use, applicability, scope, material exclusions, and shared context.
- Inspect affected people and systems, governing sources, interfaces, dependencies, states, transitions,
  handoffs, operating conditions, risks, prior failures, and available evidence.
- Separate verified facts from uncertainty and evidence gaps. Split the checklist or stop when one stable
  subject and boundary cannot be established.

### Phase 2 — Categorize the Lifecycles and Define the Scenarios

#### 2.1 Categorize the lifecycle views

- Use Project Lifecycle for the project as a unit of work from initiation through closure. Derive categories
  from applicable concerns such as purpose, scope, ownership, planning, governance, coordination, project
  structure, change control, documentation, and archival.
- Use Design and Development Lifecycle for how a project or product result is conceived, designed,
  implemented, verified, handed off, used within the work, delivered, maintained, and changed. Documents,
  designs, plans, source files, and other work artifacts remain in this lifecycle when later project work uses
  or revises them.
- Use Product Lifecycle only for an operating app, service, library, or comparable product and its consumers.
  Derive categories from applicable operation, user scenario, adoption, configuration, reliability, support,
  compatibility, migration, replacement, retirement, and exit concerns.

#### 2.2 Review lifecycle category coverage

- Compare the categories with the subject, intended results, governing sources, affected people and systems,
  interfaces, transitions, risks, and prior failures. Ensure every applicable material concern is covered.
- Place each concern by its owning viewpoint, not by the mere presence of a reader, handoff, or downstream
  consumer. Keep work-artifact use and revision in Design and Development; use Product only when the concern
  belongs to the operation or life of an app, service, library, or comparable product.
- Merge duplicate categories and remove unsupported categories, then recheck coverage. Return to Phase 1 when
  a category exposes an unstable boundary or material evidence gap.

#### 2.3 Define the expected scenarios

- For each lifecycle category, group related mistakes, omissions, violations, failures, and poor results into
  broad expected scenarios. Name each scenario as the problem family to avoid—for example, `The checklist has
  an unclear or unsupported boundary`, not `Subject identity` or one narrow missing field.
- Challenge each category with the applicable parts of this scenario spectrum without recording the prompt
  names as taxonomy:

  | Prompt | Ask about |
  |---|---|
  | **Positive / Good / normal** | The ordinary valid path fails to produce the intended result. |
  | **Alternative-valid** | A materially different valid input, actor, mode, or route is mishandled or rejected. |
  | **Negative / Bad / expected rejection** | Invalid input, state, authority, or precondition is accepted or causes a prohibited side effect. |
  | **Boundary / edge / transition** | Behavior becomes incorrect at a limit or transition. |
  | **Failure / recovery** | A failure is missed, spreads, or does not recover to the required state. |
  | **Poor quality** | The result functions but remains inconvenient, confusing, inconsistent, inaccessible, or poorly presented. |
  | **Rule violation** | The result breaks an applicable requirement, rule, decision, or governing constraint. |
  | **Adversarial / abuse / gaming / cosmetic compliance** | An actor exploits a boundary, or surface compliance hides a missing result. |
  | **Change / regression / compatibility** | A version or lifecycle change breaks required behavior or compatibility. |
  | **Counterfactual / assumption** | A false load-bearing premise survives without the required disconfirmation or recovery. |

- Keep every scenario directly below its category. Create another scenario only when the problem, context, or
  evidence frame is materially different; retain only scenarios supported by the subject or governing evidence.

#### 2.4 Review expected-scenario coverage

- Compare each category's scenarios with the subject, governing sources, prior failures, and scenario spectrum.
  Cover every supported material problem without treating the spectrum as a quota.
- Merge narrow or overlapping scenarios when their signs share one problem, context, and evidence frame. Split
  only a scenario that mixes materially different problem families.
- Recheck coverage after reconciliation. Return to the applicable lifecycle step for a missing or incorrect
  category, or Step 2.3 for missing, artificial, or misplaced scenarios.

### Phase 3 — Build the Checklist

#### 3.1 Derive the checklist items

- For each expected scenario, derive the observable signs that its mistake or failure is present. Phrase each item
  as one undesirable condition that can be answered independently—for example, `Two subjects with independent
  scopes appear in one checklist`.
- Add a separate item whenever its answer or evidence can differ. A scenario should normally own multiple
  related signs, but keep one supported sign rather than inventing filler.
- Return to Phase 2 when an item exposes a missing category or scenario. Do not compensate for a gap by
  writing a broad, compound, or ambiguous item.

#### 3.2 Assemble the checklist source

- Start from the [Checklist template](templates/checklist.md) and complete its subject, scope, and context.
- Keep `Project Lifecycle`, `Design and Development Lifecycle`, and `Product Lifecycle` as level-two sections
  in that order. Render categories at level three and broad expected scenarios at level four, using short,
  stable names and no IDs.
- Place each derived item unchecked below its scenario. State that checking an item means the problem is
  present.

### Phase 4 — Review Checklist Coverage and Quality

#### 4.1 Review checklist coverage and quality

- Trace the subject and governing sources through lifecycles, categories, scenarios, and items. Confirm every
  material problem is covered and every scenario has all supported observable signs.
- Remove IDs and duplicate, vague, compound, overly specific, unobservable, procedural, or result-bearing
  items. Merge over-specific scenarios, recheck coverage after every change, and confirm each item is
  independently answerable, reusable, and unchecked.
- Preserve the source unchanged for [Evaluation](../evaluation/SKILL.md). If the subject or a material premise
  changes, restart at the earliest affected phase before using the checklist again.

## References

| Name | Description |
|---|---|
| [Checklist template](templates/checklist.md) | Flat lifecycle, category, broad expected-scenario, and unchecked-item structure for a reusable checklist. |
| [Checklist document evaluation checklist](checklist.md) | Reusable unchecked source for evaluating checklist documents created by this operation. |
| [Evaluation](../evaluation/SKILL.md) | Operation that prepares a working checklist, evaluates one target, and writes its report. |
