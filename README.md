![Gobbi logo](assets/logo.png)

# Gobbi

Open-source orchestration for Claude Code, Codex, Cursor, and Grok.

<p>
  <a href="./CHANGELOG.md"><img src="https://img.shields.io/badge/version-1.3.3-blue" alt="Version 1.3.3"></a>
  <img src="https://img.shields.io/badge/runtimes-Claude%20Code%20%7C%20Codex%20%7C%20Cursor%20%7C%20Grok-black" alt="Runtimes: Claude Code, Codex, Cursor, and Grok">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/HahyeonJeon/gobbi" alt="License: MIT"></a>
</p>

Gobbi is an orchestration system that brings structured planning, implementation, review, and durable handoffs
to the AI coding tools you already use. You choose Cowork for user-led work that keeps related requests
together or Workflow for a fully recorded lifecycle. Gobbi never preselects the mode for you.

The name comes from 고삐 (*gobbi*), Korean for "reins."

## Install

### Claude Code

Run these commands in a Claude Code session:

```text
/plugin marketplace add HahyeonJeon/gobbi
/plugin install gobbi@gobbi
/reload-plugins
```

This checkout enables `gobbi@gobbi` in `.claude/settings.json`. It does not keep `.claude/agents`,
`.claude/skills`, or a settings `hooks` object. Claude loads agents, skills, and `hooks/hooks.json` from
`plugins/gobbi`.

Allow the seven Gobbi roles in your project `.claude/settings.json`.
The roles are manager, assistant, leader, developer, designer, author, and reviewer.
Manager owns the user, the mode, and acceptance. Assistant owns lookup and named Memory work.
The other five are phase roles, and the named role must match the assignment phase.
Leader owns Ideation and Planning in every domain, and reviewer owns Review.
Developer, designer, and author own Execution: the developer changes code with no visual surface, the
designer changes work with a visual element, including HTML and web UI, and the author changes docs and skills.

```json
{
  "permissions": {
    "allow": [
      "Skill(gobbi:gobbi)",
      "Skill(gobbi:principles)",
      "Skill(gobbi:discussion)",
      "Skill(gobbi:delegation)",
      "Agent(gobbi:manager)",
      "Agent(gobbi:assistant)",
      "Agent(gobbi:leader)",
      "Agent(gobbi:developer)",
      "Agent(gobbi:designer)",
      "Agent(gobbi:author)",
      "Agent(gobbi:reviewer)"
    ]
  }
}
```

Gobbi reports any additional skill permissions needed by the selected mode. Approve those loads when prompted,
or add their exact `Skill(gobbi:...)` entries to the same allow list.

### Codex

```bash
codex plugin marketplace add HahyeonJeon/gobbi
codex plugin add gobbi@gobbi-workspace
```

Codex needs no Claude Code permission configuration. This checkout loads Codex skills and the reminder
hook from `plugins/gobbi` through `.agents/plugins/marketplace.json`. Role files stay in `.codex/agents`,
because Codex does not load plugin agents. Do not add `.codex/hooks.json`. That file would register a second hook.

### Grok

Use Grok's Marketplace tab to browse and install Gobbi from a configured source. Add this repository in
`~/.grok/config.toml`:

```toml
[[marketplace.sources]]
name = "gobbi"
git = "https://github.com/HahyeonJeon/gobbi.git"
```

Installed Grok 1.0.4 also accepts the same source as GitHub shorthand:

```text
grok plugin marketplace add HahyeonJeon/gobbi
```

Then install Gobbi from the Marketplace tab with trust, or from the command line:

```text
grok plugin install gobbi --trust
```

Do not use Claude `/plugin` as the Grok install path. An enabled, trusted Grok install runs the reminder hook
from the package itself: `.grok-plugin/plugin.json` points Grok at `hooks/grok-hooks.json`, which registers a
`Stop` handler running `hooks/remind.sh` with `grok` as its argument. No copy into `~/.grok/hooks/` is needed.

