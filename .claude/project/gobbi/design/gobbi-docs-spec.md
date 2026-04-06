# gobbi-docs JSON Specification v0.3.2

JSON source-of-truth format for all `.claude/` documentation in gobbi. Markdown files are generated artifacts produced by `json2md`. This spec defines the complete schema, block types, rendering rules, and authoritative file inventory.

---

## Overview

Every `.md` file under `.claude/` (except `CLAUDE.md`, `project/`, and `worktrees/`) has a corresponding `.json` source file. The JSON captures all semantic content with enough structure that `json2md` can produce byte-identical Markdown and `md2json` can round-trip without information loss.

---

## Common Base Schema

```
{
  "$schema": "gobbi-docs/<type>",
  "frontmatter": { ... },
  "navigation": { ... },
  "title": "...",
  "opening": "...",
  "sections": [ ... ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `$schema` | string | Yes | One of: `gobbi-docs/skill`, `gobbi-docs/agent`, `gobbi-docs/rule`, `gobbi-docs/root`, `gobbi-docs/child`, `gobbi-docs/gotcha` |
| `frontmatter` | object | Conditional | Required for `skill`, `agent`. Optional for `rule`. Absent for `root`, `child`, `gotcha`. |
| `navigation` | object | No | Keys are relative filenames, values are description strings. |
| `title` | string | Yes | H1 heading text (without `#`). |
| `opening` | string | No | First paragraph(s) after H1, before any H2 or `---`. May contain inline markdown including blockquotes. |
| `sections` | array | No | Ordered array of section objects. Each maps to an H2 heading with content. |

### Rendering Rules — Base

1. If `frontmatter` exists and non-empty, render as YAML between `---` markers at file top.
2. Render `title` as `# {title}` preceded by blank line after frontmatter.
3. If `opening` exists, render as paragraph(s) after title.
4. If `navigation` exists, render as `**Navigate deeper from here:**` followed by Markdown table with `| Document | Covers |` headers.
5. Render `---` between opening/navigation area and first section.
6. Render each section as `## {heading}` followed by content blocks, separated by `---`.

---

## Doc Type Schemas

### `skill` — SKILL.md files

**Path:** `.claude/skills/{skill-name}/SKILL.md`

| Frontmatter Field | Type | Required | Description |
|-------------------|------|----------|-------------|
| `name` | string | Yes | Must match directory name. |
| `description` | string | Yes | Single line. Command tone. |
| `allowed-tools` | string | No | Comma-separated tool list. Some skills omit this (`_project`, `_rules`). |

### `agent` — Agent definitions

**Path:** `.claude/agents/{agent-name}.md`

| Frontmatter Field | Type | Required |
|-------------------|------|----------|
| `name` | string | Yes |
| `description` | string | Yes |
| `tools` | string | Yes |
| `model` | string | Yes |

### `rule` — Rule files

**Path:** `.claude/rules/{rule-name}.md`

No frontmatter in current codebase. `frontmatter` field omitted from JSON.

### `root` — README.md

**Path:** `.claude/README.md`

No frontmatter. Blockquoted content after title is part of `opening`.

### `child` — Child documents

**Path:** `.claude/skills/{skill-name}/{child-name}.md`

No frontmatter. Additional field:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `parent` | string | Yes | Skill name this child belongs to. |

Subtypes: workflow phase docs, convention docs, setup guides, teaching docs, guidance docs, benchmark scenarios.

### `gotcha` — Gotcha files with entry structure

**Path:** `.claude/skills/{skill-name}/gotchas.md` or `.claude/skills/_gotcha/{topic}.md`

No frontmatter. **Replaces `sections` with `entries`.**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `parent` | string | Yes | Skill this gotcha belongs to. |
| `entries` | array | Yes | Ordered array of gotcha entry objects. |

