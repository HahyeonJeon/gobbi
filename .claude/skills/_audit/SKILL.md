---
name: _audit
description: Detect documentation drift in .claude/ files. Use periodically, after major codebase changes, or before releases to find stale references and structural mismatches.
allowed-tools: Read, Grep, Glob, Bash
---

# Audit

Detect documentation drift in `.claude/` files — stale file references, broken links, and structural claims that no longer match reality. Documentation drifts silently: a renamed file, a moved directory, a reorganized structure. The docs still read well, but point agents to things that no longer exist.

---

## Core Principle

> **Docs that reference nonexistent files are worse than no docs.**

A stale reference sends agents on a hunt for something that does not exist, wasting context and producing confused output. Regular auditing catches these before agents encounter them.

> **Audit what is verifiable. Skip what is subjective.**

Auditing checks concrete, machine-verifiable claims: does this file exist? Does this directory exist? It does NOT assess content quality, writing style, or whether a doc's advice is good. Content quality is a human judgment, not an audit finding.

> **Audit living docs, not historical records.**

Skills, agents, gotchas, rules, and CLAUDE.md are living documentation that agents actively follow. Project notes (`$CLAUDE_PROJECT_DIR/.claude/project/` note directories) are historical records of past sessions — they describe what happened at a point in time and are not expected to stay current. Audit the former, skip the latter.

---

## What to Audit

**File path references** — Backtick-quoted paths and markdown links in `.md` files. Check whether the referenced file or directory actually exists on disk. Catches: renamed files, moved directories, deleted scripts.

**Structural claims** — Statements about where things live ("skills are in `.claude/skills/`", "agents are defined in `.claude/agents/`"). Check whether the described directories exist and contain what is claimed. Catches: reorganized directory structures, outdated architecture descriptions.

---

## Evaluation Criteria as Audit Source

Gobbi's Docs-category skills (`_skills`, `_agents`, `_rules`, `_project`) each have an `evaluation.md` child doc containing a Verification Checklist. Each checklist item is tagged with one of two labels:

- `[structural]` — machine-verifiable. Can be checked by reading the filesystem: file exists, field present, pattern matches, line count under budget. These are `_audit`'s domain.
- `[semantic]` — requires agent judgment. Assessing whether content is project-specific, whether principles teach mental models, whether descriptions trigger accurately. These belong to evaluator agents during the evaluation workflow and are outside `_audit`'s scope.

When auditing user-created documentation, `_audit` loads the relevant evaluation.md from the corresponding gobbi skill and checks the `[structural]` items against the user's files:

| User docs location | Evaluation criteria source |
|---|---|
| `$CLAUDE_PROJECT_DIR/.claude/skills/` | `_skills/evaluation.md` (default, see disambiguation below) |
| `$CLAUDE_PROJECT_DIR/.claude/agents/` | `_agents/evaluation.md` |
| `$CLAUDE_PROJECT_DIR/.claude/rules/` | `_rules/evaluation.md` |
| `$CLAUDE_PROJECT_DIR/.claude/project/` | `_project/evaluation.md` |
| `$CLAUDE_PROJECT_DIR/.claude/project/{project}/gotchas/` | `_gotcha/evaluation.md` |
| `$CLAUDE_PROJECT_DIR/.claude/skills/{skill}/gotchas.md` | `_gotcha/evaluation.md` |

This is not a scope expansion. The `[structural]` items describe exactly the kind of checks `_audit` already performs — file existence, field presence, pattern matching, structural layout. The evaluation.md files provide a standardized, per-doc-type checklist rather than relying on `_audit`'s own heuristics for each doc type.

### Doc-Type Disambiguation for Skills

Several specialized doc types live under `$CLAUDE_PROJECT_DIR/.claude/skills/` but need their own evaluation.md rather than the generic `_skills/evaluation.md`. When auditing a skill directory, `_audit` checks for these patterns before falling back to `_skills/evaluation.md`:

- **Evaluation perspectives** — if the skill's directory name matches `_*-evaluation-*` (e.g., `_api-evaluation-security`), use `_evaluation/evaluation.md`
- **Innovation stance skills** — if the skill's SKILL.md description or content indicates an innovation stance, use `_innovation/evaluation.md`
- **Best-practice stance skills** — if the skill's SKILL.md description or content indicates a best-practice stance, use `_best-practice/evaluation.md`
- **All other skills** — use `_skills/evaluation.md`

This is an open design area. Doc-type detection is heuristic, not mechanical — name patterns are reliable for evaluation perspectives, but stance detection depends on content inspection. `_audit` should flag ambiguous cases rather than silently applying the wrong checklist.

---

## When to Audit

- **Periodically** — as part of routine maintenance
- **After major restructuring** — file moves, directory reorganizations, renames
- **Before releases** — verify all docs point to real things
- **After skill or agent creation** — confirm new references are valid and navigation tables are updated

---

## Scope

**In scope:**

- All `.md` files in `.claude/` root (CLAUDE.md, rules)
- Skill definitions (SKILL.md and child docs)
- Agent definitions
- Gotcha files
- Any scripts referenced from skill docs

**Out of scope:**

- `$CLAUDE_PROJECT_DIR/.claude/project/` note directories — historical records, not living docs
- Content quality assessment — that is __validate's domain
- External URLs — network-dependent, separate concern

---

## Tools

Three CLI commands automate the verifiable checks:

| Command | Purpose |
|---|---|
| `gobbi audit references` | Scan `.md` files for file path references, check if each exists on disk |
| `gobbi audit conventions` | Scan SKILL.md files for directory structure claims, check if described structures exist |
| `gobbi audit commands` | Scan `.md` files for shell commands in fenced code blocks, check if referenced binaries exist |

All commands accept a directory path as an argument. Run from the repository root. Exit 0 means clean, exit 1 means findings. Output uses `file:line` format for each finding.
