---
name: __validate
description: Validate gobbi agent definitions, skill files, gotcha entries, and JSON doc templates for structural correctness. Use after creating or modifying agents, skills, gotchas, or docs.
allowed-tools: Read, Bash, Glob
---

# Validate

Validation catches structural problems before they cause runtime failures or agent confusion. A malformed agent definition silently degrades the orchestrator's routing. A skill with anti-patterns teaches agents to mimic instead of think. A gotcha with missing sections fails to prevent repeated mistakes.

---

## Core Principle

> **Validate structure, not content. Structure is machine-checkable; content quality requires judgment.**

These tools check that files follow the structural contracts their consumers depend on — frontmatter fields, naming conventions, section markers, line budgets. They do not assess whether the content is well-written, accurate, or useful. Content quality is the evaluator's job.

> **Validate after creation and after modification. Not before, not continuously.**

Run validation when you finish creating or modifying an agent, skill, or gotcha file. Validation is a verification step in the execution lifecycle, not a gate before writing.

> **False positives erode trust. Prefer missing a violation over flagging correct content.**

A validation tool that cries wolf gets ignored. Each check should have a clear structural signal. When a heuristic is uncertain, warn instead of fail.

---

## Tools

Two categories of validation tools exist: bash scripts for Markdown-based files and the `gobbi docs validate` CLI command for JSON templates.

**Bash scripts** live in `scripts/` and are invoked directly. Each takes a file path as its only argument, reports results to stdout/stderr, and exits 0 on pass or 1 on failure.

| Script | Validates | Use when |
|--------|-----------|----------|
| `validate-agent.sh` | Agent definition `.md` files | After creating or modifying an agent in `agents/` |
| `validate-skill.sh` | Skill `SKILL.md` files | After creating or modifying a skill's SKILL.md |
| `lint-skill.sh` | Any `.md` skill file for anti-patterns | After writing any `.claude/` documentation |
| `validate-gotcha.sh` | Gotcha `.md` files | After recording a new gotcha entry |

Run from the repository root or provide absolute paths. Scripts are self-contained with no external dependencies beyond standard bash utilities.

**CLI command** for JSON-first doc templates (v0.3.2+):

| Command | Validates | Use when |
|---------|-----------|----------|
| `gobbi docs validate <path>` | JSON doc templates against the gobbi-docs schema | After creating or modifying any `.json` template in `.claude/` |

Can validate individual files or be run across all docs. Reports schema errors, missing required fields, invalid block types, and Markdown sync status.

---

## What Each Tool Checks

**validate-agent.sh** verifies the structural contract that the orchestrator depends on: YAML frontmatter with required fields, name format conventions, trigger language in the description, valid model values, and sufficient system prompt content.

**validate-skill.sh** verifies the structural contract that skill loading depends on: YAML frontmatter with required fields, line budget compliance, and navigation structure when child documents exist.

**lint-skill.sh** detects _claude anti-patterns that cause agents to mimic instead of think: code examples, BAD/GOOD comparison blocks, step-by-step recipes, and interface definitions. Uses heuristics to distinguish illustrative directory trees (acceptable) from code examples (not acceptable).

**validate-gotcha.sh** verifies the entry structure that makes gotchas useful: required sections (title, priority, what happened, user feedback, correct approach) and valid priority values.

**gobbi docs validate** validates JSON doc templates against the gobbi-docs schema. Checks that `$schema` is a recognized doc type, required fields exist per type (frontmatter for skills and agents, parent for child and gotcha types), content blocks have valid types with required sub-fields, and gotcha entries have complete body structures. When a corresponding `.md` file exists alongside the `.json`, compares the rendered output against it and reports sync status (in-sync, out-of-sync, or no `.md` file found).

---

## Constraints

- Scripts are tools, not documentation — they check structure, not content quality
- Exit codes are the API: 0 means pass, 1 means failure, warnings go to stderr
- Heuristic checks (like code block detection) warn rather than fail when uncertain
- Scripts must not modify files — read-only validation only
