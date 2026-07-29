# Cascade

Apply [`CSS-2`](SKILL.md#css-2--design-the-cascade-and-resilient-rendering-deliberately).
Inventory user-agent, user, author, animation, and transition origins; important
rules; encapsulation; layers; specificity; scoping proximity; and order.
Declare layer order once. Keep component/public custom properties documented
with inheritance, initial/fallback behavior, type expectations, and consumers.
Avoid specificity escalation and `!important` as symptom repair; locate the
winning declaration and fix ownership.

Evidence: matched-rule/cascade trace, computed value, inheritance/custom-
property fallback, mode/state fixtures. See `C-S04`–`C-S06`, `C-K02`, and
`C-K10`.
