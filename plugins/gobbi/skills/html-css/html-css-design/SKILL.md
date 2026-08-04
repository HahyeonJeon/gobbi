---
name: html-css-design
description: "MUST load when choosing or reviewing an HTML/CSS system's structural regions and relationships, layout architecture, responsive or adaptive strategy, state-to-presentation mapping, material variants, or public markup and styling interface shape."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# HTML/CSS Design

Use this preference to translate approved interface intent into a coordinated markup-and-presentation system.
It helps a designer compare structural regions and relationships, layout and adaptation strategies, state
presentation, material variants, and the shape of public markup and styling interfaces.

The skill does not decide product identity, aesthetics, or whether motion is warranted. It records specialist
questions for `html-css-semantics`, `html-css-conventions`, and `html-css-motion` instead of deciding their exact
elements, defaults, or mechanics.

## Principles

### Compare systems before details

Compare materially different structures and layout strategies before choosing exact elements, selectors, or
motion values. A system choice should remain understandable when individual mechanics change.

### Start from approved intent

Treat product identity, content purpose, interaction intent, and expressive direction as inputs from their
owners. Return missing or conflicting intent instead of filling it with an HTML/CSS preference.

### Design the full variant set

Account for every material content, state, viewport, container, locale, direction, writing-mode, theme, input,
accessibility, and target difference. Name unexamined variants rather than treating one example as universal.

### Keep public interfaces deliberate

Treat elements, attributes, classes, IDs, custom properties, tokens, selectors, and generated shapes that
consumers use as versioned interfaces. Design their ownership and change boundary before implementation.

## Rules

- **MUST bind every design to approved product or interaction intent and named constraints.** Stop and return the unresolved
  question when identity, content purpose, interaction intent, or motion necessity is missing.
- **MUST compare every material architecture against explicit criteria.** Record at least two real alternatives
  unless the change is small enough for a justified short form.
- **MUST keep exact specialist judgments with their semantic owners.** Reference `html-css-semantics`,
  `html-css-conventions`, `html-css-motion`, or `html-css-platform` instead of copying their decisions.
- **MUST state material variant and accessibility consequences.** Include responsive behavior, language and
  direction, writing mode, zoom or reflow, input mode, reduced motion, and generated output when applicable.
- **MUST identify public interfaces and known consumers.** Mark unknown consumers and compatibility assumptions
  as unresolved design risks.
- **NEVER present a performance, resource, browser-support, or accessibility-output hypothesis as established.**
  Hand the claim to Platform or Testing with its required target and evidence.

## Preferences

### Prefer a proportional alternatives record

For a small local choice, prefer a short record naming intent, two alternatives, criteria, selection, and
specialist handoffs. For a system-wide choice, include regions and relationships, layout, adaptation,
state-to-presentation mapping, variants, public interfaces, consumers, risks, and recovery. Depart from this
depth only when the omitted fields cannot affect the result.

### Prefer semantic structure before layout machinery

Start with content regions, reading order, relationships, and state meaning, then compare layout systems that
preserve them. Depart only when a proven platform constraint requires a different structure, and record the
constraint with its owner.

### Prefer resilient adaptation

Prefer content-driven grid, flex, flow, intrinsic sizing, container, and logical-property strategies over
device-name breakpoints and fixed physical assumptions. A project constraint or measured target limitation
may justify departure when its affected variants and fallback are explicit.

### Prefer explicit state-to-presentation mapping

Map loading, empty, success, error, disabled, expanded, selected, invalid, and reduced-motion states that the
approved interaction exposes. Omit a state only when its owner proves it cannot occur for the declared subject.

### Prefer narrow, stable public interfaces

Expose the fewest markup and styling hooks consumers actually need, with exact name, casing, owner, and
compatibility intent. Broader hooks are valid when known consumers require them and their maintenance cost is
accepted.

### Prefer owner-tagged handoffs

Label each unresolved semantic, convention, motion, platform, testing, or broader product claim with the
responsible skill. A different format is acceptable when it preserves the same claim ownership unambiguously.

## References

- [`checklists.md`](checklists.md) evaluates an HTML/CSS system-design decision across all eight perspectives.