Prove the hook with `grok inspect --json`: an entry whose `source.type` is `plugin`, whose `source.plugin_name`
is `gobbi`, and whose `target` ends in `hooks/grok-hooks.json`. Grok reports that entry's `event` as
`(plugin)` and does not resolve the inner `Stop` there. Start a new Grok session in the consumer project.

A repository checkout already exposes the package through `.grok/plugins/gobbi` → `../../plugins/gobbi`. Prove
that load with `grok inspect --json`: the `plugins` list contains `name` `gobbi`, `scope` `project`,
`enabled` true, and `path` ending in `.grok/plugins/gobbi`.

Grok participants come from the plugin `runtimes/grok` roles plus official Grok subagents. This checkout
does not keep `.grok/agents`, `.grok/skills`, or `.grok/hooks`.

### Cursor

This checkout keeps `.cursor/agents` because a Cursor plugin load is not proven. Those files are symlinks
to the canonical Cursor contracts. It does not keep `.cursor/skills`, because Grok scans that directory and
would load the same skills beside `plugins/gobbi`. The package contains a Cursor manifest and
`hooks/cursor-hooks.json` for an installed plugin. This checkout does not load that plugin. Start the parent
session as `grok-4.7[effort=high]`. The required binary is `cursor-agent`, never bare `agent`. Official help
names it `agent`.

Cursor participants in this checkout are the `.cursor/agents` roles plus official Cursor subagents.

After install, create missing layout with the matching runtime guide and script under `skills/gobbi/setup/`:
[claude.md](.gobbi/projects/gobbi/skills/gobbi/setup/claude.md),
[codex.md](.gobbi/projects/gobbi/skills/gobbi/setup/codex.md),
[cursor.md](.gobbi/projects/gobbi/skills/gobbi/setup/cursor.md), or
[grok.md](.gobbi/projects/gobbi/skills/gobbi/setup/grok.md). Setup is not a skill. Gobbi entry does not run it.

## Upgrade to 1.3.3

Version 1.3.3 includes new features and removes the old specialist role names. The patch version is a
project decision and an exception to Semantic Versioning. Update existing role calls and Claude `Agent(...)`
permissions using the domain and phase:

| Old role | New role family |
|---|---|
| `developer` | `coding-*` |
| `author` | `authoring-*` |
| `designer` | `design-*` |

Choose `leader` for ideation, `planner` for planning, `executor` for execution, and `reviewer` for review.
For example, implementation formerly assigned to `developer` now uses `coding-executor`.

Rerun the matching runtime setup script linked above. Codex setup adds the new `.codex/agents` role files.
Claude Code and Grok load roles from the updated plugin. Cursor projects using
`.cursor/agents` must update those files from the [Cursor role contracts](plugins/gobbi/runtimes/cursor/).
Setup leaves existing `.claude/settings.json` and old project role files untouched. Update those permissions
and remove obsolete role files after migrating their callers.

## Start your first session

Give Gobbi a concrete objective:

```text
Claude Code: /gobbi prepare the next release
Codex:       $gobbi prepare the next release
Grok:        /gobbi:gobbi prepare the next release
```

This checkout's Grok load is `.grok/plugins/gobbi`, so the entry is `/gobbi:gobbi`. Do not use `/local:gobbi`.
That name belonged to `.grok/skills/gobbi`, which this checkout does not register. Do not invent a `$gobbi`
alias for Grok.

Gobbi presents Cowork and Workflow and waits for your selection. It next asks for a privacy-safe session
slug. It then asks for the session-wide Partner policy: `disabled`, or one or two of `claude-code`, `codex`,
and `grok`.

## Cowork

Cowork is the fast path for implementation work that you direct request by request. Related requests stay in
one topic; a new topic starts only when you ask for one or approve the manager's proposal. It uses the same
Ideation and Planning as Workflow, and runs each only when a request needs it before verified Execution.

