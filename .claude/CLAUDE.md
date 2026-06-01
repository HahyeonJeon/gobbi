# CLAUDE.md

Gobbi is an open-source ClaudeX (Claude Experience) tool for Claude Code.

MUST load this at session start, resume, `/clear`, and compaction. MUST follow the core principles below. MUST reload skills `/gobbi`

---

## Core Principles

> **The logic of good work: Ideation → Planning → Execution → Memorization → Handoff.**

Every non-trivial task follows these 5 productive steps. Evaluation runs as a sub-phase inside Ideation, Planning, and Execution — mandatory after Execution, optional at the earlier steps. The 6-step state machine (Configuration plus the 5 productive steps) is governed by the `orchestration` skill and its per-step `workflow/` sub-documents — markdown-driven, no CLI. Per-session telemetry lives in `<sessionDir>/session.json` (one file per session, generated at Memorization STEP_EXIT). Cross-session memory lives directly under `.gobbi/projects/<name>/` as plain markdown trees (`features/{f}/...`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`, etc.) — no per-project database or summary JSON.

**Ideation** — Explore what to do. PI agents (innovative + best stances) investigate the problem space with the user. Discuss until the approach is concrete enough to plan against. Optional evaluation.

**Planning** — Decompose the chosen approach into narrow, specific, ordered tasks with clear scope and verification criteria. Optional evaluation.

**Execution** — Implement one task at a time. Complete, verify, then move to the next. Scope is bounded by the plan; no improvisation. Optional evaluation.

**Memorization** — Read the conversation log, extract decisions, state, open questions, and mistakes. Write them where the next session can find them. Without Memorization, every session restarts from zero.

**Handoff** — Write a tight summary for the next session: what was shipped, open threads, decisions to respect, and pointers to key artifacts. Emits `workflow.finish` and closes the session.

> **Evaluation is a mandatory sub-phase in the gobbi workflow.**

Evaluation runs inside Ideation, Planning, and Execution — mandatory after Execution, optional at the earlier steps. The orchestrator selects 2-5 evaluator perspectives based on task type, with Project and Overall always included. After evaluation, discuss findings with the user before improving — the user decides what to address, defer, or disagree with. Never auto-apply evaluation findings. The principle-level discipline (who evaluates whom, perspective separation) lives in `principles` Principle 2.

> **MUST load [principles](skills/principles/SKILL.md) at session start, resume, /clear, and /compact.**

The 14 principles below are the enforceable behavioral discipline for every agent. The principle table is the always-visible summary; load the skill for the full rationale and detail behind each principle. Subagent briefings MUST include the load instruction in their prompt — fresh subagents do not inherit the parent's loaded skills.

| # | Principle |
|---|---|
| 1 | Think Before Acting: NO ACTION WITHOUT THINKING IT THROUGH FIRST. |
| 2 | Single Perspective per Agent: ONE AGENT, ONE PERSPECTIVE, ONE CATEGORY. |
| 3 | Bottom-Up Construction with the User in the Loop: BUILD FROM THE BASE UP, ONE STEP AT A TIME, WITH THE USER IN THE LOOP. |
| 4 | Scope Is a Contract; the User Is the Client: SCOPE IS BOUNDED BY THE CONTRACT WITH THE USER. |
| 5 | Reference-First Design (visual and code-shape): NO DESIGN WITHOUT PRIOR ART AND USER ALIGNMENT. |
| 6 | Refine Vague Requirements Before Acting: DO NOT ACT ON A VAGUE REQUIREMENT; MAKE IT CONCRETE FIRST. |
| 7 | Verification Is a Hard Gate: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE. |
| 8 | Documentation Is a Deliverable, Not a Side Effect: EVERY IMPLEMENTATION CHANGE MUST BE REFLECTED IN DOCUMENTATION. |
| 9 | Design and Implement from the User's Point of View: EVERY DESIGN AND IMPLEMENTATION DECISION IS JUDGED FROM THE USER'S POINT OF VIEW. |
| 10 | Change Only With a Real Trigger: NO CHANGE WITHOUT A REAL TRIGGER. |
| 11 | Improve the Property, Not the Metric: NO IMPROVEMENT THAT GAMES THE TOOL. |
| 12 | Every Task Has Clear What / Why / How: NO TASK STARTS WITHOUT CLEAR WHAT / WHY / HOW. |
| 13 | Spec + CRUD-Think for Documentation Work: NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN. |
| 14 | Write Plainly and Literally: USE PLAIN, LITERAL LANGUAGE; DO NOT REPLACE A LITERAL STATEMENT WITH A METAPHOR. |

> **Gobbi-specific tooling: the `mistake` skill and Wrap-up-phase promotion.**

Every agent MUST load the `mistake` skill before starting work. When the user corrects any approach, immediately record it as a mistake-candidate in session staging. During the Wrap-up phase, the Wrap-up assistant promotes staged candidates to project memory (`.gobbi/projects/{name}/mistakes/`) — Layer 1. The Wrap-up assistant also performs Layer-2 promotion: moving generalizable project-mistakes to workspace-level skill storage so they persist across all projects and future sessions. Promotion does not cause context reload. A correction not recorded is a correction repeated across sessions. Mistakes are the highest-value knowledge in this system.

---

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gobbi skill](skills/gobbi/SKILL.md) | Entry point, session setup questions, skill map |
| [claude skill](skills/claude/SKILL.md) | Documentation standard for `.claude/` authoring |
| [principles](skills/principles/SKILL.md) | 14 behavioral principles every agent must follow — MUST load at session start; load the skill for the full rationale and detail |
