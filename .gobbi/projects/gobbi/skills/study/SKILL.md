---
name: study
description: "Study is an operation for producing source-grounded findings and recommendations from reliable internal and external materials."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Study

Study investigates one bounded question to support the best design, development approach, or decision. Use it
when current work needs reliable internal or external evidence, a recommendation, and clear limits. It keeps
studied materials read-only and may return a concise response or write one caller-requested result.

## Principles

### Frame the decision before searching

Define the question, purpose, consumer, criteria, scope, and evidence needed to change the answer before
gathering materials.

### Prefer the closest trustworthy materials

Start with direct internal evidence for local facts and primary authoritative sources for external facts.
Assess each material before relying on it.

### Challenge the leading direction

Seek contradictions, counterexamples, failed searches, credible alternatives, and limits instead of collecting
only supporting material.

### Recommend the best-supported direction

Use reliable evidence for every conclusion and recommendation. Explain why the direction fits, its trade-offs,
and what would change it; the caller retains acceptance and action.

## Rules

- **MUST define the Study before searching.** Identify the assigned actor, caller, question or goal, purpose,
  consumer, criteria, scope, constraints, evidence needed, and the caller-owned decision or action it advises.
- **MUST keep every studied material read-only.** Write a result only when the caller requests saving,
  authorizes creation or revision, and supplies the exact absolute destination and allowed write boundary.
- **MUST use the Study template for a saved result.** Render [`templates/study.md`](templates/study.md) at the
  caller's destination. Otherwise return the shortest source-grounded response that preserves material limits.
- **MUST prefer direct, primary, and authoritative evidence.** Check authority, freshness, version, relevance,
  applicability, and limits before relying on a material.
- **MUST make every decision-critical claim verifiable.** Cite the exact file location, commit, command result, or
  direct source URL, and distinguish verified fact from supported inference.
- **NEVER invent evidence or hide contrary evidence or a decision-critical gap.** Preserve contradictions,
  counterexamples, unavailable sources, scoped failed searches, and their effect on the result.

## Procedure

### Phase 1 — Frame the Study

#### 1.1 Understand the question and purpose

- Confirm the assigned Study actor and caller, the bounded question or goal, the design, development, or decision
  it must improve, and who will use the result.
- Define the decision criteria, included and excluded concerns, constraints, current understanding, and
  evidence that could strengthen, weaken, or change the answer.
- State the advisory boundary and completion condition: Study ends with a verified response or authorized saved
  result and does not accept a design, make the caller's decision, plan implementation, or implement changes.
  Ask for context only when its absence could materially change the result; otherwise state the assumption.

#### 1.2 Plan the materials

- List the decision-critical claims—the claims that could change the conclusion or recommendation—and the
  internal or external materials that could establish, challenge, or refute them.
- Set authority and freshness needs, search bounds, material exclusions, and a stopping condition.
- Start with the closest credible material. Stop with the exact blocker when no evidence path can support a
  decision-critical claim.

### Phase 2 — Study the Materials

#### 2.1 Inspect internal materials

- Inspect relevant source files, tests, documentation, configuration, command results, and change history. Read
  definitions and surrounding context rather than isolated matches.
- Capture exact file locations, sections, commits, or repeatable commands. Describe a failed search only within
  the paths, patterns, and history actually checked.
- Skip internal materials when the question does not depend on local facts, and keep the reason clear in the
  working analysis.

#### 2.2 Inspect external materials

- Inspect external materials when the answer depends on standards, research, products, platforms, practices,
  or facts that internal evidence cannot establish.
- Prefer original research, standards, official documentation, maintainer sources, and direct data. Check each
  material's date, version, authority, applicability, and limits.
- Use weaker evidence only with an explicit qualification when the best source is unavailable. Leave a claim
  unknown when no available source can support it.

#### 2.3 Compare and challenge the evidence

- Compare materials by authority, time, version, scope, method, and applicability. Explain conflicts instead of
  selecting the most convenient source or averaging disagreement away.
- Seek counterexamples and evidence that would disprove the leading direction. Preserve relevant negative
  results and hidden preconditions.
- Separate verified facts, supported inferences, disputed claims, and unknowns. Run a targeted follow-up search
  when it can resolve a material gap within scope.

### Phase 3 — Produce the Result

#### 3.1 Form the conclusion and recommendation

- Answer the bounded question directly, then recommend the direction that best fits the stated criteria and
  available evidence.
- Compare credible alternatives and explain the important trade-offs, contrary evidence, and applicability
  limits.
- State the next design, development, decision, or evidence-gathering action and the condition that would change
  the recommendation.

#### 3.2 Verify the result

- Reopen or replay every decision-critical citation. Confirm that it supports the attributed claim at the stated
  version, date, and scope.
- Check that the result answers the question, distinguishes evidence from inference, exposes material gaps, and
  contains no fabricated or unverifiable claim.
- Remove sources, claims, and commentary that do not affect the conclusion, recommendation, trade-offs, or
  limits.

#### 3.3 Return or save the result

- Return a concise response with the direct answer, best-supported recommendation, decision-critical citations,
  material limits, and reconsideration condition when the caller did not authorize a saved result.
- Before saving, reconfirm the caller's authorization, exact absolute destination, and allowed write boundary.
  Render [`templates/study.md`](templates/study.md), reread it, and report the path and verification.
- When delegated, also return the brief's final Handoff for every terminal status. A saved Study result never
  replaces that Handoff.

## References

| Name | Description |
|---|---|
| [Study result template](templates/study.md) | Compact structure for a caller-requested saved Study result. |
| [Delegation](../delegation/SKILL.md) | Final Handoff ownership and content when Study is assigned to a subagent. |
| [Gobbi Skill](../gobbi-skill/SKILL.md) | Shared rules for compact skill structure, sentences, vocabulary, and complexity. |
