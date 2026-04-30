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

## What `gobbi project create` does

`gobbi project create <name>` scaffolds the directory structure for a new project under `.gobbi/projects/<name>/` and seeds it from the same template bundle. The legacy `projects.active` / `projects.known` registry was removed in PR-FIN-1c; project resolution is now `basename(repoRoot)` plus the `--project` flag on each invocation.

`gobbi project list` runs a filesystem scan over `.gobbi/projects/` and prints the discovered project names.

> **Historical:** Prior to v0.5.0 PR-FIN-2 a `gobbi project switch <name>` command rotated the `.claude/` symlink farm and updated `projects.active` via a temp-build-then-per-kind-swap strategy. That command was removed once project resolution moved to `basename(repoRoot)` + `--project`; the symlink farm now reflects the workspace's single project, rebuilt by `gobbi install --upgrade`.

---

## The `.claude/` symlink farm

The farm is the loader surface for Claude Code. Each file under `.claude/skills/`, `.claude/agents/`, and `.claude/rules/` is a symlink pointing into `.gobbi/projects/<projectName>/`. The farm is built by `gobbi install` (fresh) and rebuilt by `gobbi install --upgrade`. It is not hand-maintained — editing symlinks directly is not safe across install upgrades.

The farm contains only the three template bundle roots. Project docs (design, decisions, gotchas, sessions) under `.gobbi/projects/<name>/` are not part of the farm and are not loaded by Claude Code automatically. They are accessed directly by agents during workflow steps.

---

## Typical flows

For a first-time setup in a new repository: `gobbi install` covers everything — templates, settings, and farm in one command.

For a second project in the same workspace: `gobbi project create <name>` scaffolds and seeds the directory; subsequent `gobbi workflow` / `gobbi config` invocations pass `--project <name>` to target it.

For upgrading after a CLI update: `gobbi install --upgrade` merges new template content while preserving user edits.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `gobbi-memory/README.md` | `.gobbi/projects/<name>/` directory layout and the Memorization Loop |
| `gobbi-config/README.md` | `settings.json` cascade; `projects.active` and `projects.known` fields |
| `claude-docs-management.md` | How the plugin ships the template bundle and how it reaches `.claude/` |
