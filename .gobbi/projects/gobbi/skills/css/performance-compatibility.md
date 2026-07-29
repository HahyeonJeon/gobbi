# Performance and compatibility

Apply [`CSS-1`](SKILL.md#css-1--classify-every-material-feature-on-two-axes)
and [`CSS-4`](SKILL.md#css-4--verify-observable-behavior-and-measure-performance).
Record separate S/D classes, exact targets, fallback, tests, and reopen
condition. `@supports` tests recognition, not correctness. For containment,
`content-visibility`, `will-change`, complex selectors, effects, and large
style invalidations, require a measured bottleneck, hypothesis, representative
fixture, before/after metric, behavior/accessibility guard, and removal rule.
Keep proprietary Electron CSS isolated and exact-target-only.

Evidence: current primary spec/target records and reproducible measurements.
See `C-S01`–`C-S03`, `C-S13`–`C-S16`, `C-S19`–`C-S22`, `C-K01`,
`C-K09`, `C-K16`–`C-K19`, `C-K06`, `C-K14`, `C-K23`, and `C-K24`.
