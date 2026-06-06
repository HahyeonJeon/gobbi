---
name: per-loop-mode-gates-owned-by-mode-docs
description: Per-loop user-interaction gates are canonically owned by the mode docs (chat-mode.md §5, auto-mode.md §3/§6); orchestration/SKILL.md §Workflow State Machine owns only mode-agnostic loop mechanics.
type: decisions
scope: project
feature: null
status: active
created: 2026-06-06
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [orchestration, workflow, mode, chat-mode, auto-mode, docs-ownership]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Per-loop mode gates are owned by the mode docs, not by orchestration

## Context

`orchestration/SKILL.md § Workflow State Machine` previously contained the per-loop user-interaction gate rules for both Chat mode and Auto mode — the three in-loop gates (Evaluation, Memorization, Handoff), the fourth task-boundary gate, the `discuss.mode` shadowing behavior, the auto-advance rules, and the Always-Ask interrupt rules. The same content was also present in `chat-mode.md §5` and `auto-mode.md §3/§6`. The cross-references were inverted: orchestration described itself as the canonical owner and the mode docs pointed back to it, but the mode docs already carried the actual gate definitions and more detail than orchestration did.

This duplication (103-line § Workflow State Machine) was identified during a compaction pass on the orchestration skill.

## Decision

Per-loop user-interaction gates are canonically owned by the mode docs:

- **Chat mode** — `chat-mode.md §5` owns: the three in-loop gates (loop-end Evaluation prompt, loop-end Memorization prompt, loop-end Handoff / next-loop prompt), the fourth task-boundary gate (present when `workflow.chat.tasks[]` is populated), the `discuss.mode` shadowing rule, and the WORK + MEMORIZATION auto-advance clause (GAP-1: these two sub-phases advance silently without prompting the user).
- **Auto mode** — `auto-mode.md §3/§6` owns: silent auto-advance through all sub-phases, Always-Ask interrupt rules, and the no-interrupt-on-maxIterations rule.

`orchestration/SKILL.md § Workflow State Machine` retains a 2-bullet pointer directing readers to the mode docs for gate rules and documents only the mode-agnostic loop mechanics: loop states, verdict aggregation, iteration rule, and `state.json` persistence.

The three inverted cross-refs (`auto-mode.md` Cross-refs section, `chat-mode.md §5` parenthetical, `chat-mode.md` Cross-refs section) were flipped so orchestration is described as "shared mechanics" pointing out to the mode docs, not as the gate owner. A GAP-1 "WORK + MEMORIZATION auto-advance" clause was added to `chat-mode.md §5` so that previously implicit fact was stated positively at its new home.

## Rationale

Mode behavior belongs in the mode docs. The mode docs are what an agent loads when operating in that mode; they are the natural lookup surface for "when do I stop and ask the user?" Orchestration's job is the shared loop topology (states, verdict aggregation, iteration, state machine) — not mode-specific interaction policy. Owning the gates in orchestration required readers to consult two documents for a single concern and kept the inverted cross-refs in place as a navigation trap.

Compacting § Workflow State Machine from 103 to 75 lines, removing the duplicated gate content, and cleaning the cross-ref inversion makes the section coherent and the mode docs authoritative.

## Alternatives considered

Keep orchestration as canonical owner, reduce mode docs to pointers. Rejected: the mode docs already carried more gate detail than orchestration; this would have required moving content back into orchestration, increasing its size and re-centralizing mode-specific policy where it does not belong.

Split the gate rules into a third shared doc. Rejected: there are only two modes with different gate shapes; a shared doc adds indirection without benefit.

## Consequences

- Any agent that needs Chat mode gate rules reads `chat-mode.md §5` as the single source of truth.
- Any agent that needs Auto mode gate rules reads `auto-mode.md §3/§6` as the single source of truth.
- `orchestration/SKILL.md § Workflow State Machine` is the reference for loop topology only; gate rules are out of scope for that section.
- Future gate changes (new mode, new in-loop prompt) are made in the mode doc, not in orchestration.

## Related

- Commits `1565e97` (redesign) + `6201fba` (remediation) on `chore/session-2026-06-05-06668274`.
- `[[2026-05-28-chat-auto-mode-redesign]]` — the session that shipped `chat-mode.md` and `auto-mode.md` as mode-dispatched state machine docs.
- State-persistence table redesign (`Item|Value` + `<ul><li>`) and `workflow.chat.tasks[]` schema trim to cross-ref are companion compaction changes in the same commits.
