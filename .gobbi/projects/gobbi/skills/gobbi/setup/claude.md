# Claude Code setup

Set up Gobbi in a Claude Code consumer project. Gobbi entry does not run setup. These files are guides, not a
skill.

## Install the plugin

In a Claude Code session:

```text
/plugin marketplace add HahyeonJeon/gobbi
/plugin install gobbi@gobbi
/reload-plugins
```

Allow the seven Gobbi roles in project `.claude/settings.json`.
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
or add their exact `Skill(gobbi:...)` entries to the same allow list, such as `Skill(gobbi:cowork)` or
`Skill(gobbi:workflow)`. Do not add a setup skill permission. Setup is not a skill.

## Project layout

Every runtime uses this layout. The project key is the repository directory name, as Gobbi entry derives it.

```text
.gobbi/                          tracked
├── .gitignore                   tracked
└── projects/<project>/          tracked
    ├── agents/                  tracked, 0-byte README.md
    ├── skills/                  tracked, 0-byte README.md
    ├── memory/                  tracked
    │   ├── design/
    │   │   ├── README.md         tracked, 0-byte
    │   │   ├── architecture/
    │   │   ├── feature/
    │   │   ├── process/
    │   │   └── roadmap/
    │   ├── learnings/
    │   ├── reports/
    │   │   ├── README.md         tracked, 0-byte
    │   │   ├── note/
    │   │   ├── review/
    │   │   └── analysis/
    │   ├── history/README.md     tracked, 0-byte
    │   ├── materials/
    │   │   ├── README.md         tracked, 0-byte
    │   │   ├── references/
    │   │   ├── assets/
    │   │   ├── docs/
    │   │   └── data/
    │   └── backlogs/README.md    tracked, 0-byte
    ├── sessions/                ignored, created by the session modes
    └── worktrees/               ignored, created by the session modes
```

`.gobbi/.gitignore` holds these runtime-state entries:

```text
# Gobbi runtime state. Session evidence and linked worktrees are never tracked.
projects/*/sessions/
projects/*/worktrees/
```

Create no `sessions/`, `worktrees/`, marker, or `rules/` path; the session modes create what they need.

## Create the project layout by hand

The setup scripts are removed and planned to return in a later release, so create the layout yourself. From
the consumer worktree, in a shell, run:

```bash
project=$(basename "$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")")
root=.gobbi/projects/$project
mkdir -p "$root"/agents "$root"/skills "$root"/memory/{design/{architecture,feature,process,roadmap},learnings}
mkdir -p "$root"/memory/{reports/{note,review,analysis},history,backlogs,materials/{references,assets,docs,data}}
for d in agents skills memory/design memory/reports memory/history memory/materials memory/backlogs; do
  touch "$root/$d/README.md"
done
[ -e .gobbi/.gitignore ] || printf '%s\n' \
  '# Gobbi runtime state. Session evidence and linked worktrees are never tracked.' \
  'projects/*/sessions/' 'projects/*/worktrees/' > .gobbi/.gitignore
```

Re-running it is safe: `mkdir -p` and `touch` change nothing that exists, and the `.gobbi/.gitignore` line
writes only when that file is absent. The project key must be at most 64 lowercase letters, digits, and inner
hyphens. Set `project` by hand when the directory name does not fit. Commit `.gobbi/` before you start a
session. Git does not track empty directories, so `learnings/` and the leaf subject directories reappear
after a clone only once a file lands in them.

If `.claude/settings.json` is absent, create it with the allow list above. Never overwrite an existing
settings file, `CLAUDE.md`, or role contract. Do not create `.claude/agents` or `.claude/skills`; the plugin
supplies them.

## After setup

- This checkout enables `gobbi@gobbi` and does not keep a settings `hooks` object, `.claude/agents`, or
  `.claude/skills`. Claude loads agents and skills from `plugins/gobbi`. The package has no hooks in this
  release.
- Role contracts come from the plugin's flat `agents/`.
- If the existing `.claude/settings.json` is missing a permission, add the exact `Agent(gobbi:...)` or
  `Skill(gobbi:...)` entry by hand.

## Setup scripts and settings check

The per-runtime setup scripts and the SessionStart settings check are not in this release. Both are planned to
return in a later release. Until then, no hook checks your settings, and the manual steps above replace the
scripts.

Other runtimes: [Codex](codex.md), [Cursor](cursor.md), [Grok](grok.md).
