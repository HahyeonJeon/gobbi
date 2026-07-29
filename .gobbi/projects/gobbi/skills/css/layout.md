# Layout

Apply [`CSS-2`](SKILL.md#css-2--design-the-cascade-and-resilient-rendering-deliberately).
Start with normal flow and intrinsic sizing. Select flex for one-dimensional
distribution and grid for two-dimensional tracks; use positioning only when
overlap/containing-block semantics fit. Test min-content/max-content,
replacement content, aspect ratio, min-size defaults, overflow, fragmentation,
scrollbars, zoom, and content growth. Containment changes layout/paint/style or
size behavior and needs classification plus behavior evidence.

Evidence: computed box values, geometry/overflow assertions, representative
content extremes and target screenshots/reftests. See `C-S07`–`C-S09`,
`C-S26`, `C-S28`–`C-S30`, `C-K03`, `C-K11`, and `C-K22`.
