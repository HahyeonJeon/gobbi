# One-Command Install & Auto-Update

Feature description for gobbi's plugin-based distribution model. Read this to understand how gobbi installs, what updates automatically, and why no manual `.claude/` file maintenance is required.

---

> **Install once. Update the CLI, skills, agents, rules, and hooks together — no manual edits.**

Gobbi distributes as a Claude Code plugin. Installing the plugin brings the entire gobbi system in a single operation: the CLI binary, all workflow agents, domain knowledge skills, always-active behavioral rules, and the hook wiring that registers those rules with every session. Nothing is assembled by hand.

The gobbi behavioral rule that governs every session ships with the plugin and is refreshed whenever the plugin updates. There is no version drift between what the plugin ships and what a session loads. Projects never need to maintain their own copy of gobbi's rules, agents, or hooks; they inherit them through the plugin relationship.

The entry point for this story is `/gobbi`. When a user installs the gobbi plugin and runs `/gobbi` in a session, the session agent checks whether `gobbi-cli` is installed and whether its version is current. If the CLI is missing or outdated, the session agent installs or updates it automatically — the user does not run a separate install command. `/gobbi` is the single trigger that drives the entire install and update flow from inside the session.

The CLI package `@gobbitools/cli` is the v0.5.0 distribution target. All subsystems — the workflow engine, prompt compiler, event store, guard evaluation — live in the CLI package and update atomically when the plugin updates. The hook scripts registered in `hooks/hooks.json` contain no logic; they delegate entirely to `gobbi` CLI commands. This separation means hook wiring stays stable across releases while CLI behavior evolves.

The zero-config assumption is intentional: gobbi does not require any project-specific `.claude/` file edits to function. Skills, agents, rules, and hooks all come through the plugin. Project-specific knowledge — design notes, decisions, gotchas, backlog items — belongs in `.gobbi/projects/{project_name}/`, which projects own. Gobbi's own layer is self-contained and self-updating.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `deterministic-orchestration.md` | The six-step workflow; the `/gobbi`-driven install check runs inside Workflow Configuration |
| `cli-as-runtime-api.md` | The CLI surface the plugin installs |
| `claude-docs-management.md` | How rules, skills, and agents ship with the plugin and reach `.claude/` |
