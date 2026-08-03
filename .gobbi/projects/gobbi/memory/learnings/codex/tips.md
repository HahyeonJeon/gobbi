# Codex Tips

## `.codex/config.toml` at a repository root is inert

**Context:** A repository ships its own `.codex/config.toml` intending to set model, effort, or other Codex
CLI policy for work in that repository.

**Tip:** Codex CLI `0.146.0` loads only `$CODEX_HOME/config.toml` (confirmed with `codex doctor --json`, which
reports exactly that one config path regardless of the current working directory). A repository-local
`.codex/config.toml` is never read. The defect stayed invisible in one real case because both files happened
to name the same model, so nothing looked wrong. Passing the same setting with `-c key=value` does take
effect — the mechanism is sound, just not the file.

**Application:** Verify with `codex doctor --json` before trusting that a repository-local Codex config file
does anything. Prefer `-c` flags or `$CODEX_HOME/config.toml` for settings that must actually apply.

## `codex exec` has no interactive approval flag

**Context:** Launching a `codex exec` run and reasoning about its permission boundary.

**Tip:** `codex exec` does not accept `-a`/`--ask-for-approval` — it exits 2 with "unexpected argument" — and
every `codex exec` run reports `approval: never` in its header. Sandbox mode is therefore the entire
permission boundary of a `codex exec` run; nothing in it ever stops to ask.

**Application:** When launching a `codex exec` run programmatically, choose the sandbox mode deliberately —
it is the only control available, not one of several.

## `codex exec` did not enforce `--skip-git-repo-check`'s implied guard

**Context:** Reasoning about whether `codex exec` blocks a run started outside a git repository.

**Tip:** In Codex CLI `0.146.0`, `codex exec` did not block outside a git repository despite
`--skip-git-repo-check` existing as a flag, implying a guard the flag would bypass. Treat the flag's
documented meaning as unverified against the version in use rather than assuming the guard fires.

## Skills and agents namespace to `gobbi:<name>` in an installed plugin

**Context:** Referring to a Gobbi skill or agent type from within a consumer project that installed the
plugin, on Codex CLI.

**Tip:** A consumer project offers only the prefixed identifier (`gobbi:principles`, `gobbi:leader`, …), never
the bare form — measured identically on Codex CLI `0.146.0` and Claude Code `2.1.220`. The Codex root alias
for a loaded skill reports the skills root directory itself, not the skill's own subdirectory.

**Application:** Use the prefixed form in any reference meant to work from a consumer project. See
[`design/architecture/plugin-skill-locator.md`](../../design/architecture/plugin-skill-locator.md) for how
this and the Claude Code shape difference are reconciled by one locator.
