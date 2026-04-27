### Codex Overall perspective hangs on large diffs

---
priority: medium
tech-stack: codex, claude-code, plugins
enforcement: advisory
---

**What happened**

When running adversarial reviews via `codex:rescue` on the v0.5.0 review campaign, three Codex passes with the **Overall** perspective focus hung past 20 minutes:
- B-Foundation Codex Overall: ran 41 minutes before being canceled
- B-Per-feature-pass Codex Innovation: 13 minutes (also canceled)
- The Codex Overall pass on a 43k-line diff explored the codebase too broadly and never converged

Codex passes with **Architecture** or **Innovation** perspectives on the same diffs finished in 5–7 minutes.

**User feedback**

User asked to cancel hung Codex jobs to free quota for the next batches. The pattern repeated across 3 of 4 batches.

**Correct approach**

When invoking `codex:rescue` for adversarial review:

1. **Always include an explicit time-box** in the prompt: `**Time-box: aim to finish in under 10 minutes.** Quality over breadth — pick 3-5 strong findings, don't comprehensive-sweep.`
2. **Avoid the "Overall" perspective for very large diffs (>30k lines)** — Codex burns too much exploration time. Use Architecture + Innovation perspectives on big diffs; defer Overall-class findings to Claude voices which have stronger heuristics for "the right level of breadth".
3. **Cancel jobs that exceed 15 minutes** rather than waiting indefinitely — the per-batch synthesis can proceed with 5/6 or 6/7 voices; cross-batch validation still works at reduced count.
4. **Spawn Codex jobs in background** via `codex:codex-rescue` agent (which uses `--background`) — collect job IDs, retrieve via `/codex:result <job-id>` once `/codex:status --wait` returns. Don't block the main thread waiting for slow Codex.

**Why this matters**

`codex:rescue`'s task runtime gives Codex unbounded latitude to explore. With a focused perspective (Architecture: invariants, Innovation: cross-domain), Codex converges fast. With a broad perspective (Overall: gaps + risk + over/under-engineering + observability + dead code) on a big diff, it never converges.

The fix is in the prompt, not the tool — explicit time-box + narrower perspective per pass.
