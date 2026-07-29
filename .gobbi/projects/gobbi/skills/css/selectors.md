# Selectors

Apply [`CSS-2`](SKILL.md#css-2--design-the-cascade-and-resilient-rendering-deliberately).
Choose stable hooks and intentional scope. Calculate specificity including
`:is()`, `:not()`, `:has()`, `:where()`, nesting, and scoped rules. Treat
Shadow DOM/parts as explicit public boundaries. Avoid selectors coupled to
incidental tree depth or text. Measure selector/invalidation cost in the real
document before optimizing; shorter is not automatically faster.

Evidence: match/non-match boundary fixtures, specificity/cascade trace,
mutation behavior, measured cost when claimed. See `C-S04`–`C-S06`,
`C-S13`–`C-S16`, `C-S23`–`C-S25`, `C-K02`, `C-K10`, `C-K06`,
`C-K14`, `C-K23`, and `C-K24`.