Independent review and closure run only when you explicitly request them. One isolated branch and linked
worktree hold the session, keeping your main checkout separate from the ordered local commits.

## Workflow

Workflow is the durable path for work that needs recorded decisions and quality gates. It follows:

```text
Configuration → Ideation → Planning → Execution → Wrap-up
```

Every productive step uses:

```text
DISCUSSION → WORK → RECORD
```

Execution tasks and Wrap-up also run `REVIEW` between WORK and RECORD. Ideation and Planning skip it.

After Configuration, Workflow waits until the user delivers the work. Phase 1 studies the project and
develops the design with the user, available subagents or teammates, and the remaining Partner launch set.
After each Complete phase handoff, Workflow waits at that phase's User Review for Continue or Stop.
Continue is not a new design question. Inside later phases, work stays autonomous until the next User Review.
Recorded evidence can rebuild the active route after a context boundary. Execution and Wrap-up gates must
accept the frozen result before those units advance. Workflow uses one isolated branch and linked worktree
for the full session.

## Partner

Partner is an optional session-wide policy selected after the mode and applicable slug. The policy is
`disabled` or one or two of `{claude-code,codex,grok}`. The launch set is the selected names minus the active
runtime. An empty launch set after that skip is valid and is not rewritten to `disabled`.

With `disabled`, Gobbi makes no external runtime calls. With a named set, Discussion and Review start a
partner run from the launch set when the work calls for one. The manager launches each partner CLI itself as a
background process, with no wrapper agent, and gives it a Delegation brief and the access level the work
needs: read-only, workspace-write, or full-access only when you authorize it. The manager learns when each run
ends, reads its final message and any changed files, and may send a follow-up by resuming the run's session. A
failed launch is recorded as Unavailable evidence, not a partner result.

Cursor remains a supported runtime but is not a partner, because its print mode failed authentication when
measured. The active runtime decides what to accept and remains the session authority.

## Cleansing

Run `/gobbi:cleansing` (Codex: `$cleansing`) when code or docs have grown messy. Gobbi asks how deep (module,
class, function) and how bold (aggressive, moderate, conservative) refactoring, renaming, and removing may go,
maps what each part is for, shows you a simpler target, and changes files only after you approve it. Behavior
stays the same. Only you can start it.

## Socratic Method

Run `/gobbi:socratic-method` (Codex: `$socratic-method`) to understand a subject in depth, physical or
conceptual. Gobbi asks the subject and where to write the result, then two agents work in rounds: one studies
the subject and breaks it into defined components, actions, and relations; the other challenges that
understanding until no real gap is left. The result is one document from a template, with sources, open
questions, and the challenge log. Only you can start it.

## Develop Gobbi

Edit skills and roles in the canonical tree under `.gobbi/projects/gobbi/`, never in `plugins/gobbi/`. Then run
the repository guard from the repository root (Python 3.11 or later):

```text
python3 scripts/guard/guard.py sync    # write the package mirror and the generated Principles blocks
python3 scripts/guard/guard.py check   # report every finding; exit 0 means clean
python3 -m unittest discover -s tests/guard -t .
```

Sync also adapts the mirror to each runtime: for a skill with `disable-model-invocation: true`, it writes the
Codex `agents/openai.yaml` that keeps the skill user-only, so do not add that file to the canonical tree.

The guard's skill checks ship in the Gobbi Skill skill, so any project can run them on its own skills (Python 3.9
or later). By default they check every `.gobbi/projects/*/skills` directory; `--help` lists the options:

```text
python3 .gobbi/projects/gobbi/skills/gobbi-skill/scripts/check_skills.py
python3 -m unittest discover -s tests/skill_checks -t .
```

CI runs the guard and both test suites on every push, the skill checks on Python 3.9 and 3.13. To run the guard
before each commit, enable the hook once per clone with `git config core.hooksPath .githooks`.

## License

[MIT](./LICENSE)
