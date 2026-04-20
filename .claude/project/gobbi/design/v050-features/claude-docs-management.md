# `.claude/` Docs Lifecycle Management

Feature description for gobbi's documentation maintenance tooling. Read this to understand how gobbi surfaces what exists in `.claude/`, catches drift, and applies evaluation rubrics to docs quality.

---

> **The `.claude/` directory is a living asset. It drifts, grows stale, and accumulates orphans without active maintenance.**

Gobbi treats `.claude/` documentation as something that needs ongoing care, not just creation. The `gobbi docs` command group surfaces what exists: `list` enumerates all skills, agents, and rules; `tree` renders the directory hierarchy; `search` finds docs by content; `extract` pulls specific sections; `stats` counts entries by category; `health` flags structural problems. These commands give the orchestrator and users a clear view of the current state before making changes.

`gobbi doctor` goes further: it checks for drift between what CLAUDE.md references and what actually exists on disk, identifies skills that have no gotchas file, and finds agents that reference undefined skills. `gobbi validate` catches structural violations — missing required sections, malformed frontmatter, agent definitions that reference non-existent skills — before they reach a session where they would cause silent failures.

**Multi-perspective evaluation for docs quality** is built into the authoring skills themselves. Each docs-authoring skill (`_skills`, `_agents`, `_rules`, `_project`, and others) ships an `evaluation/` subdirectory containing perspective-specific docs — what a security reviewer looks for in an agent definition is different from what an overall-quality reviewer looks for. Each skill also has an `evaluation.md` that collects the concrete criteria across all perspectives. When evaluation runs on skill, agent, rule, or project-doc changes, evaluator agents have a specific rubric to check against rather than applying generic quality judgment. The rubric lives with the skill, so it stays current when the skill evolves.

This combination — surfacing what exists, catching drift automatically, and embedding evaluation criteria in the authoring skills — means docs quality is maintained rather than just established.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `../claude-docs.md` | Inventory of all `.claude/` documentation in the gobbi repo |
| `../../skills/_claude/SKILL.md` | Writing standard, Chain-of-Docs, anti-patterns, review checklist |