**Entry object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Renders as `### {title}`. |
| `metadata` | object/null | No | Optional YAML frontmatter (priority, tech-stack, enforcement, pattern, event). |
| `body` | object | Yes | Fields: priority, what-happened, user-feedback, correct-approach. |

**Entry rendering:** `---` separator before each entry, `### {title}`, optional YAML metadata between `---` markers, body fields as bold-labeled paragraphs.

---

## Block Types

### `text`

```json
{ "type": "text", "value": "Plain markdown text." }
```

Render as paragraph. May contain `\n\n` for multi-paragraph.

### `principle`

```json
{ "type": "principle", "statement": "Bold statement.", "body": "Explanation." }
```

Renders as: `> **{statement}**\n\n{body}`. Body is optional.

### `table`

```json
{ "type": "table", "headers": ["Col1", "Col2"], "rows": [["a", "b"]] }
```

Standard Markdown pipe table.

### `constraint-list`

```json
{ "type": "constraint-list", "items": ["Never...", "Always..."] }
```

Renders as `- {item}` per line.

### `list`

```json
{ "type": "list", "style": "bullet", "items": ["Item 1", "Item 2"] }
```

`style`: `"bullet"` or `"numbered"`. Renders as `- ` or `N. `.

### `subsection`

```json
{ "type": "subsection", "heading": "Step 1", "content": [...] }
```

Renders as `### {heading}` followed by content blocks.

---

## Edge Cases

- **Headingless sections:** `"heading": null` — content between `---` separators with no H2.
- **`allowed-tools` optional** for skills (`_project`, `_rules` omit it).
- **Cross-cutting gotcha files** (`__system.md`, `__security.md`) are `gotcha` type.
- **Guidance docs** (`project-gotcha.md`, `skills-gotcha.md`) are `child` type (teach how to write gotchas, don't contain entries).

---

## Authoritative File Inventory

**Total: 83 files**

Excluded: `CLAUDE.md`, `project/`, `worktrees/`

| Batch | Description | Count | Files |
|-------|-------------|-------|-------|
| A | Agent definitions | 6 | `gobbi-agent.md`, `_skills-evaluator.md`, `_agent-evaluator.md`, `_project-evaluator.md`, `__executor.md`, `__pi.md` |
| B | Root + rule | 2 | `README.md`, `__gobbi-convention.md` |
| C | Notification cluster | 9 | gobbi (SKILL + 3 children), _notification (SKILL + gotchas), _slack, _telegram, _discord |
| D | Docs cluster | 13 | _claude (SKILL + transcripts + gotchas), _skills (SKILL + authoring + verification + evaluation), _agents (SKILL + evaluation), _rules (SKILL + evaluation), _project (SKILL + evaluation) |
| E | Orchestration cluster | 10 | _orchestration (SKILL + feedback + finish + gotchas), _plan (SKILL + gotchas), _delegation (SKILL + gotchas), _execution (SKILL + gotchas) |
| F | Work skills | 17 | _discuss, _ideation, _ideation-eval, _plan-eval, _evaluation (SKILL + evaluation), _collection (SKILL + gotchas), _memorization, _note (SKILL + gotchas), _gotcha (SKILL + project-gotcha + skills-gotcha + __system + __security + evaluation) |
| G | Tool skills | 4 | _git (SKILL + conventions + gotchas), _doctor |
| H | Skills evaluation | 6 | _skills-evaluation-{project,architecture,performance,aesthetics,overall,user} |
| I | Agent evaluation | 6 | _agent-evaluation-{project,architecture,performance,aesthetics,overall,user} |
| J | Project evaluation | 6 | _project-evaluation-{project,architecture,performance,aesthetics,overall,user} |
| K | Stance skills | 4 | _innovation (SKILL + evaluation), _best-practice (SKILL + evaluation) |

### Type Distribution

| Type | Count |
|------|-------|
| skill | 42 |
| child | 21 |
| gotcha | 12 |
| agent | 6 |
| rule | 1 |
| root | 1 |
| **Total** | **83** |
