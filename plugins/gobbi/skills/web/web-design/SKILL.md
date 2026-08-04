---
name: web-design
description: "MUST load when choosing or reviewing a web product's design problem, project identity, user-evidence threshold, alternative concepts, accepted design, validation judgment, post-release learning, replacement, or retirement criteria."
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
skill-type: preference
---

# Web Design

Use this preference skill for judgments across a web product's design lifecycle: discovery, definition,
alternatives, validation, delivery, live learning, iteration, replacement, and retirement. It owns the valid
choice space and the evidence needed to accept, reopen, replace, or retire a design.

This skill implements nothing and coordinates no delivery stage. [`web-frontend`](../web-frontend/SKILL.md)
applies accepted browser-facing decisions, [`web-development`](../web-development/SKILL.md) coordinates the
applicable development lifecycle, and each other specialist retains its own action, authority, and evidence.
Rules define the boundary, Preferences select defaults inside it, and a Rule wins every conflict.

## Principles

### Identity constrains from the foundation

Identity is the product's promise, character, voice, and recognizable patterns. It shapes allowed visual design
from the first structural choice and never excuses avoidable exclusion or harm.

### The problem and affected people precede a solution

A design decision starts with the observed problem, affected people, current behavior, and consequence. A
solution accepted before those are concrete is an unsupported preference.

### Observed use outranks preference

What representative people do with a design is stronger evidence than stakeholder preference or convention.
A claim about people rests on evidence from those people.

### The lifecycle remains revisitable

Validation, delivery, and release do not make a design permanently correct. New evidence returns to the
earliest decision it invalidates and may lead to refinement, replacement, or retirement.

## Rules

- **MUST establish project identity through one authority chain:** explicit `DESIGN.md`, brand, product, or
  design-system material, then the live product, system, and tokens, then a user-confirmed run-scoped brief.
  NEVER create or prescribe a project-wide `DESIGN.md`, and record the selected source beside the decisions it
  constrains.
- **MUST name the evidence class each design claim rests on, and obtain new representative-user evidence
  before accepting a material choice that is novel, uncertain, exclusionary, consequential, security- or
  compatibility-sensitive, hard to reverse, or carries material risk of harm.** Standards, expert review,
  prior research, analytics, and a project owner's familiarity frame a choice but NEVER support a claim about
  what people can perceive, operate, complete, or recover from.
- **MUST compare at least two materially different concepts before selecting one.** Concepts differ in
  hierarchy, action model, information flow, interaction strategy, or state communication; a variant of
  color, type, spacing, icon style, or wording is the same concept, and a single-concept exception records the
  real constraints and evidence behind it.
- **MUST keep one accepted design record through discovery; definition; developing alternatives; setting the
  validation threshold; validation and selection; completing the accepted design; implementation handoff;
  delivery validation judgment; live learning; iteration or reopen; replacement; retirement criteria; and the
  terminal retired design.** Every stage transition names its material input, success output, failure return,
  next handoff, evidence claim, and reopen condition.
- **NEVER decide detailed visual design while structure, behavior, content, feedback, recovery, adaptation, or
  accessibility is unresolved.** Each visual choice must improve hierarchy, state recognition,
  affordance, trust, or identity fit rather than conceal missing structure or inaccessible behavior.
- **NEVER claim implementation, release, deployment, live operation, or retirement action from a design
  judgment.** Record the accepted decision and route each action to its semantic owner.

## Preferences

### Prefer the live product as the identity source

**PREFER** what the shipped product already teaches its users over a described intention. Depart when the
governing design material is current and the live product is the stale artifact.

### Prefer the smallest evidence that can change the decision

**PREFER** the evidence class that could still falsify the choice at hand, and raise the class as the
consequence of being wrong grows. Select the class before deciding; evidence collected after a choice is
locked does not satisfy the evidence Rule.

### Prefer an alternative that changes a consequential property

**PREFER** exploring a different action model, information flow, or state model over a second visual
treatment of one model. Depart when a recorded constraint leaves only one viable model, and state that
constraint beside the decision.

### Prefer visual design that carries meaning

**PREFER** typography, color, density, spacing, shape, and imagery choices that make hierarchy, state, or
affordance easier to read. Depart only for a recorded identity obligation, and never below the
[`html-css-conventions`](../../html-css/html-css-conventions/SKILL.md) floor.

### Prefer motion that explains a state change

**PREFER** a transition when it makes a change of state, location, or causality legible, and no motion
otherwise. This skill decides whether motion is warranted and what it must communicate; the safety floor
stays with [`html-css-conventions`](../../html-css/html-css-conventions/SKILL.md) and the emitted mechanics with
[`html-css-motion`](../../html-css/html-css-motion/SKILL.md).

### Prefer the earliest accurate return

**PREFER** returning new evidence to the earliest design stage whose accepted input or outcome it invalidates.
Record exactly one current disposition: retain, refine, replace, retire, or reopen.

### Prefer replacement and retirement to be designed outcomes

**PREFER** explicit affected-user, migration, support, and successor evidence before replacement or
retirement. A retired design reaches a named terminal state; a replaced design names the decision and version
that succeeds it.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
