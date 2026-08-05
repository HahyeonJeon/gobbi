---
name: checklist
description: "MUST load when creating or revising an evaluation checklist. Checklist guides lifecycle categorization, recursive scenario decomposition, and unchecked condition authoring for an exact subject."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Evaluation Checklist

A Checklist author uses this operation to create or revise one reusable, unchecked evaluation source for an
exact subject and context.

The author studies the subject, categorizes its design, development, and product lifecycles, builds a complete
top-down scenario hierarchy, and only then writes checklist conditions for independently evaluable leaves.
Lifecycle categories follow the subject, while a scenario spectrum helps expose good, bad, and overlooked
situations without becoming a required taxonomy.

Checklist stops after source authoring. It does not execute conditions or judge the subject, and its delivered
source remains unchecked and result-free.

## Principles

### Study before organizing

Actual outcomes, affected people and systems, interfaces, transitions, risks, prior failures, and available
evidence determine which lifecycle categories and scenarios matter.

### Categorize lifecycles before writing scenarios

Design, development, and product lifecycles are distinct views of how the same subject changes across
positions and transitions. They may overlap or recur, so derive each from the subject instead of treating
them as one fixed sequence.

### Decompose scenarios from parents to leaves

Start with broad situations and recursively split them until each leaf can be evaluated independently. Parent
meaning guides its children, while material differences stay visible in separate branches.

### Finish scenarios before writing conditions

Checklist conditions reduce understood leaf scenarios to observable expectations. Writing them before the
scenario hierarchy closes hides missing or confused situations behind plausible rows.

## Rules

- **MUST bind the source to one exact subject, scope, and context.** State enough identity and evidence for a
  later evaluator to know what the source covers.
- **MUST categorize the design, development, and product lifecycles separately before writing scenarios.**
  Derive categories from inspected context, never from a universal list.
- **MUST use the scenario spectrum only as discovery guidance.** Its terms are prompts, not required labels,
  nodes, sequences, counts, quotas, or coverage credit.
- **MUST recursively decompose broad scenarios parent-first.** Stop only when each leaf describes one
  independently evaluable situation, and return to lifecycle categorization when a branch exposes a gap.
- **MUST complete and review the scenario hierarchy before writing checklist conditions.** Give every material
  leaf one or more atomic, observable, independently answerable conditions.
- **NEVER write procedures, action logs, answers, results, scores, severity, or remediation into the source.**
  Deliver every checklist condition unchecked and keep later judgment outside the source.

## Procedure

### Phase 1 — Study and Frame the Subject

#### 1.1 Bind and inspect the authoring context

- Identify the exact artifact, state, version, or content hash the checklist concerns.
- Inspect intended outcomes, affected people and systems, scope, requirements, rules, decisions, risks, prior
  failures, available evidence, and material constraints.
- Trace actual behavior, interfaces, dependencies, states, transitions, handoffs, operating conditions, and
  creator, designer, developer, consumer, or user positions when they affect the outcome.
- Separate inspected facts from uncertainty and missing evidence. Split the work or stop when one source
  cannot describe a stable subject and outcome.

### Phase 2 — Categorize the Lifecycles

#### 2.1 Categorize the design lifecycle

- The design lifecycle follows how needs and constraints become validated intent that creators can realize.
  Derive its categories from how needs and constraints are understood, evidence is gathered, requirements are
  framed, alternatives are explored, decisions are made, structures are modeled, and designs are validated,
  revised, or handed off. These examples prompt study and prescribe no list.
- Include a transition or handoff as its own category when it creates a materially different responsibility,
  risk, outcome, or evidence need.
- Name each category for the subject-specific concern it groups. Record missing support as an unresolved gap
  instead of inventing a category or scenario.

#### 2.2 Categorize the development lifecycle

- The development lifecycle follows how design intent becomes and remains a working result. Derive its
  categories from how the result is prepared for implementation, created, integrated, changed, verified,
  delivered, maintained, or recovered. These examples prompt study and prescribe no list.
- Include a transition or handoff as its own category when it creates a materially different responsibility,
  risk, outcome, or evidence need.
- Name each category for the subject-specific concern it groups. Record missing support as an unresolved gap
  instead of inventing a category or scenario.

#### 2.3 Categorize the product lifecycle

- The product lifecycle follows the relationship between a result and its consumers, from encounter through
  exit. Derive its categories from how the result is encountered, adopted, configured, used, changed,
  supported, replaced, or left. These examples prompt study and prescribe no list.
- Consider each affected position, including developers as product consumers for a library, software
  development kit, application programming interface, or tool.
