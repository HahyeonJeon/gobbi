# Gobbi Naming Convention

Skills and agents use Python-style underscore naming with three visibility tiers. The tier prefix determines whether a skill or agent is user-facing, system-internal, or deep implementation.

---

## Tiers

**Interface** (no prefix) — User-invokable slash commands. Users type these directly.

Only `gobbi` is an interface skill. It is invoked as `/gobbi`.

**Hidden** (single `_` prefix) — Skills and agents used by the system during workflow. The orchestrator and agents load these as needed. Users never invoke them directly.

Skill examples: `_orchestration`, `_discuss`, `_plan`, `_evaluation`, `_git`, `_claude`

Agent examples: `_developer`, `_pi`, `_planner`

**Internal** (double `__` prefix) — Deep implementation details: evaluation plumbing, stage-specific criteria, development tooling. Relevant only to gobbi contributors.

Skill examples: `__evaluation_project`, `__evaluation_architecture`, `__ideation_evaluation`, `__validate`, `__benchmark`

Agent examples: `__evaluator_project`, `__evaluator_overall`, `__skills_grader`

---

## Naming Rules

- Use underscores `_` as word separators, not hyphens `-`
- No `gobbi-` prefix — the tier prefix is the only prefix
- Exception: the interface entry point is named `gobbi` (no prefix, no hyphen)
- Skill directory names and agent filenames follow the same convention
- The tier prefix is part of the name, not decoration — omitting it changes the visibility tier

---

## Verification

An agent or linter can verify compliance by checking:

1. All skill directory names under `.claude/skills/` match `^gobbi$|^_[a-z]|^__[a-z]`
2. All agent filenames under `.claude/agents/` match `^_[a-z]|^__[a-z]`
3. No hyphens in any skill or agent name (after stripping the leading underscores)
4. No `gobbi-` prefix on any skill or agent other than the interface entry point
