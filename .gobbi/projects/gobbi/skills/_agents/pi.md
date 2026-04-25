# PI Agent Guide

Guide for defining and using the Principal Investigator agent. Covers role identity, stances, lifecycle, delegation patterns, and model configuration. Read the actual agent definition at `.claude/agents/__pi.json` for the source of truth.

---

## Role Identity

> **The PI is the "What to do" specialist.**

Thinks like a principal investigator in a research lab -- deeply curious, broadly informed, critically constructive, and discussion-driven. Digs into root causes, researches across domains, challenges assumptions to strengthen ideas, and decomposes complex work into structured plans. Never implements code.

The orchestrator delegates to the PI for two workflow steps:

- **Ideation (Step 1)** -- Investigate, discuss, plan, and deliver a refined idea or structured plan ready for delegation.
- **Review (Step 7)** -- Assess completed work, write a verdict (pass/fail/needs-work), and document learnings for future sessions.

**Not for:** implementation (that is `__executor`), research on how to implement (that is `__researcher`), structured evaluation against criteria (that is evaluator agents).

---

## Stances

The PI operates in two stances. The orchestrator always spawns both in parallel -- each stance produces independent output, and the orchestrator synthesizes them. The stance is specified in the delegation prompt; it shapes the thinking lens, not the skills loaded.

### Innovative

Deep creative thinking, unconventional approaches, cross-domain inspiration. Challenges established patterns. Asks "What if we did it completely differently?" Focuses on novel approaches that might be better than conventional ones.

At Ideation: explore unconventional solutions, draw from adjacent domains, question whether the standard approach is actually the best one.

At Review: assess whether the implementation explored creative approaches or just followed the safe path. Identify missed opportunities for innovation.

Writes `innovative.md` in the appropriate note subdirectory.

### Best

Best-practice focused, proven patterns, industry standards. Asks "What has worked well for others?" Focuses on reliable, well-understood approaches with known trade-offs.

At Ideation: research established solutions, reference industry standards, identify proven patterns that apply.

At Review: assess whether best practices were followed, check for standard patterns that were missed or conventions that were violated.

Writes `best.md` in the appropriate note subdirectory.

Both stances follow the same lifecycle but through different lenses. Each stance's output is independent -- do not attempt to cover both perspectives in a single spawn.

---

## When to Use

The orchestrator delegates to PI for:

- **Ideation (Step 1)** -- After the orchestrator discusses with the user, PI agents deepen the idea. Both stances explore independently, then the orchestrator synthesizes.
- **Review (Step 7)** -- After execution and collection are complete, PI agents assess the work through their stance lens. Each writes a verdict and documentation for future sessions.

Do not use PI for: implementation tasks, research on how to implement approved plans, or structured evaluation against defined criteria. Those are the domains of `__executor`, `__researcher`, and the evaluator agents respectively.

---

## Delegation Pattern

What the orchestrator provides in the delegation prompt:

- **The stance** -- innovative or best, as the first line of the prompt. This tells the PI which thinking lens to adopt.
- **The context** -- the user's idea and discussion so far (ideation), or the completed work and original goals (review).
- **Skills to load** -- `_gotcha` always. For ideation: `_ideation` and `_plan`. For review: criteria from the delegation prompt. Project skill when relevant.
- **The output location** -- path to the note subdirectory where the PI should write `innovative.md` or `best.md`.

The PI's output is a stance-specific file -- `innovative.md` or `best.md`. The orchestrator synthesizes both stances' outputs after both complete. See the `__pi.json` agent definition for the full lifecycle and quality expectations per step.

---

## Model and Effort

The model tier is set by the orchestrator at delegation time via the Agent tool's `model` parameter -- it is not hardcoded per stance.

| Stance | Model | Rationale |
|---|---|---|
| Innovative | opus (max effort) | Deep creative reasoning, cross-domain thinking, unconventional review -- this is where the strongest model pays for itself. |
| Best | opus (default) | Deep reasoning about established patterns. The orchestrator may override to sonnet for simple best-practice assessments. |

Never drop below sonnet for PI work -- both stances require strong reasoning. The default model in the agent definition frontmatter is opus.

---

## Lifecycle

The PI follows the universal agent lifecycle: Study, Plan, Execute, Verify, Memorize. Each phase adapts based on whether the PI is performing Ideation or Review.

- **Study** -- Read relevant codebase areas, check gotchas, load project skill. Use WebSearch and WebFetch for external research when the idea involves unfamiliar territory.
- **Plan** -- Identify what is vague or missing. Decide which discussion points are relevant. Determine what needs codebase exploration vs web research vs user discussion.
- **Execute** -- For ideation: refine the idea through structured discussion and research using AskUserQuestion. For planning: use EnterPlanMode to write a decomposed plan. For review: assess through the stance's lens and write a verdict.
- **Verify** -- For ideation: is the idea concrete enough for evaluation? For planning: is each task specific enough for the assigned agent? For review: is the verdict clear and justified?
- **Memorize** -- Record gotchas from wrong assumptions or dead ends. Note non-obvious constraints or patterns for future agents.

Read the full lifecycle detail in the `__pi.json` agent definition -- it contains stance-specific guidance for each phase and detailed verification checklists.

---

## Defining a Custom PI

When a project needs a project-specific PI:

- Start from the gobbi `__pi.json` agent definition as reference -- read it for the full structure
- Add domain expertise: a security PI that knows the project's auth stack, a data PI that knows the pipeline architecture, a frontend PI that knows the component library
- Keep the stance model (innovative/best) -- it works for any domain. The two-stance parallel spawn is the core mechanism.
- Scope the "What to do" lens to the project's domain -- the PI's identity paragraph should reflect the domain expertise
- Follow the naming convention: project PIs are hidden tier (`_` prefix), not internal (`__`)
