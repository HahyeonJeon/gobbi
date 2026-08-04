---
name: electron-interface
description: "MUST load when choosing or reviewing an Electron application's identity, design evidence, interface concepts, information structure, interaction intent, accessibility, modality coverage, or success measures."
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
skill-type: preference
---

# Electron Interface

Use this preference skill to choose or review one observable Electron application design. It covers product
identity, design evidence, interface concepts, information structure, visible states, interaction intent,
accessibility, modalities, locale, success measures, and design handoff facts.

This skill distinguishes current-product observation, representative-user evidence, accessibility evidence,
official target guidance, cross-target task evidence, and accepted authority or requirements. It turns those
inputs into observable judgment without treating any one class as proof of another.

This skill owns no Electron API or mechanism selection, technical architecture, installed application
contract, source implementation, test work, evidence acceptance, or delivery coordination. Rules define the
valid choice space, every Rule overrides every conflicting Preference, and accepted product contract,
accessibility, security, and user-authority boundaries remain controlling.

## Principles

### Product identity makes adaptation coherent

Product identity is the application's promise, voice, and recognizable behavior across observable surfaces.
Target operating-system adaptation should preserve that identity without disguising unfamiliar behavior.

### Evidence strength follows the claim

An observation proves only what its evidence class can establish. Claims about what representative users can
perceive, operate, complete, or recover from require representative-user or applicable accessibility evidence.

### Open decisions that affect the user outcome need real alternatives

Concepts that differ in information structure, action model, information flow, interaction intent, or
state-and-feedback presentation show the tradeoff before a decision becomes expensive to reverse. Visual
variations of one hierarchy or action model are one concept.

### Complete design includes every observable path

A successful main window does not establish menus, tray actions, notifications, failure, recovery, alternate
input methods, or target adaptations. Observable meaning must remain coherent across every applicable state
and modality.

## Rules

- **MUST name the affected actors, decision authority, accepted outcome, and evidence class for each judgment
  that can change the accepted outcome.** Keep current-product observation, representative-user evidence,
  accessibility evidence, official target guidance, cross-target task evidence, and accepted authority or
  requirements distinct.

- **MUST compare at least two observable concepts while a decision that can change the accepted outcome
  remains open.** Concepts must differ in information structure, action model, information flow, interaction
  intent, or state-and-feedback presentation rather than styling alone.

- **MUST cover the complete applicable observable surface.** Include information structure, visible states,
  content, feedback, failure and recovery presentation, accessibility, language, region, writing direction,
  and interaction intent across keyboard, pointer, assistive input, windows, menus, tray, shortcuts,
  notifications, and other accepted target surfaces.

- **MUST keep this skill inside observable design judgment.** Leave Electron API and mechanism selection;
  process, trust, bridge, IPC, state, window or view, resource, performance-placement, and isolation
  architecture; installed behavior and lifecycle promises; source implementation; test design, execution,
  interpretation, environment classification, and evidence acceptance; and delivery coordination outside.

- **MUST reconcile observable choices with accepted external constraints without selecting their policy.**
  Use the lower-tier [Electron runtime manual](../electron-runtime/SKILL.md) only for target mechanism and
  version facts; it supplies no interface preference or installed promise.

- **NEVER accept an interface judgment or convention departure that conflicts with any Rule, accepted product
  contract, accessibility, security, or user-authority boundary.** Those constraints override every
  Preference and require the conflicting judgment to be revised or rejected.

## Preferences

### Prefer evidence that matches the claim

**PREFER** evidence from the class that directly supports the claim or could justify changing it. Require
stronger or more direct evidence when the choice is new, uncertain, could exclude affected users, changes the
accepted outcome, is hard to reverse, or could cause harm.

| Evidence class | What it can establish |
|---|---|
| Current-product observation | What the application currently presents and teaches, including inconsistencies |
| Representative-user evidence | How affected representative users perceive, operate, complete, or recover from the design |
| Accessibility evidence | Whether an interaction creates or removes a barrier for affected people and input methods |
| Official target guidance | A familiar convention for the named operating system, version, or desktop environment |
| Cross-target task evidence | Whether one target convention harms the same accepted task across claimed targets |
| Accepted authority or requirements | The decision authority, outcome, scope, constraints, and user-authority limits |

