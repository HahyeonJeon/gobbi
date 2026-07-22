# Web UI Ideation

Browser-interface discussion procedure for P1–P4 of [`SKILL.md`](SKILL.md). Run only after the parent
[`web`](../ideation.md) has bounded the feature and generic [`ui`](../../ui/ideation.md) has produced the
applicable accepted interface specification. This companion resolves production browser mechanics; it does
not redesign the accepted outcome or add policy.

## Conduct

Move through U0–U8 in dependency order. Inspect the repository, running application, accepted UI artifacts,
project browser/accessibility commitments, and current browser behavior before asking. Ask one unresolved
decision axis per turn, present evidence and material options, recommend one, and record the user's decision
plus its consequence. Smart-skip only with current proof. Reopen the earliest generic UI or web decision when a
browser constraint contradicts it; do not repair the conflict silently in CSS or framework code.

For every axis record **source evidence**, **accepted clause**, **browser decision**, **states affected**,
**verification**, **limitations**, and **reopen condition**.

## U0 — Accepted specification and current realization

- Which generic UI clauses, prototype evidence, and acceptance decision govern this feature?
- Which current route, component, document, style, state, and browser pattern will change?
- Which project browser, accessibility, design-system, and compatibility commitments already apply?
- Where does the accepted specification conflict with current production behavior or platform constraints?

**Close with:** accepted-clause trace, current-interface inventory, commitments, and conflicts. Missing required
generic UI evidence remains `NEEDS_CONTEXT`.

## U1 — Semantic document and reading order

- What document outline, landmarks, headings, sections, lists, tables, and form ownership express the content?
- Which native elements and controls carry each action before any custom composite is considered?
- What accessible name, description, role, value, state, relationship, and status should the accessibility tree
  expose at every state?
- Does source order remain meaningful when styles fail, content reflows, or sequential navigation is used?

**Close with:** semantic outline, native/control choices, accessibility-tree expectation, and any justified
custom composite.

## U2 — Component anatomy and complete state set

- Which page/region/component states map to initial, empty, loading, partial, stale, invalid, disabled, pending,
  success, error, recovery, unavailable, permission-denied, and duplicate action?
- Which states are genuinely inapplicable, based on the parent state and failure model?
- What visible and programmatic signal distinguishes each state without false completion?
- Which persistent next action or support route belongs to each non-terminal state?

**Close with:** state table, domain/server trace, announcements, actions, and false-success oracles.

## U3 — Forms, constraints, and submission

- Which persistent labels, descriptions, input types, autocomplete tokens, required/optional cues, formats, and
  examples minimize error?
- When and where is validation shown, announced, summarized, focused, and linked to the field?
- Which user input survives client/server failure, refresh, auth expiry, or retry?
- How are duplicate submit, pending lock, cancel, idempotent retry, review/correction, and irreversible consent
  represented without hiding server truth?

**Close with:** field/constraint table, validation sequence, submission states, input-retention and recovery
behavior.

## U4 — Input modalities and focus sequence

- Can keyboard, pointer, touch, sequential/switch-like navigation, and assistive technology reach the same
  outcome without hover-only or gesture-only information?
- What receives focus on entry, validation failure, asynchronous insertion, navigation, dismissal, deletion,
  and return?
- Where can focus be lost, obscured, reordered visually, trapped incorrectly, or left inside inactive content?
- Which target sizes, spacing, shortcuts, drag alternatives, and focus indicators follow project commitments?

**Close with:** modality matrix and focus entry/order/result/restoration sequence.

## U5 — Responsive composition and preferences

- How do hierarchy, content order, readable measure, actions, tables/forms, and navigation adapt across the
  project viewport/device matrix?
- What happens at supported zoom/text enlargement, longest expected locale/content, orientation, and safe-area
  boundaries?
- How do light/dark/high-contrast or forced colors, reduced motion, reduced transparency/data, and user font
  preferences change the realization where applicable?
- Which exact content clipping, overlap, offscreen action, contrast, motion, or horizontal-scroll oracle fails a
  matrix cell?

**Close with:** responsive/preference matrix, content-stress inputs, and per-cell failure oracles.

## U6 — Overlays and asynchronous change

- For each dialog, popover, menu, disclosure, tooltip, toast, and banner: who owns it; how is it triggered,
  labelled, dismissed, escaped, stacked, and restored; and what happens behind it?
- Which asynchronous changes need status, progress, cancellation, late-result handling, or persistent recovery?
- Which critical messages survive long enough, remain discoverable, and avoid unexpected focus movement?
- What happens when a trigger disappears, navigation occurs, or two overlays/results race?

**Close with:** overlay contract, async/status table, focus/background/scroll rules, and race recovery.

## U7 — Browser lifecycle and framework integration

- What must remain correct on direct entry, internal navigation, refresh, back/forward, restore, multiple tabs,
  delayed JavaScript, duplicate initialization, and stale assets?
- If server/pre-rendering and hydration apply, what semantic and visual structure exists before hydration, and
  how are mismatches or state resets detected?
- Which project promise applies when JavaScript is unavailable or fails to load?
- Which outcomes are framework-independent here, and which API/lifecycle decisions must be delegated to the
  framework skill?

**Close with:** lifecycle matrix, pre/post-render invariants, integration-owner boundary, and failure oracles.

## U8 — Evidence and implementation checkpoint

Present the complete trace: accepted clauses; semantic/state/form/focus/overlay contracts; responsive and
lifecycle matrices; affected production surfaces; selected child scenarios/checks; evidence owners; and known
limits. Ask the user to confirm any material realization choice not already fixed by the accepted specification.

Separate evidence planned for source/static structure, DOM/accessibility tree, live operation, adaptive
behavior, captured pixels, and inherited representative-user acceptance. A single artifact cannot close the
others.

**Close with:** locked browser-realization contract and proof plan ready for P5.

## Completion ledger

The discussion closes only when U0–U8 are confirmed or proved inapplicable, every realization choice traces to
an accepted generic UI clause and parent state, each matrix has failure oracles, framework policy has an owner,
and no unresolved item can change semantics, operation, accessibility, responsive behavior, or feature scope.
