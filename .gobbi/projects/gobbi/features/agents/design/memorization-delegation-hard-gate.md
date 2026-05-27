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

## Context

A delegation prompt's Load Directives block names the skills a spawned agent must load before working — a fresh agent does not inherit the parent's loaded skills. The assistant role runs the MEMORIZATION phase, whose staging procedure lives in `memorization/SKILL.md`. The pathology this design addresses: delegation prompts that included a MEMORIZATION phase were not always listing `memorization/SKILL.md` in their Load Directives, so the assistant ran Memorization without the staging procedure loaded and improvised the staging step.

## Decision

Add a hard-gate entry to `delegation/SKILL.md § The Load Directives Block` stating: "When the delegated phase includes MEMORIZATION (every loop's MEMORIZATION sub-phase, plus Wrap-up's WORK promotion routing), `memorization/SKILL.md` MUST appear in tier 3 (Skills)." Propagate the requirement into the per-role templates under `delegation/templates/`: the assistant template lists it explicitly; the leader and executor templates list it when MEMORIZATION is part of their dispatch. The evaluator template is excluded — evaluators do not run MEMORIZATION.

## Rationale

The requirement is enforced at the delegation-contract level rather than left to the agent's discretion: if a skill is in Load Directives, it is loaded; no internal self-check saves an agent that was never given the directive. Making the gate part of the prompt-construction contract closes the gap at the point where the prompt is authored, which is where the omission originated.

## Alternatives considered

- **Self-check inside the assistant's MEMORIZATION procedure Step 1** ("did I load `memorization/SKILL.md`?"). Rejected as duplicative and unreliable — if Load Directives already include the skill, the check is redundant; if they do not, no internal check can load a skill the dispatch never named.

## Consequences

- Every delegation that includes a MEMORIZATION phase now carries `memorization/SKILL.md` in its Load Directives, so the staging procedure is always loaded before Memorization runs.
- Verify with `grep -c "memorization/SKILL.md" delegation/SKILL.md` (expect ≥ 2) and confirm each relevant per-role template includes `memorization/SKILL.md` in its Skills example.
- Cross-reference: `delegation/SKILL.md § Load Directives` / Core Principles point at `memorization/SKILL.md § Procedure`.
