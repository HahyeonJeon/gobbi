---
name: learnings
description: MUST load after the memory operation identifies content as learning memory. Learnings is a preference skill for what learning memory contains and how it is structured.
allowed-tools: Read, Grep, Glob
skill-type: preference
user-invocable: false
---

# Learning Memory

This internal category skill guides learning-memory judgment after the parent memory operation identifies
content as learning memory. It owns the content and structure of `memory/learnings/`. The parent memory skill
owns when and how records are read, created, updated, moved, or deleted.

## Principles

### Preserve future reuse, not the incident story

A learning should help a future agent recognize a fact, technique, constraint, or trap. Session chronology
and incidental details do not belong in the durable record.

### Organize first by reuse domain, then by learning kind

The most specific stable dependency predicts where a future agent will look. Within that domain, the learning
kind separates reusable knowledge from a repeatable failure pattern.

### Treat repeatable traps as learning

A corrected mistake is durable when its failure pattern can recur. It belongs with related knowledge in
learning memory rather than in a separate project-level mistake system.

## Rules

- **MUST keep learning memory selective by recording only important learnings.** Record a tip only when it
  can meaningfully improve a future decision, action, verification, or understanding. Record a mistake only
  when its pattern can recur and its correction can prevent meaningful failure, risk, or rework. Exclude
  trivia, routine conventions, minor preferences, and negligible errors.
- **MUST keep each learning as one canonical second-level entry.** Place it in `tips.md` or `mistakes.md`
  under its most specific stable domain. Update or merge an existing entry instead of duplicating the
  learning across domains, files, or headings.
- **MUST shape each tip with `Context` and `Tip`.** Add `Application` when the future use is not already clear
  from the tip.
- **MUST shape each mistake with `Context`, `Mistake`, and `Correction`.** Keep one-off incidents, command
  failures, and session stories out of `mistakes.md`.

## Preferences

### Structure

Prefer a domain-first tree with fixed learning files beneath each domain. Add another domain only when the
learning depends on a stable subject that future work will search directly. Create only the files that the
domain needs.

```text
learnings/
├── design/
│   ├── tips.md
│   └── mistakes.md
├── work/
│   ├── tips.md
│   └── mistakes.md
├── memory/
│   ├── tips.md
│   └── mistakes.md
├── dev/
│   ├── tips.md
│   └── mistakes.md
└── {domain}/
    ├── tips.md
    └── mistakes.md
```

### Path descriptions

| Path | Description | Example |
|---|---|---|
| `learnings/design/` | Contains knowledge about shaping architecture, features, interfaces, experiences, and other design outcomes. | Choosing one canonical home for a cross-cutting design |
| `learnings/work/` | Contains knowledge about planning, collaboration, execution, study, evaluation, release, and maintenance. | Keeping evaluation evidence independent from implementation |
| `learnings/memory/` | Contains knowledge about capturing, organizing, retrieving, and maintaining durable project memory. | Updating an index when a memory file moves |
| `learnings/dev/` | Contains technology-independent implementation, testing, debugging, security, performance, and tooling knowledge. | Isolating side effects behind a narrow interface |
| `learnings/{domain}/` | Contains knowledge that depends on another stable subject such as Python, TypeScript, web, desktop, CLI, Git, Codex, or evaluation. | `learnings/python/` for Python-specific behavior |
| `learnings/{domain}/tips.md` | Contains several reusable facts, techniques, constraints, patterns, and counter-cases for one domain. | `learnings/python/tips.md` |
| `learnings/{domain}/mistakes.md` | Contains several repeatable failure patterns with their causes, recognition signals, and corrected approaches for one domain. | `learnings/memory/mistakes.md` |

Use the most specific applicable domain. Choose `dev/` when implementation knowledge does not depend on a
language, platform, or other stable technology. Add another domain when one reusable record needs it. Do not
add catch-all domains such as `general/`, `misc/`, or `other/`.

### Tip shape

```markdown
# Python Tips

## Keep resource ownership visible

**Context:** Code that opens files, connections, locks, or other managed resources.

**Tip:** Keep acquisition and release in one visible scope. Prefer a context manager when the resource has
a bounded lifetime.

**Application:** Use the same pattern for files, database transactions, temporary directories, and locks.
```

Use one second-level heading for each tip. Omit `Application` only when the tip already makes its future use
clear.

### Mistake shape

```markdown
# Memory Mistakes

## Duplicating one learning across domains

**Context:** A learning appears relevant to several domains.

**Mistake:** Copying the same learning into every related domain creates independently changing versions.

**Correction:** Keep the learning in its most specific stable domain and link to it from related memory.
```

Use one second-level heading for each repeatable failure pattern.

### Naming convention

```text
learnings/{domain}/tips.md
learnings/{domain}/mistakes.md
```

```text
learnings/design/tips.md
learnings/work/mistakes.md
learnings/python/tips.md
learnings/web/mistakes.md
```

Do not create dated, incident-specific, error-specific, or subject-specific learning filenames.

### Behavior

- Select the most specific stable domain.
- Choose `tips.md` for reusable knowledge or `mistakes.md` for a repeatable failure pattern.
- Search the selected file for an existing matching or overlapping entry.
- Update or merge the existing entry when it expresses the same learning.
- Add a new second-level entry when the learning is distinct.
- Remove an entry when it is obsolete, contradicted, or no longer useful.

## References
