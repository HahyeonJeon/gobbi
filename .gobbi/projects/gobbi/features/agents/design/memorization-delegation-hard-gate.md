---
name: memorization-delegation-hard-gate
description: Design decision to add a hard-gate Load Directive requiring memorization/SKILL.md in every delegation that includes a MEMORIZATION phase, preventing the pathology where the assistant runs Memorization without the staging procedure loaded.
type: design
scope: feature
feature: agents
status: active
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [memorization, delegation, load-directives, hard-gate]
topic: memorization-delegation-hard-gate
---

# Memorization Delegation Hard Gate

**Chosen direction**: Add a new entry to `delegation/SKILL.md § The Load Directives Block` stating: "When the delegated phase includes MEMORIZATION (every loop's MEMORIZATION sub-phase, plus Wrap-up's WORK promotion routing), `memorization/SKILL.md` MUST appear in tier 3 (Skills)." Add it to the per-role templates under `delegation/templates/`: assistant template explicitly; leader and executor templates when MEMORIZATION is part of their dispatch. Evaluator template excluded (evaluators do not run MEMORIZATION).

**Rationale**: Root cause of the pathology this design addresses: Load Directives lacked `memorization/SKILL.md`, so the assistant ran Memorization without the staging procedure loaded. The fix is to make the requirement explicit at the delegation contract level — if it's in Load Directives, it's loaded; no internal self-check saves the agent if it wasn't loaded.

**Alternative rejected**: Add a self-check inside the assistant's MEMORIZATION procedure Step 1 ("did I load memorization/SKILL.md?"). Rejected as duplicative — if Load Directives include it, it's loaded; if not, no internal check saves the dispatch.

**Validation**: `grep -c "memorization/SKILL.md" delegation/SKILL.md` returns ≥ 2; each relevant template includes `memorization/SKILL.md` in its Skills example.

**Cross-links**: delegation/SKILL.md § Load Directives / Core Principles → memorization/SKILL.md § Procedure.
