# `.gobbi/` Configuration

Feature description for gobbi's three-tier configuration model. Read this to understand where settings live at each scope, how tiers inherit from one another, and how config differs from long-term memory.

---

> **Configuration is a cascade: session wins over project, project wins over user. Each tier provides defaults for the narrower tier below it — and the narrower tier can always override.**

Gobbi resolves every setting by walking three `settings.json` files under `.gobbi/`, from narrowest to widest scope. The CLI reads and writes all three through `gobbi config` commands. Direct file edits are not the normal path — the CLI handles validation, cascade semantics, and format consistency.

---

## The Three Tiers

**Tier 1 — User preferences** (`.gobbi/settings.json`)

How this user likes gobbi to behave in this project. Session-independent; persists across every workflow run. Typical contents: preferred notification channel, preferred git mode, preferred base branch, UI verbosity level. Because this file is per-user and not per-session, it is the right place for personal defaults that should apply unless something narrower overrides them.

**Tier 2 — Project policy** (`.gobbi/project/settings.json`)

What this project requires regardless of who is running the workflow. Typical contents: project name, required install command, mandated base branch, project-specific model preferences, required evaluation perspectives. This file is committed to version control so the same policy applies to every contributor. It overrides user preferences wherever the two conflict.

**Tier 3 — Session-specific** (`.gobbi/project/sessions/{session-id}/settings.json`)

This workflow's choices. Written during the Workflow Configuration step — the first of the six steps in the deterministic workflow. Typical contents: task statement, trivial range, per-loop `eval_enabled` and `max_iterations`, active notification channels for this session, session-level overrides of user or project defaults. This tier wins over both wider tiers. When the session ends, the file remains as a record of how that run was configured.

---

## Inheritance

When the CLI reads a setting it checks the session file first, then the project file, then the user file, then falls back to a hardcoded default. Any tier may override the tier above it. A setting absent from the session file is resolved from the project file; absent from the project file, from the user file; absent from the user file, from the built-in default. The CLI merges the tiers at read time — no manual merging is needed.

---

## Workflow Configuration and the Session Tier

The session-tier file is not created manually. The Workflow Configuration step (step one of six) collects the user's choices for the upcoming workflow — mode selection expressed as per-loop `eval_enabled` and `max_iterations`, git mode, trivial range, notification channels, and task statement — and writes them to the session file via `gobbi config`. From that point forward, every agent in the workflow reads the session file through the CLI and gets consistent values.

---

## Config vs. Memory

Configuration answers "how does this user / project / session behave?" Memory answers "what persists as knowledge across sessions?" Gotchas, event logs, and session events are memory. Preferred git mode and `eval_enabled` are config. The two are stored separately under `.gobbi/` and serve different purposes. The memory model is described in `gobbi-memory.md`.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `deterministic-orchestration.md` | Workflow Configuration step that populates the session-tier file |
| `gobbi-memory.md` | How config differs from cross-session long-term memory |
| `cli-as-runtime-api.md` | `gobbi config` command surface and why agents use the CLI rather than direct file writes |
