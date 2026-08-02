# Claude Code Tips

## The Skill tool reports its own base directory on load

**Context:** An agent needs to know where the skill it just loaded actually lives on disk — for example, to
locate that skill's sibling files or the plugin root it was installed under.

**Tip:** The `Skill` tool's result states the base directory as its first line —
`Base directory for this skill: <path>` — every time a skill loads. No environment variable, config file, or
filesystem search supplies this; the entrypoint reports it directly. It is easy to read past this line for an
entire session, since it looks like routine tool-result framing rather than load-bearing information.

**Application:** Treat this line as the primary acquisition mechanism for any logic that needs to resolve
paths relative to a loaded skill's location, rather than deriving or guessing a plugin root.

## No plugin-root environment variable exists

**Context:** Looking for a session-scoped way to find where the active plugin is installed.

**Tip:** Neither `${CLAUDE_PLUGIN_ROOT}` nor any equivalent exists in a Claude Code session or subagent
environment — confirmed by a full `env` dump. It is also absent from tool results, tool descriptions, and the
system prompt.

**Application:** Do not design around an assumed plugin-root variable; use the Skill tool's reported base
directory instead.

## A spawned subagent has no `Skill` tool unless its role grants one

**Context:** A spawned teammate or subagent role needs to resolve its own skill or plugin root the way the
top-level session can.

**Tip:** A role's `tools:` frontmatter fully determines its tool access. A role without `Skill` in that list
cannot read the "Base directory for this skill" report and cannot run any procedure step that depends on it,
regardless of what its instructions say to do.

**Application:** When a spawned role needs a resolved path that depends on the Skill tool's report, have the
spawning agent resolve it and pass it in the brief — do not assume the spawned role can derive it itself.

## Claude Code appends `<plugin-root>/bin` onto `PATH`

**Context:** Looking for any session-bound signal of an active plugin's install location, as a fallback to the
Skill tool's report.

**Tip:** Claude Code appends `<plugin-root>/bin` onto `PATH` for every session with the plugin active. The
directory need not exist on disk for the PATH entry to appear. This is a real, undocumented side effect, not
a stable public mechanism — it could disappear without notice.

**Application:** Use this only as a fallback signal, never as the primary acquisition step.

## `/plugin marketplace add` creates a full git clone

**Context:** Understanding what a marketplace-installed plugin's files actually are on disk.

**Tip:** `~/.claude/plugins/marketplaces/<name>/` is a full git clone of the marketplace source repository,
created automatically by `/plugin marketplace add`. Every consumer of that marketplace gets one, and it
satisfies the same sentinel checks a genuine plugin install does.
