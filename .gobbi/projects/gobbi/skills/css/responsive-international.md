# Responsive and international rendering

Apply [`CSS-2`](SKILL.md#css-2--design-the-cascade-and-resilient-rendering-deliberately).
Use viewport media queries for environment constraints and container queries
for component context. Prefer logical properties where the contract follows
writing modes; use physical axes only for genuinely physical meaning. Test
zoom, reflow, text growth, narrow/wide containers, locale expansion, RTL,
mixed direction, vertical writing modes, pointer/input media, and print.
Fallback must preserve essential content rather than one screenshot.

Evidence: matrix of sizes/locales/directions/writing modes and overflow/layout
observations. See `C-S07`–`C-S09`, `C-S26`, `C-S28`–`C-S33`, `C-K03`,
`C-K11`, `C-K20`–`C-K22`, and `C-K30`.
