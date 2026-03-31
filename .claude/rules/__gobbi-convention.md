# Gobbi Naming Convention

Skills and agents use hyphen-separated naming with three visibility tiers. The tier prefix determines whether a skill or agent is user-facing, system-internal, or deep implementation.

---

## Tiers

**Interface** (no prefix) — User-invokable slash commands. Users type these directly.

Only `gobbi` is an interface skill. It is invoked as `/gobbi`.

**Hidden** (single `_` prefix) — Skills and agents used by the system during workflow. The orchestrator and agents load these as needed. Users never invoke them directly.

Skill examples: `_orchestration`, `_discuss`, `_plan`, `_evaluation`, `_git`, `_claude`, `_claude-skills`, `_claude-agents`

Agent examples: `_developer`, `_pi`, `_planner`

**Internal** (double `__` prefix) — Deep implementation details: evaluation plumbing, stage-specific criteria, development tooling. Relevant only to gobbi contributors.

Skill examples: `__evaluation-project`, `__evaluation-architecture`, `__validate`, `__benchmark`

Agent examples: `__evaluator-project`, `__evaluator-overall`, `__skills-grader`

---

## Naming Rules

- Use hyphens `-` as word separators in multi-word names
- Single-word names are unaffected: `_plan`, `_git`, `_gotcha`, `_note`, `_audit`, `_claude`
- Visibility tier prefixes (`_`, `__`) are not word separators — they are prefix tokens
- No `gobbi-` prefix — the tier prefix is the only prefix
- The interface entry point is named `gobbi` (no prefix, no hyphen)
- Skill directory names and agent filenames follow the same convention
- The tier prefix is part of the name, not decoration — omitting it changes the visibility tier

---

## Formatting Rules

- Use backtick formatting (inline code) for specific file or directory paths — e.g., `.claude/project/{project-name}/`
- Use backtick formatting for environment variable names — e.g., `SLACK_BOT_TOKEN`
- Use backtick formatting for command names — e.g., `gh`, `git`, `jq`
- Blockquotes (`>`) hold only the bold principle point — description goes on a separate non-quoted line below

---

## Categories

Categories organize skills into functional groupings. They are documentary and do not affect naming.

**Work** — Workflow participant skills that the orchestrator and agents load during task execution.

Examples: `_orchestration`, `_discuss`, `_ideation`, `_plan`, `_delegation`, `_execution`, `_collection`, `_note`, `_evaluation`, `_git`, `_notification`, `_gotcha`

**Docs** — Skills for authoring and maintaining `.claude/` documentation.

Examples: `_claude`, `_claude-skills`, `_claude-agents`, `_claude-rules`, `_claude-project`

**Gobbi** — Internal implementation skills for the gobbi tool itself.

Examples: `__evaluation-project`, `__evaluation-architecture`

**Tool** — Utility and maintenance tooling for gobbi contributors.

Examples: `__validate`, `_audit`, `__benchmark`

Some Work skills (Evaluation, Git, Notification, Gotcha) have child categories grouping related sub-skills. Child categories follow the same naming rules and do not introduce additional prefix tiers.

---

## Verification

An agent or linter can verify compliance by checking:

1. All skill directory names under `.claude/skills/` match `^gobbi$|^_[a-z]|^__[a-z]`
2. All agent filenames under `.claude/agents/` match `^_[a-z]|^__[a-z]`
3. After stripping the leading `_` or `__` prefix, no remaining underscores — underscores in the body of a name indicate a violation
4. Hyphens are the word separator for all multi-word names
