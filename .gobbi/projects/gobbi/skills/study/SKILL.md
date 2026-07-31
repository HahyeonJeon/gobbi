---
name: study
description: "Use for bounded internal or external study that answers a question with source-grounded evidence and calibrated uncertainty."
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
skill-type: operation
---

# Study

Study is a read-only operation for answering one bounded question or goal with source-grounded evidence. It
accepts the request and any available context, scope, constraints, or preferred output form.

Study returns the answer in the requested form, or the shortest clear form when none is requested. It creates
no artifact and requires no report, headings, identity envelope, slug, destination, or output path.

## Principles

### Frame the question before searching

Make the purpose, scope, audience, and evidence needed to change the answer clear before gathering sources.

### Prefer the closest trustworthy evidence

Start with direct internal evidence for local facts and primary authoritative sources for external facts.

### Challenge the leading conclusion

Seek contradictions, counterexamples, failed searches, and limits instead of collecting only supporting
material.

### Return only useful supported claims

Connect each conclusion to evidence, distinguish fact from inference, and omit material that does not help
answer the request.

## Rules

- **MUST define the study before searching.** Identify the question or goal, purpose, scope, audience,
  constraints, and evidence that could change the answer; ask only when a missing fact could materially
  change the evidence or conclusion.
- **MUST keep the complete operation read-only.** Inspect sources and return a result without modifying the
  studied material or storing the result.
- **MUST prefer direct, primary, and authoritative evidence.** Verify each source's authority, freshness,
  version, relevance, applicability, and limits before relying on it.
- **MUST make every load-bearing claim verifiable.** Cite the exact file location, commit, command result, or
  direct source URL and explain whether the claim is fact or inference.
- **MUST preserve contrary and negative evidence.** State contradictions, counterexamples, unavailable
  sources, and scoped failed searches with their effect on the answer.
- **NEVER invent evidence or hide a load-bearing gap.** Qualify weak evidence and stop with the exact limit
  when a required claim cannot be supported.

## Procedure

### Phase 1 — Define the Study

#### 1.1 Understand the request

- Accept an ordinary question or goal plus any available context, scope, constraints, and requested output
  form.
- Identify the purpose, audience, included and excluded concerns, current understanding, and evidence that
  could strengthen, weaken, or change the answer.
- Ask for missing context only when proceeding without it could materially change source selection or the
  conclusion. Otherwise state the limited assumption and continue.

#### 1.2 Plan the evidence

- List the facts and claims the answer depends on and the sources that could establish, challenge, or refute
  them.
- Choose applicable internal and external evidence classes, authority and freshness needs, search bounds, and
  a stopping condition.
- Start with the closest evidence. Stop and state the blocker when no credible evidence path can answer a
  load-bearing part of the request.

### Phase 2 — Study and Challenge the Evidence

#### 2.1 Inspect applicable internal evidence

- Inspect relevant source files, tests, documentation, configuration, command results, and change history.
  Read definitions and surrounding context rather than relying on isolated matches.
- Capture exact file locations, sections, commits, or repeatable commands. Describe a failed search only
  within the paths, patterns, and history actually checked.
- Skip internal evidence when the question does not depend on local facts, and keep the reason clear in the
  working analysis.

#### 2.2 Inspect applicable external evidence

- Inspect external sources when the answer depends on standards, research, products, platforms, practices,
  or facts that internal evidence cannot establish.
- Prefer original research, standards, official documentation, maintainer sources, and direct data. Open the
  source itself and verify its date, version, authority, applicability, and limits.
- When the best source is unavailable, use weaker evidence only with an explicit qualification. Leave the
  claim unknown when no available source can support it.

#### 2.3 Compare and challenge the evidence

- Compare sources by authority, time, version, scope, method, and applicability. Explain conflicts instead of
  selecting the most convenient source or averaging disagreement away.
- Seek counterexamples and evidence that would disprove the leading conclusion. Preserve relevant negative
  results and hidden preconditions.
- Separate verified facts, supported claims, inferences, disputed claims, and unknowns. Perform a targeted
  follow-up search when it can resolve a material gap within scope.

### Phase 3 — Synthesize, Verify, and Return

#### 3.1 Build the answer

- Answer the bounded question directly, then connect each load-bearing conclusion to its strongest evidence
  and explain any inference needed to reach it.
- State contradictions, uncertainty, applicability limits, and the evidence that would change the answer.
- Use the requested output form. When none is requested, use the shortest clear form that preserves the
  answer, citations, and material limits; do not require a report or fixed headings.
- Remove sources, facts, and commentary that do not affect the answer.

#### 3.2 Verify and return the result

- Reopen or replay every load-bearing citation and confirm that it supports the attributed claim at the
  stated version, date, and scope.
- Check that the result stays within the request, distinguishes evidence from inference, exposes material
  uncertainty, and contains no fabricated or unverifiable claim.
- Return the source-grounded result without writing it anywhere. The caller may decide whether and where to
  store it after Study ends.
- When a load-bearing claim remains unsupported, return the exact evidence gap and its consequence instead of
  stating the unsupported conclusion.

## References
