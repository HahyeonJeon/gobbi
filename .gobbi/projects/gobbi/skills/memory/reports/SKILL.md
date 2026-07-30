---
name: reports
description: MUST load after the memory operation identifies content as report memory. Reports is a preference skill for what completed report memory contains and how it is structured.
allowed-tools: Read, Grep, Glob
skill-type: preference
user-invocable: false
---

# Report Memory

This internal category skill guides report-memory judgment after the parent memory operation identifies
content as report memory. It owns the content and structure of `memory/reports/`. The parent memory skill owns
when and how reports are read, created, updated, moved, or deleted.

Report memory preserves one final, durable account of completed work. The work that produced the report
chooses its category. The report remains a point-in-time evidence record while other memory categories own
current intent, reusable knowledge, source materials, deferred actions, and compact session progression.

## Principles

### Preserve completed work, not work in progress

A durable report explains the result of finished work. Scratch notes, command logs, session narration, and
routine progress are operational context rather than report memory.

### Classify by the work that produced the report

The originating work gives a mixed report one stable home. Development and research work remain notes, review
work remains review, and dedicated analysis remains analysis even when their contents use similar evidence
or techniques.

### Keep each report independently understandable

A future reader should understand the report's subject, evidence, result, and limits without reconstructing
the work session. The report may use the shape that best explains its completed work.

### Separate the evidence record from derived memory

A report preserves what completed work found or produced. Materials preserve its raw inputs, while design,
learnings, and backlogs preserve the current conclusions or actions derived from it. History preserves the
compact session-level progression.

## Rules

- **MUST keep each report in one canonical home.** Classify it by the work that produced it and link from
  related memory instead of copying it across report categories.
- **MUST keep each dated report about one completed work event.** Correct factual errors, broken links, and
  unclear wording in that report. Record later work in a new dated report rather than rewriting the earlier
  report as the later event.
- **MUST NOT require one report frontmatter, lifecycle-status, field, or heading schema.** Let each report use
  the smallest independently readable shape that fits its completed work.

## Preferences

### Structure

Prefer direct files under the three report categories. Add deeper nesting only when a category becomes
materially difficult to navigate and the new grouping gives future readers a stable retrieval path.

```text
reports/
├── README.md
├── note/
│   └── YYYY-MM-DD-{descriptive-title}.md
├── review/
│   └── YYYY-MM-DD-{descriptive-title}.md
└── analysis/
    └── YYYY-MM-DD-{descriptive-title}.md
```

### Path descriptions

| Path | Description | Example |
|---|---|---|
| `reports/README.md` | Provides link-only navigation grouped by report category, with reports ordered newest first within each category. | |
| `reports/note/` | Contains final records of completed development, research, design, migration, release, investigation, and other general work. Useful content may include the completed work, durable result, supporting evidence, verification, and remaining limits. It excludes work-in-progress notes, scratchpads, raw logs, session narration, and routine status updates. | A development note describing a completed memory-taxonomy revision |
| `reports/review/` | Contains final records of code, documentation, project, design, security, dependency, license, process, retrospective, audit, evaluation, and other review work. Useful content may include the reviewed subject, scope, criteria, evidence, findings, and conclusion or verdict. | A code review of an authentication boundary |
| `reports/analysis/` | Contains final records of quantitative or qualitative analysis, statistics, benchmarks, comparisons, trends, impacts, root causes, incidents, post-mortems, and other explanatory work. Useful content may include the question, inputs, method, findings, interpretation, uncertainty, and conclusion. | A request-latency distribution analysis |

### Naming convention

```text
reports/{category}/YYYY-MM-DD-{descriptive-kebab-case-title}.md
```

```text
reports/note/2026-07-30-memory-report-taxonomy.md
reports/review/2026-07-30-authentication-boundary-code-review.md
reports/analysis/2026-07-30-request-latency-distribution.md
```

Use the work-completion date and a short title that names the subject or outcome. Add subject detail when
two reports complete on the same date instead of adding sequence numbers.

## References
