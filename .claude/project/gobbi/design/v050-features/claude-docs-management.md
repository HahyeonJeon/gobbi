# `.claude/` Docs Lifecycle Management

Feature description for gobbi's approach to authoring and maintaining Claude Code documentation. Read this to understand how skills, agents, and rules move from JSON source to rendered markdown, and how evaluation rubrics are embedded in the authoring skills themselves.

---

> **JSON is the source of truth. `.claude/` is a rendered artifact.**

Claude Code reads markdown: skills from `.claude/skills/`, agents from `.claude/agents/`, rules from `.claude/rules/`, and project-level instructions from `.claude/CLAUDE.md`. Gobbi preserves that reading format but changes where the markdown comes from.

---

## The Rendering Pipeline

Skills, agents, and rules are authored as JSON at the workspace level — `.gobbi/skills/`, `.gobbi/agents/`, and `.gobbi/rules/`. These directories are shared across every project in the workspace; they are not scoped per project. A gobbi-cli render command (name TBD — the CLI surface is being redesigned) reads JSON source from those directories and writes rendered markdown into `.claude/skills/`, `.claude/agents/`, and `.claude/rules/`. Claude Code then consumes the rendered output as it always has.

`.claude/CLAUDE.md` stands apart. It holds project-level intent that the user writes directly — session setup instructions, entry points, core principles. It is hand-authored and sits outside the rendering pipeline. Nothing renders into it.

This means `.claude/skills/`, `.claude/agents/`, and `.claude/rules/` should be treated as generated output, not edited by hand. Edits belong in the JSON source under `.gobbi/`; the render step propagates them to `.claude/`.

---

## Why JSON for the Source

Hand-written markdown is readable but opaque to tooling. JSON source carries metadata fields separate from prose, enforces required sections via schema, and supports programmatic inspection without reparsing markdown. A JSON skill record can be validated on write, merged with overrides without string manipulation, and queried for field values that would require fragile regex against a markdown file. Rendered markdown stays human-readable; JSON source stays machine-workable. The pipeline keeps both in sync.

---

## Evaluation Integration

Multi-perspective evaluation for docs quality is embedded in the authoring skills themselves. Each docs-authoring skill — `_skills`, `_agents`, `_rules`, and peers — ships an `evaluation/` subdirectory containing perspective-specific review docs. What a security reviewer looks for in an agent definition differs from what an overall-quality reviewer looks for; each perspective has its own criteria document. Each skill also carries an `evaluation.md` collecting concrete criteria across all perspectives.

When evaluator agents review docs changes — whether examining JSON source for schema correctness or reviewing rendered markdown for clarity and completeness — they load the rubric from the relevant authoring skill. The rubric travels with the skill, so evaluation criteria stay current as the skill evolves. This mechanism predates the JSON-source shift and continues to apply to both layers: source review and rendered-output review.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `gobbi-memory.md` | How `.gobbi/` is organized and where project memory lives |
| `cli-as-runtime-api.md` | The gobbi CLI surface, including the render command |
| `prompts-as-data.md` | Related data-driven generation pattern applied to workflow prompts |
