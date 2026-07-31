---
name: html-semantics
description: "MUST load when choosing or reviewing HTML elements, names, states, language, direction, or accessibility semantics. HTML Semantics is a preference skill for meaning-first, native-first markup judgment."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# HTML Semantics

Use when choosing or reviewing HTML elements, relationships, names, labels, states, language, direction, and
accessibility semantics. It makes meaning-first and native-first choices the default.

It governs markup judgment, not an authoring sequence or platform lookup. Rules define valid choices;
documented evidence may override Preferences within that boundary.

## Principles

### Meaning precedes appearance

Choose markup for the content or action it represents, not for default styling or a desired selector.

### Native capability precedes imitation

Native elements combine meaning and behavior. Custom semantics are justified only by a real capability gap
and must fulfill the promise they expose.

### Ownership limits claims

HTML evidence supports emitted meaning and native behavior. Cross-owner or product claims require matching
evidence from their owners.

## Rules

- **MUST use a native element when its meaning and behavior fit, and add only ARIA permitted by [ARIA in
  HTML](https://www.w3.org/TR/html-aria/).** Native semantics outrank a redundant or conflicting role.
- **NEVER accept a semantic counterfeit.** A link navigates, a button performs an action, and an ARIA role
  adds no keyboard or activation behavior by itself ([WAI-ARIA APG Read Me
  First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)).
- **MUST provide purposeful names, visible labels, groups, instructions, errors, alternatives, and states
  wherever each applies, and use accurate `lang` and `dir` wherever language or direction is expressed.**
  Preserve those relationships in generated or reordered content.
- **MUST keep ownership explicit.** CSS owns presentation; JavaScript owns added interaction; security owns
  untrusted data and dangerous sinks; generators own source transforms; Electron owns privileged processes.
- **NEVER treat native form validation as server validation or authorization.** Keep server and security
  checks with their owners.
- **MUST separate source, emitted bytes, parsed DOM, target behavior, and product evidence.** Markup or
  validator evidence alone does not prove security, product acceptance, or [WCAG
  2.2](https://www.w3.org/TR/WCAG22/) conformance.

## Preferences

### Prefer the simplest native element

Prefer the native element that supplies the required meaning and behavior. Depart only for a documented
capability gap, then supply and verify the complete custom name, role, state, keyboard, and activation model.

### Prefer visible, persistent language

Prefer visible text for names, labels, instructions, and errors, and keep it available after input begins.
Use another permitted source when the content contract requires it and the result remains purposeful.

### Prefer progressive enhancement

Prefer an essential native path across all declared targets, with enhancements layered on proven support. An
exact-target path may depart when the complete target is one pinned runtime and no broader claim is made.

## References
