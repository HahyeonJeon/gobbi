---
name: checklist
description: "MUST load when creating or revising an evaluation checklist. Checklist is an operation sub-skill for organizing the fixed evaluation perspectives into scenarios with nested atomic checklist rows."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Evaluation Checklist

Use this sub-skill to create one reusable, unchecked evaluation checklist source for a defined subject. Work
through four phases: understand the context and coverage, create scenarios by perspective, create checklist
rows by scenario, then review and improve the complete source.

The source has one nested hierarchy:

`Perspective → Scenario → Checklist rows`

Checklist ends when the unchecked `checklists.md` source is complete and ready for the parent
[Evaluation](../SKILL.md) skill. It does not execute or resolve the source.

## Principles

### Coverage combines independent concerns

Strong evidence about one concern does not establish another. Complete coverage considers the subject from
independent perspectives and under materially different situations.

### Context gives a condition meaning

A condition can be technically true while missing the intended outcome. Its context explains why the
condition matters and makes a failure interpretable.

## Rules

- **MUST keep Checklist source-authoring only.** Checklist owns the reusable perspective, scenario, and
  checklist-row structure. Evaluation or an applicable domain owner owns evidence methods, tests, filled
  copies, row results, problems, optional improvements, strengths, coverage closure, and verdicts.
- **MUST use the six scenario classes literally.** Use `Normal case` for ordinary valid success, `Edge case`
  for an exact limit or transition, `Expected failure` for safe rejection, containment, or recovery, `Poor
  quality` for materially deficient work that still functions, `Rule violation` for an applicable governing
  constraint the work breaks, and `Adversarial` for abuse, gaming, trust-boundary exploitation, or cosmetic
  compliance.

## Procedure

### Phase 1 — Understand Context and Coverage

#### 1.1 Bind the subject and source

- Read the Evaluation contract, the exact subject and version, its intended outcome, applicable requirements,
  scope, rules, decisions, risks, prior failures, and domain guidance.
- Declare one short uppercase owner prefix for stable scenario and checklist-row IDs.
- Create one unchecked `checklists.md` source for the subject and version.
- Stop when the subject is changing, incomplete, substituted, or too imprecise to support stable scenarios.

#### 1.2 Create the perspective skeleton