**PREFER** studying the current application, product identity, representative users, official target
constraints, applicable design systems, and relevant prior art before settling a judgment that can change the
accepted outcome. A current-product observation does not prove representative-user success, and official
guidance does not prove that its convention serves this application's accepted outcome.

### Prefer one coherent product identity

**PREFER** one product identity across windows, menus, tray surfaces, shortcuts, notifications, content,
feedback, failure, and recovery. Change the current presentation when approved identity guidance shows it is
outdated, or when an observable choice conflicts with a Rule or accepted boundary.

**PREFER** visual and content choices that make hierarchy, state, consequences, available actions, and
recovery easier to understand. Visual novelty, density, motion, or decoration does not compensate for
unresolved structure, content, feedback, accessibility, or failure presentation.

### Prefer concepts with clear tradeoffs

**PREFER** concepts whose required differences expose tradeoffs that affected actors can compare. Compare
each concept against the same actors, accepted outcome, applicable evidence, target differences,
accessibility needs, and observable failure and recovery paths.

When constraints leave only one valid concept, keep the judgment open until those constraints are established
by their owners. A technical limitation is an input to observable judgment, not permission for this
preference to select technical architecture or change the installed application promise.

### Prefer a familiar target convention within coherent identity

This Preference applies when an Electron application chooses interaction behavior that has a familiar target
operating-system convention. **PREFER** the familiar operating-system convention within one coherent product
identity.

Use current official guidance for the claimed target:
[Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) for
macOS, [Windows app design](https://learn.microsoft.com/en-us/windows/apps/design/) for Windows,
[GNOME Human Interface Guidelines](https://developer.gnome.org/hig/) for a matching GNOME environment, and
[KDE Human Interface Guidelines](https://develop.kde.org/hig/) for a matching KDE Plasma environment.
Qualify every convention by the operating-system version or desktop environment it actually covers.

A departure is allowed only when representative-user evidence, accessibility evidence, or cross-target task
evidence shows that the familiar convention harms the accepted outcome. The departure must state:

- the allowed evidence class and the concrete evidence;
- the accepted outcome harmed by the familiar convention;
- the replacement interaction; and
- continuing compliance with every Rule and the accepted product contract, accessibility, security, and
  user-authority boundaries.

Convenience, implementation cost, visual novelty, personal taste, or untested preference is not departure
evidence. Every Rule and every accepted contract, accessibility, security, or user-authority boundary
overrides this Preference.

| Judgment case | Resolution |
|---|---|
| Ordinary default | Use the familiar convention and carry the coherent product identity through its expression |
| Justified departure | Use the compliant replacement when an allowed evidence class shows harm to the accepted outcome |
| Rule conflict | Apply the Rule and revise or reject the conflicting default or departure |
| Unjustified or cosmetic departure | Reject the departure and retain the familiar convention |
| Product identity and target familiarity differ | Let allowed evidence about the accepted outcome decide; absent shown harm, retain the familiar convention |

### Prefer a complete observable decision

**PREFER** an information structure that makes each affected actor's task, content, and available action
clear. Cover normal, empty, loading, unavailable, permission, destructive, failure, recovery, and other
applicable visible states without forcing every application to invent a state it does not have.

**PREFER** content and feedback that make current state, consequence, reversibility, failure, and recovery
perceptible before the affected action becomes unsafe. Keep the intended outcome available through each
applicable keyboard, pointer, and assistive-input path and through relevant windows, menus, tray actions,
shortcuts, notifications, and target operating-system surfaces.

**PREFER** explicit adaptation for language, region, writing direction, and target operating-system
difference while preserving the same accepted outcome and user authority. Reconcile technical constraints,
installed promises, and target differences as external inputs; do not select or rewrite their policy here.

### Prefer success questions that can reopen the judgment

**PREFER** an observable success question and measure that describe the accepted user outcome. State what the
measure indicates about that outcome, how the measure could improve while the outcome worsens, the validation
signal that distinguishes those cases, and the evidence or requirement change that reopens the earliest
affected decision.

Given facts accepted by their owning authority, make the observable design judgment explicit as accept,
revise, or reject. The handoff should state governing identity, actors, authority, outcome, evidence classes,
concepts considered, selected observable structure and states, content, feedback, failure and recovery,
accessibility, modalities, locale and target adaptations, convention use or departure, success questions,
measures, validation signals, unresolved constraints, and reopen conditions without coordinating delivery or
accepting test evidence.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
