---
name: desktop-interface
description: "MUST load when choosing or reviewing an installed desktop application's project identity, design-evidence threshold, interface concept exploration, aesthetic system, or interaction and motion intent."
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
skill-type: preference
---

# Desktop Interface

Use this preference skill when an installed desktop application's design needs a judgment rather than a step:
which identity governs, what evidence a design claim may rest on, how many concepts must be compared, when
expression is decided, how meaning reaches every supported modality, and what a success measure must survive.
It owns the observable design judgment that `desktop-delivery` coordinates without replacing.

The evidence Rule below is a risk threshold, not an unconditional gate: it requires new representative-user
evidence only for the choices it names. This skill owns no mechanics. `desktop-contract` owns the observable
installed-platform contract, `desktop-release` owns release judgment,
[`electron-design`](../../electron/electron-design/SKILL.md) owns Electron security boundaries and ownership
defaults, [`web-interaction`](../../web/web-interaction/SKILL.md) owns the renderer's event, pointer,
keyboard, focus, and widget-pattern mechanics, [`css-motion`](../../css/css-motion/SKILL.md) owns its
declarative motion mechanics, and the renderer's remaining markup, presentation, and framework owners keep
their own policy. Rules define
the boundary, Preferences select defaults inside it, and a Rule wins every conflict.

## Principles

### Identity constrains from the foundation

Identity is the product's promise, character, voice, and recognizable patterns, and it shapes allowed
expression from the first structural choice. It never excuses avoidable exclusion or harm.

### Structure earns expression

Detailed expression is decided after structure, behavior, content, feedback, recovery, and accessibility are
settled. Expression can strengthen a sound contract; it cannot repair a missing one.

### Observed use outranks preference

What representative people do with a design is stronger evidence than stakeholder preference or design
convention. A claim about people rests on evidence from those people.

### Two real options precede one choice

A single candidate is a decision already made. Materially different options make the trade-off visible before
it is locked.

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
- **MUST compare at least two materially different application concepts before selecting one.** Concepts must
  differ in hierarchy, action model, information flow, interaction strategy, or state communication; a variant
  of color, type, spacing, icon style, or wording is the same concept, and a single-concept exception records
  the real constraints and evidence behind it.
- **NEVER decide detailed expression while structure, behavior, content, feedback, recovery, adaptation, or
  accessibility is unresolved.** Each expressive choice must improve hierarchy, state recognition, affordance,
  trust, or identity fit rather than conceal missing structure or inaccessible behavior.
- **MUST make every required action, state, and meaning available through each supported desktop modality and
  legible before a person acts.** Cover window chrome, menus, tray, global and in-window shortcuts,
  notifications, and keyboard, pointer, and assistive-input paths, and expose consequence, reversibility, and
  the recovery route at the point of decision.
- **MUST define each success measure so that a proxy which improves while the user outcome worsens cannot
  stand alone.** Name the measure's intended and harmful interpretation, the guardrail that detects the
  harmful one, and the evidence that reopens the design.

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

### Prefer expression that carries meaning

**PREFER** typography, color, density, spacing, shape, and imagery choices that make hierarchy, state, or
affordance easier to read. Depart only for a recorded identity obligation, and never below the accessibility
floor the renderer's presentation owner defines.

### Prefer motion that explains a state change

**PREFER** a transition when it makes a change of state, location, or causality legible, and no motion
otherwise. This skill decides only whether motion is warranted and what it must communicate; the safety floor
stays with the renderer's applicable presentation owner and the emitted mechanics with
[`css-motion`](../../css/css-motion/SKILL.md).

## References