- Keep each lifecycle view separate. Compare their category trees for missing, overlapping, or conflicting
  boundaries before writing scenarios.

### Phase 3 — Build the Scenario Hierarchy

#### 3.1 Generate top-level scenarios

- For each supported lifecycle category, derive the materially different situations that the subject should
  handle or that later evaluation should distinguish.
- Challenge each category with the applicable parts of this scenario spectrum:

  | Prompt | Ask about |
  |---|---|
  | **Positive / Good / normal** | The ordinary valid path produces the intended outcome. |
  | **Alternative-valid** | A materially different valid input, actor, mode, or route also succeeds. |
  | **Negative / Bad / expected rejection** | Invalid input, state, authority, or precondition is rejected safely without a prohibited side effect. |
  | **Boundary / edge / transition** | Behavior at an exact limit or transition remains correct. |
  | **Failure / recovery** | A dependency, partial operation, timeout, interruption, or internal failure is detected, contained, and recovered. |
  | **Poor quality** | The result functions but is inconvenient, unintuitive, confusing, inconsistent, or poorly presented. |
  | **Rule violation** | The result breaks an applicable requirement, rule, decision, or governing constraint. |
  | **Adversarial / abuse / gaming / cosmetic compliance** | An actor exploits a boundary, or surface compliance hides a missing outcome. |
  | **Change / regression / compatibility** | Behavior remains correct across a version or lifecycle change. |
  | **Counterfactual / assumption** | A load-bearing premise is inverted and produces the expected disconfirmation or recovery. |

- Instantiate only scenarios supported by the subject, evidence, or a named gap. Do not require a spectrum
  term in a scenario heading or create a scenario merely to represent a term.
- Describe each scenario in ordinary subject language so its situation and observable outcome are clear
  without a required field form.

#### 3.2 Recursively decompose each scenario

- Work parent-first and depth-first. Split every broad scenario into child scenarios that preserve the
  parent's meaning while making material differences explicit.
- Split when affected position, precondition or trigger, state or transition, expected or deficient outcome,
  or required evidence can differ.
- Continue until each leaf can be evaluated independently without first resolving a sibling. Keep a parent as
  the summary of its descendants, not as a substitute for their distinct situations.
- Choose a hierarchy that fits the subject. When useful, adapt the optional
  [starter template](templates/checklist.md); its rendering and depth are not a schema.
- Return to Phase 2 when decomposition exposes a missing or incorrect lifecycle category.

#### 3.3 Review and close the scenario hierarchy

- Review all lifecycle trees against the subject, governing sources, prior failures, and scenario spectrum.
- Reconcile parent-child meaning, sibling boundaries, unsupported branches, and unresolved gaps. Merge only
  scenarios with the same situation, outcome, and evidence need.
- When the same scenario spans more than one lifecycle view, define it once and reference its exact path from
  each other view unless the affected position, trigger, outcome, or evidence differs.
- Freeze the complete scenario hierarchy before continuing. Write no checklist condition while a material
  category, branch, leaf boundary, or gap remains unresolved.

### Phase 4 — Write and Verify the Checklist Conditions

#### 4.1 Write conditions for the scenario leaves

- Create a checklist section for every material leaf scenario and preserve its exact hierarchy path.
- Write one or more unchecked conditions that state the required observable result, not how to test it.
- Split a condition when its answer, evidence, affected position, trigger, or consequence can differ. Reuse
  wording only when its meaning and evidence remain the same.
- Use identifiers only when a caller requires traceability. Keep shared context at the nearest useful parent
  instead of repeating it in every row.
- Return to Phase 3 when a condition exposes a missing, broad, or ambiguous scenario.

#### 4.2 Review and hand off the completed source

- Read the complete source from subject through lifecycle categories, scenario branches, leaves, and
  conditions. Confirm every material category reaches an independently evaluable leaf and every material leaf
  has at least one condition.
- Confirm the scenario spectrum improved discovery without becoming recorded taxonomy or coverage credit.
- Remove duplicate, vague, compound, unobservable, procedural, or result-bearing conditions. Confirm every
  remaining condition is contextual, independently answerable, and unchecked.
- Return to the earliest affected phase when review exposes a missing premise, category, scenario, leaf,
  condition, or gap.
- Preserve the exact unchecked source for independent [Evaluation](../SKILL.md). If the subject or a material
  premise changes, restart at the earliest affected phase before the source supports another judgment.

## References

- [Checklist starter](templates/checklist.md) provides one optional rendering for the hierarchy and leaf conditions.
