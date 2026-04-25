# Spike 3: memorization compile latency at 0.3 artifacts budget on 30+ rawdata transcripts

**Date**: 2026-04-25
**Wave**: A.1.1
**Status**: PASS (latency) + FAIL (semantic correctness — atomic-section drop)
**Depends on**: `design/v050-features/orchestration/README.md` §12 spike #3, §13.14; `design/v050-features/orchestration/review.md` NOTE-5

---

## Question

Does memorization compile complete in **acceptable time** (the design says "no regression" — we establish a number) when:
- Input: a fixture session with **at least 30 rawdata transcripts**
- Budget config: **artifacts budget = 0.3** (the value already in `packages/cli/src/specs/memorization/spec.json:27`)

Sub-question that emerged during the spike: when the artifact payload exceeds the 0.3-slot capacity, does the renderer/allocator degrade gracefully or fail catastrophically?

---

## Threshold definition

The design (README §13.14) says "no regression vs v0.4.x baseline" but no baseline number is recorded. Strawman thresholds for this spike:

- **Acceptable**: compile() wall-clock ≤ **100 ms** mean / ≤ **250 ms** p95 / ≤ **1 s** worst-case. Reasoning: compile runs once per step entry on the user's terminal; > 1 s feels stalled; < 100 ms feels instant. Step entry is not a hot path (single-user, single-host, ~7 invocations per workflow).
- **Unacceptable**: any p95 > 1 s, or any compile that drops the artifact slot silently (semantic regression — the agent goes into memorization without the rawdata it was supposed to read).

The 5 s strawman from the brief is conservative for a Bun in-process call against deterministic pure functions; the assembler and budget allocator have no I/O in the hot path. Tighter bounds are appropriate.

---

## Method

### Fixture source

Real-world rawdata: 30 session transcripts from `~/.claude/projects/-playinganalytics-git-gobbi/`. Total available: 88 transcripts. Sub-sampled the smallest 30 (range 1,786 B … 971,023 B; total **8,659,218 B / 2.16M tokens at the 4-char/token heuristic**) to keep the run reproducible — small files dominate the histogram and represent the typical case.

A synthetic 30×replication of a single transcript was rejected as the fixture because it understates I/O and per-artifact heterogeneity. Real transcripts of varied size give a more honest signal.

No on-disk synthetic fixture was created — the spike harness reads `~/.claude/projects/-playinganalytics-git-gobbi/*.jsonl` directly and never writes to `.gobbi/`. No cleanup needed.

### Compile path

Production today does **not** load rawdata into the memorization compile. `commands/workflow/next.ts:255` passes `artifacts: []` unconditionally. The "rawdata loader" is a Pass-4-design concept (README §8.1) that does not exist in code. The spike therefore:

1. Loads the real `memorization/spec.json` via `validateStepSpec`
2. Constructs a `CompileInput` with `dynamic.artifacts = [{name, content}, ...]` filled from the 30 transcripts (full content) — the same contract `assembly.ts::renderDynamicContext` (lines 496-515) consumes
3. Invokes the production `compile()` from `packages/cli/src/specs/assembly.ts:722` with `defaultBudgetAllocator`
4. Times 5 iterations per scenario via `performance.now()` deltas

This is the **assembler+allocator+linter cost in isolation** — exactly what NOTE-5 is concerned about. Loader I/O cost (when the loader is built in Wave A.1+) is a separable measurement.

### Harness

`/tmp/spike3-memorization-latency.ts` (deleted at session end). Run with `bun run /tmp/spike3-memorization-latency.ts` from `packages/cli/`. Uses the production source files directly via `bun`'s TS loader — no mocks, no test doubles.

A second sweep `/tmp/spike3-fitting-artifacts.ts` finds the per-transcript size at which the artifact section starts being dropped.

### Environment

- Linux 6.8.0-107-generic, x86_64
- Bun >= 1.2.0 (engines pin in `packages/cli/package.json:10`)
- 200,000-token context window (matches snapshot fixture `GENEROUS_WINDOW`) and 60,000-token (proxy for a tighter realistic budget)

---

## Findings

### Latency — well within acceptable bounds

| Scenario | Mean | p50 | p95 | Max |
|---|---|---|---|---|
| 30 full transcripts, 60k window | 12.25 ms | 10.74 ms | 15.42 ms | 15.42 ms |
| 30 full transcripts, 200k window | 7.94 ms | 6.11 ms | 11.04 ms | 11.04 ms |
| Baseline (0 artifacts, 200k window) | 0.09 ms | 0.09 ms | 0.12 ms | 0.12 ms |

**Latency verdict: PASS.** Even the slowest run is **15.4 ms**, two orders of magnitude under the 1 s strawman ceiling. The compile-time hot path is in-process pure functions: `renderDynamicContext` (string concat), `lintSectionContent` (regex over kinded sections — only static sections per `assembly.ts:756`, so artifact size does NOT scale lint cost), `defaultBudgetAllocator.allocate` (token-estimate is `Math.ceil(content.length / 4)` per `budget.ts:42-46`), and a final SHA-256 over the assembled text. None require disk I/O once `dynamic.artifacts` is in memory. The 8.6 MB string-concat plus one SHA over the **excluded** path is what dominates the 60k-window run.

### Semantic — the artifact section is silently DROPPED at scale (this is the real risk NOTE-5 named)

`assembly.ts:599-606` puts every entry of `dynamic.artifacts` into **ONE atomic** `dynamic.context` section. The budget allocator follows whole-section-inclusion-only (`budget.ts:14-18`). When the section's token estimate exceeds the 0.3 slot, the section is dropped wholesale.

