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
before choosing categories or scenarios. Include only coverage the bound subject can exhibit from that
inspected context, not only families already named in a governing document.

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
- **MUST record a coverage account for the scenario spectrum and the lifecycle stages using only Covered, Not
  applicable, or Evidence gap.** The account is metadata, never a checklist item, and never a reason to invent
  a category, scenario, or sign.

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

- Use Project Lifecycle for the project as a unit of work from initiation through closure. Challenge the
  Project stages and derive categories from the Project prompts in these tables:

  | Lifecycle | Stages to challenge |
  |---|---|
  | Project | initiation, planning, governance, coordination, change control, closure or archival |
  | Design and Development | conceive, design, implement, verify, handoff, use in the work, deliver, maintain, change |
  | Product, only for an operating product | use, operate, configure, support, migrate, replace, retire |

  | Lifecycle | Category concern prompts |
  |---|---|
  | Project | purpose, scope, ownership, planning, governance, coordination, project structure, change control, documentation, archival |
  | Design and Development | conceive, design, implement, verify, handoff, use within the work, deliver, maintain, change |
  | Product, operating products only | operation, user scenario, adoption, configuration, reliability, support, compatibility, migration, replacement, retirement, exit |

- Use Design and Development Lifecycle for how a project or product result is conceived, designed,
  implemented, verified, handed off, used within the work, delivered, maintained, and changed. Keep
  documents, designs, plans, source files, and other work artifacts in this lifecycle when later project
  work uses or revises them, and challenge the Design and Development rows of those tables.
- Use Product Lifecycle only for an operating app, service, library, or comparable product and its consumers.
  Challenge the Product rows of those tables and derive Product categories only when that operating-product
  condition holds.

#### 2.2 Review lifecycle category coverage

- Walk the applicable category-concern prompt table from Step 2.1 against the subject, intended results,
  governing sources, affected people and systems, interfaces, transitions, risks, and prior failures. Record
  each unsupported concern with a subject reason, and keep every applicable material concern covered.
- Place each concern by its owning viewpoint, not by the mere presence of a reader, handoff, or downstream
  consumer. Keep work-artifact use and revision in Design and Development; use Product only when the concern
  belongs to the operation or life of an app, service, library, or comparable product.
- Fill every Step 2.1 stage into the lifecycle-stage account as Covered, Not applicable, or Evidence gap,
  without requiring one category per stage, then merge duplicate categories and remove unsupported categories.
  When Product has no supported coverage, write one Coverage Account line stating whether later-use, change,
  replacement, and retirement are not applicable or are absorbed by named Design and Development or Project
  categories; then recheck coverage and return to Phase 1 when a category exposes an unstable boundary or
  material evidence gap.

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
  evidence frame is materially different; retain only scenarios the bound subject can exhibit from inspected
  context.

#### 2.4 Review expected-scenario coverage

- Compare each category's scenarios with the subject, governing sources, prior failures, and scenario spectrum.
  Cover every supported material problem without treating the spectrum as a quota.
- Merge narrow or overlapping scenarios when their signs share one problem, context, and evidence frame. Split
  only a scenario that mixes materially different problem families; one scenario may cover several spectrum
  prompts, as in code-review/checklist.md Correctness → `Required behavior or failure handling is incomplete`.
- Fill every spectrum-prompt row in the coverage account as Covered, Not applicable, or Evidence gap, then
  recheck coverage after reconciliation. Return to the applicable lifecycle step for a missing or incorrect
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

- Start from the [Checklist template](templates/checklist.md) and complete its subject, scope, context, and
  both Coverage Account blocks from Steps 2.2 and 2.4.
- Keep `Coverage Account` as a level-two metadata section before the three lifecycle headings, then keep
  `Project Lifecycle`, `Design and Development Lifecycle`, and `Product Lifecycle` as level-two sections in
  that order. Render categories at level three and broad expected scenarios at level four, using short,
  stable names and no IDs.
- Place each derived item unchecked below its scenario. State that checking an item means the problem is
  present.

### Phase 4 — Review Checklist Coverage and Quality

#### 4.1 Review checklist coverage and quality

- Trace the subject and governing sources through lifecycles, categories, scenarios, items, and both Coverage
  Account blocks. Confirm every material problem is covered and every scenario has all supported observable
  signs.
- Remove IDs and duplicate, vague, compound, overly specific, unobservable, procedural, or result-bearing
  items, and confirm each item is independently answerable, reusable, and unchecked. Merge over-specific
  scenarios, recheck coverage and both account blocks after every change, and correct the account rather than
  the coverage when only the account is wrong.
- Preserve the source unchanged for [Evaluation](../evaluation/SKILL.md). If the subject or a material premise
  changes, restart at the earliest affected phase before using the checklist again.

## References

| Name | Description |
|---|---|
| [Checklist template](templates/checklist.md) | Coverage-account, lifecycle, category, broad expected-scenario, and unchecked-item structure for a reusable checklist. |
| [Checklist document evaluation checklist](checklist.md) | Reusable unchecked source for evaluating checklist documents created by this operation. |
| [Evaluation](../evaluation/SKILL.md) | Operation that prepares a working checklist, evaluates one target, and writes its report and working checklist. |
