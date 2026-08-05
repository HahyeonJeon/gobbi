---
name: desktop-interface
description: "MUST load when choosing or reviewing research evidence, interface requirements, product identity, interface concepts, prototypes, representative-user evidence, visual style, interaction or motion intent, accessibility, adaptation, success measures, or interface improvement decisions for an installable Electron desktop application written in TypeScript."
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
skill-type: preference
---

# Desktop Interface

Use this preference skill to judge an installed desktop application's complete design lifecycle. It owns the
current results for Discovery research, Problem framing and design requirements, Concept alternatives,
Prototyping, Representative-user testing, Design–implementation collaboration, and Post-release measurement
and improvement; [`desktop-development`](../desktop-development/SKILL.md) owns the order and coordination of
that work.

Every activity receives one bounded result, including when current evidence is reused or the activity is not
applicable. These judgments preserve project identity, keep evidence able to change a choice, compare real
alternatives, test representative use, settle expression only after the experience contract, and reopen a
decision when post-release evidence challenges it.

This skill decides whether an interaction or motion is warranted and what state, location, or causality it
must communicate. It does not own mechanics: event, pointer, keyboard, focus, drag, gesture, widget-pattern,
and script-driven interaction or motion mechanics route to
[`web-interaction`](../../web/web-interaction/SKILL.md), while declarative motion mechanics route to
[`html-css-motion`](../../html-css/html-css-motion/SKILL.md). Product structure and runtime outcomes remain with
[`desktop-architecture`](../desktop-architecture/SKILL.md), release judgment with
[`desktop-release`](../desktop-release/SKILL.md), Electron mechanisms with the
[`electron`](../../electron/SKILL.md) family, current operating-system facts with the matching desktop OS
owner, and other renderer policy with its web, HTML/CSS, React, or TypeScript owner. Rules define the valid
choices below; Preferences recommend defaults inside that boundary, and Rules win every conflict.

## Principles

### Identity constrains from the foundation

Identity is the product's promise, character, voice, and recognizable patterns, and it shapes allowed
expression from the first structural choice. It never excuses avoidable exclusion or harm.

### Structure earns expression

Detailed expression is decided after structure, behavior, content, feedback, recovery, adaptation, and
accessibility are settled. Expression can strengthen a sound experience; it cannot repair a missing one.

### Observed use outranks preference

What representative people do with a design is stronger evidence than stakeholder preference or design
convention. A claim about people rests on evidence from those people.

### Two real options precede one choice

A single candidate is a decision already made. Materially different options make the trade-off visible before
it is locked.

## Rules

- **MUST give each of the seven design activities exactly one result with exactly one disposition:**
  `Performed for the current subject`, `Reused current evidence`, or `Not applicable with exact reason`.
  Every result MUST name the actor or owner, subject and scope, current inputs, method, evidence, decision
  state, counterevidence, failure, uncertainty, limitations, dependencies, routes, trace, reopen condition,
  and evidence location, and MUST return without closing when an applicable condition in the table below
  holds.
- **MUST prove a non-performed disposition rather than use it as a shortcut.** Reused evidence records the
  exact subject, affected people, source and date, context and conditions, falsifiability, and current reach;
  a not-applicable result proves the activity cannot change the scoped decision and that no binding risk
  trigger applies.
- **MUST establish project identity through one authority chain:** explicit `DESIGN.md`, brand, product, or
  design-system material, then the live product, system, and tokens, then a user-confirmed run-scoped brief.
  NEVER create or prescribe a project-wide `DESIGN.md`, and record the selected source beside the decisions it
  constrains.
- **MUST name and choose each design claim's evidence class before the choice, prototype at the fidelity
  needed to falsify it, and compare at least two concepts that differ in hierarchy, action model, information
  flow, interaction strategy, or state communication; color, type, spacing, icon-style, or wording variants
  are one concept, and a single-concept exception records the real constraints and evidence.** New
  representative-user evidence is required before accepting a material choice that is novel, uncertain,
  exclusionary, consequential, security- or compatibility-sensitive, hard to reverse, or carries material
  risk of harm; standards, expert review, prior research, analytics, and project-owner familiarity cannot
  prove what people can perceive, operate, complete, or recover from.
