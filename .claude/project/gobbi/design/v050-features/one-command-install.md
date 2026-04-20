# One-Command Install & Auto-Update

Feature description for gobbi's plugin-based distribution model. Read this to understand how gobbi installs, what updates automatically, and why no manual `.claude/` file maintenance is required.

---

> **Install once. Update the CLI, skills, agents, rules, and hooks together — no manual edits.**

Gobbi distributes as a Claude Code plugin. Installing the plugin brings the entire gobbi system in a single operation: the CLI binary, all workflow agents, domain knowledge skills, always-active behavioral rules, and the hook wiring that registers those rules with every session. Nothing is assembled by hand.

The behavioral rule that governs every session — `rules/_gobbi-rule.md` — is auto-symlinked from the plugin directory. When the plugin updates, the rule updates with it. There is no version drift between what the plugin ships and what a session loads. Projects never need to maintain their own copy of gobbi's rules, agents, or hooks; they inherit them through the plugin relationship.

The CLI package (`@gobbitools/cli`) is a dependency declared by the plugin. Plugin installation pulls the CLI. Plugin update pulls the updated CLI. All subsystems — the workflow engine, prompt compiler, event store, guard evaluation — live in the CLI package and update atomically with it. The hook scripts registered in `hooks/hooks.json` contain no logic; they delegate entirely to `gobbi` CLI commands. This separation means hook wiring stays stable across releases while CLI behavior evolves.

The zero-config assumption is intentional: gobbi does not require any project-specific `.claude/` file edits to function. Skills, agents, rules, and hooks all come through the plugin. Project-specific knowledge — domain conventions, project gotchas, custom evaluation perspectives — belongs in `.claude/project/` and `.gobbi/`, which projects own. Gobbi's own layer is self-contained and self-updating.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `../v050-cli.md` | Distribution strategy, plugin-CLI boundary, npm vs single-binary |
| `../v050-overview.md` | Philosophy behind the directory split and what belongs where |
