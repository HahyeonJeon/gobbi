---
date: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
scope: feature
feature: agents
loop: ideation
iter: 3
topic: memorization-delegation-hard-gate
status: final
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/design/item-c-memorization-delegation-hard-gate.md
promoted-at: 2026-05-23T14:00:00Z
---

# Design C — Memorization Delegation Hard Gate (Pathology α)

**Chosen direction**: Add a new entry to `delegation/SKILL.md § The Load Directives Block` stating: "When the delegated phase includes MEMORIZATION (every loop's MEMORIZATION sub-phase, plus Wrap-up's WORK promotion routing), `memorization/SKILL.md` MUST appear in tier 3 (Skills)." Add it to the per-role templates under `delegation/templates/`: assistant template explicitly; leader and executor templates when MEMORIZATION is part of their dispatch. Evaluator template excluded (evaluators do not run MEMORIZATION).

**Rationale**: Pathology α root cause: Load Directives lacked `memorization/SKILL.md`, so the assistant ran without the staging procedure. The fix is to make the requirement explicit at the delegation contract level — if it's in Load Directives, it's loaded; no internal self-check saves the agent if it wasn't loaded.

**Anchored insight**: I6.

**Alternative rejected**: Add a self-check inside the assistant's MEMORIZATION procedure Step 1 ("did I load memorization/SKILL.md?"). Rejected as duplicative — if Load Directives include it, it's loaded; if not, no internal check saves the dispatch.

**Validation**: `grep -c "memorization/SKILL.md" delegation/SKILL.md` returns ≥ 2; each relevant template includes `memorization/SKILL.md` in its Skills example.

**Cross-links Bundle A creates (item C)**: delegation/SKILL.md § Load Directives / Core Principles → memorization/SKILL.md § Procedure.