- **NEVER decide detailed expression while structure, behavior, content, feedback, recovery, adaptation, or
  accessibility is unresolved; every expressive choice MUST improve hierarchy, state recognition,
  affordance, trust, or identity fit rather than conceal missing structure or inaccessible behavior.** Every
  required action, state, and meaning MUST be available through each supported desktop modality—window
  chrome, menus, tray, global and in-window shortcuts, notifications, keyboard, pointer, and assistive-input
  paths—and be legible before action, with consequence, reversibility, and recovery at the decision point;
  each applicable interaction or motion judgment MUST state whether it is warranted and what state, location,
  or causality it communicates, routing event, pointer, keyboard, focus, drag, gesture, widget-pattern, and
  script-driven mechanics to `web-interaction` and declarative motion mechanics to `html-css-motion`.
- **MUST define harm-aware success measures and keep their decisions reopenable after release.** Name each
  measure's intended and harmful interpretation, its guardrail, and the evidence that reopens the design;
  every post-release review uses answerable signals, bounded monitoring, and a named owner and consumer, and
  closes only with an explicit improvement or no-change decision and an explicit Maintenance decision, while
  a no-change result stays dated, bounded, and falsifiable.

### Activity return conditions

The first Rule makes this table binding. A result cannot close while any condition in its row holds.

| Activity | Named result | Return condition |
|---|---|---|
| Discovery research | Discovery evidence reviewed | Sources are weak or stale; affected people, context, or counterevidence is missing; uncertainty is unresolved; or the evidence cannot affect the decision. |
| Problem framing and design requirements | Design requirements accepted for the current subject | A problem or requirement is invented, solution-locked, authority-free, untraceable, incomplete, or contradicted. |
| Concept alternatives | Concept decision recorded | Alternatives are cosmetic variants, trade-offs are hidden, or fewer than two material concepts remain without the evidenced single-viable exception. |
| Prototyping | Prototype evidence reviewed | Fidelity hides the question; required paths, states, failure, recovery, accessibility, or adaptation are missing; or prototype evidence is treated as production proof. |
| Representative-user testing | Test evidence reviewed | People, subject, tasks, conditions, or modalities are wrong; failure or harm is hidden; generalization is unsupported; or evidence is insufficient. |
| Design–implementation collaboration | Design and implementation obligations reconciled for the current subject | The handoff is one-way, a mechanism changes intent, a conflict is unowned, the trace is stale, or a contradiction is unverified. |
| Post-release measurement and improvement | Post-release design review closed | A signal is missing or unanswerable, a proxy has a harmful interpretation, monitoring is unbounded, an owner or consumer is missing, a guardrail is crossed, an explicit improvement-or-no-change decision or Maintenance decision is absent, or a no-change result is not dated, bounded, and falsifiable. |

## Preferences

### Prefer the live product as the identity source

**PREFER** what the shipped application already teaches its users over a described intention. Depart when the
governing design material is current and the live application is the stale artifact.

### Prefer the smallest evidence that can change the decision

**PREFER** the evidence class that could still falsify the choice at hand, and raise the class as the
consequence of being wrong grows. Evidence collected after a choice is locked does not satisfy the evidence
Rule, so select the class before deciding.

### Prefer a concept that changes a consequential property

**PREFER** exploring a different action model, information flow, or state model over a second visual
treatment of one model. Depart when a recorded constraint leaves only one viable model, and state that
constraint beside the decision.

### Prefer the least prototype that can disprove the choice

**PREFER** the lowest-cost prototype that exposes the behavior, content, state, recovery, modality, and
accessibility properties relevant to the unresolved decision. Increase fidelity only when the lower-fidelity
form cannot produce the evidence the decision needs.

### Prefer expression that carries meaning

**PREFER** typography, color, density, spacing, shape, and imagery choices that make hierarchy, state, or
affordance easier to read. Depart only for a recorded identity obligation, and never below the accessibility
floor the renderer's presentation owner defines.

### Prefer motion that explains a state change

**PREFER** a transition when it makes a change of state, location, or causality legible, and no motion
otherwise. This skill decides only whether motion is warranted and what it must communicate; the safety floor
stays with the applicable renderer presentation owner, and declarative mechanics remain with
[`html-css-motion`](../../html-css/html-css-motion/SKILL.md).

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
