# Interactive content

## Use this child when

The work changes links, buttons, disclosure, dialog, popover, focusability,
activation, or nested interactive content. Apply parent rules
[`HTML-1`](SKILL.md#html-1--classify-material-features-on-two-independent-axes)
and
[`HTML-2`](SKILL.md#html-2--preserve-language-meaning-and-the-accessibility-floor).

## Detail

Use links for navigation and buttons for actions. Do not simulate either with a
generic element merely to obtain styling freedom. Preserve the native
activation, disabled state, form behavior, focusability, and accessible role.
Avoid nested interactive content and positive `tabindex`.

Use native disclosure, dialog, and popover primitives when their semantics,
behavior, and target support fit. Classify each material subfeature separately;
an umbrella API can contain established and newly deployed parts. Supply an
intentional close/dismiss path, name the surface, test focus entry/return and
escape behavior, and preserve essential function through fallback.

HTML owns native behavior and states expressed by markup. JavaScript owns any
state machine or event logic added around it; CSS owns visible focus and
rendering. The final outcome must still have visible focus, state not conveyed
only by color, reduced nonessential motion, and keyboard reachability.

`hidden`, `inert`, disabledness, and ARIA state have different semantics.
Choose the state that matches availability and exposure; do not combine them
until the resulting focus and accessibility-tree behavior is understood.

## Evidence

- element choice and prohibited-nesting review;
- focus order, keyboard activation, dismiss/close, and focus return;
- accessible name/role/state and hidden/inert behavior;
- S/D classification, fallback, and exact-target tests; and
- CSS/JavaScript owner evidence for behavior outside HTML.

See scenarios [`H-S01`](scenarios.md#h-s01--target-gated-native-popover) and
[`H-S02`](scenarios.md#h-s02--role-only-custom-button), plus checks
[`H-C03`](checklists.md#h-c03--feature-maturity-and-fallback) and
[`H-C06`](checklists.md#h-c06--alternatives-interaction-and-state).
