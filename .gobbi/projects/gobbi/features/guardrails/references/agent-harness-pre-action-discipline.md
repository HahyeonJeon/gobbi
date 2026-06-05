---
name: agent-harness-pre-action-discipline
description: Prior art on how leading agent-coding harnesses (Superpowers, GSTACK, GSD, Claude Code, Cline, Aider, AGENTS.md) encode pre-action discipline — anchored the redesign of Principle 1 "Think and Study Before Acting".
type: references
scope: feature
feature: guardrails
status: active
created: 2026-06-02
session: 9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10
tags: [principles, principle-1, pre-action, research, prior-art]
title: Pre-Action Discipline in Agent-Coding Harnesses — Prior Art for Gobbi Principle 1
source: sessions/2026-06-02-9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10/ideation/rawdata/research/agent-harness-pre-action-discipline.md
accessed: 2026-06-02
ref_type: internal-research
---

# Pre-Action Discipline in Agent-Coding Harnesses — Prior Art for Gobbi Principle 1

## Purpose

Anchor a redesign of gobbi's Principle 1 ("Think and Study Before Acting") in real, current prior art (Reference-First Design). The question: how do leading agent-coding harnesses and skills/principles frameworks encode the discipline of *investigating and thinking before acting* — pre-action investigation, planning gates, research-before-design, understanding-the-problem-first?

Scope note: gobbi's principles are GENERAL behavioral guidelines for any agent context, not gobbi-only. So the synthesis below targets a *generalized* principle, not a gobbi-specific workflow rule. The pre-resolved decisions (3-field Why/Practice/Anti-pattern template; the title "Think and Study Before Acting"; deletion of the 3-strike rule and the Enforcement clause) are NOT re-litigated here — this artifact only refines/validates the Practice bullets and surfaces what prior art suggests is missing.

---

## Per-Tool Findings

Each entry: 1-line "what it is" + URL, then how it frames pre-action discipline, with a quote or close paraphrase and a source URL, plus a confidence note.

### 1. Superpowers (obra / Jesse Vincent) — HIGH confidence

**What it is:** The most popular Claude Code skills framework — an agentic skills framework + software-development methodology shipped as a folder of markdown files (composable "skills"). Repo: https://github.com/obra/superpowers

**How it frames pre-action discipline:** Superpowers bakes in an explicit **brainstorm → plan → implement** ordering and refuses to start coding until a design has been validated by the user.

