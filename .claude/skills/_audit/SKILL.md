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

Skills, agents, gotchas, rules, and CLAUDE.md are living documentation that agents actively follow. Project notes (`.claude/project/` note directories) are historical records of past sessions — they describe what happened at a point in time and are not expected to stay current. Audit the former, skip the latter.

---

## What to Audit

**File path references** — Backtick-quoted paths and markdown links in `.md` files. Check whether the referenced file or directory actually exists on disk. Catches: renamed files, moved directories, deleted scripts.

**Structural claims** — Statements about where things live ("skills are in `.claude/skills/`", "agents are defined in `.claude/agents/`"). Check whether the described directories exist and contain what is claimed. Catches: reorganized directory structures, outdated architecture descriptions.

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
- `.claude/project/` note directories — historical records, not living docs
- Content quality assessment — that is __validate's domain
- External URLs — network-dependent, separate concern

---

## Tools

Three scripts in `scripts/` automate the verifiable checks:

| Script | Purpose |
|--------|---------|
| `audit-references.sh` | Scan `.md` files for file path references, check if each exists on disk |
| `audit-conventions.sh` | Scan SKILL.md files for directory structure claims, check if described structures exist |
| `audit-commands.sh` | Scan `.md` files for shell commands in fenced code blocks, check if referenced binaries exist |

All scripts accept a directory path as an argument. Run from the repository root. Exit 0 means clean, exit 1 means findings. Output uses `file:line` format for each finding.
