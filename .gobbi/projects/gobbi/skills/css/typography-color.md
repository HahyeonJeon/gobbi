# Typography and color

Apply [`CSS-2`](SKILL.md#css-2--design-the-cascade-and-resilient-rendering-deliberately).
Specify font stacks, loading/failure behavior, metrics, line height, wrapping,
hyphenation, decoration, and language-sensitive shaping from content needs.
Do not truncate essential text by default. Verify actual contrast in every
state, theme, opacity/background combination, forced-colors mode, and print.
Respect user color adjustments; avoid defeating forced colors without a proven
equivalent.

Evidence: loaded/fallback font, wrapping/line geometry, theme/forced-color/
print captures, measured contrast. See `C-S07`–`C-S09`, `C-S26`,
`C-S30`–`C-S33`, `C-K04`, `C-K12`, `C-K20`–`C-K22`, and `C-K30`.
