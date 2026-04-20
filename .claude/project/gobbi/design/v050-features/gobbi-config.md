# `.gobbi/` Configuration

Feature description for gobbi's per-session configuration system. Read this to understand where session settings live, what is configurable, and how config differs from long-term memory.

---

> **Session behavior is configured once, stored predictably, and read by the CLI — never re-asked mid-workflow.**

Gobbi stores per-session configuration in `.claude/gobbi.json` — a gitignored file, per-user, scoped to the project. This is not a project-wide settings file; it is a session-keyed record of how each workflow session is configured. The `gobbi config get/set/list` commands are the interface. Direct file edits are not needed.

Configuration entries are indexed by `$CLAUDE_SESSION_ID`. Each entry holds the settings that govern how that session behaves: the trivial range threshold (below which the workflow skips non-mandatory steps), the evaluation mode, the git workflow style, and base branch. Notification settings — channel, verbosity, and target — are stored per session under `notify.*` keys.

The TTL and max-entries cleanup ensures the file does not accumulate indefinitely. Sessions older than the configured TTL are pruned; when the entry count exceeds the cap, the oldest entries are removed first. This cleanup runs automatically so the file stays small and the relevant session's config is always findable.

**How config differs from memory:** Config is *how this session behaves*. It answers questions like "does this session use strict evaluation mode?" or "which notification channel should fire on completion?" Memory is *what persists across sessions* — gotchas, workflow decisions, open questions. Config is per-session and short-lived. Memory is cross-session and durable. These are stored separately and serve different purposes. The long-term memory system is described in `gobbi-memory.md`.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `../v050-cli.md` | `gobbi config` command surface and session lifecycle |
| `../v050-session.md` | Session directory structure and `metadata.json` |
