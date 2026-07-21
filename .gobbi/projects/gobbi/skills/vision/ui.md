# Web UI Capture Analysis

Use this child after [`SKILL.md`](SKILL.md) for browser and application interface captures. It refines parent
steps 2–9 for rendered state, interaction evidence, responsive context, and UI-specific accessibility. A
capture proves visible output at one state; it does not by itself prove DOM semantics, behavior, other
breakpoints, keyboard order, or implementation conformance.

## Procedure

### U1 — Identify capture and task context

Extend the parent frame with viewport dimensions, device class, device scale if known, browser or host,
breakpoint, zoom, theme, locale, authentication or user role, user data state, scroll position, input method,
and capture environment. Record the intended user task, entry condition, primary action, success state, and
likely consequences of an error.

Inventory supplied implementation evidence separately: live page, DOM, CSS, accessibility tree, source,
design tokens, component library, design reference, `DESIGN.md`, copy, and state definitions. State what each
can verify. A screenshot/reference diff supports visible conformance; the DOM or source may support semantics;
neither automatically supports task effectiveness.

### U2 — Map landmarks, regions, components, and states

Extend the parent maps with:

- global landmarks, navigation, header, footer, sidebars, main regions, grids, panes, and overlays;
- page title, section hierarchy, content clusters, repeated collections, tables, media, and data displays;
- controls, labels, help, status, validation, notifications, dialogs, menus, tooltips, and focus indicators;
- visible state for every important component, including selected, expanded, checked, disabled, pending,
  loading, empty, error, success, or unknown; and
- containment, alignment, reading sequence, label-control, state-action, disclosure-target, and
  status-trigger relationships.

Mark components that are visually ambiguous: text that may or may not be a link, icons without visible
labels, containers that resemble controls, disabled-looking enabled actions, or controls whose target is
unclear. Do not infer an interaction merely from common convention.

### U3 — Reconstruct task and action hierarchy

Walk the visible task from likely entry to completion. Identify the primary action, secondary actions,
navigation exits, required information, decision points, and system feedback. Compare the observed salience
and order with the declared task.

Test whether the user can discover what is possible, predict what an action affects, distinguish status from
action, recover from failure, and confirm success. A visually polished hierarchy fails if it emphasizes the
wrong task or makes a destructive action look primary. Keep “matches `DESIGN.md`” separate from “serves the
user task.”

### U4 — Inspect layout, responsive risk, and component behavior evidence

At the provided viewport, inspect grid, alignment, spacing, density, truncation, wrapping, overflow, clipping,
sticky or fixed regions, modal coverage, safe areas, pointer target separation, and content prioritization.
For repeated components, compare anatomy and state styling consistently.

Only make responsive claims with multiple viewport captures, a live page, source rules, or equivalent
evidence. With one viewport, report visible behavior and responsive risks: fixed-width pressure, unbreakable
content, hidden affordances, horizontal overflow, or priority that is likely fragile. Do not state that the UI
“is responsive” or “breaks on mobile” without evidence from the relevant state.

When comparing captures, classify differences before judging them:

- capture/environment noise: browser chrome, scrollbar, font availability, antialiasing, device scale,
  dynamic time or data, extension, network placeholder, or animation frame;
- intended state or content difference;
- visible conformance mismatch; or
- semantic design difference that changes hierarchy, task, meaning, or access.

### U5 — Inspect high-risk UI patterns

For forms, check visible labels, instructions, required status, grouping, input affordance, formatting help,
inline errors, error association, retention of entered values where evidenced, and path to recovery.

For tables and dense data, check header association as far as visible, scan paths, alignment by data type,
units, sorting and filtering affordances, row identity, overflow, empty results, and selection or bulk-action
state. Route embedded quantitative displays through [`chart.md`](chart.md).

For dialogs, menus, popovers, and overlays, inspect trigger-target relation, placement, occlusion, dismissal
cues, background competition, task containment, destructive-action hierarchy, and visible focus treatment.
Keyboard containment and return-focus claims require live or source evidence.

For loading, empty, error, success, disabled, and permission states, inspect whether the state is identified,
explains consequences, preserves context, and offers an appropriate next action. If only the default state is
supplied, record state coverage as missing rather than assuming these cases work.

### U6 — Evaluate UI accessibility with evidence boundaries

Inspect visible text size, wrapping, spacing, distinguishability, color dependence, focus indicators,
control-label proximity, error communication, target separation, reading order cues, animation indicators,
and information hidden by crop or overflow. Measure exact contrast or geometry only when the pixels and
method support it.

Use DOM, accessibility tree, keyboard interaction, source, or platform inspection when supplied to evaluate
names, roles, states, heading structure, landmark structure, reading order, focus sequence, live regions, and
equivalent alternatives. A screenshot alone can show a visual accessibility risk; it cannot establish formal
conformance. If a report invokes a named accessibility standard or numeric threshold, apply parent Rules and
verify its current authoritative version before stating it as fact.

### U7 — Evaluate aesthetic system quality in context

Apply the parent aesthetic lenses to information architecture and interaction:

- whether typography, spacing, color, elevation, borders, icons, imagery, and motion cues form a coherent
  system rather than a collection of polished parts;
- whether visual hierarchy follows task hierarchy, state, and risk;
- whether density matches audience, frequency, and device rather than an assumed preference for whitespace;
- whether component consistency reduces learning while purposeful variation signals role or state;
- whether brand expression supports trust, emotion, and distinctiveness without obscuring use; and
- whether decorative effects create useful grouping, affordance, or atmosphere rather than visual noise.

Separate screenshot fidelity, semantic behavior, and aesthetic quality in the findings. Preserve proven task
paths, information density, brand signals, and component distinctions when proposing polish.

### U8 — Reconcile and return findings

Recheck every local issue in the full viewport and every whole-page judgment against high-risk controls,
states, overlays, and edge regions. If source or `DESIGN.md` conflicts with the rendering, identify whether
the issue is source conformance, capture environment, implementation output, or a design-level weakness.
Return findings to the parent's report schema with the exact viewport and state in the location field.

## References

- [`SKILL.md`](SKILL.md) owns shared evidence classes, source hierarchy, maps, aesthetics, verification,
  findings, and reporting used by this UI refinement.
- [`chart.md`](chart.md) applies in addition when the interface contains charts, tables used as data displays,
  or chart-like infographics.
- [`scenarios.md`](scenarios.md) includes wrong-primary-action, screenshot-only overclaim, `DESIGN.md`, mixed
  dashboard, capture-noise, responsive-boundary, and UI-state cases.
- [`checklists.md`](checklists.md) contains the applicable pause-point checks and acceptance gates.