- The author describes the core behavioral change: the framework "bakes in the brainstorm -> plan -> implement workflow," and "If Claude thinks you're trying to start a project or task, it _should_ default into talking through a plan with you before it starts down the path of implementation." — Jesse Vincent, https://blog.fsck.com/2025/10/09/superpowers/
- The **brainstorming** skill "doesn't just jump into trying to write code. Instead, it steps back and asks you what you're really trying to do" — it refines rough ideas through clarifying questions and explores alternatives before any code. Source: https://github.com/obra/superpowers and corroborated at https://blog.fsck.com/2025/10/09/superpowers/
- The design-validation gate: "Once it's teased a spec out of the conversation, it shows it to you in chunks short enough to actually read and digest. After you've signed off on the design" — only then does implementation proceed. Source: https://github.com/obra/superpowers
- Named pre-coding skills and what each enforces (https://github.com/obra/superpowers):
  - **brainstorming** — refine the idea through questions; explore alternatives; understand "what you're really trying to do" before code.
  - **writing-plans** — break work into bite-sized tasks with exact file paths and code specs; produce a detailed plan before execution.
  - **using-git-worktrees** — set up an isolated workspace and verify a clean test baseline before development starts (readiness check).
  - **test-driven-development** — RED-GREEN-REFACTOR; a failing test must exist before the implementation (define the target before building).
  - **subagent-driven-development** — two-stage review (spec compliance, then code quality) before proceeding.

**Takeaway for P1:** The dominant pattern is (a) understand the real intent via clarifying questions, (b) propose a design/spec and get sign-off, (c) only then implement. Superpowers explicitly treats "stepping back to ask what you're really trying to do" as the gate. This maps directly onto gobbi's proposed "Understand the real problem" and "Execution approach" bullets.

### 2. GSTACK (Garry Tan) — HIGH confidence (tool identity confirmed; some skill-level quotes via secondary sources)

**What it is:** Garry Tan's (YC President/CEO) opinionated Claude Code harness — 23 specialist "skills" that model a virtual engineering team (CEO, product manager, eng manager, QA, designer, security reviewer, etc.) with review-by-default governance. Repo: https://github.com/garrytan/gstack

**How it frames pre-action discipline:** GSTACK runs a set of **planning/review skills BEFORE any implementation**, and they are intentionally *adversarial* — they challenge the framing before a line of code is written.

- **`/office-hours`** — a YC-partner role asks "Six forcing questions that reframe your product before you write code." It is "intentionally adversarial — it challenges your idea with forcing questions before you write a line of code." Sources: https://github.com/garrytan/gstack and https://www.pulumi.com/blog/claude-code-orchestration-frameworks/
- **`/plan-ceo-review`** — "Rethink the problem. Find the 10-star product hiding inside the request" — adversarial scope/ambition challenge before engineering. Source (paraphrase): https://github.com/garrytan/gstack
- **`/plan-eng-review`** — an engineering-manager role to "Lock in architecture, data flow, diagrams, edge cases, and tests" — forces hidden assumptions into visibility before implementation. Sources: https://github.com/garrytan/gstack, https://www.pulumi.com/blog/claude-code-orchestration-frameworks/
- **`/plan-devex-review`** — explores user personas and friction points with forcing questions (think about who uses this and how they fail) before ship.
- **`/cso`** — "OWASP Top 10 + STRIDE threat model" as a mandatory adversarial security pass before `/ship`. Source: https://github.com/garrytan/gstack

**Takeaway for P1:** GSTACK adds two dimensions the others under-emphasize: (a) **adversarial challenge of the problem framing itself** ("rethink the problem," forcing questions) — not just understanding the stated problem but interrogating whether it's the right problem; and (b) **explicit user/persona + edge-case + threat surfacing** as a pre-action step. This corroborates gobbi's "User perspective" and "Critical considerations" bullets, and suggests the "Understand the real problem" bullet should include *interrogating* the framing, not merely restating it.

### 3. GSD (get-stuff-done) — MEDIUM confidence (via the Pulumi comparison; primary repo not fetched)

**What it is:** A Claude Code orchestration framework that gives each workflow phase its own dedicated orchestrator/context window. Source: https://www.pulumi.com/blog/claude-code-orchestration-frameworks/

**How it frames pre-action discipline:** GSD separates *capturing decisions* and *planning* into their own phases with dedicated context, "preventing decisions from getting lost."

- `/gsd-discuss-phase` — "Capture implementation decisions before planning starts."
- `/gsd-plan-phase` — "Research, plan, and verify for a single phase."
- Per Pulumi: "Planning gets its own context window, preventing decisions from getting lost." Source: https://www.pulumi.com/blog/claude-code-orchestration-frameworks/

**Takeaway for P1:** GSD reinforces that **research + planning is a distinct phase before execution**, and that decisions captured during discussion must be preserved. (Confidence MEDIUM: skill quotes are from the Pulumi comparison, not GSD's own repo.)

### 4. Claude Code Plan Mode (Anthropic) — HIGH confidence

**What it is:** A built-in Claude Code mode where the agent uses **read-only tools only** to investigate and produce a plan the user approves before any edits. Docs/discussion: https://code.claude.com/docs/en/how-claude-code-works ; analysis: https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/

**How it frames pre-action discipline:** Plan mode mechanically separates *investigation/planning* from *editing* by restricting the agent to read-only tools (file reads, directory listings, pattern/content searches, web search) until the plan is approved.

- The recommended use: "separate research from coding by using plan mode to analyze the codebase first, then create a plan for implementation, review it, and refine it through conversation before Claude implements." Source (secondary, summarizing Anthropic guidance): search synthesis over https://code.claude.com/docs/en/how-claude-code-works and community guides.
- Armin Ronacher quotes the actual tool instruction distinguishing planning from research: "Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool." — https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/
- Ronacher's framing of *why* the split matters: separating the investigation phase from code modification lets users "double check what these plans are, to edit them, and to manipulate them" before committing to implementation. — https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/

**Takeaway for P1:** Anthropic's own tool encodes the principle as a *mode boundary*: study (read-only) precedes act (edits), and the plan is a reviewable artifact. Notably, Anthropic distinguishes **understanding-the-codebase (research)** from **planning-the-implementation** as two different activities — a useful distinction for gobbi's "Study the terrain" vs "Execution approach" bullets.

### 5. Cline — Plan & Act modes — HIGH confidence

**What it is:** A popular open-source VS Code agent with two explicit modes: **Plan** (read-only exploration + strategy) and **Act** (edits + commands). Docs: https://docs.cline.bot/core-workflows/plan-and-act

**How it frames pre-action discipline:** Cline makes "separate thinking from doing" a first-class product concept and recommends starting in Plan mode for any non-trivial work.

- "Plan mode lets you explore and strategize without changing files." — https://docs.cline.bot/core-workflows/plan-and-act
- "This constraint is intentional. It keeps the conversation focused on understanding and planning, without the distraction of implementation details." — https://docs.cline.bot/core-workflows/plan-and-act
- Risk of skipping: "While you can start directly in Act mode, planning first is highly recommended. The planning phase intentionally builds context that Cline needs to implement changes effectively. Without it, Cline may lack the understanding required to make the right decisions." — https://docs.cline.bot/core-workflows/plan-and-act
- For complex work, `/deep-planning` "Identifies all affected files and dependencies... Creates a detailed implementation plan... Asks clarifying questions before proceeding." — https://docs.cline.bot/core-workflows/plan-and-act

**Takeaway for P1:** Cline names the failure mode that gobbi's P1 targets: skipping planning leaves the agent "lack[ing] the understanding required to make the right decisions." It pairs three pre-action moves — understand existing architecture, identify affected files/dependencies, ask clarifying questions — which map onto gobbi's "Study the terrain," "Critical considerations" (dependencies), and "Understand the real problem" bullets.

### 6. Aider — Architect / Ask vs Code modes — HIGH confidence

**What it is:** A terminal pair-programming agent. **Ask** mode answers questions about the code without editing; **Architect** mode reasons about/plans structural changes, then a separate edit step applies them. Docs: https://aider.chat/docs/usage/modes.html ; rationale: https://aider.chat/2024/09/26/architect.html

**How it frames pre-action discipline:** Aider splits *reasoning about the solution* from *editing the code*, and recommends discussing/planning before editing.

- Rationale for the split: when one model does both, "the model has to split its attention between solving the coding problem and conforming to the edit format." The Architect "concentrates on problem-solving" and "describe[s] the solution however comes naturally to it"; the Editor focuses on "properly formatting the edits without needing to reason much." — https://aider.chat/2024/09/26/architect.html
- Recommended workflow: "bounce back and forth between /ask and /code modes. Use ask mode to discuss what you want to do, get suggestions or options from aider and provide feedback on the approach. Once aider understands the mission, switch to code mode." — https://aider.chat/docs/usage/modes.html
- For large refactors: "start in architect mode to discuss and plan the restructuring. Once the plan is clear, switch to code mode to execute." — https://aider.chat/docs/usage/modes.html

**Takeaway for P1:** Aider's contribution is the cognitive-load argument: reasoning and editing compete for attention, so *reason first, edit second*. This is a mechanism-level justification for the whole principle — "think it through first" isn't moralizing, it's about not splitting attention between solving and executing. Useful for the "Why" framing.

### 7. AGENTS.md convention (open format, GitHub/OpenAI Codex et al.) — MEDIUM-HIGH confidence

**What it is:** An open, cross-tool convention — a "README for agents" — that gives coding agents the build steps, tests, and conventions they need on task start. Site: https://agents.md/ ; repo: https://github.com/agentsmd/agents.md

**How it frames pre-action discipline:** Less a "plan-before-act" gate than a "study-the-terrain" convention: the agent loads project context (conventions, build/test commands) before working, and authoring an AGENTS.md itself requires studying the repo.

- "On task start, agents load the nearest AGENTS.md into their context window. Build/test commands are used to form the execution plan." — search synthesis over https://agents.md/ and https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/
- Authoring guidance: "study the repo and look at the directory structure, the package manager, the scripts in package.json, the framework, and the test setup to produce a reasonable first draft." — search synthesis over https://agents.md/ and the GitHub blog above.

**Takeaway for P1:** AGENTS.md institutionalizes "study existing conventions before acting" — the agent must absorb the project's conventions/build/test setup (the terrain) before doing work. This directly supports gobbi's "Study the terrain (existing code, docs, conventions, prior art)" bullet and the "Best practices" bullet (community-validated conventions).

---

## Cross-Tool Synthesis — what leading tools agree the agent must do before acting

Across all seven, the same recurring dimensions appear. Listed by how broadly each is attested:

1. **Separate "study/plan" from "act" as distinct phases/modes (7/7).** Plan-vs-Act (Cline), Plan mode read-only (Claude Code), Ask/Architect vs Code (Aider), brainstorm→plan→implement (Superpowers), discuss→plan phases (GSD), plan-review skills before ship (GSTACK), load-context-before-work (AGENTS.md). This is the universal backbone of gobbi P1.

2. **Understand the real intent via clarifying questions before designing (Superpowers, Cline, GSTACK).** "Ask what you're really trying to do" (Superpowers); "Asks clarifying questions before proceeding" (Cline /deep-planning); forcing questions (GSTACK /office-hours).

3. **Study the existing terrain — codebase, architecture, dependencies, conventions (Claude Code, Cline, AGENTS.md, Aider).** Read-only investigation of "how components work" (Claude Code); "explore unfamiliar codebases," "identify all affected files and dependencies" (Cline); study repo structure/conventions/build/test (AGENTS.md).

4. **Lock the approach/architecture and surface edge cases before code (GSTACK, Cline, Superpowers, Aider).** "Lock in architecture, data flow, diagrams, edge cases, and tests" (GSTACK); "detailed implementation plan" (Cline); write a spec/plan (Superpowers); reason about the solution (Aider).

5. **Interrogate the framing — is this even the right problem? (GSTACK, Superpowers).** "Rethink the problem. Find the 10-star product hiding inside the request" (GSTACK); "steps back and asks what you're really trying to do" (Superpowers). This is *stronger* than "understand the stated problem" — it challenges the premise.

6. **Think about the user / personas / who-will-fail (GSTACK; gobbi-aligned).** `/plan-devex-review` explores personas and friction points. Weakest-attested externally (mostly GSTACK + Anthropic's general guidance), but present.

7. **Best practices / proven conventions (AGENTS.md, Superpowers TDD).** Load community-validated conventions (AGENTS.md); follow proven methodology like TDD (Superpowers). Moderately attested.

8. **Produce a reviewable plan artifact the user signs off on before acting (Superpowers, Claude Code, Cline, GSD).** Design sign-off in chunks (Superpowers); approve the plan (Claude Code); plan artifact (GSD); review before implement (Cline). This is a workflow concern more than a behavioral one — relevant to gobbi's workflow, less to a *general* principle.

---

## Mapping to the Proposed P1 Practice Bullets

The proposed bullets:
1. Understand the real problem
2. Study the terrain
3. Best practices
4. Critical considerations
5. Execution approach
6. User perspective

| Proposed bullet | Prior-art support | Verdict |
|---|---|---|
| **Understand the real problem** | Superpowers ("what you're really trying to do"), Cline (clarifying questions), GSTACK (forcing questions) | **Strongly supported.** Recommend strengthening to include *interrogating the framing*, not just restating it (GSTACK "rethink the problem"). |
| **Study the terrain** | Claude Code (read-only investigate), Cline (explore codebase, affected files/deps), AGENTS.md (study repo/conventions), Aider | **Strongly supported.** Best-attested dimension. Add "affected files and dependencies" explicitly (Cline) — overlaps with Critical considerations. |
| **Best practices** | AGENTS.md (conventions), Superpowers (TDD) | **Supported but weaker as a standalone.** Externally it shows up as "follow project conventions" + "proven methodology." Keep, but note it overlaps with "Study the terrain" (conventions are part of the terrain). Consider folding the "community-validated approach / has someone solved this" into prior-art study. |
| **Critical considerations** | GSTACK (edge cases, threat model), Cline (dependencies), generic | **Supported.** "Constraints, edge cases, hidden dependencies, stakes" all appear (GSTACK edge cases + STRIDE; Cline dependencies). Keep. |
| **Execution approach** | Superpowers (writing-plans), Claude Code (plan), Cline (implementation plan), Aider (architect), GSTACK (architecture lock-in) | **Strongly supported.** Universal. Keep. |
| **User perspective** | GSTACK (/plan-devex-review personas/friction) | **Weakly attested externally** (mostly GSTACK). It is more a gobbi-idiosyncratic emphasis (gobbi P9 deepens it). Keep — it is defensible and cross-referenced to P9 — but acknowledge it is the least externally-corroborated of the six. |

---

## Sources

- Superpowers repo — https://github.com/obra/superpowers
- Jesse Vincent, "Superpowers: How I'm using coding agents in October 2025" — https://blog.fsck.com/2025/10/09/superpowers/
- GSTACK repo (Garry Tan) — https://github.com/garrytan/gstack
- Pulumi, "Superpowers, GSD, and GSTACK: Picking the Right Framework" — https://www.pulumi.com/blog/claude-code-orchestration-frameworks/
- Claude Code Plan Mode — https://code.claude.com/docs/en/how-claude-code-works
- Armin Ronacher, "What Actually Is Claude Code's Plan Mode?" — https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/
- Cline, "Plan & Act Mode" — https://docs.cline.bot/core-workflows/plan-and-act
- Aider, "Separating code reasoning and editing" — https://aider.chat/2024/09/26/architect.html
- Aider chat modes — https://aider.chat/docs/usage/modes.html
- AGENTS.md — https://agents.md/
- GitHub blog, "How to write a great agents.md" — https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/
