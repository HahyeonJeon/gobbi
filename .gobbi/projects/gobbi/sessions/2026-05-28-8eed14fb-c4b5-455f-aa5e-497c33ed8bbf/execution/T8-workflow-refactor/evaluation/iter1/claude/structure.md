# Perspective: Structure

**Target:** T8 Workflow refactor across 3 docs

## Findings

### F-S1 — Procedure-table pattern conformance is sound
- Type: `general` | Domain: `docs-sync` | Disposition: open | Confidence: 100 | Severity: (none — strength)
- chat-mode: 7 `**Definition.**` blocks, 6 `**Inputs.**`, 6 `**Output.**`, 5 `**Loop iteration.**` — extra Definition is the Slice Boundary, which correctly uses `**Procedure.** Sequential — not a loop.` instead of a Loop iteration block.
- auto-mode: 6 `**Definition.**`, 6 `**Inputs.**`, 6 `**Output.**`, 5 `**Loop iteration.**` — Step 1 has no Loop iteration (single pass), consistent with SKILL.md.
- Step 3 in chat-mode legitimately has no procedure table (Skipped at loop entry); narrative paragraph for "Loop iteration." + "Opt-in." note is pattern-coherent.

### F-S2 — auto-mode Step 1 delegates to SKILL.md for full procedure
- Type: `general` | Domain: `docs-sync` | Disposition: open | Confidence: 100 | Severity: (none — strength)
- auto-mode L57 explicitly points to `SKILL.md § Step 1 — Workflow Configuration` for the full procedure table — single source of truth respected. Chat-mode does the same at L133. No duplicated Step 1 table.

### F-S3 — Loop iteration default values are mode-specific and stated locally
- Strength: chat-mode Steps 2/4/5 say "(Chat default = 2)"; auto-mode says "(Auto default = 3)". This is correct — `settings.{chat,auto}.json` carry different defaults.

### F-S4 — Surviving SKILL.md sections retain their internal anchors
- `## Workflow Status Display` → `[Workflow State Machine § State persistence](#state-persistence)` (L161) resolves.
- `## Workflow State Machine` → `[chat-mode.md § §3 — Workflow](chat-mode.md)` (L256) resolves.
- `### Workflow runtime` "see [Step 1 row 6](#step-1--workflow-configuration)" (L382) resolves.

### F-S5 — SKILL.md ## Workflow opening sentence overlaps with Mode dispatch paragraph
- Type: `general` | Domain: `docs-sync` | Disposition: open | Confidence: 75 | Severity: Low
- L80-84 ("The workflow runs six steps. Step 1 ... is mode-agnostic; its procedure is detailed in this section. Steps 2-6 run in a mode-dispatched shape...") and L86-91 (the **Mode dispatch** paragraph with bullets) restate the same idea in two adjacent paragraphs. Tightening would help, but it is not load-bearing.

## Verdict
**PASS.** Decomposition is clean; pattern conformance is high; no orphan structural fragments.

## Must-Preserve
- The Def/Inputs/Output/Loop iteration/Procedure pattern verbatim in both mode docs.
- SKILL.md as the canonical Step 1 home (delegated from both mode docs).
