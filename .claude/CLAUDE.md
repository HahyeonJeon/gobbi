# CLAUDE.md

Gobbi is an open-source ClaudeX (Claude Experience) tool for Claude Code.

MUST load this at session start, resume, `/clear`, and compaction. MUST follow the core principles below. MUST reload skills `/gobbi`

---

## Core Principles

> **The logic of good work: Configuration → Ideation → Preparation → Planning → Execution → Wrap-up.**

Every session runs this 6-step state machine — Configuration plus five productive steps — governed by the `orchestration` skill and its per-step `workflow/` sub-documents (markdown-driven, no CLI). Each productive step runs as a 4-sub-phase **loop**: DISCUSSION → WORK → EVALUATION → **RECORD**. RECORD is the per-loop capture sub-phase — it stages findings, decisions, and mistake-candidates to the worktree-local session record; it never writes durable memory. Durable promotion happens in **Wrap-up**, whose 5-stage pipeline includes the **promotion** stage (stage 2 — promote the session record into memory) and the **handoff** stage (stage 4 — the next-session summary). The canonical loop / sub-phase / stage vocabulary — including the stage names — lives in one place: the [gobbi skill Glossary](skills/gobbi/SKILL.md). This top-block defers to it rather than restating the enum. Per-session telemetry lives in `<sessionDir>/session.json` (one file per session). Cross-session durable memory lives directly under `.gobbi/projects/<name>/` as plain markdown trees (`features/{f}/...`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`, etc.) — no per-project database or summary JSON.

**Configuration** — Session start: settings, memory check, workflow configuration. Not a loop.

**Ideation** — Explore what to do. PI agents (innovative + best stances) investigate the problem space with the user. Discuss until the approach is concrete enough to plan against. Optional evaluation.

**Preparation** — Verify readiness: memory + workspace skills against the locked Ideation output; close gaps before planning. Optional evaluation.

**Planning** — Decompose the chosen approach into narrow, specific, ordered tasks with clear scope and verification criteria. Optional evaluation.

**Execution** — Implement one task at a time. Complete, verify, then move to the next. Scope is bounded by the plan; no improvisation. Mandatory evaluation.

**Wrap-up** — Consolidate the session through a 5-stage pipeline: session-record validation, **promotion** (write the session record into memory), memory validation (the dual-system evaluation gate), **handoff** (the next-session summary), then git finalization. Emits `workflow.finish` and closes the session. Mandatory evaluation. (The [Glossary](skills/gobbi/SKILL.md) holds the canonical name for each stage; this top-block uses plain descriptive words and defers to the Glossary.)

> **Dual-system production and evaluation are core to the gobbi workflow.**

The dual-system model pairs an independent Claude run with an independent Codex run at both creation and review, so the anti-groupthink signal the user trusts at review also exists at creation. **Production** is the creation-time half: by default (`propose.mode: dual`, the per-loop default for all five steps) the WORK sub-phase has two independent generators — a Claude producer and a Codex proposer — that never see each other while generating; a loop can be set to `propose.mode: single` for a deliberate Claude-only run. The Claude producer is the sole author of the canonical artifact; it selectively integrates the frozen Codex proposal — selecting the stronger element, never synthesizing a blend, and never letting Codex write the canonical draft. Under `dual`, a missing or failed Codex proposal is not a safety gate: production falls back to Claude-only and stamps a durable degraded-mode label. A `single`-mode loop is a deliberate Claude-only run and carries no degraded-mode label. The producer/proposer integration discipline lives in `orchestration/workflow/production.md`.

Evaluation runs inside Ideation, Planning, and Execution — mandatory after Execution, optional at the earlier steps. The orchestrator spawns exactly two evaluators in parallel — one per system (Claude + Codex) — and each covers all seven perspectives + Overall; cross-system divergence is the anti-groupthink signal. After evaluation, the manager reconciles the two verdicts and never auto-applies a finding the user must decide on. **In Chat mode** the manager discusses findings with the user before improving — the user decides what to address, defer, or disagree with. **In Auto mode** the manager auto-iterates on REVISE up to maxIterations and the user reviews the full finding set at Wrap-up; only Always-Ask findings and the named dual-system safety gates interrupt mid-loop. See `orchestration/auto-mode.md` and `orchestration/chat-mode.md`. The producer/evaluator separation discipline (who evaluates whom, perspective separation) lives in `evaluation/SKILL.md`.

> **MUST load [principles](skills/principles/SKILL.md) at session start, resume, /clear, and /compact.**

The 10 principles below are the enforceable behavioral discipline for every agent. The principle table is the always-visible summary; load the skill for the full rationale and detail behind each principle. Subagent briefings MUST include the load instruction in their prompt — fresh subagents do not inherit the parent's loaded skills. (A *continued* teammate retains its own loaded context across turns, so it gets a delta-brief, not the full Load Directives block again — see `delegation/SKILL.md` § Continue vs Fresh.)

| # | Principle |
|---|---|
| 1 | Think and Study Before Acting: NO ACTION WITHOUT THINKING AND STUDYING IT THROUGH FIRST. |
| 2 | Bottom-Up Construction: BUILD THE FOUNDATION FIRST, THEN GROW IT ONE MINIMAL STEP AT A TIME. |
| 3 | Design With the User, Based on References: NO DESIGN WITHOUT PRIOR ART AND USER ALIGNMENT. |
| 4 | Refine the Task With the User: A PROMPT IS A TRIGGER, NOT A SPEC — ASK FOR WHAT / WHY / HOW UNTIL THE TASK IS CONCRETE. |
| 5 | Scope Is a Contract With the User: OUT-OF-SCOPE WORK WITHOUT THE USER'S DECISION IS A BREACH OF CONTRACT. |
| 6 | Start With Docs, Finish With Docs — Documents Are the Team's Memory: PLAN DOC WORK WITH A SPEC AND A CRUD PLAN, AND KEEP IT CURRENT. |
| 7 | Say/Write Plainly, Briefly, and Literally: SIMPLE WORDS, SHORT SENTENCES, NO FILLER, NO METAPHOR. |
| 8 | Fix the Root Cause, Not the Symptom: KEEP ASKING WHY UNTIL YOU REACH THE ROOT; A FIX YOU CAN'T EXPLAIN IS A GUESS. |
| 9 | Think CRUD-and-5W1H Before Editing: NO EDIT WITHOUT CHECKING ITS CRUD AND 5W1H ACROSS TARGET AND AFFECTED FILES. |
| 10 | Finish In-Scope Work — Do Not Defer It: COMPLETE EVERYTHING WITHIN THE AGREED SCOPE; DO NOT DEFER IN-SCOPE WORK. |

> **Gobbi-specific tooling: the `mistake` skill and Wrap-up-phase promotion.**

Every agent MUST load the `mistake` skill before starting work. When the user corrects any approach, immediately record it as a mistake-candidate in session staging. During the Wrap-up phase, the Wrap-up assistant promotes staged candidates to project mistakes (`.gobbi/projects/{name}/mistakes/`) — Layer 1. The Wrap-up assistant also performs Layer-2 promotion: moving generalizable project-mistakes to workspace-level skill storage so they persist across all projects and future sessions. Promotion does not cause context reload. A correction not recorded is a correction repeated across sessions. Mistakes are the highest-value knowledge in this system.

---

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gobbi skill](skills/gobbi/SKILL.md) | Entry point, session setup questions, skill map |
| [claude skill](skills/claude/SKILL.md) | Documentation standard for `.claude/` authoring |
| [principles](skills/principles/SKILL.md) | 10 behavioral principles every agent must follow — MUST load at session start; load the skill for the full rationale and detail |
