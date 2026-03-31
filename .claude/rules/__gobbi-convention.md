# Gobbi Naming Convention

Skills and agents use hyphen-separated naming with three visibility tiers. The tier prefix determines whether a skill or agent is user-facing, system-internal, or deep implementation.

---

## Tiers

**Interface** (no prefix) — User-invokable slash commands. Users type these directly.

Only `gobbi` is an interface skill. It is invoked as `/gobbi`.

`gobbi-agent` is an interface agent. It is distributed via the plugin.

**Hidden** (single `_` prefix) — Skills and agents used by the system during workflow. The orchestrator and agents load these as needed. Users never invoke them directly.

Skill examples: `_orchestration`, `_discuss`, `_plan`, `_evaluation`, `_skills-evaluation-project`, `_skills-evaluation-user`, `_agent-evaluation-project`, `_project-evaluation-project`, `_git`, `_claude`, `_skills`, `_agents`

**Internal** (double `__` prefix) — Deep implementation details: development tooling. Relevant only to gobbi contributors.

Skill examples: `__validate`, `__benchmark`

Agent examples: `__executor`, `__pi`

---

## Naming Rules

- Use hyphens `-` as word separators in multi-word names
- Single-word names are unaffected: `_plan`, `_git`, `_gotcha`, `_note`, `_audit`, `_claude`
- Visibility tier prefixes (`_`, `__`) are not word separators — they are prefix tokens
- No `gobbi-` prefix for internal names — exception: `gobbi-agent` and other plugin-distributed user-facing agents use `gobbi-` for external identity
- The interface entry point is named `gobbi` (no prefix, no hyphen)
- Skill directory names and agent filenames follow the same convention
- The tier prefix is part of the name, not decoration — omitting it changes the visibility tier

---

## Formatting Rules

- Use backtick formatting (inline code) for specific file or directory paths — e.g., `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/`
- Use backtick formatting for environment variable names — e.g., `SLACK_BOT_TOKEN`
- Use backtick formatting for command names — e.g., `gh`, `git`, `jq`
- Blockquotes (`>`) hold only the bold principle point — description goes on a separate non-quoted line below

---

## Categories

Categories organize skills into functional groupings. They are documentary and do not affect naming.

Interface tier items (`gobbi` skill and `gobbi-agent` agent) are not assigned to a category. They are invoked directly by users rather than loaded by the system, so they do not participate in any workflow category.

**Work** — Workflow participant skills that the orchestrator and agents load during task execution.

Examples: `_orchestration`, `_discuss`, `_ideation`, `_plan`, `_delegation`, `_execution`, `_collection`, `_note`, `_skills-evaluation-*`, `_agent-evaluation-*`, `_project-evaluation-*`, `_git`, `_notification`, `_gotcha`

**Docs** — Skills for authoring and maintaining `.claude/` documentation.

Examples: `_claude`, `_skills`, `_agents`, `_rules`, `_project`

**Tool** — Utility and maintenance tooling for gobbi contributors.

Examples: `__validate`, `_audit`, `__benchmark`

Some Work skills (Evaluation, Git, Notification, Gotcha) have child categories grouping related sub-skills. Child categories follow the same naming rules and do not introduce additional prefix tiers.

---

## Verification

An agent or linter can verify compliance by checking:

1. All skill directory names under `.claude/skills/` match `^gobbi$|^_[a-z]|^__[a-z]`
2. All agent filenames under `.claude/agents/` match `^gobbi-[a-z]|^_[a-z]|^__[a-z]`
3. After stripping the leading `_` or `__` prefix, no remaining underscores — underscores in the body of a name indicate a violation
4. Hyphens are the word separator for all multi-word names
