---
name: html-css-semantics
description: "MUST load when choosing or reviewing HTML elements, relationships, names, roles, states, language, direction, or accessibility meaning."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# HTML/CSS Semantics

Use this preference to choose or review the authored meaning of HTML: elements, document and control
relationships, accessible names, roles, states, language, and direction. Bind each decision to the approved
content and interaction meaning, including material generated or conditional variants.

This skill owns authored meaning, not observed browser or accessibility output. Route target behavior and
output evidence to `html-css-platform` or `html-css-testing`; route the keyboard and activation model promised
by a custom role to `web-interaction`, and its implementation to `web-frontend`.

## Principles

### Meaning precedes appearance

Choose semantics from content purpose and interaction behavior, never from the default visual treatment.
Styling may change appearance without changing the authored meaning.

### Native semantics are the baseline

Use the native element when its meaning and behavior fit. Add ARIA only where HTML lacks the required authored
meaning and the exact role, state, or property is permitted.

### Authored and observed output are different claims

Source markup can establish what was authored, not the parser-produced DOM, accessible-name computation, or
accessibility tree on every target. Bind observed claims to direct evidence.

### Variants must preserve meaning

Generated, localized, conditional, and stateful output must preserve the intended relationships, names,
roles, states, language, and direction for every material case.

## Rules

- **MUST choose each element from the approved content or action meaning.** Use a link for navigation and a
  button for an action when their native contracts fit.
- **MUST give every applicable control and non-text item a purposeful name or text alternative.** Keep visible
  labels, instructions, groups, errors, and alternatives explicitly related to their subjects.
- **MUST use only roles, states, and properties permitted for the chosen HTML element.** Remove redundant or
  conflicting ARIA and preserve native semantic precedence.
- **MUST express accurate language and direction at the scope where they differ.** Treat locale, direction,
  and writing mode as material variants when they change meaning or reading order.
- **MUST separate authored custom-widget meaning from behavior.** Supply the name, role, and state model here;
  route keyboard/activation choice, implementation, and feature proof to their named Web owners.
- **NEVER change semantic meaning for styling, performance, or scripting convenience.** Change the mechanics
  or return the incompatible constraint to its owner.

## Preferences

### Prefer native elements and relationships

Prefer the native element, label mechanism, grouping element, landmark, heading structure, and form semantics
that already express the approved meaning. Use a custom role or relationship only when native HTML cannot
express the required contract and the exception is valid.

### Prefer visible names and instructions

Prefer visible text that also supplies the accessible name and instructions. Use an alternative naming
mechanism when visual presentation or product content requires it and verify that the authored relationship
remains purposeful and unambiguous.

### Prefer the narrowest valid ARIA addition

Add only the role, state, or property needed to fill a real semantic gap. A larger ARIA model is justified only
when every added value is permitted, maintained through state changes, and matched by the interaction
contract.

### Prefer explicit language and logical direction

Set document language and override it at the smallest differing subtree; set direction where content or the
authoritative source requires it. Allow browser inference only when it is the approved behavior and the
affected variants are tested.

### Prefer stable patterns for one meaning

Use one markup pattern for the same semantic purpose across the reviewed scope. Depart when content or behavior
changes the meaning, and make that difference explicit rather than hiding it in presentation.

## References

- [`checklists.md`](checklists.md) evaluates authored HTML semantics across all eight perspectives.
