---
name: _project
description: Guide for authoring project documentation in .claude/project/{project-name}/. Covers directory structure, README.md, design docs, and notes.
---

# Claude Project Documentation

Guide for authoring project-specific documentation in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/`. Project docs capture accumulated context — architecture decisions, conventions, technology choices, gotchas — that help agents work effectively on returning sessions. Load this skill when creating, reviewing, or organizing project documentation.

Load `_claude` for the general documentation writing standard before authoring project docs.

---

## Core Principle

> **Project docs live in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/`.**

Each project gets its own directory under `$CLAUDE_PROJECT_DIR/.claude/project/`. All project-specific documentation lives inside that directory — design decisions, architecture, rules, gotchas, notes, references. Co-location makes everything about a project navigable from a single entry point.

> **Project docs decay fast — currency matters more than completeness.**

Project docs describe a moving target. A stale doc is worse than no doc — it actively misleads agents into wrong assumptions. Scan for staleness whenever touching related code and docs. Delete superseded content rather than leaving it to accumulate.

> **Every directory has a README.md as entry point.**

The README summarizes what the directory is about and lists its contents with one-line descriptions. Agents read the README first to decide which docs to load. Without a README, agents cannot navigate efficiently.

---

## Directory Structure

All projects must follow this structure:

```
.claude/project/{project-name}/
  README.md             — project overview and directory index
  design/               — project design and architecture
  rules/                — project-specific rules and conventions
  gotchas/              — project-specific gotchas (not cross-project)
  note/                 — workflow notes per task (managed by _note)
  reference/            — external references, API docs, research
  docs/                 — other project documents
```

Not every project needs every subdirectory. Create only the directories that have content.

**README.md** — Project overview and index. Must list: project name and purpose (one sentence), links to each subdirectory with one-line descriptions, and current status or active work if any.

**design/** — Project design decisions and architecture. How the system is designed, why decisions were made, and what trade-offs were accepted.

**rules/** — Project-specific rules and conventions. Standards that apply only to this project — coding patterns, naming conventions, deployment rules. Separate from cross-project rules in `.claude/rules/`.

**gotchas/** — Project-specific gotchas, categorized by domain. Mistakes and corrections that apply only to this project. Separate from cross-project gotchas in `_gotcha/`.

**note/** — Workflow notes per task, managed by `_note`. Each task gets a directory named `{YYYYMMDD}-{HHMM}-{slug}-{session_id}`.

**reference/** — External references — API docs, research findings, third-party documentation, links to external systems.

**docs/** — Other project documents that do not fit the above categories.

---

## Writing Pattern

**Self-contained.** Each doc makes sense on its own without reading others. First lines tell the agent what it covers and when to read it — without requiring context from sibling docs.

**Archive, don't hoard.** Delete superseded docs. Do not accumulate stale content from prior sessions or completed features.

**Focused scope.** Split by topic, not by length. If a doc covers multiple unrelated systems, split it. Each doc covers one coherent subject.

---

## Anti-Patterns

### Must Avoid

**Stale docs left in place.** References deleted files or describes "planned" features already built. Agents make wrong assumptions from stale content. Delete or update before leaving a session.

**Inconsistent directory structure.** Missing README.md or standard subdirectories breaks agent navigation. Agents rely on the consistent structure to decide what to read.

**Project gotchas in _gotcha.** Project-specific gotchas must go in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/gotchas/`, not in the cross-project gotcha skill. Mixing them pollutes the cross-project knowledge base with project-specific content.

### Should Avoid

**Duplicate docs for the same topic.** Created without checking existing docs. Search before creating — a duplicate creates two sources of truth that diverge.

**No cleanup strategy.** Everything accumulates without active deletion. Set an expectation that outdated docs get removed, not archived.

---

## Review Checklist

Before publishing a project doc:

**Core Principle**
- [ ] Lives inside `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/`
- [ ] Contains project-specific context, not general domain knowledge
- [ ] Content is current — no references to deleted files or outdated architecture
- [ ] Directory has README.md as entry point

**Writing Pattern**
- [ ] Self-contained — makes sense without reading other docs
- [ ] Organized by topic with clear first-line summary
- [ ] Focused on one coherent system or topic

**Anti-Pattern**
- [ ] No stale references to removed code or outdated architecture (must avoid)
- [ ] No duplicate covering same topic as existing doc (should avoid)
