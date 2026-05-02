---
name: _skills-evaluation-architecture
description: Architecture perspective for skill evaluation. Load when evaluating skill definitions for hierarchy and decomposition.
allowed-tools: Read, Grep, Glob, Bash
---

# Skills Evaluation — Architecture Perspective

You evaluate gobbi skill definitions from the architecture perspective. Your question is: is this skill structurally sound, and does it compose cleanly with the rest of the skill system?

This perspective focuses on the internal structure of the skill and its relationships with other skills — not on whether it solves the right problem (project perspective) or whether its prose is clear (aesthetics perspective).



---

## Core Principle

> **A skill's structure determines whether agents can navigate it, use it selectively, and extend it without breaking adjacent skills.**

The architecture evaluator looks at how a skill is organized internally — its hierarchy, its decomposition into child docs, its abstraction level — and how it couples with neighboring skills. A structurally sound skill is one an agent can load selectively, follow without confusion, and extend without introducing drift.

> **Hierarchy is not decoration — it is the mechanism by which agents load only what they need.**

The parent-child structure in gobbi skills is a context management strategy. A flat, monolithic skill forces agents to read everything. A well-decomposed skill lets the parent orient and the children specialize. Evaluate whether the structure serves this purpose or undermines it.

---

## What to Evaluate

### Internal Hierarchy

Assess whether the skill's decomposition into SKILL.md and optional child files is appropriate:

- Does SKILL.md give the agent enough orientation to decide which child docs to read?
- Are child docs named and described clearly enough to guide selective loading?
- Is content at the right level in the hierarchy — principles in the parent, specifics in children?
- For a skill without child docs: is the content genuinely focused enough to be in a single file, or is it a flat monolith masquerading as a single-topic skill?

### Abstraction Level

Each skill should operate at a consistent level of abstraction. Assess:

- Does the skill stay at one level, or does it mix high-level principles with low-level implementation details?
- When the skill references external systems or other skills, does it reference them by contract (what they provide) rather than by implementation (how they work)?
- Would a change to an implementation detail in another skill force changes to this one?

### Coupling with Adjacent Skills

Gobbi skills interact — one skill may depend on context another skill establishes. Assess:

- When this skill instructs an agent to load other skills, is that coupling necessary or incidental?
- Does this skill duplicate content from a skill it depends on, creating two sources of truth?
- If a sibling skill changed its contract, would this skill need to change? Is that dependency made explicit?
- Are the `allowed-tools` scoped to what the skill actually requires, or does the list include tools defensively?

### Structural Completeness

Assess whether the skill has the structural elements that make it navigable and usable:

- Is the frontmatter complete and correct — `name` matching directory, `description` in command tone, `allowed-tools` scoped tightly?
- If children exist, is there a "Navigate deeper from here:" table in SKILL.md pointing to them?
- Does SKILL.md open with a clear statement of what the skill is and when to load it?
- Are headings structured so an agent can scan and locate relevant sections without reading everything?

### Extension Path

A well-architected skill can grow without requiring structural surgery. Assess:

- If this skill needed to add a new subtopic, is there a natural place for it?
- If this skill became too large, what would be the natural child docs?
- Does the current structure make the extension path clear, or does growth require rethinking the whole skill?

---

## Signals Worth Noting

- A SKILL.md that exceeds the 200-line target with no child docs (suggests decomposition is needed)
- A child doc that could be merged back into SKILL.md without losing anything (suggests over-splitting)
- Two skills with a dependency cycle — each loads the other for orientation
- `allowed-tools` includes `Write` or `Edit` in a skill that teaches read-only knowledge
- The "Navigate deeper" table references files that don't exist or have different names than expected

---

## Output Format

Report findings as specific, named structural problems. For each problem:

- Identify the specific structural element that is problematic
- Explain what failure mode it produces when an agent uses this skill
- Note whether it blocks correct use or merely reduces efficiency

Include observations on structural elements that are well-designed — decomposition that makes selective loading easy, coupling that is explicit and minimal, hierarchy that matches the domain's natural abstraction layers.
