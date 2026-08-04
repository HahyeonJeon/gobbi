---
name: checklist
description: "MUST load when creating or revising an evaluation checklist. Checklist authors one reusable, unchecked source for an exact subject and context."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Evaluation Checklist

A Checklist author uses this operation to create or revise one reusable, unchecked checklist for an exact
subject and context. The checklist states what later evaluation should be able to answer from evidence.

Its hierarchy follows the work instead of a fixed template. The development lifecycle and product lifecycle
help discover relevant scenarios and transitions, but they do not define categories, phases, or required order.

Checklist stops after source authoring. It does not execute conditions or judge the subject, and its delivered
source remains unchecked and result-free.

## Principles

### Let context and evidence shape coverage

Actual outcomes, people, interfaces, transitions, risks, and prior failures show what matters. The checklist
records supported expectations and names gaps where evidence or authority is missing.

### Describe scenarios before conditions

A condition becomes meaningful inside a concrete scenario with a trigger and observable outcome. Start with
that context, then state the smallest independently answerable expectations.

### Cover essentials and common mistakes

Check the behavior needed for the outcome and the mistakes most likely to make it fail or disappoint. Include
deficient-but-functioning quality when inconvenience, confusion, inconsistency, or poor appearance matters.

### Keep the source/judgment boundary clear

Checklist authors an expectation source; Evaluation owns later observations and judgment. Source content stays
unchecked even after an evaluator uses it.

## Rules

- **MUST bind the checklist to one exact subject, scope, and context.** State enough identity and evidence for
  a later evaluator to know what the source covers.
- **MUST discover context-driven scenarios before writing conditions.** Use lifecycle guidance and relevant
  perspectives as prompts only, never as required categories, sequences, counts, or coverage credit.
- **MUST make every condition atomic, observable, and independently answerable from evidence.** Keep each
  condition contextual to one scenario or to clearly stated shared context.
- **MUST cover essential behavior and common mistakes.** Include ordinary success, boundaries, failure,
  recovery, and materially deficient outcomes when they apply.
- **MUST keep the hierarchy and supporting details adaptable.** Use only the structure, fields, and identifiers
  that help this subject and caller.
- **NEVER write procedures, action logs, answers, results, scores, severity, or remediation into the source.**
  Deliver every checklist condition unchecked.

## Procedure

### Phase 1 — Frame the Source

#### 1.1 Freeze the subject and authoring context

- Identify the exact artifact, state, version, or content hash the checklist concerns.
- Record its intended outcomes, affected people, scope, governing requirements, known risks, prior failures,
  expected evidence, and material constraints.
- Split the work or stop for missing context when one checklist cannot describe a stable subject and outcome.

#### 1.2 Choose a useful source structure

- Build a free hierarchy that matches the subject. Prefer short descriptive headings over mechanical
  organization.
- Use an illustrative structure only where it helps: subject, scope, and evidence; scenario, context, trigger,
  expected and deficient outcomes; unchecked conditions; and unresolved gaps.
- The author may adapt or omit those fields. An evaluator may also adapt them in evaluation-owned notes, and
  identifiers are needed only when a caller requires traceability.
- Keep the source understandable without a separate schema or authoring conversation.

### Phase 2 — Discover Relevant Scenarios

#### 2.1 Study the work across its lifecycles

- Inspect actual behavior, intended outcomes, interfaces, dependencies, transitions, handoffs, operating
  conditions, governing inputs, risks, and available evidence.
- Use the development lifecycle to think through creation, change, verification, delivery, maintenance, and
  recovery where relevant.
- Use the product lifecycle to think through how the outcome is encountered, adopted, used, changed,
  supported, and left where relevant.
- Treat both lifecycles as discovery guidance. They are not required phases, fixed sequences, checklist
  sections, or measures of completeness.

#### 2.2 Write context-driven scenarios

- Consider ordinary success; boundaries and transitions; failure and recovery; and deficient-but-functioning
  outcomes such as inconvenience, unintuitive behavior, confusion, inconsistency, or poor appearance.
- Consider governance, misuse, abuse, or cosmetic compliance when the subject or evidence makes them relevant.
  These prompts are not scenario classes or quotas.
- State enough context, trigger, expected outcome, deficient outcome, and evidence boundary for each scenario
  to be understood and evaluated.
- Let relevant perspectives challenge evaluation boundaries when useful. Do not name a fixed set or record
  their use, order, number, or labels.
- Merge only scenarios that require the same context, evidence, and answer. Split material differences that
  would otherwise hide a boundary or failure.

### Phase 3 — Write the Checklist Conditions

#### 3.1 Derive atomic conditions

- Write one or more unchecked conditions for each material scenario.
- State the required observable condition, not how to test it. Keep the scenario context close enough that an
  evaluator can answer the condition from evidence.
- Split combined conditions when their answers, evidence, triggers, affected people, or consequences can
  differ.
- Reuse wording only when its meaning and required evidence remain the same in every stated context.

#### 3.2 Review essentials, mistakes, and gaps

- Confirm the checklist covers the essential behavior needed for the intended outcome and common mistakes
  supported by the subject, history, or domain.
- Challenge apparent success that still produces confusing, inconsistent, inconvenient, unintuitive, or poor
  quality results.
- Name unresolved gaps and the evidence, authority, or context needed to close them. Do not invent conditions
  merely to hide missing knowledge.
- Remove duplicate, vague, compound, unobservable, procedural, or result-bearing conditions.

### Phase 4 — Preserve and Hand Off the Source

#### 4.1 Verify the authored source

- Read the whole source against the frozen subject, intended outcomes, relevant scenarios, available evidence,
  and unresolved gaps.
- Confirm that each condition is atomic, observable, independently answerable, contextual, and still unchecked.
- Confirm that lifecycle guidance and perspectives helped discovery without becoming required organization or
  recorded coverage.
- Return to the earliest affected step when the review exposes a missing premise, scenario, condition, or gap.

#### 4.2 Hand off without judgment

- Preserve the exact unchecked source and its subject identity for independent evaluation.
- Keep later evidence, answers, findings, improvements, strengths, verdicts, and dispositions outside the
  source.
- If the subject or a material premise changes, revise the source as a new authoring action before it supports
  another judgment.

## References

- [Evaluation](../SKILL.md) owns independent read-only judgment of the frozen subject.
