# Gobbi skills refactor

**Completed at:** 2026-11-12T12:30:00Z

## Changes

- Removed the Ontology data-model skill and Recursive Exploration. Added a six-field Ontology preference skill
  and Principle 8, Build from clear definitions, and removed the Memory `ontology/` home.
- Roles are now seven, classified by phase and subject: manager, assistant, leader, developer, designer, author,
  and reviewer. The twelve domain phase roles and the planner are removed; leader owns Ideation and Planning.
- Removed every script and hook for reimplementation. Added `scripts/guard/` (check, sync, list) with a
  pre-commit hook and CI, and shipped the project-independent skill checker with the plugin.
- Partner became a background CLI manual for Codex, Claude Code, and Grok that a user can also invoke; Cursor is
  no longer a partner. Delegation became a general briefing skill (Goal and Return required).
- Git reduced to project conventions. Cowork and Workflow dropped the native TODO list; Cowork keeps related
  requests in one topic and has no Fast and Light depths.
- Planning splits work into goal-based tasks with a Task Graph, one plan per major goal.
- One shared Review skill with short Coding, Authoring, and Design bars replaced the per-domain review
  procedures, `review-depth`, and the Checklist skill. Added the lesson loop (Gobbi Step 2.6, `Seen`, Review
  Step 3.2, Closure removal) and check outcomes passed, failed, and inconclusive.
- Added the user-only Cleansing skill (code, design, and docs children) and the user-only Socratic Method skill.
- Skills and agents were rewritten as goals, with plain Rule leads instead of ALL-CAPS slogans, and Principle 4
  now says to recommend the best option even against the request.
- Nothing is merged into `develop`; setup guides and README install steps that name the removed scripts and
  hooks are out of date until reimplementation.

Work account: [Gobbi skills refactor](../reports/note/2026-11-12-gobbi-skills-refactor.md).
