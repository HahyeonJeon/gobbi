# One-Command Install

Feature description for gobbi's install and multi-project management surface. Read this to understand how `gobbi install`, `gobbi project create/switch`, and the `.claude/` symlink farm coexist as complementary mechanisms, and when a user reaches for each one.

---

> **Three mechanisms, one coherent model: install distributes content, project commands manage projects, the symlink farm exposes the active project to Claude Code.**

These are not competing installers. Each has a distinct responsibility. Understanding which layer owns which concern prevents confusion when configuring a second project or upgrading an existing one.

---

## What `gobbi install` does

`gobbi install` lays the gobbi template bundle — skills, agents, and rules from `@gobbitools/cli` — into `.gobbi/projects/<projectName>/`. On a fresh install (no prior manifest, no preexisting content) it does three things atomically: copies the template files into the project directory, writes `.gobbi/settings.json` with `projects.active` and `projects.known`, and builds the `.claude/{skills,agents,rules}/` per-file symlink farm pointing at that project. After a single `gobbi install` the Claude Code integration is live — no follow-up command needed.

On a subsequent `gobbi install --upgrade`, the command performs a three-way merge keyed on the hash manifest written during the previous install. Files the user has not touched are updated to the new template; files with user edits are left alone; files where both sides diverged are reported as conflicts for manual resolution. The upgrade path deliberately skips the settings and farm steps — it is content-only, preserving whatever activation state already exists.

The `--project` flag lets a user install into any named project; the default is `gobbi`. This is how secondary projects receive their initial content without going through `gobbi project create` first.

---

## What `gobbi project create` and `gobbi project switch` do

`gobbi project create <name>` scaffolds the directory structure for a new project under `.gobbi/projects/<name>/`, seeds it from the same template bundle, and appends the name to `projects.known` in `settings.json`. It deliberately does NOT set `projects.active` and does NOT rotate the symlink farm. Creating a project does not change what Claude Code sees — the intent is to prepare the project, then switch to it when ready.

`gobbi project switch <name>` rotates the `.claude/` farm to point at the named project and updates `projects.active`. The switch uses a temp-build-then-per-kind-swap strategy that leaves the old farm untouched until every symlink in the new farm is materialised successfully. After the switch, all Claude Code sessions loading from `.claude/` pick up the new project's skills, agents, and rules.

`gobbi project list` shows all known projects and which is active.

---

## The `.claude/` symlink farm

The farm is the loader surface for Claude Code. Each file under `.claude/skills/`, `.claude/agents/`, and `.claude/rules/` is a symlink pointing into `.gobbi/projects/<active>/`. The farm is built by `gobbi install` (fresh) and rotated by `gobbi project switch`. It is not hand-maintained — editing symlinks directly is not safe across install upgrades.

The farm contains only the three template bundle roots. Project docs (design, decisions, gotchas, sessions) under `.gobbi/projects/<name>/` are not part of the farm and are not loaded by Claude Code automatically. They are accessed directly by agents during workflow steps.

---

## Typical flows

For a first-time setup in a new repository: `gobbi install` covers everything — templates, settings, and farm in one command.

For a second project in the same workspace: `gobbi project create <name>` scaffolds and seeds the directory, then `gobbi project switch <name>` activates it.

For upgrading after a CLI update: `gobbi install --upgrade` merges new template content while preserving user edits.

For switching back to a prior project: `gobbi project switch <prior-name>` re-points the farm; no content is re-installed.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `gobbi-memory.md` | `.gobbi/projects/<name>/` directory layout and the Memorization Loop |
| `gobbi-config/README.md` | `settings.json` cascade; `projects.active` and `projects.known` fields |
| `claude-docs-management.md` | How the plugin ships the template bundle and how it reaches `.claude/` |
