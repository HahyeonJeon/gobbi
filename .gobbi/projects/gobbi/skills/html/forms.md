# Forms

## Use this child when

The work changes form controls, labels, groups, autocomplete, validation,
state, or submission markup. Apply parent rules
[`HTML-2`](SKILL.md#html-2--preserve-language-meaning-and-the-accessibility-floor)
and
[`HTML-3`](SKILL.md#html-3--respect-trust-transform-and-runtime-boundaries).

## Detail

Use the native control whose data type and interaction match the field.
Associate every control with a purposeful accessible name, normally a visible
`label`. Group related choices with `fieldset`/`legend` when that relationship
matters. Connect instructions and errors without replacing the label.

Choose stable `name`, type, input mode, autocomplete token, requiredness,
constraints, and initial value from the data contract. Do not use placeholder
text as the only label or instruction. Distinguish `disabled` (unavailable and
normally not submitted) from `readonly` (immutable but still a form value).
Preserve keyboard and zoom/reflow use.

Native validation may improve feedback but is not authorization, trust, or
server validation. Ensure errors identify the affected field, remain available
after focus moves, and do not rely on color alone. Dynamic validation and focus
management route to the JavaScript owner; HTML owns the correct names,
relationships, and states in the emitted tree.

Specify submission method, destination, encoding, and file-upload requirements
deliberately. Security and privacy owners decide CSRF protection, sensitive
data handling, and server acceptance.

## Evidence

- labels, groups, names, autocomplete, constraints, and state inventory;
- empty, valid, invalid, disabled, readonly, and submission cases;
- accessible name/description/error relationships;
- keyboard, zoom/reflow, locale expansion, and target behavior; and
- explicit server/security ownership for trust decisions.

See scenario [`H-S04`](scenarios.md#h-s04--form-error-and-state) and checks
[`H-C04`](checklists.md#h-c04--native-semantics-and-accessible-relationships)
and [`H-C06`](checklists.md#h-c06--alternatives-interaction-and-state).