Sweep results (200k window, 60k-token artifact slot ≈ 240 KB at 4ch/token):

| Per-transcript bytes | Total bytes | Artifact section included? | Output text bytes |
|---|---|---|---|
| 500 | 15,000 | yes | 23,448 |
| 2,000 | 59,678 | yes | 68,354 |
| 4,000 | 115,678 | yes | 124,795 |
| 6,000 | 171,678 | yes | 181,129 |
| 7,500 | 213,678 | yes | 223,237 |
| 8,000 | 227,678 | yes | 237,261 |
| 10,000 | 283,678 | **no — DROPPED** | 5,504 |

Inflection point: between 8 KB and 10 KB per transcript at 30 transcripts. The full-transcript scenario (mean ~289 KB per transcript) is far past the cliff: the section is dropped, `compile()` returns the static prefix and session summary only, `dynamic.context` is absent (sections=4, no `dynamic.context` row). The agent enters memorization **with zero rawdata in its prompt**, despite the compile completing in 15 ms.

This is exactly the failure mode NOTE-5 anticipated — but the risk is **not** latency. The risk is silent loss of artifact content under the atomic-section design.

---

## Verdict

**PASS on latency** (compile is fast at every tested scale).

**FAIL on the implicit assumption** that "0.3 artifacts budget at 30+ transcripts" means "30 transcripts make it into the prompt." With the current renderer the 0.3 slot caps the ENTIRE concatenated artifact payload at ~60k tokens (200k window) or ~18k tokens (60k window). 30 full transcripts blow past the cap and are silently dropped together.

The wave plan must change.

---

## Design implication for Wave A.1 and beyond

The Pass 4 README §8.1 lists 7 rawdata source categories that memorization "names paths so the agent reads them as needed rather than pre-loading their contents into the prompt." That phrasing is the right answer to this spike — **path pointers, not inlined content**. The spike confirms the design's instinct.

Concrete changes Wave A.1 (or whichever wave wires up the loader) must lock in:

1. **Stop concatenating rawdata into `dynamic.context`.** The current shape (`assembly.ts:599-606`) treats artifacts as one inlined blob. For memorization with 30+ transcripts that blob is unbudgeable. Either (a) emit one section per artifact (so the allocator can drop the largest first while keeping the rest) or (b) emit only path-pointer summaries in the prompt and have the agent open them via Read.

2. **Path-pointer is the right default for memorization.** Per README §8.1, memorization's compile should inject a manifest of paths + small one-line summaries (a few hundred bytes total), not the bytes themselves. The agent reads on demand. The 0.3 artifacts slot is then ample. `next.ts:255`'s `artifacts: []` is closer to correct than wave authors might assume — it just needs to grow into a path-list, not a content-list.

3. **If content-inlining IS required** (e.g., for short summaries < 200 KB total across all transcripts), keep the 0.3 budget but switch to per-artifact sections so partial inclusion is possible. Whole-section-inclusion-only is correct at the section level; the bug is grouping all 30 into one section.

4. **No prompt-budget retuning needed for latency alone.** The 0.3 slot is fine. The mistake to avoid in Wave A.1 is "raise the budget to 0.5 to fit more transcripts" — that just delays the cliff while still leaking the silent-drop failure mode.

5. **Add a regression test that asserts `dynamic.context` is *included* when `artifacts.length > 0`** under the production loader configuration. The current snapshot tests (`memorization/__tests__/snapshot.test.ts`) use 1 small artifact and so never exercise the cliff.

These are not new design insights — they restate `README.md` §8.1 with empirical force. The spike's contribution is showing the cliff is real and falls inside the "30 transcripts" range the design called out.

---

## Cleanup

- `/tmp/spike3-memorization-latency.ts` and `/tmp/spike3-fitting-artifacts.ts` — temporary harness scripts, can be removed at session end. They contain no secrets or fixtures of consequence.
- No `.gobbi/projects/gobbi/sessions/...` writes occurred. No production code or specs were modified.

---

## References

- `packages/cli/src/specs/memorization/spec.json:23-29` — `tokenBudget.artifacts = 0.3` (already the locked value)
- `packages/cli/src/specs/assembly.ts:496-515` (`renderDynamicContext`) — concatenates all `dynamic.artifacts` entries with `--- name ---` separators
- `packages/cli/src/specs/assembly.ts:599-606` (`renderSpec` step 7) — wraps the concatenation into ONE `dynamic.context` section (the atomic-drop unit)
- `packages/cli/src/specs/assembly.ts:722-728` (`compile`) — production entry point
- `packages/cli/src/specs/budget.ts:14-18` — whole-section-inclusion-only invariant
- `packages/cli/src/specs/budget.ts:42-46` — 4-char/token approximation in `estimateTokens`
- `packages/cli/src/specs/budget.ts:303` (`inferSlot`) — `dynamic.context` is mapped to the `artifacts` slot
- `packages/cli/src/commands/workflow/next.ts:249-261` — production callsite passes `artifacts: []`; the rawdata loader is not yet wired
- `packages/cli/src/specs/memorization/__tests__/snapshot.test.ts:79-104` — existing one-artifact fixture pattern reused as the harness scaffold
- `design/v050-features/orchestration/README.md` §8.1 — "path pointers, not inlined content" — design's stated answer
- `design/v050-features/orchestration/review.md` NOTE-5 — original concern statement
