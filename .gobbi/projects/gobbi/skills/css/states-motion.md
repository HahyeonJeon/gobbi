# States and motion

Apply [`CSS-2`](SKILL.md#css-2--design-the-cascade-and-resilient-rendering-deliberately).
Cover default, hover, focus, focus-visible, active, checked, selected, open,
invalid, disabled, busy, and drag states that exist. Do not rely on hover or
color alone; preserve visible focus in normal and forced colors. Motion must
communicate without blocking interaction, respect `prefers-reduced-motion`,
and have a reduced/non-motion equivalent. JavaScript owns state transitions;
CSS owns their rendering.

Evidence: keyboard/pointer/touch states, focus visibility, non-color cues,
reduced-motion and interrupted-animation cases. See `C-S07`, `C-S09`,
`C-S26`, `C-S27`, `C-S31`–`C-S33`, `C-K04`, `C-K12`, `C-K20`,
`C-K21`, and `C-K30`.
