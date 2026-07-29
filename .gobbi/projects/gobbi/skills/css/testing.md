# Testing

Apply [`CSS-3`](SKILL.md#css-3--preserve-source-trust-generator-and-runtime-boundaries)
and [`CSS-4`](SKILL.md#css-4--verify-observable-behavior-and-measure-performance).
Test layers: exact source/transform/emitted identity; parsing/lint; stylesheet
and rule presence in CSSOM; matched/cascaded/computed values; layout/overflow/
scroll geometry; rendered reftest/visual evidence; declared targets and modes;
performance measurement. Bind every observation to the emitted digest.

Preserve failures and classify the owner: CSS source, generator, security,
document language, JavaScript, Electron/runtime, or product acceptance. Repair
the owner, regenerate/rebind when needed, and rerun all affected layers.
See `C-S10`–`C-S12`, `C-S17`–`C-S18`, `C-S25`, `C-S34`–`C-S38`,
`C-K05`, `C-K07`, `C-K08`, `C-K10`, `C-K13`, `C-K15`,
`C-K25`–`C-K29`, and `C-K31`–`C-K33`.