- Create the title and all eight perspective headings.
- Use the perspective meanings from
  [Evaluation Step 2.2](../SKILL.md#22-review-each-perspective) without
  redefining them.
- Keep the headings in this exact order:

```markdown
## Project
## Structure
## Performance
## Aesthetics
## Usage
## Consistency
## Risk
## Overall
```

#### 1.3 Understand applicable coverage

- Examine the subject, sources, and intended outcome through every perspective.
- Consider all six scenario classes within each perspective as applicability prompts, not mandatory quotas.
- Keep a perspective open for Phase 2 when one or more material scenarios apply.
- When no scenario applies, write `Not applicable: <evidence-based reason>` directly beneath the perspective
  heading.
- Do not use absence, convenience, or another perspective's coverage as an inapplicability reason.

### Phase 2 — Create Scenarios by Perspective

#### 2.1 Traverse the perspectives

- Work through Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall in order.
- For each applicable perspective, identify the materially distinct situations needed to evaluate its
  concerns.
- Select only the scenario classes that the subject, its sources, or its risks make relevant.
- Return to Phase 1 when a perspective's applicability or governing context remains unclear.

#### 2.2 Write each scenario

- Place each scenario beneath one owning perspective.
- Give it a stable `<OWNER>-SC-<PERSPECTIVE>-NN` ID and name its scenario class in the heading.
- Write one short prose paragraph that makes the context, expected outcome, and observable failure condition
  clear without using a field form.
- Create similar scenarios under different perspectives only when their expected outcome or observable failure
  differs.
- Cite only governing rules that actually apply. Do not invent a rule to manufacture a Rule violation
  scenario.

Use this shape:

```markdown
## <Perspective>

### <OWNER>-SC-<PERSPECTIVE>-NN — <Scenario class>: <title>

<Context, expected outcome, and observable failure condition.>
```

### Phase 3 — Create Checklists by Scenario

#### 3.1 Write the checklist rows

- Add `#### Checklist` directly beneath every scenario and write at least one unchecked row.
- Give each row a stable `<OWNER>-CK-<PERSPECTIVE>-NN-NN` ID. Reuse the scenario ordinal as the row's first
  ordinal.
- State one binary, independently answerable condition specific to the scenario.
- Write the row as a condition, not an action log. Keep it stable under prose reordering.
- Exclude test specifications, evidence metadata, severity, scoring, and remediation instructions.
- Define each row once beneath its owning scenario. When another scenario reuses that row, write
  `- Also applies: <row ID> (<short label>).` beneath its own rows. The ID resolves to the owning scenario,
  and the line carries no checkbox, so it stays visible without counting toward the six-row cap.
- Split a row that states two different conditions. Never split a row that applies one condition to several
  members of a set: keep one row that names every member, and never generalize the members away.
- Decide with a placeholder test. Replace only the varying subject or object with a placeholder and leave
  every verb phrase as written. Merge only when the residual verb phrases name the same required state;
  broadening a verb phrase to make two rows match proves two states, not one.
- Read this boundary with the six-row scenario cap and the fifty-three-row source cap at Step 4.1. A cap alone
  invites compound rows, and this boundary alone depends on the author noticing the fan-out.

Use this shape:

```markdown
#### Checklist

- [ ] <OWNER>-CK-<PERSPECTIVE>-NN-NN — <condition>
- Also applies: <OWNER>-CK-<PERSPECTIVE>-NN-NN (<short label>).
```

#### 3.2 Reconcile each scenario checklist

- Confirm that every scenario has at least one checklist row.
- Confirm that every row has one stable ID, one owning scenario, and one condition.
- Remove duplicate definitions, then apply the Step 3.1 split and placeholder tests to every row.
- Return to Phase 2 when a row exposes missing, ambiguous, or incorrect scenario context.

### Phase 4 — Review and Improvement

#### 4.1 Review coverage and traceability

- Review all eight perspective headings and every `Not applicable` reason against the bound subject.
- Trace every applicable requirement, rule, decision, risk, and prior failure to at least one scenario and
  checklist row.
- Review the six scenario classes for materially missing situations without imposing a fixed count per
  perspective.
- Count the rows beneath each scenario. A scenario carries at most six rows; a longer list means a Step 3.1
  merge was missed, not that the cap is wrong.
- Merge the fanned-out rows first, then split the scenario when more than six different conditions remain.
  Never meet the count by dropping a traced row or by bundling conditions into one row.
- Count the rows in the whole source. A source carries at most fifty-three rows; a longer list means the bound
  subject holds more than one source's obligations, not that the cap is wrong. This figure rose from fifty
  once the Step 3.1 split rule made every compound row atomic, because atomic rows state the same obligations
  in more lines. The count therefore bounds the subject's breadth, not its coverage.
- Merge the fanned-out rows across every scenario first, then return to Step 1.1 and bind a narrower subject
  when more than fifty-three different conditions remain. Never meet either count by dropping a traced row or
  by bundling conditions into one row.
- Return to the earliest affected phase when a perspective, source obligation, or material situation lacks
  coverage.

#### 4.2 Challenge the source

- Pilot the applicable normal, edge, expected-failure, poor-quality, rule-violation, and adversarial cases
  against representative passing and failing subjects.
- Confirm that superficially compliant but substantively broken work fails at least one row.
- Reject ambiguous scenarios, broad or context-free rows, duplicate definitions, unsupported inapplicability
  reasons, and conditions that cannot distinguish success from failure.
- Return to the earliest affected phase when a pilot produces an incorrect or indeterminate result.

#### 4.3 Improve and preserve the source

- Add missing scenarios or rows, split broad items, clarify ambiguous prose, remove duplicates, and correct
  perspective ownership.
- Repeat Steps 4.1 and 4.2 after every material improvement.
- Verify that every checklist row remains unchecked and contains no evidence, result, or verdict.
- Preserve the complete `checklists.md` source and hand it to Evaluation.

## References
